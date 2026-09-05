import { DatabaseSchema } from '@/types';

// High-resolution SVG mockups for instant preview
const SEED_MOCKUPS = {
  aetheriaHero: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23050814"/><stop offset="100%" stop-color="%23040711"/></linearGradient><linearGradient id="cy" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="%2300f0ff"/><stop offset="100%" stop-color="%230077ff"/></linearGradient><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="%2300f0ff" stroke-width="0.5" stroke-opacity="0.1"/></pattern></defs><rect width="1200" height="675" fill="url(%23bg)"/><rect width="1200" height="675" fill="url(%23grid)"/><path d="M 300 0 L 330 45 L 870 45 L 900 0 Z" fill="%230a152d" stroke="%2300f0ff" stroke-width="1.5" stroke-opacity="0.8"/><text x="600" y="28" font-family="monospace" font-size="14" fill="%2300f0ff" font-weight="bold" text-anchor="middle" letter-spacing="3">SECTOR 07 // ZONE CONTROL [ALPHA]</text><text x="450" y="28" font-family="monospace" font-size="12" fill="%2300ff88" text-anchor="middle">TEAM: 04/04</text><text x="750" y="28" font-family="monospace" font-size="12" fill="%23ffb800" text-anchor="middle">EXTRACT: 03:42</text><g transform="translate(600,337)"><circle cx="0" cy="0" r="32" fill="none" stroke="%2300f0ff" stroke-width="1" stroke-dasharray="8 4" stroke-opacity="0.6"/><circle cx="0" cy="0" r="4" fill="%2300f0ff"/><line x1="-50" y1="0" x2="-15" y2="0" stroke="%2300f0ff" stroke-width="2"/><line x1="15" y1="0" x2="50" y2="0" stroke="%2300f0ff" stroke-width="2"/><line x1="0" y1="-50" x2="0" y2="-15" stroke="%2300f0ff" stroke-width="2"/><line x1="0" y1="15" x2="0" y2="50" stroke="%2300f0ff" stroke-width="2"/></g><g transform="translate(60,520)"><polygon points="0,0 260,0 280,30 280,90 0,90" fill="%230a1324" stroke="%2300f0ff" stroke-width="1.5" stroke-opacity="0.6"/><text x="20" y="24" font-family="sans-serif" font-size="12" font-weight="900" fill="%2394a3b8">OPERATOR // VUX-01</text><text x="20" y="45" font-family="monospace" font-size="10" fill="%2300f0ff">SHIELD [100%]</text><rect x="100" y="36" width="160" height="10" fill="%2305101f" rx="2"/><rect x="100" y="36" width="160" height="10" fill="url(%23cy)" rx="2"/><text x="20" y="65" font-family="monospace" font-size="10" fill="%2300ff88">VITALS [84%]</text><rect x="100" y="56" width="160" height="10" fill="%2305101f" rx="2"/><rect x="100" y="56" width="134" height="10" fill="%2300ff88" rx="2"/></g><g transform="translate(860,500)"><polygon points="40,0 300,0 300,110 0,110 0,40" fill="%230a1324" stroke="%2300f0ff" stroke-width="1.5" stroke-opacity="0.6"/><text x="40" y="30" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23f8fafc">ARX-9 PLASMA RIFLE</text><text x="180" y="90" font-family="monospace" font-size="42" font-weight="900" fill="%2300f0ff" text-anchor="end">32</text><text x="185" y="90" font-family="monospace" font-size="20" fill="%2364748b">/</text><text x="200" y="90" font-family="monospace" font-size="20" fill="%2364748b">180</text></g></svg>`,

  aetheriaWireframe: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675"><rect width="1200" height="675" fill="%230f172a"/><path d="M 0 0 L 1200 675 M 1200 0 L 0 675" stroke="%23334155" stroke-width="1" stroke-dasharray="5 5"/><rect x="300" y="10" width="600" height="40" fill="none" stroke="%2394a3b8" stroke-width="1.5" stroke-dasharray="4 2"/><text x="600" y="35" font-family="monospace" font-size="14" fill="%2394a3b8" text-anchor="middle">[Wireframe Frame 2] HUD TELEMETRY LAYOUT</text><circle cx="600" cy="337" r="40" fill="none" stroke="%2394a3b8" stroke-width="1.5"/><rect x="60" y="520" width="280" height="90" fill="none" stroke="%2394a3b8" stroke-width="1.5"/><text x="200" y="570" font-family="monospace" font-size="12" fill="%2394a3b8" text-anchor="middle">[AUTOLAYOUT] OPERATOR VITALS</text><rect x="860" y="500" width="300" height="110" fill="none" stroke="%2394a3b8" stroke-width="1.5"/><text x="1010" y="560" font-family="monospace" font-size="12" fill="%2394a3b8" text-anchor="middle">[AUTOLAYOUT] WEAPON AND AMMO</text></svg>`,

  valkyrieHero: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675"><defs><linearGradient id="vbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%2309060b"/><stop offset="100%" stop-color="%23060408"/></linearGradient><linearGradient id="gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="%23ffd700"/><stop offset="100%" stop-color="%23b8860b"/></linearGradient></defs><rect width="1200" height="675" fill="url(%23vbg)"/><rect x="50" y="40" width="1100" height="595" fill="%230c0811" fill-opacity="0.9" stroke="url(%23gold)" stroke-width="2" rx="4"/><text x="120" y="95" font-family="serif" font-size="20" font-weight="bold" fill="%23d4af37" letter-spacing="4">EQUIPMENT</text><line x1="120" y1="105" x2="280" y2="105" stroke="%23d4af37" stroke-width="2"/><text x="340" y="95" font-family="serif" font-size="18" fill="%2364748b" letter-spacing="2">INVENTORY</text><text x="500" y="95" font-family="serif" font-size="18" fill="%2364748b" letter-spacing="2">RUNE SPELLS</text><g transform="translate(100,160)"><rect width="80" height="80" fill="%23181122" stroke="%23d4af37" stroke-width="1.5" rx="4"/><text x="40" y="45" font-family="serif" font-size="11" fill="%23ffd700" text-anchor="middle">HELM</text></g><g transform="translate(200,160)"><rect width="80" height="80" fill="%23181122" stroke="%23d4af37" stroke-width="1.5" rx="4"/><text x="40" y="45" font-family="serif" font-size="11" fill="%23ffd700" text-anchor="middle">CHEST</text></g><g transform="translate(100,260)"><rect width="80" height="80" fill="%23261633" stroke="%23a855f7" stroke-width="2" rx="4"/><text x="40" y="45" font-family="serif" font-size="10" fill="%23c084fc" text-anchor="middle">WEAPON</text></g><g transform="translate(360,150)"><rect width="360" height="420" fill="%2306040a" stroke="%23382942" stroke-width="1" rx="4"/><circle cx="180" cy="200" r="100" fill="none" stroke="%23a855f7" stroke-opacity="0.3" stroke-dasharray="6 3"/><text x="180" y="210" font-family="serif" font-size="18" fill="%23c084fc" text-anchor="middle" letter-spacing="3">[VALKYRIE KNIGHT]</text></g><g transform="translate(760,150)"><rect width="340" height="420" fill="%23120c1a" stroke="%23d4af37" stroke-width="1" rx="4"/><text x="25" y="40" font-family="serif" font-size="18" font-weight="bold" fill="%23ffd700">SHADOW REAVER BLADE +10</text><text x="25" y="62" font-family="sans-serif" font-size="12" fill="%23c084fc">Mythic Relic // Greatsword</text><text x="25" y="105" font-family="monospace" font-size="13" fill="%23e2e8f0">PHYSICAL ATK: 542</text><text x="25" y="130" font-family="monospace" font-size="13" fill="%23e2e8f0">VOID DAMAGE:  280</text></g></svg>`,

  cyberstrikeHero: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675"><defs><linearGradient id="cbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%231a002c"/><stop offset="100%" stop-color="%2300182b"/></linearGradient><linearGradient id="pink" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="%23ff007f"/><stop offset="100%" stop-color="%237928ca"/></linearGradient></defs><rect width="1200" height="675" fill="url(%23cbg)"/><rect x="60" y="30" width="1080" height="615" fill="none" stroke="%23ff007f" stroke-width="1" stroke-dasharray="8 4" stroke-opacity="0.5"/><text x="80" y="55" font-family="monospace" font-size="11" fill="%23ff007f">MOBILE NOTCH SAFE ZONE // 21:9</text><rect x="420" y="40" width="360" height="40" fill="%23110220" stroke="%2300f0ff" stroke-width="1.5" rx="20"/><text x="490" y="65" font-family="sans-serif" font-size="14" font-weight="900" fill="%2300f0ff">ALIVE: 48</text><circle cx="600" cy="60" r="5" fill="%23ff007f"/><text x="710" y="65" font-family="sans-serif" font-size="14" font-weight="900" fill="%23ff007f">KILLS: 7</text><circle cx="220" cy="520" r="75" fill="%23110220" fill-opacity="0.6" stroke="%2300f0ff" stroke-width="2" stroke-opacity="0.7"/><circle cx="220" cy="520" r="35" fill="url(%23pink)" stroke="%23ffffff" stroke-width="1.5"/><circle cx="1060" cy="540" r="50" fill="url(%23pink)" stroke="%23ffffff" stroke-width="2"/><text x="1060" y="546" font-family="sans-serif" font-size="16" font-weight="900" fill="%23ffffff" text-anchor="middle">FIRE</text><circle cx="960" cy="570" r="30" fill="%23110220" stroke="%2300f0ff" stroke-width="2"/><text x="960" y="575" font-family="sans-serif" font-size="12" font-weight="bold" fill="%2300f0ff" text-anchor="middle">JUMP</text></svg>`,

  nebulaHero: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675"><rect width="1200" height="675" fill="%23020208"/><g stroke="%2338bdf8" stroke-width="1" stroke-opacity="0.3"><line x1="200" y1="200" x2="450" y2="150"/><line x1="450" y1="150" x2="700" y2="300"/><line x1="700" y1="300" x2="900" y2="180"/></g><circle cx="200" cy="200" r="14" fill="%2338bdf8" fill-opacity="0.3" stroke="%2338bdf8" stroke-width="2"/><circle cx="200" cy="200" r="4" fill="%23ffffff"/><text x="200" y="235" font-family="monospace" font-size="11" fill="%2338bdf8" text-anchor="middle">SOL-IV [OUTPOST]</text><circle cx="450" cy="150" r="22" fill="%234ade80" fill-opacity="0.2" stroke="%234ade80" stroke-width="2"/><text x="450" y="195" font-family="monospace" font-size="12" fill="%234ade80" font-weight="bold" text-anchor="middle">KAIROS CAPITAL</text><circle cx="700" cy="300" r="18" fill="%23f59e0b" fill-opacity="0.2" stroke="%23f59e0b" stroke-width="2"/><text x="700" y="335" font-family="monospace" font-size="11" fill="%23f59e0b" text-anchor="middle">NOVA BASE</text><rect x="50" y="480" width="1100" height="150" fill="%23060a14" stroke="%2338bdf8" stroke-width="1.5" rx="4"/><text x="80" y="515" font-family="monospace" font-size="14" font-weight="bold" fill="%2338bdf8" letter-spacing="2">COMMAND ARMADA 01 // 12 DREADNOUGHTS</text></svg>`,

  designSystemHero: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675"><rect width="1200" height="675" fill="%23030712"/><text x="60" y="60" font-family="monospace" font-size="16" font-weight="bold" fill="%2300f0ff" letter-spacing="3">GAME UI DESIGN SYSTEM // FRAME MATRIX V5</text><g transform="translate(60,90)"><rect x="0" y="0" width="140" height="60" fill="%2300f0ff" rx="4"/><text x="10" y="25" font-family="monospace" font-size="11" fill="%23000000" font-weight="bold">CYAN-400</text><rect x="160" y="0" width="140" height="60" fill="%2300ff88" rx="4"/><text x="170" y="25" font-family="monospace" font-size="11" fill="%23000000" font-weight="bold">NEON-500</text><rect x="320" y="0" width="140" height="60" fill="%23ffb800" rx="4"/><text x="330" y="25" font-family="monospace" font-size="11" fill="%23000000" font-weight="bold">AMBER-400</text><rect x="480" y="0" width="140" height="60" fill="%23ff007f" rx="4"/><text x="490" y="25" font-family="monospace" font-size="11" fill="%23ffffff" font-weight="bold">MAGENTA-500</text></g><g transform="translate(60,210)"><rect width="1080" height="380" fill="%23090d16" stroke="%231e293b" rx="6"/><text x="30" y="50" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23ffffff">BUTTON COMPONENT // 6 INTERACTIVE STATES</text><g transform="translate(30,80)"><polygon points="0,0 180,0 200,20 200,50 0,50" fill="%230a192f" stroke="%2300f0ff" stroke-width="1.5"/><text x="20" y="32" font-family="monospace" font-size="12" fill="%2300f0ff">DEFAULT</text></g><g transform="translate(260,80)"><polygon points="0,0 180,0 200,20 200,50 0,50" fill="%2300f0ff" stroke="%23ffffff" stroke-width="2"/><text x="20" y="32" font-family="monospace" font-size="12" fill="%23000000" font-weight="bold">HOVER</text></g><g transform="translate(490,80)"><polygon points="0,0 180,0 200,20 200,50 0,50" fill="%230077ff" stroke="%2300f0ff" stroke-width="2"/><text x="20" y="32" font-family="monospace" font-size="12" fill="%23ffffff" font-weight="bold">ACTIVE</text></g></g></svg>`,

  neonRogueHero: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675"><rect width="1200" height="675" fill="%23040008"/><rect x="50" y="40" width="1100" height="595" fill="%2307000e" stroke="%2300ff88" stroke-width="2" rx="10"/><text x="80" y="72" font-family="monospace" font-size="14" fill="%2300ff88" font-weight="bold">&gt; NEON_DECK_SYSTEM.EXE [SESSION: TURN 04]</text><g transform="translate(100,260)"><rect width="210" height="320" fill="%23100520" stroke="%2300f0ff" stroke-width="2" rx="8"/><text x="20" y="35" font-family="monospace" font-size="14" font-weight="bold" fill="%2300f0ff">OVERCLOCK [2]</text><circle cx="105" cy="120" r="50" fill="%23051025" stroke="%2300f0ff" stroke-width="1.5"/><text x="105" y="125" font-family="sans-serif" font-size="24" fill="%2300f0ff" text-anchor="middle">zap</text><rect x="15" y="195" width="180" height="100" fill="%23070210" rx="4"/><text x="25" y="225" font-family="monospace" font-size="11" fill="%23e2e8f0">Deal 18 Neon Damage.</text></g><g transform="translate(350,220)"><rect width="210" height="320" fill="%23200030" stroke="%23ff007f" stroke-width="3" rx="8"/><text x="20" y="35" font-family="monospace" font-size="14" font-weight="bold" fill="%23ff007f">NEO VIRUS [3]</text><circle cx="105" cy="120" r="50" fill="%232a0040" stroke="%23ff007f" stroke-width="1.5"/><rect x="15" y="195" width="180" height="100" fill="%23070210" rx="4"/><text x="25" y="225" font-family="monospace" font-size="11" fill="%23e2e8f0">Corrupt enemy system.</text></g></svg>`
};

