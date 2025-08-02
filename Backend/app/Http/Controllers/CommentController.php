<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, $id)
    {
        $request->validate([
            'texte' => 'required|string'
        ]);

        $task = \App\Models\Task::findOrFail($id);

        $comment = $task->comments()->create([
            'texte'    => $request->texte,
            'auteur_id'  => auth()->id(),
        ]);

        return response()->json($comment, 201);
    }

}
