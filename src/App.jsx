import { useEffect, useState } from 'react';
import CinematicSite from './components/CinematicSite.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import SiteSeo from './components/SiteSeo.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { defaultContent } from './data/defaultContent.js';
import { getContent, subscribeToContent } from './lib/dataAdapter.js';

function currentRoute() {
  return window.location.hash.startsWith('#/admin') ? 'admin' : 'site';
}

export default function App() {
  const [route, setRoute] = useState(currentRoute);
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    const onHashChange = () => setRoute(currentRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    let active = true;
    const load = () => getContent().then((value) => active && setContent(value)).catch(() => undefined);
    load();
    const unsubscribe = subscribeToContent(load);
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return <ErrorBoundary><SiteSeo content={content} />{route === 'admin' ? <AdminPanel initialContent={content} /> : <CinematicSite content={content} />}</ErrorBoundary>;
}
