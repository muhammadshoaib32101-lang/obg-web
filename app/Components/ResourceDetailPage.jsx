"use client";
import { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, BookOpen, Play, FileText, StickyNote,
  X, Search, Loader2, Film, Maximize2
} from 'lucide-react';

const RESOURCE_META = {
  communication: { title: 'Communication Skills', description: 'Develop effective doctor-patient communication and counseling techniques for obstetric and gynecological care', gradient: 'linear-gradient(135deg, #e8a0b0 0%, #c9608c 50%, #b060a0 100%)', bgGradient: 'linear-gradient(160deg, #fdf6f0 0%, #fef0f5 100%)', emoji: '🗣️' },
  clinical:      { title: 'Clinical Skills',       description: 'Master essential clinical examination skills specific to obstetrics and gynecology practice',             gradient: 'linear-gradient(135deg, #a0b8e8 0%, #6080c9 50%, #5060b0 100%)', bgGradient: 'linear-gradient(160deg, #f0f4fd 0%, #f0f5fe 100%)', emoji: '🩺' },
  history:       { title: 'History Taking',        description: 'Learn comprehensive obstetric and gynecological history taking protocols and documentation',                gradient: 'linear-gradient(135deg, #a0e8b8 0%, #40b870 50%, #308050 100%)', bgGradient: 'linear-gradient(160deg, #f0fdf4 0%, #f0fef5 100%)', emoji: '📋' },
  osce:          { title: 'OSCE Preparation',      description: 'Objective Structured Clinical Examination practice stations for OBGYN specialty',                         gradient: 'linear-gradient(135deg, #e8d0a0 0%, #c9a060 50%, #b08040 100%)', bgGradient: 'linear-gradient(160deg, #fdfaf0 0%, #fef8f0 100%)', emoji: '🏥' },
  mcq:           { title: 'MCQ Bank',              description: 'Extensive multiple choice questions covering all aspects of obstetrics and gynecology',                   gradient: 'linear-gradient(135deg, #d0a0e8 0%, #a060c9 50%, #8040b0 100%)', bgGradient: 'linear-gradient(160deg, #faf0fd 0%, #f5f0fe 100%)', emoji: '❓' },
  cases:         { title: 'Case Studies',          description: 'Real-world clinical case discussions and management protocols in OBGYN',                                  gradient: 'linear-gradient(135deg, #a0d0e8 0%, #4090c9 50%, #3070b0 100%)', bgGradient: 'linear-gradient(160deg, #f0f8fd 0%, #f0f5fe 100%)', emoji: '📚' },
  lectures:      { title: 'Lectures',              description: 'Comprehensive lecture series covering all major topics in obstetrics and gynecology, organized by specialty area', gradient: 'linear-gradient(135deg, #b0e0c8 0%, #38a878 50%, #287858 100%)', bgGradient: 'linear-gradient(160deg, #f0fdf8 0%, #f0fef5 100%)', emoji: '🎓' },
};

const TYPE_STYLES = {
  lecture:  { bg: 'rgba(201,96,140,0.10)',  color: '#c9608c', border: 'rgba(201,96,140,0.22)' },
  video:    { bg: 'rgba(201,100,100,0.10)', color: '#c96060', border: 'rgba(201,100,100,0.22)' },
  document: { bg: 'rgba(80,140,210,0.10)',  color: '#508cd2', border: 'rgba(80,140,210,0.22)' },
  notes:    { bg: 'rgba(60,160,100,0.10)',  color: '#3ca060', border: 'rgba(60,160,100,0.22)' },
};

function getTypeIcon(type) {
  switch (type) {
    case 'lecture':  return <BookOpen style={{ width: 14, height: 14 }} />;
    case 'video':    return <Play     style={{ width: 14, height: 14 }} />;
    case 'document': return <FileText style={{ width: 14, height: 14 }} />;
    case 'notes':    return <StickyNote style={{ width: 14, height: 14 }} />;
    default:         return <BookOpen style={{ width: 14, height: 14 }} />;
  }
}

