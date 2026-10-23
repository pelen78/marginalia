import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

// Reviewed cast inventory: add an entry whenever chapter/ending copy introduces a name.
// Aliases that reveal an identity (Samira, Lara, the Golem's identity) stay behind spoilers.
const novels=[
 {file:'la-biblioteca-de-la-medianoche.html',groups:[1,'2a','2b','2c','2d',3,4,5],castGroup:g=>String(g).startsWith('2'),cast:{
  nora:['Nora','Seed'],elm:['Elm','Louise'],joe:['Joe'],dan:['Dan'],izzy:['Izzy','Isabel'],ash:['Ash'],hugo:['Hugo','Lefèvre'],ravi:['Ravi'],philippe:['Philippe'],voltio:['Voltaire','Voltio'],banerjee:['Banerjee'],leo:['Leo'],doreen:['Doreen'],molly:['Molly'],platon:['Platón']
 }},
 {file:'el-jardin-de-las-mariposas.html',groups:[1,5,2,3,4,6],castGroup:g=>g===5,cast:{
  maya:['Maya','Inara'],jardinero:['Jardinero'],avery:['Avery'],desmond:['Desmond'],keely:['Keely'],lyonette:['Lyonette','Cassidy'],bliss:['Bliss'],lorraine:['Lorraine'],sophia:['Sophia'],victor:['Victor','Hanoverian'],eddison:['Brandon','Eddison'],evita:['Evita'],zara:['Zara'],danelle:['Danelle'],sirvat:['Sirvat'],jillie:['Jillie']
 }},
 {file:'el-ultimo-secreto.html',groups:[1,7,2,3,4,5,6,8],castGroup:g=>g===7,cast:{
  robert:['Robert','Langdon'],katherine:['Katherine','Solomon'],brigita:['Brigita','Gessner'],sasha_person:['Sasha','Vesna'],golem_person:['Gólem'],finch_person:['Everett','Finch'],jonas:['Jonas','Faukman'],alex:['Alex','Conan'],nagel_person:['Heide','Nagel'],harris_person:['Michael','Harris'],dana:['Dana','Daněk'],janacek:['Oldřich','Janáček'],pavel:['Pavel'],judd:['Gregory','Judd'],kerble:['Scott','Kerble']
 }}
];
for(const novel of novels){
 test(novel.file+' keeps a complete cast before the story',async()=>{
  const html=await readFile(new URL('../'+novel.file,import.meta.url),'utf8');
  const data=vm.runInNewContext('('+html.match(/const DATA=(\[[\s\S]*?\n\]);/)[1]+')');
  assert.equal(new Set(data.map(c=>c.id)).size,data.length,'unique progress identifiers');
  assert.deepEqual(Array.from(new Set(data.map(c=>c.g))),novel.groups,'dialog reading order');
  assert.equal((html.match(/<aside[^>]*class="guide-note"/g)||[]).length,1,'one introductory notice');
  const headings=[...html.matchAll(/<h2 class="g-title"><span class="g-n">(\d+)<\/span>([^<]+)/g)];
  assert.equal(headings[0][2],'El libro de un vistazo');
  assert.match(headings[1][2],/^Personajes/);
  assert.deepEqual(headings.map(m=>Number(m[1])),headings.map((_,i)=>i+1));
  assert.match(html,new RegExp('0 de '+data.length+' secciones exploradas'));
  for(const [id,aliases] of Object.entries(novel.cast)){
   const card=data.find(c=>c.id===id.replaceAll('_','-'));
   assert.ok(card,'missing character card: '+id);
   assert.ok(novel.castGroup(card.g),id+' belongs in the cast');
   const intro=card.title+' '+card.text+' '+card.pts.join(' ');
   for(const alias of aliases)assert.ok(intro.includes(alias),id+' explains the name '+alias);
  }
 });
}
