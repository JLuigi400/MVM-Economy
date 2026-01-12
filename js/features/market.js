// ============================================
// MERCADO - Precios y Comparación de Tiendas
// ============================================

// Nota: currentPriceModal está declarado en state.js

// ============================================
// INICIALIZACIÓN
// ============================================

function initMarket() {
    loadCommunityPrices();
    loadSteamMarketPrices();
    renderStoresLegend();
    renderMarketTable();
    renderMarketProjects();
    initConversionInputs();
    updatePriceSourceStatuses();
}

// ============================================
// TIENDAS
// ============================================

function renderStoresLegend() {
    const container = document.getElementById('storesLegend');
    if (!container) return;
    
    container.innerHTML = '';
    
    MARKET_STORES.forEach(store => {
        const storeCard = document.createElement('div');
        storeCard.className = `store-card ${store.type}`;
        storeCard.innerHTML = `
            <div class="store-header">
                <span class="store-name">${store.name}</span>
                <span class="store-type ${store.type}">${store.type === 'bot' ? '🤖 Bot' : store.type === 'community' ? '👥 Comunidad' : '🏪 Market'}</span>
            </div>
            <div class="store-info">
                <span class="store-currency">Moneda: <strong>${store.currencySymbol}</strong></span>
                <span class="store-reliability ${store.reliability}">
                    ${store.reliability === 'high' ? '✓ Estable' : '⚡ Variable'}
                </span>
            </div>
            <p class="store-note">${store.note}</p>
            <a href="${store.url}" target="_blank" class="store-link">Visitar →</a>
        `;
        container.appendChild(storeCard);
    });
}

// ============================================
// TABLA DE PRECIOS
// ============================================

