function openLightbox(src){const l=document.getElementById('lightbox');document.getElementById('lightbox-img').src=src;l.classList.add('active')}function closeLightbox(){document.getElementById('lightbox').classList.remove('active')}function submitForm(e){e.preventDefault();const f=new FormData(e.target),telephone=(f.get('telephone')||'').trim(),email=(f.get('email')||'').trim();if(!telephone&&!email){alert('Merci d’indiquer un numéro de téléphone ou une adresse e-mail.');return}const contact=f.get('contact')||'Peu importe',subject='Nouvelle demande de contact - '+f.get('nom'),body=`Bonjour Prise 2 Froid,\n\nJe souhaite être contacté concernant mon projet.\n\nNom : ${f.get('nom')}\nTéléphone : ${telephone||'Non renseigné'}\nE-mail : ${email||'Non renseignée'}\nCommune : ${f.get('commune')}\nProjet : ${f.get('projet')}\nPréférence de contact : ${contact}\nMessage : ${f.get('message')||'Aucun message'}`;window.location.href='mailto:prise2froid@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body)}document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox()});
let carouselIndex=0;function carouselVisible(){return window.innerWidth<=600?1:window.innerWidth<=900?2:3}function renderCarousel(){const track=document.getElementById('carouselTrack'),dots=document.getElementById('carouselDots');if(!track||!dots)return;const slides=[...track.children],visible=carouselVisible(),max=Math.max(0,slides.length-visible);carouselIndex=Math.min(carouselIndex,max);const step=slides[0].getBoundingClientRect().width+15;track.style.transform='translateX('+(-carouselIndex*step)+'px)';dots.innerHTML='';for(let i=0;i<=max;i++){const d=document.createElement('button');d.type='button';d.className='carousel-dot'+(i===carouselIndex?' active':'');d.setAttribute('aria-label','Afficher la position '+(i+1));d.onclick=()=>goCarousel(i);dots.appendChild(d)}const prev=document.querySelector('.carousel-prev'),next=document.querySelector('.carousel-next');if(prev)prev.disabled=carouselIndex===0;if(next)next.disabled=carouselIndex===max}function moveCarousel(direction){carouselIndex+=direction;renderCarousel()}function goCarousel(index){carouselIndex=index;renderCarousel()}window.addEventListener('resize',renderCarousel);document.addEventListener('DOMContentLoaded',()=>{const viewport=document.getElementById('carouselViewport');let startX=0;if(viewport){viewport.addEventListener('touchstart',e=>startX=e.touches[0].clientX,{passive:true});viewport.addEventListener('touchend',e=>{const delta=e.changedTouches[0].clientX-startX;if(Math.abs(delta)>45)moveCarousel(delta<0?1:-1)},{passive:true})}renderCarousel()});

// Carte Pompe à chaleur PAC air/air + accès à la page pédagogique.
document.addEventListener('DOMContentLoaded',()=>{
  const cards=document.querySelector('#solutions .cards');
  if(cards&&!cards.querySelector('.pac-air-card')){
    const pac=document.createElement('a');
    pac.className='card pac-air-card';
    pac.href='pompe-a-chaleur-air-air.html';
    pac.innerHTML='<div class="pac-air-visual" aria-hidden="true"><span>☀️</span><strong>PAC<br>AIR/AIR</strong><span>❄️</span></div><div><h3>POMPE À CHALEUR<br>PAC AIR/AIR</h3><span>Climatisation réversible • Chauffage l’hiver • Fraîcheur l’été</span><b class="pac-air-link">EN SAVOIR PLUS →</b></div>';
    cards.prepend(pac);
  }

  const projectSelect=document.querySelector('#contactForm select[name="projet"]');
  if(projectSelect&&![...projectSelect.options].some(o=>o.value==='Pompe à chaleur PAC air/air')){
    const option=document.createElement('option');
    option.value='Pompe à chaleur PAC air/air';
    option.textContent='Pompe à chaleur PAC air/air';
    projectSelect.prepend(option);
  }

  if(!document.getElementById('pac-air-card-styles')){
    const style=document.createElement('style');
    style.id='pac-air-card-styles';
    style.textContent=`
      #solutions .cards{grid-template-columns:repeat(4,minmax(0,1fr));gap:20px}
      .pac-air-card{border:2px solid #d7192d;position:relative}
      .pac-air-card:hover{transform:translateY(-4px);box-shadow:0 16px 34px #0003}
      .pac-air-visual{height:265px;padding:0!important;background:linear-gradient(135deg,#081c3a,#123d70);display:grid;grid-template-columns:1fr auto 1fr;align-items:center;justify-items:center;color:#fff}
      .pac-air-visual span{font-size:42px;color:#fff}
      .pac-air-visual strong{font-size:25px;line-height:1.05;text-align:center;color:#fff;background:#d7192d;border-radius:50%;width:112px;height:112px;display:flex;align-items:center;justify-content:center}
      .pac-air-card h3{font-size:22px}
      .pac-air-link{display:block;color:#d7192d;font-size:12px;margin-top:13px}
      @media(max-width:1050px){#solutions .cards{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:600px){#solutions .cards{grid-template-columns:1fr}.pac-air-visual{height:240px}}
    `;
    document.head.appendChild(style);
  }
});