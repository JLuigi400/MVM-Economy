/**
 * TF2 MANN CO. FORGE - SISTEMA DE VALORACIÓN
 * Cálculo de tiers y valoración de combinaciones
 */

// ============================================
// CALCULAR TIER DE COMBINACIÓN
// ============================================

/**
 * Calcula el tier de una combinación sheen + killstreaker
 * @param {string} sheenId - ID del sheen
 * @param {string|null} killstreakerId - ID del killstreaker (null para Specialized)
 * @returns {Object} Información del tier calculado
 */
function calculateComboTier(sheenId, killstreakerId = null) {
    const sheenData = SHEEN_DEMAND[sheenId];
    const killstreakerData = killstreakerId ? KILLSTREAKER_DEMAND[killstreakerId] : null;
    
    if (!sheenData) return null;
    
    // Para Specialized (solo sheen)
    if (!killstreakerData) {
        const score = sheenData.multiplier;
        return {
            score,
            tier: getComboTierFromScore(score),
            sheenMultiplier: sheenData.multiplier,
            totalMultiplier: sheenData.multiplier,
            demand: sheenData.demand,
            sellSpeed: sheenData.sellSpeed
        };
    }
    
    // Para Professional (sheen + killstreaker)
    const combinedScore = sheenData.multiplier * killstreakerData.multiplier;
    
    return {
        score: combinedScore,
        tier: getComboTierFromScore(combinedScore),
        sheenMultiplier: sheenData.multiplier,
        killstreakerMultiplier: killstreakerData.multiplier,
        totalMultiplier: combinedScore,
        demand: combineDemand(sheenData.demand, killstreakerData.demand),
        sellSpeed: combineSellSpeed(sheenData.sellSpeed, killstreakerData.sellSpeed)
    };
}

/**
 * Obtiene el tier basado en el score
 */
function getComboTierFromScore(score) {
    if (score >= COMBO_TIERS.S.minScore) return 'S';
    if (score >= COMBO_TIERS.A.minScore) return 'A';
    if (score >= COMBO_TIERS.B.minScore) return 'B';
    if (score >= COMBO_TIERS.C.minScore) return 'C';
    return 'D';
}

/**
 * Combina dos niveles de demanda
 */
function combineDemand(d1, d2) {
    const order = ['very-high', 'high', 'medium', 'low'];
    const idx1 = order.indexOf(d1);
    const idx2 = order.indexOf(d2);
    return order[Math.round((idx1 + idx2) / 2)];
}

/**
 * Combina dos velocidades de venta
 */
function combineSellSpeed(s1, s2) {
    const order = ['fast', 'medium', 'slow'];
    const idx1 = order.indexOf(s1);
    const idx2 = order.indexOf(s2);
    return order[Math.round((idx1 + idx2) / 2)];
}

// ============================================
// GENERAR COMBINACIONES
// ============================================

/**
 * Genera todas las combinaciones posibles ordenadas por valor
 */
function generateAllCombinations() {
    const combinations = [];
    
    // Professional Combinations (Sheen + Killstreaker)
    SHEENS.forEach(sheen => {
        KILLSTREAKERS.forEach(ks => {
            const combo = calculateComboTier(sheen.id, ks.id);
            combinations.push({
                type: 'professional',
                sheen,
                killstreaker: ks,
                ...combo
            });
        });
    });
    
    // Specialized Combinations (Solo Sheen)
    SHEENS.forEach(sheen => {
        const combo = calculateComboTier(sheen.id, null);
        combinations.push({
            type: 'specialized',
            sheen,
            killstreaker: null,
            ...combo
        });
    });
    
    // Ordenar por score descendente
    return combinations.sort((a, b) => b.score - a.score);
}

// ============================================
// OBTENER INFORMACIÓN DE TIER
// ============================================

/**
 * Obtiene la configuración visual de un tier
 */
function getTierConfig(tier) {
    return COMBO_TIERS[tier] || COMBO_TIERS.D;
}

/**
 * Genera el HTML badge de un tier
 */
function generateTierBadge(tier, size = 'normal') {
    const config = getTierConfig(tier);
    const sizeClass = size === 'small' ? 'tier-badge-sm' : '';
    return `<span class="tier-badge ${sizeClass}" style="background: ${config.color}">${config.icon} ${config.label}</span>`;
}

/**
 * Genera el HTML de indicador de demanda
 */
function generateDemandIndicator(demand) {
    const demandLabels = {
        'very-high': { text: 'Muy Alta', class: 'demand-very-high', icon: '🔥🔥' },
        'high': { text: 'Alta', class: 'demand-high', icon: '🔥' },
        'medium': { text: 'Media', class: 'demand-medium', icon: '⭐' },
        'low': { text: 'Baja', class: 'demand-low', icon: '●' }
    };
    
    const info = demandLabels[demand] || demandLabels.medium;
    return `<span class="demand-indicator ${info.class}">${info.icon} ${info.text}</span>`;
}

/**
 * Genera el HTML de indicador de velocidad de venta
 */
function generateSellSpeedIndicator(speed) {
    const speedLabels = {
        'fast': { text: 'Rápida', class: 'speed-fast', icon: '⚡' },
        'medium': { text: 'Normal', class: 'speed-medium', icon: '⏱️' },
        'slow': { text: 'Lenta', class: 'speed-slow', icon: '🐢' }
    };
    
    const info = speedLabels[speed] || speedLabels.medium;
    return `<span class="speed-indicator ${info.class}">${info.icon} ${info.text}</span>`;
}

// ============================================
// VALORACIÓN DE PROYECTO
// ============================================

/**
 * Calcula el valor estimado de un proyecto
 */
function calculateProjectValue(project) {
    const basePrice = CRAFTING_REQUIREMENTS[project.type]?.estimatedCost || 10;
    const combo = calculateComboTier(project.sheen, project.killstreaker);
    
    if (!combo) return basePrice;
    
    return basePrice * combo.totalMultiplier;
}

/**
 * Genera recomendación para un proyecto
 */
function generateProjectRecommendation(project) {
    const combo = calculateComboTier(project.sheen, project.killstreaker);
    if (!combo) return { text: 'Sin datos', class: 'rec-neutral' };
    
    if (combo.tier === 'S' || combo.tier === 'A') {
        return { text: '✅ Excelente inversión', class: 'rec-positive' };
    } else if (combo.tier === 'B') {
        return { text: '👍 Buena opción', class: 'rec-good' };
    } else if (combo.tier === 'C') {
        return { text: '⚠️ Precio estándar', class: 'rec-neutral' };
    } else {
        return { text: '⛔ Difícil venta', class: 'rec-negative' };
    }
}

// ============================================
// EXPORTACIONES GLOBALES
// ============================================

window.calculateComboTier = calculateComboTier;
window.getComboTierFromScore = getComboTierFromScore;
window.combineDemand = combineDemand;
window.combineSellSpeed = combineSellSpeed;
window.generateAllCombinations = generateAllCombinations;
window.getTierConfig = getTierConfig;
window.generateTierBadge = generateTierBadge;
window.generateDemandIndicator = generateDemandIndicator;
window.generateSellSpeedIndicator = generateSellSpeedIndicator;
window.calculateProjectValue = calculateProjectValue;
window.generateProjectRecommendation = generateProjectRecommendation;

// ============================================
// PESTAÑAS DE CLASES PARA VALORACIÓN
// ============================================

let currentValuationClass = 'all';
let currentMatrixTab = 'matrix';
let currentCombinedKitType = '';

/**
 * Inicializa las pestañas de clases para valoración
 */