function renderMarketTable() {
    const tbody = document.getElementById('marketTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const categories = ['pristine', 'reinforced', 'battle-worn'];
    
    categories.forEach(category => {
        const categoryParts = ROBOT_PARTS.filter(p => p.category === category);
        const categoryConfig = PART_CATEGORY_CONFIG[category];
        
        const categoryRow = document.createElement('tr');
        categoryRow.className = 'category-row';
        categoryRow.innerHTML = `
            <td colspan="7" class="category-header" style="border-left: 4px solid ${categoryConfig.color}">
                <span class="category-dot" style="background: ${categoryConfig.color}"></span>
                ${categoryConfig.label}
            </td>
        `;
        tbody.appendChild(categoryRow);
        
        categoryParts.forEach(part => {
            const prices = MARKET_PRICES[part.id] || {};
            const row = createMarketRow(part, prices, categoryConfig);
            tbody.appendChild(row);
        });
    });
}

function createMarketRow(part, prices, categoryConfig) {
    const row = document.createElement('tr');
    row.className = 'part-row';
    
    const shortName = part.name
        .replace('Pristine Robot ', '')
        .replace('Reinforced Robot ', '')
        .replace('Battle-Worn Robot ', '');
    
    const communityData = getCommunityPrice(part.id);
    const steamData = getSteamMarketPrice(part.id);
    
    const pricesInRef = {
        scrap_tf: prices.scrap_tf || null,
        backpack_tf: communityData.price,
        stn_trading: prices.stn_trading || null,
        tradeit_gg: prices.tradeit_gg ? convertToRef(prices.tradeit_gg, 'usd') : null,
        steam_market: steamData.price ? convertToRef(steamData.price, 'mxn') : null
    };
    
    const validPrices = Object.entries(pricesInRef).filter(([_, v]) => v !== null);
    const bestPrice = validPrices.length > 0 ? validPrices.reduce((min, curr) => curr[1] < min[1] ? curr : min) : null;
    
    const bptfPriceDisplay = communityData.isCustom 
        ? `<span class="price custom">✓ ${communityData.price.toFixed(2)} Ref</span>`
        : (communityData.range 
            ? `<span class="price range">${communityData.range.min.toFixed(2)} ~ ${communityData.range.max.toFixed(2)} Ref</span>`
            : formatPrice(communityData.price, 'ref'));
    
    const steamPriceDisplay = steamData.isCustom 
        ? `<span class="price custom">✓ $${steamData.price.toFixed(2)} MXN</span>`
        : formatPrice(steamData.price, 'mxn');
    
    row.innerHTML = `
        <td class="part-cell">
            <img src="${part.image}" alt="${shortName}" class="part-thumb">
            <span class="part-name-cell" style="color: ${categoryConfig.color}">${shortName}</span>
        </td>
        <td class="price-cell ${bestPrice && bestPrice[0] === 'scrap_tf' ? 'best' : ''}">
            ${formatPrice(prices.scrap_tf, 'ref')}
        </td>
        <td class="price-cell ${bestPrice && bestPrice[0] === 'backpack_tf' ? 'best' : ''} ${communityData.isCustom ? 'custom-price' : ''}">
            ${bptfPriceDisplay}
        </td>
        <td class="price-cell ${bestPrice && bestPrice[0] === 'stn_trading' ? 'best' : ''}">
            ${formatPrice(prices.stn_trading, 'ref')}
        </td>
        <td class="price-cell ${bestPrice && bestPrice[0] === 'tradeit_gg' ? 'best' : ''}">
            ${formatPrice(prices.tradeit_gg, 'usd')}
        </td>
        <td class="price-cell ${bestPrice && bestPrice[0] === 'steam_market' ? 'best' : ''} ${steamData.isCustom ? 'custom-price' : ''}">
            ${steamPriceDisplay}
        </td>
        <td class="best-cell">
            ${bestPrice ? `
                <span class="best-store">${getStoreName(bestPrice[0])}</span>
                <span class="best-price">${bestPrice[1].toFixed(2)} Ref</span>
            ` : '<span class="na">N/A</span>'}
        </td>
    `;
    
    return row;
}

function formatPrice(price, currency) {
    if (price === null || price === undefined) {
        return '<span class="na">N/A</span>';
    }
    
    const symbols = { ref: '', usd: '$', mxn: '$' };
    const suffix = currency === 'ref' ? ' Ref' : (currency === 'mxn' ? ' MXN' : ' USD');
    
    return `<span class="price">${symbols[currency]}${price.toFixed(2)}${suffix}</span>`;
}

function formatPriceRange(price, currency) {
    if (price === null || price === undefined) {
        return '<span class="na">N/A</span>';
    }
    
    if (typeof price === 'object' && price.min !== undefined) {
        return `<span class="price range">${price.min.toFixed(2)} ~ ${price.max.toFixed(2)} Ref</span>`;
    }
    
    return formatPrice(price, currency);
}

// ============================================
// PRECIOS DE COMUNIDAD
// ============================================

function getCommunityPrice(partId) {
    if (communityPrices[partId] !== null) {
        return {
            price: communityPrices[partId],
            isCustom: true
        };
    }
    
    const marketPrice = MARKET_PRICES[partId]?.backpack_tf;
    if (typeof marketPrice === 'object') {
        return {
            price: (marketPrice.min + marketPrice.max) / 2,
            isCustom: false,
            range: marketPrice
        };
    }
    
    return {
        price: marketPrice || 0,
        isCustom: false
    };
}

function getSteamMarketPrice(partId) {
    if (steamMarketPrices[partId] !== null && steamMarketPrices[partId] !== undefined) {
        return {
            price: steamMarketPrices[partId],
            isCustom: true
        };
    }
    
    const marketPrice = MARKET_PRICES[partId]?.steam_market;
    
    return {
        price: marketPrice || null,
        isCustom: false
    };
}

function saveAllCommunityPrices() {
    const inputs = document.querySelectorAll('.cp-input');
    let updated = 0;
    
    inputs.forEach(input => {
        const partId = input.dataset.partId;
        const value = input.value.trim();
        
        if (value !== '' && !isNaN(parseFloat(value))) {
            communityPrices[partId] = parseFloat(value);
            updated++;
        } else {
            communityPrices[partId] = null;
        }
    });
    
    saveCommunityPrices();
    renderMarketTable();
    renderMarketProjects();
    updateCommunityStatus();
    
    showToast(`${updated} precios de comunidad guardados`, 'success');
}

function resetCommunityPrices() {
    ROBOT_PARTS.forEach(part => {
        communityPrices[part.id] = null;
    });
    
    saveCommunityPrices();
    renderMarketTable();
    renderMarketProjects();
    updateCommunityStatus();
    
    showToast('Precios reseteados a estimados', 'success');
}

function updateCommunityStatus() {
    const statusEl = document.getElementById('communityStatus');
    if (!statusEl) return;
    
    const customCount = Object.values(communityPrices).filter(v => v !== null).length;
    const totalParts = ROBOT_PARTS.length;
    
    if (customCount === 0) {
        statusEl.innerHTML = `
            <span class="status-icon">ℹ️</span>
            <span class="status-text">Usando precios estimados de Backpack.tf para todos los cálculos</span>
        `;
        statusEl.className = 'community-status default';
    } else if (customCount === totalParts) {
        statusEl.innerHTML = `
            <span class="status-icon">✅</span>
            <span class="status-text">Todos los precios personalizados (${customCount}/${totalParts}) - Cálculos precisos</span>
        `;
        statusEl.className = 'community-status complete';
    } else {
        statusEl.innerHTML = `
            <span class="status-icon">⚡</span>
            <span class="status-text">${customCount}/${totalParts} precios personalizados - Resto usando estimados</span>
        `;
        statusEl.className = 'community-status partial';
    }
}

// ============================================
// MODAL DE PRECIOS
// ============================================

function openPriceModal(source) {
    currentPriceModal = source;
    const overlay = document.getElementById('priceModalOverlay');
    const icon = document.getElementById('priceModalIcon');
    const title = document.getElementById('priceModalTitle');
    const hint = document.getElementById('priceModalHint');
    const openBtn = document.getElementById('btnModalOpen');
    
    if (source === 'backpack_tf') {
        icon.textContent = '👥';
        title.textContent = 'Precios de Backpack.TF';
        hint.textContent = 'Ingresa los precios actuales que ves en Backpack.tf (en Refined Metal)';
        openBtn.href = 'https://backpack.tf/stats/Unique/Pristine%20Robot%20Brainstorm%20Bulb/Tradable/Craftable';
    } else {
        icon.textContent = '🎮';
        const currencyCode = realEconomy?.localCurrency || 'MXN';
        title.textContent = 'Precios de Steam Market';
        hint.textContent = `Ingresa los precios actuales del Mercado de Steam (en ${currencyCode})`;
        openBtn.href = 'https://steamcommunity.com/market/search?appid=440&q=robot';
    }
    
    renderPriceModalBody(source);
    overlay.classList.add('active');
}

function closePriceModal(event) {
    if (event && event.target !== event.currentTarget) return;
    const overlay = document.getElementById('priceModalOverlay');
    overlay.classList.remove('active');
    currentPriceModal = null;
}

function renderPriceModalBody(source) {
    const container = document.getElementById('priceModalBody');
    if (!container) return;
    
    container.innerHTML = '';
    const currencySymbol = source === 'backpack_tf' ? 'Ref' : (realEconomy?.localCurrency || 'MXN');
    const pricesData = source === 'backpack_tf' ? communityPrices : steamMarketPrices;
    
    const categories = ['pristine', 'reinforced', 'battle-worn'];
    
    categories.forEach(category => {
        const categoryParts = ROBOT_PARTS.filter(p => p.category === category);
        const categoryConfig = PART_CATEGORY_CONFIG[category];
        
        categoryParts.forEach(part => {
            const currentValue = pricesData[part.id];
            const hasValue = currentValue !== null && currentValue !== undefined;
            
            let estimatedText = '';
            if (source === 'backpack_tf') {
                const marketPrices = MARKET_PRICES[part.id]?.backpack_tf;
                estimatedText = typeof marketPrices === 'object' 
                    ? `Est: ${marketPrices.min}-${marketPrices.max} Ref`
                    : `Est: ${marketPrices || '?'} Ref`;
            } else {
                const marketPrices = MARKET_PRICES[part.id]?.steam_market;
                estimatedText = marketPrices ? `Est: $${marketPrices}` : 'Sin estimado';
            }
            
            const shortName = part.name
                .replace('Pristine Robot ', '')
                .replace('Reinforced Robot ', '')
                .replace('Battle-Worn Robot ', '');
            
            const item = document.createElement('div');
            item.className = `modal-price-item ${category} ${hasValue ? 'has-value' : ''}`;
            item.innerHTML = `
                <img src="${part.image}" alt="${shortName}" class="modal-item-img">
                <div class="modal-item-info">
                    <div class="modal-item-name" style="color: ${categoryConfig.color}">${shortName}</div>
                    <div class="modal-item-estimated">${estimatedText}</div>
                </div>
                <div class="modal-item-status ${hasValue ? 'custom' : ''}">
                    ${hasValue ? '✓ Personalizado' : '○ Estimado'}
                </div>
                <input 
                    type="number" 
                    class="modal-item-input"
                    data-part-id="${part.id}"
                    data-source="${source}"
                    value="${hasValue ? currentValue : ''}"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                >
            `;
            container.appendChild(item);
        });
    });
}

function saveModalPrices() {
    if (!currentPriceModal) return;
    
    const inputs = document.querySelectorAll('.modal-item-input');
    let updated = 0;
    const pricesData = currentPriceModal === 'backpack_tf' ? communityPrices : steamMarketPrices;
    
    inputs.forEach(input => {
        const partId = input.dataset.partId;
        const value = input.value.trim();
        
        if (value !== '' && !isNaN(parseFloat(value))) {
            pricesData[partId] = parseFloat(value);
            updated++;
        } else {
            pricesData[partId] = null;
        }
    });
    
    if (currentPriceModal === 'backpack_tf') {
        saveCommunityPrices();
    } else {
        saveSteamMarketPrices();
    }
    
    renderPriceModalBody(currentPriceModal);
    updatePriceSourceStatuses();
    renderMarketTable();
    renderMarketProjects();
    
    const sourceName = currentPriceModal === 'backpack_tf' ? 'Backpack.tf' : 'Steam Market';
    showToast(`${updated} precios de ${sourceName} guardados`, 'success');
}

function resetModalPrices() {
    if (!currentPriceModal) return;
    
    const pricesData = currentPriceModal === 'backpack_tf' ? communityPrices : steamMarketPrices;
    
    ROBOT_PARTS.forEach(part => {
        pricesData[part.id] = null;
    });
    
    if (currentPriceModal === 'backpack_tf') {
        saveCommunityPrices();
    } else {
        saveSteamMarketPrices();
    }
    
    renderPriceModalBody(currentPriceModal);
    updatePriceSourceStatuses();
    renderMarketTable();
    renderMarketProjects();
    
    const sourceName = currentPriceModal === 'backpack_tf' ? 'Backpack.tf' : 'Steam Market';
    showToast(`Precios de ${sourceName} reseteados`, 'success');
}

function updatePriceSourceStatuses() {
    const bptfStatus = document.getElementById('bptfStatus');
    if (bptfStatus) {
        const bptfCount = Object.values(communityPrices).filter(v => v !== null).length;
        const countEl = bptfStatus.querySelector('.status-count');
        if (countEl) countEl.textContent = `${bptfCount}/8`;
        bptfStatus.classList.toggle('complete', bptfCount === 8);
    }
    
    const steamStatus = document.getElementById('steamStatus');
    if (steamStatus) {
        const steamCount = Object.values(steamMarketPrices).filter(v => v !== null).length;
        const countEl = steamStatus.querySelector('.status-count');
        if (countEl) countEl.textContent = `${steamCount}/8`;
        steamStatus.classList.toggle('complete', steamCount === 8);
    }
    
    const globalStatus = document.getElementById('pricesGlobalStatus');
    if (globalStatus) {
        const totalCustom = Object.values(communityPrices).filter(v => v !== null).length +
                           Object.values(steamMarketPrices).filter(v => v !== null).length;
        
        if (totalCustom === 0) {
            globalStatus.innerHTML = `
                <span class="status-icon">ℹ️</span>
                <span class="status-text">Usando precios estimados. Haz clic en una fuente para personalizar.</span>
            `;
            globalStatus.className = 'prices-global-status';
        } else if (totalCustom === 16) {
            globalStatus.innerHTML = `
                <span class="status-icon">✅</span>
                <span class="status-text">Todos los precios personalizados (16/16) - Cálculos precisos</span>
            `;
            globalStatus.className = 'prices-global-status all-custom';
        } else {
            globalStatus.innerHTML = `
                <span class="status-icon">⚡</span>
                <span class="status-text">${totalCustom}/16 precios personalizados - Resto usando estimados</span>
            `;
            globalStatus.className = 'prices-global-status has-custom';
        }
    }
    
    const localCurrencySpans = document.querySelectorAll('.local-currency-code');
    localCurrencySpans.forEach(span => {
        span.textContent = realEconomy?.localCurrency || 'MXN';
    });
}

// ============================================
// CONVERSIÓN Y HELPERS
// ============================================

function convertToRef(price, fromCurrency) {
    if (price === null) return null;
    
    const convUsdToRef = parseFloat(document.getElementById('convUsdToRef')?.value) || CURRENCY_CONVERSION.usdToRef;
    const convUsdToMxn = parseFloat(document.getElementById('convUsdToMxn')?.value) || CURRENCY_CONVERSION.usdToMxn;
    
    if (fromCurrency === 'usd') {
        return price * convUsdToRef;
    } else if (fromCurrency === 'mxn') {
        const usdPrice = price / convUsdToMxn;
        return usdPrice * convUsdToRef;
    }
    
    return price;
}

function getStoreName(storeId) {
    const store = MARKET_STORES.find(s => s.id === storeId);
    return store ? store.name : storeId;
}

function initConversionInputs() {
    const inputs = ['convKeyToRef', 'convUsdToRef', 'convUsdToMxn'];
    
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('change', () => {
                renderMarketTable();
            });
        }
    });
}

