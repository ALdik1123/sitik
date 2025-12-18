// js/data.js
let properties = {
  sale: JSON.parse(localStorage.getItem('properties_sale') || '[]'),
  rental: JSON.parse(localStorage.getItem('properties_rental') || '[]')
};

// ДВА ТОПОВЫХ ОБЪЯВЛЕНИЯ — всегда сверху на главной
const featuredProperties = [
  {
    id: 9999,
    ru: "Пентхаус в Golden Square, Алматы",
    kk: "Алтын алаңдағы пентхаус, Алматы",
    price: 450000000,
    desc: "Эксклюзивный пентхаус 420 м² с панорамным видом на горы и город. 4 спальни, терраса 150 м², смарт-дом.",
    location: "Алматы, Бостандыкский район",
    year: 2024,
    features: { area: "420 м²", rooms: "8 комнат", floor: "20 из 20", land: null },
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
      "https://images.unsplash.com/photo-1600564013799919-ab600027ffc6?w=1200",
      "https://images.unsplash.com/photo-1600563438938-a9a27216b4dc?w=1200"
    ],
    tags: ["Топ", "Пентхаус", "Люкс", "Новострой"],
    type: "apartment",
    featured: true
  },
  {
    id: 9998,
    ru: "Вилла у озера, Астана",
    kk: "Көл жағасындағы вилла, Астана",
    price: 1200000000,
    desc: "Премиальная вилла 800 м² с собственным выходом к воде. Ландшафтный дизайн, бассейн, баня.",
    location: "Астана, Есильский район",
    year: 2025,
    features: { area: "800 м²", rooms: "12 комнат", floor: null, land: "15 соток" },
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200",
      "https://images.unsplash.com/photo-1600596543559-3b89a1c957c3?w=1200",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200"
    ],
    tags: ["Топ", "Вилла", "Озеро", "Элитная"],
    type: "house",
    featured: true
  }
];

// Инициализация: если нет данных — добавляем демо + топовые
if (properties.sale.length === 0) {
  properties.sale = [
    ...featuredProperties,
    {
      id: 1, ru: "3-комнатная в ЖК Almaty Towers", kk: "Almaty Towers-та 3 бөлмелі", price: 125000000, desc: "Светлая квартира с ремонтом", location: "Алматы", year: 2023,
      features: { area: "120 м²", rooms: "3", floor: "12 из 16", land: null }, images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200"], tags: ["Новострой", "Ремонт"], type: "apartment"
    }
  ];
  localStorage.setItem('properties_sale', JSON.stringify(properties.sale));
}

if (properties.rental.length === 0) {
  properties.rental = [
    { id: 101, ru: "Аренда офиса 200 м²", kk: "Офис 200 м² жалға", price: 3000000, desc: "Бизнес-центр класса А", location: "Астана", year: 2022, features: { area: "200 м²" }, images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200"], tags: ["Офис"], type: "commercial" }
  ];
  localStorage.setItem('properties_rental', JSON.stringify(properties.rental));
}

let requests = JSON.parse(localStorage.getItem('requests') || '[]');
let users = JSON.parse(localStorage.getItem('users') || '[]');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
let currentPropId = null;
let currentCat = null;
