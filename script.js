(function(){
  var WA = "56942294670";
  var INTERVALO = 7000;          /* 7 s por diapositiva */

  /* Carrusel del hero */
  var slides = document.querySelectorAll('.hslide');
  var fondos = document.querySelectorAll('.hero-bg');
  var barsBox = document.getElementById('bars');
  var i = 0, timer;
  slides.forEach(function(_, n){
    var b = document.createElement('button');
    b.className = 'bar' + (n === 0 ? ' on' : '');
    b.setAttribute('aria-label', 'Mensaje ' + (n + 1));
    b.innerHTML = '<span></span>';
    b.addEventListener('click', function(){ go(n); reset(); });
    barsBox.appendChild(b);
  });
  var bars = barsBox.querySelectorAll('.bar');
  function go(n){
    slides[i].classList.remove('on');
    bars[i].classList.remove('on');
    if (fondos[i]) fondos[i].classList.remove('on');
    i = n;
    slides[i].classList.add('on');
    if (fondos[i]) {
      var f = fondos[i], clon = f.cloneNode(true);   /* reinicia el ken burns */
      f.parentNode.replaceChild(clon, f);
      fondos = document.querySelectorAll('.hero-bg');
      fondos[i].classList.add('on');
    }
    var b = bars[i], nuevo = b.cloneNode(true);
    nuevo.addEventListener('click', function(){ go(n); reset(); });
    b.parentNode.replaceChild(nuevo, b);
    bars = barsBox.querySelectorAll('.bar');
    bars[i].classList.add('on');
  }
  function next(){ go((i + 1) % slides.length); }
  function reset(){ clearInterval(timer); timer = setInterval(next, INTERVALO); }
  reset();

  /* Filtros */
  var botones = document.querySelectorAll('.filtro');
  var cards = document.querySelectorAll('.card');
  botones.forEach(function(b){
    b.addEventListener('click', function(){
      botones.forEach(function(x){ x.classList.remove('on'); });
      b.classList.add('on');
      var f = b.dataset.f;
      cards.forEach(function(c){
        c.style.display = (f === 'todos' || c.dataset.cat === f) ? '' : 'none';
      });
    });
  });

  /* Lightbox */
  var lb = document.getElementById('lb'), lbimg = document.getElementById('lbimg');
  document.querySelectorAll('.card-media img, .consid img').forEach(function(img){
    (img.closest('.card-media') || img).addEventListener('click', function(){
      lbimg.src = img.src; lbimg.alt = img.alt; lb.classList.add('on');
    });
  });
  function cerrar(){ lb.classList.remove('on'); }
  lb.addEventListener('click', cerrar);
  document.getElementById('lbx').addEventListener('click', cerrar);
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') cerrar(); });

  /* Menús desplegables del navbar */
  var conMenu   = [].slice.call(document.querySelectorAll('.nav-links > li.tiene-menu'));
  var navLinks  = document.getElementById('menu-principal');
  var navToggle = document.querySelector('.nav-toggle');
  var esEscritorio = function(){ return window.matchMedia('(min-width: 901px)').matches; };

  function cerrarMenus(){
    conMenu.forEach(function(li){
      li.classList.remove('abierto');
      li.querySelector('.nav-btn').setAttribute('aria-expanded', 'false');
    });
  }
  function abrirMenu(li){
    cerrarMenus();
    li.classList.add('abierto');
    li.querySelector('.nav-btn').setAttribute('aria-expanded', 'true');
  }
  function cerrarNav(){
    navLinks.classList.remove('abierto');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir el menú');
  }

  conMenu.forEach(function(li){
    var btn = li.querySelector('.nav-btn');
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      if (li.classList.contains('abierto')) { cerrarMenus(); } else { abrirMenu(li); }
    });
    li.addEventListener('mouseenter', function(){ if (esEscritorio()) abrirMenu(li); });
    li.addEventListener('mouseleave', function(){ if (esEscritorio()) cerrarMenus(); });
  });

  navToggle.addEventListener('click', function(e){
    e.stopPropagation();
    var abierto = navLinks.classList.toggle('abierto');
    navToggle.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    navToggle.setAttribute('aria-label', abierto ? 'Cerrar el menú' : 'Abrir el menú');
    if (!abierto) cerrarMenus();
  });

  document.addEventListener('click', function(){ cerrarMenus(); cerrarNav(); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape'){ cerrarMenus(); cerrarNav(); } });
  window.addEventListener('resize', function(){ if (esEscritorio()) cerrarNav(); });

  /* Submenú Catálogo -> aplica el filtro correspondiente */
  document.querySelectorAll('[data-filtro]').forEach(function(a){
    a.addEventListener('click', function(){
      var b = document.querySelector('.filtro[data-f="' + a.dataset.filtro + '"]');
      if (b) b.click();
      cerrarMenus(); cerrarNav();
    });
  });

  /* Submenú Zonas -> destaca la comuna elegida */
  var destacada;
  document.querySelectorAll('[data-zona]').forEach(function(a){
    a.addEventListener('click', function(){
      var z = document.getElementById(a.dataset.zona);
      if (z){
        if (destacada) destacada.classList.remove('zona--activa');
        z.classList.add('zona--activa');
        destacada = z;
        setTimeout(function(){ z.classList.remove('zona--activa'); }, 2800);
      }
      cerrarMenus(); cerrarNav();
    });
  });

  /* FAQ: acordeón (solo una pregunta abierta a la vez) */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function(item){
    item.addEventListener('toggle', function(){
      if (item.open){
        faqItems.forEach(function(otro){ if (otro !== item) otro.open = false; });
      }
    });
  });

  /* Formulario -> WhatsApp */
  document.getElementById('form').addEventListener('submit', function(e){
    e.preventDefault();
    /* Honeypot anti-bots: campo oculto que un humano nunca completa */
    if (document.getElementById('web').value.trim() !== '') return;
    var v = function(id){ return document.getElementById(id).value.trim(); };
    var t = "Hola! Quiero agendar un inflable.\n\n";
    t += "Nombre: " + v('nombre') + "\n";
    t += "Telefono: " + v('fono') + "\n";
    t += "Juego: " + v('juego') + "\n";
    t += "Fecha: " + v('fecha') + "\n";
    t += "Lugar: " + v('lugar') + "\n";
    var PRECIOS = {"Toro Mecanico":"$120.000","Toro Mecánico":"$120.000",
      "Castillo Multiproposito":"$55.000","Castillo Multipropósito":"$55.000",
      "Castillo Lego":"$55.000","Castillo Mini Obstaculo":"$50.000","Castillo Mini Obstáculo":"$50.000",
      "Mini Castillito":"$35.000",
      "Tobogan New":"$50.000","Tobogán New":"$50.000",
      "Tobogan Robot":"$55.000","Tobogán Robot":"$55.000",
      "Tobogan Doble Pro":"$65.000","Tobogán Doble Pro":"$65.000",
      "Tobogan Arcoiris":"$65.000","Tobogán Arcoíris":"$65.000",
      "Tobogan Mega Doble":"$80.000","Tobogán Mega Doble":"$80.000",
      "Tobogan Multicolor":"$60.000 (piscina de pelotas) / $80.000 (acuático)","Tobogán Multicolor":"$60.000 (piscina de pelotas) / $80.000 (acuático)",
      "Tobogan Obstaculos":"$55.000","Tobogán Obstáculos":"$55.000",
      "Tobogan Premium":"$80.000","Tobogán Premium":"$80.000",
      "Taca Taca":"$25.000","Taca Taca Familiar":"$45.000","Mesa Air Hockey":"$35.000","PintaCaritas":"$40.000 (por hora, consulta tramos)"};
    var pr = PRECIOS[v('juego')] || "$40.000";
    t += "Valor referencial: " + pr + " CLP";
    var RECARGO_5000 = ["Alto Jahuel","Huelquén","Valdivia de Paine","Aculeo","Escorial","Pintué","La Aparición","Cardonal","Campusano","Chada","Linderos"];
    var RECARGO_10000 = ["Rangue"];
    var lugarSel = v('lugar');
    if (RECARGO_10000.indexOf(lugarSel) !== -1) {
      t += "\nCargo de despacho: +$10.000 CLP (" + lugarSel + ")";
    } else if (RECARGO_5000.indexOf(lugarSel) !== -1) {
      t += "\nCargo de despacho: +$5.000 CLP (" + lugarSel + ")";
    } else if (lugarSel === "Otra comuna (a consultar)") {
      t += "\nCargo de despacho: a consultar (comuna fuera de la cobertura habitual)";
    } else if (lugarSel) {
      t += "\nCargo de despacho: sin cargo extra";
    }
    if (v('msg')) t += "\n\n" + v('msg');
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(t), '_blank');
  });
})();
