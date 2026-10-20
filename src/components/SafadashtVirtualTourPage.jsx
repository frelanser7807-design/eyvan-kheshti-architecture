import { useEffect, useRef, useState } from 'react';
import './SafadashtWalkthrough.css';

const stations = [
  {
    id: 'site-entrance',
    title: 'Site Entrance & Main Passage Axis',
    desc: 'Located in Baghestan-e-Kushk, Karaj on a 2,400 sqm plot. The spatial journey begins at the pedestrian entrance along a central axis leading directly toward the void beneath the suspended bridge.',
    area: '2,400 m² (Site)',
    level: 'Ground (0.00)',
    zone: 'Entrance Axis',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85',
    hotspots: [
      { target: 1, label: 'Enter Passage Under Bridge', x: 52, y: 58 },
    ],
    details: [
      { label: 'STRUCTURE', title: 'Structure', text: 'Post-tensioned concrete slabs engineered by Artoup Group to achieve wide spans with minimal slab thickness.', x: 35, y: 42 },
    ],
  },
  {
    id: 'central-void',
    title: 'Central Void; Under the Suspended Bridge',
    desc: "The intersection of the site and building axes ('The Heart'). This open breezeway splits the ground floor into two distinct volumes while providing main entrances on both sides.",
    area: '350 m² (Ground)',
    level: 'Ground (+0.20)',
    zone: 'Central Axis Intersection',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=85',
    hotspots: [
      { target: 2, label: 'Enter West Wing (Public Living)', x: 25, y: 55 },
      { target: 3, label: 'Enter East Wing (Recreation & Spa)', x: 78, y: 55 },
      { target: 5, label: 'Proceed to Pavilion & Pool', x: 50, y: 65 },
    ],
    details: [],
  },
  {
    id: 'west-wing',
    title: 'West Wing; Public Living & Dining',
    desc: 'Spanning 205 sqm, the western ground wing houses the main public living room, dining area, kitchen, cloakroom, powder room, and the primary staircase leading up to the bridge.',
    area: '205 m²',
    level: 'Ground - West Wing',
    zone: 'Public Living Zone',
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1920&q=85',
    hotspots: [
      { target: 4, label: 'Ascend Stairs to 1st Floor Bridge', x: 68, y: 38 },
      { target: 1, label: 'Return to Central Passage', x: 22, y: 62 },
    ],
    details: [
      { label: 'VISUAL CONTINUITY', title: 'Visual Continuity', text: 'Floor-to-ceiling glazing connects the public living area directly to the surrounding orchard.', x: 48, y: 52 },
    ],
  },
  {
    id: 'east-wing',
    title: 'East Wing; Semi-Private Lounge & Jacuzzi',
    desc: 'The 145 sqm eastern wing is dedicated to leisure and semi-private living, featuring a recreation room, indoor jacuzzi, pantry, restroom, and a direct corridor to the eastern staircase.',
    area: '145 m²',
    level: 'Ground - East Wing',
    zone: 'Semi-Private & Wellness',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1920&q=85',
    hotspots: [
      { target: 4, label: 'East Staircase to First Floor', x: 75, y: 40 },
      { target: 1, label: 'Exit to Central Passage', x: 28, y: 60 },
    ],
    details: [],
  },
  {
    id: 'first-floor-bridge',
    title: 'First Floor Bridge; Private Quarters',
    desc: 'Spanning 370 sqm, the elevated bridge connects the eastern and western ground wings. It houses 4 bedrooms, a family TV lounge, cantilevered terraces, and an eastern access stair.',
    area: '370 m²',
    level: 'First Floor (+3.80)',
    zone: 'Private Zone (4 Bedrooms)',
    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1920&q=85',
    hotspots: [
      { target: 5, label: 'Overlook Pavilion & Landscape', x: 45, y: 68 },
      { target: 2, label: 'Descend to West Wing', x: 20, y: 58 },
    ],
    details: [
      { label: 'DETAILING', title: 'Detailing', text: 'Frameless recessed aluminum profile with laminated tempered glass railings (Oxidal) preserving volumetric purity.', x: 62, y: 52 },
    ],
  },
  {
    id: 'pavilion-pool',
    title: 'Axis Culmination; The Pavilion & Garden View',
    desc: 'The main circulation axis terminates at the garden pavilion and pool. Ancillary spaces including the canopy, entrance complex, parking, and caretaker unit total 380 sqm.',
    area: '380 m² (Ancillary)',
    level: 'Garden Level (0.00)',
    zone: 'Pavilion & Landscape',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85',
    hotspots: [
      { target: 1, label: 'Walk Back Toward Main Bridge', x: 50, y: 52 },
      { target: 0, label: 'Return to Site Entrance', x: 25, y: 70 },
    ],
    details: [],
  },
];

