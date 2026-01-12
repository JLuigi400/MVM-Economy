/**
 * TF2 MANN CO. FORGE - DATOS DE REFERENCIA
 * Constantes, configuraciones y datos estáticos
 */

// ============================================
// SHEENS (Colores de brillo) - Colores oficiales TF2 Wiki
// ============================================
const SHEENS = [
    { id: 'team_shine', name: 'Team Shine', color: '#C8140F', colorBlu: '#2862C8', tier: 'god', imageRed: 'https://wiki.teamfortress.com/w/images/1/10/Killstreak_Team_Shine_RED.png', imageBlu: 'https://wiki.teamfortress.com/w/images/7/72/Killstreak_Team_Shine_BLU.png' },
    { id: 'hot_rod', name: 'Hot Rod', color: '#FF1EFF', tier: 'high', image: 'https://wiki.teamfortress.com/w/images/3/31/Killstreak_Hot_Rod.png' },
    { id: 'villainous_violet', name: 'Villainous Violet', color: '#6914FF', tier: 'high', image: 'https://wiki.teamfortress.com/w/images/f/fe/Killstreak_Villainous_Violet.png' },
    { id: 'manndarin', name: 'Manndarin', color: '#FF4B05', tier: 'mid', image: 'https://wiki.teamfortress.com/w/images/c/c4/Killstreak_Manndarin.png' },
    { id: 'deadly_daffodil', name: 'Deadly Daffodil', color: '#F2AC0A', tier: 'mid', image: 'https://wiki.teamfortress.com/w/images/6/62/Killstreak_Deadly_Daffodil.png' },
    { id: 'agonizing_emerald', name: 'Agonizing Emerald', color: '#28FF46', tier: 'low', image: 'https://wiki.teamfortress.com/w/images/e/e8/Killstreak_Agonizing_Emerald.png' },
    { id: 'mean_green', name: 'Mean Green', color: '#64FF0A', tier: 'low', image: 'https://wiki.teamfortress.com/w/images/b/b1/Killstreak_Mean_Green.png' }
];

// ============================================
// KILLSTREAKERS (Efectos de ojo)
// ============================================
const KILLSTREAKERS = [
    { id: 'fire_horns', name: 'Fire Horns', tier: 'god', image: 'https://wiki.teamfortress.com/w/images/d/d1/Killstreak_Fire_Horns_T2_7.png' },
    { id: 'cerebral_discharge', name: 'Cerebral Discharge', tier: 'high', image: 'https://wiki.teamfortress.com/w/images/1/16/Killstreak_Cerebral_Discharge_T2_7.png' },
    { id: 'tornado', name: 'Tornado', tier: 'high', image: 'https://wiki.teamfortress.com/w/images/e/e9/Killstreak_Tornado_T2_7.png' },
    { id: 'incinerator', name: 'Incinerator', tier: 'mid', image: 'https://wiki.teamfortress.com/w/images/a/a8/Killstreak_Incinerator_T2_6.png' },
    { id: 'singularity', name: 'Singularity', tier: 'mid', image: 'https://wiki.teamfortress.com/w/images/4/40/Killstreak_Singularity_T2_7.png' },
    { id: 'flames', name: 'Flames', tier: 'low', image: 'https://wiki.teamfortress.com/w/images/3/39/Killstreak_Flames_T2_7.png' },
    { id: 'hypno_beam', name: 'Hypno-Beam', tier: 'low', image: 'https://wiki.teamfortress.com/w/images/b/b8/Killstreak_Hypno-Beam_T2_7.png' }
];

// ============================================
// PIEZAS DE ROBOT
// ============================================
const ROBOT_PARTS = [
    { id: 'currency_digester', name: 'Pristine Robot Currency Digester', category: 'pristine', color: '#FFD700', image: 'https://wiki.teamfortress.com/w/images/2/2a/Backpack_Pristine_Robot_Currency_Digester.png' },
    { id: 'brainstorm_bulb', name: 'Pristine Robot Brainstorm Bulb', category: 'pristine', color: '#FFD700', image: 'https://wiki.teamfortress.com/w/images/2/21/Backpack_Pristine_Robot_Brainstorm_Bulb.png' },
    { id: 'emotion_detector', name: 'Reinforced Robot Emotion Detector', category: 'reinforced', color: '#0066FF', image: 'https://wiki.teamfortress.com/w/images/2/29/Backpack_Reinforced_Robot_Emotion_Detector.png' },
    { id: 'humor_suppression', name: 'Reinforced Robot Humor Suppression Pump', category: 'reinforced', color: '#0066FF', image: 'https://wiki.teamfortress.com/w/images/c/c8/Backpack_Reinforced_Robot_Humor_Suppression_Pump.png' },
    { id: 'bomb_stabilizer', name: 'Reinforced Robot Bomb Stabilizer', category: 'reinforced', color: '#0066FF', image: 'https://wiki.teamfortress.com/w/images/4/4e/Backpack_Reinforced_Robot_Bomb_Stabilizer.png' },
    { id: 'taunt_processor', name: 'Battle-Worn Robot Taunt Processor', category: 'battle-worn', color: '#FF69B4', image: 'https://wiki.teamfortress.com/w/images/b/bb/Backpack_Battle-Worn_Robot_Taunt_Processor.png' },
    { id: 'kb_808', name: 'Battle-Worn Robot KB-808', category: 'battle-worn', color: '#FF69B4', image: 'https://wiki.teamfortress.com/w/images/b/be/Backpack_Battle-Worn_Robot_KB-808.png' },
    { id: 'money_furnace', name: 'Battle-Worn Robot Money Furnace', category: 'battle-worn', color: '#FF69B4', image: 'https://wiki.teamfortress.com/w/images/1/1c/Backpack_Battle-Worn_Robot_Money_Furnace.png' }
];

// ============================================
// CONFIGURACIONES DE TIER
// ============================================
const TIER_CONFIG = {
    god: { label: 'God Tier', color: '#FFD700', icon: '⭐' },
    high: { label: 'High Tier', color: '#FF69B4', icon: '🔥' },
    mid: { label: 'Mid Tier', color: '#9370DB', icon: '✨' },
    low: { label: 'Low Tier', color: '#7E7E7E', icon: '●' }
};

const PART_CATEGORY_CONFIG = {
    pristine: { label: 'Pristine', color: '#FFD700' },
    reinforced: { label: 'Reinforced', color: '#0066FF' },
    'battle-worn': { label: 'Battle-Worn', color: '#FF69B4' }
};

// ============================================
// CLASES DE TF2 Y ARMAS
// ============================================

// Roles de clase para colores
const CLASS_ROLES = {
    offensive: { classes: ['scout', 'soldier', 'pyro'], color: '#E74C3C', label: 'Ofensivo' },
    defensive: { classes: ['demoman', 'heavy', 'engineer'], color: '#3498DB', label: 'Defensivo' },
    support: { classes: ['medic', 'sniper', 'spy'], color: '#2ECC71', label: 'Support' }
};

