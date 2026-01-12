/**
 * TF2 MANN CO. FORGE - MOCHILA (BACKPACK)
 * Funciones de gestión del inventario
 */

// ============================================
// INICIALIZACIÓN
// ============================================

function initBackpack() {
    loadRealEconomy();
    initRealEconomySection();
    renderCurrencyGrid();
    renderPartsGrid();
    renderCompletedKits();
    initFilters();
}

// ============================================
// GRID DE CURRENCY (METAL Y KEYS)
// ============================================

function renderCurrencyGrid() {
    const grid = document.getElementById('currencyGrid');
    if (!grid) return;
    
    const currency = appState.inventory.currency;
    const keyValue = appState.settings.keyValue || 56;
    
    // Definir items de currency con sus propiedades
    const currencyItems = [
        {
            id: 'scrap',
            name: 'Scrap Metal',
            icon: '🔩',
            image: 'https://stntrading.eu/img/4stu_NyqGxkK_KA_vyt4XpYP2f4RS8h6D4RY1OBpsFE/aHR0cHM6Ly9zdGVhbWNvbW11bml0eS1hLmFrYW1haWhkLm5ldC9lY29ub215L2ltYWdlL2ZXRmM4MmpzMGZtb1JBUC1xT0lQdTVUSFNXcWZTbVRFTExxY1V5d0draWpWalpVTFVyc20xai05eGdFYlpRc1VZaFRraHpKV2hzUFpBZk9lRC1WT240cGh0c2RRMzJadHhGWW9ON1BrWW1WbUlnZWFVS05hWF9SanB3eThVSE16NnBjeEFJZm5vdlVXSjF0OW5ZRnFZdw.webp',
            value: currency.scrap,
            color: '#8b7355',
            hint: '1 Scrap = 1/9 Ref'
        },
        {
            id: 'reclaimed',
            name: 'Reclaimed Metal',
            icon: '⚙️',
            image: 'https://stntrading.eu/img/ot1dssgtMUNTv_eij02aDJUKW3G6Jm7zm-ahlNqQ3wA/aHR0cHM6Ly9zdGVhbWNvbW11bml0eS1hLmFrYW1haWhkLm5ldC9lY29ub215L2ltYWdlL2ZXRmM4MmpzMGZtb1JBUC1xT0lQdTVUSFNXcWZTbVRFTExxY1V5d0draWpWalpVTFVyc20xai05eGdFYlpRc1VZaFRraHpKV2hzTzBNdjZOR3VjRjFZSmxzY01FZ0RkdnhWWXNNTFBrTW1GakkxT1NVdk1IRFBCcDlsdTBDblZsdVpReEE5R3dwLWhJT1ZLNHNNTU5XRjQ.webp',
            value: currency.reclaimed,
            color: '#a0a0a0',
            hint: '1 Rec = 3 Scrap = 1/3 Ref'
        },
        {
            id: 'refined',
            name: 'Refined Metal',
            icon: '🪙',
            image: 'https://stntrading.eu/img/ILIsUnuALeEj1hpA9H5Nn4efBlrUSoHfq4onvg3s040/aHR0cHM6Ly9zdGVhbWNvbW11bml0eS1hLmFrYW1haWhkLm5ldC9lY29ub215L2ltYWdlL2ZXRmM4MmpzMGZtb1JBUC1xT0lQdTVUSFNXcWZTbVRFTExxY1V5d0draWpWalpVTFVyc20xai05eGdFYlpRc1VZaFRraHpKV2hzTzFNdjZOR3VjRjFZZ3p0OFpRaWpKdWtGTWlNcmJoWURFd0kxeVJWS05mRDZ4b3JRM3FXM0pyNjU0NkROUHVvdTlJT1ZLNHA0a1dKYUE.webp',
            value: currency.refined,
            color: '#daa520',
            hint: '1 Ref = 9 Scrap'
        },
        {
            id: 'keys',
            name: 'Mann Co. Key',
            icon: '🔑',
            image: 'https://wiki.teamfortress.com/w/images/8/83/Backpack_Mann_Co._Supply_Crate_Key.png',
            value: currency.keys,
            color: '#ffd700',
            hint: `1 Key ≈ ${keyValue} Ref`
        }
    ];
    
    grid.innerHTML = currencyItems.map(item => `
        <div class="stock-item currency-item has-image" data-currency="${item.id}">
            <div class="stock-header">
                <span class="stock-name">${item.name}</span>
            </div>
            <div class="stock-body">
                <div class="stock-icon with-img">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <div class="stock-controls">
                    <button class="stock-btn minus" onclick="updateCurrency('${item.id}', -1)">−</button>
                    <input type="number" class="stock-input" id="currency-${item.id}" 
                           value="${item.value}" min="0" step="1"
                           onchange="setCurrency('${item.id}', this.value)">
                    <button class="stock-btn plus" onclick="updateCurrency('${item.id}', 1)">+</button>
                </div>
            </div>
            <div class="stock-footer">
                <span class="stock-hint">${item.hint}</span>
            </div>
        </div>
    `).join('');
    
    // Añadir resumen de valor total
    const totalInRef = calculateTotalCurrencyInRef();
    const totalInKeys = totalInRef / keyValue;
    
    grid.innerHTML += `
        <div class="currency-summary">
            <div class="summary-header">
                <span class="summary-icon">💰</span>
                <span class="summary-title">Total en Moneda</span>
            </div>
            <div class="summary-values">
                <div class="summary-value">
                    <span class="value-amount">${totalInRef.toFixed(2)}</span>
                    <span class="value-label">Ref</span>
                </div>
                <div class="summary-value">
                    <span class="value-amount">${totalInKeys.toFixed(2)}</span>
                    <span class="value-label">Keys</span>
                </div>
            </div>
        </div>
    `;
    
    // Actualizar displays del dashboard también
    updateCurrencyDisplay();
}

