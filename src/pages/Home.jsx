import React, { useEffect, useRef, useState } from 'react';

import * as THREE from 'three';
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

import ProjectCard from '../components/ProjectCard';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Clock } from 'lucide-react';
import { getProject, PROJECTS } from '../data/projects';
import { usePasswordGate } from '../components/PasswordGate';
import { useConstructionGate } from '../components/ConstructionGate';
import SectionPreheader from '../components/SectionPreheader';
import { audio } from '../utils/AudioEngine';
import { Waveform, UXIcon, TheatreIcon, ExperimentsIcon } from '../components/AnimatedIcons';
import AnimatedDivider from '../components/AnimatedDivider';
import { BRAND_COLORS as BRAND } from '../utils/theme';
import SmokyText from '../components/SmokyText';
import PullQuote from '../components/PullQuote';
import { DebugFlexCol, DebugSpacer } from '../components/LayoutDebugger';

// --- ASSETS ---
const IMAGES = {
  team1: "https://res.cloudinary.com/dqabyzuzf/image/upload/f_auto,q_auto/v1774547046/Still_bananna_rzjxm0.png",
  team2: "https://res.cloudinary.com/dqabyzuzf/image/upload/f_auto,q_auto/v1766616800/DDWebsite_Home_Sound_Desktop_ql27cj.jpg",
  team3: "https://res.cloudinary.com/dqabyzuzf/image/upload/f_auto,q_auto/v1765815845/DDWebsite_Home_Direction_Desktop_icc3g9.jpg",
  headshotPlaceholder: "https://res.cloudinary.com/dqabyzuzf/image/upload/f_auto,q_auto/v1774662349/CalarcoHeadshotUpdate_1_pcxlnh.png",
};

// --- COMPONENT DEFINITIONS ---

// eslint-disable-next-line no-unused-vars
const DisciplineModule = ({ title, img, color, darkColor, Icon, speed = 0.78, link, imgClass = "object-cover", ...props }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();
  const BG_COLOR = BRAND.light;



  const handleInteractionStart = () => setIsPlaying(true);
  const handleInteractionEnd = () => setIsPlaying(false);

  const handleClick = () => {
    if (isPlaying) {
      if (link) navigate(link);
    } else {
      setIsPlaying(true);
    }
  };

  return (
    <motion.div
      className="cursor-pointer group snap-center shrink-0 w-[55vw] sm:w-[45vw] md:w-full flex flex-col gap-6 items-center"
      style={{ containerType: 'inline-size' }}
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onClick={handleClick}
      {...props}
    >
      <div className="relative aspect-[3/4] w-full">
        <div
          className={`absolute z-30 transition-transform duration-500 ease-in-out flex items-center justify-center rounded-full ${isPlaying ? 'scale-110' : 'scale-100'}`}
          style={{
            backgroundColor: color,
            width: '20cqw',
            height: '20cqw',
            top: '-8%',
            left: '-6%',
            borderStyle: 'solid',
            borderColor: BG_COLOR,
            borderWidth: '1.2cqw'
          }}
        >
          <Icon color="#ffffff" speed={speed} isPlaying={isPlaying} />
        </div>

        <div className="absolute inset-0 w-full h-full rounded-theme-sm border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.1)] overflow-hidden transform-gpu isolation-isolate z-10">
          <img
            src={img}
            alt={title}
            onLoad={(e) => e.target.classList.remove('opacity-0')}
            className={`opacity-0 transition-opacity duration-700 ease-out ${imgClass} w-full h-full rounded-theme-sm`}
          />
          <div
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out rounded-theme-sm ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
            style={{
              backgroundColor: color,
              mixBlendMode: 'multiply'
            }}
          />
          <div
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out rounded-theme-sm ${isPlaying ? 'opacity-[0.85]' : 'opacity-0'}`}
            style={{
              backgroundColor: darkColor || 'rgba(0,0,0,0.8)',
            }}
          />
          <div className={`absolute inset-0 flex items-center justify-center z-20 transition-opacity duration-500 ease-in-out pointer-events-none ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
            <span
              className="text-white tracking-normal text-center px-4 font-outfit"
              style={{
                fontWeight: 500,
                fontSize: '8cqw',
                filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.3))'
              }}
            >
              View Work
            </span>
          </div>
        </div>
      </div>
      <div className="w-full text-center items-center group-hover:text-brand-ink transition-colors duration-300">
        <h3 className={`text-2xl lg:text-3xl font-outfit font-extrabold uppercase tracking-wide text-brand-ink ${isPlaying ? 'text-brand-ink' : 'text-brand-ink/75'} transition-colors duration-500`}>
          {title.endsWith('s') ? title : `${title}s`}
        </h3>
      </div>
    </motion.div>
  );
};