// URLs de iconos de clase
const CLASS_ICON_URLS = {
    scout: 'https://wiki.teamfortress.com/w/images/a/ad/Leaderboard_class_scout.png',
    soldier: 'https://wiki.teamfortress.com/w/images/9/96/Leaderboard_class_soldier.png',
    pyro: 'https://wiki.teamfortress.com/w/images/8/80/Leaderboard_class_pyro.png',
    demoman: 'https://wiki.teamfortress.com/w/images/4/47/Leaderboard_class_demoman.png',
    heavy: 'https://wiki.teamfortress.com/w/images/5/5a/Leaderboard_class_heavy.png',
    engineer: 'https://wiki.teamfortress.com/w/images/1/12/Leaderboard_class_engineer.png',
    medic: 'https://wiki.teamfortress.com/w/images/e/e5/Leaderboard_class_medic.png',
    sniper: 'https://wiki.teamfortress.com/w/images/f/fe/Leaderboard_class_sniper.png',
    spy: 'https://wiki.teamfortress.com/w/images/3/33/Leaderboard_class_spy.png',
    all: 'logo_img/logo.png'
};

// Función para obtener rol de una clase
function getClassRole(classId) {
    for (const [role, data] of Object.entries(CLASS_ROLES)) {
        if (data.classes.includes(classId)) return { role, ...data };
    }
    return { role: 'offensive', color: '#E74C3C', label: 'Ofensivo' };
}

const TF2_CLASSES = [
    { id: 'scout', name: 'Scout', icon: '🏃', color: '#E74C3C', role: 'offensive' },
    { id: 'soldier', name: 'Soldier', icon: '🎖️', color: '#E74C3C', role: 'offensive' },
    { id: 'pyro', name: 'Pyro', icon: '🔥', color: '#E74C3C', role: 'offensive' },
    { id: 'demoman', name: 'Demoman', icon: '💣', color: '#3498DB', role: 'defensive' },
    { id: 'heavy', name: 'Heavy', icon: '🔫', color: '#3498DB', role: 'defensive' },
    { id: 'engineer', name: 'Engineer', icon: '🔧', color: '#3498DB', role: 'defensive' },
    { id: 'medic', name: 'Medic', icon: '💉', color: '#2ECC71', role: 'support' },
    { id: 'sniper', name: 'Sniper', icon: '🎯', color: '#2ECC71', role: 'support' },
    { id: 'spy', name: 'Spy', icon: '🗡️', color: '#2ECC71', role: 'support' }
];

const WEAPON_SLOTS = [
    { id: 'primary', name: 'Primaria', icon: '1️⃣' },
    { id: 'secondary', name: 'Secundaria', icon: '2️⃣' },
    { id: 'melee', name: 'Cuerpo a Cuerpo', icon: '3️⃣' }
];

const POPULAR_WEAPONS = {
    scout: {
        primary: ['Scattergun', 'Force-A-Nature', 'Baby Face\'s Blaster', 'Soda Popper', 'Shortstop', 'Back Scatter'],
        secondary: ['Pistol', 'C.A.P.P.E.R', 'Lugermorph', 'Bonk! Atomic Punch', 'Crit-a-Cola', 'Mad Milk', 'Mutated Milk', 'Winger', 'Pretty Boy\'s Pocket Pistol', 'Flying Guillotine'],
        melee: ['Bat', 'Sandman', 'Boston Basher', 'Atomizer', 'Candy Cane', 'Fan O\'War', 'Holy Mackerel', 'Wrap Assassin', 'Sun-on-a-Stick', 'Three-Rune Blade', 'Batsaber', 'Unarmed Combat']
    },
    soldier: {
        primary: ['Rocket Launcher', 'Black Box', 'Direct Hit', 'Original', 'Liberty Launcher', 'Cow Mangler 5000', 'Beggar\'s Bazooka', 'Air Strike', 'Rocket Jumper'],
        secondary: ['Shotgun', 'Buff Banner', 'Gunboats', 'Battalion\'s Backup', 'Concheror', 'Mantreads', 'Reserve Shooter', 'Righteous Bison', 'Panic Attack', 'B.A.S.E. Jumper'],
        melee: ['Shovel', 'Market Gardener', 'Escape Plan', 'Disciplinary Action', 'Equalizer', 'Pain Train', 'Half-Zatoichi']
    },
    pyro: {
        primary: ['Flame Thrower', 'Degreaser', 'Phlogistinator', 'Dragon\'s Fury', 'Backburner', 'Rainblower', 'Nostromo Napalmer'],
        secondary: ['Shotgun', 'Flare Gun', 'Detonator', 'Scorch Shot', 'Reserve Shooter', 'Panic Attack', 'Manmelter', 'Thermal Thruster', 'Gas Passer'],
        melee: ['Fire Axe', 'Axtinguisher', 'Postal Pummeler', 'Powerjack', 'Homewrecker', 'Maul', 'Back Scratcher', 'Sharpened Volcano Fragment', 'Third Degree', 'Lollichop', 'Neon Annihilator', 'Hot Hand']
    },
    demoman: {
        primary: ['Grenade Launcher', 'Loch-n-Load', 'Iron Bomber', 'Loose Cannon', 'Ali Baba\'s Wee Booties', 'Bootlegger', 'B.A.S.E. Jumper'],
        secondary: ['Stickybomb Launcher', 'Scottish Resistance', 'Quickiebomb Launcher', 'Chargin\' Targe', 'Splendid Screen', 'Tide Turner', 'Sticky Jumper'],
        melee: ['Bottle', 'Scottish Handshake', 'Eyelander', 'Horseless Headless Horsemann\'s Headtaker', 'Nessie\'s Nine Iron', 'Scotsman\'s Skullcutter', 'Persian Persuader', 'Claidheamh Mòr', 'Half-Zatoichi', 'Ullapool Caber', 'Pain Train']
    },
    heavy: {
        primary: ['Minigun', 'Tomislav', 'Natascha', 'Brass Beast', 'Iron Curtain', 'Huo-Long Heater'],
        secondary: ['Shotgun', 'Sandvich', 'Robo-Sandvich', 'Family Business', 'Second Banana', 'Dalokohs Bar', 'Fishcake', 'Buffalo Steak Sandvich', 'Panic Attack'],
        melee: ['Fists', 'Apoco-Fists', 'Killing Gloves of Boxing', 'Gloves of Running Urgently', 'Bread Bite', 'Holiday Punch', 'Fists of Steel', 'Warrior\'s Spirit', 'Eviction Notice']
    },
    engineer: {
        primary: ['Shotgun', 'Frontier Justice', 'Widowmaker', 'Rescue Ranger', 'Pomson 6000', 'Panic Attack'],
        secondary: ['Pistol', 'Lugermorph', 'C.A.P.P.E.R', 'Wrangler', 'Giger Counter', 'Short Circuit'],
        melee: ['Wrench', 'Gunslinger', 'Jag', 'Southern Hospitality', 'Eureka Effect']
    },
    medic: {
        primary: ['Syringe Gun', 'Blutsauger', 'Crusader\'s Crossbow', 'Overdose'],
        secondary: ['Medi Gun', 'Kritzkrieg', 'Quick-Fix', 'Vaccinator'],
        melee: ['Bonesaw', 'Ubersaw', 'Vita-Saw', 'Amputator', 'Solemn Vow']
    },
    sniper: {
        primary: ['Sniper Rifle', 'AWPer Hand', 'Huntsman', 'Fortified Compound', 'Sydney Sleeper', 'Bazaar Bargain', 'Machina', 'Shooting Star', 'Hitman\'s Heatmaker', 'Classic'],
        secondary: ['SMG', 'Jarate', 'Self-Aware Beauty Mark', 'Razorback', 'Darwin\'s Danger Shield', 'Cozy Camper', 'Cleaner\'s Carbine'],
        melee: ['Kukri', 'Bushwacka', 'Shahanshah', 'Tribalman\'s Shiv']
    },
    spy: {
        primary: ['Revolver', 'Big Kill', 'Ambassador', 'L\'Etranger', 'Enforcer', 'Diamondback'],
        secondary: ['Sapper', 'Ap-Sap', 'Snack Attack', 'Red-Tape Recorder'],
        melee: ['Knife', 'Sharp Dresser', 'Black Rose', 'Your Eternal Reward', 'Wanga Prick', 'Conniver\'s Kunai', 'Big Earner', 'Spy-cicle']
    },
    multiclass: {
        melee: ['Frying Pan', 'Ham Shank', 'Conscientious Objector', 'Freedom Staff', 'Bat Outta Hell', 'Crossing Guard', 'Necro Smasher', 'Prinny Machete', 'Memory Maker', 'Golden Frying Pan']
    }
};

