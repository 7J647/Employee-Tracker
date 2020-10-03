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

SELECT * FROM department;
SELECT * FROM role