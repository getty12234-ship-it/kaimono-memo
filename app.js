'use strict';

// --- 状態管理 ---
let items = JSON.parse(localStorage.getItem('kaimono') || '[]');
let recognition = null;
let isListening = false;
let longPressTimer = null;

// --- DOM参照 ---
const listEl      = document.getElementById('item-list');
const emptyEl     = document.getElementById('empty-state');
const micBtn      = document.getElementById('mic-btn');
const micHint     = document.getElementById('mic-hint');
const manualInput = document.getElementById('manual-input');
const addBtn      = document.getElementById('add-btn');
const clearBtn    = document.getElementById('clear-btn');
const doneBtn     = document.getElementById('done-btn');
const modal       = document.getElementById('modal');
const modalMsg    = document.getElementById('modal-msg');
const modalOk     = document.getElementById('modal-ok');
const modalCancel = document.getElementById('modal-cancel');
const toast       = document.getElementById('toast');
const counter     = document.getElementById('counter');
const doneCount   = document.getElementById('done-count');

// --- Gist同期設定 ---
let gistCfg = JSON.parse(localStorage.getItem('gistCfg') || 'null') || { pat: '', gistId: '', username: '' };
let syncTimer = null;

function saveGistCfg() {
  localStorage.setItem('gistCfg', JSON.stringify(gistCfg));
}

function setSyncStatus(status) {
  const el = document.getElementById('sync-status');
  if (!el) return;
  const map = { syncing: '⟳ 同期中', synced: '✓ 同期済み', error: '✗ 同期エラー', '': '' };
  el.textContent = map[status] ?? '';
  el.className = `sync-status${status ? ' sync-' + status : ''}`;
}

async function syncToGist() {
  if (!gistCfg.pat) return;
  setSyncStatus('syncing');
  const content = JSON.stringify(items, null, 2);
  const headers = {
    'Authorization': `token ${gistCfg.pat}`,
    'Accept': 'application/vnd.github+json',
    'Content-Type': 'application/json'
  };
  try {
    if (!gistCfg.gistId) {
      const res = await fetch('https://api.github.com/gists', {
        method: 'POST', headers,
        body: JSON.stringify({
          description: '買い物メモ - Kaimono Memo',
          public: false,
          files: { 'kaimono-memo.json': { content } }
        })
      });
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      gistCfg.gistId = data.id;
      gistCfg.username = data.owner?.login || '';
      saveGistCfg();
      updateGistInfo();
    } else {
      const res = await fetch(`https://api.github.com/gists/${gistCfg.gistId}`, {
        method: 'PATCH', headers,
        body: JSON.stringify({ files: { 'kaimono-memo.json': { content } } })
      });
      if (!res.ok) throw new Error(res.status);
    }
    setSyncStatus('synced');
    setTimeout(() => setSyncStatus(''), 3000);
  } catch(e) {
    console.error('Gist同期エラー:', e);
    setSyncStatus('error');
  }
}

function scheduleSync() {
  clearTimeout(syncTimer);
  syncTimer = setTimeout(syncToGist, 1500);
}

// --- 永続化 ---
function save() {
  localStorage.setItem('kaimono', JSON.stringify(items));
  scheduleSync();
}

