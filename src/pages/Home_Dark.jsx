import React, { useEffect, useRef, useState } from 'react';

import * as THREE from 'three';
import {  useScroll, useTransform, useInView , motion } from 'framer-motion';
import Starfield from '../components/Starfield';
import ProjectCard from '../components/ProjectCard';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, X, Mail } from 'lucide-react';
import { getProject, PROJECTS } from '../data/projects';
import SectionPreheader from '../components/SectionPreheader';
import { Waveform, UXIcon, TheatreIcon, ExperimentsIcon } from '../components/AnimatedIcons';
import AnimatedDivider from '../components/AnimatedDivider';
import { BRAND_COLORS as BRAND } from '../utils/theme';

// --- ASSETS ---
const IMAGES = {
  heroVideo: "https://res.cloudinary.com/dqabyzuzf/video/upload/f_auto,q_auto/v1763496355/WebsiteVidOptimized_o21ksu.mp4",
  fallbackHero: "https://res.cloudinary.com/dqabyzuzf/image/upload/f_auto,q_auto/v1763525405/FallbackHeroImg_zkrces.png",
  team1: "https://res.cloudinary.com/dqabyzuzf/image/upload/f_auto,q_auto/v1766176237/DDWebsite_Home_UX_Desktop_rzqa9y.jpg",
  team2: "https://res.cloudinary.com/dqabyzuzf/image/upload/f_auto,q_auto/v1766616800/DDWebsite_Home_Sound_Desktop_ql27cj.jpg",
  team3: "https://res.cloudinary.com/dqabyzuzf/image/upload/f_auto,q_auto/v1765815845/DDWebsite_Home_Direction_Desktop_icc3g9.jpg",
  project1: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop",
  project2: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop",
  project3: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?q=80&w=2000&auto=format&fit=crop",
  headshotPlaceholder: "https://res.cloudinary.com/dqabyzuzf/image/upload/f_auto,q_auto/v1774662349/CalarcoHeadshotUpdate_1_pcxlnh.png",
  experimentsBg: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop"
};

// --- COMPONENT DEFINITIONS ---

const DisciplineModule = ({ title, img, color, darkColor, Icon, speed = 0.78, link, imgClass = "object-cover", ...props }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();
  const BG_COLOR = BRAND.black; // Changed to match dark background

  const handleInteractionStart = () => setIsPlaying(true);
  const handleInteractionEnd = () => setIsPlaying(false);

  const handleClick = (e) => {
    if (isPlaying) {
      if (link) navigate(link);
    } else {
      setIsPlaying(true);
    }
  };

  return (
    <motion.div
      className="cursor-pointer group snap-center shrink-0 w-[70vw] md:w-[45vw] lg:w-full flex flex-col gap-6 items-start"
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

        <div className="absolute inset-0 w-full h-full rounded-theme-sm border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.3)] overflow-hidden transform-gpu isolation-isolate z-10">
          <img
            src={img}
            alt={title}
            className={`${imgClass} w-full h-full rounded-theme-sm`}
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
      <div className="w-full text-left items-start group-hover:text-white transition-colors duration-300">
        <h3 className={`text-2xl lg:text-3xl font-outfit font-extrabold uppercase tracking-wide text-white ${isPlaying ? 'text-white' : 'text-white/70'} transition-colors duration-500`}>
          {title.endsWith('s') ? title : `${title}s`}
        </h3>
      </div>
    </motion.div>
  );
};

