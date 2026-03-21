import logoCrop from '../assets/reference-crops/logo.jpg'
import card1Crop from '../assets/reference-crops/card1.jpg'
import card2Crop from '../assets/reference-crops/card2.jpg'
import card3Crop from '../assets/reference-crops/card3.jpg'
import card4Crop from '../assets/reference-crops/card4.jpg'
import card5Crop from '../assets/reference-crops/card5.jpg'
import card6Crop from '../assets/reference-crops/card6.jpg'
import mochiSceneCrop from '../assets/reference-crops/mochi-scene-transparent.png'
import bobaSceneCrop from '../assets/reference-crops/boba-scene-transparent.png'
import pixelSceneCrop from '../assets/reference-crops/pixel-scene-transparent.png'
import mangoSceneCrop from '../assets/reference-crops/mango-scene-transparent.png'
import chinoSceneCrop from '../assets/reference-crops/chino-scene-transparent.png'
import starSceneCrop from '../assets/reference-crops/star-scene-transparent.png'
import bobSceneCrop from '../assets/reference-crops/bob-scene-transparent.png'

const PIXEL_ART = {
  mochi: {
    cardSrc: card1Crop,
    sceneSrc: mochiSceneCrop,
    anchors: {
      head: { x: 52, y: 18, size: '1.4rem' },
      face: { x: 54, y: 32, size: '1.2rem' },
      chest: { x: 58, y: 60, size: '1.3rem' },
      hand: { x: 76, y: 74, size: '1.4rem' },
    },
  },
  boba: {
    cardSrc: card2Crop,
    sceneSrc: bobaSceneCrop,
    anchors: {
      head: { x: 54, y: 18, size: '1.4rem' },
      face: { x: 56, y: 32, size: '1.2rem' },
      chest: { x: 60, y: 60, size: '1.3rem' },
      hand: { x: 82, y: 76, size: '1.4rem' },
    },
  },
  pixel: {
    cardSrc: card3Crop,
    sceneSrc: pixelSceneCrop,
    anchors: {
      head: { x: 56, y: 14, size: '1.4rem' },
      face: { x: 57, y: 28, size: '1.2rem' },
      chest: { x: 60, y: 61, size: '1.25rem' },
      hand: { x: 82, y: 65, size: '1.3rem' },
    },
  },
  mango: {
    cardSrc: card4Crop,
    sceneSrc: mangoSceneCrop,
    anchors: {
      head: { x: 49, y: 16, size: '1.4rem' },
      face: { x: 54, y: 32, size: '1.2rem' },
      chest: { x: 57, y: 64, size: '1.3rem' },
      hand: { x: 77, y: 76, size: '1.3rem' },
    },
  },
  chino: {
    cardSrc: card5Crop,
    sceneSrc: chinoSceneCrop,
    anchors: {
      head: { x: 53, y: 18, size: '1.4rem' },
      face: { x: 56, y: 32, size: '1.2rem' },
      chest: { x: 58, y: 60, size: '1.25rem' },
      hand: { x: 78, y: 74, size: '1.35rem' },
    },
  },
  star: {
    cardSrc: card6Crop,
    sceneSrc: starSceneCrop,
    anchors: {
      head: { x: 48, y: 17, size: '1.4rem' },
      face: { x: 54, y: 31, size: '1.2rem' },
      chest: { x: 58, y: 62, size: '1.3rem' },
      hand: { x: 79, y: 76, size: '1.45rem' },
    },
  },
  bob: {
    sceneSrc: bobSceneCrop,
    anchors: {
      head: { x: 56, y: 20, size: '1.35rem' },
      face: { x: 58, y: 34, size: '1.15rem' },
      chest: { x: 56, y: 60, size: '1.2rem' },
      hand: { x: 80, y: 70, size: '1.2rem' },
    },
  },
}

