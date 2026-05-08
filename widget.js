// 買い物メモ Scriptable Widget
// ─────────────────────────────────────
// 【設定方法】
//   ウィジェット長押し → 「ウィジェットを編集」→「パラメータ」に Gist ID を貼り付ける
// ─────────────────────────────────────

const GIST_ID  = args.widgetParameter?.trim() || "";
const APP_URL  = "https://getty12234-ship-it.github.io/kaimono-memo/";
const CACHE_KEY = "kaimono_widget_v1";

// カラー定義
const C = {
  bg:     new Color("#1a1a2e"),
  surface:new Color("#16213e"),
  accent: new Color("#4ecca3"),
  accent2:new Color("#e94560"),
  text:   new Color("#eaeaea"),
  dim:    new Color("#8888aa"),
};

// ----- データ取得 -----
async function fetchItems() {
  if (!GIST_ID) return null;
  try {
    const req = new Request(`https://api.github.com/gists/${GIST_ID}`);
    req.headers = { Accept: "application/vnd.github+json" };
    req.timeoutInterval = 10;
    const data = await req.loadJSON();
    const raw = data?.files?.["kaimono-memo.json"]?.content;
    if (!raw) return [];
    const items = JSON.parse(raw);
    Keychain.set(CACHE_KEY, raw);
    return items;
  } catch (_) {
    // オフライン時はキャッシュから
    if (Keychain.contains(CACHE_KEY)) {
      try { return JSON.parse(Keychain.get(CACHE_KEY)); } catch (_) {}
    }
    return null;
  }
}

// ----- ホーム画面ウィジェット -----
function buildHomeWidget(items, family) {
  const w = new ListWidget();
  w.url = APP_URL;
  w.backgroundColor = C.bg;
  w.setPadding(14, 14, 10, 14);
  w.refreshAfterDate = new Date(Date.now() + 20 * 60 * 1000);

  const maxRows = family === "small" ? 4 : family === "medium" ? 5 : 10;
  const fontSize = family === "small" ? 12 : 13;

  // ヘッダー
  const hdr = w.addStack();
  hdr.layoutHorizontally();
  hdr.centerAlignContent();

  const ic = hdr.addText("🛒");
  ic.font = Font.boldSystemFont(family === "small" ? 14 : 16);

  hdr.addSpacer(6);

  const ttl = hdr.addText("買い物メモ");
  ttl.font = Font.boldSystemFont(family === "small" ? 14 : 16);
  ttl.textColor = C.accent;
  ttl.lineLimit = 1;

  hdr.addSpacer();

  if (!items) {
    w.addSpacer();
    const e = w.addText(GIST_ID ? "取得できません" : "Gist IDを\n設定してください");
    e.font = Font.systemFont(12);
    e.textColor = C.dim;
    e.centerAlignText();
    w.addSpacer();
    return w;
  }

  const pending = items.filter(i => !i.done);
  const doneCount = items.length - pending.length;

  const cnt = hdr.addText(String(pending.length));
  cnt.font = Font.boldSystemFont(family === "small" ? 16 : 18);
  cnt.textColor = pending.length === 0 ? C.accent : C.text;

  w.addSpacer(8);

  if (pending.length === 0) {
    w.addSpacer();
    const ok = w.addText("✓ すべて購入済み！");
    ok.font = Font.mediumSystemFont(13);
    ok.textColor = C.accent;
    ok.centerAlignText();
    w.addSpacer();
  } else {
    pending.slice(0, maxRows).forEach(item => {
      const row = w.addStack();
      row.layoutHorizontally();
      row.centerAlignContent();

      const dot = row.addText("○ ");
      dot.font = Font.systemFont(fontSize - 1);
      dot.textColor = C.accent;

      const lbl = row.addText(item.text);
      lbl.font = Font.systemFont(fontSize);
      lbl.textColor = C.text;
      lbl.lineLimit = 1;

      if (item.qty > 1) {
        row.addSpacer(4);
        const q = row.addText(`×${item.qty}`);
        q.font = Font.systemFont(fontSize - 1);
        q.textColor = C.accent;
      }
      w.addSpacer(4);
    });

    if (pending.length > maxRows) {
      const more = w.addText(`  … あと ${pending.length - maxRows} 件`);
      more.font = Font.systemFont(11);
      more.textColor = C.dim;
    }
  }

  w.addSpacer();

  if (doneCount > 0 && family !== "small") {
    const foot = w.addText(`${doneCount} 件チェック済み`);
    foot.font = Font.systemFont(10);
    foot.textColor = C.dim;
  }

  return w;
}

