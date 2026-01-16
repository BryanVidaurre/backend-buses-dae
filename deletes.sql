-- SQLite
PRAGMA foreign_keys = OFF;

DELETE FROM ingreso_bus;
DELETE FROM qr_token;
DELETE FROM estudiante_semestre;
DELETE FROM estudiante_carrera;
DELETE FROM estudiante;
DELETE FROM carrera;
DELETE FROM semestre;
DELETE FROM bus;

-- Reinicia todos los autoincrementales
DELETE FROM sqlite_sequence;

PRAGMA foreign_keys = ON;