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
  return definition.baseCost * (2 ** level)
}

function moodFromPatience(patience, maxPatience) {
  const ratio = patience / maxPatience
  if (ratio > 0.65) return '😐'
  if (ratio > 0.3) return '😠'
  return '🤬'
}

function getFruitDelay(servedCustomers) {
  const table = [2000, 1800, 1500, 1200, 1000, 850, 700, 500]
  const tier = Math.min(table.length - 1, Math.floor(servedCustomers / 5))
  return table[tier]
}

function createFruit(id, width = 72, height = 56) {
  return {
    id,
    kind: FRUITS[Math.floor(Math.random() * FRUITS.length)],
    x: 10 + Math.random() * Math.max(20, width - 20),
    y: 14 + Math.random() * Math.max(16, height - 16),
  }
}

function createCustomer(id, patienceBonus) {
  const maxPatience = 8 + (patienceBonus * 0.5)
  return {
    id,
    patience: maxPatience,
    maxPatience,
  }
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
    { speaker: 'Bob', text: "Zes!! Boba Island?! That's where Boba Paradise is! My name is Bob, by the way. Let's go!" },
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
    { speaker: 'Boss', text: 'Fruits will appear on screen. Tap them as fast as you can to prepare drinks!' },
    { speaker: 'Boss', text: "A new fruit appears every 2 seconds. Don't let them pile up!" },
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
    lastWaveBreak: 0,
    waveBreakPending: false,
    over: false,
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

        const customers = current.customers
          .map((customer) => ({ ...customer, patience: customer.patience - 0.1 }))
        const remainingCustomers = customers.filter((customer) => customer.patience > 0)
        const lostLives = customers.length - remainingCustomers.length
        let lives = current.lives - lostLives
        let readyDrinks = current.readyDrinks
        let served = current.served
        let coinsEarned = current.coinsEarned
        const floaters = current.floaters.filter((floater) => floater.life > 0).map((floater) => ({ ...floater, life: floater.life - 1 }))
        let activeCustomers = remainingCustomers

        if (readyDrinks > 0 && activeCustomers.length > 0) {
          const tipValue = 10 + (upgrades.tips * 5)
          activeCustomers = activeCustomers.slice(1)
          readyDrinks -= 1
          served += 1
          coinsEarned += tipValue
          floaters.push({ id: `${Date.now()}-${served}`, text: `+${tipValue}`, life: 18 })
        }

        const completedWave = served > 0 && served % 5 === 0 ? served / 5 : current.lastWaveBreak

        return {
          ...current,
          lives,
          served,
          coinsEarned,
          readyDrinks,
          customers: activeCustomers,
          floaters,
          lastWaveBreak: completedWave,
          waveBreakPending: served > 0 && served % 5 === 0 && completedWave > current.lastWaveBreak,
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
          fruits: [...current.fruits, createFruit(current.nextFruitId)],
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

        const capacity = 3 + upgrades.queue
        if (current.customers.length >= capacity) {
          return {
            ...current,
            lives: current.lives - 1,
            over: current.lives - 1 <= 0,
          }
        }

        return {
          ...current,
          nextCustomerId: current.nextCustomerId + 1,
          customers: [...current.customers, createCustomer(current.nextCustomerId, upgrades.patience)],
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
      })
    }, 900)

    return () => window.clearTimeout(timeoutId)
  }, [game.coinsEarned, game.over, game.served, onGameOver])

  function tapFruit(fruitId) {
    setGame((current) => {
      if (current.over || paused || current.waveBreakPending) {
        return current
      }

      const fruits = current.fruits.filter((fruit) => fruit.id !== fruitId)
      let fruitProgress = current.fruitProgress + 1
      let readyDrinks = current.readyDrinks

      while (fruitProgress >= 3) {
        fruitProgress -= 3
        readyDrinks += 1
      }

      return {
        ...current,
        fruits,
        fruitProgress,
        readyDrinks,
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
          <div className="boba-lives">
            {Array.from({ length: 3 }, (_, index) => (
              <span key={index} className={index < game.lives ? 'life-full' : 'life-empty'}>🧋</span>
            ))}
          </div>
          <div className="order-meter">Drink progress: {game.fruitProgress} / 3</div>
          <div className="order-meter">Ready drinks: {game.readyDrinks}</div>
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
              <div key={customer.id} className="customer-card">
                <div className="customer-face">{moodFromPatience(customer.patience, customer.maxPatience)}</div>
                <div className="customer-bar">
                  <span style={{ width: `${Math.max(0, (customer.patience / customer.maxPatience) * 100)}%` }} />
                </div>
                <PixelCapybara character={CHARACTERS[(customer.id - 1) % CHARACTERS.length]} className="customer-capy" motion="walk" variant="scene" />
              </div>
            ))}
          </div>

          <div className="kitchen-playfield">
            {game.fruits.map((fruit) => (
              <button
                key={fruit.id}
                className="fruit-sprite gameplay-fruit"
                type="button"
                style={{ left: `${fruit.x}%`, top: `${fruit.y}%` }}
                onClick={() => tapFruit(fruit.id)}
              >
                {fruit.kind}
              </button>
            ))}
            {game.floaters.map((floater) => (
              <div key={floater.id} className="coin-floater" style={{ opacity: floater.life / 18 }}>
                {floater.text}
              </div>
            ))}
          </div>

          <div className="play-hint">
            Tap fruit with your mouse or finger. The more you play, the faster they spawn.
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
            All traced island characters are shown here on loop, plus every accessory permutation for the six playable capybaras.
          </p>
          <div className="gallery-bob-panel">
            <div className="gallery-bob-copy">
              <div className="gallery-label">Bob</div>
              <p className="gallery-caption">
                Bob now uses the extracted Boba Pug art from the matching source sheet.
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
      <div className="pixel-scanlines" />

      {screen === SCREENS.title ? (
        <TitleScreen
          onStart={beginStory}
          onSkip={skipToKitchen}
          onToggleMusic={togglePlayback}
          musicEnabled={musicEnabled}
          audioReady={audioReady}
        />
      ) : null}

      {screen === SCREENS.loading ? (
        <LoadingScreen
          onLoaded={() => setScreen(SCREENS.intro)}
          onToggleMusic={togglePlayback}
          musicEnabled={musicEnabled}
          audioReady={audioReady}
        />
      ) : null}

      {screen === SCREENS.intro ? (
        <IntroScreen
          onContinue={() => setScreen(SCREENS.avatar)}
          onToggleMusic={togglePlayback}
          musicEnabled={musicEnabled}
          audioReady={audioReady}
        />
      ) : null}

      {screen === SCREENS.avatar ? (
        <AvatarScreen
          selectedId={selectedId}
          onSelect={setSelectedId}
          onContinue={() => setScreen(SCREENS.accessories)}
          onToggleMusic={togglePlayback}
          musicEnabled={musicEnabled}
          audioReady={audioReady}
        />
      ) : null}

      {screen === SCREENS.accessories ? (
        <AccessoriesScreen
          character={selectedCharacter}
          accessoryId={accessoryId}
          onSelectAccessory={setAccessoryId}
          onContinue={() => setScreen(SCREENS.airport)}
          onToggleMusic={togglePlayback}
          musicEnabled={musicEnabled}
          audioReady={audioReady}
        />
      ) : null}

      {screen === SCREENS.airport ? (
        <AirportScreen
          playerCharacter={selectedCharacter}
          accessoryId={accessoryId}
          onContinue={() => setScreen(SCREENS.reunion)}
          onToggleMusic={togglePlayback}
          musicEnabled={musicEnabled}
          audioReady={audioReady}
        />
      ) : null}

      {screen === SCREENS.reunion ? (
        <ReunionScreen
          playerCharacter={selectedCharacter}
          accessoryId={accessoryId}
          onContinue={() => setScreen(SCREENS.plane)}
          onToggleMusic={togglePlayback}
          musicEnabled={musicEnabled}
          audioReady={audioReady}
        />
      ) : null}

      {screen === SCREENS.plane ? (
        <PlaneScreen
          playerCharacter={selectedCharacter}
          accessoryId={accessoryId}
          playerName={playerName}
          onSetName={setPlayerName}
          onContinue={() => setScreen(SCREENS.arrival)}
          onToggleMusic={togglePlayback}
          musicEnabled={musicEnabled}
          audioReady={audioReady}
        />
      ) : null}

      {screen === SCREENS.arrival ? (
        <ArrivalScreen
          playerCharacter={selectedCharacter}
          accessoryId={accessoryId}
          playerName={playerName}
          cafeDecor={cafeDecor}
          upgrades={upgrades}
          onContinue={() => setScreen(SCREENS.tutorial)}
          onToggleMusic={togglePlayback}
          musicEnabled={musicEnabled}
          audioReady={audioReady}
        />
      ) : null}

      {screen === SCREENS.tutorial ? (
        <TutorialScreen
          onComplete={() => setScreen(SCREENS.gameplay)}
          onToggleMusic={togglePlayback}
          musicEnabled={musicEnabled}
          audioReady={audioReady}
        />
      ) : null}

      {screen === SCREENS.firstReward ? (
        <FirstRewardScreen
          playerCharacter={selectedCharacter}
          accessoryId={accessoryId}
          coins={coins}
          runCoins={lastRun?.coinsEarned ?? 0}
          onContinue={() => setScreen(SCREENS.houseSelect)}
          onToggleMusic={togglePlayback}
          musicEnabled={musicEnabled}
          audioReady={audioReady}
        />
      ) : null}

      {screen === SCREENS.houseSelect ? (
        <HouseSelectScreen
          coins={coins}
          houseId={houseId}
          onBuyHouse={buyHouse}
          onToggleMusic={togglePlayback}
          musicEnabled={musicEnabled}
          audioReady={audioReady}
        />
      ) : null}

      {screen === SCREENS.home ? (
        <HomeScreen
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
        />
      ) : null}

      {screen === SCREENS.houseDecor ? (
        <HouseDecorScreen
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
        />
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

      {screen === SCREENS.shop ? (
        <ShopScreen
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
        />
      ) : null}

      {screen === SCREENS.cafe ? (
        <CafeScreen
          playerCharacter={selectedCharacter}
          coins={coins}
          upgrades={upgrades}
          cafeDecor={cafeDecor}
          onBuyDecor={buyCafeDecor}
          onBackToShop={() => setScreen(SCREENS.shop)}
          onToggleMusic={togglePlayback}
          musicEnabled={musicEnabled}
          audioReady={audioReady}
        />
      ) : null}

      {screen === SCREENS.gallery ? (
        <WalkGalleryScreen
          onToggleMusic={togglePlayback}
          musicEnabled={musicEnabled}
          audioReady={audioReady}
        />
      ) : null}

      <AppFooter
        screen={screen}
        onOpenGallery={openGallery}
        onReturnFromGallery={returnFromGallery}
      />
    </main>
  )
}
