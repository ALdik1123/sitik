// js/main.js
AOS.init({duration:1200,easing:'ease-in-out',once:false});

function setLang(l) {
  document.body.setAttribute('data-lang', l);
  localStorage.setItem('lang', l);
  document.querySelectorAll('.ru, .kk').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.' + l).forEach(el => el.style.display = 'block');
  document.querySelectorAll('.lang button').forEach(b => b.classList.remove('active'));
  document.querySelector(`.lang button[onclick="setLang('${l}')"]`).classList.add('active');
  render('sale'); render('rental');
}
setLang(localStorage.getItem('lang') || 'ru');

function instantScroll(t) { document.querySelector(t).scrollIntoView({behavior:'instant'}); }

window.addEventListener('load', () => {
  createParticles();
  startSlideShow();
  updateAuthUI();
});

function createParticles() {
  const container = document.querySelector('.particles');
  setInterval(() => {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.width = p.style.height = Math.random()*8+4+'px';
    p.style.left = Math.random()*100+'%';
    p.style.animationDuration = Math.random()*10+10+'s';
    container.appendChild(p);
    setTimeout(() => p.remove(), 20000);
  }, 300);
}

document.addEventListener('mousemove', e => {
  const trail = document.getElementById('cursor-trail');
  const dot = document.createElement('div');
  dot.className = 'trail-dot';
  dot.style.left = e.clientX + 'px';
  dot.style.top = e.clientY + 'px';
  trail.appendChild(dot);
  setTimeout(() => dot.remove(), 1000);
});

let currentSlide = 0;
function startSlideShow() {
  const slides = document.querySelectorAll('.slide');
  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 5000);
}

function render(cat) {
  const lang = document.body.getAttribute('data-lang') === 'kk' ? 'kk' : 'ru';
  const container = document.getElementById(cat + 'Cards');
  const search = document.getElementById('search' + (cat==='sale'?'Sale':'Rental'))?.value.toLowerCase() || '';
  const filtered = properties[cat].filter(p => p[lang].toLowerCase().includes(search));
  
  container.innerHTML = filtered.map((p,i) => `
    <div class="card" data-aos="fade-up" data-aos-delay="${i*150}" onclick="showFullProperty('${cat}', ${p.id})">
      <img src="${p.images[0]}" loading="lazy">
      <div class="card-body">
        <h3>${p[lang]}</h3>
        <div class="price${cat==='rental'?' r':''}">${p.price.toLocaleString()} ₸${cat==='rental'?' /мес':''}</div>
        <div class="tags">${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
      </div>
    </div>
  `).join('');
  AOS.refresh();
}

render('sale'); render('rental');

function showFullProperty(cat, id) {
  const lang = document.body.getAttribute('data-lang') === 'kk' ? 'kk' : 'ru';
  const prop = properties[cat].find(p => p.id === id);
  currentPropId = id;
  currentCat = cat;
  const gallery = prop.images.length > 1 ? `<div class="gallery">${prop.images.slice(1).map(img => `<img src="${img}" alt="Галерея">`).join('')}</div>` : '';
  document.getElementById('propertyDetails').innerHTML = `
    <img class="main-img" src="${prop.images[0]}" alt="${prop[lang]}">
    ${gallery}
    <h2>${prop[lang]}</h2>
    <p>${prop.desc}</p>
    <p><strong>Локация:</strong> ${prop.location}</p>
    <p><strong>Год постройки:</strong> ${prop.year}</p>
    <p><strong>Тип:</strong> ${prop.type}</p>
    <ul class="features">
      ${Object.entries(prop.features).map(([key, val]) => `<li><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${val}</li>`).join('')}
    </ul>
    <div class="price">${prop.price.toLocaleString()} ₸</div>
  `;
  // Скрываем все секции кроме хедера и propertyDetail
  document.querySelectorAll('section:not(#propertyDetail)').forEach(sec => sec.style.display = 'none');
  document.getElementById('propertyDetail').style.display = 'block';
  instantScroll('#propertyDetail');
  confetti();
}

function backToList() {
  document.querySelectorAll('section:not(#propertyDetail)').forEach(sec => sec.style.display = 'block');
  document.getElementById('propertyDetail').style.display = 'none';
  instantScroll('#' + currentCat);
}

function closeModal(id) {
  document.getElementById(id).classList.remove('show');
}

function contactWhatsapp() {
  window.open('https://wa.me/77714829862?text=Интересуюсь объектом ID: ' + currentPropId, '_blank');
}

function openRequestModal() {
  document.getElementById('requestPropId').value = currentPropId;
  document.getElementById('requestModal').classList.add('show');
}

function submitPropertyRequest(e) {
  e.preventDefault();
  const propId = document.getElementById('requestPropId').value;
  const name = document.getElementById('requestName').value;
  const phone = document.getElementById('requestPhone').value;
  const message = document.getElementById('requestMessage').value;
  requests.push({propId, name, phone, message, date: new Date().toLocaleString()});
  localStorage.setItem('requests', JSON.stringify(requests));
  alert('Заявка оставлена!');
  closeModal('requestModal');
  confetti();
}

function shareProperty() {
  const url = window.location.href + '#property-' + currentPropId;
  navigator.clipboard.writeText(url).then(() => alert('Ссылка скопирована!'));
}

function saveFavorite() {
  alert('Добавлено в избранное! (Функция в разработке)');
}

function openLoginModal() {
  document.getElementById('loginModal').classList.add('show');
}

function openRegisterModal() {
  closeModal('loginModal');
  document.getElementById('registerModal').classList.add('show');
}

function register() {
  const username = document.getElementById('regUsername').value.trim();
  const password = document.getElementById('regPassword').value.trim();
  const role = document.getElementById('regRole').value;
  if (!username || !password) return alert('Заполните поля');
  if (users.find(u => u.username === username)) return alert('Пользователь существует');
  users.push({username, password, role});
  localStorage.setItem('users', JSON.stringify(users));
  alert('Регистрация успешна! Войдите.');
  closeModal('registerModal');
  openLoginModal();
  confetti();
}

function login() {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return alert('Неверные данные');
  currentUser = user;
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  updateAuthUI();
  closeModal('loginModal');
  alert('Добро пожаловать, ' + username + '!');
  confetti();
}

function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  updateAuthUI();
}

function updateAuthUI() {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  document.getElementById('loginLink').style.display = currentUser ? 'none' : 'block';
  document.getElementById('logoutLink').style.display = currentUser ? 'block' : 'none';
  document.getElementById('adminLink').style.display = currentUser && currentUser.role === 'admin' ? 'block' : 'none';
  document.getElementById('profileLink').style.display = currentUser ? 'block' : 'none';
}

function openProfile() {
  alert('Профиль: ' + currentUser.username + ' (' + currentUser.role + ')');
}

function submitRequest(e) {
  e.preventDefault();
  const form = e.target;
  if (!form.checkValidity()) return alert('Заполните все поля правильно!');
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  requests.push({name, phone, email, message, date: new Date().toLocaleString()});
  localStorage.setItem('requests', JSON.stringify(requests));
  alert('Заявка отправлена!');
  form.reset();
  confetti();
}
