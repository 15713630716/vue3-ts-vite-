/**
 * 将一维数组转换为树形结构
 * @param {Array} flatArray 一维数组
 * @param {string} parentField 判断是否为父节点的字段名
 * @returns {Array} 树形结构数组
 */
export function arrayToTree(flatArray: any, parentField: any) {
  if (!Array.isArray(flatArray) || flatArray.length === 0) {
    return [];
  }

  const tree = [];
  let currentParent = null;

  for (const item of flatArray) {
    // 检查当前项是否包含父节点字段
    // const isParent = item.hasOwnProperty(parentField);
    const isParent = item[parentField];

    if (!isParent) {
      // 如果是父节点，创建一个新节点并添加到树中
      const newNode = { ...item, children: [], disabled: true };
      tree.push(newNode);
      currentParent = newNode;
    } else {
      // 如果不是父节点，且存在当前父节点，则添加到当前父节点的children中
      if (currentParent) {
        currentParent.children.push(item);
      } else {
        // 如果第一个节点就不是父节点，则直接添加到树中
        tree.push(item);
      }
    }
  }

  return tree;

}

export function sortByNumberFieldAdvanced(array: any, field: any, order = 'asc') {
  const newArray = [...array];

  const compare = (a: any, b: any) => {
    const valA = a[field];
    const valB = b[field];

    // 分割数字部分
    const partsA = String(valA).split('.').map(Number);
    const partsB = String(valB).split('.').map(Number);

    // 逐级比较
    for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
      const numA = partsA[i] || 0;
      const numB = partsB[i] || 0;

      if (numA !== numB) {
        return order === 'asc' ? numA - numB : numB - numA;
      }
    }

    return 0;
  };

  return newArray.sort(compare);
}

export function parseDamSection(str: any) {
  // 使用正则匹配
  // const match = str.match(/^(\d+)-(\d+)-(\d+)\(([^)]+)\)$/);
  const match = str.match(/^(\d+)-(\d+)-(\d+)[(（]([^)）]+)[)）]$/);
  if (!match) {
    return null;
  }
  return {
    ba: parseInt(match[1], 10),
    cang: parseInt(match[2], 10),
    dian: parseInt(match[3], 10),
    type: match[4],
  };
}