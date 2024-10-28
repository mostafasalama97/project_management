import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProjectsProvider } from './context/ProjectsContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProjectList from './components/Projects/ProjectList';
import ProjectDetail from './components/Projects/ProjectDetail';
import ProjectForm from './components/Projects/ProjectForm';
import EditProject from './components/Projects/EditProject';
import TaskList from './components/Tasks/TaskList';
import TaskDetail from './components/Tasks/TaskDetail';
import TaskForm from './components/Tasks/TaskForm';
import EditTask from './components/Tasks/EditTask';
import PrivateRoute from './utils/PrivateRoute';

const App = () => {
  return (
    <AuthProvider>
      <ProjectsProvider>
        <Router>
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/projects" element={<ProjectList />} />
                <Route path="/tasks" element={<TaskList />} />
              </Route>
              
              <Route element={<PrivateRoute roles={['Manager']} />}>
                <Route path="/projects/new" element={<ProjectForm />} />
                <Route path="/tasks/new" element={<TaskForm />} />
              </Route>
              
              <Route element={<PrivateRoute />}>
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/tasks/:id" element={<TaskDetail />} />
              </Route>
              
              <Route element={<PrivateRoute roles={['Manager']} />}>
                <Route path="/projects/:id/edit" element={<EditProject />} />
                <Route path="/tasks/:id/edit" element={<EditTask />} />
              </Route>

              {/* Redirect any unknown routes to /projects */}
              <Route path="*" element={<Navigate to="/projects" replace />} />
            </Routes>
          </div>
          <Footer />
        </Router>
      </ProjectsProvider>
    </AuthProvider>
  );
};

export default App;
