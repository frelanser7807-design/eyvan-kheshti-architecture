import { lazy, Suspense, useEffect, useState } from 'react';
import CinematicSite from './components/CinematicSite.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import SiteSeo from './components/SiteSeo.jsx';
import MaterialCollections from './components/MaterialCollections.jsx';
import MaterialLibraryPage from './components/MaterialLibraryPage.jsx';
import { materialBySlug } from './data/materialLibrary.js';
import { collectionRoute, collectionProducts } from './data/materialCollections.js';
const MaterialStudioPage = lazy(() => import('./components/FlutedMaterialPilot.jsx'));
const TravertinePanel = lazy(() => import('./components/TravertinePanel.jsx'));
import ErrorBoundary from './components/ErrorBoundary.jsx';
import LegalPage, { legalPageForPath } from './components/LegalPage.jsx';
import ArticleReader from './components/ArticleReader.jsx';
import MagazineReader from './components/MagazineReader.jsx';
import MagazineHub from './components/MagazineHub.jsx';
import ProductPage from './components/ProductPage.jsx';
import CommandCenter from './components/CommandCenter.jsx';
import PromptLibrary from './components/PromptLibrary.jsx';
import PromptDetail from './components/PromptDetail.jsx';
import NewsletterPage from './components/NewsletterPage.jsx';
import AnalyticsConsent from './components/AnalyticsConsent.jsx';
import CustomPlanDesignPage from './components/CustomPlanDesignPage.jsx';
import ProjectsHub from './components/ProjectsHub.jsx';
import ContactPage from './components/ContactPage.jsx';
import AboutPage from './components/AboutPage.jsx';
import ProjectDetail from './components/ProjectDetail.jsx';
import VideoLibrary from './components/VideoLibrary.jsx';
import DesignServicesPage from './components/DesignServicesPage.jsx';
import AtlasVillaCaseStudy from './components/AtlasVillaCaseStudy.jsx';
import { defaultContent } from './data/defaultContent.js';
import { articleBySlug } from './data/articles.js';
import { magazineBySlug } from './data/magazines.js';
import { magazineCategoryBySlug } from './data/magazineCategories.js';
import { promptById } from './data/promptLibrary.js';
import { newsletterIssues, editorialArticles } from './data/newsletters.js';
import { getContent, subscribeToContent } from './lib/dataAdapter.js';
import { projectBySlug } from './data/projects.js';
import { videoStoryBySlug } from './data/videoStories.js';

const VirtualTourPage = lazy(() => import('./components/VirtualTourPage.jsx'));
const NarbonVirtualTourPage = lazy(() => import('./components/NarbonVirtualTourPage.jsx'));
const SafadashtVirtualTourPage = lazy(() => import('./components/SafadashtVirtualTourPage.jsx'));

