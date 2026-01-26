import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSectionStore = defineStore('section', () => {
  const ALLSECTION = {
    abbreviation: '全部标段',
    id: '',
    name: '全部标段',
    type: ''
  }
  const sectionList = ref([])
  const sectionListWithValue = ref([])
  const currentSection = ref({})

  const setSectionList = (v) => {
    sectionList.value = v.length > 1 ? [ALLSECTION, ...v] : v
    sectionListWithValue.value = v
    // 当只有一个标段的时候默认
    if(sectionList.value.length === 2) {
      currentSection.value = sectionList.value[1]
    }else {
      currentSection.value = sectionList.value[0]
    }
  }

  const setCurrentSection = (v) => {
    currentSection.value = v
  }

  const getSectionName = (sectionId) => (sectionList.value || []).find((i) => i.id === sectionId)?.abbreviation
  return { sectionList, sectionListWithValue, currentSection, setCurrentSection, setSectionList, getSectionName }
})
