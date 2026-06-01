// ── Supabase client ──────────────────────────────────────────
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── State ────────────────────────────────────────────────────
let currentRole = null;
let pins = { ...DEFAULT_PINS };
let pinInput = '';
let selectedRole = null;

// ── Helpers ──────────────────────────────────────────────────
function monthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabel() {
  return new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

function toast(msg, duration = 2800) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

function pts2money(pts) {
  const money = Math.min(pts, 150) * 0.5;
  return money.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function pct(pts) {
  return Math.min(Math.round((pts / 100) * 100), 150);
}

// ── PIN SYSTEM ───────────────────────────────────────────────
async function loadPins() {
  try {
    const { data } = await db.from('config').select('value').eq('key', 'pins').single();
    if (data) pins = JSON.parse(data.value);
  } catch (_) {}
}

async function savePins(newPins) {
  pins = newPins;
  await db.from('config').upsert({ key: 'pins', value: JSON.stringify(pins) });
}

// ── LOGIN ────────────────────────────────────────────────────
document.querySelectorAll('.role-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedRole = btn.dataset.role;
    document.getElementById('pin-wrap').style.display = 'flex';
    document.getElementById('pin-label').textContent = `PIN para: ${btn.textContent.trim()}`;
    pinInput = '';
    updatePinDots();
    document.getElementById('pin-error').textContent = '';
  });
});

document.querySelectorAll('.pin-key').forEach(k => {
  k.addEventListener('click', () => {
    if (k.classList.contains('pin-clear')) {
      pinInput = pinInput.slice(0, -1);
    } else if (k.classList.contains('pin-ok')) {
      checkPin();
      return;
    } else {
      if (pinInput.length < 4) pinInput += k.dataset.n;
    }
    updatePinDots();
  });
});

function updatePinDots() {
  document.querySelectorAll('.pin-dots span').forEach((s, i) => {
    s.classList.toggle('filled', i < pinInput.length);
  });
}

async function checkPin() {
  await loadPins();
  if (pinInput === pins[selectedRole]) {
    currentRole = selectedRole;
    enterApp();
  } else {
    document.getElementById('pin-error').textContent = 'PIN incorreto. Tente novamente.';
    pinInput = '';
    updatePinDots();
  }
}

// ── APP ENTRY ────────────────────────────────────────────────
function enterApp() {
  document.getElementById('login-screen').classList.remove('active');
  document.getElementById('app-screen').classList.add('active');

  const names = { pai: '👨 Pais', filha: '👧 Duda', filho: '👦 JC' };
  document.getElementById('header-user').textContent = names[currentRole];

  if (currentRole === 'pai') {
    renderAdmin();
  } else {
    renderKid(currentRole);
  }
}

document.getElementById('btn-logout').addEventListener('click', () => {
  currentRole = null;
  selectedRole = null;
  pinInput = '';
  updatePinDots();
  document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById('pin-wrap').style.display = 'none';
  document.getElementById('pin-error').textContent = '';
  document.getElementById('app-screen').classList.remove('active');
  document.getElementById('login-screen').classList.add('active');
  document.getElementById('view-admin').style.display = 'none';
  document.getElementById('view-kid').style.display = 'none';
});

// ── ADMIN VIEW ───────────────────────────────────────────────
async function renderAdmin() {
  document.getElementById('view-admin').style.display = 'block';
  document.getElementById('admin-month').textContent = monthLabel();

  populateActionSelect('ganho');
  document.getElementById('ev-type').addEventListener('change', () => {
    populateActionSelect(document.getElementById('ev-type').value);
  });

  await loadAdminCards();
  await loadHistory('admin');
  await loadMesesAnteriores();
  loadPinConfig();
}

function populateActionSelect(type) {
  const list = type === 'ganho' ? ACOES_GANHO : ACOES_PERDA;
  const sel = document.getElementById('ev-action');
  sel.innerHTML = list.map((a, i) =>
    `<option value="${i}" data-pts="${a.pts ?? ''}">${a.label}${a.pts ? ` (+${a.pts})` : ''}</option>`
  ).join('');
  sel.addEventListener('change', () => {
    const opt = list[sel.value];
    if (opt && opt.pts) document.getElementById('ev-pts').value = opt.pts;
    else document.getElementById('ev-pts').value = '';
  });
  // trigger once
  const opt = list[0];
  if (opt && opt.pts) document.getElementById('ev-pts').value = opt.pts;
}

