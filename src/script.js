
let resultText = '';
let currentMode = '';  // normalize または denormalize

// 第一正規化：ファイルを読み込み、展開して出力
function handleNormalize() {
  currentMode = 'normalize';
  const file = document.getElementById('tsvFile').files[0];
  if (!file) return alert('TSVファイルを選んでください');

  const reader = new FileReader();
  reader.onload = function (e) {
    const lines = e.target.result.trim().split('\n');
    const output = [];

    for (let line of lines) {
      const cells = line.split('\t');
      const expanded = expandRow(cells); // logic.jsから利用
      output.push(...expanded);
    }

    resultText = output.join('\n');
    document.getElementById('output').textContent = resultText;
    document.getElementById('downloadBtn').style.display = 'inline-block';
  };
  reader.readAsText(file);
}

// 逆正規化：2列TSVを読み込み、出現順に値をまとめて出力
function handleDenormalize() {
  currentMode = 'denormalize';
  const file = document.getElementById('tsvFile').files[0];
  if (!file) return alert('TSVファイルを選んでください');

  const reader = new FileReader();
  reader.onload = function (e) {
    const lines = e.target.result.trim().split('\n');
    const { map, order } = denormalizeMap(lines); // 出現順付きMapを取得

    const output = [];
    for (let key of order) {
      const values = map.get(key);
      output.push(`${key}\t${values.join(':')}`); // 空文字含めてjoin
    }

    resultText = output.join('\n');
    document.getElementById('output').textContent = resultText;
    document.getElementById('downloadBtn').style.display = 'inline-block';
  };
  reader.readAsText(file);
}

// ダウンロード処理：モードに応じてファイル名変更
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
