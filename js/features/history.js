// ============================================
// HISTORIAL DE VENTAS - Gestión y Renderizado
// ============================================

// ============================================
// RENDERIZADO
// ============================================

function renderProjectHistory() {
    const container = document.getElementById('historyList');
    if (!container) return;
    
    if (projectHistory.length === 0) {
        container.innerHTML = `
            <div class="empty-history">
                <span class="empty-icon">📭</span>
                <p>No hay ventas registradas</p>
                <p class="empty-hint">Completa proyectos y registra tus ventas para ver estadísticas</p>
            </div>
        `;
        updateHistoryStats();
        return;
    }
    
    container.innerHTML = projectHistory.map(entry => {
        const sheenInfo = SHEENS.find(s => s.id === entry.sheen);
        const killstreakerInfo = entry.killstreaker ? KILLSTREAKERS.find(k => k.id === entry.killstreaker) : null;
        const date = new Date(entry.completedAt);
        const dateStr = date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
        const timeStr = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        
        const profitClass = entry.profit >= 0 ? 'positive' : 'negative';
        const profitIcon = entry.profit >= 0 ? '📈' : '📉';
        
        return `
            <div class="history-entry ${entry.kitType}">
                <div class="history-entry-main">
                    <div class="history-entry-info">
                        <div class="history-entry-header">
                            <span class="kit-type-badge ${entry.kitType}">${entry.kitType === 'professional' ? 'Pro' : 'Spec'}</span>
                            <h4 class="history-weapon">${entry.weapon}</h4>
                        </div>
                        <div class="history-entry-combo">
                            <span class="sheen-name" style="color: ${sheenInfo?.color || '#fff'}">${sheenInfo?.name || entry.sheen}</span>
                            ${killstreakerInfo ? `<span class="separator">+</span><span class="killstreaker-name">${killstreakerInfo.name}</span>` : ''}
                        </div>
                        <div class="history-entry-date">
                            <span class="date-icon">📅</span>
                            <span>${dateStr} ${timeStr}</span>
                            ${entry.buyer ? `<span class="buyer-info">→ ${entry.buyer}</span>` : ''}
                        </div>
                    </div>
                    
                    <div class="history-entry-numbers">
                        <div class="number-row cost">
                            <span class="label">Costo:</span>
                            <span class="value">${entry.estimatedCost.toFixed(2)} Ref</span>
                        </div>
                        <div class="number-row sale">
                            <span class="label">Venta:</span>
                            <span class="value">${entry.realSalePrice.toFixed(2)} Ref</span>
                        </div>
                        <div class="number-row profit ${profitClass}">
                            <span class="label">${profitIcon} Ganancia:</span>
                            <span class="value">${entry.profit >= 0 ? '+' : ''}${entry.profit.toFixed(2)} Ref</span>
                        </div>
                        <div class="number-row roi">
                            <span class="label">ROI:</span>
                            <span class="value ${profitClass}">${entry.roi.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
                
                ${entry.notes ? `<div class="history-entry-notes"><span>📝</span> ${entry.notes}</div>` : ''}
                
                <div class="history-entry-actions">
                    <button class="btn-edit-history" onclick="editHistoryEntry('${entry.id}')" title="Editar">
                        <span>✏️</span>
                    </button>
                    <button class="btn-delete-history" onclick="deleteHistoryEntry('${entry.id}')" title="Eliminar">
                        <span>🗑️</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    updateHistoryStats();
}

// ============================================
// ESTADÍSTICAS
// ============================================

function updateHistoryStats() {
    const totalSales = projectHistory.length;
    const totalProfit = projectHistory.reduce((sum, e) => sum + e.profit, 0);
    const avgROI = totalSales > 0 ? projectHistory.reduce((sum, e) => sum + e.roi, 0) / totalSales : 0;
    const bestSale = projectHistory.length > 0 
        ? projectHistory.reduce((best, e) => e.profit > best.profit ? e : best, projectHistory[0])
        : null;
    
    const totalSalesEl = document.getElementById('historyTotalSales');
    const totalProfitEl = document.getElementById('historyTotalProfit');
    const avgROIEl = document.getElementById('historyAvgROI');
    const bestSaleEl = document.getElementById('historyBestSale');
    
    if (totalSalesEl) totalSalesEl.textContent = totalSales;
    if (totalProfitEl) {
        const localProfit = refToLocal(totalProfit);
        totalProfitEl.innerHTML = `${totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)} Ref<br><span class="stat-local">${formatLocalCurrency(localProfit)}</span>`;
    }
    if (avgROIEl) avgROIEl.textContent = `${avgROI.toFixed(1)}%`;
    if (bestSaleEl) {
        if (bestSale) {
            bestSaleEl.innerHTML = `${bestSale.weapon}<br><span class="stat-detail">+${bestSale.profit.toFixed(2)} Ref</span>`;
        } else {
            bestSaleEl.textContent = '-';
        }
    }
}

// ============================================
// EDICIÓN
// ============================================

function editHistoryEntry(entryId) {
    const entry = projectHistory.find(e => e.id === entryId);
    if (!entry) return;
    
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modalContent');
    
    const sheenInfo = SHEENS.find(s => s.id === entry.sheen);
    const killstreakerInfo = entry.killstreaker ? KILLSTREAKERS.find(k => k.id === entry.killstreaker) : null;
    
    modalContent.innerHTML = `
        <div class="edit-history-modal">
            <h2>✏️ Editar Registro de Venta</h2>
            
            <div class="edit-history-summary">
                <span class="kit-type-badge ${entry.kitType}">${entry.kitType === 'professional' ? 'Professional' : 'Specialized'}</span>
                <h3>${entry.weapon}</h3>
                <p class="combo-info">
                    <span style="color: ${sheenInfo?.color || '#fff'}">${sheenInfo?.name || entry.sheen}</span>
                    ${killstreakerInfo ? ` + ${killstreakerInfo.name}` : ''}
                </p>
            </div>
            
            <div class="edit-history-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="editCost">Costo Estimado (Ref)</label>
                        <input type="number" id="editCost" value="${entry.estimatedCost}" step="0.5" min="0">
                    </div>
                    <div class="form-group">
                        <label for="editSalePrice">Precio de Venta (Ref)</label>
                        <input type="number" id="editSalePrice" value="${entry.realSalePrice}" step="0.5" min="0">
                    </div>
                </div>
                <div class="form-group">
                    <label for="editBuyer">Comprador</label>
                    <input type="text" id="editBuyer" value="${entry.buyer || ''}" placeholder="Nombre del comprador">
                </div>
                <div class="form-group">
                    <label for="editNotes">Notas</label>
                    <textarea id="editNotes" rows="2" placeholder="Notas adicionales">${entry.notes || ''}</textarea>
                </div>
            </div>
            
            <div class="edit-history-actions">
                <button class="btn-secondary" onclick="closeModal()">
                    <span>❌</span> Cancelar
                </button>
                <button class="btn-primary" onclick="saveHistoryEdit('${entryId}')">
                    <span>💾</span> Guardar Cambios
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function saveHistoryEdit(entryId) {
    const entry = projectHistory.find(e => e.id === entryId);
    if (!entry) return;
    
    const newCost = parseFloat(document.getElementById('editCost').value) || 0;
    const newSalePrice = parseFloat(document.getElementById('editSalePrice').value) || 0;
    const newBuyer = document.getElementById('editBuyer').value.trim();
    const newNotes = document.getElementById('editNotes').value.trim();
    
    entry.estimatedCost = newCost;
    entry.realSalePrice = newSalePrice;
    entry.profit = newSalePrice - newCost;
    entry.roi = newCost > 0 ? ((newSalePrice - newCost) / newCost * 100) : 0;
    entry.buyer = newBuyer || null;
    entry.notes = newNotes || null;
    entry.localSalePrice = refToLocal(newSalePrice);
    entry.modifiedAt = new Date().toISOString();
    
    saveProjectHistory();
    renderProjectHistory();
    closeModal();
    
    showToast('Registro actualizado ✅', 'success');
}

// ============================================
// ELIMINACIÓN Y LIMPIEZA
// ============================================

function deleteHistoryEntry(entryId) {
    const entry = projectHistory.find(e => e.id === entryId);
    if (!entry) return;
    
    if (confirm(`¿Eliminar el registro de "${entry.weapon}"?\n\nEsta acción no se puede deshacer.`)) {
        projectHistory = projectHistory.filter(e => e.id !== entryId);
        saveProjectHistory();
        renderProjectHistory();
        showToast('Registro eliminado', 'warning');
    }
}

function confirmClearHistory() {
    if (projectHistory.length === 0) {
        showToast('El historial ya está vacío', 'info');
        return;
    }
    
    if (confirm(`¿Eliminar TODOS los registros del historial?\n\nSe eliminarán ${projectHistory.length} registro(s).\nEsta acción no se puede deshacer.`)) {
        projectHistory = [];
        saveProjectHistory();
        renderProjectHistory();
        showToast('Historial limpiado', 'warning');
    }
}

// ============================================
// EXPORTACIÓN
// ============================================

function exportHistory() {
    if (projectHistory.length === 0) {
        showToast('No hay datos para exportar', 'info');
        return;
    }
    
    const exportData = {
        exportDate: new Date().toISOString(),
        totalEntries: projectHistory.length,
        totalProfit: projectHistory.reduce((sum, e) => sum + e.profit, 0),
        entries: projectHistory
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tf2_forge_history_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Historial exportado 📤', 'success');
}

// ============================================
// EXPORTACIONES GLOBALES
// ============================================

window.renderProjectHistory = renderProjectHistory;
window.updateHistoryStats = updateHistoryStats;
window.editHistoryEntry = editHistoryEntry;
window.saveHistoryEdit = saveHistoryEdit;
window.deleteHistoryEntry = deleteHistoryEntry;
window.confirmClearHistory = confirmClearHistory;
window.exportHistory = exportHistory;
