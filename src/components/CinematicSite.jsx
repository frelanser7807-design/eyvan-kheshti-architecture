import { useEffect, useMemo, useRef, useState } from 'react';
import ContactModal from './ContactModal.jsx';
import ExplorePanel from './ExplorePanel.jsx';

const OPENING_PLAYBACK_RATE = 1.2;
const JOURNEY_PLAYBACK_RATE = 1.35;
const PRESENTATION_PLAYBACK_RATE = 1.05;

const storyCards = [
  {
    index: '01',
    title: 'Architecture',
    titleFa: 'معماری',
    image: '/assets/candidates/office-world/scene-00-bishopsgate-tower-entry-v1.png',
  },
  {
    index: '02',
    title: 'Facade Design',
    titleFa: 'طراحی نما',
    image: '/assets/candidates/office-world/scene-05-client-presentation-room-v1.png',
  },
  {
    index: '03',
    title: 'Interior Design',
    titleFa: 'طراحی داخلی',
    image: '/assets/candidates/office-world/scene-04-upper-floor-atelier-v1.png',
  },
  {
    index: '04',
    title: 'Plans & Documentation',
    titleFa: 'نقشه و مدارک',
    image: '/assets/candidates/office-world/scene-07-principal-design-desk-v3.png',
  },
];

const scenes = [
  {
    id: 'digital-founder',
    title: 'Digital Introduction',
    titleFa: 'معرفی دیجیتال',
    eyebrow: 'THE PRINCIPAL',
    eyebrowFa: 'بنیان‌گذار',
    src: '/assets/film/00-digital-founder-intro.mp4',
    poster: '/assets/film/posters/digital-founder-intro.jpg',
    playbackRate: OPENING_PLAYBACK_RATE,
  },
  {
    id: 'arrival',
    title: 'Arrival',
    titleFa: 'ورود',
    eyebrow: 'INTERNATIONAL STUDIO',
    eyebrowFa: 'استودیوی بین‌المللی',
    src: '/assets/film/founder-intro-plus-entrance.mp4',
    poster: '/assets/film/posters/founder-hero.jpg',
    playbackRate: OPENING_PLAYBACK_RATE,
    data: {
      code: '01 / STUDIO IDENTITY',
      title: 'The Principal',
      lines: ['Creative Direction', 'Architecture · Interiors'],
    },
  },
  {
    id: 'studio',
    title: 'Inside the Studio',
    titleFa: 'درون استودیو',
    eyebrow: 'SPATIAL JOURNEY',
    eyebrowFa: 'سفر فضایی',
    src: '/assets/film/lobby-to-studio-clean.mp4',
    poster: '/assets/candidates/office-world/scene-04-upper-floor-atelier-v1.png',
    playbackRate: JOURNEY_PLAYBACK_RATE,
    data: {
      code: '02 / DESIGN PRACTICE',
      title: 'Inside the Studio',
      lines: ['Concept Design', 'Spatial Strategy · Development'],
    },
  },
  {
    id: 'works',
    title: 'Selected Works',
    titleFa: 'آثار منتخب',
    eyebrow: 'ARCHITECTURE',
    eyebrowFa: 'معماری',
    src: '/assets/film/chapters/05-presentation-room-clean.mp4',
    poster: '/assets/candidates/office-world/scene-05-client-presentation-room-v1.png',
    playbackRate: PRESENTATION_PLAYBACK_RATE,
    data: {
      code: '03 / SELECTED WORK',
      title: 'Ideas Made Visible',
      lines: ['Architecture · Facade', 'Interior Design · Presentation'],
    },
  },
  {
    id: 'materials',
    title: 'Material Library',
    titleFa: 'کتابخانهٔ متریال',
    eyebrow: 'DETAIL & CRAFT',
    eyebrowFa: 'جزئیات و ساخت',
    src: '/assets/film/chapters/06-material-lab.mp4',
    poster: '/assets/candidates/office-world/scene-06-material-model-lab-v1.png',
    playbackRate: JOURNEY_PLAYBACK_RATE,
    data: {
      code: '04 / DETAIL & CRAFT',
      title: 'Material Intelligence',
      lines: ['Material Research', 'Detail Design · Specification'],
    },
  },
  {
    id: 'practice',
    title: 'Architecture in Practice',
    titleFa: 'معماری در عمل',
    eyebrow: 'DESIGN DESK',
    eyebrowFa: 'میز طراحی',
    src: '/assets/film/chapters/07-design-desk.mp4',
    poster: '/assets/candidates/office-world/scene-07-principal-design-desk-v3.png',
    playbackRate: JOURNEY_PLAYBACK_RATE,
    data: {
      code: '05 / DESIGN JOURNEY',
      title: 'From Idea to Space',
      lines: ['Concept · Planning', 'Visualisation · Delivery'],
    },
  },
];

