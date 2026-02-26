"use client";

import { useState } from "react";

type TaskStatus = "pending" | "completed";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

interface Props {
  task: Task;
  onDelete: (id: string) => void | Promise<void>;
  onToggle: (task: Task) => void | Promise<void>;
  onEdit: (id: string, title: string, description: string) => void | Promise<void>;
}

export default function TaskCard({ task, onDelete, onToggle, onEdit }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  return (
    <div className="bg-white p-4 shadow rounded mb-4 hover:shadow-lg transition">
      {isEditing ? (
        <>
          <input
            className="w-full border p-2 mb-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full border p-2 mb-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </>
      ) : (
        <>
          <h3 className="font-bold">{task.title}</h3>
          <p className="text-gray-600">{task.description}</p>
        </>
      )}

      <p className="text-sm mt-2 capitalize">{task.status}</p>

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onToggle(task)}
          className="bg-yellow-500 text-white px-3 py-1 rounded"
        >
          Toggle
        </button>

        {isEditing ? (
          <button
            onClick={() => {
              onEdit(task._id, title, description);
              setIsEditing(false);
            }}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            Edit
          </button>
        )}

        <button
          onClick={() => onDelete(task._id)}
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}