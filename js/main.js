/* main.js - shared helpers, navbar/footer, favourites, home page */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const store={get(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v??d}catch(e){return d}},set(k,v){localStorage.setItem(k,JSON.stringify(v))}};
function fmt(d){return new Date(d+'T00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
function isPast(e){return new Date(e.date+'T23:59:59')<new Date()}
function getSession(){return JSON.parse(localStorage.getItem('cv_session')||sessionStorage.getItem('cv_session')||'null')}
function currentUser(){const s=getSession();return s?store.get('cv_users',[]).find(u=>u.email===s.email)||null:null}
function logout(){localStorage.removeItem('cv_session');sessionStorage.removeItem('cv_session');location.href='index.html'}

/* demo data: runs once so the site can be tested immediately */
function seed(){
 if(store.get('cv_users',[]).length)return;
 store.set('cv_users',[{name:'Aarav Sharma',regNo:'21CSE1001',email:'aarav@campus.edu',password:'Demo@123',dept:'Computer Science',year:'3rd Year',gender:'Male'}]);
 store.set('cv_regs',[{email:'aarav@campus.edu',eventId:10,date:'2026-10-01'},{email:'aarav@campus.edu',eventId:1,date:'2026-11-01'}]);
}

/* validation helper: shows error under the field, returns true when valid */
function setErr(id,msg){const el=$('#e_'+id);if(el){el.textContent=msg;el.style.display=msg?'block':'none'}const i=$('#'+id);if(i)i.classList.toggle('is-invalid',!!msg);return !msg}
function togglePw(id,btn){const i=$('#'+id);const show=i.type==='password';i.type=show?'text':'password';btn.textContent=show?'Hide':'Show'}

/* toast + modal */
function toast(msg,type='success'){
 let c=$('#toasts');if(!c){c=document.createElement('div');c.id='toasts';c.className='toast-container position-fixed bottom-0 end-0 p-3';document.body.append(c)}
 const t=document.createElement('div');t.className='toast cv-toast '+type;t.setAttribute('role','alert');
 t.innerHTML=`<div class="d-flex"><div class="toast-body">${msg}</div><button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div>`;
 c.append(t);new bootstrap.Toast(t,{delay:3200}).show();t.addEventListener('hidden.bs.toast',()=>t.remove());
}
function openModal(title,body,okText,cb){
 $('#cvModal .modal-title').textContent=title;$('#cvModal .modal-body').innerHTML=body;
 const b=$('#cvOk');b.classList.toggle('d-none',!okText);
 if(okText){b.textContent=okText;b.onclick=()=>{bootstrap.Modal.getInstance($('#cvModal')).hide();cb&&cb()}}
 bootstrap.Modal.getOrCreateInstance($('#cvModal')).show();
}

/* favourites (saved per logged-in student) */
const favKey=()=>{const u=currentUser();return u?'cv_fav_'+u.email:null};
const getFavs=()=>{const k=favKey();return k?store.get(k,[]):[]};
function toggleFav(id,btn){
 const k=favKey();if(!k){toast('Please log in to save favourite events.','danger');return}
 let f=getFavs();f=f.includes(id)?f.filter(x=>x!==id):[...f,id];store.set(k,f);
 const on=f.includes(id);if(btn){btn.classList.toggle('on',on);btn.textContent=on?'♥':'♡'}
 toast(on?'Added to favourites.':'Removed from favourites.');
 if(typeof afterFav==='function')afterFav();
}
function hov(t){const h=$('#hoverMsg');if(h)h.textContent=t}

/* event card (used on home + explore pages) */
function eventCard(e){
 const d=new Date(e.date+'T00:00'),mon=d.toLocaleString('en',{month:'short'}),fav=getFavs().includes(e.id);
 return `<div class="col-md-6 col-lg-4"><article class="ev-card h-100" onmouseover="hov('${e.title} · ${e.cat} · ${e.venue}')" onmouseout="hov('')">
 <div class="poster g${e.g}"><span class="datebox"><b>${d.getDate()}</b>${mon}</span><span class="emoji">${e.emoji}</span><span class="badge-cat">${e.cat}</span></div>
 <div class="p-4"><h3 class="h5">${e.title}</h3>
 <ul class="meta list-unstyled mb-2"><li>🕒 ${fmt(e.date)}, ${e.time}</li><li>📍 ${e.venue}</li></ul>
 <p class="small mb-3">${e.short}</p>
 <div class="d-flex gap-2"><a class="btn btn-cv flex-grow-1" href="event-details.html?id=${e.id}">View Details</a>
 <button class="fav ${fav?'on':''}" aria-label="Favourite" onclick="toggleFav(${e.id},this)">${fav?'♥':'♡'}</button></div></div></article></div>`;
}

/* navbar + footer + modal injected on every page */
function renderChrome(){
 const page=location.pathname.split('/').pop()||'index.html',cur=page==='event-details.html'?'events.html':page;
 const links=[['index.html','Home'],['events.html','Explore Events'],['clubs.html','Clubs & Communities'],['my-registrations.html','My Registrations'],['contact.html','Contact']];
 const u=currentUser();
 const auth=u?`<div class="dropdown"><button class="btn btn-cv dropdown-toggle" data-bs-toggle="dropdown">👤 ${u.name.split(' ')[0]}</button><ul class="dropdown-menu dropdown-menu-end"><li><a class="dropdown-item" href="my-registrations.html">My dashboard</a></li><li><button class="dropdown-item" onclick="logout()">Log out</button></li></ul></div>`
  :`<a class="btn btn-cv" href="login.html">Login / Register</a>`;
 $('#nav').innerHTML=`<nav class="navbar navbar-expand-lg navbar-dark cv-nav sticky-top"><div class="container">
 <a class="navbar-brand brand" href="index.html"><span class="logo">CV</span><span>Campus<em>Vibe</em></span></a>
 <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#menu" aria-label="Menu"><span class="navbar-toggler-icon"></span></button>
 <div class="collapse navbar-collapse" id="menu"><ul class="navbar-nav ms-auto align-items-lg-center gap-lg-1">
 ${links.map(l=>`<li class="nav-item"><a class="nav-link ${l[0]===cur?'active':''}" href="${l[0]}">${l[1]}</a></li>`).join('')}
 <li class="ms-lg-2 mt-2 mt-lg-0">${auth}</li></ul></div></div></nav>`;
 $('#footer').innerHTML=`<div class="container"><div class="row g-4">
 <div class="col-lg-4"><div class="brand mb-2"><span class="logo">CV</span><span>Campus<em>Vibe</em></span></div><p class="small">Discover. Participate. Celebrate.<br>The official college events and registration portal.</p></div>
 <div class="col-6 col-lg-2"><h6>Quick Links</h6><ul class="list-unstyled small">${links.map(l=>`<li><a href="${l[0]}">${l[1]}</a></li>`).join('')}</ul></div>
 <div class="col-6 col-lg-3"><h6>Contact</h6><ul class="list-unstyled small"><li>events@campusvibe.edu</li><li>+91 98765 43210</li><li>Vellore Campus, Tamil Nadu</li></ul></div>
 <div class="col-lg-3"><h6>Follow Us</h6><ul class="list-inline small"><li class="list-inline-item"><a href="https://facebook.com" target="_blank" rel="noopener">Facebook</a></li><li class="list-inline-item"><a href="https://instagram.com" target="_blank" rel="noopener">Instagram</a></li><li class="list-inline-item"><a href="https://linkedin.com" target="_blank" rel="noopener">LinkedIn</a></li></ul></div></div>
 <hr><p class="small mb-0 text-center">© <span class="year"></span> CampusVibe. All rights reserved. Academic mini project - LocalStorage login is for demonstration only.</p></div>`;
 $$('.year').forEach(s=>s.textContent=new Date().getFullYear());
 document.body.insertAdjacentHTML('beforeend',`<div class="modal fade" id="cvModal" tabindex="-1"><div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h5 class="modal-title"></h5><button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body"></div><div class="modal-footer"><button class="btn btn-light rounded-pill" data-bs-dismiss="modal">Close</button><button class="btn btn-cv" id="cvOk"></button></div></div></div></div>`);
}

/* home page widgets */
function startCountdown(){
 const box=$('#countdown');if(!box)return;
 const next=EVENTS.filter(e=>!isPast(e)).sort((a,b)=>a.date.localeCompare(b.date))[0];if(!next)return;
 $('#nextTitle').textContent=next.title;$('#nextMeta').textContent=fmt(next.date)+' · '+next.venue;$('#nextLink').href='event-details.html?id='+next.id;
 const tick=()=>{const s=Math.max(0,Math.floor((new Date(next.date+'T09:00')-new Date())/1000));
  box.innerHTML=[['Days',Math.floor(s/86400)],['Hours',Math.floor(s%86400/3600)],['Mins',Math.floor(s%3600/60)],['Secs',s%60]].map(([l,v])=>`<div><b>${v}</b><small>${l}</small></div>`).join('')};
 tick();setInterval(tick,1000);
}
function animateStats(){
 $$('[data-count]').forEach(el=>{const to=+el.dataset.count,step=Math.ceil(to/50);let n=0;
  const t=setInterval(()=>{n=Math.min(to,n+step);el.textContent=n.toLocaleString()+(el.dataset.suffix||'');if(n>=to)clearInterval(t)},30)});
}
document.addEventListener('DOMContentLoaded',()=>{
 seed();renderChrome();startCountdown();animateStats();
 if($('#featured'))$('#featured').innerHTML=EVENTS.filter(e=>e.featured).map(eventCard).join('');
 if($('#upcoming'))$('#upcoming').innerHTML=EVENTS.filter(e=>!isPast(e)).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,5)
  .map(e=>`<li class="list-group-item d-flex justify-content-between align-items-center gap-3"><div class="ms-2 me-auto"><a class="fw-semibold text-decoration-none" href="event-details.html?id=${e.id}">${e.title}</a><div class="small text-muted">${fmt(e.date)} · ${e.venue}</div></div><span class="badge rounded-pill bg-light text-dark">${e.cat}</span></li>`).join('');
});