function calculateTotalCurrencyInRef() {
    const currency = appState.inventory.currency;
    const keyValue = appState.settings.keyValue || 56;
    
    const scrapInRef = currency.scrap / 9;
    const recInRef = currency.reclaimed / 3;
    const refValue = currency.refined;
    const keysInRef = currency.keys * keyValue;
    
    return scrapInRef + recInRef + refValue + keysInRef;
}

function updateCurrencyDisplay() {
    const currency = appState.inventory.currency;
    
    // Dashboard elements
    const dashScrap = document.getElementById('dash-scrap');
    const dashRec = document.getElementById('dash-rec');
    const dashRef = document.getElementById('dash-ref');
    const dashKeys = document.getElementById('dash-keys');
    
    if (dashScrap) dashScrap.textContent = currency.scrap;
    if (dashRec) dashRec.textContent = currency.reclaimed;
    if (dashRef) dashRef.textContent = currency.refined;
    if (dashKeys) dashKeys.textContent = currency.keys;
    
    // Update inputs in currency grid
    const scrapInput = document.getElementById('currency-scrap');
    const recInput = document.getElementById('currency-reclaimed');
    const refInput = document.getElementById('currency-refined');
    const keysInput = document.getElementById('currency-keys');
    
    if (scrapInput) scrapInput.value = currency.scrap;
    if (recInput) recInput.value = currency.reclaimed;
    if (refInput) refInput.value = currency.refined;
    if (keysInput) keysInput.value = currency.keys;
}

function setCurrency(type, value) {
    const numValue = parseInt(value) || 0;
    if (!appState.inventory.currency.hasOwnProperty(type)) return;
    
    appState.inventory.currency[type] = Math.max(0, numValue);
    
    saveToStorage();
    renderCurrencyGrid();
    calculateTotalValue();
}

// ============================================
// GRID DE PARTES DE ROBOT
// ============================================