function initValuationClassTabs() {
    const container = document.getElementById('valuationClassTabs');
    if (!container) return;
    
    // Agrupar clases por rol
    const roleGroups = {
        offensive: TF2_CLASSES.filter(c => c.role === 'offensive'),
        defensive: TF2_CLASSES.filter(c => c.role === 'defensive'),
        support: TF2_CLASSES.filter(c => c.role === 'support')
    };
    
    // Generar botones de clase con imágenes y colores por rol
    let classButtons = '';
    
    Object.entries(roleGroups).forEach(([role, classes]) => {
        const roleData = CLASS_ROLES[role];
        classes.forEach(cls => {
            classButtons += `
                <button class="class-tab role-${role}" data-class="${cls.id}" data-role="${role}" 
                        onclick="switchValuationClass('${cls.id}')" 
                        style="--role-color: ${roleData.color}">
                    <img class="tab-icon-img" src="${CLASS_ICON_URLS[cls.id]}" alt="${cls.name}" onerror="this.textContent='${cls.icon}'">
                    <span class="tab-name">${cls.name}</span>
                </button>
            `;
        });
    });
    
    // Mantener el botón "Todas" y agregar las clases
    container.innerHTML = `
        <button class="class-tab active" data-class="all" onclick="switchValuationClass('all')">
            <img class="tab-icon-img logo-icon" src="${CLASS_ICON_URLS.all}" alt="Todas" onerror="this.textContent='🎮'">
            <span class="tab-name">Todas</span>
        </button>
        ${classButtons}
    `;
}

/**
 * Cambia la clase seleccionada en valoración
 */
function switchValuationClass(classId) {
    currentValuationClass = classId;
    
    // Actualizar tabs activos
    document.querySelectorAll('#valuationClassTabs .class-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.class === classId);
    });
    
    // Actualizar contenido
    renderTopCombos();
    renderBottomCombos();
    
    // Si estamos en la pestaña de armas, actualizar también
    if (currentMatrixTab === 'weapons') {
        renderWeaponsDemandGrid();
    }
}

/**
 * Cambia la pestaña de matriz
 */
function switchMatrixTab(tabId) {
    currentMatrixTab = tabId;
    
    // Actualizar tabs
    document.querySelectorAll('.matrix-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabId);
    });
    
    // Mostrar panel correspondiente
    document.querySelectorAll('.matrix-tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === `matrixPanel-${tabId}`);
    });
    
    // Renderizar contenido según la pestaña
    if (tabId === 'weapons') {
        renderWeaponsDemandGrid();
    } else if (tabId === 'combined') {
        initCombinedSelectors();
    } else if (tabId === 'favorites') {
        initFavoritesPanel();
    }
}

/**
 * Renderiza el grid de demanda de armas
 */
