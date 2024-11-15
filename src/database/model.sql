-- Database create qilish
CREATE DATABASE test;

-- Users jadvalini create qilish
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    user_first_name VARCHAR(16) NOT NULL,
    user_last_name VARCHAR(16),
    user_email VARCHAR(64) NOT NULL UNIQUE,
    user_password VARCHAR(64) NOT NULL,
    user_created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- new jadvalini create qilish
DROP TABLE IF EXISTS new CASCADE;
CREATE TABLE IF NOT EXISTS new (
    new_id SERIAL PRIMARY KEY,
    new_title VARCHAR(128) NOT NULL,
    new_desc VARCHAR(256) NOT NULL,
    new_creator_id INT NOT NULL REFERENCES users(user_id),
    new_created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- timestampz === timestamp with time zone