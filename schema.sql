CREATE TABLE facebook_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    display_name VARCHAR(255),
    access_token TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE facebook_pages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    page_id VARCHAR(100) NOT NULL,
    page_name VARCHAR(255),
    page_access_token TEXT NOT NULL,
    subscribed TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES facebook_users(id) ON DELETE CASCADE
);
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE fb_leads (
    id int AUTO_INCREMENT PRIMARY KEY,
    lead_id VARCHAR(50),
    lead_data JSON,
    page_id int,
    form_id VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (page_id) REFERENCES facebook_pages(id) ON DELETE CASCADE
);
CREATE TABLE client_onboarding (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    cc_list VARCHAR(255),
    phone_number_list VARCHAR(255),
    facebook_page_id VARCHAR(255) UNIQUE
);