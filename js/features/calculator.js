// ============================================
// CALCULADORA - Economía y Rentabilidad
// ============================================

// Variable para la fuente de precios de rentabilidad
let profitSource = 'backpack_tf';

// ============================================
// CALCULADORA BÁSICA
// ============================================

function initCalculator() {
    // Cargar valores guardados
    const scrapInput = document.getElementById('scrapValue');
    const recInput = document.getElementById('recValue');
    const keyInput = document.getElementById('keyValue');
    
    if (scrapInput) scrapInput.value = appState.settings.scrapValue;
    if (recInput) recInput.value = appState.settings.recValue;
    if (keyInput) keyInput.value = appState.settings.keyValue;
    
    // Listeners para cambios
    ['scrapValue', 'recValue', 'keyValue'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('change', (e) => {
                const key = id.replace('Value', '') === 'rec' ? 'recValue' : 
                            id.replace('Value', '') === 'scrap' ? 'scrapValue' : 'keyValue';
                appState.settings[key] = parseFloat(e.target.value) || 0;
                saveToStorage();
            });
        }
    });
}

function calculateTotalValue() {
    const scrap = appState.inventory.currency.scrap;
    const rec = appState.inventory.currency.reclaimed;
    const ref = appState.inventory.currency.refined;
    const keys = appState.inventory.currency.keys;
    
    const scrapVal = appState.settings.scrapValue;
    const recVal = appState.settings.recValue;
    const refVal = appState.settings.refValue;
    const keyVal = appState.settings.keyValue;
    
    const scrapTotal = scrap * scrapVal;
    const recTotal = rec * recVal;
    const refTotal = ref * refVal;
    const keysTotal = keys * keyVal;
    
    const grandTotal = scrapTotal + recTotal + refTotal + keysTotal;
    const keysEquivalent = grandTotal / keyVal;
    
    // Actualizar UI de calculadora
    const calcScrapCount = document.getElementById('calc-scrap-count');
    const calcScrapValue = document.getElementById('calc-scrap-value');
    const calcRecCount = document.getElementById('calc-rec-count');
    const calcRecValue = document.getElementById('calc-rec-value');
    const calcRefCount = document.getElementById('calc-ref-count');
    const calcRefValue = document.getElementById('calc-ref-value');
    const calcKeysCount = document.getElementById('calc-keys-count');
    const calcKeysValue = document.getElementById('calc-keys-value');
    const calcTotal = document.getElementById('calc-total');
    const calcKeysEquiv = document.getElementById('calc-keys-equivalent');
    const totalValue = document.getElementById('totalValue');
    
    if (calcScrapCount) calcScrapCount.textContent = scrap;
    if (calcScrapValue) calcScrapValue.textContent = `${scrapTotal.toFixed(2)} Ref`;
    
    if (calcRecCount) calcRecCount.textContent = rec;
    if (calcRecValue) calcRecValue.textContent = `${recTotal.toFixed(2)} Ref`;
    
    if (calcRefCount) calcRefCount.textContent = ref;
    if (calcRefValue) calcRefValue.textContent = `${refTotal.toFixed(2)} Ref`;
    
    if (calcKeysCount) calcKeysCount.textContent = keys;
    if (calcKeysValue) calcKeysValue.textContent = `${keysTotal.toFixed(2)} Ref`;
    
    if (calcTotal) calcTotal.textContent = `${grandTotal.toFixed(2)} Ref`;
    if (calcKeysEquiv) calcKeysEquiv.textContent = `${keysEquivalent.toFixed(2)} Keys`;
    
    if (totalValue) totalValue.textContent = `${grandTotal.toFixed(2)} Ref`;
    
    return grandTotal;
}

// ============================================
// CALCULADORA DE RENTABILIDAD
// ============================================

