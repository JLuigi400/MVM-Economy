/**
 * TF2 MANN CO. FORGE - DASHBOARD
 * Funciones del dashboard principal
 */

// ============================================
// ACTUALIZAR DASHBOARD
// ============================================

/**
 * Actualiza todos los elementos del dashboard
 */
function updateDashboard() {
    updateDashboardCurrency();
    updateDashboardProjects();
    renderDashboardPartsGrid();
    calculateTotalValue();
}

/**
 * Actualiza los contadores de currency
 */
function updateDashboardCurrency() {
    const currency = appState.inventory.currency;
    
    const scrapEl = document.getElementById('dash-scrap');
    const recEl = document.getElementById('dash-rec');
    const refEl = document.getElementById('dash-ref');
    const keysEl = document.getElementById('dash-keys');
    
    if (scrapEl) scrapEl.textContent = currency.scrap;
    if (recEl) recEl.textContent = currency.reclaimed;
    if (refEl) refEl.textContent = currency.refined;
    if (keysEl) keysEl.textContent = currency.keys;
}

/**
 * Actualiza los contadores de proyectos
 */
function updateDashboardProjects() {
    const specialized = appState.projects.filter(p => p.type === 'specialized').length;
    const professional = appState.projects.filter(p => p.type === 'professional').length;
    const ready = appState.projects.filter(p => isProjectReady(p)).length;
    
    const specEl = document.getElementById('dash-specialized');
    const profEl = document.getElementById('dash-professional');
    const readyEl = document.getElementById('dash-ready');
    
    if (specEl) specEl.textContent = specialized;
    if (profEl) profEl.textContent = professional;
    if (readyEl) readyEl.textContent = ready;
}

/**
 * Renderiza el grid de partes en el dashboard
 */
function renderDashboardPartsGrid() {
    const grid = document.getElementById('dashboardPartsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    ROBOT_PARTS.forEach(part => {
        const count = appState.inventory.parts[part.id] || 0;
        const categoryConfig = PART_CATEGORY_CONFIG[part.category];
        
        // Nombre corto sin prefijo de categoría
        const shortName = part.name
            .replace('Pristine Robot ', '')
            .replace('Reinforced Robot ', '')
            .replace('Battle-Worn Robot ', '');
        
        const card = document.createElement('div');
        card.className = 'part-card dashboard-card';
        card.innerHTML = `
            <div class="dash-card-header">
                <span class="dash-card-name">${shortName}</span>
            </div>
            <div class="dash-card-body">
                <div class="dash-card-image">
                    <img src="${part.image}" alt="${part.name}" loading="lazy">
                </div>
                <div class="dash-card-counter">
                    <span class="dash-count ${count === 0 ? 'zero' : ''}">${count}</span>
                </div>
            </div>
            <div class="dash-card-footer">
                <span class="dash-card-category" style="color: ${categoryConfig.color}">${categoryConfig.label}</span>
            </div>
        `;
        grid.appendChild(card);
    });
}

/**
 * Verificar si un proyecto está listo para completarse
 */
function isProjectReady(project) {
    if (!project.requirements) return false;
    
    for (const [partId, required] of Object.entries(project.requirements)) {
        const available = appState.inventory.parts[partId] || 0;
        if (available < required) return false;
    }
    
    return true;
}

// ============================================
// EXPORTACIONES GLOBALES
// ============================================

window.updateDashboard = updateDashboard;
window.updateDashboardCurrency = updateDashboardCurrency;
window.updateDashboardProjects = updateDashboardProjects;
window.renderDashboardPartsGrid = renderDashboardPartsGrid;
window.isProjectReady = isProjectReady;

console.log('📊 dashboard.js cargado');
