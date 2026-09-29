// La source de la dernière campagne reconnue reste disponible pendant cette session.
const ATTRIBUTION_KEY='p2f_ad_source';
const CONSENT_KEY='p2f_ads_consent';
let advertisingConsent=false;
let googleTagLoaded=false;
let metaPixelLoaded=false;

function getLeadSource(){
  const params=new URLSearchParams(window.location.search);
  const utm=(params.get('utm_source')||'').toLowerCase();
  let source=null;
  if(utm==='meta'||utm==='facebook'||utm==='instagram')source='Meta Ads';
  else if(utm==='google'||params.has('gclid')||params.has('gbraid')||params.has('wbraid'))source='Google Ads';
  else if(utm)source='Autre campagne';
  if(source){
    try{sessionStorage.setItem(ATTRIBUTION_KEY,source);}catch(error){}
    return source;
  }
  try{return sessionStorage.getItem(ATTRIBUTION_KEY)||'Direct / autre';}
  catch(error){return 'Direct / autre';}
}
const leadSource=getLeadSource();

function updateGoogleAdsPhoneLinks(formattedNumber,mobileNumber){
  if(!formattedNumber||!mobileNumber)return;
  document.querySelectorAll('a[href="tel:0663994335"]').forEach(link=>{
    link.href='tel:'+mobileNumber;
    const textNodes=document.createTreeWalker(link,NodeFilter.SHOW_TEXT);
    let node;
    while((node=textNodes.nextNode())){
      if(node.nodeValue.trim()==='06 63 99 43 35')node.nodeValue=formattedNumber;
    }
  });
}

function loadGoogleAds(){
  // Une arrivée Meta ne charge pas le suivi des appels Google de cette visite.
  if(googleTagLoaded||leadSource==='Meta Ads')return;
  googleTagLoaded=true;
  window.dataLayer=window.dataLayer||[];
  window.gtag=function(){window.dataLayer.push(arguments);};
  window.gtag('js',new Date());
  window.gtag('config','AW-18366684334');
  window.gtag('config','AW-18366684334/EpwpCKqpjIUdEK659bVE',{
    phone_conversion_number:'06 63 99 43 35',
    phone_conversion_callback:updateGoogleAdsPhoneLinks
  });
  const script=document.createElement('script');
  script.async=true;
  script.src='https://www.googletagmanager.com/gtag/js?id=AW-18366684334';
  document.head.appendChild(script);
}

function loadMetaPixel(){
  const id=String(window.P2F_META_PIXEL_ID||'').trim();
  if(metaPixelLoaded||!/^\d{8,20}$/.test(id))return;
  metaPixelLoaded=true;
  const fbq=window.fbq=function(){fbq.callMethod?fbq.callMethod.apply(fbq,arguments):fbq.queue.push(arguments);};
  fbq.queue=[];fbq.loaded=true;fbq.version='2.0';
  window._fbq=fbq;
  fbq('init',id);
  fbq('track','PageView');
  const script=document.createElement('script');
  script.async=true;
  script.src='https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);
}

function setAdvertisingConsent(accepted){
  try{localStorage.setItem(CONSENT_KEY,accepted?'accepted':'rejected');}catch(error){}
  if(!accepted&&advertisingConsent){
    // Les bibliothèques déjà chargées ne peuvent pas être retirées sans recharger la page.
    window.location.reload();
    return;
  }
  advertisingConsent=accepted;
  document.getElementById('trackingConsent').hidden=true;
  if(accepted){loadGoogleAds();loadMetaPixel();}
}
document.addEventListener('DOMContentLoaded',()=>{
  const panel=document.getElementById('trackingConsent');
  let choice=null;
  try{choice=localStorage.getItem(CONSENT_KEY);}catch(error){}
  document.getElementById('trackingSettings').addEventListener('click',()=>{panel.hidden=false;});
  document.getElementById('trackingReject').addEventListener('click',()=>setAdvertisingConsent(false));
  document.getElementById('trackingAccept').addEventListener('click',()=>setAdvertisingConsent(true));
  if(choice==='accepted')setAdvertisingConsent(true);
  else if(choice!=='rejected')panel.hidden=false;
});

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
  if(!advertisingConsent||leadSource!=='Google Ads'||typeof window.gtag!=='function')return;
  window.gtag('event','conversion',{
    'send_to':'AW-18366684334/v8R5CMz88O4cEK659bVE',
    'value':1.0,
    'currency':'EUR'
  });
}

function trackMetaLead(){
  if(advertisingConsent&&metaPixelLoaded&&typeof window.fbq==='function')window.fbq('track','Lead');
}

async function submitForm(e){
  e.preventDefault();

  const form=e.target;
  if(form.dataset.submitting==='true')return;
  form.dataset.submitting='true';
  const data=new FormData(form);
  const telephone=(data.get('telephone')||'').trim();
  const email=(data.get('email')||'').trim();

  if(!telephone&&!email){
    setFormStatus(form,'Merci d’indiquer un numéro de téléphone ou une adresse e-mail.','error');
    form.dataset.submitting='false';
    return;
  }

  const button=form.querySelector('button[type="submit"]');
  const initialText=button?button.textContent:'';
  if(button){
    button.disabled=true;
    button.textContent='ENVOI EN COURS…';
  }

  data.set('source',leadSource);
  data.set('_subject','Nouvelle demande de contact - Source : '+leadSource+' - '+(data.get('nom')||'Site Prise 2 Froid'));

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
    trackMetaLead();
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
    form.dataset.submitting='false';
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
