'use strict';

// =====================================================
// 食材辞書（音声入力のセグメンテーション用）
// =====================================================
const GROCERY_DICT = [
  // 野菜
  'キャベツ','白菜','はくさい','大根','だいこん','玉ねぎ','たまねぎ','オニオン',
  'にんじん','人参','ニンジン','じゃがいも','ジャガイモ','さつまいも','サツマイモ',
  'なす','ナス','トマト','ミニトマト','きゅうり','キュウリ','ピーマン','パプリカ',
  'ブロッコリー','カリフラワー','ほうれん草','ほうれんそう','小松菜','こまつな',
  'ネギ','ねぎ','長ネギ','ながねぎ','レタス','サニーレタス','水菜','みずな',
  'もやし','ゴボウ','ごぼう','れんこん','レンコン','えのき','エノキ','えのきだけ',
  'しいたけ','シイタケ','椎茸','エリンギ','まいたけ','マイタケ','しめじ','シメジ',
  'ニラ','にら','アスパラ','アスパラガス','かぼちゃ','カボチャ','ズッキーニ',
  'セロリ','パセリ','みつば','三つ葉','しょうが','ショウガ','生姜','にんにく',
  'ニンニク','大蒜','とうもろこし','トウモロコシ','枝豆','えだまめ','そら豆',
  // 果物
  'りんご','リンゴ','バナナ','みかん','ミカン','オレンジ','ぶどう','ブドウ',
  'いちご','イチゴ','メロン','スイカ','もも','モモ','桃','なし','梨','ナシ',
  'キウイ','キウイフルーツ','マンゴー','パイナップル','レモン','ライム',
  'グレープフルーツ','さくらんぼ','サクランボ','ラズベリー','ブルーベリー',
  'プルーン','あんず','アンズ','柿','かき','栗','くり',
  // 乳製品・卵
  '牛乳','ぎゅうにゅう','低脂肪乳','豆乳','アーモンドミルク',
  'ヨーグルト','プレーンヨーグルト','飲むヨーグルト',
  'バター','マーガリン','生クリーム','ホイップクリーム',
  'チーズ','スライスチーズ','クリームチーズ','粉チーズ','モッツァレラ',
  '卵','たまご','タマゴ','卵パック',
  // 豆腐・大豆製品
  '豆腐','とうふ','トウフ','絹豆腐','木綿豆腐','厚揚げ','あつあげ',
  '油揚げ','あぶらあげ','納豆','なっとう','豆乳','おから',
  // 肉類
  '牛肉','ぎゅうにく','豚肉','ぶたにく','鶏肉','とりにく','ラム肉',
  'ひき肉','ミンチ','合いびき肉','あいびきにく',
  'ソーセージ','ウインナー','フランクフルト','ベーコン','ハム','サラミ',
  '焼き鳥','やきとり','唐揚げ','からあげ','コロッケ',
  // 魚・海産物
  '鮭','さけ','サーモン','まぐろ','マグロ','あじ','アジ','鯵',
  'さば','サバ','鯖','いわし','イワシ','鰯','さんま','サンマ','秋刀魚',
  'えび','エビ','海老','たこ','タコ','蛸','いか','イカ','烏賊',
  'かつお','カツオ','鰹','ぶり','ブリ','鰤','ひらめ','ヒラメ',
  'ちくわ','はんぺん','かまぼこ','カマボコ','さつま揚げ',
  'ツナ','ツナ缶','サバ缶','いわし缶',
  // 主食・麺類
  '米','ごはん','白米','玄米','もち米','パン','食パン','バゲット',
  'うどん','そば','ラーメン','パスタ','スパゲッティ','そうめん',
  'そうめん','冷や麦','ひやむぎ','マカロニ','ペンネ','春雨','はるさめ',
  // 調味料
  '醤油','しょうゆ','薄口醤油','みそ','味噌','白みそ','赤みそ',
  '砂糖','さとう','塩','こしょう','胡椒','酢','みりん','本みりん',
  '油','サラダ油','ごま油','オリーブオイル','バターオイル',
  'ケチャップ','マヨネーズ','ドレッシング','ポン酢','ぽんず',
  'ソース','中濃ソース','ウスターソース','お好みソース',
  'だし','だしの素','コンソメ','カレールー','カレー粉','唐辛子','とうがらし',
  'わさび','ワサビ','からし','マスタード','ごま','白ごま','黒ごま',
  // 缶詰・レトルト
  '缶詰','コーン缶','トマト缶','ミックスビーンズ','レトルトカレー',
  // 飲料
  'ジュース','オレンジジュース','野菜ジュース','りんごジュース',
  'お茶','緑茶','ほうじ茶','麦茶','むぎちゃ','ウーロン茶','紅茶',
  'コーヒー','インスタントコーヒー','牛乳コーヒー',
  'ビール','発泡酒','ワイン','日本酒','焼酎','チューハイ',
  'コーラ','サイダー','炭酸水','スポーツドリンク','ポカリ','アクエリアス',
  'ミネラルウォーター','水',
  // お菓子
  'チョコレート','チョコ','クッキー','ビスケット','ポテトチップス',
  'アイス','アイスクリーム','ガム','キャンディ','グミ','ラムネ',
  'せんべい','煎餅','おかき','あられ','ポップコーン',
  // 日用品
  'シャンプー','リンス','コンディショナー','ボディソープ','石けん','石鹸',
  '洗剤','食器用洗剤','洗濯洗剤','柔軟剤','漂白剤',
  '歯ブラシ','歯磨き粉','歯磨き','フロス',
  'トイレットペーパー','ティッシュ','ボックスティッシュ','キッチンペーパー',
  'ラップ','アルミホイル','ジップロック','ゴミ袋','ビニール袋',
  '生理用品','おむつ','ウェットティッシュ',
  // その他
  'バンドエイド','マスク','消毒液','ハンドソープ',

  // 漢字表記（音声認識が返すパターン）
  'ご飯','お米','御飯',
  'お茶','緑茶','麦茶','紅茶','ほうじ茶',
  'お酒','日本酒','焼酎',
  'お味噌','お醤油',
  'お豆腐',
  '林檎','蜜柑','葡萄','苺','桃','梨','柿','栗',
  '玉葱','人参','大根','牛蒡','蓮根','南瓜','茄子','胡瓜',
  '白菜','小松菜','春菊','水菜','三つ葉','生姜','大蒜',
  '鶏卵','玉子','玉卵',
  '豚肉','牛肉','鶏肉','挽肉','合挽',
  '鮭','鯖','鰯','鯵','鰤','鰹','鮪',
  '海老','蛸','烏賊',
  '醤油','味噌','砂糖','胡椒','唐辛子',
  '牛乳','豆乳',
  '蕎麦','素麺','冷麦',
  'トイレットペーパー','ティッシュペーパー',
].sort((a, b) => b.length - a.length); // 長い単語を優先

