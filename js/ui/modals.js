/**
 * TF2 MANN CO. FORGE - SISTEMA DE MODALES
 * Funciones básicas para gestión de modales genéricos
 */

// Nota: modalCallback está declarado en state.js

// ============================================
// MODAL DE CONFIRMACIÓN
// ============================================

/**
 * Muestra un modal de confirmación
 * @param {string} title - Título del modal
 * @param {string} message - Mensaje a mostrar
 * @param {Function} callback - Función a ejecutar si confirma
 */
function showModal(title, message, callback) {
    const modal = document.getElementById('modalOverlay');
    const titleEl = document.getElementById('modalTitle');
    const messageEl = document.getElementById('modalMessage');
    const confirmBtn = document.getElementById('modalConfirm');
    
    if (!modal) return;
    
    if (titleEl) titleEl.textContent = title;
    if (messageEl) messageEl.textContent = message;
    modalCallback = callback;
    
    // Remover listener anterior y agregar nuevo
    if (confirmBtn) {
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        
        newConfirmBtn.addEventListener('click', () => {
            if (modalCallback) modalCallback();
            closeModal();
        });
    }
    
    modal.classList.add('active');
}

/**
 * Cierra todos los modales
 */
function closeModal() {
    // Cerrar modal de confirmación
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) modalOverlay.classList.remove('active');
    
    // Cerrar modal dinámico
    const dynamicModal = document.getElementById('modal');
    if (dynamicModal) dynamicModal.classList.remove('active');
    
    modalCallback = null;
}

// ============================================
// MODAL DINÁMICO (CUSTOM)
// ============================================

/**
 * Muestra un modal personalizado con contenido dinámico
 * @param {string} title - Título del modal
 * @param {string} content - HTML del contenido
 */
function showCustomModal(title, content) {
    // Crear overlay si no existe
    let overlay = document.getElementById('customModalOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'customModalOverlay';
        overlay.className = 'custom-modal-overlay';
        overlay.innerHTML = `
            <div class="custom-modal">
                <div class="custom-modal-header">
                    <h3 id="customModalTitle"></h3>
                    <button class="custom-modal-close" onclick="closeCustomModal()">✕</button>
                </div>
                <div class="custom-modal-body" id="customModalBody"></div>
            </div>
        `;
        document.body.appendChild(overlay);
    }
    
    document.getElementById('customModalTitle').textContent = title;
    document.getElementById('customModalBody').innerHTML = content;
    overlay.classList.add('active');
}

/**
 * Cierra el modal personalizado
 */