const AboutMe = () => {

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } };

  return (
    <section className="py-24 lg:py-32 bg-[#050508] relative">
      <div className="w-full max-w-[1400px] mx-auto fluid-px">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-16">
          <div className="w-full md:flex-1 order-2 md:order-1">
            <div>
              <h2 className="fluid-text-h2 font-extrabold text-white font-outfit tracking-wide uppercase">
                <span className="block overflow-hidden">
                  <motion.span initial={{ y: "100%" }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }} className="block">
                    About Me
                  </motion.span>
                </span>
              </h2>
              <motion.div initial={{ width: 0 }} whileInView={{ width: 96 }} viewport={{ once: true }} transition={{ duration: 1, ease: "circOut" }} className="h-1 bg-gradient-to-r from-brand-blue via-brand-teal to-brand-purple rounded-full mt-8"></motion.div>
              <motion.div className="space-y-6 text-gray-400 font-light text-lg leading-relaxed mt-12" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-10%" }}>
                <motion.p variants={itemVariants}>
                  <strong className="font-bold text-white">The through-line in my work isn't a medium. It's a discipline I keep applying across every form I work in: figure out what a project actually needs, remove the rest, and listen carefully — to the people making it happen, and to the people it's intended for.</strong>
                </motion.p>
                <motion.p variants={itemVariants}>
                  I built that discipline most profoundly at Coeurage Theatre Company, an exclusively pay-what-you-want theater I co-founded in Los Angeles. We competed for the same awards as companies with far greater resources, in one of the most expensive cities in the world…and won many of them. Stage & Cinema called me "the best director of his age in Los Angeles." What those experiences actually gave me was more durable than any award: <strong className="font-bold text-white">the habit of identifying what is essential to the storytelling, prioritizing resources toward those elements, and cutting anything extraneous without ego.</strong> We had all the artistic ambition in the world, but on our budgets there simply was no choice in the matter. And I wouldn't have had it any other way.
                </motion.p>
                <motion.p variants={itemVariants}>
                  Running a company for a decade taught me something beyond the creative. Tracking dependencies across set, lights, sound, costumes, and stage management simultaneously. Building systems for casting and production from scratch. Leading very passionate, very opinionated people. Managing logistical and creative conflicts between departments while keeping the larger vision intact. And doing all of it while inspiring world-class artists who had other options and chose to work with us for less than they were accustomed to — which means <strong className="font-bold text-white">alignment is earned through clarity, inspiration, and mutual trust, not authority.</strong> Those skills travel.
                </motion.p>
                <motion.p variants={itemVariants}>
                  <strong className="font-bold text-white">It also turns out that directing and UX research are the same job wearing different clothes.</strong> Both require deep logistical preparation before you enter the room. Both require rigorous analysis to determine what someone actually needs beneath the surface of what they're saying. Both require listening with enough discipline to change course based on what participants reveal — in words or behavior. Both require synthesis across conflicting perspectives and the nerve to make decisions that won't satisfy everyone. The pipelines are nearly identical.
                </motion.p>
                <motion.p variants={itemVariants}>
                  Moving into UX gave that framework somewhere to reflect back. Backstage processes became a user experience. An audience's journey from parking lot to curtain became a user experience. The director's job of deciding what the story needs and ruthlessly subordinating everything else to that — that's information architecture. Once I learned to think in terms of friction and cognitive load, I couldn't stop applying it to everything I do.
                </motion.p>
                <motion.p variants={itemVariants}>
                  Sound design is where these principles face the smallest margin for error. <strong className="font-bold text-white">A half second of timing. A couple of decibels too high or too low. The wrong music at a key moment, or sound where there should be silence — these decisions can make or break an entire project.</strong> And as with directing and UX, the discipline remains the same: staying open to letting what you observe override what you planned. Watching performers in rehearsal, collaborating with fellow designers, reading the room — the work is always listening first.
                </motion.p>
                <motion.p variants={itemVariants}>
                  These aren't adjacent careers or siloed experiences. They're the same operating system running on different machines.
                </motion.p>
              </motion.div>
            </div>
          </div>
          <div className="w-full md:w-auto shrink-0 md:sticky md:top-32 order-1 md:order-2 h-fit flex justify-start md:block z-[45]">
            <div className="relative w-48 h-48 md:w-56 md:h-56">
              {/* 
                  Shared Layout Transition:
                  We use layoutId="profile-image" to tell Framer Motion these are the same logical element.
                  When isExpanded is FALSE, we render this thumbnail.
                  When isExpanded is TRUE, we render the overlay version below.
                */}
              <motion.div
                className="w-full h-full rounded-full overflow-hidden border border-white/10 bg-gray-800"
              >
                <img
                  src={IMAGES.headshotPlaceholder}
                  alt="Joseph Demarais"
                  className="object-cover w-full h-full grayscale-0 group-hover:grayscale transition-all duration-700 object-[center_20%]"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>


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
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  return (
    <div ref={ref} className="relative w-full max-w-[1400px] mx-auto cursor-pointer focus-within:outline-none pt-16 lg:pt-0" onClick={() => navigate(`/work/${project.id}`)}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`} style={{ clipPath: "inset(0 round 7px)", WebkitClipPath: "inset(0 round 7px)" }}>
          <div className="aspect-video relative bg-brand-dark overflow-hidden rounded-theme-sm border border-white/10">
            <motion.div className="absolute inset-0 w-full h-full" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}>
              <motion.img style={{ y, scale: 1.15 }} src={project.img} alt={`${project.title} Project Image`} className="absolute inset-0 w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500" loading="lazy" />
            </motion.div>
          </div>
        </div>
        <div className={`flex flex-col w-full text-left ${index % 2 === 0 ? 'lg:order-1 items-start' : 'lg:order-1 lg:items-end items-start'}`}>
          <SectionPreheader
            text={project.cat}
            color={getBrandColor(project.discipline)}
            textColor="#FFFFFF"
            align={index % 2 === 0 ? "left" : "right"}
            mobileAlign="left"
          />
          <h3
            onClick={() => navigate(`/work/${project.id}`)}
            className={`text-4xl md:text-5xl font-outfit font-bold mb-6 cursor-pointer hover:text-gray-300 transition-colors ${index % 2 === 0 ? 'text-left' : 'lg:text-right text-left'}`}
          >
            {project.title}
          </h3>
          <p className={`text-gray-400 font-light text-lg max-w-md ${index % 2 === 0 ? 'text-left' : 'lg:text-right text-left'}`}>
            {project.desc}
          </p>
          <div className="mt-8 flex">
            <motion.div
              onClick={(e) => { e.stopPropagation(); navigate(`/work/${project.id}`); }}
              className="group inline-flex items-center gap-2 text-brand-highlight text-xs font-bold uppercase tracking-widest cursor-pointer transition-all duration-300 hover:gap-4"
            >
              View Case Study <ArrowRight size={16} />
            </motion.div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-9 right-9 md:left-12 md:right-12 lg:left-24 lg:right-24 h-px bg-white/10" />
    </div >
  );
};

const Works = () => {
  const projects = [
    getProject('secret'),
    getProject('analog-warmth'),
    getProject('still')
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "0px 0px -20% 0px" }); // Preload/keep alive slightly offscreen

  return (
    <section ref={ref} id="works" className="bg-[#16161D] text-white py-24 lg:py-32 overflow-hidden relative">
      <Starfield enabled={isInView} density={2500} speed={0.2} opacity={0.65} />

      <div className="w-full max-w-[1400px] mx-auto fluid-px mb-12 lg:mb-20 relative z-10">
        <h2 className="fluid-text-h2 font-extrabold tracking-tight mb-6 font-outfit uppercase">Selected <br />Work</h2>
        <AnimatedDivider />
      </div>
      <div className="flex flex-col space-y-16 lg:space-y-20 fluid-px relative z-10 divide-y divide-white/20 lg:divide-y-0">
        {projects.map((p, i) => (<ListProjectCard key={i} project={p} index={i} />))}
      </div>
    </section>
  );
};

const Explorations = () => {
  const navigate = useNavigate();
  // Get first 3 experiments
  const experiments = PROJECTS.filter(p => p.discipline === 'experiment').slice(0, 3);
  return (
    <section className="bg-[#050508] py-24 lg:py-32 relative">
      <div className="w-full max-w-[1400px] mx-auto fluid-px flex flex-col-reverse md:flex-row items-start justify-between mb-16 gap-12">
        <div>
          <h2
            onClick={() => navigate('/explorations')}
            className="fluid-text-h2 font-extrabold text-white font-outfit uppercase tracking-tight mb-6 cursor-pointer hover:text-brand-orange transition-colors duration-300"
          >
            Explorations
          </h2>
          <p className="text-gray-400 font-light max-w-md md:max-w-2xl text-lg text-left">
            Where code meets chaos. A collection of generative art, shader studies, and interactive prototypes.
          </p>

          <div
            onClick={() => navigate('/explorations')}
            className="group/link flex items-center gap-2 mt-6 text-brand-orange text-base font-bold uppercase tracking-widest cursor-pointer hover:gap-4 transition-all duration-300"
          >
            <span>Visit Page</span>
            <ArrowRight className="w-5 h-5 text-brand-orange" />
          </div>

        </div>

        <div
          onClick={() => navigate('/explorations')}
          className="w-20 h-20 bg-brand-orange rounded-full flex items-center justify-center p-0 shrink-0 cursor-pointer transition-transform duration-300 hover:scale-110"
        >
          <ExperimentsIcon color="#ffffff" isPlaying={true} speed={0.5} />
        </div>
      </div>

      <div className="w-full max-w-[1400px] mx-auto fluid-px grid grid-cols-1 md:grid-cols-3 gap-8 perspective-[1000px]">
        {experiments.map((item, i) => (
          <motion.div
            key={item.id}
            onClick={() => navigate(`/work/${item.id}`)}
            className="group cursor-pointer flex flex-col h-full"
            initial={{ opacity: 0, rotateY: -90 }}
            whileInView={{ opacity: 1, rotateY: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{
              delay: i * 0.1,
              type: "spring",
              stiffness: 60,
              damping: 12,
              mass: 0.8
            }}
          >
            {/* Image Container - Attached to bottom text */}
            <div className="aspect-[16/9] w-full overflow-hidden rounded-t-theme-sm relative">
              <div className="absolute inset-0 bg-brand-orange/10 group-hover:bg-brand-orange/0 transition-colors duration-500 z-10 mix-blend-multiply" />
              <motion.img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
            </div>

            {/* Text Container - Orange Background */}
            <div className="bg-brand-orange p-6 md:p-8 rounded-b-theme-sm flex flex-col gap-2 flex-1 transition-colors duration-300">
              <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest">{item.cat}</span>
              <h3 className="text-2xl font-outfit font-bold text-white mb-4">{item.title}</h3>

              <div className="mt-auto flex items-center gap-2 text-white text-sm font-bold uppercase tracking-widest group/link">
                <span>View Exploration</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom button removed */}

    </section>
  );
};

const scrollToPortfolio = () => {
  const element = document.getElementById('portfolio');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const Home = () => {
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const heroTextRef = useRef(null);
  const portfolioScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

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
      decelerationDuration: 2,
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
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x9EADB8, 1.8);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(10, 20, 50);
    scene.add(dirLight);

    // 3. RING MANAGEMENT
    let rings = [];
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.15
    });

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

        // const edges = new THREE.EdgesGeometry(geometry);
        // const line = new THREE.LineSegments(edges, lineMaterial.clone());
        // mesh.add(line);

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
      animationFrameId = requestAnimationFrame(animate);

      // Don't animate if scrolled out of view to save performance
      if (window.scrollY > window.innerHeight) return;

      const time = clock.getElapsedTime();
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
        rotationMultiplier = 1 - (decelProgress * decelProgress);

        if (!wasResetting) {
          generateRandomTarget();
          wasResetting = true;
        }
      }
      else if (timeRemaining < params.pauseDuration + params.resetDuration && timeRemaining >= params.resetDuration) {
        isPrePause = true;
        rotationMultiplier = 0;
      }
      else if (timeRemaining < params.resetDuration) {
        isResetting = true;
        rotationMultiplier = 0;
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
        rotationMultiplier = t * (2 - t);

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
          const easeInProgress = rawResetProgress * rawResetProgress * rawResetProgress;
          const slerpAmount = params.resetSmoothness * (0.02 + easeInProgress * 1.5);
          ring.quaternion.slerp(targetQuaternion, slerpAmount);
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
    }

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
        <div ref={heroRef} className="relative h-screen w-full overflow-hidden">
          <canvas ref={canvasRef} className="block w-full h-full absolute inset-0 z-0" />

          {/* Hero Text Overlay */}
          <div className="absolute h-full top-0 left-0 w-full pointer-events-none z-10 flex items-center justify-start pl-6 md:pl-20">
            <motion.div
              ref={heroTextRef}
              style={{ opacity: heroOpacity, y: heroY }}
              className="text-left w-full max-w-4xl flex flex-col items-start justify-center text-brand-ink transition-colors duration-300"
            >
              <h1 className="font-outfit font-medium text-brand-ink tracking-tight mb-6 fluid-text-h1">
                I'm Joseph Demarais.
              </h1>
              <p className="font-outfit font-light text-brand-ink/80 m-0 fluid-text-h3 max-w-2xl">
                I design things you can <span className="font-semibold text-brand-ink">see</span>, <span className="font-semibold text-brand-ink">hear</span> and <span className="font-semibold text-brand-ink">touch</span>.
              </p>

              <motion.a
                href="#portfolio"
                whileTap={{ scale: 0.98 }}
                className="inline-block mt-8 bg-brand-dark/50 backdrop-blur-[2px] text-white border border-transparent px-8 py-3 rounded-full font-outfit font-medium uppercase tracking-[0.2em] hover:bg-[#FFDE21] hover:border-[#16161D]/30 hover:text-brand-ink transition-all duration-300 focus:ring-1 focus:ring-offset-1 focus:ring-brand-highlight focus:outline-none pointer-events-auto cursor-pointer"
              >
                Portfolio
              </motion.a>


            </motion.div>
          </div>

        </div>


        {/* FLUID MODULES SECTION */}
        <section className="relative bg-brand-light w-full py-24 lg:py-32">
          <div className="w-full fluid-px mb-20">
            <h2 id="portfolio" className="fluid-text-h2 font-extrabold text-brand-ink tracking-tight mb-6 font-outfit uppercase">Portfolio</h2>
            <AnimatedDivider className="mt-8" />
          </div>

          {/* Mobile Scroll Hint Arrows */}
          <div className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <button
              onClick={handleScrollRight}
              className="pointer-events-auto bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg border border-gray-100/50 hover:bg-brand-highlight hover:scale-110 active:scale-95 transition-all duration-300 group"
              aria-label="Scroll Right"
            >
              <ArrowRight className="w-6 h-6 text-brand-ink group-hover:text-brand-ink drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]" />
            </button>
          </div>

          {canScrollLeft && (
            <div className="lg:hidden absolute left-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
              <button
                onClick={handleScrollLeft}
                className="pointer-events-auto bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg border border-gray-100/50 hover:bg-brand-highlight hover:scale-110 active:scale-95 transition-all duration-300 group"
              >
                <ArrowLeft className="w-6 h-6 text-brand-ink group-hover:text-brand-ink drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]" />
              </button>
            </div>
          )}

          <motion.div
            onScroll={checkScroll}
            ref={portfolioScrollRef}
            className="
            w-full
            flex gap-6 fluid-px
            overflow-x-auto pb-6 pt-12
            lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:pb-0 lg:pt-0
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
                  staggerChildren: 0.2, // Stagger effect
                  delayChildren: 0.1,
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