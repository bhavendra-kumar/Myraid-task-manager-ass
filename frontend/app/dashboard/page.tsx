"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { api } from "@/lib/api";
import TaskCard from "@/components/TaskCard";
import TaskForm from "@/components/TaskForm";
import Spinner from "@/components/Spinner";

type TaskStatus = "pending" | "completed";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

const PAGE_SIZE = 10;

export default function DashboardPage() {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/tasks", {
        params: {
          page,
          limit: PAGE_SIZE,
          status: status || undefined,
          search: search || undefined
        }
      });

      const payload: unknown = res.data;

      let nextTasks: Task[] = [];
      let nextTotalPages: number | undefined;

      if (Array.isArray(payload)) {
        nextTasks = payload as Task[];
      } else if (payload && typeof payload === "object") {
        const obj = payload as { tasks?: unknown; totalPages?: unknown };
        if (Array.isArray(obj.tasks)) {
          nextTasks = obj.tasks as Task[];
        }
        if (typeof obj.totalPages === "number") {
          nextTotalPages = obj.totalPages;
        }
      }

      setTasks(nextTasks);

      if (typeof nextTotalPages === "number" && nextTotalPages >= 1) {
        setTotalPages(nextTotalPages);
      } else {
        // Backend currently returns an array only; infer whether a next page exists.
        setTotalPages(nextTasks.length === PAGE_SIZE ? page + 1 : page);
      }
    } catch (error: unknown) {
      const statusCode = axios.isAxiosError(error) ? error.response?.status : undefined;
      if (statusCode === 401) {
        router.push("/login");
        return;
      }
      const message = axios.isAxiosError(error)
        ? ((error.response?.data as { message?: unknown } | undefined)?.message as string | undefined) ||
          error.message
        : undefined;
      alert(message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [page, router, search, status]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      router.push("/login");
    }
  };

  const createTask = async (title: string, description: string) => {
    try {
      await api.post("/tasks", { title, description });
      setPage(1);
      await fetchTasks();
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? ((error.response?.data as { message?: unknown } | undefined)?.message as string | undefined) ||
          error.message
        : undefined;
      alert(message || "Failed to create task");
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      await fetchTasks();
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? ((error.response?.data as { message?: unknown } | undefined)?.message as string | undefined) ||
          error.message
        : undefined;
      alert(message || "Failed to delete task");
    }
  };

  const toggleStatus = async (task: Task) => {
    try {
      const nextStatus: TaskStatus = task.status === "pending" ? "completed" : "pending";
      await api.put(`/tasks/${task._id}`, { status: nextStatus });
      await fetchTasks();
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? ((error.response?.data as { message?: unknown } | undefined)?.message as string | undefined) ||
          error.message
        : undefined;
      alert(message || "Failed to update task");
    }
  };

  const editTask = async (id: string, title: string, description: string) => {
    try {
      await api.put(`/tasks/${id}`, { title, description });
      await fetchTasks();
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? ((error.response?.data as { message?: unknown } | undefined)?.message as string | undefined) ||
          error.message
        : undefined;
      alert(message || "Failed to edit task");
    }
  };

  const canGoNext = page < totalPages;

  return (
    <div className="max-w-5xl mx-auto mt-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-indigo-700">Dashboard</h2>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg mb-8">
        <TaskForm onCreate={createTask} />
      </div>

      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg mb-8 flex gap-4">
        <input
          placeholder="Search tasks..."
          className="border p-3 flex-1 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {loading ? (
        <Spinner />
      ) : tasks.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No tasks found</p>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onDelete={deleteTask}
            onToggle={toggleStatus}
            onEdit={editTask}
          />
        ))
      )}

      <div className="flex justify-center gap-4 mt-10">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-5 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
        >
          Prev
        </button>

        <span className="px-5 py-2 bg-indigo-100 rounded-lg font-medium">
          {page} / {totalPages}
        </span>

        <button
          disabled={!canGoNext}
          onClick={() => setPage(page + 1)}
          className="px-5 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}