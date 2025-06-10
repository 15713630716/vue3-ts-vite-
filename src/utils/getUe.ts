import { ref } from 'vue';

export function getUe(data: any) {
  // console.log('data', data);
  ue5("callbackTestCall", JSON.stringify(data))
}
export function receiveUe() {
  var ueValue = ref({} as any)
  ue.interface.getUeTestCall = (res: any) => {
    ueValue.value = JSON.parse(res)
  }
  return { ueValue };
}