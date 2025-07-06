
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

// 入力TSV（2列）からMapに変換し、出現順も保持する（Denormalize用）
function denormalizeMap(lines) {
  const map = new Map();
  const order = [];

  for (let line of lines) {
    const [key, value = ''] = line.split('\t');
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key); // 初出順に記録
    }
    map.get(key).push(value); // 空文字でも追加
  }

  return { map, order };
}
