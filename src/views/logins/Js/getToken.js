import { useTokenStore } from "@/stores/token";
import { encrypt } from "./Js/crypto";
import APILOGIN from "./Js/login";

export function getToken() {
  APILOGIN.getCheckCode().then(({ data }) => {
    let checkCodeData = data || {};
    APILOGIN.login({
      username: "18367625987",
      password: encrypt("Zdp!5987"),
      captcha: "yanzhengma", //验证码答案
      uuid: checkCodeData.uuid,
      checkCaptcha: true,
      refresh: false,
      rememberMe: true, //是否记住密码
    })
      .then((res) => {
        // console.log("res", res);
      })
      .catch(({ data }) => {
        // console.log("data", data);
      });
  });
}
