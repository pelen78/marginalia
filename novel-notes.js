/* Free-form notes for novels. Keep legacy answers when moving to the notebook. */
(()=>{
  const section=document.getElementById('diario');
  const field=document.getElementById('novel-notes');
  if(!section||!field)return;
  const book=section.dataset.notesBook;
  const key=book+'-notes-v1';
  const hint=document.getElementById('saved-hint');
  const clear=document.getElementById('clear-novel-notes');
  const sync=()=>{clear.disabled=!field.value.trim()};
  const save=()=>{
    try{localStorage.setItem(key,JSON.stringify(field.value));hint.textContent='Guardado en este navegador.';return true}
    catch(e){hint.textContent='No se pudo guardar. Copia tus notas antes de cerrar esta página.';return false}
  };
  try{
    const current=localStorage.getItem(key);
    if(current!==null){
      const value=JSON.parse(current);
      if(typeof value!=='string')throw new Error('Invalid notes');
      field.value=value;
    }else{
      // Keep the original keys as a backup; an empty notebook is an intentional value.
      const previous=['j1','j2','j3'].map(id=>{
        const raw=localStorage.getItem(book+'-'+id);
        if(raw===null)return '';
        try{const value=JSON.parse(raw);return typeof value==='string'?value:raw}catch(e){return raw}
      }).filter(value=>value.trim());
      field.value=previous.join('\n\n— — —\n\n');
      if(previous.length&&save())hint.textContent='Tus anotaciones anteriores están reunidas en este cuaderno.';
    }
  }catch(e){hint.textContent='No se pudieron cargar tus notas. Los datos guardados no se han modificado.'}
  sync();
  field.addEventListener('input',()=>{save();sync()});
  clear.addEventListener('click',()=>{
    if(!field.value.trim()||!window.confirm('¿Borrar las notas de esta novela?'))return;
    field.value='';
    if(save())hint.textContent='Notas borradas de este cuaderno.';
    sync();field.focus();
  });
  document.getElementById('mg-save-pdf').addEventListener('click',()=>{
    document.getElementById('pdf-notes').textContent=field.value.trim()||'Sin anotaciones todavía.';
    document.getElementById('pdf-date').textContent='Anotaciones personales · '+new Intl.DateTimeFormat('es-MX',{dateStyle:'long'}).format(new Date());
    const oldTitle=document.title;
    document.title='Mis notas - '+document.querySelector('.hero cite').textContent+' - Marginalia';
    document.body.classList.add('mg-notes-print');
    const restore=()=>{document.body.classList.remove('mg-notes-print');document.title=oldTitle;window.removeEventListener('afterprint',restore)};
    window.addEventListener('afterprint',restore);
    requestAnimationFrame(()=>{try{window.print()}finally{restore()}});
  });
})();
