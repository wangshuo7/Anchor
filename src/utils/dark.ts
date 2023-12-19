import { useDark, useToggle } from '@vueuse/core'

export const isDark = useDark({
  storage: sessionStorage
})
export const toggleDark = useToggle(isDark)
