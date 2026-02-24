export const products = [
  // Category: Decor & Collectibles
  {
    id: "rel-001",
    name: "Vessel of the Warrior",
    description: "Alexander Warrior Jar Mug/Planter. Ceramic.",
    price: 450,
    cost: 180,
    category: "Decor & Collectibles",
    tags: ["elden ring", "mug", "ceramic", "jar", "warrior"],
    image: "/images/Vessel of the Warrior.png",
    stats: { rarity: "Rare", source: "Elden Ring", type: "Ceramic" },
    lore: "A ceramic shard from a warrior jar. Contains the spirit of adventure... and perhaps some innards."
  },
  {
    id: "rel-002",
    name: "Medallion of the White Wolf",
    description: "Wall-mounted Wolf School Medallion. Resin & Metal.",
    price: 550,
    cost: 220,
    category: "Decor & Collectibles",
    tags: ["witcher", "wolf", "medallion", "metal", "silver"],
    image: "/images/Medallion of the White Wolf.png",
    stats: { rarity: "Uncommon", source: "The Witcher 3", type: "Wall Decor" },
    lore: "It vibrates near places of power. A symbol of the monster hunter."
  },
  {
    id: "rel-003",
    name: "Visage of the Ghost",
    description: "Jin Sakai Mask replica on a wooden stand.",
    price: 1200,
    cost: 500,
    category: "Decor & Collectibles",
    tags: ["ghost", "tsushima", "mask", "samurai", "replica"],
    image: "/images/Visage of the Ghost.png",
    stats: { rarity: "Epic", source: "Ghost of Tsushima", type: "Replica" },
    lore: "The face of vengeance. It strikes fear into the hearts of invaders."
  },
  {
    id: "rel-004",
    name: "Messenger of the Shrine",
    description: "Small Fox Statue. Resin talisman.",
    price: 250,
    cost: 90,
    category: "Decor & Collectibles",
    tags: ["fox", "statue", "tsushima", "shrine", "resin"],
    image: "/images/Messenger of the Shrine.png",
    stats: { rarity: "Common", source: "Ghost of Tsushima", type: "Statue" },
    lore: "Follow this creature; it knows the hidden paths to power."
  },
  {
    id: "rel-005",
    name: "Symbiote Containment Vial",
    description: "Ferrofluid magnetic display in a glass tube.",
    price: 890,
    cost: 400,
    category: "Decor & Collectibles",
    tags: ["spiderman", "venom", "symbiote", "science", "magnetic"],
    image: "/images/Symbiote Containment Vial.png",
    stats: { rarity: "Epic", source: "Spider-Man", type: "Science" },
    lore: "A sample of the alien black suit. It moves when it senses magnetism. Do not break the glass."
  },
  {
    id: "rel-006",
    name: "Infernal Engine Core",
    description: "Steampunk Iron Heart Desk Fan.",
    price: 950,
    cost: 450,
    category: "Decor & Collectibles",
    tags: ["baldurs gate", "karlach", "engine", "steampunk", "fan"],
    image: "/images/Infernal Engine Core.png",
    stats: { rarity: "Rare", source: "Baldur's Gate 3", type: "Functional" },
    lore: "It burns with the fires of hell. A heavy iron fan that cools your room while looking hot."
  },

  // Category: Lighting 
  {
    id: "rel-007",
    name: "Beacon of Lost Grace",
    description: "3D Printed 'Site of Grace' LED Lamp.",
    price: 750,
    cost: 300,
    category: "Lighting",
    tags: ["elden ring", "lamp", "grace", "light", "gold"],
    image: "/images/Beacon of Lost Grace.png",
    stats: { rarity: "Legendary", source: "Elden Ring", type: "Lamp" },
    lore: "A faint golden light that guides the Tarnished. It hums with a quiet, sad song."
  },
  {
    id: "rel-008",
    name: "Specimen of the Mind",
    description: "Glass jar lamp with floating 'Mind Flayer Tadpole'.",
    price: 650,
    cost: 250,
    category: "Lighting",
    tags: ["baldurs gate", "mind flayer", "lamp", "jar", "creepy"],
    image: "/images/Specimen of the Mind.png",
    stats: { rarity: "Rare", source: "Baldur's Gate 3", type: "Lamp" },
    lore: "Preserved in brine and bioluminescent fluid. Do not let it near your eye."
  },
  {
    id: "rel-009",
    name: "Sorceress's Scent",
    description: "Lilac and Gooseberry Scented Candle.",
    price: 180,
    cost: 60,
    category: "Lighting",
    tags: ["witcher", "yennefer", "candle", "scent", "purple"],
    image: "/images/Sorceress's Scent.png",
    stats: { rarity: "Common", source: "The Witcher 3", type: "Candle" },
    lore: "The signature scent of a powerful mage. Smells of storms, lilac, and gooseberries."
  },
  {
    id: "rel-010",
    name: "Torch of the Deep Miner",
    description: "Pixel-style Wall Torch (LED).",
    price: 350,
    cost: 120,
    category: "Lighting",
    tags: ["minecraft", "torch", "led", "pixel", "wall"],
    image: "/images/Torch of the Deep Miner.png",
    stats: { rarity: "Common", source: "Minecraft", type: "Wall Light" },
    lore: "A blocky torch that burns eternally. Essential for preventing monster spawns in your room."
  },
  {
    id: "rel-011",
    name: "Coiled Sword Hearth",
    description: "Bonfire Desk Lamp with flickering LED.",
    price: 850,
    cost: 350,
    category: "Lighting",
    tags: ["dark souls", "bonfire", "sword", "lamp", "fire"],
    image: "/images/Coiled Sword Hearth.png",
    stats: { rarity: "Rare", source: "Dark Souls", type: "Lamp" },
    lore: "If you are reading this, you are safe. Rest here a while."
  },
  {
    id: "rel-012",
    name: "Mask of the Prowler",
    description: "Purple Neon LED Wall Sign.",
    price: 900,
    cost: 400,
    category: "Lighting",
    tags: ["spiderman", "miles morales", "neon", "purple", "prowler"],
    image: "/images/Mask of the Prowler.png",
    stats: { rarity: "Rare", source: "Miles Morales", type: "Neon" },
    lore: "A glowing sigil of the watcher in the shadows. Wall-mounted purple neon light."
  },

  // Category: Desk & Office 
  {
    id: "rel-013",
    name: "Moonlight Cutter",
    description: "Dark Moon Greatsword Letter Opener.",
    price: 320,
    cost: 110,
    category: "Desk & Office",
    tags: ["elden ring", "sword", "letter opener", "blue", "moonlight"],
    image: "/images/Moonlight Cutter.png",
    stats: { rarity: "Legendary", source: "Elden Ring", type: "Stationery" },
    lore: "A chilly blade bestowed by a Lunar Princess. Perfect for severing sealed missives."
  },
  {
    id: "rel-014",
    name: "Golden Order Totem",
    description: "Black and Gold Rune Desk Mat.",
    price: 400,
    cost: 150,
    category: "Desk & Office",
    tags: ["elden ring", "desk mat", "mousepad", "gold", "runes"],
    image: "/images/Golden Order Totem.png",
    stats: { rarity: "Common", source: "Elden Ring", type: "Desk Mat" },
    lore: "The metaphysical laws of the world, woven into a fabric surface to protect your desk."
  },
  {
    id: "rel-015",
    name: "Pearl of the Void",
    description: "Ender Pearl Glass Paperweight.",
    price: 250,
    cost: 80,
    category: "Desk & Office",
    tags: ["minecraft", "ender pearl", "glass", "paperweight", "green"],
    image: "/images/Pearl of the Void.png",
    stats: { rarity: "Rare", source: "Minecraft", type: "Glass" },
    lore: "Gaze into its depths to teleport across the veil. Heavy glass paperweight. May cause nausea."
  },
  {
    id: "rel-016",
    name: "Staff of the Monkey King",
    description: "Ruyi Jingu Bang Metal Pen (Extendable).",
    price: 550,
    cost: 200,
    category: "Desk & Office",
    tags: ["wukong", "staff", "pen", "metal", "extendable"],
    image: "/images/Staff of the Monkey King.png",
    stats: { rarity: "Legendary", source: "Black Myth: Wukong", type: "Pen" },
    lore: "Weighs 13,500 catties, yet fits in your pocket. A heavy brass pen that obeys only the Destined One."
  },

  // Category: Storage & Containers 
  {
    id: "rel-017",
    name: "Prism of the Astral Guard",
    description: "'The Artifact' D20 shaped Puzzle Box.",
    price: 600,
    cost: 240,
    category: "Storage & Containers",
    tags: ["baldurs gate", "artifact", "d20", "box", "puzzle"],
    image: "/images/Prism of the Astral Guard.png",
    stats: { rarity: "Epic", source: "Baldur's Gate 3", type: "Box" },
    lore: "A complex geometric prison. You feel a presence watching you from within. Good for dice."
  },
  {
    id: "rel-018",
    name: "Draft of Vitality",
    description: "Aluminum Water Bottle (Staminan X label).",
    price: 300,
    cost: 100,
    category: "Storage & Containers",
    tags: ["yakuza", "staminan", "bottle", "drink", "energy"],
    image: "/images/Draft of Vitality.png",
    stats: { rarity: "Common", source: "Yakuza", type: "Bottle" },
    lore: "A potent energy draft found in the back alleys. Restores heat. Double-walled aluminum."
  },
  {
    id: "rel-019",
    name: "Alchemist's Web Canister",
    description: "Travel Mug shaped like Web Fluid cartridge.",
    price: 350,
    cost: 130,
    category: "Storage & Containers",
    tags: ["spiderman", "web", "mug", "travel", "silver"],
    image: "/images/Alchemist's Web Canister.png",
    stats: { rarity: "Uncommon", source: "Spider-Man", type: "Mug" },
    lore: "Contains the formula for binding one's foes. Sticky to the touch. Keeps coffee hot for 6 hours."
  },
  {
    id: "rel-020",
    name: "Gourd of the Immortal",
    description: "Functional Dried Gourd Flask.",
    price: 450,
    cost: 160,
    category: "Storage & Containers",
    tags: ["wukong", "gourd", "flask", "drink", "wood"],
    image: "/images/Gourd of the Immortal.png",
    stats: { rarity: "Rare", source: "Black Myth: Wukong", type: "Flask" },
    lore: "Takes in spirits, pours out health. The older the wine, the stronger the magic."
  },
  {
    id: "rel-021",
    name: "Flask of Undead Vitality",
    description: "Estus Flask Replica (Glass Bottle).",
    price: 400,
    cost: 140,
    category: "Storage & Containers",
    tags: ["dark souls", "estus", "flask", "glass", "green"],
    image: "/images/Flask of Undead Vitality.png",
    stats: { rarity: "Common", source: "Dark Souls", type: "Bottle" },
    lore: "An emerald flask. Drink to restore your fading humanity. Hand-blown glass."
  },

  // Category: Accessories & Gadgets 
  {
    id: "rel-022",
    name: "Deck of the Bard",
    description: "Gwent Cards / Tarot Deck.",
    price: 250,
    cost: 70,
    category: "Accessories & Gadgets",
    tags: ["witcher", "gwent", "cards", "game", "deck"],
    image: "/images/Deck of the Bard.png",
    stats: { rarity: "Common", source: "The Witcher 3", type: "Game" },
    lore: "A collection of heroes and monsters. Care for a round of Gwent?"
  },
  {
    id: "rel-023",
    name: "The Immortal's Shard",
    description: "The Relic Biochip USB Drive.",
    price: 300,
    cost: 90,
    category: "Accessories & Gadgets",
    tags: ["cyberpunk", "relic", "usb", "tech", "chip"],
    image: "/images/The Immortal's Shard.png",
    stats: { rarity: "Legendary", source: "Cyberpunk 2077", type: "USB" },
    lore: "A forbidden biochip containing the soul of a rockerboy. Insert into USB port at your own risk."
  },
  {
    id: "rel-024",
    name: "Neon Katana Hilt",
    description: "LED Light-up Umbrella.",
    price: 550,
    cost: 210,
    category: "Accessories & Gadgets",
    tags: ["cyberpunk", "katana", "umbrella", "neon", "rain"],
    image: "/images/Neon Katana Hilt.png",
    stats: { rarity: "Epic", source: "Cyberpunk 2077", type: "Umbrella" },
    lore: "A blade of pure light, repurposed to shield one from the acid rain. Fully collapsible."
  },
  {
    id: "rel-025",
    name: "Sigil of the Mad Dog",
    description: "Snakeskin Leather Eyepatch.",
    price: 150,
    cost: 40,
    category: "Accessories & Gadgets",
    tags: ["yakuza", "majima", "eyepatch", "leather", "cosplay"],
    image: "/images/Sigil of the Mad Dog.png",
    stats: { rarity: "Rare", source: "Yakuza", type: "Cosplay" },
    lore: "Worn by the unpredictable demon of the East. Genuine snakeskin texture."
  },
  {
    id: "rel-026",
    name: "Hunter's Saw Badge",
    description: "Saw Cleaver Metal Keychain.",
    price: 120,
    cost: 30,
    category: "Accessories & Gadgets",
    tags: ["bloodborne", "saw", "keychain", "metal", "hunter"],
    image: "/images/Hunter's Saw Badge.png",
    stats: { rarity: "Common", source: "Bloodborne", type: "Keychain" },
    lore: "A badge of the workshop. For those who hunt the beasts. Attaches to your keys."
  },
  {
    id: "rel-027",
    name: "Ring of the Wolf Knight",
    description: "Artorias Ring Replica (Sterling Silver).",
    price: 850,
    cost: 300,
    category: "Accessories & Gadgets",
    tags: ["dark souls", "ring", "silver", "artorias", "jewelry"],
    image: "/images/Ring of the Wolf Knight.png",
    stats: { rarity: "Epic", source: "Dark Souls", type: "Jewelry" },
    lore: "Allows one to traverse the abyss without being consumed. Sterling silver plating."
  },
  {
    id: "rel-028",
    name: "Venom Strike Battery",
    description: "Power Bank (Yellow/Black design).",
    price: 600,
    cost: 250,
    category: "Accessories & Gadgets",
    tags: ["spiderman", "miles morales", "battery", "power bank", "tech"],
    image: "/images/Venom Strike Battery.png",
    stats: { rarity: "Rare", source: "Miles Morales", type: "Tech" },
    lore: "Stores the bio-electric charge of a young hero. 10,000mAh capacity for your devices."
  },
  
  // NEW MINECRAFT ITEMS
  {
    id: "rel-029",
    name: "Diamond Cutter",
    description: "Life-size Foam Diamond Sword Replica.",
    price: 800,
    cost: 300,
    category: "Decor & Collectibles",
    tags: ["minecraft", "sword", "diamond", "blue", "weapon", "foam"],
    image: "/images/Diamond Cutter.png",
    stats: { rarity: "Epic", source: "Minecraft", type: "Replica" },
    lore: "The ultimate tool of defense. Forged deep underground from the strongest materials known to crafters."
  },
  {
    id: "rel-030",
    name: "Miner's Iron Companion",
    description: "Heavy-duty Iron Pickaxe Display Piece.",
    price: 600,
    cost: 250,
    category: "Decor & Collectibles",
    tags: ["minecraft", "pickaxe", "iron", "tool", "mining"],
    image: "/images/Miner's Iron Companion.png",
    stats: { rarity: "Common", source: "Minecraft", type: "Tool" },
    lore: "Essential for digging past the stone. Just don't try using it on obsidian."
  }
];