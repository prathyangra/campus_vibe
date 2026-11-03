/* registration.js - event registration + student dashboard */
const getRegs=()=>store.get('cv_regs',[]);
function seatsLeft(e){return e.seats-e.filled-getRegs().filter(r=>r.eventId===e.id).length}
function regState(e){
 const u=currentUser();
 if(u&&getRegs().some(r=>r.email===u.email&&r.eventId===e.id))return 'registered';
 if(new Date(e.deadline+'T23:59:59')<new Date())return 'closed';
 if(seatsLeft(e)<=0)return 'full';
 return 'open';
}
function registerFor(id){
 const e=EVENTS.find(x=>x.id===id),u=currentUser();
 if(!u){location.href='login.html?next='+encodeURIComponent('event-details.html?id='+id);return}
 const st=regState(e);
 if(st!=='open'){toast(st==='registered'?'You are already registered.':st==='full'?'Sorry, this event is full.':'Registration is closed.','danger');return}
 openModal('Confirm registration',`Register for <b>${e.title}</b> on ${fmt(e.date)}?`,'Yes, register',()=>{
  const regs=getRegs();regs.push({email:u.email,eventId:id,date:new Date().toISOString().slice(0,10)});
  store.set('cv_regs',regs);toast('Registration successful! See it in My Registrations.');showDetail();
 });
}
function cancelReg(id){
 const u=currentUser(),e=EVENTS.find(x=>x.id===id);
 openModal('Cancel registration',`Cancel your registration for <b>${e.title}</b>?`,'Yes, cancel it',()=>{
  store.set('cv_regs',getRegs().filter(r=>!(r.email===u.email&&r.eventId===id)));toast('Registration cancelled.','danger');initDash();
 });
}
function initDash(){
 const u=currentUser();
 if(!u){location.href='login.html?next=my-registrations.html';return}
 const mine=getRegs().filter(r=>r.email===u.email).map(r=>({r,e:EVENTS.find(x=>x.id===r.eventId)})).filter(x=>x.e);
 const up=mine.filter(x=>!isPast(x.e)).length,fe=getFavs().map(id=>EVENTS.find(e=>e.id===id)).filter(Boolean);
 $('#welcome').textContent='Welcome back, '+u.name.split(' ')[0];
 $('#s_total').textContent=mine.length;$('#s_up').textContent=up;$('#s_done').textContent=mine.length-up;$('#s_fav').textContent=fe.length;
 $('#profile').innerHTML=[['Name',u.name],['Registration No.',u.regNo],['Email',u.email],['Department',u.dept],['Year',u.year]].map(([k,v])=>`<tr><th>${k}</th><td>${v}</td></tr>`).join('');
 $('#regBody').innerHTML=mine.map(({r,e})=>{const past=isPast(e);return `<tr><td class="fw-semibold">${e.title}</td><td>${e.cat}</td><td>${fmt(r.date)}</td><td>${fmt(e.date)}</td><td>${e.venue}</td>
 <td><span class="badge rounded-pill ${past?'bg-secondary':'bg-success'}">${past?'Completed':'Confirmed'}</span></td>
 <td class="text-nowrap"><a class="btn btn-sm btn-outline-secondary rounded-pill" href="event-details.html?id=${e.id}">View</a> ${past?'':`<button class="btn btn-sm btn-outline-danger rounded-pill" onclick="cancelReg(${e.id})">Cancel</button>`}</td></tr>`}).join('');
 $('#regTable').classList.toggle('d-none',!mine.length);$('#noReg').classList.toggle('d-none',mine.length>0);
 $('#favGrid').innerHTML=fe.map(e=>`<div class="col-md-6 col-lg-4"><div class="ev-card p-3 d-flex justify-content-between align-items-center gap-2"><div><h3 class="h6 mb-0">${e.title}</h3><small class="text-muted">${fmt(e.date)}</small></div>
 <div class="d-flex gap-2"><a class="btn btn-sm btn-cv" href="event-details.html?id=${e.id}">View</a><button class="btn btn-sm btn-outline-danger rounded-pill" onclick="toggleFav(${e.id})">Remove</button></div></div></div>`).join('');
 $('#noFav').classList.toggle('d-none',fe.length>0);
}
document.addEventListener('DOMContentLoaded',()=>{if($('#dash')){window.afterFav=initDash;initDash()}});
