// ============================================
// MODAL DE POPULARIDAD
// ============================================

// Datos de popularidad de clases
const CLASS_POPULARITY = {
    soldier: { percentage: 18.5, rank: 1, trend: 'stable' },
    scout: { percentage: 15.2, rank: 2, trend: 'up' },
    demoman: { percentage: 14.8, rank: 3, trend: 'stable' },
    heavy: { percentage: 12.3, rank: 4, trend: 'stable' },
    sniper: { percentage: 11.5, rank: 5, trend: 'up' },
    medic: { percentage: 9.8, rank: 6, trend: 'stable' },
    engineer: { percentage: 7.4, rank: 7, trend: 'down' },
    spy: { percentage: 5.8, rank: 8, trend: 'stable' },
    pyro: { percentage: 4.7, rank: 9, trend: 'down' }
};

// Top weapons por clase
const TOP_WEAPONS = {
    soldier: [
        { name: 'Rocket Launcher', slot: 'primary', demand: 'very-high' },
        { name: 'Market Gardener', slot: 'melee', demand: 'very-high' },
        { name: 'Escape Plan', slot: 'melee', demand: 'high' },
        { name: 'Original', slot: 'primary', demand: 'high' },
        { name: 'Direct Hit', slot: 'primary', demand: 'medium' }
    ],
    scout: [
        { name: 'Scattergun', slot: 'primary', demand: 'very-high' },
        { name: 'Force-A-Nature', slot: 'primary', demand: 'high' },
        { name: 'Boston Basher', slot: 'melee', demand: 'high' },
        { name: 'Sandman', slot: 'melee', demand: 'medium' },
        { name: 'Pistol', slot: 'secondary', demand: 'medium' }
    ],
    demoman: [
        { name: 'Stickybomb Launcher', slot: 'secondary', demand: 'very-high' },
        { name: 'Eyelander', slot: 'melee', demand: 'very-high' },
        { name: 'Grenade Launcher', slot: 'primary', demand: 'high' },
        { name: 'Scotsman\'s Skullcutter', slot: 'melee', demand: 'medium' },
        { name: 'Loose Cannon', slot: 'primary', demand: 'medium' }
    ],
    heavy: [
        { name: 'Minigun', slot: 'primary', demand: 'very-high' },
        { name: 'Tomislav', slot: 'primary', demand: 'high' },
        { name: 'Fists of Steel', slot: 'melee', demand: 'high' },
        { name: 'Sandvich', slot: 'secondary', demand: 'medium' },
        { name: 'Gloves of Running Urgently', slot: 'melee', demand: 'medium' }
    ],
    sniper: [
        { name: 'Sniper Rifle', slot: 'primary', demand: 'very-high' },
        { name: 'Huntsman', slot: 'primary', demand: 'very-high' },
        { name: 'AWPer Hand', slot: 'primary', demand: 'high' },
        { name: 'Machina', slot: 'primary', demand: 'high' },
        { name: 'Jarate', slot: 'secondary', demand: 'medium' }
    ],
    medic: [
        { name: 'Medi Gun', slot: 'secondary', demand: 'very-high' },
        { name: 'Ubersaw', slot: 'melee', demand: 'very-high' },
        { name: 'Kritzkrieg', slot: 'secondary', demand: 'high' },
        { name: 'Crusader\'s Crossbow', slot: 'primary', demand: 'high' },
        { name: 'Blutsauger', slot: 'primary', demand: 'medium' }
    ],
    engineer: [
        { name: 'Frontier Justice', slot: 'primary', demand: 'high' },
        { name: 'Rescue Ranger', slot: 'primary', demand: 'high' },
        { name: 'Wrangler', slot: 'secondary', demand: 'medium' },
        { name: 'Gunslinger', slot: 'melee', demand: 'medium' },
        { name: 'Jag', slot: 'melee', demand: 'medium' }
    ],
    spy: [
        { name: 'Knife', slot: 'melee', demand: 'very-high' },
        { name: 'Ambassador', slot: 'primary', demand: 'high' },
        { name: 'Conniver\'s Kunai', slot: 'melee', demand: 'high' },
        { name: 'Your Eternal Reward', slot: 'melee', demand: 'high' },
        { name: 'L\'Etranger', slot: 'primary', demand: 'medium' }
    ],
    pyro: [
        { name: 'Degreaser', slot: 'primary', demand: 'high' },
        { name: 'Flare Gun', slot: 'secondary', demand: 'high' },
        { name: 'Powerjack', slot: 'melee', demand: 'high' },
        { name: 'Axtinguisher', slot: 'melee', demand: 'medium' },
        { name: 'Phlogistinator', slot: 'primary', demand: 'medium' }
    ]
};

