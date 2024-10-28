import React, { useState, useContext } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { ProjectsContext } from '../../context/ProjectsContext';

const ProjectForm = () => {
  const history = useNavigate();
  const { fetchProjects } = useContext(ProjectsContext);
  const [form, setForm] = useState({
    projectName: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    status: 'Not Started',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/projects', form);
      console.log("Project created successfully:", response.data);
      fetchProjects();
      history('/projects');
    } catch (err) {
      console.error("Error creating project:", err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to create project');
    }
  };
  
  return (
    <div>
      <h2>Create Project</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Project Name:</label>
          <input name="projectName" value={form.projectName} onChange={handleChange} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={form.description} onChange={handleChange} />
        </div>
        <div>
          <label>Start Date:</label>
          <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
        </div>
        <div>
          <label>End Date:</label>
          <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />
        </div>
        <div>
          <label>Budget:</label>
          <input type="number" name="budget" value={form.budget} onChange={handleChange} />
        </div>
        <div>
          <label>Status:</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>
        <button type="submit">Create Project</button>
      </form>
    </div>
  );
};

export default ProjectForm;
