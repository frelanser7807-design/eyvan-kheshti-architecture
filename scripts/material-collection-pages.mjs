import { collectionCategories, collectionProducts, categoryPath, typePath } from '../src/data/materialCollections.js';
import { materialLibrary } from '../src/data/materialLibrary.js';

export async function emitMaterialCollections({ emit, preparePage, escapeHtml: e, siteUrl, siteName }) {
  const samples = materialLibrary.map(m=>`<article><h2><a href="/materials/${m.slug}/">${e(m.name)}</a></h2><p>${e(m.description)}</p><img src="${m.maps.baseColor}" alt="${e(m.name)} 1K source sample"></article>`).join('');
  await emit('/materials/samples/',preparePage({pathname:'/materials/samples/',title:`Licensed 1K Material Samples | ${siteName}`,description:'Source-attributed CC0 1K reference materials, separate from the original 4K fluted wood collection.',image:materialLibrary[0].maps.baseColor,schema:{'@context':'https://schema.org','@type':'CollectionPage',name:'Licensed 1K Material Samples',url:`${siteUrl}/materials/samples/`},body:`<main class="seo-route-fallback"><a href="/materials/">Material Library</a><h1>Licensed 1K source samples</h1>${samples}</main>`}));
  for(const m of materialLibrary){
    const pathname=`/materials/${m.slug}/`;
    await emit(pathname,preparePage({pathname,title:`${m.name} PBR Source Sample | ${siteName}`,description:m.description,image:m.maps.baseColor,schema:{'@context':'https://schema.org','@type':'CreativeWork',name:m.name,url:`${siteUrl}${pathname}`,license:'https://creativecommons.org/publicdomain/zero/1.0/'},body:`<main class="seo-route-fallback"><a href="/materials/samples/">Source samples</a><h1>${e(m.name)}</h1><p>${e(m.description)}</p><p>Resolution: ${e(m.resolution)}. Generic sample, not a manufacturer product.</p><img src="${m.maps.baseColor}" alt="${e(m.name)} texture"><h2>Available maps</h2>${Object.entries(m.maps).map(([name,url])=>`<p><a href="${url}" download>${e(name)} · 1K JPG</a></p>`).join('')}<p>Source: <a href="${m.source.url}">${e(m.source.name)} — ${e(m.source.author)}</a>, CC0 1.0.</p></main>`}));
  }
  const productLinks = products => products.map(p=>`<article><h2><a href="${p.path}">${e(p.name)}</a></h2><p>${e(p.description)}</p><img src="${p.scene}" alt="Fluted wood bedroom visualization" loading="lazy"></article>`).join('');
  const pages = [{ path: '/materials/', name: 'Architectural Material Library', description: 'Explore materials by family and type, then compare product finishes in room studies and download available PBR maps.', products: collectionProducts, links: collectionCategories.map(c=>[c.name,categoryPath(c.id)]) }];
  for (const c of collectionCategories) {
    const products = collectionProducts.filter(p=>p.category===c.id);
    pages.push({path:categoryPath(c.id),name:c.name,description:c.description,products,links:c.types.map(t=>[t.name,typePath(c.id,t.id)])});
    for(const t of c.types) pages.push({path:typePath(c.id,t.id),name:t.name,description:`${t.name} material collections, finishes and available texture downloads.`,products:products.filter(p=>p.type===t.id),links:[[c.name,categoryPath(c.id)]]});
  }
  for(const page of pages){
    const description=page.products.length?page.description:`${page.name} collection is in preparation. Browse the available original material collections.`;
    const body=`<main class="seo-route-fallback"><a href="/materials/">WORLD ARCH JOURNAL / MATERIAL LIBRARY</a><h1>${e(page.name)}</h1><p>${e(description)}</p><nav>${page.links.map(([name,url])=>`<a href="${url}">${e(name)}</a>`).join('')}</nav>${page.products.length?productLinks(page.products):'<p>No downloadable product is available in this type yet.</p>'}<a href="/materials/samples/">Licensed 1K source samples</a></main>`;
    await emit(page.path,preparePage({pathname:page.path,title:`${page.name} | ${siteName}`,description,image:collectionProducts[0].scene,robots:page.products.length?undefined:'noindex, follow',schema:{'@context':'https://schema.org','@type':'CollectionPage',name:page.name,description,url:`${siteUrl}${page.path}`,hasPart:page.products.map(p=>({'@type':'CreativeWork',name:p.name,url:`${siteUrl}${p.path}`}))},body}));
  }
  const p=collectionProducts[0];
  const body=`<main class="seo-route-fallback"><nav><a href="/materials/">Material Library</a><a href="${categoryPath('wood')}">Wood & timber</a><a href="${typePath('wood','fluted-panels')}">Fluted panels</a></nav><h1>${e(p.name)}</h1><p>${e(p.description)}</p><img src="${p.scene}" alt="Original fluted wood bedroom visualization"><section><h2>Seven finish studies</h2><p>Natural oak, light oak, walnut tone, smoked oak, grey oak, charcoal black and white wood.</p><h2>Surface and room previews</h2><p>Compare finishes on a bedroom wall, kitchen island and TV wall. Explore directional light on the material sphere and panel. Room lighting is fixed; previews are illustrative, not manufacturer color guarantees.</p><h2>Downloads and technical details</h2><p>4K PNG base color, OpenGL normal, roughness and 16-bit height maps. Digital tile size: 480 × 480 mm; flute pitch: 20 mm. Native software project files are not included. These original procedural materials are not scanned manufacturer products.</p></section></main>`;
  const html=preparePage({pathname:p.path,title:`Fluted Wood · 7 Finishes & 4K PBR Maps | ${siteName}`,description:p.description,image:p.scene,schema:{'@context':'https://schema.org','@type':'CreativeWork',name:p.name,description:p.description,url:`${siteUrl}${p.path}`,isPartOf:{'@type':'CollectionPage',url:`${siteUrl}${typePath('wood','fluted-panels')}`}},body});
  await emit(p.path,html);
  // Preserve bookmarked demo URLs while consolidating SEO on the product route.
  await emit('/material-studio/',html);
}

export const materialCollectionSitemap = [
  ...materialLibrary.map(p=>({pathname:`/materials/${p.slug}/`,lastmod:'2026-10-19'})),
  ...collectionProducts.map(p=>({pathname:p.path,lastmod:'2026-10-19',image:{loc:p.scene,title:p.name}})),
  ...collectionCategories.filter(c=>collectionProducts.some(p=>p.category===c.id)).flatMap(c=>[
    {pathname:categoryPath(c.id),lastmod:'2026-10-19'},
    ...c.types.filter(t=>collectionProducts.some(p=>p.category===c.id && p.type===t.id)).map(t=>({pathname:typePath(c.id,t.id),lastmod:'2026-10-19'})),
  ]),
  {pathname:'/materials/samples/',lastmod:'2026-10-19'},
];