// --- レンダリング ---
function render() {
  listEl.innerHTML = '';
  const total = items.length;
  const done  = items.filter(i => i.done).length;
  counter.textContent  = `${total} 件`;
  doneCount.textContent = done > 0 ? ` （${done} 件チェック済み）` : '';

  if (total === 0) {
    emptyEl.style.display = 'flex';
    return;
  }
  emptyEl.style.display = 'none';

  // 未完了を先頭、完了を後ろ
  const sorted = [...items.filter(i => !i.done), ...items.filter(i => i.done)];

  sorted.forEach(item => {
    const el = document.createElement('div');
    el.className = 'item' + (item.done ? ' done' : '');
    el.dataset.id = item.id;

    el.innerHTML = `
      <div class="check-circle">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 7l4 4 6-7" stroke="#1a1a2e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <span class="item-text">${escHtml(item.text)}</span>
      ${item.qty > 1 ? `<span class="item-qty">×${item.qty}</span>` : ''}
      <button class="item-delete" title="削除">✕</button>
    `;

    // タップでチェック
    el.addEventListener('click', e => {
      if (e.target.classList.contains('item-delete')) return;
      toggleItem(item.id);
    });

    // 長押しで削除ボタン表示
    el.addEventListener('pointerdown', () => {
      longPressTimer = setTimeout(() => el.classList.add('show-delete'), 500);
    });
    el.addEventListener('pointerup',   () => clearTimeout(longPressTimer));
    el.addEventListener('pointerleave',() => clearTimeout(longPressTimer));

    // 削除
    el.querySelector('.item-delete').addEventListener('click', () => deleteItem(item.id));

    listEl.appendChild(el);
  });
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// --- アイテム操作 ---
function addItem(text) {
  text = text.trim();
  if (!text) return;

  // 数量パース（例: 「牛乳2本」「卵 3パック」）
  const qtyMatch = text.match(/^(.+?)[\s　]*(\d+)[個本袋パック枚缶箱本冊枚切個]?$/u);
  let name = text, qty = 1;
  if (qtyMatch && qtyMatch[2] && parseInt(qtyMatch[2]) > 0) {
    name = qtyMatch[1].trim();
    qty  = parseInt(qtyMatch[2]);
  }

  // 同名アイテムがあれば数量追加
  const existing = items.find(i => i.text === name && !i.done);
  if (existing) {
    existing.qty = (existing.qty || 1) + qty;
    save();
    render();
    showToast(`「${name}」の数量を ${existing.qty} に更新`);
    return;
  }

  items.unshift({ id: Date.now(), text: name, qty, done: false });
  save();
  render();
  showToast(`「${name}」を追加`);
}

function toggleItem(id) {
  const item = items.find(i => i.id === id);
  if (item) { item.done = !item.done; save(); render(); }
}

function deleteItem(id) {
  const item = items.find(i => i.id === id);
  items = items.filter(i => i.id !== id);
  save();
  render();
  if (item) showToast(`「${item.text}」を削除`);
}

function clearDone() {
  items = items.filter(i => !i.done);
  save();
  render();
  showToast('チェック済みを削除しました');
}

function clearAll() {
  items = [];
  save();
  render();
  showToast('リストをすべてクリア');
}

// --- 音声認識 ---
function initSpeech() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return false;

  recognition = new SR();
  recognition.lang = 'ja-JP';
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    isListening = true;
    micBtn.classList.add('listening');
    micBtn.textContent = '⏹';
    micHint.textContent = '聞いています…';
    micHint.className = 'mic-hint transcript';
  };

  recognition.onresult = e => {
    let interim = '';
    let final = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const t = e.results[i][0].transcript;
      if (e.results[i].isFinal) final += t;
      else interim += t;
    }
    micHint.textContent = final || interim || '聞いています…';
    if (final) {
      // 「追加」「登録」などの不要語を除去
      const cleaned = final
        .replace(/[、。！？!?]/g, '')
        .replace(/(を|も)?(追加|登録|メモ|入れて|買って)$/u, '')
        .trim();
      if (cleaned) addItem(cleaned);
      // 連続認識のためにリセット
      micHint.textContent = '続けてどうぞ…';
    }
  };

  recognition.onerror = e => {
    if (e.error === 'no-speech') return;
    console.warn('音声認識エラー:', e.error);
    stopListening();
    if (e.error === 'not-allowed') {
      micHint.textContent = 'マイクの許可が必要です';
      micHint.className = 'mic-hint';
    }
  };

  recognition.onend = () => {
    if (isListening) {
      // 自動再起動（連続認識）
      try { recognition.start(); } catch(_) { stopListening(); }
    } else {
      stopListening();
    }
  };

  return true;
}

function startListening() {
  if (!recognition) {
    if (!initSpeech()) {
      micHint.textContent = 'このブラウザは音声認識に対応していません';
      return;
    }
  }
  isListening = true;
  try { recognition.start(); }
  catch(e) {
    // すでに実行中の場合は停止してからスタート
    recognition.stop();
    setTimeout(() => { isListening = true; recognition.start(); }, 200);
  }
}

function stopListening() {
  isListening = false;
  if (recognition) { try { recognition.stop(); } catch(_) {} }
  micBtn.classList.remove('listening');
  micBtn.textContent = '🎤';
  micHint.textContent = 'タップして音声入力';
  micHint.className = 'mic-hint';
}

micBtn.addEventListener('click', () => {
  if (isListening) stopListening();
  else startListening();
});

// --- 手動入力 ---
addBtn.addEventListener('click', () => {
  addItem(manualInput.value);
  manualInput.value = '';
  manualInput.focus();
});

manualInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    addItem(manualInput.value);
    manualInput.value = '';
  }
});

// --- クリアボタン ---
clearBtn.addEventListener('click', () => {
  const done = items.filter(i => i.done).length;
  if (done > 0) {
    showModal(
      `チェック済み ${done} 件を削除`,
      '削除しますか？',
      clearDone,
      '削除'
    );
  } else if (items.length > 0) {
    showModal(
      'リストをすべてクリア',
      `${items.length} 件のアイテムをすべて削除しますか？`,
      clearAll,
      'クリア'
    );
  }
});

