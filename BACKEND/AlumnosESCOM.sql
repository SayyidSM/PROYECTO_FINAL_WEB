CREATE TABLE alumnos (
    idAlumno INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    carrera VARCHAR(100) NOT NULL,
    semestre INT NOT NULL,
    boleta VARCHAR(20) NOT NULL UNIQUE,
    CONSTRAINT check_semestre CHECK (semestre > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO alumnos (nombre, carrera, semestre, boleta)
VALUES
("Juan Pérez", "Ingeniería en Sistemas Computacionales", 5, "20200001"),
("Ana López", "Ingeniería en Informática", 6, "20200002"),
("Carlos Hernández", "Ingeniería Industrial", 4, "20200003");
