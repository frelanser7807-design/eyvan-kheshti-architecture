import { useEffect, useState } from 'react';
import CinematicSite from './components/CinematicSite.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import SiteSeo from './components/SiteSeo.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import LegalPage, { legalPageForPath } from './components/LegalPage.jsx';
import ArticleReader from './components/ArticleReader.jsx';
import MagazineReader from './components/MagazineReader.jsx';
import MagazineHub from './components/MagazineHub.jsx';
import ProductPage from './components/ProductPage.jsx';
import CommandCenter from './components/CommandCenter.jsx';
import { defaultContent } from './data/defaultContent.js';
import { articleBySlug } from './data/articles.js';
import { magazineBySlug } from './data/magazines.js';
import { magazineCategoryBySlug } from './data/magazineCategories.js';
import { getContent, subscribeToContent } from './lib/dataAdapter.js';

function currentRoute() {
  const normalizedPath = window.location.pathname.endsWith('/') ? window.location.pathname : `${window.location.pathname}/`;
  const articleMatch = normalizedPath.match(/^\/articles\/([^/]+)\/$/);
  if (articleMatch) return { name: 'article', slug: decodeURIComponent(articleMatch[1]), item: articleBySlug(decodeURIComponent(articleMatch[1])) };
  if (normalizedPath === '/magazine/') return { name: 'magazine-hub' };
  const magazineMatch = normalizedPath.match(/^\/magazine\/([^/]+)\/$/);
  if (magazineMatch) {
    const slug = decodeURIComponent(magazineMatch[1]);
    const issue = magazineBySlug(slug);
    return issue ? { name: 'magazine', slug, item: issue } : { name: 'magazine-category', slug, item: magazineCategoryBySlug(slug) };
  }
  const productMatch = normalizedPath.match(/^\/shop\/([^/]+)\/$/);
  if (productMatch) return { name: 'product', slug: decodeURIComponent(productMatch[1]) };
  if (normalizedPath === '/shop/') return { name: 'shop' };
  if (normalizedPath === '/command-center/') return { name: 'command-center' };
  const legalPage = legalPageForPath(window.location.pathname);
  if (legalPage) return { name: 'legal', page: legalPage };
  const localAdminEnabled = import.meta.env.DEV || import.meta.env.VITE_ENABLE_LOCAL_ADMIN === 'true';
  return window.location.hash.startsWith('#/admin') && localAdminEnabled ? { name: 'admin' } : { name: 'site' };
}

export default function App() {
  const [route, setRoute] = useState(currentRoute);
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    const onRouteChange = () => setRoute(currentRoute());
    window.addEventListener('hashchange', onRouteChange);
    window.addEventListener('popstate', onRouteChange);
    return () => {
      window.removeEventListener('hashchange', onRouteChange);
      window.removeEventListener('popstate', onRouteChange);
    };
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

  const product = route.name === 'product'
    ? (content?.products || []).find((item) => (item.slug || item.id) === route.slug && item.published)
    : null;
  const resolvedRoute = route.name === 'product' ? { ...route, item: product } : route;

  let page = <CinematicSite content={content} />;
  if (route.name === 'admin') page = <AdminPanel initialContent={content} />;
  if (route.name === 'legal') page = <LegalPage page={route.page} />;
  if (route.name === 'article') page = route.item?.published ? <ArticleReader article={route.item} standalone /> : <ProductPage missing />;
  if (route.name === 'magazine') page = route.item?.published ? <MagazineReader magazine={route.item} standalone /> : <ProductPage missing />;
  if (route.name === 'magazine-hub') page = <MagazineHub />;
  if (route.name === 'magazine-category') page = route.item ? <MagazineHub category={route.item} /> : <ProductPage missing />;
  if (route.name === 'shop') page = <ProductPage products={(content?.products || []).filter((item) => item.published)} />;
  if (route.name === 'product') page = <ProductPage product={product} missing={!product} />;
  if (route.name === 'command-center') page = <CommandCenter />;

  return <ErrorBoundary><SiteSeo content={content} route={resolvedRoute} />{page}</ErrorBoundary>;
}
