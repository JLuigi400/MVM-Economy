// ============================================
// KITS COMPLETADOS - Gestión de Inventario de Kits
// ============================================

// Generar ID único para evitar colisiones
function generateUniqueId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================
// MODALES DE REGISTRO DE VENTA
// ============================================

function openSaleRegistrationModal(project) {
    const sheenData = SHEEN_DEMAND[project.sheen?.id] || { multiplier: 1 };
    const killstreakerData = project.killstreaker ? KILLSTREAKER_DEMAND[project.killstreaker?.id] : null;
    
    const kitInfo = CRAFTING_REQUIREMENTS[project.type];
    const baseCost = kitInfo ? kitInfo.estimatedCost : 10;
    
    let totalMultiplier = sheenData.multiplier || 1;
    if (killstreakerData) {
        totalMultiplier *= killstreakerData.multiplier || 1;
    }
    
    const suggestedPrice = (baseCost * totalMultiplier).toFixed(2);
    const localSuggested = refToLocal(suggestedPrice);
    
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modalContent');
    
    const sheenInfo = SHEENS.find(s => s.id === project.sheen?.id);
    const killstreakerInfo = project.killstreaker ? KILLSTREAKERS.find(k => k.id === project.killstreaker?.id) : null;
    
    modalContent.innerHTML = `
        <div class="sale-registration-modal">
            <h2>💰 Registrar Venta Completada</h2>
            
            <div class="sale-project-summary">
                <div class="sale-project-header">
                    <span class="kit-type-badge ${project.type}">${project.type === 'professional' ? 'Professional' : 'Specialized'}</span>
                    <h3>${project.weapon}</h3>
                </div>
                <div class="sale-project-details">
                    <div class="sale-detail">
                        <span class="label">Sheen:</span>
                        <span class="value" style="color: ${sheenInfo?.color || '#fff'}">${sheenInfo?.name || project.sheen}</span>
                    </div>
                    ${killstreakerInfo ? `
                    <div class="sale-detail">
                        <span class="label">Killstreaker:</span>
                        <span class="value">${killstreakerInfo.name}</span>
                    </div>
                    ` : ''}
                    <div class="sale-detail">
                        <span class="label">Costo Estimado:</span>
                        <span class="value">${baseCost.toFixed(2)} Ref</span>
                    </div>
                    <div class="sale-detail suggested">
                        <span class="label">Precio Sugerido:</span>
                        <span class="value">${suggestedPrice} Ref <span class="local-hint">(${formatLocalCurrency(localSuggested)})</span></span>
                    </div>
                </div>
            </div>
            
            <div class="sale-form">
                <div class="sale-form-group">
                    <label for="saleRealPrice">💵 Precio Real de Venta (Ref)</label>
                    <input type="number" id="saleRealPrice" value="${suggestedPrice}" step="0.5" min="0" placeholder="Precio en Ref">
                    <span class="sale-local-preview" id="saleLocalPreview">${formatLocalCurrency(localSuggested)}</span>
                </div>
                
                <div class="sale-form-group">
                    <label for="saleBuyer">👤 Comprador (opcional)</label>
                    <input type="text" id="saleBuyer" placeholder="Nombre del comprador o tienda">
                </div>
                
                <div class="sale-form-group">
                    <label for="saleNotes">📝 Notas (opcional)</label>
                    <textarea id="saleNotes" rows="2" placeholder="Ej: Vendido rápido, buen combo..."></textarea>
                </div>
                
                <div class="sale-form-group checkbox-group">
                    <label>
                        <input type="checkbox" id="saleDeductParts" checked>
                        Deducir piezas del inventario
                    </label>
                </div>
            </div>
            
            <div class="sale-profit-preview">
                <div class="profit-preview-header">📊 Vista Previa de Ganancia</div>
                <div class="profit-preview-grid">
                    <div class="profit-preview-item">
                        <span class="label">Costo</span>
                        <span class="value" id="salePreviewCost">${baseCost.toFixed(2)} Ref</span>
                    </div>
                    <div class="profit-preview-item">
                        <span class="label">Venta</span>
                        <span class="value" id="salePreviewSale">${suggestedPrice} Ref</span>
                    </div>
                    <div class="profit-preview-item highlight">
                        <span class="label">Ganancia</span>
                        <span class="value positive" id="salePreviewProfit">+${(suggestedPrice - baseCost).toFixed(2)} Ref</span>
                    </div>
                    <div class="profit-preview-item">
                        <span class="label">ROI</span>
                        <span class="value" id="salePreviewROI">${((suggestedPrice - baseCost) / baseCost * 100).toFixed(1)}%</span>
                    </div>
                </div>
            </div>
            
            <div class="sale-actions">
                <button class="btn-secondary" onclick="closeModal()">
                    <span>❌</span> Cancelar
                </button>
                <button class="btn-skip-sale" onclick="skipSaleRegistration('${project.id}')">
                    <span>📦</span> Guardar en Inventario
                </button>
                <button class="btn-confirm-sale" onclick="confirmSaleRegistration('${project.id}', ${baseCost})">
                    <span>💰</span> Registrar Venta
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    
    const priceInput = document.getElementById('saleRealPrice');
    priceInput.addEventListener('input', () => {
        updateSalePreview(baseCost);
    });
}

function updateSalePreview(baseCost) {
    const realPrice = parseFloat(document.getElementById('saleRealPrice').value) || 0;
    const profit = realPrice - baseCost;
    const roi = baseCost > 0 ? (profit / baseCost * 100) : 0;
    const localPrice = refToLocal(realPrice);
    
    document.getElementById('saleLocalPreview').textContent = formatLocalCurrency(localPrice);
    document.getElementById('salePreviewSale').textContent = `${realPrice.toFixed(2)} Ref`;
    
    const profitEl = document.getElementById('salePreviewProfit');
    profitEl.textContent = `${profit >= 0 ? '+' : ''}${profit.toFixed(2)} Ref`;
    profitEl.className = `value ${profit >= 0 ? 'positive' : 'negative'}`;
    
    document.getElementById('salePreviewROI').textContent = `${roi.toFixed(1)}%`;
}

function skipSaleRegistration(projectId) {
    const id = String(projectId);
    const project = appState.projects.find(p => String(p.id) === id);
    if (!project) return;
    
    closeModal();
    openKitCostModal(project);
}

// ============================================
// MODAL DE COSTO DE KIT
// ============================================

function openKitCostModal(project) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modalContent');
    
    const kitInfo = CRAFTING_REQUIREMENTS[project.type];
    const estimatedCost = kitInfo ? kitInfo.estimatedCost : 10;
    
    const sheenInfo = SHEENS.find(s => s.id === project.sheen?.id);
    const killstreakerInfo = project.killstreaker ? KILLSTREAKERS.find(k => k.id === project.killstreaker?.id) : null;
    
    let extraCost = 0;
    let extraCostLabel = '';
    
    if (project.type === 'specialized' && project.basicKitValue) {
        extraCost = project.basicKitValue;
        extraCostLabel = 'Basic Kit usado';
    } else if (project.type === 'professional' && project.specKitsTotalCost) {
        extraCost = project.specKitsTotalCost;
        extraCostLabel = 'Specialized Kits usados';
    }
    
    const totalEstimated = estimatedCost + extraCost;
    
    modalContent.innerHTML = `
        <div class="kit-cost-modal">
            <h2>📦 Agregar Kit al Inventario</h2>
            
            <div class="kit-cost-summary">
                <div class="kit-cost-header">
                    <span class="kit-type-badge ${project.type}">${project.type === 'professional' ? 'Professional' : 'Specialized'}</span>
                    <h3>${project.weapon}</h3>
                </div>
                <div class="kit-cost-details">
                    <div class="kit-cost-detail">
                        <span class="label">Sheen:</span>
                        <span class="value" style="color: ${sheenInfo?.color || '#fff'}">${sheenInfo?.name || project.sheen}</span>
                    </div>
                    ${killstreakerInfo ? `
                    <div class="kit-cost-detail">
                        <span class="label">Killstreaker:</span>
                        <span class="value">${killstreakerInfo.name}</span>
                    </div>
                    ` : ''}
                    <div class="kit-cost-detail">
                        <span class="label">Piezas (estimado):</span>
                        <span class="value">${estimatedCost.toFixed(2)} Ref</span>
                    </div>
                    ${extraCost > 0 ? `
                    <div class="kit-cost-detail">
                        <span class="label">${extraCostLabel}:</span>
                        <span class="value">${extraCost.toFixed(2)} Ref</span>
                    </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="kit-cost-form">
                <div class="kit-cost-form-group">
                    <label for="kitRealCost">💵 Costo Total Real (Ref)</label>
                    <p class="form-hint">¿Cuánto invertiste realmente en fabricar este kit?</p>
                    <input type="number" id="kitRealCost" value="${totalEstimated.toFixed(2)}" step="0.5" min="0" placeholder="Costo en Ref">
                    <span class="kit-cost-local" id="kitCostLocal">${formatLocalCurrency(refToLocal(totalEstimated))}</span>
                </div>
                
                <div class="kit-cost-checkbox">
                    <label>
                        <input type="checkbox" id="kitMarkImbued">
                        ⚔️ Marcar como imbuido (ya aplicado a un arma)
                    </label>
                    <p class="form-hint">Los kits imbuidos están listos para usar en el siguiente nivel de fabricación</p>
                </div>
            </div>
            
            <div class="kit-cost-actions">
                <button class="btn-secondary" onclick="closeModal()">
                    <span>❌</span> Cancelar
                </button>
                <button class="btn-confirm-kit" onclick="confirmAddKitToInventory('${project.id}')">
                    <span>✅</span> Agregar al Inventario
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    
    const costInput = document.getElementById('kitRealCost');
    costInput.addEventListener('input', () => {
        const cost = parseFloat(costInput.value) || 0;
        document.getElementById('kitCostLocal').textContent = formatLocalCurrency(refToLocal(cost));
    });
}

function confirmAddKitToInventory(projectId) {
    const id = String(projectId);
    const project = appState.projects.find(p => String(p.id) === id);
    if (!project) return;
    
    const realCost = parseFloat(document.getElementById('kitRealCost').value) || 0;
    const markImbued = document.getElementById('kitMarkImbued').checked;
    
    deductProjectParts(project);
    removeUsedIngredientKits(project); // ← ELIMINAR KITS USADOS COMO INGREDIENTE
    addCompletedKitToInventory(project, false, realCost, markImbued);
    
    appState.projects = appState.projects.filter(p => String(p.id) !== id);
    
    saveToStorage();
    renderProjectsList();
    renderPartsGrid();
    renderCompletedKits();
    updateDashboard();
    closeModal();
    
    const typeLabel = project.type === 'professional' ? 'Professional' : 'Specialized';
    showToast(`${typeLabel} Kit "${project.weapon}" agregado al inventario ✅`, 'success');
}

function confirmSaleRegistration(projectId, estimatedCost) {
    const id = String(projectId);
    const project = appState.projects.find(p => String(p.id) === id);
    if (!project) return;
    
    const realPrice = parseFloat(document.getElementById('saleRealPrice').value) || 0;
    const buyer = document.getElementById('saleBuyer').value.trim();
    const notes = document.getElementById('saleNotes').value.trim();
    const deductParts = document.getElementById('saleDeductParts').checked;
    
    const historyEntry = {
        id: generateUniqueId(),
        projectId: projectId,
        weapon: project.weapon,
        kitType: project.type,
        sheen: project.sheen?.id || project.sheen,
        killstreaker: project.killstreaker?.id || project.killstreaker || null,
        estimatedCost: estimatedCost,
        realSalePrice: realPrice,
        profit: realPrice - estimatedCost,
        roi: estimatedCost > 0 ? ((realPrice - estimatedCost) / estimatedCost * 100) : 0,
        buyer: buyer || null,
        notes: notes || null,
        completedAt: new Date().toISOString(),
        localCurrency: realEconomy.localCurrency,
        localSalePrice: refToLocal(realPrice)
    };
    
    projectHistory.unshift(historyEntry);
    saveProjectHistory();
    
    if (deductParts) {
        deductProjectParts(project);
    }
    
    removeUsedIngredientKits(project); // ← ELIMINAR KITS USADOS COMO INGREDIENTE
    
    appState.projects = appState.projects.filter(p => String(p.id) !== id);
    
    saveToStorage();
    renderProjectsList();
    renderPartsGrid();
    renderCompletedKits();
    updateDashboard();
    renderProjectHistory();
    closeModal();
    
    const profitText = historyEntry.profit >= 0 ? `+${historyEntry.profit.toFixed(2)}` : historyEntry.profit.toFixed(2);
    showToast(`¡Venta registrada! ${project.weapon} → ${profitText} Ref 🎉`, 'success');
}

// ============================================
// FUNCIONES DE PIEZAS
// ============================================

function deductProjectParts(project) {
    if (project.partsRequirements) {
        for (const [partId, required] of Object.entries(project.partsRequirements)) {
            if (appState.inventory.parts[partId] !== undefined) {
                const available = appState.inventory.parts[partId];
                const toDeduct = Math.min(available, required);
                appState.inventory.parts[partId] = Math.max(0, available - toDeduct);
            }
        }
    } else {
        let partsToDeduct = project.partsRequired || 0;
        
        for (const partId of Object.keys(appState.inventory.parts)) {
            if (partsToDeduct <= 0) break;
            
            const available = appState.inventory.parts[partId];
            const toDeduct = Math.min(available, partsToDeduct);
            
            appState.inventory.parts[partId] -= toDeduct;
            partsToDeduct -= toDeduct;
        }
    }
}

// ============================================
// ELIMINAR KITS USADOS COMO INGREDIENTE
// ============================================

function removeUsedIngredientKits(project) {
    let removedKits = [];
    
    // Para Specialized: eliminar el Basic KS Weapon usado
    if (project.type === 'specialized' && project.basicWeaponData?.kitId) {
        const kitId = project.basicWeaponData.kitId;
        const basicKits = appState.inventory.completedKits.basic;
        const kitIndex = basicKits.findIndex(k => k.id === kitId);
        
        if (kitIndex !== -1) {
            const removedKit = basicKits.splice(kitIndex, 1)[0];
            removedKits.push(`Basic: ${removedKit.weapon}`);
            console.log(`🗑️ Eliminado Basic Kit usado: ${removedKit.weapon} (ID: ${kitId})`);
        }
    }
    
    // Para Professional: eliminar los 2 Specialized KS Weapons usados
    if (project.type === 'professional' && project.specWeaponsData) {
        const specKits = appState.inventory.completedKits.specialized;
        
        // Eliminar weapon1 si tiene kitId
        if (project.specWeaponsData.weapon1?.kitId) {
            const kitId = project.specWeaponsData.weapon1.kitId;
            const kitIndex = specKits.findIndex(k => k.id === kitId);
            
            if (kitIndex !== -1) {
                const removedKit = specKits.splice(kitIndex, 1)[0];
                removedKits.push(`Spec: ${removedKit.weapon}`);
                console.log(`🗑️ Eliminado Specialized Kit usado (Slot 1): ${removedKit.weapon} (ID: ${kitId})`);
            }
        }
        
        // Eliminar weapon2 si tiene kitId
        if (project.specWeaponsData.weapon2?.kitId) {
            const kitId = project.specWeaponsData.weapon2.kitId;
            const kitIndex = specKits.findIndex(k => k.id === kitId);
            
            if (kitIndex !== -1) {
                const removedKit = specKits.splice(kitIndex, 1)[0];
                removedKits.push(`Spec: ${removedKit.weapon}`);
                console.log(`🗑️ Eliminado Specialized Kit usado (Slot 2): ${removedKit.weapon} (ID: ${kitId})`);
            }
        }
    }
    
    if (removedKits.length > 0) {
        console.log(`✅ Total kits eliminados del inventario: ${removedKits.length}`);
    }
    
    return removedKits;
}

function addCompletedKitToInventory(project, wasSold = false, realCost = 0, imbued = false) {
    const sheenInfo = SHEENS.find(s => s.id === project.sheen?.id);
    const killstreakerInfo = project.killstreaker ? KILLSTREAKERS.find(k => k.id === project.killstreaker?.id) : null;
    
    const kit = {
        id: generateUniqueId(),
        weapon: project.weapon,
        createdAt: new Date().toISOString(),
        wasSold: wasSold,
        cost: realCost,
        imbued: imbued
    };
    
    if (project.type === 'specialized') {
        kit.sheen = project.sheen?.id || project.sheen;
        kit.sheenName = sheenInfo?.name || project.sheen;
        kit.sheenColor = sheenInfo?.color || '#fff';
        // Usar el nuevo campo basicWeaponData o el antiguo basicKitValue
        kit.basicKitCost = project.basicWeaponData?.cost || project.basicKitValue || 0;
        
        appState.inventory.completedKits.specialized.push(kit);
        
    } else if (project.type === 'professional') {
        kit.sheen = project.sheen?.id || project.sheen;
        kit.sheenName = sheenInfo?.name || project.sheen;
        kit.sheenColor = sheenInfo?.color || '#fff';
        kit.killstreaker = project.killstreaker?.id || project.killstreaker;
        kit.killstreakerName = killstreakerInfo?.name || project.killstreaker;
        // Usar el nuevo campo specWeaponsData o el antiguo specKitsData
        kit.specKitsData = project.specWeaponsData || project.specKitsData || null;
        kit.specKitsCost = project.specWeaponsTotalCost || project.specKitsTotalCost || 0;
        
        appState.inventory.completedKits.professional.push(kit);
    }
}

// ============================================
// RENDERIZADO DE KITS COMPLETADOS
// ============================================

function renderCompletedKits() {
    renderBasicKits();
    renderSpecializedKits();
    renderProfessionalKits();
}

function renderBasicKits() {
    const container = document.getElementById('basicKitsList');
    const countEl = document.getElementById('basicKitsCount');
    if (!container) return;
    
    const kits = appState.inventory.completedKits.basic || [];
    const imbuedCount = kits.filter(k => k.imbued).length;
    
    if (countEl) {
        countEl.textContent = `${kits.length} kit${kits.length !== 1 ? 's' : ''} (${imbuedCount} imbuido${imbuedCount !== 1 ? 's' : ''})`;
    }
    
    if (kits.length === 0) {
        container.innerHTML = `
            <div class="empty-kits">
                <span>📭</span>
                <p>No hay Basic Kits en inventario</p>
                <p class="hint">Se obtienen jugando MvM en Two Cities</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = kits.map(kit => `
        <div class="completed-kit-card basic ${kit.imbued ? 'imbued' : 'not-imbued'}" data-id="${kit.id}">
            <div class="kit-card-header">
                <img src="https://wiki.teamfortress.com/w/images/e/e4/Item_icon_Killstreak_Kit.png" alt="Basic Kit" class="kit-icon">
                <div class="kit-info">
                    <span class="kit-weapon">${kit.weapon}</span>
                    <span class="kit-type-label">Basic Killstreak Kit</span>
                </div>
                <button class="kit-delete-btn" onclick="deleteCompletedKit('basic', '${kit.id}')" title="Eliminar">🗑️</button>
            </div>
            <div class="kit-imbued-status ${kit.imbued ? 'is-imbued' : 'not-imbued'}">
                <span class="imbued-icon">${kit.imbued ? '⚔️' : '📦'}</span>
                <span class="imbued-text">${kit.imbued ? 'Imbuido en arma - Listo para Specialized' : 'Sin aplicar - Solo para vender'}</span>
                <button class="toggle-imbued-btn" onclick="toggleKitImbued('basic', '${kit.id}')" title="${kit.imbued ? 'Marcar como sin aplicar' : 'Marcar como imbuido'}">
                    ${kit.imbued ? '📦' : '⚔️'}
                </button>
            </div>
            <div class="kit-card-footer">
                <span class="kit-date">${formatKitDate(kit.createdAt)}</span>
                ${kit.cost ? `<span class="kit-cost">${kit.cost.toFixed(2)} Ref</span>` : ''}
            </div>
        </div>
    `).join('');
}

function renderSpecializedKits() {
    const container = document.getElementById('specializedKitsList');
    const countEl = document.getElementById('specializedKitsCount');
    if (!container) return;
    
    const kits = appState.inventory.completedKits.specialized || [];
    const imbuedCount = kits.filter(k => k.imbued).length;
    
    if (countEl) {
        countEl.textContent = `${kits.length} kit${kits.length !== 1 ? 's' : ''} (${imbuedCount} imbuido${imbuedCount !== 1 ? 's' : ''})`;
    }
    
    if (kits.length === 0) {
        container.innerHTML = `
            <div class="empty-kits">
                <span>📭</span>
                <p>No hay Specialized Kits fabricados</p>
                <p class="hint">Crea un fabricador Specialized en La Forja</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = kits.map(kit => `
        <div class="completed-kit-card specialized ${kit.imbued ? 'imbued' : 'not-imbued'}" data-id="${kit.id}">
            <div class="kit-card-header">
                <img src="https://wiki.teamfortress.com/w/images/2/2e/Item_icon_Specialized_Killstreak_Kit.png" alt="Specialized Kit" class="kit-icon">
                <div class="kit-info">
                    <span class="kit-weapon">${kit.weapon}</span>
                    <span class="kit-type-label">Specialized Killstreak Kit</span>
                </div>
                <button class="kit-delete-btn" onclick="deleteCompletedKit('specialized', '${kit.id}')" title="Eliminar">🗑️</button>
            </div>
            <div class="kit-details">
                <div class="kit-sheen" style="border-left: 3px solid ${kit.sheenColor || '#fff'}">
                    <span class="color-dot" style="background: ${kit.sheenColor || '#fff'}"></span>
                    <span>${kit.sheenName || 'Sin Sheen'}</span>
                </div>
            </div>
            <div class="kit-imbued-status ${kit.imbued ? 'is-imbued' : 'not-imbued'}">
                <span class="imbued-icon">${kit.imbued ? '⚔️' : '📦'}</span>
                <span class="imbued-text">${kit.imbued ? 'Imbuido - Listo para Professional' : 'Sin aplicar - Solo para vender'}</span>
                <button class="toggle-imbued-btn" onclick="toggleKitImbued('specialized', '${kit.id}')" title="${kit.imbued ? 'Marcar como sin aplicar' : 'Marcar como imbuido'}">
                    ${kit.imbued ? '📦' : '⚔️'}
                </button>
            </div>
            <div class="kit-card-footer">
                <span class="kit-date">${formatKitDate(kit.createdAt)}</span>
                ${kit.cost ? `<span class="kit-cost">💰 ${kit.cost.toFixed(2)} Ref</span>` : ''}
            </div>
        </div>
    `).join('');
}

function renderProfessionalKits() {
    const container = document.getElementById('professionalKitsList');
    const countEl = document.getElementById('professionalKitsCount');
    if (!container) return;
    
    const kits = appState.inventory.completedKits.professional || [];
    const imbuedCount = kits.filter(k => k.imbued).length;
    
    if (countEl) {
        countEl.textContent = `${kits.length} kit${kits.length !== 1 ? 's' : ''} (${imbuedCount} imbuido${imbuedCount !== 1 ? 's' : ''})`;
    }
    
    if (kits.length === 0) {
        container.innerHTML = `
            <div class="empty-kits">
                <span>📭</span>
                <p>No hay Professional Kits fabricados</p>
                <p class="hint">Crea un fabricador Professional en La Forja</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = kits.map(kit => `
        <div class="completed-kit-card professional ${kit.imbued ? 'imbued' : 'not-imbued'}" data-id="${kit.id}">
            <div class="kit-card-header">
                <img src="https://wiki.teamfortress.com/w/images/f/f3/Item_icon_Professional_Killstreak_Kit.png" alt="Professional Kit" class="kit-icon">
                <div class="kit-info">
                    <span class="kit-weapon">${kit.weapon}</span>
                    <span class="kit-type-label">Professional Killstreak Kit</span>
                </div>
                <button class="kit-delete-btn" onclick="deleteCompletedKit('professional', '${kit.id}')" title="Eliminar">🗑️</button>
            </div>
            <div class="kit-imbued-status ${kit.imbued ? 'is-imbued' : 'not-imbued'}">
                <span class="imbued-icon">${kit.imbued ? '⚔️' : '📦'}</span>
                <span class="imbued-text">${kit.imbued ? 'Imbuido en arma - Listo para vender' : 'Sin aplicar - Kit vendible'}</span>
                <button class="toggle-imbued-btn" onclick="toggleKitImbued('professional', '${kit.id}')" title="${kit.imbued ? 'Marcar como sin aplicar' : 'Marcar como imbuido'}">
                    ${kit.imbued ? '📦' : '⚔️'}
                </button>
            </div>
            <div class="kit-details">
                <div class="kit-sheen" style="border-left: 3px solid ${kit.sheenColor || '#fff'}">
                    <span class="color-dot" style="background: ${kit.sheenColor || '#fff'}"></span>
                    <span>${kit.sheenName || 'Sin Sheen'}</span>
                </div>
                <div class="kit-effect">
                    <span>✨</span>
                    <span>${kit.killstreakerName || 'Sin Efecto'}</span>
                </div>
            </div>
            <div class="kit-card-footer">
                <span class="kit-date">${formatKitDate(kit.createdAt)}</span>
                ${kit.cost ? `<span class="kit-cost">💰 ${kit.cost.toFixed(2)} Ref</span>` : ''}
            </div>
        </div>
    `).join('');
}

function formatKitDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ============================================
// AGREGAR BASIC KIT MANUALMENTE
// ============================================

function openAddBasicKitModal() {
    const content = `
        <div class="add-kit-modal">
            <p class="modal-hint">Los Basic Kits se obtienen jugando MvM en Two Cities. Marca si ya está aplicado a un arma para usarlo en fabricación.</p>
            
            <div class="form-group">
                <label for="basicKitWeapon">Nombre del Arma:</label>
                <input type="text" id="basicKitWeapon" placeholder="Ej: Rocket Launcher, Scattergun..." autocomplete="off">
            </div>
            
            <div class="form-group cost-input-group">
                <label>Costo de adquisición:</label>
                <div class="cost-dual-input">
                    <div class="cost-field">
                        <input type="number" id="basicKitCostRef" value="0" step="0.5" min="0" placeholder="0" oninput="convertKitCostRefToLocal('basic')">
                        <span class="cost-label">Ref</span>
                    </div>
                    <span class="cost-separator">ó</span>
                    <div class="cost-field">
                        <input type="number" id="basicKitCostLocal" value="0" step="0.01" min="0" placeholder="0" oninput="convertKitCostLocalToRef('basic')">
                        <span class="cost-label local-currency-code">MXN</span>
                    </div>
                </div>
                <span class="cost-preview" id="basicKitCostPreview"></span>
            </div>
            
            <div class="form-group imbued-group">
                <label class="imbued-label">
                    <input type="checkbox" id="basicKitImbued">
                    <span class="imbued-text">
                        <strong>⚔️ Kit ya aplicado (imbuido)</strong>
                        <small>El kit ya está aplicado a un arma y puede usarse para fabricar Specialized</small>
                    </span>
                </label>
            </div>
            
            <div class="modal-actions">
                <button class="btn-secondary" onclick="closeCustomModal()">Cancelar</button>
                <button class="btn-primary" onclick="addBasicKitToInventory()">
                    <span>➕</span> Agregar Kit
                </button>
            </div>
        </div>
    `;
    
    showCustomModal('➕ Agregar Basic Killstreak Kit', content);
    updateKitCostLabels();
}

// ============================================
// AGREGAR SPECIALIZED KIT MANUALMENTE
// ============================================

function openAddSpecializedKitModal() {
    // Generar opciones de Sheen
    const sheenOptions = SHEENS.map(sheen => `
        <option value="${sheen.id}" data-color="${sheen.color}">${sheen.name}</option>
    `).join('');
    
    const content = `
        <div class="add-kit-modal specialized">
            <p class="modal-hint">Registra un Specialized Killstreak Kit comprado o conseguido. Esto te ayuda a llevar control de tu inventario y economía.</p>
            
            <div class="form-group">
                <label for="specKitWeapon">Nombre del Arma:</label>
                <input type="text" id="specKitWeapon" placeholder="Ej: Rocket Launcher, Scattergun..." autocomplete="off">
            </div>
            
            <div class="form-group">
                <label for="specKitSheen">Sheen (Color del brillo):</label>
                <select id="specKitSheen" onchange="updateSheenPreview('spec')">
                    <option value="">Seleccionar Sheen...</option>
                    ${sheenOptions}
                </select>
                <div class="sheen-preview" id="specSheenPreview"></div>
            </div>
            
            <div class="form-group cost-input-group">
                <label>Costo de adquisición:</label>
                <div class="cost-dual-input">
                    <div class="cost-field">
                        <input type="number" id="specKitCostRef" value="0" step="0.5" min="0" placeholder="0" oninput="convertKitCostRefToLocal('spec')">
                        <span class="cost-label">Ref</span>
                    </div>
                    <span class="cost-separator">ó</span>
                    <div class="cost-field">
                        <input type="number" id="specKitCostLocal" value="0" step="0.01" min="0" placeholder="0" oninput="convertKitCostLocalToRef('spec')">
                        <span class="cost-label local-currency-code">MXN</span>
                    </div>
                </div>
                <span class="cost-preview" id="specKitCostPreview"></span>
            </div>
            
            <div class="form-group imbued-group">
                <label class="imbued-label">
                    <input type="checkbox" id="specKitImbued">
                    <span class="imbued-text">
                        <strong>⚔️ Kit ya aplicado (imbuido)</strong>
                        <small>El kit ya está aplicado a un arma y puede usarse para fabricar Professional</small>
                    </span>
                </label>
            </div>
            
            <div class="modal-actions">
                <button class="btn-secondary" onclick="closeCustomModal()">Cancelar</button>
                <button class="btn-primary" onclick="addSpecializedKitToInventory()">
                    <span>➕</span> Agregar Specialized Kit
                </button>
            </div>
        </div>
    `;
    
    showCustomModal('➕ Agregar Specialized Killstreak Kit', content);
    updateKitCostLabels();
}

function addSpecializedKitToInventory() {
    const weapon = document.getElementById('specKitWeapon')?.value.trim();
    const sheenId = document.getElementById('specKitSheen')?.value;
    const costRef = parseFloat(document.getElementById('specKitCostRef')?.value) || 0;
    const imbued = document.getElementById('specKitImbued')?.checked || false;
    
    if (!weapon) {
        showToast('Por favor ingresa el nombre del arma', 'error');
        return;
    }
    
    if (!sheenId) {
        showToast('Por favor selecciona un Sheen', 'error');
        return;
    }
    
    const sheen = SHEENS.find(s => s.id === sheenId);
    
    const kit = {
        id: generateUniqueId(),
        weapon: weapon,
        sheen: sheenId,
        sheenName: sheen?.name || 'Unknown',
        sheenColor: sheen?.color || '#fff',
        cost: costRef,
        imbued: imbued,
        createdAt: new Date().toISOString(),
        source: 'manual'
    };
    
    appState.inventory.completedKits.specialized.push(kit);
    saveToStorage();
    renderCompletedKits();
    closeCustomModal();
    
    const imbuedText = imbued ? ' (imbuido)' : '';
    showToast(`Specialized Kit "${weapon}" - ${sheen?.name}${imbuedText} agregado ✅`, 'success');
}

// ============================================
// AGREGAR PROFESSIONAL KIT MANUALMENTE
// ============================================

function openAddProfessionalKitModal() {
    // Generar opciones de Sheen
    const sheenOptions = SHEENS.map(sheen => `
        <option value="${sheen.id}" data-color="${sheen.color}">${sheen.name}</option>
    `).join('');
    
    // Generar opciones de Killstreaker
    const killstreakerOptions = KILLSTREAKERS.map(ks => `
        <option value="${ks.id}">${ks.name}</option>
    `).join('');
    
    const content = `
        <div class="add-kit-modal professional">
            <p class="modal-hint">Registra un Professional Killstreak Kit comprado o conseguido. Los Professional tienen Sheen + Efecto de ojos.</p>
            
            <div class="form-group">
                <label for="proKitWeapon">Nombre del Arma:</label>
                <input type="text" id="proKitWeapon" placeholder="Ej: Rocket Launcher, Scattergun..." autocomplete="off">
            </div>
            
            <div class="form-row">
                <div class="form-group half">
                    <label for="proKitSheen">Sheen (Color):</label>
                    <select id="proKitSheen" onchange="updateSheenPreview('pro')">
                        <option value="">Seleccionar...</option>
                        ${sheenOptions}
                    </select>
                    <div class="sheen-preview" id="proSheenPreview"></div>
                </div>
                
                <div class="form-group half">
                    <label for="proKitKillstreaker">Killstreaker (Efecto):</label>
                    <select id="proKitKillstreaker" onchange="updateKillstreakerPreview()">
                        <option value="">Seleccionar...</option>
                        ${killstreakerOptions}
                    </select>
                    <div class="killstreaker-preview" id="proKillstreakerPreview"></div>
                </div>
            </div>
            
            <div class="combo-preview" id="proComboPreview">
                <span class="combo-hint">Selecciona Sheen y Killstreaker para ver la valoración del combo</span>
            </div>
            
            <div class="form-group cost-input-group">
                <label>Costo de adquisición:</label>
                <div class="cost-dual-input">
                    <div class="cost-field">
                        <input type="number" id="proKitCostRef" value="0" step="0.5" min="0" placeholder="0" oninput="convertKitCostRefToLocal('pro')">
                        <span class="cost-label">Ref</span>
                    </div>
                    <span class="cost-separator">ó</span>
                    <div class="cost-field">
                        <input type="number" id="proKitCostLocal" value="0" step="0.01" min="0" placeholder="0" oninput="convertKitCostLocalToRef('pro')">
                        <span class="cost-label local-currency-code">MXN</span>
                    </div>
                </div>
                <span class="cost-preview" id="proKitCostPreview"></span>
            </div>
            
            <div class="modal-actions">
                <button class="btn-secondary" onclick="closeCustomModal()">Cancelar</button>
                <button class="btn-primary" onclick="addProfessionalKitToInventory()">
                    <span>➕</span> Agregar Professional Kit
                </button>
            </div>
        </div>
    `;
    
    showCustomModal('➕ Agregar Professional Killstreak Kit', content);
    updateKitCostLabels();
}

function addProfessionalKitToInventory() {
    const weapon = document.getElementById('proKitWeapon')?.value.trim();
    const sheenId = document.getElementById('proKitSheen')?.value;
    const killstreakerId = document.getElementById('proKitKillstreaker')?.value;
    const costRef = parseFloat(document.getElementById('proKitCostRef')?.value) || 0;
    
    if (!weapon) {
        showToast('Por favor ingresa el nombre del arma', 'error');
        return;
    }
    
    if (!sheenId) {
        showToast('Por favor selecciona un Sheen', 'error');
        return;
    }
    
    if (!killstreakerId) {
        showToast('Por favor selecciona un Killstreaker', 'error');
        return;
    }
    
    const sheen = SHEENS.find(s => s.id === sheenId);
    const killstreaker = KILLSTREAKERS.find(k => k.id === killstreakerId);
    
    const kit = {
        id: generateUniqueId(),
        weapon: weapon,
        sheen: sheenId,
        sheenName: sheen?.name || 'Unknown',
        sheenColor: sheen?.color || '#fff',
        killstreaker: killstreakerId,
        killstreakerName: killstreaker?.name || 'Unknown',
        cost: costRef,
        createdAt: new Date().toISOString(),
        source: 'manual'
    };
    
    appState.inventory.completedKits.professional.push(kit);
    saveToStorage();
    renderCompletedKits();
    closeCustomModal();
    
    showToast(`Professional Kit "${weapon}" - ${sheen?.name} + ${killstreaker?.name} agregado ✅`, 'success');
}

// ============================================
// HELPERS PARA MODALES DE KIT
// ============================================

function updateKitCostLabels() {
    const currency = typeof getLocalCurrency === 'function' ? getLocalCurrency() : { code: 'MXN', symbol: '$' };
    
    document.querySelectorAll('.add-kit-modal .local-currency-code').forEach(el => {
        el.textContent = currency.code;
    });
}

function convertKitCostRefToLocal(prefix) {
    const refInput = document.getElementById(`${prefix}KitCostRef`);
    const localInput = document.getElementById(`${prefix}KitCostLocal`);
    const preview = document.getElementById(`${prefix}KitCostPreview`);
    
    if (!refInput || !localInput) return;
    
    const refValue = parseFloat(refInput.value) || 0;
    const localValue = typeof refToLocal === 'function' ? refToLocal(refValue) : refValue * 1.5;
    
    localInput.value = localValue.toFixed(2);
    
    if (preview) {
        const currency = typeof getLocalCurrency === 'function' ? getLocalCurrency() : { code: 'MXN', symbol: '$' };
        const keyValue = appState?.settings?.keyValue || 56;
        const keysEquiv = (refValue / keyValue).toFixed(3);
        preview.textContent = `≈ ${keysEquiv} Keys | ${currency.symbol}${localValue.toFixed(2)} ${currency.code}`;
    }
}

function convertKitCostLocalToRef(prefix) {
    const refInput = document.getElementById(`${prefix}KitCostRef`);
    const localInput = document.getElementById(`${prefix}KitCostLocal`);
    const preview = document.getElementById(`${prefix}KitCostPreview`);
    
    if (!refInput || !localInput) return;
    
    const localValue = parseFloat(localInput.value) || 0;
    const refValue = typeof localToRef === 'function' ? localToRef(localValue) : localValue / 1.5;
    
    refInput.value = refValue.toFixed(2);
    
    if (preview) {
        const currency = typeof getLocalCurrency === 'function' ? getLocalCurrency() : { code: 'MXN', symbol: '$' };
        const keyValue = appState?.settings?.keyValue || 56;
        const keysEquiv = (refValue / keyValue).toFixed(3);
        preview.textContent = `≈ ${keysEquiv} Keys | ${currency.symbol}${localValue.toFixed(2)} ${currency.code}`;
    }
}

function updateSheenPreview(prefix) {
    const select = document.getElementById(`${prefix}KitSheen`);
    const preview = document.getElementById(`${prefix}SheenPreview`);
    
    if (!select || !preview) return;
    
    const sheenId = select.value;
    if (!sheenId) {
        preview.innerHTML = '';
        return;
    }
    
    const sheen = SHEENS.find(s => s.id === sheenId);
    if (!sheen) return;
    
    const tierConfig = TIER_CONFIG[sheen.tier];
    
    preview.innerHTML = `
        <div class="sheen-preview-content" style="border-color: ${sheen.color}">
            <span class="color-dot" style="background: ${sheen.color}"></span>
            <span class="sheen-name" style="color: ${sheen.color}">${sheen.name}</span>
            <span class="tier-badge tier-${sheen.tier}">${tierConfig.icon}</span>
        </div>
    `;
    
    // Si es professional, actualizar combo preview
    if (prefix === 'pro') {
        updateComboPreview();
    }
}

function updateKillstreakerPreview() {
    const select = document.getElementById('proKitKillstreaker');
    const preview = document.getElementById('proKillstreakerPreview');
    
    if (!select || !preview) return;
    
    const ksId = select.value;
    if (!ksId) {
        preview.innerHTML = '';
        return;
    }
    
    const ks = KILLSTREAKERS.find(k => k.id === ksId);
    if (!ks) return;
    
    const tierConfig = TIER_CONFIG[ks.tier];
    
    preview.innerHTML = `
        <div class="killstreaker-preview-content">
            ${ks.image ? `<img src="${ks.image}" alt="${ks.name}" class="ks-preview-img">` : ''}
            <span class="ks-name">${ks.name}</span>
            <span class="tier-badge tier-${ks.tier}">${tierConfig.icon}</span>
        </div>
    `;
    
    updateComboPreview();
}

function updateComboPreview() {
    const sheenSelect = document.getElementById('proKitSheen');
    const ksSelect = document.getElementById('proKitKillstreaker');
    const preview = document.getElementById('proComboPreview');
    
    if (!sheenSelect || !ksSelect || !preview) return;
    
    const sheenId = sheenSelect.value;
    const ksId = ksSelect.value;
    
    if (!sheenId || !ksId) {
        preview.innerHTML = '<span class="combo-hint">Selecciona Sheen y Killstreaker para ver la valoración del combo</span>';
        return;
    }
    
    // Calcular valoración del combo
    const combo = typeof calculateComboTier === 'function' ? calculateComboTier(sheenId, ksId) : null;
    
    if (!combo) {
        preview.innerHTML = '<span class="combo-hint">Error al calcular combo</span>';
        return;
    }
    
    const tierConfig = COMBO_TIERS[combo.tier];
    const premiumPercent = ((combo.totalMultiplier - 1) * 100).toFixed(0);
    const demandLabel = typeof getDemandLabel === 'function' ? getDemandLabel(combo.demand || 'medium') : combo.demand;
    
    preview.innerHTML = `
        <div class="combo-valuation">
            <div class="combo-tier-display" style="background: ${tierConfig.color}20; border-color: ${tierConfig.color}">
                <span class="combo-tier-icon">${tierConfig.icon}</span>
                <span class="combo-tier-label" style="color: ${tierConfig.color}">${combo.tier.toUpperCase()}</span>
            </div>
            <div class="combo-stats">
                <div class="combo-stat">
                    <span class="stat-label">Premium:</span>
                    <span class="stat-value ${combo.totalMultiplier >= 1 ? 'positive' : 'negative'}">${combo.totalMultiplier >= 1 ? '+' : ''}${premiumPercent}%</span>
                </div>
                <div class="combo-stat">
                    <span class="stat-label">Demanda:</span>
                    <span class="stat-value">${demandLabel}</span>
                </div>
            </div>
        </div>
    `;
}

function addBasicKitToInventory() {
    const weapon = document.getElementById('basicKitWeapon')?.value.trim();
    const costRef = parseFloat(document.getElementById('basicKitCostRef')?.value) || 0;
    const imbued = document.getElementById('basicKitImbued')?.checked || false;
    
    if (!weapon) {
        showToast('Por favor ingresa el nombre del arma', 'error');
        return;
    }
    
    const kit = {
        id: generateUniqueId(),
        weapon: weapon,
        cost: costRef,
        imbued: imbued,
        createdAt: new Date().toISOString(),
        source: 'manual'
    };
    
    appState.inventory.completedKits.basic.push(kit);
    saveToStorage();
    renderCompletedKits();
    closeCustomModal();
    
    const imbuedText = imbued ? ' (imbuido)' : '';
    showToast(`Basic Kit "${weapon}"${imbuedText} agregado ✅`, 'success');
}

// ============================================
// GESTIÓN DE KITS
// ============================================

function deleteCompletedKit(type, kitId) {
    const typeNames = {
        basic: 'Basic',
        specialized: 'Specialized', 
        professional: 'Professional'
    };
    
    showModal(
        'Eliminar Kit',
        `¿Estás seguro de eliminar este ${typeNames[type]} Killstreak Kit?`,
        () => {
            appState.inventory.completedKits[type] = appState.inventory.completedKits[type].filter(k => k.id !== kitId);
            saveToStorage();
            renderCompletedKits();
            showToast('Kit eliminado', 'info');
        }
    );
}

function toggleKitImbued(type, kitId) {
    const kit = appState.inventory.completedKits[type].find(k => k.id === kitId);
    if (!kit) return;
    
    kit.imbued = !kit.imbued;
    saveToStorage();
    renderCompletedKits();
    
    const status = kit.imbued ? 'imbuido (listo para fabricar)' : 'sin aplicar (solo venta)';
    showToast(`Kit marcado como ${status}`, 'info');
}

function getImbuedBasicKits() {
    return (appState.inventory.completedKits.basic || []).filter(k => k.imbued);
}

function getImbuedSpecializedKits() {
    return (appState.inventory.completedKits.specialized || []).filter(k => k.imbued);
}

// ============================================
// EXPORTACIONES GLOBALES
// ============================================

window.openSaleRegistrationModal = openSaleRegistrationModal;
window.updateSalePreview = updateSalePreview;
window.skipSaleRegistration = skipSaleRegistration;
window.confirmSaleRegistration = confirmSaleRegistration;
window.openKitCostModal = openKitCostModal;
window.confirmAddKitToInventory = confirmAddKitToInventory;
window.renderCompletedKits = renderCompletedKits;
window.openAddBasicKitModal = openAddBasicKitModal;
window.addBasicKitToInventory = addBasicKitToInventory;
window.openAddSpecializedKitModal = openAddSpecializedKitModal;
window.addSpecializedKitToInventory = addSpecializedKitToInventory;
window.openAddProfessionalKitModal = openAddProfessionalKitModal;
window.addProfessionalKitToInventory = addProfessionalKitToInventory;
window.updateKitCostLabels = updateKitCostLabels;
window.convertKitCostRefToLocal = convertKitCostRefToLocal;
window.convertKitCostLocalToRef = convertKitCostLocalToRef;
window.updateSheenPreview = updateSheenPreview;
window.updateKillstreakerPreview = updateKillstreakerPreview;
window.updateComboPreview = updateComboPreview;
window.deleteCompletedKit = deleteCompletedKit;
window.toggleKitImbued = toggleKitImbued;
window.getImbuedBasicKits = getImbuedBasicKits;
window.getImbuedSpecializedKits = getImbuedSpecializedKits;
window.formatKitDate = formatKitDate;
