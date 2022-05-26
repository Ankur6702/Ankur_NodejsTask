-- Patient schema
CREATE TABLE patient (
    id INT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Address VARCHAR(255) NOT NULL,
    Phone_number VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Photo VARCHAR(255) DEFAULT NULL,
    Psychiatrist_id INT
);

-- Psychiatrist schema
CREATE TABLE psychiatrists (
    id INT PRIMARY KEY,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    Hospital VARCHAR(255) NOT NULL,
    Phone_number VARCHAR(255) NOT NULL,
    Pincode  VARCHAR(255) NOT NULL,
    State VARCHAR(255) NOT NULL,
    NumberOfPatients INT DEFAULT 0,
    token VARCHAR(255)
);
