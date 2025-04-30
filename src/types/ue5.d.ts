declare global {
  interface Window {
    ue5: {
      ReceiveFromVue: (message: string) => void;
    };
    vueCallback: (message: string) => void;
  }
}
export { }; // 确保文件被视为模块