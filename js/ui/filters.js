/**
 * TF2 MANN CO. FORGE - SISTEMA DE FILTROS
 * Filtros para mochila y otras secciones
 */

// ============================================
// FILTROS DE MOCHILA
// ============================================

/**
 * Inicializa los filtros de la mochila
 */
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            applyBackpackFilter(filter, button);
        });
    });
}

/**
 * Aplica un filtro a la mochila
 */
function applyBackpackFilter(filter, button) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Actualizar botón activo
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Obtener secciones
    const realMoneySection = document.getElementById('realMoneySection');
    const partsSection = document.getElementById('partsSection');
    const currencySection = document.getElementById('currencySection');
    const kitsSection = document.getElementById('kitsSection');
    
    // Ocultar todas primero
    if (realMoneySection) realMoneySection.style.display = 'none';
    if (partsSection) partsSection.style.display = 'none';
    if (currencySection) currencySection.style.display = 'none';
    if (kitsSection) kitsSection.style.display = 'none';
    
    // Mostrar según filtro
    switch (filter) {
        case 'all':
            if (realMoneySection) realMoneySection.style.display = '';
            if (partsSection) partsSection.style.display = '';
            if (currencySection) currencySection.style.display = '';
            if (kitsSection) kitsSection.style.display = '';
            break;
        case 'real-money':
            if (realMoneySection) realMoneySection.style.display = '';
            break;
        case 'parts':
            if (partsSection) partsSection.style.display = '';
            break;
        case 'currency':
            if (currencySection) currencySection.style.display = '';
            break;
        case 'kits':
            if (kitsSection) kitsSection.style.display = '';
            break;
    }
}

/**
 * Filtrar proyectos por tipo
 */
function filterProjects(type) {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        if (type === 'all') {
            card.style.display = '';
        } else {
            const projectType = card.dataset.type;
            card.style.display = projectType === type ? '' : 'none';
        }
    });
}

/**
 * Filtrar kits completados por tipo
 */
function filterCompletedKits(type) {
    const kitCategories = document.querySelectorAll('.kits-category');
    
    kitCategories.forEach(category => {
        if (type === 'all') {
            category.style.display = '';
        } else {
            const categoryType = category.dataset.kitType;
            category.style.display = categoryType === type ? '' : 'none';
        }
    });
}

/**
 * Buscar en el historial de proyectos
 */
function searchProjectHistory(query) {
    const historyItems = document.querySelectorAll('.history-item');
    const lowerQuery = query.toLowerCase();
    
    historyItems.forEach(item => {
        const weapon = item.dataset.weapon?.toLowerCase() || '';
        const matches = weapon.includes(lowerQuery);
        item.style.display = matches ? '' : 'none';
    });
}

/**
 * Filtra combinaciones en la matriz de combos por tier
 */
function filterCombos(tier) {
    // Actualizar botones activos
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === tier);
    });
    
    // Filtrar celdas de la matriz
    const cells = document.querySelectorAll('.combo-cell');
    cells.forEach(cell => {
        if (tier === 'all') {
            cell.classList.remove('filtered-out');
        } else {
            cell.classList.toggle('filtered-out', cell.dataset.tier !== tier);
        }
    });
}

// ============================================
// EXPORTACIONES GLOBALES
// ============================================

window.initFilters = initFilters;
window.applyBackpackFilter = applyBackpackFilter;
window.filterProjects = filterProjects;
window.filterCompletedKits = filterCompletedKits;
window.searchProjectHistory = searchProjectHistory;
window.filterCombos = filterCombos;

console.log('🔍 filters.js cargado');
