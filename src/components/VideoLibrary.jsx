import { articles } from '../data/articles.js';
import { publishedVideoStories } from '../data/videoStories.js';
import { watchVideoEntries, watchPagePath } from '../data/watchVideos.js';
import './VideoLibrary.css';

function VideoCard({ video }) {
  return (
    <article className="wj-video-card">
      <a className="wj-video-thumb" href={`/videos/${video.slug}/`} aria-label={`Watch ${video.title}`}>
        <img src={video.thumbnail} alt={`${video.title} video cover`} loading="lazy" width="1280" height="720" />
        <span aria-hidden="true">▶</span>
      </a>
      <div><small>{video.category}</small><h2><a href={`/videos/${video.slug}/`}>{video.title}</a></h2><p>{video.description}</p></div>
    </article>
  );
}

function HostedWatchCard({ video }) {
  return (
    <article className="wj-video-card">
      <a className="wj-video-thumb" href={watchPagePath(video)} aria-label={`Watch ${video.title}`}>
        <img src={video.thumbnail} alt={`${video.title} video preview`} loading="lazy" />
        <span aria-hidden="true">▶</span>
      </a>
      <div><small>HOSTED VIDEO · WATCH</small><h2><a href={watchPagePath(video)}>{video.title}</a></h2><p>{video.description}</p></div>
    </article>
  );
}

export default function VideoLibrary({ video = null }) {
  const related = video ? articles.filter((article) => article.published && video.relatedArticleSlugs.includes(article.slug)) : [];
  return (
    <div className="wj-video-page">
      <header className="wj-video-header"><a href="/">WORLD ARCH JOURNAL</a><nav aria-label="Primary navigation"><a href="/magazine/">Magazine</a><a href="/videos/" aria-current="page">Videos</a><a href="/atlas/">Atlas</a></nav></header>
      <main id="main-content">
        {!video ? <>
          <section className="wj-video-hero"><small>ARCHITECTURE / STRUCTURE / MATERIAL</small><h1>Architecture,<br />explained in motion.</h1><p>Short visual lessons with a readable transcript, related research and a permanent page that search engines can understand.</p></section>
          <section className="wj-video-grid" aria-label="Architecture videos">{publishedVideoStories.map((item) => <VideoCard video={item} key={item.slug} />)}</section>
          <section className="wj-video-grid" aria-label="Hosted architecture video previews">{watchVideoEntries.map((item) => <HostedWatchCard video={item} key={item.slug} />)}</section>
        </> : <article className="wj-video-story">
          <a className="wj-video-back" href="/videos/">← All videos</a><header><small>{video.category}</small><h1>{video.title}</h1><p>{video.description}</p></header>
          <div className="wj-video-embed"><iframe src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`} title={video.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>
          <section><h2>What the sequence shows</h2><ol>{video.transcript.map((line) => <li key={line}>{line}</li>)}</ol></section>
          <aside><strong>Technical note</strong><p>{video.disclaimer}</p></aside>
          {related.length > 0 && <section><h2>Continue reading</h2><div className="wj-video-related">{related.map((article) => <a href={`/articles/${article.slug}/`} key={article.slug}><span>{article.category}</span><strong>{article.title}</strong></a>)}</div></section>}
        </article>}
      </main>
      <footer className="wj-video-footer"><span>© WORLD ARCH JOURNAL</span><a href="/editorial-policy/">Editorial policy</a></footer>
    </div>
  );
}
