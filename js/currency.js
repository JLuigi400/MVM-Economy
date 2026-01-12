/**
 * TF2 MANN CO. FORGE - CONVERSIÓN DE MONEDAS
 * Funciones para convertir entre diferentes monedas
 */

// ============================================
// OBTENER INFORMACIÓN DE MONEDA
// ============================================

function getLocalCurrency() {
    return WORLD_CURRENCIES.find(c => c.code === realEconomy.localCurrency) || WORLD_CURRENCIES[0];
}

// ============================================
// CONVERSIONES
// ============================================

/**
 * Convertir de moneda local a USD
 */
function localToUsd(amount) {
    return amount * realEconomy.localToUsd;
}

/**
 * Convertir de USD a moneda local
 */
function usdToLocal(amount) {
    return realEconomy.localToUsd > 0 ? amount / realEconomy.localToUsd : 0;
}

/**
 * Convertir Ref a moneda local
 * Usa el precio de compra de Scrap.TF como referencia
 */
function refToLocal(refAmount) {
    const refPerKey = realEconomy.storeKeyPrices?.scrap_tf?.buy || 56;
    const keyPriceLocal = realEconomy.mannCoKeyPrice || 47.49;
    return (refAmount / refPerKey) * keyPriceLocal;
}

/**
 * Convertir moneda local a Ref
 */
function localToRef(localAmount) {
    const refPerKey = realEconomy.storeKeyPrices?.scrap_tf?.buy || 56;
    const keyPriceLocal = realEconomy.mannCoKeyPrice || 47.49;
    return keyPriceLocal > 0 ? (localAmount / keyPriceLocal) * refPerKey : 0;
}

/**
 * Convertir Ref a USD
 */
function refToUsd(refAmount) {
    return refAmount * CURRENCY_CONVERSION.refToUsd;
}

/**
 * Convertir USD a Ref
 */
function usdToRef(usdAmount) {
    return usdAmount * CURRENCY_CONVERSION.usdToRef;
}

/**
 * Convertir Keys a Ref
 */
function keysToRef(keys) {
    return keys * (appState.settings.keyValue || 56);
}

/**
 * Convertir Ref a Keys
 */
function refToKeys(ref) {
    const keyValue = appState.settings.keyValue || 56;
    return keyValue > 0 ? ref / keyValue : 0;
}

// ============================================
// FORMATEO
// ============================================

/**
 * Formatear precio en moneda local
 */
function formatLocalCurrency(amount) {
    const currency = getLocalCurrency();
    return `${currency.symbol}${amount.toFixed(2)} ${currency.code}`;
}

/**
 * Formatear precio en USD
 */
function formatUsdCurrency(amount) {
    return `$${amount.toFixed(2)} USD`;
}

/**
 * Formatear precio en Ref
 */
function formatRef(amount) {
    return `${amount.toFixed(2)} Ref`;
}

/**
 * Formatear precio en Keys
 */
function formatKeys(amount) {
    return `${amount.toFixed(2)} Keys`;
}

/**
 * Formatear precio completo (Ref + moneda local)
 */
function formatFullPrice(refAmount) {
    const localAmount = refToLocal(refAmount);
    return `${formatRef(refAmount)} (${formatLocalCurrency(localAmount)})`;
}

// ============================================
// CÁLCULOS DE VALOR TOTAL
// ============================================

/**
 * Calcular valor total del inventario en Ref
 */
function calculateInventoryValue() {
    const settings = appState.settings;
    const currency = appState.inventory.currency;
    
    let total = 0;
    
    // Metal
    total += currency.scrap * settings.scrapValue;
    total += currency.reclaimed * settings.recValue;
    total += currency.refined * settings.refValue;
    
    // Keys
    total += currency.keys * settings.keyValue;
    
    // Partes (usando precios de comunidad o estimados)
    Object.keys(appState.inventory.parts).forEach(partId => {
        const count = appState.inventory.parts[partId];
        if (count > 0) {
            const price = communityPrices[partId] || getEstimatedPartPrice(partId);
            total += count * price;
        }
    });
    
    return total;
}

/**
 * Obtener precio estimado de una parte
 */
function getEstimatedPartPrice(partId) {
    const prices = MARKET_PRICES[partId];
    if (!prices) return 0;
    
    // Usar precio de Scrap.TF como referencia
    if (prices.scrap_tf) return prices.scrap_tf;
    
    // O usar promedio de backpack.tf
    if (prices.backpack_tf) {
        if (typeof prices.backpack_tf === 'object') {
            return (prices.backpack_tf.min + prices.backpack_tf.max) / 2;
        }
        return prices.backpack_tf;
    }
    
    return 0;
}

/**
 * Calcular valor total y actualizar UI
 */
function calculateTotalValue() {
    const totalRef = calculateInventoryValue();
    const totalLocal = refToLocal(totalRef);
    
    const totalValueEl = document.getElementById('totalValue');
    if (totalValueEl) {
        totalValueEl.textContent = `${totalRef.toFixed(2)} Ref`;
        totalValueEl.title = formatLocalCurrency(totalLocal);
    }
    
    return totalRef;
}

// ============================================
// EXPORTACIONES GLOBALES
// ============================================

window.getLocalCurrency = getLocalCurrency;
window.localToUsd = localToUsd;
window.usdToLocal = usdToLocal;
window.refToLocal = refToLocal;
window.localToRef = localToRef;
window.refToUsd = refToUsd;
window.usdToRef = usdToRef;
window.keysToRef = keysToRef;
window.refToKeys = refToKeys;
window.formatLocalCurrency = formatLocalCurrency;
window.formatUsdCurrency = formatUsdCurrency;
window.formatRef = formatRef;
window.formatKeys = formatKeys;
window.calculateInventoryValue = calculateInventoryValue;
window.getEstimatedPartPrice = getEstimatedPartPrice;
window.calculateTotalValue = calculateTotalValue;

console.log('💱 currency.js cargado');
