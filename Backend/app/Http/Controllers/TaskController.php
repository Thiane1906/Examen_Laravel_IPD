<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function show($id)
{
    $task = \App\Models\Task::with(['comments.author', 'project', 'assignedUser'])->findOrFail($id);
    return response()->json($task);
}

public function store(Request $request)
{
    $request->validate([
        'titre'       => 'required|string|max:255',
        'description' => 'nullable|string',
        'project_id'  => 'required|exists:projects,id',
        'assigned_to' => 'nullable|exists:users,id',
        'deadline'    => 'nullable|date'
    ]);

    $task = \App\Models\Task::create([
        'titre'       => $request->titre,
        'description' => $request->description,
        'project_id'  => $request->project_id,
        'assigned_to' => $request->assigned_to,
        'deadline'    => $request->deadline,
        'etat' => $request->etat ?? 'En attente',
    ]);
    if ($task) {
        # code...
        return response()->json($task, 201);
    }

    return response()->json([
        'message' => 'Erreur lors de la création de tache !'
    ]);



}
public function update(Request $request, $id)
{
    $task = \App\Models\Task::findOrFail($id);

    $task->update([
        'titre' => $request->titre ?? $task->titre,
        'description' => $request->description ?? $task->description,
        'etat' => $request->etat ?? $task->etat,
        'assigned_to' => $request->assigned_to ?? $task->assigned_to,
        'deadline' => $request->deadline ?? $task->deadline,
    ]);

    return response()->json([
        'message' => 'Tâche mise à jour avec succès',
        'task' => $task
    ]);
}


}
