// Generate an apply_patch patch; never writes site files itself.
// Reuses the existing catalog renderer so its visual markup stays identical.
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url), site='https://mymarginalia.net/';
const home=await readFile(new URL('index.html',root),'utf8');
const cut=(text,start,end)=>{const a=text.indexOf(start),b=text.indexOf(end,a);if(a<0||b<0)throw Error('Missing source boundary: '+start);return text.slice(a,b);};
export const books=runInNewContext(cut(home,'const BOOKS = [','// Guías en construcción')+';BOOKS');
export function catalog(html){
 const grid={innerHTML:''};
 const source=cut(html,'const BOOKS = [','/* Trazos a mano:')+cut(html,'const esc=','let qi=');
 runInNewContext(source+';renderGrid();',{document:{getElementById:id=>{if(id!=='grid')throw Error(id);return grid;}}},{timeout:2000});
 return grid.innerHTML;
}
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const json=data=>JSON.stringify(data).replace(/</g,'\\u003c');
const titles=new Map([
 ['biblia','Biblia católica: guía de lectura y resúmenes'],
 ['jdm','El jardín de las mariposas: resumen y personajes'],
 ['bdm','La biblioteca de la medianoche: resumen y final explicado'],
]);
export function pageSeo(book){
 const title=(titles.get(book.id)||`${book.title}: resumen y guía de lectura`)+' | MyMarginalia';
 const description=book.cat==='Novelas'?`Guía de ${book.title}, de ${book.author}: resumen, personajes y reflexiones. Final explicado en una sección con spoilers opcionales.`:
 book.id==='biblia'?'Guía para leer la Biblia católica: sus 73 libros, resúmenes por capítulos, contexto y preguntas para reflexionar. Lectura a tu ritmo en MyMarginalia.':
 `Resumen y guía de ${book.title}, de ${book.author}. Explicaciones sencillas, ideas clave y preguntas para reflexionar durante tu lectura.`;
 return {title,description};
}
function meta(html,title,description){
 html=html.replace('name="apple-mobile-web-app-title" content="Marginalia"','name="apple-mobile-web-app-title" content="MyMarginalia"').replaceAll('aria-label="Marginalia, inicio"','aria-label="MyMarginalia, inicio"');
 html=html.replace(/<title>[^<]*<\/title>/,()=>`<title>${escape(title)}</title>`);
 const tag=`<meta name="description" content="${escape(description)}">`;
 html=/<meta name="description"[^>]*>/.test(html)?html.replace(/<meta name="description"[^>]*>/,()=>tag):html.replace('</title>',()=>'</title>\n'+tag);
 html=html.replace(/<!-- seo-social:start -->[\s\S]*?<!-- seo-social:end -->\n?/,'');
 return html.replace('</title>',()=>'</title>\n<!-- seo-social:start -->\n<meta property="og:site_name" content="MyMarginalia">\n<meta property="og:title" content="'+escape(title)+'">\n<meta property="og:description" content="'+escape(description)+'">\n<!-- seo-social:end -->');
}
function structured(html,graph){
 html=html.replace(/<script id="seo-structured-data" type="application\/ld\+json">[\s\S]*?<\/script>\n?/,'');
 return html.replace('</head>',()=>`<script id="seo-structured-data" type="application/ld+json">${json({'@context':'https://schema.org','@graph':graph})}</script>\n</head>`);
}
export function improveHome(html){
 const title='MyMarginalia | Guías de lectura, resúmenes y reflexiones';
 const description='Descubre MyMarginalia: resúmenes de libros, guías de lectura por capítulos e ideas para reflexionar. Lee a tu ritmo y conserva tus propias notas.';
 html=meta(html,title,description)
  .replace('<span class="eyebrow">Guías visuales de lectura</span>','<span class="eyebrow">MyMarginalia · Guías de lectura</span>')
  .replace('Buenas lecturas,<br>una vida <em><span class="mark ul">más consciente.</span></em>','Resúmenes de libros,<br>ideas para <em><span class="mark ul">reflexionar.</span></em>')
  .replace('Libros que me inspiran, explicados con palabras sencillas. Elige una guía para leer, entender y pensar a tu ritmo.','La marginalia son notas y reflexiones al margen de una lectura. En MyMarginalia encontrarás resúmenes de libros y guías por capítulos para comprender sus ideas y conservar tus propias notas, a tu ritmo.')
  .replace('Elige tu próxima <span class="mark ul">lectura</span>','Explora las guías de <span class="mark ul">lectura</span>')
  .replace('Un espacio para descubrir libros y guardar tus propias ideas.','Novelas, hábitos, psicología y espiritualidad: resúmenes, personajes e ideas para acompañar tu lectura.');
 html=html.replace('<strong>Guías elaboradas por:</strong> Marginalia','<strong>Guías elaboradas por:</strong> MyMarginalia').replace('© 2026 Marginalia.','© 2026 MyMarginalia.');
 const marker=/<!-- seo-catalog:start -->[\s\S]*?<!-- seo-catalog:end -->/;
 const prerender='<!-- seo-catalog:start -->\n'+catalog(html)+'\n<!-- seo-catalog:end -->';
 html=marker.test(html)?html.replace(marker,()=>prerender):html.replace('<div class="grid" id="grid"></div>',()=>'<div class="grid" id="grid">'+prerender+'</div>');
 const items=books.map((b,i)=>({'@type':'ListItem',position:i+1,url:site+b.file,name:`Guía de lectura de ${b.title}`}));
 return structured(html,[{'@type':'WebSite','@id':site+'#website',url:site,name:'MyMarginalia',inLanguage:'es',publisher:{'@id':site+'#organization'}},{'@type':'Organization','@id':site+'#organization',name:'MyMarginalia',url:site,logo:site+'icon-512.png'},{'@type':'CollectionPage','@id':site+'#webpage',url:site,name:title,description,isPartOf:{'@id':site+'#website'},mainEntity:{'@type':'ItemList',itemListElement:items}}]);
}
export function improveBook(html,b){
 const {title,description}=pageSeo(b),url=site+b.file;
 html=meta(html,title,description)
  .replace('<h1>Guía de <span class="mark ul">lectura</span></h1>','<h1>Guía y <span class="mark ul">resumen</span></h1>')
  .replaceAll('href="index.html#inicio"','href="/#inicio"').replaceAll('href="index.html#libros"','href="/#libros"');
 html=html.replace('<strong>Una guía para leer el libro</strong>','<strong>Resumen y guía de lectura</strong>');
 if(b.id==='bdm')html=html.replace('Personas que sostienen la historia</h2>','Personajes que sostienen la historia</h2>');
 return structured(html,[{'@type':'WebPage','@id':url+'#webpage',url,name:title,description,inLanguage:'es',isPartOf:{'@id':site+'#website'},breadcrumb:{'@id':url+'#breadcrumb'},mainEntity:{'@type':'Article',headline:`Guía de lectura de ${b.title}`,description,inLanguage:'es',publisher:{'@id':site+'#organization'},about:{'@type':'Book',name:b.full,author:b.id==='biblia'?undefined:{'@type':'Person',name:b.author}}}},{'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:[{'@type':'ListItem',position:1,name:'MyMarginalia',item:site},{'@type':'ListItem',position:2,name:b.title,item:url}]}]);
}
export async function changes(){
 const result=[{file:'index.html',before:home,after:improveHome(home)}];
 for(const b of books){const before=await readFile(new URL(b.file,root),'utf8');result.push({file:b.file,before,after:improveBook(before,b)});}
 return result;
}
if(process.argv[1]===fileURLToPath(import.meta.url)&&process.argv.includes('--patch')){
 let patch='*** Begin Patch\n';
 for(const {file,before,after} of await changes()){
  if(before===after)continue;
  patch+='*** Update File: '+fileURLToPath(new URL(file,root))+'\n';
  const a=before.trimEnd().split('\n'),b=after.trimEnd().split('\n');let i=0,j=0;
  while(i<a.length||j<b.length){
   if(a[i]===b[j]){i++;j++;continue;}
   let match=null;
   for(let cost=1;cost<500&&!match;cost++)for(let x=0;x<=cost;x++){const y=cost-x;if(i+x<a.length&&j+y<b.length&&a[i+x]===b[j+y]){match=[x,y];break;}}
   const [x,y]=match||[a.length-i,b.length-j];
   patch+='@@\n'+(i?' '+a[i-1]+'\n':'')+a.slice(i,i+x).map(l=>'-'+l+'\n').join('')+b.slice(j,j+y).map(l=>'+'+l+'\n').join('');
   i+=x;j+=y;if(match){i++;j++;}
  }
 }
 process.stdout.write(patch+'*** End Patch\n');
}
