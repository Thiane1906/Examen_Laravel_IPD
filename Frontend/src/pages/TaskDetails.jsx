import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import toast, { Toaster } from "react-hot-toast";

export default function TaskDetails({ taskId, onClose, onTaskUpdated }) {
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [users, setUsers] = useState([]);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (taskId) {
      loadTask();
      loadUsers();
    }
  }, [taskId]);

  const loadTask = async () => {
    try {
      const res = await axiosInstance.get(`/tasks/${taskId}`);
      setTask(res.data);
      setComments(res.data.comments || []);
    } catch {
      toast.error("Erreur lors du chargement de la tâche");
    }
  };

  const loadUsers = async () => {
    try {
      const res = await axiosInstance.get("/users");
      setUsers(res.data);
    } catch {
      toast.error("Erreur lors du chargement des utilisateurs");
    }
  };

const handleUpdateTask = async (field, value) => {
  try {
    const res = await axiosInstance.put(`/tasks/${taskId}`, { [field]: value });

    // Laravel renvoie déjà la tâche mise à jour
    setTask(res);

    // Mise à jour dans le Kanban
    // if (onTaskUpdated) {
    //   onTaskUpdated(res);
    // }

    toast.success("Tâche mise à jour !");
  } catch (err) {
    console.error("Erreur API :", err.response?.data || err.message);
    toast.error("Erreur lors de la mise à jour");
  }
};



  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await axiosInstance.post(`/tasks/${taskId}/comments`, { texte: newComment });
      toast.success("Commentaire ajouté !");
      setNewComment("");
      loadTask();
    } catch {
      toast.error("Erreur lors de l'ajout du commentaire");
    }
  };

  const closeWithAnimation = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 300);
  };

  if (!task) return null;

  return (
    <>
      <Toaster />
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Modal */}
        <div
          className={`bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative transform transition-all duration-300 ${
            isClosing ? "scale-90 opacity-0" : "scale-100 opacity-100"
          }`}
        >
          {/* Bouton fermer */}
          <button
            onClick={closeWithAnimation}
            className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-lg"
          >
            ✕
          </button>

          {/* Titre */}
          <input
            type="text"
            value={task.titre}
            onChange={(e) => handleUpdateTask("titre", e.target.value)}
            className="text-2xl font-bold mb-2 border-b focus:outline-none focus:border-indigo-500 w-full"
          />

          {/* Description */}
          <textarea
            value={task.description}
            onChange={(e) => handleUpdateTask("description", e.target.value)}
            className="text-gray-600 mb-4 border rounded p-2 w-full focus:outline-none focus:border-indigo-500"
          />

          {/* Infos */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <label className="block text-gray-500 mb-1">Assignée à</label>
              <select
                value={task.assigned_to || ""}
                onChange={(e) => handleUpdateTask("assigned_to", e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="">-- Choisir un utilisateur --</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-500 mb-1">Deadline</label>
              <input
                type="date"
                value={task.deadline ? task.deadline.split("T")[0] : ""}
                onChange={(e) => handleUpdateTask("deadline", e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
          </div>

          {/* Statut */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Statut</label>
            <select
              value={task.etat}
              onChange={(e) => handleUpdateTask("etat", e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option>En attente</option>
              <option>En cours</option>
              <option>Terminée</option>
            </select>
          </div>

          {/* Commentaires */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Commentaires</h3>
            <div className="max-h-40 overflow-y-auto border rounded p-2 mb-2">
              {comments.length > 0 ? (
                comments.map((c) => (
                  <div key={c.id} className="mb-2 border-b pb-1">
                    <p className="text-sm">{c.texte}</p>
                    <span className="text-xs text-gray-400">
                      {new Date(c.created_at).toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">Aucun commentaire</p>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ajouter un commentaire..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 border p-2 rounded"
              />
              <button
                onClick={handleAddComment}
                className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
