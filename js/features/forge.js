// ============================================
// LA FORJA - Gestión de Proyectos
// ============================================

// Límites de piezas por tipo de kit (totales)
const KIT_PARTS_LIMITS = {
    specialized: 29,
    professional: 25
};

// Límites por CATEGORÍA para cada tipo de kit
const CATEGORY_LIMITS = {
    specialized: {
        pristine: 0,      // Specialized NO usa Pristine
        reinforced: 5,
        'battle-worn': 24
    },
    professional: {
        pristine: 3,
        reinforced: 6,
        'battle-worn': 16
    }
};

// Variable para contador de armas Specialized
let specWeaponsCount = 0;

// ============================================
// INICIALIZACIÓN
// ============================================

function initForge() {
    initProjectForm();
    renderProjectsList();
    populateSelectOptions();
    setupForgeEventListeners();
    renderValuationSystem();
    initPopularityGuide();
        // Cambia la pestaña activa y actualiza las opciones de venta según la estrategia
        function switchComparisonTab(event, strategy) {
            event.preventDefault();
            // Cambiar pestaña activa
            document.querySelectorAll('.comparison-tab-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.tab === strategy);
            });
            // Actualizar contenido de opciones
            const modal = document.querySelector('.price-comparison-modal');
            if (!modal) return;
            const kitName = modal.querySelector('.modal-weapon-name')?.textContent;
            if (!kitName) return;
            // Buscar el kit por nombre (puedes ajustar si usas ID)
            const kit = (window.getAllKits ? window.getAllKits() : []).find(k => k.weapon === kitName);
            if (!kit) return;
            // Obtener info de demanda y calcular mejores opciones para la estrategia
            const demandInfo = window.getKitDemandInfo ? window.getKitDemandInfo(kit) : null;
            let bestOptions = [];
            if (window.calculateBestSellOptions) {
                bestOptions = window.calculateBestSellOptions(kit.id, demandInfo, strategy);
            }
            let optionsHtml = '';
            if (!bestOptions || bestOptions.length === 0) {
                optionsHtml = `
                    <div class="comparison-modal-empty">
                        <span class="empty-icon">💡</span>
                        <p>No hay precios ingresados</p>
                        <small>Ingresa precios en las pestañas de tiendas para ver la comparativa</small>
                    </div>
                `;
            } else {
                const top3 = bestOptions.slice(0, 3);
                optionsHtml = `
                    <div class="comparison-modal-options">
                        ${top3.map((opt, index) => `
                            <div class="comparison-modal-option rank-${index + 1}" style="--store-color: ${opt.store.color}">
                                <div class="option-rank">${index + 1}</div>
                                <div class="option-store">${opt.store.name}</div>
                                <div class="option-price">${opt.netPrice.toFixed(2)} ${opt.currencyType === 'keys_refs' ? 'Refs' : opt.currencyType.toUpperCase()}</div>
                                <div class="option-conversions">${window.generateConversionsHtml ? window.generateConversionsHtml(opt) : ''}</div>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
            const body = modal.querySelector('.comparison-modal-body');
            if (body) {
                body.innerHTML = `<h3 class="modal-section-title">🏆 Mejores Opciones de Venta</h3>${optionsHtml}`;
            }
        }

        // Asegurar exportación global
        window.switchComparisonTab = switchComparisonTab;
}

function populateSelectOptions() {
    // Poblar Sheens
    const sheenSelect = document.getElementById('sheenSelect');
    if (sheenSelect) {
        SHEENS.forEach(sheen => {
            const option = document.createElement('option');
            option.value = sheen.id;
            option.textContent = sheen.name;
            option.style.color = sheen.color;
            sheenSelect.appendChild(option);
        });
    }
    
    // Poblar Killstreakers
    const killstreakerSelect = document.getElementById('killstreakerSelect');
    if (killstreakerSelect) {
        KILLSTREAKERS.forEach(effect => {
            const option = document.createElement('option');
            option.value = effect.id;
            option.textContent = effect.name;
            killstreakerSelect.appendChild(option);
        });
    }
}

function setupForgeEventListeners() {
    // Listener para cambio de tipo de kit
    const kitTypeSelect = document.getElementById('kitType');
    
    if (kitTypeSelect) {
        kitTypeSelect.addEventListener('change', (e) => {
            const type = e.target.value;
            updateForgeFormFields(type);
            generatePartsRequirementsInputs(type);
            updateRequirementsText(type);
            
            // Mostrar/ocultar grupo de killstreaker
            const ksGroup = document.getElementById('killstreakerGroup');
            if (ksGroup) {
                ksGroup.style.display = type === 'professional' ? 'block' : 'none';
            }
        });
    }
    
    // Listeners para pestañas de armas
    setupWeaponTabs();
}

// ============================================
// WEAPON TABS SYSTEM
// ============================================

function setupWeaponTabs() {
    // Delegate event para todas las pestañas de armas
    document.addEventListener('click', (e) => {
        const tab = e.target.closest('.weapon-tab');
        if (!tab) return;
        
        const container = tab.closest('.weapon-tabs-container');
        if (!container) return;
        
        const tabId = tab.dataset.tab;
        
        // Desactivar todas las pestañas del contenedor
        container.querySelectorAll('.weapon-tab').forEach(t => t.classList.remove('active'));
        container.querySelectorAll('.weapon-tab-content').forEach(c => c.classList.remove('active'));
        
        // Activar la pestaña clickeada
        tab.classList.add('active');
        const content = container.querySelector(`#${tabId}`);
        if (content) {
            content.classList.add('active');
        }
    });
}

// Limpiar selección de arma Basic
function clearBasicWeaponSelection() {
    document.getElementById('basicWeaponName').value = '';
    document.getElementById('basicWeaponCost').value = '0';
    document.getElementById('hasBasicWeapon').checked = false;
    
    // Ocultar display de selección
    const display = document.getElementById('selectedBasicWeapon');
    if (display) display.style.display = 'none';
    
    // Quitar clase selected de cards
    document.querySelectorAll('#availableBasicKits .available-weapon-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    showToast('Selección de arma Basic limpiada', 'info');
}

// Limpiar selección de arma Specialized (slot 1 o 2)
function clearSpecWeaponSelection(slot) {
    document.getElementById(`specWeapon${slot}Name`).value = '';
    document.getElementById(`specWeapon${slot}Cost`).value = '0';
    document.getElementById(`specWeapon${slot}Has`).checked = false;
    
    // Ocultar el slot display
    const slotDisplay = document.getElementById(`selectedSpecWeapon${slot}`);
    if (slotDisplay) slotDisplay.style.display = 'none';
    
    updateSpecWeaponStatus();
    showToast(`Slot ${slot} limpiado`, 'info');
}

// ============================================
// FORMULARIO DE PROYECTO
// ============================================

function initProjectForm() {
    const form = document.getElementById('projectForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const type = document.getElementById('kitType').value;
        const weapon = document.getElementById('weaponName').value.trim();
        const sheenId = document.getElementById('sheenSelect').value;
        const killstreakerId = document.getElementById('killstreakerSelect').value;
        
        // Campos de Basic Weapon (para Specialized)
        const hasBasicWeapon = document.getElementById('hasBasicWeapon')?.checked || false;
        const basicWeaponName = document.getElementById('basicWeaponName')?.value.trim() || '';
        const basicWeaponCost = parseFloat(document.getElementById('basicWeaponCost')?.value) || 0;
        // ID del kit seleccionado de la mochila (para eliminar después)
        const basicWeaponKitId = document.getElementById('selectedBasicWeapon')?.dataset?.kitId || null;
        
        if (!type || !weapon || !sheenId) {
            showToast('Completa todos los campos requeridos', 'error');
            return;
        }
        
        if (type === 'professional' && !killstreakerId) {
            showToast('Selecciona un Killstreaker para kit Professional', 'error');
            return;
        }
        
        // Obtener requisitos personalizados de piezas
        const customPartsRequirements = getPartsRequirementsFromForm();
        const totalPartsRequired = Object.values(customPartsRequirements).reduce((sum, val) => sum + val, 0);
        
        // Validación: Debe tener al menos 1 pieza configurada
        if (totalPartsRequired === 0) {
            showToast('Debes especificar las piezas que solicita tu fabricador', 'error');
            return;
        }
        
        const sheen = SHEENS.find(s => s.id === sheenId);
        const killstreaker = KILLSTREAKERS.find(k => k.id === killstreakerId);
        
        // Datos de Specialized Weapons para Professional
        let specWeaponsData = null;
        let specWeaponsCount = 0;
        let specWeaponsTotalCost = 0;
        
        if (type === 'professional') {
            const weapon1Has = document.getElementById('specWeapon1Has')?.checked || false;
            const weapon1Name = document.getElementById('specWeapon1Name')?.value.trim() || '';
            const weapon1Cost = parseFloat(document.getElementById('specWeapon1Cost')?.value) || 0;
            const weapon1KitId = document.getElementById('selectedSpecWeapon1')?.dataset?.kitId || null;
            
            const weapon2Has = document.getElementById('specWeapon2Has')?.checked || false;
            const weapon2Name = document.getElementById('specWeapon2Name')?.value.trim() || '';
            const weapon2Cost = parseFloat(document.getElementById('specWeapon2Cost')?.value) || 0;
            const weapon2KitId = document.getElementById('selectedSpecWeapon2')?.dataset?.kitId || null;
            
            specWeaponsData = {
                weapon1: { has: weapon1Has, weapon: weapon1Name, cost: weapon1Cost, kitId: weapon1KitId },
                weapon2: { has: weapon2Has, weapon: weapon2Name, cost: weapon2Cost, kitId: weapon2KitId }
            };
            
            specWeaponsCount = (weapon1Has ? 1 : 0) + (weapon2Has ? 1 : 0);
            specWeaponsTotalCost = weapon1Cost + weapon2Cost;
        }
        
        // Crear proyecto con requisitos personalizados por pieza
        const project = {
            id: Date.now(),
            type: type,
            weapon: weapon,
            sheen: sheen,
            killstreaker: type === 'professional' ? killstreaker : null,
            partsRequirements: customPartsRequirements,
            partsRequired: totalPartsRequired,
            partsCollected: Object.keys(customPartsRequirements).reduce((acc, partId) => {
                acc[partId] = 0;
                return acc;
            }, {}),
            // Datos de Basic Weapon (para Specialized) - incluyendo kitId para eliminación
            basicWeaponData: type === 'specialized' ? {
                has: hasBasicWeapon,
                weapon: basicWeaponName,
                cost: basicWeaponCost,
                kitId: basicWeaponKitId  // ← ID para eliminar del inventario
            } : null,
            // Datos de Specialized Weapons (para Professional) - incluyendo kitIds
            specWeaponsData: type === 'professional' ? specWeaponsData : null,
            specWeaponsCollected: type === 'professional' ? specWeaponsCount : null,
            specWeaponsTotalCost: type === 'professional' ? specWeaponsTotalCost : null,
            createdAt: new Date().toISOString()
        };
        
        appState.projects.push(project);
        saveToStorage();
        
        // Reset form
        form.reset();
        document.getElementById('killstreakerGroup').style.display = 'none';
        updateForgeFormFields(null);
        generatePartsRequirementsInputs(null);
        document.getElementById('reqText').textContent = 'Selecciona un tipo de kit para ver los requisitos.';
        resetSpecKitsForm();
        
        renderProjectsList();
        updateDashboard();
        showToast(`Proyecto "${weapon}" creado exitosamente`, 'success');
    });
}

// ============================================
// REQUISITOS DE PIEZAS
// ============================================

function generatePartsRequirementsInputs(kitType) {
    const container = document.getElementById('partsRequirementsInputs');
    const partsGroup = document.getElementById('partsRequirementsGroup');
    
    console.log('=== generatePartsRequirementsInputs ===');
    console.log('kitType:', kitType);
    console.log('container:', container);
    console.log('partsGroup:', partsGroup);
    
    if (!container) {
        console.error('Container partsRequirementsInputs not found');
        return;
    }
    
    // Limpiar contenedor
    container.innerHTML = '';
    
    if (!kitType) {
        container.innerHTML = '<p class="select-kit-msg">Selecciona un tipo de kit primero</p>';
        if (partsGroup) partsGroup.style.display = 'none';
        return;
    }
    
    // Mostrar el grupo de piezas
    if (partsGroup) {
        partsGroup.style.display = 'block';
        partsGroup.style.visibility = 'visible';
        partsGroup.style.opacity = '1';
        partsGroup.style.height = 'auto';
        partsGroup.classList.add('visible');
        console.log('partsGroup display set to block');
    }
    
    const kitInfo = CRAFTING_REQUIREMENTS[kitType];
    if (!kitInfo) {
        console.error('Kit info not found for:', kitType);
        return;
    }
    
    const allowedCategories = kitInfo.allowedCategories || ['pristine', 'reinforced', 'battle-worn'];
    const defaultBreakdown = kitInfo.partsBreakdown;
    
    // LÍMITE MÁXIMO DE PIEZAS según tipo de kit
    const maxPartsLimit = kitType === 'specialized' ? 29 : 25;
    
    // Filtrar piezas según categorías permitidas
    const filteredParts = ROBOT_PARTS.filter(p => allowedCategories.includes(p.category));
    console.log('Filtered parts count:', filteredParts.length);
    
    // Header con total y límite máximo
    const header = document.createElement('div');
    header.className = 'parts-limit-header';
    header.innerHTML = `
        <span class="limit-text">Total de piezas del fabricador:</span>
        <div class="total-limit-display">
            <span class="total-display" id="partsTotal">0</span>
            <span class="limit-separator">/</span>
            <span class="max-limit" id="partsMaxLimit">${maxPartsLimit}</span>
        </div>
    `;
    container.appendChild(header);
    
    // Guardar el límite máximo en el contenedor para referencia
    container.dataset.maxLimit = maxPartsLimit;
    container.dataset.kitType = kitType;
    
    // Crear secciones por categoría
    const categories = ['pristine', 'reinforced', 'battle-worn'];
    const categoryLimits = CATEGORY_LIMITS[kitType] || {};
    
    categories.forEach(category => {
        const categoryParts = filteredParts.filter(p => p.category === category);
        if (categoryParts.length === 0) return;
        
        const categoryConfig = PART_CATEGORY_CONFIG[category];
        const categoryLimit = categoryLimits[category] || 0;
        
        // Sección de categoría
        const section = document.createElement('div');
        section.className = 'parts-category-section';
        section.id = `category-${category}`;
        section.dataset.categoryLimit = categoryLimit;
        
        // Header de categoría (colapsable) - ahora con límite estricto
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header-row collapsible';
        categoryHeader.innerHTML = `
            <div class="category-header-left">
                <span class="collapse-icon" id="collapse-icon-${category}">▼</span>
                <span class="category-dot" style="background: ${categoryConfig.color}"></span>
                <h5 class="category-label" style="color: ${categoryConfig.color}">${categoryConfig.label}</h5>
            </div>
            <div class="category-header-right">
                <span class="category-subtotal" id="subtotal-${category}">0</span>
                <span class="category-limit-separator">/</span>
                <span class="category-max-limit" id="limit-${category}" data-limit="${categoryLimit}">${categoryLimit}</span>
                <span class="category-limit-icon" id="limit-icon-${category}" title="Límite de categoría">🔒</span>
            </div>
        `;
        categoryHeader.onclick = () => togglePartsCategory(category);
        section.appendChild(categoryHeader);
        
        // Lista de piezas
        const partsList = document.createElement('div');
        partsList.className = 'category-parts-list';
        partsList.id = `parts-list-${category}`;
        
        categoryParts.forEach(part => {
            const shortName = part.name
                .replace('Pristine Robot ', '')
                .replace('Reinforced Robot ', '')
                .replace('Battle-Worn Robot ', '');
            
            const partRow = document.createElement('div');
            partRow.className = 'part-req-row';
            // Cantidad disponible en inventario
            const availableQty = appState.inventory?.parts?.[part.id] || 0;
            
            partRow.innerHTML = `
                <img src="${part.image}" alt="${shortName}" class="part-req-img">
                <span class="part-req-name">${shortName}</span>
                <span class="part-available ${availableQty > 0 ? 'has-stock' : 'no-stock'}" title="En inventario">(${availableQty})</span>
                <div class="part-req-counter">
                    <button type="button" class="part-req-btn minus" data-part="${part.id}" data-category="${category}">−</button>
                    <input type="number" class="part-req-input" data-part="${part.id}" data-category="${category}" value="0" min="0" max="99">
                    <button type="button" class="part-req-btn plus" data-part="${part.id}" data-category="${category}">+</button>
                </div>
            `;
            
            // Event listeners
            const minusBtn = partRow.querySelector('.minus');
            const plusBtn = partRow.querySelector('.plus');
            const input = partRow.querySelector('.part-req-input');
            
            minusBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const current = parseInt(input.value) || 0;
                if (current > 0) {
                    input.value = current - 1;
                    updatePartsTotalDisplay(container);
                    updateCategorySubtotal(category);
                }
            });
            
            plusBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const current = parseInt(input.value) || 0;
                const maxLimit = parseInt(container.dataset.maxLimit) || 99;
                const currentTotal = calculatePartsTotal(container);
                const kitType = container.dataset.kitType;
                
                // Obtener límite de categoría
                const categoryLimit = CATEGORY_LIMITS[kitType]?.[category] || 99;
                const categoryTotal = getCategoryTotal(category);
                
                // Verificar límite de categoría primero
                if (categoryTotal >= categoryLimit) {
                    showToast(`⚠️ Límite de ${categoryConfig.label}: ${categoryLimit} piezas`, 'warning');
                    highlightCategoryLimit(category);
                    return;
                }
                
                // Verificar límite total
                if (currentTotal >= maxLimit) {
                    showToast(`Límite máximo de ${maxLimit} piezas alcanzado`, 'warning');
                    return;
                }
                
                input.value = current + 1;
                updatePartsTotalDisplay(container);
                updateCategorySubtotal(category);
            });
            
            input.addEventListener('input', () => {
                let val = parseInt(input.value) || 0;
                const maxLimit = parseInt(container.dataset.maxLimit) || 99;
                const kitType = container.dataset.kitType;
                const categoryLimit = CATEGORY_LIMITS[kitType]?.[category] || 99;
                
                // Calcular totales excluyendo esta pieza
                const otherPartsTotal = calculatePartsTotalExcluding(container, part.id);
                const otherCategoryTotal = getCategoryTotalExcluding(category, part.id);
                
                // Límite por categoría
                const maxByCategory = categoryLimit - otherCategoryTotal;
                // Límite por total general
                const maxByTotal = maxLimit - otherPartsTotal;
                // El límite real es el menor de ambos
                const maxAllowed = Math.min(maxByCategory, maxByTotal);
                
                if (val > maxAllowed) {
                    val = maxAllowed;
                    if (maxByCategory < maxByTotal) {
                        showToast(`⚠️ Límite de ${categoryConfig.label}: ${categoryLimit}`, 'warning');
                        highlightCategoryLimit(category);
                    } else {
                        showToast(`Límite total: ${maxLimit} piezas`, 'warning');
                    }
                }
                
                input.value = Math.max(0, val);
                updatePartsTotalDisplay(container);
                updateCategorySubtotal(category);
            });
            
            partsList.appendChild(partRow);
        });
        
        section.appendChild(partsList);
        container.appendChild(section);
        
        console.log(`Added ${categoryParts.length} parts for category ${category}`);
    });
    
    // Mensaje de estado
    const statusSection = document.createElement('div');
    statusSection.className = 'parts-status-section';
    statusSection.innerHTML = `
        <div class="parts-status-msg" id="partsStatusMsg">
            Ingresa las piezas que solicita tu fabricador
        </div>
        <div class="parts-default-hint">
            <small>💡 Aproximado por defecto: ${kitInfo.parts} piezas</small>
        </div>
    `;
    container.appendChild(statusSection);
    
    console.log('Container innerHTML length:', container.innerHTML.length);
    console.log('Container childNodes:', container.childNodes.length);
}

