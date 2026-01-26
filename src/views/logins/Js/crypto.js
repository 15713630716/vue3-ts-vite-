import CryptoJS from 'crypto-js'
import md5 from 'md5'

const key = import.meta.env.VITE_APP_SECRET_KEY

const crypto_key = CryptoJS.enc.Utf8.parse(key)

const cfg = {
  mode: CryptoJS.mode.ECB,
  pad: CryptoJS.pad.Pkcs7
}

// encrypt
export const encrypt = (text) => CryptoJS.AES.encrypt(text, crypto_key, cfg).toString()

// decrypt
export const decrypt = (text) => {
  if (!text) {
    return ''
  }
  const ciphertext = CryptoJS.enc.Base64.parse(text.replace(/\s/g, ''))
  const bytes = CryptoJS.AES.decrypt({ ciphertext }, crypto_key, cfg)
  return bytes.toString(CryptoJS.enc.Utf8)
}

function getSecretKey(key) {
  const Secret_Key_Size = 32 // 固定密钥长度
  const paddingChar = ' ' // 填充字符（Java代码中用空格）

  // 将密钥转为 UTF-8 字节数组
  const keyBytes = CryptoJS.enc.Utf8.parse(key).toString(CryptoJS.enc.Latin1)
  const realKeyBytes = new Uint8Array(Secret_Key_Size)

  // 填充或截断
  for (let i = 0; i < Secret_Key_Size; i++) {
    if (i < keyBytes.length) {
      realKeyBytes[i] = keyBytes.charCodeAt(i) // 复制原始字节
    } else {
      realKeyBytes[i] = paddingChar.charCodeAt(0) // 填充空格
    }
  }

  // 转为 CryptoJS 的 WordArray 格式
  return CryptoJS.lib.WordArray.create(realKeyBytes)
}

export const encryptWithKey = (text, deKey) => {
  const realKey = getSecretKey(deKey)
  return CryptoJS.AES.encrypt(text, realKey, cfg).toString()
}
export const decryptWithKey = (text, deKey) => {
  if (!text) {
    return ''
  }
  const ciphertext = CryptoJS.enc.Base64.parse(text)
  const crypto_key2 = getSecretKey(deKey)
  const bytes = CryptoJS.AES.decrypt({ ciphertext: ciphertext }, crypto_key2, cfg)
  return bytes.toString(CryptoJS.enc.Utf8)
}

export const encryptDemo = () => {}

export const md5Encryption = (arr) => {
  const arrList = []
  for (const key in arr) {
    arrList.push({
      name: key,
      value: arr[key]
    })
  }
  let sortString = ''
  for (let i = 0; i < sortlist(arrList).length; i++) {
    const item = sortlist(arrList)[i]
    if (i < sortlist(arrList).length - 1) sortString += item.name + '=' + item.value + '&'
    else sortString += item.name + '=' + item.value
  }
  return md5(md5(sortString) + 'o8ASzhDB89ZsjvsBxK8XDA==')
}

// 数组按照某一项首字母排序
function sortlist(list) {
  return list.sort((a, b) => {
    return a['name'].localeCompare(b['name']) // value是list你需要索引的字段名称
  })
}
