import React, { useState, useEffect } from 'react';
import { AlertCircle, Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// URL de la API
const API_URL = 'http://127.0.0.1:5000/carreras';

// Componente para el formulario de carreras
const CarreraForm = ({ onSubmit, onClose, carrera }) => {
  const [formData, setFormData] = useState({
    carrera: carrera ? carrera.carrera : '',
    descripcionCarrera: carrera ? carrera.descripcionCarrera : '',
    semestres: carrera ? carrera.semestres : '',
    plan: carrera ? carrera.plan : '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();  // Cierra el formulario después de enviar
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold">Nombre de la carrera:</label>
        <input
          type="text"
          name="carrera"
          value={formData.carrera}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold">Descripción:</label>
        <textarea
          name="descripcionCarrera"
          value={formData.descripcionCarrera}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold">Semestres:</label>
        <input
          type="number"
          name="semestres"
          value={formData.semestres}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold">Plan:</label>
        <input
          type="text"
          name="plan"
          value={formData.plan}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="flex justify-end gap-4">
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Guardar
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

// Componente principal de la gestión de carreras
const AppCarreras = () => {
  const [carreras, setCarreras] = useState([]);
  const [error, setError] = useState(null);
  const [showCarreraForm, setShowCarreraForm] = useState(false);
  const [selectedCarrera, setSelectedCarrera] = useState(null);

  // Función para obtener las carreras de la API
  const fetchCarreras = async () => {
    try {
      const response = await axios.get(API_URL);
      setCarreras(response.data);
    } catch (err) {
      setError('Error al cargar las carreras');
    }
  };

  useEffect(() => {
    fetchCarreras();
  }, []);

  // Función para manejar la creación de nuevas carreras
  const handleCreateCarrera = async (data) => {
    try {
      if (selectedCarrera) {
        await axios.put(`${API_URL}/${selectedCarrera.idCarrera}`, data);  // Si estamos editando
      } else {
        await axios.post(API_URL, data);  // Si estamos creando
      }
      fetchCarreras();
      setShowCarreraForm(false);
      setSelectedCarrera(null);
    } catch (err) {
      setError('Error al crear o actualizar la carrera');
    }
  };

  // Función para manejar la eliminación de carreras
  const handleDeleteCarrera = async (idCarrera) => {
    try {
      await axios.delete(`${API_URL}/${idCarrera}`);
      fetchCarreras();
    } catch (err) {
      setError('Error al eliminar la carrera');
    }
  };

  // Función para manejar la edición de una carrera
  const handleEditCarrera = (carrera) => {
    setSelectedCarrera(carrera);
    setShowCarreraForm(true);
  };

  return (
    <div className="container mx-auto p-4">
      <Link to="/" className="flex flex-row gap-1 text-blue-500 hover:text-blue-900 mb-4 block">
      <ArrowLeft/>
        Gestionar Alumnos
      </Link>
      <h1 className="text-3xl font-bold mb-6">Gestión de Carreras</h1>
      {error && (
        <div className="flex items-center bg-red-200 text-red-600 p-4 mb-4">
          <AlertCircle className="mr-2" /> {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Carreras</h2>
        <button
          onClick={() => setShowCarreraForm(true)}
          className="flex items-center bg-green-500 text-white px-4 py-2"
        >
          <Plus className="mr-2" /> Nueva Carrera
        </button>
      </div>

      {showCarreraForm && (
        <div className="modal bg-white p-4 border rounded shadow-md">
          <CarreraForm
            onSubmit={handleCreateCarrera}
            onClose={() => setShowCarreraForm(false)}
            carrera={selectedCarrera}
          />
        </div>
      )}

      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Nombre</th>
            <th className="border border-gray-300 p-2">Descripción</th>
            <th className="border border-gray-300 p-2">Semestres</th>
            <th className="border border-gray-300 p-2">Plan</th>
            <th className="border border-gray-300 p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {carreras.map((carrera) => (
            <tr key={carrera.idCarrera}>
              <td className="border border-gray-300 p-2">{carrera.carrera}</td>
              <td className="border border-gray-300 p-2">{carrera.descripcionCarrera}</td>
              <td className="border border-gray-300 p-2">{carrera.semestres}</td>
              <td className="border border-gray-300 p-2">{carrera.plan}</td>
              <td className="border border-gray-300 p-2">
                <button onClick={() => handleEditCarrera(carrera)} className="text-blue-500 mr-2">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteCarrera(carrera.idCarrera)}
                  className="text-red-500"
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

export default AppCarreras;
