import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  stack: string[];
  link: string;
  aspectRatio: 'square' | 'wide' | 'tall';
  sortOrder?: number;
}

interface SiteConfig {
  name: string;
  shortName: string;
  role: string;
  email: string;
  cvUrl?: string;
  hasCustomCv?: boolean;
  cvFileBase64?: string;
  links: {
    github: string;
    linkedin: string;
  };
  seo: {
    title: string;
    description: string;
    url: string;
  };
}

export const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'projects' | 'skills' | 'config'>('projects');
  
  // Dynamic lists loaded from API
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  
  // Loading & UI state
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Editing state for projects
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  
  // Project Form State
  const [projId, setProjId] = useState('');
  const [projTitle, setProjTitle] = useState('');
  const [projCategory, setProjCategory] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projImg, setProjImg] = useState('');
  const [projStack, setProjStack] = useState('');
  const [projLink, setProjLink] = useState('');
  const [projAspect, setProjAspect] = useState<'square' | 'wide' | 'tall'>('square');
  const [projSort, setProjSort] = useState(0);

  // Skill Form State
  const [newSkill, setNewSkill] = useState('');

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Check saved password on mount
  useEffect(() => {
    const savedPassword = localStorage.getItem('portfolio_admin_pass');
    if (savedPassword) {
      verifySavedPassword(savedPassword);
    }
  }, []);

  const verifySavedPassword = async (pass: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pass }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
        localStorage.setItem('portfolio_admin_pass', pass);
        // Load data once authenticated
        fetchData();
      } else {
        localStorage.removeItem('portfolio_admin_pass');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
        localStorage.setItem('portfolio_admin_pass', password);
        showToast('Login successful', 'success');
        fetchData();
      } else {
        setAuthError('Incorrect admin password');
      }
    } catch (e) {
      setAuthError('Error authenticating with server');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('portfolio_admin_pass');
    setIsAuthenticated(false);
    setPassword('');
    setProjects([]);
    setSkills([]);
    setConfig(null);
    showToast('Logged out successfully', 'success');
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projRes, skillsRes, configRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/skills'),
        fetch('/api/config')
      ]);
      
      if (projRes.ok) setProjects(await projRes.json());
      if (skillsRes.ok) setSkills(await skillsRes.json());
      if (configRes.ok) setConfig(await configRes.json());
    } catch (e) {
      showToast('Failed to fetch backend data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  // Convert uploaded image to Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      showToast('Image size exceeds 2MB limit', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProjImg(reader.result as string);
      showToast('Image uploaded and converted', 'success');
    };
    reader.readAsDataURL(file);
  };

  const resetProjectForm = () => {
    setProjId('');
    setProjTitle('');
    setProjCategory('');
    setProjDesc('');
    setProjImg('');
    setProjStack('');
    setProjLink('');
    setProjAspect('square');
    setProjSort(0);
    setEditingProject(null);
    setIsAddingProject(false);
  };

  const startEditProject = (p: Project) => {
    setEditingProject(p);
    setProjId(p.id);
    setProjTitle(p.title);
    setProjCategory(p.category);
    setProjDesc(p.description);
    setProjImg(p.image);
    setProjStack(p.stack.join(', '));
    setProjLink(p.link);
    setProjAspect(p.aspectRatio);
    setProjSort(p.sortOrder || 0);
    setIsAddingProject(true);
  };

  // CRUD for Projects
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingProject;
    if ((isEdit && !projId) || !projTitle || !projCategory || !projDesc) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('portfolio_admin_pass') || '';
    const projectData = {
      id: projId.trim().toLowerCase().replace(/\s+/g, '-'),
      title: projTitle,
      category: projCategory,
      description: projDesc,
      image_url: projImg,
      stack: projStack.split(',').map(s => s.trim()).filter(Boolean),
      link: projLink,
      aspect_ratio: projAspect,
      sort_order: Number(projSort)
    };

    const url = '/api/admin/projects';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData),
      });

      if (res.ok) {
        // Auto-add new skills to database if they don't exist
        const newSkills = projectData.stack.filter(
          (s) => !skills.some((existing) => existing.toLowerCase() === s.toLowerCase())
        );
        if (newSkills.length > 0) {
          await Promise.all(
            newSkills.map(async (skillName) => {
              try {
                await fetch('/api/admin/skills', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({ name: skillName })
                });
              } catch (err) {
                console.error('Error auto-adding skill tag:', skillName, err);
              }
            })
          );
        }

        showToast(isEdit ? 'Project updated successfully' : 'Project added successfully', 'success');
        resetProjectForm();
        fetchData();
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to save project', 'error');
      }
    } catch (e) {
      showToast('Network error saving project', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    setLoading(true);
    const token = localStorage.getItem('portfolio_admin_pass') || '';
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        showToast('Project deleted successfully', 'success');
        setProjectToDelete(null);
        fetchData();
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to delete project', 'error');
      }
    } catch (e) {
      showToast('Network error deleting project', 'error');
    } finally {
      setLoading(false);
    }
  };

  // CRUD for Skills
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    setLoading(true);
    const token = localStorage.getItem('portfolio_admin_pass') || '';
    try {
      const res = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newSkill.trim() })
      });

      if (res.ok) {
        showToast('Skill added successfully', 'success');
        setNewSkill('');
        fetchData();
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to add skill', 'error');
      }
    } catch (e) {
      showToast('Network error adding skill', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (name: string) => {
    setLoading(true);
    const token = localStorage.getItem('portfolio_admin_pass') || '';
    try {
      const res = await fetch(`/api/admin/skills?name=${encodeURIComponent(name)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        showToast('Skill removed successfully', 'success');
        fetchData();
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to remove skill', 'error');
      }
    } catch (e) {
      showToast('Network error removing skill', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Update Config Settings
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    setLoading(true);
    const token = localStorage.getItem('portfolio_admin_pass') || '';
    const configPayload: Record<string, string> = {
      name: config.name,
      shortName: config.shortName,
      role: config.role,
      email: config.email,
      github: config.links.github,
      linkedin: config.links.linkedin,
      seo_title: config.seo.title,
      seo_description: config.seo.description,
      seo_url: config.seo.url
    };

    if (config.cvFileBase64) {
      configPayload.cv_file_base64 = config.cvFileBase64;
    }

    try {
      const res = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(configPayload)
      });

      if (res.ok) {
        showToast('Configuration updated successfully', 'success');
        fetchData();
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to update settings', 'error');
      }
    } catch (e) {
      showToast('Network error updating settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateConfigField = (path: string, val: string) => {
    if (!config) return;
    const next = { ...config };
    if (path.startsWith('links.')) {
      const key = path.split('.')[1] as keyof typeof config.links;
      next.links = { ...next.links, [key]: val };
    } else if (path.startsWith('seo.')) {
      const key = path.split('.')[1] as keyof typeof config.seo;
      next.seo = { ...next.seo, [key]: val };
    } else {
      const key = path as keyof Omit<SiteConfig, 'links' | 'seo'>;
      (next[key] as string) = val;
    }
    setConfig(next);
  };

  // 1. Password Login View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex flex-col justify-center items-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-md p-8 rounded-2xl flex flex-col gap-6"
        >
          <div className="text-center">
            <h2 className="font-display text-2xl uppercase tracking-widest text-offwhite">Admin Portal</h2>
            <p className="font-mono text-xs text-gray-400 mt-2">Enter credentials to manage content</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-mono text-xs text-gray-400 uppercase tracking-widest">Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="bg-black/50 border border-white/15 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                required
              />
            </div>
            {authError && (
              <p className="font-mono text-xs text-red-500 mt-1">{authError}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-accent hover:bg-orange-600 disabled:opacity-50 text-white font-mono text-xs uppercase tracking-widest py-4 rounded-full transition-colors cursor-pointer text-center"
            >
              {loading ? 'Verifying...' : 'Login Dashboard'}
            </button>
          </form>
          
          <a href="/" className="font-mono text-xs text-center text-gray-500 hover:text-white transition-colors underline underline-offset-4">
            Return to Portfolio
          </a>
        </motion.div>
      </div>
    );
  }

  // 2. Logged-in Dashboard View
  return (
    <div className="min-h-screen bg-black text-offwhite pt-32 pb-24 px-6 md:px-16 lg:px-24">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-90 px-6 py-3 rounded-full font-mono text-xs uppercase tracking-wider flex items-center gap-2 ${
              toast.type === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}
          >
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-8">
          <div>
            <h1 className="font-impact text-5xl md:text-6xl text-offwhite uppercase tracking-tight">CONTROL PANEL</h1>
            <p className="font-mono text-xs text-accent uppercase tracking-widest mt-2">Saheer MK Portfolio CMS</p>
          </div>
          <div className="flex gap-3">
            <a
              href="/"
              className="px-5 py-2.5 rounded-full border border-white/15 font-mono text-xs uppercase tracking-wider hover:bg-white/5 transition-colors"
            >
              View Site
            </a>
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-4 font-mono text-xs uppercase tracking-widest border-b border-white/5 pb-4">
          {(['projects', 'skills', 'config'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                resetProjectForm();
              }}
              className={`pb-2 transition-all cursor-pointer relative ${
                activeTab === tab ? 'text-accent border-b-2 border-accent font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Loading Spinner Overlays */}
        {loading && !isAddingProject && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* TAB CONTENTS */}
        {!loading && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* PROJECTS TAB */}
            {activeTab === 'projects' && (
              <div className="flex flex-col gap-8">
                {!isAddingProject ? (
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                      <h3 className="font-mono text-lg text-white">Project List</h3>
                      <button
                        onClick={() => setIsAddingProject(true)}
                        className="bg-accent hover:bg-orange-600 text-white font-mono text-xs uppercase tracking-widest px-6 py-3 rounded-full cursor-pointer transition-colors"
                      >
                        + Add Project
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {projects.map((proj) => (
                        <div
                          key={proj.id}
                          className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col gap-4 justify-between"
                        >
                          <div className="flex flex-col gap-3">
                            <div className="aspect-video w-full rounded-lg overflow-hidden bg-black flex items-center justify-center relative border border-white/5">
                              {proj.image ? (
                                <img src={proj.image} alt={proj.title} className="object-cover w-full h-full" />
                              ) : (
                                <span className="font-mono text-xs text-gray-500">No Image</span>
                              )}
                              <span className="absolute top-2 left-2 bg-black/75 px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wider text-accent">
                                {proj.aspectRatio}
                              </span>
                            </div>
                            <div>
                              <div className="font-mono text-[10px] text-accent tracking-wider uppercase mb-1">{proj.category}</div>
                              <h4 className="font-display text-xl text-white font-medium">{proj.title}</h4>
                              <p className="text-gray-400 text-sm leading-relaxed mt-2 line-clamp-3">{proj.description}</p>
                            </div>
                          </div>

                          <div className="flex gap-2 border-t border-white/5 pt-4 mt-2">
                            <button
                              onClick={() => startEditProject(proj)}
                              className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-mono text-xs py-2 rounded-lg cursor-pointer transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setProjectToDelete(proj.id)}
                              className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-mono text-xs py-2 rounded-lg cursor-pointer transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSaveProject} className="max-w-3xl bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl flex flex-col gap-6">
                    <h3 className="font-mono text-lg text-white">
                      {editingProject ? `Edit Project: ${editingProject.title}` : 'Add New Project'}
                    </h3>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-xs text-gray-400 uppercase tracking-widest">Project Title (Required)</label>
                      <input
                        type="text"
                        value={projTitle}
                        onChange={(e) => setProjTitle(e.target.value)}
                        placeholder="e.g. Resulta Platform"
                        className="bg-black/50 border border-white/15 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-1.5 relative">
                        <label className="font-mono text-xs text-gray-400 uppercase tracking-widest">Category (Required)</label>
                        <input
                          type="text"
                          value={projCategory}
                          onChange={(e) => setProjCategory(e.target.value)}
                          placeholder="e.g. Web Application, Android App"
                          className="bg-black/50 border border-white/15 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                          required
                        />
                        {/* Category Suggestions List */}
                        {(() => {
                          const typed = projCategory.trim().toLowerCase();
                          const defaultCategories = ['Web Application', 'Android App', 'Mobile App', 'Open Source', 'Library', 'Design'];
                          const existingCats = Array.from(new Set(projects.map(p => p.category))).filter(Boolean);
                          const allCats = Array.from(new Set([...defaultCategories, ...existingCats]));
                          
                          const exactMatch = allCats.some(cat => cat.toLowerCase() === typed);
                          if (exactMatch) return null;
                          
                          const matches = allCats.filter(cat => 
                            cat.toLowerCase().includes(typed)
                          );
                          
                          if (typed === '' || matches.length === 0) return null;
                          
                          return (
                            <div className="absolute top-[100%] left-0 right-0 z-50 mt-1 bg-black/90 border border-white/15 rounded-lg p-2 flex flex-wrap gap-1.5 shadow-2xl backdrop-blur-md max-h-32 overflow-y-auto">
                              <span className="w-full text-[10px] font-mono text-gray-500 uppercase tracking-wider px-1 mb-1">Suggested Categories:</span>
                              {matches.map(cat => (
                                <button
                                  key={cat}
                                  type="button"
                                  onClick={() => setProjCategory(cat)}
                                  className="px-2.5 py-1 rounded bg-white/5 hover:bg-accent border border-white/10 text-[10px] font-mono text-gray-300 hover:text-white cursor-pointer transition-colors"
                                >
                                  {cat}
                                </button>
                              ))}
                            </div>
                          );
                        })()}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="font-mono text-xs text-gray-400 uppercase tracking-widest">Project Link URL</label>
                        <input
                          type="url"
                          value={projLink}
                          onChange={(e) => setProjLink(e.target.value)}
                          placeholder="e.g. https://resulta.pages.dev"
                          className="bg-black/50 border border-white/15 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-xs text-gray-400 uppercase tracking-widest">Description (Required)</label>
                      <textarea
                        value={projDesc}
                        onChange={(e) => setProjDesc(e.target.value)}
                        placeholder="Detailed project summary..."
                        rows={4}
                        className="bg-black/50 border border-white/15 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors resize-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-mono text-xs text-gray-400 uppercase tracking-widest">Aspect Ratio (Grid layout)</label>
                        <select
                          value={projAspect}
                          onChange={(e) => setProjAspect(e.target.value as any)}
                          className="bg-black/50 border border-white/15 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                        >
                          <option value="square">Square (1x1)</option>
                          <option value="wide">Wide (2x1)</option>
                          <option value="tall">Tall (1x2)</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5 relative">
                        <label className="font-mono text-xs text-gray-400 uppercase tracking-widest">Tech Stack (Comma Separated)</label>
                        <input
                          type="text"
                          value={projStack}
                          onChange={(e) => setProjStack(e.target.value)}
                          placeholder="e.g. React, TypeScript, Vite"
                          className="bg-black/50 border border-white/15 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                        />
                        {/* Suggestions List */}
                        {(() => {
                          const parts = projStack.split(',');
                          const currentPart = parts[parts.length - 1].trim();
                          const currentPartLower = currentPart.toLowerCase();
                          const previousPartsLower = parts.slice(0, -1).map(p => p.trim().toLowerCase());
                          
                          const matches = currentPart
                            ? skills.filter(skill => 
                                skill.toLowerCase().includes(currentPartLower) && 
                                !previousPartsLower.includes(skill.toLowerCase())
                              )
                            : [];
                          
                          if (matches.length === 0) return null;
                          
                          return (
                            <div className="absolute top-[100%] left-0 right-0 z-50 mt-1 bg-black/90 border border-white/15 rounded-lg p-2 flex flex-wrap gap-1.5 shadow-2xl backdrop-blur-md max-h-32 overflow-y-auto">
                              <span className="w-full text-[10px] font-mono text-gray-500 uppercase tracking-wider px-1 mb-1">Suggestions:</span>
                              {matches.map(skill => (
                                <button
                                  key={skill}
                                  type="button"
                                  onClick={() => {
                                    const newParts = [...parts];
                                    newParts[newParts.length - 1] = ` ${skill}`;
                                    setProjStack(newParts.join(',') + ', ');
                                  }}
                                  className="px-2.5 py-1 rounded bg-white/5 hover:bg-accent border border-white/10 text-[10px] font-mono text-gray-300 hover:text-white cursor-pointer transition-colors"
                                >
                                  {skill}
                                </button>
                              ))}
                            </div>
                          );
                        })()}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="font-mono text-xs text-gray-400 uppercase tracking-widest">Sort Order</label>
                        <input
                          type="number"
                          value={projSort}
                          onChange={(e) => setProjSort(Number(e.target.value))}
                          placeholder="0"
                          className="bg-black/50 border border-white/15 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                    </div>

                    {/* Image Upload Block */}
                    <div className="flex flex-col gap-3 border border-white/10 rounded-xl p-4 bg-black/30">
                      <label className="font-mono text-xs text-gray-400 uppercase tracking-widest">Project Showcase Image</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <div className="flex flex-col gap-2">
                          <input
                            type="text"
                            value={projImg}
                            onChange={(e) => setProjImg(e.target.value)}
                            placeholder="Enter image URL or upload file..."
                            className="bg-black/50 border border-white/15 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                          />
                          <span className="font-mono text-[10px] text-gray-500">Or drag & drop/select a local image:</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="font-mono text-xs text-gray-400 border-none outline-none p-1 cursor-pointer"
                          />
                        </div>
                        <div className="aspect-video w-full rounded-lg overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center relative">
                          {projImg ? (
                            <img src={projImg} alt="Preview" className="object-cover w-full h-full" />
                          ) : (
                            <span className="font-mono text-xs text-gray-600">Image Preview</span>
                          )}
                          {projImg && (
                            <button
                              type="button"
                              onClick={() => setProjImg('')}
                              className="absolute top-2 right-2 bg-red-600/90 text-white rounded-full p-1 cursor-pointer hover:bg-red-700 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end mt-4">
                      <button
                        type="button"
                        onClick={resetProjectForm}
                        className="px-6 py-3 rounded-full border border-white/15 font-mono text-xs uppercase tracking-wider hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-accent hover:bg-orange-600 text-white font-mono text-xs uppercase tracking-widest px-8 py-3 rounded-full cursor-pointer transition-colors"
                      >
                        Save Project
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* SKILLS TAB */}
            {activeTab === 'skills' && (
              <div className="max-w-3xl flex flex-col gap-8 bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl">
                <div>
                  <h3 className="font-mono text-lg text-white">Manage Skills</h3>
                  <p className="font-mono text-xs text-gray-400 mt-1">Add or remove pills that display in the About section</p>
                </div>

                <form onSubmit={handleAddSkill} className="flex gap-3 max-w-md">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g. Next.js, Docker..."
                    className="bg-black/50 border border-white/15 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors flex-1"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-accent hover:bg-orange-600 text-white font-mono text-xs uppercase tracking-widest px-6 rounded-lg cursor-pointer transition-colors"
                  >
                    Add
                  </button>
                </form>

                <div className="flex flex-wrap gap-2.5 border-t border-white/5 pt-6 mt-2">
                  {skills.map((skill) => (
                    <div
                      key={skill}
                      className="px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-300 font-mono text-xs flex items-center gap-2"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => handleDeleteSkill(skill)}
                        className="text-gray-500 hover:text-red-400 transition-colors font-bold cursor-pointer"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SITE CONFIG TAB */}
            {activeTab === 'config' && config && (
              <form onSubmit={handleSaveConfig} className="max-w-3xl bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl flex flex-col gap-6">
                <div>
                  <h3 className="font-mono text-lg text-white">Global Configuration</h3>
                  <p className="font-mono text-xs text-gray-400 mt-1">Manage static information used across components</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-xs text-gray-400 uppercase tracking-widest">Full Name</label>
                    <input
                      type="text"
                      value={config.name}
                      onChange={(e) => updateConfigField('name', e.target.value)}
                      className="bg-black/50 border border-white/15 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-xs text-gray-400 uppercase tracking-widest">Short Name (Nav)</label>
                    <input
                      type="text"
                      value={config.shortName}
                      onChange={(e) => updateConfigField('shortName', e.target.value)}
                      className="bg-black/50 border border-white/15 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-xs text-gray-400 uppercase tracking-widest">Role Title</label>
                    <input
                      type="text"
                      value={config.role}
                      onChange={(e) => updateConfigField('role', e.target.value)}
                      className="bg-black/50 border border-white/15 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-xs text-gray-400 uppercase tracking-widest">Contact Email</label>
                    <input
                      type="email"
                      value={config.email}
                      onChange={(e) => updateConfigField('email', e.target.value)}
                      className="bg-black/50 border border-white/15 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-xs text-gray-400 uppercase tracking-widest">CV File (PDF)</label>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-4">
                        <label className="bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 text-white font-mono text-xs uppercase tracking-widest px-4 py-2.5 rounded-lg cursor-pointer transition-colors w-fit">
                          Select PDF File
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              if (file.size > 1024 * 1024) {
                                showToast("File size exceeds 1MB limit. Please compress your PDF.", "error");
                                e.target.value = "";
                                return;
                              }
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const base64String = event.target?.result as string;
                                const base64Data = base64String.split(',')[1];
                                setConfig((prev) => {
                                  if (!prev) return null;
                                  return { ...prev, cvFileBase64: base64Data };
                                });
                              };
                              reader.readAsDataURL(file);
                            }}
                            className="hidden"
                          />
                        </label>
                        <span className="font-mono text-xs text-gray-400">
                          {config.cvFileBase64 ? "✓ Selected (Save to upload)" : (config.hasCustomCv ? "Custom PDF Active" : "Default PDF Active")}
                        </span>
                      </div>
                      <p className="font-mono text-[10px] text-gray-500">PDF format only. Maximum file size: 1MB.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5 pt-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-xs text-gray-400 uppercase tracking-widest">GitHub URL</label>
                    <input
                      type="url"
                      value={config.links.github}
                      onChange={(e) => updateConfigField('links.github', e.target.value)}
                      className="bg-black/50 border border-white/15 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-xs text-gray-400 uppercase tracking-widest">LinkedIn URL</label>
                    <input
                      type="url"
                      value={config.links.linkedin}
                      onChange={(e) => updateConfigField('links.linkedin', e.target.value)}
                      className="bg-black/50 border border-white/15 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-6 border-t border-white/5 pt-6">
                  <h4 className="font-mono text-xs text-accent uppercase tracking-widest border-b border-white/5 pb-2">SEO Configuration</h4>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-xs text-gray-400 uppercase tracking-widest">SEO Meta Title</label>
                    <input
                      type="text"
                      value={config.seo.title}
                      onChange={(e) => updateConfigField('seo.title', e.target.value)}
                      className="bg-black/50 border border-white/15 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-xs text-gray-400 uppercase tracking-widest">SEO Meta Description</label>
                    <textarea
                      value={config.seo.description}
                      onChange={(e) => updateConfigField('seo.description', e.target.value)}
                      rows={3}
                      className="bg-black/50 border border-white/15 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors resize-none"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-xs text-gray-400 uppercase tracking-widest">Production Site URL</label>
                    <input
                      type="url"
                      value={config.seo.url}
                      onChange={(e) => updateConfigField('seo.url', e.target.value)}
                      className="bg-black/50 border border-white/15 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end mt-4 border-t border-white/5 pt-6">
                  <button
                    type="submit"
                    className="bg-accent hover:bg-orange-600 text-white font-mono text-xs uppercase tracking-widest px-8 py-3 rounded-full cursor-pointer transition-colors"
                  >
                    Save Settings
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </div>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {projectToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProjectToDelete(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-zinc-900 border border-white/10 p-6 rounded-2xl flex flex-col gap-6 shadow-2xl z-10"
            >
              <div className="flex flex-col gap-2">
                <h3 className="font-display text-xl uppercase tracking-widest text-white">Delete Project</h3>
                <p className="font-mono text-xs text-gray-400 leading-relaxed">
                  Are you sure you want to permanently delete this project? This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3 justify-end font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setProjectToDelete(null)}
                  className="px-5 py-2.5 rounded-full border border-white/10 hover:bg-white/5 text-gray-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteProject(projectToDelete)}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Delete Project'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
