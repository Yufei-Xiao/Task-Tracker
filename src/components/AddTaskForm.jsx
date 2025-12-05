import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import "./AddTaskForm.css" // Don't forget to import the CSS file!

export default function AddTaskForm({ username, onClose, onTaskAdded }) {
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(""); // YYYY-MM-DD
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("Low"); // default Low
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return alert("Title is required");

    setLoading(true);

    // Insert new task into Supabase
    const { data, error } = await supabase.from("tasks").insert([
      {
        name: title,
        task: description,
        date: dueDate,
        category,
        priority,
        completed: false,
        username: username, // link task to user
        
      },
    ]).select();

    setLoading(false);

    if (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task");
    } else {
      if (onTaskAdded) {
        onTaskAdded(data[0]);
      } // add to TaskList immediately
       onClose(); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
        {/* Title and Description - Full Width */}
        <div className="form-group">
            <label htmlFor="task-title">Title</label>
            <input
                id="task-title"
                type="text"
                placeholder="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
        </div>

        <div className="form-group">
            <label htmlFor="task-description">Description</label>
            <textarea
                id="task-description"
                placeholder="Detailed description of the task..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
        </div>

        {/* Grouped Controls - Date, Category, Priority */}
        <div className="form-row">
            <div className="form-group">
                <label htmlFor="task-date">Due Date</label>
                <input
                    id="task-date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="task-category">Category</label>
                <select id="task-category" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="" disabled>Select Category</option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="School">School</option>
                </select>
            </div>
            
            <div className="form-group">
                <label htmlFor="task-priority">Priority</label>
                <select id="task-priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>
        </div>
        <div className="form-buttons">
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Adding..." : "Add Task"}
        </button>
        <button type="button" className="cancel-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
      
}