const interfaceCopy = {
  en: {
    soundOn: 'SOUND ON', soundOff: 'SOUND OFF', menu: 'MENU', directory: 'STUDIO DIRECTORY',
    projects: 'Projects', services: 'Services', tutorials: 'Tutorials', insights: 'Architecture Notes', courses: 'Courses & Shop', contact: 'Contact',
    idleEyebrow: 'INTERACTIVE ARCHITECTURE EXPERIENCE', idleTitle: 'A Studio Built Around Ideas',
    begin: 'Click to Begin', playing: 'Now Playing', continue: 'Click to Continue', explore: 'Explore the Studio',
    whatWeDo: 'WHAT WE DO', concept: 'CONCEPT EXPERIENCE · 2026',
  },
  fa: {
    soundOn: 'صدا روشن', soundOff: 'صدا خاموش', menu: 'منو', directory: 'فهرست استودیو',
    projects: 'پروژه‌ها', services: 'خدمات', tutorials: 'آموزش‌ها', insights: 'یادداشت‌های معماری', courses: 'دوره‌ها و فروشگاه', contact: 'ارتباط با ما',
    idleEyebrow: 'تجربهٔ تعاملی معماری', idleTitle: 'استودیویی شکل‌گرفته پیرامون ایده‌ها',
    begin: 'برای شروع کلیک کنید', playing: 'در حال پخش', continue: 'برای ادامه کلیک کنید', explore: 'ورود به استودیو',
    whatWeDo: 'خدمات ما', concept: 'تجربهٔ مفهومی · ۲۰۲۶',
  },
};

function localised(item, key, language) {
  if (!item) return '';
  return language === 'fa' ? (item[`${key}Fa`] || item[key] || '') : (item[key] || '');
}

function localisedArray(item, key, language) {
  if (!item) return [];
  const value = language === 'fa' ? (item[`${key}Fa`] || item[key]) : item[key];
  return Array.isArray(value) ? value : [];
}

function getInitialLanguage(content) {
  const fallback = content?.settings?.defaultLanguage === 'fa' ? 'fa' : 'en';
  try {
    const saved = localStorage.getItem('eyvan_kheshti_language');
    return saved === 'fa' || saved === 'en' ? saved : fallback;
  } catch {
    return fallback;
  }
}