function renderPartsGrid() {
    const grid = document.getElementById('partsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    ROBOT_PARTS.forEach(part => {
        const count = appState.inventory.parts[part.id] || 0;
        const communityPrice = communityPrices[part.id];
        const categoryConfig = PART_CATEGORY_CONFIG[part.category];
        
        // Nombre corto sin prefijo de categoría
        const shortName = part.name
            .replace('Pristine Robot ', '')
            .replace('Reinforced Robot ', '')
            .replace('Battle-Worn Robot ', '');
        
        const div = document.createElement('div');
        div.className = 'stock-item parts-item has-image';
        div.innerHTML = `
            <div class="stock-header">
                <span class="stock-name">${shortName}</span>
            </div>
            <div class="stock-body">
                <div class="stock-icon with-img">
                    <img src="${part.image}" alt="${part.name}" loading="lazy">
                </div>
                <div class="stock-controls">
                    <button class="stock-btn minus" onclick="updatePartCount('${part.id}', -1)">−</button>
                    <span class="stock-count">${count}</span>
                    <button class="stock-btn plus" onclick="updatePartCount('${part.id}', 1)">+</button>
                </div>
            </div>
            <div class="stock-footer">
                <span class="stock-category" style="color: ${categoryConfig.color}">${categoryConfig.label}</span>
                ${communityPrice ? `<span class="part-price">${communityPrice.toFixed(2)} Ref</span>` : ''}
            </div>
        `;
        
        grid.appendChild(div);
    });
}

// ============================================
// ACTUALIZAR CANTIDAD DE PARTES
// ============================================

function updatePartCount(partId, delta) {
    if (!appState.inventory.parts.hasOwnProperty(partId)) {
        appState.inventory.parts[partId] = 0;
    }
    
    const newCount = Math.max(0, appState.inventory.parts[partId] + delta);
    appState.inventory.parts[partId] = newCount;
    
    saveToStorage();
    renderPartsGrid();
    renderDashboardPartsGrid();
    renderProjectsList();
    calculateTotalValue();
}

// ============================================
// ACTUALIZAR CURRENCY
// ============================================

function updateCurrency(type, delta) {
    if (!appState.inventory.currency.hasOwnProperty(type)) return;
    
    const newCount = Math.max(0, appState.inventory.currency[type] + delta);
    appState.inventory.currency[type] = newCount;
    
    saveToStorage();
    updateCurrencyDisplay();
    calculateTotalValue();
}

// ============================================
// ECONOMÍA REAL
// ============================================

function initRealEconomySection() {
    populateCurrencySelect();
    loadRealEconomyValues();
    updateAllConversions();
    updateStoreConversions();
    updateBestOptions();
    updateProfitabilityAnalysis();
}

function populateCurrencySelect() {
    const select = document.getElementById('localCurrencySelect');
    if (!select) return;
    
    select.innerHTML = '';
    
    WORLD_CURRENCIES.forEach(currency => {
        const option = document.createElement('option');
        option.value = currency.code;
        option.textContent = `${currency.flag} ${currency.code} - ${currency.name}`;
        if (currency.code === realEconomy.localCurrency) {
            option.selected = true;
        }
        select.appendChild(option);
    });
}

function loadRealEconomyValues() {
    const localToUsdInput = document.getElementById('localToUsdRate');
    const steamWalletInput = document.getElementById('steamWalletInput');
    const mannCoKeyInput = document.getElementById('mannCoKeyPrice');
    
    if (localToUsdInput) localToUsdInput.value = realEconomy.localToUsd;
    if (steamWalletInput) steamWalletInput.value = realEconomy.steamWallet;
    if (mannCoKeyInput) mannCoKeyInput.value = realEconomy.mannCoKeyPrice;
    
    // Cargar precios de tiendas
    Object.keys(realEconomy.storeKeyPrices).forEach(storeId => {
        const store = realEconomy.storeKeyPrices[storeId];
        const buyInput = document.getElementById(`${storeId}_buy`);
        const sellInput = document.getElementById(`${storeId}_sell`);
        
        if (buyInput && store.buy !== null) buyInput.value = store.buy;
        if (sellInput && store.sell !== null) sellInput.value = store.sell;
    });
    
    updateCurrencyLabels();
}