// Returns { kind: 'video'|'pdf'|'image'|'youtube'|'text' }
function getLinkKind(item) {
  if (item.video_id && !item.link?.includes('/api/files/')) return 'youtube';
  const link = item.link || '';
  const lo = link.toLowerCase();
  if (/\.(mp4|webm|mov|avi)(\?|#|$)/.test(lo)) return 'video';
  if (/\.pdf(\?|#|$)/.test(lo))                  return 'pdf';
  if (/\.(jpe?g|png|gif|webp)(\?|#|$)/.test(lo)) return 'image';
  return 'text';
}

function formatDate(ds) {
  return new Date(ds).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function ResourceDetailPage({ resourceSlug, onBack }) {
  const [content, setContent]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const viewerRef = useRef(null);

  const handleFullscreen = () => {
    const el = viewerRef.current;
    if (!el) return;
    if      (el.requestFullscreen)       el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.mozRequestFullScreen)    el.mozRequestFullScreen();
  };

  const meta = RESOURCE_META[resourceSlug] || RESOURCE_META.communication;

  useEffect(() => {
    setLoading(true);
    setContent([]);
    fetch(`/api/resource-content?category=${resourceSlug}`)
      .then(r => r.json())
      .then(d => { if (d.success) setContent(d.content); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [resourceSlug]);

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

        .rd-nav { background: rgba(255,248,245,0.92); backdrop-filter: blur(18px); border-bottom: 1px solid rgba(220,160,150,0.2); box-shadow: 0 2px 24px rgba(200,130,120,0.07); }
        .rd-back-btn { display:flex; align-items:center; gap:7px; padding:8px 18px; border-radius:30px; background:rgba(255,248,252,0.85); border:1px solid rgba(215,170,185,0.35); color:#7a6070; font-family:'Jost',sans-serif; font-size:0.84rem; cursor:pointer; transition:all 0.2s; }
        .rd-back-btn:hover { background:rgba(255,232,242,0.96); color:#c9608c; border-color:rgba(201,96,140,0.4); transform:translateX(-2px); }

        /* filter buttons — active state wins over :hover */
        .rd-filter-btn { padding:8px 18px; border-radius:30px; font-family:'Jost',sans-serif; font-size:0.82rem; cursor:pointer; transition:all 0.2s; background:rgba(255,245,248,0.7); color:#9a7080; border:1px solid rgba(215,170,185,0.3); text-transform:capitalize; letter-spacing:0.02em; }
        .rd-filter-btn:hover { background:rgba(255,232,242,0.88); color:#c9608c; }
        .rd-filter-btn.rd-active { background:linear-gradient(135deg,#e8a0b0,#c9608c)!important; color:#fff!important; border:none!important; box-shadow:0 4px 16px rgba(200,100,140,0.28); }
        .rd-filter-btn.rd-active:hover { background:linear-gradient(135deg,#e8a0b0,#c9608c)!important; color:#fff!important; }

        .rd-search-wrap { position:relative; }
        .rd-search-wrap svg { position:absolute; left:12px; top:50%; transform:translateY(-50%); pointer-events:none; }
        .rd-search-input { background:rgba(255,248,252,0.85); border:1px solid rgba(215,170,185,0.35); color:#4a2a3a; border-radius:30px; padding:8px 16px 8px 36px; font-family:'Jost',sans-serif; font-size:0.84rem; width:210px; transition:all 0.2s; }
        .rd-search-input::placeholder { color:#c4a0b0; }
        .rd-search-input:focus { outline:none; border-color:rgba(201,96,140,0.5); box-shadow:0 0 0 3px rgba(201,96,140,0.09); }

        .rd-card { background:rgba(255,252,250,0.82); backdrop-filter:blur(12px); border:1px solid rgba(220,180,170,0.28); border-radius:18px; transition:all 0.25s; cursor:pointer; }
        .rd-card:hover { background:rgba(255,248,252,0.96); border-color:rgba(210,140,160,0.5); box-shadow:0 12px 48px rgba(190,100,140,0.13); transform:translateY(-3px); }

        .rd-badge { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:20px; font-size:0.7rem; font-weight:500; letter-spacing:0.07em; text-transform:uppercase; font-family:'Jost',sans-serif; }
        .rd-card-text { color:#9a7888; font-family:'Jost',sans-serif; font-weight:300; font-size:0.87rem; line-height:1.72; overflow:hidden; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; }
        .rd-card-footer { display:flex; align-items:center; justify-content:space-between; padding-top:12px; margin-top:4px; border-top:1px solid rgba(200,150,165,0.13); }
        .rd-avatar { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.9rem; background:rgba(220,175,190,0.2); flex-shrink:0; }

        .rd-thumb { position:relative; padding-top:56.25%; border-radius:12px; overflow:hidden; margin-bottom:14px; }
        .rd-thumb img, .rd-thumb video { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
        .rd-thumb-overlay { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.22); }
        .rd-play-circle { width:50px; height:50px; border-radius:50%; background:rgba(255,255,255,0.92); display:flex; align-items:center; justify-content:center; }

        /* modal */
        .rd-modal-bg { position:fixed; inset:0; z-index:60; background:rgba(20,5,15,0.55); backdrop-filter:blur(16px); display:flex; align-items:center; justify-content:center; padding:16px; }
        .rd-modal { background:linear-gradient(160deg,#fdf6f0,#fef0f8); border:1px solid rgba(220,170,185,0.35); box-shadow:0 28px 80px rgba(180,90,140,0.22); border-radius:22px; max-width:860px; width:100%; max-height:92vh; overflow-y:auto; }
        .rd-modal-header { position:sticky; top:0; z-index:2; background:rgba(253,246,240,0.97); backdrop-filter:blur(12px); border-bottom:1px solid rgba(215,170,185,0.22); border-radius:22px 22px 0 0; padding:22px 24px 18px; display:flex; align-items:flex-start; justify-content:space-between; gap:16px; }
        .rd-close-btn { background:none; border:none; cursor:pointer; color:#b09098; padding:4px; border-radius:8px; transition:all 0.2s; flex-shrink:0; }
        .rd-close-btn:hover { color:#4a2a3a; background:rgba(220,170,185,0.15); }

        /* no-download media */
        .rd-video-wrap { position:relative; padding-top:56.25%; border-radius:14px; overflow:hidden; margin-bottom:16px; }
        .rd-video-wrap video { position:absolute; inset:0; width:100%; height:100%; background:#000; border-radius:14px; }
        .rd-pdf-wrap { width:100%; height:560px; border-radius:12px; overflow:hidden; margin-bottom:16px; border:1px solid rgba(215,170,185,0.2); }
        .rd-pdf-wrap iframe { width:100%; height:100%; border:none; display:block; }
        .rd-img-wrap img { width:100%; max-height:560px; object-fit:contain; border-radius:12px; margin-bottom:16px; user-select:none; -webkit-user-drag:none; }
        .rd-modal-text { color:#7a6070; font-family:'Jost',sans-serif; font-weight:300; line-height:1.85; font-size:0.95rem; white-space:pre-wrap; }

        .rd-video-placeholder { padding-top:56.25%; position:relative; border-radius:12px; overflow:hidden; margin-bottom:14px; background:linear-gradient(135deg,rgba(201,100,100,0.12),rgba(180,80,80,0.08)); border:1px solid rgba(201,100,100,0.18); }
        .rd-video-placeholder-inner { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; }

        /* fullscreen button overlay */
        .rd-fs-btn { position:absolute; top:10px; right:10px; z-index:10; width:34px; height:34px; border-radius:8px; background:rgba(0,0,0,0.42); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background 0.2s,transform 0.15s; }
        .rd-fs-btn:hover { background:rgba(0,0,0,0.66); transform:scale(1.08); }

        /* fullscreen state — fill the screen */
        .rd-fs-wrap:fullscreen,
        .rd-fs-wrap:-webkit-full-screen,
        .rd-fs-wrap:-moz-full-screen { background:#000; padding:0!important; width:100vw!important; height:100vh!important; border-radius:0!important; overflow:hidden!important; }
        /* iframe is already in normal flow — just stretch it */
        .rd-fs-wrap:fullscreen iframe,
        .rd-fs-wrap:-webkit-full-screen iframe { width:100%!important; height:100%!important; }
        /* video is position:absolute inside padding-top trick — keep absolute, now fills 100vw×100vh container */
        .rd-fs-wrap:fullscreen video,
        .rd-fs-wrap:-webkit-full-screen video { position:absolute!important; inset:0!important; width:100%!important; height:100%!important; object-fit:contain!important; border-radius:0!important; }
        .rd-fs-wrap:fullscreen img,
        .rd-fs-wrap:-webkit-full-screen img { width:auto!important; height:100vh!important; max-height:100vh!important; object-fit:contain!important; border-radius:0!important; }

        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      {/* Header */}
      <nav className="rd-nav sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={onBack} className="rd-back-btn">
              <ArrowLeft style={{ width: 15, height: 15 }} /> Back to Home
            </button>
            <div className="flex items-center gap-3">
              <span style={{ fontSize: '1.4rem' }}>{meta.emoji}</span>
              <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 500, color: '#3d2535', fontSize: '1.1rem' }}>{meta.title}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: meta.gradient, minHeight: 240 }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0.08) 0%,rgba(0,0,0,0.03) 100%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <div style={{ fontSize: '3.5rem', marginBottom: 16, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}>{meta.emoji}</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 300, color: 'white', fontSize: '2.8rem', lineHeight: 1.2, textShadow: '0 2px 20px rgba(0,0,0,0.18)', marginBottom: 14 }}>{meta.title}</h1>
          <p style={{ color: 'rgba(255,255,255,0.88)', fontFamily: "'Jost',sans-serif", fontWeight: 300, maxWidth: 580, margin: '0 auto', fontSize: '1.02rem', lineHeight: 1.65 }}>{meta.description}</p>
          {content.length > 0 && (
            <div className="mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-full" style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}>
              <span style={{ color: 'rgba(255,255,255,0.95)', fontSize: '0.85rem', fontFamily: "'Jost',sans-serif" }}>{content.length} resource{content.length !== 1 ? 's' : ''} available</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters + Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {['all', 'lecture', 'video', 'document', 'notes'].map(f => (
              <button key={f} onClick={() => setActiveFilter(f)} className={`rd-filter-btn ${activeFilter === f ? 'rd-active' : ''}`}>
                {f === 'all' ? 'All Content' : f.charAt(0).toUpperCase() + f.slice(1) + 's'}
              </button>
            ))}
          </div>
          <div className="rd-search-wrap">
            <Search style={{ width: 14, height: 14, color: '#c4a0b0' }} />
            <input type="text" placeholder="Search content…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="rd-search-input" />
          </div>
        </div>

        {/* States */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 80, paddingBottom: 80, gap: 16 }}>
            <Loader2 style={{ width: 40, height: 40, color: '#c9608c', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#9a7888', fontFamily: "'Jost',sans-serif", fontWeight: 300 }}>Loading content…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 80, paddingBottom: 80, textAlign: 'center' }}>
            <div style={{ fontSize: '3.8rem', marginBottom: 20 }}>{meta.emoji}</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 400, color: '#3d2535', fontSize: '1.6rem', marginBottom: 10 }}>{searchQuery ? 'No results found' : 'No content yet'}</h3>
            <p style={{ color: '#9a7888', fontFamily: "'Jost',sans-serif", fontWeight: 300, maxWidth: 380 }}>{searchQuery ? 'Try different search terms or clear the filter.' : 'Content will appear here once published by the admin.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(item => {
              const ts   = TYPE_STYLES[item.type] || TYPE_STYLES.lecture;
              const kind = getLinkKind(item);
              return (
                <div key={item.id} className="rd-card p-6" onClick={() => setSelectedItem(item)}>
                  {/* Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <span className="rd-badge" style={{ background: ts.bg, color: ts.color, border: `1px solid ${ts.border}` }}>{getTypeIcon(item.type)} {item.type}</span>
                    {(kind === 'video' || kind === 'youtube') && (
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#e8a0a0,#c97878)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Play style={{ width: 13, height: 13, color: 'white', marginLeft: 2 }} />
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 500, color: '#3d2535', fontSize: '1.18rem', lineHeight: 1.4, marginBottom: 8 }}>{item.title}</h3>

                  {/* Content preview */}
                  {item.content && <p className="rd-card-text" style={{ marginBottom: 12 }}>{item.content}</p>}

                  {/* YouTube thumbnail */}
                  {kind === 'youtube' && item.video_id && (
                    <div className="rd-thumb">
                      <img src={`https://img.youtube.com/vi/${item.video_id}/mqdefault.jpg`} alt={item.title} />
                      <div className="rd-thumb-overlay"><div className="rd-play-circle"><Play style={{ width: 18, height: 18, color: '#c97878', marginLeft: 2 }} /></div></div>
                    </div>
                  )}

                  {/* Local video placeholder */}
                  {kind === 'video' && (
                    <div className="rd-video-placeholder">
                      <div className="rd-video-placeholder-inner">
                        <Film style={{ width: 32, height: 32, color: '#c97878', opacity: 0.7 }} />
                        <span style={{ color: '#c97878', fontSize: '0.78rem', fontFamily: "'Jost',sans-serif", opacity: 0.8 }}>Video — click to play</span>
                      </div>
                    </div>
                  )}

                  {/* PDF indicator */}
                  {(kind === 'pdf' || (kind === 'text' && item.link)) && item.link && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 13px', borderRadius: 10, background: 'rgba(80,140,210,0.07)', border: '1px solid rgba(80,140,210,0.18)', marginBottom: 12 }}>
                      <FileText style={{ width: 13, height: 13, color: '#508cd2', flexShrink: 0 }} />
                      <span style={{ color: '#508cd2', fontSize: '0.78rem', fontFamily: "'Jost',sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Document attached</span>
                    </div>
                  )}

                  {/* Image thumbnail */}
                  {kind === 'image' && item.link && (
                    <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 12, maxHeight: 140 }}>
                      <img src={item.link} alt={item.title} style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block', userSelect: 'none', WebkitUserDrag: 'none' }} onContextMenu={e => e.preventDefault()} />
                    </div>
                  )}

                  {/* Footer */}
                  <div className="rd-card-footer">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="rd-avatar">{item.author_avatar}</div>
                      <span style={{ color: '#8a7078', fontSize: '0.82rem', fontFamily: "'Jost',sans-serif" }}>{item.author}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ color: '#b0a0a8', fontSize: '0.76rem', fontFamily: "'Jost',sans-serif" }}>{formatDate(item.created_at)}</span>
                      <span style={{ color: '#c9608c', fontSize: '0.9rem', transition: 'transform 0.2s' }}>→</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Detail Modal ────────────────────────────────────────────────── */}
      {selectedItem && (() => {
        const ts   = TYPE_STYLES[selectedItem.type] || TYPE_STYLES.lecture;
        const kind = getLinkKind(selectedItem);
        return (
          <div className="rd-modal-bg" onClick={() => setSelectedItem(null)}>
            <div className="rd-modal" onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="rd-modal-header">
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: 8 }}>
                    <span className="rd-badge" style={{ background: ts.bg, color: ts.color, border: `1px solid ${ts.border}` }}>{getTypeIcon(selectedItem.type)} {selectedItem.type}</span>
                  </div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 500, color: '#3d2535', fontSize: '1.55rem', lineHeight: 1.3, marginBottom: 8 }}>{selectedItem.title}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span>{selectedItem.author_avatar}</span>
                    <span style={{ color: '#8a7078', fontSize: '0.85rem', fontFamily: "'Jost',sans-serif" }}>{selectedItem.author}</span>
                    <span style={{ color: '#c4a0b0' }}>•</span>
                    <span style={{ color: '#b0a0a8', fontSize: '0.82rem', fontFamily: "'Jost',sans-serif" }}>{formatDate(selectedItem.created_at)}</span>
                  </div>
                </div>
                <button className="rd-close-btn" onClick={() => setSelectedItem(null)}><X style={{ width: 22, height: 22 }} /></button>
              </div>

              {/* Body */}
              <div style={{ padding: 24 }}>
                {/* YouTube video */}
                {kind === 'youtube' && selectedItem.video_id && (
                  <div className="rd-video-wrap rd-fs-wrap" ref={viewerRef} style={{ position: 'relative' }}>
                    <iframe src={`https://www.youtube.com/embed/${selectedItem.video_id}?autoplay=1&rel=0`} title={selectedItem.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} />
                    <button className="rd-fs-btn" onClick={handleFullscreen} title="Full screen"><Maximize2 style={{ width: 15, height: 15, color: 'white' }} /></button>
                  </div>
                )}

                {/* Local video — no download */}
                {kind === 'video' && selectedItem.link && (
                  <div className="rd-video-wrap rd-fs-wrap" ref={viewerRef}>
                    <video
                      src={selectedItem.link}
                      controls
                      controlsList="nodownload nofullscreen"
                      disablePictureInPicture
                      onContextMenu={e => e.preventDefault()}
                    />
                    <button className="rd-fs-btn" onClick={handleFullscreen} title="Full screen"><Maximize2 style={{ width: 15, height: 15, color: 'white' }} /></button>
                  </div>
                )}

                {/* PDF — inline viewer, toolbar hidden */}
                {kind === 'pdf' && selectedItem.link && (
                  <div className="rd-pdf-wrap rd-fs-wrap" ref={viewerRef} style={{ position: 'relative' }}>
                    <iframe
                      src={`${selectedItem.link}#toolbar=0&navpanes=0&scrollbar=1`}
                      title={selectedItem.title}
                    />
                    <button className="rd-fs-btn" onClick={handleFullscreen} title="Full screen"><Maximize2 style={{ width: 15, height: 15, color: 'white' }} /></button>
                  </div>
                )}

                {/* Image */}
                {kind === 'image' && selectedItem.link && (
                  <div className="rd-img-wrap rd-fs-wrap" ref={viewerRef} style={{ position: 'relative' }}>
                    <img
                      src={selectedItem.link}
                      alt={selectedItem.title}
                      onContextMenu={e => e.preventDefault()}
                      draggable={false}
                    />
                    <button className="rd-fs-btn" onClick={handleFullscreen} title="Full screen" style={{ top: 8, right: 8 }}><Maximize2 style={{ width: 15, height: 15, color: 'white' }} /></button>
                  </div>
                )}

                {/* Text content */}
                {selectedItem.content && (
                  <div className="rd-modal-text">{selectedItem.content}</div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