// CSS ring animation keyframes injected once
const RING_STYLE_ID = 'about-ring-keyframes';
if (typeof document !== 'undefined' && !document.getElementById(RING_STYLE_ID)) {
  const style = document.createElement('style');
  style.id = RING_STYLE_ID;
  style.textContent = `
    @keyframes ring1Spin {
      0%   { transform: rotateX(0deg)   rotateY(0deg)   rotateZ(0deg); }
      100% { transform: rotateX(360deg) rotateY(240deg) rotateZ(120deg); }
    }
    @keyframes ring2Spin {
      0%   { transform: rotateX(0deg)   rotateY(0deg)   rotateZ(0deg); }
      100% { transform: rotateX(-240deg) rotateY(360deg) rotateZ(-90deg); }
    }
    @keyframes ring3Spin {
      0%   { transform: rotateX(0deg)   rotateY(0deg)   rotateZ(0deg); }
      100% { transform: rotateX(180deg) rotateY(-360deg) rotateZ(60deg); }
    }
    @keyframes ringFadeIn {
      from { opacity: 0; transform: scale(0.85); }
      to   { opacity: 1; transform: scale(1); }
    }
  `;
  document.head.appendChild(style);
}

// Phases: photo → stage → screen → sound → rings
const CIRCLE_PHASES = ['photo', 'stage', 'screen', 'sound', 'rings'];

const AboutCircle = () => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', background: '#ffffff', WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)' }}>
      <img
        src={IMAGES.headshotPlaceholder}
        alt="Joseph Demarais"
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', borderRadius: '50%', WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)' }}
      />
    </div>
  );
};

const AboutMe = () => {
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } } };

  const sectionRef = useRef(null);

  return (
    <section ref={sectionRef} className="bg-white relative">
      <DebugSpacer id="Home_AboutMe_Top" defaultMobile={50} defaultDesktop={100} />
      <div className="w-full max-w-[1400px] mx-auto px-9 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-16">
          {/* TEXT COLUMN */}
          <div className="w-full md:flex-1 order-2 md:order-1">
            <div>
              <h2 className="text-5xl md:text-7xl font-extrabold text-brand-ink font-outfit leading-tight tracking-wide uppercase">
                <span className="block overflow-hidden">
                  <motion.span initial={{ y: "100%" }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }} className="block">
                    About Me
                  </motion.span>
                </span>
              </h2>
              <motion.div initial={{ width: 0 }} whileInView={{ width: 96 }} viewport={{ once: true }} transition={{ duration: 1, ease: "circOut" }} className="h-1 bg-gradient-to-r from-brand-blue via-brand-teal to-brand-purple rounded-full mt-8" />
              <DebugFlexCol as={motion.div} idPrefix="Home_About" defaultMobile={20} defaultDesktop={30} className="flex flex-col text-brand-ink-body text-lg leading-relaxed mt-[30px] md:mt-[50px]" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-10%" }}>
                <motion.p variants={itemVariants}>
                  If you laid my career out on a table, it might look like someone emptied three puzzles into one pile. Strangely enough, the pieces fit. Each rewards the same habits: prepare obsessively, then prioritize resources with care...cutting anything that isn't earning its place.
                </motion.p>

                <motion.p variants={itemVariants}>
                  I learned those habits first in theatre. I co-founded Coeurage Theatre Company, a pay-what-you-want ensemble in Los Angeles, and helped run it for a decade. We made nationally recognized work on budgets that didn't allow for anything inessential…the best training I could have asked for. Directing taught me to understand complex logistics across every department, and to lead rooms full of artists with strong instincts and stronger convictions, holding a larger vision intact while absorbing ideas and feedback. And to inspire brilliant collaborators who had other options and chose us anyway, for less than they were used to — earning their alignment through clarity and mutual trust rather than authority. Underneath all of it, every production began the same way: prepare until you know the material in your bones, then prioritize what's essential to the storytelling and cut everything that doesn't serve it.
                </motion.p>

                <motion.p variants={itemVariants}>
                  Sound design is where those habits face the smallest margin for error. A half-second of timing. A few decibels in either direction. The wrong cue at a key moment, or sound where there should be silence. The work begins with listening…to the script, to the director, to the work itself…and ends with deciding what every cue is doing for the moment so it lands. Sometimes the choice that lands hardest is silence.
                </motion.p>

                <motion.p variants={itemVariants}>
                  UX brings the same operating principles into a different room. Research and discovery is where preparation lives: handling the same kind of complex logistics that directing demanded, then tuning in to what someone can't quite articulate yet, watching for the small details that shape their perspective, staying disciplined enough to be changed by what you observe. Information architecture and interface work is where the prioritizing and cutting happen—stripping clutter, untangling complex IA problems, pulling cognitive load off the user wherever it isn't serving them, then finding the moments within those constraints that make an experience feel satisfying and intuitive rather than just functional. Clarity first. Delight second.
                </motion.p>

                <motion.p variants={itemVariants}>
                  These aren't adjacent skills. They're the same operating system running on different machines.
                </motion.p>


              </DebugFlexCol>
            </div>
          </div>

          {/* STICKY CIRCLE */}
          <div className="w-full md:w-auto shrink-0 md:sticky md:top-32 md:[@media(max-height:500px)]:static order-1 md:order-2 h-fit flex justify-start md:block z-[45]">
            <div className="relative w-48 h-48 md:w-56 md:h-56">
              <AboutCircle />
            </div>
          </div>
        </div>
      </div>

      <DebugSpacer id="Home_AboutMe_Bottom" defaultMobile={50} defaultDesktop={100} />
    </section>
  );
};


const getBrandColor = (d) => {
  switch (d) {
    case 'stage': return BRAND.stage;
    case 'screen': return BRAND.screens;
    case 'sound': return BRAND.sound;
    case 'experiment': return BRAND.experiments;
    default: return BRAND.purple;
  }
};

