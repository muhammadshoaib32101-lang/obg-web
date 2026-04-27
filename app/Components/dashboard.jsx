"use client";
import React, { useState, useEffect } from 'react';
import Image from "next/image"
import {
  Heart,
  Search,
  User,
  LogOut,
  Home,
  FileText,
  TrendingUp,
  Calendar,
  ExternalLink,
  Filter,
  Menu,
  X,
  Youtube,
  Loader2
} from 'lucide-react';

export default function UserDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/content');
      const data = await response.json();
      if (data.success) setPosts(data.content);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'all') return true;
    return post.type === activeTab;
  }).filter(post => {
    if (!searchQuery) return true;
    return post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'post': return <FileText className="h-4 w-4" />;
      case 'article': return <TrendingUp className="h-4 w-4" />;
      case 'video': return <Youtube className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
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

  return (
    <div style={{ background: 'linear-gradient(160deg, #fdf6f0 0%, #fef0f5 40%, #f5f0fe 100%)', minHeight: '100vh', fontFamily: "'Jost', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');

        .usr-glass-nav {
          background: rgba(255,248,245,0.88);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(220,160,150,0.2);
          box-shadow: 0 2px 24px rgba(200,130,120,0.08);
        }
        .usr-search-input {
          background: rgba(255,248,252,0.7);
          border: 1px solid rgba(215,170,185,0.35);
          color: #4a2a3a;
          border-radius: 24px;
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          transition: all 0.2s;
          width: 100%;
          padding: 8px 16px 8px 40px;
        }
        .usr-search-input::placeholder { color: #c4a0b0; }
        .usr-search-input:focus {
          outline: none;
          border-color: rgba(201,96,140,0.45);
          box-shadow: 0 0 0 3px rgba(201,96,140,0.1);
          background: rgba(255,250,253,0.9);
        }
        .usr-logout-btn {
          background: rgba(201,120,120,0.1);
          color: #a05060;
          border: 1px solid rgba(201,120,120,0.25);
          border-radius: 20px;
          transition: all 0.2s;
          display: flex; align-items: center; gap: 8px;
          padding: 8px 16px;
        }
        .usr-logout-btn:hover { background: rgba(201,120,120,0.18); }

        .usr-sidebar {
          background: rgba(255,252,250,0.82);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(220,180,170,0.3);
          border-radius: 20px;
          box-shadow: 0 4px 24px rgba(190,130,150,0.08);
          padding: 24px;
          height: fit-content;
        }
        .usr-sidebar-btn {
          width: 100%; display: flex; align-items: center; gap: 12px;
          padding: 12px 16px; border-radius: 12px;
          font-family: 'Jost', sans-serif; font-size: 0.9rem;
          transition: all 0.2s; cursor: pointer; border: none;
        }
        .usr-sidebar-btn-active {
          background: linear-gradient(135deg, #e8a0b0, #c9608c);
          color: white;
          box-shadow: 0 4px 14px rgba(201,96,140,0.25);
        }
        .usr-sidebar-btn-inactive {
          color: #9a7080;
          background: transparent;
        }
        .usr-sidebar-btn-inactive:hover {
          background: rgba(220,160,185,0.12);
          color: #c9608c;
        }
        .usr-sidebar-divider {
          border-top: 1px solid rgba(215,170,185,0.22);
          margin: 24px 0 16px;
          padding-top: 0;
        }
        .usr-tag {
          color: #c9729a;
          font-family: 'Jost', sans-serif; font-size: 0.88rem; font-weight: 300;
          cursor: pointer; display: block;
          transition: color 0.2s;
        }
        .usr-tag:hover { color: #a05070; }

        .usr-article-card {
          background: rgba(255,252,250,0.78);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(220,175,185,0.25);
          border-radius: 20px;
          padding: 24px;
          transition: all 0.25s;
        }
        .usr-article-card:hover {
          border-color: rgba(210,140,165,0.4);
          box-shadow: 0 8px 32px rgba(190,110,150,0.12);
          transform: translateY(-2px);
        }
        .usr-avatar-wrap {
          width: 48px; height: 48px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem;
          background: rgba(220,175,190,0.2);
          border: 1px solid rgba(215,165,185,0.3);
          flex-shrink: 0;
        }
        .usr-meta { color: #b09098; font-size: 0.8rem; font-family: 'Jost', sans-serif; font-weight: 300; }
        .usr-ext-link {
          display: inline-flex; align-items: center; gap: 6px;
          color: #c9729a; font-size: 0.88rem; word-break: break-all;
          transition: color 0.2s;
        }
        .usr-ext-link:hover { color: #a05070; }
        .usr-type-chip {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 10px; border-radius: 20px;
          font-family: 'Jost', sans-serif; font-size: 0.72rem; font-weight: 500;
          letter-spacing: 0.06em; text-transform: capitalize;
        }
        .usr-type-post { background: rgba(185,155,220,0.15); color: #9060b0; border: 1px solid rgba(185,155,220,0.3); }
        .usr-type-article { background: rgba(155,185,220,0.15); color: #5080b0; border: 1px solid rgba(155,185,220,0.3); }
        .usr-type-video { background: rgba(201,120,120,0.12); color: #a05050; border: 1px solid rgba(201,120,120,0.25); }

        .usr-empty-state { text-align: center; padding: 48px 0; }
        .usr-loading { display: flex; justify-content: center; align-items: center; padding: 80px 0; }

        .usr-mobile-menu-btn { color: #9a7080; transition: color 0.2s; }
        .usr-mobile-menu-btn:hover { color: #c9608c; }
        .usr-user-icon-btn { color: #9a7080; transition: color 0.2s; }
        .usr-user-icon-btn:hover { color: #c9608c; }
      `}</style>

      {/* Navbar */}
      <nav className="usr-glass-nav sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden usr-mobile-menu-btn">
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <Image src="/logo.png" alt="OBGYNE HITEC-IMS Logo" width={40} height={40} priority className="rounded-full hover:scale-105 transition-transform" />
              <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, color: '#3d2535', fontSize: '1.2rem' }}>OBGYNE HITEC-IMS</span>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#c4a0b0' }} />
                <input
                  type="text"
                  placeholder="Search posts, articles, videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="usr-search-input"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="usr-user-icon-btn">
                <User className="h-6 w-6" />
              </button>
              <button onClick={onLogout} className="usr-logout-btn">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline" style={{ fontFamily: "'Jost', sans-serif", fontSize: '0.85rem' }}>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#c4a0b0' }} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="usr-search-input"
              />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className={`${sidebarOpen ? 'block' : 'hidden'} lg:block lg:w-64 usr-sidebar sticky top-24`}>
            <h3 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 500, color: '#6a4858', fontSize: '0.88rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter className="h-4 w-4" style={{ color: '#c9729a' }} />
              Filter Content
            </h3>

            <div className="space-y-2">
              {[
                { id: 'all', label: 'All Content', icon: Home },
                { id: 'post', label: 'Posts', icon: FileText },
                { id: 'article', label: 'Articles', icon: TrendingUp },
                { id: 'video', label: 'Videos', icon: Youtube },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`usr-sidebar-btn ${activeTab === id ? 'usr-sidebar-btn-active' : 'usr-sidebar-btn-inactive'}`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            <div className="usr-sidebar-divider">
              <h4 style={{ color: '#b09098', fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Trending Topics</h4>
              <div className="space-y-2">
                {['#MentalHealth', '#AIinHealthcare', '#Telemedicine', '#CancerResearch'].map(tag => (
                  <span key={tag} className="usr-tag">{tag}</span>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Feed */}
          <main className="flex-1">
            <div className="mb-6">
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#3d2535', fontSize: '2rem' }} className="mb-2">Your Feed</h2>
              <p style={{ color: '#9a7888', fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: '0.88rem' }}>
                Showing {filteredPosts.length} {activeTab === 'all' ? 'items' : activeTab + 's'}
              </p>
            </div>

            {loading ? (
              <div className="usr-loading">
                <Loader2 className="h-10 w-10 animate-spin" style={{ color: '#c9729a' }} />
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPosts.map(post => (
                  <article key={post.id} className="usr-article-card">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="usr-avatar-wrap">{post.author_avatar}</div>
                        <div>
                          <h3 style={{ color: '#4a2a3a', fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: '0.95rem' }}>{post.author}</h3>
                          <div className="flex items-center space-x-2 usr-meta mt-1">
                            <Calendar className="h-3 w-3" style={{ color: '#c4a0b0' }} />
                            <span>{formatDate(post.created_at)}</span>
                            <span style={{ color: '#d4b0c0' }}>•</span>
                            <span className={`usr-type-chip ${post.type === 'post' ? 'usr-type-post' : post.type === 'article' ? 'usr-type-article' : 'usr-type-video'}`}>
                              {getTypeIcon(post.type)}
                              {post.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, color: '#3d2535', fontSize: '1.25rem', marginBottom: '10px' }}>{post.title}</h2>
                    <p style={{ color: '#7a6070', fontFamily: "'Jost', sans-serif", fontWeight: 300, lineHeight: 1.75, marginBottom: '14px' }}>{post.content}</p>

                    {post.link && (
                      <a href={post.link} target="_blank" rel="noopener noreferrer" className="usr-ext-link">
                        <ExternalLink className="h-4 w-4 flex-shrink-0" />
                        <span style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>{post.link}</span>
                      </a>
                    )}

                    {post.video_id && (
                      <div className="mt-4">
                        <div className="relative w-full" style={{ paddingBottom: '56.25%', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(215,170,185,0.3)' }}>
                          <iframe
                            className="absolute top-0 left-0 w-full h-full"
                            style={{ borderRadius: '14px' }}
                            src={`https://www.youtube.com/embed/${post.video_id}`}
                            title={post.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    )}
                  </article>
                ))}

                {filteredPosts.length === 0 && !loading && (
                  <div className="usr-empty-state">
                    <div style={{ fontSize: '3.5rem' }} className="mb-4">🔍</div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, color: '#3d2535', fontSize: '1.4rem' }} className="mb-2">No results found</h3>
                    <p style={{ color: '#9a7888', fontFamily: "'Jost', sans-serif", fontWeight: 300 }}>Try adjusting your filters or search query</p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}