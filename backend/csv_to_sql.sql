-- =========================================
-- Step 0: Create the Database
-- =========================================

CREATE DATABASE IF NOT EXISTS indian_cuisine;
USE indian_cuisine;

-- =========================================
-- Step 1: Create the 'users' Table
-- =========================================

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,       -- Unique user ID
    email VARCHAR(255) NOT NULL UNIQUE,      -- Email address
    password VARCHAR(255) NOT NULL           -- Hashed password
);

-- =========================================
-- Step 2: Create the 'dishes' Table (with user_id)
-- =========================================

CREATE TABLE IF NOT EXISTS dishes (
    name VARCHAR(100),                       -- Dessert name
    ingredients TEXT,                        -- List of ingredients
    diet VARCHAR(50),                        -- Diet type
    prep_time INT,                           -- Preparation time (min)
    cook_time INT,                           -- Cooking time (min)
    flavor_profile VARCHAR(20),              -- Sweet, spicy, etc.
    course VARCHAR(50),                      -- Dessert, snack, etc.
    state VARCHAR(50),                       -- State of origin
    region VARCHAR(50),                      -- Region
    user_id INT DEFAULT 0                    -- User who added it (0 = system default)
);

-- =========================================
-- Step 3: Enable Local Infile (one-time per session)
-- =========================================

SET GLOBAL local_infile = 1;

-- =========================================
-- Step 4: Load CSV into 'dishes'
-- =========================================

-- Ensure your MySQL client supports local file loading.
-- Update the path to match your environment.

LOAD DATA LOCAL INFILE 'C:\\Users\\user.name\\Downloads\\indian_food.csv'
INTO TABLE dishes
CHARACTER SET 'utf8'
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
ESCAPED BY '\\'
LINES TERMINATED BY '\r\n'
IGNORE 1 ROWS
(
  name,
  ingredients,
  diet,
  prep_time,
  cook_time,
  flavor_profile,
  course,
  state,
  region
)
SET user_id = 0;  -- All imported dishes are added by system by default

-- =========================================
-- Step 5: Verify
-- =========================================

SELECT * FROM dishes;
SELECT * FROM users;
 