function initProfitCalculator() {
    // Poblar select de sheens
    const sheenSelect = document.getElementById('profitSheen');
    if (sheenSelect) {
        sheenSelect.innerHTML = '';
        SHEENS.forEach(sheen => {
            const option = document.createElement('option');
            option.value = sheen.id;
            const demandData = SHEEN_DEMAND[sheen.id];
            const demandIcon = demandData.demand === 'very-high' ? '🔥' : 
                              demandData.demand === 'high' ? '⬆️' : 
                              demandData.demand === 'medium' ? '➡️' : '⬇️';
            option.textContent = `${sheen.name} ${demandIcon}`;
            option.style.color = sheen.color;
            sheenSelect.appendChild(option);
        });
    }
    
    // Poblar select de killstreakers
    const ksSelect = document.getElementById('profitKillstreaker');
    if (ksSelect) {
        ksSelect.innerHTML = '';
        KILLSTREAKERS.forEach(effect => {
            const option = document.createElement('option');
            option.value = effect.id;
            const demandData = KILLSTREAKER_DEMAND[effect.id];
            const demandIcon = demandData.demand === 'very-high' ? '🔥' : 
                              demandData.demand === 'high' ? '⬆️' : 
                              demandData.demand === 'medium' ? '➡️' : '⬇️';
            option.textContent = `${effect.name} ${demandIcon}`;
            ksSelect.appendChild(option);
        });
    }
    
    // Poblar selector de clases para el simulador
    const classSelect = document.getElementById('profitClass');
    if (classSelect) {
        classSelect.innerHTML = '<option value="">Cualquier clase</option>';
        TF2_CLASSES.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls.id;
            option.textContent = `${cls.icon} ${cls.name}`;
            option.style.color = cls.color;
            classSelect.appendChild(option);
        });
    }
    
    updateProfitCalculator();
}

function updateProfitWeapons() {
    const classId = document.getElementById('profitClass')?.value;
    const slotId = document.getElementById('profitSlot')?.value;
    const weaponSelect = document.getElementById('profitWeapon');
    const classPreview = document.getElementById('profitClassPreview');
    const hint = document.getElementById('weaponPopularityHint');
    
    if (classPreview) {
        if (classId) {
            const cls = TF2_CLASSES.find(c => c.id === classId);
            classPreview.innerHTML = `<span class="class-icon-large" style="color: ${cls.color}">${cls.icon}</span>`;
            classPreview.classList.add('active');
        } else {
            classPreview.innerHTML = '<span class="class-icon-large">🎮</span>';
            classPreview.classList.remove('active');
        }
    }
    
    if (weaponSelect) {
        weaponSelect.innerHTML = '<option value="">Cualquier arma</option>';
        
        if (classId && slotId && POPULAR_WEAPONS[classId]) {
            const weapons = POPULAR_WEAPONS[classId][slotId] || [];
            weapons.forEach(weapon => {
                const option = document.createElement('option');
                option.value = weapon;
                option.textContent = weapon;
                weaponSelect.appendChild(option);
            });
        } else if (classId && !slotId) {
            ['primary', 'secondary', 'melee'].forEach(slot => {
                const weapons = POPULAR_WEAPONS[classId]?.[slot] || [];
                weapons.forEach(weapon => {
                    const option = document.createElement('option');
                    option.value = weapon;
                    const slotIcon = slot === 'primary' ? '1️⃣' : slot === 'secondary' ? '2️⃣' : '3️⃣';
                    option.textContent = `${slotIcon} ${weapon}`;
                    weaponSelect.appendChild(option);
                });
            });
        }
    }
    
    if (hint) {
        if (classId) {
            const cls = TF2_CLASSES.find(c => c.id === classId);
            hint.innerHTML = `
                <span class="hint-icon">📈</span>
                <span class="hint-text">${cls.name}: Alta demanda en armas ${slotId === 'melee' ? 'melee' : 'de fuego'}</span>
            `;
        } else {
            hint.innerHTML = `
                <span class="hint-icon">💡</span>
                <span class="hint-text">Selecciona clase y arma para ver demanda específica</span>
            `;
        }
    }
    
    updateProfitCalculator();
}

function setProfitSource(source) {
    profitSource = source;
    
    document.querySelectorAll('.profit-source-toggle .toggle-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.source === source);
    });
    
    updateProfitCalculator();
}