// =====================================================
// 音声入力パーサー
// =====================================================

/**
 * 発話テキストを複数のアイテムに分割する
 * 例: 「牛乳とリンゴ白菜3個」→ [{text:'牛乳',qty:1}, {text:'リンゴ',qty:1}, {text:'白菜',qty:3}]
 */
function parseVoiceInput(raw) {
  let text = raw
    .replace(/[。！？!?]/g, ' ')
    .replace(/(を|も)?(追加|登録|メモ|入れて|買って|お願い|ください|してください|欲しい|ほしい)$/u, '')
    .trim();

  if (!text) return [];

  // 数量を先に抽出
  const qmFull = text.match(/^(.+?)[\s　]*(\d+)\s*[個本袋パック枚缶箱冊切玉束房]?$/u);
  const baseText = qmFull ? qmFull[1].trim() : text;
  const globalQty = qmFull ? parseInt(qmFull[2]) : null;

  // ① コネクタ対応辞書分割を優先
  const dictResult = dictionarySplitWithConnectors(baseText);
  if (dictResult) {
    return dictResult.map((t, i) => ({
      text: t,
      qty: (globalQty && i === dictResult.length - 1) ? globalQty : 1
    }));
  }

  // ② フォールバック: 明示的な区切り語で分割
  const normalized = baseText
    .replace(/それと|あと|ついでに|そして|さらに/gu, '|')
    .replace(/([^\s|])と([^ても\sはかがもで|])/gu, '$1|$2')
    .replace(/([^\s|])や([^\s|])/gu, '$1|$2')
    .replace(/[、,，\s　]+/g, '|');

  const segments = normalized.split('|').map(s => s.trim()).filter(s => s.length > 0);

  const result = [];
  for (const seg of segments) {
    const qm = seg.match(/^(.+?)[\s　]*(\d+)\s*[個本袋パック枚缶箱冊切玉束房]?$/u);
    if (qm) {
      const subItems = dictionarySplit(qm[1].trim());
      const qty = parseInt(qm[2]);
      subItems.forEach((t, i) => result.push({ text: t, qty: i === subItems.length - 1 ? qty : 1 }));
    } else {
      dictionarySplit(seg).forEach(t => result.push({ text: t, qty: 1 }));
    }
  }
  return result;
}