// ============================================
// CÁLCULO DE COSTOS DE MERCADO
// ============================================

function calculateMarketCost() {
    const kitType = document.getElementById('marketKitType').value;
    const kitInfo = CRAFTING_REQUIREMENTS[kitType];
    const resultsContainer = document.getElementById('costResults');
    const costGrid = document.getElementById('costGrid');
    const recommendation = document.getElementById('costRecommendation');
    
    if (!costGrid || !resultsContainer) return;
    
    resultsContainer.style.display = 'block';
    costGrid.innerHTML = '';
    
    const storeCosts = {};
    
    MARKET_STORES.forEach(store => {
        let totalCost = 0;
        let canBuy = true;
        let missingParts = [];
        
        const breakdown = kitInfo.partsBreakdown;
        
        if (breakdown.pristine > 0) {
            const pristineParts = ROBOT_PARTS.filter(p => p.category === 'pristine');
            const avgPristineCost = calculateAvgPartCost(pristineParts, store.id);
            
            if (avgPristineCost === null) {
                canBuy = false;
                missingParts.push('Pristine');
            } else {
                totalCost += avgPristineCost * breakdown.pristine;
            }
        }
        
        if (breakdown.reinforced > 0) {
            const reinforcedParts = ROBOT_PARTS.filter(p => p.category === 'reinforced');
            const avgReinforcedCost = calculateAvgPartCost(reinforcedParts, store.id);
            
            if (avgReinforcedCost === null) {
                canBuy = false;
                missingParts.push('Reinforced');
            } else {
                totalCost += avgReinforcedCost * breakdown.reinforced;
            }
        }
        
        if (breakdown['battle-worn'] > 0) {
            const battleWornParts = ROBOT_PARTS.filter(p => p.category === 'battle-worn');
            const avgBattleWornCost = calculateAvgPartCost(battleWornParts, store.id);
            
            if (avgBattleWornCost === null) {
                canBuy = false;
                missingParts.push('Battle-Worn');
            } else {
                totalCost += avgBattleWornCost * breakdown['battle-worn'];
            }
        }
        
        let costInRef = totalCost;
        if (store.currency === 'usd') {
            costInRef = convertToRef(totalCost, 'usd');
        } else if (store.currency === 'mxn') {
            costInRef = convertToRef(totalCost, 'mxn');
        }
        
        storeCosts[store.id] = {
            store: store,
            totalCost: totalCost,
            costInRef: costInRef,
            canBuy: canBuy,
            missingParts: missingParts
        };
    });
    
    const validStores = Object.values(storeCosts).filter(s => s.canBuy);
    const cheapest = validStores.length > 0 
        ? validStores.reduce((min, curr) => curr.costInRef < min.costInRef ? curr : min)
        : null;
    
    Object.values(storeCosts).forEach(cost => {
        const card = document.createElement('div');
        card.className = `cost-card ${cost.canBuy ? '' : 'unavailable'} ${cheapest && cheapest.store.id === cost.store.id ? 'cheapest' : ''}`;
        
        const localCost = refToLocal(cost.costInRef);
        card.innerHTML = `
            <div class="cost-store-name">${cost.store.name}</div>
            ${cost.canBuy ? `
                <div class="cost-value">
                    <span class="cost-original">${cost.store.currencySymbol}${cost.totalCost.toFixed(2)}</span>
                    <span class="cost-ref">≈ ${cost.costInRef.toFixed(2)} Ref</span>
                    <span class="cost-local">${formatLocalCurrency(localCost)}</span>
                </div>
                ${cheapest && cheapest.store.id === cost.store.id ? '<span class="cheapest-badge">💰 Más Barato</span>' : ''}
            ` : `
                <div class="cost-unavailable">
                    <span class="na-icon">⚠️</span>
                    <span>No disponible</span>
                    <span class="missing-info">Faltan: ${cost.missingParts.join(', ')}</span>
                </div>
            `}
        `;
        
        costGrid.appendChild(card);
    });
    
    if (cheapest) {
        const keyValue = parseFloat(document.getElementById('convKeyToRef')?.value) || 56;
        const keysEquiv = cheapest.costInRef / keyValue;
        const cheapestLocal = refToLocal(cheapest.costInRef);
        
        recommendation.innerHTML = `
            <div class="recommendation-box">
                <h5>💡 Recomendación</h5>
                <p>La opción más económica es <strong>${cheapest.store.name}</strong> con un costo de 
                   <strong>${cheapest.costInRef.toFixed(2)} Ref</strong> (≈ ${keysEquiv.toFixed(2)} Keys)</p>
                <p class="recommendation-local">💵 En tu moneda: <strong>${formatLocalCurrency(cheapestLocal)}</strong></p>
                <p class="recommendation-note">${cheapest.store.note}</p>
            </div>
        `;
    } else {
        recommendation.innerHTML = `
            <div class="recommendation-box warning">
                <h5>⚠️ Nota</h5>
                <p>Ninguna tienda tiene todas las piezas necesarias disponibles.</p>
            </div>
        `;
    }
}

