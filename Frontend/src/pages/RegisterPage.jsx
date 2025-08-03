import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance, { csrf } from '../api/axios.js';
import { AuthContext } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await csrf.get('/sanctum/csrf-cookie');

      const res = await axiosInstance.post('/register', form);
      const { token, user } = res.data;

      login(token, user); // stocke le token et les données utilisateur
      setSuccess("Inscription réussie !");
    
      // Redirection après 1,5 seconde
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      // navigate('/login');
    } catch (err) {
      console.error(err.response?.data);
      setError("Erreur lors de l'inscription. Vérifie les informations.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Inscription</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Nom complet"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Adresse email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="password"
            name="password_confirmation"
            placeholder="Confirmer le mot de passe"
            value={form.password_confirmation}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            S'inscrire
          </button>
        </form>

        <p className="text-sm mt-4 text-center">
          Déjà inscrit ?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
