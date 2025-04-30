import axios from 'axios';
import { useStoreToken } from '@/store/index';
import sha1 from 'crypto-js/sha1';

// 获取随机码
function generateRandomString(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // 包含字符和数字
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length); // 随机索引
    result += chars[randomIndex]; // 获取对应字符并添加到结果字符串
  }
  return result;
}
// 加密方法
async function generateSHA1(inputStr:string) {
  // const encoder = new TextEncoder();
  // const data = encoder.encode(inputStr);
  // const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  // const hashArray = Array.from(new Uint8Array(hashBuffer));
  // const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  // return hashHex;
  return sha1(inputStr).toString();
}

export async function axiosToken() {
  const nonces = generateRandomString()
  const timestamps = Date.now();
  const hash = await generateSHA1("appKey=AF7DE6D597FAD67C4249B2A4CCD80" + "&appSecret=MsYuIuWm1AWrJwaeiDP8PyVra7hTdRkO" + "&nonce=" + nonces + "&timestamp=" + timestamps);
  const data = {
    appKey: 'AF7DE6D597FAD67C4249B2A4CCD80',
    nonce: nonces,
    sign: hash,
    timestamp: timestamps
  }
  await axios.post('https://zhgl.zjdyit.com/zdwp-api/v3/auth/access_token', data, {
    headers: {
      'Content-Type': 'application/json',
      'Tenant-Id' : "1894712966457069569",
      'Project-Id': "1813759284281929730"
    }
  })
    .then(response => {
      // console.log(response);
      if (response.data.code == '200') {
        const storeToken = useStoreToken();
        storeToken.setToken(response.data.data.accessToken);
      }
    })
    .catch(error => {
      console.error('请求失败：', error);
    });
}