// js/admin.js
function openAdminPanel() {
  showAdminTab('addProp');
  renderRequests();
  renderEditProps();
  document.getElementById('adminPanel').classList.add('show');
}

function showAdminTab(tab) {
  document.getElementById('addPropTab').style.display = tab === 'addProp' ? 'block' : 'none';
  document.getElementById('editPropsTab').style.display = tab === 'editProps' ? 'block' : 'none';
  document.getElementById('requestsTab').style.display = tab === 'requests' ? 'block' : 'none';
  document.querySelectorAll('#adminTabs button').forEach(b => b.classList.remove('active'));
  document.querySelector(`#adminTabs button[onclick="showAdminTab('${tab}')"]`).classList.add('active');
}

function addProperty() {
  const cat = document.getElementById('adminCategory').value;
  const ru = document.getElementById('adminTitleRu').value.trim();
  const kk = document.getElementById('adminTitleKk').value.trim();
  const price = parseInt(document.getElementById('adminPrice').value);
  const desc = document.getElementById('adminDesc').value.trim();
  const location = document.getElementById('adminLocation').value.trim();
  const year = parseInt(document.getElementById('adminYear').value) || new Date().getFullYear();
  const featuresInput = document.getElementById('adminFeatures').value.trim();
  const imgInput = document.getElementById('adminImg').value.trim();
  const tagsInput = document.getElementById('adminTags').value.trim();
  const type = document.getElementById('adminType').value;

  if (!ru || !kk || !price || !desc || !location) return alert("Заполните обязательные поля: Название, Цена, Описание, Локация!");

  const images = imgInput ? imgInput.split(',').map(s => s.trim()).filter(Boolean) : ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200"];
  const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : ["Новое"];
  const featuresArr = featuresInput ? featuresInput.split(',').map(f => f.trim()) : [];
  const features = {
    area: featuresArr[0] || 'Не указано',
    rooms: featuresArr[1] || 'Не указано',
    floor: featuresArr[2],
    land: featuresArr[3]
  };

  const newId = Math.max(...[...properties.sale, ...properties.rental].map(p => p.id || 0)) + 1;
  const newProp = {id: newId, ru, kk, price, desc, location, year, features, images, tags, type};

  properties[cat].unshift(newProp);
  localStorage.setItem('properties_' + cat, JSON.stringify(properties[cat]));
  render(cat);
  alert("Объект добавлен!");
  confetti();
  document.querySelector('#addPropTab').querySelectorAll('input, textarea, select').forEach(el => el.value = '');
}

function renderRequests() {
  const list = document.getElementById('requestsList');
  list.innerHTML = requests.sort((a,b) => new Date(b.date) - new Date(a.date)).map((r,i) => `
    <div class="request-card" id="req-${i}">
      <div class="request-header">
        <strong>${r.name} (${r.phone})</strong>
        <span style="font-size:12px;color:#888">${r.date}</span>
      </div>
      <p><strong>Сообщение:</strong> ${r.message}</p>
      ${r.response ? `<p style="background:#e6f7ee;padding:10px;border-radius:8px;margin-top:10px;"><strong>Ответ:</strong> ${r.response}</p>` : ''}
      <div class="request-actions">
        <button class="btn primary small" onclick="openEditRequest(${i})">Редактировать</button>
        <button class="btn success small" onclick="openResponseModal(${i})">Ответить</button>
        <button class="btn danger small" onclick="deleteRequest(${i})">Удалить</button>
      </div>
    </div>
  `).join('');
}

function deleteRequest(index) {
  if (!confirm("Удалить заявку?")) return;
  requests.splice(index, 1);
  localStorage.setItem('requests', JSON.stringify(requests));
  renderRequests();
  alert("Заявка удалена!");
}

function openEditRequest(index) {
  const r = requests[index];
  const modal = document.createElement('div');
  modal.className = 'modal show';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
      <h2>Редактировать заявку</h2>
      <div class="form-group">
        <label for="editReqName">Имя</label>
        <input id="editReqName" value="${r.name}">
      </div>
      <div class="form-group">
        <label for="editReqPhone">Телефон</label>
        <input id="editReqPhone" value="${r.phone}">
      </div>
      <div class="form-group">
        <label for="editReqMessage">Сообщение</label>
        <textarea id="editReqMessage" rows="4">${r.message}</textarea>
      </div>
      <button class="btn primary" onclick="saveEditRequest(${index}, this)">Сохранить</button>
    </div>
  `;
  document.body.appendChild(modal);
}

function saveEditRequest(index, btn) {
  const name = document.getElementById('editReqName').value.trim();
  const phone = document.getElementById('editReqPhone').value.trim();
  const message = document.getElementById('editReqMessage').value.trim();
  if (!name || !phone) return alert('Имя и телефон обязательны');
  requests[index] = { ...requests[index], name, phone, message };
  localStorage.setItem('requests', JSON.stringify(requests));
  renderRequests();
  btn.closest('.modal').remove();
  alert("Заявка обновлена!");
  confetti();
}

function openResponseModal(index) {
  const modal = document.createElement('div');
  modal.className = 'modal show';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
      <h2>Ответить на заявку</h2>
      <p><strong>Клиент:</strong> ${requests[index].name} (${requests[index].phone})</p>
      <textarea id="responseText" rows="4" placeholder="Ваш ответ..."></textarea>
      <button class="btn primary" onclick="saveResponse(${index}, this)">Отправить</button>
    </div>
  `;
  document.body.appendChild(modal);
}