function updateCurrencyLabels() {
    const currency = getLocalCurrency();
    
    document.querySelectorAll('.local-currency-code').forEach(el => {
        el.textContent = currency.code;
    });
    
    document.querySelectorAll('.local-currency-symbol').forEach(el => {
        el.textContent = currency.symbol;
    });
    
    const codeSpan = document.getElementById('localCurrencyCode');
    if (codeSpan) codeSpan.textContent = currency.code;
}

// ============================================
// FUNCIONES DE CONVERSIÓN Y ECONOMÍA REAL
// ============================================

function updateSteamWallet() {
    const input = document.getElementById('steamWalletInput');
    if (!input) return;
    
    realEconomy.steamWallet = parseFloat(input.value) || 0;
    updateAllConversions();
    saveRealEconomy();
}

function updateAllKeyPrices() {
    const mannCoInput = document.getElementById('mannCoKeyPrice');
    
    if (mannCoInput) {
        realEconomy.mannCoKeyPrice = parseFloat(mannCoInput.value) || 47.49;
    }
    
    updateAllConversions();
    updateStoreConversions();
    updateBestOptions();
    updateProfitabilityAnalysis();
    saveRealEconomy();
}

function updateStoreKeyPrice(storeId, type, value) {
    const numValue = parseFloat(value);
    
    if (!realEconomy.storeKeyPrices[storeId]) return;
    
    if (type === 'buy') {
        realEconomy.storeKeyPrices[storeId].buy = isNaN(numValue) ? null : numValue;
    } else if (type === 'sell') {
        realEconomy.storeKeyPrices[storeId].sell = isNaN(numValue) ? null : numValue;
    }
    
    // Actualizar el valor de referencia para settings (usar scrap_tf como base)
    if (storeId === 'scrap_tf' && type === 'buy') {
        appState.settings.keyValue = numValue || 56;
    }
    
    updateStoreConversions();
    updateBestOptions();
    updateProfitabilityAnalysis();
    saveRealEconomy();
    saveToStorage();
}

function updateLocalCurrency() {
    const select = document.getElementById('localCurrencySelect');
    if (!select) return;
    
    realEconomy.localCurrency = select.value;
    updateCurrencyLabels();
    updateAllConversions();
    updateStoreConversions();
    updateBestOptions();
    updateProfitabilityAnalysis();
    saveRealEconomy();
}

function updateExchangeRate() {
    const input = document.getElementById('localToUsdRate');
    if (!input) return;
    
    realEconomy.localToUsd = parseFloat(input.value) || 0.049;
    updateAllConversions();
    updateStoreConversions();
    updateBestOptions();
    updateProfitabilityAnalysis();
    saveRealEconomy();
}

function updateAllConversions() {
    const currency = getLocalCurrency();
    
    // Cartera de Steam
    const walletInUsd = document.getElementById('walletInUsd');
    const walletInRef = document.getElementById('walletInRef');
    const walletInKeys = document.getElementById('walletInKeys');
    
    if (walletInUsd) {
        const usd = localToUsd(realEconomy.steamWallet);
        walletInUsd.textContent = formatUsdCurrency(usd);
    }
    
    if (walletInRef) {
        const ref = localToRef(realEconomy.steamWallet);
        walletInRef.textContent = `${ref.toFixed(2)} Ref`;
    }
    
    if (walletInKeys) {
        const keys = realEconomy.mannCoKeyPrice > 0 
            ? realEconomy.steamWallet / realEconomy.mannCoKeyPrice 
            : 0;
        walletInKeys.textContent = `${keys.toFixed(2)} Keys`;
    }
    
    // Mann Co. Store conversions
    const mannCoKeyUsd = document.getElementById('mannCoKeyUsd');
    const mannCoKeyRef = document.getElementById('mannCoKeyRef');
    
    if (mannCoKeyUsd) {
        const usd = localToUsd(realEconomy.mannCoKeyPrice);
        mannCoKeyUsd.textContent = formatUsdCurrency(usd);
    }
    
    if (mannCoKeyRef) {
        const ref = localToRef(realEconomy.mannCoKeyPrice);
        mannCoKeyRef.textContent = `${ref.toFixed(2)} Ref`;
    }
}

