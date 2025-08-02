import ProjectCard from "../components/ProjectCard"

export default function Dashboard() {
  // 🔁 Mock temporaire
  const projects = [
    { id: 1, name: "Projet CRM", description: "Gérer les clients et les leads" },
    { id: 2, name: "Intranet IPD", description: "Portail interne des étudiants" },
    { id: 3, name: "App RH", description: "Suivi des congés et bulletins" },
  ]

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Mes projets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))} */}
      </div>
    </div>
  )
}