function currentRoute() {
  const normalizedPath = window.location.pathname.endsWith('/') ? window.location.pathname : `${window.location.pathname}/`;
  const articleMatch = normalizedPath.match(/^\/articles\/([^/]+)\/$/);
  if (articleMatch) return { name: 'article', slug: decodeURIComponent(articleMatch[1]), item: articleBySlug(decodeURIComponent(articleMatch[1])) };
  if (normalizedPath === '/magazine/') return { name: 'magazine-hub' };
  if (normalizedPath === '/videos/') return { name: 'video-library' };
  const videoMatch = normalizedPath.match(/^\/videos\/([^/]+)\/$/);
  if (videoMatch) return { name: 'video-story', slug: decodeURIComponent(videoMatch[1]), item: videoStoryBySlug(decodeURIComponent(videoMatch[1])) };
  if (normalizedPath === '/newsletter/') return { name: 'newsletter-hub' };
  if (normalizedPath === '/magazine/analysis/') return { name: 'analysis-hub' };
  const analysisMatch = normalizedPath.match(/^\/magazine\/analysis\/([^/]+)\/$/);
  if (analysisMatch) return { name: 'analysis-article', item: editorialArticles.find((issue) => issue.slug === decodeURIComponent(analysisMatch[1])) };
  const newsletterMatch = normalizedPath.match(/^\/newsletter\/([^/]+)\/$/);
  if (newsletterMatch) return { name: 'newsletter-issue', item: newsletterIssues.find((issue) => issue.slug === decodeURIComponent(newsletterMatch[1])) };
  const magazineMatch = normalizedPath.match(/^\/magazine\/([^/]+)\/$/);
  if (magazineMatch) {
    const slug = decodeURIComponent(magazineMatch[1]);
    const issue = magazineBySlug(slug);
    return issue ? { name: 'magazine', slug, item: issue } : { name: 'magazine-category', slug, item: magazineCategoryBySlug(slug) };
  }
  if (normalizedPath === '/shop/presentations/') return { name: 'presentation-studio' };
  if (normalizedPath === '/contact/') return { name: 'contact' };
  if (normalizedPath === '/about/') return { name: 'about' };
  if (normalizedPath === '/materials/stone/natural-stone/travertine/') return { name: 'travertine-studio' };
  if (normalizedPath === '/material-studio/' || normalizedPath === collectionProducts[0].path) return { name: 'material-studio' };
  if (normalizedPath === '/materials/') return { name: 'material-library' };
  if (normalizedPath === '/materials/samples/') return { name: 'material-samples' };
  const materialCollection = collectionRoute(normalizedPath);
  if (materialCollection) return materialCollection;
  const materialMatch = normalizedPath.match(/^\/materials\/([^/]+)\/$/);
  if (materialMatch) return { name: 'material-product', item: materialBySlug(decodeURIComponent(materialMatch[1])) };
  if (normalizedPath === '/services/') return { name: 'design-services' };
  if (normalizedPath === '/services/custom-plan-design/') return { name: 'custom-plan-design' };
  if (normalizedPath === '/projects/') return { name: 'projects-hub' };
  if (normalizedPath === '/projects/atlas-villa/') return { name: 'atlas-villa' };
  const projectMatch = normalizedPath.match(/^\/projects\/([^/]+)\/$/);
  if (projectMatch) return { name: 'project', slug: decodeURIComponent(projectMatch[1]), item: projectBySlug(decodeURIComponent(projectMatch[1])) };
  if (normalizedPath === '/virtual-tours/the-voids-villa/') return { name: 'virtual-tour-the-voids', item: projectBySlug('the-voids-villa') };
  if (normalizedPath === '/virtual-tours/narbon-villa/') return { name: 'virtual-tour-narbon', item: projectBySlug('narbon-villa') };
  if (normalizedPath === '/virtual-tours/villa-safadasht/') return { name: 'virtual-tour-safadasht', item: projectBySlug('villa-safadasht') };
  const productMatch = normalizedPath.match(/^\/shop\/([^/]+)\/$/);
  if (productMatch) return { name: 'product', slug: decodeURIComponent(productMatch[1]) };
  if (normalizedPath === '/shop/') return { name: 'shop' };
  if (normalizedPath === '/prompts/') return { name: 'prompt-library' };
  const promptMatch = normalizedPath.match(/^\/prompts\/([^/]+)\/$/);
  if (promptMatch) {
    const slug = decodeURIComponent(promptMatch[1]);
    return { name: 'prompt', slug, item: promptById(slug) };
  }
  if (normalizedPath === '/command-center/') return { name: 'command-center' };
  const legalPage = legalPageForPath(window.location.pathname);
  if (legalPage) return { name: 'legal', page: legalPage };
  const localAdminEnabled = import.meta.env.DEV || import.meta.env.VITE_ENABLE_LOCAL_ADMIN === 'true';
  if (window.location.hash.startsWith('#/admin') && localAdminEnabled) return { name: 'admin' };
  return normalizedPath === '/' ? { name: 'site' } : { name: 'not-found' };
}

