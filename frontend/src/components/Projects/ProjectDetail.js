import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const history = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
      setTasks(res.data.tasks || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch project');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        history.push('/projects');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete project');
      }
    }
  };

  useEffect(() => {
    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!project) return <p>Loading...</p>;

  const canEdit = auth.user?.role === 'Manager';

  return (
    <div>
      <h2>{project.projectName}</h2>
      <p><strong>Description:</strong> {project.description || 'N/A'}</p>
      <p><strong>Start Date:</strong> {project.startDate || 'N/A'}</p>
      <p><strong>End Date:</strong> {project.endDate || 'N/A'}</p>
      <p><strong>Budget:</strong> ${project.budget || 'N/A'}</p>
      <p><strong>Status:</strong> {project.status}</p>
      <p><strong>Owner:</strong> {project.owner?.username || 'Unknown'}</p> {/* Safely access username */}

      {canEdit && (
        <div style={{ marginTop: '1rem' }}>
          <Link to={`/projects/${project.projectId}/edit`}>
            <button>Edit Project</button>
          </Link>
          <button onClick={handleDelete} style={{ marginLeft: '1rem', backgroundColor: '#dc3545' }}>
            Delete Project
          </button>
        </div>
      )}

      <h3>Tasks</h3>
      {tasks.length === 0 ? (
        <p>No tasks associated with this project.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.taskId}>
              <span>
                {task.taskName} - {task.status}
              </span>
              {(auth.user?.role === 'Manager' || task.assignedTo?.userId === auth.user?.userId) && (
                <Link to={`/tasks/${task.taskId}`}> Edit</Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectDetail;