async function loadAdminCards() {
  const month = monthKey();
  const { data: evs } = await db.from('events').select('*').eq('month', month);

  const ptsFilha = calcPts(evs, 'filha');
  const ptsFilho = calcPts(evs, 'filho');

  document.getElementById('kids-cards').innerHTML = `
    ${kidCard('filha', '👧', 'Duda', '', ptsFilha)}
    ${kidCard('filho', '👦', 'JC', '', ptsFilho)}
  `;
}

function kidCard(role, emoji, name, age, pts) {
  const p = pct(pts);
  const money = pts2money(pts);
  return `
    <div class="kid-card ${role === 'filho' ? 'kid-filho' : ''}">
      <div class="kid-card-top">
        <div class="kid-card-avatar">${emoji}</div>
        <div>
          <div class="kid-card-name">${name}</div>
          <div class="kid-card-age">${age}</div>
        </div>
      </div>
      <div class="kid-card-pts">${pts}</div>
      <div class="kid-card-pts-label">pontos este mês</div>
      <div class="kid-mini-bar"><div class="kid-mini-fill" style="width:${p}%"></div></div>
      <div class="kid-mini-money">Mesada estimada: <strong>${money}</strong></div>
    </div>
  `;
}

function calcPts(evs, kid) {
  if (!evs) return 0;
  return Math.max(0, evs.filter(e => e.kid === kid).reduce((s, e) => s + e.pts, 0));
}

// ADD EVENT
document.getElementById('btn-add-ev').addEventListener('click', async () => {
  const kid  = document.getElementById('ev-kid').value;
  const type = document.getElementById('ev-type').value;
  const list = type === 'ganho' ? ACOES_GANHO : ACOES_PERDA;
  const idx  = parseInt(document.getElementById('ev-action').value);
  const action = list[idx];
  let pts = parseInt(document.getElementById('ev-pts').value);
  const note = document.getElementById('ev-note').value.trim();

  if (!pts || pts < 1) { toast('⚠️ Informe os pontos corretamente'); return; }
  if (type === 'perda') pts = -Math.abs(pts);

  const { error } = await db.from('events').insert({
    kid,
    month: monthKey(),
    action: action.label,
    pts,
    note: note || null,
    created_at: new Date().toISOString()
  });

  if (error) { toast('❌ Erro ao salvar: ' + error.message); return; }

  document.getElementById('ev-pts').value = '';
  document.getElementById('ev-note').value = '';
  toast(`✅ Registrado: ${action.label}`);
  await loadAdminCards();
  await loadHistory('admin');
});