// Popularidad de tipos de kit
const KIT_TYPE_POPULARITY = {
    specialized: {
        percentage: 65,
        avgPrice: 8,
        sellTime: '1-2 semanas',
        notes: 'Más accesibles, mayor volumen de ventas'
    },
    professional: {
        percentage: 35,
        avgPrice: 25,
        sellTime: '2-4 semanas',
        notes: 'Mayor margen, menor volumen'
    }
};

let currentPopularityTab = 'classes';

function openPopularityModal() {
    const modal = document.getElementById('popularityModal');
    if (modal) {
        modal.classList.add('active');
        switchPopularityTab('classes');
    }
}

function closePopularityModal() {
    const modal = document.getElementById('popularityModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function switchPopularityTab(tabId) {
    currentPopularityTab = tabId;
    
    document.querySelectorAll('.popularity-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    
    document.querySelectorAll('.popularity-tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `popularityTab-${tabId}`);
    });
    
    switch (tabId) {
        case 'classes':
            renderClassPopularity();
            break;
        case 'weapons':
            renderWeaponPopularity();
            break;
        case 'kits':
            renderKitPopularity();
            break;
    }
}

function renderClassPopularity() {
    const container = document.getElementById('classPopularityGrid');
    if (!container) return;
    
    const sortedClasses = TF2_CLASSES.slice().sort((a, b) => {
        const popA = CLASS_POPULARITY[a.id]?.rank || 99;
        const popB = CLASS_POPULARITY[b.id]?.rank || 99;
        return popA - popB;
    });
    
    container.innerHTML = sortedClasses.map(cls => {
        const pop = CLASS_POPULARITY[cls.id] || { percentage: 0, rank: '?', trend: 'stable' };
        const trendIcon = pop.trend === 'up' ? '📈' : pop.trend === 'down' ? '📉' : '➡️';
        const trendColor = pop.trend === 'up' ? 'var(--success-color)' : pop.trend === 'down' ? 'var(--error-color)' : 'var(--text-secondary)';
        
        return `
            <div class="popularity-class-card" style="border-left-color: ${cls.color}">
                <div class="class-rank">#${pop.rank}</div>
                <div class="class-icon-large" style="color: ${cls.color}">${cls.icon}</div>
                <div class="class-name">${cls.name}</div>
                <div class="class-bar-container">
                    <div class="class-bar" style="width: ${pop.percentage}%; background: ${cls.color}"></div>
                </div>
                <div class="class-stats">
                    <span class="percentage">${pop.percentage.toFixed(1)}%</span>
                    <span class="trend" style="color: ${trendColor}">${trendIcon}</span>
                </div>
            </div>
        `;
    }).join('');
}

function renderWeaponPopularity() {
    const container = document.getElementById('weaponPopularityList');
    const classFilter = document.getElementById('weaponClassFilter');
    if (!container) return;
    
    if (classFilter && classFilter.options.length <= 1) {
        classFilter.innerHTML = '<option value="">Todas las clases</option>';
        TF2_CLASSES.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls.id;
            option.textContent = `${cls.icon} ${cls.name}`;
            classFilter.appendChild(option);
        });
    }
    
    const selectedClass = classFilter?.value || '';
    
    const classesToShow = selectedClass 
        ? [TF2_CLASSES.find(c => c.id === selectedClass)]
        : TF2_CLASSES.slice().sort((a, b) => {
            const popA = CLASS_POPULARITY[a.id]?.rank || 99;
            const popB = CLASS_POPULARITY[b.id]?.rank || 99;
            return popA - popB;
        });
    
    container.innerHTML = classesToShow.map(cls => {
        const weapons = TOP_WEAPONS[cls.id] || [];
        
        return `
            <div class="weapon-class-section">
                <div class="class-header" style="background: ${cls.color}20; border-left: 3px solid ${cls.color}">
                    <span class="class-icon">${cls.icon}</span>
                    <span class="class-name">${cls.name}</span>
                    <span class="class-rank">#${CLASS_POPULARITY[cls.id]?.rank || '?'}</span>
                </div>
                <div class="weapons-list">
                    ${weapons.map((weapon, idx) => {
                        const demandColor = weapon.demand === 'very-high' ? 'var(--tier-god)' :
                                           weapon.demand === 'high' ? 'var(--tier-meta)' :
                                           weapon.demand === 'medium' ? 'var(--tier-popular)' : 'var(--tier-niche)';
                        const demandIcon = weapon.demand === 'very-high' ? '🔥' :
                                          weapon.demand === 'high' ? '⬆️' :
                                          weapon.demand === 'medium' ? '➡️' : '⬇️';
                        const slotIcon = weapon.slot === 'primary' ? '1️⃣' : 
                                        weapon.slot === 'secondary' ? '2️⃣' : '3️⃣';
                        
                        return `
                            <div class="weapon-item ${weapon.demand}">
                                <span class="weapon-rank">${idx + 1}</span>
                                <span class="weapon-slot">${slotIcon}</span>
                                <span class="weapon-name">${weapon.name}</span>
                                <span class="weapon-demand" style="color: ${demandColor}">${demandIcon}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function filterWeaponPopularity() {
    renderWeaponPopularity();
}

function renderKitPopularity() {
    const container = document.getElementById('kitPopularityContent');
    if (!container) return;
    
    container.innerHTML = `
        <div class="kit-popularity-grid">
            <div class="kit-type-card specialized">
                <div class="kit-type-header">
                    <span class="kit-icon">✨</span>
                    <span class="kit-name">Specialized</span>
                </div>
                <div class="kit-stats">
                    <div class="stat-row">
                        <span class="stat-label">Popularidad</span>
                        <span class="stat-value">${KIT_TYPE_POPULARITY.specialized.percentage}%</span>
                    </div>
                    <div class="kit-bar">
                        <div class="kit-bar-fill" style="width: ${KIT_TYPE_POPULARITY.specialized.percentage}%"></div>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Precio promedio</span>
                        <span class="stat-value">${KIT_TYPE_POPULARITY.specialized.avgPrice} Ref</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Tiempo de venta</span>
                        <span class="stat-value">${KIT_TYPE_POPULARITY.specialized.sellTime}</span>
                    </div>
                </div>
                <div class="kit-notes">${KIT_TYPE_POPULARITY.specialized.notes}</div>
            </div>
            
            <div class="kit-type-card professional">
                <div class="kit-type-header">
                    <span class="kit-icon">⚡</span>
                    <span class="kit-name">Professional</span>
                </div>
                <div class="kit-stats">
                    <div class="stat-row">
                        <span class="stat-label">Popularidad</span>
                        <span class="stat-value">${KIT_TYPE_POPULARITY.professional.percentage}%</span>
                    </div>
                    <div class="kit-bar professional">
                        <div class="kit-bar-fill" style="width: ${KIT_TYPE_POPULARITY.professional.percentage}%"></div>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Precio promedio</span>
                        <span class="stat-value">${KIT_TYPE_POPULARITY.professional.avgPrice} Ref</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Tiempo de venta</span>
                        <span class="stat-value">${KIT_TYPE_POPULARITY.professional.sellTime}</span>
                    </div>
                </div>
                <div class="kit-notes">${KIT_TYPE_POPULARITY.professional.notes}</div>
            </div>
        </div>
        
        <div class="sheen-popularity-section">
            <h4>🌈 Popularidad de Sheens</h4>
            <div class="sheen-popularity-grid">
                ${SHEENS.map(sheen => {
                    const demand = SHEEN_DEMAND[sheen.id];
                    const demandPercent = demand.demand === 'very-high' ? 90 :
                                         demand.demand === 'high' ? 70 :
                                         demand.demand === 'medium' ? 50 : 30;
                    return `
                        <div class="sheen-popularity-item">
                            <img src="${sheen.image || sheen.imageRed}" alt="${sheen.name}" 
                                 class="sheen-preview" style="border-color: ${sheen.color}">
                            <div class="sheen-info">
                                <span class="sheen-name" style="color: ${sheen.color}">${sheen.name}</span>
                                <div class="sheen-bar">
                                    <div class="sheen-bar-fill" style="width: ${demandPercent}%; background: ${sheen.color}"></div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
        
        <div class="killstreaker-popularity-section">
            <h4>💀 Popularidad de Killstreakers</h4>
            <div class="killstreaker-popularity-grid">
                ${KILLSTREAKERS.map(ks => {
                    const demand = KILLSTREAKER_DEMAND[ks.id];
                    const demandPercent = demand.demand === 'very-high' ? 90 :
                                         demand.demand === 'high' ? 70 :
                                         demand.demand === 'medium' ? 50 : 30;
                    return `
                        <div class="killstreaker-popularity-item">
                            <img src="${ks.image}" alt="${ks.name}" class="ks-preview">
                            <div class="ks-info">
                                <span class="ks-name">${ks.name}</span>
                                <div class="ks-bar">
                                    <div class="ks-bar-fill" style="width: ${demandPercent}%"></div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// ============================================
// EXPORTACIONES GLOBALES
// ============================================

window.CLASS_POPULARITY = CLASS_POPULARITY;
window.TOP_WEAPONS = TOP_WEAPONS;
window.KIT_TYPE_POPULARITY = KIT_TYPE_POPULARITY;
window.openPopularityModal = openPopularityModal;
window.closePopularityModal = closePopularityModal;
window.switchPopularityTab = switchPopularityTab;
window.filterWeaponPopularity = filterWeaponPopularity;
