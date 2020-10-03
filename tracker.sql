DROP DATABASE IF EXISTS tracker;

DROP DATABASE IF EXISTS tracker;

CREATE DATABASE tracker;

USE tracker;

CREATE TABLE department (
id INT,
name VARCHAR(30),
PRIMARY KEY (id)
);

CREATE TABLE role (
id INT,
title VARCHAR(30),
salary DECIMAL(6,0),
department_id INT,
PRIMARY KEY (id)
);

CREATE TABLE employee (
id INT,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INT,
manager_id INT,
PRIMARY KEY (id)
);

SELECT * FROM employee;

