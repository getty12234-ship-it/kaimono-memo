"""
parseVoiceInput と dictionarySplitWithConnectors を正しく書き換える

問題: 「みかんとうふ」→「みかん」+「うふ」になってしまう
原因: 「とうふ」の「と」が区切り文字と誤認識される
解決: 辞書マッチを優先し、コネクタ（と・や等）を読み飛ばすDPに変更
"""

with open('app.js', 'r', encoding='utf-8') as f:
    src = f.read()

# parseVoiceInput と dictionarySplit の間に dictionarySplitWithConnectors を挿入
# parseVoiceInput 関数を置換する
start = src.find('function parseVoiceInput(raw) {')
end = src.find('\nfunction dictionarySplit(', start)

if start == -1 or end == -1:
    print(f'ERROR: マーカーが見つかりません start={start} end={end}')
    exit(1)

new_funcs = r"""function parseVoiceInput(raw) {
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

"""

new_src = src[:start] + new_funcs + src[end:]

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(new_src)

print('parseVoiceInput + dictionarySplitWithConnectors を書き換えました')
