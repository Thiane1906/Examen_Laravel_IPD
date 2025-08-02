import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axios";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

export default function ProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    titre: "",
    description: "",
    etat: "En attente",
    deadline: "",
  });

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    const res = await axiosInstance.get(`/projects/${id}`);
    setProject(res.data);
  };

  const handleCreateTask = async () => {
    try {
      await axiosInstance.post(`/tasks`, {
        ...newTask,
        project_id: id,
      });
      toast.success("Tâche créée avec succès !");
      setShowModal(false);
      setNewTask({ titre: "", description: "", etat: "En attente", deadline: "" });
      loadProject();
    } catch (err) {
      toast.error("Erreur lors de la création");
    }
  };

  const badgeColor = (etat) => {
    switch (etat) {
      case "Terminée":
        return "bg-green-100 text-green-700";
      case "En cours":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (!project) return <div className="p-6">Chargement...</div>;

  return (
    <>
      <Toaster />
      <Navbar />
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Info projet */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h1 className="text-2xl font-bold text-indigo-600">{project.nom}</h1>
          <p className="text-gray-600 mt-2">{project.description}</p>
          <div className="flex gap-4 mt-4 text-sm text-gray-500">
            <span>📅 Créé le {new Date(project.created_at).toLocaleDateString()}</span>
            <span className={`px-3 py-1 rounded-full ${badgeColor(project.statut)}`}>
              {project.statut}
            </span>
          </div>
        </div>

        {/* Liste des tâches */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tâches</h2>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            + Nouvelle tâche
          </button>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3">Titre</th>
                <th className="text-left p-3">Description</th>
                <th className="text-left p-3">État</th>
                <th className="text-left p-3">Deadline</th>
              </tr>
            </thead>
            <tbody>
              {project.tasks.map((task) => (
                <motion.tr
                  key={task.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3">{task.titre}</td>
                  <td className="p-3">{task.description}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full ${badgeColor(task.etat)}`}>
                      {task.etat}
                    </span>
                  </td>
                  <td className="p-3">
                    {task.deadline ? new Date(task.deadline).toLocaleDateString() : "—"}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal création tâche */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4">Créer une nouvelle tâche</h2>
            <input
              type="text"
              placeholder="Titre"
              value={newTask.titre}
              onChange={(e) => setNewTask({ ...newTask, titre: e.target.value })}
              className="border p-2 rounded w-full mb-3"
            />
            <textarea
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="border p-2 rounded w-full mb-3"
            />
            <select
              value={newTask.etat}
              onChange={(e) => setNewTask({ ...newTask, etat: e.target.value })}
              className="border p-2 rounded w-full mb-3"
            >
              <option>En attente</option>
              <option>En cours</option>
              <option>Terminée</option>
            </select>
            <input
              type="date"
              value={newTask.deadline}
              onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              className="border p-2 rounded w-full mb-3"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateTask}
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
