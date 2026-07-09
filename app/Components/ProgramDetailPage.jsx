"use client";
import { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, FileText, Play, BookOpen, AlignLeft,
  Calendar, Film, X, Search, Loader2, Maximize2
} from 'lucide-react';

const PROGRAM_META = {
  postgraduate: {
    title: 'Postgraduate Programs',
    subtitle: 'FCPS & MD Residency Training',
    description: 'Comprehensive postgraduate training in Obstetrics & Gynecology including FCPS and MD residency programs with structured clinical exposure.',
    gradient: 'linear-gradient(135deg, #c9608c 0%, #9060b0 50%, #6040a0 100%)',
    bgGradient: 'linear-gradient(160deg, #fdf0f8 0%, #f5f0fe 100%)',
    emoji: '🎓',
  },
  house_officer: {
    title: 'House Officer Training',
    subtitle: 'Structured One-Year Programme',
    description: 'Structured one-year house job programme in OBGYN with rotations through labor ward, gynecology ward, OPD, and emergency.',
    gradient: 'linear-gradient(135deg, #38a878 0%, #2070a0 50%, #1a5080 100%)',
    bgGradient: 'linear-gradient(160deg, #f0fdf8 0%, #f0f5fe 100%)',
    emoji: '🏥',
  },
  mbbs: {
    title: 'MBBS Clinical Rotation',
    subtitle: 'Undergraduate Clinical Training',
    description: 'Clinical training for final-year MBBS students in obstetrics and gynecology, covering OPD, labour room, and ward management.',
    gradient: 'linear-gradient(135deg, #e8a878 0%, #c06030 50%, #a04020 100%)',
    bgGradient: 'linear-gradient(160deg, #fdf8f0 0%, #fef0f0 100%)',
    emoji: '📋',
  },
};

const TYPE_STYLES = {
  curriculum:   { bg: 'rgba(201,96,140,0.10)',  color: '#c9608c', border: 'rgba(201,96,140,0.22)' },
  schedule:     { bg: 'rgba(56,168,120,0.10)',   color: '#38a878', border: 'rgba(56,168,120,0.22)' },
  guide:        { bg: 'rgba(80,140,210,0.10)',   color: '#508cd2', border: 'rgba(80,140,210,0.22)' },
  announcement: { bg: 'rgba(232,168,120,0.12)',  color: '#c07840', border: 'rgba(232,168,120,0.28)' },
  video:        { bg: 'rgba(201,100,100,0.10)',  color: '#c96060', border: 'rgba(201,100,100,0.22)' },
  document:     { bg: 'rgba(100,100,201,0.10)',  color: '#6464c9', border: 'rgba(100,100,201,0.22)' },
};

const TYPE_ICONS = {
  curriculum:   <BookOpen style={{ width: 13, height: 13 }} />,
  schedule:     <Calendar style={{ width: 13, height: 13 }} />,
  guide:        <FileText style={{ width: 13, height: 13 }} />,
  announcement: <AlignLeft style={{ width: 13, height: 13 }} />,
  video:        <Play     style={{ width: 13, height: 13 }} />,
  document:     <FileText style={{ width: 13, height: 13 }} />,
};

