import { useEffect, useMemo, useRef, useState } from 'react';
import ContactModal from './ContactModal.jsx';
import ExplorePanel from './ExplorePanel.jsx';
import EditorialSections from './EditorialSections.jsx';
import SiteSearch from './SiteSearch.jsx';
import ArticleReader from './ArticleReader.jsx';
import MagazineReader from './MagazineReader.jsx';
import { assetUrl } from '../lib/assetUrl.js';

const OPENING_PLAYBACK_RATE = 1.2;
const JOURNEY_PLAYBACK_RATE = 1.35;
const PRESENTATION_PLAYBACK_RATE = 1.05;
const OPENING_CARD_REVEAL_LEAD = 1.45;

const storyCards = [
  {
    index: '01',
    title: 'Technical Plan',
    titleFa: 'پلان فنی',
    subtitle: 'Planning · Circulation · Detail',
    subtitleFa: 'برنامه‌ریزی · سیرکولاسیون · جزئیات',
    image: assetUrl('/assets/cards/eyvan-residence/plan-card-v1.webp'),
  },
  {
    index: '02',
    title: 'Facade Design',
    titleFa: 'طراحی نما',
    subtitle: 'Envelope · Material · Detailing',
    subtitleFa: 'پوسته · متریال · دیتیل',
    image: assetUrl('/assets/cards/eyvan-residence/facade-card-v1.webp'),
  },
  {
    index: '03',
    title: 'Interior Design',
    titleFa: 'طراحی داخلی',
    subtitle: 'Space · Light · Material',
    subtitleFa: 'فضا · نور · متریال',
    image: assetUrl('/assets/cards/eyvan-residence/interior-card-v1.webp'),
  },
  {
    index: '04',
    title: 'Landscape Design',
    titleFa: 'طراحی لندسکیپ',
    subtitle: 'Site · Planting · Water',
    subtitleFa: 'سایت · کاشت · آب',
    image: assetUrl('/assets/cards/eyvan-residence/landscape-card-v1.webp'),
  },
];