function calculateAvgPartCost(parts, storeId) {
    let total = 0;
    let count = 0;
    
    parts.forEach(part => {
        const prices = MARKET_PRICES[part.id];
        if (!prices) return;
        
        let price = prices[storeId];
        if (price === null || price === undefined) return;
        
        if (typeof price === 'object' && price.min !== undefined) {
            price = price.min;
        }
        
        total += price;
        count++;
    });
    
    if (count === 0) return null;
    
    return total / count;
}

// ============================================
// COSTOS POR PROYECTO
// ============================================

function calculateProjectCost(project, storeId = 'scrap_tf') {
    if (!project.partsRequirements) return null;
    
    const store = MARKET_STORES.find(s => s.id === storeId);
    if (!store) return null;
    
    let totalCost = 0;
    let totalMissing = 0;
    const partsCosts = [];
    
    Object.entries(project.partsRequirements).forEach(([partId, required]) => {
        const available = appState.inventory.parts[partId] || 0;
        const missing = Math.max(0, required - available);
        
        if (missing > 0) {
            const prices = MARKET_PRICES[partId];
            let price = null;
            
            if (storeId === 'backpack_tf') {
                const communityData = getCommunityPrice(partId);
                price = communityData.price;
            } else if (prices && prices[storeId] !== null && prices[storeId] !== undefined) {
                price = prices[storeId];
                if (typeof price === 'object' && price.min !== undefined) {
                    price = price.min;
                }
            }
            
            if (price !== null) {
                const cost = price * missing;
                totalCost += cost;
                totalMissing += missing;
                
                const part = ROBOT_PARTS.find(p => p.id === partId);
                partsCosts.push({
                    partId,
                    partName: part?.name || partId,
                    missing,
                    unitPrice: price,
                    totalCost: cost,
                    isCustomPrice: storeId === 'backpack_tf' && communityPrices[partId] !== null
                });
            }
        }
    });
    
    let costInRef = totalCost;
    if (store.currency === 'usd') {
        costInRef = convertToRef(totalCost, 'usd');
    } else if (store.currency === 'mxn') {
        costInRef = convertToRef(totalCost, 'mxn');
    }
    
    return {
        store,
        totalCost,
        costInRef,
        totalMissing,
        partsCosts,
        currency: store.currency,
        currencySymbol: store.currencySymbol
    };
}

