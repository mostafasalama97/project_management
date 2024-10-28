import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { ProjectsContext } from '../../context/ProjectsContext';
import { AuthContext } from '../../context/AuthContext';

const EditProject = () => {
  const history = useNavigate();
  const { id } = useParams();
  const { fetchProjects } = useContext(ProjectsContext);
  const { auth } = useContext(AuthContext);

  const [form, setForm] = useState({
    projectName: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    status: 'Not Started',
  });
  const [error, setError] = useState('');

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setForm({
        projectName: res.data.projectName,
        description: res.data.description || '',
        startDate: res.data.startDate || '',
        endDate: res.data.endDate || '',
        budget: res.data.budget || '',
        status: res.data.status,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch project');
    }
  };

  useEffect(() => {
    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/projects/${id}`, form);
      console.log("Project updated successfully:", response.data);
      fetchProjects(); 
      history('/projects'); 
    } catch (err) {
      console.error("Error updating project:", err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to update project');
    }
  };
  
  if (auth.user.role !== 'Manager') {
    return <p>Access denied. Only managers can edit projects.</p>;
  }

  return (
    <div>
      <h2>Edit Project</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Project Name:</label>
          <input
            name="projectName"
            value={form.projectName}
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
          <label>Budget:</label>
          <input
            type="number"
            name="budget"
            value={form.budget}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Status:</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>
        <button type="submit">Update Project</button>
      </form>
    </div>
  );
};

export default EditProject;