function getPriceFromSource(itemKey) {
    if (profitSource === 'steam_market') {
        const steamPrices = JSON.parse(localStorage.getItem('tf2_steam_market_prices') || '{}');
        const price = steamPrices[itemKey];
        return (price !== null && price !== undefined) ? price : null;
    } else {
        const communityPricesData = JSON.parse(localStorage.getItem('tf2_community_prices') || '{}');
        const price = communityPricesData[itemKey];
        return (price !== null && price !== undefined) ? price : null;
    }
}

function calculateCraftingCost(kitType) {
    let totalCost = 0;
    const breakdown = [];
    let hasCustomPrices = false;
    
    const storageKey = profitSource === 'steam_market' ? 'tf2_steam_market_prices' : 'tf2_community_prices';
    const savedPrices = JSON.parse(localStorage.getItem(storageKey) || '{}');
    
    const getAveragePartPrice = (partIds, defaultPrice) => {
        let total = 0;
        let count = 0;
        partIds.forEach(id => {
            if (savedPrices[id] !== null && savedPrices[id] !== undefined) {
                total += parseFloat(savedPrices[id]);
                count++;
                hasCustomPrices = true;
            }
        });
        return count > 0 ? total / count : defaultPrice;
    };
    
    if (kitType === 'specialized') {
        const ksKitPrice = 0.55;
        breakdown.push({ name: 'Unique KS Kit', qty: 1, price: ksKitPrice, estimated: true });
        totalCost += ksKitPrice;
        
        const reinforcedParts = ['bomb_stabilizer', 'emotion_detector', 'humor_suppression'];
        const reinforcedPrice = getAveragePartPrice(reinforcedParts, 0.05);
        breakdown.push({ 
            name: 'Reinforced Parts (x6)', 
            qty: 6, 
            price: reinforcedPrice * 6,
            estimated: !hasCustomPrices
        });
        totalCost += reinforcedPrice * 6;
        
    } else {
        const specKitPrice = 8.0;
        breakdown.push({ name: 'Specialized KS Kit', qty: 1, price: specKitPrice, estimated: true });
        totalCost += specKitPrice;
        
        const fabPrice = 0.55;
        breakdown.push({ name: 'Kit Fabricators (x4)', qty: 4, price: fabPrice * 4, estimated: true });
        totalCost += fabPrice * 4;
        
        const battleWornParts = ['kb_808', 'money_furnace', 'taunt_processor'];
        const bwPrice = getAveragePartPrice(battleWornParts, 0.22);
        breakdown.push({ 
            name: 'Battle-Worn Parts (x2)', 
            qty: 2, 
            price: bwPrice * 2,
            estimated: !hasCustomPrices 
        });
        totalCost += bwPrice * 2;
        
        const pristineParts = ['brainstorm_bulb', 'currency_digester'];
        const pristinePrice = getAveragePartPrice(pristineParts, 0.33);
        breakdown.push({ 
            name: 'Pristine Parts (x1)', 
            qty: 1, 
            price: pristinePrice,
            estimated: !hasCustomPrices
        });
        totalCost += pristinePrice;
    }
    
    return { totalCost, breakdown, hasCustomPrices };
}

