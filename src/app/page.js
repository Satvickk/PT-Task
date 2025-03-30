"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faCheck,
  faMoon,
  faPlus,
  faSun,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [darkMode, setDarkMode] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const savedTheme = JSON.parse(localStorage.getItem("darkMode")) || false;
    setTasks(savedTasks);
    setDarkMode(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [tasks, darkMode]);

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { id: Date.now(), text: task, completed: false }]);
      setTask("");
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const openEditModal = (task) => {
    setEditTask(task);
    setEditText(task.text);
    setIsEditModalOpen(true);
  };

  const updateTask = () => {
    setTasks(
      tasks.map((t) => (t.id === editTask.id ? { ...t, text: editText } : t))
    );
    setIsEditModalOpen(false);
    setEditTask(null);
  };

  const filteredTasks = tasks
    .filter((t) => t.text.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "alphabetical") return a.text.localeCompare(b.text);
      if (sortBy === "status") return a.completed - b.completed;
      return 0;
    });

  return (
    <div
      className={`min-h-screen p-5 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="h-full w-full lg:max-w-7xl mx-auto">
        <div className="flex justify-between">
          <h1 className="font-bold text-2xl">Animated Todo App</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`mb-4 p-2 rounded-full shadow-md ${
              darkMode ? "bg-gray-800 shadow-gray-400" : "bg-gray-100"
            }`}
          >
            {darkMode ? (
              <FontAwesomeIcon className="h-6 w-6 text-white" icon={faSun} />
            ) : (
              <FontAwesomeIcon className="h-6 w-6 text-black" icon={faMoon} />
            )}
          </button>
        </div>

        {/* Top Dashbar */}
        <div className="grid sm:grid-cols-6 gap-2 mb-4">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter task..."
            className={`${
              darkMode
                ? "text-white placeholder-gray-500"
                : "text-black placeholder-gray-300"
            } border p-2 col-span-5 rounded`}
          />
          <button
            onClick={addTask}
            className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-white p-2 rounded col-span-1 shadow-md"
          >
            Create Todo{" "}
            <FontAwesomeIcon className="h-6 w-6 text-white" icon={faPlus} />
          </button>
        </div>
        <div className="grid sm:grid-cols-3 gap-2">
          <input
            type="text"
            placeholder="Search tasks..."
            className={`border rounded p-2 w-full sm:col-span-2 mb-4 ${
              darkMode
                ? "text-white placeholder-gray-500"
                : "text-black placeholder-gray-300"
            }`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border rounded p-2 mb-4 sm:col-span-1"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Sort By</option>
            <option value="alphabetical">Alphabetically</option>
            <option value="status">Incomplete First</option>
          </select>
        </div>

        {/* Todo board - All Todos */}
        <div>
          <h2 className="font-bold text-2xl my-4">All Todos</h2>
          <AnimatePresence>
            {filteredTasks.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                whileHover={{ scale: 1.05 }}
                className={`p-2 mb-2 sm:grid lg:grid-cols-4 sm:grid-cols-3 sm:gap-4 border rounded ${
                  t.completed ? "bg-green-300" : " bg-blue-200"
                }`}
              >
                <span
                  className={`text-black sm:col-span-2 lg:col-span-3 text-wrap cursor-pointer ${
                    t.completed ? "line-through" : ""
                  }`}
                  onClick={() => openEditModal(t)}
                >
                  {t.completed ? (
                    <FontAwesomeIcon className="h-6 w-6" icon={faCheck} />
                  ) : (
                    <FontAwesomeIcon className="h-6 w-6" icon={faBox} />
                  )}{" "}
                  {t.text}
                </span>

                <span className="sm:col-span-1 lg:col-span-1 flex gap-2 my-3">
                  {/* Stop event propagation for the button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // ⬅️ This prevents opening the edit modal
                      toggleComplete(t.id);
                    }}
                    className={` p-1 px-3 rounded-full border transition-all duration-300 hover:border-white hover:bg-white ${
                      t.completed
                        ? "border-red-500 text-red-500"
                        : "border-green-500 text-green-500"
                    }`}
                  >
                    Mark as {t.completed ? "incomplete" : "complete"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // ⬅️ Prevent edit modal opening on delete click
                      deleteTask(t.id);
                    }}
                    className="text-red-500 p-1 rounded-full border border-red-500 transition-all duration-300 hover:border-white hover:bg-white"
                  >
                    <FontAwesomeIcon className="h-6 w-6" icon={faTrash} />
                  </button>
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* edit modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-3 sm:px-0"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white p-5 rounded shadow-md"
            >
              <h2 className="text-xl font-bold mb-4">Edit Todo</h2>
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="border p-2 w-full mb-4"
              />
              <button
                onClick={updateTask}
                className="bg-blue-500 text-white p-2 rounded mr-3"
              >
                Update Todo
              </button>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-red-500 text-white p-2 rounded"
              >
                cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
