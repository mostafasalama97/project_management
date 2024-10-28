import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const TaskDetail = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const history = useNavigate();

  const [task, setTask] = useState(null);
  const [error, setError] = useState('');

  const fetchTask = async () => {
    try {
      const res = await api.get(`/tasks/${id}`);
      setTask(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch task');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${id}`);
        history.push('/tasks');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  useEffect(() => {
    fetchTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!task) return <p>Loading...</p>;

  const canEdit =
    auth.user.role === 'Manager' || task.assignedTo.userId === auth.user.userId;

  return (
    <div>
      <h2>{task.taskName}</h2>
      <p><strong>Description:</strong> {task.description || 'N/A'}</p>
      <p><strong>Project:</strong> {task.project.projectName}</p>
      <p><strong>Assigned To:</strong> {task.assignedTo.username}</p>
      <p><strong>Start Date:</strong> {task.startDate || 'N/A'}</p>
      <p><strong>End Date:</strong> {task.endDate || 'N/A'}</p>
      <p><strong>Priority:</strong> {task.priority}</p>
      <p><strong>Status:</strong> {task.status}</p>

      {canEdit && (
        <div style={{ marginTop: '1rem' }}>
          <Link to={`/tasks/${task.taskId}/edit`}>
            <button>Edit Task</button>
          </Link>
          {auth.user.role === 'Manager' && (
            <button onClick={handleDelete} style={{ marginLeft: '1rem', backgroundColor: '#dc3545' }}>
              Delete Task
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskDetail;
