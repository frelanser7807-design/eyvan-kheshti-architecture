import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { newsletterIssues, editorialArticles } from '../src/data/newsletters.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const seenSlugs = new Set();
const seenTitles = new Set();
const validDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value || '')) && !Number.isNaN(Date.parse(`${value}T12:00:00Z`));
const today = new Date().toISOString().slice(0, 10);

for (const issue of [...newsletterIssues, ...editorialArticles]) {
  const tag = issue.slug || '(missing slug)';
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tag)) errors.push(`${tag}: invalid slug`);
  if (seenSlugs.has(tag)) errors.push(`${tag}: duplicate slug`);
  seenSlugs.add(tag);
  if (seenTitles.has(issue.title)) errors.push(`${tag}: duplicate title`);
  seenTitles.add(issue.title);
  for (const field of ['title', 'seoTitle', 'description', 'excerpt', 'author', 'authorUrl', 'format', 'topic', 'image', 'imageAlt', 'imageCredit']) {
    if (!String(issue[field] || '').trim()) errors.push(`${tag}: missing ${field}`);
  }
  if (!['Daily briefing', 'News analysis', 'Technical field note'].includes(issue.format)) errors.push(`${tag}: unsupported editorial format`);
  for (const field of ['publishedAt', 'sourcesCheckedAt']) {
    if (!validDate(issue[field])) errors.push(`${tag}: invalid ${field}`);
    else if (issue[field] > today) errors.push(`${tag}: ${field} is in the future`);
  }
  if (issue.updatedAt && (!validDate(issue.updatedAt) || issue.updatedAt < issue.publishedAt || issue.updatedAt > today)) errors.push(`${tag}: invalid updatedAt`);
  if (issue.feedPublishedAt && (Number.isNaN(Date.parse(issue.feedPublishedAt)) || Date.parse(issue.feedPublishedAt) > Date.now() || issue.feedPublishedAt.slice(0, 10) !== issue.publishedAt)) errors.push(`${tag}: invalid or future RSS publication timestamp`);
  if (!issue.authorUrl?.startsWith('/')) errors.push(`${tag}: authorUrl must be internal`);
  if (!Array.isArray(issue.sections) || issue.sections.length < 2) errors.push(`${tag}: fewer than two substantive sections`);
  if (!Array.isArray(issue.sources) || issue.sources.length < (issue.format === 'News analysis' ? 2 : 1)) errors.push(`${tag}: insufficient attributed sources`);
  const domains = new Set();
  for (const source of issue.sources || []) {
    if (!source.label?.trim()) errors.push(`${tag}: source without label`);
    try { const url = new URL(source.url); if (url.protocol !== 'https:') errors.push(`${tag}: non-HTTPS source`); domains.add(url.hostname); }
    catch { errors.push(`${tag}: invalid source URL`); }
  }
  if (issue.format === 'News analysis' && domains.size < 2) errors.push(`${tag}: news analysis needs two independent source domains`);
  if (issue.format === 'News analysis' && (issue.sections || []).filter((section) => section.source).length < 2) errors.push(`${tag}: source links missing beside news claims`);
  if (issue.format === 'Daily briefing') {
    const news = (issue.sections || []).filter((section) => section.kind === 'news');
    if (news.length < 3 || domains.size < 3) errors.push(`${tag}: daily briefing requires three stories and three source domains`);
    for (const section of news) {
      const age = (Date.parse(issue.publishedAt) - Date.parse(section.sourcePublishedAt)) / 86400000;
      if (!validDate(section.sourcePublishedAt) || age < 0 || age > 3) errors.push(`${tag}: news source is undated, future or older than 72 hours: ${section.heading}`);
      if (!section.source?.url || !section.paragraphs.some((paragraph) => paragraph.startsWith('Our reading:'))) errors.push(`${tag}: daily item lacks a direct source or independent commentary`);
    }
  }
  for (const [label, asset] of [['cover', issue.image], ...(issue.sections || []).filter((section) => section.illustration).map((section) => [section.heading, section.illustration])]) {
    if (!asset?.startsWith('/assets/') || asset.includes('..')) { errors.push(`${tag}: unsafe ${label} asset path`); continue; }
    try { await stat(path.join(root, 'public', asset.slice(1))); }
    catch { errors.push(`${tag}: missing ${label} asset ${asset}`); }
  }
  for (const section of issue.sections || []) if (section.photo) {
    const photo = section.photo;
    for (const field of ['alt', 'caption', 'sourceUrl', 'licenseUrl', 'licenseLabel']) if (!String(photo[field] || '').trim()) errors.push(`${tag}: incomplete photo credit in ${section.heading}`);
    if (!photo.src?.startsWith('/assets/') || photo.src.includes('..')) errors.push(`${tag}: unsafe photo asset in ${section.heading}`);
    else try { await stat(path.join(root, 'public', photo.src.slice(1))); }
    catch { errors.push(`${tag}: missing photo asset ${photo.src}`); }
  }
  if (issue.imageAttribution && !['creator', 'sourceUrl', 'licenseUrl', 'licenseLabel'].every((field) => String(issue.imageAttribution[field] || '').trim())) errors.push(`${tag}: incomplete hero image attribution`);
  if (issue.format === 'News analysis' && (!issue.editorialAnalysis?.thesis || issue.editorialAnalysis.questions?.length < 3 || !issue.editorialAnalysis.limit)) errors.push(`${tag}: missing independent analysis or evidence limit`);
  if (!Array.isArray(issue.corrections)) errors.push(`${tag}: corrections must be an array`);
  for (const correction of issue.corrections || []) {
    if (!validDate(correction.date) || !correction.text?.trim()) errors.push(`${tag}: invalid public correction`);
  }
}

if (errors.length) {
  console.error(`Newsletter release check failed:\n${errors.map((entry) => `- ${entry}`).join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Editorial release check passed for ${newsletterIssues.length} dated newsletter and ${editorialArticles.length} separate analysis article(s).`);
}