function updateProfitCalculator() {
    const kitType = document.getElementById('profitKitType')?.value || 'specialized';
    const sheenId = document.getElementById('profitSheen')?.value;
    const killstreakerId = document.getElementById('profitKillstreaker')?.value;
    
    const ksGroup = document.getElementById('profitKsGroup');
    if (ksGroup) {
        ksGroup.style.display = kitType === 'professional' ? 'block' : 'none';
    }
    
    const comboTier = kitType === 'professional' 
        ? calculateComboTier(sheenId, killstreakerId)
        : calculateComboTier(sheenId);
    
    if (!comboTier) return;
    
    const previewContainer = document.getElementById('resultComboPreview');
    if (previewContainer) {
        const sheen = SHEENS.find(s => s.id === sheenId);
        const ks = KILLSTREAKERS.find(k => k.id === killstreakerId);
        
        const sheenImage = sheen?.image || sheen?.imageRed || '';
        
        let previewHTML = `
            <div class="combo-preview-item">
                <img src="${sheenImage}" alt="${sheen?.name}" class="preview-img" style="border-color: ${sheen?.color}">
                <span style="color: ${sheen?.color}">${sheen?.name}</span>
            </div>
        `;
        
        if (sheen?.id === 'team_shine' && sheen?.imageBlu) {
            previewHTML = `
                <div class="combo-preview-item team-shine-duo">
                    <div class="team-shine-images">
                        <img src="${sheen.imageRed}" alt="${sheen.name} RED" class="preview-img" style="border-color: ${sheen.color}" title="RED">
                        <img src="${sheen.imageBlu}" alt="${sheen.name} BLU" class="preview-img" style="border-color: ${sheen.colorBlu}" title="BLU">
                    </div>
                    <span style="background: linear-gradient(90deg, ${sheen.color}, ${sheen.colorBlu}); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${sheen.name}</span>
                </div>
            `;
        }
        
        if (kitType === 'professional' && ks) {
            previewHTML += `
                <span class="combo-plus">+</span>
                <div class="combo-preview-item">
                    <img src="${ks?.image}" alt="${ks?.name}" class="preview-img">
                    <span>${ks?.name}</span>
                </div>
            `;
        }
        
        previewContainer.innerHTML = previewHTML;
    }
    
    const tierBadge = document.getElementById('resultTierBadge');
    if (tierBadge) {
        const tierConfig = COMBO_TIERS[comboTier.tier];
        tierBadge.innerHTML = `
            <span class="tier-icon" style="color: ${tierConfig.color}">${tierConfig.icon}</span>
            <span class="tier-label" style="color: ${tierConfig.color}">${tierConfig.label}</span>
        `;
    }
    
    const { totalCost, breakdown, hasCustomPrices } = calculateCraftingCost(kitType);
    
    const oldWrapper = document.querySelector('.breakdown-section.costs .source-wrapper');
    if (oldWrapper) oldWrapper.remove();
    
    const costBreakdown = document.getElementById('profitCostBreakdown');
    if (costBreakdown) {
        costBreakdown.innerHTML = breakdown.map(item => `
            <div class="breakdown-item ${item.estimated ? 'estimated' : 'custom'}" title="${item.estimated ? 'Precio estimado' : 'Precio personalizado'}">
                <span class="item-name">${item.name} ${item.estimated ? '~' : '✓'}</span>
                <span class="item-price">${item.price.toFixed(2)} Ref</span>
            </div>
        `).join('');
        
        const sourceIndicator = hasCustomPrices 
            ? `<div class="source-indicator custom">✓ Usando precios de ${profitSource === 'steam_market' ? 'Steam Market' : 'Backpack.tf'}</div>`
            : `<div class="source-indicator estimated">~ Precios estimados</div>`;
        costBreakdown.insertAdjacentHTML('afterend', `<div class="source-wrapper">${sourceIndicator}</div>`);
    }
    
    const totalCostEl = document.getElementById('profitTotalCost');
    if (totalCostEl) {
        const localCost = refToLocal(totalCost);
        totalCostEl.innerHTML = `${totalCost.toFixed(2)} Ref <span class="local-price">(${formatLocalCurrency(localCost)})</span>`;
    }
    
    const premiumPercent = Math.round((comboTier.totalMultiplier - 1) * 100);
    const basePrice = totalCost;
    const premiumValue = basePrice * (comboTier.totalMultiplier - 1);
    const suggestedPrice = basePrice * comboTier.totalMultiplier;
    
    const basePriceEl = document.getElementById('profitBasePrice');
    if (basePriceEl) basePriceEl.textContent = `${basePrice.toFixed(2)} Ref`;
    
    const premiumPercentEl = document.getElementById('profitPremiumPercent');
    if (premiumPercentEl) premiumPercentEl.textContent = premiumPercent > 0 ? `+${premiumPercent}` : premiumPercent;
    
    const premiumValueEl = document.getElementById('profitPremiumValue');
    if (premiumValueEl) premiumValueEl.textContent = `${premiumValue >= 0 ? '+' : ''}${premiumValue.toFixed(2)} Ref`;
    
    const suggestedPriceEl = document.getElementById('profitSuggestedPrice');
    if (suggestedPriceEl) {
        const localSuggested = refToLocal(suggestedPrice);
        suggestedPriceEl.innerHTML = `${suggestedPrice.toFixed(2)} Ref <span class="local-price">(${formatLocalCurrency(localSuggested)})</span>`;
    }
    
    const gain = suggestedPrice - totalCost;
    const roi = totalCost > 0 ? (gain / totalCost) * 100 : 0;
    const keyValue = parseFloat(document.getElementById('keyValue')?.value) || 56;
    const gainInKeys = gain / keyValue;
    const gainLocal = refToLocal(gain);
    
    const roiEl = document.getElementById('profitROI');
    if (roiEl) {
        roiEl.textContent = `${roi >= 0 ? '+' : ''}${roi.toFixed(1)}%`;
        roiEl.className = `roi-value ${roi >= 30 ? 'excellent' : roi >= 15 ? 'good' : roi >= 0 ? 'neutral' : 'negative'}`;
    }
    
    const gainEl = document.getElementById('profitGain');
    if (gainEl) {
        gainEl.innerHTML = `${gain >= 0 ? '+' : ''}${gain.toFixed(2)} Ref`;
        gainEl.className = `detail-value ${gain >= 0 ? 'positive' : 'negative'}`;
    }
    
    const gainKeysEl = document.getElementById('profitGainKeys');
    if (gainKeysEl) {
        gainKeysEl.textContent = `${gainInKeys >= 0 ? '+' : ''}${gainInKeys.toFixed(2)} Keys`;
    }
    
    const gainLocalEl = document.getElementById('profitGainLocal');
    if (gainLocalEl) {
        gainLocalEl.innerHTML = `${gain >= 0 ? '+' : ''}${formatLocalCurrency(gainLocal)}`;
        gainLocalEl.className = `detail-value ${gain >= 0 ? 'positive' : 'negative'}`;
    }
    
    const sellTimeEl = document.getElementById('profitSellTime');
    if (sellTimeEl) {
        const sheenData = SHEEN_DEMAND[sheenId];
        const sellSpeed = kitType === 'professional' && killstreakerId
            ? (sheenData.sellSpeed === 'fast' && KILLSTREAKER_DEMAND[killstreakerId]?.sellSpeed === 'fast' ? 'fast' : 
               sheenData.sellSpeed === 'slow' || KILLSTREAKER_DEMAND[killstreakerId]?.sellSpeed === 'slow' ? 'slow' : 'medium')
            : sheenData.sellSpeed;
        
        const sellTimeText = sellSpeed === 'fast' ? '🚀 1-3 días' : 
                            sellSpeed === 'medium' ? '📅 1-2 semanas' : '🐌 2+ semanas';
        sellTimeEl.textContent = sellTimeText;
    }
    
    const roiCard = document.getElementById('profitROICard');
    if (roiCard) {
        roiCard.className = `profit-roi-card ${roi >= 30 ? 'excellent' : roi >= 15 ? 'good' : roi >= 0 ? 'neutral' : 'negative'}`;
    }
}

// ============================================
// EXPORTACIONES GLOBALES
// ============================================

window.initCalculator = initCalculator;
window.calculateTotalValue = calculateTotalValue;
window.initProfitCalculator = initProfitCalculator;
window.updateProfitCalculator = updateProfitCalculator;
window.updateProfitWeapons = updateProfitWeapons;
window.setProfitSource = setProfitSource;

// Nota: Las funciones de favoritos ahora están en valuation.js
// populateFavoriteSelects, updateFavoriteWeapons, addPersonalFavorite, 
// removeFavorite, renderFavoritesList

console.log('calculator.js cargado');

