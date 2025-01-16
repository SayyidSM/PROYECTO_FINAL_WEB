CREATE TABLE carreras (
    idCarrera INT AUTO_INCREMENT PRIMARY KEY,
    carrera VARCHAR(100) NOT NULL,
    descripcionCarrera TEXT,
    semestres INT NOT NULL,
    plan INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO carreras (carrera, descripcionCarrera, semestres, plan)
VALUES
("Ingeniería en Sistemas Computacionales", "Carrera enfocada en el desarrollo de software y hardware", 9, 2023),
("Ingeniería en Informática", "Carrera con énfasis en la gestión de tecnologías de la información", 8, 2022),
("Ingeniería Industrial", "Optimización de procesos y recursos", 9, 2023);
