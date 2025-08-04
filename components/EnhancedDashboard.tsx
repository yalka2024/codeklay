'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  emailVerified?: boolean;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  createdAt: string;
}

export default function EnhancedDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  useEffect(() => {
    // Check for existing session
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      // In a real app, you'd validate the session with the server
      const userData = localStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    setShowAuth(false);
    // Store session data
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  const handleSignOut = () => {
    setUser(null);
    setProjects([]);
    localStorage.removeItem('sessionId');
    localStorage.removeItem('userData');
  };

  const handleCreateProject = async () => {
    if (!newProject.name.trim()) return;
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('sessionId')}`
        },
        body: JSON.stringify(newProject)
      });

      if (response.ok) {
        const project = await response.json();
        setProjects([project, ...projects]);
        setNewProject({ name: '', description: '' });
        setShowCreateProject(false);
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  if (showAuth) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh'
      }}>
        <h1 style={{ color: '#2563eb', fontSize: '2.5rem', marginBottom: '20px' }}>
          🚀 CodePal Platform
        </h1>
        
        <EnhancedAuthForm mode={authMode} onSuccess={handleAuthSuccess} />
        
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => setShowAuth(false)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ color: '#2563eb', fontSize: '1.8rem', margin: 0 }}>
            🚀 CodePal Platform
          </h1>
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ color: '#374151' }}>
                Welcome, {user.name || user.email}!
              </span>
              <button
                onClick={handleSignOut}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  setAuthMode('signin');
                  setShowAuth(true);
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setShowAuth(true);
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {!user ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px'
          }}>
            <div style={{
              background: '#10b981',
              color: 'white',
              padding: '30px',
              borderRadius: '12px',
              marginBottom: '30px',
              maxWidth: '600px',
              margin: '0 auto 30px auto'
            }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>✅ PLATFORM IS WORKING!</h2>
              <p style={{ fontSize: '1.2rem' }}>Next.js development server is operational</p>
            </div>

            <div style={{
              background: '#f0f9ff',
              border: '2px solid #0ea5e9',
              padding: '25px',
              borderRadius: '12px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <h3 style={{ color: '#0ea5e9', fontSize: '1.5rem', marginBottom: '15px' }}>🎉 Success!</h3>
              <p style={{ fontSize: '1.1rem', color: '#374151' }}>
                The CodePal platform is now running successfully. You can access it at:
              </p>
              <p style={{ 
                fontSize: '1.3rem', 
                fontWeight: 'bold', 
                color: '#2563eb',
                marginTop: '15px',
                padding: '10px',
                backgroundColor: '#eff6ff',
                borderRadius: '8px'
              }}>
                http://localhost:3006
              </p>
            </div>
          </div>
        ) : (
          <div>
            {/* Navigation Tabs */}
            <div style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '30px',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '10px'
            }}>
              {['dashboard', 'projects', 'marketplace', 'learning', 'profile'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: activeTab === tab ? '#2563eb' : 'transparent',
                    color: activeTab === tab ? 'white' : '#374151',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: activeTab === tab ? '600' : '400'
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'dashboard' && (
              <div>
                <h2 style={{ color: '#1f2937', marginBottom: '20px' }}>Dashboard</h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '20px'
                }}>
                  <div style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    <h3 style={{ color: '#2563eb', marginBottom: '10px' }}>📊 Statistics</h3>
                    <p>Projects: {projects.length}</p>
                    <p>Account Status: {user.emailVerified ? 'Verified' : 'Pending'}</p>
                  </div>
                  
                  <div style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    <h3 style={{ color: '#059669', marginBottom: '10px' }}>🚀 Quick Actions</h3>
                    <button
                      onClick={() => setShowCreateProject(true)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#059669',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        marginRight: '10px'
                      }}
                    >
                      New Project
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <h2 style={{ color: '#1f2937' }}>Projects</h2>
                  <button
                    onClick={() => setShowCreateProject(true)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#059669',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    + New Project
                  </button>
                </div>
                
                {projects.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    <p style={{ color: '#6b7280' }}>No projects yet. Create your first project!</p>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px'
                  }}>
                    {projects.map((project) => (
                      <div key={project.id} style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}>
                        <h3 style={{ color: '#1f2937', marginBottom: '10px' }}>{project.name}</h3>
                        <p style={{ color: '#6b7280', marginBottom: '10px' }}>{project.description}</p>
                        <span style={{
                          padding: '4px 8px',
                          backgroundColor: '#dbeafe',
                          color: '#2563eb',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          {project.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'marketplace' && (
              <div>
                <h2 style={{ color: '#1f2937', marginBottom: '20px' }}>Marketplace</h2>
                <div style={{
                  backgroundColor: 'white',
                  padding: '40px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <p style={{ color: '#6b7280' }}>Marketplace coming soon...</p>
                </div>
              </div>
            )}

            {activeTab === 'learning' && (
              <div>
                <h2 style={{ color: '#1f2937', marginBottom: '20px' }}>Learning Path</h2>
                <div style={{
                  backgroundColor: 'white',
                  padding: '40px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <p style={{ color: '#6b7280' }}>Learning features coming soon...</p>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h2 style={{ color: '#1f2937', marginBottom: '20px' }}>Profile</h2>
                <div style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <h3 style={{ color: '#2563eb', marginBottom: '15px' }}>Account Information</h3>
                  <p><strong>Name:</strong> {user.name || 'Not set'}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Email Verified:</strong> {user.emailVerified ? '✅ Yes' : '❌ No'}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Create Project Modal */}
      {showCreateProject && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#1f2937' }}>Create New Project</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Project Name
              </label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px'
                }}
                placeholder="Enter project name"
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Description
              </label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  minHeight: '100px'
                }}
                placeholder="Enter project description"
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowCreateProject(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 