const ACCESSORY_META = {
  boba: { slot: 'hand', kind: 'pixel', scale: 1.05, shiftX: 0, shiftY: 2 },
  coconut: { slot: 'hand', kind: 'pixel', scale: 1.04, shiftX: -1, shiftY: 2 },
  bow: { slot: 'head', kind: 'pixel', scale: 1, shiftX: -2, shiftY: 2 },
  'flower-crown': { slot: 'head', kind: 'pixel', scale: 1.16, shiftX: 0, shiftY: -2 },
  sunglasses: { slot: 'face', kind: 'pixel', scale: 1.02, shiftX: 1, shiftY: 0 },
  hat: { slot: 'head', kind: 'pixel', scale: 1.04, shiftX: 0, shiftY: -3 },
  apron: { slot: 'chest', kind: 'apron', scale: 1.18, shiftX: 0, shiftY: 6 },
  'chef-hat': { slot: 'head', kind: 'pixel', scale: 1.1, shiftX: 0, shiftY: -5 },
  satchel: { slot: 'chest', kind: 'pixel', scale: 1.08, shiftX: 0, shiftY: 5 },
  pilot: { slot: 'head', kind: 'pixel', scale: 1.12, shiftX: 0, shiftY: -1 },
  'leaf-crown': { slot: 'head', kind: 'pixel', scale: 1.1, shiftX: 0, shiftY: -2 },
  star: { slot: 'hand', kind: 'pixel', scale: 1.08, shiftX: 1, shiftY: 1 },
}

const LEG_META = {
  mochi: {
    fill: '#f0dfbf',
    shadow: '#d9bf8f',
    outline: '#704024',
    width: '12%',
    height: '20%',
    backLeft: '27%',
    frontLeft: '59%',
    bottom: '6%',
  },
  boba: {
    fill: '#9d6845',
    shadow: '#76472c',
    outline: '#4a2815',
    width: '12%',
    height: '20%',
    backLeft: '28%',
    frontLeft: '60%',
    bottom: '6%',
  },
  pixel: {
    fill: '#ab5c3b',
    shadow: '#7c3e24',
    outline: '#4a2413',
    width: '12%',
    height: '20%',
    backLeft: '29%',
    frontLeft: '61%',
    bottom: '6%',
  },
  mango: {
    fill: '#e8ab22',
    shadow: '#c98716',
    outline: '#5a3214',
    width: '11%',
    height: '19%',
    backLeft: '30%',
    frontLeft: '58%',
    bottom: '6%',
  },
  chino: {
    fill: '#ca9f71',
    shadow: '#956a42',
    outline: '#4b2b18',
    width: '11.5%',
    height: '20%',
    backLeft: '29%',
    frontLeft: '60%',
    bottom: '6%',
  },
  star: {
    fill: '#f1e6ce',
    shadow: '#d8c29c',
    outline: '#6d4326',
    width: '11.5%',
    height: '20%',
    backLeft: '29%',
    frontLeft: '60%',
    bottom: '6%',
  },
  bob: {
    fill: '#ead6bb',
    shadow: '#c8a57d',
    outline: '#5b341e',
    width: '11%',
    height: '19%',
    backLeft: '30%',
    frontLeft: '60%',
    bottom: '6%',
  },
}