function saveResponse(index, btn) {
  const response = document.getElementById('responseText').value.trim();
  if (!response) return alert('Напишите ответ');
  requests[index].response = response;
  localStorage.setItem('requests', JSON.stringify(requests));
  renderRequests();
  btn.closest('.modal').remove();
  alert("Ответ сохранен!");
  confetti();
}

function renderEditProps() {
  const list = document.getElementById('editPropsList');
  const allProps = [...properties.sale, ...properties.rental];
  list.innerHTML = allProps.map(p => `
    <div class="edit-card">
      <span>${p.ru} (${p.price.toLocaleString()} ₸)</span>
      <div>
        <button class="btn primary" onclick="openEditProperty(${p.id})">Редактировать</button>
        <button class="btn danger" onclick="deleteProperty(${p.id})">Удалить</button>
      </div>
    </div>
  `).join('');
}

function openEditProperty(id) {
  const prop = [...properties.sale, ...properties.rental].find(p => p.id === id);
  const cat = properties.sale.find(p => p.id === id) ? 'sale' : 'rental';
  const featuresStr = [prop.features.area, prop.features.rooms, prop.features.floor, prop.features.land].filter(Boolean).join(', ');
  document.getElementById('editPropertyForm').innerHTML = `
    <input type="hidden" id="editId" value="${prop.id}">
    <input type="hidden" id="editCat" value="${cat}">
    <div class="form-group">
      <label for="editTitleRu">Название RU</label>
      <input id="editTitleRu" value="${prop.ru}">
    </div>
    <div class="form-group">
      <label for="editTitleKk">Название KK</label>
      <input id="editTitleKk" value="${prop.kk}">
    </div>
    <div class="form-group">
      <label for="editPrice">Цена</label>
      <input id="editPrice" type="number" value="${prop.price}">
    </div>
    <div class="form-group">
      <label for="editDesc">Описание</label>
      <textarea id="editDesc" rows="4">${prop.desc}</textarea>
    </div>
    <div class="form-group">
      <label for="editLocation">Локация</label>
      <input id="editLocation" value="${prop.location}">
    </div>
    <div class="form-group">
      <label for="editYear">Год постройки</label>
      <input id="editYear" type="number" value="${prop.year}">
    </div>
    <div class="form-group">
      <label for="editFeatures">Особенности (площадь, комнаты, этаж/земля через ,)</label>
      <input id="editFeatures" value="${featuresStr}">
    </div>
    <div class="form-group">
      <label for="editImg">Изображения (через ,)</label>
      <input id="editImg" value="${prop.images.join(', ')}">
    </div>
    <div class="form-group">
      <label for="editTags">Теги (через ,)</label>
      <input id="editTags" value="${prop.tags.join(', ')}">
    </div>
    <div class="form-group">
      <label for="editType">Тип</label>
      <select id="editType"><option value="apartment" ${prop.type === 'apartment' ? 'selected' : ''}>Квартира</option><option value="house" ${prop.type === 'house' ? 'selected' : ''}>Дом</option><option value="commercial" ${prop.type === 'commercial' ? 'selected' : ''}>Коммерческая</option></select>
    </div>
    <button class="btn primary" onclick="saveEditProperty()">Сохранить</button>
  `;
  document.getElementById('editPropertyModal').classList.add('show');
}

function saveEditProperty() {
  const id = parseInt(document.getElementById('editId').value);
  const cat = document.getElementById('editCat').value;
  const ru = document.getElementById('editTitleRu').value.trim();
  const kk = document.getElementById('editTitleKk').value.trim();
  const price = parseInt(document.getElementById('editPrice').value);
  const desc = document.getElementById('editDesc').value.trim();
  const location = document.getElementById('editLocation').value.trim();
  const year = parseInt(document.getElementById('editYear').value);
  const featuresInput = document.getElementById('editFeatures').value.trim();
  const imgInput = document.getElementById('editImg').value.trim();
  const tagsInput = document.getElementById('editTags').value.trim();
  const type = document.getElementById('editType').value;

  if (!ru || !kk || !price || !desc || !location) return alert("Заполните обязательные поля!");

  const images = imgInput.split(',').map(s => s.trim()).filter(Boolean);
  const tags = tagsInput.split(',').map(t => t.trim());
  const featuresArr = featuresInput.split(',').map(f => f.trim());
  const features = {
    area: featuresArr[0] || 'Не указано',
    rooms: featuresArr[1] || 'Не указано',
    floor: featuresArr[2],
    land: featuresArr[3]
  };

  const index = properties[cat].findIndex(p => p.id === id);
  if (index !== -1) {
    properties[cat][index] = { ...properties[cat][index], ru, kk, price, desc, location, year, features, images, tags, type };
    localStorage.setItem('properties_' + cat, JSON.stringify(properties[cat]));
    render(cat);
    renderEditProps();
    closeModal('editPropertyModal');
    alert("Объект обновлён!");
    confetti();
  }
}

function deleteProperty(id) {
  if (!confirm("Удалить объект?")) return;
  properties.sale = properties.sale.filter(p => p.id !== id);
  properties.rental = properties.rental.filter(p => p.id !== id);
  localStorage.setItem('properties_sale', JSON.stringify(properties.sale));
  localStorage.setItem('properties_rental', JSON.stringify(properties.rental));
  render('sale');
  render('rental');
  renderEditProps();
  alert("Объект удалён!");
}