// HISTORY
async function loadHistory(view) {
  const month = monthKey();
  const { data: evs } = await db.from('events').select('*').eq('month', month).order('created_at', { ascending: false });

  const listId = view === 'admin' ? 'history-list' : 'kid-history';
  const container = document.getElementById(listId);

  if (!evs || evs.length === 0) {
    container.innerHTML = '<p class="history-empty">Nenhum evento registrado ainda neste mês.</p>';
    return;
  }

  const filtered = view === 'admin' ? evs : evs.filter(e => e.kid === view);

  if (filtered.length === 0) {
    container.innerHTML = '<p class="history-empty">Nenhum evento registrado ainda neste mês.</p>';
    return;
  }

  container.innerHTML = filtered.map(e => {
    const isPos = e.pts > 0;
    const date = new Date(e.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    const kidLabel = e.kid === 'filha' ? '👧 Duda' : '👦 JC';
    return `
      <div class="history-item">
        <span class="history-badge ${isPos ? 'pos' : 'neg'}">${isPos ? '+' : ''}${e.pts}</span>
        <div class="history-desc">
          ${view === 'admin' ? `<div class="history-name">${kidLabel}</div>` : ''}
          <div>${e.action}</div>
          ${e.note ? `<div class="history-note">${e.note}</div>` : ''}
        </div>
        <span class="history-date">${date}</span>
      </div>
    `;
  }).join('');
}

// PIN CONFIG
function loadPinConfig() {
  document.getElementById('cfg-pin-pai').value = pins.pai;
  document.getElementById('cfg-pin-filha').value = pins.filha;
  document.getElementById('cfg-pin-filho').value = pins.filho;
}

document.getElementById('btn-save-pins').addEventListener('click', async () => {
  const newPai   = document.getElementById('cfg-pin-pai').value.trim();
  const newFilha = document.getElementById('cfg-pin-filha').value.trim();
  const newFilho = document.getElementById('cfg-pin-filho').value.trim();

  if (![newPai, newFilha, newFilho].every(p => /^\d{4}$/.test(p))) {
    toast('⚠️ Todos os PINs devem ter exatamente 4 dígitos'); return;
  }

  await savePins({ pai: newPai, filha: newFilha, filho: newFilho });
  toast('✅ PINs salvos com sucesso!');
});

// ── KID VIEW ─────────────────────────────────────────────────
async function renderKid(role) {
  document.getElementById('view-kid').style.display = 'block';

  const month = monthKey();
  const { data: evs } = await db.from('events').select('*').eq('month', month).eq('kid', role);
  const pts = Math.max(0, (evs || []).reduce((s, e) => s + e.pts, 0));

  const isFilha = role === 'filha';
  document.getElementById('kid-avatar').textContent = isFilha ? '👧' : '👦';
  document.getElementById('kid-hero-name').textContent = isFilha ? 'Duda' : 'JC';
  document.getElementById('kid-hero-month').textContent = monthLabel();
  document.getElementById('kid-pts-big').textContent = pts;

  const p = pct(pts);
  document.getElementById('kid-pct').textContent = p + '%';
  document.getElementById('kid-bar').style.width = p + '%';
  document.getElementById('kid-money').textContent = pts2money(pts);

  if (!isFilha) {
    document.getElementById('kid-pts-big').style.color = 'var(--accent2)';
    document.getElementById('kid-bar').style.background = 'var(--accent2)';
    document.getElementById('kid-pct').style.color = 'var(--accent2)';
  }

  await loadHistory(role);
}

// ── MESES ANTERIORES ─────────────────────────────────────────
async function loadMesesAnteriores() {
  const container = document.getElementById('historico-meses');
  container.innerHTML = '<p class="loading">Carregando...</p>';

  // Busca todos os eventos exceto o mês atual
  const mesAtual = monthKey();
  const { data: evs } = await db
    .from('events').select('kid, month, pts')
    .neq('month', mesAtual)
    .order('month', { ascending: false });

  if (!evs || evs.length === 0) {
    container.innerHTML = '<p class="history-empty">Nenhum mês anterior registrado ainda.</p>';
    return;
  }

  // Agrupa por mês
  const meses = {};
  evs.forEach(e => {
    if (!meses[e.month]) meses[e.month] = { filha: 0, filho: 0 };
    meses[e.month][e.kid] = Math.max(0, meses[e.month][e.kid] + e.pts);
  });

  const fmt = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  container.innerHTML = Object.entries(meses).map(([month, pts]) => {
    const [ano, mes] = month.split('-');
    const label = new Date(ano, mes - 1, 1)
      .toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    const ptsDuda    = Math.min(pts.filha, 150);
    const ptsJoaquim = Math.min(pts.filho, 150);
    const mesadaDuda    = ptsDuda * 0.5;
    const mesadaJoaquim = ptsJoaquim * 0.5;
    const total = mesadaDuda + mesadaJoaquim;

    return `
      <div class="mes-card">
        <div class="mes-header">
          <span class="mes-label">${label}</span>
          <span class="mes-total">Total: <strong>${fmt(total)}</strong></span>
        </div>
        <div class="mes-kids">
          <div class="mes-kid">
            <span>👧 Duda</span>
            <span class="mes-pts">${pts.filha} pts</span>
            <span class="mes-money">${fmt(mesadaDuda)}</span>
          </div>
          <div class="mes-kid">
            <span>👦 Joaquim</span>
            <span class="mes-pts">${pts.filho} pts</span>
            <span class="mes-money">${fmt(mesadaJoaquim)}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}
