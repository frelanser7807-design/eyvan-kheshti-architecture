import { useEffect, useRef } from 'react';
import './DesignCategoriesDemo.css';
import { designCategories, designCategoriesHero } from '../data/designCategories.js';

export default function DesignCategoriesDemo() {
  const gridRef = useRef(null);

  useEffect(() => {
    const root = gridRef.current;
    if (!root) return undefined;
    const cards = root.querySelectorAll('.dcd-card');
    if (!('IntersectionObserver' in window)) {
      cards.forEach((card) => card.classList.add('dcd-inview'));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('dcd-inview');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="dcd-page">
      <header className="dcd-nav">
        <a href="/">WORLD ARCH JOURNAL</a>
        <nav>
          <a href="/services/">Design services</a>
          <a href="/projects/">Selected work</a>
        </nav>
      </header>

      <section className="dcd-hero">
        <img className="dcd-hero-img" src={designCategoriesHero.image} alt={designCategoriesHero.alt} />
        <div className="dcd-hero-shade" aria-hidden="true" />
        <div className="dcd-hero-inner">
          <p className="dcd-eyebrow">DESIGN SERVICES · WORLD ARCH JOURNAL</p>
          <h1>Your Space. Your Style. <em>Professionally Designed.</em></h1>
          <p className="dcd-sub">From a single room to an entire home. Choose your space, select your design package, and bring your vision to life.</p>
          <a className="dcd-cta" href="#spaces">Explore Design Services <span aria-hidden="true">↓</span></a>
          <p className="dcd-credit">
            <a href={designCategoriesHero.creditUrl} target="_blank" rel="noreferrer">{designCategoriesHero.credit}</a>
          </p>
        </div>
      </section>

      <section id="spaces" className="dcd-grid-wrap">
        <div className="dcd-grid" ref={gridRef}>
          {designCategories.map((category, index) => (
            <article className="dcd-card" key={category.slug} id={`card-${category.slug}`} style={{ '--dcd-delay': `${(index % 4) * 70}ms` }}>
              <img className="dcd-card-img" src={category.image} alt={category.alt} loading="lazy" />
              <div className="dcd-card-shade" aria-hidden="true" />
              <div className="dcd-card-body">
                <small>{String(index + 1).padStart(2, '0')} · DESIGN CATEGORY</small>
                <h2>{category.name}</h2>
                <a className="dcd-btn" href={`#card-${category.slug}`}>View Projects <span aria-hidden="true">→</span></a>
                <p className="dcd-credit">
                  <a href={category.creditUrl} target="_blank" rel="noreferrer">{category.credit}</a>
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="dcd-footer">
        <a href="/services/">All design services</a>
        <a href="/">Return to World Arch Journal</a>
      </footer>
    </main>
  );
}
