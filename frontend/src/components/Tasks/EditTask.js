import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ProjectsContext } from '../../context/ProjectsContext';

const EditTask = () => {
  const history = useNavigate();
  const { id } = useParams(); 
  const { auth } = useContext(AuthContext);
  const { projects, fetchProjects } = useContext(ProjectsContext);

  const [form, setForm] = useState({
    taskName: '',
    description: '',
    assignedTo: '',
    projectId: '',
    startDate: '',
    endDate: '',
    priority: 'Medium',
    status: 'Not Started',
  });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  // Fetch task details
  const fetchTask = async () => {
    try {
      const res = await api.get(`/tasks/${id}`);
      const task = res.data;

      // Check authorization
      if (
        auth.user.role !== 'Manager' &&
        task.assignedTo.userId !== auth.user.userId
      ) {
        setError('Access denied. You cannot edit this task.');
        return;
      }

      setForm({
        taskName: task.taskName,
        description: task.description || '',
        assignedTo: task.assignedTo.userId,
        projectId: task.project.projectId,
        startDate: task.startDate || '',
        endDate: task.endDate || '',
        priority: task.priority,
        status: task.status,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch task');
    }
  };

  // Fetch users for assignment
  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users'); 
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchTask();
    fetchUsers();
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/tasks/${id}`, form);
      console.log("Task updated successfully:", response.data);
      history(`/tasks/${id}`);
    } catch (err) {
      console.error("Error updating task:", err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h2>Edit Task</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Task Name:</label>
          <input
            name="taskName"
            value={form.taskName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Assigned To:</label>
          <select
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
            required
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.userId} value={user.userId}>
                {user.username} ({user.role})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Project:</label>
          <select
            name="projectId"
            value={form.projectId}
            onChange={handleChange}
            required
          >
            <option value="">Select Project</option>
            {projects.map((project) => (
              <option key={project.projectId} value={project.projectId}>
                {project.projectName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Priority:</label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <div>
          <label>Status:</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>
        <button type="submit">Update Task</button>
      </form>
    </div>
  );
};

export default EditTask;
