"use client";
import React, { useState, useEffect } from 'react';
import Image from "next/image"
import {
  Heart,
  LogOut,
  FileText,
  TrendingUp,
  Plus,
  Save,
  X,
  Trash2,
  Users,
  Youtube,
  Loader2,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

export default function AdminDashboard({ onLogout, userToken, onNavigateToSignup }) {
  const [activeTab, setActiveTab] = useState('create');
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('post');
  const [loading, setLoading] = useState(false);
  const [existingContent, setExistingContent] = useState([]);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    author: '',
    authorAvatar: '',
    title: '',
    content: '',
    link: '',
    videoId: ''
  });

  useEffect(() => {
    fetchContent();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content');
      const data = await response.json();
      if (data.success) setExistingContent(data.content);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const extractYouTubeId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : url;
  };

  const handleCreateContent = async () => {
    if (!formData.author || !formData.title || !formData.content) {
      showToast('Please fill in all required fields', 'error'); return;
    }
    if (formType === 'article' && !formData.link) {
      showToast('Article link is required', 'error'); return;
    }
    if (formType === 'video' && !formData.videoId) {
      showToast('YouTube video URL is required', 'error'); return;
    }
    setLoading(true);
    try {
      const contentData = {
        type: formType,
        author: formData.author,
        authorAvatar: formData.authorAvatar || '👤',
        title: formData.title,
        content: formData.content,
        ...(formType === 'article' && { link: formData.link }),
        ...(formType === 'video' && { videoId: extractYouTubeId(formData.videoId) })
      };
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userToken}` },
        body: JSON.stringify(contentData)
      });
      const data = await response.json();
      if (data.success) {
        showToast('Content created successfully!', 'success');
        setFormData({ author: '', authorAvatar: '', title: '', content: '', link: '', videoId: '' });
        setShowForm(false);
        fetchContent();
      } else {
        showToast(data.message || 'Failed to create content', 'error');
      }
    } catch (error) {
      showToast('Failed to create content', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContent = async (id) => {
    if (!confirm('Are you sure you want to delete this content?')) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/content?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      const data = await response.json();
      if (data.success) { showToast('Content deleted successfully!', 'success'); fetchContent(); }
      else showToast(data.message || 'Failed to delete content', 'error');
    } catch (error) {
      showToast('Failed to delete content', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openCreateForm = (type) => {
    setFormType(type);
    setShowForm(true);
    setFormData({ author: '', authorAvatar: '', title: '', content: '', link: '', videoId: '' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getToastIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5" style={{ color: '#7cad8a' }} />;
      case 'error': return <XCircle className="h-5 w-5" style={{ color: '#c97878' }} />;
      case 'warning': return <AlertCircle className="h-5 w-5" style={{ color: '#c9a878' }} />;
      default: return <CheckCircle className="h-5 w-5" style={{ color: '#c9729a' }} />;
    }
  };

  const getToastStyles = (type) => {
    switch (type) {
      case 'success': return { background: 'rgba(124,173,138,0.12)', border: '1px solid rgba(124,173,138,0.3)', color: '#5a8a68' };
      case 'error': return { background: 'rgba(201,120,120,0.12)', border: '1px solid rgba(201,120,120,0.3)', color: '#a05050' };
      case 'warning': return { background: 'rgba(201,168,120,0.12)', border: '1px solid rgba(201,168,120,0.3)', color: '#8a6830' };
      default: return { background: 'rgba(201,114,154,0.12)', border: '1px solid rgba(201,114,154,0.3)', color: '#c9608c' };
    }
  };

  const handleAddUserClick = () => { if (onNavigateToSignup) onNavigateToSignup(); };

  return (
    <div style={{ background: 'linear-gradient(160deg, #fdf6f0 0%, #fef0f5 40%, #f5f0fe 100%)', minHeight: '100vh', fontFamily: "'Jost', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');

        .adm-glass-nav {
          background: rgba(255,248,245,0.88);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(220,160,150,0.2);
          box-shadow: 0 2px 24px rgba(200,130,120,0.08);
        }
        .adm-glass-card {
          background: rgba(255,252,250,0.78);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(220,180,170,0.3);
          box-shadow: 0 4px 32px rgba(190,130,150,0.09), 0 1px 0 rgba(255,255,255,0.8) inset;
        }
        .adm-glass-card-hover:hover {
          background: rgba(255,245,248,0.95);
          border-color: rgba(210,140,160,0.5);
          box-shadow: 0 12px 48px rgba(190,110,140,0.18), 0 1px 0 rgba(255,255,255,0.9) inset;
        }
        .adm-rose-btn {
          background: linear-gradient(135deg, #e8a0b0 0%, #d4779a 50%, #c9608c 100%);
          color: white;
          box-shadow: 0 4px 20px rgba(200,100,140,0.3);
          border: none;
        }
        .adm-rose-btn:hover {
          background: linear-gradient(135deg, #dc8ca0 0%, #c96888 50%, #bc4f7c 100%);
          box-shadow: 0 6px 28px rgba(200,100,140,0.45);
        }
        .adm-tab-active {
          background: linear-gradient(135deg, #e8a0b0, #c9608c);
          color: white;
          box-shadow: 0 4px 16px rgba(200,100,140,0.3);
        }
        .adm-tab-inactive {
          background: rgba(255,245,248,0.6);
          color: #9a7080;
          border: 1px solid rgba(215,170,185,0.3);
        }
        .adm-tab-inactive:hover {
          background: rgba(255,235,244,0.8);
          color: #c9608c;
        }
        .adm-input {
          background: rgba(255,248,252,0.7);
          border: 1px solid rgba(215,170,185,0.35);
          color: #4a2a3a;
          border-radius: 10px;
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          transition: all 0.2s;
        }
        .adm-input::placeholder { color: #c4a0b0; }
        .adm-input:focus {
          outline: none;
          border-color: rgba(201,96,140,0.5);
          box-shadow: 0 0 0 3px rgba(201,96,140,0.1);
          background: rgba(255,250,253,0.9);
        }
        .adm-delete-btn { color: #c4a0b0; transition: color 0.2s; }
        .adm-delete-btn:hover { color: #c97878; }
        .adm-logout-btn {
          background: rgba(201,120,120,0.1);
          color: #a05060;
          border: 1px solid rgba(201,120,120,0.25);
          border-radius: 20px;
          transition: all 0.2s;
        }
        .adm-logout-btn:hover {
          background: rgba(201,120,120,0.18);
        }
        .adm-modal-bg {
          background: rgba(60,20,40,0.35);
          backdrop-filter: blur(8px);
        }
        .adm-modal {
          background: linear-gradient(160deg, #fdf6f0, #fef0f8);
          border: 1px solid rgba(220,170,185,0.35);
          box-shadow: 0 24px 80px rgba(180,100,140,0.2);
        }
        .adm-modal-header {
          background: rgba(255,248,252,0.9);
          border-bottom: 1px solid rgba(215,170,185,0.25);
        }
        .adm-cancel-btn {
          background: rgba(215,190,200,0.25);
          color: #8a6070;
          border: 1px solid rgba(215,170,185,0.3);
          border-radius: 10px;
          transition: all 0.2s;
        }
        .adm-cancel-btn:hover {
          background: rgba(215,190,200,0.4);
        }
        .adm-content-card {
          background: rgba(255,252,250,0.75);
          border: 1px solid rgba(220,180,170,0.25);
          border-radius: 16px;
          transition: all 0.2s;
        }
        .adm-content-card:hover {
          border-color: rgba(210,140,160,0.4);
          box-shadow: 0 4px 20px rgba(190,110,150,0.1);
        }
        .adm-badge-admin {
          background: rgba(201,96,140,0.12);
          color: #c9608c;
          border: 1px solid rgba(201,96,140,0.25);
          border-radius: 20px;
          font-size: 0.72rem;
          padding: 2px 10px;
          font-family: 'Jost', sans-serif;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .adm-add-user-btn {
          background: linear-gradient(135deg, #e8a0b0 0%, #c9608c 100%);
          color: white;
          border: none;
          border-radius: 20px;
          padding: 10px 22px;
          font-family: 'Jost', sans-serif;
          font-weight: 500;
          font-size: 0.85rem;
          letter-spacing: 0.04em;
          box-shadow: 0 4px 16px rgba(201,96,140,0.28);
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .adm-add-user-btn:hover {
          transform: scale(1.04);
          box-shadow: 0 6px 24px rgba(201,96,140,0.38);
        }
        .adm-video-icon-wrap {
          background: linear-gradient(135deg, rgba(201,120,120,0.18), rgba(180,100,100,0.12));
        }
        .adm-video-btn {
          background: linear-gradient(135deg, #e8a0a0, #c97878);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 10px 20px;
          font-weight: 600;
          font-family: 'Jost', sans-serif;
          box-shadow: 0 4px 14px rgba(201,120,120,0.3);
          display: flex; align-items: center; gap: 6px;
          transition: all 0.2s;
        }
        .adm-video-btn:hover {
          background: linear-gradient(135deg, #dc8c8c, #b96060);
        }
        .adm-link-text { color: #c9729a; font-size: 0.88rem; word-break: break-all; }
        .adm-link-text:hover { color: #a05070; }
        .adm-video-id-text { color: #c9729a; font-size: 0.85rem; font-family: 'Jost', sans-serif; }
        .adm-empty-state { text-align: center; padding: 48px 0; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100]" style={{ animation: 'slideDown 0.3s ease' }}>
          <div className="flex items-center space-x-3 px-6 py-4 rounded-2xl shadow-2xl" style={{ ...getToastStyles(toast.type), minWidth: '300px', maxWidth: '420px', backdropFilter: 'blur(12px)', fontFamily: "'Jost', sans-serif" }}>
            {getToastIcon(toast.type)}
            <span className="flex-1 font-medium" style={{ fontSize: '0.9rem' }}>{toast.message}</span>
            <button onClick={() => setToast(null)} style={{ opacity: 0.6, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="adm-glass-nav sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Image src="/logo.png" alt="OBGYNE HITEC-IMS Logo" width={40} height={40} priority className="rounded-full hover:scale-105 transition-transform" />
              <div>
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, color: '#3d2535', fontSize: '1.2rem' }}>OBGYNE HITEC-IMS Admin</span>
                <span className="adm-badge-admin ml-2">Admin Panel</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2" style={{ color: '#9a7080' }}>
                <Users className="h-5 w-5" />
                <span className="hidden sm:inline" style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: '0.9rem' }}>Admin</span>
              </div>
              <button onClick={onLogout} className="adm-logout-btn flex items-center space-x-2 px-4 py-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline" style={{ fontFamily: "'Jost', sans-serif", fontSize: '0.85rem' }}>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Add User Button */}
      <div className="flex items-center justify-end px-24 pt-10">
        <button onClick={handleAddUserClick} className="adm-add-user-btn">
          <Plus className="h-5 w-5" />
          <span className="hidden sm:inline">Add New User</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#3d2535', fontSize: '2.2rem' }} className="mb-2">Content Management</h1>
          <p style={{ color: '#9a7888', fontFamily: "'Jost', sans-serif", fontWeight: 300 }}>Create and manage posts, articles, and videos</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button onClick={() => setActiveTab('create')} className={`px-6 py-3 rounded-full font-medium text-sm transition-all ${activeTab === 'create' ? 'adm-tab-active' : 'adm-tab-inactive'}`} style={{ fontFamily: "'Jost', sans-serif", letterSpacing: '0.04em' }}>
            Create Content
          </button>
          <button onClick={() => setActiveTab('manage')} className={`px-6 py-3 rounded-full font-medium text-sm transition-all ${activeTab === 'manage' ? 'adm-tab-active' : 'adm-tab-inactive'}`} style={{ fontFamily: "'Jost', sans-serif", letterSpacing: '0.04em' }}>
            Manage Content
          </button>
        </div>

        {/* Create Tab */}
        {activeTab === 'create' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Post Card */}
            <div className="adm-glass-card adm-glass-card-hover rounded-3xl p-8 cursor-pointer group transition-all hover:-translate-y-2" onClick={() => openCreateForm('post')}>
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg, rgba(220,155,185,0.22), rgba(185,155,220,0.18))' }}>
                  <FileText className="h-10 w-10" style={{ color: '#c9729a' }} />
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, color: '#3d2535', fontSize: '1.5rem' }} className="mb-3">Create Post</h3>
                <p style={{ color: '#9a7888', fontFamily: "'Jost', sans-serif", fontWeight: 300 }} className="mb-6">Share updates and insights</p>
                <button className="adm-rose-btn flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all" style={{ fontFamily: "'Jost', sans-serif", fontSize: '0.85rem' }}>
                  <Plus className="h-5 w-5" /><span>New Post</span>
                </button>
              </div>
            </div>

            {/* Article Card */}
            <div className="adm-glass-card adm-glass-card-hover rounded-3xl p-8 cursor-pointer group transition-all hover:-translate-y-2" onClick={() => openCreateForm('article')}>
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg, rgba(185,155,220,0.22), rgba(220,155,185,0.18))' }}>
                  <TrendingUp className="h-10 w-10" style={{ color: '#9060b0' }} />
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, color: '#3d2535', fontSize: '1.5rem' }} className="mb-3">Share Article</h3>
                <p style={{ color: '#9a7888', fontFamily: "'Jost', sans-serif", fontWeight: 300 }} className="mb-6">Link external resources</p>
                <button className="adm-rose-btn flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all" style={{ fontFamily: "'Jost', sans-serif", fontSize: '0.85rem' }}>
                  <Plus className="h-5 w-5" /><span>New Article</span>
                </button>
              </div>
            </div>

            {/* Video Card */}
            <div className="adm-glass-card adm-glass-card-hover rounded-3xl p-8 cursor-pointer group transition-all hover:-translate-y-2" onClick={() => openCreateForm('video')}>
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 adm-video-icon-wrap rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Youtube className="h-10 w-10" style={{ color: '#c97878' }} />
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, color: '#3d2535', fontSize: '1.5rem' }} className="mb-3">Add Video</h3>
                <p style={{ color: '#9a7888', fontFamily: "'Jost', sans-serif", fontWeight: 300 }} className="mb-6">Embed YouTube videos</p>
                <button className="adm-video-btn">
                  <Plus className="h-5 w-5" /><span>New Video</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Manage Tab */}
        {activeTab === 'manage' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, color: '#3d2535', fontSize: '1.5rem' }}>All Content ({existingContent.length})</h2>
            </div>

            {existingContent.map(item => (
              <div key={item.id} className="adm-content-card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl" style={{ background: 'rgba(220,175,190,0.2)', border: '1px solid rgba(215,165,185,0.3)' }}>{item.author_avatar}</div>
                    <div>
                      <h3 style={{ color: '#4a2a3a', fontFamily: "'Jost', sans-serif", fontWeight: 500 }}>{item.author}</h3>
                      <span style={{ color: '#b09098', fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: '0.82rem', textTransform: 'capitalize' }}>{item.type} • {formatDate(item.created_at)}</span>
                    </div>
                  </div>
                  <button className="adm-delete-btn p-2 disabled:opacity-50" onClick={() => handleDeleteContent(item.id)} disabled={loading}>
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, color: '#3d2535', fontSize: '1.15rem' }} className="mb-2">{item.title}</h2>
                <p style={{ color: '#7a6070', fontFamily: "'Jost', sans-serif", fontWeight: 300, lineHeight: 1.7 }} className="mb-3">{item.content}</p>
                {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="adm-link-text">{item.link}</a>}
                {item.video_id && <div className="mt-3"><span className="adm-video-id-text">YouTube Video ID: {item.video_id}</span></div>}
              </div>
            ))}

            {existingContent.length === 0 && (
              <div className="adm-empty-state">
                <div style={{ fontSize: '3.5rem' }} className="mb-4">📝</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, color: '#3d2535', fontSize: '1.4rem' }} className="mb-2">No content yet</h3>
                <p style={{ color: '#9a7888', fontFamily: "'Jost', sans-serif", fontWeight: 300 }}>Create your first content to get started</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Form Modal */}
      {showForm && (
        <div className="adm-modal-bg fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="adm-modal rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="adm-modal-header sticky top-0 p-6 flex justify-between items-center rounded-t-2xl">
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, color: '#3d2535', fontSize: '1.6rem', textTransform: 'capitalize' }}>Create {formType}</h2>
              <button onClick={() => setShowForm(false)} style={{ color: '#b09098', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#4a2a3a'} onMouseLeave={e => e.currentTarget.style.color = '#b09098'}>
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {[
                { label: 'Author Name *', name: 'author', type: 'text', placeholder: 'e.g., Dr. John Smith' },
                { label: 'Author Avatar (Emoji)', name: 'authorAvatar', type: 'text', placeholder: 'e.g., 👨‍⚕️ 👩‍⚕️ 📰' },
                { label: 'Title *', name: 'title', type: 'text', placeholder: 'Enter title' },
              ].map(field => (
                <div key={field.name}>
                  <label style={{ color: '#7a6070', fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: '0.88rem', display: 'block', marginBottom: '8px' }}>{field.label}</label>
                  <input type={field.type} name={field.name} value={formData[field.name]} onChange={handleInputChange} placeholder={field.placeholder} className="adm-input w-full px-4 py-3" />
                </div>
              ))}

              <div>
                <label style={{ color: '#7a6070', fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: '0.88rem', display: 'block', marginBottom: '8px' }}>Content *</label>
                <textarea name="content" value={formData.content} onChange={handleInputChange} placeholder="Enter content" rows="6" className="adm-input w-full px-4 py-3" style={{ resize: 'none' }} />
              </div>

              {formType === 'article' && (
                <div>
                  <label style={{ color: '#7a6070', fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: '0.88rem', display: 'block', marginBottom: '8px' }}>Article Link *</label>
                  <input type="url" name="link" value={formData.link} onChange={handleInputChange} placeholder="https://example.com/article" className="adm-input w-full px-4 py-3" />
                </div>
              )}

              {formType === 'video' && (
                <div>
                  <label style={{ color: '#7a6070', fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: '0.88rem', display: 'block', marginBottom: '8px' }}>YouTube Video URL or ID *</label>
                  <input type="text" name="videoId" value={formData.videoId} onChange={handleInputChange} placeholder="https://youtube.com/watch?v=... or just the video ID" className="adm-input w-full px-4 py-3" />
                  <p style={{ color: '#c4a0b0', fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: '0.8rem', marginTop: '6px' }}>Paste the full YouTube URL or just the video ID</p>
                </div>
              )}

              <div className="flex space-x-4 pt-4">
                <button onClick={handleCreateContent} disabled={loading} className="adm-rose-btn flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium disabled:opacity-50" style={{ fontFamily: "'Jost', sans-serif" }}>
                  {loading ? (<><Loader2 className="h-5 w-5 animate-spin" /><span>Publishing...</span></>) : (<><Save className="h-5 w-5" /><span>Publish</span></>)}
                </button>
                <button onClick={() => setShowForm(false)} className="adm-cancel-btn px-6 py-3 font-medium" style={{ fontFamily: "'Jost', sans-serif" }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 