/**
 * TF2 MANN CO. FORGE - SISTEMA DE NOTIFICACIONES
 * Toast notifications y alertas
 */

// ============================================
// TOAST NOTIFICATIONS
// ============================================

/**
 * Muestra una notificación toast
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duración en ms (default: 3000)
 */
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;
    
    container.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    
    // Auto remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ============================================
// ALERTAS DEL DASHBOARD
// ============================================

/**
 * Cierra el banner de alerta
 */
function closeAlert() {
    const banner = document.getElementById('alertBanner');
    if (banner) banner.classList.add('hidden');
}

/**
 * Rota al siguiente mensaje de alerta
 */
function rotateAlert() {
    if (!appState.alerts || appState.alerts.length === 0) return;
    
    appState.currentAlertIndex = (appState.currentAlertIndex + 1) % appState.alerts.length;
    const alertText = document.querySelector('.alert-text');
    if (alertText) {
        alertText.textContent = appState.alerts[appState.currentAlertIndex];
    }
}

/**
 * Muestra una alerta específica
 */
function showAlertMessage(message) {
    const banner = document.getElementById('alertBanner');
    const alertText = document.querySelector('.alert-text');
    
    if (banner && alertText) {
        alertText.textContent = message;
        banner.classList.remove('hidden');
    }
}

// ============================================
// CONFIRMACIONES
// ============================================

/**
 * Muestra una confirmación rápida y ejecuta callback
 */
function confirmAction(message, callback) {
    showModal('Confirmar Acción', message, callback);
}

/**
 * Muestra una confirmación de eliminación
 */
function confirmDelete(itemName, callback) {
    showModal('Eliminar', `¿Estás seguro de eliminar "${itemName}"?`, callback);
}

// ============================================
// EXPORTACIONES GLOBALES
// ============================================

window.showToast = showToast;
window.closeAlert = closeAlert;
window.rotateAlert = rotateAlert;
window.showAlertMessage = showAlertMessage;
window.confirmAction = confirmAction;
window.confirmDelete = confirmDelete;

console.log('🔔 toasts.js cargado');
