DROP DATABASE IF EXISTS tracker;

CREATE DATABASE tracker;

USE tracker;

CREATE TABLE department (
id INT,
name VARCHAR(30),
PRIMARY KEY (id)
);

INSERT INTO department (id, name)
VALUES ("1", "Research and Development");

SELECT * FROM department