// ============================================
// CURRENCY ITEMS
// ============================================
const CURRENCY_ITEMS = [
    { id: 'scrap', name: 'Scrap Metal', icon: '◆', category: 'metal', image: 'https://stntrading.eu/img/4stu_NyqGxkK_KA_vyt4XpYP2f4RS8h6D4RY1OBpsFE/aHR0cHM6Ly9zdGVhbWNvbW11bml0eS1hLmFrYW1haWhkLm5ldC9lY29ub215L2ltYWdlL2ZXRmM4MmpzMGZtb1JBUC1xT0lQdTVUSFNXcWZTbVRFTExxY1V5d0draWpWalpVTFVyc20xai05eGdFYlpRc1VZaFRraHpKV2hzUFpBZk9lRC1WT240cGh0c2RRMzJadHhGWW9ON1BrWW1WbUlnZWFVS05hWF9SanB3eThVSE16NnBjeEFJZm5vdlVXSjF0OW5ZRnFZdw.webp' },
    { id: 'reclaimed', name: 'Reclaimed Metal', icon: '◆◆', category: 'metal', image: 'https://stntrading.eu/img/ot1dssgtMUNTv_eij02aDJUKW3G6Jm7zm-ahlNqQ3wA/aHR0cHM6Ly9zdGVhbWNvbW11bml0eS1hLmFrYW1haWhkLm5ldC9lY29ub215L2ltYWdlL2ZXRmM4MmpzMGZtb1JBUC1xT0lQdTVUSFNXcWZTbVRFTExxY1V5d0draWpWalpVTFVyc20xai05eGdFYlpRc1VZaFRraHpKV2hzTzBNdjZOR3VjRjFZSmxzY01FZ0RkdnhWWXNNTFBrTW1GakkxT1NVdk1IRFBCcDlsdTBDblZsdVpReEE5R3dwLWhJT1ZLNHNNTU5XRjQ.webp' },
    { id: 'refined', name: 'Refined Metal', icon: '◆◆◆', category: 'metal', image: 'https://stntrading.eu/img/ILIsUnuALeEj1hpA9H5Nn4efBlrUSoHfq4onvg3s040/aHR0cHM6Ly9zdGVhbWNvbW11bml0eS1hLmFrYW1haWhkLm5ldC9lY29ub215L2ltYWdlL2ZXRmM4MmpzMGZtb1JBUC1xT0lQdTVUSFNXcWZTbVRFTExxY1V5d0draWpWalpVTFVyc20xai05eGdFYlpRc1VZaFRraHpKV2hzTzFNdjZOR3VjRjFZZ3p0OFpRaWpKdWtGTWlNcmJoWURFd0kxeVJWS05mRDZ4b3JRM3FXM0pyNjU0NkROUHVvdTlJT1ZLNHA0a1dKYUE.webp' },
    { id: 'keys', name: 'Mann Co. Key', icon: '🔑', category: 'premium', image: 'https://wiki.teamfortress.com/w/images/8/83/Backpack_Mann_Co._Supply_Crate_Key.png' }
];

// ============================================
// DIVISAS MUNDIALES
// ============================================
const WORLD_CURRENCIES = [
    { code: 'USD', name: 'Dólar Estadounidense', symbol: '$', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'GBP', name: 'Libra Esterlina', symbol: '£', flag: '🇬🇧' },
    { code: 'MXN', name: 'Peso Mexicano', symbol: '$', flag: '🇲🇽' },
    { code: 'ARS', name: 'Peso Argentino', symbol: '$', flag: '🇦🇷' },
    { code: 'BRL', name: 'Real Brasileño', symbol: 'R$', flag: '🇧🇷' },
    { code: 'CLP', name: 'Peso Chileno', symbol: '$', flag: '🇨🇱' },
    { code: 'COP', name: 'Peso Colombiano', symbol: '$', flag: '🇨🇴' },
    { code: 'PEN', name: 'Sol Peruano', symbol: 'S/', flag: '🇵🇪' },
    { code: 'UYU', name: 'Peso Uruguayo', symbol: '$', flag: '🇺🇾' },
    { code: 'CAD', name: 'Dólar Canadiense', symbol: 'C$', flag: '🇨🇦' },
    { code: 'AUD', name: 'Dólar Australiano', symbol: 'A$', flag: '🇦🇺' },
    { code: 'NZD', name: 'Dólar Neozelandés', symbol: 'NZ$', flag: '🇳🇿' },
    { code: 'JPY', name: 'Yen Japonés', symbol: '¥', flag: '🇯🇵' },
    { code: 'CNY', name: 'Yuan Chino', symbol: '¥', flag: '🇨🇳' },
    { code: 'KRW', name: 'Won Surcoreano', symbol: '₩', flag: '🇰🇷' },
    { code: 'INR', name: 'Rupia India', symbol: '₹', flag: '🇮🇳' },
    { code: 'RUB', name: 'Rublo Ruso', symbol: '₽', flag: '🇷🇺' },
    { code: 'TRY', name: 'Lira Turca', symbol: '₺', flag: '🇹🇷' },
    { code: 'PLN', name: 'Złoty Polaco', symbol: 'zł', flag: '🇵🇱' },
    { code: 'SEK', name: 'Corona Sueca', symbol: 'kr', flag: '🇸🇪' },
    { code: 'NOK', name: 'Corona Noruega', symbol: 'kr', flag: '🇳🇴' },
    { code: 'DKK', name: 'Corona Danesa', symbol: 'kr', flag: '🇩🇰' },
    { code: 'CHF', name: 'Franco Suizo', symbol: 'Fr', flag: '🇨🇭' },
    { code: 'ZAR', name: 'Rand Sudafricano', symbol: 'R', flag: '🇿🇦' },
    { code: 'PHP', name: 'Peso Filipino', symbol: '₱', flag: '🇵🇭' },
    { code: 'THB', name: 'Baht Tailandés', symbol: '฿', flag: '🇹🇭' },
    { code: 'IDR', name: 'Rupia Indonesia', symbol: 'Rp', flag: '🇮🇩' },
    { code: 'MYR', name: 'Ringgit Malayo', symbol: 'RM', flag: '🇲🇾' },
    { code: 'SGD', name: 'Dólar Singapur', symbol: 'S$', flag: '🇸🇬' },
    { code: 'HKD', name: 'Dólar Hong Kong', symbol: 'HK$', flag: '🇭🇰' },
    { code: 'TWD', name: 'Nuevo Dólar Taiwanés', symbol: 'NT$', flag: '🇹🇼' },
    { code: 'ILS', name: 'Nuevo Séquel Israelí', symbol: '₪', flag: '🇮🇱' },
    { code: 'AED', name: 'Dírham Emiratos', symbol: 'د.إ', flag: '🇦🇪' },
    { code: 'SAR', name: 'Riyal Saudí', symbol: '﷼', flag: '🇸🇦' }
];

