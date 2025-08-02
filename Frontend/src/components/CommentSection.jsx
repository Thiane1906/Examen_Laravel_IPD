import { useState } from 'react';

export default function CommentSection({ comments, onAdd }) {
  const [text, setText] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    onAdd(text);
    setText('');
  };

  return (
    <div>
      <h4 className="font-bold mb-2">Commentaires</h4>
      {comments.map(c => (
        <div key={c.id} className="border-b py-1">{c.texte}</div>
      ))}
      <form onSubmit={handleSubmit} className="mt-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          className="border p-1 w-full"
          placeholder="Ajouter un commentaire..."
        />
      </form>
    </div>
  );
}