function calculateProjectCostAllStores(project) {
    const costs = {};
    
    MARKET_STORES.forEach(store => {
        const cost = calculateProjectCost(project, store.id);
        if (cost) {
            costs[store.id] = cost;
        }
    });
    
    return costs;
}

function showProjectCostModal(projectId) {
    const project = appState.projects.find(p => p.id === projectId);
    if (!project) return;
    
    const costs = calculateProjectCostAllStores(project);
    const keyValue = parseFloat(document.getElementById('convKeyToRef')?.value) || appState.settings.keyValue || 56;
    
    const validCosts = Object.values(costs).filter(c => c.totalMissing > 0);
    const cheapest = validCosts.length > 0 
        ? validCosts.reduce((min, curr) => curr.costInRef < min.costInRef ? curr : min)
        : null;
    
    let modalContent = `
        <div class="cost-modal-content">
            <div class="cost-modal-header">
                <h4>💰 Costo Estimado: ${project.weapon}</h4>
                <span class="cost-modal-type">${project.type === 'specialized' ? 'Specialized' : 'Professional'}</span>
            </div>
    `;
    
    if (validCosts.length === 0) {
        modalContent += `
            <div class="cost-modal-complete">
                <span class="complete-icon">✅</span>
                <p>¡Ya tienes todas las piezas necesarias!</p>
            </div>
        `;
    } else {
        modalContent += `<div class="cost-modal-grid">`;
        
        Object.values(costs).forEach(cost => {
            if (cost.totalMissing === 0) return;
            
            const isCheapest = cheapest && cheapest.store.id === cost.store.id;
            const keysEquiv = cost.costInRef / keyValue;
            
            modalContent += `
                <div class="cost-modal-card ${isCheapest ? 'cheapest' : ''}">
                    <div class="cost-modal-store">${cost.store.name}</div>
                    <div class="cost-modal-price">
                        <span class="price-main">${cost.currencySymbol}${cost.totalCost.toFixed(2)}</span>
                        <span class="price-ref">≈ ${cost.costInRef.toFixed(2)} Ref</span>
                        <span class="price-keys">≈ ${keysEquiv.toFixed(3)} Keys</span>
                    </div>
                    <div class="cost-modal-missing">${cost.totalMissing} piezas faltantes</div>
                    ${isCheapest ? '<span class="cheapest-label">💰 Más Barato</span>' : ''}
                </div>
            `;
        });
        
        modalContent += `</div>`;
        
        modalContent += `
            <div class="cost-modal-actions">
                <button class="btn-add-parts" onclick="showAddPartsModal(${project.id})">
                    📦 Agregar Piezas Faltantes a Mochila
                </button>
            </div>
        `;
    }
    
    modalContent += `</div>`;
    
    showCustomModal('Costo del Proyecto', modalContent);
}