function getLinkKind(item) {
  const link = item.link || '';
  const lo = link.toLowerCase();
  if (/\.(mp4|webm|mov|avi)(\?|#|$)/.test(lo)) return 'video';
  if (/\.pdf(\?|#|$)/.test(lo))                  return 'pdf';
  if (/\.(jpe?g|png|gif|webp)(\?|#|$)/.test(lo)) return 'image';
  if (link) return 'text';
  return 'none';
}

function formatDate(ds) {
  return new Date(ds).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function ProgramDetailPage({ programSlug, onBack }) {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const viewerRef = useRef(null);

  const meta = PROGRAM_META[programSlug] || PROGRAM_META.postgraduate;

  const handleFullscreen = () => {
    const el = viewerRef.current;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  };

  useEffect(() => {
    setLoading(true);
    setContent([]);
    fetch(`/api/programs?category=${programSlug}`)
      .then(r => r.json())
      .then(d => { if (d.success) setContent(d.content); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [programSlug]);

  const filtered = content.filter(item => {
    const matchFilter = activeFilter === 'all' || item.type === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || item.title.toLowerCase().includes(q) || (item.content && item.content.toLowerCase().includes(q));
    return matchFilter && matchSearch;
  });

  return (
    <div style={{ background: meta.bgGradient, minHeight: '100vh', fontFamily: "'Jost', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');
        .pd-nav{background:rgba(255,248,245,0.92);backdrop-filter:blur(18px);border-bottom:1px solid rgba(220,160,150,0.2);box-shadow:0 2px 24px rgba(200,130,120,0.07);}
        .pd-back-btn{display:flex;align-items:center;gap:7px;padding:8px 18px;border-radius:30px;background:rgba(255,248,252,0.85);border:1px solid rgba(215,170,185,0.35);color:#7a6070;font-family:'Jost',sans-serif;font-size:0.84rem;cursor:pointer;transition:all 0.2s;}
        .pd-back-btn:hover{background:rgba(255,232,242,0.96);color:#c9608c;border-color:rgba(201,96,140,0.4);transform:translateX(-2px);}
        .pd-filter-btn{padding:8px 18px;border-radius:30px;font-family:'Jost',sans-serif;font-size:0.82rem;cursor:pointer;transition:all 0.2s;background:rgba(255,245,248,0.7);color:#9a7080;border:1px solid rgba(215,170,185,0.3);text-transform:capitalize;}
        .pd-filter-btn:hover{background:rgba(255,232,242,0.88);color:#c9608c;}
        .pd-filter-btn.pd-active{background:linear-gradient(135deg,#e8a0b0,#c9608c)!important;color:#fff!important;border:none!important;box-shadow:0 4px 16px rgba(200,100,140,0.28);}
        .pd-search-wrap{position:relative;}
        .pd-search-wrap svg{position:absolute;left:12px;top:50%;transform:translateY(-50%);pointer-events:none;}
        .pd-search-input{background:rgba(255,248,252,0.85);border:1px solid rgba(215,170,185,0.35);color:#4a2a3a;border-radius:30px;padding:8px 16px 8px 36px;font-family:'Jost',sans-serif;font-size:0.84rem;width:210px;transition:all 0.2s;}
        .pd-search-input::placeholder{color:#c4a0b0;}
        .pd-search-input:focus{outline:none;border-color:rgba(201,96,140,0.5);box-shadow:0 0 0 3px rgba(201,96,140,0.09);}
        .pd-card{background:rgba(255,252,250,0.82);backdrop-filter:blur(12px);border:1px solid rgba(220,180,170,0.28);border-radius:18px;transition:all 0.25s;cursor:pointer;}
        .pd-card:hover{background:rgba(255,248,252,0.96);border-color:rgba(210,140,160,0.5);box-shadow:0 12px 48px rgba(190,100,140,0.13);transform:translateY(-3px);}
        .pd-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:0.7rem;font-weight:500;letter-spacing:0.07em;text-transform:uppercase;font-family:'Jost',sans-serif;}
        .pd-card-footer{display:flex;align-items:center;justify-content:space-between;padding-top:12px;margin-top:4px;border-top:1px solid rgba(200,150,165,0.13);}
        .pd-modal-bg{position:fixed;inset:0;z-index:60;background:rgba(20,5,15,0.55);backdrop-filter:blur(16px);display:flex;align-items:center;justify-content:center;padding:16px;}
        .pd-modal{background:linear-gradient(160deg,#fdf6f0,#fef0f8);border:1px solid rgba(220,170,185,0.35);box-shadow:0 28px 80px rgba(180,90,140,0.22);border-radius:22px;max-width:860px;width:100%;max-height:92vh;overflow-y:auto;}
        .pd-modal-header{position:sticky;top:0;z-index:2;background:rgba(253,246,240,0.97);backdrop-filter:blur(12px);border-bottom:1px solid rgba(215,170,185,0.22);border-radius:22px 22px 0 0;padding:22px 24px 18px;display:flex;align-items:flex-start;justify-content:space-between;gap:16px;}
        .pd-close-btn{background:none;border:none;cursor:pointer;color:#b09098;padding:4px;border-radius:8px;transition:all 0.2s;flex-shrink:0;}
        .pd-close-btn:hover{color:#4a2a3a;background:rgba(220,170,185,0.15);}
        .pd-video-wrap{position:relative;padding-top:56.25%;border-radius:14px;overflow:hidden;margin-bottom:16px;}
        .pd-video-wrap video{position:absolute;inset:0;width:100%;height:100%;background:#000;}
        .pd-pdf-wrap{width:100%;height:560px;border-radius:12px;overflow:hidden;margin-bottom:16px;border:1px solid rgba(215,170,185,0.2);}
        .pd-pdf-wrap iframe{width:100%;height:100%;border:none;display:block;}
        .pd-modal-text{color:#7a6070;font-family:'Jost',sans-serif;font-weight:300;line-height:1.85;font-size:0.95rem;white-space:pre-wrap;}
        .pd-fs-btn{position:absolute;top:10px;right:10px;z-index:10;width:34px;height:34px;border-radius:8px;background:rgba(0,0,0,0.42);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.2s;}
        .pd-fs-btn:hover{background:rgba(0,0,0,0.66);}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      `}</style>

      <nav className="pd-nav sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={onBack} className="pd-back-btn"><ArrowLeft style={{ width: 15, height: 15 }} /> Back to Home</button>
            <div className="flex items-center gap-3">
              <span style={{ fontSize: '1.4rem' }}>{meta.emoji}</span>
              <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 500, color: '#3d2535', fontSize: '1.1rem' }}>{meta.title}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative overflow-hidden" style={{ background: meta.gradient, minHeight: 240 }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0.08) 0%,rgba(0,0,0,0.03) 100%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <div style={{ fontSize: '3.5rem', marginBottom: 16, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}>{meta.emoji}</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 300, color: 'white', fontSize: '2.8rem', lineHeight: 1.2, textShadow: '0 2px 20px rgba(0,0,0,0.18)', marginBottom: 8 }}>{meta.title}</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontFamily: "'Jost',sans-serif", fontWeight: 300, fontSize: '1rem', marginBottom: 12 }}>{meta.subtitle}</p>
          <p style={{ color: 'rgba(255,255,255,0.88)', fontFamily: "'Jost',sans-serif", fontWeight: 300, maxWidth: 580, margin: '0 auto', fontSize: '1rem', lineHeight: 1.65 }}>{meta.description}</p>
          {content.length > 0 && (
            <div className="mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-full" style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}>
              <span style={{ color: 'rgba(255,255,255,0.95)', fontSize: '0.85rem', fontFamily: "'Jost',sans-serif" }}>{content.length} item{content.length !== 1 ? 's' : ''} available</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row gap-4 mb-10 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {['all', 'curriculum', 'schedule', 'guide', 'announcement', 'video', 'document'].map(f => (
              <button key={f} onClick={() => setActiveFilter(f)} className={`pd-filter-btn ${activeFilter === f ? 'pd-active' : ''}`}>
                {f === 'all' ? 'All Content' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="pd-search-wrap">
            <Search style={{ width: 14, height: 14, color: '#c4a0b0' }} />
            <input type="text" placeholder="Search content…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pd-search-input" />
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 80, paddingBottom: 80, gap: 16 }}>
            <Loader2 style={{ width: 40, height: 40, color: '#c9608c', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#9a7888', fontFamily: "'Jost',sans-serif", fontWeight: 300 }}>Loading content…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 80, paddingBottom: 80, textAlign: 'center' }}>
            <div style={{ fontSize: '3.8rem', marginBottom: 20 }}>{meta.emoji}</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 400, color: '#3d2535', fontSize: '1.6rem', marginBottom: 10 }}>{searchQuery ? 'No results found' : 'No content yet'}</h3>
            <p style={{ color: '#9a7888', fontFamily: "'Jost',sans-serif", fontWeight: 300, maxWidth: 380 }}>{searchQuery ? 'Try different search terms or clear the filter.' : 'Content for this programme will appear here once published by the admin.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(item => {
              const ts = TYPE_STYLES[item.type] || TYPE_STYLES.document;
              const kind = getLinkKind(item);
              return (
                <div key={item.id} className="pd-card p-6" onClick={() => setSelectedItem(item)}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <span className="pd-badge" style={{ background: ts.bg, color: ts.color, border: `1px solid ${ts.border}` }}>{TYPE_ICONS[item.type] || <FileText style={{ width: 13, height: 13 }} />} {item.type}</span>
                    {kind === 'video' && <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#e8a0a0,#c97878)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Play style={{ width: 13, height: 13, color: 'white', marginLeft: 2 }} /></div>}
                  </div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 500, color: '#3d2535', fontSize: '1.18rem', lineHeight: 1.4, marginBottom: 8 }}>{item.title}</h3>
                  {item.content && <p style={{ color: '#9a7888', fontFamily: "'Jost',sans-serif", fontWeight: 300, fontSize: '0.87rem', lineHeight: 1.72, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', marginBottom: 12 }}>{item.content}</p>}
                  {kind === 'pdf' && item.link && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 13px', borderRadius: 10, background: 'rgba(80,140,210,0.07)', border: '1px solid rgba(80,140,210,0.18)', marginBottom: 12 }}>
                      <FileText style={{ width: 13, height: 13, color: '#508cd2', flexShrink: 0 }} />
                      <span style={{ color: '#508cd2', fontSize: '0.78rem', fontFamily: "'Jost',sans-serif" }}>Document attached</span>
                    </div>
                  )}
                  <div className="pd-card-footer">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', background: 'rgba(220,175,190,0.2)' }}>{item.author_avatar}</div>
                      <span style={{ color: '#8a7078', fontSize: '0.82rem', fontFamily: "'Jost',sans-serif" }}>{item.author}</span>
                    </div>
                    <span style={{ color: '#b0a0a8', fontSize: '0.76rem', fontFamily: "'Jost',sans-serif" }}>{formatDate(item.created_at)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedItem && (() => {
        const ts = TYPE_STYLES[selectedItem.type] || TYPE_STYLES.document;
        const kind = getLinkKind(selectedItem);
        return (
          <div className="pd-modal-bg" onClick={() => setSelectedItem(null)}>
            <div className="pd-modal" onClick={e => e.stopPropagation()}>
              <div className="pd-modal-header">
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: 8 }}><span className="pd-badge" style={{ background: ts.bg, color: ts.color, border: `1px solid ${ts.border}` }}>{TYPE_ICONS[selectedItem.type] || <FileText style={{ width: 13, height: 13 }} />} {selectedItem.type}</span></div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 500, color: '#3d2535', fontSize: '1.55rem', lineHeight: 1.3, marginBottom: 8 }}>{selectedItem.title}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span>{selectedItem.author_avatar}</span>
                    <span style={{ color: '#8a7078', fontSize: '0.85rem', fontFamily: "'Jost',sans-serif" }}>{selectedItem.author}</span>
                    <span style={{ color: '#c4a0b0' }}>•</span>
                    <span style={{ color: '#b0a0a8', fontSize: '0.82rem', fontFamily: "'Jost',sans-serif" }}>{formatDate(selectedItem.created_at)}</span>
                  </div>
                </div>
                <button className="pd-close-btn" onClick={() => setSelectedItem(null)}><X style={{ width: 22, height: 22 }} /></button>
              </div>
              <div style={{ padding: 24 }}>
                {kind === 'video' && selectedItem.link && (
                  <div className="pd-video-wrap" ref={viewerRef} style={{ position: 'relative' }}>
                    <video src={selectedItem.link} controls controlsList="nodownload" disablePictureInPicture onContextMenu={e => e.preventDefault()} />
                    <button className="pd-fs-btn" onClick={handleFullscreen}><Maximize2 style={{ width: 15, height: 15, color: 'white' }} /></button>
                  </div>
                )}
                {kind === 'pdf' && selectedItem.link && (
                  <div className="pd-pdf-wrap" ref={viewerRef} style={{ position: 'relative' }}>
                    <iframe src={`${selectedItem.link}#toolbar=0&navpanes=0&scrollbar=1`} title={selectedItem.title} />
                    <button className="pd-fs-btn" onClick={handleFullscreen}><Maximize2 style={{ width: 15, height: 15, color: 'white' }} /></button>
                  </div>
                )}
                {kind === 'image' && selectedItem.link && (
                  <div ref={viewerRef} style={{ position: 'relative' }}>
                    <img src={selectedItem.link} alt={selectedItem.title} onContextMenu={e => e.preventDefault()} draggable={false} style={{ width: '100%', maxHeight: 560, objectFit: 'contain', borderRadius: 12, marginBottom: 16 }} />
                    <button className="pd-fs-btn" onClick={handleFullscreen} style={{ top: 8, right: 8 }}><Maximize2 style={{ width: 15, height: 15, color: 'white' }} /></button>
                  </div>
                )}
                {kind === 'text' && selectedItem.link && (
                  <div style={{ marginBottom: 16 }}>
                    <a href={selectedItem.link} target="_blank" rel="noopener noreferrer" style={{ color: '#c9608c', fontSize: '0.9rem', fontFamily: "'Jost',sans-serif", wordBreak: 'break-all' }}>{selectedItem.link}</a>
                  </div>
                )}
                {selectedItem.content && <div className="pd-modal-text">{selectedItem.content}</div>}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
