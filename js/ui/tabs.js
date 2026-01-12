/**
 * TF2 MANN CO. FORGE - NAVEGACIÓN POR TABS
 * Control de tabs y navegación
 */

// ============================================
// CALLBACKS DE CAMBIO DE TAB
// ============================================

let tabChangeCallbacks = [];

/**
 * Registra un callback para cuando cambia el tab
 * @param {function} callback - Función a llamar cuando cambie el tab
 */
function onTabChange(callback) {
    if (typeof callback === 'function') {
        tabChangeCallbacks.push(callback);
    }
}

/**
 * Ejecuta todos los callbacks registrados
 * @param {string} tabId - ID del tab activo
 */
function executeTabChangeCallbacks(tabId) {
    tabChangeCallbacks.forEach(callback => callback(tabId));
}

// ============================================
// INICIALIZACIÓN DE TABS
// ============================================

/**
 * Inicializa el sistema de tabs
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    console.log(`📑 initTabs: Encontrados ${tabButtons.length} botones y ${tabContents.length} contenidos`);
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            console.log(`📑 Tab clickeado: ${targetTab}`);
            switchToTab(targetTab);
        });
    });
    
    console.log('📑 Tabs inicializados correctamente');
}

/**
 * Cambia a un tab específico
 * @param {string} tabId - ID del tab a mostrar
 */
function switchToTab(tabId) {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    console.log(`📑 switchToTab llamado con: ${tabId}`);
    console.log(`📑 Botones encontrados: ${tabButtons.length}, Contenidos encontrados: ${tabContents.length}`);
    
    // Remover clase active de todos
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Agregar clase active al seleccionado
    const targetButton = document.querySelector(`[data-tab="${tabId}"]`);
    const targetContent = document.getElementById(tabId);
    
    console.log(`📑 Botón encontrado: ${!!targetButton}, Contenido encontrado: ${!!targetContent}`);
    
    if (targetButton) {
        targetButton.classList.add('active');
        console.log(`📑 Clase 'active' agregada al botón`);
    }
    if (targetContent) {
        targetContent.classList.add('active');
        console.log(`📑 Clase 'active' agregada al contenido: ${targetContent.id}`);
        console.log(`📑 Clases del contenido: ${targetContent.className}`);
    }
    
    // Ejecutar callbacks registrados
    executeTabChangeCallbacks(tabId);
}

/**
 * Obtiene el tab activo actual
 */
function getActiveTab() {
    const activeButton = document.querySelector('.tab-btn.active');
    return activeButton ? activeButton.dataset.tab : 'dashboard';
}

// ============================================
// EXPORTACIONES GLOBALES
// ============================================

window.initTabs = initTabs;
window.switchToTab = switchToTab;
window.onTabChange = onTabChange;
window.getActiveTab = getActiveTab;

console.log('📑 tabs.js cargado');
