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
 const mobile=html.includes('id="catalog-results"');
 const source=cut(html,'const BOOKS = [','/* Trazos a mano:')+(mobile
  ?cut(html,'const esc=','// Día según')+cut(html,'// Novelas va primero','/* fin del catálogo */')
  :cut(html,'const esc=','/* fin del catálogo */'));
 runInNewContext(source+';renderGrid(false);',{document:{getElementById:id=>{if(id!=='grid')throw Error(id);return grid;}}},{timeout:2000});
 return grid.innerHTML;
}
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const json=data=>JSON.stringify(data).replace(/</g,'\\u003c');
const descriptions={
 biblia:"Lee La Biblia, de diversos autores, con un resumen por capítulos de sus 73 libros, contexto para la lectura católica y preguntas de reflexión.",
 ic:"Guía de Imitación de Cristo, de Tomás de Kempis, con resumen por capítulos e ideas para reflexionar sobre la humildad, la oración y la vida interior.",
 ahora:"Resumen de El poder del ahora, de Eckhart Tolle. Explora sus ideas principales sobre la presencia, cómo observar la mente y preguntas para reflexionar.",
 habitos:"Resumen de Hábitos atómicos, de James Clear. Explora las cuatro leyes del cambio de conducta, ejemplos para crear hábitos y preguntas de reflexión.",
 th:"Resumen de Hábitos diminutos, de BJ Fogg. Aprende a unir acciones pequeñas a tu rutina y a celebrar el progreso con ejemplos y preguntas de reflexión.",
 amigos:"Resumen de Cómo ganar amigos e influir sobre las personas, de Dale Carnegie. Ideas para escuchar mejor, recordar nombres y conversar sin discutir.",
 cosas:"Resumen de Cómo hacer que te pasen cosas buenas, de Marian Rojas Estapé. Explora el papel del cortisol, la atención y los vínculos en el bienestar.",
 zonas:"Resumen de Tus zonas erróneas, de Wayne W. Dyer. Explora cómo influyen la culpa, la preocupación y la búsqueda de aprobación, con preguntas de reflexión.",
 ie:"Resumen de Inteligencia emocional, de Daniel Goleman. Explora cómo las emociones influyen en las decisiones y las relaciones, con preguntas de reflexión.",
 aod:"Resumen de ¿Amar o depender?, de Walter Riso. Identifica señales de apego y reflexiona sobre los límites, la autonomía y el cuidado dentro de una pareja.",
 sa:"Resumen de El sutil arte de que te importe un carajo, de Mark Manson. Reflexiona sobre cómo elegir tus valores y asumir responsabilidad por tus decisiones.",
 poz:"Resumen de Piénsalo otra vez, de Adam Grant. Descubre cómo revisar tus creencias, conversar con quien piensa distinto y cambiar de opinión con criterio.",
 ltt:"Resumen de La teoría Let Them, de Mel Robbins. Revisa qué puedes soltar y cómo enfocar tu energía en tus decisiones, con ejemplos y preguntas de reflexión.",
 jdm:"Resumen de El jardín de las mariposas, de Dot Hutchison. Conoce a los personajes y sigue la investigación del FBI, con el final en una sección separada.",
 bdm:"Resumen de La biblioteca de la medianoche, de Matt Haig. Sigue las vidas posibles de Nora Seed, revisa los personajes y consulta el final por separado.",
 eus:"Resumen de El último secreto, de Dan Brown. Sigue las pistas de Robert Langdon en Praga, conoce a los personajes y consulta el final en una sección aparte.",
 lps:"Resumen de La paciente silenciosa, de Alex Michaelides. Sigue el caso de Alicia Berenson, explora los personajes y consulta el final en una sección aparte.",
};
const authorLabel=book=>book.id==='biblia'?'diversos autores':book.author;
export function pageSeo(book){
 const title=`${book.title} de ${authorLabel(book)}: Resumen, ideas clave y guía de lectura | MyMarginalia`;
 const description=descriptions[book.id];
 if(!description||description.length<140||description.length>155) throw Error('Descripción SEO de 140–155 caracteres requerida: '+book.file);
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
 const existing=/<script id="seo-structured-data" type="application\/ld\+json">[\s\S]*?<\/script>/;
 const tag=`<script id="seo-structured-data" type="application/ld+json">${json({'@context':'https://schema.org','@graph':graph})}</script>`;
 return existing.test(html)?html.replace(existing,()=>tag):html.replace('</head>',()=>tag+'\n</head>');
}
export function improveHome(html){
 const title='MyMarginalia | Guías de lectura, resúmenes y reflexiones';
 const description='Descubre MyMarginalia: resúmenes de libros, guías de lectura por capítulos e ideas para reflexionar. Lee a tu ritmo y conserva tus propias notas.';
 html=meta(html,title,description)
  .replace('<span class="eyebrow">Guías visuales de lectura</span>','<span class="eyebrow">MyMarginalia · Guías de lectura</span>')
  .replace('Buenas lecturas,<br>una vida <em><span class="mark ul">más consciente.</span></em>','Resúmenes de libros,<br>ideas para <em><span class="mark ul">reflexionar.</span></em>')
  .replace('Libros que me inspiran, explicados con palabras sencillas. Elige una guía para leer, entender y pensar a tu ritmo.','La marginalia reúne notas y reflexiones al margen de una lectura. En MyMarginalia encontrarás resúmenes de libros y guías por capítulos para comprender sus ideas y conservar tus propias notas, a tu ritmo.')
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
 html=html.replace(/<link\b(?=[^>]*\brel="canonical")[^>]*>/g,`<link rel="canonical" href="${url}">`)
  .replace(/<h1 class="book-title"(?: aria-label="[^"]*")?>/,`<h1 class="book-title" aria-label="${escape(b.title+' de '+authorLabel(b))}">`);
 if(!html.includes('class="guide-summary"')){
  html=html.replace(/(<aside\b[^>]*\bclass="guide-note"[^>]*>\s*<strong>[^<]+<\/strong>\s*)/,(_,opening)=>
   opening+`<p class="guide-summary">${escape(b.blurb)}</p>`);
 }
 const articleId=url+'#article';
 return structured(html,[
  {'@type':'Organization','@id':site+'#organization',name:'MyMarginalia',url:site,logo:site+'icon-512.png'},
  {'@type':'WebPage','@id':url+'#webpage',url,name:title,description,inLanguage:'es',isPartOf:{'@id':site+'#website'},breadcrumb:{'@id':url+'#breadcrumb'},mainEntity:{'@id':articleId}},
  {'@type':'Article','@id':articleId,headline:title,description,inLanguage:'es',mainEntityOfPage:{'@id':url+'#webpage'},author:{'@id':site+'#organization'},publisher:{'@id':site+'#organization'},
   about:{'@type':'Book',name:b.full,inLanguage:'es',author:{'@type':b.id==='biblia'?'Thing':'Person',name:b.author}}},
  {'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:[{'@type':'ListItem',position:1,name:'MyMarginalia',item:site},{'@type':'ListItem',position:2,name:b.title,item:url}]}
 ]);
}
export async function changes(){
 const mobile=await readFile(new URL('movil.html',root),'utf8');
 const result=[{file:'index.html',before:home,after:improveHome(home)},{file:'movil.html',before:mobile,after:improveHome(mobile)}];
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
