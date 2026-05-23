import { useRef, useEffect, useState, Suspense } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, MotionValue } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Parallax } from '../components/Parallax';

const greetings = ["നമസ്കാരം", "Hello", "Bonjour", "Hola", "Ciao", "Hallo", "こんにちは", "안녕하세요", "你好", "Привет", "مرحباً", "नमस्ते", "Welcome"];

const FastGreetings = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev >= greetings.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 250); // 250ms per language
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center relative w-full h-full">
      <AnimatePresence mode="wait">
        <motion.h1 
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.05 }}
          className="text-white text-3xl sm:text-4xl md:text-6xl font-display uppercase tracking-widest absolute text-center w-full"
        >
          {greetings[index]}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
};

// Typewriter: only starts when trigger=true, calls onDone when finished
const TypewriterText = ({
  text,
  trigger,
  speed = 70,
  onDone,
  showCursor = true,
}: {
  text: string;
  trigger: boolean;
  speed?: number;
  onDone?: () => void;
  showCursor?: boolean;
}) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    let i = 0;
    setDisplayed("");
    setDone(false);
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [trigger, text, speed, onDone]);

  return (
    <span>
      {displayed}
      {showCursor && (
        <span
          className={`inline-block w-[3px] h-[0.85em] align-middle ml-1 bg-accent ${
            done ? "animate-[blink_1s_step-end_infinite]" : ""
          }`}
          style={{ verticalAlign: "middle" }}
        />
      )}
    </span>
  );
};

// An animated, cinematic 3D glowing orb
const CinematicOrb = () => {
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = clock.getElapsedTime() * 0.2;
      sphereRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={2} floatIntensity={2}>
      <Sphere ref={sphereRef} args={[1, 64, 64]} scale={2.5}>
        <MeshDistortMaterial
          color="#ff5500"
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.8}
          roughness={0.2}
          distort={0.4}
          speed={3}
          emissive="#aa2200"
          emissiveIntensity={0.5}
        />
      </Sphere>
    </Float>
  );
};

// Separate component so useInView has its own ref inside the sticky viewport
const OrbText = ({
  scaleText,
  opacityText,
  displayText,
  startTyping,
}: {
  scaleText: MotionValue<number>;
  opacityText: MotionValue<number>;
  displayText: MotionValue<"none" | "flex">;
  startTyping: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [canStart, setCanStart] = useState(false);
  const [line1Done, setLine1Done] = useState(false);

  // Wait 400ms after overlay is removed before typing begins
  useEffect(() => {
    if (!startTyping) return;
    const t = setTimeout(() => setCanStart(true), 400);
    return () => clearTimeout(t);
  }, [startTyping]);

  return (
    <motion.div
      ref={ref}
      style={{ scale: scaleText, opacity: opacityText, display: displayText, transformOrigin: "center center" }}
      className="relative z-10 flex flex-col items-center justify-center pointer-events-none w-full h-screen px-6"
    >
      <div className="text-center">
        {/* Line 1: "I'm" — KodeMono regular */}
        <div className="font-kode font-normal uppercase text-4xl sm:text-6xl md:text-[80px] leading-[1] text-white tracking-[0.1em] drop-shadow-[0_0_30px_rgba(255,85,0,0.5)]">
          <TypewriterText
            text="I'm"
            trigger={canStart}
            speed={120}
            showCursor={!line1Done}
            onDone={() => setLine1Done(true)}
          />
        </div>
        {/* Line 2: "Saheer MK" — KodeMono bold */}
        <div className="font-kode font-bold uppercase text-[12vw] sm:text-7xl md:text-[100px] leading-[1] text-accent tracking-tight drop-shadow-[0_0_60px_rgba(255,85,0,0.9)] mt-2 whitespace-nowrap">
          <TypewriterText
            text="Saheer MK"
            trigger={line1Done}
            speed={80}
            showCursor={true}
          />
        </div>
      </div>
    </motion.div>
  );
};

const slowScrollTo = (targetRef: React.RefObject<HTMLElement | null>, duration: number) => {
  if (!targetRef.current) return;
  const targetY = targetRef.current.getBoundingClientRect().top + window.scrollY;
  const startY = window.scrollY;
  const distance = targetY - startY;
  let startTime: number | null = null;

  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);

    // easeInOutCubic for a beautifully slow cinematic glide
    const ease = progress < 0.5 
      ? 4 * progress * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    window.scrollTo(0, startY + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  };

  requestAnimationFrame(animation);
};

