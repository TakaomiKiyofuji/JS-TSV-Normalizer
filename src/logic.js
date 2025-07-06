// 各セルをコロンで分割し、全組み合わせ（直積）を生成（Normalize用）
function expandRow(cells) {
  const valuesList = cells.map(cell => cell.split(':'));
  const results = [];

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

// 入力TSV（2列）からMapに変換する（Denormalize用）
function denormalizeMap(lines) {
  const map = new Map();

  for (let line of lines) {
    const [key, value] = line.split('\t');
    if (!map.has(key)) map.set(key, []);
    if (value) map.get(key).push(value);
  }

  return map;
}