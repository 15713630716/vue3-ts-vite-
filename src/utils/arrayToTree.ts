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
/**
 * 模糊查询数组中的某个字段
 * @param {Array} arr - 要查询的数组
 * @param {string} field - 要查询的字段名
 * @param {string} key - 查询关键字
 * @param {boolean} [caseSensitive=false] - 是否区分大小写，默认不区分
 * @returns {Array} 包含查询关键字的元素组成的新数组
 */
export function fuzzySearch(arr:any, field:any, key:any, caseSensitive = false) {
  if (!Array.isArray(arr)) {
    console.warn('第一个参数必须是数组');
    return [];
  }
  
  if (!key || typeof key !== 'string') {
    console.warn('查询关键字不能为空');
    return arr; // 返回原数组
  }
  
  const searchKey = caseSensitive ? key : key.toLowerCase();
  
  return arr.filter(item => {
    if (!item || typeof item !== 'object' || !item[field]) {
      return false;
    }
    
    const fieldValue = String(item[field]);
    const compareValue = caseSensitive ? fieldValue : fieldValue.toLowerCase();
    
    return compareValue.includes(searchKey);
  });
}
// 删除第一个匹配的元素
export function removeByValue(array:any, value:any){
  const index = array.indexOf(value);
  if (index > -1) {
    array.splice(index, 1);
  }
  return array;
};
// 对数组某一个元素求和
export function arrAySun (data:any, key:any){
  const sum1 = data.reduce((total:any, item:any) => {
  return total + item[key];
}, 0);
  return sum1;
};

/**
 * 按key字段分组，每组包含name和data字段
 * @param {Array} array 要分组的数组
 * @param {String} key 分组的字段名
 * @returns {Array} 分组后的数组，每项包含name和data字段
 */
export function groupArrayWithNameData(array:any, key:any,keyName:any) {
  const groups = {} as any;
  
  // 第一步：按key字段分组
  array.forEach((item:any) => {
    const keyValue = item[key];
    
    if (!groups[keyValue]) {
      groups[keyValue] = [];
    }
    
    groups[keyValue].push(item);
  });
  
  // 第二步：转换为目标格式
  const result = [] as any;
  
  Object.keys(groups).forEach(keyValue => {
    result.push({
      name: groups[keyValue][groups[keyValue]?.length-1][keyName],        // 存储key值
      data: groups[keyValue] // 存储相同key的数据数组
    });
  });
  
  return result;
}

/**
 * 统计数组中符合条件的元素数量
 * @param {Array} data - 要遍历的数组
 * @param {string} fieldName - 要判断的字段名
 * @param {*} targetValue - 目标值（默认 1）
 * @param {string} childrenKey - 子数组字段名（默认 'children'）
 * @returns {number} 符合条件的元素总数
 */
export function countByField(data:any, fieldName:any, targetValue = 1, childrenKey = 'children') {
  if (!Array.isArray(data)) {
    return 0
  }
  
  let count = 0
  
  const traverse = (arr:any) => {
    for (const item of arr) {
      // 检查当前元素是否满足条件
      if (item && item[fieldName] == targetValue) {
        count++
      }
      
      // 如果有子数组，递归遍历
      if (Array.isArray(item[childrenKey]) && item[childrenKey].length > 0) {
        traverse(item[childrenKey])
      }
    }
  }
  
  traverse(data)
  return count
}
export function countByFieldXiao(data:any, fieldName:any, targetValue = 1, childrenKey = 'children') {
  if (!Array.isArray(data)) {
    return 0
  }
  
  let count = 0
  
  const traverse = (arr:any) => {
    for (const item of arr) {
      // 检查当前元素是否满足条件
      if (item && item[fieldName] < targetValue) {
        count++
      }
      
      // 如果有子数组，递归遍历
      if (Array.isArray(item[childrenKey]) && item[childrenKey].length > 0) {
        traverse(item[childrenKey])
      }
    }
  }
  
  traverse(data)
  return count
}
export function countByFieldGao(data:any, fieldName:any, targetValue = 1, childrenKey = 'children') {
  if (!Array.isArray(data)) {
    return 0
  }
  
  let count = {}

  data.map(item=>{
    if (Array.isArray(item[childrenKey]) && item[childrenKey].length > 0) {
      item[childrenKey].map(items=>{
        if (items && items[fieldName] < targetValue) {
        count = item
      }
      })
    }
  })
  return count
}

/**
 * 截取字符串中第一个括号内的内容
 * @param {string} str - 输入字符串
 * @returns {string|null} 括号内的内容，没有括号返回null
 */
export function getContentInBrackets(str:string) {
  if (typeof str !== 'string') {
    return null
  }
  
  const match = str.match(/\((.*?)\)/)
  return match ? match[1] : null
}