export const INITIAL_DATABASE: DatabaseSchema = {
  adminPasswordHash: '$2b$12$ZfE7TVN3YSOqmW7wb6fPa.uXE16m.20oVbNUPmyV.TcQs/9HME7F6',
  "profile": {
    "name": "Vux",
    "callsign": "NEXUS // VUX",
    "title": "Game UI/UX Designer & Interface Specialist",
    "tagline": "Designing Clear Game Interfaces, Tactical HUDs & Player-Focused Systems",
    "bio": "Specializing in high-immersion Game UI/UX for PC, console, and mobile gaming. From high-stakes tactical HUDs to intricate dark fantasy inventory matrices, I deliver production-ready Figma vector interfaces ready for engine integration.",
    "status": "AVAILABLE",
    "availability": "available",
    "email": "p.weiyu85@gmail.com",
    "discordTag": "weiyu85",
    "stats": {
      "shippedTitles": 15,
      "experienceYears": 2,
      "totalFramesDesigned": 200
    },
    "testimonials": [
      {
        "id": "t-1",
        "quote": "10/10, very happy with the result. I had a pretty rough idea of what I wanted and he turned it into an actual UI that looked polished. Also handled revisions without any issues.",
        "author": "JustKenni (kxnni_)"
      },
      {
        "id": "t-2",
        "quote": "Great experience. I asked for a few changes during the process and he was completely fine with them. Final UI looks professional and works really well with the rest of the game.",
        "author": "Rimm (rimmingtonlai)"
      }
    ]
  },
  messages: [],
  projects: [
    {
      id: 'proj-1',
      slug: 'aetheria-2088-tactical-hud',
      title: 'AETHERIA: 2088',
      subtitle: 'Tactical Extraction Shooter HUD & Holographic Inventory',
      device: 'PC / Desktop',
      heroImage: SEED_MOCKUPS.aetheriaHero,
      thumbnailImage: SEED_MOCKUPS.aetheriaHero,
      images: [SEED_MOCKUPS.aetheriaHero, SEED_MOCKUPS.aetheriaWireframe, SEED_MOCKUPS.designSystemHero],
      featured: true,
      order: 1,
      overview: 'Full in-game HUD system for a dystopian sci-fi extraction shooter. Covers ammo telemetry, compass, biological vitals, quick-loot radial, and holographic backpack inventory — all engineered as adaptive, context-aware diegetic layers.'
    },
    {
      id: 'proj-2',
      slug: 'valkyrie-shadowfall-rpg-ui',
      title: 'VALKYRIE: SHADOWFALL',
      subtitle: 'Dark Fantasy RPG Equipment Matrix & Diegetic Rune Wheel',
      device: 'Console (PS5 / Xbox)',
      heroImage: SEED_MOCKUPS.valkyrieHero,
      thumbnailImage: SEED_MOCKUPS.valkyrieHero,
      images: [SEED_MOCKUPS.valkyrieHero, SEED_MOCKUPS.aetheriaWireframe, SEED_MOCKUPS.designSystemHero],
      featured: true,
      order: 2,
      overview: 'Complete UI overhaul for a premier dark fantasy RPG. Equipment screen, socketed rune-crafting matrix, progressive lore viewer, and gamepad-optimized quick-swap d-pad wheel — all built on a gothic gold-trimmed vector framework.'
    },
    {
      id: 'proj-3',
      slug: 'cyberstrike-apex-mobile-ui',
      title: 'CYBERSTRIKE: APEX',
      subtitle: 'Mobile Battle Royale HUD & Custom Touch Layout',
      device: 'Mobile (iOS / Android)',
      heroImage: SEED_MOCKUPS.cyberstrikeHero,
      thumbnailImage: SEED_MOCKUPS.cyberstrikeHero,
      images: [SEED_MOCKUPS.cyberstrikeHero, SEED_MOCKUPS.aetheriaWireframe],
      featured: true,
      order: 3,
      overview: 'Complete mobile touch interface and responsive safe-zone HUD layout for a high-intensity battle royale. Includes a fully customizable in-game HUD editor allowing players to reposition and rescale every element.'
    },
    {
      id: 'proj-4',
      slug: 'project-nebula-space-sim-ui',
      title: 'PROJECT NEBULA',
      subtitle: '4X Galactic Fleet Strategy Star Map & Command Console',
      device: 'PC / Desktop',
      heroImage: SEED_MOCKUPS.nebulaHero,
      thumbnailImage: SEED_MOCKUPS.nebulaHero,
      images: [SEED_MOCKUPS.nebulaHero, SEED_MOCKUPS.designSystemHero],
      featured: false,
      order: 4,
      overview: 'High-density strategy UI for a galactic empire simulator. Hierarchical star map, resource economy graphs, shipyard production trees, and real-time fleet battle radar — designed with semantic zoom layers to prevent cognitive overload.'
    },
    {
      id: 'proj-5',
      slug: 'neon-rogue-diegetic-deckbuilder',
      title: 'NEON ROGUE',
      subtitle: 'Cyberpunk Roguelike Card Battler Diegetic Terminal',
      device: 'Handheld / Steam Deck',
      heroImage: SEED_MOCKUPS.neonRogueHero,
      thumbnailImage: SEED_MOCKUPS.neonRogueHero,
      images: [SEED_MOCKUPS.neonRogueHero, SEED_MOCKUPS.aetheriaWireframe],
      featured: false,
      order: 5,
      overview: 'Diegetic terminal UI for a cyberpunk roguelike. Cards are physical holographic memory chips inserted into a retro-futuristic CRT deck, with distinct color-coding for each card type and CRT scanline overlays.'
    },
    {
      id: 'proj-6',
      slug: 'nexus-game-ui-design-system',
      title: 'NEXUS UI SYSTEM',
      subtitle: 'Universal Game UI Frame Architecture & Token Engine',
      device: 'PC / Desktop',
      heroImage: SEED_MOCKUPS.designSystemHero,
      thumbnailImage: SEED_MOCKUPS.designSystemHero,
      images: [SEED_MOCKUPS.designSystemHero, SEED_MOCKUPS.aetheriaHero, SEED_MOCKUPS.valkyrieHero],
      featured: true,
      order: 6,
      overview: 'Universal 500+ component game UI library. Automated design token pipelines that export color ramps, typography, button state matrices, and focus rings directly into engine stylesheets — eliminating duplicate asset work across multi-platform pipelines.'
    }
  ]
};