function NotFoundPage() {
  return (
    <main className="seo-route-fallback" style={{ minHeight: '100vh', padding: '8vw', background: '#080808', color: '#f4efe4' }}>
      <a href="/">WORLD ARCH JOURNAL</a>
      <header>
        <small>404 · PAGE NOT FOUND</small>
        <h1>This route has moved.</h1>
        <p>The page may have been renamed, archived or entered incorrectly.</p>
        <nav aria-label="Useful destinations">
          <a href="/magazine/">Magazine</a> · <a href="/newsletter/">Briefings</a> · <a href="/atlas/">Atlas</a>
        </nav>
      </header>
    </main>
  );
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
  if (route.name === 'video-library') page = <VideoLibrary />;
  if (route.name === 'video-story') page = route.item ? <VideoLibrary video={route.item} /> : <ProductPage missing />;
  if (route.name === 'newsletter-hub') page = <NewsletterPage />;
  if (route.name === 'analysis-hub') page = <NewsletterPage section="analysis" />;
  if (route.name === 'analysis-article') page = route.item ? <NewsletterPage article section="analysis" issue={route.item} /> : <ProductPage missing />;
  if (route.name === 'newsletter-issue') page = route.item ? <NewsletterPage article issue={route.item} /> : <ProductPage missing />;
  if (route.name === 'magazine-category') page = route.item ? <MagazineHub category={route.item} /> : <ProductPage missing />;
  if (route.name === 'shop') page = <ProductPage products={(content?.products || []).filter((item) => item.published)} etsyUrl={content?.commerce?.etsyUrl} />;
  if (route.name === 'presentation-studio') page = <ProductPage presentationStudio products={(content?.products || []).filter((item) => item.published)} etsyUrl={content?.commerce?.etsyUrl} whatsappUrl={content?.brand?.whatsapp} />;
  if (route.name === 'custom-plan-design') page = <CustomPlanDesignPage brand={content?.brand} />;
  if (route.name === 'contact') page = <ContactPage />;
  if (route.name === 'about') page = <AboutPage />;
  if (route.name === 'material-library' || route.name === 'material-collection') page = <MaterialCollections category={route.category} type={route.type} />;
  if (route.name === 'material-samples') page = <MaterialLibraryPage />;
  if (route.name === 'material-product') page = route.item ? <MaterialLibraryPage material={route.item} /> : <NotFoundPage />;
  if (route.name === 'material-studio') page = <Suspense fallback={<main>Loading material collection…</main>}><MaterialStudioPage /></Suspense>;
  if (route.name === 'travertine-studio') page = <Suspense fallback={<main>Loading travertine collection…</main>}><TravertinePanel /></Suspense>;
  if (route.name === 'design-services') page = <DesignServicesPage />;
  if (route.name === 'atlas-villa') page = <AtlasVillaCaseStudy />;
  if (route.name === 'projects-hub') page = <ProjectsHub />;
  if (route.name === 'project') page = <ProjectDetail project={route.item} />;
  if (route.name === 'virtual-tour-the-voids') page = (
    <Suspense fallback={<main className="vt-loading"><span>WORLD ARCH JOURNAL</span><p>Preparing the spatial experience…</p></main>}>
      <VirtualTourPage />
    </Suspense>
  );
  if (route.name === 'virtual-tour-narbon') page = (
    <Suspense fallback={<main className="vt-loading"><span>WORLD ARCH JOURNAL</span><p>Preparing Narbon Villa…</p></main>}>
      <NarbonVirtualTourPage />
    </Suspense>
  );
  if (route.name === 'virtual-tour-safadasht') page = (
    <Suspense fallback={<main className="vt-loading"><span>WORLD ARCH JOURNAL</span><p>Preparing Villa Safadasht…</p></main>}>
      <SafadashtVirtualTourPage />
    </Suspense>
  );
  if (route.name === 'product') page = <ProductPage product={product} missing={!product} />;
  if (route.name === 'command-center') page = <CommandCenter />;
  if (route.name === 'prompt-library') page = <PromptLibrary />;
  if (route.name === 'prompt') page = route.item ? <PromptDetail item={route.item} /> : <ProductPage missing />;
  if (route.name === 'not-found') page = <NotFoundPage />;

  return <ErrorBoundary><SiteSeo content={content} route={resolvedRoute} />{page}<AnalyticsConsent /></ErrorBoundary>;
}