// Convertir precio de tienda a moneda local
function storeKeyPriceToLocal(storeId, priceType) {
    const store = realEconomy.storeKeyPrices[storeId];
    if (!store) return null;
    
    const price = store[priceType];
    if (price === null || price === undefined) return null;
    
    switch (store.currency) {
        case 'ref':
            return refToLocal(price);
        case 'usd':
            return usdToLocal(price);
        case 'local':
            return price;
        default:
            return price;
    }
}

// Convertir precio de tienda a Ref
function storeKeyPriceToRef(storeId, priceType) {
    const store = realEconomy.storeKeyPrices[storeId];
    if (!store) return null;
    
    const price = store[priceType];
    if (price === null || price === undefined) return null;
    
    switch (store.currency) {
        case 'ref':
            return price;
        case 'usd':
            // USD -> Local -> Ref
            const localFromUsd = usdToLocal(price);
            return localToRef(localFromUsd);
        case 'local':
            return localToRef(price);
        default:
            return price;
    }
}

function updateStoreConversions() {
    const currency = getLocalCurrency();
    
    Object.keys(realEconomy.storeKeyPrices).forEach(storeId => {
        const container = document.getElementById(`${storeId}_converted`);
        if (!container) return;
        
        const store = realEconomy.storeKeyPrices[storeId];
        const buyLocal = storeKeyPriceToLocal(storeId, 'buy');
        const sellLocal = storeKeyPriceToLocal(storeId, 'sell');
        const buyRef = storeKeyPriceToRef(storeId, 'buy');
        const sellRef = storeKeyPriceToRef(storeId, 'sell');
        
        let html = '<div class="converted-prices">';
        
        if (store.currency === 'ref') {
            if (buyLocal !== null) {
                const buyUsd = localToUsd(buyLocal);
                html += `
                    <div class="conv-row">
                        <span class="conv-type">Compra:</span>
                        <span class="conv-values">${currency.symbol}${buyLocal.toFixed(2)} ${currency.code} | ${formatUsdCurrency(buyUsd)}</span>
                    </div>
                `;
            }
            if (sellLocal !== null) {
                const sellUsd = localToUsd(sellLocal);
                html += `
                    <div class="conv-row">
                        <span class="conv-type">Venta:</span>
                        <span class="conv-values">${currency.symbol}${sellLocal.toFixed(2)} ${currency.code} | ${formatUsdCurrency(sellUsd)}</span>
                    </div>
                `;
            }
        } else if (store.currency === 'usd') {
            if (buyRef !== null && buyLocal !== null) {
                html += `
                    <div class="conv-row">
                        <span class="conv-type">Compra:</span>
                        <span class="conv-values">${buyRef.toFixed(2)} Ref | ${currency.symbol}${buyLocal.toFixed(2)} ${currency.code}</span>
                    </div>
                `;
            }
            if (sellRef !== null && sellLocal !== null) {
                html += `
                    <div class="conv-row">
                        <span class="conv-type">Venta:</span>
                        <span class="conv-values">${sellRef.toFixed(2)} Ref | ${currency.symbol}${sellLocal.toFixed(2)} ${currency.code}</span>
                    </div>
                `;
            }
        } else if (store.currency === 'local') {
            if (buyRef !== null) {
                const buyUsd = localToUsd(store.buy);
                html += `
                    <div class="conv-row">
                        <span class="conv-type">Compra:</span>
                        <span class="conv-values">${buyRef.toFixed(2)} Ref | ${formatUsdCurrency(buyUsd)}</span>
                    </div>
                `;
            }
        }
        
        html += '</div>';
        container.innerHTML = html;
    });
}