export default function CinematicSite({ content }) {
  const [sceneIndex, setSceneIndex] = useState(-1);
  const [loaded, setLoaded] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [cardRun, setCardRun] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [exploreView, setExploreView] = useState('projects');
  const [menuOpen, setMenuOpen] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const [language, setLanguage] = useState(() => getInitialLanguage(content));
  const [soundEnabled, setSoundEnabled] = useState(() => content?.settings?.soundtrackEnabled !== false);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const menuTriggerRef = useRef(null);
  const menuPanelRef = useRef(null);

  const currentScene = scenes[Math.max(sceneIndex, 0)];
  const copy = interfaceCopy[language] || interfaceCopy.en;
  const currentStory = sceneIndex > 0 ? content?.story?.find((item) => item.id === currentScene.id) : null;
  const brandName = localised(content?.brand, 'name', language) || 'EYVAN KHESHTI';
  const brandLine = localised(content?.brand, 'latinName', language) || 'ARCHITECTURE & INTERIORS';
  const founderName = localised(content?.brand, 'founderName', language) || 'Farnaz Ghaffarian';
  const founderRole = localised(content?.brand, 'founderRole', language) || 'Founder & Creative Director';
  const brandLocation = localised(content?.brand, 'city', language) || 'LONDON / INTERNATIONAL';
  const isIdle = sceneIndex < 0;
  const isFinal = sceneIndex === scenes.length - 1;
  // Navigation must be available immediately; visitors should never need to
  // finish a cinematic chapter before reaching Projects, Services or Contact.
  const menuAvailable = true;
  const progress = `${String(Math.max(sceneIndex + 1, 0)).padStart(2, '0')} / ${String(scenes.length).padStart(2, '0')}`;

  const advanceLabel = useMemo(() => {
    if (isIdle) return copy.begin;
    if (playing) return copy.playing;
    if (isFinal && ended) return copy.explore;
    return copy.continue;
  }, [copy, ended, isFinal, isIdle, playing]);

  useEffect(() => {
    const nextLanguage = language === 'fa' ? 'fa' : 'en';
    try {
      localStorage.setItem('eyvan_kheshti_language', nextLanguage);
    } catch {
      // The experience remains usable when browser storage is unavailable.
    }
    document.documentElement.lang = nextLanguage;
    document.documentElement.dir = nextLanguage === 'fa' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = 0.36;
    if (!soundEnabled) audioRef.current?.pause?.();
  }, [soundEnabled]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    menuPanelRef.current?.querySelector('button')?.focus();
    const closeOnEscape = (event) => {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      menuTriggerRef.current?.focus();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  useEffect(() => {
    const preloads = scenes.map((scene) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.src = scene.src;
      return video;
    });

    return () => preloads.forEach((video) => {
      video.removeAttribute('src');
      video.load();
    });
  }, []);

  useEffect(() => {
    if (sceneIndex < 0 || !videoRef.current) return;
    const video = videoRef.current;
    video.playbackRate = currentScene.playbackRate;
    video.currentTime = 0;
    setEnded(false);
    setPlaying(true);
    setMediaError(false);
    setCardsVisible(false);
    const playPromise = video.play();
    playPromise?.catch?.(() => setPlaying(false));
  }, [sceneIndex]);

  useEffect(() => {
    if (!isIdle || !videoRef.current) return undefined;

    const video = videoRef.current;
    const showOpeningPreview = () => {
      video.pause();
      video.currentTime = 4.35;
    };

    if (video.readyState >= 2) showOpeningPreview();
    else video.addEventListener('loadeddata', showOpeningPreview, { once: true });

    return () => video.removeEventListener('loadeddata', showOpeningPreview);
  }, [isIdle, currentScene.src]);

  const advance = () => {
    if (playing) return;
    if (!isIdle && !ended) {
      videoRef.current?.play()?.catch(() => setPlaying(false));
      return;
    }
    if (isFinal && ended) {
      setExploreOpen(true);
      return;
    }
    if (isIdle) {
      if (soundEnabled) audioRef.current?.play?.().catch?.(() => undefined);
      setSceneIndex(0);
      setCardRun((value) => value + 1);
      return;
    }
    setSceneIndex((value) => value + 1);
  };

  const restart = () => {
    videoRef.current?.pause?.();
    setSceneIndex(-1);
    setPlaying(false);
    setEnded(false);
    setCardsVisible(false);
    setExploreOpen(false);
    setMenuOpen(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const openExplore = (view) => {
    setExploreView(view);
    setExploreOpen(true);
    setMenuOpen(false);
  };

  const openContact = () => {
    setContactOpen(true);
    setMenuOpen(false);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (!audioRef.current) return;
    if (next) audioRef.current.play().catch(() => undefined);
    else audioRef.current.pause();
  };

  const handleTimeUpdate = (event) => {
    if (sceneIndex === 0 && event.currentTarget.currentTime >= 4.05 && !cardsVisible) {
      setCardsVisible(true);
    }
  };

  const handleEnded = () => {
    setPlaying(false);
    setEnded(true);
    if (sceneIndex === 0) setCardsVisible(true);
  };

  const handleLoadedData = (event) => {
    event.currentTarget.playbackRate = currentScene.playbackRate;
    setLoaded(true);
  };

  const handleMediaError = () => {
    setMediaError(true);
    setPlaying(false);
    setEnded(true);
  };

  return (
    <div className={`ek-site ek-story ${loaded ? 'is-ready' : 'is-loading'} ${playing ? 'is-playing' : 'is-paused'} ${isIdle ? 'is-idle' : 'is-started'}`}>
      <div className="ek-loader" role="status" aria-label="Preparing the experience">
        <span>EK</span><i />
      </div>

      <div className="ek-stage">
        <video
          key={currentScene.src}
          ref={videoRef}
          className="ek-film"
          src={currentScene.src}
          poster={currentScene.poster}
          muted
          playsInline
          preload="auto"
          autoPlay={!isIdle}
          onLoadedData={handleLoadedData}
          onPlay={() => setPlaying(true)}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onError={handleMediaError}
        />
        {mediaError && <div className="ek-media-fallback" style={{ backgroundImage: `url(${currentScene.poster})` }} aria-label="The scene is shown as a still image because the video could not be loaded" />}
        <audio ref={audioRef} src="/assets/film/site-cinematic-score-v3.wav" preload="auto" loop />
        {sceneIndex === 2 && <div className="ek-spatial-cut" key={`spatial-cut-${sceneIndex}`} aria-hidden="true" />}
        <div className="ek-grade" />
        <div className="ek-grain" />
      </div>

      <header className="ek-header">
        <button className="ek-brand" type="button" onClick={restart} aria-label="Return to the opening scene">
          <span className="ek-monogram">EK</span>
          <span><b>{brandName}</b><small>{brandLine}</small></span>
        </button>

        <nav className="ek-nav" aria-label="Primary navigation">
          <button className="ek-sound" type="button" aria-label={soundEnabled ? copy.soundOn : copy.soundOff} aria-pressed={soundEnabled} onClick={toggleSound}>
            <span className="ek-sound-label">{soundEnabled ? copy.soundOn : copy.soundOff}</span>
            <span className={`ek-sound-meter ${soundEnabled ? 'is-on' : ''}`} aria-hidden="true"><i /><i /><i /></span>
          </button>
          <button className="ek-language" type="button" onClick={() => setLanguage((value) => value === 'en' ? 'fa' : 'en')} aria-label={language === 'en' ? 'نمایش فارسی' : 'Show English'}><b>{language === 'en' ? 'EN' : 'FA'}</b><span>/</span><i>{language === 'en' ? 'FA' : 'EN'}</i></button>
          {menuAvailable && <button ref={menuTriggerRef} className={`ek-menu-trigger ${menuOpen ? 'is-open' : ''}`} type="button" aria-label={copy.menu} aria-expanded={menuOpen} aria-controls="studio-menu" onClick={() => setMenuOpen((value) => !value)}><span>{copy.menu}</span><i aria-hidden="true"><b /><b /></i></button>}
        </nav>
      </header>

      {menuAvailable && (
        <aside ref={menuPanelRef} id="studio-menu" className={`ek-menu-panel ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
          <small>{copy.directory}</small>
          <button type="button" tabIndex={menuOpen ? 0 : -1} onClick={() => openExplore('projects')}><span>01</span>{copy.projects}<i>↗</i></button>
          <button type="button" tabIndex={menuOpen ? 0 : -1} onClick={() => openExplore('services')}><span>02</span>{copy.services}<i>↗</i></button>
          <button type="button" tabIndex={menuOpen ? 0 : -1} onClick={() => openExplore('tutorials')}><span>03</span>{copy.tutorials}<i>↗</i></button>
          <button type="button" tabIndex={menuOpen ? 0 : -1} onClick={() => openExplore('insights')}><span>04</span>{copy.insights}<i>↗</i></button>
          <button type="button" tabIndex={menuOpen ? 0 : -1} onClick={() => openExplore('products')}><span>05</span>{copy.courses}<i>↗</i></button>
          <button type="button" tabIndex={menuOpen ? 0 : -1} onClick={openContact}><span>06</span>{copy.contact}<i>↗</i></button>
        </aside>
      )}

      <main id="main-content" className="ek-content">
        <section className={`ek-story-cards ${cardsVisible ? 'is-visible' : ''}`} key={cardRun} aria-label="Architecture disciplines">
          {storyCards.map((card, index) => (
            <article className={`ek-story-card ek-story-card-${index + 1}`} key={card.title}>
              <span className="ek-story-card-image" style={{ backgroundImage: `url(${card.image})` }} />
              <span className="ek-story-card-copy"><small>{card.index}</small><b>{localised(card, 'title', language)}</b></span>
            </article>
          ))}
        </section>

        {!isIdle && sceneIndex > 0 && (currentStory || currentScene.data) && (
          <aside className="ek-scene-data" key={currentScene.id} aria-label={`${currentScene.title} services`}>
            <small>{currentStory ? localised(currentStory, 'code', language) : currentScene.data.code}</small>
            <strong>{currentStory ? localised(currentStory, 'title', language) : currentScene.data.title}</strong>
            <div>
              {(currentStory ? localisedArray(currentStory, 'lines', language) : currentScene.data.lines).filter(Boolean).map((line, index) => (
                <span key={line} style={{ '--type-delay': `${1.05 + (index * 0.72)}s` }}>{line}</span>
              ))}
            </div>
            {currentStory?.text && <p>{localised(currentStory, 'text', language)}</p>}
          </aside>
        )}

        <div className="ek-story-label" aria-live="polite">
          <small>{isIdle ? copy.idleEyebrow : localised(currentScene, 'eyebrow', language)}</small>
          <b>{isIdle ? copy.idleTitle : localised(currentScene, 'title', language)}</b>
          {sceneIndex <= 0 && <em>{founderRole} · {founderName}</em>}
        </div>

        <button className="ek-story-advance" type="button" onClick={advance} disabled={playing}>
          <span>{advanceLabel}</span><i aria-hidden="true">{isFinal && ended ? '↺' : '→'}</i>
        </button>

        <div className="ek-story-progress" aria-label={`Scene ${progress}`}>{progress}</div>

        <footer className="ek-footer"><span>{brandLocation}</span><span>{copy.concept}</span></footer>
      </main>

      <ExplorePanel open={exploreOpen} onClose={() => setExploreOpen(false)} content={content} initialView={exploreView} language={language} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} brand={content?.brand} language={language} />
    </div>
  );
}