// Toggle para colapsar/expandir categoría
function togglePartsCategory(category) {
    const partsList = document.getElementById(`parts-list-${category}`);
    const collapseIcon = document.getElementById(`collapse-icon-${category}`);
    
    if (partsList && collapseIcon) {
        const isHidden = partsList.classList.toggle('collapsed');
        collapseIcon.textContent = isHidden ? '▶' : '▼';
    }
}

// Actualizar subtotal de categoría
function updateCategorySubtotal(category) {
    const inputs = document.querySelectorAll(`.part-req-input[data-category="${category}"]`);
    let subtotal = 0;
    inputs.forEach(input => {
        subtotal += parseInt(input.value) || 0;
    });
    
    const subtotalEl = document.getElementById(`subtotal-${category}`);
    const limitEl = document.getElementById(`limit-${category}`);
    const limitIcon = document.getElementById(`limit-icon-${category}`);
    const section = document.getElementById(`category-${category}`);
    
    if (subtotalEl) {
        subtotalEl.textContent = subtotal;
        
        // Obtener el límite de la categoría
        const limit = limitEl ? parseInt(limitEl.dataset.limit) || 99 : 99;
        
        // Actualizar estilos según estado
        if (subtotal >= limit) {
            subtotalEl.className = 'category-subtotal at-limit';
            if (limitIcon) limitIcon.textContent = '🔒';
            if (section) section.classList.add('at-limit');
        } else if (subtotal > 0) {
            subtotalEl.className = 'category-subtotal has-value';
            if (limitIcon) limitIcon.textContent = '';
            if (section) section.classList.remove('at-limit');
        } else {
            subtotalEl.className = 'category-subtotal';
            if (limitIcon) limitIcon.textContent = '';
            if (section) section.classList.remove('at-limit');
        }
    }
}

// Obtener total de una categoría
function getCategoryTotal(category) {
    const inputs = document.querySelectorAll(`.part-req-input[data-category="${category}"]`);
    let total = 0;
    inputs.forEach(input => {
        total += parseInt(input.value) || 0;
    });
    return total;
}

// Obtener total de categoría excluyendo una pieza
function getCategoryTotalExcluding(category, excludePartId) {
    const inputs = document.querySelectorAll(`.part-req-input[data-category="${category}"]`);
    let total = 0;
    inputs.forEach(input => {
        if (input.dataset.part !== excludePartId) {
            total += parseInt(input.value) || 0;
        }
    });
    return total;
}

// Resaltar visualmente cuando se alcanza el límite de categoría
function highlightCategoryLimit(category) {
    const section = document.getElementById(`category-${category}`);
    if (section) {
        section.classList.add('limit-flash');
        setTimeout(() => {
            section.classList.remove('limit-flash');
        }, 600);
    }
}

function getCurrentPartsTotal(container) {
    let total = 0;
    container.querySelectorAll('.part-req-input').forEach(input => {
        total += parseInt(input.value) || 0;
    });
    return total;
}

// Calcular total de piezas
function calculatePartsTotal(container) {
    return getCurrentPartsTotal(container);
}

// Calcular total excluyendo una pieza específica
function calculatePartsTotalExcluding(container, excludePartId) {
    let total = 0;
    container.querySelectorAll('.part-req-input').forEach(input => {
        if (input.dataset.part !== excludePartId) {
            total += parseInt(input.value) || 0;
        }
    });
    return total;
}

function updatePartsTotalDisplay(container) {
    const total = getCurrentPartsTotal(container);
    const maxLimit = parseInt(container.dataset.maxLimit) || 99;
    const totalDisplay = document.getElementById('partsTotal');
    const maxLimitDisplay = document.getElementById('partsMaxLimit');
    
    if (totalDisplay) {
        totalDisplay.textContent = total;
        
        // Colorear según el estado
        if (total === 0) {
            totalDisplay.className = 'total-display';
        } else if (total === maxLimit) {
            totalDisplay.className = 'total-display at-limit';
        } else if (total > maxLimit) {
            totalDisplay.className = 'total-display over-limit';
        } else {
            totalDisplay.className = 'total-display has-value';
        }
    }
    
    // Actualizar el límite máximo también
    if (maxLimitDisplay) {
        maxLimitDisplay.textContent = maxLimit;
    }
    
    const statusMsg = document.getElementById('partsStatusMsg');
    if (statusMsg) {
        if (total === 0) {
            statusMsg.textContent = 'Ingresa las piezas que solicita tu fabricador';
            statusMsg.className = 'parts-status-msg';
        } else if (total === maxLimit) {
            statusMsg.textContent = `✓ ${total}/${maxLimit} piezas - Límite alcanzado`;
            statusMsg.className = 'parts-status-msg at-limit';
        } else if (total > maxLimit) {
            statusMsg.textContent = `⚠️ ${total}/${maxLimit} - Excede el límite`;
            statusMsg.className = 'parts-status-msg over-limit';
        } else {
            statusMsg.textContent = `${total}/${maxLimit} piezas configuradas`;
            statusMsg.className = 'parts-status-msg has-parts';
        }
    }
}

function getPartsRequirementsFromForm() {
    const requirements = {};
    const inputs = document.querySelectorAll('.part-req-input');
    
    inputs.forEach(input => {
        const partId = input.dataset.part;
        const value = parseInt(input.value) || 0;
        if (value > 0) {
            requirements[partId] = value;
        }
    });
    
    return requirements;
}

function updateRequirementsText(type) {
    const reqText = document.getElementById('reqText');
    if (!reqText) return;
    
    const kitInfo = CRAFTING_REQUIREMENTS[type];
    if (!kitInfo) {
        reqText.innerHTML = `
            <span class="info-placeholder">Selecciona un tipo de kit para ver los requisitos.</span>
        `;
        return;
    }
    
    const breakdown = kitInfo.partsBreakdown;
    const totalParts = kitInfo.parts;
    const allowedCategories = kitInfo.allowedCategories || ['pristine', 'reinforced', 'battle-worn'];
    
    // Generar solo las categorías permitidas
    let breakdownHtml = '';
    if (allowedCategories.includes('pristine') && breakdown.pristine > 0) {
        breakdownHtml += `
            <span class="req-part pristine">
                <span class="part-dot" style="background: #FFD700"></span>
                Pristine: ${breakdown.pristine}
            </span>
        `;
    }
    if (allowedCategories.includes('reinforced')) {
        breakdownHtml += `
            <span class="req-part reinforced">
                <span class="part-dot" style="background: #0066FF"></span>
                Reinforced: ${breakdown.reinforced}
            </span>
        `;
    }
    if (allowedCategories.includes('battle-worn')) {
        breakdownHtml += `
            <span class="req-part battle-worn">
                <span class="part-dot" style="background: #FF69B4"></span>
                Battle-Worn: ${breakdown['battle-worn']}
            </span>
        `;
    }
    
    let requirementsHtml = `
        <div class="kit-info-header">
            <img src="${kitInfo.image}" alt="${kitInfo.label}" class="kit-info-icon">
            <strong>${kitInfo.label}</strong>
        </div>
        <div class="kit-info-requirements">
            <div class="req-total">
                <span class="req-label">Total de piezas (aprox.):</span>
                <span class="req-value">${totalParts}</span>
            </div>
            <div class="req-breakdown">
                ${breakdownHtml}
            </div>
            <div class="req-note">
                <small>⚠️ Cada fabricador puede variar. Ajusta las cantidades según tu fabricador.</small>
            </div>
        </div>
    `;
    
    // Requisitos de armas Killstreak
    if (kitInfo.requiresWeapon) {
        const weaponIcon = kitInfo.weaponType === 'basic' 
            ? 'https://wiki.teamfortress.com/w/images/e/e4/Item_icon_Killstreak_Kit.png'
            : 'https://wiki.teamfortress.com/w/images/2/2e/Item_icon_Specialized_Killstreak_Kit.png';
        
        requirementsHtml += `
            <div class="kit-info-extra">
                <div class="extra-req weapon-req">
                    <img src="${weaponIcon}" alt="${kitInfo.weaponLabel}" class="extra-icon">
                    <div class="weapon-req-info">
                        <span>Requiere: <strong>${kitInfo.weaponsRequired} ${kitInfo.weaponLabel}</strong></span>
                        <small class="weapon-hint">Arma con kit aplicado para usar en el fabricador</small>
                    </div>
                </div>
            </div>
        `;
    }
    
    reqText.innerHTML = requirementsHtml;
}

// ============================================
// CAMPOS ADICIONALES DEL FORMULARIO
// ============================================

function updateForgeFormFields(type) {
    console.log('=== updateForgeFormFields ===');
    console.log('Tipo seleccionado:', type);
    
    const basicKitGroup = document.getElementById('basicKitGroup');
    const specWeaponsGroup = document.getElementById('specWeaponsGroup');
    const partsRequirementsGroup = document.getElementById('partsRequirementsGroup');
    
    // Método simple: usar style.display directamente (como el original)
    if (type === 'specialized') {
        console.log('Mostrando sección Basic KS Weapon');
        if (basicKitGroup) basicKitGroup.style.display = 'block';
        if (specWeaponsGroup) specWeaponsGroup.style.display = 'none';
        if (partsRequirementsGroup) partsRequirementsGroup.style.display = 'block';
        renderAvailableBasicKits();
    } else if (type === 'professional') {
        console.log('Mostrando sección 2 Specialized KS Weapons');
        if (basicKitGroup) basicKitGroup.style.display = 'none';
        if (specWeaponsGroup) specWeaponsGroup.style.display = 'block';
        if (partsRequirementsGroup) partsRequirementsGroup.style.display = 'block';
        renderAvailableSpecializedKits();
        updateSpecWeaponStatus();
    } else {
        if (basicKitGroup) basicKitGroup.style.display = 'none';
        if (specWeaponsGroup) specWeaponsGroup.style.display = 'none';
        if (partsRequirementsGroup) partsRequirementsGroup.style.display = 'none';
    }
}

// Verificar disponibilidad de Basic KS Weapons
function checkBasicWeaponsAvailability() {
    const basicWeapons = getBasicKillstreakWeapons();
    const totalBasic = appState.inventory?.completedKits?.basic?.length || 0;
    const imbuedCount = basicWeapons.length;
    
    console.log(`Basic KS: ${imbuedCount} imbuidos de ${totalBasic} total`);
    
    // Actualizar UI según disponibilidad
    const container = document.getElementById('availableBasicKits');
    if (container && imbuedCount === 0 && totalBasic > 0) {
        // Hay kits pero ninguno imbuido
        container.innerHTML = `
            <div class="no-kits-available warning">
                <span class="no-kits-icon">⚠️</span>
                <span>Tienes ${totalBasic} Basic Kit(s) pero ninguno está imbuido</span>
                <span class="no-kits-hint">Ve a Mochila y marca alguno como "Imbuido"</span>
                <a href="#" onclick="event.preventDefault(); switchToTab('backpack');" class="add-kit-link">
                    📦 Ir a Mochila
                </a>
            </div>
        `;
    }
}

// Verificar disponibilidad de Specialized KS Weapons
function checkSpecializedWeaponsAvailability() {
    const specWeapons = getSpecializedKillstreakWeapons();
    const totalSpec = appState.inventory?.completedKits?.specialized?.length || 0;
    const imbuedCount = specWeapons.length;
    
    console.log(`Specialized KS: ${imbuedCount} imbuidos de ${totalSpec} total`);
    
    // Actualizar UI según disponibilidad
    const container = document.getElementById('availableSpecializedKits');
    if (container && imbuedCount < 2 && totalSpec > 0) {
        const neededMore = 2 - imbuedCount;
        if (imbuedCount === 0) {
            container.innerHTML = `
                <div class="no-kits-available warning">
                    <span class="no-kits-icon">⚠️</span>
                    <span>Tienes ${totalSpec} Specialized Kit(s) pero ninguno está imbuido</span>
                    <span class="no-kits-hint">Necesitas 2 armas imbuidas. Ve a Mochila y márcalas.</span>
                    <a href="#" onclick="event.preventDefault(); switchToTab('backpack');" class="add-kit-link">
                        📦 Ir a Mochila
                    </a>
                </div>
            `;
        }
    }
}

// Actualizar estado de las armas Specialized (para Professional)
function updateSpecWeaponStatus() {
    const weapon1Has = document.getElementById('specWeapon1Has')?.checked || false;
    const weapon2Has = document.getElementById('specWeapon2Has')?.checked || false;
    const count = (weapon1Has ? 1 : 0) + (weapon2Has ? 1 : 0);
    
    const summaryEl = document.getElementById('specWeaponsSummary');
    if (summaryEl) {
        summaryEl.textContent = `${count}/2 Weapons seleccionadas`;
        summaryEl.style.color = count === 2 ? 'var(--accent-green)' : 'var(--accent-gold)';
    }
    
    // Actualizar visibilidad de displays
    if (!weapon1Has) {
        const slot1 = document.getElementById('selectedSpecWeapon1');
        if (slot1) slot1.style.display = 'none';
    }
    if (!weapon2Has) {
        const slot2 = document.getElementById('selectedSpecWeapon2');
        if (slot2) slot2.style.display = 'none';
    }
}

// ============================================
// KITS DISPONIBLES PARA SELECCIÓN
// ============================================

function renderAvailableBasicKits() {
    const container = document.getElementById('availableBasicKits');
    if (!container) {
        console.log('Container availableBasicKits no encontrado');
        return;
    }
    
    // Buscar armas con Basic Killstreak en la mochila (kits imbuidos)
    const basicKSWeapons = getBasicKillstreakWeapons();
    
    console.log('Basic KS Weapons disponibles:', basicKSWeapons);
    console.log('Total Basic kits en inventario:', appState.inventory?.completedKits?.basic?.length || 0);
    console.log('Basic kits imbuidos:', basicKSWeapons.length);
    
    if (basicKSWeapons.length === 0) {
        const totalBasic = appState.inventory?.completedKits?.basic?.length || 0;
        const notImbuedMsg = totalBasic > 0 
            ? `Tienes ${totalBasic} kit(s) pero ninguno está imbuido` 
            : 'No tienes armas con Basic KS en tu mochila';
        
        container.innerHTML = `
            <div class="no-kits-available">
                <span class="no-kits-icon">📭</span>
                <span>${notImbuedMsg}</span>
                <a href="#" onclick="event.preventDefault(); switchToTab('backpack');" class="add-kit-link">
                    + Ver Mochila
                </a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = basicKSWeapons.map(weapon => `
        <div class="available-weapon-card" data-weapon-id="${weapon.id}" onclick="selectBasicWeaponForProject('${weapon.id}')">
            <img src="https://wiki.teamfortress.com/w/images/e/e4/Item_icon_Killstreak_Kit.png" alt="Basic KS" class="weapon-mini-icon">
            <div class="weapon-mini-info">
                <span class="weapon-mini-name">${weapon.weapon}</span>
                <span class="weapon-mini-status">⚔️ Basic Killstreak</span>
            </div>
            ${weapon.cost ? `<span class="weapon-mini-cost">${parseFloat(weapon.cost).toFixed(2)} Ref</span>` : ''}
            <span class="select-weapon-btn">Usar</span>
        </div>
    `).join('');
}

// Obtener armas con Basic Killstreak de la mochila (kits imbuidos)
function getBasicKillstreakWeapons() {
    const kits = appState.inventory?.completedKits?.basic || [];
    return kits.filter(kit => kit.imbued === true);
}

// Seleccionar un arma Basic KS para el proyecto
function selectBasicWeaponForProject(weaponId) {
    const weapons = getBasicKillstreakWeapons();
    const weapon = weapons.find(w => w.id === weaponId);
    
    console.log('Seleccionando arma Basic:', weapon); // Debug
    
    if (weapon) {
        document.getElementById('basicWeaponName').value = weapon.weapon;
        document.getElementById('basicWeaponCost').value = weapon.cost || 0;
        document.getElementById('hasBasicWeapon').checked = true;
        
        // Marcar la card como seleccionada
        document.querySelectorAll('#availableBasicKits .available-weapon-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`#availableBasicKits .available-weapon-card[data-weapon-id="${weaponId}"]`)?.classList.add('selected');
        
        // Mostrar display de selección Y guardar el ID del kit
        const display = document.getElementById('selectedBasicWeapon');
        const nameSpan = document.getElementById('selectedBasicWeaponName');
        if (display && nameSpan) {
            nameSpan.textContent = `${weapon.weapon} (${parseFloat(weapon.cost || 0).toFixed(2)} Ref)`;
            display.style.display = 'flex';
            display.dataset.kitId = weaponId; // ← GUARDAR ID DEL KIT
        }
        
        showToast(`Arma "${weapon.weapon}" seleccionada`, 'success');
    }
}

