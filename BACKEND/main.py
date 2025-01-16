from flask import Flask, request, jsonify
import json
import pymysql
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)



def db_connection():
    conn = None
    try:
        conn = pymysql.connect(
            host=os.getenv("DB_HOST"),        # "localhost"
            user=os.getenv("DB_USER"),        # "root"
            password=os.getenv("DB_PASSWORD"), 
            database=os.getenv("DB_NAME"),    # "alumnos_escom"
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
    except pymysql.MySQLError as e:
        print(f"Error de conexión con la BD: {e}")
    return conn

@app.route('/')
def index():
    return jsonify({"message": "Bienvenido a la API de Alumnos y Carreras"}), 200


@app.route('/carreras', methods=['GET', 'POST'])
def all_carreras():
    conn = db_connection()
    if not conn:
        return jsonify({"error": "Erro de conexión con la BD"}), 500
   
    cursor = conn.cursor()
    
    if request.method == 'GET':
        try:
            
            cursor.execute("SELECT * FROM carreras")
            all_carreras = [
                dict(
                    idCarrera=row['idCarrera'],
                    carrera=row['carrera'],
                    descripcionCarrera=row['descripcionCarrera'],
                    semestres=row['semestres'],
                    plan=row['plan']
                )
                for row in cursor.fetchall()
            ]
            return jsonify(all_carreras), 200
        except Exception as e:
            print(f"Error fetching carreras: {e}")
            return jsonify({"error": "Error al escribir en carreras"}), 500
    
    if request.method == 'POST':
        try:
            data = request.get_json()
            if not all(key in data for key in ['carrera', 'descripcionCarrera', 'semestres', 'plan']):
                return jsonify({"error": "Faltan campos requeridos"}), 400
            
            sql = """INSERT INTO carreras (carrera, descripcionCarrera, semestres, plan)
                     VALUES (%s, %s, %s, %s)"""
            cursor.execute(sql, (
                data['carrera'],
                data['descripcionCarrera'],
                int(data['semestres']),
                int(data['plan'])
            ))
            conn.commit()
            return jsonify({"message": "Carrera creada exitosamente"}), 201
        except ValueError as e:
            return jsonify({"error": "Formato de datos inválido"}), 400
        except Exception as e:
            print(f"Error creating carrera: {e}")
            return jsonify({"error": "Erro al crear carrera"}), 500
        finally:
            conn.close()  # Cierra la conexión

@app.route('/carreras/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def single_carrera(id):
    conn = db_connection()
    if not conn:
        return jsonify({"error": "Error de conexion con BD"}), 500

    cursor = conn.cursor()

    if request.method == "GET":
        try:
            cursor.execute("SELECT * FROM carreras WHERE idCarrera=%s", (id,))
            carrera = cursor.fetchone()
            if carrera:
                return jsonify(carrera), 200
            return jsonify({"error": "Carrera no encontrada"}), 404
        except Exception as e:
            print(f"Error fetching carrera: {e}")
            return jsonify({"error": str(e)}), 500

    if request.method == 'PUT':
        try:
            data = request.get_json()
            if not all(key in data for key in ['carrera', 'descripcionCarrera', 'semestres', 'plan']):
                return jsonify({"error": "Faltan campos requeridos"}), 400

            sql = """UPDATE carreras 
                     SET carrera=%s,
                         descripcionCarrera=%s,
                         semestres=%s,
                         plan=%s
                     WHERE idCarrera=%s"""
            
            cursor.execute(sql, (
                data['carrera'],
                data['descripcionCarrera'],
                int(data['semestres']),
                int(data['plan']),
                id
            ))
            conn.commit()
            return jsonify({"message": "Carrera actualizada exitosamente"}), 200
        except ValueError as e:
            return jsonify({"error": "Formato de datos inválido"}), 400
        except Exception as e:
            print(f"Error updating carrera: {e}")
            return jsonify({"error": str(e)}), 500

    if request.method == 'DELETE':
        try:
            cursor.execute("DELETE FROM carreras WHERE idCarrera=%s", (id,))
            conn.commit()
            return jsonify({"message": f"Carrera eliminada exitosamente"}), 200
        except Exception as e:
            print(f"Error deleting carrera: {e}")
            return jsonify({"error": str(e)}), 500

@app.route('/alumnos', methods=['GET', 'POST'])
def all_alumnos():
    conn = db_connection()
    if not conn:
        return jsonify({"error": "Error de conexión con BD"}), 500

    cursor = conn.cursor()

    if request.method == 'GET':
        try:
            cursor.execute("SELECT * FROM alumnos")
            all_alumnos = [
                dict(
                    idAlumno=row['idAlumno'],
                    nombre=row['nombre'],
                    carrera=row['carrera'],
                    semestre=row['semestre'],
                    boleta=row['boleta']
                )
                for row in cursor.fetchall()
            ]
            return jsonify(all_alumnos), 200
        except Exception as e:
            print(f"Error fetching alumnos: {e}")
            return jsonify({"error": "Error al escribir alumnos"}), 500
        finally:
            conn.close()  # Cierra la conexión

    if request.method == 'POST':
        try:
            data = request.get_json()
            if not all(key in data for key in ['nombre', 'carrera', 'semestre', 'boleta']):
                return jsonify({"error": "Faltan campos requeridos"}), 400
            
            sql = """INSERT INTO alumnos (nombre, carrera, semestre, boleta)
                    VALUES (%s, %s, %s, %s)"""
            cursor.execute(sql, (
                data['nombre'],
                data['carrera'],
                int(data['semestre']),
                data['boleta']
            ))
            conn.commit()
            return jsonify({"message": "Alumno creado exitosamente"}), 201
        except ValueError as e:
            return jsonify({"error": "Formato de datos inválido"}), 400
        except Exception as e:
            print(f"Error creating alumno: {e}")
            return jsonify({"error": str(e)}), 500
        finally:
            conn.close()  # Cierra la conexión

@app.route('/alumnos/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def single_alumno(id):
    conn = db_connection()
    if not conn:
        return jsonify({"error": "Error de conexion con BD"}), 500

    cursor = conn.cursor()

    if request.method == "GET":
        try:
            cursor.execute("SELECT * FROM alumnos WHERE idAlumno=%s", (id,))
            alumno = cursor.fetchone()
            if alumno:
                return jsonify(alumno), 200
            return jsonify({"error": "Alumno no encontrado"}), 404
        except Exception as e:
            print(f"Error fetching alumno: {e}")
            return jsonify({"error": str(e)}), 500

    if request.method == "PUT":
        try:
            data = request.get_json()
            if not all(key in data for key in ['nombre', 'carrera', 'semestre', 'boleta']):
                return jsonify({"error": "Faltan campos requeridos"}), 400

            sql = """UPDATE alumnos
                     SET nombre=%s,
                         carrera=%s,
                         semestre=%s,
                         boleta=%s
                     WHERE idAlumno=%s"""
            
            cursor.execute(sql, (
                data['nombre'],
                data['carrera'],
                int(data['semestre']),
                data['boleta'],
                id
            ))
            conn.commit()
            return jsonify({"message": "Alumno actualizado exitosamente"}), 200
        except ValueError as e:
            return jsonify({"error": "Formato de datos inválido"}), 400
        except Exception as e:
            print(f"Error updating alumno: {e}")
            return jsonify({"error": str(e)}), 500

    if request.method == "DELETE":
        try:
            cursor.execute("DELETE FROM alumnos WHERE idAlumno=%s", (id,))
            conn.commit()
            return jsonify({"message": "Alumno eliminado exitosamente"}), 200
        except Exception as e:
            print(f"Error deleting alumno: {e}")
            return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)