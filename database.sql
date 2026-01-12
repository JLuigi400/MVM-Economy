-- ============================================
-- TF2 MANN CO. FORGE - DATABASE SCHEMA
-- Compatible con MySQL / MariaDB / phpMyAdmin
-- ============================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS tf2_mannco_forge
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE tf2_mannco_forge;

-- ============================================
-- TABLA: users (Usuarios)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    steam_id VARCHAR(20) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_username (username),
    INDEX idx_steam_id (steam_id)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: currency_inventory (Metal y Keys)
-- ============================================
CREATE TABLE IF NOT EXISTS currency_inventory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    scrap_metal INT DEFAULT 0,
    reclaimed_metal INT DEFAULT 0,
    refined_metal INT DEFAULT 0,
    mann_co_keys INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_user_currency (user_id)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: robot_parts (Definición de partes)
-- ============================================
CREATE TABLE IF NOT EXISTS robot_parts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    part_key VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    category ENUM('pristine', 'reinforced', 'battle-worn') NOT NULL,
    description TEXT NULL,
    icon_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category)
) ENGINE=InnoDB;

-- Insertar partes de robot predefinidas
INSERT INTO robot_parts (part_key, name, category) VALUES
('currency_digester', 'Pristine Robot Currency Digester', 'pristine'),
('brainstorm_bulb', 'Pristine Robot Brainstorm Bulb', 'pristine'),
('emotion_detector', 'Reinforced Robot Emotion Detector', 'reinforced'),
('humor_suppression', 'Reinforced Robot Humor Suppression Pump', 'reinforced'),
('bomb_stabilizer', 'Reinforced Robot Bomb Stabilizer', 'reinforced'),
('taunt_processor', 'Battle-Worn Robot Taunt Processor', 'battle-worn'),
('kb_808', 'Battle-Worn Robot KB-808', 'battle-worn'),
('money_furnace', 'Battle-Worn Robot Money Furnace', 'battle-worn');

-- ============================================
-- TABLA: parts_inventory (Inventario de partes por usuario)
-- ============================================
CREATE TABLE IF NOT EXISTS parts_inventory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    part_id INT NOT NULL,
    quantity INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (part_id) REFERENCES robot_parts(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_user_part (user_id, part_id)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: sheens (Brillos disponibles)
-- ============================================
CREATE TABLE IF NOT EXISTS sheens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sheen_key VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    color_hex VARCHAR(7) NOT NULL,
    tier ENUM('god', 'high', 'normal') DEFAULT 'normal',
    sort_order INT DEFAULT 0
) ENGINE=InnoDB;

-- Insertar sheens predefinidos
INSERT INTO sheens (sheen_key, name, color_hex, tier, sort_order) VALUES
('team_shine', 'Team Shine', '#FF4040', 'god', 1),
('hot_rod', 'Hot Rod', '#FF69B4', 'high', 2),
('manndarin', 'Manndarin', '#FF8000', 'normal', 3),
('deadly_daffodil', 'Deadly Daffodil', '#FFFF00', 'normal', 4),
('agonizing_emerald', 'Agonizing Emerald', '#00FF00', 'normal', 5),
('mean_green', 'Mean Green', '#808000', 'normal', 6),
('villainous_violet', 'Villainous Violet', '#800080', 'normal', 7);

-- ============================================
-- TABLA: killstreakers (Efectos disponibles)
-- ============================================
CREATE TABLE IF NOT EXISTS killstreakers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    killstreaker_key VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    tier ENUM('god', 'high', 'normal') DEFAULT 'normal',
    sort_order INT DEFAULT 0
) ENGINE=InnoDB;

-- Insertar killstreakers predefinidos
INSERT INTO killstreakers (killstreaker_key, name, tier, sort_order) VALUES
('fire_horns', 'Fire Horns', 'god', 1),
('cerebral_discharge', 'Cerebral Discharge', 'high', 2),
('tornado', 'Tornado', 'high', 3),
('singularity', 'Singularity', 'normal', 4),
('incinerator', 'Incinerator', 'normal', 5),
('flames', 'Flames', 'normal', 6),
('hypno_beam', 'Hypno-Beam', 'normal', 7);