function updateBestOptions() {
    const currency = getLocalCurrency();
    
    // Calcular mejor opción para COMPRAR
    const buyOptions = [];
    
    // Mann Co. Store
    buyOptions.push({
        name: 'Mann Co. Store',
        emoji: '🏪',
        priceLocal: realEconomy.mannCoKeyPrice,
        priceRef: localToRef(realEconomy.mannCoKeyPrice),
        currency: 'local'
    });
    
    // Tiendas de comunidad
    Object.keys(realEconomy.storeKeyPrices).forEach(storeId => {
        const store = realEconomy.storeKeyPrices[storeId];
        if (store.buy === null) return;
        
        const storeInfo = typeof MARKET_STORES !== 'undefined' ? MARKET_STORES.find(s => s.id === storeId) : null;
        const priceLocal = storeKeyPriceToLocal(storeId, 'buy');
        const priceRef = storeKeyPriceToRef(storeId, 'buy');
        
        if (priceLocal !== null) {
            buyOptions.push({
                name: storeInfo?.name || storeId,
                emoji: storeId === 'backpack_tf' ? '👥' : '🤖',
                priceLocal,
                priceRef,
                originalPrice: store.buy,
                originalCurrency: store.currency
            });
        }
    });
    
    // Ordenar por precio local (menor primero)
    buyOptions.sort((a, b) => a.priceLocal - b.priceLocal);
    
    // Calcular mejor opción para VENDER
    const sellOptions = [];
    
    Object.keys(realEconomy.storeKeyPrices).forEach(storeId => {
        const store = realEconomy.storeKeyPrices[storeId];
        if (store.sell === null) return;
        
        const storeInfo = typeof MARKET_STORES !== 'undefined' ? MARKET_STORES.find(s => s.id === storeId) : null;
        const priceLocal = storeKeyPriceToLocal(storeId, 'sell');
        const priceRef = storeKeyPriceToRef(storeId, 'sell');
        
        if (priceLocal !== null) {
            sellOptions.push({
                name: storeInfo?.name || storeId,
                emoji: storeId === 'backpack_tf' ? '👥' : '🤖',
                priceLocal,
                priceRef,
                originalPrice: store.sell,
                originalCurrency: store.currency
            });
        }
    });
    
    // Ordenar por precio local (mayor primero para venta)
    sellOptions.sort((a, b) => b.priceLocal - a.priceLocal);
    
    // Renderizar mejor opción de compra
    const bestBuyDiv = document.getElementById('bestBuyOption');
    if (bestBuyDiv && buyOptions.length > 0) {
        const best = buyOptions[0];
        const worst = buyOptions[buyOptions.length - 1];
        const savings = worst.priceLocal - best.priceLocal;
        
        bestBuyDiv.innerHTML = `
            <div class="best-option-result">
                <div class="best-winner">
                    <span class="winner-emoji">${best.emoji}</span>
                    <div class="winner-info">
                        <strong>${best.name}</strong>
                        <span class="winner-price">${currency.symbol}${best.priceLocal.toFixed(2)} ${currency.code}</span>
                        <span class="winner-ref">(${best.priceRef.toFixed(2)} Ref)</span>
                    </div>
                </div>
                ${savings > 0 ? `
                    <div class="savings-info">
                        <span class="savings-label">Ahorras vs peor opción:</span>
                        <span class="savings-amount">${currency.symbol}${savings.toFixed(2)}</span>
                    </div>
                ` : ''}
                <div class="all-options">
                    <span class="options-label">Todas las opciones (de mejor a peor):</span>
                    ${buyOptions.map((opt, i) => `
                        <div class="option-row ${i === 0 ? 'best' : ''}">
                            <span class="opt-rank">#${i + 1}</span>
                            <span class="opt-name">${opt.emoji} ${opt.name}</span>
                            <span class="opt-price">${currency.symbol}${opt.priceLocal.toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Renderizar mejor opción de venta
    const bestSellDiv = document.getElementById('bestSellOption');
    if (bestSellDiv) {
        if (sellOptions.length > 0) {
            const best = sellOptions[0];
            const worst = sellOptions[sellOptions.length - 1];
            const extraEarnings = best.priceLocal - worst.priceLocal;
            
            bestSellDiv.innerHTML = `
                <div class="best-option-result">
                    <div class="best-winner sell">
                        <span class="winner-emoji">${best.emoji}</span>
                        <div class="winner-info">
                            <strong>${best.name}</strong>
                            <span class="winner-price">${currency.symbol}${best.priceLocal.toFixed(2)} ${currency.code}</span>
                            <span class="winner-ref">(${best.priceRef.toFixed(2)} Ref)</span>
                        </div>
                    </div>
                    ${extraEarnings > 0 ? `
                        <div class="savings-info sell">
                            <span class="savings-label">Ganas extra vs peor opción:</span>
                            <span class="savings-amount">${currency.symbol}${extraEarnings.toFixed(2)}</span>
                        </div>
                    ` : ''}
                    <div class="all-options">
                        <span class="options-label">Todas las opciones (de mejor a peor):</span>
                        ${sellOptions.map((opt, i) => `
                            <div class="option-row ${i === 0 ? 'best' : ''}">
                                <span class="opt-rank">#${i + 1}</span>
                                <span class="opt-name">${opt.emoji} ${opt.name}</span>
                                <span class="opt-price">${currency.symbol}${opt.priceLocal.toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } else {
            bestSellDiv.innerHTML = `
                <div class="no-options">
                    <span>⚠️</span>
                    <p>No hay opciones de venta disponibles</p>
                </div>
            `;
        }
    }
}

function updateProfitabilityAnalysis() {
    const currency = getLocalCurrency();
    const analysisDiv = document.getElementById('profitabilityAnalysis');
    if (!analysisDiv) return;
    
    // Encontrar mejor compra y mejor venta
    let bestBuyPrice = realEconomy.mannCoKeyPrice;
    let bestBuyStore = 'Mann Co. Store';
    
    let bestSellPrice = 0;
    let bestSellStore = 'N/A';
    
    Object.keys(realEconomy.storeKeyPrices).forEach(storeId => {
        const store = realEconomy.storeKeyPrices[storeId];
        const storeInfo = typeof MARKET_STORES !== 'undefined' ? MARKET_STORES.find(s => s.id === storeId) : null;
        
        // Mejor compra
        if (store.buy !== null) {
            const buyLocal = storeKeyPriceToLocal(storeId, 'buy');
            if (buyLocal < bestBuyPrice) {
                bestBuyPrice = buyLocal;
                bestBuyStore = storeInfo?.name || storeId;
            }
        }
        
        // Mejor venta
        if (store.sell !== null) {
            const sellLocal = storeKeyPriceToLocal(storeId, 'sell');
            if (sellLocal > bestSellPrice) {
                bestSellPrice = sellLocal;
                bestSellStore = storeInfo?.name || storeId;
            }
        }
    });
    
    const profit = bestSellPrice - bestBuyPrice;
    const profitPercent = bestBuyPrice > 0 ? (profit / bestBuyPrice * 100) : 0;
    
    let profitClass = '';
    let profitAdvice = '';
    
    if (profit > 0) {
        profitClass = 'profitable';
        profitAdvice = `
            <div class="profit-advice positive">
                <span class="advice-icon">✅</span>
                <div class="advice-text">
                    <strong>¡Es rentable comprar y vender Keys!</strong>
                    <p>Compra en <strong>${bestBuyStore}</strong> a ${currency.symbol}${bestBuyPrice.toFixed(2)}</p>
                    <p>Vende en <strong>${bestSellStore}</strong> a ${currency.symbol}${bestSellPrice.toFixed(2)}</p>
                    <p class="profit-detail">Ganancia: ${currency.symbol}${profit.toFixed(2)} por Key (${profitPercent.toFixed(1)}%)</p>
                </div>
            </div>
        `;
    } else if (profit === 0) {
        profitClass = 'neutral';
        profitAdvice = `
            <div class="profit-advice neutral">
                <span class="advice-icon">⚖️</span>
                <div class="advice-text">
                    <strong>Sin ganancia ni pérdida</strong>
                    <p>El precio de compra y venta son iguales</p>
                </div>
            </div>
        `;
    } else {
        profitClass = 'loss';
        profitAdvice = `
            <div class="profit-advice negative">
                <span class="advice-icon">⚠️</span>
                <div class="advice-text">
                    <strong>No es rentable comprar y vender Keys</strong>
                    <p>Perderías ${currency.symbol}${Math.abs(profit).toFixed(2)} por Key</p>
                    <p class="loss-detail">Solo compra Keys si los necesitas para tradear</p>
                </div>
            </div>
        `;
    }
    
    // Info de cartera
    let walletInfo = '';
    if (realEconomy.steamWallet > 0) {
        const keysAffordable = Math.floor(realEconomy.steamWallet / realEconomy.mannCoKeyPrice);
        
        if (profit > 0 && keysAffordable > 0) {
            const potentialProfit = keysAffordable * profit;
            walletInfo = `
                <div class="wallet-profit-info">
                    <span class="wallet-icon">💳</span>
                    <div class="wallet-text">
                        <strong>Con tu cartera de Steam (${currency.symbol}${realEconomy.steamWallet.toFixed(2)}):</strong>
                        <p>Podrías comprar <strong>${keysAffordable} Keys</strong> en Mann Co.</p>
                        <p>Y ganar hasta <strong>${currency.symbol}${potentialProfit.toFixed(2)}</strong> vendiéndolas</p>
                    </div>
                </div>
            `;
        }
    }
    
    analysisDiv.innerHTML = `
        <div class="profitability-content ${profitClass}">
            ${profitAdvice}
            ${walletInfo}
        </div>
    `;
}

// ============================================
// FILTROS
// ============================================

function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn[data-filter]');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            // Actualizar botones activos
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filtrar secciones
            const partsSection = document.querySelector('[data-category="parts"]');
            const currencySection = document.querySelector('[data-category="currency"]');
            const realMoneySection = document.querySelector('[data-category="real-money"]');
            const kitsSection = document.querySelector('[data-category="kits"]');
            
            // Ocultar todo primero
            [partsSection, currencySection, realMoneySection, kitsSection].forEach(section => {
                if (section) section.classList.add('hidden');
            });
            
            // Mostrar según filtro
            if (filter === 'all') {
                [partsSection, currencySection, realMoneySection, kitsSection].forEach(section => {
                    if (section) section.classList.remove('hidden');
                });
            } else {
                const targetSection = document.querySelector(`[data-category="${filter}"]`);
                if (targetSection) targetSection.classList.remove('hidden');
            }
        });
    });
}

