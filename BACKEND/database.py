import pymysql
from dotenv import load_dotenv
import os

# Cargar las variables de entorno desde el archivo .env
load_dotenv()

# Imprime las variables de entorno para verificar
print("DB_HOST:", os.getenv("DB_HOST"))
print("DB_USER:", os.getenv("DB_USER"))
print("DB_PASSWORD:", os.getenv("DB_PASSWORD"))
print("DB_NAME:", os.getenv("DB_NAME"))

try:
    # Establecer la conexión utilizando las variables de entorno
    conn = pymysql.connect(
        host=os.getenv("DB_HOST"),       
        user=os.getenv("DB_USER"),       
        password=os.getenv("DB_PASSWORD"), 
        database=os.getenv("DB_NAME"),   
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )

    print("Conexión exitosa")

    # Crear un cursor para ejecutar consultas
    cursor = conn.cursor()

    # Aquí puedes agregar pruebas para ejecutar una consulta
    cursor.execute("SHOW TABLES;")
    tables = cursor.fetchall()
    print("Tablas en la base de datos:")
    for table in tables:
        print(table)

    # Cerrar la conexión
    conn.close()
    print("Conexión cerrada")

except pymysql.MySQLError as e:
    print(f"Error al conectar a la base de datos: {e}")

