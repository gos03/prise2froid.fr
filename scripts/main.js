function openLightbox(src){
  const l=document.getElementById('lightbox');
  document.getElementById('lightbox-img').src=src;
  l.classList.add('active');
}

function closeLightbox(){
  document.getElementById('lightbox').classList.remove('active');
}

function setFormStatus(form,message,type){
  let status=document.getElementById('contactFormStatus');
  if(!status){
    status=document.createElement('div');
    status.id='contactFormStatus';
    status.setAttribute('role','status');
    status.setAttribute('aria-live','polite');
    status.style.marginTop='12px';
    status.style.padding='12px 14px';
    status.style.borderRadius='10px';
    status.style.fontWeight='700';
    status.style.lineHeight='1.4';
    form.appendChild(status);
  }
  status.textContent=message;
  if(type==='success'){
    status.style.background='#e8f7ec';
    status.style.color='#166534';
    status.style.border='1px solid #b7dfc2';
  }else{
    status.style.background='#fff0f0';
    status.style.color='#9f1d2d';
    status.style.border='1px solid #efc1c7';
  }
}

function trackGoogleAdsLead(){
  if(typeof window.gtag!=='function')return;
  window.gtag('event','conversion',{
    'send_to':'AW-18366684334/v8R5CMz88O4cEK659bVE',
    'value':1.0,
    'currency':'EUR'
  });
}

async function submitForm(e){
  e.preventDefault();

  const form=e.target;
  const data=new FormData(form);
  const telephone=(data.get('telephone')||'').trim();
  const email=(data.get('email')||'').trim();

  if(!telephone&&!email){
    setFormStatus(form,'Merci d’indiquer un numéro de téléphone ou une adresse e-mail.','error');
    return;
  }

  const button=form.querySelector('button[type="submit"]');
  const initialText=button?button.textContent:'';
  if(button){
    button.disabled=true;
    button.textContent='ENVOI EN COURS…';
  }

  data.append('_subject','Nouvelle demande de contact - '+(data.get('nom')||'Site Prise 2 Froid'));

  try{
    const response=await fetch('https://formspree.io/f/xdeodjjg',{
      method:'POST',
      body:data,
      headers:{'Accept':'application/json'}
    });

    if(!response.ok){
      throw new Error('Formspree error');
    }

    trackGoogleAdsLead();
    form.reset();
    setFormStatus(
      form,
      'Merci, votre demande a bien été envoyée. Prise 2 Froid vous recontactera rapidement.',
      'success'
    );
  }catch(error){
    setFormStatus(
      form,
      'Votre demande n’a pas pu être envoyée. Vous pouvez nous appeler au 06 63 99 43 35 ou réessayer dans quelques instants.',
      'error'
    );
  }finally{
    if(button){
      button.disabled=false;
      button.textContent=initialText;
    }
  }
}

document.addEventListener('keydown',e=>{
  if(e.key==='Escape')closeLightbox();
});

let carouselIndex=0;
function carouselVisible(){
  return window.innerWidth<=600?1:window.innerWidth<=900?2:3;
}
function renderCarousel(){
  const track=document.getElementById('carouselTrack'),dots=document.getElementById('carouselDots');
  if(!track||!dots)return;
  const slides=[...track.children],visible=carouselVisible(),max=Math.max(0,slides.length-visible);
  carouselIndex=Math.min(carouselIndex,max);
  const step=slides[0].getBoundingClientRect().width+15;
  track.style.transform='translateX('+(-carouselIndex*step)+'px)';
  dots.innerHTML='';
  for(let i=0;i<=max;i++){
    const d=document.createElement('button');
    d.type='button';
    d.className='carousel-dot'+(i===carouselIndex?' active':'');
    d.setAttribute('aria-label','Afficher la position '+(i+1));
    d.onclick=()=>goCarousel(i);
    dots.appendChild(d);
  }
  const prev=document.querySelector('.carousel-prev'),next=document.querySelector('.carousel-next');
  if(prev)prev.disabled=carouselIndex===0;
  if(next)next.disabled=carouselIndex===max;
}
function moveCarousel(direction){
  carouselIndex+=direction;
  renderCarousel();
}
function goCarousel(index){
  carouselIndex=index;
  renderCarousel();
}
window.addEventListener('resize',renderCarousel);
document.addEventListener('DOMContentLoaded',()=>{
  const viewport=document.getElementById('carouselViewport');
  let startX=0;
  if(viewport){
    viewport.addEventListener('touchstart',e=>startX=e.touches[0].clientX,{passive:true});
    viewport.addEventListener('touchend',e=>{
      const delta=e.changedTouches[0].clientX-startX;
      if(Math.abs(delta)>45)moveCarousel(delta<0?1:-1);
    },{passive:true});
  }
  renderCarousel();
});

function openPacStory(event){
  event.preventDefault();
  const section=document.getElementById('pac-air-air');
  if(!section)return;
  section.classList.add('is-open');
  event.currentTarget.setAttribute('aria-expanded','true');
  requestAnimationFrame(()=>section.scrollIntoView({behavior:'smooth',block:'start'}));
}
document.addEventListener('DOMContentLoaded',()=>{
  const trigger=document.querySelector('.pac-card');
  if(trigger)trigger.addEventListener('click',openPacStory);
});
