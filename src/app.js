import {collection,allAvatars} from './data.js';
import {art} from './art.js';
const $=s=>document.querySelector(s);
let tradition='buddha',filter='All',search='',current=null,tab='story',returnFocus=null;
const dialog=$('#avatar-dialog');
function node(tag,text,className){const n=document.createElement(tag);if(text)n.textContent=text;if(className)n.className=className;return n;}
function render(){
  const list=collection(tradition);
  const shown=list.filter(a=>(filter==='All'||a.theme===filter)&&[a.name,a.sanskrit,a.form,a.theme,a.summary].join(' ').toLowerCase().includes(search));
  $('#cards').replaceChildren();
  shown.forEach(a=>{const n=list.findIndex(b=>b.id===a.id)+1;const b=node('button',null,'card');b.setAttribute('aria-label',`Explore ${a.name}, ${a.form}`);b.dataset.avatar=a.id;const image=node('span',null,'card-image');image.innerHTML=art(a);image.append(node('span',String(n).padStart(2,'0'),'card-number'),node('span',a.theme,'card-theme'));const info=node('span',null,'card-info');info.append(node('span',a.name,'card-name'),node('span','↗','card-arrow'),node('span',a.form,'card-form'),node('span',a.summary,'card-summary'));b.append(image,info);b.addEventListener('click',()=>navigate(a.id));$('#cards').append(b);});
  if(!shown.length){const empty=node('div',null,'empty');empty.append(node('strong','No avatars found.'),node('span','Try another name or choose a different theme.'));$('#cards').append(empty);}
  $('#results').textContent=(search||filter!=='All')?`${shown.length} of ${list.length} avatars shown.`:'';
  $('#journey-track').replaceChildren();list.forEach((a,i)=>{const b=node('button',null,'journey-node');b.setAttribute('aria-label',`${i+1}. Explore ${a.name}`);b.append(node('span',String(i+1).padStart(2,'0'),'journey-dot'),node('strong',a.name),node('small',a.form));b.addEventListener('click',()=>navigate(a.id));$('#journey-track').append(b);});
}
function navigate(id){location.hash=`avatar/${id}`;}
function renderPanel(){
 const a=current,panel=$('#detail-panel');panel.replaceChildren();panel.setAttribute('aria-labelledby',`tab-${tab}`);
 document.querySelectorAll('[role=tab]').forEach(b=>{const active=b.dataset.tab===tab;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});
 if(tab==='story'){a.story.forEach(p=>panel.append(node('p',p)));panel.append(node('p',`Textual traditions: ${a.text}.`,'source-note'));}
 if(tab==='character'){panel.append(node('p',a.character));const dl=node('dl',null,'profile-facts');for(const [k,v] of [['Defining quality',a.quality],['Symbols',a.symbols.join(' · ')],['World',a.setting],['Key figures',a.companions]]){dl.append(node('dt',k),node('dd',v));}panel.append(dl);}
 if(tab==='meaning'){panel.append(node('h3','A thought to carry with you'),node('p',a.meaning));const q=node('div',null,'reflection-question');q.append(node('small','PAUSE & REFLECT'),node('span',a.question));panel.append(q,node('p','A modern reflection inspired by the story; interpretations differ across communities.','source-note'));}
}
function openProfile(a){
 if(!dialog.open){returnFocus=document.activeElement;dialog.showModal();document.body.classList.add('modal-open');}
 current=a;tab='story';const list=collection(tradition);const index=list.findIndex(b=>b.id===a.id);$('#detail-number').textContent=index>=0?`AVATAR ${String(index+1).padStart(2,'0')} / 10 · ${a.theme.toUpperCase()}`:`ANOTHER TRADITION · ${a.theme.toUpperCase()}`;$('#detail-name').textContent=a.name;$('#detail-sanskrit').textContent=a.sanskrit;$('#detail-form').textContent=a.form;$('#detail-title').textContent=a.title;$('#detail-art').innerHTML=art(a,'detail');$('#copy-status').textContent='';$('#copy-link').textContent='Copy link';renderPanel();dialog.scrollTop=0;$('#close-dialog').focus({preventScroll:true});
}
function readRoute(){const match=location.hash.match(/^#avatar\/([a-z]+)$/);const a=match&&allAvatars.find(a=>a.id===match[1]);if(a){if(a.id==='balarama'&&tradition!=='balarama'){tradition='balarama';$('#tradition').value=tradition;render();}if(a.id==='buddha'&&tradition!=='buddha'){tradition='buddha';$('#tradition').value=tradition;render();}openProfile(a);}else if(dialog.open){dialog.close();}else if(match){history.replaceState(null,'',`${location.pathname}${location.search}#avatars`);$('#results').textContent='That avatar was not found. Explore the collection below.';}}
function closeProfile(){if(location.hash.startsWith('#avatar/')){history.replaceState(null,'',`${location.pathname}${location.search}#avatars`);}if(dialog.open)dialog.close();}
$('#close-dialog').addEventListener('click',closeProfile);
dialog.addEventListener('cancel',e=>{e.preventDefault();closeProfile();});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');current=null;if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeProfile();}});
function step(offset){const list=collection(tradition),i=list.findIndex(a=>a.id===current?.id);navigate(list[(Math.max(0,i)+offset+list.length)%list.length].id);}
$('#previous').addEventListener('click',()=>step(-1));$('#next').addEventListener('click',()=>step(1));
document.querySelectorAll('[role=tab]').forEach(b=>{b.addEventListener('click',()=>{tab=b.dataset.tab;renderPanel();});b.addEventListener('keydown',e=>{const tabs=[...document.querySelectorAll('[role=tab]')],i=tabs.indexOf(b);let next;if(e.key==='ArrowRight')next=(i+1)%3;if(e.key==='ArrowLeft')next=(i+2)%3;if(e.key==='Home')next=0;if(e.key==='End')next=2;if(next!==undefined){e.preventDefault();tab=tabs[next].dataset.tab;renderPanel();tabs[next].focus();}});});
$('#copy-link').addEventListener('click',async()=>{try{if(!navigator.clipboard)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(location.href);$('#copy-status').textContent='Profile link copied.';}catch{$('#copy-status').textContent=`Copy this link from your address bar: ${location.href}`;} });
document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;document.querySelectorAll('.filter').forEach(f=>{f.classList.toggle('active',f===b);f.setAttribute('aria-pressed',String(f===b));});render();}));
$('#search').addEventListener('input',e=>{search=e.target.value.trim().toLowerCase();render();});
$('#tradition').addEventListener('change',e=>{tradition=e.target.value;render();});
$('#random').addEventListener('click',()=>{const list=collection(tradition);navigate(list[Math.floor(Math.random()*list.length)].id);});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!dialog.open&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){e.preventDefault();$('#search').focus();}});
window.addEventListener('hashchange',readRoute);
render();readRoute();