// 完了済みアイテム一括チェック解除（タイトルタップ）
doneBtn.addEventListener('click', () => {
  if (items.some(i => i.done)) {
    items.forEach(i => { i.done = false; });
    save(); render();
    showToast('チェックをすべて解除');
  }
});

// --- モーダル ---
let modalCallback = null;

function showModal(title, msg, cb, okLabel = 'OK') {
  modalMsg.textContent = `${title}\n${msg}`;
  modalOk.textContent = okLabel;
  modalCallback = cb;
  modal.classList.add('show');
}

modalOk.addEventListener('click', () => {
  modal.classList.remove('show');
  if (modalCallback) { modalCallback(); modalCallback = null; }
});

modalCancel.addEventListener('click', () => {
  modal.classList.remove('show');
  modalCallback = null;
});

modal.addEventListener('click', e => {
  if (e.target === modal) { modal.classList.remove('show'); modalCallback = null; }
});

// --- トースト ---
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

// --- 設定パネル ---
const settingsBtn     = document.getElementById('settings-btn');
const settingsPanel   = document.getElementById('settings-panel');
const settingsOverlay = document.getElementById('settings-overlay');
const settingsClose   = document.getElementById('settings-close');
const patInput        = document.getElementById('pat-input');
const patToggle       = document.getElementById('pat-toggle');
const patSave         = document.getElementById('pat-save');
const gistInfo        = document.getElementById('gist-info');
const gistIdDisplay   = document.getElementById('gist-id-display');
const gistIdCopy      = document.getElementById('gist-id-copy');
const widgetDl        = document.getElementById('widget-dl');

function openSettings() {
  settingsPanel.classList.add('show');
  settingsOverlay.classList.add('show');
  patInput.value = gistCfg.pat;
  updateGistInfo();
}

function closeSettings() {
  settingsPanel.classList.remove('show');
  settingsOverlay.classList.remove('show');
}

function updateGistInfo() {
  if (gistCfg.gistId) {
    gistInfo.style.display = 'block';
    gistIdDisplay.textContent = gistCfg.gistId;
  } else {
    gistInfo.style.display = 'none';
  }
}

settingsBtn.addEventListener('click', openSettings);
settingsClose.addEventListener('click', closeSettings);
settingsOverlay.addEventListener('click', closeSettings);

patToggle.addEventListener('click', () => {
  patInput.type = patInput.type === 'password' ? 'text' : 'password';
});

patSave.addEventListener('click', async () => {
  const pat = patInput.value.trim();
  if (!pat) { showToast('トークンを入力してください'); return; }
  gistCfg.pat = pat;
  if (pat !== gistCfg.pat) gistCfg.gistId = '';
  saveGistCfg();
  patSave.textContent = '同期中…';
  patSave.disabled = true;
  await syncToGist();
  patSave.textContent = '保存して同期';
  patSave.disabled = false;
  updateGistInfo();
  if (gistCfg.gistId) showToast('Gistに同期しました');
});

gistIdCopy.addEventListener('click', () => {
  navigator.clipboard?.writeText(gistCfg.gistId).then(() => showToast('Gist IDをコピーしました'));
});

widgetDl.addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = 'widget.js';
  a.download = 'KaimonoMemo.js';
  a.click();
});

// --- クイックスタート（ウィジェットから起動時） ---
function initQuickStart() {
  const params = new URLSearchParams(location.search);
  if (params.get('voice') !== '1') return;

  // URLからパラメータを除去（再読み込み時に再表示しないため）
  history.replaceState({}, '', location.pathname);

  const overlay = document.getElementById('quick-start');
  const qsList  = document.getElementById('qs-list');

  // 未完了アイテムをオーバーレイ下部に表示
  const pending = items.filter(i => !i.done).slice(0, 4);
  if (pending.length > 0) {
    pending.forEach(item => {
      const el = document.createElement('div');
      el.className = 'qs-item';
      el.innerHTML = `
        <div class="qs-item-dot"></div>
        <span class="qs-item-text">${escHtml(item.text)}</span>
        ${item.qty > 1 ? `<span class="qs-item-qty">×${item.qty}</span>` : ''}
      `;
      qsList.appendChild(el);
    });
    const total = items.filter(i => !i.done).length;
    if (total > 4) {
      const more = document.createElement('p');
      more.className = 'qs-more';
      more.textContent = `… あと ${total - 4} 件`;
      qsList.appendChild(more);
    }
  }

  overlay.style.display = 'flex';

  // タップで即音声開始
  overlay.addEventListener('click', () => {
    overlay.style.display = 'none';
    startListening();
  }, { once: true });
}

// --- 初期化 ---
render();
initQuickStart();
if (gistCfg.pat && gistCfg.gistId) setSyncStatus('');

// Service Worker 登録
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(e => console.warn('SW:', e));
  });
}
