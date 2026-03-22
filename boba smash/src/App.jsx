import { useEffect, useRef, useState } from 'react'
import { AccessoryPreview, BobaSmashLogo, PixelCapybara, PlaneSprite } from './components/PixelCapybara'
import { CHARACTERS, getCharacterById } from './data/characters'
import { useThemeSong } from './hooks/useThemeSong'

const SCREENS = {
  title: 'title',
  loading: 'loading',
  intro: 'intro',
  avatar: 'avatar',
  accessories: 'accessories',
  airport: 'airport',
  reunion: 'reunion',
  plane: 'plane',
  arrival: 'arrival',
  tutorial: 'tutorial',
  gameplay: 'gameplay',
  firstReward: 'firstReward',
  houseSelect: 'houseSelect',
  home: 'home',
  houseDecor: 'houseDecor',
  gameOverSummary: 'gameOverSummary',
  shop: 'shop',
  cafe: 'cafe',
  gallery: 'gallery',
}

const STORAGE_KEY = 'boba-smash-story'
const ACCESSORIES = [
  { id: 'boba', label: '🧋', name: 'Boba Tea' },
  { id: 'coconut', label: '🥥', name: 'Coconut' },
  { id: 'bow', label: '🎀', name: 'Bow' },
  { id: 'flower-crown', label: '🌸', name: 'Flower Crown' },
  { id: 'sunglasses', label: '🕶️', name: 'Sunglasses' },
  { id: 'hat', label: '🎩', name: 'Tiny Hat' },
]
const FRUITS = ['🍓', '🫐', '🥭', '🍑', '🥝']
const UPGRADE_DEFS = [
  { id: 'patience', name: 'Faster Hands', description: '+0.5s customer patience per level', baseCost: 50 },
  { id: 'queue', name: 'Bigger Kitchen', description: '+1 queue capacity per level', baseCost: 80 },
  { id: 'decor', name: 'Cute Decor', description: 'Adds brighter cafe decorations', baseCost: 30 },
  { id: 'tips', name: 'Better Tips', description: '+5 coins per customer', baseCost: 100 },
]
const CAFE_DECOR_ITEMS = [
  { id: 'plants', name: 'Palm Plants', description: 'Leafy pots frame the doorway.', cost: 45 },
  { id: 'teddy', name: 'Bunny Stuffy', description: 'A plush bunny host sits by the door.', cost: 60 },
  { id: 'rainbow', name: 'Rainbow', description: 'A pastel rainbow arches above the cafe.', cost: 75 },
  { id: 'bunting', name: 'Star Bunting', description: 'Cute party flags brighten the roofline.', cost: 55 },
  { id: 'bench', name: 'Cozy Bench', description: 'A little seat for waiting boba fans.', cost: 65 },
  { id: 'poster', name: 'Cafe Poster', description: 'A sweet boba poster decorates the wall.', cost: 50 },
  { id: 'sign', name: 'Upgraded Sign', description: 'Adds sparkles and candy colors to the main sign.', cost: 85 },
]
const FIRST_HOME_BONUS = 500
const HOUSE_OPTIONS = [
  { id: 'shore', name: 'Shore Hut', subtitle: 'Cozy beach starter', cost: 260, roof: '#ffb782', wall: '#fff0cf', accent: '#8fd1ff', door: '#a96c3e' },
  { id: 'mint', name: 'Mint Cottage', subtitle: 'Palm breeze cottage', cost: 360, roof: '#98ecb8', wall: '#fff6dd', accent: '#ffc27d', door: '#92613f' },
  { id: 'sunset', name: 'Sunset Villa', subtitle: 'Fancy island dream home', cost: 460, roof: '#ff98bb', wall: '#ffe4cc', accent: '#ffe16d', door: '#b6764a' },
]
const HOUSE_DECOR_ITEMS = [
  { id: 'plant', name: 'House Plant', description: 'A leafy pot by the porch.', cost: 45 },
  { id: 'bunny', name: 'Bunny Stuffy', description: 'A plush bunny for the living room.', cost: 65 },
  { id: 'poster', name: 'Boba Poster', description: 'A sweet wall poster over the window.', cost: 50 },
  { id: 'lamp', name: 'Star Lamp', description: 'A warm glowing night lamp.', cost: 70 },
  { id: 'rug', name: 'Shell Rug', description: 'A cute shell-shaped rug by the door.', cost: 55 },
  { id: 'shelf', name: 'Cup Shelf', description: 'A tiny shelf for cups and plants.', cost: 60 },
]
const DEFAULT_CAFE_DECOR = {
  plants: false,
  teddy: false,
  rainbow: false,
  bunting: false,
  bench: false,
  poster: false,
  sign: false,
}
const DEFAULT_HOUSE_DECOR = {
  plant: false,
  bunny: false,
  poster: false,
  lamp: false,
  rug: false,
  shelf: false,
}

const BOB = { id: 'bob', name: 'Bob', previewAccessory: null }
const AIRPORT_CLERK = { ...getCharacterById('mochi'), name: 'Airport Capybara' }
const BOSS = { ...getCharacterById('chino'), name: 'Boss' }
const GALLERY_CAST = [...CHARACTERS, BOB]
const ACCESSORY_PERMUTATIONS = [{ id: null, label: 'OG', name: 'Original Look' }, ...ACCESSORIES]

function loadCafeDecor(savedDecor) {
  return {
    plants: savedDecor?.plants === true,
    teddy: savedDecor?.teddy === true,
    rainbow: savedDecor?.rainbow === true,
    bunting: savedDecor?.bunting === true,
    bench: savedDecor?.bench === true,
    poster: savedDecor?.poster === true,
    sign: savedDecor?.sign === true,
  }
}

function loadHouseDecor(savedDecor) {
  return {
    plant: savedDecor?.plant === true,
    bunny: savedDecor?.bunny === true,
    poster: savedDecor?.poster === true,
    lamp: savedDecor?.lamp === true,
    rug: savedDecor?.rug === true,
    shelf: savedDecor?.shelf === true,
  }
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    return {
      selectedId: typeof saved.selectedId === 'string' ? saved.selectedId : 'mochi',
      accessoryId: typeof saved.accessoryId === 'string' ? saved.accessoryId : 'boba',
      playerName: typeof saved.playerName === 'string' ? saved.playerName : '',
      coins: Number.isFinite(saved.coins) ? saved.coins : 0,
      upgrades: {
        patience: Number.isFinite(saved.upgrades?.patience) ? saved.upgrades.patience : 0,
        queue: Number.isFinite(saved.upgrades?.queue) ? saved.upgrades.queue : 0,
        decor: Number.isFinite(saved.upgrades?.decor) ? saved.upgrades.decor : 0,
        tips: Number.isFinite(saved.upgrades?.tips) ? saved.upgrades.tips : 0,
      },
      homeUnlocked: saved.homeUnlocked === true,
      houseId: typeof saved.houseId === 'string' ? saved.houseId : null,
      cafeDecor: loadCafeDecor(saved.cafeDecor),
      houseDecor: loadHouseDecor(saved.houseDecor),
      bestCustomers: Number.isFinite(saved.bestCustomers) ? saved.bestCustomers : 0,
    }
  } catch {
    return {
      selectedId: 'mochi',
      accessoryId: 'boba',
      playerName: '',
      coins: 0,
      upgrades: { patience: 0, queue: 0, decor: 0, tips: 0 },
      homeUnlocked: false,
      houseId: null,
      cafeDecor: { ...DEFAULT_CAFE_DECOR },
      houseDecor: { ...DEFAULT_HOUSE_DECOR },
      bestCustomers: 0,
    }
  }
}

function getHouseById(houseId) {
  return HOUSE_OPTIONS.find((house) => house.id === houseId) ?? HOUSE_OPTIONS[0]
}

function getUpgradeCost(upgradeId, level) {
  const definition = UPGRADE_DEFS.find((upgrade) => upgrade.id === upgradeId)
  return Math.round(definition.baseCost * (1 + level * 0.8))
}

function moodFromPatience(patience, maxPatience) {
  const ratio = patience / maxPatience
  if (ratio > 0.8) return '😊'
  if (ratio > 0.5) return '😐'
  if (ratio > 0.25) return '😠'
  return '🤬'
}

function getFruitDelay(servedCustomers) {
  const table = [2000, 1800, 1500, 1200, 1000, 850, 700, 500]
  const tier = Math.min(table.length - 1, Math.floor(servedCustomers / 5))
  return table[tier]
}

function createFruit(id, goldenChance = 0.05) {
  const angle = Math.random() * Math.PI * 2
  const speed = 0.15 + Math.random() * 0.25
  const isGolden = Math.random() < goldenChance
  return {
    id,
    kind: isGolden ? '⭐' : FRUITS[Math.floor(Math.random() * FRUITS.length)],
    golden: isGolden,
    x: 10 + Math.random() * 80,
    y: 10 + Math.random() * 80,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
  }
}

function moveFruits(fruits, speedMult = 1) {
  return fruits.map((f) => {
    let { x, y, vx, vy } = f
    x += vx * speedMult
    y += vy * speedMult
    if (x < 5 || x > 95) vx = -vx
    if (y < 5 || y > 95) vy = -vy
    x = Math.max(5, Math.min(95, x))
    y = Math.max(5, Math.min(95, y))
    return { ...f, x, y, vx, vy }
  })
}

function createCustomer(id, patienceBonus, servedCount) {
  const maxPatience = 8 + (patienceBonus * 0.5)
  const specialOrder = createSpecialOrder(servedCount ?? 0)
  return {
    id,
    name: CUSTOMER_NAMES[(id - 1) % CUSTOMER_NAMES.length],
    patience: maxPatience,
    maxPatience,
    specialOrder,
  }
}

const SFX = {
  _ctx: null,
  _getCtx() {
    if (!this._ctx) this._ctx = new (window.AudioContext || window.webkitAudioContext)()
    return this._ctx
  },
  _beep(freq, duration, type = 'square', volume = 0.12) {
    try {
      const ctx = this._getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.value = freq
      gain.gain.value = volume
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + duration)
    } catch { /* audio not available */ }
  },
  tap() { this._beep(880, 0.06, 'square', 0.08) },
  combo() { this._beep(1200, 0.1, 'sine', 0.1) },
  serve() { this._beep(660, 0.15, 'sine', 0.15); setTimeout(() => this._beep(880, 0.12, 'sine', 0.12), 100) },
  drink() { this._beep(523, 0.08, 'triangle', 0.1); setTimeout(() => this._beep(659, 0.08, 'triangle', 0.1), 60) },
  loseLife() { this._beep(220, 0.25, 'sawtooth', 0.1) },
  gameOver() { this._beep(330, 0.2, 'square', 0.1); setTimeout(() => this._beep(220, 0.3, 'square', 0.1), 200) },
  powerUp() { this._beep(523, 0.08, 'sine', 0.12); setTimeout(() => this._beep(784, 0.08, 'sine', 0.12), 80); setTimeout(() => this._beep(1047, 0.12, 'sine', 0.15), 160) },
}

const CHARACTER_ABILITIES = {
  mochi: { id: 'patience', label: '+1s patience', apply: (base) => ({ ...base, patienceBonus: base.patienceBonus + 1 }) },
  boba: { id: 'coins', label: '+3 coins per serve', apply: (base) => ({ ...base, tipBonus: base.tipBonus + 3 }) },
  pixel: { id: 'speed', label: 'Fruits move slower', apply: (base) => ({ ...base, fruitSpeedMult: 0.7 }) },
  mango: { id: 'combo', label: 'Combo lasts longer', apply: (base) => ({ ...base, comboTimerMax: 18 }) },
  chino: { id: 'queue', label: '+1 queue slot', apply: (base) => ({ ...base, queueBonus: base.queueBonus + 1 }) },
  star: { id: 'luck', label: 'More golden fruits', apply: (base) => ({ ...base, goldenChance: 0.15 }) },
}