function renderAvailableSpecializedKits() {
    const container = document.getElementById('availableSpecializedKits');
    if (!container) return;
    
    // Buscar armas con Specialized Killstreak en la mochila (kits imbuidos)
    const specKSWeapons = getSpecializedKillstreakWeapons();
    
    console.log('Specialized KS Weapons disponibles:', specKSWeapons); // Debug
    
    if (specKSWeapons.length === 0) {
        container.innerHTML = `
            <div class="no-kits-available">
                <span class="no-kits-icon">📭</span>
                <span>No tienes armas con Specialized KS</span>
                <span class="no-kits-hint">Completa proyectos Specialized y márcalos como imbuidos</span>
            </div>
        `;
        return;
    }
    
    container.innerHTML = specKSWeapons.map((weapon, index) => {
        const sheen = SHEENS.find(s => s.id === weapon.sheen);
        return `
            <div class="available-weapon-card specialized" 
                 data-weapon-id="${weapon.id}" 
                 onclick="selectSpecWeaponForProject('${weapon.id}')">
                <img src="https://wiki.teamfortress.com/w/images/2/2e/Item_icon_Specialized_Killstreak_Kit.png" alt="Specialized KS" class="weapon-mini-icon">
                <div class="weapon-mini-info">
                    <span class="weapon-mini-name">${weapon.weapon}</span>
                    <span class="weapon-mini-sheen" style="color: ${weapon.sheenColor || sheen?.color || '#FFF'}">✨ ${weapon.sheenName || sheen?.name || 'Sheen'}</span>
                </div>
                ${weapon.cost ? `<span class="weapon-mini-cost">${parseFloat(weapon.cost).toFixed(2)} Ref</span>` : ''}
                <span class="select-weapon-btn">Usar</span>
            </div>
        `;
    }).join('');
}

// Obtener armas con Specialized Killstreak de la mochila (kits imbuidos)
function getSpecializedKillstreakWeapons() {
    const kits = appState.inventory?.completedKits?.specialized || [];
    return kits.filter(kit => kit.imbued === true);
}

// Seleccionar un arma Specialized KS para el proyecto Professional
function selectSpecWeaponForProject(weaponId) {
    const weapons = getSpecializedKillstreakWeapons();
    const weapon = weapons.find(w => w.id === weaponId);
    
    if (!weapon) return;
    
    // Determinar qué slot llenar
    const weapon1Name = document.getElementById('specWeapon1Name')?.value.trim();
    const weapon1Has = document.getElementById('specWeapon1Has')?.checked || false;
    const weapon2Name = document.getElementById('specWeapon2Name')?.value.trim();
    const weapon2Has = document.getElementById('specWeapon2Has')?.checked || false;
    
    // Si ya está seleccionada, avisar
    if ((weapon1Name === weapon.weapon && weapon1Has) || (weapon2Name === weapon.weapon && weapon2Has)) {
        showToast('Esta arma ya está seleccionada', 'warning');
        return;
    }
    
    // Determinar slot a llenar y actualizar display
    let slot = 0;
    if (!weapon1Has || !weapon1Name) {
        document.getElementById('specWeapon1Name').value = weapon.weapon;
        document.getElementById('specWeapon1Cost').value = weapon.cost || 0;
        document.getElementById('specWeapon1Has').checked = true;
        slot = 1;
    } else if (!weapon2Has || !weapon2Name) {
        document.getElementById('specWeapon2Name').value = weapon.weapon;
        document.getElementById('specWeapon2Cost').value = weapon.cost || 0;
        document.getElementById('specWeapon2Has').checked = true;
        slot = 2;
    } else {
        showToast('Ambos slots ya están llenos', 'warning');
        return;
    }
    
    // Actualizar display de selección
    const slotDisplay = document.getElementById(`selectedSpecWeapon${slot}`);
    const nameSpan = document.getElementById(`selectedSpecWeapon${slot}Name`);
    if (slotDisplay && nameSpan) {
        const sheen = SHEENS.find(s => s.id === weapon.sheen);
        nameSpan.innerHTML = `<span style="color: ${weapon.sheenColor || sheen?.color || '#FFF'}">${weapon.weapon}</span> (${parseFloat(weapon.cost || 0).toFixed(2)} Ref)`;
        slotDisplay.style.display = 'flex';
        slotDisplay.dataset.kitId = weaponId; // ← GUARDAR ID DEL KIT
    }
    
    updateSpecWeaponStatus();
    showToast(`Arma "${weapon.weapon}" añadida al Slot ${slot}`, 'success');
}

// Compatibilidad con funciones antiguas
function selectBasicKitForProject(kitId) {
    selectBasicWeaponForProject(kitId);
}

function selectSpecializedKitForProject(kitId) {
    const kit = appState.inventory.completedKits.specialized.find(k => k.id === kitId);
    if (!kit) return;
    
    const kit1Has = document.getElementById('specKit1Has')?.checked || false;
    const kit2Has = document.getElementById('specKit2Has')?.checked || false;
    
    const kit1Weapon = document.getElementById('specKit1Weapon')?.value.trim();
    const kit2Weapon = document.getElementById('specKit2Weapon')?.value.trim();
    
    if (kit1Weapon === kit.weapon && kit1Has) {
        showToast('Este kit ya está seleccionado en el Slot 1', 'warning');
        return;
    }
    if (kit2Weapon === kit.weapon && kit2Has) {
        showToast('Este kit ya está seleccionado en el Slot 2', 'warning');
        return;
    }
    
    let targetSlot = 1;
    if (kit1Has && !kit2Has) {
        targetSlot = 2;
    } else if (!kit1Has) {
        targetSlot = 1;
    } else {
        targetSlot = 1;
    }
    
    const hasCheckbox = document.getElementById(`specKit${targetSlot}Has`);
    const weaponInput = document.getElementById(`specKit${targetSlot}Weapon`);
    const costInput = document.getElementById(`specKit${targetSlot}Cost`);
    
    if (hasCheckbox) hasCheckbox.checked = true;
    if (weaponInput) weaponInput.value = kit.weapon;
    if (costInput) costInput.value = kit.basicKitCost || 0;
    
    updateSpecKitStatus();
    
    document.querySelector(`#availableSpecializedKits .available-kit-card[data-kit-id="${kitId}"]`)?.classList.add('selected');
    
    showToast(`Specialized Kit "${kit.weapon}" asignado al Slot ${targetSlot}`, 'success');
}

// ============================================
// SPECIALIZED KITS HELPERS
// ============================================

function updateSpecKitStatus() {
    const kit1Has = document.getElementById('specKit1Has')?.checked || false;
    const kit2Has = document.getElementById('specKit2Has')?.checked || false;
    const count = (kit1Has ? 1 : 0) + (kit2Has ? 1 : 0);
    
    const summary = document.getElementById('specKitsSummary');
    if (summary) {
        summary.textContent = `${count}/2 Kits listos`;
        summary.className = `summary-value ${count === 2 ? 'complete' : count > 0 ? 'partial' : ''}`;
    }
}

function resetSpecKitsForm() {
    // Reset campos de Specialized Weapons (para Professional)
    const checkboxes = ['specWeapon1Has', 'specWeapon2Has'];
    checkboxes.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.checked = false;
    });
    
    const nameFields = ['specWeapon1Name', 'specWeapon2Name'];
    nameFields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    
    const costFields = ['specWeapon1Cost', 'specWeapon2Cost'];
    costFields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '0';
    });
    
    // Ocultar displays de selección
    const slot1 = document.getElementById('selectedSpecWeapon1');
    const slot2 = document.getElementById('selectedSpecWeapon2');
    if (slot1) slot1.style.display = 'none';
    if (slot2) slot2.style.display = 'none';
    
    updateSpecWeaponStatus();
    
    // Reset campos de Basic Weapon (para Specialized)
    const basicName = document.getElementById('basicWeaponName');
    const basicCost = document.getElementById('basicWeaponCost');
    const hasBasic = document.getElementById('hasBasicWeapon');
    const basicDisplay = document.getElementById('selectedBasicWeapon');
    
    if (basicName) basicName.value = '';
    if (basicCost) basicCost.value = '0';
    if (hasBasic) hasBasic.checked = false;
    if (basicDisplay) basicDisplay.style.display = 'none';
    
    // Quitar selecciones de cards
    document.querySelectorAll('.available-weapon-card.selected').forEach(card => {
        card.classList.remove('selected');
    });
}

function updateSpecWeaponsCount(delta) {
    specWeaponsCount = Math.max(0, Math.min(2, specWeaponsCount + delta));
    const countEl = document.getElementById('specWeaponsCount');
    if (countEl) {
        countEl.textContent = specWeaponsCount;
        countEl.className = `counter-value ${specWeaponsCount >= 2 ? 'complete' : ''}`;
    }
}

// ============================================
// LISTA DE PROYECTOS
// ============================================

