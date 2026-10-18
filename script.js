const securityProfiles = [
  {
    label: 'Güvenli',
    score: 92,
    risk: 'Düşük',
    comment: 'Pekâlâ görünüyorsun; sistemler huzurlu.',
    badge: 'safe',
    banner: 'safe',
    activity: [
      'Firewall penceresi: sorunsuz.',
      'Antivirüs taraması: temiz.',
      'Şifre kutusu: tam gaz, kibar.'
    ]
  },
  {
    label: 'Uyarı',
    score: 68,
    risk: 'Orta',
    comment: 'Bazı alanlar dinleniyor; bir göz atmak iyi olur.',
    badge: 'warning',
    banner: 'warning',
    activity: [
      'Yazılım güncellemesi 1 yeni paket bekliyor.',
      'Ağ trafiği biraz şüpheli görünüyor.',
      'Parola kontrolü: güçlendirilebilir.'
    ]
  },
  {
    label: 'Riskli',
    score: 41,
    risk: 'Yüksek',
    comment: 'Kapıların kilidi var ama içeride bir kedi gizli.',
    badge: 'danger',
    banner: 'danger',
    activity: [
      'Erişim logu: dikkat çekici hareket var.',
      'İstenmeyen eklentiler bulunmuş olabilir.',
      'Yedekleme şu an için keyifsiz.'
    ]
  }
];

const checkTemplates = [
  { name: 'Firewall', base: 93 },
  { name: 'Antivirüs', base: 89 },
  { name: 'Şifre gücü', base: 82 },
  { name: 'Yazılım güncellemesi', base: 77 },
  { name: 'Ağ güvenliği', base: 71 },
  { name: 'Yedekleme', base: 86 }
];

const statusText = document.querySelector('#statusText');
const commentText = document.querySelector('#commentText');
const scoreValue = document.querySelector('#scoreValue');
const riskLevel = document.querySelector('#riskLevel');
const statusBanner = document.querySelector('#statusBanner');
const checkGrid = document.querySelector('#checkGrid');
const activityList = document.querySelector('#activityList');
const lastUpdated = document.querySelector('#lastUpdated');
const refreshBtn = document.querySelector('#refreshBtn');

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getStatusClass(type) {
  return type === 'safe' ? 'safe' : type === 'warning' ? 'warning' : 'danger';
}

function applyScoreStyle(score) {
  const ring = document.querySelector('.score-ring');
  const angle = clamp((score / 100) * 360, 0, 360);
  ring.style.background = `conic-gradient(var(--accent) ${angle}deg, var(--score-track) ${angle}deg)`;
}

function renderCheckCards(profile) {
  const cards = checkTemplates.map((item) => {
    const offset = randomBetween(-14, 16);
    const rawScore = clamp(item.base + offset + Math.round((profile.score - 50) * 0.25), 0, 100);
    const cssClass = rawScore >= 75 ? 'safe' : rawScore >= 55 ? 'warning' : 'danger';
    const label = rawScore >= 75 ? 'İyi' : rawScore >= 55 ? 'Dikkat' : 'Risk';

    return `
      <article class="check-card">
        <div class="card-head">
          <span class="card-label">${item.name}</span>
          <span class="badge ${cssClass}">${label}</span>
        </div>
        <div class="progress">
          <div class="progress-bar ${cssClass === 'safe' ? '' : cssClass === 'warning' ? 'warning' : 'danger'}" style="width: ${rawScore}%"></div>
        </div>
        <div class="progress-meta">
          <span>Durum</span>
          <strong>${rawScore}%</strong>
        </div>
      </article>
    `;
  });

  checkGrid.innerHTML = cards.join('');
}

function renderActivity(profile) {
  const items = profile.activity.map((entry, index) => {
    const tone = index === 0 ? 'safe' : index === 1 ? 'warning' : 'danger';
    return `<li class="activity-item ${tone === 'safe' ? '' : tone}">${entry}</li>`;
  }).join('');

  activityList.innerHTML = items;
}

function generateProfile() {
  const profile = securityProfiles[randomBetween(0, securityProfiles.length - 1)];
  const score = randomBetween(Math.max(0, profile.score - 8), Math.min(100, profile.score + 8));

  statusText.textContent = profile.label;
  commentText.textContent = profile.comment;
  scoreValue.textContent = score;
  riskLevel.textContent = profile.risk;
  statusBanner.className = `status-banner ${profile.banner}`;
  statusText.textContent = profile.label;
  applyScoreStyle(score);

  lastUpdated.textContent = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  renderCheckCards(profile);
  renderActivity(profile);
}

refreshBtn.addEventListener('click', () => {
  refreshBtn.disabled = true;
  refreshBtn.textContent = 'Tarama yapılıyor...';

  setTimeout(() => {
    generateProfile();
    refreshBtn.disabled = false;
    refreshBtn.textContent = 'Yenile';
  }, 700);
});

generateProfile();
