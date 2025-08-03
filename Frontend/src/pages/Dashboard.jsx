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
      <div className="p-6 bg-gray-100 min-h-screen font-sans">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-emerald-600">📂 Mes Projets</h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-500 transition"
          >
            + Nouveau Projet
          </button>
        </div>

        {/* 🧪 Filtres modernisés */}
        <div className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="🔍 Rechercher un projet..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <div>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        </div>

        {/* 📋 Liste des projets */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredProjects.map((p, index) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow hover:shadow-xl transition duration-300 cursor-pointer"
                onClick={() => navigate(`/projects/${p.id}`)}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-emerald-600">{p.name}</h2>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColor(p.statut)}`}
                  >
                    {p.statut}
                  </span>
                </div>
                <p className="text-gray-600 mt-2 line-clamp-3">{p.description}</p>
                <div className="mt-4 text-xs text-gray-500">
                  📅 Créé le {new Date(p.created_at).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>



      {/* Modal création projet */}
    {showModal && (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Créer un nouveau projet</h2>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Nom du projet"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-emerald-400"
          />
          <textarea
            placeholder="Description"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-emerald-400"
          />
          <select
            value={newProject.statut || 'En cours'}
            onChange={(e) => setNewProject({ ...newProject, statut: e.target.value })}
            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-emerald-400"
          >
            <option>En cours</option>
            <option>Terminé</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Annuler
          </button>
          <button
            onClick={handleCreateProject}
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-500"
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