-- ============================================
-- TABLA: projects (Proyectos de Killstreak Kits)
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    project_type ENUM('specialized', 'professional') NOT NULL,
    weapon_name VARCHAR(100) NOT NULL,
    sheen_id INT NOT NULL,
    killstreaker_id INT NULL,
    parts_required INT NOT NULL,
    status ENUM('in_progress', 'completed', 'cancelled') DEFAULT 'in_progress',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    notes TEXT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (sheen_id) REFERENCES sheens(id),
    FOREIGN KEY (killstreaker_id) REFERENCES killstreakers(id),
    INDEX idx_user_projects (user_id),
    INDEX idx_status (status),
    INDEX idx_type (project_type)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: project_history (Historial de proyectos completados)
-- ============================================
CREATE TABLE IF NOT EXISTS project_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    project_type ENUM('specialized', 'professional') NOT NULL,
    weapon_name VARCHAR(100) NOT NULL,
    sheen_name VARCHAR(50) NOT NULL,
    killstreaker_name VARCHAR(50) NULL,
    parts_used INT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sold_price_ref DECIMAL(10,2) NULL,
    sold_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_history (user_id),
    INDEX idx_completed (completed_at)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: user_settings (Configuración de usuario)
-- ============================================
CREATE TABLE IF NOT EXISTS user_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    scrap_value DECIMAL(5,2) DEFAULT 0.11,
    reclaimed_value DECIMAL(5,2) DEFAULT 0.33,
    refined_value DECIMAL(5,2) DEFAULT 1.00,
    key_value DECIMAL(10,2) DEFAULT 56.00,
    theme VARCHAR(20) DEFAULT 'dark',
    language VARCHAR(5) DEFAULT 'es',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- TABLA: market_alerts (Alertas del mercado)
-- ============================================
CREATE TABLE IF NOT EXISTS market_alerts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    alert_type ENUM('info', 'warning', 'urgent', 'promo') DEFAULT 'info',
    is_active BOOLEAN DEFAULT TRUE,
    priority INT DEFAULT 0,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Insertar alertas de ejemplo
INSERT INTO market_alerts (title, message, alert_type, priority) VALUES
('Bienvenido', '¡Bienvenido a Mann Co. Forge! Gestiona tu inventario MvM como un profesional.', 'info', 1),
('Tip del día', 'Los kits Professional requieren más valor pero tienen mayor demanda.', 'info', 2),
('Mercado', 'El precio de las Keys puede fluctuar. ¡Mantén actualizado el valor!', 'warning', 3);

-- ============================================
-- TABLA: activity_log (Registro de actividad)
-- ============================================
CREATE TABLE IF NOT EXISTS activity_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    action_type ENUM('stock_add', 'stock_remove', 'project_create', 'project_complete', 'project_delete', 'settings_change', 'login', 'logout') NOT NULL,
    description TEXT NOT NULL,
    metadata JSON NULL,
    ip_address VARCHAR(45) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_activity (user_id),
    INDEX idx_action_type (action_type),
    INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista: Resumen de inventario por usuario
CREATE OR REPLACE VIEW v_inventory_summary AS
SELECT 
    u.id AS user_id,
    u.username,
    ci.scrap_metal,
    ci.reclaimed_metal,
    ci.refined_metal,
    ci.mann_co_keys,
    COALESCE(SUM(pi.quantity), 0) AS total_robot_parts,
    (SELECT COUNT(*) FROM projects p WHERE p.user_id = u.id AND p.status = 'in_progress') AS active_projects
FROM users u
LEFT JOIN currency_inventory ci ON u.id = ci.user_id
LEFT JOIN parts_inventory pi ON u.id = pi.user_id
GROUP BY u.id, u.username, ci.scrap_metal, ci.reclaimed_metal, ci.refined_metal, ci.mann_co_keys;

-- Vista: Proyectos con detalles completos
CREATE OR REPLACE VIEW v_projects_detailed AS
SELECT 
    p.id,
    p.user_id,
    u.username,
    p.project_type,
    p.weapon_name,
    s.name AS sheen_name,
    s.color_hex AS sheen_color,
    k.name AS killstreaker_name,
    p.parts_required,
    p.status,
    p.created_at,
    p.completed_at
FROM projects p
JOIN users u ON p.user_id = u.id
JOIN sheens s ON p.sheen_id = s.id
LEFT JOIN killstreakers k ON p.killstreaker_id = k.id;