function renderWeaponsDemandGrid() {
    const container = document.getElementById('weaponsDemandGrid');
    if (!container) return;
    
    const classesToShow = currentValuationClass === 'all' 
        ? TF2_CLASSES 
        : TF2_CLASSES.filter(c => c.id === currentValuationClass);
    
    container.innerHTML = classesToShow.map(cls => {
        const weaponData = WEAPON_DEMAND[cls.id];
        if (!weaponData) return '';
        
        const roleData = CLASS_ROLES[cls.role] || CLASS_ROLES.offensive;
        const slots = ['primary', 'secondary', 'melee'];
        const slotIcons = { primary: '1️⃣', secondary: '2️⃣', melee: '3️⃣' };
        
        const weaponsList = slots.map(slot => {
            if (!weaponData[slot]) return '';
            return Object.entries(weaponData[slot])
                .sort((a, b) => {
                    const tierOrder = { S: 0, A: 1, B: 2, C: 3, D: 4 };
                    return tierOrder[a[1].tier] - tierOrder[b[1].tier];
                })
                .slice(0, 3) // Top 3 por slot
                .map(([name, data]) => `
                    <div class="weapon-item">
                        <span class="slot-icon">${slotIcons[slot]}</span>
                        <span class="weapon-name">${name}</span>
                        <span class="tier-badge tier-${data.tier}">${data.tier}</span>
                    </div>
                `).join('');
        }).join('');
        
        return `
            <div class="weapon-demand-card" data-role="${cls.role}">
                <div class="weapon-demand-header" style="border-left: 4px solid ${roleData.color}">
                    <img class="class-icon-img" src="${CLASS_ICON_URLS[cls.id]}" alt="${cls.name}">
                    <span class="class-name">${cls.name}</span>
                    <span class="role-badge" style="background: ${roleData.color}">${roleData.label}</span>
                </div>
                <div class="weapon-demand-list">
                    ${weaponsList || '<p class="empty-text">Sin datos</p>'}
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Actualiza la visibilidad de campos según tipo de kit
 */
function updateCombinedKitType() {
    const kitType = document.getElementById('combinedKitType')?.value;
    currentCombinedKitType = kitType;
    
    const sheenGroup = document.getElementById('combinedSheenGroup');
    const ksGroup = document.getElementById('combinedKillstreakerGroup');
    const kitTypeInfo = document.getElementById('kitTypeInfo');
    
    // Ocultar todos los badges primero
    document.querySelectorAll('.kit-type-badge').forEach(b => b.style.display = 'none');
    
    // Mostrar/ocultar campos según tipo
    if (kitType === 'basic') {
        if (sheenGroup) sheenGroup.style.display = 'none';
        if (ksGroup) ksGroup.style.display = 'none';
        document.querySelector('.kit-type-badge.basic').style.display = 'flex';
    } else if (kitType === 'specialized') {
        if (sheenGroup) sheenGroup.style.display = 'block';
        if (ksGroup) ksGroup.style.display = 'none';
        document.querySelector('.kit-type-badge.specialized').style.display = 'flex';
    } else if (kitType === 'professional') {
        if (sheenGroup) sheenGroup.style.display = 'block';
        if (ksGroup) ksGroup.style.display = 'block';
        document.querySelector('.kit-type-badge.professional').style.display = 'flex';
    } else {
        if (sheenGroup) sheenGroup.style.display = 'none';
        if (ksGroup) ksGroup.style.display = 'none';
    }
    
    // Actualizar análisis
    updateCombinedAnalysis();
}

/**
 * Inicializa los selectores del análisis combinado
 */
function initCombinedSelectors() {
    const classSelect = document.getElementById('combinedClass');
    const sheenSelect = document.getElementById('combinedSheen');
    const ksSelect = document.getElementById('combinedKillstreaker');
    
    if (classSelect && classSelect.options.length <= 1) {
        TF2_CLASSES.forEach(cls => {
            const roleData = CLASS_ROLES[cls.role];
            const option = document.createElement('option');
            option.value = cls.id;
            option.textContent = `${cls.name}`;
            option.dataset.role = cls.role;
            classSelect.appendChild(option);
        });
    }
    
    if (sheenSelect && sheenSelect.options.length <= 1) {
        SHEENS.forEach(sheen => {
            const option = document.createElement('option');
            option.value = sheen.id;
            option.textContent = sheen.name;
            option.style.color = sheen.color;
            sheenSelect.appendChild(option);
        });
    }
    
    if (ksSelect && ksSelect.options.length <= 1) {
        KILLSTREAKERS.forEach(ks => {
            const option = document.createElement('option');
            option.value = ks.id;
            option.textContent = ks.name;
            ksSelect.appendChild(option);
        });
    }
}

/**
 * Actualiza las armas disponibles según clase y slot
 */
function updateCombinedWeapons() {
    const classId = document.getElementById('combinedClass')?.value;
    const slot = document.getElementById('combinedSlot')?.value;
    const weaponSelect = document.getElementById('combinedWeapon');
    
    if (!weaponSelect) return;
    
    weaponSelect.innerHTML = '<option value="">Seleccionar arma...</option>';
    
    if (!classId) return;
    
    const weaponData = WEAPON_DEMAND[classId];
    if (!weaponData) return;
    
    const slotsToShow = slot ? [slot] : ['primary', 'secondary', 'melee'];
    const slotNames = { primary: 'Primaria', secondary: 'Secundaria', melee: 'Melee' };
    
    slotsToShow.forEach(s => {
        if (weaponData[s]) {
            Object.entries(weaponData[s]).forEach(([name, data]) => {
                const option = document.createElement('option');
                option.value = `${s}|${name}`;
                option.textContent = slot ? name : `[${slotNames[s]}] ${name}`;
                option.dataset.tier = data.tier;
                weaponSelect.appendChild(option);
            });
        }
    });
}

/**
 * Actualiza el análisis combinado con ROI y divisas
 */
function updateCombinedAnalysis() {
    const kitType = document.getElementById('combinedKitType')?.value;
    const classId = document.getElementById('combinedClass')?.value;
    const weaponValue = document.getElementById('combinedWeapon')?.value;
    const sheenId = document.getElementById('combinedSheen')?.value;
    const killstreakerId = document.getElementById('combinedKillstreaker')?.value;
    
    const container = document.getElementById('combinedAnalysisResult');
    if (!container) return;
    
    // Verificar datos mínimos según tipo de kit
    const needsSheen = kitType === 'specialized' || kitType === 'professional';
    const needsKillstreaker = kitType === 'professional';
    
    // Verificar si faltan datos
    if (!kitType || !classId || !weaponValue) {
        container.innerHTML = `
            <div class="analysis-placeholder">
                <span class="placeholder-icon">💰</span>
                <p>Selecciona tipo de kit, clase y arma para calcular la rentabilidad</p>
                <p class="placeholder-hint">Incluye ROI, costos de materiales y estrategias en 3 divisas</p>
            </div>
        `;
        return;
    }
    
    if (needsSheen && !sheenId) {
        container.innerHTML = `
            <div class="analysis-placeholder">
                <span class="placeholder-icon">✨</span>
                <p>Selecciona un Sheen para ${kitType === 'specialized' ? 'Specialized' : 'Professional'} Kit</p>
            </div>
        `;
        return;
    }
    
    if (needsKillstreaker && !killstreakerId) {
        container.innerHTML = `
            <div class="analysis-placeholder">
                <span class="placeholder-icon">👁️</span>
                <p>Selecciona un Killstreaker para Professional Kit</p>
            </div>
        `;
        return;
    }
    
    // Parsear datos
    const [slot, weaponName] = weaponValue.split('|');
    const weaponData = WEAPON_DEMAND[classId]?.[slot]?.[weaponName];
    const classInfo = TF2_CLASSES.find(c => c.id === classId);
    const roleData = CLASS_ROLES[classInfo?.role] || CLASS_ROLES.offensive;
    
    if (!weaponData) {
        container.innerHTML = '<p class="error-text">Error: No hay datos para esta arma</p>';
        return;
    }
    
    // Obtener precios de conversión actuales
    const keyPriceRef = window.appState?.keyPrice || 65;
    const keyPriceUSD = 2.20; // Precio promedio en Trade.it
    const keyPriceMXN = 47.00; // Precio promedio Steam Market MXN
    
    // Calcular según tipo de kit
    let finalMultiplier = weaponData.priceMultiplier || 1.0;
    let comboInfo = null;
    let sheen = null;
    let killstreaker = null;
    let basePrice = 0;
    let kitTypeLabel = '';
    let kitTypeIcon = '';
    let craftingCost = 0; // Costo de fabricación en keys
    let isFreeKit = false;
    
    switch(kitType) {
        case 'basic':
            basePrice = 2;
            kitTypeLabel = 'Basic Killstreak Kit';
            kitTypeIcon = '📦';
            craftingCost = 0; // GRATIS - se obtiene en Two Cities
            isFreeKit = true;
            break;
        case 'specialized':
            sheen = SHEENS.find(s => s.id === sheenId);
            comboInfo = calculateComboTier(sheenId, null);
            finalMultiplier *= comboInfo?.totalMultiplier || 1.0;
            basePrice = 8;
            kitTypeLabel = 'Specialized Killstreak Kit';
            kitTypeIcon = '⭐';
            // Costo: Fabricador (~1.5 keys) + 29 partes (~0.5 keys) + Basic Kit (~1.5 keys)
            craftingCost = 3.5;
            break;
        case 'professional':
            sheen = SHEENS.find(s => s.id === sheenId);
            killstreaker = KILLSTREAKERS.find(k => k.id === killstreakerId);
            comboInfo = calculateComboTier(sheenId, killstreakerId);
            finalMultiplier *= comboInfo?.totalMultiplier || 1.0;
            basePrice = 25;
            kitTypeLabel = 'Professional Killstreak Kit';
            kitTypeIcon = '💎';
            // Costo: Fabricador (~8 keys) + 25 partes (~2 keys) + 2 Spec Weapons (~5 keys)
            craftingCost = 15;
            break;
    }
    
    const finalTier = getFinalTier(finalMultiplier);
    const tierConfig = COMBO_TIERS[finalTier];
    
    // Calcular precios de venta finales
    const sellPriceKeys = basePrice * finalMultiplier;
    const sellPriceUSD = sellPriceKeys * keyPriceUSD;
    const sellPriceMXN = sellPriceKeys * keyPriceMXN;
    const sellPriceRef = sellPriceKeys * keyPriceRef;
    
    // Calcular ROI (solo para Specialized y Professional)
    let roiPercent = 0;
    let profitKeys = 0;
    let breakEvenKeys = craftingCost;
    
    if (!isFreeKit && craftingCost > 0) {
        profitKeys = sellPriceKeys - craftingCost;
        roiPercent = ((sellPriceKeys - craftingCost) / craftingCost * 100).toFixed(0);
    } else if (isFreeKit) {
        profitKeys = sellPriceKeys;
        roiPercent = '∞'; // Infinito porque costo = 0
    }
    
    // Calcular estrategias de venta con las 3 divisas
    const strategies = Object.entries(SELLING_STRATEGIES).map(([key, strat]) => {
        const priceKeys = sellPriceKeys * strat.priceModifier;
        const days = weaponData.sellDays[key] || 7;
        return { 
            ...strat, 
            key, 
            priceKeys: priceKeys.toFixed(1),
            priceUSD: (priceKeys * keyPriceUSD).toFixed(2),
            priceMXN: (priceKeys * keyPriceMXN).toFixed(0),
            priceRef: (priceKeys * keyPriceRef).toFixed(0),
            days,
            profit: (priceKeys - craftingCost).toFixed(1)
        };
    });
    
    // Generar HTML de combinación visual
    let comboVisualHtml = '';
    if (kitType === 'basic') {
        comboVisualHtml = `<div class="combo-visual basic"><span class="combo-label">Solo contador de kills</span></div>`;
    } else if (kitType === 'specialized' && sheen) {
        // Team Shine tiene 2 colores (RED y BLU)
        const isTeamShine = sheen.colorBlu;
        const sheenDotHtml = isTeamShine
            ? `<div class="sheen-color-dot team-shine">
                   <div class="dot-red" style="background: ${sheen.color}"></div>
                   <div class="dot-blu" style="background: ${sheen.colorBlu}"></div>
               </div>`
            : `<div class="sheen-color-dot" style="background: ${sheen.color}"></div>`;
        
        const bgGradient = isTeamShine
            ? `linear-gradient(135deg, ${sheen.color}33, ${sheen.colorBlu}33)`
            : `linear-gradient(135deg, ${sheen.color}33, ${sheen.color}66)`;
        
        comboVisualHtml = `
            <div class="combo-visual specialized">
                <div class="sheen-preview" style="background: ${bgGradient}">
                    ${sheenDotHtml}
                </div>
            </div>`;
    } else if (kitType === 'professional' && sheen && killstreaker) {
        // Team Shine tiene 2 colores (RED y BLU)
        const isTeamShine = sheen.colorBlu;
        const sheenDotHtml = isTeamShine
            ? `<div class="sheen-color-dot team-shine">
                   <div class="dot-red" style="background: ${sheen.color}"></div>
                   <div class="dot-blu" style="background: ${sheen.colorBlu}"></div>
               </div>`
            : `<div class="sheen-color-dot" style="background: ${sheen.color}"></div>`;
        
        const bgGradient = isTeamShine
            ? `linear-gradient(135deg, ${sheen.color}33, ${sheen.colorBlu}33)`
            : `linear-gradient(135deg, ${sheen.color}33, ${sheen.color}66)`;
        
        comboVisualHtml = `
            <div class="combo-visual professional">
                <div class="sheen-preview" style="background: ${bgGradient}">
                    ${sheenDotHtml}
                </div>
                <span class="combo-plus">+</span>
                <div class="killstreaker-preview">
                    <img src="${killstreaker.image}" alt="${killstreaker.name}">
                </div>
            </div>`;
    }
    
    // Generar HTML de factores
    let factorsHtml = `
        <div class="detail-row">
            <span class="detail-label">Arma (${weaponData.tier} Tier)</span>
            <span class="detail-value">${(weaponData.priceMultiplier || 1.0).toFixed(2)}x</span>
        </div>`;
    
    if (sheen && comboInfo) {
        factorsHtml += `
            <div class="detail-row">
                <span class="detail-label">Sheen: ${sheen.name}</span>
                <span class="detail-value">${comboInfo.sheenMultiplier.toFixed(2)}x</span>
            </div>`;
    }
    
    if (killstreaker && comboInfo?.killstreakerMultiplier) {
        factorsHtml += `
            <div class="detail-row">
                <span class="detail-label">Efecto: ${killstreaker.name}</span>
                <span class="detail-value">${comboInfo.killstreakerMultiplier.toFixed(2)}x</span>
            </div>`;
    }
    
    // HTML de ROI (solo para kits que se fabrican)
    let roiHtml = '';
    if (!isFreeKit) {
        const roiClass = parseFloat(roiPercent) >= 50 ? 'positive' : parseFloat(roiPercent) >= 0 ? 'neutral' : 'negative';
        roiHtml = `
            <div class="roi-section">
                <h4>📈 Análisis de ROI</h4>
                <div class="roi-card ${roiClass}">
                    <div class="roi-main">
                        <span class="roi-label">Retorno de Inversión</span>
                        <span class="roi-value">${roiPercent}%</span>
                    </div>
                    <div class="roi-breakdown">
                        <div class="roi-item">
                            <span>Costo Fabricación</span>
                            <span class="cost">${craftingCost.toFixed(1)} Keys</span>
                        </div>
                        <div class="roi-item">
                            <span>Precio Venta</span>
                            <span class="revenue">${sellPriceKeys.toFixed(1)} Keys</span>
                        </div>
                        <div class="roi-item highlight">
                            <span>Ganancia Neta</span>
                            <span class="${profitKeys >= 0 ? 'profit' : 'loss'}">${profitKeys >= 0 ? '+' : ''}${profitKeys.toFixed(1)} Keys</span>
                        </div>
                    </div>
                </div>
                <div class="breakeven-note">
                    <span class="note-icon">⚖️</span>
                    <span>Punto de equilibrio: <strong>${breakEvenKeys.toFixed(1)} Keys</strong></span>
                </div>
            </div>`;
    } else {
        roiHtml = `
            <div class="roi-section free-kit">
                <div class="free-kit-badge">
                    <span class="badge-icon">🎁</span>
                    <span class="badge-text">Kit GRATIS - Two Cities Reward</span>
                </div>
                <p class="free-kit-note">Este kit se obtiene gratis al completar 4 mapas de Two Cities. ¡Todo es ganancia!</p>
            </div>`;
    }
    
    container.innerHTML = `
        <div class="combined-result-card">
            <div class="result-visual">
                <div class="kit-type-header ${kitType}">
                    <span class="kit-type-icon">${kitTypeIcon}</span>
                    <span class="kit-type-name">${kitTypeLabel}</span>
                </div>
                <div class="result-weapon">
                    <img class="class-icon-img" src="${CLASS_ICON_URLS[classId]}" alt="${classInfo?.name}">
                    <span class="weapon-label">${weaponName}</span>
                    <span class="role-badge" style="background: ${roleData.color}">${roleData.label}</span>
                </div>
                ${comboVisualHtml}
                <div class="result-tier-large" style="background: ${tierConfig.color}; color: ${finalTier === 'D' ? '#fff' : '#000'}">
                    ${tierConfig.icon} ${tierConfig.label}
                </div>
                <div class="multiplier-info">
                    <span>Multiplicador Final: <strong>${finalMultiplier.toFixed(2)}x</strong></span>
                </div>
            </div>
            
            <div class="result-details">
                <h4>📊 Factores de Valoración</h4>
                ${factorsHtml}
                <div class="detail-row highlight">
                    <span class="detail-label">Demanda</span>
                    <span class="detail-value">${getDemandLabel(weaponData.demand)}</span>
                </div>
                
                ${roiHtml}
                
                <h4>💰 Estrategias de Venta</h4>
                <div class="currency-tabs">
                    <button class="currency-tab active" onclick="switchCurrencyTab('keys')">🔑 Keys+Ref</button>
                    <button class="currency-tab" onclick="switchCurrencyTab('usd')">💵 USD</button>
                    <button class="currency-tab" onclick="switchCurrencyTab('mxn')">🇲🇽 MXN</button>
                </div>
                
                <div class="selling-strategies">
                    ${strategies.map(s => `
                        <div class="strategy-card ${s.key}">
                            <div class="strategy-header">
                                <span class="strategy-icon">${s.icon}</span>
                                <span class="strategy-name">${s.name}</span>
                            </div>
                            <div class="strategy-prices">
                                <div class="price-keys">${s.priceKeys} Keys <small>(${s.priceRef} Ref)</small></div>
                                <div class="price-usd" style="display:none;">$${s.priceUSD} USD</div>
                                <div class="price-mxn" style="display:none;">$${s.priceMXN} MXN</div>
                            </div>
                            <div class="strategy-meta">
                                <span class="strategy-days">⏱️ ~${s.days} días</span>
                                ${!isFreeKit ? `<span class="strategy-profit ${parseFloat(s.profit) >= 0 ? 'positive' : 'negative'}">💰 ${parseFloat(s.profit) >= 0 ? '+' : ''}${s.profit} Keys</span>` : ''}
                            </div>
                            <div class="strategy-platforms">${s.platforms.slice(0,2).join(' • ')}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

/**
 * Cambia la pestaña de divisa en estrategias
 */
function switchCurrencyTab(currency) {
    // Actualizar tabs
    document.querySelectorAll('.currency-tab').forEach(tab => {
        tab.classList.toggle('active', tab.textContent.toLowerCase().includes(currency));
    });
    
    // Mostrar/ocultar precios según divisa
    document.querySelectorAll('.strategy-card').forEach(card => {
        const priceKeys = card.querySelector('.price-keys');
        const priceUsd = card.querySelector('.price-usd');
        const priceMxn = card.querySelector('.price-mxn');
        
        if (priceKeys) priceKeys.style.display = currency === 'keys' ? 'block' : 'none';
        if (priceUsd) priceUsd.style.display = currency === 'usd' ? 'block' : 'none';
        if (priceMxn) priceMxn.style.display = currency === 'mxn' ? 'block' : 'none';
    });
}

/**
 * Poblar selects del panel de favoritos
 */
function populateFavoriteSelects() {
    // Poblar clases
    const classSelect = document.getElementById('favClass');
    if (classSelect) {
        classSelect.innerHTML = '<option value="">Seleccionar...</option>';
        TF2_CLASSES.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls.id;
            option.textContent = `${cls.icon} ${cls.name}`;
            classSelect.appendChild(option);
        });
    }
    
    // Poblar slots
    const slotSelect = document.getElementById('favSlot');
    if (slotSelect) {
        slotSelect.innerHTML = '<option value="">Seleccionar...</option>';
        WEAPON_SLOTS.forEach(slot => {
            const option = document.createElement('option');
            option.value = slot.id;
            option.textContent = `${slot.icon} ${slot.name}`;
            slotSelect.appendChild(option);
        });
    }
    
    // Poblar sheens
    const sheenSelect = document.getElementById('favSheen');
    if (sheenSelect) {
        sheenSelect.innerHTML = '<option value="">Seleccionar...</option>';
        SHEENS.forEach(sheen => {
            const option = document.createElement('option');
            option.value = sheen.id;
            option.textContent = sheen.name;
            option.style.color = sheen.color;
            sheenSelect.appendChild(option);
        });
    }
    
    // Poblar killstreakers
    const ksSelect = document.getElementById('favKillstreaker');
    if (ksSelect) {
        ksSelect.innerHTML = '<option value="">Ninguno (Specialized)</option>';
        KILLSTREAKERS.forEach(effect => {
            const option = document.createElement('option');
            option.value = effect.id;
            option.textContent = effect.name;
            ksSelect.appendChild(option);
        });
    }
}

/**
 * Inicializa el panel de favoritos
 */
function initFavoritesPanel() {
    const favClass = document.getElementById('favClass');
    const favSheen = document.getElementById('favSheen');
    const favKillstreaker = document.getElementById('favKillstreaker');
    
    // Poblar clases si está vacío
    if (favClass && favClass.options.length <= 1) {
        TF2_CLASSES.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls.id;
            option.textContent = cls.name;
            favClass.appendChild(option);
        });
    }
    
    // Poblar sheens si está vacío
    if (favSheen && favSheen.options.length <= 1) {
        SHEENS.forEach(sheen => {
            const option = document.createElement('option');
            option.value = sheen.id;
            option.textContent = sheen.name;
            option.style.color = sheen.color;
            favSheen.appendChild(option);
        });
    }
    
    // Poblar killstreakers si está vacío
    if (favKillstreaker && favKillstreaker.options.length <= 1) {
        KILLSTREAKERS.forEach(ks => {
            const option = document.createElement('option');
            option.value = ks.id;
            option.textContent = ks.name;
            favKillstreaker.appendChild(option);
        });
    }
    
    // Cargar favoritos guardados
    renderFavoritesList();
}

/**
 * Actualiza campos de favoritos según tipo de kit
 */
function updateFavoriteFields() {
    const kitType = document.getElementById('favKitType')?.value;
    const ksGroup = document.getElementById('favKillstreakerGroup');
    
    if (ksGroup) {
        ksGroup.style.display = kitType === 'professional' ? 'block' : 'none';
    }
    
    updateFavoriteCostPreview();
}

/**
 * Actualiza armas en favoritos
 */
function updateFavoriteWeapons() {
    const classId = document.getElementById('favClass')?.value;
    const slot = document.getElementById('favSlot')?.value;
    const weaponSelect = document.getElementById('favWeapon');
    
    if (!weaponSelect) return;
    
    weaponSelect.innerHTML = '<option value="">Seleccionar...</option>';
    
    if (!classId) return;
    
    const weapons = POPULAR_WEAPONS[classId];
    if (!weapons) return;
    
    const slots = slot ? [slot] : ['primary', 'secondary', 'melee'];
    
    slots.forEach(s => {
        if (weapons[s]) {
            weapons[s].forEach(weapon => {
                const option = document.createElement('option');
                option.value = `${s}|${weapon}`;
                option.textContent = weapon;
                weaponSelect.appendChild(option);
            });
        }
    });
    
    updateFavoriteCostPreview();
}

/**
 * Actualiza preview de costo del favorito
 */
function updateFavoriteCostPreview() {
    const kitType = document.getElementById('favKitType')?.value;
    const classId = document.getElementById('favClass')?.value;
    const weaponValue = document.getElementById('favWeapon')?.value;
    const sheenId = document.getElementById('favSheen')?.value;
    const killstreakerId = document.getElementById('favKillstreaker')?.value;
    
    const costKeys = document.getElementById('favCostKeys');
    const costUsd = document.getElementById('favCostUSD');
    const costMxn = document.getElementById('favCostMXN');
    
    if (!costKeys || !kitType) {
        if (costKeys) costKeys.textContent = '-- Keys';
        if (costUsd) costUsd.textContent = '~$-- USD';
        if (costMxn) costMxn.textContent = '~$-- MXN';
        return;
    }
    
    // Calcular precio estimado del kit terminado
    let basePrice = kitType === 'specialized' ? 8 : 25;
    let multiplier = 1.0;
    
    // Obtener multiplicador de arma
    if (classId && weaponValue) {
        const [slot, weaponName] = weaponValue.split('|');
        const weaponData = WEAPON_DEMAND[classId]?.[slot]?.[weaponName];
        if (weaponData) multiplier *= weaponData.priceMultiplier || 1.0;
    }
    
    // Obtener multiplicador de combo
    if (sheenId) {
        const comboInfo = calculateComboTier(sheenId, kitType === 'professional' ? killstreakerId : null);
        if (comboInfo) multiplier *= comboInfo.totalMultiplier || 1.0;
    }
    
    const finalPrice = basePrice * multiplier;
    const priceUSD = finalPrice * 2.20;
    const priceMXN = finalPrice * 47;
    
    costKeys.textContent = `${finalPrice.toFixed(1)} Keys`;
    costUsd.textContent = `~$${priceUSD.toFixed(0)} USD`;
    costMxn.textContent = `~$${priceMXN.toFixed(0)} MXN`;
}

/**
 * Agrega un favorito personal
 */
function addPersonalFavorite() {
    const kitType = document.getElementById('favKitType')?.value;
    const classId = document.getElementById('favClass')?.value;
    const weaponValue = document.getElementById('favWeapon')?.value;
    const sheenId = document.getElementById('favSheen')?.value;
    const killstreakerId = document.getElementById('favKillstreaker')?.value;
    
    if (!kitType || !classId || !weaponValue || !sheenId) {
        showToast('Completa todos los campos requeridos', 'warning');
        return;
    }
    
    if (kitType === 'professional' && !killstreakerId) {
        showToast('Selecciona un Killstreaker para Professional', 'warning');
        return;
    }
    
    const [slot, weaponName] = weaponValue.split('|');
    const classInfo = TF2_CLASSES.find(c => c.id === classId);
    const sheen = SHEENS.find(s => s.id === sheenId);
    const killstreaker = kitType === 'professional' ? KILLSTREAKERS.find(k => k.id === killstreakerId) : null;
    
    // Calcular tier de la combinación
    const comboTier = calculateComboTier(sheenId, killstreakerId);
    
    // Calcular costo estimado
    const keyPriceRef = parseFloat(localStorage.getItem('mvm_keyPrice')) || 56;
    const keyPriceUSD = 2.20;
    const keyPriceMXN = 47.00;
    
    let costKeys = 0;
    if (kitType === 'specialized') {
        costKeys = 3.5; // Costo base Specialized
    } else {
        costKeys = 15; // Costo base Professional
    }
    
    const favorite = {
        id: Date.now(),
        kitType,
        classId,
        className: classInfo?.name,
        slot,
        weaponName,
        sheenId,
        sheenName: sheen?.name,
        sheenColor: sheen?.color,
        sheenColorBlu: sheen?.colorBlu || null,
        killstreakerId: killstreaker?.id || null,
        killstreakerName: killstreaker?.name || null,
        killstreakerImage: killstreaker?.image || null,
        tier: comboTier?.tier || 'C',
        costKeys: costKeys,
        costUSD: (costKeys * keyPriceUSD).toFixed(2),
        costMXN: (costKeys * keyPriceMXN).toFixed(0),
        createdAt: new Date().toISOString()
    };
    
    // Guardar en localStorage
    const favorites = JSON.parse(localStorage.getItem('mvm_favorites') || '[]');
    favorites.push(favorite);
    localStorage.setItem('mvm_favorites', JSON.stringify(favorites));
    
    showToast('Favorito guardado ❤️', 'success');
    renderFavoritesList();
    
    // Limpiar formulario
    document.getElementById('favKitType').value = '';
    document.getElementById('favClass').value = '';
    document.getElementById('favWeapon').innerHTML = '<option value="">Seleccionar...</option>';
    document.getElementById('favSheen').value = '';
    document.getElementById('favKillstreaker').value = '';
}

/**
 * Renderiza la lista de favoritos
 */
function renderFavoritesList() {
    const container = document.getElementById('favoritesList');
    if (!container) return;
    
    const favorites = JSON.parse(localStorage.getItem('mvm_favorites') || '[]');
    
    if (favorites.length === 0) {
        container.innerHTML = `
            <div class="empty-favorites">
                <span class="empty-icon">💔</span>
                <p>No tienes favoritos guardados</p>
                <p class="empty-hint">Agrega combinaciones que quieras usar en tus armas</p>
            </div>
        `;
        return;
    }
    
    // URL por defecto si no hay clase
    const DEFAULT_CLASS_ICON = 'https://wiki.teamfortress.com/w/images/4/4a/Mercenary_logo_TF2.png';
    
    // Configuración de tiers para badges
    const TIER_BADGES = {
        'S': { icon: '🏆', color: '#FFD700', label: 'S Tier' },
        'A': { icon: '🔥', color: '#FF6B6B', label: 'A Tier' },
        'B': { icon: '⭐', color: '#F4D03F', label: 'B Tier' },
        'C': { icon: '●', color: '#95A5A6', label: 'C Tier' },
        'D': { icon: '▼', color: '#7F8C8D', label: 'D Tier' }
    };
    
    // Opacidad del efecto según tier (D=0.5, S=1)
    const TIER_GLOW = { 'S': 1, 'A': 0.85, 'B': 0.7, 'C': 0.55, 'D': 0.5 };
    
    // Colores de kit
    const KIT_COLORS = {
        'specialized': '#FFC107',
        'professional': '#9C27B0'
    };
    
    container.innerHTML = favorites.map(fav => {
        // Obtener URL de icono de clase con fallback
        const classIconUrl = (fav.classId && CLASS_ICON_URLS[fav.classId]) || DEFAULT_CLASS_ICON;
        
        // Obtener imagen del killstreaker si existe
        const killstreaker = fav.killstreakerId ? KILLSTREAKERS.find(k => k.id === fav.killstreakerId) : null;
        const ksImageUrl = fav.killstreakerImage || killstreaker?.image || null;
        
        // Badge de tier
        const tier = fav.tier || 'C';
        const tierConfig = TIER_BADGES[tier] || TIER_BADGES['C'];
        const glowOpacity = TIER_GLOW[tier] || 0.5;
        const kitColor = KIT_COLORS[fav.kitType] || KIT_COLORS['specialized'];
        
        // Calcular costos si no están guardados
        const costKeys = fav.costKeys || (fav.kitType === 'professional' ? 15 : 3.5);
        const costUSD = fav.costUSD || (costKeys * 2.20).toFixed(2);
        const costMXN = fav.costMXN || (costKeys * 47).toFixed(0);
        
        // Generar HTML del sheen (círculo de color para todos, incluyendo Team Shine)
        const sheenDotHtml = fav.sheenColorBlu 
            ? `<div class="fav-sheen-dot team-shine-dot">
                   <div class="dot-half red" style="background: ${fav.sheenColor}"></div>
                   <div class="dot-half blu" style="background: ${fav.sheenColorBlu}"></div>
               </div>`
            : `<div class="fav-sheen-dot" style="background: ${fav.sheenColor || '#888'}"></div>`;
        
        // Serializar datos del favorito para el modal
        const favDataAttr = encodeURIComponent(JSON.stringify(fav));
        
        return `
        <div class="favorite-card" 
             data-id="${fav.id}" 
             data-tier="${tier}"
             data-kit="${fav.kitType}"
             data-fav="${favDataAttr}"
             style="--kit-color: ${kitColor}; --tier-color: ${tierConfig.color}; --glow-opacity: ${glowOpacity}"
             onclick="openFavoriteModal(this)">
            <div class="fav-card-glow"></div>
            <div class="fav-card-content">
                <div class="fav-card-header">
                    <div class="fav-icons">
                        <img class="fav-class-icon" src="${classIconUrl}" alt="${fav.className || 'Clase'}" title="${fav.className || 'Clase'}">
                        ${ksImageUrl ? `<img class="fav-ks-icon" src="${ksImageUrl}" alt="${fav.killstreakerName}" title="${fav.killstreakerName}">` : ''}
                    </div>
                    <span class="fav-tier-badge" style="background: ${tierConfig.color}20; color: ${tierConfig.color}" title="${tierConfig.label}">
                        ${tierConfig.icon} ${tier}
                    </span>
                </div>
                <div class="fav-card-body">
                    <div class="fav-weapon-name">${fav.weaponName || 'Arma'}</div>
                    <div class="fav-combo-row">
                        ${sheenDotHtml}
                        <span class="fav-sheen-name">${fav.sheenName || 'Sheen'}</span>
                        ${fav.killstreakerName ? `<span class="fav-ks-name">+ ${fav.killstreakerName}</span>` : ''}
                    </div>
                </div>
                <div class="fav-card-footer">
                    <div class="fav-prices">
                        <span class="fav-price keys" title="Keys">🔑 ${costKeys}</span>
                        <span class="fav-price usd" title="USD">$${costUSD}</span>
                        <span class="fav-price mxn" title="MXN">$${costMXN}</span>
                    </div>
                    <div class="fav-actions">
                        <span class="fav-kit-type ${fav.kitType || ''}">${fav.kitType === 'specialized' ? '⭐' : '💎'}</span>
                        <button class="btn-remove-fav-small" onclick="event.stopPropagation(); removeFavorite(${fav.id})" title="Eliminar">✕</button>
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');
}

/**
 * Elimina un favorito
 */
function removeFavorite(id) {
    const favorites = JSON.parse(localStorage.getItem('mvm_favorites') || '[]');
    const filtered = favorites.filter(f => f.id !== id);
    localStorage.setItem('mvm_favorites', JSON.stringify(filtered));
    showToast('Favorito eliminado', 'info');
    renderFavoritesList();
}

/**
 * Obtiene el tier final basado en multiplicador combinado
 */
function getFinalTier(multiplier) {
    if (multiplier >= 2.5) return 'S';
    if (multiplier >= 1.8) return 'A';
    if (multiplier >= 1.3) return 'B';
    if (multiplier >= 1.0) return 'C';
    return 'D';
}

/**
 * Obtiene label de demanda
 */
function getDemandLabel(demand) {
    const labels = {
        'very-high': '🔥🔥 Muy Alta',
        'high': '🔥 Alta',
        'medium': '⭐ Media',
        'low': '● Baja'
    };
    return labels[demand] || demand;
}

/**
 * Abre el modal detallado del favorito
 */
function openFavoriteModal(cardElement) {
    const favData = JSON.parse(decodeURIComponent(cardElement.dataset.fav));
    
    // Obtener datos completos
    const classInfo = TF2_CLASSES.find(c => c.id === favData.classId);
    const sheen = SHEENS.find(s => s.id === favData.sheenId);
    const killstreaker = favData.killstreakerId ? KILLSTREAKERS.find(k => k.id === favData.killstreakerId) : null;
    
    // URLs de imágenes
    const CLASS_PROFILE_URLS = {
        'scout': 'https://wiki.teamfortress.com/w/images/1/13/Icon_scout.jpg',
        'soldier': 'https://wiki.teamfortress.com/w/images/c/c1/Icon_soldier.jpg',
        'pyro': 'https://wiki.teamfortress.com/w/images/1/13/Icon_pyro.jpg',
        'demoman': 'https://wiki.teamfortress.com/w/images/c/c0/Icon_demoman.jpg',
        'heavy': 'https://wiki.teamfortress.com/w/images/8/8e/Icon_heavy.jpg',
        'engineer': 'https://wiki.teamfortress.com/w/images/b/bc/Icon_engineer.jpg',
        'medic': 'https://wiki.teamfortress.com/w/images/f/f5/Icon_medic.jpg',
        'sniper': 'https://wiki.teamfortress.com/w/images/a/ac/Icon_sniper.jpg',
        'spy': 'https://wiki.teamfortress.com/w/images/9/9b/Icon_spy.jpg'
    };
    
    const SHEEN_IMAGE_URLS = {
        'team_shine': { red: 'https://wiki.teamfortress.com/w/images/1/10/Killstreak_Team_Shine_RED.png', blu: 'https://wiki.teamfortress.com/w/images/7/72/Killstreak_Team_Shine_BLU.png' },
        'hot_rod': 'https://wiki.teamfortress.com/w/images/3/31/Killstreak_Hot_Rod.png',
        'manndarin': 'https://wiki.teamfortress.com/w/images/c/c4/Killstreak_Manndarin.png',
        'deadly_daffodil': 'https://wiki.teamfortress.com/w/images/6/62/Killstreak_Deadly_Daffodil.png',
        'agonizing_emerald': 'https://wiki.teamfortress.com/w/images/e/e8/Killstreak_Agonizing_Emerald.png',
        'mean_green': 'https://wiki.teamfortress.com/w/images/b/b1/Killstreak_Mean_Green.png',
        'villainous_violet': 'https://wiki.teamfortress.com/w/images/f/fe/Killstreak_Villainous_Violet.png'
    };
    
    // Tier config
    const TIER_CONFIG = {
        'S': { icon: '🏆', color: '#FFD700', label: 'S Tier - God Tier', desc: 'Máxima demanda. Se vende instantáneamente con +100% premium.' },
        'A': { icon: '🔥', color: '#FF6B6B', label: 'A Tier - High Demand', desc: 'Alta demanda. Venta rápida con +30-50% premium.' },
        'B': { icon: '⭐', color: '#F4D03F', label: 'B Tier - Good', desc: 'Demanda estable. +20-49% premium sobre precio base.' },
        'C': { icon: '●', color: '#95A5A6', label: 'C Tier - Average', desc: 'Demanda normal. Precio base sin premium significativo.' },
        'D': { icon: '▼', color: '#7F8C8D', label: 'D Tier - Low', desc: 'Baja demanda. -10-20% descuento. Difícil de vender.' }
    };
    
    // Calcular tier y combo
    const comboTier = calculateComboTier(favData.sheenId, favData.killstreakerId);
    const tier = favData.tier || comboTier?.tier || 'C';
    const tierConfig = TIER_CONFIG[tier];
    
    // Obtener rol de la clase
    const classRole = Object.entries(CLASS_ROLES).find(([role, data]) => data.classes.includes(favData.classId));
    const roleInfo = classRole ? { role: classRole[0], ...classRole[1] } : null;
    
    // Generar análisis de compatibilidad
    const compatAnalysis = generateCompatibilityAnalysis(favData, classInfo, sheen, killstreaker, roleInfo);
    
    // Costos
    const costKeys = favData.costKeys || (favData.kitType === 'professional' ? 15 : 3.5);
    const costUSD = favData.costUSD || (costKeys * 2.20).toFixed(2);
    const costMXN = favData.costMXN || (costKeys * 47).toFixed(0);
    
    // Imágenes del sheen
    let sheenImagesHtml = '';
    if (favData.sheenId === 'team_shine') {
        sheenImagesHtml = `
            <div class="modal-sheen-images team-shine">
                <img src="${SHEEN_IMAGE_URLS.team_shine.red}" alt="Team Shine RED" title="Team Shine RED">
                <img src="${SHEEN_IMAGE_URLS.team_shine.blu}" alt="Team Shine BLU" title="Team Shine BLU">
            </div>`;
    } else if (SHEEN_IMAGE_URLS[favData.sheenId]) {
        sheenImagesHtml = `<img class="modal-sheen-img" src="${SHEEN_IMAGE_URLS[favData.sheenId]}" alt="${favData.sheenName}">`;
    }
    
    // Crear modal HTML
    const modalHtml = `
    <div class="favorite-modal-overlay" onclick="closeFavoriteModal(event)">
        <div class="favorite-modal" style="--kit-color: ${favData.kitType === 'professional' ? '#9C27B0' : '#FFC107'}; --tier-color: ${tierConfig.color}">
            <div class="modal-glow"></div>
            <button class="modal-close" onclick="closeFavoriteModal(event)">✕</button>
            
            <div class="modal-header">
                <div class="modal-class-profile">
                    <img class="modal-profile-img" src="${CLASS_PROFILE_URLS[favData.classId] || ''}" alt="${classInfo?.name}">
                    <img class="modal-class-icon-overlay" src="${CLASS_ICON_URLS[favData.classId]}" alt="${classInfo?.name}">
                </div>
                <div class="modal-title-section">
                    <h2 class="modal-weapon-name">${favData.weaponName}</h2>
                    <div class="modal-class-info">
                        <span class="modal-class-name" style="color: ${classInfo?.color}">${classInfo?.name || 'Clase'}</span>
                        ${roleInfo ? `<span class="modal-role-badge" style="background: ${roleInfo.color}20; color: ${roleInfo.color}">${roleInfo.label}</span>` : ''}
                    </div>
                </div>
                <div class="modal-tier-display">
                    <span class="modal-tier-badge" style="background: ${tierConfig.color}; color: #000">
                        ${tierConfig.icon} ${tier}
                    </span>
                    <span class="modal-tier-label">${tierConfig.label}</span>
                </div>
            </div>
            
            <div class="modal-body">
                <div class="modal-section combo-section">
                    <h3>🎨 Combinación</h3>
                    <div class="modal-combo-display">
                        <div class="modal-combo-item sheen">
                            <div class="combo-item-visual">
                                ${sheenImagesHtml || `<div class="sheen-color-preview" style="background: ${favData.sheenColor}"></div>`}
                            </div>
                            <div class="combo-item-info">
                                <span class="combo-item-label">Sheen</span>
                                <span class="combo-item-name" style="color: ${favData.sheenColor}">${favData.sheenName}</span>
                            </div>
                        </div>
                        ${killstreaker ? `
                        <div class="modal-combo-separator">+</div>
                        <div class="modal-combo-item killstreaker">
                            <div class="combo-item-visual">
                                <img src="${killstreaker.image}" alt="${killstreaker.name}">
                            </div>
                            <div class="combo-item-info">
                                <span class="combo-item-label">Killstreaker</span>
                                <span class="combo-item-name">${killstreaker.name}</span>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                    <div class="modal-kit-type">
                        <span class="kit-badge ${favData.kitType}">
                            ${favData.kitType === 'professional' ? '💎 Professional Killstreak' : '⭐ Specialized Killstreak'}
                        </span>
                    </div>
                </div>
                
                <div class="modal-section pricing-section">
                    <h3>💰 Costo Estimado</h3>
                    <div class="modal-prices-grid">
                        <div class="modal-price-card">
                            <span class="price-icon">🔑</span>
                            <span class="price-value">${costKeys}</span>
                            <span class="price-label">Keys</span>
                        </div>
                        <div class="modal-price-card">
                            <span class="price-icon">💵</span>
                            <span class="price-value">$${costUSD}</span>
                            <span class="price-label">USD</span>
                        </div>
                        <div class="modal-price-card">
                            <span class="price-icon">🇲🇽</span>
                            <span class="price-value">$${costMXN}</span>
                            <span class="price-label">MXN</span>
                        </div>
                    </div>
                </div>
                
                <div class="modal-section tier-section">
                    <h3>📊 Análisis de Demanda</h3>
                    <div class="tier-analysis">
                        <p class="tier-description">${tierConfig.desc}</p>
                        ${comboTier ? `
                        <div class="tier-details">
                            <div class="tier-detail">
                                <span class="detail-label">Multiplicador Sheen:</span>
                                <span class="detail-value">x${comboTier.sheenMultiplier?.toFixed(2) || '1.00'}</span>
                            </div>
                            ${comboTier.killstreakerMultiplier ? `
                            <div class="tier-detail">
                                <span class="detail-label">Multiplicador Killstreaker:</span>
                                <span class="detail-value">x${comboTier.killstreakerMultiplier.toFixed(2)}</span>
                            </div>
                            ` : ''}
                            <div class="tier-detail total">
                                <span class="detail-label">Multiplicador Total:</span>
                                <span class="detail-value" style="color: ${tierConfig.color}">x${comboTier.totalMultiplier?.toFixed(2) || '1.00'}</span>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="modal-section compatibility-section">
                    <h3>🎯 Compatibilidad con ${classInfo?.name || 'la Clase'}</h3>
                    <div class="compatibility-analysis">
                        ${compatAnalysis}
                    </div>
                </div>
            </div>
            
            <div class="modal-footer">
                <span class="modal-created">Guardado: ${new Date(favData.createdAt).toLocaleDateString('es-MX')}</span>
                <button class="btn-modal-close" onclick="closeFavoriteModal(event)">Cerrar</button>
            </div>
        </div>
    </div>
    `;
    
    // Insertar modal
    const modalContainer = document.createElement('div');
    modalContainer.id = 'favoriteModalContainer';
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer);
    
    // Animar entrada
    requestAnimationFrame(() => {
        modalContainer.querySelector('.favorite-modal-overlay').classList.add('active');
    });
}

/**
 * Genera análisis de compatibilidad para el modal
 */
function generateCompatibilityAnalysis(favData, classInfo, sheen, killstreaker, roleInfo) {
    const analyses = [];
    
    // Análisis por color del sheen y clase
    const colorAnalysis = {
        'team_shine': {
            'scout': { score: 5, text: 'Team Shine combina perfectamente con Scout. Los colores RED/BLU reflejan su velocidad y versatilidad en ambos equipos.' },
            'soldier': { score: 5, text: 'Excelente elección. El Soldier se beneficia del Team Shine para mostrar orgullo de equipo en cada rocket kill.' },
            'pyro': { score: 4, text: 'Muy buena combinación. El Pyro con Team Shine muestra lealtad ardiente al equipo.' },
            'demoman': { score: 4, text: 'Sólida elección. El Team Shine resalta las sticky kills del Demo con colores de equipo.' },
            'heavy': { score: 5, text: 'Combinación imponente. El Heavy con Team Shine es un símbolo de poder del equipo.' },
            'engineer': { score: 4, text: 'Buena elección táctica. El Team Shine en armas del Engi muestra dedicación al equipo.' },
            'medic': { score: 5, text: '¡Perfecta para Medic! El Team Shine refleja tu rol de soporte vital para cualquier equipo.' },
            'sniper': { score: 4, text: 'Elegante combinación. Las headshots brillarán con los colores de tu equipo.' },
            'spy': { score: 3, text: 'Interesante elección. El Team Shine puede delatar tu presencia, pero muestra estilo.' }
        },
        'hot_rod': {
            'pyro': { score: 5, text: '¡Combinación icónica! Hot Rod y Pyro = rosa ardiente. La comunidad ama esta combo.' },
            'scout': { score: 4, text: 'Hot Rod le da velocidad visual al Scout. Muy popular entre speedrunners.' },
            'default': { score: 3, text: 'Hot Rod es un sheen muy demandado. Buena inversión en cualquier clase.' }
        },
        'villainous_violet': {
            'spy': { score: 5, text: '¡Combo de élite! Villainous Violet es EL color del Spy. Máximo estilo y demanda.' },
            'medic': { score: 4, text: 'El violeta le da un toque místico al Medic. Muy apreciado por la comunidad.' },
            'default': { score: 4, text: 'Villainous Violet es high tier. Excelente elección para cualquier arma.' }
        },
        'default': {
            'default': { score: 3, text: 'Una combinación sólida que se verá bien en el campo de batalla.' }
        }
    };
    
    // Obtener análisis de color
    const sheenAnalysis = colorAnalysis[favData.sheenId] || colorAnalysis['default'];
    const classAnalysis = sheenAnalysis[favData.classId] || sheenAnalysis['default'] || colorAnalysis['default']['default'];
    
    analyses.push(`
        <div class="compat-item ${classAnalysis.score >= 4 ? 'excellent' : classAnalysis.score >= 3 ? 'good' : 'neutral'}">
            <div class="compat-score">${'⭐'.repeat(classAnalysis.score)}</div>
            <p class="compat-text">${classAnalysis.text}</p>
        </div>
    `);
    
    // Análisis del killstreaker si existe
    if (killstreaker) {
        const ksAnalysis = {
            'fire_horns': { text: 'Fire Horns es el efecto más demandado. Imponente y agresivo, perfecto para mostrar dominancia.', score: 5 },
            'cerebral_discharge': { text: 'Cerebral Discharge muestra inteligencia letal. Muy apreciado por jugadores competitivos.', score: 4 },
            'tornado': { text: 'Tornado ofrece un efecto dinámico y llamativo. Alta demanda en la comunidad.', score: 4 },
            'singularity': { text: 'Singularity tiene un efecto único y misterioso. Buena demanda.', score: 3 },
            'incinerator': { text: 'Incinerator combina bien con clases de fuego. Demanda estable.', score: 3 },
            'flames': { text: 'Flames es un efecto clásico pero común. Precio accesible.', score: 2 },
            'hypno_beam': { text: 'Hypno-Beam tiene un efecto peculiar. Nicho pero con sus fans.', score: 2 }
        };
        
        const ks = ksAnalysis[killstreaker.id] || { text: 'Un efecto sólido que complementa tu loadout.', score: 3 };
        
        analyses.push(`
            <div class="compat-item ${ks.score >= 4 ? 'excellent' : ks.score >= 3 ? 'good' : 'neutral'}">
                <div class="compat-header">
                    <img src="${killstreaker.image}" alt="${killstreaker.name}" class="compat-ks-img">
                    <span class="compat-ks-name">${killstreaker.name}</span>
                </div>
                <div class="compat-score">${'⭐'.repeat(ks.score)}</div>
                <p class="compat-text">${ks.text}</p>
            </div>
        `);
    }
    
    // Consejo general
    const generalTip = roleInfo?.role === 'offensive' 
        ? '💡 <strong>Tip:</strong> Como clase ofensiva, los efectos llamativos te harán memorable en el campo de batalla.'
        : roleInfo?.role === 'defensive'
        ? '💡 <strong>Tip:</strong> Como clase defensiva, tus killstreaks serán símbolos de zona protegida.'
        : '💡 <strong>Tip:</strong> Como clase de soporte, los efectos elegantes reflejan tu rol estratégico.';
    
    analyses.push(`<div class="compat-tip">${generalTip}</div>`);
    
    return analyses.join('');
}

/**
 * Cierra el modal de favorito
 */
function closeFavoriteModal(event) {
    if (event) event.stopPropagation();
    const container = document.getElementById('favoriteModalContainer');
    if (container) {
        container.querySelector('.favorite-modal-overlay').classList.remove('active');
        setTimeout(() => container.remove(), 300);
    }
}

// Exportar funciones
window.initValuationClassTabs = initValuationClassTabs;
window.switchValuationClass = switchValuationClass;
window.switchMatrixTab = switchMatrixTab;
window.renderWeaponsDemandGrid = renderWeaponsDemandGrid;
window.initCombinedSelectors = initCombinedSelectors;
window.updateCombinedWeapons = updateCombinedWeapons;
window.updateCombinedAnalysis = updateCombinedAnalysis;
window.updateCombinedKitType = updateCombinedKitType;
window.switchCurrencyTab = switchCurrencyTab;
window.populateFavoriteSelects = populateFavoriteSelects;
window.initFavoritesPanel = initFavoritesPanel;
window.updateFavoriteFields = updateFavoriteFields;
window.updateFavoriteWeapons = updateFavoriteWeapons;
window.updateFavoriteCostPreview = updateFavoriteCostPreview;
window.addPersonalFavorite = addPersonalFavorite;
window.renderFavoritesList = renderFavoritesList;
window.removeFavorite = removeFavorite;
window.openFavoriteModal = openFavoriteModal;
window.closeFavoriteModal = closeFavoriteModal;

console.log('⭐ valuation.js cargado');
