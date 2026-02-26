"use client";

import { useState } from "react";

interface Props {
  onCreate: (title: string, description: string) => void;
}

export default function TaskForm({ onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !description) return;
    onCreate(title, description);
    setTitle("");
    setDescription("");
  };

  return (
    <div className="bg-white p-4 shadow rounded mb-6">
      <h3 className="font-semibold mb-3">Create Task</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full border p-2 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Add Task
        </button>
      </form>
    </div>
  );
}