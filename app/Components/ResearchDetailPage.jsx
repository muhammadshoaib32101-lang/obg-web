"use client";
import { useState, useEffect } from 'react';
import { ArrowLeft, FlaskConical, FileText, ExternalLink, Search, Loader2, X, BookOpen, GraduationCap, Users } from 'lucide-react';

const TYPE_STYLES = {
  research:    { bg: 'rgba(201,96,140,0.10)',  color: '#c9608c', border: 'rgba(201,96,140,0.22)', label: 'Research' },
  publication: { bg: 'rgba(80,140,210,0.10)',  color: '#508cd2', border: 'rgba(80,140,210,0.22)', label: 'Publication' },
  thesis:      { bg: 'rgba(56,168,120,0.10)',  color: '#38a878', border: 'rgba(56,168,120,0.22)', label: 'Thesis' },
  conference:  { bg: 'rgba(200,160,80,0.10)',  color: '#c8a040', border: 'rgba(200,160,80,0.22)', label: 'Conference' },
};

const TYPE_ICONS = {
  research:    <FlaskConical style={{ width: 13, height: 13 }} />,
  publication: <BookOpen     style={{ width: 13, height: 13 }} />,
  thesis:      <GraduationCap style={{ width: 13, height: 13 }} />,
  conference:  <Users        style={{ width: 13, height: 13 }} />,
};

