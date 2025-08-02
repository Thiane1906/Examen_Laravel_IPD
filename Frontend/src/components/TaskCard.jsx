export default function TaskCard({ task, onClick }) {
  return (
    <div
      className="border p-4 rounded shadow hover:bg-gray-50 cursor-pointer"
      onClick={() => onClick(task.id)}
    >
      <h3 className="font-semibold">{task.titre}</h3>
      <p>Statut : {task.etat}</p>
    </div>
  );
}
