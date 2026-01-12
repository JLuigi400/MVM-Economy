// ============================================
// MAIN - Inicialización de la Aplicación
// TF2 Mann Co. Forge - MvM Economy Dashboard
// ============================================

// ============================================
// INICIALIZACIÓN PRINCIPAL
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔥 TF2 Mann Co. Forge - Inicializando...');
    
    // Inicializar inventario de partes primero
    initializePartsInventory();
    
    // Cargar datos guardados desde localStorage
    loadFromStorage();
    loadPersonalFavorites();
    loadProjectHistory();
    loadCommunityPrices();
    loadSteamMarketPrices();
    loadRealEconomy();
    
    // Re-inicializar partes por si hay nuevas
    initializePartsInventory();
    
    // Inicializar componentes de UI
    initTabs();
    initModalEvents();
    
    // Inicializar secciones principales
    initBackpack();
    initForge();
    initCalculator();
    initMarket();
    
    // Inicializar calculadora de rentabilidad
    initProfitCalculator();
    
    // Inicializar sistema de favoritos
    populateFavoriteSelects();
    renderFavoritesList();
    
    // Renderizar historial de ventas
    renderProjectHistory();
    
    // Renderizar kits completados
    renderCompletedKits();
    
    // Actualizar dashboard inicial
    updateDashboard();
    
    // Configurar event listeners adicionales
    setupEventListeners();
    
    // Rotar alertas cada 10 segundos
    setInterval(rotateAlert, 10000);
    
    console.log('✅ Aplicación inicializada correctamente');
});

// ============================================
// EVENT LISTENERS ADICIONALES
// ============================================

function setupEventListeners() {
    // Listener para cambio de tab
    onTabChange((tabId) => {
        console.log(`📑 Tab cambiado a: ${tabId}`);
        
        // Actualizar componentes según el tab
        switch (tabId) {
            case 'dashboard':
                updateDashboard();
                break;
            case 'backpack':
                // La mochila ya está renderizada
                break;
            case 'forge':
                renderProjectsList();
                renderMarketProjects();
                break;
            case 'calculator':
                updateProfitCalculator();
                renderFavoritesList();
                break;
            case 'market':
                renderMarketTable();
                renderMarketProjects();
                break;
        }
    });
    
    // Listener para cierre de modales con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeCustomModal();
            closeImagePreview();
            closePopularityModal();
            closePriceModal();
        }
    });
    
    // Listener para cambios en el formulario de proyecto
    // NOTA: El listener principal está en forge.js - este solo es backup
    const kitTypeSelect = document.getElementById('kitType');
    if (kitTypeSelect) {
        kitTypeSelect.addEventListener('change', (e) => {
            const type = e.target.value;
            if (typeof updateForgeFormFields === 'function') {
                updateForgeFormFields(type);
            }
        });
    }
    
    // Listener para cambios en clases del simulador de rentabilidad
    const profitClassSelect = document.getElementById('profitClass');
    if (profitClassSelect) {
        profitClassSelect.addEventListener('change', updateProfitWeapons);
    }
    
    const profitSlotSelect = document.getElementById('profitSlot');
    if (profitSlotSelect) {
        profitSlotSelect.addEventListener('change', updateProfitWeapons);
    }
    
    // Listener para cambios en calculadora de rentabilidad
    ['profitKitType', 'profitSheen', 'profitKillstreaker'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', updateProfitCalculator);
        }
    });
    
    // Listeners para sistema de favoritos
    const favClassSelect = document.getElementById('favClass');
    if (favClassSelect) {
        favClassSelect.addEventListener('change', updateFavoriteWeapons);
    }
    
    const favSlotSelect = document.getElementById('favSlot');
    if (favSlotSelect) {
        favSlotSelect.addEventListener('change', updateFavoriteWeapons);
    }
    
    // Listener para búsqueda en historial
    const historySearch = document.getElementById('historySearch');
    if (historySearch) {
        historySearch.addEventListener('input', (e) => {
            searchProjectHistory(e.target.value);
        });
    }
    
    // Listener para filtros de kits completados
    const completedKitFilter = document.getElementById('completedKitFilter');
    if (completedKitFilter) {
        completedKitFilter.addEventListener('change', () => {
            filterCompletedKits(completedKitFilter.value);
        });
    }
    
    // Listener para filtros de proyectos
    const projectFilter = document.getElementById('projectFilter');
    if (projectFilter) {
        projectFilter.addEventListener('change', () => {
            filterProjects(projectFilter.value);
        });
    }
    
    // Listener para filtros de mochila
    const backpackFilter = document.getElementById('backpackFilter');
    if (backpackFilter) {
        backpackFilter.addEventListener('change', () => {
            applyBackpackFilter(backpackFilter.value);
        });
    }
}

// ============================================
// FUNCIONES DE UTILIDAD GLOBAL
// ============================================

// Función para formatear fechas
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Función para formatear fecha con hora
function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Función para capitalizar primera letra
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Función para debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// FUNCIONES PARA NOTIFICACIONES (alias)
// ============================================

// Alias para compatibilidad
function showNotification(message, type = 'info') {
    showToast(message, type);
}

// ============================================
// EXPORTACIONES GLOBALES
// ============================================

// Solo exportar las funciones definidas en este archivo (main.js)
window.formatDate = formatDate;
window.formatDateTime = formatDateTime;
window.capitalize = capitalize;
window.debounce = debounce;
window.showNotification = showNotification;
window.setupEventListeners = setupEventListeners;
window.rotateAlert = rotateAlert;

console.log('🚀 main.js cargado');