export const Hero = () => {
  const orbRef = useRef<HTMLElement>(null);
  const normalHeroRef = useRef<HTMLElement>(null);
  const [hideIntro, setHideIntro] = useState(false);

  const { scrollYProgress } = useScroll({
    target: orbRef,
    offset: ["start start", "end start"]
  });

  // At 0.33 progress, the 50vh of "sticky" scroll is over, and the next section begins to appear.
  // We want the text to scale and fade OUT completely BEFORE 0.33 so it doesn't overlap!
  const scaleText = useTransform(scrollYProgress, [0, 0.3], [1, 30]);
  const opacityText = useTransform(scrollYProgress, [0, 0.15, 0.3], [1, 1, 0]);
  const displayText = useTransform(scrollYProgress, (pos) => pos > 0.35 ? "none" : "flex");

  // Handle the multi-stage automated scroll timeline
  useEffect(() => {
    // Reset to top immediately on load
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden'; // Lock scrolling
    
    // Stage 1: Wait for greetings to finish, then dismiss overlay and start typing
    const introDuration = greetings.length * 250;
    
    const timer1 = setTimeout(() => {
      setHideIntro(true); // Remove the fixed overlay, triggering startTyping in OrbText
    }, introDuration);

    // Stage 2: Wait for typewriter to finish (~1500ms), then unlock scroll and auto-scroll to hero
    const timer2 = setTimeout(() => {
      document.body.style.overflow = ''; // Unlock
      slowScrollTo(normalHeroRef, 1500); // Cinematic smooth scroll to hero
    }, introDuration + 3400); // Wait 3.4s after overlay dismissal to read the text

    return () => {
      document.body.style.overflow = '';
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <>
      {/* 1. GREETING OVERLAY — fixed so it never shifts document layout */}
      <AnimatePresence>
        {!hideIntro && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50"
          >
            <FastGreetings />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. 3D ORB SCENE WITH SCROLL ANIMATION */}
      <section 
        ref={orbRef}
        className="h-[150vh] w-full relative bg-black z-40"
      >
        <div className="sticky top-0 h-screen w-full flex items-center justify-center">
          <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
              <ambientLight intensity={0.2} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#00ffcc" />
              <pointLight position={[0, 0, 0]} intensity={2} color="#ff3300" distance={10} />
              <Suspense fallback={null}>
                <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
                <CinematicOrb />
              </Suspense>
            </Canvas>
          </div>

          <OrbText scaleText={scaleText} opacityText={opacityText} displayText={displayText} startTyping={hideIntro} />
        </div>
      </section>

      {/* 3. NORMAL HERO SECTION */}
      <section 
        id="hero"
        ref={normalHeroRef}
        className="min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 pt-32 pb-16 relative z-10 bg-black/20 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <Parallax offset={80} clampInitial>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-2 mb-8"
            >
              <div className="flex items-center gap-4">
                <span className="w-12 h-[1px] bg-accent"></span>
                <p className="font-mono text-accent text-sm uppercase tracking-widest">SAHEERMK // PORTFOLIO</p>
              </div>
            </motion.div>
          </Parallax>

          {/* This text size increases like a keyframe as requested */}
          <Parallax offset={150} clampInitial>
            <motion.h1 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="font-black text-[14vw] sm:text-8xl md:text-[120px] lg:text-[150px] leading-[1] md:leading-[0.85] font-impact text-offwhite uppercase tracking-tighter origin-left"
            >
              <motion.span 
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="block pb-2"
              >
                Full Stack
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-offwhite to-gray-600 pb-4 md:pb-0"
              >
                Developer
              </motion.span>
            </motion.h1>
          </Parallax>

          <Parallax offset={50} clampInitial>
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-16 md:mt-24 flex flex-col md:flex-row items-start md:items-end justify-between gap-12"
            >
              <div className="flex flex-col gap-6 max-w-2xl">
                <p className="font-sans font-normal text-lg md:text-xl leading-relaxed text-gray-300">
                  <strong className="text-white font-semibold">I'm a freelance full stack developer from Kerala, India.</strong> I build web and mobile apps that work well, load fast, and don't fall apart six months later.
                </p>
                <p className="font-sans font-normal text-base md:text-lg leading-relaxed text-gray-400">
                  I mostly work with <strong>React on the frontend, Django on the backend</strong>, TypeScript throughout, and React Native when something needs to run on phones. Landing pages, dashboards, full platforms, whatever the project needs.
                </p>
              </div>

              <button 
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById('projects');
                  if (target) {
                    slowScrollTo({ current: target }, 1500);
                  }
                }}
                className="group relative flex items-center justify-center w-36 h-36 shrink-0 cursor-pointer border-none bg-transparent"
              >
                {/* Spinning text ring */}
                <div className="absolute inset-0 animate-[spin_10s_linear_infinite] opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                  <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-gray-400 group-hover:text-accent transition-colors duration-500">
                    <path id="textPath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
                    <text className="font-mono text-[9px] uppercase tracking-[0.2em]">
                      <textPath href="#textPath" startOffset="0%">
                        Scroll to explore • view projects • 
                      </textPath>
                    </text>
                  </svg>
                </div>
                
                {/* Center Glass Arrow */}
                <div className="relative z-10 w-12 h-12 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:border-accent/40 group-hover:bg-accent/10 transition-all duration-500 group-hover:scale-110">
                  <svg className="w-5 h-5 text-white group-hover:text-accent transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </button>
            </motion.div>
          </Parallax>
        </div>

        {/* Parallax Background Elements */}
        <Parallax offset={250} className="absolute right-0 top-1/4 opacity-10 pointer-events-none">
          <div className="w-[800px] h-[800px] rounded-full border border-white/20 blur-sm" />
        </Parallax>
      </section>
    </>
  );
};
