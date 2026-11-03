/* contact.js - feedback form, stored locally for demonstration */
document.addEventListener('DOMContentLoaded',()=>{
 const f=$('#feedbackForm');if(!f)return;
 const u=currentUser();if(u){$('#cname').value=u.name;$('#cemail').value=u.email}
 f.addEventListener('submit',ev=>{
  ev.preventDefault();
  const n=$('#cname').value.trim(),m=$('#cemail').value.trim(),s=$('#subject').value.trim(),t=$('#message').value.trim();
  let ok=setErr('cname',/^[A-Za-z ]{3,}$/.test(n)?'':'Enter your name (alphabets and spaces only).');
  ok=setErr('cemail',/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m)?'':'Enter a valid email address.')&&ok;
  ok=setErr('subject',s.length>=3?'':'Enter a subject.')&&ok;
  ok=setErr('message',t.length>=10?'':'Message must be at least 10 characters.')&&ok;
  if(!ok)return;
  const fb=store.get('cv_feedback',[]);fb.push({name:n,email:m,subject:s,message:t,date:new Date().toISOString()});store.set('cv_feedback',fb);
  $('#msg').innerHTML='<div class="alert alert-success">Thank you! Your feedback has been submitted.</div>';f.reset();
 });
 $('#message').addEventListener('input',e=>{$('#charCount').textContent=e.target.value.length+' characters'});
});