function showAddPartsModal(projectId) {
    const project = appState.projects.find(p => p.id === projectId);
    if (!project) return;
    
    let partsHtml = '<div class="add-parts-list">';
    
    Object.entries(project.partsRequirements).forEach(([partId, required]) => {
        const available = appState.inventory.parts[partId] || 0;
        const missing = Math.max(0, required - available);
        
        if (missing > 0) {
            const part = ROBOT_PARTS.find(p => p.id === partId);
            const shortName = part.name
                .replace('Pristine Robot ', '')
                .replace('Reinforced Robot ', '')
                .replace('Battle-Worn Robot ', '');
            const categoryConfig = PART_CATEGORY_CONFIG[part.category];
            
            partsHtml += `
                <div class="add-part-item">
                    <img src="${part.image}" alt="${shortName}" class="add-part-img">
                    <span class="add-part-name" style="color: ${categoryConfig.color}">${shortName}</span>
                    <span class="add-part-missing">Faltan: ${missing}</span>
                    <button class="btn-add-single" onclick="addPartsToInventory('${partId}', ${missing})">
                        + Agregar ${missing}
                    </button>
                </div>
            `;
        }
    });
    
    partsHtml += '</div>';
    
    partsHtml += `
        <div class="add-parts-actions">
            <button class="btn-add-all" onclick="addAllMissingParts(${project.id})">
                ✅ Agregar Todas las Piezas Faltantes
            </button>
        </div>
    `;
    
    showCustomModal('Agregar Piezas a Mochila', partsHtml);
}

