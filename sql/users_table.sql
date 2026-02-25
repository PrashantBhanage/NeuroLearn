-- Create users table for NeuroLearn
-- Run this SQL in your MySQL database

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    profile_picture VARCHAR(255) DEFAULT 'default.png',
    progress INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert a test user (password: test123)
INSERT INTO users (username, password, email, profile_picture, progress) 
VALUES ('testuser', 'test123', 'test@example.com', 'default.png', 0);

