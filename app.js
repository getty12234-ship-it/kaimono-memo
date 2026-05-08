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

// --- 永続化 ---
function save() {
  localStorage.setItem('kaimono', JSON.stringify(items));
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

// --- 初期化 ---
render();

// Service Worker 登録
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(e => console.warn('SW:', e));
  });
}