// ============================================
// CRAFTING REQUIREMENTS
// ============================================
const CRAFTING_REQUIREMENTS = {
    specialized: { 
        parts: 29, 
        label: 'Specialized Killstreak',
        image: 'https://wiki.teamfortress.com/w/images/2/2e/Item_icon_Specialized_Killstreak_Kit.png',
        fabricatorImage: 'https://wiki.teamfortress.com/w/images/c/cc/Backpack_Specialized_Killstreak_Kit_Fabricator.png',
        basicKitImage: 'https://wiki.teamfortress.com/w/images/e/e4/Item_icon_Killstreak_Kit.png',
        partsBreakdown: {
            pristine: 0,       // Specialized NO pide Pristine
            reinforced: 5,
            'battle-worn': 24
        },
        // Categorías permitidas para este tipo de kit
        allowedCategories: ['reinforced', 'battle-worn'],
        // Requisitos de armas
        requiresWeapon: true,
        weaponType: 'basic',
        weaponLabel: 'Basic Killstreak Weapon',
        weaponsRequired: 1,
        estimatedCost: 8
    },
    professional: { 
        parts: 25, 
        label: 'Professional Killstreak',
        image: 'https://wiki.teamfortress.com/w/images/f/f3/Item_icon_Professional_Killstreak_Kit.png',
        fabricatorImage: 'https://wiki.teamfortress.com/w/images/b/bf/Backpack_Professional_Killstreak_Kit_Fabricator.png',
        partsBreakdown: {
            pristine: 3,
            reinforced: 6,
            'battle-worn': 16
        },
        // Categorías permitidas para este tipo de kit
        allowedCategories: ['pristine', 'reinforced', 'battle-worn'],
        // Requisitos de armas
        requiresWeapon: true,
        weaponType: 'specialized',
        weaponLabel: 'Specialized Killstreak Weapon',
        weaponsRequired: 2,
        estimatedCost: 15
    }
};

// ============================================
// MARKET STORES
// ============================================
const MARKET_STORES = [
    { 
        id: 'scrap_tf', 
        name: 'Scrap.TF', 
        currency: 'ref',
        currencySymbol: 'Ref',
        type: 'bot',
        reliability: 'high',
        url: 'https://scrap.tf/',
        note: 'Bots automáticos, precios fijos'
    },
    { 
        id: 'backpack_tf', 
        name: 'Backpack.TF', 
        currency: 'ref',
        currencySymbol: 'Ref',
        type: 'community',
        reliability: 'variable',
        url: 'https://backpack.tf/',
        note: 'Precios de usuarios reales, pueden variar'
    },
    { 
        id: 'stn_trading', 
        name: 'STN Trading', 
        currency: 'ref',
        currencySymbol: 'Ref',
        type: 'bot',
        reliability: 'high',
        url: 'https://stntrading.eu/',
        note: 'Bots automáticos, precios estables'
    },
    { 
        id: 'tradeit_gg', 
        name: 'TradeIT.GG', 
        currency: 'usd',
        currencySymbol: '$',
        type: 'bot',
        reliability: 'high',
        url: 'https://tradeit.gg/',
        note: 'Precios en USD, conversión necesaria'
    },
    { 
        id: 'steam_market', 
        name: 'Steam Market', 
        currency: 'local',
        currencySymbol: '',
        type: 'official',
        reliability: 'high',
        url: 'https://steamcommunity.com/market/',
        note: 'Solo compra, no venta de Keys'
    }
];

// ============================================
// SISTEMA DE VALORACIÓN
// ============================================
const SHEEN_DEMAND = {
    team_shine: { multiplier: 1.40, demand: 'very-high', sellSpeed: 'fast', note: 'El más buscado - Team Colors' },
    hot_rod: { multiplier: 1.22, demand: 'high', sellSpeed: 'fast', note: 'Rosa vibrante muy popular' },
    villainous_violet: { multiplier: 1.15, demand: 'high', sellSpeed: 'medium', note: 'Morado clásico, buena demanda' },
    manndarin: { multiplier: 1.08, demand: 'medium', sellSpeed: 'medium', note: 'Naranja llamativo' },
    deadly_daffodil: { multiplier: 1.00, demand: 'medium', sellSpeed: 'medium', note: 'Amarillo base - demanda estable' },
    agonizing_emerald: { multiplier: 0.92, demand: 'low', sellSpeed: 'slow', note: 'Verde claro - menos popular' },
    mean_green: { multiplier: 0.85, demand: 'low', sellSpeed: 'slow', note: 'Verde oscuro - difícil de vender' }
};

const KILLSTREAKER_DEMAND = {
    fire_horns: { multiplier: 1.60, demand: 'very-high', sellSpeed: 'fast', note: 'El GOD tier absoluto' },
    cerebral_discharge: { multiplier: 1.30, demand: 'high', sellSpeed: 'fast', note: 'Rayos eléctricos muy buscados' },
    tornado: { multiplier: 1.25, demand: 'high', sellSpeed: 'medium', note: 'Efecto llamativo y popular' },
    singularity: { multiplier: 1.10, demand: 'medium', sellSpeed: 'medium', note: 'Agujero negro - demanda estable' },
    incinerator: { multiplier: 1.05, demand: 'medium', sellSpeed: 'medium', note: 'Llamas decentes' },
    flames: { multiplier: 0.90, demand: 'low', sellSpeed: 'slow', note: 'Llamas básicas - poco buscado' },
    hypno_beam: { multiplier: 0.82, demand: 'low', sellSpeed: 'slow', note: 'Espiral hipnótica - muy nicho' }
};

