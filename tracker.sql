DROP DATABASE IF EXISTS tracker;

DROP DATABASE IF EXISTS tracker;

CREATE DATABASE tracker;

USE tracker;

CREATE TABLE department (
id INT NOT NULL,
department_name VARCHAR(30),
PRIMARY KEY (id)
);

CREATE TABLE role (
id INT NOT NULL,
title VARCHAR(30),
salary DECIMAL(6,0),
department_id INT NOT NULL,
PRIMARY KEY (id)
);

CREATE TABLE employee (
id INT NOT NULL,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INT NOT NULL,
manager_id INT NULL,
PRIMARY KEY (id)
);

INSERT INTO employee (id, first_name, last_name, role_id)
VALUES (1, "Jeff", "Flynn", 1);

SELECT department_id, salary
FROM role
LEFT JOIN employee
on role.id = employee.role_id;