const planNodes = [
  { x: 130, y: 122, label: 'Site Entrance' },
  { x: 130, y: 75, label: 'Central Passage' },
  { x: 65, y: 85, label: 'West Wing' },
  { x: 190, y: 85, label: 'East Wing' },
  { x: 130, y: 48, label: 'First Floor Bridge' },
  { x: 130, y: 17, label: 'Pavilion & Pool' },
];

function SchematicPlan({ active, onSelect, large = false }) {
  return (
    <svg className={`sw-plan ${large ? 'sw-plan-large' : ''}`} viewBox="0 0 260 140" role="img" aria-label="Schematic plan of Villa Safadasht with the six walkthrough stations">
      <line className="sw-axis" x1="130" y1="135" x2="130" y2="10" strokeWidth="1.5" />
      <rect x="25" y="45" width="85" height="55" strokeWidth="1.2" />
      <text x="67" y="75" textAnchor="middle">WEST WING (205m²)</text>
      <rect x="150" y="50" width="80" height="45" strokeWidth="1.2" />
      <text x="190" y="75" textAnchor="middle">EAST WING (145m²)</text>
      <rect className="is-bridge" x="45" y="38" width="170" height="22" strokeWidth="1.5" />
      <text x="130" y="52" textAnchor="middle">1ST FLOOR BRIDGE (370m²)</text>
      <rect className="is-pool" x="105" y="8" width="50" height="18" strokeWidth="1" />
      {planNodes.map((node, index) => (
        <circle
          key={node.label}
          className={`sw-node ${index === active ? 'is-active' : ''}`}
          cx={node.x}
          cy={node.y}
          r={large ? 7 : 6}
          onClick={() => onSelect(index)}
        >
          <title>{`Station ${index + 1}: ${node.label}`}</title>
        </circle>
      ))}
    </svg>
  );
}

