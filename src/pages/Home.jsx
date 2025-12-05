import React from'react'
import {useState,useEffect,useMemo} from 'react'
import Searchbar from '../components/Searchbar'
import TaskItem from '../components/TaskItem'
import TaskList from '../components/TaskList'
import { supabase } from "../supabaseClient";
import { useNavigate } from 'react-router-dom';
import AddTaskForm from '../components/AddTaskForm'
import "./Home.css"
export default function Home(){
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [sortMode, setSortMode] = useState("none");
    const[search,setSearch]=useState("")
    const[user,setUser]=useState(null);
    const [username, setUsername] = useState("");
    const [showAddTask, setShowAddTask] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [editFields, setEditFields] = useState({});
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error("Logout error:", error);
        else navigate("/"); // redirect to login page
    };
    async function handleDelete(id) {
        const confirmDelete = window.confirm("Are you sure you want to delete this task?");
        if (!confirmDelete) return;
        await supabase.from("tasks").delete().eq("id", id);

        // Remove from local state
        setTasks(prev => prev.filter(t => t.id !== id));
    }

    useEffect(() => {
        async function fetchUserAndTasks() {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) {
            console.error("Error fetching user:", userError);
            return;
            }
            if (!user) return;

            setUser(user);
            setUsername(user.user_metadata.username);

            // Now fetch tasks for this user
            const { data: tasksData, error: tasksError } = await supabase
            .from("tasks")
            .select("*")
            .eq("username", user.user_metadata.username)
            .order("date", { ascending: true });

            if (tasksError) console.error("Error fetching tasks:", tasksError);
            else {
                setTasks(tasksData || []);
                
            }
        }

        fetchUserAndTasks();
        }, []);
   
    const sortedTasks = useMemo(() => {
        let sorted = [...tasks];

        if (sortMode === "date") {
            sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        if (sortMode === "priority") {
            const order = { High: 1, Medium: 2, Low: 3 };
            sorted.sort((a, b) => order[a.priority] - order[b.priority]);
        }
        if(sortMode==="completed"){
            const completedTasks = sorted.filter(t => t.completed);
            const uncompletedTasks = sorted.filter(t => !t.completed);
            sorted=[...uncompletedTasks,...completedTasks]
        }
        return sorted;
    }, [tasks, sortMode]);

    function openEditPopup(task) {
        setEditingTask(task);
        setEditFields({ ...task }); 
    }

    function handleFieldChange(key, value) {
        setEditFields(prev => ({
        ...prev,
        [key]: value
        }));
    }

    async function saveEdit() {
        const { error } = await supabase
        .from("tasks")
        .update(editFields)
        .eq("id", editingTask.id);

        setTasks(prev =>
        prev.map(t => (t.id === editingTask.id ? editFields : t))
        );

        setEditingTask(null);
    }
    async function changeCompleted(task) {
        const newStatus = !task.completed;

        await supabase
            .from("tasks")
            .update({ completed: newStatus })
            .eq("id", task.id);

        setTasks(prev =>
            prev.map(t =>
            t.id === task.id ? { ...t, completed: newStatus } : t
            )
        );
    }
   

    // ... (Rest of your component logic and imports)

    if (!user) return <p>Loading user...</p>;

    return (
        <div className='main-content'>
            
            {/* Header Section */}
            <div className='app-header'>
                <div className='username'>Welcome, {username}</div>
                <button className='logout' onClick={handleLogout}>Log out</button>
            </div>

            {/* Title and Search */}
            <h1>
                {username}'s Tasks
            </h1>
            <Searchbar search={search} setSearch={setSearch}></Searchbar>

            {/* Control Bar (Add Task & Sorting) */}
            <div className='control-bar'>
                <button className='addtask' onClick={() => setShowAddTask(true)}>➕ Add New Task</button>
                <button className={sortMode === "date" ? "sort-button active" : "sort-button"} onClick={() => setSortMode("date")}>Sort by Due Date</button>
                <button className={sortMode === "priority" ? "sort-button active" : "sort-button"} onClick={() => setSortMode("priority")}>Sort by Priority</button>
                <button className={sortMode === "completed" ? "sort-button active" : "sort-button"} onClick={()=>setSortMode("completed")}>Sort by Completion</button>
                <button className="sort-button" onClick={() => setSortMode("none")}>Reset Sort</button>
            </div>

            {/* Add Task Form (Conditional Render) */}
            {showAddTask && (
                <AddTaskForm 
                    onClose={() => setShowAddTask(false)} 
                    username={username} 
                    onTaskAdded={newTask => {
                        setTasks(prev => [...prev, newTask])
                        
                    }}
                />
            )}

            {/* Task List */}
            <TaskList search={search} tasks={sortedTasks} onDelete={handleDelete} onEditClick={openEditPopup} changeCompleted={changeCompleted}>TaskList</TaskList>
            
            {/* Edit Modal (Conditional Render) */}
            {editingTask && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>✏️ Edit Task</h3>

                        {Object.entries(editFields).map(([key, value]) => {
                        if (key === "id") return null;  // don't edit ID
                        if(key==="username") return null;
                        if(key==="completed") return null;
                        const labelText = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim();

                        if (key === "priority") {
                            return (
                            <div key={key} className="modal-field">
                                <label>{labelText}</label>
                                <select
                                value={value}
                                onChange={(e) => handleFieldChange(key, e.target.value)}
                                >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                </select>
                            </div>
                            );
                        }

                        // Category dropdown
                        if (key === "category") {
                            return (
                            <div key={key} className="modal-field">
                                <label>{labelText}</label>
                                <select
                                value={value}
                                onChange={(e) => handleFieldChange(key, e.target.value)}
                                >
                                <option value="School">School</option>
                                <option value="Work">Work</option>
                                <option value="Personal">Personal</option>
                                </select>
                            </div>
                            );
                        }
                        
                        // Default input field (e.g., name, task, date)
                        return (
                            <div key={key} className="modal-field">
                            <label>{labelText}</label>
                            <input
                                type={key === 'date' ? 'date' : 'text'} /* Use date input for date field */
                                value={value}
                                onChange={(e) => handleFieldChange(key, e.target.value)}
                            />
                            </div>
                        );
                        })}

                        <div className="modal-buttons">
                            <button onClick={saveEdit}>Save Changes</button>
                            <button onClick={() => setEditingTask(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
        

}