const ACHIEVEMENTS = [
  { id: 'first_serve', name: 'First Boba!', icon: '🧋', description: 'Serve your first customer', check: (s) => s.served >= 1 },
  { id: 'combo_5', name: 'Combo Starter', icon: '🔥', description: 'Reach a 5x combo', check: (s) => s.maxCombo >= 5 },
  { id: 'combo_10', name: 'Combo King', icon: '👑', description: 'Reach a 10x combo', check: (s) => s.maxCombo >= 10 },
  { id: 'combo_20', name: 'Combo Legend', icon: '🌟', description: 'Reach a 20x combo', check: (s) => s.maxCombo >= 20 },
  { id: 'wave_3', name: 'Wave Rider', icon: '🌊', description: 'Reach wave 3', check: (s) => s.wave >= 3 },
  { id: 'wave_5', name: 'Wave Master', icon: '🏄', description: 'Reach wave 5', check: (s) => s.wave >= 5 },
  { id: 'golden_5', name: 'Gold Rush', icon: '⭐', description: 'Catch 5 golden fruits in one run', check: (s) => s.goldenCaught >= 5 },
  { id: 'serve_10', name: 'Busy Barista', icon: '☕', description: 'Serve 10 customers in one run', check: (s) => s.served >= 10 },
  { id: 'serve_25', name: 'Cafe Hero', icon: '🦸', description: 'Serve 25 customers in one run', check: (s) => s.served >= 25 },
  { id: 'perfect_wave', name: 'Perfect Wave', icon: '✨', description: 'Complete a wave with no life loss', check: (s) => s.perfectWaves >= 1 },
  { id: 'coins_100', name: 'Coin Collector', icon: '💰', description: 'Earn 100 coins in one run', check: (s) => s.coinsEarned >= 100 },
  { id: 'coins_500', name: 'Rich Capy', icon: '🤑', description: 'Earn 500 coins in one run', check: (s) => s.coinsEarned >= 500 },
]

const SPECIAL_ORDERS = [
  { id: 'berry_blast', name: 'Berry Blast', fruits: ['🍓', '🫐'], icon: '🍇', bonus: 8, description: 'Strawberry + Blueberry' },
  { id: 'tropical_mix', name: 'Tropical Mix', fruits: ['🥭', '🍑'], icon: '🌴', bonus: 8, description: 'Mango + Peach' },
  { id: 'island_special', name: 'Island Special', fruits: ['🥝', '🥭'], icon: '🏝️', bonus: 10, description: 'Kiwi + Mango' },
  { id: 'sunset_sip', name: 'Sunset Sip', fruits: ['🍑', '🍓'], icon: '🌅', bonus: 8, description: 'Peach + Strawberry' },
]

const CUSTOMER_NAMES = ['Luna', 'Bubbles', 'Cocoa', 'Pudding', 'Mocha', 'Taro', 'Matcha', 'Latte', 'Chai', 'Cookie', 'Waffle', 'Sesame', 'Melon', 'Honey']

function createSpecialOrder(servedCount) {
  if (servedCount < 3) return null
  if (Math.random() > 0.3) return null
  return SPECIAL_ORDERS[Math.floor(Math.random() * SPECIAL_ORDERS.length)]
}

function ScreenFade({ children }) {
  return <div className="screen-fade">{children}</div>
}