export default function SafadashtVirtualTourPage() {
  const stageRef = useRef(null);
  const timersRef = useRef([]);
  const selectedRef = useRef(0);
  const [started, setStarted] = useState(false);
  const [selected, setSelected] = useState(0);
  const [walking, setWalking] = useState(null);
  const [walkTarget, setWalkTarget] = useState('');
  const [activeDetail, setActiveDetail] = useState(null);
  const [visited, setVisited] = useState(() => new Set([0]));
  const [planOpen, setPlanOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  const current = stations[selected];
  const progress = selected + 1;

  useEffect(() => () => timersRef.current.forEach(window.clearTimeout), []);

  useEffect(() => {
    stations.forEach((station) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = station.image;
    });
  }, []);

  const goTo = (index) => {
    if (index === selectedRef.current || walking || !stations[index]) return;
    const direction = index > selectedRef.current ? 'forward' : 'backward';
    timersRef.current.forEach(window.clearTimeout);
    setWalking(direction);
    setWalkTarget(stations[index].title);
    setActiveDetail(null);
    const switchTimer = window.setTimeout(() => {
      selectedRef.current = index;
      setSelected(index);
      setVisited((previous) => new Set(previous).add(index));
    }, 620);
    const finishTimer = window.setTimeout(() => {
      setWalking(null);
      setWalkTarget('');
    }, 1350);
    timersRef.current = [switchTimer, finishTimer];
  };

  const walkRoute = (step) => {
    if (!started || walking) return;
    const next = selectedRef.current + step;
    if (next >= stations.length) {
      setCompleted(true);
      return;
    }
    if (next < 0) return;
    goTo(next);
  };

  useEffect(() => {
    if (!started) return undefined;
    const onKey = (event) => {
      if (event.key === 'ArrowRight') walkRoute(1);
      if (event.key === 'ArrowLeft') walkRoute(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const toggleFullscreen = async () => {
    const element = stageRef.current?.closest('.vt-page');
    if (!element) return;
    if (document.fullscreenElement) await document.exitFullscreen();
    else await element.requestFullscreen?.();
  };

  return (
    <main className="vt-page" id="main-content">
      <section className={`vt-stage safadasht-stage ${started ? 'is-started' : 'is-intro'}`} ref={stageRef} aria-label="Villa Safadasht interactive walkthrough">
        <div className="sw-scene" key={current.id} style={{ backgroundImage: `url('${current.image}')` }} aria-hidden="true" />
        <div className="sw-vignette" aria-hidden="true" />
        <div className={`vt-transition ${walking ? 'is-visible is-passage' : ''}`} aria-hidden="true" />
        <div className={`vt-passage ${walking ? 'is-visible' : ''}`} aria-hidden="true"><i /><span>WALKING TO<br /><b>{walkTarget}</b></span></div>

        <header className="vt-topbar">
          <a href="/" className="vt-brand">WORLD ARCH JOURNAL</a>
          <div className="vt-progress" aria-label={`Station ${progress} of ${stations.length}`}>
            <span>{String(progress).padStart(2, '0')}</span>
            <i><b style={{ width: `${(progress / stations.length) * 100}%` }} /></i>
            <span>{String(stations.length).padStart(2, '0')}</span>
          </div>
          <div className="vt-actions">
            <button type="button" data-analytics-event="cta_click" data-analytics-label="safadasht_plans_open" onClick={() => setPlanOpen(true)}>SCHEMATIC PLAN</button>
            <a href="/projects/villa-safadasht/">PROJECT FILE ↗</a>
            <button type="button" onClick={toggleFullscreen}>FULLSCREEN</button>
          </div>
        </header>

        <div className="vt-location" aria-live="polite">
          <small>{current.level} · {current.zone}</small>
          <h1>Villa Safadasht</h1>
          <span>{current.title}</span>
        </div>

        {started && (
          <div className="vt-hotspot-layer">
            {current.hotspots.map((hotspot) => (
              <button
                className="vt-hotspot"
                type="button"
                key={`${current.id}-${hotspot.target}-${hotspot.label}`}
                style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                onClick={() => goTo(hotspot.target)}
              >
                <span className="vt-hotspot-ring"><i /></span>
                <b>{hotspot.label}</b>
              </button>
            ))}
            {current.details.map((detail) => (
              <button
                className="vt-hotspot is-info"
                type="button"
                key={`${current.id}-${detail.label}`}
                style={{ left: `${detail.x}%`, top: `${detail.y}%` }}
                onClick={() => setActiveDetail(detail)}
                aria-label={`Open architecture detail: ${detail.title}`}
              >
                <span className="vt-hotspot-ring"><i>+</i></span>
                <b>{detail.label}</b>
              </button>
            ))}
          </div>
        )}

        {activeDetail && (
          <aside className="vt-detail" aria-live="polite">
            <button type="button" onClick={() => setActiveDetail(null)} aria-label="Close detail">×</button>
            <small>{activeDetail.label} · WHY IT MATTERS</small>
            <h2>{activeDetail.title}</h2>
            <p>{activeDetail.text}</p>
            <span className="vt-detail-focus">STATION DETAIL · VILLA SAFADASHT</span>
          </aside>
        )}

        {started && !activeDetail && (
          <aside className="sw-card" aria-live="polite">
            <small className="sw-card-step">STATION {String(progress).padStart(2, '0')} / {String(stations.length).padStart(2, '0')}</small>
            <h2>{current.title}</h2>
            <p>{current.desc}</p>
            <div className="sw-specs">
              <div><span>SPACE AREA</span><strong>{current.area}</strong></div>
              <div><span>LEVEL</span><strong>{current.level}</strong></div>
              <div><span>SPATIAL ZONE</span><strong>{current.zone}</strong></div>
            </div>
          </aside>
        )}

        {started && (
          <aside className="sw-minimap" aria-label="Schematic plan and your position">
            <div className="sw-minimap-header"><span>SCHEMATIC PLAN &amp; POSITION</span><span>N ↑</span></div>
            <SchematicPlan active={selected} onSelect={goTo} />
          </aside>
        )}

        {planOpen && (
          <section className="vt-diagram" aria-labelledby="safadasht-plan-title">
            <button type="button" className="vt-diagram-close" onClick={() => setPlanOpen(false)} aria-label="Close schematic plan">×</button>
            <header>
              <small>SPACE ↔ PLAN</small>
              <h2 id="safadasht-plan-title">Read the villa along its axis.</h2>
              <p>This schematic plan is an editorial diagram of the walkthrough route — not a measured construction drawing. Select a node or a station to jump along the axis.</p>
            </header>
            <div className="vt-diagram-drawings">
              <article>
                <small>SCHEMATIC PLAN</small>
                <SchematicPlan active={selected} onSelect={(index) => { setPlanOpen(false); goTo(index); }} large />
                <p className="sw-plan-note">Two ground-floor wings — public west (205 m²) and semi-private east (145 m²) — are joined by the first-floor bridge (370 m²) above the central passage.</p>
              </article>
              <article>
                <small>SPATIAL ROUTE</small>
                <ol>
                  {stations.map((station, index) => (
                    <li key={station.id} className={index === selected ? 'is-active' : visited.has(index) ? 'is-visited' : ''}>
                      <button type="button" onClick={() => { setPlanOpen(false); goTo(index); }}>
                        <span>{String(index + 1).padStart(2, '0')}</span><b>{station.title}</b><small>{station.level}</small>
                      </button>
                    </li>
                  ))}
                </ol>
              </article>
            </div>
          </section>
        )}

        <nav className="vt-scene-rail" aria-label="Walkthrough stations">
          {stations.map((station, index) => (
            <button type="button" key={station.id} className={index === selected ? 'is-active' : ''} onClick={() => goTo(index)}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <b>{station.title}</b>
              <small>{station.level}</small>
            </button>
          ))}
        </nav>

        <div className="vt-walk-controls" aria-label="Move between walkthrough stations">
          <button type="button" onClick={() => walkRoute(-1)} disabled={selected === 0 || Boolean(walking)} aria-label="Previous station"><span>←</span><small>PREVIOUS</small></button>
          <button type="button" className="is-forward" onClick={() => walkRoute(1)} disabled={Boolean(walking)}><span>→</span><small>{selected === stations.length - 1 ? 'FINISH' : 'NEXT STATION'}</small></button>
        </div>

        <div className="vt-help">SELECT A MARKER TO MOVE · FOLLOW THE SIX STATIONS ALONG THE AXIS</div>

        {!started && (
          <section className="vt-intro" aria-labelledby="safadasht-intro-title">
            <small>AN INTERACTIVE ARCHITECTURE WALKTHROUGH</small>
            <h1 id="safadasht-intro-title">Villa Safadasht</h1>
            <p>Follow one garden axis through six stations: beneath a suspended first-floor bridge, into the public west wing and the semi-private east wing, and out to the pavilion and pool. A World Arch Journal project study of the Memar Award-winning villa by Kamran Heirati Architects.</p>
            <button type="button" data-analytics-event="cta_click" data-analytics-label="safadasht_tour_start" onClick={() => setStarted(true)}>ENTER THE VILLA <span>↗</span></button>
            <footer>
              <span>Baghestan-e-Kushk, Karaj · 2016</span>
              <span>Kamran Heirati Architects · 1st Place Memar Award 2016</span>
            </footer>
          </section>
        )}

        {completed && (
          <section className="vt-complete" aria-labelledby="safadasht-complete-title">
            <button type="button" className="vt-complete-close" onClick={() => setCompleted(false)} aria-label="Close summary">×</button>
            <small>WALKTHROUGH COMPLETE</small>
            <h2 id="safadasht-complete-title">You walked the Safadasht axis.</h2>
            <p>You visited {visited.size} of {stations.length} stations, from the site entrance to the pavilion at the end of the garden axis.</p>
            <div>
              <button type="button" onClick={() => { setCompleted(false); goTo(0); }}>RESTART THE WALKTHROUGH</button>
              <a href="/projects/villa-safadasht/">READ THE PROJECT FILE</a>
              <a href="/magazine/">EXPLORE ARCHITECTURE ARTICLES</a>
            </div>
          </section>
        )}
      </section>

      <section className="vt-credits">
        <small>ABOUT THIS EXPERIENCE</small>
        <h2>A spatial reading, not a measured survey.</h2>
        <p>This walkthrough is a World Arch Journal project study developed from the published project description of Villa Safadasht. The route, station texts and schematic plan interpret the villa's organisation for architectural learning; station imagery currently uses editorial placeholder photography while licensed project photographs are prepared, and the experience must not be used as construction documentation.</p>
        <dl>
          <div><dt>Architecture</dt><dd>Kamran Heirati Architects</dd></div>
          <div><dt>Project</dt><dd>Villa Safadasht</dd></div>
          <div><dt>Location</dt><dd>Baghestan-e-Kushk, Karaj</dd></div>
          <div><dt>Award</dt><dd>1st Place, Memar Award 2016</dd></div>
          <div><dt>Reference archive</dt><dd><a href="https://architizer.com/projects/villa-safadasht/" target="_blank" rel="noopener noreferrer">Architizer project archive ↗</a></dd></div>
        </dl>
        <a className="vt-return" href="/projects/villa-safadasht/">Open the complete project file</a>
      </section>
    </main>
  );
}
