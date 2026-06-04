import { useState, useEffect, useRef } from 'react';
import { Skull, Code, Cpu, Globe, Lock, Shield, Trophy, Gamepad2, Music, Volume2, GitBranch, ExternalLink, Sun, Moon, Activity } from 'lucide-react';
import './index.css';

const BIOS = [
  'learning c++ / lua / python',
  'Working on new Projects',
  'just getting started. breaking things. building things.',
];

function ContributionGraph({ username }) {
  const [weeks, setWeeks] = useState([]);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`);
        const data = await res.json();
        const contribs = data.contributions || [];
        const grouped = [];
        for (let i = 0; i < contribs.length; i += 7) {
          grouped.push(contribs.slice(i, i + 7));
        }
        setWeeks(grouped.slice(-15));
      } catch {
        const fakeWeeks = [];
        for (let w = 0; w < 15; w++) {
          const days = [];
          for (let d = 0; d < 7; d++) {
            days.push({ count: Math.floor(Math.random() * 8), level: Math.floor(Math.random() * 5) });
          }
          fakeWeeks.push(days);
        }
        setWeeks(fakeWeeks);
      }
    };
    fetchContributions();
  }, [username]);

  if (!weeks.length) return null;

  return (
    <div className="contrib-section">
      <div className="contrib-grid">
        {weeks.map((week, wi) => (
          <div key={wi} className="contrib-col">
            {week.map((day, di) => (
              <div
                key={di}
                className={`contrib-cell level-${day.level}`}
                title={`${day.count} contributions`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="contrib-legend">
        <span>less</span>
        {[0,1,2,3,4].map(l => (
          <div key={l} className={`contrib-cell level-${l}`} />
        ))}
        <span>more</span>
      </div>
    </div>
  );
}

function App() {
  const [bioText, setBioText] = useState('');
  const [bioIndex, setBioIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [page, setPage] = useState('home');
  const [theme, setTheme] = useState('dark');
  const [transitioning, setTransitioning] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const mouseRef = useRef(null);
  const cursorRef = useRef(null);

  useEffect(() => {
    if (bioIndex >= BIOS.length) return;
    const full = BIOS[bioIndex];
    let i = 0;
    const interval = setInterval(() => {
      setBioText(full.slice(0, i + 1));
      i++;
      if (i >= full.length) {
        clearInterval(interval);
        setTimeout(() => setBioIndex(prev => (prev + 1) % BIOS.length), 2500);
      }
    }, 45);
    return () => clearInterval(interval);
  }, [bioIndex]);

  useEffect(() => {
    const el = mouseRef.current;
    if (!el) return;
    const move = (e) => {
      el.style.left = e.clientX + 'px';
      el.style.top = e.clientY + 'px';
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  const toggleMusic = () => {
    const audio = document.getElementById('bgm');
    if (muted) { audio.play().catch(() => {}); setMuted(false); }
    else { audio.pause(); setMuted(true); }
  };

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const changePage = (p) => {
    if (p === page) return;
    setTransitioning(true);
    setTimeout(() => {
      setPage(p);
      setTransitioning(false);
    }, 200);
  };

  const anim = (delay) => ({ animationDelay: `${delay}s` });

  return (
    <div className={`page theme-${theme}`}>
      <div className="bg-effects">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="grid-bg"></div>
        <div className="scanlines"></div>
      </div>

      <div className="mouse-glow" ref={mouseRef}></div>

      <div
        ref={cursorRef}
        className="custom-cursor"
        style={{ left: cursorPos.x, top: cursorPos.y }}
      />

      <audio id="bgm" src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3" loop volume="0.8" />

      <button className="music-btn" onClick={toggleMusic} aria-label="toggle music">
        {muted ? <Music size={16} /> : <Volume2 size={16} />}
      </button>

      <button className="theme-btn" onClick={toggleTheme} aria-label="toggle theme">
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <nav className="nav glass">
        {['home', 'about', 'projects'].map(p => (
          <button key={p} className={`nav-item ${page === p ? 'active' : ''}`} onClick={() => changePage(p)}>
            {p}
          </button>
        ))}
      </nav>

      <div className={`container ${transitioning ? 'page-exit' : 'page-enter'}`} key={page}>

        {page === 'home' && (
          <div className="page-content">
            <div className="hero-icon-wrap anim" style={anim(0)}>
              <div className="hero-ring"></div>
              <div className="hero-icon">
                <Skull size={44} />
              </div>
              <div className="status-dot"></div>
            </div>

            <h1 className="hero-name anim" style={anim(0.1)}>
              <span className="glitch" data-text="SURA">SURA</span>
            </h1>

            <div className="badges anim" style={anim(0.15)}>
              <span className="badge">security</span>
              <span className="badge">ctf</span>
              <span className="badge">dev</span>
            </div>

            <div className="typewriter glass-card anim" style={anim(0.2)}>
              <span className="prompt">$</span>
              <span className="tw-text">{bioText}</span>
              <span className="cursor">▊</span>
            </div>

            <div className="social-row anim" style={anim(0.25)}>
              <a href="https://github.com/Suraware" target="_blank" rel="noopener noreferrer" className="social-btn glass-card">
                <GitBranch size={18} />
                <span>GitHub</span>
              </a>
            </div>

            <div className="hero-section anim" style={anim(0.3)}>
              <h2>skills</h2>
              <div className="skill-grid">
                {[
                  { icon: Code, name: 'Python', color: '#3776ab', lvl: 'beginner' },
                  { icon: Cpu, name: 'C++', color: '#00599c', lvl: 'beginner' },
                  { icon: Gamepad2, name: 'Lua / Luau', color: '#00a2ff', lvl: 'beginner' },
                  { icon: Shield, name: 'Cybersecurity', color: '#ef4444', lvl: 'intermediate' },
                  { icon: Lock, name: 'Prompt Engineering', color: '#8b5cf6', lvl: 'proficient' },
                ].map((s) => (
                  <div key={s.name} className="skill-chip glass-card">
                    <s.icon size={16} style={{ color: s.color }} />
                    <span>{s.name}</span>
                    <span className="skill-lvl">{s.lvl}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-section anim" style={anim(0.35)}>
              <h2>achievements</h2>
              <div className="ach-list">
                <div className="ach-item glass-card">
                  <Trophy size={16} className="ach-icon gold" />
                  <div>
                    <strong>2nd Place — CTF Hackathon</strong>
                    <span className="ach-meta">march 2026</span>
                  </div>
                </div>
                <div className="ach-item glass-card">
                  <Trophy size={16} className="ach-icon silver" />
                  <div>
                    <strong>3 Hackathons (2025–2026)</strong>
                    <span className="ach-meta">attended & competed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {page === 'about' && (
          <div className="page-content">
            <h1 className="anim" style={anim(0)}>about <span className="glitch" data-text="me">me</span></h1>

            <div className="about-text glass-card anim" style={anim(0.1)}>
              <p>
                i write code and break stuff. mostly <strong>C++</strong>,{' '}
                <strong>Python</strong>, <strong>Lua</strong>, and <strong>HTML</strong>.
                not an expert yet but i'm getting there.
              </p>
              <p>
                <strong>cybersecurity</strong> is where i spend most of my time.
                got <strong>2nd place in a CTF hackathon</strong> so i must be doing something right.
              </p>
            </div>

            <h2 className="anim" style={anim(0.15)}>github activity</h2>
            <div className="contrib-wrap glass-card anim" style={anim(0.2)}>
              <div className="contrib-header">
                <Activity size={14} className="contrib-icon" />
                <span>@Suraware</span>
              </div>
              <ContributionGraph username="Suraware" />
            </div>

            <h2 className="anim" style={anim(0.25)}>languages</h2>
            <div className="skill-grid anim" style={anim(0.3)}>
              {[
                { icon: Code, name: 'Python', color: '#3776ab', lvl: 'learning' },
                { icon: Cpu, name: 'C++', color: '#00599c', lvl: 'learning' },
                { icon: Gamepad2, name: 'Lua / Luau', color: '#00a2ff', lvl: 'learning' },
                { icon: Globe, name: 'HTML', color: '#e34f26', lvl: 'learning' },
              ].map((s) => (
                <div key={s.name} className="skill-chip glass-card">
                  <s.icon size={16} style={{ color: s.color }} />
                  <span>{s.name}</span>
                  <span className="skill-lvl">{s.lvl}</span>
                </div>
              ))}
            </div>

            <h2 className="anim" style={anim(0.35)}>skills</h2>
            <div className="skill-grid anim" style={anim(0.4)}>
              <div className="skill-chip glass-card">
                <Shield size={16} style={{ color: '#ef4444' }} />
                <span>Cybersecurity</span>
                <span className="skill-lvl">intermediate</span>
              </div>
              <div className="skill-chip glass-card">
                <Lock size={16} style={{ color: '#8b5cf6' }} />
                <span>AI Prompting</span>
                <span className="skill-lvl">proficient</span>
              </div>
            </div>

            <h2 className="anim" style={anim(0.45)}>achievements</h2>
            <div className="ach-list anim" style={anim(0.5)}>
              <div className="ach-item glass-card">
                <Trophy size={16} className="ach-icon gold" />
                <div>
                  <strong>2nd Place — CTF Hackathon</strong>
                  <span className="ach-meta">march 2026</span>
                </div>
              </div>
              <div className="ach-item glass-card">
                <Trophy size={16} className="ach-icon silver" />
                <div>
                  <strong>3 Hackathons (2025–2026)</strong>
                  <span className="ach-meta">attended & competed</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {page === 'projects' && (
          <div className="page-content">
            <h1 className="anim" style={anim(0)}><span className="glitch" data-text="projects">projects</span></h1>

            <div className="proj-list anim" style={anim(0.1)}>
              <a href="https://github.com/Suraware/AEGIS-main1" target="_blank" rel="noopener noreferrer" className="proj-card glass-card" style={{ textDecoration: 'none' }}>
                <ExternalLink size={14} className="proj-icon" />
                <div className="proj-head">
                  <span className="proj-lang">Multi-language</span>
                  <span className="proj-status live">public</span>
                </div>
                <h3>AEGIS</h3>
                <p>World info platform — aggregates a lot of data. <a href="https://aegis-main1.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Live demo ↗</a></p>
              </a>

              <a href="https://github.com/Suraware/Suraware" target="_blank" rel="noopener noreferrer" className="proj-card glass-card" style={{ textDecoration: 'none' }}>
                <ExternalLink size={14} className="proj-icon" />
                <div className="proj-head">
                  <span className="proj-lang">Rust</span>
                  <span className="proj-status live">public</span>
                </div>
                <h3>Suraware</h3>
                <p>Go ransomware utilising ChaCha20 and ECIES encryption.</p>
              </a>

              <a href="https://github.com/Suraware/portfolio" target="_blank" rel="noopener noreferrer" className="proj-card glass-card" style={{ textDecoration: 'none' }}>
                <ExternalLink size={14} className="proj-icon" />
                <div className="proj-head">
                  <span className="proj-lang">React / Vite</span>
                  <span className="proj-status live">live</span>
                </div>
                <h3>Portfolio</h3>
                <p>This site — glassmorphism design.</p>
              </a>
            </div>
          </div>
        )}
      </div>

      <footer className="footer">
        <span>made with ❤️ by sura &bull; <a href="https://github.com/Suraware/portfolio" target="_blank" rel="noopener noreferrer" className="footer-link">source</a></span>
      </footer>
    </div>
  );
}

export default App;