-- Vista: Valor total del inventario por usuario
CREATE OR REPLACE VIEW v_inventory_value AS
SELECT 
    u.id AS user_id,
    u.username,
    ci.scrap_metal,
    ci.reclaimed_metal,
    ci.refined_metal,
    ci.mann_co_keys,
    us.scrap_value,
    us.reclaimed_value,
    us.refined_value,
    us.key_value,
    (ci.scrap_metal * us.scrap_value) + 
    (ci.reclaimed_metal * us.reclaimed_value) + 
    (ci.refined_metal * us.refined_value) + 
    (ci.mann_co_keys * us.key_value) AS total_value_ref
FROM users u
JOIN currency_inventory ci ON u.id = ci.user_id
JOIN user_settings us ON u.id = us.user_id;

-- ============================================
-- STORED PROCEDURES
-- ============================================

DELIMITER //

-- Procedimiento: Crear nuevo usuario con inventario inicial
CREATE PROCEDURE sp_create_user(
    IN p_username VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_password_hash VARCHAR(255)
)
BEGIN
    DECLARE new_user_id INT;
    
    -- Insertar usuario
    INSERT INTO users (username, email, password_hash) 
    VALUES (p_username, p_email, p_password_hash);
    
    SET new_user_id = LAST_INSERT_ID();
    
    -- Crear inventario de currency vacío
    INSERT INTO currency_inventory (user_id) VALUES (new_user_id);
    
    -- Crear configuración por defecto
    INSERT INTO user_settings (user_id) VALUES (new_user_id);
    
    -- Crear inventario de partes vacío para cada parte
    INSERT INTO parts_inventory (user_id, part_id, quantity)
    SELECT new_user_id, id, 0 FROM robot_parts;
    
    SELECT new_user_id AS user_id;
END //

-- Procedimiento: Completar proyecto y descontar piezas
CREATE PROCEDURE sp_complete_project(
    IN p_project_id INT,
    IN p_user_id INT
)
BEGIN
    DECLARE v_parts_required INT;
    DECLARE v_remaining INT;
    DECLARE v_project_type VARCHAR(20);
    DECLARE v_weapon VARCHAR(100);
    DECLARE v_sheen VARCHAR(50);
    DECLARE v_killstreaker VARCHAR(50);
    
    -- Obtener datos del proyecto
    SELECT p.parts_required, p.project_type, p.weapon_name, s.name, COALESCE(k.name, '')
    INTO v_parts_required, v_project_type, v_weapon, v_sheen, v_killstreaker
    FROM projects p
    JOIN sheens s ON p.sheen_id = s.id
    LEFT JOIN killstreakers k ON p.killstreaker_id = k.id
    WHERE p.id = p_project_id AND p.user_id = p_user_id AND p.status = 'in_progress';
    
    IF v_parts_required IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Proyecto no encontrado o no está en progreso';
    END IF;
    
    SET v_remaining = v_parts_required;
    
    -- Descontar piezas del inventario (FIFO por part_id)
    UPDATE parts_inventory pi
    SET pi.quantity = GREATEST(0, pi.quantity - v_remaining)
    WHERE pi.user_id = p_user_id AND pi.quantity > 0
    ORDER BY pi.part_id
    LIMIT 8;
    
    -- Marcar proyecto como completado
    UPDATE projects 
    SET status = 'completed', completed_at = CURRENT_TIMESTAMP
    WHERE id = p_project_id;
    
    -- Agregar al historial
    INSERT INTO project_history (user_id, project_type, weapon_name, sheen_name, killstreaker_name, parts_used)
    VALUES (p_user_id, v_project_type, v_weapon, v_sheen, v_killstreaker, v_parts_required);
    
    SELECT 'Proyecto completado exitosamente' AS message;
END //

DELIMITER ;

-- ============================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- ============================================

-- Índice compuesto para búsquedas de proyectos
CREATE INDEX idx_projects_user_status_type ON projects(user_id, status, project_type);

-- Índice para búsquedas de historial por fecha
CREATE INDEX idx_history_user_date ON project_history(user_id, completed_at DESC);

-- ============================================
-- DATOS DE PRUEBA (OPCIONAL - Comentar en producción)
-- ============================================

-- Usuario de prueba
-- INSERT INTO users (username, email, password_hash) VALUES ('demo_user', 'demo@example.com', '$2y$10$demo_hash_here');
-- CALL sp_create_user('test_trader', 'trader@tf2.com', '$2y$10$test_hash');
