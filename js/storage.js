/**
 * TF2 MANN CO. FORGE - ALMACENAMIENTO LOCAL
 * Funciones de localStorage para persistencia de datos
 */

// ============================================
// CLAVES DE STORAGE
// ============================================

const STORAGE_KEY = 'tf2_mannco_forge_data';
const COMMUNITY_PRICES_KEY = 'tf2_community_prices';
const STEAM_MARKET_PRICES_KEY = 'tf2_steam_market_prices';
const REAL_ECONOMY_KEY = 'tf2_real_economy';
const PERSONAL_FAVORITES_KEY = 'tf2_personal_favorites';
const PROJECT_HISTORY_KEY = 'tf2_project_history';

// ============================================
// GUARDAR DATOS
// ============================================

function saveToStorage() {
    try {
        const dataToSave = {
            inventory: appState.inventory,
            projects: appState.projects,
            settings: appState.settings
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
        console.error('Error guardando en localStorage:', error);
        showToast('Error al guardar datos', 'error');
    }
}

function saveCommunityPrices() {
    try {
        localStorage.setItem(COMMUNITY_PRICES_KEY, JSON.stringify(communityPrices));
    } catch (error) {
        console.error('Error guardando precios de comunidad:', error);
    }
}

function saveSteamMarketPrices() {
    try {
        localStorage.setItem(STEAM_MARKET_PRICES_KEY, JSON.stringify(steamMarketPrices));
    } catch (error) {
        console.error('Error guardando precios de Steam Market:', error);
    }
}

function saveRealEconomy() {
    try {
        localStorage.setItem(REAL_ECONOMY_KEY, JSON.stringify(realEconomy));
    } catch (error) {
        console.error('Error guardando economía real:', error);
    }
}

function savePersonalFavorites() {
    try {
        localStorage.setItem(PERSONAL_FAVORITES_KEY, JSON.stringify(personalFavorites));
    } catch (error) {
        console.error('Error guardando favoritos:', error);
    }
}

function saveProjectHistory() {
    try {
        localStorage.setItem(PROJECT_HISTORY_KEY, JSON.stringify(projectHistory));
    } catch (error) {
        console.error('Error guardando historial de proyectos:', error);
    }
}

// ============================================
// CARGAR DATOS
// ============================================

function loadFromStorage() {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            const parsed = JSON.parse(savedData);
            
            if (parsed.inventory) {
                appState.inventory.currency = { ...appState.inventory.currency, ...parsed.inventory.currency };
                // Merge parts, manteniendo las claves existentes
                Object.keys(parsed.inventory.parts || {}).forEach(key => {
                    appState.inventory.parts[key] = parsed.inventory.parts[key];
                });
                if (parsed.inventory.completedKits) {
                    appState.inventory.completedKits = {
                        basic: parsed.inventory.completedKits.basic || [],
                        specialized: parsed.inventory.completedKits.specialized || [],
                        professional: parsed.inventory.completedKits.professional || []
                    };
                }
            }
            
            if (parsed.projects) {
                appState.projects = parsed.projects;
            }
            
            if (parsed.settings) {
                appState.settings = { ...appState.settings, ...parsed.settings };
            }
            
            console.log('✅ Datos cargados desde localStorage');
        }
    } catch (error) {
        console.error('Error cargando desde localStorage:', error);
    }
}

function loadCommunityPrices() {
    try {
        const saved = localStorage.getItem(COMMUNITY_PRICES_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            Object.assign(communityPrices, parsed);
        }
    } catch (error) {
        console.error('Error cargando precios de comunidad:', error);
    }
}

function loadSteamMarketPrices() {
    try {
        const saved = localStorage.getItem(STEAM_MARKET_PRICES_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            Object.assign(steamMarketPrices, parsed);
        }
    } catch (error) {
        console.error('Error cargando precios de Steam Market:', error);
    }
}

function loadRealEconomy() {
    try {
        const saved = localStorage.getItem(REAL_ECONOMY_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            Object.assign(realEconomy, parsed);
        }
    } catch (error) {
        console.error('Error cargando economía real:', error);
    }
}

function loadPersonalFavorites() {
    try {
        const saved = localStorage.getItem(PERSONAL_FAVORITES_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            personalFavorites.length = 0; // Vaciar array
            parsed.forEach(item => personalFavorites.push(item));
        }
    } catch (error) {
        console.error('Error cargando favoritos:', error);
    }
}

function loadProjectHistory() {
    try {
        const saved = localStorage.getItem(PROJECT_HISTORY_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            projectHistory.length = 0; // Vaciar array
            parsed.forEach(item => projectHistory.push(item));
        }
    } catch (error) {
        console.error('Error cargando historial de proyectos:', error);
    }
}

// ============================================
// CARGAR TODO
// ============================================

function loadAllData() {
    loadFromStorage();
    loadCommunityPrices();
    loadSteamMarketPrices();
    loadRealEconomy();
    loadPersonalFavorites();
    loadProjectHistory();
    initializePartsInventory();
    console.log('✅ Todos los datos cargados');
}

// ============================================
// LIMPIAR DATOS (para reset)
// ============================================

function clearAllData() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(COMMUNITY_PRICES_KEY);
    localStorage.removeItem(STEAM_MARKET_PRICES_KEY);
    localStorage.removeItem(REAL_ECONOMY_KEY);
    localStorage.removeItem(PERSONAL_FAVORITES_KEY);
    localStorage.removeItem(PROJECT_HISTORY_KEY);
    console.log('🗑️ Todos los datos eliminados');
}

// ============================================
// EXPORTACIONES GLOBALES
// ============================================

window.saveToStorage = saveToStorage;
window.loadFromStorage = loadFromStorage;
window.saveCommunityPrices = saveCommunityPrices;
window.loadCommunityPrices = loadCommunityPrices;
window.saveSteamMarketPrices = saveSteamMarketPrices;
window.loadSteamMarketPrices = loadSteamMarketPrices;
window.saveRealEconomy = saveRealEconomy;
window.loadRealEconomy = loadRealEconomy;
window.savePersonalFavorites = savePersonalFavorites;
window.loadPersonalFavorites = loadPersonalFavorites;
window.saveProjectHistory = saveProjectHistory;
window.loadProjectHistory = loadProjectHistory;
window.loadAllData = loadAllData;
window.clearAllData = clearAllData;

console.log('💾 storage.js cargado');
