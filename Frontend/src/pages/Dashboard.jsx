import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filters, setFilters] = useState({ search: "", date: "" });
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "", statut: "En cours" });
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    axiosInstance.get("/projects").then((res) => {
      setProjects(res.data);
      setFilteredProjects(res.data);
    });
  };

  const handleFilter = () => {
    let temp = [...projects];
    if (filters.search) {
      temp = temp.filter((p) =>
        p.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.date) {
      temp = temp.filter(
        (p) => new Date(p.created_at).toISOString().split("T")[0] === filters.date
      );
    }
    setFilteredProjects(temp);
  };

  useEffect(() => {
    handleFilter();
  }, [filters]);

  const handleCreateProject = async () => {
    try {
      await axiosInstance.post("/projects", newProject);
      toast.success("Projet créé avec succès !");
      setShowModal(false);
      setNewProject({ name: "", description: "", statut: "En cours" });
      loadProjects();
    } catch (err) {
      toast.error("Erreur lors de la création");
    }
  };

  const badgeColor = (statut) => {
    switch (statut) {
      case "Terminé":
        return "bg-green-100 text-green-700";
      case "En cours":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <>
      <Toaster />
      <Navbar />
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">📂 Mes Projets</h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition"
          >
            + Nouveau Projet
          </button>
        </div>

        {/* Filtres */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Rechercher par nom..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="border p-2 rounded w-1/3"
          />
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            className="border p-2 rounded"
          />
        </div>

        {/* Liste projets */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredProjects.map((p, index) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white shadow-lg rounded-xl p-5 hover:shadow-2xl transition duration-300 cursor-pointer"
                onClick={() => navigate(`/projects/${p.id}`)}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-indigo-600">{p.name}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm ${badgeColor(p.statut)}`}>
                    {p.statut}
                  </span>
                </div>
                <p className="text-gray-600 mt-2 line-clamp-3">{p.description}</p>
                <div className="mt-4 text-sm text-gray-500">
                  📅 Créé le {new Date(p.created_at).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal création projet */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4">Créer un nouveau projet</h2>
            <input
              type="text"
              placeholder="Nom du projet"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              className="border p-2 rounded w-full mb-3"
            />
            <textarea
              placeholder="Description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="border p-2 rounded w-full mb-3"
            />
            <select
              value={newProject.statut || 'en cours'}
              onChange={(e) => setNewProject({ ...newProject, statut: e.target.value })}
              className="border p-2 rounded w-full mb-3"
            >
              <option>En cours</option>
              <option>Terminé</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateProject}
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
              >
                Créer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