function AccessorySprite({ accessoryId }) {
  switch (accessoryId) {
    case 'boba':
      return (
        <span className="pixel-accessory accessory-boba-cup">
          <span className="pixel-cup-straw" />
          <span className="pixel-cup-lid" />
          <span className="pixel-cup-body" />
          <span className="pixel-cup-pearls" />
        </span>
      )
    case 'coconut':
      return (
        <span className="pixel-accessory accessory-coconut">
          <span className="pixel-coconut-leaf leaf-a" />
          <span className="pixel-coconut-leaf leaf-b" />
          <span className="pixel-coconut-shell" />
          <span className="pixel-coconut-straw" />
        </span>
      )
    case 'bow':
      return (
        <span className="pixel-accessory accessory-bow">
          <span className="pixel-bow-loop loop-left" />
          <span className="pixel-bow-loop loop-right" />
          <span className="pixel-bow-knot" />
          <span className="pixel-bow-tail tail-left" />
          <span className="pixel-bow-tail tail-right" />
        </span>
      )
    case 'flower-crown':
      return (
        <span className="pixel-accessory accessory-flower-crown">
          <span className="flower-crown-vine" />
          <span className="flower-crown-bloom bloom-a" />
          <span className="flower-crown-bloom bloom-b" />
          <span className="flower-crown-bloom bloom-c" />
        </span>
      )
    case 'sunglasses':
      return (
        <span className="pixel-accessory accessory-sunglasses">
          <span className="pixel-shade lens-left" />
          <span className="pixel-shade bridge" />
          <span className="pixel-shade lens-right" />
        </span>
      )
    case 'hat':
      return (
        <span className="pixel-accessory accessory-hat">
          <span className="pixel-hat-top" />
          <span className="pixel-hat-band" />
          <span className="pixel-hat-brim" />
        </span>
      )
    case 'chef-hat':
      return (
        <span className="pixel-accessory accessory-chef-hat">
          <span className="chef-puff puff-a" />
          <span className="chef-puff puff-b" />
          <span className="chef-puff puff-c" />
          <span className="chef-hat-band" />
        </span>
      )
    case 'satchel':
      return (
        <span className="pixel-accessory accessory-satchel">
          <span className="satchel-strap" />
          <span className="satchel-body" />
          <span className="satchel-leaf" />
        </span>
      )
    case 'pilot':
      return (
        <span className="pixel-accessory accessory-pilot">
          <span className="pilot-band" />
          <span className="pilot-goggle lens-left" />
          <span className="pilot-goggle lens-right" />
          <span className="pilot-goggle bridge" />
        </span>
      )
    case 'leaf-crown':
      return (
        <span className="pixel-accessory accessory-leaf-crown">
          <span className="leaf-crown-vine" />
          <span className="leaf-crown-leaf leaf-a" />
          <span className="leaf-crown-leaf leaf-b" />
          <span className="leaf-crown-leaf leaf-c" />
        </span>
      )
    case 'star':
      return (
        <span className="pixel-accessory accessory-star-wand">
          <span className="star-wand-stick" />
          <span className="star-wand-star" />
        </span>
      )
    default:
      return null
  }
}

function AccessoryBadge({ accessoryId, anchors }) {
  const meta = ACCESSORY_META[accessoryId]
  if (!meta) {
    return null
  }

  const anchor = anchors[meta.slot] ?? anchors.chest

  if (meta.kind === 'apron') {
    return (
      <span
        className="sprite-accessory accessory-apron"
        style={{
          left: `${anchor.x + (meta.shiftX ?? 0)}%`,
          top: `${anchor.y + (meta.shiftY ?? 0)}%`,
          '--accessory-base': anchor.size,
          '--accessory-zoom': meta.scale ?? 1,
        }}
        aria-hidden="true"
      >
        <span className="apron-strap apron-strap-left" />
        <span className="apron-strap apron-strap-right" />
        <span className="apron-bib" />
        <span className="apron-skirt">
          <span className="apron-pocket">
            <span className="apron-boba-cup">
              <span className="apron-boba-lid" />
              <span className="apron-boba-straw" />
              <span className="apron-boba-pearls" />
            </span>
          </span>
        </span>
      </span>
    )
  }

  return (
    <span
      className={`sprite-accessory accessory-${accessoryId}`}
      style={{
        left: `${anchor.x + (meta.shiftX ?? 0)}%`,
        top: `${anchor.y + (meta.shiftY ?? 0)}%`,
        '--accessory-base': anchor.size,
        '--accessory-zoom': meta.scale ?? 1,
      }}
      aria-hidden="true"
    >
      <AccessorySprite accessoryId={accessoryId} />
    </span>
  )
}

