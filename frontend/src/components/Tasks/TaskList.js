import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const TaskList = () => {
  const { auth } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); 
  const [filter, setFilter] = useState('All');

  // Fetch all tasks and overdue tasks on mount
  useEffect(() => {
    const fetchTasksData = async () => {
      try {
        const [tasksResponse, overdueResponse] = await Promise.all([
          api.get('/tasks'),
          api.get('/tasks/overdue')
        ]);
        setTasks(tasksResponse.data);
        setOverdueTasks(overdueResponse.data.map(task => task.taskId));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch tasks');
      } finally {
        setLoading(false); 
      }
    };

    fetchTasksData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle task deletion (Managers only)
  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        setTasks(tasks.filter(task => task.taskId !== taskId));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  // Handle filtering tasks by status
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Filter tasks based on selected status
  const filteredTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    return task.status === filter;
  });

  return (
    <div>
      <h2>Tasks</h2>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <>
          {/* Filter Tasks */}
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="statusFilter">Filter by Status: </label>
            <select id="statusFilter" value={filter} onChange={handleFilterChange}>
              <option value="All">All</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Task List */}
          {filteredTasks.length === 0 ? (
            <p>No tasks available.</p>
          ) : (
            <ul>
              {filteredTasks.map(task => {
                const isOverdue = overdueTasks.includes(task.taskId);
                const canEdit =
                  auth.user.role === 'Manager' || task.assignedTo.userId === auth.user.userId;

                return (
                  <li key={task.taskId} style={{ marginBottom: '1rem' }}>
                    <div>
                      <Link to={`/tasks/${task.taskId}`}>
                        <span style={{ fontWeight: isOverdue ? 'bold' : 'normal' }}>
                          {task.taskName} - {task.status} {isOverdue && <span className="overdue"> (Overdue)</span>}
                        </span>
                      </Link>
                    </div>
                    {canEdit && (
                      <div>
                        <Link to={`/tasks/${task.taskId}/edit`}>
                          <button>Edit</button>
                        </Link>
                        {auth.user.role === 'Manager' && (
                          <button
                            onClick={() => handleDelete(task.taskId)}
                            style={{ marginLeft: '0.5rem', backgroundColor: '#dc3545' }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default TaskList;