const ListProjectCard = ({ project, index }) => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const { requestAccess, isProjectUnlocked } = usePasswordGate();
  const { requestConstructionAccess } = useConstructionGate();
  const unlocked = isProjectUnlocked(project.id);
  const isConstruction = project.isConstruction;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -25% 0px" });

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigate = () => {
    const path = `/work/${project.id}`;
    if (isConstruction) {
      requestConstructionAccess(path);
    } else if (unlocked || requestAccess(path)) {
      navigate(path);
    }
  };

  return (
    <div
      ref={ref}
      className="relative w-full max-w-[1400px] mx-auto cursor-pointer focus-within:outline-none pt-[40px] lg:pt-0"
      role="button"
      tabIndex={0}
      onClick={handleNavigate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          audio.playClick();
          handleNavigate();
        }
      }}
      onMouseEnter={() => audio.playDeepHover()}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start lg:items-center">
        <div className={`relative lg:col-span-7 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
          <div className="relative bg-[#16161D] overflow-hidden rounded-theme-sm aspect-video w-full">
            <motion.div className="absolute inset-0 w-full h-full">
              <motion.img src={project.img} alt={`${project.title} Project Image`} className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: project.imgPosition || 'center center', top: project.imgNudge?.y || 0, left: project.imgNudge?.x || 0, y, scale: project.imgScale || 1.15 }} loading="lazy" />
            </motion.div>
          </div>
        </div>
        <div className={`flex flex-col w-full text-left lg:col-span-5 ${index % 2 === 0 ? 'lg:order-1 items-start' : 'lg:order-1 lg:items-end items-start'}`}>
          <SectionPreheader text={project.cat} color={getBrandColor(project.discipline)} textColor="#FFFFFF" align={index % 2 === 0 ? "left" : "right"} mobileAlign="left" />
          <h3 className={`text-4xl md:text-5xl font-outfit font-bold mb-6 ${index % 2 === 0 ? 'text-left' : 'lg:text-right text-left'}`}>
            <Link to={`/work/${project.id}`} className="cursor-pointer hover:text-gray-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal rounded">{project.title}</Link>
          </h3>
          <p className={`text-gray-400 font-light text-lg max-w-md ${index % 2 === 0 ? 'text-left' : 'lg:text-right text-left'}`}>{project.desc}</p>
          <div className="mt-8 flex">
            <motion.div onClick={(e) => { e.stopPropagation(); handleNavigate(); }} className="group inline-flex items-center gap-2 text-[#f1f1f1] text-xs font-bold uppercase tracking-widest cursor-pointer transition-all duration-300 hover:gap-4 hover:opacity-80">
              {isConstruction ? (<><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" fill="currentColor" stroke="none" /><polyline points="12 6 12 12 15.5 15.5" stroke={getBrandColor(project.discipline)} strokeWidth="3" fill="none" /></svg>View work</>) : unlocked ? (<>View work <ArrowRight size={16} /></>) : (<><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10V7a5 5 0 0 1 10 0v3" fill="none" /><rect x="3" y="10" width="18" height="12" rx="2" fill="currentColor" stroke="none" /><circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="currentColor" strokeWidth="3" style={{ color: '#0B1A21' }} /></svg> View work</>)}
            </motion.div>
          </div>
        </div>
      </div>
    </div >
  );
};

const Works = () => {
  const projects = [
    { ...getProject('morgan-stanley'), img: "https://res.cloudinary.com/dqabyzuzf/image/upload/f_auto,q_auto/v1774454742/DDWebsite_Home_UX_Desktop_rzqa9y_1_lgwlm7.png", imgScale: 1.25, imgNudge: { y: 0, x: 0 } },
    { ...getProject('coeurage'), img: getProject('coeurage')?.heroImg },
    { ...getProject('take-with-water'), img: "https://res.cloudinary.com/dqabyzuzf/image/upload/f_auto,q_auto/v1774487994/Screenshot_2026-03-25_at_11.29.15_AM_sg7iye.png" }
  ];

  const ref = useRef(null);
  // Preload/keep alive slightly offscreen

  return (
    <section ref={ref} id="works" className="bg-[#16161D] text-white overflow-hidden relative">
      <DebugSpacer id="Home_SelectedWork_Top" defaultMobile={50} defaultDesktop={100} />

      <div className="w-full max-w-[1400px] mx-auto px-9 md:px-12 lg:px-24 mb-[30px] md:mb-[50px] relative z-10">
        <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 font-outfit uppercase">Selected <br />Work</h2>
        <AnimatedDivider />
      </div>
      <div className="flex flex-col space-y-[40px] lg:space-y-20 px-9 md:px-12 lg:px-24 relative z-10 divide-y divide-white/20 lg:divide-y-0 max-w-[1400px] mx-auto">
        {projects.map((p, i) => (<ListProjectCard key={p.id} project={p} index={i} />))}
      </div>
      <DebugSpacer id="Home_SelectedWork_Bottom" defaultMobile={50} defaultDesktop={100} />
    </section>
  );
};

const Explorations = () => {
  const navigate = useNavigate();
  const { requestAccess, isProjectUnlocked } = usePasswordGate();
  const { requestConstructionAccess } = useConstructionGate();
  // Get first 3 experiments
  const experiments = [
    { ...getProject('redesigns'), subhead: "Showcasing applied sound design through speculative reimaginings and original prototypes." },
    { ...getProject('ui-prototypes'), img: "https://res.cloudinary.com/dqabyzuzf/image/upload/f_auto,q_auto/v1775591695/markus-spiske-hbb6GkG6p9M-unsplash_ycfhze.jpg", subhead: "Custom UI and other explorations using AI-assisted coding methods." },
    { ...getProject('ai-media'), subhead: "Experiments with various media forms. Some created with standard workflows and some with AI assistance." }
  ];

  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCardClick = (id) => {
    const path = `/work/${id}`;
    const targetProject = getProject(id);
    if (targetProject?.isConstruction) {
      requestConstructionAccess(path);
    } else if (isProjectUnlocked(id) || requestAccess(path)) {
      navigate(path);
    }
  };

  return (
    <section className="bg-white relative">
      <DebugSpacer id="Home_Explorations_Top" defaultMobile={50} defaultDesktop={100} />
      <div className="w-full max-w-[1400px] mx-auto px-9 md:px-12 lg:px-24 flex flex-col-reverse md:flex-row items-start justify-between mb-16 gap-6 md:gap-12">
        <div>
          <h2 className="text-[40px] sm:text-5xl md:text-7xl font-extrabold text-brand-ink font-outfit uppercase tracking-tight mb-6 break-words">
            <Link to="/explorations" className="cursor-pointer hover:text-brand-orange transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded">
              Explorations
            </Link>
          </h2>
          <p className="text-brand-ink-body max-w-md md:max-w-2xl leading-relaxed text-lg text-left">
            Records from my &quot;lab&quot; for expanding skills and exploring small and ambitious personal projects.
          </p>

          <Link
            to="/explorations"
            className="inline-flex items-center gap-2 mt-6 text-brand-ink text-base font-bold uppercase tracking-widest cursor-pointer hover:gap-4 hover:text-brand-ink-body transition-all duration-300 group/link focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded"
          >
            <span>Visit Page</span>
            <ArrowRight className="w-5 h-5 text-brand-ink group-hover/link:text-brand-ink-body transition-colors" />
          </Link>

        </div>

        <Link
          to="/explorations"
          className="w-20 h-20 bg-brand-orange rounded-full flex items-center justify-center p-0 shrink-0 cursor-pointer transition-transform duration-300 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
        >
          <ExperimentsIcon color="#ffffff" isPlaying={true} speed={0.5} />
        </Link>
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-9 md:px-12 lg:px-24 grid grid-flow-col auto-cols-[70vw] md:auto-cols-[45vw] lg:auto-cols-auto lg:grid-flow-row lg:grid-cols-3 gap-6 lg:gap-8 overflow-x-auto snap-x perspective-[1000px] pb-6 scrollbar-hide [@media(max-height:500px)]:flex [@media(max-height:500px)]:flex-col [@media(max-height:500px)]:overflow-visible">
        {experiments.map((item, i) => (
          <motion.div
            key={item.id}
            onClick={() => handleCardClick(item.id)}
            className="group cursor-pointer flex flex-col [@media(max-height:500px)]:flex-row h-full w-full snap-center"
            initial={{ opacity: 0, rotateY: isMobile ? 0 : -90 }}
            whileInView={{ opacity: 1, rotateY: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{
              delay: isMobile ? 0 : i * 0.1,
              type: "spring",
              stiffness: 60,
              damping: 12,
              mass: 0.8
            }}
          >
            {/* Image Container - Attached to bottom text */}
            <div className={`aspect-[16/9] w-full [@media(max-height:500px)]:w-[45%] overflow-hidden rounded-t-theme-sm [@media(max-height:500px)]:rounded-t-none [@media(max-height:500px)]:rounded-l-theme-sm relative ${item.bgClass || ''}`}>
              <div className="absolute inset-0 transition-colors duration-500 z-10" />
              <div className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-110">
                <img
                  src={item.img}
                  alt={item.title}
                  onLoad={(e) => e.target.classList.remove('opacity-0')}
                  className={`opacity-0 transition-opacity duration-700 ease-out w-full h-full ${item.contain ? 'object-contain' : 'object-cover'}`}
                  style={{
                    objectPosition: item.imgPosition || 'center',
                    transform: item.imgScale ? `scale(${item.imgScale})` : 'none'
                  }}
                />
              </div>
            </div>

            {/* Text Container - Orange Background */}
            <div className="bg-brand-orange p-6 md:p-8 [@media(max-height:500px)]:p-5 rounded-b-theme-sm [@media(max-height:500px)]:rounded-b-none [@media(max-height:500px)]:rounded-r-theme-sm flex flex-col gap-3 [@media(max-height:500px)]:w-[55%] flex-1 transition-colors duration-300">
              <span className="text-white/80 text-[10px] md:text-sm font-bold uppercase tracking-widest">{item.cat}</span>
              <h3 className="text-xl md:text-2xl lg:text-3xl [@media(max-height:500px)]:text-xl font-outfit font-bold text-white mb-1">{item.title}</h3>
              {item.subhead && <p className="text-white/90 text-sm md:text-base [@media(max-height:500px)]:text-xs font-medium leading-relaxed mb-4 [@media(max-height:500px)]:mb-2 [@media(max-height:500px)]:leading-snug">{item.subhead}</p>}

              <div className="mt-auto flex items-center gap-2 text-[#f1f1f1] text-sm [@media(max-height:500px)]:text-xs font-bold uppercase tracking-widest group/link hover:opacity-80 transition-opacity">
                {getProject(item.id)?.isConstruction ? (
                  <>
                    <span className="flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1 inline -mt-0.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" fill="currentColor" stroke="none" />
                          <polyline points="12 6 12 12 15.5 15.5" stroke="#E07A3A" strokeWidth="3" fill="none" />
                      </svg>
                      Under Construction
                    </span>
                  </>
                ) : isProjectUnlocked(item.id) ? (
                  <>
                    <span>View</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 10V7a5 5 0 0 1 10 0v3" fill="none" />
                      <rect x="3" y="10" width="18" height="12" rx="2" fill="currentColor" stroke="none" />
                      <circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="currentColor" strokeWidth="3" style={{ color: 'var(--color-brand-orange, #E07A3A)' }} />
                    </svg>
                    <span>Coming Soon</span>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom button removed */}

      <DebugSpacer id="Home_Explorations_Bottom" defaultMobile={80} defaultDesktop={120} />
    </section>
  );
};


const Home = () => {

  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const heroTextRef = useRef(null);
  const portfolioScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleScrollRight = () => {
    if (portfolioScrollRef.current) {
      portfolioScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handleScrollLeft = () => {
    if (portfolioScrollRef.current) {
      portfolioScrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const checkScroll = () => {
    if (portfolioScrollRef.current) {
      const { scrollLeft } = portfolioScrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
    }
  };

  // Scroll handling for animations
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroY = useTransform(scrollY, [0, 500], [0, 100]);

  // --- THREE.JS HERO IMPLEMENTATION ---
  useEffect(() => {
    if (!canvasRef.current) return;

    // 1. CONFIGURATION
    const params = {
      backgroundColor: '#ffffff',
      ringCount: 3,
      startRadius: 0,
      bandWidth: 22,
      gap: 0,
      thickness: 0.1,
      opacity: 0.45,
      transparent: true,
      rotationSpeed: 0.5,
      chaosLevel: 1,
      cycleDuration: 30,
      decelerationDuration: 3,
      pauseDuration: 0.5,
      resetDuration: 6,
      accelerationTime: 5.0,
      resetSmoothness: 0.06,
      holdDuration: 3,
      lineOpacity: 0.15
    };

    const disciplineColors = [
      new THREE.Color('#00C2A3'), // Teal
      new THREE.Color('#56C6FF'), // Blue  
      new THREE.Color('#A88EFF')  // Purple
    ];

    // 2. SCENE SETUP
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(params.backgroundColor);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(35, -25, 100);
    camera.lookAt(-50, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvasRef.current
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Cap pixel ratio — on mobile (iPhone) raw devicePixelRatio is 3, meaning 9× more pixels to render.
    // Capping at 1.5 cuts GPU load roughly in half with no visible quality difference at phone sizes.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x9EADB8, 1.8);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(10, 20, 50);
    scene.add(dirLight);

    // 3. RING MANAGEMENT
    let rings = [];

    // Helper functions
    let ringColorAssignment = [0, 1, 2];
    let lastCycleNumber = -1;

    // Optimization: Reusable objects to prevent GC thrashing
    const _colorScratch = new THREE.Color();
    const _colorTarget = new THREE.Color();
    const _weights = [0, 0, 0];

    function shuffleColorAssignment() {
      for (let i = ringColorAssignment.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ringColorAssignment[i], ringColorAssignment[j]] = [ringColorAssignment[j], ringColorAssignment[i]];
      }
    }

    // Optimized color calculation that writes to 'target' instead of creating new objects
    function updateDriftingColor(ringIndex, time, target) {
      const driftPhase = time * 0.12 + ringIndex * 2.5;
      const rawDrift = Math.sin(driftPhase);
      const drift = Math.sign(rawDrift) * Math.pow(Math.abs(rawDrift), 0.6);
      const driftNormalized = (drift + 1) / 2;

      const secondaryPhase = time * 0.09 + ringIndex * 1.3;
      const rawSecondary = Math.sin(secondaryPhase);
      const secondary = Math.sign(rawSecondary) * Math.pow(Math.abs(rawSecondary), 0.6);
      const secondaryNormalized = (secondary + 1) / 2;

      // Reset weights
      _weights[0] = 0; _weights[1] = 0; _weights[2] = 0;

      const assignedColor = ringColorAssignment[ringIndex];
      _weights[assignedColor] += 0.7;

      const driftTarget = (assignedColor + 1) % 3;
      const secondaryTarget = (assignedColor + 2) % 3;
      _weights[driftTarget] += driftNormalized * 0.25;
      _weights[secondaryTarget] += (1 - driftNormalized) * 0.25 * secondaryNormalized;

      const totalWeight = _weights[0] + _weights[1] + _weights[2];
      const invTotal = 1 / totalWeight;

      // Manual mixing to avoid looping and object creation
      target.setRGB(0, 0, 0);

      const w0 = _weights[0] * invTotal;
      const w1 = _weights[1] * invTotal;
      const w2 = _weights[2] * invTotal;

      const c0 = disciplineColors[0];
      const c1 = disciplineColors[1];
      const c2 = disciplineColors[2];

      target.r = c0.r * w0 + c1.r * w1 + c2.r * w2;
      target.g = c0.g * w0 + c1.g * w1 + c2.g * w2;
      target.b = c0.b * w0 + c1.b * w1 + c2.b * w2;
    }

    function updateAnimatedColor(ringIndex, time, isResetting, isHolding, resetProgress, isAccelerating, accelProgress, target) {
      const cycleNumber = Math.floor(time / params.cycleDuration);
      const dominantIndex = cycleNumber % 3;
      const previousDominantIndex = (cycleNumber - 1 + 3) % 3;

      // Calculate drifting color into scratch space
      updateDriftingColor(ringIndex, time, _colorScratch);

      if (isResetting) {
        const pureColor = disciplineColors[dominantIndex];
        target.copy(_colorScratch).lerp(pureColor, resetProgress);
      } else if (isHolding) {
        target.copy(disciplineColors[previousDominantIndex]);
      } else if (isAccelerating) {
        const pureColor = disciplineColors[previousDominantIndex];
        target.copy(pureColor).lerp(_colorScratch, accelProgress);
      } else {
        target.copy(_colorScratch);
      }
    }

    function rebuildRings() {
      rings.forEach(ring => {
        scene.remove(ring);
        if (ring.geometry) ring.geometry.dispose();
        if (ring.material) ring.material.dispose();
        ring.children.forEach(c => c.geometry && c.geometry.dispose());
      });
      rings = [];

      let innerR = (params.startRadius > 0) ? params.startRadius : 0;

      for (let i = 0; i < params.ringCount; i++) {
        const outerR = innerR + params.bandWidth;

        const shape = new THREE.Shape();
        shape.absarc(0, 0, outerR, 0, Math.PI * 2, false);
        if (innerR > 0) {
          const hole = new THREE.Path();
          hole.absarc(0, 0, innerR, 0, Math.PI * 2, true);
          shape.holes.push(hole);
        }

        const geometry = new THREE.ExtrudeGeometry(shape, {
          depth: params.thickness,
          bevelEnabled: false,
          curveSegments: 96
        });
        geometry.center();

        const color = disciplineColors[i % 3].clone();
        const material = new THREE.MeshBasicMaterial({
          color: color,
          transparent: params.transparent,
          opacity: params.opacity,
          side: THREE.DoubleSide,
          depthWrite: false
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.renderOrder = params.ringCount - i;

        // const line = new THREE.LineSegments(edges, lineMaterial.clone());
        // mesh.add(line);

        // Pre-scramble rotation so it doesn't look like it's starting from zero
        mesh.rotation.set(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        );

        updateRingSpeed(mesh);
        scene.add(mesh);
        rings.push(mesh);

        innerR = innerR + params.bandWidth + params.gap;
      }
    }

    function updateRingSpeed(mesh) {
      const baseSpeed = 0.02;
      mesh.userData.speedX = (Math.random() - 0.5) * baseSpeed * params.chaosLevel;
      mesh.userData.speedY = (Math.random() - 0.5) * baseSpeed * params.chaosLevel;
      mesh.userData.speedZ = (Math.random() - 0.5) * baseSpeed * params.chaosLevel;
      if (Math.abs(mesh.userData.speedX) < 0.002) mesh.userData.speedX += 0.005;
    }

    // 4. ANIMATION LOOP
    const clock = new THREE.Clock();
    const targetQuaternion = new THREE.Quaternion();
    let wasResetting = false;
    let snapshotCaptured = false;

    function generateRandomTarget() {
      const maxAngle = Math.PI * 0.35;
      const euler = new THREE.Euler(
        (Math.random() - 0.5) * maxAngle * 2,
        (Math.random() - 0.5) * maxAngle * 2,
        (Math.random() - 0.5) * maxAngle * 0.5
      );
      targetQuaternion.setFromEuler(euler);
    }



    generateRandomTarget();
    shuffleColorAssignment();
    rebuildRings();

    let animationFrameId;

    function animate() {

      // START OFFSET: Add 15 seconds so we start in the middle of the "chaos" phase
      // instead of the initial "hold/reset" phase.
      const time = clock.getElapsedTime() + 15;
      const cycleTime = time % params.cycleDuration;
      const timeRemaining = params.cycleDuration - cycleTime;

      let rotationMultiplier = 1.0;
      let isDecelerating = false;
      let isPrePause = false;
      let isResetting = false;
      let isHolding = false;
      let isAccelerating = false;

      const totalPreHoldTime = params.decelerationDuration + params.pauseDuration + params.resetDuration;

      if (timeRemaining < totalPreHoldTime && timeRemaining >= params.pauseDuration + params.resetDuration) {
        isDecelerating = true;
        const decelProgress = 1 - ((timeRemaining - params.pauseDuration - params.resetDuration) / params.decelerationDuration);
        rotationMultiplier = Math.pow(1 - decelProgress, 2);

        if (!wasResetting) {
          generateRandomTarget();
          wasResetting = true;
          snapshotCaptured = false;
        }
      }
      else if (timeRemaining < params.pauseDuration + params.resetDuration && timeRemaining >= params.resetDuration) {
        isPrePause = true;
        rotationMultiplier = 0;
      }
      else if (timeRemaining < params.resetDuration) {
        isResetting = true;
        rotationMultiplier = 0;
        
        // Capture exact stopped position before we begin the Slerp sequence
        if (!snapshotCaptured && wasResetting) {
            rings.forEach(r => {
               if (!r.userData.initQ) r.userData.initQ = new THREE.Quaternion();
               r.userData.initQ.copy(r.quaternion);
            });
            snapshotCaptured = true;
        }
      }
      else if (cycleTime < params.holdDuration) {
        isHolding = true;
        rotationMultiplier = 0;

        const cycleNumber = Math.floor(time / params.cycleDuration);
        if (cycleNumber !== lastCycleNumber) {
          shuffleColorAssignment();
          lastCycleNumber = cycleNumber;
        }
      }
      else if (cycleTime < params.holdDuration + params.accelerationTime) {
        isAccelerating = true;
        const t = (cycleTime - params.holdDuration) / params.accelerationTime;
        rotationMultiplier = t * t;

        if (wasResetting) {
          rings.forEach(ring => updateRingSpeed(ring));
          wasResetting = false;
        }
      }
      else {
        wasResetting = false;
      }

      const globalMult = params.rotationSpeed;

      rings.forEach((ring, index) => {
        let resetProgress = 0;
        let accelProgress = 0;
        let rawResetProgress = 0;

        if (isDecelerating || isPrePause) {
          resetProgress = 0;
        } else if (isResetting) {
          rawResetProgress = 1 - (timeRemaining / params.resetDuration);
          const easedProgress = rawResetProgress * rawResetProgress * (3 - 2 * rawResetProgress);
          resetProgress = easedProgress;
        } else if (isHolding) {
          resetProgress = 1;
        } else if (isAccelerating) {
          accelProgress = (cycleTime - params.holdDuration) / params.accelerationTime;
          const delayedProg = Math.max(0, (accelProgress - 0.2) / 0.8);
          accelProgress = delayedProg * delayedProg * (3 - 2 * delayedProg);
        }

        // Optimized call: pass the material's color object directly as the target
        updateAnimatedColor(index, time, isResetting, isHolding, resetProgress, isAccelerating, accelProgress, ring.material.color);

        if (isHolding) {
          ring.material.opacity = 1.0;
        } else if (isResetting) {
          ring.material.opacity = params.opacity + (1.0 - params.opacity) * resetProgress;
        } else if (isAccelerating) {
          ring.material.opacity = 1.0 - (1.0 - params.opacity) * accelProgress;
        } else {
          ring.material.opacity = params.opacity;
        }

        const lineMesh = ring.children[0];
        if (lineMesh && lineMesh.material) {
          let targetLineOpacity = params.lineOpacity;
          if (isResetting) {
            targetLineOpacity = params.lineOpacity * (1 - resetProgress);
          } else if (isHolding) {
            targetLineOpacity = 0;
          } else if (isAccelerating) {
            targetLineOpacity = params.lineOpacity * accelProgress;
          }
          lineMesh.material.opacity = targetLineOpacity;
        }

        if (isDecelerating || isPrePause) {
          const currentSpeedMult = globalMult * rotationMultiplier;
          ring.rotateX(ring.userData.speedX * currentSpeedMult);
          ring.rotateY(ring.userData.speedY * currentSpeedMult);
          ring.rotateZ(ring.userData.speedZ * currentSpeedMult);
        } else if (isResetting) {
          if (ring.userData.initQ) {
            // Apply the exact "gradual speed up" ease requested by the user, smoothly locking at the end
            const t = rawResetProgress;
            const easeProgress = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            ring.quaternion.slerpQuaternions(ring.userData.initQ, targetQuaternion, easeProgress);
          } else {
            ring.quaternion.slerp(targetQuaternion, 0.05);
          }
        } else if (isHolding) {
          ring.quaternion.slerp(targetQuaternion, 0.1);
        } else {
          const currentSpeedMult = globalMult * rotationMultiplier;
          ring.rotateX(ring.userData.speedX * currentSpeedMult);
          ring.rotateY(ring.userData.speedY * currentSpeedMult);
          ring.rotateZ(ring.userData.speedZ * currentSpeedMult);
        }
      });

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    }

    // Use IntersectionObserver to fully stop the rAF loop when hero is off-screen.
    // This is far cheaper than a scroll listener — zero JS cost when not visible.
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible) {
          // Restarting — resume the loop
          animate();
        } else if (!isVisible && wasVisible) {
          // Leaving — cancel the loop entirely
          cancelAnimationFrame(animationFrameId);
        }
      },
      { threshold: 0.01 }
    );
    observer.observe(canvasRef.current);
    animate();

    // Handle Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();

      // Dispose Three.js resources
      rings.forEach(ring => {
        ring.geometry.dispose();
        ring.material.dispose();
        ring.children.forEach(c => c.geometry && c.geometry.dispose());
      });
      renderer.dispose();
      // Note: We don't remove the canvas element because it's managed by React
    };
  }, []);

  return (
    <div className="bg-brand-light min-h-screen font-sans selection:bg-brand-highlight selection:text-brand-ink">

      {/* 
         NAVBAR: 
         We force "reverseColor={true}" initially so the menu is black (visible on white).
         This is a simplification; in a real scrolling scenario you might want it to 
         switch based on scroll position, but for the white hero, black is safer.
      */}
      {/* Navbar handled by App.jsx now */}

      <main className="relative">

        {/* HERO SECTION */}
        <div ref={heroRef} className="relative min-h-[100svh] lg:h-screen w-full overflow-hidden flex items-center">
          <canvas ref={canvasRef} className="block w-full h-full absolute inset-0 z-0" />

          {/* Hero Text Overlay */}
          <div className="relative z-10 flex items-center justify-start pl-6 md:pl-20 py-24 lg:py-0 w-full h-full pointer-events-none">
            <motion.div
              ref={heroTextRef}
              style={{ opacity: heroOpacity, y: heroY }}
              className="text-left w-full max-w-4xl flex flex-col items-start justify-center text-brand-ink transition-colors duration-300 pointer-events-auto pt-16 lg:pt-0"
            >
              <h1 className="font-outfit font-medium text-brand-ink tracking-tight mb-2 lg:mb-6 text-[clamp(2.75rem,8vmin,5.5rem)] leading-none">
                I'm Joseph <SmokyText text="Demarais." phonetic="(dem-uh-RAY)." />
              </h1>

              <p className="font-outfit font-light text-brand-ink-body m-0 text-[clamp(1.5rem,3vmin,2.5rem)] max-w-2xl">
                I make things you can <span className="font-semibold text-brand-ink">see</span>, <span className="font-semibold text-brand-ink">hear</span> and <span className="font-semibold text-brand-ink">touch</span>.
              </p>

              <motion.a
                href="#portfolio"
                whileTap={{ scale: 0.98 }}
                className="inline-block mt-4 lg:mt-8 bg-[#16161D]/50 backdrop-blur-[2px] text-white border border-transparent px-8 py-3 rounded-full font-outfit font-medium uppercase tracking-[0.2em] hover:bg-[#050508] hover:border-white/20 hover:text-white transition-all duration-300 focus:ring-1 focus:ring-offset-1 focus:ring-brand-highlight focus:outline-none pointer-events-auto cursor-pointer"
              >
                Portfolio
              </motion.a>


            </motion.div>
          </div>

        </div>


        {/* FLUID MODULES SECTION */}
        <section className="relative bg-brand-light w-full">
          <DebugSpacer id="Home_FluidModules_Top" defaultMobile={50} defaultDesktop={100} />
          <div className="w-full max-w-[1400px] mx-auto px-9 md:px-12 lg:px-24 mb-[30px] md:mb-[50px] relative z-10">
            <h2 id="portfolio" className="text-5xl md:text-7xl font-extrabold text-brand-ink tracking-tight mb-6 font-outfit uppercase">Portfolio</h2>
            <AnimatedDivider className="mt-8" />
          </div>

          {/* Scroll arrows removed — carousel is swipeable on mobile */}

          <motion.div
            onScroll={checkScroll}
            ref={portfolioScrollRef}
            className="
            w-full max-w-[1400px] mx-auto
            flex gap-6 px-9
            overflow-x-auto pb-0 pt-12
            md:grid md:grid-cols-3 md:gap-10 md:overflow-visible md:px-12 md:pb-0 md:pt-12 lg:gap-16 lg:px-24
            scrollbar-hide
            perspective-[1200px]
          "
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: isMobile ? 0 : 0.2,
                  delayChildren: isMobile ? 0 : 0.1,
                }
              }
            }}
          >

            <DisciplineModule
              variants={{
                hidden: { opacity: 0, y: 50, scale: 0.95 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 20
                  }
                }
              }}
              title="Sound"
              img={IMAGES.team2}
              color={BRAND.teal}
              darkColor={BRAND.tealDark}
              Icon={Waveform}
              link="/sounds"
            />

            <DisciplineModule
              variants={{
                hidden: { opacity: 0, y: 50, scale: 0.95 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 20
                  }
                }
              }}
              title="Screen"
              img={IMAGES.team1}
              color={BRAND.blue}
              darkColor={BRAND.blueDark}
              Icon={UXIcon}
              speed={0.858}
              link="/screens"
            />

            <DisciplineModule
              variants={{
                hidden: { opacity: 0, y: 50, scale: 0.95 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 20
                  }
                }
              }}
              title="Stage"
              img={IMAGES.team3}
              color={BRAND.purple}
              darkColor={BRAND.purpleDark}
              Icon={TheatreIcon}
              link="/stage"
            />
          </motion.div>


          <DebugSpacer id="Home_FluidModules_Bottom" defaultMobile={50} defaultDesktop={100} />
        </section>

        <AboutMe />
        <Works />
        <Explorations />

        {/* Footer removed here, handled by App.jsx */}

      </main>

      {/* CSS for specific hero animations that are hard to do in Tailwind without plugins */}
      <style>{`
        .animate-triangle-appear {
            animation: triangleAppear 3s ease-in-out infinite;
        }

        @keyframes triangleAppear {
            0% { opacity: 0; }
            70% { opacity: 0; }
            85% { opacity: 1; }
            95% { opacity: 1; }
            100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};


export default Home;