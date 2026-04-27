"use client";
import React, { useState, useEffect } from 'react';
import { Phone, Clock, Award, Users, Heart, Shield, Star, Facebook, Twitter, Instagram, Linkedin, BookOpen, MessageSquare, FlaskConical, Trophy, Target, Eye, Calendar, Newspaper } from 'lucide-react';
import Image from "next/image"

export default function HospitalHomePage({ onNavigate, isLoggedIn, onLogout }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ background: 'linear-gradient(160deg, #fdf6f0 0%, #fef0f5 40%, #f5f0fe 100%)', fontFamily: "'Georgia', 'Times New Roman', serif" }} className="text-stone-700 min-h-screen">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');

        .obgyn-root { font-family: 'Jost', sans-serif; }
        .obgyn-display { font-family: 'Cormorant Garamond', Georgia, serif; }

        .glass-nav {
          background: rgba(255,248,245,0.85);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(220,160,150,0.2);
          box-shadow: 0 2px 24px rgba(200,130,120,0.08);
        }

        .glass-card {
          background: rgba(255,252,250,0.75);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(220,180,170,0.3);
          box-shadow: 0 4px 32px rgba(190,130,150,0.10), 0 1px 0 rgba(255,255,255,0.8) inset;
        }

        .glass-card-hover:hover {
          background: rgba(255,245,248,0.92);
          border-color: rgba(210,140,160,0.5);
          box-shadow: 0 12px 48px rgba(190,110,140,0.18), 0 1px 0 rgba(255,255,255,0.9) inset;
        }

        .rose-btn {
          background: linear-gradient(135deg, #e8a0b0 0%, #d4779a 50%, #c9608c 100%);
          color: white;
          box-shadow: 0 4px 20px rgba(200,100,140,0.35);
        }
        .rose-btn:hover {
          background: linear-gradient(135deg, #dc8ca0 0%, #c96888 50%, #bc4f7c 100%);
          box-shadow: 0 6px 28px rgba(200,100,140,0.5);
        }

        .accent-dot {
          background: linear-gradient(135deg, #e8a0b0, #c9608c);
          box-shadow: 0 0 10px rgba(200,100,140,0.4);
        }
        .accent-dot-hover:hover {
          box-shadow: 0 0 16px rgba(200,100,140,0.65);
        }

        .section-alt {
          background: linear-gradient(160deg, #fef7f0 0%, #fdf0f7 100%);
        }
        .section-main {
          background: linear-gradient(160deg, #fdf5fa 0%, #f5f0fe 100%);
        }

        .hero-glow {
          background: radial-gradient(ellipse at 70% 50%, rgba(230,160,185,0.22) 0%, transparent 65%),
                      radial-gradient(ellipse at 20% 80%, rgba(200,180,230,0.15) 0%, transparent 60%),
                      linear-gradient(160deg, #fdf6f0 0%, #fef0f5 50%, #f5f0fe 100%);
        }

        .petal-border {
          border: 1px solid rgba(220,175,185,0.35);
        }

        .quote-accent {
          color: rgba(210,130,160,0.18);
          font-family: 'Cormorant Garamond', Georgia, serif;
        }

        .nav-link {
          color: #8a6070;
          font-family: 'Jost', sans-serif;
          font-weight: 400;
          letter-spacing: 0.03em;
          font-size: 0.76rem;
          text-transform: uppercase;
        }
        .nav-link:hover {
          color: #c9608c;
          background: rgba(220,140,165,0.08);
        }

        .icon-rose { color: #c9728c; }

        .tag-rose {
          color: #c9608c;
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 500;
        }

        .subtext { color: #9a7a88; }
        .body-text { color: #7a6070; font-family: 'Jost', sans-serif; font-weight: 300; line-height: 1.75; }
        .heading-dark { color: #3d2535; }
        .heading-med { color: #5a3548; }

        .achievement-num { 
          font-family: 'Cormorant Garamond', Georgia, serif; 
          color: #c9608c; 
          font-weight: 300;
        }

        .footer-dark {
          background: linear-gradient(160deg, #2e1a24 0%, #3a1f2e 100%);
          border-top: 1px solid rgba(180,120,140,0.2);
        }

        .divider-rose {
          border-color: rgba(200,150,165,0.2);
        }

        .scroll-dot {
          border-color: rgba(200,110,140,0.6);
        }
        .scroll-inner {
          background: linear-gradient(to bottom, #d4779a, #c9608c);
        }

        .research-gradient {
          background: linear-gradient(135deg, #e8b0c0 0%, #c9789c 40%, #b060a0 100%);
        }

        .vision-mission-card {
          background: rgba(255,250,252,0.8);
          border: 1px solid rgba(215,170,185,0.3);
          box-shadow: 0 4px 24px rgba(190,120,150,0.08);
        }
        .vision-mission-card:hover {
          border-color: rgba(205,120,150,0.45);
        }

        .event-inner {
          background: rgba(255,248,252,0.7);
        }
        .event-inner:hover {
          background: rgba(255,238,246,0.85);
        }

        .animate-bounce-slow {
          animation: bounce 2s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-8px); }
        }

        .gradient-text {
          background: linear-gradient(135deg, #c9608c, #9060b0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .noise-overlay::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          border-radius: inherit;
        }
      `}</style>

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'opacity-0 pointer-events-none -translate-y-full' : 'opacity-100 glass-nav'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center cursor-pointer" onClick={() => scrollToSection("home")}>
              <Image
                src="/logo.png"
                alt="OBGYNE HITEC-IMS Logo"
                width={40}
                height={40}
                priority
                className="rounded-full hover:scale-105 transition-transform"
              />
              <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, letterSpacing: '0.03em', color: '#4a2a3a' }} className="ml-3 text-2xl">
                OBGYNE HITEC-IMS
              </span>
            </div>
            <button
              onClick={() => onNavigate('login')}
              className="rose-btn px-6 py-2 rounded-full font-medium text-sm transition-all"
              style={{ fontFamily: "'Jost', sans-serif", letterSpacing: '0.06em', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Navigation Menu Box */}
      <div className={`${scrolled ? 'fixed top-0' : 'fixed top-20'} left-0 right-0 z-40 glass-nav transition-all duration-300`}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-between px-4 py-3">
            {['home', 'faculty', 'about', 'programs', 'resources', 'discussion', 'research', 'achievements', 'contact'].map(section => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="nav-link px-5 py-2 rounded-full transition-all"
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
          {/* Mobile Navigation */}
          <div className="lg:hidden flex flex-wrap justify-center gap-2 py-3">
            {['home', 'faculty', 'about', 'programs', 'resources', 'discussion', 'research', 'achievements', 'contact'].map(section => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="nav-link px-4 py-2 rounded-full transition-all"
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section id="home" className="hero-glow relative min-h-screen flex items-center justify-center pt-32 noise-overlay">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 75% 45%, rgba(235,170,195,0.18) 0%, transparent 55%), radial-gradient(ellipse at 15% 75%, rgba(180,155,220,0.12) 0%, transparent 50%)' }}></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="tag-rose mb-4">HITEC Institute of Medical Sciences</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, lineHeight: 1.15, color: '#3d2535' }} className="text-5xl md:text-7xl mb-6">
            Department of Obstetrics<br /><em style={{ fontStyle: 'italic', color: '#b06080' }}>& Gynecology</em>
          </h1>
          <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, color: '#9a7080' }} className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Excellence in Women's Healthcare
          </p>
          <p className="body-text text-base max-w-2xl mx-auto">
            Providing comprehensive obstetric and gynecological care with state-of-the-art facilities and experienced faculty
          </p>
        </div>
        <div className="absolute bottom-8 left-1/2 animate-bounce" style={{ transform: 'translateX(-50%)' }}>
          <div className="w-6 h-10 rounded-full flex justify-center scroll-dot" style={{ border: '1.5px solid rgba(200,110,140,0.5)' }}>
            <div className="w-1 h-3 rounded-full mt-2 scroll-inner"></div>
          </div>
        </div>
      </section>

      {/* HOD's Message Section */}
      <section id="faculty" className="py-20 section-alt relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(220,155,185,0.12), transparent 70%)' }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(185,155,220,0.10), transparent 70%)' }}></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <span className="tag-rose">Message from the HOD</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#3d2535' }} className="text-4xl md:text-5xl mt-2">Welcome to Our Department</h2>
          </div>

          <div className="relative group">
            <div className="absolute -inset-px rounded-2xl opacity-60 group-hover:opacity-100 transition-all duration-500" style={{ background: 'linear-gradient(135deg, rgba(220,160,185,0.3), rgba(185,155,220,0.3), rgba(220,160,185,0.3))' }}></div>
            <div className="relative glass-card glass-card-hover p-10 md:p-14 rounded-2xl transition-all duration-300">
              <div className="absolute top-0 left-10 -translate-y-1/2 quote-accent text-9xl leading-none select-none">"</div>
              <div className="space-y-6 body-text relative z-10">
                <p className="text-lg md:text-xl" style={{ color: '#6a5060' }}>
                  It is my privilege to welcome you to the Department of Obstetrics & Gynecology at HITEC Institute of Medical Sciences. Our department stands as a beacon of excellence in women's healthcare, combining clinical expertise with cutting-edge research and compassionate patient care.
                </p>
                <p className="text-base md:text-lg">
                  We are committed to nurturing the next generation of obstetricians and gynecologists through comprehensive training programs that emphasize both technical competence and ethical medical practice. Our state-of-the-art facilities and experienced faculty ensure that our residents and students receive world-class education.
                </p>
                <p className="text-base md:text-lg">
                  As a recognized training center for FCPS, we take pride in our holistic approach to medical education, where every patient encounter becomes a learning opportunity and every challenge strengthens our resolve to provide better healthcare.
                </p>
                <div className="pt-6 mt-8 divider-rose" style={{ borderTop: '1px solid rgba(200,150,165,0.2)' }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', color: '#c9608c', fontSize: '1.1rem' }} className="text-center">
                    "Excellence in women's healthcare through dedication, innovation, and compassion."
                  </p>
                </div>
                <div className="pt-6 text-right">
                  <p style={{ color: '#4a2a3a', fontFamily: "'Jost', sans-serif", fontWeight: 500 }} className="text-lg">Head of Department</p>
                  <p className="subtext text-sm" style={{ fontFamily: "'Jost', sans-serif" }}>Department of Obstetrics & Gynecology</p>
                </div>
              </div>
              <div className="absolute bottom-0 right-10 translate-y-1/2 rotate-180 quote-accent text-9xl leading-none select-none">"</div>
            </div>
          </div>
        </div>
      </section>
      {/* Faculty Section */}
      <section className="py-20 section-alt relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(220,155,185,0.12), transparent 70%)' }}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(185,155,220,0.10), transparent 70%)' }}></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <span className="tag-rose">Meet Our Team</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#3d2535' }} className="text-4xl md:text-5xl mt-2">
              Our Faculty
            </h2>
            <p className="body-text mt-3">Dedicated professionals committed to excellence in medical education and patient care</p>
          </div>

          {/* HOD Card - centered, larger */}
          <div className="flex justify-center mb-8">
            <div className="glass-card glass-card-hover p-10 rounded-2xl text-center group transition-all duration-300 hover:-translate-y-2 cursor-default" style={{ width: '320px', boxShadow: '0 8px 40px rgba(190,110,150,0.14)' }}>
              <div className="mx-auto mb-5 transition-transform duration-300 group-hover:scale-105" style={{ width: '110px', height: '110px', borderRadius: '50%', padding: '3px', background: 'linear-gradient(135deg, #e8a0b0, #c9608c, #b060a0)', boxShadow: '0 6px 22px rgba(200,100,140,0.35)' }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: '#fef0f5' }}>
                  <Image src="/faculty.jpeg" alt="Professor Dr Fehmida Shaheen" width={104} height={104} style={{ objectFit: 'cover', borderRadius: '50%' }} />
                </div>
              </div>
              <p className="tag-rose mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.1em' }}>Head of Department</p>
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, color: '#3d2535', fontSize: '1.3rem', lineHeight: 1.3 }} className="mb-2 group-hover:transition-colors"
                onMouseEnter={e => e.currentTarget.style.color = '#c9608c'}
                onMouseLeave={e => e.currentTarget.style.color = '#3d2535'}>
                Professor Dr Fehmida Shaheen
              </h3>
              <div style={{ width: '36px', height: '1.5px', background: 'linear-gradient(90deg, #e8a0b0, #c9608c)', borderRadius: '2px', margin: '0.5rem auto 0.7rem', transition: 'width 0.3s' }} className="group-hover:w-16"></div>
              <p className="body-text text-sm">MBBS, MCPS, FCPS</p>
              <p className="body-text text-xs mt-1" style={{ fontStyle: 'italic', color: '#b07888' }}>35+ years experience · Renowned Professor</p>
            </div>
          </div>

          {/* Faculty Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { name: 'Prof Dr Mahwash Jamil', role: 'Professor', creds: 'MBBS, MCPS, FCPS, MHPE', img: '/faculty.jpeg' },
              { name: 'Dr. Ayesha Akram', role: 'Associate Professor', creds: 'MBBS, FCPS', img: '/faculty.jpeg' },
              { name: 'Dr. Adeela Amin', role: 'Assistant Professor', creds: 'MBBS, FCPS', img: '/faculty.jpeg' },
              { name: 'Dr. Tanzeela Aftab', role: 'Assistant Professor', creds: 'MBBS, FCPS', img: '/faculty.jpeg' },
              { name: 'Dr. Tahira Jabeen', role: 'Assistant Professor', creds: 'MBBS, FCPS', img: '/faculty.jpeg' },
              { name: 'Major Dr. Sahar Ahsan', role: 'Assistant Professor', creds: 'MBBS, FCPS', img: '/faculty.jpeg' },
              { name: 'Dr. Nida Khan', role: 'Senior Registrar', creds: 'MBBS', img: '/faculty.jpeg' },
            ].map((member, idx) => (
              <div key={idx} className="glass-card glass-card-hover p-7 rounded-2xl text-center group transition-all duration-300 hover:-translate-y-2 cursor-default">
                <div className="mx-auto mb-4 transition-transform duration-300 group-hover:scale-105" style={{ width: '90px', height: '90px', borderRadius: '50%', padding: '3px', background: 'linear-gradient(135deg, #e8a0b0, #c9608c)', boxShadow: '0 4px 18px rgba(200,100,140,0.28)' }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: '#fef0f5' }}>
                    <Image src="/faculty.jpeg" alt={member.name} width={84} height={84} style={{ objectFit: 'cover', borderRadius: '50%' }} />
                  </div>
                </div>
                <p className="tag-rose mb-1" style={{ fontSize: '0.68rem' }}>{member.role}</p>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, color: '#3d2535', fontSize: '1.05rem', lineHeight: 1.3 }} className="mb-2 transition-colors"
                  onMouseEnter={e => e.currentTarget.style.color = '#c9608c'}
                  onMouseLeave={e => e.currentTarget.style.color = '#3d2535'}>
                  {member.name}
                </h3>
                <div style={{ width: '28px', height: '1.5px', background: 'linear-gradient(90deg, #e8a0b0, #c9608c)', borderRadius: '2px', margin: '0 auto 0.55rem', transition: 'width 0.3s' }} className="group-hover:w-12"></div>
                <p className="body-text" style={{ fontSize: '0.8rem' }}>{member.creds}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 section-main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative group cursor-pointer">
              <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-2xl" style={{ boxShadow: '0 20px 60px rgba(190,110,150,0.18)' }}>
                <img
                  src="/hero.jpg"
                  alt="OBGYNE Department"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 transition-colors" style={{ background: 'rgba(200,130,160,0.15)' }}></div>
                <div className="absolute inset-0 group-hover:opacity-60 transition-opacity" style={{ background: 'rgba(200,130,160,0.15)' }}></div>
              </div>
            </div>

            <div>
              <span className="tag-rose">Who We Are</span>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#3d2535' }} className="text-4xl md:text-5xl mb-8 mt-2">
                About Our Department
              </h2>
              <div className="space-y-6">
                {[
                  'Recognized training center for FCPS Obstetrics & Gynecology',
                  'Fully equipped labor and delivery rooms with modern facilities',
                  'Dedicated gynecology OPD and ward with experienced consultants',
                  'Advanced fetal monitoring and ultrasound services',
                  'Comprehensive antenatal and postnatal care programs',
                  '24/7 emergency obstetric and gynecological services'
                ].map((point, idx) => (
                  <div key={idx} className="flex items-start space-x-4 group cursor-pointer relative">
                    <div className="absolute -inset-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ background: 'rgba(210,140,165,0.07)' }}></div>
                    <div className="flex-shrink-0 w-6 h-6 accent-dot accent-dot-hover rounded-full flex items-center justify-center mt-1 group-hover:scale-125 group-hover:rotate-90 transition-all duration-300 relative z-10">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="body-text text-lg group-hover:translate-x-2 transition-all duration-300 relative z-10" style={{ color: idx % 2 === 0 ? '#6a5060' : '#7a6070' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#c9608c'}
                      onMouseLeave={e => e.currentTarget.style.color = idx % 2 === 0 ? '#6a5060' : '#7a6070'}>{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 section-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="tag-rose">What We Offer</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#3d2535' }} className="text-4xl md:text-5xl mt-2">
              Training Programs
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Award, title: 'Postgraduate Programs', desc: 'FCPS and MD residency training in Obstetrics & Gynecology with comprehensive clinical exposure' },
              { icon: Users, title: 'House Officer Training', desc: 'Structured one-year house job program in OBGYN with rotations through labor ward, gynecology ward, and OPD' },
              { icon: Heart, title: 'MBBS Clinical Rotation', desc: 'Clinical training for medical students in obstetrics and gynecology as part of undergraduate curriculum' }
            ].map((program, idx) => (
              <div
                key={idx}
                className="glass-card glass-card-hover p-8 rounded-2xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, rgba(220,160,185,0.2), rgba(185,155,220,0.2))' }}>
                  <program.icon className="h-7 w-7 icon-rose" />
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, color: '#3d2535', fontSize: '1.25rem' }} className="mb-3 group-hover:transition-colors"
                  onMouseEnter={e => e.currentTarget.style.color = '#c9608c'}
                  onMouseLeave={e => e.currentTarget.style.color = '#3d2535'}>{program.title}</h3>
                <p className="body-text">{program.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="py-20 section-main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="tag-rose">Learn & Grow</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#3d2535' }} className="text-4xl md:text-5xl mt-2">
              Educational Resources
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: BookOpen, title: 'Communication Skills', desc: 'Develop effective doctor-patient communication and counseling techniques for obstetric and gynecological care' },
              { icon: Users, title: 'Clinical Skills', desc: 'Master essential clinical examination skills specific to obstetrics and gynecology practice' },
              { icon: Clock, title: 'History Taking', desc: 'Learn comprehensive obstetric and gynecological history taking protocols and documentation' },
              { icon: Shield, title: 'OSCE Preparation', desc: 'Objective Structured Clinical Examination practice stations for OBGYN specialty' },
              { icon: Award, title: 'MCQ Bank', desc: 'Extensive multiple choice questions covering all aspects of obstetrics and gynecology' },
              { icon: BookOpen, title: 'Case Studies', desc: 'Real-world clinical case discussions and management protocols in OBGYN' }
            ].map((resource, idx) => (
              <div
                key={idx}
                className="glass-card glass-card-hover p-8 rounded-2xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300" style={{ background: idx % 3 === 0 ? 'linear-gradient(135deg, rgba(220,155,175,0.2), rgba(200,135,165,0.15))' : idx % 3 === 1 ? 'linear-gradient(135deg, rgba(185,155,220,0.2), rgba(165,135,200,0.15))' : 'linear-gradient(135deg, rgba(220,175,155,0.2), rgba(200,155,135,0.15))' }}>
                  <resource.icon className="h-7 w-7 icon-rose" />
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, color: '#3d2535', fontSize: '1.25rem' }} className="mb-3"
                  onMouseEnter={e => e.currentTarget.style.color = '#c9608c'}
                  onMouseLeave={e => e.currentTarget.style.color = '#3d2535'}>{resource.title}</h3>
                <p className="body-text">{resource.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discussion Forum Section */}
      <section id="discussion" className="py-20 section-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="tag-rose">Collaborate</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#3d2535' }} className="text-4xl md:text-5xl mt-2 mb-8">
            Discussion Forum
          </h2>
          <p className="body-text text-xl mb-12 max-w-3xl mx-auto" style={{ color: '#8a6875' }}>
            Connect with fellow residents, house officers, and medical students. Share cases, discuss management protocols, and learn from each other's experiences.
          </p>
          <div className="glass-card glass-card-hover p-12 rounded-2xl max-w-4xl mx-auto group transition-all" style={{ boxShadow: '0 8px 40px rgba(190,120,150,0.10)' }}>
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, rgba(220,155,185,0.25), rgba(185,155,220,0.25))' }}>
              <MessageSquare className="h-10 w-10 icon-rose" />
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, color: '#3d2535', fontSize: '1.6rem' }} className="mb-4">Academic Exchange Platform</h3>
            <p className="body-text">Engage in evidence-based discussions, share research findings, and collaborate on complex clinical cases in obstetrics and gynecology</p>
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section id="research" className="py-20 section-main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="tag-rose">Innovation</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#3d2535' }} className="text-4xl md:text-5xl mt-2">
              Research & Publications
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative group cursor-pointer">
              <div className="w-full h-96 rounded-2xl shadow-2xl transform group-hover:scale-105 transition-all duration-500 relative overflow-hidden research-gradient" style={{ boxShadow: '0 20px 60px rgba(190,100,150,0.25)' }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15), transparent)' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FlaskConical className="h-32 w-32 text-white opacity-25 group-hover:opacity-40 transition-opacity duration-500" />
                </div>
              </div>
            </div>
            <div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, color: '#3d2535', fontSize: '2rem' }} className="mb-6">Advancing Women's Healthcare</h3>
              <p className="body-text text-lg mb-6">
                Our department is committed to conducting meaningful research in obstetrics and gynecology. We encourage residents and students to participate in research activities and contribute to medical literature.
              </p>
              <div className="space-y-4">
                {[
                  'Active research projects in maternal-fetal medicine',
                  'Publications in national and international journals',
                  'Collaboration with leading teaching hospitals',
                  'Regular academic presentations and case conferences',
                  'Thesis supervision for postgraduate students'
                ].map((point, idx) => (
                  <div key={idx} className="flex items-start space-x-4 group cursor-pointer relative">
                    <div className="absolute -inset-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ background: 'rgba(210,140,165,0.07)' }}></div>
                    <div className="flex-shrink-0 w-6 h-6 accent-dot accent-dot-hover rounded-full flex items-center justify-center mt-1 group-hover:scale-125 group-hover:rotate-90 transition-all duration-300 relative z-10">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="body-text text-lg group-hover:translate-x-2 transition-all duration-300 relative z-10"
                      onMouseEnter={e => e.currentTarget.style.color = '#c9608c'}
                      onMouseLeave={e => e.currentTarget.style.color = '#7a6070'}>{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="py-20 section-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="tag-rose">Our Impact</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#3d2535' }} className="text-4xl md:text-5xl mt-2">
              Department Achievements
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Trophy, number: '500+', label: 'Successful Deliveries/Year' },
              { icon: Users, number: '50+', label: 'Trained Residents' },
              { icon: Award, number: '20+', label: 'Faculty Members' },
              { icon: Star, number: '100%', label: 'FCPS Pass Rate' }
            ].map((achievement, idx) => (
              <div
                key={idx}
                className="glass-card glass-card-hover p-8 rounded-2xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border text-center group cursor-pointer"
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, rgba(220,155,185,0.2), rgba(185,155,220,0.2))' }}>
                  <achievement.icon className="h-8 w-8 icon-rose" />
                </div>
                <h3 className="achievement-num text-5xl mb-2" style={{ fontWeight: 300 }}>{achievement.number}</h3>
                <p className="body-text text-sm" style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400, letterSpacing: '0.03em' }}>{achievement.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision and Mission Section */}
      <section className="py-20 section-main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Vision */}
            <div className="vision-mission-card p-10 rounded-2xl transition-all group">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, rgba(220,155,185,0.22), rgba(185,155,220,0.18))' }}>
                  <Eye className="h-7 w-7 icon-rose" />
                </div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, color: '#3d2535', fontSize: '2rem' }}>Our Vision</h2>
              </div>
              <div className="space-y-5">
                <div>
                  <h3 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 500, color: '#c9608c', fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase' }} className="mb-3">HITEC-IMS Vision</h3>
                  <p className="body-text leading-relaxed">
                    To become a center of excellence in medical education, producing competent healthcare professionals who contribute to the advancement of medical science and community health.
                  </p>
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 500, color: '#c9608c', fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase' }} className="mb-3">OBGYN Department Vision</h3>
                  <p className="body-text leading-relaxed">
                    To establish ourselves as a leading department in women's healthcare, providing comprehensive obstetric and gynecological services while training future specialists with excellence and compassion.
                  </p>
                </div>
              </div>
            </div>

            {/* Mission */}
            <div className="vision-mission-card p-10 rounded-2xl transition-all group">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, rgba(185,155,220,0.22), rgba(220,155,185,0.18))' }}>
                  <Target className="h-7 w-7 icon-rose" />
                </div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, color: '#3d2535', fontSize: '2rem' }}>Our Mission</h2>
              </div>
              <div className="space-y-5">
                <div>
                  <h3 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 500, color: '#c9608c', fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase' }} className="mb-3">HITEC-IMS Mission</h3>
                  <p className="body-text leading-relaxed">
                    To provide quality medical education through innovative teaching methodologies, research opportunities, and clinical exposure, fostering ethical and compassionate healthcare professionals.
                  </p>
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 500, color: '#c9608c', fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase' }} className="mb-3">OBGYN Department Mission</h3>
                  <p className="body-text leading-relaxed">
                    To deliver exceptional patient care in obstetrics and gynecology, advance medical education through innovative teaching, and conduct meaningful research that improves women's health outcomes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events and News Section */}
      <section className="py-20 section-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="tag-rose">Stay Updated</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#3d2535' }} className="text-4xl md:text-5xl mt-2">
              Events & News
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Events */}
            <div className="glass-card glass-card-hover p-8 rounded-2xl transition-all group">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, rgba(220,155,185,0.2), rgba(185,155,220,0.2))' }}>
                  <Calendar className="h-6 w-6 icon-rose" />
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, color: '#3d2535', fontSize: '1.6rem' }}>Upcoming Events</h3>
              </div>
              <div className="space-y-4">
                {[
                  { date: 'January 15, 2026', title: 'Grand Rounds - High Risk Obstetrics', desc: 'Weekly academic session featuring case presentations and discussions' },
                  { date: 'January 20, 2026', title: 'CME Workshop', desc: 'Continuing medical education on recent advances in gynecology' }
                ].map((event, idx) => (
                  <div key={idx} className="event-inner p-4 rounded-xl hover:translate-x-1 transition-all cursor-pointer" style={{ border: '1px solid rgba(215,170,185,0.2)' }}>
                    <p style={{ color: '#c9608c', fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: '0.82rem', letterSpacing: '0.04em' }} className="mb-1">{event.date}</p>
                    <h4 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, color: '#4a2a3a', fontSize: '1.05rem' }} className="mb-2">{event.title}</h4>
                    <p className="body-text text-sm">{event.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* News */}
            <div className="glass-card glass-card-hover p-8 rounded-2xl transition-all group">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, rgba(185,155,220,0.2), rgba(220,155,185,0.2))' }}>
                  <Newspaper className="h-6 w-6 icon-rose" />
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, color: '#3d2535', fontSize: '1.6rem' }}>Latest News</h3>
              </div>
              <div className="space-y-4">
                {[
                  { date: 'January 5, 2026', title: 'New Faculty Appointment', desc: 'Welcome Dr. Sarah Ahmed as Associate Professor in OBGYN department' },
                  { date: 'January 3, 2026', title: 'Research Publication', desc: 'Department publishes study on maternal health outcomes in leading journal' }
                ].map((item, idx) => (
                  <div key={idx} className="event-inner p-4 rounded-xl hover:translate-x-1 transition-all cursor-pointer" style={{ border: '1px solid rgba(215,170,185,0.2)' }}>
                    <p style={{ color: '#c9608c', fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: '0.82rem', letterSpacing: '0.04em' }} className="mb-1">{item.date}</p>
                    <h4 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, color: '#4a2a3a', fontSize: '1.05rem' }} className="mb-2">{item.title}</h4>
                    <p className="body-text text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 section-main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="tag-rose">Patient Care</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#3d2535' }} className="text-4xl md:text-5xl mt-2">
              Clinical Services
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Clock, title: 'Antenatal Care', desc: 'Comprehensive pregnancy monitoring and prenatal checkups', grad: 'rgba(220,155,185,0.22), rgba(200,135,175,0.15)' },
              { icon: Users, title: 'Gynecology OPD', desc: 'Expert consultation for all gynecological conditions', grad: 'rgba(185,155,220,0.22), rgba(165,135,200,0.15)' },
              { icon: Award, title: 'Labor & Delivery', desc: 'Modern labor rooms with 24/7 specialist availability', grad: 'rgba(220,185,155,0.22), rgba(200,165,135,0.15)' },
              { icon: Shield, title: 'Emergency Services', desc: 'Round-the-clock emergency obstetric care', grad: 'rgba(155,185,220,0.22), rgba(135,165,200,0.15)' }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="glass-card glass-card-hover p-8 rounded-2xl hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" style={{ background: `linear-gradient(135deg, ${feature.grad})` }}></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" style={{ background: `linear-gradient(135deg, ${feature.grad})` }}>
                    <feature.icon className="h-7 w-7 icon-rose" />
                  </div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, color: '#3d2535', fontSize: '1.2rem' }} className="mb-3"
                    onMouseEnter={e => e.currentTarget.style.color = '#c9608c'}
                    onMouseLeave={e => e.currentTarget.style.color = '#3d2535'}>{feature.title}</h3>
                  <p className="body-text">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="footer-dark py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo & Description */}
            <div className="col-span-1">
              <div className="flex items-center mb-4">
                <Heart className="h-8 w-8" style={{ color: '#d4779a' }} />
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, color: '#f5e8ee', fontSize: '1.25rem' }} className="ml-2">HealthCare+</span>
              </div>
              <p style={{ color: '#9a7888', fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: '0.88rem', lineHeight: 1.75 }}>
                Providing exceptional healthcare services with compassion and expertise.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 500, color: '#e8d4de', fontSize: '0.82rem', letterSpacing: '0.1em', textTransform: 'uppercase' }} className="mb-4">Quick Links</h3>
              <div className="space-y-2">
                {['home', 'faculty', 'about', 'programs', 'research'].map(s => (
                  <button key={s} onClick={() => scrollToSection(s)} style={{ color: '#9a7888', fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: '0.9rem', display: 'block', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#d4779a'}
                    onMouseLeave={e => e.currentTarget.style.color = '#9a7888'}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 500, color: '#e8d4de', fontSize: '0.82rem', letterSpacing: '0.1em', textTransform: 'uppercase' }} className="mb-4">Contact</h3>
              <div className="space-y-2" style={{ color: '#9a7888', fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: '0.88rem' }}>
                <p className="flex items-center"><Phone className="h-4 w-4 mr-2" style={{ color: '#d4779a' }} /> +1 (555) 123-4567</p>
                <p>info@healthcareplus.com</p>
                <p>123 Medical Center Dr, City</p>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 500, color: '#e8d4de', fontSize: '0.82rem', letterSpacing: '0.1em', textTransform: 'uppercase' }} className="mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                  <a key={idx} href="#" style={{ color: '#9a7888', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#d4779a'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#9a7888'; e.currentTarget.style.transform = 'scale(1)'; }}>
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 text-center" style={{ borderTop: '1px solid rgba(180,120,140,0.15)' }}>
            <p style={{ color: '#7a5868', fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: '0.82rem' }}>&copy; 2025 HealthCare+. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}