function renderProjectsList() {
    const container = document.getElementById('projectsList');
    const counter = document.getElementById('projectCounter');
    
    if (counter) counter.textContent = appState.projects.length;
    
    if (!container) return;
    
    if (appState.projects.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📭</span>
                <p>No hay proyectos activos</p>
                <p class="empty-hint">Crea tu primer Killstreak Kit</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    appState.projects.forEach(project => {
        const card = createProjectCard(project);
        container.appendChild(card);
    });
}

function createProjectCard(project) {
    const kitInfo = CRAFTING_REQUIREMENTS[project.type];
    const usesIndividualParts = project.partsRequirements && Object.keys(project.partsRequirements).length > 0;
    
    let totalRequired = 0;
    let totalAvailable = 0;
    let isReady = true;
    let partsHtml = '';
    
    if (usesIndividualParts) {
        Object.entries(project.partsRequirements).forEach(([partId, required]) => {
            const part = ROBOT_PARTS.find(p => p.id === partId);
            if (!part) return;
            
            const available = appState.inventory.parts[partId] || 0;
            const categoryConfig = PART_CATEGORY_CONFIG[part.category];
            const complete = available >= required;
            
            if (!complete) isReady = false;
            
            totalRequired += required;
            totalAvailable += Math.min(available, required);
            
            const shortName = part.name
                .replace('Pristine Robot ', '')
                .replace('Reinforced Robot ', '')
                .replace('Battle-Worn Robot ', '');
            
            partsHtml += `
                <div class="part-item-row ${complete ? 'complete' : 'missing'}">
                    <img src="${part.image}" alt="${shortName}" class="part-item-img">
                    <span class="part-item-name" style="color: ${categoryConfig.color}">${shortName}</span>
                    <span class="part-item-count">${Math.min(available, required)}/${required}</span>
                </div>
            `;
        });
    } else {
        const availableParts = getPartsByCategory();
        const partsStatus = {
            pristine: {
                required: project.partsBreakdown?.pristine || kitInfo.partsBreakdown.pristine,
                available: availableParts.pristine,
                get complete() { return this.available >= this.required; }
            },
            reinforced: {
                required: project.partsBreakdown?.reinforced || kitInfo.partsBreakdown.reinforced,
                available: availableParts.reinforced,
                get complete() { return this.available >= this.required; }
            },
            'battle-worn': {
                required: project.partsBreakdown?.['battle-worn'] || kitInfo.partsBreakdown['battle-worn'],
                available: availableParts['battle-worn'],
                get complete() { return this.available >= this.required; }
            }
        };
        
        totalRequired = partsStatus.pristine.required + partsStatus.reinforced.required + partsStatus['battle-worn'].required;
        totalAvailable = Math.min(partsStatus.pristine.available, partsStatus.pristine.required) +
                         Math.min(partsStatus.reinforced.available, partsStatus.reinforced.required) +
                         Math.min(partsStatus['battle-worn'].available, partsStatus['battle-worn'].required);
        
        isReady = partsStatus.pristine.complete && partsStatus.reinforced.complete && partsStatus['battle-worn'].complete;
        
        partsHtml = `
            <div class="parts-row ${partsStatus.pristine.complete ? 'complete' : ''}">
                <span class="parts-category" style="color: ${PART_CATEGORY_CONFIG.pristine.color}">Pristine</span>
                <div class="parts-mini-bar">
                    <div class="parts-mini-fill" style="width: ${Math.min((partsStatus.pristine.available / partsStatus.pristine.required) * 100, 100)}%; background: ${PART_CATEGORY_CONFIG.pristine.color}"></div>
                </div>
                <span class="parts-count">${Math.min(partsStatus.pristine.available, partsStatus.pristine.required)}/${partsStatus.pristine.required}</span>
            </div>
            <div class="parts-row ${partsStatus.reinforced.complete ? 'complete' : ''}">
                <span class="parts-category" style="color: ${PART_CATEGORY_CONFIG.reinforced.color}">Reinforced</span>
                <div class="parts-mini-bar">
                    <div class="parts-mini-fill" style="width: ${Math.min((partsStatus.reinforced.available / partsStatus.reinforced.required) * 100, 100)}%; background: ${PART_CATEGORY_CONFIG.reinforced.color}"></div>
                </div>
                <span class="parts-count">${Math.min(partsStatus.reinforced.available, partsStatus.reinforced.required)}/${partsStatus.reinforced.required}</span>
            </div>
            <div class="parts-row ${partsStatus['battle-worn'].complete ? 'complete' : ''}">
                <span class="parts-category" style="color: ${PART_CATEGORY_CONFIG['battle-worn'].color}">Battle-Worn</span>
                <div class="parts-mini-bar">
                    <div class="parts-mini-fill" style="width: ${Math.min((partsStatus['battle-worn'].available / partsStatus['battle-worn'].required) * 100, 100)}%; background: ${PART_CATEGORY_CONFIG['battle-worn'].color}"></div>
                </div>
                <span class="parts-count">${Math.min(partsStatus['battle-worn'].available, partsStatus['battle-worn'].required)}/${partsStatus['battle-worn'].required}</span>
            </div>
        `;
    }
    
    const progress = totalRequired > 0 ? Math.min((totalAvailable / totalRequired) * 100, 100) : 0;
    
    // Verificar requisitos de armas KS usando campos nuevos o antiguos
    if (project.type === 'specialized') {
        const hasBasicWeapon = project.basicWeaponData?.has ?? project.hasBasicKit ?? false;
        if (!hasBasicWeapon) {
            isReady = false;
        }
    }
    if (project.type === 'professional' && (project.specWeaponsCollected || 0) < 2) {
        isReady = false;
    }
    
    const sheenImage = project.sheen.imageRed || project.sheen.image || '';
    const killstreakerImage = project.killstreaker?.image || '';
    const tierConfig = TIER_CONFIG[project.sheen.tier];
    
    const card = document.createElement('div');
    card.className = `project-card ${isReady ? 'ready' : 'pending'}`;
    
    card.innerHTML = `
        <div class="project-header">
            <div class="project-header-left">
                <div class="project-kit-icon">
                    <img src="${kitInfo.image}" alt="${kitInfo.label}">
                </div>
                <div>
                    <div class="project-title">${project.weapon}</div>
                    <div class="project-type">${kitInfo.label}</div>
                </div>
            </div>
            <span class="project-badge ${project.type}">${project.type}</span>
        </div>
        
        <div class="project-details">
            <div class="detail-tag sheen-tag" style="border-left: 3px solid ${project.sheen.color}">
                ${sheenImage ? `<img src="${sheenImage}" alt="${project.sheen.name}" class="detail-img">` : ''}
                <span class="color-dot" style="background: ${project.sheen.color}"></span>
                <span>${project.sheen.name}</span>
                <span class="tier-badge tier-${project.sheen.tier}">${tierConfig.icon}</span>
            </div>
            ${project.killstreaker ? `
                <div class="detail-tag effect-tag" style="border-left: 3px solid ${TIER_CONFIG[project.killstreaker.tier].color}">
                    ${killstreakerImage ? `<img src="${killstreakerImage}" alt="${project.killstreaker.name}" class="detail-img">` : '✨'}
                    <span>${project.killstreaker.name}</span>
                    <span class="tier-badge tier-${project.killstreaker.tier}">${TIER_CONFIG[project.killstreaker.tier].icon}</span>
                </div>
            ` : ''}
        </div>
        
        ${project.type === 'specialized' ? `
            <div class="project-extras">
                ${(() => {
                    // Compatibilidad: usar basicWeaponData (nuevo) o hasBasicKit (antiguo)
                    const hasBasic = project.basicWeaponData?.has ?? project.hasBasicKit ?? false;
                    const basicCost = project.basicWeaponData?.cost ?? project.basicKitValue ?? 0;
                    const basicWeapon = project.basicWeaponData?.weapon || '';
                    return `
                        <div class="extra-item ${hasBasic ? 'complete' : 'missing'}">
                            <span class="extra-icon">${hasBasic ? '✅' : '❌'}</span>
                            <span>Basic Kit ${hasBasic ? `(${basicCost.toFixed(2)} Ref)` : '(Faltante)'}</span>
                        </div>
                    `;
                })()}
            </div>
        ` : ''}
        
        ${project.type === 'professional' ? `
            <div class="project-extras professional-extras">
                ${generateSpecKitsDisplay(project)}
            </div>
        ` : ''}
        
        <div class="project-parts-breakdown ${usesIndividualParts ? 'individual-parts' : ''}">
            ${partsHtml}
        </div>
        
        <div class="project-progress">
            <div class="progress-label">
                <span>Total Piezas</span>
                <span>${totalAvailable}/${totalRequired}</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill ${isReady ? 'complete' : ''}" style="width: ${progress}%"></div>
            </div>
        </div>
        
        ${generateProjectCostDisplay(project, isReady)}
        
        <div class="project-actions">
            <button class="project-btn complete ${isReady ? 'ready-pulse' : ''}" ${!isReady ? 'disabled' : ''} data-id="${project.id}">
                ${isReady ? '✓ Completar' : '⏳ Faltan piezas'}
            </button>
            <button class="project-btn edit" data-id="${project.id}" title="Editar proyecto">✏️</button>
            <button class="project-btn cost" data-id="${project.id}" title="Ver costos">💰</button>
            <button class="project-btn delete" data-id="${project.id}" title="Eliminar">🗑️</button>
        </div>
    `;
    
    // Event listeners
    const completeBtn = card.querySelector('.project-btn.complete');
    const editBtn = card.querySelector('.project-btn.edit');
    const costBtn = card.querySelector('.project-btn.cost');
    const deleteBtn = card.querySelector('.project-btn.delete');
    
    completeBtn.addEventListener('click', () => {
        if (isReady) {
            completeProject(project.id);
        }
    });
    
    editBtn.addEventListener('click', () => {
        openEditProjectModal(project.id);
    });
    
    costBtn.addEventListener('click', () => {
        showProjectCostModal(project.id);
    });
    
    deleteBtn.addEventListener('click', () => {
        showModal(
            'Eliminar Proyecto',
            `¿Estás seguro de eliminar el proyecto "${project.weapon}"?`,
            () => deleteProject(project.id)
        );
    });
    
    return card;
}

function generateSpecKitsDisplay(project) {
    const specKits = project.specKitsData;
    const count = project.specWeaponsCollected || 0;
    
    if (!specKits) {
        return `
            <div class="extra-item ${count >= 2 ? 'complete' : 'missing'}">
                <span class="extra-icon">${count >= 2 ? '✅' : '❌'}</span>
                <span>Specialized Kits: ${count}/2</span>
            </div>
        `;
    }
    
    const kit1 = specKits.kit1 || { has: false, weapon: '', cost: 0 };
    const kit2 = specKits.kit2 || { has: false, weapon: '', cost: 0 };
    const specKitsCost = project.specKitsTotalCost || (kit1.cost + kit2.cost) || 0;
    const kitsReady = kit1.has && kit2.has;
    
    return `
        <div class="spec-kits-display">
            <div class="spec-kits-header">
                <span class="header-icon">${kitsReady ? '✅' : '⚔️'}</span>
                <span class="header-text">Specialized Kits (${count}/2)</span>
            </div>
            <div class="spec-kit-row ${kit1.has ? 'complete' : 'missing'}">
                <span class="kit-icon">${kit1.has ? '✅' : '❌'}</span>
                <span class="kit-info">
                    <span class="kit-label">Kit 1:</span>
                    <span class="kit-weapon">${kit1.weapon || 'Sin especificar'}</span>
                </span>
                ${kit1.cost > 0 ? `<span class="kit-cost">${kit1.cost.toFixed(2)} Ref</span>` : ''}
            </div>
            <div class="spec-kit-row ${kit2.has ? 'complete' : 'missing'}">
                <span class="kit-icon">${kit2.has ? '✅' : '❌'}</span>
                <span class="kit-info">
                    <span class="kit-label">Kit 2:</span>
                    <span class="kit-weapon">${kit2.weapon || 'Sin especificar'}</span>
                </span>
                ${kit2.cost > 0 ? `<span class="kit-cost">${kit2.cost.toFixed(2)} Ref</span>` : ''}
            </div>
            <div class="spec-kits-total-row">
                <span class="total-label">💰 Inversión Spec Kits:</span>
                <span class="total-value ${specKitsCost > 0 ? 'has-value' : ''}">${specKitsCost > 0 ? specKitsCost.toFixed(2) + ' Ref' : 'Sin registrar'}</span>
            </div>
        </div>
    `;
}

function generateProjectCostDisplay(project, isReady) {
    if (isReady) {
        return `
            <div class="project-cost-display ready">
                <span class="cost-icon">✅</span>
                <span class="cost-text">¡Listo para fabricar!</span>
            </div>
        `;
    }
    
    const costs = calculateProjectCostAllStores(project);
    const scrapTfCost = costs['scrap_tf'];
    
    if (!scrapTfCost || scrapTfCost.totalMissing === 0) {
        return '';
    }
    
    const validCosts = Object.values(costs).filter(c => c.totalMissing > 0);
    const cheapest = validCosts.reduce((min, curr) => !min || curr.costInRef < min.costInRef ? curr : min, null);
    
    const keyValue = appState.settings.keyValue || 56;
    
    return `
        <div class="project-cost-display">
            <div class="cost-header">
                <span class="cost-icon">💰</span>
                <span class="cost-title">Costo Piezas Faltantes</span>
            </div>
            <div class="cost-stores">
                <div class="cost-store-row main">
                    <span class="store-name">Scrap.TF:</span>
                    <span class="store-price">${scrapTfCost.costInRef.toFixed(2)} Ref</span>
                    <span class="store-keys">(${(scrapTfCost.costInRef / keyValue).toFixed(3)} Keys)</span>
                </div>
                ${cheapest && cheapest.store.id !== 'scrap_tf' ? `
                    <div class="cost-store-row best">
                        <span class="store-name">💡 ${cheapest.store.name}:</span>
                        <span class="store-price">${cheapest.costInRef.toFixed(2)} Ref</span>
                        <span class="store-keys">(${(cheapest.costInRef / keyValue).toFixed(3)} Keys)</span>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// ============================================
// COMPLETAR Y ELIMINAR PROYECTOS
// ============================================

function completeProject(projectId) {
    const id = String(projectId);
    const project = appState.projects.find(p => String(p.id) === id);
    if (!project) {
        console.error('Proyecto no encontrado:', projectId);
        return;
    }
    
    openSaleRegistrationModal(project);
}

function deleteProject(projectId) {
    const project = appState.projects.find(p => p.id === projectId);
    appState.projects = appState.projects.filter(p => p.id !== projectId);
    
    saveToStorage();
    renderProjectsList();
    updateDashboard();
    closeModal();
    
    showToast(`Proyecto "${project?.weapon}" eliminado`, 'warning');
}

function updateProjectsStatus() {
    renderProjectsList();
}

// ============================================
// EDICIÓN DE PROYECTOS
// ============================================

function openEditProjectModal(projectId) {
    const id = String(projectId);
    const project = appState.projects.find(p => String(p.id) === id);
    if (!project) return;
    
    const sheenImage = project.sheen.imageRed || project.sheen.image || '';
    const kitInfo = CRAFTING_REQUIREMENTS[project.type];
    
    let extrasHtml = '';
    
    if (project.type === 'specialized') {
        const availableBasicKits = getImbuedBasicKits();
        let availableKitsHtml = '';
        
        if (availableBasicKits.length > 0) {
            availableKitsHtml = `
                <div class="edit-available-kits">
                    <div class="edit-kits-header">📦 Basic Kits Imbuidos Disponibles:</div>
                    <div class="edit-kits-list">
                        ${availableBasicKits.map(kit => `
                            <div class="edit-kit-option" onclick="selectEditBasicKit('${kit.id}', ${kit.cost || 0})">
                                <span class="kit-name">${kit.weapon}</span>
                                ${kit.cost > 0 ? `<span class="kit-cost">${kit.cost.toFixed(2)} Ref</span>` : ''}
                                <span class="select-btn">Usar</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="edit-divider">— o indica manualmente —</div>
                </div>
            `;
        }
        
        extrasHtml = `
            <div class="edit-section">
                <h4>🎯 Basic Killstreak Kit (imbuido en arma)</h4>
                ${availableKitsHtml}
                <div class="edit-row">
                    <label>
                        <input type="checkbox" id="editHasBasicKit" ${(project.basicWeaponData?.has ?? project.hasBasicKit) ? 'checked' : ''}>
                        Ya tengo el Basic Kit imbuido
                    </label>
                </div>
                <div class="edit-row">
                    <label>Costo del Basic Kit (Ref):</label>
                    <input type="number" id="editBasicKitValue" value="${project.basicWeaponData?.cost ?? project.basicKitValue ?? 0}" step="0.5" min="0">
                </div>
            </div>
        `;
    } else if (project.type === 'professional') {
        // Compatibilidad: usar specWeaponsData (nuevo) o specKitsData (antiguo)
        const specData = project.specWeaponsData || project.specKitsData || {};
        const specKits = {
            kit1: specData.weapon1 || specData.kit1 || { has: false, weapon: '', cost: 0 },
            kit2: specData.weapon2 || specData.kit2 || { has: false, weapon: '', cost: 0 }
        };
        const availableSpecKits = getImbuedSpecializedKits();
        let availableKitsHtml = '';
        
        if (availableSpecKits.length > 0) {
            availableKitsHtml = `
                <div class="edit-available-kits">
                    <div class="edit-kits-header">📦 Specialized Kits Imbuidos Disponibles:</div>
                    <div class="edit-kits-list">
                        ${availableSpecKits.map(kit => `
                            <div class="edit-kit-option specialized" onclick="selectEditSpecKit('${kit.id}', '${kit.weapon}', ${kit.basicKitCost || 0})" style="border-left: 3px solid ${kit.sheenColor}">
                                <span class="kit-name">${kit.weapon}</span>
                                <span class="kit-sheen" style="color: ${kit.sheenColor}">${kit.sheenName}</span>
                                ${kit.basicKitCost > 0 ? `<span class="kit-cost">${kit.basicKitCost.toFixed(2)} Ref</span>` : ''}
                                <span class="select-btn">Usar</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="edit-divider">— o indica manualmente —</div>
                </div>
            `;
        }
        
        extrasHtml = `
            <div class="edit-section">
                <h4>⚔️ Specialized Killstreak Kits (imbuidos)</h4>
                <p class="edit-hint">Un Professional requiere 2 Specialized KS Kits imbuidos en armas</p>
                ${availableKitsHtml}
                
                <div class="edit-spec-kit">
                    <div class="edit-spec-header">1️⃣ Primer Specialized Kit</div>
                    <div class="edit-row">
                        <label>
                            <input type="checkbox" id="editSpecKit1Has" ${specKits.kit1.has ? 'checked' : ''}>
                            Ya lo tengo
                        </label>
                    </div>
                    <div class="edit-row">
                        <label>Arma:</label>
                        <input type="text" id="editSpecKit1Weapon" value="${specKits.kit1.weapon || ''}" placeholder="Ej: Rocket Launcher">
                    </div>
                    <div class="edit-row">
                        <label>Costo (Ref):</label>
                        <input type="number" id="editSpecKit1Cost" value="${specKits.kit1.cost || 0}" step="0.5" min="0">
                    </div>
                </div>
                
                <div class="edit-spec-kit">
                    <div class="edit-spec-header">2️⃣ Segundo Specialized Kit</div>
                    <div class="edit-row">
                        <label>
                            <input type="checkbox" id="editSpecKit2Has" ${specKits.kit2.has ? 'checked' : ''}>
                            Ya lo tengo
                        </label>
                    </div>
                    <div class="edit-row">
                        <label>Arma:</label>
                        <input type="text" id="editSpecKit2Weapon" value="${specKits.kit2.weapon || ''}" placeholder="Ej: Shotgun">
                    </div>
                    <div class="edit-row">
                        <label>Costo (Ref):</label>
                        <input type="number" id="editSpecKit2Cost" value="${specKits.kit2.cost || 0}" step="0.5" min="0">
                    </div>
                </div>
            </div>
        `;
    }
    
    const content = `
        <div class="edit-project-modal">
            <div class="edit-project-header">
                <div class="project-kit-icon">
                    <img src="${kitInfo.image}" alt="${kitInfo.label}">
                </div>
                <div class="project-info">
                    <span class="project-badge ${project.type}">${project.type}</span>
                    <h3>${project.weapon}</h3>
                    <div class="project-combo">
                        <span style="color: ${project.sheen.color}">${project.sheen.name}</span>
                        ${project.killstreaker ? `<span> + ${project.killstreaker.name}</span>` : ''}
                    </div>
                </div>
            </div>
            
            ${extrasHtml}
            
            <div class="edit-actions">
                <button class="btn-secondary" onclick="closeCustomModal()">
                    <span>❌</span> Cancelar
                </button>
                <button class="btn-primary" onclick="saveProjectEdit('${projectId}')">
                    <span>💾</span> Guardar Cambios
                </button>
            </div>
        </div>
    `;
    
    showCustomModal('✏️ Editar Proyecto', content);
}

function selectEditBasicKit(kitId, cost) {
    const checkbox = document.getElementById('editHasBasicKit');
    const valueInput = document.getElementById('editBasicKitValue');
    
    if (checkbox) checkbox.checked = true;
    if (valueInput) valueInput.value = cost;
    
    document.querySelectorAll('.edit-kit-option').forEach(el => el.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    
    showToast('Basic Kit seleccionado', 'success');
}

function selectEditSpecKit(kitId, weapon, cost) {
    const kit1Has = document.getElementById('editSpecKit1Has')?.checked || false;
    const kit2Has = document.getElementById('editSpecKit2Has')?.checked || false;
    
    let targetSlot = 1;
    if (kit1Has && !kit2Has) {
        targetSlot = 2;
    }
    
    const hasCheckbox = document.getElementById(`editSpecKit${targetSlot}Has`);
    const weaponInput = document.getElementById(`editSpecKit${targetSlot}Weapon`);
    const costInput = document.getElementById(`editSpecKit${targetSlot}Cost`);
    
    if (hasCheckbox) hasCheckbox.checked = true;
    if (weaponInput) weaponInput.value = weapon;
    if (costInput) costInput.value = cost;
    
    showToast(`Specialized Kit asignado al Slot ${targetSlot}`, 'success');
}

function saveProjectEdit(projectId) {
    const id = String(projectId);
    const project = appState.projects.find(p => String(p.id) === id);
    if (!project) {
        console.error('Proyecto no encontrado:', projectId);
        showToast('Error: Proyecto no encontrado', 'error');
        return;
    }
    
    if (project.type === 'specialized') {
        const hasBasic = document.getElementById('editHasBasicKit')?.checked || false;
        const basicCost = parseFloat(document.getElementById('editBasicKitValue')?.value) || 0;
        
        // Actualizar en formato nuevo
        project.basicWeaponData = {
            has: hasBasic,
            weapon: project.basicWeaponData?.weapon || '',
            cost: basicCost,
            kitId: project.basicWeaponData?.kitId || null
        };
        // Mantener compatibilidad con campos antiguos
        project.hasBasicKit = hasBasic;
        project.basicKitValue = basicCost;
        
    } else if (project.type === 'professional') {
        const kit1Has = document.getElementById('editSpecKit1Has')?.checked || false;
        const kit1Weapon = document.getElementById('editSpecKit1Weapon')?.value.trim() || '';
        const kit1Cost = parseFloat(document.getElementById('editSpecKit1Cost')?.value) || 0;
        
        const kit2Has = document.getElementById('editSpecKit2Has')?.checked || false;
        const kit2Weapon = document.getElementById('editSpecKit2Weapon')?.value.trim() || '';
        const kit2Cost = parseFloat(document.getElementById('editSpecKit2Cost')?.value) || 0;
        
        // Actualizar en formato nuevo
        project.specWeaponsData = {
            weapon1: { has: kit1Has, weapon: kit1Weapon, cost: kit1Cost, kitId: project.specWeaponsData?.weapon1?.kitId || null },
            weapon2: { has: kit2Has, weapon: kit2Weapon, cost: kit2Cost, kitId: project.specWeaponsData?.weapon2?.kitId || null }
        };
        // Mantener compatibilidad con campos antiguos
        project.specKitsData = {
            kit1: { has: kit1Has, weapon: kit1Weapon, cost: kit1Cost },
            kit2: { has: kit2Has, weapon: kit2Weapon, cost: kit2Cost }
        };
        
        project.specWeaponsCollected = (kit1Has ? 1 : 0) + (kit2Has ? 1 : 0);
        project.specWeaponsTotalCost = kit1Cost + kit2Cost;
        project.specKitsTotalCost = kit1Cost + kit2Cost;
    }
    
    project.modifiedAt = new Date().toISOString();
    
    saveToStorage();
    renderProjectsList();
    updateDashboard();
    closeCustomModal();
    
    showToast('Proyecto actualizado ✅', 'success');
}

// ============================================
// HELPERS
// ============================================

function getTotalParts() {
    return Object.values(appState.inventory.parts).reduce((sum, count) => sum + count, 0);
}

function getPartsByCategory() {
    const categories = {
        pristine: 0,
        reinforced: 0,
        'battle-worn': 0
    };
    
    ROBOT_PARTS.forEach(part => {
        const count = appState.inventory.parts[part.id] || 0;
        categories[part.category] += count;
    });
    
    return categories;
}

function isProjectReady(project) {
    if (project.partsRequirements && Object.keys(project.partsRequirements).length > 0) {
        for (const [partId, required] of Object.entries(project.partsRequirements)) {
            const available = appState.inventory.parts[partId] || 0;
            if (available < required) return false;
        }
        
        // Verificar arma Basic KS usando campos nuevos o antiguos
        if (project.type === 'specialized') {
            const hasBasicWeapon = project.basicWeaponData?.has ?? project.hasBasicKit ?? false;
            if (!hasBasicWeapon) return false;
        }
        if (project.type === 'professional' && (project.specWeaponsCollected || 0) < 2) {
            return false;
        }
        
        return true;
    }
    
    const availableParts = getPartsByCategory();
    const kitInfo = CRAFTING_REQUIREMENTS[project.type];
    const breakdown = project.partsBreakdown || kitInfo.partsBreakdown;
    
    return availableParts.pristine >= breakdown.pristine &&
           availableParts.reinforced >= breakdown.reinforced &&
           availableParts['battle-worn'] >= breakdown['battle-worn'];
}

// Nota: switchToTab está definido en tabs.js

// ============================================
// SISTEMA DE VALORACIÓN - RENDERIZADO
// ============================================

function renderValuationSystem() {
    initValuationClassTabs();
    renderTopCombos();
    renderBottomCombos();
    renderComboMatrix();
    renderSheensValuation();
}

function renderTopCombos() {
    const container = document.getElementById('topCombosList');
    if (!container) return;
    
    const allCombos = generateAllCombinations();
    const topProfessional = allCombos.filter(c => c.type === 'professional').slice(0, 5);
    
    container.innerHTML = topProfessional.map((combo, index) => {
        const tierConfig = COMBO_TIERS[combo.tier];
        const demandLabel = getDemandLabel(combo.demand);
        const premiumPercent = ((combo.totalMultiplier - 1) * 100).toFixed(0);
        
        return `
            <div class="top-combo-item rank-${index + 1}">
                <div class="combo-rank">#${index + 1}</div>
                <div class="combo-visuals">
                    <img src="${combo.sheen.imageRed || combo.sheen.image}" alt="${combo.sheen.name}" class="combo-sheen-img clickable-preview" title="Click para ver ${combo.sheen.name}" onclick="openImagePreview('sheen', '${combo.sheen.id}')">
                    <span class="combo-plus">+</span>
                    <img src="${combo.killstreaker.image}" alt="${combo.killstreaker.name}" class="combo-ks-img clickable-preview" title="Click para ver ${combo.killstreaker.name}" onclick="openImagePreview('killstreaker', '${combo.killstreaker.id}')">
                </div>
                <div class="combo-info">
                    <div class="combo-names">
                        <span class="sheen-name" style="color: ${combo.sheen.color}">${combo.sheen.name}</span>
                        <span class="separator">+</span>
                        <span class="ks-name">${combo.killstreaker.name}</span>
                    </div>
                    <div class="combo-meta">
                        <span class="combo-tier tier-${combo.tier}" style="background: ${tierConfig.color}">${tierConfig.icon} ${combo.tier}</span>
                        <span class="combo-premium">+${premiumPercent}%</span>
                        <span class="combo-demand">${demandLabel}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderBottomCombos() {
    const container = document.getElementById('bottomCombosList');
    if (!container) return;
    
    const allCombos = generateAllCombinations();
    const bottomProfessional = allCombos
        .filter(c => c.type === 'professional')
        .slice(-5)
        .reverse();
    
    container.innerHTML = bottomProfessional.map((combo, index) => {
        const tierConfig = COMBO_TIERS[combo.tier];
        const premiumPercent = ((combo.totalMultiplier - 1) * 100).toFixed(0);
        const premiumText = combo.totalMultiplier >= 1 ? `+${premiumPercent}%` : `${premiumPercent}%`;
        
        return `
            <div class="bottom-combo-item">
                <div class="combo-visuals small">
                    <img src="${combo.sheen.imageRed || combo.sheen.image}" alt="${combo.sheen.name}" class="combo-sheen-img clickable-preview" title="Click para ver ${combo.sheen.name}" onclick="openImagePreview('sheen', '${combo.sheen.id}')">
                    <span class="combo-plus">+</span>
                    <img src="${combo.killstreaker.image}" alt="${combo.killstreaker.name}" class="combo-ks-img clickable-preview" title="Click para ver ${combo.killstreaker.name}" onclick="openImagePreview('killstreaker', '${combo.killstreaker.id}')">
                </div>
                <div class="combo-info">
                    <div class="combo-names small">
                        <span class="sheen-name" style="color: ${combo.sheen.color}">${combo.sheen.name}</span>
                        <span class="separator">+</span>
                        <span class="ks-name">${combo.killstreaker.name}</span>
                    </div>
                    <div class="combo-meta">
                        <span class="combo-tier tier-${combo.tier}" style="background: ${tierConfig.color}">${tierConfig.icon} ${combo.tier}</span>
                        <span class="combo-premium negative">${premiumText}</span>
                    </div>
                </div>
                <div class="combo-warning">
                    <span class="warning-icon">⚠️</span>
                    <span class="warning-text">Difícil de vender</span>
                </div>
            </div>
        `;
    }).join('');
}

function renderComboMatrix() {
    const thead = document.querySelector('#comboMatrix thead tr');
    const tbody = document.getElementById('comboMatrixBody');
    if (!thead || !tbody) return;
    
    // Headers (Killstreakers)
    let headerHTML = '<th class="corner-cell">Sheen ↓ / Effect →</th>';
    KILLSTREAKERS.forEach(ks => {
        const tierConfig = TIER_CONFIG[ks.tier];
        headerHTML += `
            <th class="ks-header tier-${ks.tier}">
                <img src="${ks.image}" alt="${ks.name}" class="matrix-img clickable-preview" title="Click para ver ${ks.name}" onclick="openImagePreview('killstreaker', '${ks.id}')">
                <span class="header-name">${ks.name.split(' ')[0]}</span>
            </th>
        `;
    });
    thead.innerHTML = headerHTML;
    
    // Body (Sheens x Killstreakers)
    let bodyHTML = '';
    SHEENS.forEach(sheen => {
        const tierConfig = TIER_CONFIG[sheen.tier];
        bodyHTML += `<tr>`;
        bodyHTML += `
            <td class="sheen-header tier-${sheen.tier}">
                <img src="${sheen.imageRed || sheen.image}" alt="${sheen.name}" class="matrix-img clickable-preview" title="Click para ver ${sheen.name}" onclick="openImagePreview('sheen', '${sheen.id}')">
                <span class="header-name" style="color: ${sheen.color}">${sheen.name.split(' ')[0]}</span>
            </td>
        `;
        
        // Mostrar todas las combinaciones de killstreakers, incluyendo armas melee multiclass
        KILLSTREAKERS.forEach(ks => {
            const combo = calculateComboTier(sheen.id, ks.id);
            const comboTierConfig = COMBO_TIERS[combo.tier];
            const premiumPercent = ((combo.totalMultiplier - 1) * 100).toFixed(0);
            
            bodyHTML += `
                <td class="combo-cell tier-${combo.tier}" data-tier="${combo.tier}" title="${sheen.name} + ${ks.name}">
                    <span class="cell-tier">${comboTierConfig.icon}</span>
                    <span class="cell-multiplier">${combo.totalMultiplier >= 1 ? '+' : ''}${premiumPercent}%</span>
                </td>
            `;
        });
        
        // (Celdas 'Multi' eliminadas: solo se muestran combinaciones con datos reales)
        bodyHTML += `</tr>`;
    });
    tbody.innerHTML = bodyHTML;
}

function renderSheensValuation() {
    const container = document.getElementById('sheensValuationGrid');
    if (!container) return;
    
    container.innerHTML = SHEENS.map(sheen => {
        const demandData = SHEEN_DEMAND[sheen.id];
        const combo = calculateComboTier(sheen.id, null);
        const tierConfig = COMBO_TIERS[combo.tier];
        const premiumPercent = ((combo.totalMultiplier - 1) * 100).toFixed(0);
        const premiumText = combo.totalMultiplier >= 1 ? `+${premiumPercent}%` : `${premiumPercent}%`;
        
        return `
            <div class="sheen-valuation-card tier-${combo.tier}">
                <div class="sheen-visual">
                    <img src="${sheen.imageRed || sheen.image}" alt="${sheen.name}" class="sheen-img clickable-preview" title="Click para ver ${sheen.name}" onclick="openImagePreview('sheen', '${sheen.id}')">
                    <span class="sheen-tier-badge" style="background: ${tierConfig.color}">${tierConfig.icon}</span>
                </div>
                <div class="sheen-details">
                    <h4 style="color: ${sheen.color}">${sheen.name}</h4>
                    <div class="sheen-stats">
                        <div class="stat">
                            <span class="stat-label">Premium</span>
                            <span class="stat-value ${combo.totalMultiplier >= 1 ? 'positive' : 'negative'}">${premiumText}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Demanda</span>
                            <span class="stat-value demand-${demandData.demand}">${getDemandLabel(demandData.demand)}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Venta</span>
                            <span class="stat-value speed-${demandData.sellSpeed}">${getSellSpeedLabel(demandData.sellSpeed)}</span>
                        </div>
                    </div>
                    <p class="sheen-note">${demandData.note}</p>
                </div>
            </div>
        `;
    }).join('');
}

function getDemandLabel(demand) {
    const labels = {
        'very-high': '🔥 Muy Alta',
        'high': '📈 Alta',
        'medium': '📊 Media',
        'low': '📉 Baja'
    };
    return labels[demand] || demand;
}

function getSellSpeedLabel(speed) {
    const labels = {
        'fast': '⚡ Rápida',
        'medium': '⏱️ Normal',
        'slow': '🐌 Lenta'
    };
    return labels[speed] || speed;
}

function filterCombos(tier) {
    // Actualizar botones activos
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tier === tier);
    });
    
    // Filtrar celdas de la matriz
    document.querySelectorAll('.combo-cell').forEach(cell => {
        if (tier === 'all') {
            cell.style.opacity = '1';
        } else {
            cell.style.opacity = cell.dataset.tier === tier ? '1' : '0.2';
        }
    });
}

// ============================================
// GUÍA DE POPULARIDAD CON PESTAÑAS
// ============================================

function switchPopularityGuideTab(tabId) {
    // Actualizar botones de pestañas
    document.querySelectorAll('.popularity-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    
    // Actualizar paneles
    document.querySelectorAll('.popularity-tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === `popularityPanel-${tabId}`);
    });
    
    // Renderizar contenido si no se ha renderizado antes
    if (tabId === 'sheens') {
        renderSheensPopularity();
    } else if (tabId === 'killstreakers') {
        renderKillstreakersPopularity();
    } else if (tabId === 'mykits') {
        initMyKitsTab();
    }
}

function renderSheensPopularity() {
    const container = document.getElementById('sheensPopularityGrid');
    if (!container) return;
    
    // Ordenar por demanda (de mayor a menor)
    const sortedSheens = [...SHEENS].sort((a, b) => {
        const demandOrder = { 'very-high': 0, 'high': 1, 'medium': 2, 'low': 3 };
        const demandA = SHEEN_DEMAND[a.id]?.demand || 'low';
        const demandB = SHEEN_DEMAND[b.id]?.demand || 'low';
        return demandOrder[demandA] - demandOrder[demandB];
    });
    
    container.innerHTML = sortedSheens.map((sheen, index) => {
        const demand = SHEEN_DEMAND[sheen.id];
        if (!demand) return '';
        
        const demandPercent = demand.demand === 'very-high' ? 95 :
                             demand.demand === 'high' ? 75 :
                             demand.demand === 'medium' ? 50 : 30;
        
        const tierLabel = demand.demand === 'very-high' ? 'GOD TIER' :
                         demand.demand === 'high' ? 'HIGH TIER' :
                         demand.demand === 'medium' ? 'MID TIER' : 'LOW TIER';
        
        const tierClass = demand.demand === 'very-high' ? 'god' :
                         demand.demand === 'high' ? 'high' :
                         demand.demand === 'medium' ? 'mid' : 'low';
        
        const sellSpeedIcon = demand.sellSpeed === 'fast' ? '⚡' :
                             demand.sellSpeed === 'medium' ? '⏳' : '🐢';
        
        const sellSpeedText = demand.sellSpeed === 'fast' ? 'Venta Rápida' :
                             demand.sellSpeed === 'medium' ? 'Venta Normal' : 'Venta Lenta';
        
        const multiplierPercent = ((demand.multiplier - 1) * 100).toFixed(0);
        const multiplierSign = demand.multiplier >= 1 ? '+' : '';
        
        const imageUrl = sheen.imageRed || sheen.image;
        const imageBlu = sheen.imageBlu || null;
        const isTeamShine = sheen.id === 'team_shine';
        const colorBlu = sheen.colorBlu || null;
        
        // Ranking visual
        const rankIcon = index === 0 ? '👑' : index < 3 ? '🔥' : index < 5 ? '⭐' : '●';
        
        // Clases especiales para Team Shine
        const teamShineClass = isTeamShine ? 'team-shine-card' : '';
        const previewClass = isTeamShine ? 'team-shine-preview' : '';
        
        return `
            <div class="effect-card enhanced ${teamShineClass}" 
                 style="--effect-color: ${sheen.color}; --effect-color-blu: ${colorBlu || sheen.color}" 
                 data-tier="${tierClass}"
                 data-sheen-id="${sheen.id}"
                 data-image-red="${imageUrl}"
                 data-image-blu="${imageBlu || ''}"
                 data-color-red="${sheen.color}"
                 data-color-blu="${colorBlu || ''}"
                 onclick="openEffectPreviewModal('sheen', '${sheen.id}')">
                <div class="effect-rank">${rankIcon} #${index + 1}</div>
                <div class="effect-visual-container">
                    <div class="effect-preview-large ${previewClass}" style="border-color: ${sheen.color}; box-shadow: 0 0 20px ${sheen.color}40">
                        <img src="${imageUrl}" alt="${sheen.name}" title="${sheen.name}" class="effect-img-main">
                        ${isTeamShine && imageBlu ? `<img src="${imageBlu}" alt="${sheen.name} BLU" title="${sheen.name} (BLU)" class="effect-img-alt">` : ''}
                    </div>
                    <div class="effect-color-swatch ${isTeamShine ? 'team-shine-swatch' : ''}" style="background: ${sheen.color}"></div>
                </div>
                <div class="effect-details">
                    <div class="effect-name-row">
                        <span class="effect-name-large" style="color: ${sheen.color}">${sheen.name}</span>
                    </div>
                    <div class="effect-tier-row">
                        <span class="effect-tier-badge-large ${tierClass}">${tierLabel}</span>
                    </div>
                    <div class="effect-demand-visual">
                        <div class="demand-bar-large-container">
                            <div class="demand-bar-large ${demand.demand}" style="width: ${demandPercent}%">
                                <span class="demand-percent">${demandPercent}%</span>
                            </div>
                        </div>
                    </div>
                    <div class="effect-stats-row">
                        <div class="effect-stat-box price">
                            <span class="stat-icon">💰</span>
                            <span class="stat-value">${multiplierSign}${multiplierPercent}%</span>
                            <span class="stat-label">Precio</span>
                        </div>
                        <div class="effect-stat-box speed">
                            <span class="stat-icon">${sellSpeedIcon}</span>
                            <span class="stat-value">${sellSpeedText}</span>
                            <span class="stat-label">Velocidad</span>
                        </div>
                    </div>
                    <div class="effect-note-box">${demand.note}</div>
                </div>
            </div>
        `;
    }).join('');
}

function renderKillstreakersPopularity() {
    const container = document.getElementById('killstreakersPopularityGrid');
    if (!container) return;
    
    // Ordenar por demanda (de mayor a menor)
    const sortedKillstreakers = [...KILLSTREAKERS].sort((a, b) => {
        const demandOrder = { 'very-high': 0, 'high': 1, 'medium': 2, 'low': 3 };
        const demandA = KILLSTREAKER_DEMAND[a.id]?.demand || 'low';
        const demandB = KILLSTREAKER_DEMAND[b.id]?.demand || 'low';
        return demandOrder[demandA] - demandOrder[demandB];
    });
    
    container.innerHTML = sortedKillstreakers.map((ks, index) => {
        const demand = KILLSTREAKER_DEMAND[ks.id];
        if (!demand) return '';
        
        const demandPercent = demand.demand === 'very-high' ? 95 :
                             demand.demand === 'high' ? 75 :
                             demand.demand === 'medium' ? 50 : 30;
        
        const tierLabel = demand.demand === 'very-high' ? 'GOD TIER' :
                         demand.demand === 'high' ? 'HIGH TIER' :
                         demand.demand === 'medium' ? 'MID TIER' : 'LOW TIER';
        
        const tierClass = demand.demand === 'very-high' ? 'god' :
                         demand.demand === 'high' ? 'high' :
                         demand.demand === 'medium' ? 'mid' : 'low';
        
        const sellSpeedIcon = demand.sellSpeed === 'fast' ? '⚡' :
                             demand.sellSpeed === 'medium' ? '⏳' : '🐢';
        
        const sellSpeedText = demand.sellSpeed === 'fast' ? 'Venta Rápida' :
                             demand.sellSpeed === 'medium' ? 'Venta Normal' : 'Venta Lenta';
        
        const multiplierPercent = ((demand.multiplier - 1) * 100).toFixed(0);
        const multiplierSign = demand.multiplier >= 1 ? '+' : '';
        
        // Color basado en tier
        const effectColor = demand.demand === 'very-high' ? '#FFD700' :
                           demand.demand === 'high' ? '#FF69B4' :
                           demand.demand === 'medium' ? '#9370DB' : '#7E7E7E';
        
        // Ranking visual
        const rankIcon = index === 0 ? '👑' : index < 3 ? '🔥' : index < 5 ? '⭐' : '●';
        
        return `
            <div class="effect-card enhanced" 
                 style="--effect-color: ${effectColor}" 
                 data-tier="${tierClass}"
                 data-ks-id="${ks.id}"
                 data-image="${ks.image}"
                 onclick="openEffectPreviewModal('killstreaker', '${ks.id}')">
                <div class="effect-rank">${rankIcon} #${index + 1}</div>
                <div class="effect-visual-container">
                    <div class="effect-preview-large" style="border-color: ${effectColor}; box-shadow: 0 0 20px ${effectColor}40">
                        <img src="${ks.image}" alt="${ks.name}" title="${ks.name}" class="effect-img-main">
                    </div>
                </div>
                <div class="effect-details">
                    <div class="effect-name-row">
                        <span class="effect-name-large" style="color: ${effectColor}">${ks.name}</span>
                    </div>
                    <div class="effect-tier-row">
                        <span class="effect-tier-badge-large ${tierClass}">${tierLabel}</span>
                    </div>
                    <div class="effect-demand-visual">
                        <div class="demand-bar-large-container">
                            <div class="demand-bar-large ${demand.demand}" style="width: ${demandPercent}%">
                                <span class="demand-percent">${demandPercent}%</span>
                            </div>
                        </div>
                    </div>
                    <div class="effect-stats-row">
                        <div class="effect-stat-box price">
                            <span class="stat-icon">💰</span>
                            <span class="stat-value">${multiplierSign}${multiplierPercent}%</span>
                            <span class="stat-label">Precio</span>
                        </div>
                        <div class="effect-stat-box speed">
                            <span class="stat-icon">${sellSpeedIcon}</span>
                            <span class="stat-value">${sellSpeedText}</span>
                            <span class="stat-label">Velocidad</span>
                        </div>
                    </div>
                    <div class="effect-note-box">${demand.note}</div>
                </div>
            </div>
        `;
    }).join('');
}

function initPopularityGuide() {
    // Renderizar la pestaña activa por defecto (Sheens)
    renderSheensPopularity();
    // Actualizar contador de kits
    updateMyKitsCount();
}

// ============================================
// PESTAÑA MIS KITS
// ============================================

// Iconos de clases de TF2
const CLASS_ICONS = {
    scout: 'https://wiki.teamfortress.com/w/images/a/ad/Leaderboard_class_scout.png',
    soldier: 'https://wiki.teamfortress.com/w/images/9/96/Leaderboard_class_soldier.png',
    pyro: 'https://wiki.teamfortress.com/w/images/8/80/Leaderboard_class_pyro.png',
    demoman: 'https://wiki.teamfortress.com/w/images/4/47/Leaderboard_class_demoman.png',
    heavy: 'https://wiki.teamfortress.com/w/images/5/5a/Leaderboard_class_heavy.png',
    engineer: 'https://wiki.teamfortress.com/w/images/1/12/Leaderboard_class_engineer.png',
    medic: 'https://wiki.teamfortress.com/w/images/e/e5/Leaderboard_class_medic.png',
    sniper: 'https://wiki.teamfortress.com/w/images/f/fe/Leaderboard_class_sniper.png',
    spy: 'https://wiki.teamfortress.com/w/images/3/33/Leaderboard_class_spy.png',
    all: 'https://wiki.teamfortress.com/w/images/5/5e/Killicon_skull.png'
};

// Estado de filtros de Mis Kits
let myKitsFilters = {
    kitType: 'all',
    classFilter: 'all',
    imbuedFilter: 'all'
};

function initMyKitsTab() {
    // Inicializar filtros de clase
    initClassFilterButtons();
    // Configurar event listeners de filtros
    setupMyKitsFilterListeners();
    // Renderizar kits
    renderMyKits();
}

function initClassFilterButtons() {
    const container = document.getElementById('classFilterButtons');
    if (!container) return;
    
    const classes = [
        { id: 'all', name: 'Todas', icon: null },
        { id: 'scout', name: 'Scout' },
        { id: 'soldier', name: 'Soldier' },
        { id: 'pyro', name: 'Pyro' },
        { id: 'demoman', name: 'Demoman' },
        { id: 'heavy', name: 'Heavy' },
        { id: 'engineer', name: 'Engineer' },
        { id: 'medic', name: 'Medic' },
        { id: 'sniper', name: 'Sniper' },
        { id: 'spy', name: 'Spy' }
    ];
    
    container.innerHTML = classes.map(cls => {
        const isActive = myKitsFilters.classFilter === cls.id;
        const iconUrl = CLASS_ICONS[cls.id];
        
        return `
            <button class="filter-btn class-btn ${isActive ? 'active' : ''}" 
                    data-class="${cls.id}" 
                    title="${cls.name}">
                ${cls.id === 'all' 
                    ? '<span>Todas</span>' 
                    : `<img src="${iconUrl}" alt="${cls.name}" class="class-filter-icon">`
                }
            </button>
        `;
    }).join('');
}

function setupMyKitsFilterListeners() {
    // Filtros de tipo de kit
    document.querySelectorAll('.kit-type-filter .filter-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.kit-type-filter .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            myKitsFilters.kitType = btn.dataset.filter;
            renderMyKits();
        };
    });
    
    // Filtros de clase
    document.getElementById('classFilterButtons')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.class-btn');
        if (!btn) return;
        
        document.querySelectorAll('.class-filter .class-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        myKitsFilters.classFilter = btn.dataset.class;
        renderMyKits();
    });
    
    // Filtros de imbuido
    document.querySelectorAll('.imbued-filter .filter-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.imbued-filter .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            myKitsFilters.imbuedFilter = btn.dataset.imbued;
            renderMyKits();
        };
    });
}

function updateMyKitsCount() {
    const countBadge = document.getElementById('myKitsCountBadge');
    if (!countBadge) return;
    
    const totalKits = getTotalKitsCount();
    countBadge.textContent = totalKits;
}

function getTotalKitsCount() {
    const basic = appState.inventory.completedKits?.basic?.length || 0;
    const specialized = appState.inventory.completedKits?.specialized?.length || 0;
    const professional = appState.inventory.completedKits?.professional?.length || 0;
    return basic + specialized + professional;
}

function getAllKits() {
    const basic = (appState.inventory.completedKits?.basic || []).map(k => ({ ...k, type: 'basic' }));
    const specialized = (appState.inventory.completedKits?.specialized || []).map(k => ({ ...k, type: 'specialized' }));
    const professional = (appState.inventory.completedKits?.professional || []).map(k => ({ ...k, type: 'professional' }));
    return [...basic, ...specialized, ...professional];
}

function getWeaponClass(weaponName) {
    // Buscar en POPULAR_WEAPONS qué clase tiene esta arma
    const weapon = weaponName.toLowerCase();
    
    // Primero verificar si es multiclass
    if (POPULAR_WEAPONS.multiclass) {
        for (const [slot, weapons] of Object.entries(POPULAR_WEAPONS.multiclass)) {
            if (weapons.some(w => w.toLowerCase() === weapon)) {
                return 'all';
            }
        }
    }
    
    // Buscar en clases específicas
    for (const [className, slots] of Object.entries(POPULAR_WEAPONS)) {
        if (className === 'multiclass') continue;
        for (const [slot, weapons] of Object.entries(slots)) {
            if (weapons.some(w => w.toLowerCase() === weapon)) {
                return className;
            }
        }
    }
    
    // Armas comunes multi-clase que pueden no estar listadas
    const multiClassWeapons = {
        'shotgun': 'soldier', // Clase principal que usa shotgun
        'pistol': 'scout',
        'knife': 'spy',
        'frying pan': 'all',
        'ham shank': 'all',
        'conscientious objector': 'all',
        'freedom staff': 'all',
        'bat outta hell': 'all',
        'crossing guard': 'all',
        'necro smasher': 'all',
        'prinny machete': 'all',
        'golden frying pan': 'all',
        'memory maker': 'all',
        'pain train': 'soldier' // Soldier y Demo
    };
    
    for (const [weaponKey, mainClass] of Object.entries(multiClassWeapons)) {
        if (weapon.includes(weaponKey)) {
            return mainClass;
        }
    }
    
    return 'all'; // No encontrado - mostrar en todas
}

function filterKits(kits) {
    return kits.filter(kit => {
        // Filtro por tipo de kit
        if (myKitsFilters.kitType !== 'all' && kit.type !== myKitsFilters.kitType) {
            return false;
        }
        
        // Filtro por clase
        if (myKitsFilters.classFilter !== 'all') {
            const weaponClass = getWeaponClass(kit.weapon);
            if (weaponClass !== myKitsFilters.classFilter && weaponClass !== 'all') {
                return false;
            }
        }
        
        // Filtro por imbuido
        if (myKitsFilters.imbuedFilter !== 'all') {
            const isImbued = kit.imbued === true;
            if (myKitsFilters.imbuedFilter === 'true' && !isImbued) return false;
            if (myKitsFilters.imbuedFilter === 'false' && isImbued) return false;
        }
        
        return true;
    });
}

function getKitDemandInfo(kit) {
    let sheenDemand = null;
    let ksDemand = null;
    let overallTier = 'low';
    let overallMultiplier = 1.0;
    
    if (kit.type === 'specialized' && kit.sheen) {
        sheenDemand = SHEEN_DEMAND[kit.sheen];
        if (sheenDemand) {
            overallTier = sheenDemand.demand;
            overallMultiplier = sheenDemand.multiplier;
        }
    } else if (kit.type === 'professional') {
        if (kit.sheen) sheenDemand = SHEEN_DEMAND[kit.sheen];
        if (kit.killstreaker) ksDemand = KILLSTREAKER_DEMAND[kit.killstreaker];
        
        // Combinar demandas
        if (sheenDemand && ksDemand) {
            const demandOrder = { 'very-high': 4, 'high': 3, 'medium': 2, 'low': 1 };
            const avgDemand = (demandOrder[sheenDemand.demand] + demandOrder[ksDemand.demand]) / 2;
            
            if (avgDemand >= 3.5) overallTier = 'very-high';
            else if (avgDemand >= 2.5) overallTier = 'high';
            else if (avgDemand >= 1.5) overallTier = 'medium';
            else overallTier = 'low';
            
            overallMultiplier = (sheenDemand.multiplier + ksDemand.multiplier) / 2;
        } else if (ksDemand) {
            overallTier = ksDemand.demand;
            overallMultiplier = ksDemand.multiplier;
        } else if (sheenDemand) {
            overallTier = sheenDemand.demand;
            overallMultiplier = sheenDemand.multiplier;
        }
    }
    
    return { sheenDemand, ksDemand, overallTier, overallMultiplier };
}

function generateStockText(kit) {
    let text = '';
    const weapon = kit.weapon;
    
    if (kit.type === 'basic') {
        text = `[H] Killstreak ${weapon} Kit`;
    } else if (kit.type === 'specialized') {
        text = `[H] Specialized Killstreak ${weapon} Kit (${kit.sheenName || 'Sheen'})`;
    } else if (kit.type === 'professional') {
        text = `[H] Professional Killstreak ${weapon} Kit (${kit.sheenName || 'Sheen'} + ${kit.killstreakerName || 'Killstreaker'})`;
    }
    
    return text;
}

function getSellRecommendations(kit, demandInfo) {
    const recommendations = [];
    const { overallTier, overallMultiplier } = demandInfo;
    
    // backpack.tf - Siempre recomendado para cualquier tier
    recommendations.push({
        market: 'backpack.tf',
        icon: '🎒',
        rating: overallTier === 'very-high' ? 5 : overallTier === 'high' ? 4 : overallTier === 'medium' ? 3 : 2,
        note: overallTier === 'very-high' || overallTier === 'high' 
            ? 'Mejor opción - Alta demanda' 
            : 'Opción estándar - Precio base'
    });
    
    // Steam Market - Solo para GOD/High tier por fees
    if (overallTier === 'very-high' || overallTier === 'high') {
        recommendations.push({
            market: 'Steam Market',
            icon: '🎮',
            rating: 4,
            note: 'Buen precio premium, -13% fees'
        });
    }
    
    // scrap.tf - Venta rápida pero precio bajo
    recommendations.push({
        market: 'scrap.tf',
        icon: '♻️',
        rating: overallTier === 'low' ? 4 : 2,
        note: overallTier === 'low' 
            ? 'Mejor opción para venta rápida' 
            : 'Precio bajo, solo si necesitas rapidez'
    });
    
    // Marketplace.tf / trade.it
    if (overallTier !== 'low') {
        recommendations.push({
            market: 'Marketplace.tf',
            icon: '🏪',
            rating: 3,
            note: 'Alternativa a Steam Market'
        });
    }
    
    // stntrading.eu
    if (kit.type === 'professional' && (overallTier === 'very-high' || overallTier === 'high')) {
        recommendations.push({
            market: 'stntrading.eu',
            icon: '🇪🇺',
            rating: 4,
            note: 'Buen mercado EU para Professional'
        });
    }
    
    return recommendations.sort((a, b) => b.rating - a.rating);
}

function renderMyKits() {
    const container = document.getElementById('myKitsGrid');
    const emptyState = document.getElementById('myKitsEmpty');
    if (!container) return;
    
    const allKits = getAllKits();
    const filteredKits = filterKits(allKits);
    
    // Actualizar contador
    updateMyKitsCount();
    
    if (allKits.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.style.display = 'flex';
        return;
    }
    
    if (emptyState) emptyState.style.display = filteredKits.length === 0 ? 'flex' : 'none';
    
    if (filteredKits.length === 0) {
        container.innerHTML = `
            <div class="no-results-message">
                <span>🔍</span>
                <p>No hay kits que coincidan con los filtros</p>
            </div>
        `;
        return;
    }
    
    // Ordenar por fecha (más recientes primero)
    filteredKits.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    container.innerHTML = filteredKits.map(kit => {
        const demandInfo = getKitDemandInfo(kit);
        const stockText = generateStockText(kit);
        const recommendations = getSellRecommendations(kit, demandInfo);
        const weaponClass = getWeaponClass(kit.weapon);
        
        const typeLabel = kit.type === 'basic' ? 'Basic' : 
                         kit.type === 'specialized' ? 'Specialized' : 'Professional';
        
        const typeIcon = kit.type === 'basic' 
            ? 'https://wiki.teamfortress.com/w/images/e/e4/Item_icon_Killstreak_Kit.png'
            : kit.type === 'specialized'
            ? 'https://wiki.teamfortress.com/w/images/2/2e/Item_icon_Specialized_Killstreak_Kit.png'
            : 'https://wiki.teamfortress.com/w/images/f/f3/Item_icon_Professional_Killstreak_Kit.png';
        
        const tierLabel = demandInfo.overallTier === 'very-high' ? 'GOD TIER' :
                         demandInfo.overallTier === 'high' ? 'HIGH TIER' :
                         demandInfo.overallTier === 'medium' ? 'MID TIER' : 'LOW TIER';
        
        const tierClass = demandInfo.overallTier === 'very-high' ? 'god' :
                         demandInfo.overallTier === 'high' ? 'high' :
                         demandInfo.overallTier === 'medium' ? 'mid' : 'low';
        
        const classIcon = weaponClass !== 'all' ? CLASS_ICONS[weaponClass] : null;
        
        // Efectos visuales
        let effectsHtml = '';
        if (kit.type === 'specialized' || kit.type === 'professional') {
            effectsHtml = `
                <div class="kit-effects">
                    ${kit.sheenName ? `
                        <div class="kit-effect sheen" style="--sheen-color: ${kit.sheenColor || '#fff'}">
                            <span class="effect-dot" style="background: ${kit.sheenColor}"></span>
                            <span class="effect-label">${kit.sheenName}</span>
                        </div>
                    ` : ''}
                    ${kit.killstreakerName ? `
                        <div class="kit-effect killstreaker">
                            <span class="effect-icon">💀</span>
                            <span class="effect-label">${kit.killstreakerName}</span>
                        </div>
                    ` : ''}
                </div>
            `;
        }
        
        // Recomendaciones de venta
        const topRecommendations = recommendations.slice(0, 3);
        const recommendationsHtml = topRecommendations.map(rec => `
            <div class="sell-recommendation" data-rating="${rec.rating}">
                <span class="rec-icon">${rec.icon}</span>
                <div class="rec-info">
                    <span class="rec-market">${rec.market}</span>
                    <span class="rec-note">${rec.note}</span>
                </div>
                <div class="rec-stars">${'★'.repeat(rec.rating)}${'☆'.repeat(5 - rec.rating)}</div>
            </div>
        `).join('');
        
        return `
            <div class="mykit-card ${kit.type} ${kit.imbued ? 'imbued' : 'not-imbued'}" data-tier="${tierClass}" data-kit-id="${kit.id}">
                <div class="mykit-header">
                    <div class="mykit-type-badge ${kit.type}">
                        <img src="${typeIcon}" alt="${typeLabel}" class="mykit-type-icon">
                        <span>${typeLabel}</span>
                    </div>
                    ${kit.type !== 'basic' ? `
                        <div class="mykit-tier-badge ${tierClass}">${tierLabel}</div>
                    ` : ''}
                    ${classIcon ? `
                        <div class="mykit-class-badge" title="${weaponClass}">
                            <img src="${classIcon}" alt="${weaponClass}">
                        </div>
                    ` : ''}
                </div>
                
                <div class="mykit-weapon">
                    <span class="weapon-name">${kit.weapon}</span>
                    <span class="imbued-badge ${kit.imbued ? 'is-imbued' : ''}">
                        ${kit.imbued ? '⚔️ Imbuido' : '📦 Sin aplicar'}
                    </span>
                </div>
                
                ${effectsHtml}
                
                <div class="mykit-stock">
                    <div class="stock-text-container">
                        <input type="text" class="stock-text-input" value="${stockText}" readonly>
                        <button class="copy-stock-btn" onclick="copyStockText(this)" title="Copiar texto de stock">
                            📋
                        </button>
                    </div>
                </div>
                
                <!-- Pestañas de precios por tienda -->
                ${generateKitPriceTabsHtml(kit.id)}
                
                <div class="mykit-recommendations">
                    <h4>📊 Dónde vender:</h4>
                    ${recommendationsHtml}
                </div>
                
                <div class="mykit-footer">
                    <span class="kit-date">📅 ${formatKitDate(kit.createdAt)}</span>
                    ${kit.cost ? `<span class="kit-cost">💰 ${kit.cost.toFixed(2)} Ref</span>` : ''}
                </div>
                
                <div class="mykit-actions">
                    <button class="mykit-action-btn toggle-imbued" 
                            onclick="toggleKitImbuedFromMyKits('${kit.type}', '${kit.id}')"
                            title="${kit.imbued ? 'Marcar como sin aplicar' : 'Marcar como imbuido'}">
                        ${kit.imbued ? '📦' : '⚔️'}
                    </button>
                    <button class="mykit-action-btn delete" 
                            onclick="deleteKitFromMyKits('${kit.type}', '${kit.id}')"
                            title="Eliminar kit">
                        🗑️
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function copyStockText(button) {
    const input = button.previousElementSibling;
    input.select();
    document.execCommand('copy');
    
    // Feedback visual
    const originalText = button.textContent;
    button.textContent = '✅';
    button.classList.add('copied');
    
    setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('copied');
    }, 1500);
    
    showToast('Texto de stock copiado al portapapeles', 'success');
}

function toggleKitImbuedFromMyKits(type, kitId) {
    // Llamar a la función existente de kits.js
    if (typeof toggleKitImbued === 'function') {
        toggleKitImbued(type, kitId);
        // Re-renderizar
        setTimeout(() => renderMyKits(), 100);
    }
}

function deleteKitFromMyKits(type, kitId) {
    // Llamar a la función existente de kits.js
    if (typeof deleteCompletedKit === 'function') {
        deleteCompletedKit(type, kitId);
        // Re-renderizar
        setTimeout(() => {
            renderMyKits();
            updateMyKitsCount();
        }, 100);
    }
}

// formatKitDate se usa de kits.js (window.formatKitDate)

// ============================================
// SISTEMA DE PRECIOS POR TIENDA
// ============================================

const COMMUNITY_STORES = [
    { id: 'backpack_tf', name: 'backpack.tf', logo: 'logo_img/backpack.png', color: '#3f8bbf', fee: 0, currency: 'keys_refs' },
    { id: 'scrap_tf', name: 'scrap.tf', logo: 'logo_img/scrap.png', color: '#4CAF50', fee: 0, currency: 'keys_refs', hasOverstock: true, requiresUnimbued: true },
    { id: 'stntrading', name: 'stntrading.eu', logo: 'logo_img/stntrading.png', color: '#FF5722', fee: 0, currency: 'keys_refs' },
    { id: 'tradeit', name: 'trade.it', logo: 'logo_img/tradeit.png', color: '#9C27B0', fee: 0.05, currency: 'usd', hasOverstock: true },
    { id: 'steam_market', name: 'Steam Market', logo: 'logo_img/steam.png', color: '#1b2838', fee: 0.13, currency: 'local' }
];

// Divisa local del usuario (por defecto MXN)
let userLocalCurrency = localStorage.getItem('userLocalCurrency') || 'MXN';

// Cargar precios guardados de un kit
function getKitStorePrices(kitId) {
    const savedPrices = appState.kitStorePrices || {};
    return savedPrices[kitId] || {};
}

// Guardar precio de una tienda para un kit (con soporte multi-divisa)
function saveKitStorePrice(kitId, storeId, field, value) {
    if (!appState.kitStorePrices) {
        appState.kitStorePrices = {};
    }
    if (!appState.kitStorePrices[kitId]) {
        appState.kitStorePrices[kitId] = {};
    }
    if (!appState.kitStorePrices[kitId][storeId]) {
        appState.kitStorePrices[kitId][storeId] = {};
    }
    
    appState.kitStorePrices[kitId][storeId][field] = value;
    saveToStorage();
    
    // Actualizar la comparativa
    updateKitPriceComparison(kitId);
}

// Actualizar precio desde input (con soporte multi-divisa)
function updateKitPrice(kitId, storeId, field, inputElement) {
    const value = parseFloat(inputElement.value) || 0;
    saveKitStorePrice(kitId, storeId, field, value);
}

// Toggle Overstock para trade.it
function toggleOverstock(kitId, storeId, checkbox) {
    const isOverstock = checkbox.checked;
    saveKitStorePrice(kitId, storeId, 'overstock', isOverstock);
    
    // Encontrar el card y actualizar el estado visual
    const card = document.querySelector(`.mykit-card[data-kit-id="${kitId}"]`);
    if (!card) return;
    
    const panel = card.querySelector(`.price-tab-panel[data-panel="${storeId}"]`);
    if (!panel) return;
    
    // Buscar todos los inputs de precio en el panel (usd, keys, refs)
    const inputs = panel.querySelectorAll('.price-input');
    const text = panel.querySelector('.overstock-text');
    
    inputs.forEach(input => {
        input.disabled = isOverstock;
        input.classList.toggle('disabled-input', isOverstock);
    });
    
    if (text) {
        text.classList.toggle('is-overstock', isOverstock);
        text.textContent = isOverstock ? '🚫 OVERSTOCK - No acepta este item' : '📦 Stock disponible';
    }
}

// Cambiar pestaña de precios
function switchKitPriceTab(kitId, tabId) {
    const card = document.querySelector(`.mykit-card[data-kit-id="${kitId}"]`);
    if (!card) return;
    
    // Actualizar botones
    card.querySelectorAll('.price-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    
    // Actualizar paneles
    card.querySelectorAll('.price-tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.dataset.panel === tabId);
    });
}

// Calcular mejor opción considerando fees y demanda
function calculateBestSellOptions(kitId, demandInfo) {
    const prices = getKitStorePrices(kitId);
    const kit = findKitById(kitId);
    const isImbued = kit && kit.imbued;
    const options = [];
    
    COMMUNITY_STORES.forEach(store => {
        const storeData = prices[store.id] || {};
        
        // Verificar si está en overstock
        if (storeData.overstock) return;
        
        // Verificar si scrap.tf y el kit está imbuido (no aceptan kits imbuidos)
        if (store.requiresUnimbued && isImbued) return;
        
        // Calcular precio según el tipo de divisa
        let rawPrice = 0;
        let displayPrice = '';
        let currencyType = store.currency;
        
        if (store.currency === 'keys_refs') {
            const keys = parseFloat(storeData.keys) || 0;
            const refs = parseFloat(storeData.refs) || 0;
            // Convertir todo a refs para comparar (1 key ≈ 60 refs aprox, pero es referencial)
            rawPrice = (keys * 60) + refs;
            if (keys > 0 || refs > 0) {
                displayPrice = keys > 0 ? `${keys} Keys + ${refs.toFixed(2)} Refs` : `${refs.toFixed(2)} Refs`;
            }
        } else if (store.currency === 'usd') {
            rawPrice = parseFloat(storeData.usd) || 0;
            displayPrice = `$${rawPrice.toFixed(2)} USD`;
        } else if (store.currency === 'local') {
            rawPrice = parseFloat(storeData.local) || 0;
            displayPrice = `$${rawPrice.toFixed(2)} ${userLocalCurrency}`;
        }
        
        if (rawPrice <= 0) return;
        
        // Calcular precio neto después de fees
        const netPrice = rawPrice * (1 - store.fee);
        
        // Multiplicador por demanda (los tiers altos venden más rápido en ciertas tiendas)
        let demandMultiplier = 1;
        if (store.id === 'steam_market' && (demandInfo.overallTier === 'very-high' || demandInfo.overallTier === 'high')) {
            demandMultiplier = 1.1; // Steam Market es mejor para items de alta demanda
        }
        if (store.id === 'scrap_tf' && demandInfo.overallTier === 'low') {
            demandMultiplier = 1.2; // scrap.tf es mejor para venta rápida de items de baja demanda
        }
        
        const score = netPrice * demandMultiplier;
        
        options.push({
            store,
            rawPrice,
            netPrice,
            displayPrice,
            currencyType,
            fee: store.fee,
            feeAmount: rawPrice * store.fee,
            score,
            demandBonus: demandMultiplier > 1
        });
    });
    
    // Ordenar por score (mayor = mejor)
    return options.sort((a, b) => b.score - a.score);
}

// Actualizar panel de comparativa
function updateKitPriceComparison(kitId) {
    const card = document.querySelector(`.mykit-card[data-kit-id="${kitId}"]`);
    if (!card) return;
    
    const comparisonPanel = card.querySelector('.price-comparison-results');
    if (!comparisonPanel) return;
    
    // Obtener demandInfo del kit
    const kit = findKitById(kitId);
    if (!kit) return;
    
    const demandInfo = getKitDemandInfo(kit);
    const bestOptions = calculateBestSellOptions(kitId, demandInfo);
    
    if (bestOptions.length === 0) {
        comparisonPanel.innerHTML = `
            <div class="no-prices-message">
                <span>💡</span>
                <p>Ingresa precios en las tiendas para ver la comparativa</p>
            </div>
        `;
        return;
    }
    
    // Mostrar Top 3
    const top3 = bestOptions.slice(0, 3);
    comparisonPanel.innerHTML = `
        <div class="comparison-header">
            <h5>🏆 Mejores Opciones de Venta</h5>
        </div>
        <div class="comparison-list">
            ${top3.map((opt, index) => `
                <div class="comparison-item ${index === 0 ? 'best' : ''}" style="--store-color: ${opt.store.color}">
                    <div class="comparison-rank">${index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</div>
                    <div class="comparison-store">
                        <img src="${opt.store.logo}" alt="${opt.store.name}" class="store-logo-small">
                        <span class="store-name">${opt.store.name}</span>
                        ${opt.demandBonus ? '<span class="demand-bonus" title="Bonus por demanda">⬆️</span>' : ''}
                    </div>
                    <div class="comparison-prices">
                        <div class="price-row">
                            <span class="price-label">Precio:</span>
                            <span class="price-value">${opt.displayPrice}</span>
                        </div>
                        ${opt.fee > 0 ? `
                            <div class="price-row fee">
                                <span class="price-label">Fee (${(opt.fee * 100).toFixed(0)}%):</span>
                                <span class="price-value">-${opt.feeAmount.toFixed(2)}</span>
                            </div>
                            <div class="price-row net">
                                <span class="price-label">Neto:</span>
                                <span class="price-value">${opt.currencyType === 'keys_refs' ? opt.netPrice.toFixed(2) + ' (equiv. Refs)' : opt.currencyType === 'usd' ? '$' + opt.netPrice.toFixed(2) + ' USD' : '$' + opt.netPrice.toFixed(2) + ' ' + userLocalCurrency}</span>
                            </div>
                        ` : `
                            <div class="price-row net no-fee">
                                <span class="price-label">Sin comisión</span>
                                <span class="price-value">✓</span>
                            </div>
                        `}
                    </div>
                </div>
            `).join('')}
        </div>
        ${bestOptions.length > 3 ? `
            <div class="comparison-others">
                <small>+${bestOptions.length - 3} más opciones con precios</small>
            </div>
        ` : ''}
    `;
}

// Buscar kit por ID
function findKitById(kitId) {
    const allKits = getAllKits();
    return allKits.find(k => k.id === kitId);
}

// Generar HTML del input según el tipo de divisa de la tienda
function generatePriceInputHtml(store, kitId, savedPrices, kit) {
    const storeData = savedPrices[store.id] || {};
    const isImbued = kit && kit.imbued;
    
    // Verificar si scrap.tf requiere kit sin imbuir
    if (store.requiresUnimbued && isImbued) {
        return `
            <div class="store-blocked-message">
                <div class="blocked-icon">🚫</div>
                <div class="blocked-text">
                    <strong>No disponible para kits imbuidos</strong>
                    <p>scrap.tf solo acepta Killstreak Kits sin aplicar al arma.</p>
                    <small>Marca el kit como "Sin aplicar" si aún no lo has imbuido.</small>
                </div>
            </div>
        `;
    }
    
    if (store.currency === 'keys_refs') {
        // Keys + Refs para backpack.tf, scrap.tf, stntrading.eu
        const hasOverstockOption = store.hasOverstock;
        const isOverstock = storeData.overstock;
        const isDisabled = isOverstock;
        
        return `
            <div class="price-input-row">
                <label>Precio mínimo ofrecido:</label>
            </div>
            <div class="price-inputs-dual">
                <div class="price-input-field">
                    <input type="number" 
                           class="price-input keys-input ${isDisabled ? 'disabled-input' : ''}" 
                           placeholder="0"
                           step="1"
                           min="0"
                           value="${storeData.keys || ''}"
                           ${isDisabled ? 'disabled' : ''}
                           onchange="updateKitPrice('${kitId}', '${store.id}', 'keys', this)"
                           onkeyup="updateKitPrice('${kitId}', '${store.id}', 'keys', this)">
                    <span class="price-suffix">Keys</span>
                </div>
                <span class="price-separator">+</span>
                <div class="price-input-field">
                    <input type="number" 
                           class="price-input refs-input ${isDisabled ? 'disabled-input' : ''}" 
                           placeholder="0.00"
                           step="0.11"
                           min="0"
                           value="${storeData.refs || ''}"
                           ${isDisabled ? 'disabled' : ''}
                           onchange="updateKitPrice('${kitId}', '${store.id}', 'refs', this)"
                           onkeyup="updateKitPrice('${kitId}', '${store.id}', 'refs', this)">
                    <span class="price-suffix">Refs</span>
                </div>
            </div>
            ${hasOverstockOption ? `
                <div class="overstock-toggle">
                    <label class="overstock-label">
                        <input type="checkbox" 
                               class="overstock-checkbox"
                               ${isOverstock ? 'checked' : ''}
                               onchange="toggleOverstock('${kitId}', '${store.id}', this)">
                        <span class="overstock-text ${isOverstock ? 'is-overstock' : ''}">
                            ${isOverstock ? '🚫 OVERSTOCK - No acepta este item' : '📦 Stock disponible'}
                        </span>
                    </label>
                </div>
            ` : ''}
            <div class="fee-info no-fee">✓ Sin comisión</div>
        `;
    } else if (store.currency === 'usd') {
        // USD para trade.it con botón de Overstock
        return `
            <div class="price-input-row">
                <label>Precio mínimo ofrecido:</label>
                <div class="price-input-field usd-field">
                    <input type="number" 
                           class="price-input usd-input ${storeData.overstock ? 'disabled-input' : ''}" 
                           placeholder="0.00"
                           step="0.01"
                           min="0"
                           value="${storeData.usd || ''}"
                           ${storeData.overstock ? 'disabled' : ''}
                           onchange="updateKitPrice('${kitId}', '${store.id}', 'usd', this)"
                           onkeyup="updateKitPrice('${kitId}', '${store.id}', 'usd', this)">
                    <span class="price-suffix">USD</span>
                </div>
            </div>
            <div class="overstock-toggle">
                <label class="overstock-label">
                    <input type="checkbox" 
                           class="overstock-checkbox"
                           ${storeData.overstock ? 'checked' : ''}
                           onchange="toggleOverstock('${kitId}', '${store.id}', this)">
                    <span class="overstock-text ${storeData.overstock ? 'is-overstock' : ''}">
                        ${storeData.overstock ? '🚫 OVERSTOCK - No acepta este item' : '📦 Stock disponible'}
                    </span>
                </label>
            </div>
            <div class="fee-info has-fee">⚠️ Esta tienda cobra 5% de comisión</div>
        `;
    } else if (store.currency === 'local') {
        // Divisa local para Steam Market
        return `
            <div class="price-input-row">
                <label>Precio mínimo ofrecido:</label>
                <div class="price-input-field local-field">
                    <input type="number" 
                           class="price-input local-input" 
                           placeholder="0.00"
                           step="0.01"
                           min="0"
                           value="${storeData.local || ''}"
                           onchange="updateKitPrice('${kitId}', '${store.id}', 'local', this)"
                           onkeyup="updateKitPrice('${kitId}', '${store.id}', 'local', this)">
                    <span class="price-suffix">${userLocalCurrency}</span>
                </div>
            </div>
            <div class="fee-info has-fee">⚠️ Esta tienda cobra 13% de comisión</div>
        `;
    }
    
    return '';
}

// Generar HTML de pestañas de precios para un kit
function generateKitPriceTabsHtml(kitId) {
    const savedPrices = getKitStorePrices(kitId);
    const kit = findKitById(kitId); // Obtener el kit para verificar si está imbuido
    
    // Botones de las 5 tiendas (fila superior) - solo logos
    const tabButtons = COMMUNITY_STORES.map((store, index) => `
        <button class="price-tab-btn ${index === 0 ? 'active' : ''}" 
                data-tab="${store.id}"
                data-store="${store.id}"
                onclick="switchKitPriceTab('${kitId}', '${store.id}')"
                title="${store.name}"
                style="--tab-color: ${store.color}">
            <img src="${store.logo}" alt="${store.name}" class="store-logo" onerror="this.style.display='none'">
        </button>
    `).join('');
    
    // Paneles de contenido para cada tienda
    const tabPanels = COMMUNITY_STORES.map((store, index) => `
        <div class="price-tab-panel ${index === 0 ? 'active' : ''}" data-panel="${store.id}">
            <div class="price-panel-content">
                ${generatePriceInputHtml(store, kitId, savedPrices, kit)}
            </div>
        </div>
    `).join('');
    
    // Panel de comparativa
    const comparisonContent = `
        <div class="price-tab-panel" data-panel="comparison">
            <div class="price-comparison-results">
                <div class="no-prices-message">
                    <span>💡</span>
                    <p>Ingresa precios en las tiendas para ver la comparativa</p>
                </div>
            </div>
        </div>
    `;
    
    return `
        <div class="kit-price-tabs" data-kit-id="${kitId}">
            <div class="price-tabs-nav">
                <div class="stores-row">
                    ${tabButtons}
                </div>
                <button class="price-tab-btn comparison-btn" 
                        onclick="openPriceComparisonModal('${kitId}')">
                    <span class="comparison-icon">📊</span>
                    <span class="tab-name">Comparar Precios</span>
                </button>
            </div>
            <div class="price-tabs-content">
                ${tabPanels}
            </div>
        </div>
    `;
}

// ============================================
// MODAL DE COMPARACIÓN DE PRECIOS
// ============================================

function openPriceComparisonModal(kitId) {
    const kit = findKitById(kitId);
    if (!kit) {
        showToast('No se encontró el kit', 'error');
        return;
    }
    
    const demandInfo = getKitDemandInfo(kit);
    const bestOptions = calculateBestSellOptions(kitId, demandInfo);
    const weaponClass = getWeaponClass(kit.weapon);
    const weaponSlot = getWeaponSlot(kit.weapon);
    
    // Info del tipo de kit
    const typeLabel = kit.type === 'basic' ? 'Basic Killstreak' : 
                     kit.type === 'specialized' ? 'Specialized Killstreak' : 'Professional Killstreak';
    
    const typeIcon = kit.type === 'basic' 
        ? 'https://wiki.teamfortress.com/w/images/e/e4/Item_icon_Killstreak_Kit.png'
        : kit.type === 'specialized'
        ? 'https://wiki.teamfortress.com/w/images/2/2e/Item_icon_Specialized_Killstreak_Kit.png'
        : 'https://wiki.teamfortress.com/w/images/f/f3/Item_icon_Professional_Killstreak_Kit.png';
    
    const classIcon = weaponClass !== 'all' ? CLASS_ICONS[weaponClass] : null;
    const classLabel = weaponClass !== 'all' ? weaponClass.charAt(0).toUpperCase() + weaponClass.slice(1) : 'Multi-Clase';
    
    // Tier info
    const tierLabel = demandInfo.overallTier === 'very-high' ? 'GOD TIER' :
                     demandInfo.overallTier === 'high' ? 'HIGH TIER' :
                     demandInfo.overallTier === 'medium' ? 'MID TIER' : 'LOW TIER';
    
    const tierClass = demandInfo.overallTier === 'very-high' ? 'god' :
                     demandInfo.overallTier === 'high' ? 'high' :
                     demandInfo.overallTier === 'medium' ? 'mid' : 'low';
    
    // Generar HTML de las opciones
    let optionsHtml = '';
    if (bestOptions.length === 0) {
        optionsHtml = `
            <div class="comparison-modal-empty">
                <span class="empty-icon">💡</span>
                <p>No hay precios ingresados</p>
                <small>Ingresa precios en las pestañas de tiendas para ver la comparativa</small>
            </div>
        `;
    } else {
        const top3 = bestOptions.slice(0, 3);
        optionsHtml = `
            <div class="comparison-modal-options">
                ${top3.map((opt, index) => `
                    <div class="comparison-modal-option rank-${index + 1}" style="--store-color: ${opt.store.color}">
                        <div class="option-rank">
                            ${index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </div>
                        <div class="option-store">
                            <img src="${opt.store.logo}" alt="${opt.store.name}" class="option-store-logo">
                            <span class="option-store-name">${opt.store.name}</span>
                            ${opt.demandBonus ? '<span class="demand-bonus-tag">⬆️ Bonus demanda</span>' : ''}
                        </div>
                        <div class="option-prices">
                            <div class="option-price-main">
                                <span class="price-label">Precio:</span>
                                <span class="price-value">${opt.displayPrice}</span>
                            </div>
                            ${opt.fee > 0 ? `
                                <div class="option-price-fee">
                                    <span class="price-label">Comisión (${(opt.fee * 100).toFixed(0)}%):</span>
                                    <span class="price-value negative">-${opt.feeAmount.toFixed(2)}</span>
                                </div>
                                <div class="option-price-net">
                                    <span class="price-label">Neto:</span>
                                    <span class="price-value highlight">${formatNetPrice(opt)}</span>
                                </div>
                            ` : `
                                <div class="option-price-net no-fee">
                                    <span class="price-label">Sin comisión</span>
                                    <span class="price-value check">✓</span>
                                </div>
                            `}
                        </div>
                        <div class="option-conversions">
                            <small class="conversion-title">Conversiones aproximadas:</small>
                            ${generateConversionsHtml(opt)}
                        </div>
                    </div>
                `).join('')}
            </div>
            ${bestOptions.length > 3 ? `
                <div class="comparison-modal-more">
                    <small>+${bestOptions.length - 3} más opciones con precios ingresados</small>
                </div>
            ` : ''}
        `;
    }
    
    // Efectos del kit
    let effectsHtml = '';
    if (kit.type !== 'basic') {
        effectsHtml = `
            <div class="comparison-modal-effects">
                ${kit.sheenName ? `
                    <div class="effect-tag sheen" style="--effect-color: ${kit.sheenColor || '#fff'}">
                        <span class="effect-dot" style="background: ${kit.sheenColor}"></span>
                        ${kit.sheenName}
                    </div>
                ` : ''}
                ${kit.killstreakerName ? `
                    <div class="effect-tag killstreaker">
                        ✨ ${kit.killstreakerName}
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    const modalHtml = `
        <div class="price-comparison-modal-overlay" onclick="closePriceComparisonModal(event)">
            <div class="price-comparison-modal" onclick="event.stopPropagation()">
                <button class="modal-close-btn" onclick="closePriceComparisonModal()">✕</button>
                
                <div class="comparison-modal-header">
                    <div class="modal-kit-info">
                        <img src="${typeIcon}" alt="${typeLabel}" class="modal-kit-icon">
                        <div class="modal-kit-details">
                            <h2 class="modal-weapon-name">${kit.weapon}</h2>
                            <div class="modal-kit-meta">
                                <span class="modal-kit-type">${typeLabel}</span>
                                <span class="modal-tier-badge ${tierClass}">${tierLabel}</span>
                            </div>
                        </div>
                    </div>
                    <div class="modal-class-info">
                        ${classIcon ? `<img src="${classIcon}" alt="${classLabel}" class="modal-class-icon">` : ''}
                        <div class="modal-class-details">
                            <span class="class-name">${classLabel}</span>
                            <span class="weapon-slot">${weaponSlot}</span>
                        </div>
                    </div>
                </div>
                
                ${effectsHtml}

                <div class="comparison-modal-tabs">
                    <button class="comparison-tab-btn active" data-tab="fast" onclick="switchComparisonTab(event, 'fast')">Venta rápida</button>
                    <button class="comparison-tab-btn" data-tab="suggested" onclick="switchComparisonTab(event, 'suggested')">Venta sugerida</button>
                    <button class="comparison-tab-btn" data-tab="collector" onclick="switchComparisonTab(event, 'collector')">Venta coleccionista</button>
                </div>

                <div class="comparison-modal-body">
                    <h3 class="modal-section-title">🏆 Mejores Opciones de Venta</h3>
                    ${optionsHtml}
                </div>
                
                <div class="comparison-modal-footer">
                    <small class="modal-disclaimer">
                        💡 Las conversiones son aproximadas basadas en tasas de mercado actuales
                    </small>
                </div>
            </div>
        </div>
    `;
    
    // Insertar modal en el DOM
    const existingModal = document.querySelector('.price-comparison-modal-overlay');
    if (existingModal) existingModal.remove();
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.body.style.overflow = 'hidden';
    
    // Animación de entrada
    setTimeout(() => {
        document.querySelector('.price-comparison-modal-overlay').classList.add('active');
    }, 10);
}

function closePriceComparisonModal(event) {
    if (event && event.target !== event.currentTarget) return;
    
    const modal = document.querySelector('.price-comparison-modal-overlay');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

// Obtener slot del arma (Primary/Secondary/Melee)
function getWeaponSlot(weaponName) {
    // Buscar en POPULAR_WEAPONS
    for (const className in POPULAR_WEAPONS) {
        const classWeapons = POPULAR_WEAPONS[className];
        if (classWeapons.primary && classWeapons.primary.includes(weaponName)) return 'Principal';
        if (classWeapons.secondary && classWeapons.secondary.includes(weaponName)) return 'Secundaria';
        if (classWeapons.melee && classWeapons.melee.includes(weaponName)) return 'Cuerpo a cuerpo';
        if (classWeapons.pda && classWeapons.pda.includes(weaponName)) return 'PDA';
        if (classWeapons.pda2 && classWeapons.pda2.includes(weaponName)) return 'PDA 2';
        if (classWeapons.building && classWeapons.building.includes(weaponName)) return 'Construcción';
    }
    return 'Arma';
}

// Formatear precio neto según el tipo de divisa
function formatNetPrice(opt) {
    if (opt.currencyType === 'keys_refs') {
        return opt.netPrice.toFixed(2) + ' Refs (equiv.)';
    } else if (opt.currencyType === 'usd') {
        return '$' + opt.netPrice.toFixed(2) + ' USD';
    } else {
        return '$' + opt.netPrice.toFixed(2) + ' ' + userLocalCurrency;
    }
}

// Generar HTML de conversiones de divisa
function generateConversionsHtml(opt) {
    // Tasas de conversión aproximadas (estas se podrían actualizar desde una API)
    const KEY_TO_REF = 62; // 1 Key ≈ 62 Refs
    const REF_TO_USD = 0.03; // 1 Ref ≈ $0.03 USD
    const USD_TO_MXN = 17.5; // 1 USD ≈ 17.5 MXN (tasa aproximada)
    
    let conversions = [];
    
    if (opt.currencyType === 'keys_refs') {
        // Convertir de Refs a USD y MXN
        const usdValue = opt.netPrice * REF_TO_USD;
        const mxnValue = usdValue * USD_TO_MXN;
        conversions = [
            { label: 'USD', value: `$${usdValue.toFixed(2)}` },
            { label: userLocalCurrency, value: `$${mxnValue.toFixed(2)}` }
        ];
    } else if (opt.currencyType === 'usd') {
        // Convertir de USD a Refs y MXN
        const refValue = opt.netPrice / REF_TO_USD;
        const mxnValue = opt.netPrice * USD_TO_MXN;
        conversions = [
            { label: 'Refs', value: `~${refValue.toFixed(0)}` },
            { label: userLocalCurrency, value: `$${mxnValue.toFixed(2)}` }
        ];
    } else if (opt.currencyType === 'local') {
        // Convertir de MXN a USD y Refs
        const usdValue = opt.netPrice / USD_TO_MXN;
        const refValue = usdValue / REF_TO_USD;
        conversions = [
            { label: 'USD', value: `$${usdValue.toFixed(2)}` },
            { label: 'Refs', value: `~${refValue.toFixed(0)}` }
        ];
    }
    
    return conversions.map(c => `
        <span class="conversion-item">
            <span class="conv-value">${c.value}</span>
            <span class="conv-label">${c.label}</span>
        </span>
    `).join('');
}

let effectPreviewInterval = null;

function openEffectPreviewModal(type, id) {
    // Limpiar intervalo anterior si existe
    if (effectPreviewInterval) {
        clearInterval(effectPreviewInterval);
        effectPreviewInterval = null;
    }
    
    let effectData = null;
    let demand = null;
    let imageUrl = '';
    let imageBlu = '';
    let colorMain = '';
    let colorBlu = '';
    let isTeamShine = false;
    
    if (type === 'sheen') {
        effectData = SHEENS.find(s => s.id === id);
        demand = SHEEN_DEMAND[id];
        if (effectData) {
            imageUrl = effectData.imageRed || effectData.image;
            imageBlu = effectData.imageBlu || '';
            colorMain = effectData.color;
            colorBlu = effectData.colorBlu || '';
            isTeamShine = id === 'team_shine';
        }
    } else if (type === 'killstreaker') {
        effectData = KILLSTREAKERS.find(k => k.id === id);
        demand = KILLSTREAKER_DEMAND[id];
        if (effectData) {
            imageUrl = effectData.image;
            colorMain = demand?.demand === 'very-high' ? '#FFD700' :
                       demand?.demand === 'high' ? '#FF69B4' :
                       demand?.demand === 'medium' ? '#9370DB' : '#7E7E7E';
        }
    }
    
    if (!effectData) return;
    
    const tierLabel = demand?.demand === 'very-high' ? 'GOD TIER' :
                     demand?.demand === 'high' ? 'HIGH TIER' :
                     demand?.demand === 'medium' ? 'MID TIER' : 'LOW TIER';
    
    const tierClass = demand?.demand === 'very-high' ? 'god' :
                     demand?.demand === 'high' ? 'high' :
                     demand?.demand === 'medium' ? 'mid' : 'low';
    
    // Crear el modal
    const existingModal = document.getElementById('effectPreviewModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'effectPreviewModal';
    modal.className = 'effect-preview-modal';
    modal.innerHTML = `
        <div class="effect-preview-modal-backdrop" onclick="closeEffectPreviewModal()"></div>
        <div class="effect-preview-modal-content ${isTeamShine ? 'team-shine-modal' : ''}" 
             style="--modal-color: ${colorMain}; --modal-color-blu: ${colorBlu || colorMain}">
            <button class="effect-preview-modal-close" onclick="closeEffectPreviewModal()">✕</button>
            <div class="effect-preview-modal-image-container ${isTeamShine ? 'team-shine-container' : ''}">
                <img src="${imageUrl}" alt="${effectData.name}" class="effect-preview-modal-img main-img" id="effectPreviewMainImg">
                ${isTeamShine && imageBlu ? `<img src="${imageBlu}" alt="${effectData.name} BLU" class="effect-preview-modal-img alt-img" id="effectPreviewAltImg">` : ''}
            </div>
            <div class="effect-preview-modal-info">
                <h3 class="effect-preview-modal-name" style="color: ${colorMain}" id="effectPreviewName">${effectData.name}</h3>
                <span class="effect-preview-modal-tier ${tierClass}">${tierLabel}</span>
                ${isTeamShine ? '<p class="team-shine-note">🔄 Alterna automáticamente entre colores RED y BLU</p>' : ''}
            </div>
            <p class="effect-preview-modal-hint">Click en cualquier lugar para cerrar</p>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Forzar reflow para animación
    modal.offsetHeight;
    modal.classList.add('active');
    
    // Si es Team Shine, iniciar alternancia automática
    if (isTeamShine && imageBlu) {
        let showingRed = true;
        const mainImg = document.getElementById('effectPreviewMainImg');
        const altImg = document.getElementById('effectPreviewAltImg');
        const nameEl = document.getElementById('effectPreviewName');
        const container = modal.querySelector('.effect-preview-modal-content');
        
        effectPreviewInterval = setInterval(() => {
            showingRed = !showingRed;
            if (mainImg && altImg) {
                mainImg.style.opacity = showingRed ? '1' : '0';
                altImg.style.opacity = showingRed ? '0' : '1';
            }
            if (nameEl) {
                nameEl.style.color = showingRed ? colorMain : colorBlu;
            }
            if (container) {
                container.style.setProperty('--current-color', showingRed ? colorMain : colorBlu);
                container.classList.toggle('showing-blu', !showingRed);
            }
        }, 2000);
    }
}

function closeEffectPreviewModal() {
    // Limpiar intervalo
    if (effectPreviewInterval) {
        clearInterval(effectPreviewInterval);
        effectPreviewInterval = null;
    }
    
    const modal = document.getElementById('effectPreviewModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Cerrar modal con ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeEffectPreviewModal();
    }
});

// ============================================
// EXPORTACIONES GLOBALES
// ============================================

window.initForge = initForge;
window.renderProjectsList = renderProjectsList;
window.completeProject = completeProject;
window.deleteProject = deleteProject;
window.openEditProjectModal = openEditProjectModal;
window.saveProjectEdit = saveProjectEdit;
window.selectEditBasicKit = selectEditBasicKit;
window.selectEditSpecKit = selectEditSpecKit;
window.updateSpecWeaponsCount = updateSpecWeaponsCount;
window.selectBasicKitForProject = selectBasicKitForProject;
window.selectBasicWeaponForProject = selectBasicWeaponForProject;
window.selectSpecWeaponForProject = selectSpecWeaponForProject;
window.selectSpecializedKitForProject = selectSpecializedKitForProject;
window.updateSpecWeaponStatus = updateSpecWeaponStatus;
window.updateForgeFormFields = updateForgeFormFields;
window.generatePartsRequirementsInputs = generatePartsRequirementsInputs;
window.togglePartsCategory = togglePartsCategory;
window.updateCategorySubtotal = updateCategorySubtotal;
window.renderValuationSystem = renderValuationSystem;
window.renderTopCombos = renderTopCombos;
window.renderBottomCombos = renderBottomCombos;
window.renderComboMatrix = renderComboMatrix;
window.renderSheensValuation = renderSheensValuation;
window.getDemandLabel = getDemandLabel;
window.getSellSpeedLabel = getSellSpeedLabel;
window.filterCombos = filterCombos;
window.switchPopularityGuideTab = switchPopularityGuideTab;
window.renderSheensPopularity = renderSheensPopularity;
window.renderKillstreakersPopularity = renderKillstreakersPopularity;
window.initPopularityGuide = initPopularityGuide;
window.openEffectPreviewModal = openEffectPreviewModal;
window.closeEffectPreviewModal = closeEffectPreviewModal;
window.copyStockText = copyStockText;
window.toggleKitImbuedFromMyKits = toggleKitImbuedFromMyKits;
window.deleteKitFromMyKits = deleteKitFromMyKits;
window.renderMyKits = renderMyKits;
window.updateMyKitsCount = updateMyKitsCount;
window.switchKitPriceTab = switchKitPriceTab;
window.updateKitPrice = updateKitPrice;
window.toggleOverstock = toggleOverstock;
window.openPriceComparisonModal = openPriceComparisonModal;
window.closePriceComparisonModal = closePriceComparisonModal;
