DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

\c employee_db;

CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    "name" VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    departmentId INTEGER NOT NULL,
    FOREIGN KEY (departmentId)
    REFERENCES department(id)
    ON DELETE SET NULL
);

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(30) UNIQUE NOT NULL,
    lastName VARCHAR(30) UNIQUE NOT NULL,
    roleId INTEGER NOT NULL,
    managerId INTEGER DEFAULT null,
    FOREIGN KEY (roleId)
    REFERENCES role(id)
    ON DELETE SET NULL
);