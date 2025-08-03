// ... imports
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Navbar from "../components/Navbar";
import toast, { Toaster } from "react-hot-toast";
import TaskDetails from "./TaskDetails";

export default function ProjectKanban() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  
  const [columns, setColumns] = useState({
    todo: [],
    in_progress: [],
    done: [],
  });
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    titre: "",
    description: "",
    deadline: "",
    etat: "todo",
    assigned_to: "",
  });
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadProject();
    loadUsers();
  }, []);

  const loadProject = async () => {
    try {
      const res = await axiosInstance.get(`/projects/${id}`);
      setProject(res.data);
      const grouped = {
        todo: res.data.tasks.filter((t) => t.etat === "todo"),
        in_progress: res.data.tasks.filter((t) => t.etat === "in_progress"),
        done: res.data.tasks.filter((t) => t.etat === "done"),
      };
      setColumns(grouped);
    } catch (error) {
      toast.error("Erreur lors du chargement du projet");
    }
  };

  const loadUsers = async () => {
    try {
      const res = await axiosInstance.get("/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Erreur chargement users", error);
      toast.error("Erreur chargement utilisateurs");
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.titre.trim()) {
      toast.error("Le titre est obligatoire");
      return;
    }
    if (!newTask.etat) {
      toast.error("Veuillez sélectionner un statut");
      return;
    }
    try {
      await axiosInstance.post(`/tasks`, { ...newTask, project_id: id });
      toast.success("Tâche créée avec succès !");
      setShowModal(false);
      setNewTask({
        titre: "",
        description: "",
        deadline: "",
        etat: "todo",
        assigned_to: "",
      });
      loadProject();
    } catch (error) {
      toast.error("Erreur lors de la création de la tâche");
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      const items = Array.from(columns[source.droppableId]);
      const [moved] = items.splice(source.index, 1);
      items.splice(destination.index, 0, moved);
      setColumns({ ...columns, [source.droppableId]: items });
    } else {
      const sourceItems = Array.from(columns[source.droppableId]);
      const [moved] = sourceItems.splice(source.index, 1);
      const destItems = Array.from(columns[destination.droppableId]);
      moved.etat = destination.droppableId;
      destItems.splice(destination.index, 0, moved);

      setColumns({
        ...columns,
        [source.droppableId]: sourceItems,
        [destination.droppableId]: destItems,
      });

      try {
        await axiosInstance.put(`/tasks/${moved.id}`, { etat: moved.etat });
        toast.success("Statut mis à jour !");
      } catch {
        toast.error("Erreur lors de la mise à jour");
      }
    }
  };

  if (!project) return <div className="p-6">Chargement...</div>;

  return (
    <>
      <Toaster />
      <Navbar />
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Détails projet */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-emerald-600">{project.name}</h1>
          <p className="text-gray-600 mt-1">{project.description}</p>
          <div className="flex flex-wrap gap-3 mt-4 text-sm text-gray-600 font-bold">
            <span> Créé le {new Date(project.created_at).toLocaleDateString()}</span>
            <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium uppercase">
              {project.etat}
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 hover:bg-emerald-500 transition text-white px-5 py-2 rounded-lg shadow text-sm"
        >
          + Nouvelle tâche
        </button>
      </div>


        {/* Kanban */}
        <h2 className="text-xl font-semibold mb-4">Tâches</h2>
        <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.keys(columns).map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-100 rounded-xl p-4 shadow-sm min-h-[500px] flex flex-col"
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 capitalize border-b pb-2">
                    {status === "todo" ? "En attente" :
                    status === "in_progress" ? "En cours" :
                    "Terminée"}
                  </h2>
                  {columns[status].map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => setSelectedTaskId(task.id)}
                          className="bg-white p-4 rounded-lg shadow mb-3 hover:shadow-md cursor-pointer transition"
                        >
                          <h3 className="font-bold text-gray-800 text-sm">{task.titre}</h3>
                          <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>
                          <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                            <span> {task.deadline ? new Date(task.deadline).toLocaleDateString() : "Pas de deadline"}</span>
                         <span className="bg-emerald-600 text-white px-2 py-1 rounded-full text-[10px] whitespace-nowrap">
                          {task.assigned_user ? task.assigned_user.name : "Non assignée"}
                        </span>

                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>

        </DragDropContext>

        {selectedTaskId && (
          <TaskDetails
            taskId={selectedTaskId}
            onClose={() => setSelectedTaskId(null)}
            onTaskUpdated={(updatedTask) => {
              setColumns((prev) => {
                const newColumns = { ...prev };

                // Retirer la tâche de son ancienne colonne
                Object.keys(newColumns).forEach((status) => {
                  newColumns[status] = newColumns[status].filter(
                    (t) => t.id !== updatedTask.id
                  );
                });

                // Ajouter dans la bonne colonne
                const key = updatedTask.etat || "todo"; // fallback
                if (!newColumns[key]) newColumns[key] = [];
                newColumns[key].push(updatedTask);

                return newColumns;
              });
            }}
          />
        )}

        {/* Modal création tâche */}
        {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Créer une tâche</h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Titre"
                value={newTask.titre}
                onChange={(e) => setNewTask({ ...newTask, titre: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-emerald-400"
              />
              <textarea
                placeholder="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-emerald-400"
              />
              <input
                type="date"
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-emerald-400"
              />

              <select
                value={newTask.etat}
                onChange={(e) => setNewTask({ ...newTask, etat: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-emerald-400"
              >
                <option value="" selected>-- selectionner une option --</option>
                <option value="todo">En attente</option>
                <option value="in_progress">En cours</option>
                <option value="done">Terminée</option>
              </select>

              <select
                value={newTask.assigned_to}
                onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-emerald-400"
              >
                <option value="">Assigner à...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
              >
                Annuler
              </button>

              <button
                onClick={handleCreateTask}
                className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-500 rounded"
              >
                Créer
              </button>
            </div>
          </div>
        </div>


        )}
      </div>
    </>
  );
}
