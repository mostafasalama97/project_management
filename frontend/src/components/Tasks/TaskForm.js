import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const TaskForm = () => {
  const history = useNavigate();
  const { id } = useParams();
  const { auth } = useContext(AuthContext);

  const isEdit = Boolean(id);

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
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users'); 
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    }
  };

  const fetchTask = async () => {
    try {
      const res = await api.get(`/tasks/${id}`);
      const task = res.data;
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

  useEffect(() => {
    fetchProjects();
    fetchUsers();
    if (isEdit) {
      fetchTask();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = isEdit
        ? await api.put(`/tasks/${id}`, form)
        : await api.post('/tasks', form);
      console.log(isEdit ? "Task updated" : "Task created", response.data);
      history('/tasks');
    } catch (err) {
      console.error("Error saving task:", err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to save task');
    }
  };

  return (
    <div>
      <h2>{isEdit ? 'Edit Task' : 'Create Task'}</h2>
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
        <button type="submit">{isEdit ? 'Update Task' : 'Create Task'}</button>
      </form>
    </div>
  );
};

export default TaskForm;