// ============================================
// EXPORTACIONES GLOBALES
// ============================================

window.initBackpack = initBackpack;
window.renderCurrencyGrid = renderCurrencyGrid;
window.updateCurrencyDisplay = updateCurrencyDisplay;
window.calculateTotalCurrencyInRef = calculateTotalCurrencyInRef;
window.setCurrency = setCurrency;
window.renderPartsGrid = renderPartsGrid;
window.updatePartCount = updatePartCount;
window.updateCurrency = updateCurrency;
window.initRealEconomySection = initRealEconomySection;
window.populateCurrencySelect = populateCurrencySelect;
window.loadRealEconomyValues = loadRealEconomyValues;
window.updateCurrencyLabels = updateCurrencyLabels;
window.updateSteamWallet = updateSteamWallet;
window.updateAllKeyPrices = updateAllKeyPrices;
window.updateStoreKeyPrice = updateStoreKeyPrice;
window.updateLocalCurrency = updateLocalCurrency;
window.updateExchangeRate = updateExchangeRate;
window.updateAllConversions = updateAllConversions;
window.updateStoreConversions = updateStoreConversions;
window.updateBestOptions = updateBestOptions;
window.updateProfitabilityAnalysis = updateProfitabilityAnalysis;
window.storeKeyPriceToLocal = storeKeyPriceToLocal;
window.storeKeyPriceToRef = storeKeyPriceToRef;
window.initFilters = initFilters;

console.log('🎒 backpack.js cargado');