function addPartsToInventory(partId, quantity) {
    appState.inventory.parts[partId] = (appState.inventory.parts[partId] || 0) + quantity;
    saveToStorage();
    updateDashboard();
    renderProjectsList();
    closeCustomModal();
    showToast(`Se agregaron ${quantity} piezas al inventario`, 'success');
}

function addAllMissingParts(projectId) {
    const project = appState.projects.find(p => p.id === projectId);
    if (!project) return;
    
    let totalAdded = 0;
    
    Object.entries(project.partsRequirements).forEach(([partId, required]) => {
        const available = appState.inventory.parts[partId] || 0;
        const missing = Math.max(0, required - available);
        
        if (missing > 0) {
            appState.inventory.parts[partId] = (appState.inventory.parts[partId] || 0) + missing;
            totalAdded += missing;
        }
    });
    
    saveToStorage();
    updateDashboard();
    renderProjectsList();
    closeCustomModal();
    showToast(`Se agregaron ${totalAdded} piezas al inventario`, 'success');
}

// ============================================
// PROYECTOS EN EL MERCADO
// ============================================

function renderMarketProjects() {
    const container = document.getElementById('marketProjectsList');
    if (!container) return;
    
    if (appState.projects.length === 0) {
        container.innerHTML = `
            <div class="empty-projects-market">
                <span>📭</span>
                <p>No hay proyectos activos</p>
                <p class="hint">Crea proyectos en La Forja para ver recomendaciones</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    appState.projects.forEach(project => {
        const costs = calculateProjectCostAllStores(project);
        const scrapTfCost = costs['scrap_tf'];
        const cheapestCost = Object.values(costs)
            .filter(c => c.totalMissing > 0)
            .reduce((min, curr) => !min || curr.costInRef < min.costInRef ? curr : min, null);
        
        const card = document.createElement('div');
        card.className = 'market-project-card';
        
        const keyValue = parseFloat(document.getElementById('convKeyToRef')?.value) || 56;
        
        card.innerHTML = `
            <div class="mp-header">
                <div class="mp-info">
                    <span class="mp-name">${project.weapon}</span>
                    <span class="mp-type ${project.type}">${project.type}</span>
                </div>
                <span class="mp-id">ID: ${project.id}</span>
            </div>
            <div class="mp-sheen" style="border-left: 3px solid ${project.sheen.color}">
                ${project.sheen.name} ${project.killstreaker ? `+ ${project.killstreaker.name}` : ''}
            </div>
            <div class="mp-costs">
                ${scrapTfCost && scrapTfCost.totalMissing > 0 ? `
                    <div class="mp-cost-item">
                        <span class="mp-store">Scrap.TF:</span>
                        <span class="mp-value">${scrapTfCost.costInRef.toFixed(2)} Ref</span>
                    </div>
                ` : ''}
                ${cheapestCost ? `
                    <div class="mp-cost-item best">
                        <span class="mp-store">Mejor (${cheapestCost.store.name}):</span>
                        <span class="mp-value">${cheapestCost.costInRef.toFixed(2)} Ref</span>
                    </div>
                ` : `
                    <div class="mp-cost-item complete">
                        <span>✅ Piezas completas</span>
                    </div>
                `}
            </div>
            <div class="mp-actions">
                <button class="btn-mp-details" onclick="showProjectCostModal(${project.id})">
                    📊 Ver Detalles
                </button>
                <button class="btn-mp-recommend" onclick="showProjectRecommendations(${project.id})">
                    💡 Recomendaciones
                </button>
            </div>
        `;
        
        container.appendChild(card);
    });
}

function showProjectRecommendations(projectId) {
    const project = appState.projects.find(p => p.id === projectId);
    if (!project) return;
    
    let html = '<div class="recommendations-content">';
    html += `<h4>💡 Recomendaciones para: ${project.weapon}</h4>`;
    
    const recommendations = [];
    
    Object.entries(project.partsRequirements).forEach(([partId, required]) => {
        const available = appState.inventory.parts[partId] || 0;
        const missing = Math.max(0, required - available);
        
        if (missing > 0) {
            const part = ROBOT_PARTS.find(p => p.id === partId);
            const prices = MARKET_PRICES[partId];
            
            let bestStore = null;
            let bestPriceRef = Infinity;
            
            MARKET_STORES.forEach(store => {
                if (prices && prices[store.id] !== null && prices[store.id] !== undefined) {
                    let price = prices[store.id];
                    if (typeof price === 'object') price = price.min;
                    
                    let priceInRef = price;
                    if (store.currency === 'usd') priceInRef = convertToRef(price, 'usd');
                    if (store.currency === 'mxn') priceInRef = convertToRef(price, 'mxn');
                    
                    if (priceInRef < bestPriceRef) {
                        bestPriceRef = priceInRef;
                        bestStore = store;
                    }
                }
            });
            
            if (bestStore) {
                recommendations.push({
                    part,
                    missing,
                    bestStore,
                    bestPriceRef,
                    totalCost: bestPriceRef * missing
                });
            }
        }
    });
    
    if (recommendations.length === 0) {
        html += '<p class="all-complete">✅ ¡Ya tienes todas las piezas!</p>';
    } else {
        html += '<div class="recommendations-list">';
        
        recommendations.forEach(rec => {
            const shortName = rec.part.name
                .replace('Pristine Robot ', '')
                .replace('Reinforced Robot ', '')
                .replace('Battle-Worn Robot ', '');
            const categoryConfig = PART_CATEGORY_CONFIG[rec.part.category];
            
            html += `
                <div class="recommendation-item">
                    <img src="${rec.part.image}" alt="${shortName}">
                    <div class="rec-info">
                        <span class="rec-name" style="color: ${categoryConfig.color}">${shortName}</span>
                        <span class="rec-missing">Necesitas: ${rec.missing}</span>
                    </div>
                    <div class="rec-best">
                        <span class="rec-store">Comprar en: ${rec.bestStore.name}</span>
                        <span class="rec-price">${rec.bestPriceRef.toFixed(2)} Ref c/u</span>
                        <span class="rec-total">Total: ${rec.totalCost.toFixed(2)} Ref</span>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        
        const totalCost = recommendations.reduce((sum, r) => sum + r.totalCost, 0);
        const keyValue = parseFloat(document.getElementById('convKeyToRef')?.value) || 56;
        
        html += `
            <div class="recommendations-summary">
                <strong>Costo total optimizado:</strong> ${totalCost.toFixed(2)} Ref (≈ ${(totalCost / keyValue).toFixed(3)} Keys)
            </div>
        `;
    }
    
    html += '</div>';
    
    showCustomModal('Recomendaciones de Compra', html);
}

// ============================================
// EXPORTACIONES GLOBALES
// ============================================

window.initMarket = initMarket;
window.renderMarketTable = renderMarketTable;
window.renderMarketProjects = renderMarketProjects;
window.calculateMarketCost = calculateMarketCost;
window.openPriceModal = openPriceModal;
window.closePriceModal = closePriceModal;
window.saveModalPrices = saveModalPrices;
window.resetModalPrices = resetModalPrices;
window.saveAllCommunityPrices = saveAllCommunityPrices;
window.resetCommunityPrices = resetCommunityPrices;
window.showProjectCostModal = showProjectCostModal;
window.showAddPartsModal = showAddPartsModal;
window.addPartsToInventory = addPartsToInventory;
window.addAllMissingParts = addAllMissingParts;
window.showProjectRecommendations = showProjectRecommendations;
window.getCommunityPrice = getCommunityPrice;
window.getSteamMarketPrice = getSteamMarketPrice;
window.calculateProjectCostAllStores = calculateProjectCostAllStores;
