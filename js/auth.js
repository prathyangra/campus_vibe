/* auth.js - login + registration (LocalStorage demo only, NOT secure) */
const RE={name:/^[A-Za-z][A-Za-z ]{2,}$/,reg:/^[A-Za-z0-9]{6,15}$/,email:/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,pass:/^(?=.*[A-Za-z])(?=.*\d).{6,}$/};
const val=id=>$('#'+id).value.trim();
function nextUrl(){const n=new URLSearchParams(location.search).get('next');return n&&/^[\w\-]+\.html(\?[\w=&%\-]*)?$/.test(n)?n:'index.html'}
function showMsg(t,type){$('#msg').innerHTML=`<div class="alert alert-${type}">${t}</div>`}

function handleRegister(ev){
 ev.preventDefault();
 const v={name:val('name'),regNo:val('regNo'),email:val('email').toLowerCase(),password:$('#password').value,confirm:$('#confirm').value,dept:val('dept'),year:val('year'),gender:($('input[name=gender]:checked')||{}).value};
 let ok=true;
 ok=setErr('name',!v.name?'Full name is required.':!RE.name.test(v.name)?'Use alphabets and spaces only (min 3 letters).':'')&&ok;
 ok=setErr('regNo',!v.regNo?'Registration number is required.':!RE.reg.test(v.regNo)?'Use 6-15 letters or digits.':'')&&ok;
 ok=setErr('email',!v.email?'Email is required.':!RE.email.test(v.email)?'Enter a valid email address.':'')&&ok;
 ok=setErr('password',!v.password?'Password is required.':!RE.pass.test(v.password)?'Min 6 characters with at least one letter and one number.':'')&&ok;
 ok=setErr('confirm',!v.confirm?'Please confirm your password.':v.confirm!==v.password?'Passwords do not match.':'')&&ok;
 ok=setErr('dept',v.dept?'':'Select your department.')&&ok;
 ok=setErr('year',v.year?'':'Select your year of study.')&&ok;
 ok=setErr('gender',v.gender?'':'Select a gender.')&&ok;
 if(!ok)return;
 const users=store.get('cv_users',[]);
 if(users.some(u=>u.email===v.email||u.regNo.toLowerCase()===v.regNo.toLowerCase())){showMsg('A student with this email or registration number already exists.','danger');return}
 delete v.confirm;users.push(v);store.set('cv_users',users);
 showMsg('Registration successful! Redirecting to login...','success');
 setTimeout(()=>location.href='login.html',1200);
}
function handleLogin(ev){
 ev.preventDefault();
 const id=val('ident').toLowerCase(),pw=$('#lpass').value;
 let ok=setErr('ident',id?'':'Enter your email or registration number.');
 ok=setErr('lpass',pw?'':'Enter your password.')&&ok;
 if(!ok)return;
 const u=store.get('cv_users',[]).find(x=>x.email===id||x.regNo.toLowerCase()===id);
 if(!u){setErr('ident','No student found with these details.');return}
 if(u.password!==pw){setErr('lpass','Incorrect password.');return}
 const s=JSON.stringify({email:u.email});
 ($('#remember').checked?localStorage:sessionStorage).setItem('cv_session',s);
 showMsg('Login successful! Welcome, '+u.name+'.','success');
 setTimeout(()=>location.href=nextUrl(),900);
}
document.addEventListener('DOMContentLoaded',()=>{
 const r=$('#regForm'),l=$('#loginForm');
 if(r)r.addEventListener('submit',handleRegister);
 if(l){l.addEventListener('submit',handleLogin);const nx=$('#toReg');if(nx)nx.href='register.html'}
 $$('.live input,.live select').forEach(i=>i.addEventListener('input',()=>setErr(i.id,'')));
});
