import React from 'react'
import './TaskItem.css'
export default function TaskItem({task,onDelete,onEditClick,changeCompleted}){
    return (
        <div className={`task-item-container ${task.completed ? 'completed' : ''}`}>
            <div className="title">{task.name}</div>
            <div className="description">{task.task}</div>
            <div className="metadata-row">
                <div className="time">Due date:{task.date}</div>
                <div className="priority">{task.priority==='Low' && <p>🟩 Low</p>}{task.priority==='Medium' && <p>🟨 Medium</p>}{task.priority==='High' && <p>🟥 High</p>}</div>
                <div className="category">{task.category==='School' && <p>School</p>}{task.category==='Work' && <p>Work</p>}{task.category==='Personal' && <p>Personal</p>}</div>
            </div>
            <div className="actions-row">
                <button className="changecompletion" onClick={()=>changeCompleted(task)}>{task.completed? '↩unmark' : '✔mark'}</button>
                <button className="edit" onClick={()=>onEditClick(task)}>✏edit</button>
                <button className='delete' onClick={()=>onDelete(task.id)}>❌delete</button>
            </div>
        </div>
    )
}