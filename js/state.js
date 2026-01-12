/**
 * TF2 MANN CO. FORGE - ESTADO DE LA APLICACIÓN
 * Variables de estado globales y configuración
 */

// ============================================
// ESTADO PRINCIPAL
// ============================================

let appState = {
    inventory: {
        currency: {
            scrap: 0,
            reclaimed: 0,
            refined: 0,
            keys: 0
        },
        parts: {},
        completedKits: {
            basic: [],
            specialized: [],
            professional: []
        }
    },
    projects: [],
    settings: {
        scrapValue: 0.11,
        recValue: 0.33,
        refValue: 1,
        keyValue: 56
    },
    alerts: [
        "¡Bienvenido a Mann Co. Forge! Gestiona tu inventario MvM como un profesional.",
        "💡 Tip: Los kits Professional requieren más valor pero tienen mayor demanda.",
        "📈 El precio de las Keys puede fluctuar. ¡Mantén actualizado el valor!"
    ],
    currentAlertIndex: 0
};

// ============================================
// ECONOMÍA REAL DEL USUARIO
// ============================================

let realEconomy = {
    localCurrency: 'MXN',
    localToUsd: 0.049,
    steamWallet: 0,
    mannCoKeyPrice: 47.49,
    storeKeyPrices: {
        scrap_tf: { buy: 56, sell: 54, currency: 'ref' },
        backpack_tf: { buy: 56.5, sell: 55, currency: 'ref' },
        stn_trading: { buy: 57, sell: 54.5, currency: 'ref' },
        tradeit_gg: { buy: 1.89, sell: 1.75, currency: 'usd' },
        steam_market: { buy: 49.99, sell: null, currency: 'local' }
    },
    priceHistory: {
        communityKey: [],
        mannCoKey: []
    }
};

// ============================================
// PRECIOS DE MERCADO (EDITABLES)
// ============================================

const MARKET_PRICES = {
    kb_808: {
        scrap_tf: 1.11,
        backpack_tf: { min: 0.88, max: 1.11 },
        stn_trading: 1.22,
        tradeit_gg: 0.05,
        steam_market: 0.62
    },
    money_furnace: {
        scrap_tf: 1.11,
        backpack_tf: { min: 0.88, max: 1.11 },
        stn_trading: 1.22,
        tradeit_gg: 0.05,
        steam_market: 0.64
    },
    taunt_processor: {
        scrap_tf: 1.11,
        backpack_tf: { min: 0.88, max: 1.11 },
        stn_trading: 1.22,
        tradeit_gg: 0.05,
        steam_market: 0.62
    },
    bomb_stabilizer: {
        scrap_tf: 0.11,
        backpack_tf: { min: 0.05, max: 0.11 },
        stn_trading: 0.22,
        tradeit_gg: null,
        steam_market: 0.10
    },
    emotion_detector: {
        scrap_tf: 0.11,
        backpack_tf: { min: 0.05, max: 0.11 },
        stn_trading: 0.22,
        tradeit_gg: null,
        steam_market: 0.10
    },
    humor_suppression: {
        scrap_tf: 0.11,
        backpack_tf: { min: 0.05, max: 0.11 },
        stn_trading: 0.11,
        tradeit_gg: null,
        steam_market: 0.09
    },
    brainstorm_bulb: {
        scrap_tf: 2.44,
        backpack_tf: { min: 2.44, max: 2.55 },
        stn_trading: 2.66,
        tradeit_gg: 0.12,
        steam_market: 1.46
    },
    currency_digester: {
        scrap_tf: 2.44,
        backpack_tf: { min: 2.22, max: 2.66 },
        stn_trading: 2.55,
        tradeit_gg: 0.11,
        steam_market: 1.51
    }
};

// ============================================
// PRECIOS DE COMUNIDAD (EDITABLES POR USUARIO)
// ============================================

let communityPrices = {
    kb_808: null,
    money_furnace: null,
    taunt_processor: null,
    bomb_stabilizer: null,
    emotion_detector: null,
    humor_suppression: null,
    brainstorm_bulb: null,
    currency_digester: null
};

let steamMarketPrices = {
    kb_808: null,
    money_furnace: null,
    taunt_processor: null,
    bomb_stabilizer: null,
    emotion_detector: null,
    humor_suppression: null,
    brainstorm_bulb: null,
    currency_digester: null
};

// ============================================
// HISTORIAL Y FAVORITOS
// ============================================

let projectHistory = [];
let personalFavorites = [];

// ============================================
// VARIABLES DE CONTROL DE UI
// ============================================

let currentPriceModal = null;
let modalCallback = null;

// ============================================
// TASAS DE CONVERSIÓN
// ============================================

const CURRENCY_CONVERSION = {
    refToUsd: 0.018,
    usdToRef: 55.56,
    mxnToUsd: 0.049,
    usdToMxn: 20.40
};

// ============================================
// INICIALIZAR PARTES EN INVENTARIO
// ============================================

function initializePartsInventory() {
    if (typeof ROBOT_PARTS !== 'undefined') {
        ROBOT_PARTS.forEach(part => {
            if (appState.inventory.parts[part.id] === undefined) {
                appState.inventory.parts[part.id] = 0;
            }
        });
    }
}

// ============================================
// EXPORTACIONES GLOBALES
// ============================================

window.appState = appState;
window.realEconomy = realEconomy;
window.MARKET_PRICES = MARKET_PRICES;
window.communityPrices = communityPrices;
window.steamMarketPrices = steamMarketPrices;
window.projectHistory = projectHistory;
window.personalFavorites = personalFavorites;
window.currentPriceModal = currentPriceModal;
window.modalCallback = modalCallback;
window.CURRENCY_CONVERSION = CURRENCY_CONVERSION;
window.initializePartsInventory = initializePartsInventory;

console.log('📊 state.js cargado');
