import { useMemo, useState } from 'react';
import { articles } from '../data/articles.js';
import { magazines } from '../data/magazines.js';

const sectionEntries = [
  { title: 'Projects', detail: 'Architecture and interior projects', target: 'projects', view: 'projects', keywords: 'project portfolio architecture interior facade design work' },
  { title: 'Services', detail: 'Studio services and commissions', target: 'services', view: 'services', keywords: 'service commission architecture interior facade visualization planning' },
  { title: 'Tutorials', detail: 'Architecture learning and tutorials', target: 'tutorials', view: 'tutorials', keywords: 'tutorial training learn course education revit autocad sketchup' },
  { title: 'Magazine', detail: 'Curated architecture issues and editorial dossiers', target: 'journal', view: 'magazines', keywords: 'magazine issue editorial architecture publication climate design' },
  { title: 'Articles', detail: 'Source-grounded long-form architecture reading', target: 'articles', view: 'articles', keywords: 'article articles research sources bim revit climate interoperability' },
  { title: 'BIM Object Library', detail: 'Future free essentials and premium parametric packs', target: 'objects', view: 'library', keywords: 'library object objects revit bim free essentials premium parametric pack family families download material texture' },
  { title: 'Architecture E-Books', detail: 'Coming soon with free previews and future complete editions', target: 'ebooks', view: 'ebooks', keywords: 'ebook ebooks e-book book books architecture edition pdf free preview paid digital publication' },
  { title: 'EYVAN ATLAS', detail: 'Architecture-led city and travel guides', target: 'atlas', view: 'guides', keywords: 'atlas travel city guide dubai turkey qatar egypt hotel restaurant catalog brochure' },
  { title: 'Install App', detail: 'Install World Arch Journal on your phone', target: 'app', keywords: 'app mobile install download android iphone pwa' },
  { title: 'Courses & Shop', detail: 'Digital products and courses', target: 'shop', view: 'products', keywords: 'shop store buy course product download' },
  { title: 'Contact', detail: 'Start a project or contact the studio', action: 'contact', keywords: 'contact email whatsapp telegram instagram hire quote order' },
];

function searchable(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9\s&-]/g, ' ');
}

function contentEntries(content) {
  const groups = [
    ['projects', 'projects', 'projects', 'Project'],
    ['tutorials', 'tutorials', 'tutorials', 'Tutorial'],
    ['guides', 'atlas', 'guides', 'EYVAN ATLAS'],
    ['library', 'objects', 'library', 'Library'],
    ['ebooks', 'ebooks', 'ebooks', 'Architecture E-Book'],
    ['products', 'shop', 'products', 'Shop'],
  ];
  const managedEntries = groups.flatMap(([collection, target, view, kind]) => (content?.[collection] || [])
    .filter((item) => item?.published !== false)
    .map((item) => ({
      title: item.latinTitle || item.title || kind,
      detail: item.excerpt || item.description || item.category || kind,
      target,
      view,
      kind,
      keywords: [item.title, item.latinTitle, item.excerpt, item.description, item.category, item.type, item.meta].join(' '),
    })));
  const articleEntries = articles.filter((article) => article.published).map((article) => ({
    title: article.title,
    detail: article.excerpt,
    target: 'articles',
    view: 'articles',
    kind: 'Article',
    article,
    keywords: [article.title, article.excerpt, article.category, article.tags.join(' ')].join(' '),
  }));
  const magazineEntries = magazines.filter((magazine) => magazine.published).map((magazine) => ({
    title: magazine.title,
    detail: magazine.excerpt,
    target: 'journal',
    view: 'magazines',
    kind: 'Magazine',
    magazine,
    keywords: [magazine.title, magazine.excerpt, magazine.theme, magazine.features.map((feature) => feature.title).join(' ')].join(' '),
  }));
  return [...managedEntries, ...magazineEntries, ...articleEntries];
}

export default function SiteSearch({ content, onNavigate, onOpenArticle, onOpenMagazine, onContact }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const entries = useMemo(() => [...sectionEntries, ...contentEntries(content)], [content]);
  const results = useMemo(() => {
    const terms = searchable(query).split(/\s+/).filter(Boolean);
    if (!terms.length) return sectionEntries.slice(0, 4);
    return entries
      .map((entry) => {
        const title = searchable(entry.title);
        const haystack = searchable(`${entry.title} ${entry.detail} ${entry.keywords}`);
        const score = terms.reduce((total, term) => total + (title.includes(term) ? 8 : haystack.includes(term) ? 3 : 0), 0);
        return { ...entry, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [entries, query]);

  const choose = (entry) => {
    setQuery('');
    setFocused(false);
    if (entry.action === 'contact') onContact();
    else if (entry.magazine) onOpenMagazine(entry.magazine);
    else if (entry.article) onOpenArticle(entry.article);
    else onNavigate(entry.target, entry.view);
  };

  const submit = (event) => {
    event.preventDefault();
    if (results[0]) choose(results[0]);
  };

  return (
    <div className={`ek-site-search ${focused ? 'is-focused' : ''}`}>
      <form role="search" aria-label="Search the World Arch Journal website" onSubmit={submit}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5L21 21" /></svg>
        <label className="screen-reader-text" htmlFor="eyvan-site-search">Search the site</label>
        <input
          id="eyvan-site-search"
          type="search"
          value={query}
          autoComplete="off"
          placeholder="Search articles, projects, BIM objects…"
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => window.setTimeout(() => setFocused(false), 140)}
        />
        <kbd>↵</kbd>
      </form>
      {focused && (
        <div className="ek-site-search-results" role="listbox" aria-label="Search suggestions">
          {results.length ? results.map((entry, index) => (
            <button type="button" role="option" key={`${entry.title}-${index}`} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(entry)}>
              <span><b>{entry.title}</b><small>{entry.detail}</small></span><i>↗</i>
            </button>
          )) : <p>No matching section yet. Try “articles”, “BIM”, “tutorial” or “atlas”.</p>}
        </div>
      )}
    </div>
  );
}

