import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {books,changes,catalog} from './seo.mjs';
const root=new URL('../',import.meta.url);
const blocks=(html,type)=>[...html.matchAll(new RegExp(`<${type}\\b[^>]*>([\\s\\S]*?)<\\/${type}>`,'g'))].map(m=>m[1]);
test('SEO changes preserve CSS and executable JavaScript byte for byte',async()=>{
 for(const {file,after} of await changes()){
  const before=await readFile(new URL(file,root),'utf8');
  assert.deepEqual(blocks(after,'style'),blocks(before,'style'),file+' CSS');
  const js=h=>[...h.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)].filter(m=>!m[1].includes('application/ld+json')).map(m=>m[0]);
  assert.deepEqual(js(after),js(before),file+' JavaScript');
 }
});
test('each public page has unique valid metadata and structured data',async()=>{
 const titles=new Set(),descriptions=new Set();
 for(const {file,before,after} of await changes()){
  assert.equal(before,after,file+' should match the generated SEO');
  const b=books.find(book=>book.file===file);
  const title=before.match(/<title>([^<]+)<\/title>/)[1],description=before.match(/<meta name="description" content="([^"]+)"/)[1];
  const url='https://mymarginalia.net/'+(b?file:'');
  assert.match(before,/<title>[^<]+<\/title>/);
  assert.doesNotMatch(before,/<meta name="robots" content="noindex/);
  assert.equal((before.match(/rel="canonical"/g)||[]).length,1,file);
  assert.ok(before.includes(`<link rel="canonical" href="${url}">`),file);
  const data=JSON.parse(before.match(/id="seo-structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(data['@context'],'https://schema.org');assert.ok(data['@graph'].length);
  if(file==='movil.html') continue; // Same canonical homepage and metadata as index.html.
  assert.ok(!titles.has(title));titles.add(title);assert.ok(!descriptions.has(description));descriptions.add(description);
  if(!b) continue;
  const author=b.id==='biblia'?'diversos autores':b.author;
  assert.equal(title,`${b.title} de ${author}: Resumen, ideas clave y guía de lectura | MyMarginalia`);
  assert.ok(description.length>=140&&description.length<=155,file);
  assert.ok(description.includes(b.title)&&description.includes(author),file);
  assert.ok(before.includes(`<h1 class="book-title" aria-label="${b.title} de ${author}">`),file);
  const body=before.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'');
  assert.match(body,/<p class="guide-summary">[^<]+<\/p>/);
  const article=data['@graph'].find(node=>node['@type']==='Article');
  assert.equal(article.description,description);
  assert.equal(article.inLanguage,'es');
  assert.equal(article.about['@type'],'Book');
  assert.equal(article.about.name,b.full);
  assert.equal(article.about.author.name,b.author);
 }
 assert.equal(titles.size,books.length+1);
});
test('initial catalog contains the exact existing card renderer and all working book links',async()=>{
 for(const file of ['index.html','movil.html']){
  const html=await readFile(new URL(file,root),'utf8');
  const initial=html.match(/<!-- seo-catalog:start -->\n([\s\S]*?)\n<!-- seo-catalog:end -->/)[1];
  assert.equal(initial,catalog(html));
  assert.match(html,/<noscript><style>[^<]*#intro\{display:none!important\}/);
  for(const b of books)assert.ok(initial.includes(`<h3><a href="${b.file}">${b.title}</a></h3>`),file+' '+b.file);
  assert.doesNotMatch(initial,/localStorage|sessionStorage|despertar-el-corazon|te-desafio-a-prosperar/);
 }
 const sitemap=await readFile(new URL('sitemap.xml',root),'utf8');
 const urls=[...sitemap.matchAll(/<url><loc>([^<]+)<\/loc><lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod><\/url>/g)];
 assert.deepEqual(urls.map(m=>m[1]),['https://mymarginalia.net/',...books.map(b=>'https://mymarginalia.net/'+b.file)]);
 const robots=await readFile(new URL('robots.txt',root),'utf8');
 assert.match(robots,/^Allow: \/$/m);
 assert.match(robots,/^Sitemap: https:\/\/mymarginalia\.net\/sitemap\.xml$/m);
});
test('withdrawn guides and crawler controls are unchanged',async()=>{
 for(const file of ['despertar-el-corazon.html','te-desafio-a-prosperar.html','robots.txt'])assert.equal(await readFile(new URL(file,root),'utf8'),execFileSync('git',['show','HEAD:'+file],{cwd:root,encoding:'utf8'}));
});