const COMBO_TIERS = {
    S: { label: 'S Tier', color: '#FFD700', icon: '👑', minScore: 2.0, description: 'Combinación premium - Máximo valor' },
    A: { label: 'A Tier', color: '#FF6B6B', icon: '🔥', minScore: 1.5, description: 'Alta demanda - Venta rápida' },
    B: { label: 'B Tier', color: '#9370DB', icon: '⭐', minScore: 1.2, description: 'Buena combinación - Demanda estable' },
    C: { label: 'C Tier', color: '#5DADE2', icon: '✨', minScore: 1.0, description: 'Estándar - Precio base' },
    D: { label: 'D Tier', color: '#7E7E7E', icon: '●', minScore: 0, description: 'Baja demanda - Difícil de vender' }
};

// ============================================
// WEAPON DEMAND DATA - Datos detallados por arma
// Basado en datos de comunidad TF2 (backpack.tf, marketplace.tf)
// ============================================
const WEAPON_DEMAND = {
    // SCOUT
    scout: {
        primary: {
            'Scattergun': { tier: 'S', demand: 'very-high', sellDays: { fast: 1, normal: 3, collector: 7 }, priceMultiplier: 1.5 },
            'Force-A-Nature': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 5, collector: 14 }, priceMultiplier: 1.3 },
            'Baby Face\'s Blaster': { tier: 'B', demand: 'medium', sellDays: { fast: 3, normal: 7, collector: 21 }, priceMultiplier: 1.1 },
            'Soda Popper': { tier: 'B', demand: 'medium', sellDays: { fast: 3, normal: 8, collector: 21 }, priceMultiplier: 1.0 },
            'Shortstop': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 30 }, priceMultiplier: 0.9 },
            'Back Scatter': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 30 }, priceMultiplier: 0.85 }
        },
        secondary: {
            'Pistol': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 5, collector: 14 }, priceMultiplier: 1.2 },
            'Bonk! Atomic Punch': { tier: 'B', demand: 'medium', sellDays: { fast: 4, normal: 10, collector: 25 }, priceMultiplier: 1.0 },
            'Crit-a-Cola': { tier: 'B', demand: 'medium', sellDays: { fast: 4, normal: 10, collector: 25 }, priceMultiplier: 1.0 },
            'Mad Milk': { tier: 'B', demand: 'medium', sellDays: { fast: 3, normal: 8, collector: 20 }, priceMultiplier: 1.05 },
            'Winger': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 30 }, priceMultiplier: 0.9 },
            'Flying Guillotine': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 30 }, priceMultiplier: 0.9 }
        },
        melee: {
            'Bat': { tier: 'B', demand: 'medium', sellDays: { fast: 3, normal: 7, collector: 18 }, priceMultiplier: 1.0 },
            'Boston Basher': { tier: 'S', demand: 'very-high', sellDays: { fast: 1, normal: 3, collector: 10 }, priceMultiplier: 1.4 },
            'Sandman': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 5, collector: 14 }, priceMultiplier: 1.2 },
            'Atomizer': { tier: 'B', demand: 'medium', sellDays: { fast: 3, normal: 8, collector: 20 }, priceMultiplier: 1.0 },
            'Holy Mackerel': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 6, collector: 15 }, priceMultiplier: 1.25 },
            'Fan O\'War': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 30 }, priceMultiplier: 0.85 },
            'Wrap Assassin': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 30 }, priceMultiplier: 0.85 }
        }
    },
    // SOLDIER
    soldier: {
        primary: {
            'Rocket Launcher': { tier: 'S', demand: 'very-high', sellDays: { fast: 1, normal: 2, collector: 5 }, priceMultiplier: 1.6 },
            'Original': { tier: 'S', demand: 'very-high', sellDays: { fast: 1, normal: 3, collector: 7 }, priceMultiplier: 1.5 },
            'Black Box': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 5, collector: 12 }, priceMultiplier: 1.3 },
            'Direct Hit': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 5, collector: 14 }, priceMultiplier: 1.25 },
            'Beggar\'s Bazooka': { tier: 'B', demand: 'medium', sellDays: { fast: 3, normal: 8, collector: 20 }, priceMultiplier: 1.1 },
            'Liberty Launcher': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 12, collector: 28 }, priceMultiplier: 0.9 },
            'Air Strike': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 30 }, priceMultiplier: 0.85 },
            'Cow Mangler 5000': { tier: 'D', demand: 'low', sellDays: { fast: 7, normal: 18, collector: 45 }, priceMultiplier: 0.75 }
        },
        secondary: {
            'Shotgun': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 5, collector: 14 }, priceMultiplier: 1.2 },
            'Buff Banner': { tier: 'B', demand: 'medium', sellDays: { fast: 3, normal: 8, collector: 20 }, priceMultiplier: 1.0 },
            'Gunboats': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 5, collector: 12 }, priceMultiplier: 1.2 },
            'Concheror': { tier: 'B', demand: 'medium', sellDays: { fast: 3, normal: 8, collector: 20 }, priceMultiplier: 1.05 },
            'Battalion\'s Backup': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 12, collector: 28 }, priceMultiplier: 0.9 },
            'Reserve Shooter': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 30 }, priceMultiplier: 0.85 }
        },
        melee: {
            'Shovel': { tier: 'C', demand: 'low', sellDays: { fast: 4, normal: 10, collector: 25 }, priceMultiplier: 0.9 },
            'Market Gardener': { tier: 'S', demand: 'very-high', sellDays: { fast: 1, normal: 2, collector: 5 }, priceMultiplier: 1.7 },
            'Escape Plan': { tier: 'S', demand: 'very-high', sellDays: { fast: 1, normal: 3, collector: 7 }, priceMultiplier: 1.5 },
            'Disciplinary Action': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 5, collector: 12 }, priceMultiplier: 1.3 },
            'Half-Zatoichi': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 6, collector: 14 }, priceMultiplier: 1.25 },
            'Equalizer': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 30 }, priceMultiplier: 0.85 },
            'Pain Train': { tier: 'D', demand: 'low', sellDays: { fast: 7, normal: 18, collector: 40 }, priceMultiplier: 0.75 }
        }
    },
    // PYRO
    pyro: {
        primary: {
            'Degreaser': { tier: 'S', demand: 'very-high', sellDays: { fast: 1, normal: 3, collector: 8 }, priceMultiplier: 1.5 },
            'Flame Thrower': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 5, collector: 12 }, priceMultiplier: 1.25 },
            'Phlogistinator': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 6, collector: 14 }, priceMultiplier: 1.2 },
            'Dragon\'s Fury': { tier: 'B', demand: 'medium', sellDays: { fast: 3, normal: 8, collector: 20 }, priceMultiplier: 1.1 },
            'Backburner': { tier: 'B', demand: 'medium', sellDays: { fast: 4, normal: 10, collector: 22 }, priceMultiplier: 1.0 },
            'Rainblower': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 30 }, priceMultiplier: 0.9 }
        },
        secondary: {
            'Flare Gun': { tier: 'S', demand: 'very-high', sellDays: { fast: 1, normal: 3, collector: 8 }, priceMultiplier: 1.4 },
            'Detonator': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 5, collector: 14 }, priceMultiplier: 1.2 },
            'Scorch Shot': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 6, collector: 14 }, priceMultiplier: 1.15 },
            'Shotgun': { tier: 'B', demand: 'medium', sellDays: { fast: 3, normal: 8, collector: 20 }, priceMultiplier: 1.05 },
            'Thermal Thruster': { tier: 'B', demand: 'medium', sellDays: { fast: 4, normal: 10, collector: 22 }, priceMultiplier: 1.0 },
            'Panic Attack': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 30 }, priceMultiplier: 0.9 }
        },
        melee: {
            'Fire Axe': { tier: 'C', demand: 'low', sellDays: { fast: 4, normal: 10, collector: 25 }, priceMultiplier: 0.9 },
            'Powerjack': { tier: 'S', demand: 'very-high', sellDays: { fast: 1, normal: 3, collector: 8 }, priceMultiplier: 1.5 },
            'Axtinguisher': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 5, collector: 12 }, priceMultiplier: 1.3 },
            'Homewrecker': { tier: 'B', demand: 'medium', sellDays: { fast: 3, normal: 8, collector: 18 }, priceMultiplier: 1.1 },
            'Back Scratcher': { tier: 'B', demand: 'medium', sellDays: { fast: 4, normal: 10, collector: 22 }, priceMultiplier: 1.0 },
            'Neon Annihilator': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 30 }, priceMultiplier: 0.9 },
            'Third Degree': { tier: 'D', demand: 'low', sellDays: { fast: 7, normal: 18, collector: 40 }, priceMultiplier: 0.75 }
        }
    },
    // DEMOMAN
    demoman: {
        primary: {
            'Grenade Launcher': { tier: 'S', demand: 'very-high', sellDays: { fast: 1, normal: 3, collector: 7 }, priceMultiplier: 1.5 },
            'Iron Bomber': { tier: 'S', demand: 'very-high', sellDays: { fast: 1, normal: 3, collector: 8 }, priceMultiplier: 1.45 },
            'Loch-n-Load': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 5, collector: 14 }, priceMultiplier: 1.25 },
            'Loose Cannon': { tier: 'B', demand: 'medium', sellDays: { fast: 3, normal: 8, collector: 20 }, priceMultiplier: 1.1 },
            'Ali Baba\'s Wee Booties': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 30 }, priceMultiplier: 0.9 },
            'B.A.S.E. Jumper': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 30 }, priceMultiplier: 0.85 }
        },
        secondary: {
            'Stickybomb Launcher': { tier: 'S', demand: 'very-high', sellDays: { fast: 1, normal: 2, collector: 5 }, priceMultiplier: 1.6 },
            'Quickiebomb Launcher': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 5, collector: 12 }, priceMultiplier: 1.25 },
            'Scottish Resistance': { tier: 'B', demand: 'medium', sellDays: { fast: 3, normal: 8, collector: 20 }, priceMultiplier: 1.1 },
            'Chargin\' Targe': { tier: 'B', demand: 'medium', sellDays: { fast: 4, normal: 10, collector: 22 }, priceMultiplier: 1.0 },
            'Splendid Screen': { tier: 'B', demand: 'medium', sellDays: { fast: 4, normal: 10, collector: 22 }, priceMultiplier: 1.0 },
            'Tide Turner': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 28 }, priceMultiplier: 0.9 }
        },
        melee: {
            'Bottle': { tier: 'C', demand: 'low', sellDays: { fast: 4, normal: 10, collector: 25 }, priceMultiplier: 0.9 },
            'Eyelander': { tier: 'S', demand: 'very-high', sellDays: { fast: 1, normal: 3, collector: 7 }, priceMultiplier: 1.5 },
            'Half-Zatoichi': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 5, collector: 12 }, priceMultiplier: 1.3 },
            'Scotsman\'s Skullcutter': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 6, collector: 14 }, priceMultiplier: 1.2 },
            'Persian Persuader': { tier: 'B', demand: 'medium', sellDays: { fast: 3, normal: 8, collector: 20 }, priceMultiplier: 1.05 },
            'Claidheamh Mòr': { tier: 'B', demand: 'medium', sellDays: { fast: 4, normal: 10, collector: 22 }, priceMultiplier: 1.0 },
            'Ullapool Caber': { tier: 'D', demand: 'low', sellDays: { fast: 7, normal: 18, collector: 45 }, priceMultiplier: 0.7 }
        }
    },
    // HEAVY
    heavy: {
        primary: {
            'Minigun': { tier: 'S', demand: 'very-high', sellDays: { fast: 1, normal: 3, collector: 7 }, priceMultiplier: 1.5 },
            'Tomislav': { tier: 'S', demand: 'very-high', sellDays: { fast: 1, normal: 3, collector: 8 }, priceMultiplier: 1.45 },
            'Natascha': { tier: 'B', demand: 'medium', sellDays: { fast: 3, normal: 8, collector: 20 }, priceMultiplier: 1.1 },
            'Brass Beast': { tier: 'B', demand: 'medium', sellDays: { fast: 4, normal: 10, collector: 22 }, priceMultiplier: 1.0 },
            'Huo-Long Heater': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 30 }, priceMultiplier: 0.9 },
            'Iron Curtain': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 30 }, priceMultiplier: 0.85 }
        },
        secondary: {
            'Sandvich': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 5, collector: 12 }, priceMultiplier: 1.25 },
            'Shotgun': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 5, collector: 14 }, priceMultiplier: 1.2 },
            'Family Business': { tier: 'B', demand: 'medium', sellDays: { fast: 3, normal: 8, collector: 20 }, priceMultiplier: 1.05 },
            'Second Banana': { tier: 'B', demand: 'medium', sellDays: { fast: 4, normal: 10, collector: 22 }, priceMultiplier: 1.0 },
            'Dalokohs Bar': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 28 }, priceMultiplier: 0.9 },
            'Buffalo Steak Sandvich': { tier: 'D', demand: 'low', sellDays: { fast: 7, normal: 18, collector: 40 }, priceMultiplier: 0.75 }
        },
        melee: {
            'Fists': { tier: 'C', demand: 'low', sellDays: { fast: 4, normal: 10, collector: 25 }, priceMultiplier: 0.9 },
            'Fists of Steel': { tier: 'S', demand: 'very-high', sellDays: { fast: 1, normal: 3, collector: 8 }, priceMultiplier: 1.4 },
            'Gloves of Running Urgently': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 5, collector: 12 }, priceMultiplier: 1.3 },
            'Killing Gloves of Boxing': { tier: 'B', demand: 'medium', sellDays: { fast: 3, normal: 8, collector: 18 }, priceMultiplier: 1.1 },
            'Holiday Punch': { tier: 'B', demand: 'medium', sellDays: { fast: 4, normal: 10, collector: 22 }, priceMultiplier: 1.05 },
            'Eviction Notice': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 30 }, priceMultiplier: 0.9 },
            'Warrior\'s Spirit': { tier: 'D', demand: 'low', sellDays: { fast: 7, normal: 18, collector: 40 }, priceMultiplier: 0.75 }
        }
    },
    // ENGINEER
    engineer: {
        primary: {
            'Frontier Justice': { tier: 'S', demand: 'very-high', sellDays: { fast: 1, normal: 3, collector: 8 }, priceMultiplier: 1.5 },
            'Rescue Ranger': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 5, collector: 12 }, priceMultiplier: 1.3 },
            'Widowmaker': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 6, collector: 14 }, priceMultiplier: 1.25 },
            'Shotgun': { tier: 'B', demand: 'medium', sellDays: { fast: 3, normal: 8, collector: 18 }, priceMultiplier: 1.1 },
            'Pomson 6000': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 30 }, priceMultiplier: 0.9 },
            'Panic Attack': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 30 }, priceMultiplier: 0.85 }
        },
        secondary: {
            'Wrangler': { tier: 'S', demand: 'very-high', sellDays: { fast: 1, normal: 3, collector: 8 }, priceMultiplier: 1.45 },
            'Short Circuit': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 5, collector: 14 }, priceMultiplier: 1.2 },
            'Pistol': { tier: 'B', demand: 'medium', sellDays: { fast: 3, normal: 8, collector: 20 }, priceMultiplier: 1.05 },
            'Giger Counter': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 30 }, priceMultiplier: 0.9 },
            'C.A.P.P.E.R': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 30 }, priceMultiplier: 0.9 },
            'Lugermorph': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 28 }, priceMultiplier: 0.95 }
        },
        melee: {
            'Gunslinger': { tier: 'S', demand: 'very-high', sellDays: { fast: 1, normal: 3, collector: 7 }, priceMultiplier: 1.5 },
            'Jag': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 5, collector: 12 }, priceMultiplier: 1.3 },
            'Wrench': { tier: 'B', demand: 'medium', sellDays: { fast: 3, normal: 8, collector: 18 }, priceMultiplier: 1.1 },
            'Southern Hospitality': { tier: 'B', demand: 'medium', sellDays: { fast: 4, normal: 10, collector: 22 }, priceMultiplier: 1.0 },
            'Eureka Effect': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 30 }, priceMultiplier: 0.85 }
        }
    },
    // MEDIC
    medic: {
        primary: {
            'Crusader\'s Crossbow': { tier: 'S', demand: 'very-high', sellDays: { fast: 1, normal: 2, collector: 5 }, priceMultiplier: 1.6 },
            'Blutsauger': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 5, collector: 12 }, priceMultiplier: 1.25 },
            'Overdose': { tier: 'B', demand: 'medium', sellDays: { fast: 3, normal: 8, collector: 20 }, priceMultiplier: 1.05 },
            'Syringe Gun': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 30 }, priceMultiplier: 0.9 }
        },
        secondary: {
            'Medi Gun': { tier: 'S', demand: 'very-high', sellDays: { fast: 1, normal: 2, collector: 5 }, priceMultiplier: 1.7 },
            'Kritzkrieg': { tier: 'S', demand: 'very-high', sellDays: { fast: 1, normal: 3, collector: 7 }, priceMultiplier: 1.55 },
            'Quick-Fix': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 5, collector: 12 }, priceMultiplier: 1.25 },
            'Vaccinator': { tier: 'B', demand: 'medium', sellDays: { fast: 3, normal: 8, collector: 20 }, priceMultiplier: 1.1 }
        },
        melee: {
            'Ubersaw': { tier: 'S', demand: 'very-high', sellDays: { fast: 1, normal: 2, collector: 5 }, priceMultiplier: 1.7 },
            'Vita-Saw': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 5, collector: 12 }, priceMultiplier: 1.25 },
            'Amputator': { tier: 'B', demand: 'medium', sellDays: { fast: 3, normal: 8, collector: 20 }, priceMultiplier: 1.05 },
            'Solemn Vow': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 28 }, priceMultiplier: 0.9 },
            'Bonesaw': { tier: 'D', demand: 'low', sellDays: { fast: 7, normal: 18, collector: 40 }, priceMultiplier: 0.75 }
        }
    },
    // SNIPER
    sniper: {
        primary: {
            'Sniper Rifle': { tier: 'S', demand: 'very-high', sellDays: { fast: 1, normal: 3, collector: 7 }, priceMultiplier: 1.5 },
            'AWPer Hand': { tier: 'S', demand: 'very-high', sellDays: { fast: 1, normal: 3, collector: 8 }, priceMultiplier: 1.45 },
            'Huntsman': { tier: 'S', demand: 'very-high', sellDays: { fast: 1, normal: 3, collector: 8 }, priceMultiplier: 1.45 },
            'Machina': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 5, collector: 12 }, priceMultiplier: 1.3 },
            'Bazaar Bargain': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 6, collector: 14 }, priceMultiplier: 1.25 },
            'Hitman\'s Heatmaker': { tier: 'B', demand: 'medium', sellDays: { fast: 3, normal: 8, collector: 20 }, priceMultiplier: 1.1 },
            'Sydney Sleeper': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 30 }, priceMultiplier: 0.9 },
            'Classic': { tier: 'D', demand: 'low', sellDays: { fast: 7, normal: 18, collector: 40 }, priceMultiplier: 0.75 }
        },
        secondary: {
            'Jarate': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 5, collector: 12 }, priceMultiplier: 1.25 },
            'SMG': { tier: 'B', demand: 'medium', sellDays: { fast: 3, normal: 8, collector: 18 }, priceMultiplier: 1.1 },
            'Cleaner\'s Carbine': { tier: 'B', demand: 'medium', sellDays: { fast: 4, normal: 10, collector: 22 }, priceMultiplier: 1.0 },
            'Razorback': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 28 }, priceMultiplier: 0.9 },
            'Darwin\'s Danger Shield': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 30 }, priceMultiplier: 0.85 },
            'Cozy Camper': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 30 }, priceMultiplier: 0.85 }
        },
        melee: {
            'Bushwacka': { tier: 'S', demand: 'very-high', sellDays: { fast: 1, normal: 3, collector: 8 }, priceMultiplier: 1.45 },
            'Kukri': { tier: 'B', demand: 'medium', sellDays: { fast: 3, normal: 8, collector: 20 }, priceMultiplier: 1.05 },
            'Shahanshah': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 28 }, priceMultiplier: 0.9 },
            'Tribalman\'s Shiv': { tier: 'D', demand: 'low', sellDays: { fast: 7, normal: 18, collector: 40 }, priceMultiplier: 0.75 }
        }
    },
    // SPY
    spy: {
        primary: {
            'Ambassador': { tier: 'S', demand: 'very-high', sellDays: { fast: 1, normal: 3, collector: 7 }, priceMultiplier: 1.5 },
            'Diamondback': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 5, collector: 12 }, priceMultiplier: 1.3 },
            'L\'Etranger': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 6, collector: 14 }, priceMultiplier: 1.2 },
            'Revolver': { tier: 'B', demand: 'medium', sellDays: { fast: 3, normal: 8, collector: 18 }, priceMultiplier: 1.1 },
            'Enforcer': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 30 }, priceMultiplier: 0.9 },
            'Big Kill': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 30 }, priceMultiplier: 0.9 }
        },
        secondary: {
            'Sapper': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 5, collector: 14 }, priceMultiplier: 1.2 },
            'Ap-Sap': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 6, collector: 15 }, priceMultiplier: 1.15 },
            'Red-Tape Recorder': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 30 }, priceMultiplier: 0.85 },
            'Snack Attack': { tier: 'D', demand: 'low', sellDays: { fast: 7, normal: 18, collector: 40 }, priceMultiplier: 0.75 }
        },
        melee: {
            'Knife': { tier: 'S', demand: 'very-high', sellDays: { fast: 1, normal: 2, collector: 5 }, priceMultiplier: 1.6 },
            'Your Eternal Reward': { tier: 'S', demand: 'very-high', sellDays: { fast: 1, normal: 3, collector: 8 }, priceMultiplier: 1.5 },
            'Conniver\'s Kunai': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 5, collector: 12 }, priceMultiplier: 1.35 },
            'Spy-cicle': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 5, collector: 14 }, priceMultiplier: 1.25 },
            'Big Earner': { tier: 'B', demand: 'medium', sellDays: { fast: 3, normal: 8, collector: 20 }, priceMultiplier: 1.1 },
            'Sharp Dresser': { tier: 'B', demand: 'medium', sellDays: { fast: 4, normal: 10, collector: 22 }, priceMultiplier: 1.05 }
        }
    },
    // MULTICLASS
    multiclass: {
        melee: {
            'Frying Pan': { tier: 'S', demand: 'very-high', sellDays: { fast: 1, normal: 2, collector: 5 }, priceMultiplier: 1.8 },
            'Golden Frying Pan': { tier: 'S', demand: 'very-high', sellDays: { fast: 1, normal: 1, collector: 3 }, priceMultiplier: 3.0 },
            'Ham Shank': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 5, collector: 12 }, priceMultiplier: 1.3 },
            'Conscientious Objector': { tier: 'A', demand: 'high', sellDays: { fast: 2, normal: 6, collector: 14 }, priceMultiplier: 1.25 },
            'Crossing Guard': { tier: 'B', demand: 'medium', sellDays: { fast: 3, normal: 8, collector: 20 }, priceMultiplier: 1.05 },
            'Necro Smasher': { tier: 'B', demand: 'medium', sellDays: { fast: 4, normal: 10, collector: 22 }, priceMultiplier: 1.0 },
            'Memory Maker': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 30 }, priceMultiplier: 0.9 },
            'Bat Outta Hell': { tier: 'C', demand: 'low', sellDays: { fast: 5, normal: 14, collector: 30 }, priceMultiplier: 0.9 }
        }
    }
};