function PixelButton({ children, onClick, tone = 'gold', disabled = false, type = 'button' }) {
  return (
    <button
      className={`pixel-button tone-${tone}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  )
}

function Logo({ subtitle, compact = false }) {
  return (
    <div className={`logo-stack ${compact ? 'compact' : ''}`}>
      <BobaSmashLogo compact={compact} />
      <div className="logo-subtitle">{subtitle}</div>
    </div>
  )
}

function MusicToggle({ musicEnabled, audioReady, onToggle }) {
  return (
    <button className="music-toggle" onClick={onToggle} type="button">
      <span className={`music-light ${musicEnabled ? 'live' : ''}`} />
      <span>{musicEnabled ? 'Music On' : audioReady ? 'Music Off' : 'Load Music'}</span>
    </button>
  )
}

function PixelBobaCup() {
  return (
    <svg className="title-cup" viewBox="0 0 88 104" role="img" aria-label="Boba Smash title cup" shapeRendering="crispEdges">
      <rect x="26" y="4" width="6" height="22" fill="#7ee57b" />
      <rect x="31" y="4" width="4" height="22" fill="#4ecf70" />
      <rect x="18" y="18" width="52" height="10" rx="2" fill="#fef5f5" stroke="#704024" strokeWidth="4" />
      <path d="M20 28 h48 l-6 56 h-36 z" fill="#ffc5d7" stroke="#704024" strokeWidth="4" />
      <path d="M24 38 h40 l-4 34 h-32 z" fill="#ef9fba" opacity="0.56" />
      <circle cx="32" cy="70" r="4" fill="#5b2a1a" />
      <circle cx="40" cy="76" r="4" fill="#5b2a1a" />
      <circle cx="49" cy="70" r="4" fill="#5b2a1a" />
      <circle cx="56" cy="78" r="4" fill="#5b2a1a" />
      <rect x="31" y="44" width="8" height="8" fill="#ffffff" />
      <rect x="36" y="47" width="1" height="1" fill="#704024" />
      <rect x="47" y="47" width="7" height="2" fill="#704024" />
      <path d="M40 56 h8 v2 h-2 v2 h-4 v-2 h-2 z" fill="#704024" />
      <foreignObject x="17" y="30" width="54" height="34">
        <div className="cup-title">Boba Smash</div>
      </foreignObject>
    </svg>
  )
}

function ArrowPrompt({ text }) {
  return (
    <div className="arrow-prompt">
      <div className="arrow-bounce">▼</div>
      <span>{text}</span>
    </div>
  )
}

function DialogueBox({ speaker, text, onAdvance, hint = 'tap to continue' }) {
  return (
    <button className="dialogue-box" onClick={onAdvance} type="button">
      <div className="dialogue-speaker">{speaker}</div>
      <div className="dialogue-text">{text}</div>
      <div className="dialogue-hint">{hint}</div>
    </button>
  )
}

function IslandBackground({ children, variant = 'day' }) {
  return (
    <div className={`story-stage island-stage variant-${variant}`}>
      <div className="pixel-sun" />
      <div className="pixel-cloud cloud-a" />
      <div className="pixel-cloud cloud-b" />
      <div className="pixel-palm palm-a" />
      <div className="pixel-palm palm-b" />
      <div className="pixel-hut">
        <span>BOBA</span>
      </div>
      <div className="pixel-shore" />
      {children}
    </div>
  )
}

function CharacterCard({ character, selected, onSelect }) {
  return (
    <button className={`character-card ${selected ? 'active' : ''}`} onClick={() => onSelect(character.id)} type="button">
      <div className="card-art">
        <PixelCapybara character={character} variant="select-card" />
      </div>
      <div className="card-info">
        <div className="card-name">{character.name}</div>
        <div className="card-title">{character.title}</div>
      </div>
    </button>
  )
}

function AccessoryCard({ accessory, selected, onSelect }) {
  return (
    <button className={`accessory-card ${selected ? 'active' : ''}`} onClick={() => onSelect(accessory.id)} type="button">
      <AccessoryPreview accessoryId={accessory.id} />
      <span className="accessory-name">{accessory.name}</span>
    </button>
  )
}

function CafeDecorSet({ cafeDecor, decorLevel = 0 }) {
  const glowLevel = Math.min(decorLevel, 3)

  return (
    <>
      <div className="cafe-front" aria-hidden="true">
        <div className="cafe-awning" />
        <div className="cafe-window window-left" />
        <div className="cafe-window window-right" />
        <div className="cafe-door" />
        <div className="cafe-step" />
      </div>
      {glowLevel > 0 ? <div className={`cafe-glow glow-level-${glowLevel}`} aria-hidden="true" /> : null}
      {cafeDecor.rainbow ? (
        <div className="cafe-rainbow" aria-hidden="true">
          <span className="rainbow-band band-a" />
          <span className="rainbow-band band-b" />
          <span className="rainbow-band band-c" />
          <span className="rainbow-band band-d" />
          <span className="rainbow-cloud cloud-left" />
          <span className="rainbow-cloud cloud-right" />
        </div>
      ) : null}
      {cafeDecor.bunting ? (
        <div className="cafe-bunting" aria-hidden="true">
          {Array.from({ length: 7 }, (_, index) => (
            <span key={index} className={`bunting-flag bunting-${index % 3}`} />
          ))}
        </div>
      ) : null}
      {cafeDecor.plants ? (
        <>
          <div className="cafe-plant plant-left" aria-hidden="true">
            <span className="plant-pot" />
            <span className="plant-leaf leaf-a" />
            <span className="plant-leaf leaf-b" />
            <span className="plant-leaf leaf-c" />
          </div>
          <div className="cafe-plant plant-right" aria-hidden="true">
            <span className="plant-pot" />
            <span className="plant-leaf leaf-a" />
            <span className="plant-leaf leaf-b" />
            <span className="plant-leaf leaf-c" />
          </div>
        </>
      ) : null}
      {cafeDecor.bench ? (
        <div className="cafe-bench" aria-hidden="true">
          <span className="bench-back" />
          <span className="bench-seat" />
          <span className="bench-leg leg-left" />
          <span className="bench-leg leg-right" />
          <span className="bench-cushion cushion-left" />
          <span className="bench-cushion cushion-right" />
        </div>
      ) : null}
      {cafeDecor.teddy ? (
        <div className="cafe-bunny" aria-hidden="true">
          <span className="bunny-ear ear-left" />
          <span className="bunny-ear ear-right" />
          <span className="bunny-body" />
          <span className="bunny-face" />
          <span className="bunny-nose" />
          <span className="bunny-paw paw-left" />
          <span className="bunny-paw paw-right" />
        </div>
      ) : null}
      {cafeDecor.poster ? (
        <div className="cafe-poster" aria-hidden="true">
          <span className="poster-title">BOBA!</span>
          <span className="poster-cup" />
          <span className="poster-heart heart-left" />
          <span className="poster-heart heart-right" />
        </div>
      ) : null}
    </>
  )
}

function CafeScene({
  playerCharacter,
  playerAccessory,
  bobAccessory,
  playerMotion = 'walk',
  bobMotion = 'walk',
  playerJump = false,
  bobJump = false,
  cafeDecor,
  decorLevel,
}) {
  return (
    <>
      <div className={`cafe-sign ${cafeDecor.sign ? 'upgraded' : ''}`}>
        BOBA PARADISE
        {cafeDecor.sign ? <span className="sign-sparkles" aria-hidden="true">★ ✦ ★</span> : null}
      </div>
      <div className="string-lights">
        {Array.from({ length: 8 }, (_, indexValue) => (
          <span key={indexValue} />
        ))}
      </div>
      <CafeDecorSet cafeDecor={cafeDecor} decorLevel={decorLevel} />
      <div className={`actor cafe-player ${playerJump ? 'jump' : ''}`}>
        <PixelCapybara character={playerCharacter} accessory={playerAccessory} motion={playerMotion} variant="scene" />
      </div>
      <div className={`actor cafe-bob ${bobJump ? 'jump' : ''}`}>
        <PixelCapybara character={BOB} accessory={bobAccessory} motion={bobMotion} variant="scene" />
      </div>
      <div className="actor cafe-boss">
        <PixelCapybara character={BOSS} accessory="chef-hat" motion="idle" variant="scene" />
      </div>
    </>
  )
}

function CafeDecorShop({
  playerCharacter,
  coins,
  availableCoins = coins,
  runCoins = 0,
  upgrades,
  cafeDecor,
  onBuyDecor,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  compact = false,
}) {
  const unlockedCount = Object.values(cafeDecor).filter(Boolean).length

  return (
    <>
      <div className="shop-summary">
        <div className="result-chip"><span>Bank</span><strong>{coins} 🪙</strong></div>
        {runCoins > 0 ? <div className="result-chip"><span>This Run</span><strong>{runCoins} 🪙</strong></div> : null}
        {availableCoins !== coins ? <div className="result-chip"><span>Spendable</span><strong>{availableCoins} 🪙</strong></div> : null}
        <div className="result-chip"><span>Decor Level</span><strong>{upgrades.decor}</strong></div>
        <div className="result-chip"><span>Unlocked</span><strong>{unlockedCount} / {CAFE_DECOR_ITEMS.length}</strong></div>
      </div>
      <p className="cafe-upgrade-copy">
        Come back to Boba Paradise, look at the cafe, and add cute new pieces one by one.
      </p>
      <div className={`cafe-preview-panel ${compact ? 'compact' : ''}`}>
        <div className={`story-stage cafe-stage cafe-preview-stage ${compact ? 'compact' : ''}`}>
          <CafeScene
            playerCharacter={playerCharacter}
            playerAccessory="apron"
            bobAccessory="apron"
            playerMotion="idle"
            bobMotion="idle"
            cafeDecor={cafeDecor}
            decorLevel={upgrades.decor}
          />
        </div>
      </div>
      <div className="decor-shop-grid">
        {CAFE_DECOR_ITEMS.map((item) => {
          const owned = cafeDecor[item.id]

          return (
            <div key={item.id} className={`decor-card ${owned ? 'owned' : ''}`}>
              <div>
                <strong>{item.name}</strong>
                <p>{item.description}</p>
                <div className="upgrade-meta">{owned ? 'Already in your cafe' : `${item.cost} coins`}</div>
              </div>
              <PixelButton onClick={() => onBuyDecor(item.id)} disabled={owned || availableCoins < item.cost} tone={owned ? 'sand' : 'gold'}>
                {owned ? 'Owned' : `Buy ${item.cost}`}
              </PixelButton>
            </div>
          )
        })}
      </div>
      <div className="results-actions">
        {secondaryActionLabel && onSecondaryAction ? (
          <PixelButton onClick={onSecondaryAction} tone="sand">{secondaryActionLabel}</PixelButton>
        ) : null}
        <PixelButton onClick={onPrimaryAction} tone="green">{primaryActionLabel}</PixelButton>
      </div>
    </>
  )
}

function HouseSprite({ house, compact = false }) {
  return (
    <div
      className={`house-sprite ${compact ? 'compact' : ''}`}
      style={{
        '--house-roof': house.roof,
        '--house-wall': house.wall,
        '--house-accent': house.accent,
        '--house-door': house.door,
      }}
      aria-hidden="true"
    >
      <span className="house-roof" />
      <span className="house-trim" />
      <span className="house-body" />
      <span className="house-window house-window-left" />
      <span className="house-window house-window-right" />
      <span className="house-door" />
      <span className="house-step" />
      <span className="house-sign">{house.name}</span>
      <span className="house-sparkle sparkle-a" />
      <span className="house-sparkle sparkle-b" />
    </div>
  )
}

function HouseDecorSet({ houseDecor }) {
  return (
    <>
      {houseDecor.plant ? (
        <>
          <div className="home-plant plant-left" aria-hidden="true">
            <span className="plant-pot" />
            <span className="plant-leaf leaf-a" />
            <span className="plant-leaf leaf-b" />
            <span className="plant-leaf leaf-c" />
          </div>
          <div className="home-plant plant-right" aria-hidden="true">
            <span className="plant-pot" />
            <span className="plant-leaf leaf-a" />
            <span className="plant-leaf leaf-b" />
            <span className="plant-leaf leaf-c" />
          </div>
        </>
      ) : null}
      {houseDecor.bunny ? (
        <div className="home-bunny-plush" aria-hidden="true">
          <span className="bunny-ear ear-left" />
          <span className="bunny-ear ear-right" />
          <span className="bunny-body" />
          <span className="bunny-face" />
          <span className="bunny-nose" />
        </div>
      ) : null}
      {houseDecor.poster ? (
        <div className="home-poster-frame" aria-hidden="true">
          <span className="poster-title">BOBA</span>
          <span className="poster-cup" />
        </div>
      ) : null}
      {houseDecor.lamp ? (
        <div className="home-star-lamp" aria-hidden="true">
          <span className="lamp-post" />
          <span className="lamp-star" />
        </div>
      ) : null}
      {houseDecor.rug ? (
        <div className="home-shell-rug" aria-hidden="true">
          <span className="shell-band shell-a" />
          <span className="shell-band shell-b" />
          <span className="shell-band shell-c" />
        </div>
      ) : null}
      {houseDecor.shelf ? (
        <div className="home-cup-shelf" aria-hidden="true">
          <span className="shelf-board board-top" />
          <span className="shelf-board board-bottom" />
          <span className="shelf-cup cup-a" />
          <span className="shelf-cup cup-b" />
          <span className="shelf-leaf" />
        </div>
      ) : null}
    </>
  )
}

function HomeScene({
  playerCharacter,
  accessoryId,
  house,
  houseDecor,
  showBob = false,
  playerMotion = 'walk',
  bobMotion = 'idle',
}) {
  return (
    <div className="story-stage home-stage">
      <div className="home-sun" />
      <div className="pixel-cloud cloud-a" />
      <div className="pixel-cloud cloud-b" />
      <div className="pixel-palm palm-a home-palm" />
      <div className="pixel-palm palm-b home-palm" />
      <div className="home-ground" />
      <div className="home-house-wrap">
        <HouseSprite house={house} />
        <HouseDecorSet houseDecor={houseDecor} />
      </div>
      <div className="actor home-player">
        <PixelCapybara character={playerCharacter} accessory={accessoryId} motion={playerMotion} variant="scene" />
      </div>
      {showBob ? (
        <div className="actor home-bob">
          <PixelCapybara character={BOB} motion={bobMotion} variant="scene" />
        </div>
      ) : null}
    </div>
  )
}

function FirstRewardScreen({
  playerCharacter,
  accessoryId,
  coins,
  runCoins,
  onContinue,
  onToggleMusic,
  musicEnabled,
  audioReady,
}) {
  return (
    <SceneShell onToggleMusic={onToggleMusic} musicEnabled={musicEnabled} audioReady={audioReady}>
      <div className="story-grid shop-layout">
        <div className="board-frame reward-board">
          <Logo subtitle="Bob's Gift" compact />
          <div className="reward-scene">
            <IslandBackground variant="sunset">
              <div className="actor reward-player">
                <PixelCapybara character={playerCharacter} accessory={accessoryId} motion="idle" variant="scene" />
              </div>
              <div className="actor reward-bob">
                <PixelCapybara character={BOB} motion="walk" variant="scene" />
              </div>
            </IslandBackground>
          </div>
          <div className="shop-summary">
            <div className="result-chip"><span>Shift Pay</span><strong>{runCoins} 🪙</strong></div>
            <div className="result-chip"><span>Bob's Gift</span><strong>+{FIRST_HOME_BONUS} 🪙</strong></div>
            <div className="result-chip"><span>Bank</span><strong>{coins} 🪙</strong></div>
          </div>
          <p className="reward-copy">
            Bob runs up after your first shift, gives you {FIRST_HOME_BONUS} coins, and says it is time to pick your own cute island house.
          </p>
          <div className="results-actions">
            <PixelButton onClick={onContinue} tone="green">Buy House</PixelButton>
          </div>
        </div>
      </div>
    </SceneShell>
  )
}

function HouseSelectScreen({ coins, houseId, onBuyHouse, onToggleMusic, musicEnabled, audioReady }) {
  return (
    <SceneShell onToggleMusic={onToggleMusic} musicEnabled={musicEnabled} audioReady={audioReady}>
      <div className="story-grid shop-layout">
        <div className="board-frame house-select-board">
          <Logo subtitle="Choose Your House" compact />
          <div className="shop-summary">
            <div className="result-chip"><span>Bank</span><strong>{coins} 🪙</strong></div>
            <div className="result-chip"><span>Choices</span><strong>{HOUSE_OPTIONS.length}</strong></div>
          </div>
          <div className="house-grid">
            {HOUSE_OPTIONS.map((house) => {
              const selected = house.id === houseId

              return (
                <div key={house.id} className={`house-card ${selected ? 'selected' : ''}`}>
                  <div className="house-preview">
                    <HouseSprite house={house} compact />
                  </div>
                  <div>
                    <strong>{house.name}</strong>
                    <p>{house.subtitle}</p>
                    <div className="upgrade-meta">{house.cost} coins</div>
                  </div>
                  <PixelButton
                    onClick={() => onBuyHouse(house.id)}
                    disabled={selected || coins < house.cost}
                    tone={selected ? 'sand' : 'green'}
                  >
                    {selected ? 'Selected' : `Buy ${house.cost}`}
                  </PixelButton>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </SceneShell>
  )
}

function HomeScreen({
  playerCharacter,
  accessoryId,
  coins,
  house,
  houseDecor,
  onStartShift,
  onFreeRoam,
  onToggleMusic,
  musicEnabled,
  audioReady,
}) {
  const unlockedDecor = Object.values(houseDecor).filter(Boolean).length

  return (
    <SceneShell onToggleMusic={onToggleMusic} musicEnabled={musicEnabled} audioReady={audioReady}>
      <div className="story-grid shop-layout">
        <div className="board-frame home-board">
          <Logo subtitle="Your Island Home" compact />
          <div className="home-scene-panel">
            <HomeScene
              playerCharacter={playerCharacter}
              accessoryId={accessoryId}
              house={house}
              houseDecor={houseDecor}
              playerMotion="idle"
            />
          </div>
          <div className="shop-summary">
            <div className="result-chip"><span>House</span><strong>{house.name}</strong></div>
            <div className="result-chip"><span>Bank</span><strong>{coins} 🪙</strong></div>
            <div className="result-chip"><span>Decor</span><strong>{unlockedDecor} / {HOUSE_DECOR_ITEMS.length}</strong></div>
          </div>
          <p className="reward-copy">
            From here you can start another shift or go into free roam and decorate your house.
          </p>
          <div className="results-actions">
            <PixelButton onClick={onFreeRoam} tone="sand">Free Roam</PixelButton>
            <PixelButton onClick={onStartShift} tone="green">Start Shift</PixelButton>
          </div>
        </div>
      </div>
    </SceneShell>
  )
}

function HouseDecorScreen({
  playerCharacter,
  accessoryId,
  coins,
  house,
  houseDecor,
  onBuyDecor,
  onBackHome,
  onStartShift,
  onToggleMusic,
  musicEnabled,
  audioReady,
}) {
  const unlockedDecor = Object.values(houseDecor).filter(Boolean).length

  return (
    <SceneShell onToggleMusic={onToggleMusic} musicEnabled={musicEnabled} audioReady={audioReady}>
      <div className="story-grid shop-layout">
        <div className="board-frame house-decor-board">
          <Logo subtitle="Free Roam House Decor" compact />
          <div className="home-scene-panel compact">
            <HomeScene
              playerCharacter={playerCharacter}
              accessoryId={accessoryId}
              house={house}
              houseDecor={houseDecor}
              playerMotion="walk"
            />
          </div>
          <div className="shop-summary">
            <div className="result-chip"><span>House</span><strong>{house.name}</strong></div>
            <div className="result-chip"><span>Bank</span><strong>{coins} 🪙</strong></div>
            <div className="result-chip"><span>Unlocked</span><strong>{unlockedDecor} / {HOUSE_DECOR_ITEMS.length}</strong></div>
          </div>
          <div className="decor-shop-grid">
            {HOUSE_DECOR_ITEMS.map((item) => {
              const owned = houseDecor[item.id]

              return (
                <div key={item.id} className={`decor-card ${owned ? 'owned' : ''}`}>
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.description}</p>
                    <div className="upgrade-meta">{owned ? 'Already in your house' : `${item.cost} coins`}</div>
                  </div>
                  <PixelButton onClick={() => onBuyDecor(item.id)} disabled={owned || coins < item.cost} tone={owned ? 'sand' : 'gold'}>
                    {owned ? 'Owned' : `Buy ${item.cost}`}
                  </PixelButton>
                </div>
              )
            })}
          </div>
          <div className="results-actions">
            <PixelButton onClick={onBackHome} tone="sand">Back Home</PixelButton>
            <PixelButton onClick={onStartShift} tone="green">Start Shift</PixelButton>
          </div>
        </div>
      </div>
    </SceneShell>
  )
}

function SceneShell({ children, onToggleMusic, musicEnabled, audioReady }) {
  return (
    <section className="screen">
      <MusicToggle musicEnabled={musicEnabled} audioReady={audioReady} onToggle={onToggleMusic} />
      {children}
    </section>
  )
}

function TitleScreen({ onStart, onSkip, onToggleMusic, musicEnabled, audioReady }) {
  const [titleCharacters] = useState(() => {
    const firstIndex = Math.floor(Math.random() * CHARACTERS.length)
    const secondIndex = (firstIndex + 1 + Math.floor(Math.random() * (CHARACTERS.length - 1))) % CHARACTERS.length
    return [CHARACTERS[firstIndex], CHARACTERS[secondIndex]]
  })

  return (
    <SceneShell onToggleMusic={onToggleMusic} musicEnabled={musicEnabled} audioReady={audioReady}>
      <div className="story-grid title-layout">
        <div className="board-frame title-panel">
          <div className="title-capy title-capy-left">
            <PixelCapybara character={titleCharacters[0]} motion="walk" variant="scene" />
          </div>
          <PixelBobaCup />
          <div className="title-capy title-capy-right">
            <PixelCapybara character={titleCharacters[1]} facing="left" motion="walk" variant="scene" />
          </div>
          <p className="title-copy">
            A tropical pixel-art story about capybaras, boba dreams, and a very busy cafe.
          </p>
          <div className="title-actions">
            <PixelButton onClick={onStart} tone="green">Start</PixelButton>
            <PixelButton onClick={onSkip} tone="sand">Skip to Kitchen</PixelButton>
          </div>
        </div>
      </div>
    </SceneShell>
  )
}

function LoadingScreen({ onLoaded, onToggleMusic, musicEnabled, audioReady }) {
  const [progress, setProgress] = useState(8)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setProgress((current) => Math.min(100, current + 9 + Math.random() * 12))
    }, 180)

    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (progress < 100) {
      return undefined
    }

    const timeoutId = window.setTimeout(onLoaded, 450)
    return () => window.clearTimeout(timeoutId)
  }, [onLoaded, progress])

  return (
    <SceneShell onToggleMusic={onToggleMusic} musicEnabled={musicEnabled} audioReady={audioReady}>
      <div className="story-grid single-column">
        <div className="board-frame loading-panel">
          <Logo subtitle="Loading Boba Island" compact />
          <div className="loading-pearls">
            {Array.from({ length: 10 }, (_, index) => (
              <span key={index} className={`loading-pearl ${progress >= ((index + 1) * 10) ? 'filled' : ''}`} />
            ))}
          </div>
          <div className="loading-label">{Math.round(progress)}%</div>
        </div>
      </div>
    </SceneShell>
  )
}

function IntroScreen({ onContinue, onToggleMusic, musicEnabled, audioReady }) {
  const messages = [
    { speaker: 'Bob', text: 'Hi there! Welcome to this little island.' },
    { speaker: 'Bob', text: "There's a boba restaurant here called Boba Paradise... I've always dreamed of working there!" },
    { speaker: 'Bob', text: 'Oh, I should let you get settled. See you around!' },
  ]
  const [index, setIndex] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [showButton, setShowButton] = useState(false)

  function advance() {
    if (index < messages.length - 1) {
      setIndex(index + 1)
      return
    }

    setLeaving(true)
    window.setTimeout(() => setShowButton(true), 900)
  }

  return (
    <SceneShell onToggleMusic={onToggleMusic} musicEnabled={musicEnabled} audioReady={audioReady}>
      <div className="story-grid story-layout">
        <div className="board-frame stage-frame">
          <IslandBackground>
            <div className={`actor bob-actor ${leaving ? 'walk-off' : ''}`}>
              <PixelCapybara character={BOB} motion="walk" variant="scene" />
            </div>
            {!showButton ? (
              <DialogueBox
                speaker={messages[index].speaker}
                text={messages[index].text}
                onAdvance={advance}
              />
            ) : (
              <div className="story-next">
                <ArrowPrompt text="Choose your avatar" />
                <PixelButton onClick={onContinue}>Choose Avatar</PixelButton>
              </div>
            )}
          </IslandBackground>
        </div>
      </div>
    </SceneShell>
  )
}

function AvatarScreen({ selectedId, onSelect, onContinue, onToggleMusic, musicEnabled, audioReady }) {
  const continueTimeoutRef = useRef(null)

  useEffect(() => () => {
    if (continueTimeoutRef.current) {
      window.clearTimeout(continueTimeoutRef.current)
    }
  }, [])

  function handleSelect(characterId) {
    onSelect(characterId)

    if (continueTimeoutRef.current) {
      window.clearTimeout(continueTimeoutRef.current)
    }

    continueTimeoutRef.current = window.setTimeout(onContinue, 180)
  }

  return (
    <SceneShell onToggleMusic={onToggleMusic} musicEnabled={musicEnabled} audioReady={audioReady}>
      <div className="story-grid select-layout">
        <div className="board-frame select-board">
          <Logo subtitle="Character Select" compact />
          <div className="character-grid">
            {CHARACTERS.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                selected={character.id === selectedId}
                onSelect={handleSelect}
              />
            ))}
          </div>
          {selectedId && (
            <div className="selected-ability">
              <strong>{getCharacterById(selectedId).name}</strong>
              <span className="ability-tag">✨ {CHARACTER_ABILITIES[selectedId]?.label ?? 'No special ability'}</span>
            </div>
          )}
          <div className="select-footer">
            <ArrowPrompt text="Tap a capybara to continue" />
            <PixelButton onClick={onContinue}>Accessories</PixelButton>
          </div>
        </div>
      </div>
    </SceneShell>
  )
}

function AccessoriesScreen({ character, accessoryId, onSelectAccessory, onContinue, onToggleMusic, musicEnabled, audioReady }) {
  return (
    <SceneShell onToggleMusic={onToggleMusic} musicEnabled={musicEnabled} audioReady={audioReady}>
      <div className="story-grid select-layout">
        <div className="board-frame accessory-board">
          <Logo subtitle="Accessories" compact />
          <div className="accessory-preview">
            <PixelCapybara character={character} accessory={accessoryId} motion="walk" variant="scene" className="preview-capy" />
          </div>
          <div className="accessory-row">
            {ACCESSORIES.map((accessory) => (
              <AccessoryCard
                key={accessory.id}
                accessory={accessory}
                selected={accessory.id === accessoryId}
                onSelect={onSelectAccessory}
              />
            ))}
          </div>
          <PixelButton onClick={onContinue} tone="green">Done</PixelButton>
        </div>
      </div>
    </SceneShell>
  )
}

function AirportScreen({ playerCharacter, accessoryId, onContinue, onToggleMusic, musicEnabled, audioReady }) {
  const [phase, setPhase] = useState('outside')
  const [dialogueIndex, setDialogueIndex] = useState(0)
  const messages = [
    { speaker: 'You', text: 'Excuse me, what is this building?' },
    { speaker: 'Airport Capybara', text: 'This is the island airport, silly!' },
    { speaker: 'Airport Capybara', text: "Oh... aren't you the cutest little thing! Here, take these — 2 tickets to Boba Island!" },
  ]

  useEffect(() => {
    const walkId = window.setTimeout(() => setPhase('walking'), 400)
    const insideId = window.setTimeout(() => setPhase('inside'), 1700)

    return () => {
      window.clearTimeout(walkId)
      window.clearTimeout(insideId)
    }
  }, [])

  useEffect(() => {
    if (phase !== 'ticket') {
      return undefined
    }

    const timeoutId = window.setTimeout(onContinue, 1500)
    return () => window.clearTimeout(timeoutId)
  }, [onContinue, phase])

  function advanceDialogue() {
    if (dialogueIndex < messages.length - 1) {
      setDialogueIndex(dialogueIndex + 1)
      return
    }

    setPhase('ticket')
  }

  return (
    <SceneShell onToggleMusic={onToggleMusic} musicEnabled={musicEnabled} audioReady={audioReady}>
      <div className="story-grid story-layout">
        <div className="board-frame stage-frame">
          {phase === 'outside' || phase === 'walking' ? (
            <div className="story-stage airport-exterior">
              <div className="airport-building">
                <div className="airport-sign">AIRPORT</div>
                <div className="airport-door" />
              </div>
              <div className={`actor airport-player ${phase === 'walking' ? 'move-to-door' : ''}`}>
                <PixelCapybara character={playerCharacter} accessory={accessoryId} motion={phase === 'walking' ? 'walk' : 'idle'} variant="scene" />
              </div>
            </div>
          ) : (
            <div className="story-stage airport-interior">
              <div className="airport-counter">
                <PixelCapybara character={AIRPORT_CLERK} accessory="bow" className="npc-medium" motion="idle" variant="scene" />
              </div>
              <div className="airport-seats">
                {Array.from({ length: 4 }, (_, index) => (
                  <div key={index} className="seat-npc">
                    <PixelCapybara character={CHARACTERS[index]} className="npc-small" motion="idle" variant="scene" />
                  </div>
                ))}
              </div>
              <div className="actor airport-player inside-player">
                <PixelCapybara character={playerCharacter} accessory={accessoryId} motion="idle" variant="scene" />
              </div>
              {phase === 'inside' ? (
                <DialogueBox
                  speaker={messages[dialogueIndex].speaker}
                  text={messages[dialogueIndex].text}
                  onAdvance={advanceDialogue}
                />
              ) : (
                <div className="ticket-pop">🎫 🎫</div>
              )}
            </div>
          )}
        </div>
      </div>
    </SceneShell>
  )
}

function ReunionScreen({ playerCharacter, accessoryId, onContinue, onToggleMusic, musicEnabled, audioReady }) {
  const messages = [
    { speaker: 'You', text: 'Hey! I got two tickets to Boba Island. Want to come?' },
    { speaker: 'Bob', text: "Yes!! Boba Island?! That's where Boba Paradise is! My name is Bob, by the way. Let's go!" },
  ]
  const [index, setIndex] = useState(0)
  const finished = index >= messages.length

  function advance() {
    if (index < messages.length - 1) {
      setIndex(index + 1)
      return
    }

    setIndex(messages.length)
  }

  return (
    <SceneShell onToggleMusic={onToggleMusic} musicEnabled={musicEnabled} audioReady={audioReady}>
      <div className="story-grid story-layout">
        <div className="board-frame stage-frame">
          <IslandBackground variant="sunset">
            <div className="actor reunion-player">
              <PixelCapybara character={playerCharacter} accessory={accessoryId} motion="walk" variant="scene" />
            </div>
            <div className="actor reunion-bob">
              <PixelCapybara character={BOB} motion="walk" variant="scene" />
            </div>
            {!finished ? (
              <DialogueBox
                speaker={messages[index].speaker}
                text={messages[index].text}
                onAdvance={advance}
              />
            ) : (
              <div className="story-next">
                <ArrowPrompt text="Board the plane" />
                <PixelButton onClick={onContinue}>Fly to Boba Island</PixelButton>
              </div>
            )}
          </IslandBackground>
        </div>
      </div>
    </SceneShell>
  )
}

function PlaneScreen({ playerCharacter, accessoryId, playerName, onSetName, onContinue, onToggleMusic, musicEnabled, audioReady }) {
  const [phase, setPhase] = useState('input')
  const [nameDraft, setNameDraft] = useState(playerName ?? '')
  const message = "We're really doing this! Before we land... what's your name?"
  const transitionRef = useRef(null)

  useEffect(() => {
    if (phase !== 'landing') {
      return undefined
    }

    transitionRef.current = window.setTimeout(onContinue, 1700)
    return () => {
      if (transitionRef.current) {
        window.clearTimeout(transitionRef.current)
      }
    }
  }, [onContinue, phase])

  useEffect(() => () => {
    if (transitionRef.current) {
      window.clearTimeout(transitionRef.current)
    }
  }, [])

  function submitName() {
    const nextName = nameDraft.trim() || 'Capy'
    onSetName(nextName)
    setPhase('landing')
  }

  return (
    <SceneShell onToggleMusic={onToggleMusic} musicEnabled={musicEnabled} audioReady={audioReady}>
      <div className="story-grid story-layout">
        <div className="board-frame stage-frame">
          <div className="story-stage plane-stage">
            <div className={`plane-body ${phase === 'landing' ? 'landing' : 'flying'}`}>
              <PlaneSprite />
              <div className="plane-passenger plane-passenger-left">
                <PixelCapybara character={playerCharacter} accessory={accessoryId} className="plane-capy" motion="idle" variant="scene" />
              </div>
              <div className="plane-passenger plane-passenger-right">
                <PixelCapybara character={BOB} className="plane-capy" motion="idle" variant="scene" />
              </div>
            </div>
            {phase !== 'landing' ? (
              <div className="name-card">
                <div className="plane-bob-line">{message}</div>
                <div className="dialogue-speaker">Your Name</div>
                <input
                  value={nameDraft}
                  onChange={(event) => setNameDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      submitName()
                    }
                  }}
                  maxLength={18}
                  className="name-input"
                  placeholder="Type any name or emoji"
                />
                <div className="name-actions">
                  <PixelButton onClick={submitName} tone="green">Confirm</PixelButton>
                  <PixelButton onClick={() => setNameDraft('Capy')} tone="sand">Use Capy</PixelButton>
                </div>
              </div>
            ) : null}
            {phase === 'landing' ? <div className="landing-banner">Welcome to Boba Island!</div> : null}
          </div>
        </div>
      </div>
    </SceneShell>
  )
}

function ArrivalScreen({
  playerCharacter,
  accessoryId,
  playerName,
  cafeDecor,
  upgrades,
  onContinue,
  onToggleMusic,
  musicEnabled,
  audioReady,
}) {
  const messages = [
    { speaker: playerName || 'You', text: "Hi! We'd love to work here. Can we join?" },
    { speaker: 'Boss', text: 'Hmm... You two look enthusiastic. Welcome to the team!' },
    { speaker: 'Boss', text: 'Here are your uniforms!' },
    { speaker: 'Boss', text: 'Now — you can be a Chef or a Waiter.' },
    { speaker: 'Bob', text: "I'll be a Chef!" },
    { speaker: playerName || 'You', text: "Then I'm chef team too!" },
    { speaker: 'Boss', text: "Great, you'll both be in the kitchen then. Let me show you the ropes." },
  ]
  const [index, setIndex] = useState(0)
  const finished = index >= messages.length
  const uniformOn = index >= 2
  const happyJump = index >= 1 && index <= 2

  function advance() {
    if (index < messages.length - 1) {
      setIndex(index + 1)
      return
    }

    setIndex(messages.length)
  }

  return (
    <SceneShell onToggleMusic={onToggleMusic} musicEnabled={musicEnabled} audioReady={audioReady}>
      <div className="story-grid story-layout">
        <div className="board-frame stage-frame">
          <div className="story-stage cafe-stage">
            <CafeScene
              playerCharacter={playerCharacter}
              playerAccessory={uniformOn ? 'apron' : accessoryId}
              bobAccessory={uniformOn ? 'apron' : null}
              playerJump={happyJump}
              bobJump={happyJump}
              cafeDecor={cafeDecor}
              decorLevel={upgrades.decor}
            />
            {!finished ? (
              <DialogueBox
                speaker={messages[index].speaker}
                text={messages[index].text}
                onAdvance={advance}
              />
            ) : (
              <div className="story-next">
                <ArrowPrompt text="Start tutorial" />
                <PixelButton onClick={onContinue}>Learn the Kitchen</PixelButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </SceneShell>
  )
}

function CafeScreen({
  playerCharacter,
  coins,
  upgrades,
  cafeDecor,
  onBuyDecor,
  onBackToShop,
  onToggleMusic,
  musicEnabled,
  audioReady,
}) {
  return (
    <SceneShell onToggleMusic={onToggleMusic} musicEnabled={musicEnabled} audioReady={audioReady}>
      <div className="story-grid shop-layout">
        <div className="board-frame cafe-upgrade-board">
          <Logo subtitle="Back to Cafe" compact />
          <CafeDecorShop
            playerCharacter={playerCharacter}
            coins={coins}
            upgrades={upgrades}
            cafeDecor={cafeDecor}
            onBuyDecor={onBuyDecor}
            primaryActionLabel="Back to Shop"
            onPrimaryAction={onBackToShop}
          />
        </div>
      </div>
    </SceneShell>
  )
}

function TutorialScreen({ onComplete, onToggleMusic, musicEnabled, audioReady }) {
  const [phase, setPhase] = useState('dialogue')
  const [messageIndex, setMessageIndex] = useState(0)
  const [fruit, setFruit] = useState(null)
  const [hits, setHits] = useState(0)
  const messages = [
    { speaker: 'Boss', text: 'Tap fruits to prepare drinks! Every 3 fruits makes 1 boba tea. 🧋' },
    { speaker: 'Boss', text: 'Customers are waiting! Serve them before they lose patience or you lose a life.' },
    { speaker: 'Boss', text: 'Tap fast to build combos! 🔥 Every 5x combo earns bonus coins.' },
    { speaker: 'Boss', text: 'Watch for golden ⭐ fruits — they give bonus coins and extra drink progress!' },
  ]

  useEffect(() => {
    if (phase !== 'practice' || hits >= 5 || fruit) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setFruit({
        kind: FRUITS[hits % FRUITS.length],
        x: 24 + ((hits * 17) % 52),
        y: 22 + ((hits * 11) % 34),
      })
    }, hits === 0 ? 400 : 2000)

    return () => window.clearTimeout(timeoutId)
  }, [fruit, hits, phase])

  function advanceDialogue() {
    if (messageIndex < messages.length - 1) {
      setMessageIndex(messageIndex + 1)
      return
    }

    setPhase('practice')
  }

  function tapFruit() {
    setFruit(null)
    setHits((current) => current + 1)
  }

  return (
    <SceneShell onToggleMusic={onToggleMusic} musicEnabled={musicEnabled} audioReady={audioReady}>
      <div className="story-grid story-layout">
        <div className="board-frame tutorial-board">
          <Logo subtitle="Kitchen Tutorial" compact />
          {phase === 'dialogue' ? (
            <div className="tutorial-dialogue">
              <PixelCapybara character={BOSS} className="npc-medium" accessory="chef-hat" motion="idle" variant="scene" />
              <DialogueBox
                speaker={messages[messageIndex].speaker}
                text={messages[messageIndex].text}
                onAdvance={advanceDialogue}
              />
            </div>
          ) : (
            <>
              <div className="tutorial-progress">Practice taps: {hits} / 5</div>
              <div className="tutorial-playfield">
                {fruit ? (
                  <button
                    className="fruit-sprite"
                    type="button"
                    style={{ left: `${fruit.x}%`, top: `${fruit.y}%` }}
                    onClick={tapFruit}
                  >
                    {fruit.kind}
                    <span>+1</span>
                  </button>
                ) : null}
              </div>
            </>
          )}
          <div className="tutorial-actions">
            <PixelButton onClick={onComplete} tone="sand">Skip Tutorial</PixelButton>
            {phase === 'practice' && hits >= 5 ? <PixelButton onClick={onComplete} tone="green">Done</PixelButton> : null}
          </div>
        </div>
      </div>
    </SceneShell>
  )
}

function GameplayScreen({
  playerCharacter,
  accessoryId,
  coins,
  upgrades,
  cafeDecor,
  onBuyUpgrade,
  onBuyDecor,
  onGameOver,
  onToggleMusic,
  musicEnabled,
  audioReady,
}) {
  const charAbility = CHARACTER_ABILITIES[playerCharacter.id] ?? null
  const abilityStats = (() => {
    const base = { patienceBonus: 0, tipBonus: 0, fruitSpeedMult: 1, comboTimerMax: 12, queueBonus: 0, goldenChance: 0.05 }
    return charAbility ? charAbility.apply(base) : base
  })()

  const [game, setGame] = useState(() => ({
    lives: 3,
    served: 0,
    coinsEarned: 0,
    fruitProgress: 0,
    readyDrinks: 0,
    fruits: [],
    nextFruitId: 1,
    customers: [],
    nextCustomerId: 1,
    floaters: [],
    pops: [],
    particles: [],
    combo: 0,
    comboTimer: 0,
    maxCombo: 0,
    goldenCaught: 0,
    totalTaps: 0,
    drinksServed: 0,
    perfectWaves: 0,
    livesLostThisWave: 0,
    recentFruits: [],
    lastWaveBreak: 0,
    waveBreakPending: false,
    over: false,
    lifeLostFlash: false,
    shakeIntensity: 0,
    newAchievements: [],
  }))
  const finishedRef = useRef(false)
  const [paused, setPaused] = useState(false)
  const [pauseView, setPauseView] = useState('shop')

  const interactionLocked = paused || game.waveBreakPending

  useEffect(() => {
    if (interactionLocked) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setGame((current) => {
        if (current.over) {
          return current
        }

        const comboTimer = current.comboTimer > 0 ? current.comboTimer - 1 : 0
        const combo = comboTimer > 0 ? current.combo : 0
        const pops = current.pops.filter((p) => p.life > 0).map((p) => ({ ...p, life: p.life - 1 }))
        const particles = current.particles.filter((p) => p.life > 0).map((p) => ({ ...p, life: p.life - 1, y: p.y - 0.5, x: p.x + p.dx }))

        const customers = current.customers
          .map((customer) => ({ ...customer, patience: customer.patience - 0.1 }))
        const remainingCustomers = customers.filter((customer) => customer.patience > 0)
        const lostLives = customers.length - remainingCustomers.length
        let lives = current.lives - lostLives
        let readyDrinks = current.readyDrinks
        let served = current.served
        let coinsEarned = current.coinsEarned
        let drinksServed = current.drinksServed
        let livesLostThisWave = current.livesLostThisWave + lostLives
        let perfectWaves = current.perfectWaves
        const floaters = current.floaters.filter((floater) => floater.life > 0).map((floater) => ({ ...floater, life: floater.life - 1 }))
        let activeCustomers = remainingCustomers
        let lifeLostFlash = current.lifeLostFlash
        const shakeIntensity = Math.max(0, current.shakeIntensity - 0.5)
        const newAchievements = current.newAchievements.filter((a) => a.life > 0).map((a) => ({ ...a, life: a.life - 1 }))

        if (lostLives > 0) {
          lifeLostFlash = true
          SFX.loseLife()
        } else if (current.lifeLostFlash) {
          lifeLostFlash = false
        }

        if (readyDrinks > 0 && activeCustomers.length > 0) {
          const servedCustomer = activeCustomers[0]
          let tipValue = 10 + (upgrades.tips * 5) + abilityStats.tipBonus
          let serveText = `+${tipValue}`

          if (servedCustomer.specialOrder) {
            tipValue += servedCustomer.specialOrder.bonus
            serveText = `${servedCustomer.specialOrder.icon} +${tipValue}`
          }

          activeCustomers = activeCustomers.slice(1)
          readyDrinks -= 1
          served += 1
          drinksServed += 1
          coinsEarned += tipValue
          floaters.push({ id: `${Date.now()}-${served}`, text: serveText, life: 18 })
          SFX.serve()
        }

        const completedWave = served > 0 && served % 5 === 0 ? served / 5 : current.lastWaveBreak
        let waveBreakPending = served > 0 && served % 5 === 0 && completedWave > current.lastWaveBreak

        if (waveBreakPending && livesLostThisWave === 0) {
          perfectWaves += 1
          const perfectBonus = 15
          coinsEarned += perfectBonus
          floaters.push({ id: `perfect-${Date.now()}`, text: '✨ Perfect Wave! +15', life: 22 })
        }
        if (waveBreakPending) {
          livesLostThisWave = 0
        }

        return {
          ...current,
          lives,
          served,
          coinsEarned,
          readyDrinks,
          drinksServed,
          livesLostThisWave,
          perfectWaves,
          customers: activeCustomers,
          fruits: moveFruits(current.fruits, abilityStats.fruitSpeedMult),
          floaters,
          pops,
          particles,
          combo,
          comboTimer,
          lifeLostFlash,
          shakeIntensity,
          newAchievements,
          lastWaveBreak: completedWave,
          waveBreakPending,
          over: lives <= 0,
        }
      })
    }, 100)

    return () => window.clearInterval(intervalId)
  }, [interactionLocked, upgrades.tips])

  useEffect(() => {
    if (interactionLocked) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setGame((current) => {
        if (current.over || current.fruits.length >= 8) {
          return current
        }

        return {
          ...current,
          nextFruitId: current.nextFruitId + 1,
          fruits: [...current.fruits, createFruit(current.nextFruitId, abilityStats.goldenChance)],
        }
      })
    }, getFruitDelay(game.served))

    return () => window.clearInterval(intervalId)
  }, [game.served, interactionLocked])

  useEffect(() => {
    if (interactionLocked) {
      return undefined
    }

    const tier = Math.floor(game.served / 5)
    const delay = Math.max(2600, 4400 - (tier * 250))

    const intervalId = window.setInterval(() => {
      setGame((current) => {
        if (current.over) {
          return current
        }

        const capacity = 3 + upgrades.queue + abilityStats.queueBonus
        if (current.customers.length >= capacity) {
          SFX.loseLife()
          return {
            ...current,
            lives: current.lives - 1,
            lifeLostFlash: true,
            over: current.lives - 1 <= 0,
          }
        }

        return {
          ...current,
          nextCustomerId: current.nextCustomerId + 1,
          customers: [...current.customers, createCustomer(current.nextCustomerId, upgrades.patience + abilityStats.patienceBonus, current.served)],
        }
      })
    }, delay)

    return () => window.clearInterval(intervalId)
  }, [game.served, interactionLocked, upgrades.patience, upgrades.queue])

  useEffect(() => {
    if (!game.over || finishedRef.current) {
      return undefined
    }

    finishedRef.current = true
    const timeoutId = window.setTimeout(() => {
      onGameOver({
        reason: 'gameover',
        coinsEarned: game.coinsEarned,
        customersServed: game.served,
        wave: Math.floor(game.served / 5) + 1,
        maxCombo: game.maxCombo,
        goldenCaught: game.goldenCaught,
        totalTaps: game.totalTaps,
        perfectWaves: game.perfectWaves,
      })
    }, 900)

    return () => window.clearTimeout(timeoutId)
  }, [game.coinsEarned, game.over, game.served, onGameOver])

  function tapFruit(fruitId) {
    setGame((current) => {
      if (current.over || paused || current.waveBreakPending) {
        return current
      }

      const tapped = current.fruits.find((fruit) => fruit.id === fruitId)
      const fruits = current.fruits.filter((fruit) => fruit.id !== fruitId)
      const goldenBonus = tapped?.golden ? 2 : 0
      let fruitProgress = current.fruitProgress + 1 + goldenBonus
      let readyDrinks = current.readyDrinks
      const newCombo = current.combo + 1
      const maxCombo = Math.max(current.maxCombo, newCombo)
      const comboBonus = newCombo >= 5 && newCombo % 5 === 0 ? Math.floor(newCombo / 5) * 2 : 0
      let coinsEarned = current.coinsEarned + comboBonus + (tapped?.golden ? 5 : 0)
      const goldenCaught = current.goldenCaught + (tapped?.golden ? 1 : 0)
      const totalTaps = current.totalTaps + 1

      if (tapped?.golden) {
        SFX.powerUp()
      } else {
        SFX.tap()
      }
      if (comboBonus > 0) SFX.combo()

      const pops = [...current.pops]
      if (tapped) {
        pops.push({
          id: `pop-${Date.now()}-${fruitId}`,
          x: tapped.x,
          y: tapped.y,
          kind: tapped.kind,
          life: 8,
          combo: newCombo,
          golden: tapped.golden,
        })
      }

      const floaters = [...current.floaters]
      if (comboBonus > 0 && tapped) {
        floaters.push({ id: `combo-${Date.now()}`, text: `🔥 x${newCombo} +${comboBonus}`, life: 18 })
      }
      if (tapped?.golden) {
        floaters.push({ id: `golden-${Date.now()}`, text: '⭐ +5 Golden!', life: 20 })
      }

      const recentFruits = tapped && !tapped.golden
        ? [...current.recentFruits, tapped.kind].slice(-3)
        : current.recentFruits

      const prevDrinks = readyDrinks
      let newParticles = [...current.particles]
      while (fruitProgress >= 3) {
        fruitProgress -= 3
        readyDrinks += 1
      }
      if (readyDrinks > prevDrinks) {
        SFX.drink()
        for (let i = 0; i < 6; i++) {
          newParticles.push({
            id: `p-${Date.now()}-${i}`,
            x: 50 + (Math.random() - 0.5) * 40,
            y: 80 + Math.random() * 10,
            dx: (Math.random() - 0.5) * 2,
            kind: ['🫧', '✨', '🧋', '💫'][Math.floor(Math.random() * 4)],
            life: 10 + Math.floor(Math.random() * 8),
          })
        }
      }

      let shakeIntensity = current.shakeIntensity
      if (newCombo >= 10 && newCombo % 5 === 0) {
        shakeIntensity = Math.min(8, newCombo / 2)
      }

      const runStats = { served: current.served, maxCombo, goldenCaught, wave: Math.floor(current.served / 5) + 1, perfectWaves: current.perfectWaves, coinsEarned }
      const newAchievements = [...current.newAchievements]
      for (const ach of ACHIEVEMENTS) {
        if (ach.check(runStats) && !newAchievements.some((a) => a.id === ach.id)) {
          const alreadyShown = current.newAchievements.some((a) => a.id === ach.id)
          if (!alreadyShown) {
            newAchievements.push({ ...ach, life: 30 })
            SFX.powerUp()
          }
        }
      }

      return {
        ...current,
        fruits,
        fruitProgress,
        readyDrinks,
        coinsEarned,
        pops,
        floaters,
        particles: newParticles,
        combo: newCombo,
        comboTimer: abilityStats.comboTimerMax,
        maxCombo,
        goldenCaught,
        totalTaps,
        recentFruits,
        shakeIntensity,
        newAchievements,
      }
    })
  }

  function openPause(view = 'shop') {
    setPauseView(view)
    setPaused(true)
  }

  function closePause() {
    setPauseView('shop')
    setPaused(false)
  }

  function continueNextWave() {
    setGame((current) => ({
      ...current,
      waveBreakPending: false,
    }))
  }

  function endShift() {
    onGameOver({
      reason: 'endshift',
      coinsEarned: game.coinsEarned,
      customersServed: game.served,
      wave: Math.max(1, Math.ceil(game.served / 5)),
      maxCombo: game.maxCombo,
      goldenCaught: game.goldenCaught,
      totalTaps: game.totalTaps,
      perfectWaves: game.perfectWaves,
    })
  }

  function spendDuringRun(cost, purchaseAction) {
    const spendableCoins = coins + game.coinsEarned
    if (spendableCoins < cost) {
      return false
    }

    const runSpend = Math.min(game.coinsEarned, cost)
    const bankSpend = cost - runSpend
    const didPurchase = purchaseAction(bankSpend)

    if (!didPurchase) {
      return false
    }

    if (runSpend > 0) {
      setGame((current) => ({
        ...current,
        coinsEarned: Math.max(0, current.coinsEarned - runSpend),
      }))
    }

    return true
  }

  function buyUpgradeDuringRun(upgradeId) {
    const cost = getUpgradeCost(upgradeId, upgrades[upgradeId])
    spendDuringRun(cost, (bankSpend) => onBuyUpgrade(upgradeId, { bankSpend }))
  }

  function buyCafeDecorDuringRun(itemId) {
    const decorItem = CAFE_DECOR_ITEMS.find((item) => item.id === itemId)
    if (!decorItem) {
      return
    }

    spendDuringRun(decorItem.cost, (bankSpend) => onBuyDecor(itemId, { bankSpend }))
  }

  const decorClass = upgrades.decor > 0 ? `decor-level-${Math.min(upgrades.decor, 3)}` : ''
  const wave = Math.floor(game.served / 5) + 1
  const spendableCoins = coins + game.coinsEarned

  return (
    <SceneShell onToggleMusic={onToggleMusic} musicEnabled={musicEnabled} audioReady={audioReady}>
      <div className="story-grid gameplay-layout">
        <aside className="board-frame gameplay-sidebar">
          <Logo subtitle="Cafe Rush" compact />
          <PixelCapybara character={playerCharacter} accessory="apron" className="preview-capy" motion="walk" variant="scene" />
          <div className="hud-chip">🪙 Coins this run: {game.coinsEarned}</div>
          <div className="hud-chip">🛍️ Spendable: {spendableCoins}</div>
          <div className="hud-chip">👥 Served: {game.served}</div>
          <div className="hud-chip">🌊 Wave: {wave}</div>
          {charAbility && <div className="hud-chip ability-chip">✨ {charAbility.label}</div>}
          <div className={`boba-lives${game.lifeLostFlash ? ' life-flash' : ''}`}>
            {Array.from({ length: 3 }, (_, index) => (
              <span key={index} className={index < game.lives ? 'life-full' : 'life-empty'}>🧋</span>
            ))}
          </div>
          <div className="drink-progress-bar">
            <span className="drink-label">Drink</span>
            <div className="drink-dots">
              {Array.from({ length: 3 }, (_, index) => (
                <span key={index} className={`drink-dot${index < game.fruitProgress ? ' filled' : ''}`} />
              ))}
            </div>
          </div>
          <div className="order-meter">🧋 Ready: {game.readyDrinks}</div>
        </aside>

        <div className={`board-frame gameplay-board ${decorClass}`}>
          <div className="gameplay-topbar">
            <div className="panel-heading">{paused ? 'Paused' : 'Kitchen Rush'}</div>
            <PixelButton onClick={() => (paused ? closePause() : openPause())} tone={paused ? 'green' : 'sand'}>
              {paused ? 'Resume' : 'Pause'}
            </PixelButton>
          </div>
          <div className="queue-strip">
            {game.customers.map((customer) => (
              <div key={customer.id} className={`customer-card${customer.patience < customer.maxPatience * 0.3 ? ' customer-angry' : customer.patience < customer.maxPatience * 0.6 ? ' customer-warning' : ''}`}>
                <div className="customer-face">{moodFromPatience(customer.patience, customer.maxPatience)}</div>
                <div className="customer-name">{customer.name}</div>
                {customer.patience < customer.maxPatience * 0.25 && <div className="customer-urgent">❗</div>}
                {customer.specialOrder && <div className="special-order-badge" title={customer.specialOrder.description}>{customer.specialOrder.icon}</div>}
                <div className="customer-bar">
                  <span style={{ width: `${Math.max(0, (customer.patience / customer.maxPatience) * 100)}%` }} />
                </div>
                <PixelCapybara character={CHARACTERS[(customer.id - 1) % CHARACTERS.length]} className="customer-capy" motion="walk" variant="scene" />
              </div>
            ))}
          </div>

          <div
            className={`kitchen-playfield${game.lifeLostFlash ? ' playfield-flash' : ''}`}
            style={game.shakeIntensity > 0 ? { transform: `translate(${(Math.random() - 0.5) * game.shakeIntensity}px, ${(Math.random() - 0.5) * game.shakeIntensity}px)` } : undefined}
          >
            {game.fruits.map((fruit) => (
              <button
                key={fruit.id}
                className={`fruit-sprite gameplay-fruit${fruit.golden ? ' golden-fruit' : ''}`}
                type="button"
                style={{ left: `${fruit.x}%`, top: `${fruit.y}%` }}
                onClick={() => tapFruit(fruit.id)}
              >
                {fruit.kind}
              </button>
            ))}
            {game.pops.map((pop) => (
              <div key={pop.id} className={`fruit-pop${pop.golden ? ' golden-pop' : ''}`} style={{ left: `${pop.x}%`, top: `${pop.y}%`, opacity: pop.life / 8 }}>
                {pop.kind}
              </div>
            ))}
            {game.particles.map((p) => (
              <div key={p.id} className="drink-particle" style={{ left: `${p.x}%`, top: `${p.y}%`, opacity: p.life / 15 }}>
                {p.kind}
              </div>
            ))}
            {game.floaters.map((floater) => (
              <div key={floater.id} className="coin-floater" style={{ opacity: floater.life / 18 }}>
                {floater.text}
              </div>
            ))}
            {game.combo >= 3 && (
              <div className="combo-indicator">
                🔥 x{game.combo}
                <div className="combo-timer-bar">
                  <span style={{ width: `${(game.comboTimer / abilityStats.comboTimerMax) * 100}%` }} />
                </div>
              </div>
            )}
          </div>

          {game.newAchievements.filter((a) => a.life > 15).map((ach) => (
            <div key={ach.id} className="achievement-toast">
              <span className="achievement-icon">{ach.icon}</span>
              <div>
                <strong>{ach.name}</strong>
                <p>{ach.description}</p>
              </div>
            </div>
          ))}

          <div className="play-hint">
            {wave <= 1 ? 'Tap fruit to make drinks. 3 fruits = 1 boba tea!' : `Wave ${wave} — keep tapping!`}
          </div>

          {interactionLocked ? (
            <div className="pause-overlay">
              <div className={`pause-panel ${pauseView === 'cafe' ? 'pause-panel-cafe' : ''}`}>
                {game.waveBreakPending ? (
                  <>
                    <Logo subtitle={`Wave ${game.lastWaveBreak} Clear`} compact />
                    <div className="pause-summary">
                      <div className="result-chip"><span>Bank</span><strong>{coins} 🪙</strong></div>
                      <div className="result-chip"><span>This Run</span><strong>{game.coinsEarned} 🪙</strong></div>
                      <div className="result-chip"><span>Spendable</span><strong>{spendableCoins} 🪙</strong></div>
                      <div className="result-chip"><span>Served</span><strong>{game.served}</strong></div>
                    </div>
                    <p className="wave-break-copy">
                      You finished a full wave. End shift now or head straight into the next rush.
                    </p>
                    <div className="pause-actions">
                      <PixelButton onClick={endShift} tone="sand">End Shift</PixelButton>
                      <PixelButton onClick={continueNextWave} tone="green">Next Wave</PixelButton>
                    </div>
                  </>
                ) : pauseView === 'shop' ? (
                  <>
                    <Logo subtitle="Pause + Boba Shop" compact />
                    <div className="pause-summary">
                      <div className="result-chip"><span>Bank</span><strong>{coins} 🪙</strong></div>
                      <div className="result-chip"><span>This Run</span><strong>{game.coinsEarned} 🪙</strong></div>
                      <div className="result-chip"><span>Spendable</span><strong>{spendableCoins} 🪙</strong></div>
                      <div className="result-chip"><span>Served</span><strong>{game.served}</strong></div>
                    </div>
                    <div className="upgrade-list pause-upgrade-list">
                      {UPGRADE_DEFS.map((upgrade) => {
                        const level = upgrades[upgrade.id]
                        const cost = getUpgradeCost(upgrade.id, level)

                        return (
                          <div key={upgrade.id} className="upgrade-card">
                            <div>
                              <strong>{upgrade.name}</strong>
                              <p>{upgrade.description}</p>
                              <div className="upgrade-meta">Level {level}</div>
                            </div>
                            <PixelButton onClick={() => buyUpgradeDuringRun(upgrade.id)} disabled={spendableCoins < cost}>
                              Buy {cost}
                            </PixelButton>
                          </div>
                        )
                      })}
                    </div>
                    <div className="pause-actions">
                      <PixelButton onClick={() => setPauseView('cafe')} tone="gold">Cafe Upgrades</PixelButton>
                      <PixelButton onClick={closePause} tone="green">Resume Shift</PixelButton>
                    </div>
                  </>
                ) : (
                  <>
                    <Logo subtitle="Cafe Builder" compact />
                    <CafeDecorShop
                      playerCharacter={playerCharacter}
                      coins={coins}
                      availableCoins={spendableCoins}
                      runCoins={game.coinsEarned}
                      upgrades={upgrades}
                      cafeDecor={cafeDecor}
                      onBuyDecor={buyCafeDecorDuringRun}
                      primaryActionLabel="Back to Kitchen"
                      onPrimaryAction={closePause}
                      secondaryActionLabel="Back to Shop"
                      onSecondaryAction={() => setPauseView('shop')}
                      compact
                    />
                  </>
                )}
              </div>
            </div>
          ) : null}
        </div>

        <aside className="board-frame gameplay-sidebar">
          <div className="panel-heading">Current Loadout</div>
          <div className="hud-chip">Accessory: {ACCESSORIES.find((item) => item.id === accessoryId)?.name}</div>
          <div className="hud-chip">Patience +{(upgrades.patience * 0.5).toFixed(1)}s</div>
          <div className="hud-chip">Queue Size {3 + upgrades.queue}</div>
          <div className="hud-chip">Tips {10 + (upgrades.tips * 5)} coins</div>
          <div className="hud-chip">Bank Coins: {coins}</div>
          <PixelButton onClick={() => openPause()} tone="sand">Pause / Shop</PixelButton>
          <PixelButton onClick={() => openPause('cafe')} tone="gold">Cafe Upgrades</PixelButton>
        </aside>
      </div>
    </SceneShell>
  )
}

function GameOverSummaryScreen({
  playerCharacter,
  accessoryId,
  lastRun,
  bestCustomers,
  onContinue,
  onToggleMusic,
  musicEnabled,
  audioReady,
}) {
  const isNewBest = lastRun && lastRun.customersServed >= bestCustomers && lastRun.customersServed > 0
  const earnedAchievements = lastRun ? ACHIEVEMENTS.filter((a) => a.check(lastRun)) : []

  return (
    <SceneShell onToggleMusic={onToggleMusic} musicEnabled={musicEnabled} audioReady={audioReady}>
      <ScreenFade>
        <div className="story-grid shop-layout">
          <div className="board-frame shop-board game-over-board">
            <Logo subtitle="Shift Over" compact />
            <div className="game-over-capy">
              <PixelCapybara character={playerCharacter} accessory={accessoryId} className="preview-capy" motion="idle" variant="scene" />
            </div>
            <div className="game-over-message">
              {lastRun?.reason === 'gameover' ? 'The kitchen got too busy!' : 'Great shift!'}
            </div>
            {isNewBest && <div className="new-best-badge">🏆 New Best!</div>}
            <div className="shop-summary game-over-stats">
              <div className="result-chip"><span>Coins</span><strong>{lastRun?.coinsEarned ?? 0} 🪙</strong></div>
              <div className="result-chip"><span>Served</span><strong>{lastRun?.customersServed ?? 0}</strong></div>
              <div className="result-chip"><span>Wave</span><strong>{lastRun?.wave ?? 1}</strong></div>
              <div className="result-chip"><span>Best</span><strong>{bestCustomers}</strong></div>
              <div className="result-chip"><span>Max Combo</span><strong>🔥 {lastRun?.maxCombo ?? 0}</strong></div>
              <div className="result-chip"><span>Golden</span><strong>⭐ {lastRun?.goldenCaught ?? 0}</strong></div>
              <div className="result-chip"><span>Taps</span><strong>{lastRun?.totalTaps ?? 0}</strong></div>
              <div className="result-chip"><span>Perfect</span><strong>✨ {lastRun?.perfectWaves ?? 0}</strong></div>
            </div>
            {earnedAchievements.length > 0 && (
              <div className="game-over-achievements">
                <div className="achievements-title">Achievements</div>
                <div className="achievements-grid">
                  {earnedAchievements.map((ach) => (
                    <div key={ach.id} className="achievement-badge">
                      <span className="achievement-icon">{ach.icon}</span>
                      <span className="achievement-name">{ach.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="results-actions">
              <PixelButton onClick={onContinue} tone="green">Continue</PixelButton>
            </div>
          </div>
        </div>
      </ScreenFade>
    </SceneShell>
  )
}

function ShopScreen({
  coins,
  upgrades,
  lastRun,
  bestCustomers,
  onBuyUpgrade,
  onBackToCafe,
  onPlayAgain,
  onSelectAgain,
  onToggleMusic,
  musicEnabled,
  audioReady,
}) {
  return (
    <SceneShell onToggleMusic={onToggleMusic} musicEnabled={musicEnabled} audioReady={audioReady}>
      <div className="story-grid shop-layout">
        <div className="board-frame shop-board">
          <Logo subtitle="Boba Shop Upgrades" compact />
          <div className="shop-summary">
            <div className="result-chip"><span>Bank</span><strong>{coins} 🪙</strong></div>
            <div className="result-chip"><span>Last Run</span><strong>{lastRun?.customersServed ?? 0} served</strong></div>
            <div className="result-chip"><span>Best Run</span><strong>{bestCustomers}</strong></div>
          </div>
          <div className="upgrade-list">
            {UPGRADE_DEFS.map((upgrade) => {
              const level = upgrades[upgrade.id]
              const cost = getUpgradeCost(upgrade.id, level)

              return (
                <div key={upgrade.id} className="upgrade-card">
                  <div>
                    <strong>{upgrade.name}</strong>
                    <p>{upgrade.description}</p>
                    <div className="upgrade-meta">Level {level}</div>
                  </div>
                  <PixelButton onClick={() => onBuyUpgrade(upgrade.id)} disabled={coins < cost}>
                    Buy {cost}
                  </PixelButton>
                </div>
              )
            })}
          </div>
          <div className="results-actions">
            <PixelButton onClick={onBackToCafe} tone="sand">Back to Cafe</PixelButton>
            <PixelButton onClick={onPlayAgain} tone="green">Play Again</PixelButton>
            <PixelButton onClick={onSelectAgain} tone="sand">Choose Avatar</PixelButton>
          </div>
        </div>
      </div>
    </SceneShell>
  )
}

function WalkGalleryScreen({ onToggleMusic, musicEnabled, audioReady }) {
  return (
    <SceneShell onToggleMusic={onToggleMusic} musicEnabled={musicEnabled} audioReady={audioReady}>
      <div className="story-grid shop-layout">
        <div className="board-frame gallery-board">
          <Logo subtitle="Walk Animation Gallery" compact />
          <p className="gallery-copy">
            Meet all the island characters and try every accessory combo!
          </p>
          <div className="gallery-bob-panel">
            <div className="gallery-bob-copy">
              <div className="gallery-label">Bob</div>
              <p className="gallery-caption">
                Your loyal island guide and boba fan extraordinaire.
              </p>
            </div>
            <div className="gallery-track bob-track">
              <div className="gallery-lane" />
              <PixelCapybara
                character={BOB}
                className="gallery-capy"
                motion="walk"
                variant="scene"
              />
            </div>
          </div>
          <div className="gallery-section-title">Walk Cycles</div>
          <div className="walk-gallery">
            {GALLERY_CAST.map((character, index) => (
              <div key={character.id} className="gallery-card">
                <div className="gallery-track">
                  <div className="gallery-lane" />
                  <PixelCapybara
                    character={character}
                    className="gallery-capy"
                    facing={index % 2 === 0 ? 'right' : 'left'}
                    motion="walk"
                    variant="scene"
                  />
                </div>
                <div className="gallery-label">{character.name}</div>
                <p className="gallery-caption">
                  {character.catchphrase ?? 'Island guide, boba fan, and story companion.'}
                </p>
              </div>
            ))}
          </div>
          <div className="gallery-section-title">Accessory Lab</div>
          <div className="accessory-gallery">
            {CHARACTERS.map((character) => (
              <section key={character.id} className="accessory-gallery-section">
                <div className="gallery-label">{character.name}</div>
                <div className="accessory-gallery-row">
                  {ACCESSORY_PERMUTATIONS.map((accessoryOption, index) => (
                    <div key={`${character.id}-${accessoryOption.id ?? 'original'}`} className="accessory-permutation-card">
                      <div className="gallery-track accessory-track">
                        <div className="gallery-lane" />
                        <PixelCapybara
                          character={character}
                          accessory={accessoryOption.id ?? undefined}
                          className="gallery-capy"
                          facing={index % 2 === 0 ? 'right' : 'left'}
                          motion="walk"
                          variant="scene"
                        />
                      </div>
                      <div className="accessory-permutation-label">{accessoryOption.name}</div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </SceneShell>
  )
}

function AppFooter({ screen, onOpenGallery, onReturnFromGallery }) {
  const viewingGallery = screen === SCREENS.gallery
  const hideInGameplay = screen === SCREENS.gameplay || screen === SCREENS.gameOverSummary

  if (hideInGameplay) return null

  return (
    <footer className="app-footer">
      <button className="footer-link" onClick={viewingGallery ? onReturnFromGallery : onOpenGallery} type="button">
        {viewingGallery ? 'Back to Story' : 'See Walks + Accessories'}
      </button>
    </footer>
  )
}

export default function App() {
  const [savedProgress] = useState(() => loadProgress())
  const [screen, setScreen] = useState(SCREENS.title)
  const [galleryReturnScreen, setGalleryReturnScreen] = useState(SCREENS.title)
  const [selectedId, setSelectedId] = useState(savedProgress.selectedId)
  const [accessoryId, setAccessoryId] = useState(savedProgress.accessoryId)
  const [playerName, setPlayerName] = useState(savedProgress.playerName)
  const [coins, setCoins] = useState(savedProgress.coins)
  const [upgrades, setUpgrades] = useState(savedProgress.upgrades)
  const [homeUnlocked, setHomeUnlocked] = useState(savedProgress.homeUnlocked)
  const [houseId, setHouseId] = useState(savedProgress.houseId)
  const [cafeDecor, setCafeDecor] = useState(savedProgress.cafeDecor)
  const [houseDecor, setHouseDecor] = useState(savedProgress.houseDecor)
  const [bestCustomers, setBestCustomers] = useState(savedProgress.bestCustomers)
  const [lastRun, setLastRun] = useState(null)
  const selectedCharacter = getCharacterById(selectedId)
  const selectedHouse = getHouseById(houseId)
  const { audioReady, musicEnabled, startPlayback, togglePlayback } = useThemeSong()

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      selectedId,
      accessoryId,
      playerName,
      coins,
      upgrades,
      homeUnlocked,
      houseId,
      cafeDecor,
      houseDecor,
      bestCustomers,
    }))
  }, [accessoryId, bestCustomers, cafeDecor, coins, homeUnlocked, houseDecor, houseId, playerName, selectedId, upgrades])

  async function beginStory() {
    await startPlayback()
    setScreen(SCREENS.loading)
  }

  async function skipToKitchen() {
    await startPlayback()
    setScreen(SCREENS.gameplay)
  }

  function buyUpgrade(upgradeId, options = {}) {
    const cost = getUpgradeCost(upgradeId, upgrades[upgradeId])
    const bankSpend = options.bankSpend ?? cost
    if (coins < bankSpend) {
      return
    }

    setCoins((current) => current - bankSpend)
    setUpgrades((current) => ({ ...current, [upgradeId]: current[upgradeId] + 1 }))
    return true
  }

  function buyCafeDecor(itemId, options = {}) {
    const item = CAFE_DECOR_ITEMS.find((entry) => entry.id === itemId)
    const bankSpend = options.bankSpend ?? item?.cost ?? 0

    if (!item || cafeDecor[itemId] || coins < bankSpend) {
      return
    }

    setCoins((current) => current - bankSpend)
    setCafeDecor((current) => ({ ...current, [itemId]: true }))
    return true
  }

  function buyHouse(nextHouseId) {
    const house = HOUSE_OPTIONS.find((entry) => entry.id === nextHouseId)
    if (!house || houseId === nextHouseId || coins < house.cost) {
      return false
    }

    setCoins((current) => current - house.cost)
    setHouseId(nextHouseId)
    setScreen(SCREENS.home)
    return true
  }

  function buyHouseDecor(itemId) {
    const item = HOUSE_DECOR_ITEMS.find((entry) => entry.id === itemId)
    if (!item || houseDecor[itemId] || coins < item.cost) {
      return false
    }

    setCoins((current) => current - item.cost)
    setHouseDecor((current) => ({ ...current, [itemId]: true }))
    return true
  }

  function handleGameOver(summary) {
    setLastRun(summary)
    setBestCustomers((current) => Math.max(current, summary.customersServed))

    if (summary.reason === 'endshift') {
      const rewardCoins = summary.coinsEarned + (homeUnlocked ? 0 : FIRST_HOME_BONUS)
      setCoins((current) => current + rewardCoins)

      if (!homeUnlocked) {
        setHomeUnlocked(true)
        setScreen(SCREENS.firstReward)
        return
      }

      setScreen(houseId ? SCREENS.home : SCREENS.houseSelect)
      return
    }

    setCoins((current) => current + summary.coinsEarned)
    SFX.gameOver()
    setScreen(SCREENS.gameOverSummary)
  }

  function continueFromGameOver() {
    setScreen(SCREENS.shop)
  }

  function openGallery() {
    if (screen !== SCREENS.gallery) {
      setGalleryReturnScreen(screen)
    }
    setScreen(SCREENS.gallery)
  }

  function returnFromGallery() {
    setScreen(galleryReturnScreen)
  }

  return (
    <main className="app-shell">
      <div className="boba-pearl-bg" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => <div key={i} className="boba-pearl-float" />)}
      </div>
      <div className="sakura-layer" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => <div key={i} className="sakura-petal" />)}
      </div>
      <div className="pixel-scanlines" />

      {screen === SCREENS.title ? (
        <ScreenFade key="title"><TitleScreen
          onStart={beginStory}
          onSkip={skipToKitchen}
          onToggleMusic={togglePlayback}
          musicEnabled={musicEnabled}
          audioReady={audioReady}
        /></ScreenFade>
      ) : null}

      {screen === SCREENS.loading ? (
        <ScreenFade key="loading"><LoadingScreen
          onLoaded={() => setScreen(SCREENS.intro)}
          onToggleMusic={togglePlayback}
          musicEnabled={musicEnabled}
          audioReady={audioReady}
        /></ScreenFade>
      ) : null}

      {screen === SCREENS.intro ? (
        <ScreenFade key="intro"><IntroScreen
          onContinue={() => setScreen(SCREENS.avatar)}
          onToggleMusic={togglePlayback}
          musicEnabled={musicEnabled}
          audioReady={audioReady}
        /></ScreenFade>
      ) : null}

      {screen === SCREENS.avatar ? (
        <ScreenFade key="avatar"><AvatarScreen
          selectedId={selectedId}
          onSelect={setSelectedId}
          onContinue={() => setScreen(SCREENS.accessories)}
          onToggleMusic={togglePlayback}
          musicEnabled={musicEnabled}
          audioReady={audioReady}
        /></ScreenFade>
      ) : null}

      {screen === SCREENS.accessories ? (
        <ScreenFade key="accessories"><AccessoriesScreen
          character={selectedCharacter}
          accessoryId={accessoryId}
          onSelectAccessory={setAccessoryId}
          onContinue={() => setScreen(SCREENS.airport)}
          onToggleMusic={togglePlayback}
          musicEnabled={musicEnabled}
          audioReady={audioReady}
        /></ScreenFade>
      ) : null}

      {screen === SCREENS.airport ? (
        <ScreenFade key="airport"><AirportScreen
          playerCharacter={selectedCharacter}
          accessoryId={accessoryId}
          onContinue={() => setScreen(SCREENS.reunion)}
          onToggleMusic={togglePlayback}
          musicEnabled={musicEnabled}
          audioReady={audioReady}
        /></ScreenFade>
      ) : null}

      {screen === SCREENS.reunion ? (
        <ScreenFade key="reunion"><ReunionScreen
          playerCharacter={selectedCharacter}
          accessoryId={accessoryId}
          onContinue={() => setScreen(SCREENS.plane)}
          onToggleMusic={togglePlayback}
          musicEnabled={musicEnabled}
          audioReady={audioReady}
        /></ScreenFade>
      ) : null}

      {screen === SCREENS.plane ? (
        <ScreenFade key="plane"><PlaneScreen
          playerCharacter={selectedCharacter}
          accessoryId={accessoryId}
          playerName={playerName}
          onSetName={setPlayerName}
          onContinue={() => setScreen(SCREENS.arrival)}
          onToggleMusic={togglePlayback}
          musicEnabled={musicEnabled}
          audioReady={audioReady}
        /></ScreenFade>
      ) : null}

      {screen === SCREENS.arrival ? (
        <ScreenFade key="arrival"><ArrivalScreen
          playerCharacter={selectedCharacter}
          accessoryId={accessoryId}
          playerName={playerName}
          cafeDecor={cafeDecor}
          upgrades={upgrades}
          onContinue={() => setScreen(SCREENS.tutorial)}
          onToggleMusic={togglePlayback}
          musicEnabled={musicEnabled}
          audioReady={audioReady}
        /></ScreenFade>
      ) : null}

      {screen === SCREENS.tutorial ? (
        <ScreenFade key="tutorial"><TutorialScreen
          onComplete={() => setScreen(SCREENS.gameplay)}
          onToggleMusic={togglePlayback}
          musicEnabled={musicEnabled}
          audioReady={audioReady}
        /></ScreenFade>
      ) : null}

      {screen === SCREENS.firstReward ? (
        <ScreenFade key="firstReward"><FirstRewardScreen
          playerCharacter={selectedCharacter}
          accessoryId={accessoryId}
          coins={coins}
          runCoins={lastRun?.coinsEarned ?? 0}
          onContinue={() => setScreen(SCREENS.houseSelect)}
          onToggleMusic={togglePlayback}
          musicEnabled={musicEnabled}
          audioReady={audioReady}
        /></ScreenFade>
      ) : null}

      {screen === SCREENS.houseSelect ? (
        <ScreenFade key="houseSelect"><HouseSelectScreen
          coins={coins}
          houseId={houseId}
          onBuyHouse={buyHouse}
          onToggleMusic={togglePlayback}
          musicEnabled={musicEnabled}
          audioReady={audioReady}
        /></ScreenFade>
      ) : null}

      {screen === SCREENS.home ? (
        <ScreenFade key="home"><HomeScreen
          playerCharacter={selectedCharacter}
          accessoryId={accessoryId}
          coins={coins}
          house={selectedHouse}
          houseDecor={houseDecor}
          onStartShift={() => setScreen(SCREENS.gameplay)}
          onFreeRoam={() => setScreen(SCREENS.houseDecor)}
          onToggleMusic={togglePlayback}
          musicEnabled={musicEnabled}
          audioReady={audioReady}
        /></ScreenFade>
      ) : null}

      {screen === SCREENS.houseDecor ? (
        <ScreenFade key="houseDecor"><HouseDecorScreen
          playerCharacter={selectedCharacter}
          accessoryId={accessoryId}
          coins={coins}
          house={selectedHouse}
          houseDecor={houseDecor}
          onBuyDecor={buyHouseDecor}
          onBackHome={() => setScreen(SCREENS.home)}
          onStartShift={() => setScreen(SCREENS.gameplay)}
          onToggleMusic={togglePlayback}
          musicEnabled={musicEnabled}
          audioReady={audioReady}
        /></ScreenFade>
      ) : null}

      {screen === SCREENS.gameplay ? (
        <GameplayScreen
          key={`${selectedId}-${upgrades.decor}-${upgrades.queue}-${upgrades.patience}-${upgrades.tips}`}
          playerCharacter={selectedCharacter}
          accessoryId={accessoryId}
          coins={coins}
          upgrades={upgrades}
          cafeDecor={cafeDecor}
          onBuyUpgrade={buyUpgrade}
          onBuyDecor={buyCafeDecor}
          onGameOver={handleGameOver}
          onToggleMusic={togglePlayback}
          musicEnabled={musicEnabled}
          audioReady={audioReady}
        />
      ) : null}

      {screen === SCREENS.gameOverSummary ? (
        <ScreenFade key="gameOverSummary"><GameOverSummaryScreen
          playerCharacter={selectedCharacter}
          accessoryId={accessoryId}
          lastRun={lastRun}
          bestCustomers={bestCustomers}
          onContinue={continueFromGameOver}
          onToggleMusic={togglePlayback}
          musicEnabled={musicEnabled}
          audioReady={audioReady}
        /></ScreenFade>
      ) : null}

      {screen === SCREENS.shop ? (
        <ScreenFade key="shop"><ShopScreen
          coins={coins}
          upgrades={upgrades}
          lastRun={lastRun}
          bestCustomers={bestCustomers}
          onBuyUpgrade={buyUpgrade}
          onBackToCafe={() => setScreen(SCREENS.cafe)}
          onPlayAgain={() => setScreen(SCREENS.gameplay)}
          onSelectAgain={() => setScreen(SCREENS.avatar)}
          onToggleMusic={togglePlayback}
          musicEnabled={musicEnabled}
          audioReady={audioReady}
        /></ScreenFade>
      ) : null}

      {screen === SCREENS.cafe ? (
        <ScreenFade key="cafe"><CafeScreen
          playerCharacter={selectedCharacter}
          coins={coins}
          upgrades={upgrades}
          cafeDecor={cafeDecor}
          onBuyDecor={buyCafeDecor}
          onBackToShop={() => setScreen(SCREENS.shop)}
          onToggleMusic={togglePlayback}
          musicEnabled={musicEnabled}
          audioReady={audioReady}
        /></ScreenFade>
      ) : null}

      {screen === SCREENS.gallery ? (
        <ScreenFade key="gallery"><WalkGalleryScreen
          onToggleMusic={togglePlayback}
          musicEnabled={musicEnabled}
          audioReady={audioReady}
        /></ScreenFade>
      ) : null}

      <AppFooter
        screen={screen}
        onOpenGallery={openGallery}
        onReturnFromGallery={returnFromGallery}
      />
    </main>
  )
}