function formatDate(ds) {
  return new Date(ds).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function ResearchDetailPage({ onBack }) {
  const [research, setResearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/research')
      .then(r => r.json())
      .then(d => { if (d.success) setResearch(d.research); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = research.filter(item => {
    const matchFilter = activeFilter === 'all' || item.type === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q
      || item.title.toLowerCase().includes(q)
      || item.authors.toLowerCase().includes(q)
      || (item.journal_name && item.journal_name.toLowerCase().includes(q))
      || (item.abstract && item.abstract.toLowerCase().includes(q));
    return matchFilter && matchSearch;
  });

  return (
    <div style={{ background: 'linear-gradient(160deg, #fdf5fa 0%, #f5f0fe 100%)', minHeight: '100vh', fontFamily: "'Jost', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');
        .rp-nav{background:rgba(255,248,245,0.92);backdrop-filter:blur(18px);border-bottom:1px solid rgba(220,160,150,0.2);box-shadow:0 2px 24px rgba(200,130,120,0.07);}
        .rp-back-btn{display:flex;align-items:center;gap:7px;padding:8px 18px;border-radius:30px;background:rgba(255,248,252,0.85);border:1px solid rgba(215,170,185,0.35);color:#7a6070;font-family:'Jost',sans-serif;font-size:0.84rem;cursor:pointer;transition:all 0.2s;}
        .rp-back-btn:hover{background:rgba(255,232,242,0.96);color:#c9608c;border-color:rgba(201,96,140,0.4);transform:translateX(-2px);}
        .rp-filter-btn{padding:8px 18px;border-radius:30px;font-family:'Jost',sans-serif;font-size:0.82rem;cursor:pointer;transition:all 0.2s;background:rgba(255,245,248,0.7);color:#9a7080;border:1px solid rgba(215,170,185,0.3);text-transform:capitalize;}
        .rp-filter-btn:hover{background:rgba(255,232,242,0.88);color:#c9608c;}
        .rp-filter-btn.rp-active{background:linear-gradient(135deg,#e8a0b0,#c9608c)!important;color:#fff!important;border:none!important;box-shadow:0 4px 16px rgba(200,100,140,0.28);}
        .rp-search-wrap{position:relative;}
        .rp-search-wrap svg{position:absolute;left:12px;top:50%;transform:translateY(-50%);pointer-events:none;}
        .rp-search-input{background:rgba(255,248,252,0.85);border:1px solid rgba(215,170,185,0.35);color:#4a2a3a;border-radius:30px;padding:8px 16px 8px 36px;font-family:'Jost',sans-serif;font-size:0.84rem;width:220px;transition:all 0.2s;}
        .rp-search-input::placeholder{color:#c4a0b0;}
        .rp-search-input:focus{outline:none;border-color:rgba(201,96,140,0.5);box-shadow:0 0 0 3px rgba(201,96,140,0.09);}
        .rp-card{background:rgba(255,252,250,0.85);backdrop-filter:blur(12px);border:1px solid rgba(220,180,170,0.28);border-radius:18px;transition:all 0.25s;cursor:pointer;padding:24px;}
        .rp-card:hover{background:rgba(255,248,252,0.96);border-color:rgba(210,140,160,0.5);box-shadow:0 12px 48px rgba(190,100,140,0.13);transform:translateY(-3px);}
        .rp-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:0.7rem;font-weight:500;letter-spacing:0.07em;text-transform:uppercase;font-family:'Jost',sans-serif;}
        .rp-modal-bg{position:fixed;inset:0;z-index:60;background:rgba(20,5,15,0.55);backdrop-filter:blur(16px);display:flex;align-items:center;justify-content:center;padding:16px;}
        .rp-modal{background:linear-gradient(160deg,#fdf6f0,#fef0f8);border:1px solid rgba(220,170,185,0.35);box-shadow:0 28px 80px rgba(180,90,140,0.22);border-radius:22px;max-width:800px;width:100%;max-height:92vh;overflow-y:auto;}
        .rp-modal-header{position:sticky;top:0;z-index:2;background:rgba(253,246,240,0.97);backdrop-filter:blur(12px);border-bottom:1px solid rgba(215,170,185,0.22);border-radius:22px 22px 0 0;padding:22px 24px 18px;display:flex;align-items:flex-start;justify-content:space-between;gap:16px;}
        .rp-close-btn{background:none;border:none;cursor:pointer;color:#b09098;padding:4px;border-radius:8px;transition:all 0.2s;flex-shrink:0;}
        .rp-close-btn:hover{color:#4a2a3a;background:rgba(220,170,185,0.15);}
        .rp-link-btn{display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:30px;background:linear-gradient(135deg,#e8a0b0,#c9608c);color:white;font-family:'Jost',sans-serif;font-size:0.85rem;font-weight:500;text-decoration:none;transition:all 0.2s;box-shadow:0 4px 16px rgba(200,100,140,0.28);}
        .rp-link-btn:hover{background:linear-gradient(135deg,#dc8ca0,#bc4f7c);box-shadow:0 6px 20px rgba(200,100,140,0.38);}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      `}</style>

      <nav className="rp-nav sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={onBack} className="rp-back-btn"><ArrowLeft style={{ width: 15, height: 15 }} /> Back to Home</button>
            <div className="flex items-center gap-3">
              <FlaskConical style={{ width: 22, height: 22, color: '#c9608c' }} />
              <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 500, color: '#3d2535', fontSize: '1.1rem' }}>Research & Publications</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #e8b0c0 0%, #c9789c 40%, #b060a0 100%)', minHeight: 240 }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0.08) 0%,rgba(0,0,0,0.03) 100%)' }} />
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <FlaskConical style={{ width: 220, height: 220, color: 'white' }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 300, color: 'white', fontSize: '2.8rem', lineHeight: 1.2, textShadow: '0 2px 20px rgba(0,0,0,0.18)', marginBottom: 14 }}>Research & Publications</h1>
          <p style={{ color: 'rgba(255,255,255,0.88)', fontFamily: "'Jost',sans-serif", fontWeight: 300, maxWidth: 580, margin: '0 auto', fontSize: '1rem', lineHeight: 1.65 }}>
            Advancing women's healthcare through evidence-based research, peer-reviewed publications, and academic contributions.
          </p>
          {research.length > 0 && (
            <div className="mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-full" style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}>
              <span style={{ color: 'rgba(255,255,255,0.95)', fontSize: '0.85rem', fontFamily: "'Jost',sans-serif" }}>{research.length} item{research.length !== 1 ? 's' : ''} published</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row gap-4 mb-10 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {['all', 'research', 'publication', 'thesis', 'conference'].map(f => (
              <button key={f} onClick={() => setActiveFilter(f)} className={`rp-filter-btn ${activeFilter === f ? 'rp-active' : ''}`}>
                {f === 'all' ? 'All' : TYPE_STYLES[f]?.label || f}
              </button>
            ))}
          </div>
          <div className="rp-search-wrap">
            <Search style={{ width: 14, height: 14, color: '#c4a0b0' }} />
            <input type="text" placeholder="Search by title, author, journal…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="rp-search-input" />
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 80, gap: 16 }}>
            <Loader2 style={{ width: 40, height: 40, color: '#c9608c', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#9a7888', fontFamily: "'Jost',sans-serif", fontWeight: 300 }}>Loading research…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 80, textAlign: 'center' }}>
            <FlaskConical style={{ width: 60, height: 60, color: '#c9608c', opacity: 0.3, marginBottom: 20 }} />
            <h3 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 400, color: '#3d2535', fontSize: '1.6rem', marginBottom: 10 }}>{searchQuery ? 'No results found' : 'No publications yet'}</h3>
            <p style={{ color: '#9a7888', fontFamily: "'Jost',sans-serif", fontWeight: 300, maxWidth: 380 }}>{searchQuery ? 'Try different search terms.' : 'Research and publications will appear here once added by the admin.'}</p>
          </div>
        ) : (
          <div className="space-y-5">
            {filtered.map(item => {
              const ts = TYPE_STYLES[item.type] || TYPE_STYLES.publication;
              return (
                <div key={item.id} className="rp-card" onClick={() => setSelectedItem(item)}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                        <span className="rp-badge" style={{ background: ts.bg, color: ts.color, border: `1px solid ${ts.border}` }}>{TYPE_ICONS[item.type]} {ts.label}</span>
                        {item.year && <span style={{ color: '#b09098', fontSize: '0.82rem', fontFamily: "'Jost',sans-serif" }}>{item.year}</span>}
                      </div>
                      <h3 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 500, color: '#3d2535', fontSize: '1.25rem', lineHeight: 1.4, marginBottom: 6 }}>{item.title}</h3>
                      <p style={{ color: '#7a6070', fontSize: '0.88rem', fontFamily: "'Jost',sans-serif", fontWeight: 400, marginBottom: 4 }}>
                        <span style={{ fontWeight: 500 }}>Authors:</span> {item.authors}
                      </p>
                      {item.journal_name && (
                        <p style={{ color: '#9a7888', fontSize: '0.84rem', fontFamily: "'Jost',sans-serif", fontStyle: 'italic' }}>{item.journal_name}</p>
                      )}
                    </div>
                    <span style={{ color: '#c9608c', fontSize: '1.1rem', flexShrink: 0, marginTop: 4 }}>→</span>
                  </div>
                  {item.abstract && (
                    <p style={{ color: '#9a7888', fontFamily: "'Jost',sans-serif", fontWeight: 300, fontSize: '0.87rem', lineHeight: 1.72, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.abstract}</p>
                  )}
                  {(item.link || item.file_url) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
                      <FileText style={{ width: 12, height: 12, color: '#508cd2' }} />
                      <span style={{ color: '#508cd2', fontSize: '0.78rem', fontFamily: "'Jost',sans-serif" }}>Document available</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedItem && (() => {
        const ts = TYPE_STYLES[selectedItem.type] || TYPE_STYLES.publication;
        return (
          <div className="rp-modal-bg" onClick={() => setSelectedItem(null)}>
            <div className="rp-modal" onClick={e => e.stopPropagation()}>
              <div className="rp-modal-header">
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                    <span className="rp-badge" style={{ background: ts.bg, color: ts.color, border: `1px solid ${ts.border}` }}>{TYPE_ICONS[selectedItem.type]} {ts.label}</span>
                    {selectedItem.year && <span style={{ color: '#b09098', fontSize: '0.82rem', fontFamily: "'Jost',sans-serif" }}>{selectedItem.year}</span>}
                  </div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 500, color: '#3d2535', fontSize: '1.55rem', lineHeight: 1.3, marginBottom: 8 }}>{selectedItem.title}</h2>
                  <p style={{ color: '#7a6070', fontSize: '0.9rem', fontFamily: "'Jost',sans-serif", fontWeight: 400 }}><span style={{ fontWeight: 500 }}>Authors:</span> {selectedItem.authors}</p>
                  {selectedItem.journal_name && <p style={{ color: '#9a7888', fontSize: '0.86rem', fontFamily: "'Jost',sans-serif", fontStyle: 'italic', marginTop: 4 }}>{selectedItem.journal_name}</p>}
                </div>
                <button className="rp-close-btn" onClick={() => setSelectedItem(null)}><X style={{ width: 22, height: 22 }} /></button>
              </div>
              <div style={{ padding: 24 }}>
                {selectedItem.abstract && (
                  <div style={{ marginBottom: 20 }}>
                    <h4 style={{ fontFamily: "'Jost',sans-serif", fontWeight: 500, color: '#c9608c', fontSize: '0.82rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Abstract</h4>
                    <p style={{ color: '#7a6070', fontFamily: "'Jost',sans-serif", fontWeight: 300, lineHeight: 1.85, fontSize: '0.95rem' }}>{selectedItem.abstract}</p>
                  </div>
                )}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
                  {selectedItem.link && (
                    <a href={selectedItem.link} target="_blank" rel="noopener noreferrer" className="rp-link-btn" onClick={e => e.stopPropagation()}>
                      <ExternalLink style={{ width: 14, height: 14 }} /> View Publication
                    </a>
                  )}
                  {selectedItem.file_url && (
                    <a href={selectedItem.file_url} target="_blank" rel="noopener noreferrer" className="rp-link-btn" style={{ background: 'linear-gradient(135deg,#80b0e0,#4080c0)' }} onClick={e => e.stopPropagation()}>
                      <FileText style={{ width: 14, height: 14 }} /> View Document
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