// ----- ロック画面ウィジェット -----
function buildLockWidget(items, family) {
  const w = new ListWidget();
  w.url = APP_URL;
  w.refreshAfterDate = new Date(Date.now() + 20 * 60 * 1000);

  const pending = items ? items.filter(i => !i.done) : [];

  // 〇型（件数表示）
  if (family === "accessoryCircular") {
    const stack = w.addStack();
    stack.layoutVertically();
    stack.centerAlignContent();

    if (!items) {
      const t = stack.addText("?");
      t.font = Font.boldSystemFont(22);
      t.textColor = C.accent;
      t.centerAlignText();
    } else {
      const n = stack.addText(String(pending.length));
      n.font = Font.boldSystemFont(24);
      n.textColor = C.accent;
      n.centerAlignText();
      const lbl = stack.addText(pending.length === 0 ? "完了" : "件");
      lbl.font = Font.systemFont(10);
      lbl.textColor = C.dim;
      lbl.centerAlignText();
    }
    return w;
  }

  // 1行テキスト
  if (family === "accessoryInline") {
    let txt;
    if (!items) {
      txt = "🛒 Gist IDを設定してください";
    } else if (pending.length === 0) {
      txt = "🛒 買い物リストは空です";
    } else {
      const labels = pending.map(i => i.text + (i.qty > 1 ? `×${i.qty}` : ""));
      txt = "🛒 " + labels.join("・");
    }
    const t = w.addText(txt);
    t.font = Font.systemFont(12);
    return w;
  }

  // 横長（最大3件＋件数）
  if (family === "accessoryRectangular") {
    w.setPadding(4, 8, 4, 8);

    const hdr = w.addStack();
    hdr.layoutHorizontally();
    hdr.centerAlignContent();

    const ttl = hdr.addText("🛒 買い物メモ");
    ttl.font = Font.boldSystemFont(11);
    hdr.addSpacer();

    const cnt = hdr.addText(items ? `${pending.length} 件` : "–");
    cnt.font = Font.boldSystemFont(11);
    cnt.textColor = C.accent;

    w.addSpacer(3);

    if (!items) {
      const e = w.addText("設定が必要です");
      e.font = Font.systemFont(11);
      e.textColor = C.dim;
    } else if (pending.length === 0) {
      const ok = w.addText("✓ すべて購入済み！");
      ok.font = Font.mediumSystemFont(11);
      ok.textColor = C.accent;
    } else {
      pending.slice(0, 3).forEach(item => {
        const row = w.addStack();
        row.layoutHorizontally();
        row.centerAlignContent();

        const dot = row.addText("• ");
        dot.font = Font.systemFont(11);
        dot.textColor = C.accent;

        const lbl = row.addText(item.text + (item.qty > 1 ? ` ×${item.qty}` : ""));
        lbl.font = Font.systemFont(11);
        lbl.lineLimit = 1;
      });
      if (pending.length > 3) {
        const more = w.addText(`  +${pending.length - 3} 件`);
        more.font = Font.systemFont(10);
        more.textColor = C.dim;
      }
    }
    return w;
  }

  return w;
}

// ----- メイン -----
const items  = await fetchItems();
const family = config.widgetFamily ?? "medium";

const isLock = ["accessoryCircular","accessoryRectangular","accessoryInline"].includes(family);
const widget = isLock ? buildLockWidget(items, family) : buildHomeWidget(items, family);

if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  // Scriptable から直接実行したときはプレビュー表示
  await widget.presentMedium();
}
Script.complete();
