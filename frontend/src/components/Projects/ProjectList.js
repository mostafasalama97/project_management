// src/components/Projects/ProjectList.js

import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { ProjectsContext } from '../../context/ProjectsContext';
import { AuthContext } from '../../context/AuthContext';

const ProjectList = () => {
  const { projects, fetchProjects } = useContext(ProjectsContext);
  const { auth } = useContext(AuthContext);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (projects.length === 0) return <p>No projects available.</p>;

  return (
    <div>
      <h2>Projects</h2>
      {error && <p className="error">{error}</p>}
      <ul>
        {projects.map((project) => (
          <li key={project.projectId}>
            <Link to={`/projects/${project.projectId}`}>{project.projectName}</Link>
            {auth.user.role === 'Manager' && (
              <Link to={`/projects/${project.projectId}/edit`}>
                <button>Edit</button>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
