
let resultText = '';
let currentMode = '';  // normalize または denormalize

// 第一正規化：ファイルを読み込み、コロン区切りの値を展開して全組み合わせを出力
function handleNormalize() {
  currentMode = 'normalize';  // モード設定
  const file = document.getElementById('tsvFile').files[0];
  if (!file) return alert('TSVファイルを選んでください');

  const reader = new FileReader();
  reader.onload = function (e) {
    const lines = e.target.result.trim().split('\n');
    const output = [];

    for (let line of lines) {
      const cells = line.split('\t'); // タブ区切りでセル分割
      const expanded = expandRow(cells); // コロン区切りを展開
      output.push(...expanded); // 全組み合わせを出力
    }

    resultText = output.join('\n');
    document.getElementById('output').textContent = resultText;
    document.getElementById('downloadBtn').style.display = 'inline-block';
  };
  reader.readAsText(file);
}

// 各セルをコロンで分割し、全組み合わせ（直積）を生成
function expandRow(cells) {
  const valuesList = cells.map(cell => cell.split(':'));
  const results = [];

  // 深さ優先探索で全組み合わせを生成
  function dfs(index, current) {
    if (index === valuesList.length) {
      results.push(current.join('\t'));
      return;
    }
    for (let val of valuesList[index]) {
      dfs(index + 1, current.concat(val));
    }
  }

  dfs(0, []);
  return results;
}

// 逆正規化：2列のキー・値データから、値をコロンでまとめて元の形式に復元
function handleDenormalize() {
  currentMode = 'denormalize';  // モード設定
  const file = document.getElementById('tsvFile').files[0];
  if (!file) return alert('TSVファイルを選んでください');

  const reader = new FileReader();
  reader.onload = function (e) {
    const lines = e.target.result.trim().split('\n');
    const map = new Map();

    for (let line of lines) {
      const [key, value] = line.split('\t');
      if (!map.has(key)) map.set(key, []);
      if (value) map.get(key).push(value);
    }

    const output = [];
    for (let [key, values] of map.entries()) {
      if (values.length > 0) {
        output.push(`${key}\t${values.join(':')}`);
      } else {
        output.push(`${key}\t`); // 値が空でも2列出力
      }
    }

    resultText = output.join('\n');
    document.getElementById('output').textContent = resultText;
    document.getElementById('downloadBtn').style.display = 'inline-block';
  };
  reader.readAsText(file);
}

// ダウンロード処理：モードに応じてファイル名を変更して保存
function downloadResult() {
  const blob = new Blob([resultText], { type: 'text/tab-separated-values' });

  const filename =
    currentMode === 'normalize'
      ? 'Normalize_result.tsv'
      : currentMode === 'denormalize'
        ? 'Denormalize_result.tsv'
        : 'result.tsv';

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
