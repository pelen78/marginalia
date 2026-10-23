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
 for(const {file,after} of await changes()){
  const title=after.match(/<title>([^<]+)<\/title>/)[1],description=after.match(/<meta name="description" content="([^"]+)"/)[1];
  assert.ok(!titles.has(title));titles.add(title);assert.ok(!descriptions.has(description));descriptions.add(description);
  assert.match(title,/MyMarginalia/);assert.doesNotMatch(after,/<meta name="robots" content="noindex/);
  assert.equal((after.match(/rel="canonical"/g)||[]).length,1,file);
  const data=JSON.parse(after.match(/id="seo-structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(data['@context'],'https://schema.org');assert.ok(data['@graph'].length);
 }
 assert.equal(titles.size,books.length+1);
});
test('initial catalog contains the exact existing card renderer and all working book links',async()=>{
 const html=await readFile(new URL('index.html',root),'utf8');
 const initial=html.match(/<!-- seo-catalog:start -->\n([\s\S]*?)\n<!-- seo-catalog:end -->/)[1];
 assert.equal(initial,catalog(html));assert.equal(books.length,17);
 const sitemap=await readFile(new URL('sitemap.xml',root),'utf8');
 for(const b of books){assert.ok(initial.includes('href="'+b.file+'"'));await readFile(new URL(b.file,root));assert.ok(sitemap.includes('https://mymarginalia.net/'+b.file));}
 assert.doesNotMatch(initial,/localStorage|sessionStorage|despertar-el-corazon|te-desafio-a-prosperar/);
});
test('withdrawn guides and crawler controls are unchanged',async()=>{
 for(const file of ['despertar-el-corazon.html','te-desafio-a-prosperar.html','robots.txt'])assert.equal(await readFile(new URL(file,root),'utf8'),execFileSync('git',['show','HEAD:'+file],{cwd:root,encoding:'utf8'}));
});
