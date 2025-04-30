import { ref } from 'vue';
import { onUnmounted } from 'vue';
export function useTime() {
  var myDate = new Date();
  // 将数字转换为对应的星期几
  const weekDays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  var date = ref(myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate());
  var time = ref(myDate.toLocaleTimeString('chinese', { hour12: false }).slice(0, 5))
  var week = ref(weekDays[myDate.getDay()])
  let timer = setInterval(() => {
    myDate = new Date();
    date.value = myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate();
    time.value = myDate.toLocaleTimeString('chinese', { hour12: false }).slice(0, 5);
    week.value = weekDays[myDate.getDay()];
  }, 30 * 1000);
  onUnmounted(() => {
    clearInterval(timer);
  });
  return { date, time, week };
}