// ============================================
// SELLING STRATEGIES - Estrategias de venta
// ============================================
const SELLING_STRATEGIES = {
    fast: {
        id: 'fast',
        name: 'Venta Rápida',
        icon: '⚡',
        color: '#4CAF50',
        priceModifier: 0.85,  // 85% del precio base
        description: 'Vende rápido a precio bajo',
        tips: 'Ideal para liquidar inventario rápido',
        platforms: ['scrap.tf', 'trade.it', 'backpack.tf quicksell']
    },
    suggested: {
        id: 'suggested',
        name: 'Venta Sugerida',
        icon: '⭐',
        color: '#FF9800',
        priceModifier: 1.0,   // 100% del precio base
        description: 'Precio equilibrado, tiempo moderado',
        tips: 'Mejor balance precio/tiempo',
        platforms: ['backpack.tf', 'stntrading.eu', 'Steam Market']
    },
    collector: {
        id: 'collector',
        name: 'Venta Coleccionista',
        icon: '💎',
        color: '#9C27B0',
        priceModifier: 1.25,  // 125% del precio base
        description: 'Precio premium, espera a coleccionistas',
        tips: 'Para combinaciones raras o populares',
        platforms: ['backpack.tf trades', 'TF2 Trading forums', 'Discord servers']
    }
};

