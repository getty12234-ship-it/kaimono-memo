import { readFileSync } from 'fs';

const src = readFileSync('./app.js', 'utf8');
const dictStart = src.indexOf('const GROCERY_DICT');
const stateStart = src.indexOf('// --- 状態管理 ---');
const parserSrc = src.slice(dictStart, stateStart);

const fn = new Function(parserSrc + '\nreturn { parseVoiceInput, dictionarySplit, dictionarySplitWithConnectors };');
const { parseVoiceInput } = fn();

const tests = [
  // ========== 元のバグケース（ユーザー報告）==========
  { input: 'リンゴとみかんと豆腐',    expect: ['リンゴ','みかん','豆腐'],   label: '★ユーザー報告' },
  { input: 'りんごとみかんとうふ',    expect: ['りんご','みかん','とうふ'], label: '★とうふバグ修正確認' },
  { input: 'みかんとうふ',            expect: ['みかん','とうふ'],          label: '★2語とうふ' },

  // ========== 区切りなし連続発話 ==========
  { input: '牛乳リンゴ白菜',          expect: ['牛乳','リンゴ','白菜'] },
  { input: 'バナナぶどうみかん',       expect: ['バナナ','ぶどう','みかん'] },
  { input: 'トマトきゅうりなす',      expect: ['トマト','きゅうり','なす'] },
  { input: '牛乳卵チーズ',            expect: ['牛乳','卵','チーズ'] },

  // ========== 「と」「や」区切り ==========
  { input: '牛乳とリンゴと白菜',      expect: ['牛乳','リンゴ','白菜'] },
  { input: '醤油と砂糖と酢',          expect: ['醤油','砂糖','酢'] },
  { input: '卵やバターやチーズ',      expect: ['卵','バター','チーズ'] },

  // ========== 「あと」「それと」 ==========
  { input: '牛乳あと卵',              expect: ['牛乳','卵'] },
  { input: 'りんごそれと洗剤',        expect: ['りんご','洗剤'] },

  // ========== 数量付き ==========
  { input: '牛乳2本',                 expect: ['牛乳'] },
  { input: '白菜3個',                 expect: ['白菜'] },

  // ========== 辞書外はそのまま ==========
  { input: 'サラダチキン',            expect: ['サラダチキン'] },
  { input: 'トイレットペーパー',      expect: ['トイレットペーパー'] },

  // ========== 「と」の誤分割防止 ==========
  { input: 'ともかく',                expect: ['ともかく'] },
];

let ok = 0;
tests.forEach(({ input, expect, label }) => {
  const result = parseVoiceInput(input).map(r => r.text);
  const pass = JSON.stringify(result) === JSON.stringify(expect);
  const tag = label ? ` [${label}]` : '';
  console.log(`${pass ? '✅' : '❌'}${tag} 「${input}」 → ${result.join('・')}${pass ? '' : ` （期待: ${expect.join('・')}）`}`);
  if (pass) ok++;
});
console.log(`\n結果: ${ok}/${tests.length} 通過`);