/**
 * コネクタ（と・や等）を読み飛ばしながら辞書語を最大マッチするDP
 * 「りんごとみかんとうふ」→ ['りんご','みかん','とうふ']
 * 「リンゴみかん豆腐」  → ['リンゴ','みかん','豆腐']
 * 全体を辞書語+コネクタでカバーできない場合は null を返す
 */
function dictionarySplitWithConnectors(text) {
  const CONNECTORS = [
    'それと','あと','ついでに','そして','さらに',
    'と','や','、',',',' '
  ];
  const n = text.length;
  const dp = new Array(n + 1).fill(null);
  dp[0] = [];

  for (let i = 0; i < n; i++) {
    if (dp[i] === null) continue;

    // 辞書語を優先マッチ
    for (const word of GROCERY_DICT) {
      if (i + word.length <= n && text.startsWith(word, i)) {
        const j = i + word.length;
        if (dp[j] === null) dp[j] = [...dp[i], word];
      }
    }

    // 直前に辞書語がある場合のみコネクタをスキップ
    if (dp[i].length > 0) {
      for (const conn of CONNECTORS) {
        if (text.startsWith(conn, i)) {
          const j = i + conn.length;
          if (dp[j] === null) dp[j] = [...dp[i]]; // コネクタは追加しない
        }
      }
    }
  }

  if (dp[n] !== null && dp[n].length >= 2) return dp[n];
  return null;
}


function dictionarySplit(text) {
  if (!text) return [];
  const n = text.length;
  // dp[i] = インデックス0〜i-1を辞書語でカバーした場合の単語リスト
  const dp = new Array(n + 1).fill(null);
  dp[0] = [];

  for (let i = 0; i < n; i++) {
    if (dp[i] === null) continue;
    for (const word of GROCERY_DICT) {
      if (i + word.length <= n && text.startsWith(word, i)) {
        const j = i + word.length;
        if (dp[j] === null) dp[j] = [...dp[i], word];
      }
    }
  }

  // 完全カバーでき、かつ2語以上に分割できた場合のみ分割を採用
  if (dp[n] !== null && dp[n].length >= 2) return dp[n];
  return [text];
}

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

/** 1件追加（内部用） */
function addSingleItem(name, qty = 1) {
  name = name.trim();
  if (!name) return false;
  // 同名アイテムがあれば数量追加
  const existing = items.find(i => i.text === name && !i.done);
  if (existing) {
    existing.qty = (existing.qty || 1) + qty;
    return 'updated';
  }
  items.unshift({ id: Date.now(), text: name, qty, done: false });
  return 'added';
}

/** テキスト入力から複数アイテムを解析して追加（音声・手動共通） */
function addItem(text) {
  text = text.trim();
  if (!text) return;

  const parsed = parseVoiceInput(text);

  if (parsed.length === 0) return;

  if (parsed.length === 1) {
    const r = addSingleItem(parsed[0].text, parsed[0].qty);
    save(); render();
    if (r === 'updated') showToast(`「${parsed[0].text}」の数量を更新`);
    else                 showToast(`「${parsed[0].text}」を追加`);
    return;
  }

  // 複数アイテム
  let addedNames = [];
  parsed.forEach(({ text: t, qty }) => {
    const r = addSingleItem(t, qty);
    if (r) addedNames.push(t);
  });
  save(); render();
  showToast(`${addedNames.length} 件追加：${addedNames.join('・')}`);
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
