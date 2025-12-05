import React from 'react'
import TaskItem from './TaskItem'
import {useState,useEffect} from 'react'
import {supabase} from '../supabaseClient'
export default function TaskList({search,tasks,onDelete,onEditClick,changeCompleted}){
    const filteredTasks = search
    ? tasks.filter(task => task.task.toLowerCase().includes(search.toLowerCase()))
    : tasks;

  if (!tasks) return <p>Loading...</p>;

  return (
    <div className="taskList">
      {filteredTasks.length === 0 ? (
        <p>No tasks, you can relax!</p>
      ) : (
        filteredTasks.map(task => (
          <TaskItem 
            task={task}
            onDelete={onDelete}
            onEditClick={onEditClick}
            changeCompleted={changeCompleted}
          />
        ))
      )}
    </div>
  );
}