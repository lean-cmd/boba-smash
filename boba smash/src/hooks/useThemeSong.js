import { useEffect, useRef, useState } from 'react'

const LOOP_START = 7.25
const LOOP_END = 18.5
const STEP_DURATION = 60 / 110 / 2
const LEAD_PATTERN = [0, 4, 7, 9, 7, 4, 2, null, 0, 4, 7, 11, 9, 7, 4, 2]
const BASS_PATTERN = [-12, null, -5, null, -7, null, -5, null]
const ROOT_FREQUENCY = 261.63

function frequencyFromSemitone(semitoneOffset) {
  return ROOT_FREQUENCY * (2 ** (semitoneOffset / 12))
}

function playPulse(ctx, destination, when, frequency, duration, gainValue, type = 'square') {
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()

  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, when)

  gain.gain.setValueAtTime(0.0001, when)
  gain.gain.linearRampToValueAtTime(gainValue, when + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, when + duration)

  oscillator.connect(gain)
  gain.connect(destination)

  oscillator.start(when)
  oscillator.stop(when + duration + 0.02)
}

export function useThemeSong() {
  const contextRef = useRef(null)
  const masterGainRef = useRef(null)
  const musicGainRef = useRef(null)
  const chipGainRef = useRef(null)
  const bufferRef = useRef(null)
  const sourceRef = useRef(null)
  const schedulerRef = useRef(null)
  const nextStepRef = useRef(0)
  const stepIndexRef = useRef(0)

  const [audioReady, setAudioReady] = useState(false)
  const [musicEnabled, setMusicEnabled] = useState(false)

  function scheduleChipStep(stepIndex, when) {
    const ctx = contextRef.current
    const chipGain = chipGainRef.current

    if (!ctx || !chipGain) {
      return
    }

    const lead = LEAD_PATTERN[stepIndex % LEAD_PATTERN.length]
    if (lead !== null) {
      playPulse(ctx, chipGain, when, frequencyFromSemitone(lead), STEP_DURATION * 0.92, 0.038)
    }

    const bass = BASS_PATTERN[stepIndex % BASS_PATTERN.length]
    if (bass !== null) {
      playPulse(ctx, chipGain, when, frequencyFromSemitone(bass), STEP_DURATION * 0.75, 0.026, 'triangle')
    }
  }

  async function ensureAudioGraph() {
    if (!contextRef.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      const ctx = new AudioContextClass()
      const masterGain = ctx.createGain()
      const musicGain = ctx.createGain()
      const chipGain = ctx.createGain()

      masterGain.gain.value = 0.72
      musicGain.gain.value = 0.34
      chipGain.gain.value = 0.5

      musicGain.connect(masterGain)
      chipGain.connect(masterGain)
      masterGain.connect(ctx.destination)

      contextRef.current = ctx
      masterGainRef.current = masterGain
      musicGainRef.current = musicGain
      chipGainRef.current = chipGain
    }

    if (!bufferRef.current) {
      const response = await fetch('/audio/island-oasis-grooves.mp3')
      const arrayBuffer = await response.arrayBuffer()
      const ctx = contextRef.current
      bufferRef.current = await ctx.decodeAudioData(arrayBuffer.slice(0))
      setAudioReady(true)
    }
  }

  function stopPlayback() {
    if (schedulerRef.current) {
      window.clearInterval(schedulerRef.current)
      schedulerRef.current = null
    }

    if (sourceRef.current) {
      try {
        sourceRef.current.stop()
      } catch {
        // BufferSourceNode only plays once; ignore stop races during teardown.
      }
      sourceRef.current.disconnect()
      sourceRef.current = null
    }

    setMusicEnabled(false)
  }

  function startChipLayer() {
    const ctx = contextRef.current

    if (!ctx || schedulerRef.current) {
      return
    }

    nextStepRef.current = ctx.currentTime + 0.1
    stepIndexRef.current = 0

    schedulerRef.current = window.setInterval(() => {
      while (nextStepRef.current < ctx.currentTime + 0.18) {
        scheduleChipStep(stepIndexRef.current, nextStepRef.current)
        nextStepRef.current += STEP_DURATION
        stepIndexRef.current += 1
      }
    }, 60)
  }

  async function startPlayback() {
    await ensureAudioGraph()

    const ctx = contextRef.current
    const musicGain = musicGainRef.current
    const buffer = bufferRef.current

    if (!ctx || !musicGain || !buffer) {
      return
    }

    if (ctx.state === 'suspended') {
      await ctx.resume()
    }

    if (sourceRef.current) {
      setMusicEnabled(true)
      return
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true
    source.loopStart = LOOP_START
    source.loopEnd = LOOP_END
    source.connect(musicGain)
    source.start(ctx.currentTime + 0.03, LOOP_START)
    source.onended = () => {
      if (sourceRef.current === source) {
        sourceRef.current = null
      }
    }

    sourceRef.current = source
    startChipLayer()
    setMusicEnabled(true)
  }

  async function togglePlayback() {
    if (sourceRef.current) {
      stopPlayback()
      return
    }

    await startPlayback()
  }

  useEffect(() => {
    return () => {
      stopPlayback()

      if (contextRef.current) {
        contextRef.current.close()
        contextRef.current = null
      }
    }
  }, [])

  return {
    audioReady,
    musicEnabled,
    startPlayback,
    stopPlayback,
    togglePlayback,
  }
}