const scenes = [
  {
    id: 'brand-introduction',
    title: 'Digital Introduction',
    titleFa: 'معرفی دیجیتال',
    eyebrow: 'WORLD ARCH JOURNAL',
    eyebrowFa: 'بنیان‌گذار',
    src: assetUrl('/assets/brand/world-arch-journal-intro.mp4'),
    poster: assetUrl('/assets/brand/world-arch-wa-mark-v1.png'),
    playbackRate: OPENING_PLAYBACK_RATE,
    audioCue: 0,
  },
  {
    id: 'arrival',
    title: 'Arrival',
    titleFa: 'ورود',
    eyebrow: 'INTERNATIONAL STUDIO',
    eyebrowFa: 'استودیوی بین‌المللی',
    src: assetUrl('/assets/film/lobby-to-studio-clean.mp4'),
    poster: assetUrl('/assets/brand/world-arch-wa-mark-v1.png'),
    playbackRate: OPENING_PLAYBACK_RATE,
    audioCue: 4.9,
    data: {
      code: '01 / STUDIO IDENTITY',
      title: 'World Arch Journal',
      lines: ['Creative Direction', 'Architecture · Interiors'],
    },
  },
  {
    id: 'works',
    title: 'Selected Works',
    titleFa: 'آثار منتخب',
    eyebrow: 'ARCHITECTURE',
    eyebrowFa: 'معماری',
    src: assetUrl('/assets/film/chapters/05-presentation-room-clean.mp4'),
    poster: assetUrl('/assets/candidates/office-world/scene-05-client-presentation-room-v1.png'),
    playbackRate: PRESENTATION_PLAYBACK_RATE,
    audioCue: 14.86,
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
    src: assetUrl('/assets/film/chapters/06-material-lab.mp4'),
    poster: assetUrl('/assets/candidates/office-world/scene-06-material-model-lab-v1.png'),
    playbackRate: JOURNEY_PLAYBACK_RATE,
    audioCue: 17.92,
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
    src: assetUrl('/assets/film/chapters/07-design-desk.mp4'),
    poster: assetUrl('/assets/candidates/office-world/scene-07-principal-design-desk-v3.png'),
    playbackRate: JOURNEY_PLAYBACK_RATE,
    audioCue: 22.24,
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
    projects: 'Projects', services: 'Services', tutorials: 'Tutorials', articles: 'Articles', insights: 'Magazine', prompts: 'AI Prompt Library', library: 'BIM Object Library', atlas: 'WORLD ARCH ATLAS', courses: 'Courses & Shop', shop: 'Shop', contact: 'Contact',
    idleEyebrow: 'INTERACTIVE ARCHITECTURE EXPERIENCE', idleTitle: 'A Studio Built Around Ideas',
    begin: 'Click to Begin', playing: 'Now Playing', continue: 'Click to Continue', explore: 'Explore the Studio',
    whatWeDo: 'WHAT WE DO', concept: 'CONCEPT EXPERIENCE · 2026',
  },
  fa: {
    soundOn: 'صدا روشن', soundOff: 'صدا خاموش', menu: 'منو', directory: 'فهرست استودیو',
    projects: 'پروژه‌ها', services: 'خدمات', tutorials: 'آموزش‌ها', articles: 'مقاله‌ها', insights: 'مجله معماری', prompts: 'کتابخانهٔ پرامپ AI', library: 'کتابخانهٔ BIM', atlas: 'اطلس معماری جهانی', courses: 'دوره‌ها و فروشگاه', shop: 'فروشگاه', contact: 'ارتباط با ما',
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

function QuickIcon({ name }) {
  const paths = {
    projects: <><rect x="3" y="4" width="18" height="16" rx="1" /><path d="M7 16l4-5 3 3 2-2 3 4" /></>,
    services: <><path d="M4 20V8l8-4 8 4v12" /><path d="M8 20v-7h8v7M8 9h.01M12 9h.01M16 9h.01" /></>,
    tutorials: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M10 9l5 3-5 3V9z" /></>,
    articles: <><path d="M6 3h10l3 3v15H6z" /><path d="M15 3v4h4M9 11h7M9 15h7M9 18h5" /></>,
    journal: <><path d="M5 4h12a2 2 0 012 2v14H7a2 2 0 01-2-2V4z" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
    prompts: <><path d="M4 6h16v12H4z" /><path d="M7 10h7M7 14h5M17 9v6" /></>,
    library: <><path d="M4 5h5v14H4zM10 5h5v14h-5zM16 7l4-1 2 13-4 1z" /></>,
    atlas: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" /></>,
    app: <><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M10 5h4M11 18h2" /></>,
    shop: <><path d="M5 8h14l-1 13H6L5 8zM9 10V6a3 3 0 016 0v4" /></>,
    contact: <><path d="M4 5h16v14H4z" /><path d="M4 7l8 6 8-6" /></>,
    more: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
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
  const [activeArticle, setActiveArticle] = useState(null);
  const [activeMagazine, setActiveMagazine] = useState(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const language = 'en';
  const [soundEnabled, setSoundEnabled] = useState(false);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const moreRef = useRef(null);

  const currentScene = scenes[Math.max(sceneIndex, 0)];
  const copy = interfaceCopy[language] || interfaceCopy.en;
  const currentStory = sceneIndex > 0 ? content?.story?.find((item) => item.id === currentScene.id) : null;
  const brandName = localised(content?.brand, 'name', language) || 'WORLD ARCH JOURNAL';
  const brandLine = localised(content?.brand, 'latinName', language) || 'ARCHITECTURE MEDIA & DESIGN';
  const brandLocation = localised(content?.brand, 'city', language) || 'LONDON / INTERNATIONAL';
  const isIdle = sceneIndex < 0;
  const isFinal = sceneIndex === scenes.length - 1;
  const progress = `${String(Math.max(sceneIndex + 1, 0)).padStart(2, '0')} / ${String(scenes.length).padStart(2, '0')}`;

  const advanceLabel = useMemo(() => {
    if (isIdle) return copy.begin;
    if (playing) return copy.playing;
    if (isFinal && ended) return copy.explore;
    return copy.continue;
  }, [copy, ended, isFinal, isIdle, playing]);

  useEffect(() => {
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
  }, [language]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = 0.36;
    if (!soundEnabled) audioRef.current?.pause?.();
  }, [soundEnabled]);

  useEffect(() => {
    if (!moreOpen) return undefined;
    const closeOnKey = (event) => event.key === 'Escape' && setMoreOpen(false);
    const closeOnOutside = (event) => !moreRef.current?.contains(event.target) && setMoreOpen(false);
    window.addEventListener('keydown', closeOnKey);
    window.addEventListener('pointerdown', closeOnOutside);
    return () => {
      window.removeEventListener('keydown', closeOnKey);
      window.removeEventListener('pointerdown', closeOnOutside);
    };
  }, [moreOpen]);

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

  const advance = () => {
    if (playing) return;
    if (!isIdle && !ended) {
      playSoundtrackForScene(sceneIndex, videoRef.current?.currentTime || 0);
      videoRef.current?.play()?.catch(() => setPlaying(false));
      return;
    }
    if (isFinal && ended) {
      setExploreOpen(true);
      return;
    }
    if (isIdle) {
      playSoundtrackForScene(0);
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
    setActiveArticle(null);
    setActiveMagazine(null);
    setMoreOpen(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const openExplore = (view) => {
    setExploreView(view);
    setExploreOpen(true);
    setMoreOpen(false);
  };

  const openContact = () => {
    setContactOpen(true);
    setMoreOpen(false);
  };

  const openArticle = (article) => {
    setExploreOpen(false);
    setActiveMagazine(null);
    setActiveArticle(null);
    setMoreOpen(false);
    if (article?.slug) window.location.assign(`/articles/${article.slug}/`);
  };

  const openMagazine = (magazine) => {
    setExploreOpen(false);
    setActiveArticle(null);
    setActiveMagazine(null);
    setMoreOpen(false);
    if (magazine?.slug) window.location.assign(`/magazine/${magazine.slug}/`);
  };

  const scrollToSection = (id) => {
    setMoreOpen(false);
    window.requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const navigateFromSearch = (target, view) => {
    if (view) openExplore(view);
    else scrollToSection(target);
  };

  const playSoundtrackForScene = (index, videoTime = 0, enabled = soundEnabled) => {
    const audio = audioRef.current;
    const scene = scenes[index];
    if (!audio || !scene) return;

    audio.pause();
    const cue = scene.audioCue + (videoTime / scene.playbackRate);
    const safeCue = Number.isFinite(audio.duration)
      ? Math.min(cue, Math.max(0, audio.duration - 0.08))
      : cue;
    try {
      audio.currentTime = safeCue;
    } catch {
      audio.currentTime = scene.audioCue;
    }
    if (enabled) audio.play().catch(() => undefined);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (!audioRef.current) return;
    if (next && playing && sceneIndex >= 0) {
      playSoundtrackForScene(sceneIndex, videoRef.current?.currentTime || 0, true);
    }
    else audioRef.current.pause();
  };

  const handleVideoPlay = (event) => {
    setPlaying(true);
    if (sceneIndex >= 0 && soundEnabled && audioRef.current?.paused) {
      playSoundtrackForScene(sceneIndex, event.currentTarget.currentTime);
    }
  };

  const handleTimeUpdate = (event) => {
    const revealAt = Math.max(0, (event.currentTarget.duration || 0) - OPENING_CARD_REVEAL_LEAD);
    if (sceneIndex === 0 && revealAt > 0 && event.currentTarget.currentTime >= revealAt && !cardsVisible) {
      setCardsVisible(true);
    }
  };

  const handleEnded = () => {
    audioRef.current?.pause?.();
    setPlaying(false);
    setEnded(true);
    if (sceneIndex === 0) setCardsVisible(true);

    // One deliberate visitor click starts the complete cinematic journey.
    // Each finished chapter advances to the next one automatically; the
    // editorial page remains available only after the final chapter.
    if (sceneIndex < scenes.length - 1) {
      setSceneIndex((value) => value + 1);
    }
  };

  const handleLoadedData = (event) => {
    event.currentTarget.playbackRate = currentScene.playbackRate;
    setLoaded(true);
  };

  const handleMediaError = () => {
    audioRef.current?.pause?.();
    setMediaError(true);
    setPlaying(false);
    setEnded(true);
  };

  return (
    <div className={`ek-site ek-story ${loaded ? 'is-ready' : 'is-loading'} ${playing ? 'is-playing' : 'is-paused'} ${isIdle ? 'is-idle' : 'is-started'}`}>
      <div className="ek-cinematic-shell">
      <div className="ek-loader" role="status" aria-label="Preparing the experience">
        <img src={assetUrl('/assets/brand/world-arch-wa-mark-v1.png')} alt="" /><i />
      </div>

      <div className="ek-stage">
        <video
          key={currentScene.src}
          ref={videoRef}
          className={`ek-film ${currentScene.id === 'brand-introduction' ? 'ek-brand-intro-film' : ''}`}
          src={currentScene.src}
          poster={isIdle ? currentScene.poster : undefined}
          muted
          playsInline
          preload={isIdle ? 'none' : 'metadata'}
          autoPlay={!isIdle}
          onLoadedData={handleLoadedData}
          onPlay={handleVideoPlay}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onError={handleMediaError}
        />
        {mediaError && <div className="ek-media-fallback" style={{ backgroundImage: `url(${currentScene.poster})` }} aria-label="The scene is shown as a still image because the video could not be loaded" />}
        <audio ref={audioRef} src={assetUrl('/assets/film/site-cinematic-score-v3.wav?v=mobile-performance-v1')} preload="none" />
        <div className="ek-grade" />
        <div className="ek-grain" />
      </div>

      <header className="ek-header">
        <button className="ek-brand" type="button" onClick={restart} aria-label="Return to the opening scene">
          <span className="ek-monogram"><img src={assetUrl('/assets/brand/world-arch-wa-mark-v1.png')} alt="" /></span>
          <span><b>{brandName}</b><small>{brandLine}</small></span>
        </button>

        <nav className="ek-nav" aria-label="Primary navigation">
          <a className="ek-material-nav" href="/materials/">Materials</a>
          <button className="ek-language is-disabled" type="button" disabled aria-disabled="true" title="Persian edition coming soon">
            <b>EN</b><span>/</span><i>FA SOON</i>
          </button>
          <button className="ek-sound" type="button" aria-label={soundEnabled ? copy.soundOn : copy.soundOff} aria-pressed={soundEnabled} onClick={toggleSound}>
            <span className="ek-sound-label">{soundEnabled ? copy.soundOn : copy.soundOff}</span>
            <span className={`ek-sound-meter ${soundEnabled ? 'is-on' : ''}`} aria-hidden="true"><i /><i /><i /></span>
          </button>
        </nav>
      </header>

      <nav className={`ek-quick-links ${sceneIndex > 0 ? 'is-visible' : ''}`} aria-label="Quick access">
        <button type="button" data-analytics-event="cta_click" data-analytics-label="material-library" onClick={() => window.location.assign('/materials/')}><QuickIcon name="library" /><span>Material library</span></button>
        <button type="button" data-analytics-event="cta_click" data-analytics-label="projects" onClick={() => window.location.assign('/projects/')}><QuickIcon name="projects" /><span>{copy.projects}</span></button>
        <button type="button" onClick={() => scrollToSection('services')}><QuickIcon name="services" /><span>{copy.services}</span></button>
        <button type="button" onClick={() => scrollToSection('tutorials')}><QuickIcon name="tutorials" /><span>{copy.tutorials}</span></button>
        <button type="button" onClick={() => scrollToSection('journal')}><QuickIcon name="journal" /><span>{copy.insights}</span></button>
        <button type="button" onClick={() => scrollToSection('atlas')}><QuickIcon name="atlas" /><span>{copy.atlas}</span></button>
        <button type="button" data-analytics-event="cta_click" data-analytics-label="contact" onClick={openContact}><QuickIcon name="contact" /><span>{copy.contact}</span></button>
        <span className="ek-more-wrap" ref={moreRef}>
          <button className="ek-more-trigger" type="button" aria-expanded={moreOpen} aria-controls="ek-secondary-menu" onClick={() => setMoreOpen((value) => !value)}><QuickIcon name="more" /><span>More</span></button>
          <aside id="ek-secondary-menu" className={`ek-secondary-menu ${moreOpen ? 'is-open' : ''}`} aria-hidden={!moreOpen}>
            <button type="button" tabIndex={moreOpen ? 0 : -1} onClick={() => window.location.assign('/prompts/')}><QuickIcon name="prompts" /><span>{copy.prompts}</span></button>
            <button type="button" tabIndex={moreOpen ? 0 : -1} onClick={() => scrollToSection('objects')}><QuickIcon name="library" /><span>{copy.library}</span></button>
            <button type="button" tabIndex={moreOpen ? 0 : -1} onClick={() => scrollToSection('app')}><QuickIcon name="app" /><span>Install App</span></button>
            <button type="button" tabIndex={moreOpen ? 0 : -1} onClick={() => scrollToSection('shop')}><QuickIcon name="shop" /><span>Courses &amp; Shop</span></button>
            <a tabIndex={moreOpen ? 0 : -1} href="/atlas/">World Arch Atlas</a>
            <a tabIndex={moreOpen ? 0 : -1} href="/about/">About</a>
            <a tabIndex={moreOpen ? 0 : -1} href="/editorial-policy/">Editorial Policy</a>
            <a tabIndex={moreOpen ? 0 : -1} href="/privacy/">Privacy &amp; Cookies</a>
          </aside>
        </span>
      </nav>

      {sceneIndex <= 0 && <SiteSearch content={content} onNavigate={navigateFromSearch} onOpenArticle={openArticle} onOpenMagazine={openMagazine} onContact={openContact} />}

      <main id="main-content" className="ek-content">
        <section className={`ek-story-cards ${cardsVisible ? 'is-visible' : ''}`} key={cardRun} aria-label="Architecture disciplines">
          {storyCards.map((card, index) => (
            <article className={`ek-story-card ek-story-card-${index + 1}`} key={card.title}>
              <span className="ek-story-card-image" style={{ backgroundImage: `url(${card.image})` }} />
              <span className="ek-story-card-copy">
                <small>{card.index}</small>
                <span>
                  <b>{localised(card, 'title', language)}</b>
                  <em>{localised(card, 'subtitle', language)}</em>
                </span>
              </span>
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
          {sceneIndex <= 0 && <em>{brandLine}</em>}
        </div>

        {sceneIndex <= 0 && (
          <aside className="ek-featured-project-entry" aria-label="Featured virtual tour">
            <a href="/virtual-tours/narbon-villa/">
              <small>NEW · 360° VIRTUAL TOUR</small>
              <strong>Narbon Villa</strong>
              <span>ENTER THE PROJECT <b>↗</b></span>
            </a>
            <a className="ek-featured-project-archive" href="/projects/">VIEW ALL PROJECTS</a>
          </aside>
        )}

        <button className="ek-story-advance" type="button" onClick={advance} disabled={playing}>
          <span>{advanceLabel}</span><i aria-hidden="true">{isFinal && ended ? '↺' : '→'}</i>
        </button>

        <div className="ek-story-progress" aria-label={`Scene ${progress}`}>{progress}</div>

        <footer className="ek-footer"><span>{brandLocation}</span><span><a href="/atlas/">World Arch Atlas · City guides</a></span><span>{copy.concept}</span></footer>
      </main>
      </div>

      <EditorialSections content={content} language={language} onExplore={openExplore} onOpenArticle={openArticle} onOpenMagazine={openMagazine} onContact={openContact} />
      <ExplorePanel open={exploreOpen} onClose={() => setExploreOpen(false)} content={content} initialView={exploreView} language={language} onOpenArticle={openArticle} onOpenMagazine={openMagazine} />
      <MagazineReader magazine={activeMagazine} onClose={() => setActiveMagazine(null)} onOpenArticle={openArticle} />
      <ArticleReader article={activeArticle} onClose={() => setActiveArticle(null)} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} brand={content?.brand} language={language} />
    </div>
  );
}

