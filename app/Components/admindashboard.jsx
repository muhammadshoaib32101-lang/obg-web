"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import {
  LogOut, Home, FileText, Plus, Save, X, Trash2,
  Users, Youtube, Loader2, CheckCircle, AlertCircle, XCircle,
  BookOpen, Play, StickyNote, Upload, Search,
  Camera, GraduationCap, FlaskConical, Trophy, Award, Star,
  Calendar, Stethoscope, Phone, Mail, MapPin,
  Facebook, Instagram, Linkedin, Twitter, MessageCircle, Globe,
  Edit2, Activity, Heart, Shield, Clock
} from 'lucide-react';

const PROG_CATS = [
  { id: 'postgraduate', label: 'Postgraduate', emoji: '🎓', desc: 'Fellowship & residency training' },
  { id: 'house_officer', label: 'House Officer', emoji: '🏥', desc: 'House officer program' },
  { id: 'mbbs', label: 'MBBS', emoji: '📚', desc: 'Undergraduate medical training' },
];
const PROG_TYPES = ['curriculum','schedule','guide','announcement','video','document'];
const ACH_ICON_MAP = { Trophy, Award, Star, Users, Heart, Activity, CheckCircle, Shield, Clock };
const SVC_ICON_MAP = { Stethoscope, Heart, Activity, Users, Calendar, BookOpen, Award, Shield, Clock, MapPin };
const SOCIAL_ICON_MAP = { facebook: Facebook, twitter: Twitter, instagram: Instagram, linkedin: Linkedin, youtube: Youtube, whatsapp: MessageCircle };
const CONTACT_TYPE_ICON = { phone: Phone, email: Mail, address: MapPin, other: Globe };

const RESOURCE_CATEGORIES = [
  { id: 'communication', title: 'Communication Skills', emoji: '🗣️', desc: 'Doctor-patient communication' },
  { id: 'clinical',      title: 'Clinical Skills',      emoji: '🩺', desc: 'Clinical examination skills' },
  { id: 'history',       title: 'History Taking',       emoji: '📋', desc: 'History taking protocols' },
  { id: 'osce',          title: 'OSCE Preparation',     emoji: '🏥', desc: 'OSCE practice stations' },
  { id: 'mcq',           title: 'MCQ Bank',             emoji: '❓', desc: 'Multiple choice questions' },
  { id: 'cases',         title: 'Case Studies',         emoji: '📚', desc: 'Clinical case discussions' },
  { id: 'lectures',     title: 'Lectures',             emoji: '🎓', desc: 'Full lecture series' },
];

const CONTENT_TYPES = [
  { id: 'lecture',  label: 'Lecture',  icon: BookOpen,   accept: '.pdf,.doc,.docx', hint: 'PDF or Word document (optional)' },
  { id: 'video',    label: 'Video',    icon: Play,       accept: '.mp4,.webm,.mov,.avi', hint: 'MP4, WebM or MOV file' },
  { id: 'document', label: 'Document', icon: FileText,   accept: '.pdf',            hint: 'PDF file' },
  { id: 'notes',    label: 'Notes',    icon: StickyNote, accept: '.pdf,.jpg,.jpeg,.png', hint: 'PDF or image of notes' },
];

