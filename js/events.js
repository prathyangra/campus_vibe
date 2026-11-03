/* events.js - Explore page, event details page, clubs page */
let activeCat='All';
function renderGrid(){
 const q=$('#search').value.trim().toLowerCase();
 const list=EVENTS.filter(e=>(activeCat==='All'||e.cat===activeCat)&&(e.title+' '+e.short+' '+e.venue).toLowerCase().includes(q));
 $('#grid').innerHTML=list.map(eventCard).join('');
 $('#empty').classList.toggle('d-none',list.length>0);
 $('#count').textContent=list.length+(list.length===1?' event found':' events found');
}
function initExplore(){
 const p=new URLSearchParams(location.search).get('cat');
 if(['Technical','Cultural','Sports','Workshops'].includes(p))activeCat=p;
 $$('.chip').forEach(b=>{
  b.classList.toggle('active',b.dataset.cat===activeCat);
  b.addEventListener('click',()=>{activeCat=b.dataset.cat;$$('.chip').forEach(x=>x.classList.toggle('active',x===b));renderGrid()});
 });
 const s=$('#search');
 s.addEventListener('input',renderGrid);
 s.addEventListener('keydown',ev=>{if(ev.key==='Escape'){s.value='';renderGrid()}});
 renderGrid();
}
function showDetail(){
 const id=+new URLSearchParams(location.search).get('id'),e=EVENTS.find(x=>x.id===id),box=$('#detail');
 if(!e){box.innerHTML='<div class="alert alert-warning">Event not found. <a href="events.html">Browse all events</a>.</div>';return}
 document.title=e.title+' | CampusVibe';
 const st=regState(e),left=seatsLeft(e),pct=Math.round((e.seats-left)/e.seats*100);
 const btn={open:['Register Now','btn-cv'],registered:['✓ Already Registered','btn-success'],full:['Event Full','btn-secondary'],closed:['Registration Closed','btn-secondary']}[st];
 box.innerHTML=`<div class="row g-4">
 <div class="col-lg-8"><div class="poster big g${e.g}"><span class="emoji">${e.emoji}</span><span class="badge-cat">${e.cat}</span></div>
 <h1 class="h2 mt-4">${e.title}</h1><p>${e.desc}</p>
 <h2 class="h5 mt-4">Rules and guidelines</h2><ul>${e.rules.map(r=>`<li>${r}</li>`).join('')}</ul>
 <h2 class="h5 mt-4">Eligibility</h2><p>${e.elig}</p></div>
 <div class="col-lg-4"><aside class="form-card sticky-lg-top" style="top:90px">
 <table class="table table-borderless small mb-3"><tbody>
 <tr><th>Category</th><td>${e.cat}</td></tr><tr><th>Date</th><td>${fmt(e.date)}</td></tr><tr><th>Time</th><td>${e.time}</td></tr>
 <tr><th>Venue</th><td>${e.venue}</td></tr><tr><th>Deadline</th><td>${fmt(e.deadline)}</td></tr></tbody></table>
 <div class="d-flex justify-content-between small mb-1"><span>Seats filled</span><b>${left} of ${e.seats} left</b></div>
 <div class="progress mb-4" style="height:8px"><div class="progress-bar" style="width:${pct}%;background:var(--purple)"></div></div>
 <button class="btn ${btn[1]} w-100" ${st==='open'?'':'disabled'} onclick="registerFor(${e.id})">${btn[0]}</button>
 <a class="btn btn-link w-100 mt-2" href="events.html">← Back to events</a></aside></div></div>`;
}
function clubInfo(i){
 const c=CLUBS[i];
 openModal(c.emoji+' '+c.name,`<p>${c.desc}</p><ul><li>Activities<ul>${c.acts.map(a=>`<li>${a}</li>`).join('')}</ul></li><li>How to join<ul><li>${c.join}</li></ul></li></ul>`);
}
function initClubs(){
 $('#clubGrid').innerHTML=CLUBS.map((c,i)=>`<div class="col-sm-6 col-lg-3"><article class="ev-card club h-100 p-4 text-center">
 <div class="club-icon">${c.emoji}</div><h3 class="h5">${c.name}</h3><p class="small">${c.desc}</p>
 <p class="small text-muted mb-3">${c.acts.join(' · ')}</p><button class="btn btn-cv btn-sm" onclick="clubInfo(${i})">Explore Club</button></article></div>`).join('');
}
document.addEventListener('DOMContentLoaded',()=>{
 if($('#grid'))initExplore();
 if($('#detail'))showDetail();
 if($('#clubGrid'))initClubs();
});