function closeCustomModal() {
    const overlay = document.getElementById('customModalOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// ============================================
// MODAL DE VISTA PREVIA DE IMAGEN
// ============================================

/**
 * Muestra vista previa de una imagen
 */
function showImagePreview(imgSrc, title = '') {
    const modal = document.getElementById('imagePreviewModal');
    const img = document.getElementById('previewImage');
    const titleEl = document.getElementById('previewTitle');
    
    if (!modal || !img) return;
    
    img.src = imgSrc;
    if (titleEl && title) titleEl.textContent = title;
    
    modal.classList.add('active');
}

/**
 * Cierra la vista previa de imagen
 */
function closeImagePreview(event) {
    if (event && event.target !== event.currentTarget) return;
    const modal = document.getElementById('imagePreviewModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Abre vista previa detallada de un sheen o killstreaker
 * @param {string} type - 'sheen' o 'killstreaker'
 * @param {string} id - ID del item
 */
function openImagePreview(type, id) {
    const modal = document.getElementById('imagePreviewModal');
    const previewImg = document.getElementById('previewImage');
    const previewTitle = document.getElementById('previewTitle');
    const previewMeta = document.getElementById('previewMeta');
    
    if (!modal || !previewImg || !previewTitle || !previewMeta) return;
    
    let item, tierConfig, demandData;
    
    if (type === 'sheen') {
        item = SHEENS.find(s => s.id === id);
        if (!item) return;
        
        tierConfig = TIER_CONFIG[item.tier];
        demandData = SHEEN_DEMAND[id];
        
        previewImg.src = item.imageRed || item.image;
        previewTitle.textContent = item.name;
        previewTitle.style.color = item.color;
        
        previewMeta.innerHTML = `
            <div class="preview-tier" style="background: ${tierConfig.color}">
                ${tierConfig.icon} ${tierConfig.label}
            </div>
            <div class="preview-stats">
                <div class="preview-stat">
                    <span class="stat-label">Tipo</span>
                    <span class="stat-value">Sheen (Brillo)</span>
                </div>
                <div class="preview-stat">
                    <span class="stat-label">Color</span>
                    <span class="stat-value">
                        <span class="color-swatch" style="background: ${item.color}"></span>
                        ${item.color}
                    </span>
                </div>
                <div class="preview-stat">
                    <span class="stat-label">Multiplicador</span>
                    <span class="stat-value ${demandData.multiplier >= 1 ? 'positive' : 'negative'}">
                        ${demandData.multiplier >= 1 ? '+' : ''}${((demandData.multiplier - 1) * 100).toFixed(0)}%
                    </span>
                </div>
                <div class="preview-stat">
                    <span class="stat-label">Demanda</span>
                    <span class="stat-value demand-${demandData.demand}">${getDemandLabel(demandData.demand)}</span>
                </div>
                <div class="preview-stat">
                    <span class="stat-label">Velocidad de Venta</span>
                    <span class="stat-value speed-${demandData.sellSpeed}">${getSellSpeedLabel(demandData.sellSpeed)}</span>
                </div>
            </div>
            <p class="preview-note">${demandData.note}</p>
            ${item.id === 'team_shine' ? `
                <div class="preview-variants">
                    <span class="variant-label">Variantes de equipo:</span>
                    <div class="variant-images">
                        <img src="${item.imageRed}" alt="Team Shine RED" class="variant-img" title="RED Team">
                        <img src="${item.imageBlu}" alt="Team Shine BLU" class="variant-img" title="BLU Team">
                    </div>
                </div>
            ` : ''}
        `;
    } else if (type === 'killstreaker') {
        item = KILLSTREAKERS.find(k => k.id === id);
        if (!item) return;
        
        tierConfig = TIER_CONFIG[item.tier];
        demandData = KILLSTREAKER_DEMAND[id];
        
        previewImg.src = item.image;
        previewTitle.textContent = item.name;
        previewTitle.style.color = tierConfig.color;
        
        previewMeta.innerHTML = `
            <div class="preview-tier" style="background: ${tierConfig.color}">
                ${tierConfig.icon} ${tierConfig.label}
            </div>
            <div class="preview-stats">
                <div class="preview-stat">
                    <span class="stat-label">Tipo</span>
                    <span class="stat-value">Killstreaker (Efecto Ocular)</span>
                </div>
                <div class="preview-stat">
                    <span class="stat-label">Activación</span>
                    <span class="stat-value">5+ Kills en racha</span>
                </div>
                <div class="preview-stat">
                    <span class="stat-label">Multiplicador</span>
                    <span class="stat-value ${demandData.multiplier >= 1 ? 'positive' : 'negative'}">
                        ${demandData.multiplier >= 1 ? '+' : ''}${((demandData.multiplier - 1) * 100).toFixed(0)}%
                    </span>
                </div>
                <div class="preview-stat">
                    <span class="stat-label">Demanda</span>
                    <span class="stat-value demand-${demandData.demand}">${getDemandLabel(demandData.demand)}</span>
                </div>
                <div class="preview-stat">
                    <span class="stat-label">Velocidad de Venta</span>
                    <span class="stat-value speed-${demandData.sellSpeed}">${getSellSpeedLabel(demandData.sellSpeed)}</span>
                </div>
            </div>
            <p class="preview-note">${demandData.note}</p>
        `;
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ============================================
// INICIALIZAR EVENTOS DE MODALES
// ============================================

function initModalEvents() {
    // Cerrar modal de confirmación al hacer clic fuera
    document.getElementById('modalOverlay')?.addEventListener('click', (e) => {
        if (e.target === document.getElementById('modalOverlay')) {
            closeModal();
        }
    });
    
    // Cerrar modal dinámico al hacer clic fuera
    document.getElementById('modal')?.addEventListener('click', (e) => {
        if (e.target === document.getElementById('modal')) {
            closeModal();
        }
    });
    
    // Cerrar modal de imagen al hacer clic fuera
    document.getElementById('imagePreviewModal')?.addEventListener('click', (e) => {
        if (e.target === document.getElementById('imagePreviewModal')) {
            closeImagePreview();
        }
    });
}

// ============================================
// EXPORTACIONES GLOBALES
// ============================================

window.showModal = showModal;
window.closeModal = closeModal;
window.showCustomModal = showCustomModal;
window.closeCustomModal = closeCustomModal;
window.showImagePreview = showImagePreview;
window.closeImagePreview = closeImagePreview;
window.openImagePreview = openImagePreview;
window.initModalEvents = initModalEvents;

console.log('🪟 modals.js cargado');