export default function AdminDashboard({ onLogout, userToken, onNavigateToSignup, onNavigateToHome }) {
  const [activeTab, setActiveTab] = useState('resources');
  const [toast, setToast]         = useState(null);

  // ── resource content ────────────────────────────────────────────────────
  const [activeResCategory, setActiveResCategory] = useState('');
  const [resourceContent, setResourceContent]     = useState([]);
  const [resLoading, setResLoading]               = useState(false);
  const [showResForm, setShowResForm]             = useState(false);
  const [resFormType, setResFormType]             = useState('lecture');
  const [resFormData, setResFormData]             = useState({ author: '', authorAvatar: '', title: '', content: '', link: '' });
  const [resUploadedFile, setResUploadedFile]     = useState(null);   // { url, name }
  const [resUploading, setResUploading]           = useState(false);
  const resFileInputRef                           = useRef(null);

  // ── resource search / filter ────────────────────────────────────────────
  const [resSearchQuery, setResSearchQuery] = useState('');
  const [resTypeFilter, setResTypeFilter]   = useState('all');

  // ── faculty ─────────────────────────────────────────────────────────────
  const [faculty, setFaculty] = useState([]);
  const [facultyLoading, setFacultyLoading] = useState(false);
  const [showFacultyForm, setShowFacultyForm] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [facultyForm, setFacultyForm] = useState({ name:'', role_title:'', credentials:'', experience_note:'', is_hod:false });
  const [facultyImg, setFacultyImg] = useState(null);
  const [facultyImgLoading, setFacultyImgLoading] = useState(false);
  const facultyImgRef = useRef(null);

  // ── programs ─────────────────────────────────────────────────────────────
  const [activeProgCat, setActiveProgCat] = useState('');
  const [programContent, setProgramContent] = useState([]);
  const [progLoading, setProgLoading] = useState(false);
  const [showProgForm, setShowProgForm] = useState(false);
  const [progFormType, setProgFormType] = useState('document');
  const [progForm, setProgForm] = useState({ title:'', content:'', link:'' });
  const [progFile, setProgFile] = useState(null);
  const [progFileLoading, setProgFileLoading] = useState(false);
  const [progTypeFilter, setProgTypeFilter] = useState('all');
  const progFileRef = useRef(null);

  // ── research ─────────────────────────────────────────────────────────────
  const [research, setResearch] = useState([]);
  const [researchLoading, setResearchLoading] = useState(false);
  const [showResearchForm, setShowResearchForm] = useState(false);
  const [researchForm, setResearchForm] = useState({ title:'', authors:'', journal_name:'', year:'', abstract:'', link:'', type:'publication' });
  const [researchFile, setResearchFile] = useState(null);
  const [researchFileLoading, setResearchFileLoading] = useState(false);
  const researchFileRef = useRef(null);

  // ── achievements ──────────────────────────────────────────────────────────
  const [achievements, setAchievements] = useState([]);
  const [achLoading, setAchLoading] = useState(false);
  const [editingAch, setEditingAch] = useState(null);
  const [achForm, setAchForm] = useState({});
  const [showAchForm, setShowAchForm] = useState(false);
  const [achAddForm, setAchAddForm] = useState({ icon_name:'Trophy', number_text:'', label:'' });

  // ── events & news ─────────────────────────────────────────────────────────
  const [enSubTab, setEnSubTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({ title:'', date_text:'', description:'' });
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [newsForm, setNewsForm] = useState({ title:'', date_text:'', description:'' });

  // ── services ──────────────────────────────────────────────────────────────
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({ title:'', description:'', icon_name:'Stethoscope' });

  // ── contacts & social ─────────────────────────────────────────────────────
  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [contactForm, setContactForm] = useState({ type:'phone', label:'', value:'' });
  const [socialLinks, setSocialLinks] = useState([]);
  const [socialLoading, setSocialLoading] = useState(false);
  const [showSocialForm, setShowSocialForm] = useState(false);
  const [editingSocial, setEditingSocial] = useState(null);
  const [socialForm, setSocialForm] = useState({ platform:'facebook', url:'' });

  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 4000); return () => clearTimeout(t); } }, [toast]);
  useEffect(() => { if (activeResCategory) { setResSearchQuery(''); setResTypeFilter('all'); fetchResourceContent(activeResCategory); } }, [activeResCategory]);
  useEffect(() => {
    if (activeTab==='faculty') fetchFaculty();
    else if (activeTab==='research') fetchResearch();
    else if (activeTab==='achievements') fetchAchievements();
    else if (activeTab==='events-news') { fetchEvents(); fetchNews(); }
    else if (activeTab==='services') fetchServices();
    else if (activeTab==='contact-links') { fetchContacts(); fetchSocialLinks(); }
  }, [activeTab]);
  useEffect(() => { if (activeTab==='programs' && activeProgCat) fetchProgramContent(activeProgCat); }, [activeProgCat]);

  const showToast = (msg, type = 'success') => setToast({ message: msg, type });
  const authH = () => ({ Authorization: `Bearer ${userToken}` });
  const jsonH = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` });
  const uploadFile = async (file, setUploading, setUploaded) => {
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const r = await fetch('/api/upload', { method:'POST', headers: authH(), body: fd });
      const d = await r.json();
      if (d.success) { setUploaded({ url: d.url, name: d.originalName }); showToast('File uploaded!'); }
      else showToast(d.message || 'Upload failed', 'error');
    } catch { showToast('Upload failed', 'error'); }
    finally { setUploading(false); }
  };

  // ── faculty handlers ─────────────────────────────────────────────────────
  const fetchFaculty = async () => { setFacultyLoading(true); try { const r = await fetch('/api/faculty'); const d = await r.json(); if (d.success) setFaculty(d.faculty); } catch(e){} finally { setFacultyLoading(false); } };
  const openFacultyAdd = () => { setEditingFaculty(null); setFacultyForm({name:'',role_title:'',credentials:'',experience_note:'',is_hod:false}); setFacultyImg(null); setShowFacultyForm(true); };
  const openFacultyEdit = f => { setEditingFaculty(f.id); setFacultyForm({name:f.name,role_title:f.role_title,credentials:f.credentials||'',experience_note:f.experience_note||'',is_hod:!!f.is_hod}); setFacultyImg(f.image_url?{url:f.image_url,name:'current'}:null); setShowFacultyForm(true); };
  const handleFacultyImgSelect = async e => { const file=e.target.files?.[0]; if (!file) return; await uploadFile(file,setFacultyImgLoading,setFacultyImg); if(facultyImgRef.current) facultyImgRef.current.value=''; };
  const handleSaveFaculty = async () => {
    if (!facultyForm.name||!facultyForm.role_title) { showToast('Name and role are required','error'); return; }
    setFacultyLoading(true);
    try {
      const body = {...facultyForm, image_url: facultyImg?.url||null}; if(editingFaculty) body.id=editingFaculty;
      const r = await fetch('/api/faculty',{method:editingFaculty?'PUT':'POST',headers:jsonH(),body:JSON.stringify(body)});
      const d = await r.json();
      if(d.success){showToast(editingFaculty?'Updated!':'Added!');setShowFacultyForm(false);fetchFaculty();}else showToast(d.message||'Failed','error');
    }catch{showToast('Failed','error');}finally{setFacultyLoading(false);}
  };
  const handleDeleteFaculty = async id => { if(!confirm('Remove faculty member?'))return; setFacultyLoading(true); try{const r=await fetch(`/api/faculty?id=${id}`,{method:'DELETE',headers:authH()});const d=await r.json();if(d.success){showToast('Deleted!');fetchFaculty();}else showToast(d.message||'Failed','error');}catch{showToast('Failed','error');}finally{setFacultyLoading(false);} };

  // ── programs handlers ────────────────────────────────────────────────────
  const fetchProgramContent = async cat => { setProgLoading(true); try{const r=await fetch(`/api/programs?category=${cat}`);const d=await r.json();if(d.success)setProgramContent(d.content);}catch(e){}finally{setProgLoading(false);} };
  const handleProgFileSelect = async e => { const file=e.target.files?.[0]; if(!file)return; await uploadFile(file,setProgFileLoading,setProgFile); if(progFileRef.current)progFileRef.current.value=''; };
  const handleSaveProgram = async () => {
    if(!progForm.title){showToast('Title required','error');return;}setProgLoading(true);
    try{const body={program_category:activeProgCat,type:progFormType,title:progForm.title,content:progForm.content,link:progFile?.url||progForm.link||null};
    const r=await fetch('/api/programs',{method:'POST',headers:jsonH(),body:JSON.stringify(body)});const d=await r.json();
    if(d.success){showToast('Published!');setProgForm({title:'',content:'',link:''});setProgFile(null);setShowProgForm(false);fetchProgramContent(activeProgCat);}else showToast(d.message||'Failed','error');}catch{showToast('Failed','error');}finally{setProgLoading(false);}
  };
  const handleDeleteProgram = async id => { if(!confirm('Delete?'))return; setProgLoading(true); try{const r=await fetch(`/api/programs?id=${id}`,{method:'DELETE',headers:authH()});const d=await r.json();if(d.success){showToast('Deleted!');fetchProgramContent(activeProgCat);}else showToast(d.message||'Failed','error');}catch{showToast('Failed','error');}finally{setProgLoading(false);} };

  // ── research handlers ────────────────────────────────────────────────────
  const fetchResearch = async () => { setResearchLoading(true); try{const r=await fetch('/api/research');const d=await r.json();if(d.success)setResearch(d.research);}catch(e){}finally{setResearchLoading(false);} };
  const handleResearchFileSelect = async e => { const file=e.target.files?.[0]; if(!file)return; await uploadFile(file,setResearchFileLoading,setResearchFile); if(researchFileRef.current)researchFileRef.current.value=''; };
  const handleSaveResearch = async () => {
    if(!researchForm.title||!researchForm.authors){showToast('Title and authors required','error');return;}setResearchLoading(true);
    try{const body={...researchForm,file_url:researchFile?.url||null};
    const r=await fetch('/api/research',{method:'POST',headers:jsonH(),body:JSON.stringify(body)});const d=await r.json();
    if(d.success){showToast('Published!');setResearchForm({title:'',authors:'',journal_name:'',year:'',abstract:'',link:'',type:'publication'});setResearchFile(null);setShowResearchForm(false);fetchResearch();}else showToast(d.message||'Failed','error');}catch{showToast('Failed','error');}finally{setResearchLoading(false);}
  };
  const handleDeleteResearch = async id => { if(!confirm('Delete publication?'))return; setResearchLoading(true); try{const r=await fetch(`/api/research?id=${id}`,{method:'DELETE',headers:authH()});const d=await r.json();if(d.success){showToast('Deleted!');fetchResearch();}else showToast(d.message||'Failed','error');}catch{showToast('Failed','error');}finally{setResearchLoading(false);} };

  // ── achievements handlers ────────────────────────────────────────────────
  const fetchAchievements = async () => { setAchLoading(true); try{const r=await fetch('/api/achievements');const d=await r.json();if(d.success)setAchievements(d.achievements);}catch(e){}finally{setAchLoading(false);} };
  const handleEditAch = a => { setEditingAch(a.id); setAchForm({icon_name:a.icon_name,number_text:a.number_text,label:a.label}); };
  const handleSaveAch = async id => { setAchLoading(true); try{const r=await fetch('/api/achievements',{method:'PUT',headers:jsonH(),body:JSON.stringify({id,...achForm})});const d=await r.json();if(d.success){showToast('Saved!');setEditingAch(null);fetchAchievements();}else showToast(d.message||'Failed','error');}catch{showToast('Failed','error');}finally{setAchLoading(false);} };
  const handleAddAch = async () => { if(!achAddForm.number_text||!achAddForm.label){showToast('Number and label required','error');return;}setAchLoading(true);try{const r=await fetch('/api/achievements',{method:'POST',headers:jsonH(),body:JSON.stringify(achAddForm)});const d=await r.json();if(d.success){showToast('Added!');setShowAchForm(false);setAchAddForm({icon_name:'Trophy',number_text:'',label:''});fetchAchievements();}else showToast(d.message||'Failed','error');}catch{showToast('Failed','error');}finally{setAchLoading(false);} };
  const handleDeleteAch = async id => { if(!confirm('Delete?'))return; setAchLoading(true); try{const r=await fetch(`/api/achievements?id=${id}`,{method:'DELETE',headers:authH()});const d=await r.json();if(d.success){showToast('Deleted!');fetchAchievements();}else showToast(d.message||'Failed','error');}catch{showToast('Failed','error');}finally{setAchLoading(false);} };

  // ── events handlers ──────────────────────────────────────────────────────
  const fetchEvents = async () => { setEventsLoading(true); try{const r=await fetch('/api/events');const d=await r.json();if(d.success)setEvents(d.events);}catch(e){}finally{setEventsLoading(false);} };
  const openEventAdd = () => { setEditingEvent(null); setEventForm({title:'',date_text:'',description:''}); setShowEventForm(true); };
  const openEventEdit = e => { setEditingEvent(e.id); setEventForm({title:e.title,date_text:e.date_text,description:e.description||''}); setShowEventForm(true); };
  const handleSaveEvent = async () => {
    if(!eventForm.title||!eventForm.date_text){showToast('Title and date required','error');return;}setEventsLoading(true);
    try{const body=editingEvent?{id:editingEvent,...eventForm}:eventForm;
    const r=await fetch('/api/events',{method:editingEvent?'PUT':'POST',headers:jsonH(),body:JSON.stringify(body)});const d=await r.json();
    if(d.success){showToast(editingEvent?'Updated!':'Added!');setShowEventForm(false);fetchEvents();}else showToast(d.message||'Failed','error');}catch{showToast('Failed','error');}finally{setEventsLoading(false);}
  };
  const handleDeleteEvent = async id => { if(!confirm('Delete event?'))return; setEventsLoading(true); try{const r=await fetch(`/api/events?id=${id}`,{method:'DELETE',headers:authH()});const d=await r.json();if(d.success){showToast('Deleted!');fetchEvents();}else showToast(d.message||'Failed','error');}catch{showToast('Failed','error');}finally{setEventsLoading(false);} };

  // ── news handlers ────────────────────────────────────────────────────────
  const fetchNews = async () => { setNewsLoading(true); try{const r=await fetch('/api/news');const d=await r.json();if(d.success)setNews(d.news);}catch(e){}finally{setNewsLoading(false);} };
  const openNewsAdd = () => { setEditingNews(null); setNewsForm({title:'',date_text:'',description:''}); setShowNewsForm(true); };
  const openNewsEdit = n => { setEditingNews(n.id); setNewsForm({title:n.title,date_text:n.date_text,description:n.description||''}); setShowNewsForm(true); };
  const handleSaveNews = async () => {
    if(!newsForm.title||!newsForm.date_text){showToast('Title and date required','error');return;}setNewsLoading(true);
    try{const body=editingNews?{id:editingNews,...newsForm}:newsForm;
    const r=await fetch('/api/news',{method:editingNews?'PUT':'POST',headers:jsonH(),body:JSON.stringify(body)});const d=await r.json();
    if(d.success){showToast(editingNews?'Updated!':'Added!');setShowNewsForm(false);fetchNews();}else showToast(d.message||'Failed','error');}catch{showToast('Failed','error');}finally{setNewsLoading(false);}
  };
  const handleDeleteNews = async id => { if(!confirm('Delete news?'))return; setNewsLoading(true); try{const r=await fetch(`/api/news?id=${id}`,{method:'DELETE',headers:authH()});const d=await r.json();if(d.success){showToast('Deleted!');fetchNews();}else showToast(d.message||'Failed','error');}catch{showToast('Failed','error');}finally{setNewsLoading(false);} };

  // ── services handlers ────────────────────────────────────────────────────
  const fetchServices = async () => { setServicesLoading(true); try{const r=await fetch('/api/clinical-services');const d=await r.json();if(d.success)setServices(d.services);}catch(e){}finally{setServicesLoading(false);} };
  const openServiceAdd = () => { setEditingService(null); setServiceForm({title:'',description:'',icon_name:'Stethoscope'}); setShowServiceForm(true); };
  const openServiceEdit = s => { setEditingService(s.id); setServiceForm({title:s.title,description:s.description||'',icon_name:s.icon_name||'Stethoscope'}); setShowServiceForm(true); };
  const handleSaveService = async () => {
    if(!serviceForm.title){showToast('Title required','error');return;}setServicesLoading(true);
    try{const body=editingService?{id:editingService,...serviceForm}:serviceForm;
    const r=await fetch('/api/clinical-services',{method:editingService?'PUT':'POST',headers:jsonH(),body:JSON.stringify(body)});const d=await r.json();
    if(d.success){showToast(editingService?'Updated!':'Added!');setShowServiceForm(false);fetchServices();}else showToast(d.message||'Failed','error');}catch{showToast('Failed','error');}finally{setServicesLoading(false);}
  };
  const handleDeleteService = async id => { if(!confirm('Delete service?'))return; setServicesLoading(true); try{const r=await fetch(`/api/clinical-services?id=${id}`,{method:'DELETE',headers:authH()});const d=await r.json();if(d.success){showToast('Deleted!');fetchServices();}else showToast(d.message||'Failed','error');}catch{showToast('Failed','error');}finally{setServicesLoading(false);} };

  // ── contacts handlers ────────────────────────────────────────────────────
  const fetchContacts = async () => { setContactsLoading(true); try{const r=await fetch('/api/contact-info');const d=await r.json();if(d.success)setContacts(d.contacts);}catch(e){}finally{setContactsLoading(false);} };
  const openContactAdd = () => { setEditingContact(null); setContactForm({type:'phone',label:'',value:''}); setShowContactForm(true); };
  const openContactEdit = c => { setEditingContact(c.id); setContactForm({type:c.type,label:c.label||'',value:c.value}); setShowContactForm(true); };
  const handleSaveContact = async () => {
    if(!contactForm.value){showToast('Value required','error');return;}setContactsLoading(true);
    try{const body=editingContact?{id:editingContact,...contactForm}:contactForm;
    const r=await fetch('/api/contact-info',{method:editingContact?'PUT':'POST',headers:jsonH(),body:JSON.stringify(body)});const d=await r.json();
    if(d.success){showToast(editingContact?'Updated!':'Added!');setShowContactForm(false);fetchContacts();}else showToast(d.message||'Failed','error');}catch{showToast('Failed','error');}finally{setContactsLoading(false);}
  };
  const handleDeleteContact = async id => { if(!confirm('Delete?'))return; setContactsLoading(true); try{const r=await fetch(`/api/contact-info?id=${id}`,{method:'DELETE',headers:authH()});const d=await r.json();if(d.success){showToast('Deleted!');fetchContacts();}else showToast(d.message||'Failed','error');}catch{showToast('Failed','error');}finally{setContactsLoading(false);} };

  // ── social handlers ──────────────────────────────────────────────────────
  const fetchSocialLinks = async () => { setSocialLoading(true); try{const r=await fetch('/api/social-links');const d=await r.json();if(d.success)setSocialLinks(d.links);}catch(e){}finally{setSocialLoading(false);} };
  const openSocialAdd = () => { setEditingSocial(null); setSocialForm({platform:'facebook',url:''}); setShowSocialForm(true); };
  const openSocialEdit = s => { setEditingSocial(s.id); setSocialForm({platform:s.platform,url:s.url}); setShowSocialForm(true); };
  const handleSaveSocial = async () => {
    if(!socialForm.url?.trim()){showToast('URL required','error');return;}setSocialLoading(true);
    try{const body=editingSocial?{id:editingSocial,...socialForm}:socialForm;
    const r=await fetch('/api/social-links',{method:editingSocial?'PUT':'POST',headers:jsonH(),body:JSON.stringify(body)});const d=await r.json();
    if(d.success){showToast(editingSocial?'Updated!':'Added!');setShowSocialForm(false);fetchSocialLinks();}else showToast(d.message||'Failed','error');}catch{showToast('Failed','error');}finally{setSocialLoading(false);}
  };
  const handleDeleteSocial = async id => { if(!confirm('Delete?'))return; setSocialLoading(true); try{const r=await fetch(`/api/social-links?id=${id}`,{method:'DELETE',headers:authH()});const d=await r.json();if(d.success){showToast('Deleted!');fetchSocialLinks();}else showToast(d.message||'Failed','error');}catch{showToast('Failed','error');}finally{setSocialLoading(false);} };

  // ── resource content helpers ─────────────────────────────────────────────
  const fetchResourceContent = async cat => {
    setResLoading(true);
    try { const r = await fetch(`/api/resource-content?category=${cat}`); const d = await r.json(); if (d.success) setResourceContent(d.content); }
    catch (e) { console.error(e); }
    finally { setResLoading(false); }
  };

  const handleResFileSelect = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResUploading(true);
    setResUploadedFile(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const r = await fetch('/api/upload', { method: 'POST', headers: { Authorization: `Bearer ${userToken}` }, body: fd });
      const d = await r.json();
      if (d.success) { setResUploadedFile({ url: d.url, name: d.originalName }); showToast('File uploaded successfully!'); }
      else showToast(d.message || 'Upload failed', 'error');
    } catch { showToast('Upload failed', 'error'); }
    finally { setResUploading(false); if (resFileInputRef.current) resFileInputRef.current.value = ''; }
  };

  const handleCreateResourceContent = async () => {
    if (!resFormData.author || !resFormData.title) { showToast('Author and title are required', 'error'); return; }
    const finalLink = resUploadedFile?.url || resFormData.link?.trim() || undefined;
    if (resFormType === 'video'    && !finalLink) { showToast('Please upload a video file or provide a link', 'error'); return; }
    if (resFormType === 'document' && !finalLink) { showToast('Please upload a document or provide a link', 'error'); return; }
    setResLoading(true);
    try {
      const body = { resource_category: activeResCategory, type: resFormType, author: resFormData.author, author_avatar: resFormData.authorAvatar || '👤', title: resFormData.title, content: resFormData.content, link: finalLink };
      const r = await fetch('/api/resource-content', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` }, body: JSON.stringify(body) });
      const d = await r.json();
      if (d.success) { showToast('Published!'); setResFormData({ author: '', authorAvatar: '', title: '', content: '', link: '' }); setResUploadedFile(null); setShowResForm(false); fetchResourceContent(activeResCategory); }
      else showToast(d.message || 'Failed', 'error');
    } catch { showToast('Failed to publish', 'error'); }
    finally { setResLoading(false); }
  };

  const handleDeleteResourceContent = async id => {
    if (!confirm('Delete this resource content?')) return;
    setResLoading(true);
    try {
      const r = await fetch(`/api/resource-content?id=${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${userToken}` } });
      const d = await r.json();
      if (d.success) { showToast('Deleted!'); fetchResourceContent(activeResCategory); }
      else showToast(d.message || 'Failed', 'error');
    } catch { showToast('Failed to delete', 'error'); }
    finally { setResLoading(false); }
  };

  // ── misc ─────────────────────────────────────────────────────────────────
  const formatDate = ds => { const d = new Date(ds), n = new Date(), m = Math.floor((n-d)/60000), h = Math.floor((n-d)/3600000), dy = Math.floor((n-d)/86400000); if (m<60) return `${m}m ago`; if (h<24) return `${h}h ago`; if (dy<7) return `${dy}d ago`; return d.toLocaleDateString(); };
  const getToastIcon  = t => ({ success: <CheckCircle className="h-5 w-5" style={{color:'#7cad8a'}}/>, error: <XCircle className="h-5 w-5" style={{color:'#c97878'}}/>, warning: <AlertCircle className="h-5 w-5" style={{color:'#c9a878'}}/> }[t] || <CheckCircle className="h-5 w-5" style={{color:'#c9729a'}}/>);
  const getToastStyle = t => ({ success:{background:'rgba(124,173,138,0.12)',border:'1px solid rgba(124,173,138,0.3)',color:'#5a8a68'}, error:{background:'rgba(201,120,120,0.12)',border:'1px solid rgba(201,120,120,0.3)',color:'#a05050'}, warning:{background:'rgba(201,168,120,0.12)',border:'1px solid rgba(201,168,120,0.3)',color:'#8a6830'} }[t] || {background:'rgba(201,114,154,0.12)',border:'1px solid rgba(201,114,154,0.3)',color:'#c9608c'});

  const RES_TYPE_BADGE = { lecture:{bg:'rgba(201,96,140,0.10)',color:'#c9608c',border:'rgba(201,96,140,0.22)'}, video:{bg:'rgba(201,100,100,0.10)',color:'#c96060',border:'rgba(201,100,100,0.22)'}, document:{bg:'rgba(80,140,210,0.10)',color:'#508cd2',border:'rgba(80,140,210,0.22)'}, notes:{bg:'rgba(60,160,100,0.10)',color:'#3ca060',border:'rgba(60,160,100,0.22)'} };

  const activeCategoryMeta = RESOURCE_CATEGORIES.find(c => c.id === activeResCategory);
  const activeProgCatMeta  = PROG_CATS.find(c => c.id === activeProgCat);
  const currentAccept = CONTENT_TYPES.find(t => t.id === resFormType)?.accept || '.pdf';
  const currentHint   = CONTENT_TYPES.find(t => t.id === resFormType)?.hint   || '';
  const needsFile     = resFormType === 'video' || resFormType === 'document';
  const filteredProgramContent = programContent.filter(i => progTypeFilter==='all' || i.type===progTypeFilter);

  // search + filter applied to displayed resource content
  const filteredResourceContent = resourceContent.filter(item => {
    const matchType = resTypeFilter === 'all' || item.type === resTypeFilter;
    const q = resSearchQuery.toLowerCase();
    const matchSearch = !q || item.title.toLowerCase().includes(q) || item.author.toLowerCase().includes(q) || (item.content && item.content.toLowerCase().includes(q));
    return matchType && matchSearch;
  });

  return (
    <div style={{ background: 'linear-gradient(160deg,#fdf6f0 0%,#fef0f5 40%,#f5f0fe 100%)', minHeight: '100vh', fontFamily: "'Jost',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');
        .adm-glass-nav{background:rgba(255,248,245,0.88);backdrop-filter:blur(16px);border-bottom:1px solid rgba(220,160,150,0.2);box-shadow:0 2px 24px rgba(200,130,120,0.08);}
        .adm-glass-card{background:rgba(255,252,250,0.78);backdrop-filter:blur(12px);border:1px solid rgba(220,180,170,0.3);box-shadow:0 4px 32px rgba(190,130,150,0.09),0 1px 0 rgba(255,255,255,0.8) inset;}
        .adm-glass-card-hover:hover{background:rgba(255,245,248,0.95);border-color:rgba(210,140,160,0.5);box-shadow:0 12px 48px rgba(190,110,140,0.18),0 1px 0 rgba(255,255,255,0.9) inset;}
        .adm-rose-btn{background:linear-gradient(135deg,#e8a0b0 0%,#d4779a 50%,#c9608c 100%);color:white;box-shadow:0 4px 20px rgba(200,100,140,0.3);border:none;}
        .adm-rose-btn:hover{background:linear-gradient(135deg,#dc8ca0 0%,#c96888 50%,#bc4f7c 100%);box-shadow:0 6px 28px rgba(200,100,140,0.45);}
        .adm-tab-active{background:linear-gradient(135deg,#e8a0b0,#c9608c);color:white;box-shadow:0 4px 16px rgba(200,100,140,0.3);}
        .adm-tab-inactive{background:rgba(255,245,248,0.6);color:#9a7080;border:1px solid rgba(215,170,185,0.3);}
        .adm-tab-inactive:hover{background:rgba(255,235,244,0.8);color:#c9608c;}
        .adm-input{background:rgba(255,248,252,0.7);border:1px solid rgba(215,170,185,0.35);color:#4a2a3a;border-radius:10px;font-family:'Jost',sans-serif;font-weight:300;transition:all 0.2s;}
        .adm-input::placeholder{color:#c4a0b0;}
        .adm-input:focus{outline:none;border-color:rgba(201,96,140,0.5);box-shadow:0 0 0 3px rgba(201,96,140,0.1);background:rgba(255,250,253,0.9);}
        .adm-delete-btn{color:#c4a0b0;transition:color 0.2s;}
        .adm-delete-btn:hover{color:#c97878;}
        .adm-logout-btn{background:rgba(201,120,120,0.1);color:#a05060;border:1px solid rgba(201,120,120,0.25);border-radius:20px;transition:all 0.2s;}
        .adm-logout-btn:hover{background:rgba(201,120,120,0.18);}
        .adm-home-btn{background:rgba(100,160,210,0.1);color:#3870a0;border:1px solid rgba(100,160,210,0.25);border-radius:20px;transition:all 0.2s;}
        .adm-home-btn:hover{background:rgba(100,160,210,0.18);}
        .adm-modal-bg{background:rgba(60,20,40,0.38);backdrop-filter:blur(10px);}
        .adm-modal{background:linear-gradient(160deg,#fdf6f0,#fef0f8);border:1px solid rgba(220,170,185,0.35);box-shadow:0 24px 80px rgba(180,100,140,0.2);}
        .adm-modal-header{background:rgba(255,248,252,0.92);border-bottom:1px solid rgba(215,170,185,0.25);}
        .adm-cancel-btn{background:rgba(215,190,200,0.25);color:#8a6070;border:1px solid rgba(215,170,185,0.3);border-radius:10px;transition:all 0.2s;}
        .adm-cancel-btn:hover{background:rgba(215,190,200,0.4);}
        .adm-content-card{background:rgba(255,252,250,0.75);border:1px solid rgba(220,180,170,0.25);border-radius:16px;transition:all 0.2s;}
        .adm-content-card:hover{border-color:rgba(210,140,160,0.4);box-shadow:0 4px 20px rgba(190,110,150,0.1);}
        .adm-badge-admin{background:rgba(201,96,140,0.12);color:#c9608c;border:1px solid rgba(201,96,140,0.25);border-radius:20px;font-size:0.72rem;padding:2px 10px;font-family:'Jost',sans-serif;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;}
        .adm-add-user-btn{background:linear-gradient(135deg,#e8a0b0 0%,#c9608c 100%);color:white;border:none;border-radius:20px;padding:10px 22px;font-family:'Jost',sans-serif;font-weight:500;font-size:0.85rem;letter-spacing:0.04em;box-shadow:0 4px 16px rgba(201,96,140,0.28);transition:all 0.2s;display:flex;align-items:center;gap:6px;}
        .adm-add-user-btn:hover{transform:scale(1.04);box-shadow:0 6px 24px rgba(201,96,140,0.38);}
        .adm-video-icon-wrap{background:linear-gradient(135deg,rgba(201,120,120,0.18),rgba(180,100,100,0.12));}
        .adm-video-btn{background:linear-gradient(135deg,#e8a0a0,#c97878);color:white;border:none;border-radius:12px;padding:10px 20px;font-weight:600;font-family:'Jost',sans-serif;box-shadow:0 4px 14px rgba(201,120,120,0.3);display:flex;align-items:center;gap:6px;transition:all 0.2s;}
        .adm-video-btn:hover{background:linear-gradient(135deg,#dc8c8c,#b96060);}
        .adm-res-cat-card{background:rgba(255,252,250,0.8);border:1px solid rgba(220,180,170,0.28);border-radius:18px;transition:all 0.25s;cursor:pointer;}
        .adm-res-cat-card:hover{background:rgba(255,248,252,0.96);border-color:rgba(210,140,160,0.48);box-shadow:0 8px 32px rgba(190,110,140,0.12);transform:translateY(-2px);}
        .adm-res-cat-card-active{background:rgba(255,240,248,0.96)!important;border-color:rgba(201,96,140,0.5)!important;box-shadow:0 8px 32px rgba(201,96,140,0.14)!important;}
        .adm-type-btn{display:flex;align-items:center;gap:6px;padding:8px 16px;border-radius:10px;border:1px solid rgba(215,170,185,0.35);background:rgba(255,248,252,0.7);color:#9a7080;font-family:'Jost',sans-serif;font-size:0.82rem;cursor:pointer;transition:all 0.2s;}
        .adm-type-btn:hover{background:rgba(255,232,242,0.88);color:#c9608c;border-color:rgba(201,96,140,0.35);}
        .adm-type-btn-active{background:linear-gradient(135deg,rgba(232,160,176,0.2),rgba(201,96,140,0.15))!important;color:#c9608c!important;border-color:rgba(201,96,140,0.4)!important;}
        .adm-res-badge{display:inline-flex;align-items:center;gap:4px;padding:2px 9px;border-radius:20px;font-size:0.7rem;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;font-family:'Jost',sans-serif;}
        .adm-link-text{color:#c9729a;font-size:0.88rem;word-break:break-all;}
        .adm-link-text:hover{color:#a05070;}
        /* upload area */
        .adm-upload-area{border:2px dashed rgba(215,170,185,0.5);border-radius:14px;padding:28px 20px;text-align:center;cursor:pointer;transition:all 0.2s;background:rgba(255,248,252,0.5);}
        .adm-upload-area:hover{border-color:rgba(201,96,140,0.55);background:rgba(255,240,248,0.7);}
        .adm-upload-area.has-file{border-color:rgba(100,180,130,0.55);background:rgba(100,180,130,0.06);}
        /* search bar */
        .adm-search-wrap{position:relative;}
        .adm-search-wrap svg{position:absolute;left:12px;top:50%;transform:translateY(-50%);pointer-events:none;}
        .adm-search-input{background:rgba(255,248,252,0.85);border:1px solid rgba(215,170,185,0.35);color:#4a2a3a;border-radius:30px;padding:9px 16px 9px 36px;font-family:'Jost',sans-serif;font-size:0.84rem;width:240px;transition:all 0.2s;}
        .adm-search-input::placeholder{color:#c4a0b0;}
        .adm-search-input:focus{outline:none;border-color:rgba(201,96,140,0.5);box-shadow:0 0 0 3px rgba(201,96,140,0.09);background:rgba(255,250,253,0.97);}
        /* filter type buttons */
        .adm-flt-btn{padding:7px 14px;border-radius:20px;font-family:'Jost',sans-serif;font-size:0.78rem;cursor:pointer;transition:all 0.2s;background:rgba(255,245,248,0.7);color:#9a7080;border:1px solid rgba(215,170,185,0.3);}
        .adm-flt-btn:hover{background:rgba(255,232,242,0.88);color:#c9608c;}
        .adm-flt-btn.adm-flt-active{background:linear-gradient(135deg,#e8a0b0,#c9608c)!important;color:#fff!important;border:none!important;box-shadow:0 3px 12px rgba(200,100,140,0.25);}
        .adm-flt-btn.adm-flt-active:hover{color:#fff!important;}
      `}</style>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100]">
          <div className="flex items-center space-x-3 px-6 py-4 rounded-2xl shadow-2xl" style={{ ...getToastStyle(toast.type), minWidth: 300, maxWidth: 420, backdropFilter: 'blur(12px)', fontFamily: "'Jost',sans-serif" }}>
            {getToastIcon(toast.type)}
            <span className="flex-1 font-medium" style={{ fontSize: '0.9rem' }}>{toast.message}</span>
            <button onClick={() => setToast(null)} style={{ opacity: 0.6 }} onMouseEnter={e => e.currentTarget.style.opacity='1'} onMouseLeave={e => e.currentTarget.style.opacity='0.6'}><X className="h-4 w-4" /></button>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="adm-glass-nav sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Image src="/logo.png" alt="Logo" width={40} height={40} priority className="rounded-full hover:scale-105 transition-transform" />
              <div>
                <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 500, color: '#3d2535', fontSize: '1.2rem' }}>OBGYNE HITEC-IMS</span>
                <span className="adm-badge-admin ml-2">Admin Panel</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2" style={{ color: '#9a7080' }}>
                <Users className="h-5 w-5" />
                <span className="hidden sm:inline" style={{ fontFamily: "'Jost',sans-serif", fontWeight: 300, fontSize: '0.9rem' }}>Admin</span>
              </div>
              <button onClick={onNavigateToHome} className="adm-home-btn flex items-center space-x-2 px-4 py-2">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline" style={{ fontFamily: "'Jost',sans-serif", fontSize: '0.85rem' }}>Home Page</span>
              </button>
              <button onClick={onLogout} className="adm-logout-btn flex items-center space-x-2 px-4 py-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline" style={{ fontFamily: "'Jost',sans-serif", fontSize: '0.85rem' }}>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Add User */}
      <div className="flex items-center justify-end px-24 pt-10">
        <button onClick={() => onNavigateToSignup && onNavigateToSignup()} className="adm-add-user-btn">
          <Plus className="h-5 w-5" /><span className="hidden sm:inline">Add New User</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: 300, color: '#3d2535', fontSize: '2.2rem' }} className="mb-2">Admin Dashboard</h1>
          <p style={{ color: '#9a7888', fontFamily: "'Jost',sans-serif", fontWeight: 300 }}>Manage all homepage content — faculty, programs, research, events, services and more</p>
        </div>

        {/* Tabs */}
        <div style={{overflowX:'auto',paddingBottom:4,marginBottom:32}}>
          <div style={{display:'flex',gap:8,minWidth:'max-content'}}>
            {[
              {id:'resources',label:'Resources',icon:BookOpen},
              {id:'faculty',label:'Faculty',icon:Users},
              {id:'programs',label:'Programs',icon:GraduationCap},
              {id:'research',label:'Research',icon:FlaskConical},
              {id:'achievements',label:'Achievements',icon:Trophy},
              {id:'events-news',label:'Events & News',icon:Calendar},
              {id:'services',label:'Services',icon:Stethoscope},
              {id:'contact-links',label:'Contact & Links',icon:Phone},
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all whitespace-nowrap ${activeTab===tab.id?'adm-tab-active':'adm-tab-inactive'}`}
                  style={{fontFamily:"'Jost',sans-serif",letterSpacing:'0.04em'}}>
                  <Icon className="h-4 w-4"/>{tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Resource Content ─────────────────────────────────────────────── */}
        {activeTab === 'resources' && (
          <div>
            <div className="mb-8">
              <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:400,color:'#3d2535',fontSize:'1.6rem'}} className="mb-2">Educational Resource Content</h2>
              <p style={{color:'#9a7888',fontFamily:"'Jost',sans-serif",fontWeight:300}}>Select a category to manage its content</p>
            </div>

            {/* Category cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {RESOURCE_CATEGORIES.map(cat => (
                <div key={cat.id} className={`adm-res-cat-card p-6 ${activeResCategory===cat.id?'adm-res-cat-card-active':''}`} onClick={() => setActiveResCategory(cat.id)}>
                  <div className="flex items-center gap-4 mb-3">
                    <div style={{fontSize:'2rem',lineHeight:1}}>{cat.emoji}</div>
                    <div>
                      <h3 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:500,color:'#3d2535',fontSize:'1.1rem',lineHeight:1.3}}>{cat.title}</h3>
                      <p style={{color:'#b09098',fontFamily:"'Jost',sans-serif",fontWeight:300,fontSize:'0.8rem',marginTop:2}}>{cat.desc}</p>
                    </div>
                  </div>
                  {activeResCategory===cat.id && (
                    <div style={{display:'flex',alignItems:'center',gap:5,color:'#c9608c',fontSize:'0.78rem',fontFamily:"'Jost',sans-serif",fontWeight:500,letterSpacing:'0.05em',textTransform:'uppercase'}}>
                      <span>Selected</span><span>•</span><span>{resLoading?'…':`${resourceContent.length} item${resourceContent.length!==1?'s':''}`}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Content area */}
            {activeResCategory && (
              <div>
                {/* Header row */}
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20,flexWrap:'wrap',gap:12}}>
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <span style={{fontSize:'1.6rem'}}>{activeCategoryMeta?.emoji}</span>
                    <div>
                      <h3 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:500,color:'#3d2535',fontSize:'1.4rem'}}>{activeCategoryMeta?.title}</h3>
                      <p style={{color:'#9a7888',fontFamily:"'Jost',sans-serif",fontWeight:300,fontSize:'0.84rem'}}>
                        {filteredResourceContent.length}{filteredResourceContent.length!==resourceContent.length?` of ${resourceContent.length}`:''} item{resourceContent.length!==1?'s':''}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => { setShowResForm(true); setResFormData({author:'',authorAvatar:'',title:'',content:'',link:''}); setResUploadedFile(null); setResFormType('lecture'); }} className="adm-rose-btn flex items-center gap-2 px-5 py-3 rounded-xl font-medium" style={{fontFamily:"'Jost',sans-serif",fontSize:'0.85rem'}}>
                    <Plus className="h-5 w-5"/>Add Content
                  </button>
                </div>

                {/* Search + type filter */}
                <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20,flexWrap:'wrap'}}>
                  <div className="adm-search-wrap">
                    <Search style={{width:14,height:14,color:'#c4a0b0'}}/>
                    <input type="text" placeholder="Search by title, author, content…" value={resSearchQuery} onChange={e=>setResSearchQuery(e.target.value)} className="adm-search-input"/>
                  </div>
                  <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                    {['all','lecture','video','document','notes'].map(f=>(
                      <button key={f} onClick={()=>setResTypeFilter(f)} className={`adm-flt-btn ${resTypeFilter===f?'adm-flt-active':''}`} style={{textTransform:'capitalize'}}>
                        {f==='all'?'All Types':f}
                      </button>
                    ))}
                  </div>
                  {(resSearchQuery||resTypeFilter!=='all') && (
                    <button onClick={()=>{setResSearchQuery('');setResTypeFilter('all');}} style={{color:'#fa0000',fontSize:'0.8rem',fontFamily:"'Jost',sans-serif",background:'none',border:'none',cursor:'pointer',textDecoration:'underline'}}>Clear</button>
                  )}
                </div>

                {/* List */}
                {resLoading ? (
                  <div style={{textAlign:'center',padding:'40px 0'}}><Loader2 className="h-8 w-8 animate-spin mx-auto" style={{color:'#c9608c'}}/></div>
                ) : filteredResourceContent.length === 0 ? (
                  <div style={{textAlign:'center',padding:'48px 0'}}>
                    <div style={{fontSize:'3rem',marginBottom:14}}>{activeCategoryMeta?.emoji}</div>
                    <h3 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:400,color:'#3d2535',fontSize:'1.3rem'}} className="mb-2">{resSearchQuery||resTypeFilter!=='all'?'No matching content':'No content yet'}</h3>
                    <p style={{color:'#9a7888',fontFamily:"'Jost',sans-serif",fontWeight:300}}>{resSearchQuery||resTypeFilter!=='all'?'Try a different search or clear the filter.':'Add lectures, videos, documents or notes for this resource.'}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredResourceContent.map(item => {
                      const ts = RES_TYPE_BADGE[item.type]||RES_TYPE_BADGE.lecture;
                      return (
                        <div key={item.id} className="adm-content-card p-5">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{background:'rgba(220,175,190,0.2)'}}>{item.author_avatar}</div>
                              <div>
                                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:2}}>
                                  <span style={{color:'#4a2a3a',fontFamily:"'Jost',sans-serif",fontWeight:500,fontSize:'0.9rem'}}>{item.author}</span>
                                  <span className="adm-res-badge" style={{background:ts.bg,color:ts.color,border:`1px solid ${ts.border}`}}>{item.type}</span>
                                </div>
                                <span style={{color:'#b09098',fontFamily:"'Jost',sans-serif",fontWeight:300,fontSize:'0.78rem'}}>{formatDate(item.created_at)}</span>
                              </div>
                            </div>
                            <button className="adm-delete-btn p-2" onClick={()=>handleDeleteResourceContent(item.id)} disabled={resLoading}><Trash2 className="h-4 w-4"/></button>
                          </div>
                          <h4 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:500,color:'#3d2535',fontSize:'1.1rem'}} className="mb-1">{item.title}</h4>
                          {item.content && <p style={{color:'#7a6070',fontFamily:"'Jost',sans-serif",fontWeight:300,fontSize:'0.88rem',lineHeight:1.65,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{item.content}</p>}
                          {item.link && <span style={{color:'#c9729a',fontSize:'0.82rem',fontFamily:"'Jost',sans-serif",marginTop:4,display:'block'}}>📎 {item.link.split('/').pop()}</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {!activeResCategory && (
              <div style={{textAlign:'center',padding:'60px 0'}}>
                <div style={{fontSize:'3rem',marginBottom:16}}>👆</div>
                <p style={{color:'#9a7888',fontFamily:"'Jost',sans-serif",fontWeight:300}}>Select a resource category above to manage its content</p>
              </div>
            )}
          </div>
        )}

        {/* ─── Faculty ────────────────────────────────────────────────────── */}
        {activeTab==='faculty' && (
          <div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24,flexWrap:'wrap',gap:12}}>
              <div>
                <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:400,color:'#3d2535',fontSize:'1.6rem'}}>Faculty Members</h2>
                <p style={{color:'#9a7888',fontFamily:"'Jost',sans-serif",fontWeight:300,fontSize:'0.86rem'}}>{faculty.length} member{faculty.length!==1?'s':''}</p>
              </div>
              <button onClick={openFacultyAdd} className="adm-rose-btn flex items-center gap-2 px-5 py-3 rounded-xl font-medium" style={{fontFamily:"'Jost',sans-serif",fontSize:'0.85rem'}}><Plus className="h-5 w-5"/>Add Faculty</button>
            </div>
            {facultyLoading&&!faculty.length?<div style={{textAlign:'center',padding:40}}><Loader2 className="h-8 w-8 animate-spin mx-auto" style={{color:'#c9608c'}}/></div>:(
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {faculty.map(f=>(
                  <div key={f.id} className="adm-glass-card rounded-2xl p-5 transition-all hover:shadow-lg">
                    <div style={{display:'flex',gap:14,alignItems:'flex-start',marginBottom:12}}>
                      <div style={{width:56,height:56,borderRadius:'50%',overflow:'hidden',flexShrink:0,background:'rgba(220,175,190,0.2)',border:'2px solid rgba(215,165,185,0.3)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                        {f.image_url?<img src={f.image_url} alt={f.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<Users className="h-7 w-7" style={{color:'#c9a0b4'}}/>}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
                          <span style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:500,color:'#3d2535',fontSize:'1.05rem'}}>{f.name}</span>
                          {f.is_hod&&<span style={{background:'rgba(201,96,140,0.12)',color:'#c9608c',border:'1px solid rgba(201,96,140,0.25)',borderRadius:20,fontSize:'0.68rem',padding:'1px 8px',fontFamily:"'Jost',sans-serif",fontWeight:500,textTransform:'uppercase',letterSpacing:'0.06em'}}>HOD</span>}
                        </div>
                        <p style={{color:'#c9729a',fontFamily:"'Jost',sans-serif",fontWeight:400,fontSize:'0.82rem',marginTop:2}}>{f.role_title}</p>
                        {f.credentials&&<p style={{color:'#9a7888',fontFamily:"'Jost',sans-serif",fontWeight:300,fontSize:'0.78rem'}}>{f.credentials}</p>}
                        {f.experience_note&&<p style={{color:'#b09098',fontFamily:"'Jost',sans-serif",fontWeight:300,fontSize:'0.75rem',marginTop:2}}>{f.experience_note}</p>}
                      </div>
                    </div>
                    <div style={{display:'flex',gap:8,justifyContent:'flex-end',borderTop:'1px solid rgba(220,180,170,0.2)',paddingTop:10}}>
                      <button onClick={()=>openFacultyEdit(f)} style={{display:'flex',alignItems:'center',gap:4,padding:'5px 12px',borderRadius:8,background:'rgba(201,96,140,0.08)',color:'#c9608c',border:'1px solid rgba(201,96,140,0.2)',fontFamily:"'Jost',sans-serif",fontSize:'0.78rem',cursor:'pointer'}}><Edit2 className="h-3.5 w-3.5"/>Edit</button>
                      <button onClick={()=>handleDeleteFaculty(f.id)} className="adm-delete-btn p-1.5 rounded-lg" style={{background:'rgba(201,120,120,0.06)'}}><Trash2 className="h-4 w-4"/></button>
                    </div>
                  </div>
                ))}
                {faculty.length===0&&!facultyLoading&&<div style={{gridColumn:'1/-1',textAlign:'center',padding:'48px 0'}}><Users className="h-12 w-12 mx-auto mb-4" style={{color:'#e0c8d0'}}/><p style={{color:'#9a7888',fontFamily:"'Jost',sans-serif",fontWeight:300}}>No faculty members yet</p></div>}
              </div>
            )}
          </div>
        )}

        {/* ─── Programs ───────────────────────────────────────────────────── */}
        {activeTab==='programs' && (
          <div>
            <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:400,color:'#3d2535',fontSize:'1.6rem',marginBottom:8}}>Program Content</h2>
            <p style={{color:'#9a7888',fontFamily:"'Jost',sans-serif",fontWeight:300,marginBottom:24}}>Select a program to manage its content</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
              {PROG_CATS.map(cat=>(
                <div key={cat.id} className={`adm-res-cat-card p-6 ${activeProgCat===cat.id?'adm-res-cat-card-active':''}`} onClick={()=>{setActiveProgCat(cat.id);setProgTypeFilter('all');}}>
                  <div style={{fontSize:'2rem',marginBottom:8}}>{cat.emoji}</div>
                  <h3 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:500,color:'#3d2535',fontSize:'1.1rem'}}>{cat.label}</h3>
                  <p style={{color:'#b09098',fontFamily:"'Jost',sans-serif",fontWeight:300,fontSize:'0.8rem',marginTop:4}}>{cat.desc}</p>
                  {activeProgCat===cat.id&&<p style={{color:'#c9608c',fontSize:'0.78rem',fontFamily:"'Jost',sans-serif",fontWeight:500,marginTop:8,textTransform:'uppercase',letterSpacing:'0.05em'}}>Selected • {progLoading?'…':`${filteredProgramContent.length} items`}</p>}
                </div>
              ))}
            </div>
            {activeProgCat&&(
              <div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16,flexWrap:'wrap',gap:12}}>
                  <h3 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:500,color:'#3d2535',fontSize:'1.3rem'}}>{activeProgCatMeta?.emoji} {activeProgCatMeta?.label}</h3>
                  <button onClick={()=>{setShowProgForm(true);setProgForm({title:'',content:'',link:''});setProgFile(null);setProgFormType('document');}} className="adm-rose-btn flex items-center gap-2 px-5 py-3 rounded-xl font-medium" style={{fontFamily:"'Jost',sans-serif",fontSize:'0.85rem'}}><Plus className="h-5 w-5"/>Add Content</button>
                </div>
                <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:16}}>
                  {['all',...PROG_TYPES].map(f=><button key={f} onClick={()=>setProgTypeFilter(f)} className={`adm-flt-btn ${progTypeFilter===f?'adm-flt-active':''}`} style={{textTransform:'capitalize'}}>{f==='all'?'All Types':f}</button>)}
                </div>
                {progLoading?<div style={{textAlign:'center',padding:40}}><Loader2 className="h-8 w-8 animate-spin mx-auto" style={{color:'#c9608c'}}/></div>:filteredProgramContent.length===0?
                  <div style={{textAlign:'center',padding:'48px 0'}}><p style={{color:'#9a7888',fontFamily:"'Jost',sans-serif",fontWeight:300}}>No content yet — add the first item</p></div>:
                  <div className="space-y-4">
                    {filteredProgramContent.map(item=>(
                      <div key={item.id} className="adm-content-card p-5">
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                          <div style={{flex:1}}>
                            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                              <span className="adm-res-badge" style={{background:'rgba(201,96,140,0.10)',color:'#c9608c',border:'1px solid rgba(201,96,140,0.22)',textTransform:'capitalize'}}>{item.type}</span>
                              <span style={{color:'#b09098',fontSize:'0.78rem',fontFamily:"'Jost',sans-serif",fontWeight:300}}>{formatDate(item.created_at)}</span>
                            </div>
                            <h4 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:500,color:'#3d2535',fontSize:'1.05rem',marginBottom:4}}>{item.title}</h4>
                            {item.content&&<p style={{color:'#7a6070',fontFamily:"'Jost',sans-serif",fontWeight:300,fontSize:'0.85rem',lineHeight:1.6}}>{item.content}</p>}
                            {item.link&&<span style={{color:'#c9729a',fontSize:'0.82rem',fontFamily:"'Jost',sans-serif",marginTop:4,display:'block'}}>📎 {item.link.split('/').pop()}</span>}
                          </div>
                          <button className="adm-delete-btn p-2 ml-4" onClick={()=>handleDeleteProgram(item.id)}><Trash2 className="h-4 w-4"/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                }
              </div>
            )}
            {!activeProgCat&&<div style={{textAlign:'center',padding:'48px 0'}}><div style={{fontSize:'3rem',marginBottom:12}}>👆</div><p style={{color:'#9a7888',fontFamily:"'Jost',sans-serif",fontWeight:300}}>Select a program category above</p></div>}
          </div>
        )}

        {/* ─── Research ───────────────────────────────────────────────────── */}
        {activeTab==='research' && (
          <div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24,flexWrap:'wrap',gap:12}}>
              <div>
                <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:400,color:'#3d2535',fontSize:'1.6rem'}}>Research & Publications</h2>
                <p style={{color:'#9a7888',fontFamily:"'Jost',sans-serif",fontWeight:300,fontSize:'0.86rem'}}>{research.length} publication{research.length!==1?'s':''}</p>
              </div>
              <button onClick={()=>{setShowResearchForm(true);setResearchForm({title:'',authors:'',journal_name:'',year:'',abstract:'',link:'',type:'publication'});setResearchFile(null);}} className="adm-rose-btn flex items-center gap-2 px-5 py-3 rounded-xl font-medium" style={{fontFamily:"'Jost',sans-serif",fontSize:'0.85rem'}}><Plus className="h-5 w-5"/>Add Publication</button>
            </div>
            {researchLoading?<div style={{textAlign:'center',padding:40}}><Loader2 className="h-8 w-8 animate-spin mx-auto" style={{color:'#c9608c'}}/></div>:research.length===0?
              <div style={{textAlign:'center',padding:'60px 0'}}><FlaskConical className="h-12 w-12 mx-auto mb-4" style={{color:'#e0c8d0'}}/><p style={{color:'#9a7888',fontFamily:"'Jost',sans-serif",fontWeight:300}}>No publications yet</p></div>:
              <div className="space-y-4">
                {research.map(r=>{
                  const typeBg={research:'rgba(100,140,200,0.10)',publication:'rgba(201,96,140,0.10)',thesis:'rgba(60,160,100,0.10)',conference:'rgba(201,168,100,0.10)'};
                  const typeColor={research:'#508cd2',publication:'#c9608c',thesis:'#3ca060',conference:'#c9a830'};
                  return(
                    <div key={r.id} className="adm-content-card p-5">
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                        <div style={{flex:1}}>
                          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                            <span className="adm-res-badge" style={{background:typeBg[r.type]||typeBg.publication,color:typeColor[r.type]||typeColor.publication,border:'1px solid currentColor',textTransform:'capitalize'}}>{r.type}</span>
                            {r.year&&<span style={{color:'#b09098',fontSize:'0.8rem',fontFamily:"'Jost',sans-serif"}}>{r.year}</span>}
                          </div>
                          <h4 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:500,color:'#3d2535',fontSize:'1.1rem',marginBottom:4}}>{r.title}</h4>
                          <p style={{color:'#7a6070',fontFamily:"'Jost',sans-serif",fontWeight:400,fontSize:'0.85rem',marginBottom:4}}>{r.authors}</p>
                          {r.journal_name&&<p style={{color:'#9a7888',fontFamily:"'Jost',sans-serif",fontWeight:300,fontSize:'0.82rem',fontStyle:'italic'}}>{r.journal_name}</p>}
                          {r.abstract&&<p style={{color:'#7a6070',fontFamily:"'Jost',sans-serif",fontWeight:300,fontSize:'0.82rem',marginTop:6,lineHeight:1.6,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{r.abstract}</p>}
                          {r.link&&<a href={r.link} target="_blank" rel="noopener noreferrer" style={{color:'#c9729a',fontSize:'0.8rem',fontFamily:"'Jost',sans-serif",marginTop:4,display:'inline-block'}}>🔗 View Publication</a>}
                        </div>
                        <button className="adm-delete-btn p-2 ml-4" onClick={()=>handleDeleteResearch(r.id)}><Trash2 className="h-4 w-4"/></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            }
          </div>
        )}

        {/* ─── Achievements ───────────────────────────────────────────────── */}
        {activeTab==='achievements' && (
          <div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24,flexWrap:'wrap',gap:12}}>
              <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:400,color:'#3d2535',fontSize:'1.6rem'}}>Achievements</h2>
              <button onClick={()=>setShowAchForm(true)} className="adm-rose-btn flex items-center gap-2 px-5 py-3 rounded-xl font-medium" style={{fontFamily:"'Jost',sans-serif",fontSize:'0.85rem'}}><Plus className="h-5 w-5"/>Add Achievement</button>
            </div>
            {achLoading&&!achievements.length?<div style={{textAlign:'center',padding:40}}><Loader2 className="h-8 w-8 animate-spin mx-auto" style={{color:'#c9608c'}}/></div>:(
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {achievements.map(a=>{
                  const AchIcon=ACH_ICON_MAP[a.icon_name]||Trophy;
                  const isEditing=editingAch===a.id;
                  return(
                    <div key={a.id} className="adm-glass-card rounded-2xl p-6 text-center">
                      {isEditing?(
                        <div style={{textAlign:'left'}}>
                          <label style={{color:'#7a6070',fontSize:'0.78rem',fontFamily:"'Jost',sans-serif",display:'block',marginBottom:4}}>Icon</label>
                          <select value={achForm.icon_name} onChange={e=>setAchForm(p=>({...p,icon_name:e.target.value}))} className="adm-input w-full px-3 py-2 mb-3" style={{fontSize:'0.85rem'}}>
                            {Object.keys(ACH_ICON_MAP).map(k=><option key={k} value={k}>{k}</option>)}
                          </select>
                          <label style={{color:'#7a6070',fontSize:'0.78rem',fontFamily:"'Jost',sans-serif",display:'block',marginBottom:4}}>Number/Value</label>
                          <input value={achForm.number_text} onChange={e=>setAchForm(p=>({...p,number_text:e.target.value}))} className="adm-input w-full px-3 py-2 mb-3" style={{fontSize:'0.85rem'}} placeholder="e.g. 500+"/>
                          <label style={{color:'#7a6070',fontSize:'0.78rem',fontFamily:"'Jost',sans-serif",display:'block',marginBottom:4}}>Label</label>
                          <input value={achForm.label} onChange={e=>setAchForm(p=>({...p,label:e.target.value}))} className="adm-input w-full px-3 py-2 mb-4" style={{fontSize:'0.85rem'}} placeholder="e.g. Deliveries/Year"/>
                          <div style={{display:'flex',gap:8}}>
                            <button onClick={()=>handleSaveAch(a.id)} className="adm-rose-btn flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-xl" style={{fontSize:'0.8rem',fontFamily:"'Jost',sans-serif"}}><Save className="h-3.5 w-3.5"/>Save</button>
                            <button onClick={()=>setEditingAch(null)} className="adm-cancel-btn px-3 py-2" style={{fontSize:'0.8rem',fontFamily:"'Jost',sans-serif"}}>Cancel</button>
                          </div>
                        </div>
                      ):(
                        <>
                          <div style={{width:52,height:52,borderRadius:14,background:'linear-gradient(135deg,rgba(232,160,176,0.2),rgba(201,96,140,0.12))',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px'}}><AchIcon className="h-7 w-7" style={{color:'#c9608c'}}/></div>
                          <div style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:600,color:'#3d2535',fontSize:'1.8rem',marginBottom:4}}>{a.number_text}</div>
                          <div style={{color:'#7a6070',fontFamily:"'Jost',sans-serif",fontWeight:300,fontSize:'0.85rem',marginBottom:14}}>{a.label}</div>
                          <div style={{display:'flex',gap:6,justifyContent:'center'}}>
                            <button onClick={()=>handleEditAch(a)} style={{display:'flex',alignItems:'center',gap:4,padding:'4px 12px',borderRadius:8,background:'rgba(201,96,140,0.08)',color:'#c9608c',border:'1px solid rgba(201,96,140,0.2)',fontSize:'0.78rem',fontFamily:"'Jost',sans-serif",cursor:'pointer'}}><Edit2 className="h-3 w-3"/>Edit</button>
                            <button onClick={()=>handleDeleteAch(a.id)} className="adm-delete-btn p-1 rounded-lg"><Trash2 className="h-3.5 w-3.5"/></button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ─── Events & News ──────────────────────────────────────────────── */}
        {activeTab==='events-news' && (
          <div>
            <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:400,color:'#3d2535',fontSize:'1.6rem',marginBottom:20}}>Events & News</h2>
            <div style={{display:'flex',gap:8,marginBottom:24}}>
              {[{id:'events',label:'Events',icon:Calendar},{id:'news',label:'News',icon:MessageCircle}].map(st=>{const I=st.icon;return(<button key={st.id} onClick={()=>setEnSubTab(st.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${enSubTab===st.id?'adm-tab-active':'adm-tab-inactive'}`} style={{fontFamily:"'Jost',sans-serif"}}><I className="h-4 w-4"/>{st.label}</button>);})}
            </div>
            {enSubTab==='events'&&(
              <div>
                <div style={{display:'flex',justifyContent:'flex-end',marginBottom:16}}>
                  <button onClick={openEventAdd} className="adm-rose-btn flex items-center gap-2 px-5 py-3 rounded-xl font-medium" style={{fontFamily:"'Jost',sans-serif",fontSize:'0.85rem'}}><Plus className="h-5 w-5"/>Add Event</button>
                </div>
                {eventsLoading?<div style={{textAlign:'center',padding:40}}><Loader2 className="h-8 w-8 animate-spin mx-auto" style={{color:'#c9608c'}}/></div>:events.length===0?<div style={{textAlign:'center',padding:'48px 0'}}><Calendar className="h-12 w-12 mx-auto mb-4" style={{color:'#e0c8d0'}}/><p style={{color:'#9a7888',fontFamily:"'Jost',sans-serif",fontWeight:300}}>No events yet</p></div>:(
                  <div className="space-y-4">
                    {events.map(ev=>(
                      <div key={ev.id} className="adm-content-card p-5">
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                          <div style={{flex:1}}>
                            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                              <span style={{background:'rgba(100,140,200,0.1)',color:'#508cd2',border:'1px solid rgba(100,140,200,0.2)',borderRadius:20,padding:'2px 10px',fontSize:'0.75rem',fontFamily:"'Jost',sans-serif",fontWeight:500}}>{ev.date_text}</span>
                            </div>
                            <h4 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:500,color:'#3d2535',fontSize:'1.1rem',marginBottom:4}}>{ev.title}</h4>
                            {ev.description&&<p style={{color:'#7a6070',fontFamily:"'Jost',sans-serif",fontWeight:300,fontSize:'0.85rem',lineHeight:1.6}}>{ev.description}</p>}
                          </div>
                          <div style={{display:'flex',gap:6,marginLeft:12}}>
                            <button onClick={()=>openEventEdit(ev)} style={{padding:'5px 10px',borderRadius:8,background:'rgba(201,96,140,0.08)',color:'#c9608c',border:'1px solid rgba(201,96,140,0.2)',cursor:'pointer',display:'flex',alignItems:'center',gap:4,fontSize:'0.78rem',fontFamily:"'Jost',sans-serif"}}><Edit2 className="h-3.5 w-3.5"/>Edit</button>
                            <button onClick={()=>handleDeleteEvent(ev.id)} className="adm-delete-btn p-1.5 rounded-lg"><Trash2 className="h-4 w-4"/></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {enSubTab==='news'&&(
              <div>
                <div style={{display:'flex',justifyContent:'flex-end',marginBottom:16}}>
                  <button onClick={openNewsAdd} className="adm-rose-btn flex items-center gap-2 px-5 py-3 rounded-xl font-medium" style={{fontFamily:"'Jost',sans-serif",fontSize:'0.85rem'}}><Plus className="h-5 w-5"/>Add News</button>
                </div>
                {newsLoading?<div style={{textAlign:'center',padding:40}}><Loader2 className="h-8 w-8 animate-spin mx-auto" style={{color:'#c9608c'}}/></div>:news.length===0?<div style={{textAlign:'center',padding:'48px 0'}}><MessageCircle className="h-12 w-12 mx-auto mb-4" style={{color:'#e0c8d0'}}/><p style={{color:'#9a7888',fontFamily:"'Jost',sans-serif",fontWeight:300}}>No news yet</p></div>:(
                  <div className="space-y-4">
                    {news.map(n=>(
                      <div key={n.id} className="adm-content-card p-5">
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                          <div style={{flex:1}}>
                            <div style={{marginBottom:4}}><span style={{background:'rgba(60,160,100,0.1)',color:'#3ca060',border:'1px solid rgba(60,160,100,0.2)',borderRadius:20,padding:'2px 10px',fontSize:'0.75rem',fontFamily:"'Jost',sans-serif",fontWeight:500}}>{n.date_text}</span></div>
                            <h4 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:500,color:'#3d2535',fontSize:'1.1rem',marginBottom:4}}>{n.title}</h4>
                            {n.description&&<p style={{color:'#7a6070',fontFamily:"'Jost',sans-serif",fontWeight:300,fontSize:'0.85rem',lineHeight:1.6}}>{n.description}</p>}
                          </div>
                          <div style={{display:'flex',gap:6,marginLeft:12}}>
                            <button onClick={()=>openNewsEdit(n)} style={{padding:'5px 10px',borderRadius:8,background:'rgba(201,96,140,0.08)',color:'#c9608c',border:'1px solid rgba(201,96,140,0.2)',cursor:'pointer',display:'flex',alignItems:'center',gap:4,fontSize:'0.78rem',fontFamily:"'Jost',sans-serif"}}><Edit2 className="h-3.5 w-3.5"/>Edit</button>
                            <button onClick={()=>handleDeleteNews(n.id)} className="adm-delete-btn p-1.5 rounded-lg"><Trash2 className="h-4 w-4"/></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ─── Services ───────────────────────────────────────────────────── */}
        {activeTab==='services' && (
          <div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24,flexWrap:'wrap',gap:12}}>
              <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:400,color:'#3d2535',fontSize:'1.6rem'}}>Clinical Services</h2>
              <button onClick={openServiceAdd} className="adm-rose-btn flex items-center gap-2 px-5 py-3 rounded-xl font-medium" style={{fontFamily:"'Jost',sans-serif",fontSize:'0.85rem'}}><Plus className="h-5 w-5"/>Add Service</button>
            </div>
            {servicesLoading&&!services.length?<div style={{textAlign:'center',padding:40}}><Loader2 className="h-8 w-8 animate-spin mx-auto" style={{color:'#c9608c'}}/></div>:(
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {services.map((s,i)=>{
                  const SvcIcon=SVC_ICON_MAP[s.icon_name]||Stethoscope;
                  const gradients=['linear-gradient(135deg,rgba(220,155,185,0.15),rgba(185,155,220,0.1))','linear-gradient(135deg,rgba(155,185,220,0.15),rgba(155,220,185,0.1))','linear-gradient(135deg,rgba(220,185,155,0.15),rgba(220,155,155,0.1))','linear-gradient(135deg,rgba(155,220,185,0.15),rgba(185,220,155,0.1))'];
                  return(
                    <div key={s.id} className="adm-glass-card rounded-2xl p-5">
                      <div style={{display:'flex',alignItems:'flex-start',gap:14,marginBottom:12}}>
                        <div style={{width:48,height:48,borderRadius:12,background:gradients[i%4],flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}><SvcIcon className="h-6 w-6" style={{color:'#c9729a'}}/></div>
                        <div style={{flex:1}}>
                          <h4 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:500,color:'#3d2535',fontSize:'1.1rem',marginBottom:4}}>{s.title}</h4>
                          <p style={{color:'#7a6070',fontFamily:"'Jost',sans-serif",fontWeight:300,fontSize:'0.85rem',lineHeight:1.6}}>{s.description}</p>
                        </div>
                      </div>
                      <div style={{display:'flex',gap:8,justifyContent:'flex-end',borderTop:'1px solid rgba(220,180,170,0.2)',paddingTop:10}}>
                        <button onClick={()=>openServiceEdit(s)} style={{display:'flex',alignItems:'center',gap:4,padding:'5px 12px',borderRadius:8,background:'rgba(201,96,140,0.08)',color:'#c9608c',border:'1px solid rgba(201,96,140,0.2)',fontFamily:"'Jost',sans-serif",fontSize:'0.78rem',cursor:'pointer'}}><Edit2 className="h-3.5 w-3.5"/>Edit</button>
                        <button onClick={()=>handleDeleteService(s.id)} className="adm-delete-btn p-1.5 rounded-lg"><Trash2 className="h-4 w-4"/></button>
                      </div>
                    </div>
                  );
                })}
                {services.length===0&&!servicesLoading&&<div style={{gridColumn:'1/-1',textAlign:'center',padding:'48px 0'}}><Stethoscope className="h-12 w-12 mx-auto mb-4" style={{color:'#e0c8d0'}}/><p style={{color:'#9a7888',fontFamily:"'Jost',sans-serif",fontWeight:300}}>No services yet</p></div>}
              </div>
            )}
          </div>
        )}

        {/* ─── Contact & Links ────────────────────────────────────────────── */}
        {activeTab==='contact-links' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact Info */}
            <div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16,flexWrap:'wrap',gap:8}}>
                <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:400,color:'#3d2535',fontSize:'1.4rem'}}>Contact Info</h2>
                <button onClick={openContactAdd} className="adm-rose-btn flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium" style={{fontFamily:"'Jost',sans-serif",fontSize:'0.82rem'}}><Plus className="h-4 w-4"/>Add</button>
              </div>
              {contactsLoading&&!contacts.length?<div style={{textAlign:'center',padding:40}}><Loader2 className="h-7 w-7 animate-spin mx-auto" style={{color:'#c9608c'}}/></div>:(
                <div className="space-y-3">
                  {contacts.map(c=>{const CI=CONTACT_TYPE_ICON[c.type]||Globe;return(
                    <div key={c.id} className="adm-content-card p-4" style={{display:'flex',alignItems:'center',gap:12}}>
                      <div style={{width:40,height:40,borderRadius:10,background:'rgba(201,96,140,0.08)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><CI className="h-5 w-5" style={{color:'#c9608c'}}/></div>
                      <div style={{flex:1,minWidth:0}}>
                        {c.label&&<p style={{color:'#9a7888',fontFamily:"'Jost',sans-serif",fontWeight:400,fontSize:'0.75rem',textTransform:'uppercase',letterSpacing:'0.06em'}}>{c.label}</p>}
                        <p style={{color:'#3d2535',fontFamily:"'Jost',sans-serif",fontWeight:400,fontSize:'0.88rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.value}</p>
                      </div>
                      <div style={{display:'flex',gap:6,flexShrink:0}}>
                        <button onClick={()=>openContactEdit(c)} style={{padding:'4px 8px',borderRadius:7,background:'rgba(201,96,140,0.08)',color:'#c9608c',border:'1px solid rgba(201,96,140,0.2)',cursor:'pointer',display:'flex',alignItems:'center',gap:3,fontSize:'0.75rem',fontFamily:"'Jost',sans-serif"}}><Edit2 className="h-3 w-3"/>Edit</button>
                        <button onClick={()=>handleDeleteContact(c.id)} className="adm-delete-btn p-1 rounded-lg"><Trash2 className="h-3.5 w-3.5"/></button>
                      </div>
                    </div>
                  );})}
                  {contacts.length===0&&!contactsLoading&&<p style={{color:'#9a7888',fontFamily:"'Jost',sans-serif",fontWeight:300,textAlign:'center',padding:'24px 0'}}>No contact info yet</p>}
                </div>
              )}
            </div>
            {/* Social Links */}
            <div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16,flexWrap:'wrap',gap:8}}>
                <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:400,color:'#3d2535',fontSize:'1.4rem'}}>Social Links</h2>
                <button onClick={openSocialAdd} className="adm-rose-btn flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium" style={{fontFamily:"'Jost',sans-serif",fontSize:'0.82rem'}}><Plus className="h-4 w-4"/>Add</button>
              </div>
              {socialLoading&&!socialLinks.length?<div style={{textAlign:'center',padding:40}}><Loader2 className="h-7 w-7 animate-spin mx-auto" style={{color:'#c9608c'}}/></div>:(
                <div className="space-y-3">
                  {socialLinks.map(s=>{const SI=SOCIAL_ICON_MAP[s.platform]||Globe;return(
                    <div key={s.id} className="adm-content-card p-4" style={{display:'flex',alignItems:'center',gap:12}}>
                      <div style={{width:40,height:40,borderRadius:10,background:'rgba(100,140,200,0.08)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><SI className="h-5 w-5" style={{color:'#508cd2'}}/></div>
                      <div style={{flex:1,minWidth:0}}>
                        <p style={{color:'#9a7888',fontFamily:"'Jost',sans-serif",fontWeight:400,fontSize:'0.75rem',textTransform:'capitalize',letterSpacing:'0.04em'}}>{s.platform}</p>
                        <p style={{color:'#3d2535',fontFamily:"'Jost',sans-serif",fontWeight:400,fontSize:'0.85rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.url}</p>
                      </div>
                      <div style={{display:'flex',gap:6,flexShrink:0}}>
                        <button onClick={()=>openSocialEdit(s)} style={{padding:'4px 8px',borderRadius:7,background:'rgba(100,140,200,0.08)',color:'#508cd2',border:'1px solid rgba(100,140,200,0.2)',cursor:'pointer',display:'flex',alignItems:'center',gap:3,fontSize:'0.75rem',fontFamily:"'Jost',sans-serif"}}><Edit2 className="h-3 w-3"/>Edit</button>
                        <button onClick={()=>handleDeleteSocial(s.id)} className="adm-delete-btn p-1 rounded-lg"><Trash2 className="h-3.5 w-3.5"/></button>
                      </div>
                    </div>
                  );})}
                  {socialLinks.length===0&&!socialLoading&&<p style={{color:'#9a7888',fontFamily:"'Jost',sans-serif",fontWeight:300,textAlign:'center',padding:'24px 0'}}>No social links yet</p>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ─── Modal: Create Resource Content ──────────────────────────────── */}
      {showResForm && (
        <div className="adm-modal-bg fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="adm-modal rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="adm-modal-header sticky top-0 p-6 flex justify-between items-center rounded-t-2xl">
              <div>
                <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:400,color:'#3d2535',fontSize:'1.55rem'}}>Add to {activeCategoryMeta?.title}</h2>
                <p style={{color:'#9a7888',fontFamily:"'Jost',sans-serif",fontWeight:300,fontSize:'0.84rem',marginTop:3}}>{activeCategoryMeta?.emoji} {activeCategoryMeta?.desc}</p>
              </div>
              <button onClick={()=>setShowResForm(false)} style={{color:'#b09098',transition:'color 0.2s'}} onMouseEnter={e=>e.currentTarget.style.color='#4a2a3a'} onMouseLeave={e=>e.currentTarget.style.color='#b09098'}><X className="h-6 w-6"/></button>
            </div>

            <div className="p-6 space-y-5">
              {/* Content type selector */}
              <div>
                <label style={{color:'#7a6070',fontFamily:"'Jost',sans-serif",fontWeight:400,fontSize:'0.88rem',display:'block',marginBottom:10}}>Content Type</label>
                <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                  {CONTENT_TYPES.map(ct=>(
                    <button key={ct.id} onClick={()=>{setResFormType(ct.id);setResUploadedFile(null);}} className={`adm-type-btn ${resFormType===ct.id?'adm-type-btn-active':''}`}>
                      <ct.icon style={{width:14,height:14}}/>{ct.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Author fields */}
              {[{label:'Author Name *',name:'author',placeholder:'e.g., Dr. Jane Smith'},{label:'Author Avatar (Emoji)',name:'authorAvatar',placeholder:'e.g., 👩‍⚕️'},{label:'Title *',name:'title',placeholder:'Enter a clear, descriptive title'}].map(f=>(
                <div key={f.name}>
                  <label style={{color:'#7a6070',fontFamily:"'Jost',sans-serif",fontWeight:400,fontSize:'0.88rem',display:'block',marginBottom:8}}>{f.label}</label>
                  <input type="text" name={f.name} value={resFormData[f.name]} onChange={e=>setResFormData(p=>({...p,[e.target.name]:e.target.value}))} placeholder={f.placeholder} className="adm-input w-full px-4 py-3"/>
                </div>
              ))}

              {/* Description / notes */}
              <div>
                <label style={{color:'#7a6070',fontFamily:"'Jost',sans-serif",fontWeight:400,fontSize:'0.88rem',display:'block',marginBottom:8}}>
                  {resFormType==='notes'?'Notes Content':'Description'}
                  {resFormType==='notes'?' *':''}
                </label>
                <textarea name="content" value={resFormData.content} onChange={e=>setResFormData(p=>({...p,content:e.target.value}))} placeholder={resFormType==='notes'?'Write study notes here…':'Enter a description for this content…'} rows={5} className="adm-input w-full px-4 py-3" style={{resize:'none'}}/>
              </div>

              {/* File upload — for all types that have files */}
              {resFormType !== 'notes' && (
                <div>
                  <label style={{color:'#7a6070',fontFamily:"'Jost',sans-serif",fontWeight:400,fontSize:'0.88rem',display:'block',marginBottom:8}}>
                    Upload File {needsFile?'*':'(optional)'}
                    <span style={{color:'#c4a0b0',marginLeft:6,fontWeight:300}}>— {currentHint}</span>
                  </label>

                  {/* hidden file input */}
                  <input type="file" ref={resFileInputRef} accept={currentAccept} style={{display:'none'}} onChange={handleResFileSelect}/>

                  {/* clickable upload area */}
                  <div
                    className={`adm-upload-area ${resUploadedFile?'has-file':''}`}
                    onClick={()=>!resUploading&&resFileInputRef.current?.click()}
                  >
                    {resUploading ? (
                      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10}}>
                        <Loader2 style={{width:28,height:28,color:'#c9608c',animation:'spin 1s linear infinite'}}/>
                        <p style={{color:'#9a7888',fontFamily:"'Jost',sans-serif",fontWeight:300,fontSize:'0.9rem'}}>Uploading…</p>
                      </div>
                    ) : resUploadedFile ? (
                      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10}}>
                        <CheckCircle style={{width:28,height:28,color:'#5a9a70'}}/>
                        <p style={{color:'#5a9a70',fontFamily:"'Jost',sans-serif",fontWeight:500,fontSize:'0.92rem'}}>{resUploadedFile.name}</p>
                        <p style={{color:'#9a7888',fontFamily:"'Jost',sans-serif",fontWeight:300,fontSize:'0.8rem'}}>Click to replace file</p>
                      </div>
                    ) : (
                      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10}}>
                        <Upload style={{width:28,height:28,color:'#c4a0b0'}}/>
                        <p style={{color:'#9a7888',fontFamily:"'Jost',sans-serif",fontWeight:400,fontSize:'0.92rem'}}>Click to select a file from your computer</p>
                        <p style={{color:'#c4a0b0',fontFamily:"'Jost',sans-serif",fontWeight:300,fontSize:'0.8rem'}}>{currentHint}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notes: optional PDF/image upload */}
              {resFormType === 'notes' && (
                <div>
                  <label style={{color:'#7a6070',fontFamily:"'Jost',sans-serif",fontWeight:400,fontSize:'0.88rem',display:'block',marginBottom:8}}>
                    Attach File <span style={{color:'#c4a0b0',fontWeight:300}}>(optional — PDF or image of notes)</span>
                  </label>
                  <input type="file" ref={resFileInputRef} accept=".pdf,.jpg,.jpeg,.png" style={{display:'none'}} onChange={handleResFileSelect}/>
                  <div className={`adm-upload-area ${resUploadedFile?'has-file':''}`} onClick={()=>!resUploading&&resFileInputRef.current?.click()}>
                    {resUploading ? (
                      <div style={{display:'flex',alignItems:'center',gap:10,justifyContent:'center'}}>
                        <Loader2 style={{width:22,height:22,color:'#c9608c',animation:'spin 1s linear infinite'}}/>
                        <span style={{color:'#9a7888',fontFamily:"'Jost',sans-serif",fontWeight:300,fontSize:'0.88rem'}}>Uploading…</span>
                      </div>
                    ) : resUploadedFile ? (
                      <div style={{display:'flex',alignItems:'center',gap:10,justifyContent:'center'}}>
                        <CheckCircle style={{width:22,height:22,color:'#5a9a70'}}/>
                        <span style={{color:'#5a9a70',fontFamily:"'Jost',sans-serif",fontWeight:500,fontSize:'0.88rem'}}>{resUploadedFile.name}</span>
                      </div>
                    ) : (
                      <div style={{display:'flex',alignItems:'center',gap:10,justifyContent:'center'}}>
                        <Upload style={{width:22,height:22,color:'#c4a0b0'}}/>
                        <span style={{color:'#9a7888',fontFamily:"'Jost',sans-serif",fontWeight:300,fontSize:'0.88rem'}}>Click to attach a PDF or image</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Optional link — all content types */}
              <div>
                <label style={{color:'#7a6070',fontFamily:"'Jost',sans-serif",fontWeight:400,fontSize:'0.88rem',display:'block',marginBottom:8}}>
                  External Link
                  <span style={{color:'#c4a0b0',marginLeft:6,fontWeight:300}}>(optional{resUploadedFile ? ' — file above takes priority' : resFormType==='video'?' — or upload a file above':' — or upload a file above'})</span>
                </label>
                <input
                  type="url"
                  name="link"
                  value={resFormData.link}
                  onChange={e=>setResFormData(p=>({...p,link:e.target.value}))}
                  placeholder="https://example.com/resource"
                  className="adm-input w-full px-4 py-3"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button onClick={handleCreateResourceContent} disabled={resLoading} className="adm-rose-btn flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium disabled:opacity-50" style={{fontFamily:"'Jost',sans-serif"}}>
                  {resLoading?<><Loader2 className="h-5 w-5 animate-spin"/><span>Publishing…</span></>:<><Save className="h-5 w-5"/><span>Publish to {activeCategoryMeta?.title}</span></>}
                </button>
                <button onClick={()=>setShowResForm(false)} className="adm-cancel-btn px-6 py-3 font-medium" style={{fontFamily:"'Jost',sans-serif"}}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ─── Modal: Faculty ─────────────────────────────────────────────── */}
      {showFacultyForm&&(
        <div className="adm-modal-bg fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="adm-modal rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="adm-modal-header sticky top-0 p-6 flex justify-between items-center rounded-t-2xl">
              <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:400,color:'#3d2535',fontSize:'1.5rem'}}>{editingFaculty?'Edit':'Add'} Faculty Member</h2>
              <button onClick={()=>setShowFacultyForm(false)} style={{color:'#b09098'}}><X className="h-6 w-6"/></button>
            </div>
            <div className="p-6 space-y-4">
              {[{label:'Full Name *',key:'name',ph:'e.g., Prof. Dr. Jane Smith'},{label:'Role / Title *',key:'role_title',ph:'e.g., Associate Professor'},{label:'Credentials',key:'credentials',ph:'e.g., MBBS, FCPS'},{label:'Experience Note',key:'experience_note',ph:'e.g., 15+ years experience'}].map(f=>(
                <div key={f.key}>
                  <label style={{color:'#7a6070',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif",display:'block',marginBottom:6}}>{f.label}</label>
                  <input value={facultyForm[f.key]} onChange={e=>setFacultyForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph} className="adm-input w-full px-4 py-3"/>
                </div>
              ))}
              <div>
                <label style={{color:'#7a6070',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif",display:'block',marginBottom:6}}>Profile Photo</label>
                <input type="file" ref={facultyImgRef} accept=".jpg,.jpeg,.png,.webp" style={{display:'none'}} onChange={handleFacultyImgSelect}/>
                <div className={`adm-upload-area ${facultyImg?'has-file':''}`} onClick={()=>!facultyImgLoading&&facultyImgRef.current?.click()}>
                  {facultyImgLoading?<div style={{display:'flex',alignItems:'center',gap:8,justifyContent:'center'}}><Loader2 style={{width:22,height:22,color:'#c9608c',animation:'spin 1s linear infinite'}}/><span style={{color:'#9a7888',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif"}}>Uploading…</span></div>
                  :facultyImg?<div style={{display:'flex',alignItems:'center',gap:10,justifyContent:'center'}}><CheckCircle style={{width:22,height:22,color:'#5a9a70'}}/><span style={{color:'#5a9a70',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif",fontWeight:500}}>{facultyImg.name}</span></div>
                  :<div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}><Camera style={{width:28,height:28,color:'#c4a0b0'}}/><span style={{color:'#9a7888',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif"}}>Click to upload photo</span></div>}
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <input type="checkbox" id="is_hod" checked={facultyForm.is_hod} onChange={e=>setFacultyForm(p=>({...p,is_hod:e.target.checked}))} style={{width:16,height:16,accentColor:'#c9608c'}}/>
                <label htmlFor="is_hod" style={{color:'#7a6070',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif",cursor:'pointer'}}>Head of Department (HOD)</label>
              </div>
              <div style={{display:'flex',gap:12,paddingTop:8}}>
                <button onClick={handleSaveFaculty} disabled={facultyLoading} className="adm-rose-btn flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium disabled:opacity-50" style={{fontFamily:"'Jost',sans-serif"}}>{facultyLoading?<><Loader2 className="h-5 w-5 animate-spin"/><span>Saving…</span></>:<><Save className="h-5 w-5"/><span>Save</span></>}</button>
                <button onClick={()=>setShowFacultyForm(false)} className="adm-cancel-btn px-6 py-3 font-medium" style={{fontFamily:"'Jost',sans-serif"}}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal: Program Content ──────────────────────────────────────── */}
      {showProgForm&&(
        <div className="adm-modal-bg fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="adm-modal rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="adm-modal-header sticky top-0 p-6 flex justify-between items-center rounded-t-2xl">
              <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:400,color:'#3d2535',fontSize:'1.5rem'}}>Add to {activeProgCatMeta?.label}</h2>
              <button onClick={()=>setShowProgForm(false)} style={{color:'#b09098'}}><X className="h-6 w-6"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label style={{color:'#7a6070',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif",display:'block',marginBottom:8}}>Type</label>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  {PROG_TYPES.map(t=><button key={t} onClick={()=>setProgFormType(t)} className={`adm-type-btn ${progFormType===t?'adm-type-btn-active':''}`} style={{textTransform:'capitalize'}}>{t}</button>)}
                </div>
              </div>
              <div>
                <label style={{color:'#7a6070',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif",display:'block',marginBottom:6}}>Title *</label>
                <input value={progForm.title} onChange={e=>setProgForm(p=>({...p,title:e.target.value}))} placeholder="Enter title" className="adm-input w-full px-4 py-3"/>
              </div>
              <div>
                <label style={{color:'#7a6070',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif",display:'block',marginBottom:6}}>Description</label>
                <textarea value={progForm.content} onChange={e=>setProgForm(p=>({...p,content:e.target.value}))} rows={4} className="adm-input w-full px-4 py-3" style={{resize:'none'}} placeholder="Optional description…"/>
              </div>
              <div>
                <label style={{color:'#7a6070',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif",display:'block',marginBottom:6}}>Upload File (optional)</label>
                <input type="file" ref={progFileRef} accept=".pdf,.doc,.docx,.mp4,.jpg,.png" style={{display:'none'}} onChange={handleProgFileSelect}/>
                <div className={`adm-upload-area ${progFile?'has-file':''}`} onClick={()=>!progFileLoading&&progFileRef.current?.click()}>
                  {progFileLoading?<div style={{display:'flex',alignItems:'center',gap:8,justifyContent:'center'}}><Loader2 style={{width:22,height:22,color:'#c9608c',animation:'spin 1s linear infinite'}}/><span style={{color:'#9a7888',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif"}}>Uploading…</span></div>
                  :progFile?<div style={{display:'flex',alignItems:'center',gap:8,justifyContent:'center'}}><CheckCircle style={{width:22,height:22,color:'#5a9a70'}}/><span style={{color:'#5a9a70',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif"}}>{progFile.name}</span></div>
                  :<div style={{display:'flex',alignItems:'center',gap:8,justifyContent:'center'}}><Upload style={{width:22,height:22,color:'#c4a0b0'}}/><span style={{color:'#9a7888',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif"}}>Click to upload</span></div>}
                </div>
              </div>
              <div>
                <label style={{color:'#7a6070',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif",display:'block',marginBottom:6}}>External Link <span style={{color:'#c4a0b0',fontWeight:300}}>(optional)</span></label>
                <input type="url" value={progForm.link} onChange={e=>setProgForm(p=>({...p,link:e.target.value}))} placeholder="https://…" className="adm-input w-full px-4 py-3"/>
              </div>
              <div style={{display:'flex',gap:12,paddingTop:8}}>
                <button onClick={handleSaveProgram} disabled={progLoading} className="adm-rose-btn flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium disabled:opacity-50" style={{fontFamily:"'Jost',sans-serif"}}>{progLoading?<><Loader2 className="h-5 w-5 animate-spin"/><span>Saving…</span></>:<><Save className="h-5 w-5"/><span>Publish</span></>}</button>
                <button onClick={()=>setShowProgForm(false)} className="adm-cancel-btn px-6 py-3 font-medium" style={{fontFamily:"'Jost',sans-serif"}}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal: Research ────────────────────────────────────────────── */}
      {showResearchForm&&(
        <div className="adm-modal-bg fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="adm-modal rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="adm-modal-header sticky top-0 p-6 flex justify-between items-center rounded-t-2xl">
              <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:400,color:'#3d2535',fontSize:'1.5rem'}}>Add Publication</h2>
              <button onClick={()=>setShowResearchForm(false)} style={{color:'#b09098'}}><X className="h-6 w-6"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label style={{color:'#7a6070',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif",display:'block',marginBottom:6}}>Type</label>
                <select value={researchForm.type} onChange={e=>setResearchForm(p=>({...p,type:e.target.value}))} className="adm-input w-full px-4 py-3">
                  {['research','publication','thesis','conference'].map(t=><option key={t} value={t} style={{textTransform:'capitalize'}}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                </select>
              </div>
              {[{label:'Title *',key:'title',ph:'Publication title'},{label:'Authors *',key:'authors',ph:'e.g., Smith J, Ahmed S, et al.'},{label:'Journal / Conference',key:'journal_name',ph:'e.g., BJOG: An International Journal'},{label:'Year',key:'year',ph:'e.g., 2025'},{label:'DOI / Link',key:'link',ph:'https://doi.org/…'}].map(f=>(
                <div key={f.key}>
                  <label style={{color:'#7a6070',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif",display:'block',marginBottom:6}}>{f.label}</label>
                  <input value={researchForm[f.key]} onChange={e=>setResearchForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph} className="adm-input w-full px-4 py-3"/>
                </div>
              ))}
              <div>
                <label style={{color:'#7a6070',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif",display:'block',marginBottom:6}}>Abstract</label>
                <textarea value={researchForm.abstract} onChange={e=>setResearchForm(p=>({...p,abstract:e.target.value}))} rows={4} className="adm-input w-full px-4 py-3" style={{resize:'none'}} placeholder="Abstract text…"/>
              </div>
              <div>
                <label style={{color:'#7a6070',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif",display:'block',marginBottom:6}}>Upload PDF <span style={{color:'#c4a0b0',fontWeight:300}}>(optional)</span></label>
                <input type="file" ref={researchFileRef} accept=".pdf" style={{display:'none'}} onChange={handleResearchFileSelect}/>
                <div className={`adm-upload-area ${researchFile?'has-file':''}`} onClick={()=>!researchFileLoading&&researchFileRef.current?.click()}>
                  {researchFileLoading?<div style={{display:'flex',alignItems:'center',gap:8,justifyContent:'center'}}><Loader2 style={{width:22,height:22,color:'#c9608c',animation:'spin 1s linear infinite'}}/><span style={{color:'#9a7888',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif"}}>Uploading…</span></div>
                  :researchFile?<div style={{display:'flex',alignItems:'center',gap:8,justifyContent:'center'}}><CheckCircle style={{width:22,height:22,color:'#5a9a70'}}/><span style={{color:'#5a9a70',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif"}}>{researchFile.name}</span></div>
                  :<div style={{display:'flex',alignItems:'center',gap:8,justifyContent:'center'}}><Upload style={{width:22,height:22,color:'#c4a0b0'}}/><span style={{color:'#9a7888',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif"}}>Upload PDF file</span></div>}
                </div>
              </div>
              <div style={{display:'flex',gap:12,paddingTop:8}}>
                <button onClick={handleSaveResearch} disabled={researchLoading} className="adm-rose-btn flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium disabled:opacity-50" style={{fontFamily:"'Jost',sans-serif"}}>{researchLoading?<><Loader2 className="h-5 w-5 animate-spin"/><span>Saving…</span></>:<><Save className="h-5 w-5"/><span>Publish</span></>}</button>
                <button onClick={()=>setShowResearchForm(false)} className="adm-cancel-btn px-6 py-3 font-medium" style={{fontFamily:"'Jost',sans-serif"}}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal: Add Achievement ──────────────────────────────────────── */}
      {showAchForm&&(
        <div className="adm-modal-bg fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="adm-modal rounded-2xl max-w-sm w-full">
            <div className="adm-modal-header p-6 flex justify-between items-center rounded-t-2xl">
              <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:400,color:'#3d2535',fontSize:'1.5rem'}}>Add Achievement</h2>
              <button onClick={()=>setShowAchForm(false)} style={{color:'#b09098'}}><X className="h-6 w-6"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label style={{color:'#7a6070',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif",display:'block',marginBottom:6}}>Icon</label>
                <select value={achAddForm.icon_name} onChange={e=>setAchAddForm(p=>({...p,icon_name:e.target.value}))} className="adm-input w-full px-4 py-3">
                  {Object.keys(ACH_ICON_MAP).map(k=><option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label style={{color:'#7a6070',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif",display:'block',marginBottom:6}}>Number / Value *</label>
                <input value={achAddForm.number_text} onChange={e=>setAchAddForm(p=>({...p,number_text:e.target.value}))} placeholder="e.g. 500+" className="adm-input w-full px-4 py-3"/>
              </div>
              <div>
                <label style={{color:'#7a6070',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif",display:'block',marginBottom:6}}>Label *</label>
                <input value={achAddForm.label} onChange={e=>setAchAddForm(p=>({...p,label:e.target.value}))} placeholder="e.g. Deliveries/Year" className="adm-input w-full px-4 py-3"/>
              </div>
              <div style={{display:'flex',gap:12,paddingTop:8}}>
                <button onClick={handleAddAch} disabled={achLoading} className="adm-rose-btn flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium disabled:opacity-50" style={{fontFamily:"'Jost',sans-serif"}}>{achLoading?<Loader2 className="h-5 w-5 animate-spin"/>:<><Save className="h-5 w-5"/><span>Add</span></>}</button>
                <button onClick={()=>setShowAchForm(false)} className="adm-cancel-btn px-6 py-3 font-medium" style={{fontFamily:"'Jost',sans-serif"}}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal: Event ───────────────────────────────────────────────── */}
      {showEventForm&&(
        <div className="adm-modal-bg fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="adm-modal rounded-2xl max-w-sm w-full">
            <div className="adm-modal-header p-6 flex justify-between items-center rounded-t-2xl">
              <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:400,color:'#3d2535',fontSize:'1.5rem'}}>{editingEvent?'Edit':'Add'} Event</h2>
              <button onClick={()=>setShowEventForm(false)} style={{color:'#b09098'}}><X className="h-6 w-6"/></button>
            </div>
            <div className="p-6 space-y-4">
              {[{label:'Title *',key:'title',ph:'e.g., Grand Rounds'},{label:'Date *',key:'date_text',ph:'e.g., January 15, 2026'}].map(f=>(
                <div key={f.key}>
                  <label style={{color:'#7a6070',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif",display:'block',marginBottom:6}}>{f.label}</label>
                  <input value={eventForm[f.key]} onChange={e=>setEventForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph} className="adm-input w-full px-4 py-3"/>
                </div>
              ))}
              <div>
                <label style={{color:'#7a6070',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif",display:'block',marginBottom:6}}>Description</label>
                <textarea value={eventForm.description} onChange={e=>setEventForm(p=>({...p,description:e.target.value}))} rows={3} className="adm-input w-full px-4 py-3" style={{resize:'none'}}/>
              </div>
              <div style={{display:'flex',gap:12,paddingTop:8}}>
                <button onClick={handleSaveEvent} disabled={eventsLoading} className="adm-rose-btn flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium disabled:opacity-50" style={{fontFamily:"'Jost',sans-serif"}}>{eventsLoading?<Loader2 className="h-5 w-5 animate-spin"/>:<><Save className="h-5 w-5"/><span>Save</span></>}</button>
                <button onClick={()=>setShowEventForm(false)} className="adm-cancel-btn px-6 py-3 font-medium" style={{fontFamily:"'Jost',sans-serif"}}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal: News ────────────────────────────────────────────────── */}
      {showNewsForm&&(
        <div className="adm-modal-bg fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="adm-modal rounded-2xl max-w-sm w-full">
            <div className="adm-modal-header p-6 flex justify-between items-center rounded-t-2xl">
              <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:400,color:'#3d2535',fontSize:'1.5rem'}}>{editingNews?'Edit':'Add'} News</h2>
              <button onClick={()=>setShowNewsForm(false)} style={{color:'#b09098'}}><X className="h-6 w-6"/></button>
            </div>
            <div className="p-6 space-y-4">
              {[{label:'Title *',key:'title',ph:'e.g., New Faculty Appointment'},{label:'Date *',key:'date_text',ph:'e.g., January 5, 2026'}].map(f=>(
                <div key={f.key}>
                  <label style={{color:'#7a6070',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif",display:'block',marginBottom:6}}>{f.label}</label>
                  <input value={newsForm[f.key]} onChange={e=>setNewsForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph} className="adm-input w-full px-4 py-3"/>
                </div>
              ))}
              <div>
                <label style={{color:'#7a6070',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif",display:'block',marginBottom:6}}>Description</label>
                <textarea value={newsForm.description} onChange={e=>setNewsForm(p=>({...p,description:e.target.value}))} rows={3} className="adm-input w-full px-4 py-3" style={{resize:'none'}}/>
              </div>
              <div style={{display:'flex',gap:12,paddingTop:8}}>
                <button onClick={handleSaveNews} disabled={newsLoading} className="adm-rose-btn flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium disabled:opacity-50" style={{fontFamily:"'Jost',sans-serif"}}>{newsLoading?<Loader2 className="h-5 w-5 animate-spin"/>:<><Save className="h-5 w-5"/><span>Save</span></>}</button>
                <button onClick={()=>setShowNewsForm(false)} className="adm-cancel-btn px-6 py-3 font-medium" style={{fontFamily:"'Jost',sans-serif"}}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal: Service ─────────────────────────────────────────────── */}
      {showServiceForm&&(
        <div className="adm-modal-bg fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="adm-modal rounded-2xl max-w-sm w-full">
            <div className="adm-modal-header p-6 flex justify-between items-center rounded-t-2xl">
              <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:400,color:'#3d2535',fontSize:'1.5rem'}}>{editingService?'Edit':'Add'} Service</h2>
              <button onClick={()=>setShowServiceForm(false)} style={{color:'#b09098'}}><X className="h-6 w-6"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label style={{color:'#7a6070',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif",display:'block',marginBottom:6}}>Icon</label>
                <select value={serviceForm.icon_name} onChange={e=>setServiceForm(p=>({...p,icon_name:e.target.value}))} className="adm-input w-full px-4 py-3">
                  {Object.keys(SVC_ICON_MAP).map(k=><option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label style={{color:'#7a6070',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif",display:'block',marginBottom:6}}>Title *</label>
                <input value={serviceForm.title} onChange={e=>setServiceForm(p=>({...p,title:e.target.value}))} placeholder="e.g., Antenatal Care" className="adm-input w-full px-4 py-3"/>
              </div>
              <div>
                <label style={{color:'#7a6070',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif",display:'block',marginBottom:6}}>Description</label>
                <textarea value={serviceForm.description} onChange={e=>setServiceForm(p=>({...p,description:e.target.value}))} rows={3} className="adm-input w-full px-4 py-3" style={{resize:'none'}} placeholder="Brief description…"/>
              </div>
              <div style={{display:'flex',gap:12,paddingTop:8}}>
                <button onClick={handleSaveService} disabled={servicesLoading} className="adm-rose-btn flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium disabled:opacity-50" style={{fontFamily:"'Jost',sans-serif"}}>{servicesLoading?<Loader2 className="h-5 w-5 animate-spin"/>:<><Save className="h-5 w-5"/><span>Save</span></>}</button>
                <button onClick={()=>setShowServiceForm(false)} className="adm-cancel-btn px-6 py-3 font-medium" style={{fontFamily:"'Jost',sans-serif"}}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal: Contact ─────────────────────────────────────────────── */}
      {showContactForm&&(
        <div className="adm-modal-bg fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="adm-modal rounded-2xl max-w-sm w-full">
            <div className="adm-modal-header p-6 flex justify-between items-center rounded-t-2xl">
              <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:400,color:'#3d2535',fontSize:'1.5rem'}}>{editingContact?'Edit':'Add'} Contact</h2>
              <button onClick={()=>setShowContactForm(false)} style={{color:'#b09098'}}><X className="h-6 w-6"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label style={{color:'#7a6070',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif",display:'block',marginBottom:6}}>Type</label>
                <select value={contactForm.type} onChange={e=>setContactForm(p=>({...p,type:e.target.value}))} className="adm-input w-full px-4 py-3">
                  {['phone','email','address','other'].map(t=><option key={t} value={t} style={{textTransform:'capitalize'}}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label style={{color:'#7a6070',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif",display:'block',marginBottom:6}}>Label</label>
                <input value={contactForm.label} onChange={e=>setContactForm(p=>({...p,label:e.target.value}))} placeholder="e.g., Main Office" className="adm-input w-full px-4 py-3"/>
              </div>
              <div>
                <label style={{color:'#7a6070',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif",display:'block',marginBottom:6}}>Value *</label>
                <input value={contactForm.value} onChange={e=>setContactForm(p=>({...p,value:e.target.value}))} placeholder="Phone / Email / Address" className="adm-input w-full px-4 py-3"/>
              </div>
              <div style={{display:'flex',gap:12,paddingTop:8}}>
                <button onClick={handleSaveContact} disabled={contactsLoading} className="adm-rose-btn flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium disabled:opacity-50" style={{fontFamily:"'Jost',sans-serif"}}>{contactsLoading?<Loader2 className="h-5 w-5 animate-spin"/>:<><Save className="h-5 w-5"/><span>Save</span></>}</button>
                <button onClick={()=>setShowContactForm(false)} className="adm-cancel-btn px-6 py-3 font-medium" style={{fontFamily:"'Jost',sans-serif"}}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal: Social Link ──────────────────────────────────────────── */}
      {showSocialForm&&(
        <div className="adm-modal-bg fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="adm-modal rounded-2xl max-w-sm w-full">
            <div className="adm-modal-header p-6 flex justify-between items-center rounded-t-2xl">
              <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:400,color:'#3d2535',fontSize:'1.5rem'}}>{editingSocial?'Edit':'Add'} Social Link</h2>
              <button onClick={()=>setShowSocialForm(false)} style={{color:'#b09098'}}><X className="h-6 w-6"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label style={{color:'#7a6070',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif",display:'block',marginBottom:6}}>Platform</label>
                <select value={socialForm.platform} onChange={e=>setSocialForm(p=>({...p,platform:e.target.value}))} className="adm-input w-full px-4 py-3">
                  {['facebook','twitter','instagram','linkedin','youtube','whatsapp'].map(p=><option key={p} value={p} style={{textTransform:'capitalize'}}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label style={{color:'#7a6070',fontSize:'0.88rem',fontFamily:"'Jost',sans-serif",display:'block',marginBottom:6}}>URL *</label>
                <input value={socialForm.url} onChange={e=>setSocialForm(p=>({...p,url:e.target.value}))} placeholder="https://facebook.com/…" className="adm-input w-full px-4 py-3"/>
              </div>
              <div style={{display:'flex',gap:12,paddingTop:8}}>
                <button onClick={handleSaveSocial} disabled={socialLoading} className="adm-rose-btn flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium disabled:opacity-50" style={{fontFamily:"'Jost',sans-serif"}}>{socialLoading?<Loader2 className="h-5 w-5 animate-spin"/>:<><Save className="h-5 w-5"/><span>Save</span></>}</button>
                <button onClick={()=>setShowSocialForm(false)} className="adm-cancel-btn px-6 py-3 font-medium" style={{fontFamily:"'Jost',sans-serif"}}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
