<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;


class ProjectController extends Controller
{
    public function index()
    {
        // Lister tous les projets de l'utilisateur connecté
        $projects = Auth::user()->projects()->with('tasks')->get();
        return response()->json($projects);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        $project = auth()->user()->projects()->create([
            'name' => $request->name,
            'description' => $request->description
        ]);

        return response()->json($project, 201);
    }
    public function show($id)
    {
        $project = Project::with('tasks')->findOrFail($id);
        return response()->json($project);
    }

}
