import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Plus, Edit2, Trash2, ArrowRight } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/alumnos';

const AppAlumnos = () => {
  const [carreras, setCarreras] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [error, setError] = useState(null);
  const [showAlumnoForm, setShowAlumnoForm] = useState(false);
  const [newAlumno, setNewAlumno] = useState({
    idAlumno: null,
    nombre: '',
    carrera: '',
    semestre: '',
    boleta: '',
  });

  const fetchAlumnos = async () => {
    try {
      const response = await axios.get(API_URL);
      setAlumnos(response.data);
    } catch (err) {
      setError('Error al cargar los alumnos');
    }
  };

  const fetchCarreras = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/carreras');
      setCarreras(response.data); // Almacena las carreras en el estado
    } catch (err) {
      console.error('Error al obtener las carreras:', err);
      setError('Error al cargar las carreras');
    }
  };

  useEffect(() => {
    fetchAlumnos();
    fetchCarreras(); // Llama también a esta función
  }, []);

  const handleSaveAlumno = async () => {
    try {
      if (newAlumno.idAlumno) {
        // Si existe `idAlumno`, realiza un PUT para actualizar
        await axios.put(`${API_URL}/${newAlumno.idAlumno}`, newAlumno, {
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        // Si no existe `idAlumno`, realiza un POST para crear
        await axios.post(API_URL, newAlumno, {
          headers: { 'Content-Type': 'application/json' },
        });
      }
      fetchAlumnos(); // Refrescar la lista
      setShowAlumnoForm(false); // Cerrar el formulario
      setNewAlumno({
        idAlumno: null,
        nombre: '',
        carrera: '',
        semestre: '',
        boleta: '',
      }); // Reiniciar el formulario
    } catch (err) {
      setError('Error al guardar el alumno');
    }
  };

  const handleDeleteAlumno = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchAlumnos(); // Refrescar la lista después de eliminar
    } catch (err) {
      setError('Error al eliminar el alumno');
    }
  };

  const handleEditAlumno = (id) => {
    const alumno = alumnos.find((item) => item.idAlumno === id);
    setNewAlumno(alumno); // Cargar datos del alumno en el formulario
    setShowAlumnoForm(true); // Abrir el formulario
  };

  return (
    <div className="container mx-auto p-4">        
      <Link to="/carreras" className="flex flex-row gap-1 text-blue-500 hover:text-blue-900 mb-4 block">
        Gestionar Carreras
        <ArrowRight/>
      </Link>
      <h1 className="text-3xl font-bold mb-6">Gestión de Alumnos</h1>
      {error && (
        <div className="flex items-center bg-red-200 text-red-600 p-4 mb-4">
          <AlertCircle className="mr-2" /> {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Alumnos</h2>
        <button
          onClick={() => setShowAlumnoForm(true)}
          className="flex items-center bg-green-500 text-white px-4 py-2"
        >
          <Plus className="mr-2" /> Nuevo Alumno
        </button>
      </div>

      {showAlumnoForm && (
        <div className="modal bg-white p-4 border rounded shadow-md">
          <h3 className="text-xl font-semibold mb-4">
            {newAlumno.idAlumno ? 'Editar Alumno' : 'Nuevo Alumno'}
          </h3>
          <input
            type="text"
            placeholder="Nombre"
            value={newAlumno.nombre}
            onChange={(e) =>
              setNewAlumno({ ...newAlumno, nombre: e.target.value })
            }
            className="border p-2 mb-2 w-full"
          />
          <select
            value={newAlumno.carrera}
            onChange={(e) =>
              setNewAlumno({ ...newAlumno, carrera: e.target.value })
            }
            className="border p-2 mb-2 w-full"
          >
            <option value="" disabled>Selecciona una carrera</option>
            {carreras.map((carrera) => (
              <option key={carrera.idCarrera} value={carrera.carrera}>
                {carrera.carrera}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Semestre"
            value={newAlumno.semestre}
            onChange={(e) =>
              setNewAlumno({ ...newAlumno, semestre: e.target.value })
            }
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Boleta"
            value={newAlumno.boleta}
            onChange={(e) =>
              setNewAlumno({ ...newAlumno, boleta: e.target.value })
            }
            className="border p-2 mb-2 w-full"
          />
          <div className="mt-4 flex justify-between">
            <button
              onClick={handleSaveAlumno}
              className="bg-blue-500 text-white px-4 py-2"
            >
              {newAlumno.idAlumno ? 'Actualizar' : 'Crear'}
            </button>
            <button
              onClick={() => setShowAlumnoForm(false)}
              className="bg-gray-500 text-white px-4 py-2"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Nombre</th>
            <th className="border border-gray-300 p-2">Carrera</th>
            <th className="border border-gray-300 p-2">Semestre</th>
            <th className="border border-gray-300 p-2">Boleta</th>
            <th className="border border-gray-300 p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map((alumno) => (
            <tr key={alumno.idAlumno}>
              <td className="border border-gray-300 p-2">{alumno.nombre}</td>
              <td className="border border-gray-300 p-2">{alumno.carrera}</td>
              <td className="border border-gray-300 p-2">{alumno.semestre}</td>
              <td className="border border-gray-300 p-2">{alumno.boleta}</td>
              <td className="border border-gray-300 p-2">
                <button
                  className="text-blue-500 mr-2"
                  onClick={() => handleEditAlumno(alumno.idAlumno)}
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  className="text-red-500"
                  onClick={() => handleDeleteAlumno(alumno.idAlumno)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppAlumnos;