// ============================================
// STORAGE KEYS
// ============================================
const STORAGE_KEYS = {
    APP_DATA: 'tf2_mannco_forge_data',
    COMMUNITY_PRICES: 'tf2_community_prices',
    STEAM_MARKET_PRICES: 'tf2_steam_market_prices',
    REAL_ECONOMY: 'tf2_real_economy',
    PERSONAL_FAVORITES: 'tf2_personal_favorites',
    PROJECT_HISTORY: 'tf2_project_history'
};

// ============================================
// EXPORTACIONES GLOBALES
// ============================================

// Hacer las constantes accesibles globalmente (por si acaso)
window.SHEENS = SHEENS;
window.KILLSTREAKERS = KILLSTREAKERS;
window.ROBOT_PARTS = ROBOT_PARTS;
window.TIER_CONFIG = TIER_CONFIG;
window.PART_CATEGORY_CONFIG = PART_CATEGORY_CONFIG;
window.TF2_CLASSES = TF2_CLASSES;
window.WEAPON_SLOTS = WEAPON_SLOTS;
window.POPULAR_WEAPONS = POPULAR_WEAPONS;
window.CURRENCY_ITEMS = CURRENCY_ITEMS;
window.WORLD_CURRENCIES = WORLD_CURRENCIES;
window.CRAFTING_REQUIREMENTS = CRAFTING_REQUIREMENTS;
window.MARKET_STORES = MARKET_STORES;
window.SHEEN_DEMAND = SHEEN_DEMAND;
window.KILLSTREAKER_DEMAND = KILLSTREAKER_DEMAND;
window.COMBO_TIERS = COMBO_TIERS;
window.WEAPON_DEMAND = WEAPON_DEMAND;
window.SELLING_STRATEGIES = SELLING_STRATEGIES;
window.STORAGE_KEYS = STORAGE_KEYS;
window.CLASS_ROLES = CLASS_ROLES;
window.CLASS_ICON_URLS = CLASS_ICON_URLS;
window.getClassRole = getClassRole;

console.log('📦 data.js cargado');