function SpriteLegs({ characterId }) {
  const legs = LEG_META[characterId] ?? LEG_META.mochi

  return (
    <span
      className={`pixel-sprite-legs legs-${characterId}`}
      style={{
        '--leg-fill': legs.fill,
        '--leg-shadow': legs.shadow,
        '--leg-outline': legs.outline,
        '--leg-width': legs.width,
        '--leg-height': legs.height,
        '--leg-back-left': legs.backLeft,
        '--leg-front-left': legs.frontLeft,
        '--leg-bottom': legs.bottom,
      }}
      aria-hidden="true"
    >
      <span className="pixel-leg leg-back" />
      <span className="pixel-leg leg-front" />
    </span>
  )
}

function BitmapSprite({ characterId, label, source, accessory }) {
  const art = PIXEL_ART[characterId]

  return (
    <div className={`pixel-sprite sprite-${characterId}`}>
      <SpriteLegs characterId={characterId} />
      <div className="pixel-sprite-frame">
        <img className="pixel-sprite-image" src={source} alt={label} draggable="false" />
      </div>
      {accessory ? <AccessoryBadge accessoryId={accessory} anchors={art.anchors} /> : null}
      <span className="pixel-sprite-shadow" aria-hidden="true" />
    </div>
  )
}

export function AccessoryPreview({ accessoryId, className = '' }) {
  if (!ACCESSORY_META[accessoryId] || accessoryId === 'apron') {
    return null
  }

  return (
    <span
      className={`accessory-preview-icon ${className}`.trim()}
      style={{
        '--accessory-base': '1.24rem',
        '--accessory-zoom': 1.12,
      }}
      aria-hidden="true"
    >
      <AccessorySprite accessoryId={accessoryId} />
    </span>
  )
}

export function PixelCapybara({
  character,
  className = '',
  facing = 'right',
  accessory,
  variant = 'scene',
  motion = 'idle',
}) {
  const art = PIXEL_ART[character.id] ?? PIXEL_ART.mochi
  const isCardVariant = variant === 'select-card' && art.cardSrc

  if (isCardVariant) {
    return (
      <div
        className={`pixel-capy-wrap ${className}`.trim()}
        data-character={character.id}
        data-motion={motion}
        data-variant={variant}
      >
        <div className="pixel-capy-inner">
          <div className={`pixel-capy-facing facing-${facing}`}>
            <img className="reference-card-image" src={art.cardSrc} alt={character.name} draggable="false" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`pixel-capy-wrap ${className}`.trim()}
      data-character={character.id}
      data-motion={motion}
      data-variant={variant}
    >
      <div className="pixel-capy-inner">
        <div className={`pixel-capy-facing facing-${facing}`}>
          <BitmapSprite
            characterId={character.id}
            label={character.name}
            source={art.sceneSrc}
            accessory={accessory}
          />
        </div>
      </div>
    </div>
  )
}

export function PlaneSprite() {
  return (
    <div className="plane-art" role="img" aria-label="Airplane">
      <span className="pixel-plane-body" />
      <span className="pixel-plane-stripe" />
      <span className="pixel-plane-tail" />
      <span className="pixel-plane-wing pixel-plane-wing-top" />
      <span className="pixel-plane-wing pixel-plane-wing-bottom" />
      <span className="pixel-plane-nose" />
      <span className="pixel-plane-window pixel-plane-window-a" />
      <span className="pixel-plane-window pixel-plane-window-b" />
      <span className="pixel-plane-window pixel-plane-window-c" />
      <span className="pixel-plane-star" />
    </div>
  )
}

export function BobaSmashLogo({ compact = false }) {
  return <img className={`boba-logo ${compact ? 'compact' : ''}`} src={logoCrop} alt="Boba Smash" draggable="false" />
}
