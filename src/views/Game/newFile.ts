import { ref, onMounted, watch, computed } from 'vue'
import { buyGame, getGameList } from '../../api/game'
import Moment from 'moment'
import HModel from '../../components/HModel/index.vue'
import { ElMessage, FormInstance } from 'element-plus'
import { useGlobalStore } from '../../store/globalStore'
import router from '../../router'

export default await (async () => {
  const {
    defineProps,
    defineSlots,
    defineEmits,
    defineExpose,
    defineModel,
    defineOptions,
    withDefaults
  } = await import('vue')
  const globalStore = useGlobalStore()
  const platforms = ref<any>([]) // 获取平台
  const languages = ref<any>([]) // 获取语言
  const categories = ref<any>([]) // 获取分类
  const getLanguageTitle = (game_lang_id: any) => {
    const ids = game_lang_id.split(',').map(Number)
    const titles = ids.map((id: any) => {
      const language = languages.value.find((item: any) => item.id === id)
      return language ? language.title : '未知'
    })
    return titles.join(',')
  }
  const getCategoriesTitle = (game_cate_id: any) => {
    const ids = game_cate_id.split(',').map(Number)
    const titles = ids.map((id: any) => {
      const category = categories.value.find((item: any) => item.id === id)
      return category ? category.title : '未知'
    })
    return titles.join(',')
  }
  const getPlatformsTitle = (game_pingtai_id: any) => {
    const ids = game_pingtai_id.split(',').map(Number)
    const titles = ids.map((id: any) => {
      const platform = platforms.value.find((item: any) => item.id === id)
      return platform ? platform.title : '未知'
    })
    return titles.join(',')
  }
  const queryForm = ref<any>({
    title: '',
    sort: ''
  })
  const tableData = ref<any>()
  const dialogVisible = ref<boolean>()
  const secondVisible = ref<boolean>()
  const ruleFormRef = ref<FormInstance>()
  // 套餐
  const thePackage = ref<number>(0)
  const packages = computed(() => {
    const item =
      tableData.value.find((game: any) => game.game_id === buyID.value) || {}
    return item.taocan.map((i: any, index: number) => {
      return Object.assign({}, i, { id: index + 1 })
    })
  })
  function selectPackage() {
    if (thePackage.value === 0) {
      ruleFormRef.value?.resetFields()
      return
    }
    ruleFormRef.value?.clearValidate(['tprice', 'tdays'])
    const selectedPackageItem = packages.value.find(
      (item: any) => item.id === thePackage.value
    )
    // 检查选中的套餐对象是否存在
    if (selectedPackageItem) {
      const { tdays, tprice } = selectedPackageItem
      form.value.tdays = tdays
      form.value.tprice = tprice
    }
  }
  function confirmOrder() {
    ruleFormRef.value?.validate((valid, filed) => {
      if (valid) {
        // secondVisible.value = true
        onComputed()
      } else {
        // 表单验证未通过
        console.log('filed', filed)
      }
    })
  }
  const buyID = ref<number>() // 购买时所用id
  const loading = ref<boolean>(false)
  // 分页相关
  const currentPage = ref<number>(1) // 当前页
  const pageSize = ref<number>(10) // 每页显示条数
  const totalItems = ref<number>(0) // 总数据条数

  // 当每页显示条数发生变化时触发
  function handleSizeChange(newSize: number) {
    pageSize.value = newSize
    currentPage.value = 1 // 切换每页显示条数时，重置到第一页
    query()
  }

  // 当页码发生变化时触发
  function handleCurrentChange(newPage: number) {
    currentPage.value = newPage
    query()
  }

  // 添加表单
  const form = ref<{
    tdays: string
    tprice: string
    code: string
  }>({
    tdays: '',
    tprice: '',
    code: ''
  })
  // 购买
  function onBuyGame(row: any) {
    dialogVisible.value = true
    buyID.value = row.game_id
  }
  // 弹出框确定
  async function confirm() {
    const res: any = await buyGame({
      game_id: buyID.value,
      tdays: form.value.tdays,
      tprice: form.value.tprice,
      code: form.value.code
    })
    if (res.code === 200) {
      ElMessage.success('购买成功')
      dialogVisible.value = false
      secondVisible.value = false
      query()
    }
  }
  // 反馈列表
  function goFeedback(row: any) {
    router.push({
      name: 'GameFeedback',
      query: {
        id: row.game_id,
        name: row.title
      }
    })
  }
  // 计算
  const jisuanData = ref<any>()
  async function onComputed() {
    const res: any = await buyGame({
      game_id: buyID.value,
      tdays: form.value.tdays,
      tprice: form.value.tprice,
      code: form.value.code,
      is_jisuan: 1
    })
    jisuanData.value = res.data
    if (res.code === 200) {
      secondVisible.value = true
    }
  }
  // 查询
  async function query() {
    try {
      loading.value = true
      const response = await getGameList({
        page: currentPage.value,
        page_size: pageSize.value,
        title: queryForm.value.title,
        orderby: queryForm.value.sort
      })
      tableData.value = response?.data?.list
      console.log('table', tableData.value)
      totalItems.value = response?.data?.count
      loading.value = false
    } catch (error) {
      console.error('Error fetching data: ', error)
    }
  }
  // 清空
  function onClear() {
    queryForm.value = {}
  }
  watch(dialogVisible, () => {
    thePackage.value = 0
    ruleFormRef.value?.resetFields()
    form.value = {
      tdays: '',
      tprice: '',
      code: ''
    }
  })
  // 获取列表
  onMounted(async () => {
    await globalStore.setLanguage()
    await globalStore.setCategory()
    await globalStore.setPlatform()
    languages.value = globalStore.language
    categories.value = globalStore.category
    platforms.value = globalStore.platform
    query()
  })

  // 时间格式化
  function formatTime(time: number) {
    return time ? Moment(time * 1000).format('YYYY-MM-DD HH:mm:ss') : '-'
  }

  const __VLS_componentsOption = {}

  const __VLS_name = 'Game' as const
  function __VLS_template() {
    let __VLS_ctx!: InstanceType<
      __VLS_PickNotAny<typeof __VLS_internalComponent, new () => {}>
    > & {}
    /* Components */
    let __VLS_otherComponents!: NonNullable<
      typeof __VLS_internalComponent extends { components: infer C } ? C : {}
    > &
      typeof __VLS_componentsOption
    let __VLS_own!: __VLS_SelfComponent<
      typeof __VLS_name,
      typeof __VLS_internalComponent &
        (new () => { $slots: typeof __VLS_slots })
    >
    let __VLS_localComponents!: typeof __VLS_otherComponents &
      Omit<typeof __VLS_own, keyof typeof __VLS_otherComponents>
    let __VLS_components!: typeof __VLS_localComponents &
      __VLS_GlobalComponents &
      typeof __VLS_ctx
    /* Style Scoped */
    type __VLS_StyleScopedClasses = {} & { container?: boolean } & {
      pagination?: boolean
    } & { 'el-input'?: boolean }
    let __VLS_styleScopedClasses!:
      | __VLS_StyleScopedClasses
      | keyof __VLS_StyleScopedClasses
      | (keyof __VLS_StyleScopedClasses)[]
    /* CSS variable injection */
    /* CSS variable injection end */
    let __VLS_resolvedLocalAndGlobalComponents!: {} & __VLS_WithComponent<
      'session',
      typeof __VLS_localComponents,
      'Session',
      'session',
      'session'
    > &
      __VLS_WithComponent<
        'ElForm',
        typeof __VLS_localComponents,
        'ElForm',
        'elForm',
        'el-form'
      > &
      __VLS_WithComponent<
        'ElFormItem',
        typeof __VLS_localComponents,
        'ElFormItem',
        'elFormItem',
        'el-form-item'
      > &
      __VLS_WithComponent<
        'ElInput',
        typeof __VLS_localComponents,
        'ElInput',
        'elInput',
        'el-input'
      > &
      __VLS_WithComponent<
        'ElSelect',
        typeof __VLS_localComponents,
        'ElSelect',
        'elSelect',
        'el-select'
      > &
      __VLS_WithComponent<
        'ElOption',
        typeof __VLS_localComponents,
        'ElOption',
        'elOption',
        'el-option'
      > &
      __VLS_WithComponent<
        'ElButton',
        typeof __VLS_localComponents,
        'ElButton',
        'elButton',
        'el-button'
      > &
      __VLS_WithComponent<
        'HModel',
        typeof __VLS_localComponents,
        'HModel',
        'HModel',
        'HModel'
      > &
      __VLS_WithComponent<
        'ElTable',
        typeof __VLS_localComponents,
        'ElTable',
        'elTable',
        'el-table'
      > &
      __VLS_WithComponent<
        'ElTableColumn',
        typeof __VLS_localComponents,
        'ElTableColumn',
        'elTableColumn',
        'el-table-column'
      > &
      __VLS_WithComponent<
        'ElPagination',
        typeof __VLS_localComponents,
        'ElPagination',
        'elPagination',
        'el-pagination'
      > &
      __VLS_WithComponent<
        'ElDialog',
        typeof __VLS_localComponents,
        'ElDialog',
        'elDialog',
        'el-dialog'
      >
    __VLS_components.Session
    __VLS_components.Session
    __VLS_components.Session
    __VLS_components.Session
    __VLS_components.session
    __VLS_components.session
    __VLS_components.session
    __VLS_components.session
    // @ts-ignore
    ;[session, session, session, session]
    __VLS_components.ElForm
    __VLS_components.ElForm
    __VLS_components.ElForm
    __VLS_components.ElForm
    __VLS_components.elForm
    __VLS_components.elForm
    __VLS_components.elForm
    __VLS_components.elForm
    __VLS_components['el-form']
    __VLS_components['el-form']
    __VLS_components['el-form']
    __VLS_components['el-form']
    // @ts-ignore
    ;[ElForm, ElForm, ElForm, ElForm]
    __VLS_components.ElFormItem
    __VLS_components.ElFormItem
    __VLS_components.ElFormItem
    __VLS_components.ElFormItem
    __VLS_components.ElFormItem
    __VLS_components.ElFormItem
    __VLS_components.ElFormItem
    __VLS_components.ElFormItem
    __VLS_components.ElFormItem
    __VLS_components.ElFormItem
    __VLS_components.ElFormItem
    __VLS_components.ElFormItem
    __VLS_components.ElFormItem
    __VLS_components.ElFormItem
    __VLS_components.elFormItem
    __VLS_components.elFormItem
    __VLS_components.elFormItem
    __VLS_components.elFormItem
    __VLS_components.elFormItem
    __VLS_components.elFormItem
    __VLS_components.elFormItem
    __VLS_components.elFormItem
    __VLS_components.elFormItem
    __VLS_components.elFormItem
    __VLS_components.elFormItem
    __VLS_components.elFormItem
    __VLS_components.elFormItem
    __VLS_components.elFormItem
    __VLS_components['el-form-item']
    __VLS_components['el-form-item']
    __VLS_components['el-form-item']
    __VLS_components['el-form-item']
    __VLS_components['el-form-item']
    __VLS_components['el-form-item']
    __VLS_components['el-form-item']
    __VLS_components['el-form-item']
    __VLS_components['el-form-item']
    __VLS_components['el-form-item']
    __VLS_components['el-form-item']
    __VLS_components['el-form-item']
    __VLS_components['el-form-item']
    __VLS_components['el-form-item']
    // @ts-ignore
    ;[
      ElFormItem,
      ElFormItem,
      ElFormItem,
      ElFormItem,
      ElFormItem,
      ElFormItem,
      ElFormItem,
      ElFormItem,
      ElFormItem,
      ElFormItem,
      ElFormItem,
      ElFormItem,
      ElFormItem,
      ElFormItem
    ]
    __VLS_components.ElInput
    __VLS_components.ElInput
    __VLS_components.ElInput
    __VLS_components.ElInput
    __VLS_components.ElInput
    __VLS_components.ElInput
    __VLS_components.ElInput
    __VLS_components.ElInput
    __VLS_components.elInput
    __VLS_components.elInput
    __VLS_components.elInput
    __VLS_components.elInput
    __VLS_components.elInput
    __VLS_components.elInput
    __VLS_components.elInput
    __VLS_components.elInput
    __VLS_components['el-input']
    __VLS_components['el-input']
    __VLS_components['el-input']
    __VLS_components['el-input']
    __VLS_components['el-input']
    __VLS_components['el-input']
    __VLS_components['el-input']
    __VLS_components['el-input']
    // @ts-ignore
    ;[ElInput, ElInput, ElInput, ElInput, ElInput, ElInput, ElInput, ElInput]
    __VLS_components.ElSelect
    __VLS_components.ElSelect
    __VLS_components.ElSelect
    __VLS_components.ElSelect
    __VLS_components.elSelect
    __VLS_components.elSelect
    __VLS_components.elSelect
    __VLS_components.elSelect
    __VLS_components['el-select']
    __VLS_components['el-select']
    __VLS_components['el-select']
    __VLS_components['el-select']
    // @ts-ignore
    ;[ElSelect, ElSelect, ElSelect, ElSelect]
    __VLS_components.ElOption
    __VLS_components.ElOption
    __VLS_components.ElOption
    __VLS_components.ElOption
    __VLS_components.ElOption
    __VLS_components.ElOption
    __VLS_components.ElOption
    __VLS_components.ElOption
    __VLS_components.ElOption
    __VLS_components.ElOption
    __VLS_components.elOption
    __VLS_components.elOption
    __VLS_components.elOption
    __VLS_components.elOption
    __VLS_components.elOption
    __VLS_components.elOption
    __VLS_components.elOption
    __VLS_components.elOption
    __VLS_components.elOption
    __VLS_components.elOption
    __VLS_components['el-option']
    __VLS_components['el-option']
    __VLS_components['el-option']
    __VLS_components['el-option']
    __VLS_components['el-option']
    __VLS_components['el-option']
    __VLS_components['el-option']
    __VLS_components['el-option']
    __VLS_components['el-option']
    __VLS_components['el-option']
    // @ts-ignore
    ;[
      ElOption,
      ElOption,
      ElOption,
      ElOption,
      ElOption,
      ElOption,
      ElOption,
      ElOption,
      ElOption,
      ElOption
    ]
    __VLS_components.ElButton
    __VLS_components.ElButton
    __VLS_components.ElButton
    __VLS_components.ElButton
    __VLS_components.ElButton
    __VLS_components.ElButton
    __VLS_components.ElButton
    __VLS_components.ElButton
    __VLS_components.ElButton
    __VLS_components.ElButton
    __VLS_components.ElButton
    __VLS_components.ElButton
    __VLS_components.ElButton
    __VLS_components.ElButton
    __VLS_components.ElButton
    __VLS_components.ElButton
    __VLS_components.elButton
    __VLS_components.elButton
    __VLS_components.elButton
    __VLS_components.elButton
    __VLS_components.elButton
    __VLS_components.elButton
    __VLS_components.elButton
    __VLS_components.elButton
    __VLS_components.elButton
    __VLS_components.elButton
    __VLS_components.elButton
    __VLS_components.elButton
    __VLS_components.elButton
    __VLS_components.elButton
    __VLS_components.elButton
    __VLS_components.elButton
    __VLS_components['el-button']
    __VLS_components['el-button']
    __VLS_components['el-button']
    __VLS_components['el-button']
    __VLS_components['el-button']
    __VLS_components['el-button']
    __VLS_components['el-button']
    __VLS_components['el-button']
    __VLS_components['el-button']
    __VLS_components['el-button']
    __VLS_components['el-button']
    __VLS_components['el-button']
    __VLS_components['el-button']
    __VLS_components['el-button']
    __VLS_components['el-button']
    __VLS_components['el-button']
    // @ts-ignore
    ;[
      ElButton,
      ElButton,
      ElButton,
      ElButton,
      ElButton,
      ElButton,
      ElButton,
      ElButton,
      ElButton,
      ElButton,
      ElButton,
      ElButton,
      ElButton,
      ElButton,
      ElButton,
      ElButton
    ]
    __VLS_components.HModel
    __VLS_components.HModel
    // @ts-ignore
    ;[HModel, HModel]
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.template
    __VLS_intrinsicElements.span
    __VLS_intrinsicElements.span
    __VLS_intrinsicElements.span
    __VLS_intrinsicElements.span
    __VLS_intrinsicElements.span
    __VLS_intrinsicElements.span
    __VLS_intrinsicElements.span
    __VLS_intrinsicElements.span
    __VLS_intrinsicElements.span
    __VLS_intrinsicElements.span
    __VLS_intrinsicElements.span
    __VLS_intrinsicElements.span
    __VLS_intrinsicElements.span
    __VLS_intrinsicElements.span
    __VLS_intrinsicElements.span
    __VLS_intrinsicElements.span
    __VLS_intrinsicElements.span
    __VLS_intrinsicElements.span
    __VLS_intrinsicElements.span
    __VLS_intrinsicElements.span
    __VLS_intrinsicElements.span
    __VLS_intrinsicElements.span
    __VLS_components.ElTable
    __VLS_components.ElTable
    __VLS_components.elTable
    __VLS_components.elTable
    __VLS_components['el-table']
    __VLS_components['el-table']
    // @ts-ignore
    ;[ElTable, ElTable]
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.ElTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components.elTableColumn
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    __VLS_components['el-table-column']
    // @ts-ignore
    ;[
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn,
      ElTableColumn
    ]
    __VLS_intrinsicElements.div
    __VLS_intrinsicElements.div
    __VLS_intrinsicElements.div
    __VLS_intrinsicElements.div
    __VLS_intrinsicElements.div
    __VLS_intrinsicElements.div
    __VLS_intrinsicElements.div
    __VLS_intrinsicElements.div
    __VLS_intrinsicElements.div
    __VLS_intrinsicElements.div
    __VLS_intrinsicElements.div
    __VLS_intrinsicElements.div
    __VLS_intrinsicElements.div
    __VLS_intrinsicElements.div
    __VLS_intrinsicElements.div
    __VLS_intrinsicElements.div
    __VLS_components.ElPagination
    __VLS_components.ElPagination
    __VLS_components.elPagination
    __VLS_components.elPagination
    __VLS_components['el-pagination']
    __VLS_components['el-pagination']
    // @ts-ignore
    ;[ElPagination, ElPagination]
    __VLS_components.ElDialog
    __VLS_components.ElDialog
    __VLS_components.ElDialog
    __VLS_components.ElDialog
    __VLS_components.elDialog
    __VLS_components.elDialog
    __VLS_components.elDialog
    __VLS_components.elDialog
    __VLS_components['el-dialog']
    __VLS_components['el-dialog']
    __VLS_components['el-dialog']
    __VLS_components['el-dialog']
    // @ts-ignore
    ;[ElDialog, ElDialog, ElDialog, ElDialog]
    {
      const __VLS_0 = (
        {} as 'Session' extends keyof typeof __VLS_ctx
          ? { session: typeof __VLS_ctx.Session }
          : 'session' extends keyof typeof __VLS_ctx
          ? { session: typeof __VLS_ctx.session }
          : typeof __VLS_resolvedLocalAndGlobalComponents
      ).session
      const __VLS_1 = __VLS_asFunctionalComponent(
        __VLS_0,
        new __VLS_0({ ...{} })
      )
      ;(({}) as { session: typeof __VLS_0 }).session
      ;(({}) as { session: typeof __VLS_0 }).session
      const __VLS_2 = __VLS_1(
        { ...{} },
        ...__VLS_functionalComponentArgsRest(__VLS_1)
      )
      ;(
        ({}) as (
          props: __VLS_FunctionalComponentProps<
            typeof __VLS_0,
            typeof __VLS_2
          > &
            Record<string, unknown>
        ) => void
      )({ ...{} })
      const __VLS_3 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2)!
      let __VLS_4!: __VLS_NormalizeEmits<typeof __VLS_3.emit>
      {
        const __VLS_5 = (
          {} as 'ElForm' extends keyof typeof __VLS_ctx
            ? { ElForm: typeof __VLS_ctx.ElForm }
            : 'elForm' extends keyof typeof __VLS_ctx
            ? { ElForm: typeof __VLS_ctx.elForm }
            : 'el-form' extends keyof typeof __VLS_ctx
            ? { ElForm: (typeof __VLS_ctx)['el-form'] }
            : typeof __VLS_resolvedLocalAndGlobalComponents
        ).ElForm
        const __VLS_6 = __VLS_asFunctionalComponent(
          __VLS_5,
          new __VLS_5({
            ...{ onSubmit: {} as any },
            form: __VLS_ctx.queryForm,
            labelWidth: '80px',
            inline: true
          })
        )
        ;(({}) as { ElForm: typeof __VLS_5 }).ElForm
        ;(({}) as { ElForm: typeof __VLS_5 }).ElForm
        const __VLS_7 = __VLS_6(
          {
            ...{ onSubmit: {} as any },
            form: __VLS_ctx.queryForm,
            labelWidth: '80px',
            inline: true
          },
          ...__VLS_functionalComponentArgsRest(__VLS_6)
        )
        ;(
          ({}) as (
            props: __VLS_FunctionalComponentProps<
              typeof __VLS_5,
              typeof __VLS_7
            > &
              Record<string, unknown>
          ) => void
        )({
          ...{ onSubmit: {} as any },
          form: __VLS_ctx.queryForm,
          labelWidth: '80px',
          inline: true
        })
        const __VLS_8 = __VLS_pickFunctionalComponentCtx(__VLS_5, __VLS_7)!
        let __VLS_9!: __VLS_NormalizeEmits<typeof __VLS_8.emit>
        let __VLS_10 = {
          submit: __VLS_pickEvent(
            __VLS_9['submit'],
            (
              {} as __VLS_FunctionalComponentProps<
                typeof __VLS_6,
                typeof __VLS_7
              >
            ).onSubmit
          )
        }
        __VLS_10 = { submit: () => {} }
        {
          const __VLS_11 = (
            {} as 'ElFormItem' extends keyof typeof __VLS_ctx
              ? { ElFormItem: typeof __VLS_ctx.ElFormItem }
              : 'elFormItem' extends keyof typeof __VLS_ctx
              ? { ElFormItem: typeof __VLS_ctx.elFormItem }
              : 'el-form-item' extends keyof typeof __VLS_ctx
              ? { ElFormItem: (typeof __VLS_ctx)['el-form-item'] }
              : typeof __VLS_resolvedLocalAndGlobalComponents
          ).ElFormItem
          const __VLS_12 = __VLS_asFunctionalComponent(
            __VLS_11,
            new __VLS_11({ ...{}, label: '游戏名称' })
          )
          ;(({}) as { ElFormItem: typeof __VLS_11 }).ElFormItem
          ;(({}) as { ElFormItem: typeof __VLS_11 }).ElFormItem
          const __VLS_13 = __VLS_12(
            { ...{}, label: '游戏名称' },
            ...__VLS_functionalComponentArgsRest(__VLS_12)
          )
          ;(
            ({}) as (
              props: __VLS_FunctionalComponentProps<
                typeof __VLS_11,
                typeof __VLS_13
              > &
                Record<string, unknown>
            ) => void
          )({ ...{}, label: '游戏名称' })
          const __VLS_14 = __VLS_pickFunctionalComponentCtx(__VLS_11, __VLS_13)!
          let __VLS_15!: __VLS_NormalizeEmits<typeof __VLS_14.emit>
          {
            const __VLS_16 = (
              {} as 'ElInput' extends keyof typeof __VLS_ctx
                ? { ElInput: typeof __VLS_ctx.ElInput }
                : 'elInput' extends keyof typeof __VLS_ctx
                ? { ElInput: typeof __VLS_ctx.elInput }
                : 'el-input' extends keyof typeof __VLS_ctx
                ? { ElInput: (typeof __VLS_ctx)['el-input'] }
                : typeof __VLS_resolvedLocalAndGlobalComponents
            ).ElInput
            const __VLS_17 = __VLS_asFunctionalComponent(
              __VLS_16,
              new __VLS_16({
                ...{ onKeyup: {} as any },
                modelValue: __VLS_ctx.queryForm.title,
                clearable: true,
                placeholder: '请输入游戏名称'
              })
            )
            ;(({}) as { ElInput: typeof __VLS_16 }).ElInput
            ;(({}) as { ElInput: typeof __VLS_16 }).ElInput
            const __VLS_18 = __VLS_17(
              {
                ...{ onKeyup: {} as any },
                modelValue: __VLS_ctx.queryForm.title,
                clearable: true,
                placeholder: '请输入游戏名称'
              },
              ...__VLS_functionalComponentArgsRest(__VLS_17)
            )
            ;(
              ({}) as (
                props: __VLS_FunctionalComponentProps<
                  typeof __VLS_16,
                  typeof __VLS_18
                > &
                  Record<string, unknown>
              ) => void
            )({
              ...{ onKeyup: {} as any },
              modelValue: __VLS_ctx.queryForm.title,
              clearable: true,
              placeholder: '请输入游戏名称'
            })
            const __VLS_19 = __VLS_pickFunctionalComponentCtx(
              __VLS_16,
              __VLS_18
            )!
            let __VLS_20!: __VLS_NormalizeEmits<typeof __VLS_19.emit>
            let __VLS_21 = {
              keyup: __VLS_pickEvent(
                __VLS_20['keyup'],
                (
                  {} as __VLS_FunctionalComponentProps<
                    typeof __VLS_17,
                    typeof __VLS_18
                  >
                ).onKeyup
              )
            }
            __VLS_21 = { keyup: __VLS_ctx.query }
          }
          __VLS_14.slots!.default
        }
        {
          const __VLS_22 = (
            {} as 'ElFormItem' extends keyof typeof __VLS_ctx
              ? { ElFormItem: typeof __VLS_ctx.ElFormItem }
              : 'elFormItem' extends keyof typeof __VLS_ctx
              ? { ElFormItem: typeof __VLS_ctx.elFormItem }
              : 'el-form-item' extends keyof typeof __VLS_ctx
              ? { ElFormItem: (typeof __VLS_ctx)['el-form-item'] }
              : typeof __VLS_resolvedLocalAndGlobalComponents
          ).ElFormItem
          const __VLS_23 = __VLS_asFunctionalComponent(
            __VLS_22,
            new __VLS_22({ ...{}, label: '排序' })
          )
          ;(({}) as { ElFormItem: typeof __VLS_22 }).ElFormItem
          ;(({}) as { ElFormItem: typeof __VLS_22 }).ElFormItem
          const __VLS_24 = __VLS_23(
            { ...{}, label: '排序' },
            ...__VLS_functionalComponentArgsRest(__VLS_23)
          )
          ;(
            ({}) as (
              props: __VLS_FunctionalComponentProps<
                typeof __VLS_22,
                typeof __VLS_24
              > &
                Record<string, unknown>
            ) => void
          )({ ...{}, label: '排序' })
          const __VLS_25 = __VLS_pickFunctionalComponentCtx(__VLS_22, __VLS_24)!
          let __VLS_26!: __VLS_NormalizeEmits<typeof __VLS_25.emit>
          {
            const __VLS_27 = (
              {} as 'ElSelect' extends keyof typeof __VLS_ctx
                ? { ElSelect: typeof __VLS_ctx.ElSelect }
                : 'elSelect' extends keyof typeof __VLS_ctx
                ? { ElSelect: typeof __VLS_ctx.elSelect }
                : 'el-select' extends keyof typeof __VLS_ctx
                ? { ElSelect: (typeof __VLS_ctx)['el-select'] }
                : typeof __VLS_resolvedLocalAndGlobalComponents
            ).ElSelect
            const __VLS_28 = __VLS_asFunctionalComponent(
              __VLS_27,
              new __VLS_27({
                ...{},
                modelValue: __VLS_ctx.queryForm.sort,
                clearable: true
              })
            )
            ;(({}) as { ElSelect: typeof __VLS_27 }).ElSelect
            ;(({}) as { ElSelect: typeof __VLS_27 }).ElSelect
            const __VLS_29 = __VLS_28(
              { ...{}, modelValue: __VLS_ctx.queryForm.sort, clearable: true },
              ...__VLS_functionalComponentArgsRest(__VLS_28)
            )
            ;(
              ({}) as (
                props: __VLS_FunctionalComponentProps<
                  typeof __VLS_27,
                  typeof __VLS_29
                > &
                  Record<string, unknown>
              ) => void
            )({ ...{}, modelValue: __VLS_ctx.queryForm.sort, clearable: true })
            const __VLS_30 = __VLS_pickFunctionalComponentCtx(
              __VLS_27,
              __VLS_29
            )!
            let __VLS_31!: __VLS_NormalizeEmits<typeof __VLS_30.emit>
            {
              const __VLS_32 = (
                {} as 'ElOption' extends keyof typeof __VLS_ctx
                  ? { ElOption: typeof __VLS_ctx.ElOption }
                  : 'elOption' extends keyof typeof __VLS_ctx
                  ? { ElOption: typeof __VLS_ctx.elOption }
                  : 'el-option' extends keyof typeof __VLS_ctx
                  ? { ElOption: (typeof __VLS_ctx)['el-option'] }
                  : typeof __VLS_resolvedLocalAndGlobalComponents
              ).ElOption
              const __VLS_33 = __VLS_asFunctionalComponent(
                __VLS_32,
                new __VLS_32({ ...{}, value: '2', label: '创建时间正序' })
              )
              ;(({}) as { ElOption: typeof __VLS_32 }).ElOption
              const __VLS_34 = __VLS_33(
                { ...{}, value: '2', label: '创建时间正序' },
                ...__VLS_functionalComponentArgsRest(__VLS_33)
              )
              ;(
                ({}) as (
                  props: __VLS_FunctionalComponentProps<
                    typeof __VLS_32,
                    typeof __VLS_34
                  > &
                    Record<string, unknown>
                ) => void
              )({ ...{}, value: '2', label: '创建时间正序' })
              const __VLS_35 = __VLS_pickFunctionalComponentCtx(
                __VLS_32,
                __VLS_34
              )!
              let __VLS_36!: __VLS_NormalizeEmits<typeof __VLS_35.emit>
            }
            {
              const __VLS_37 = (
                {} as 'ElOption' extends keyof typeof __VLS_ctx
                  ? { ElOption: typeof __VLS_ctx.ElOption }
                  : 'elOption' extends keyof typeof __VLS_ctx
                  ? { ElOption: typeof __VLS_ctx.elOption }
                  : 'el-option' extends keyof typeof __VLS_ctx
                  ? { ElOption: (typeof __VLS_ctx)['el-option'] }
                  : typeof __VLS_resolvedLocalAndGlobalComponents
              ).ElOption
              const __VLS_38 = __VLS_asFunctionalComponent(
                __VLS_37,
                new __VLS_37({ ...{}, value: '1', label: '创建时间倒序' })
              )
              ;(({}) as { ElOption: typeof __VLS_37 }).ElOption
              const __VLS_39 = __VLS_38(
                { ...{}, value: '1', label: '创建时间倒序' },
                ...__VLS_functionalComponentArgsRest(__VLS_38)
              )
              ;(
                ({}) as (
                  props: __VLS_FunctionalComponentProps<
                    typeof __VLS_37,
                    typeof __VLS_39
                  > &
                    Record<string, unknown>
                ) => void
              )({ ...{}, value: '1', label: '创建时间倒序' })
              const __VLS_40 = __VLS_pickFunctionalComponentCtx(
                __VLS_37,
                __VLS_39
              )!
              let __VLS_41!: __VLS_NormalizeEmits<typeof __VLS_40.emit>
            }
            {
              const __VLS_42 = (
                {} as 'ElOption' extends keyof typeof __VLS_ctx
                  ? { ElOption: typeof __VLS_ctx.ElOption }
                  : 'elOption' extends keyof typeof __VLS_ctx
                  ? { ElOption: typeof __VLS_ctx.elOption }
                  : 'el-option' extends keyof typeof __VLS_ctx
                  ? { ElOption: (typeof __VLS_ctx)['el-option'] }
                  : typeof __VLS_resolvedLocalAndGlobalComponents
              ).ElOption
              const __VLS_43 = __VLS_asFunctionalComponent(
                __VLS_42,
                new __VLS_42({ ...{}, value: '4', label: '热度正序' })
              )
              ;(({}) as { ElOption: typeof __VLS_42 }).ElOption
              const __VLS_44 = __VLS_43(
                { ...{}, value: '4', label: '热度正序' },
                ...__VLS_functionalComponentArgsRest(__VLS_43)
              )
              ;(
                ({}) as (
                  props: __VLS_FunctionalComponentProps<
                    typeof __VLS_42,
                    typeof __VLS_44
                  > &
                    Record<string, unknown>
                ) => void
              )({ ...{}, value: '4', label: '热度正序' })
              const __VLS_45 = __VLS_pickFunctionalComponentCtx(
                __VLS_42,
                __VLS_44
              )!
              let __VLS_46!: __VLS_NormalizeEmits<typeof __VLS_45.emit>
            }
            {
              const __VLS_47 = (
                {} as 'ElOption' extends keyof typeof __VLS_ctx
                  ? { ElOption: typeof __VLS_ctx.ElOption }
                  : 'elOption' extends keyof typeof __VLS_ctx
                  ? { ElOption: typeof __VLS_ctx.elOption }
                  : 'el-option' extends keyof typeof __VLS_ctx
                  ? { ElOption: (typeof __VLS_ctx)['el-option'] }
                  : typeof __VLS_resolvedLocalAndGlobalComponents
              ).ElOption
              const __VLS_48 = __VLS_asFunctionalComponent(
                __VLS_47,
                new __VLS_47({ ...{}, value: '3', label: '热度倒序' })
              )
              ;(({}) as { ElOption: typeof __VLS_47 }).ElOption
              const __VLS_49 = __VLS_48(
                { ...{}, value: '3', label: '热度倒序' },
                ...__VLS_functionalComponentArgsRest(__VLS_48)
              )
              ;(
                ({}) as (
                  props: __VLS_FunctionalComponentProps<
                    typeof __VLS_47,
                    typeof __VLS_49
                  > &
                    Record<string, unknown>
                ) => void
              )({ ...{}, value: '3', label: '热度倒序' })
              const __VLS_50 = __VLS_pickFunctionalComponentCtx(
                __VLS_47,
                __VLS_49
              )!
              let __VLS_51!: __VLS_NormalizeEmits<typeof __VLS_50.emit>
            }
            {
              const __VLS_52 = (
                {} as 'ElOption' extends keyof typeof __VLS_ctx
                  ? { ElOption: typeof __VLS_ctx.ElOption }
                  : 'elOption' extends keyof typeof __VLS_ctx
                  ? { ElOption: typeof __VLS_ctx.elOption }
                  : 'el-option' extends keyof typeof __VLS_ctx
                  ? { ElOption: (typeof __VLS_ctx)['el-option'] }
                  : typeof __VLS_resolvedLocalAndGlobalComponents
              ).ElOption
              const __VLS_53 = __VLS_asFunctionalComponent(
                __VLS_52,
                new __VLS_52({ ...{}, value: '6', label: 'banner正序' })
              )
              ;(({}) as { ElOption: typeof __VLS_52 }).ElOption
              const __VLS_54 = __VLS_53(
                { ...{}, value: '6', label: 'banner正序' },
                ...__VLS_functionalComponentArgsRest(__VLS_53)
              )
              ;(
                ({}) as (
                  props: __VLS_FunctionalComponentProps<
                    typeof __VLS_52,
                    typeof __VLS_54
                  > &
                    Record<string, unknown>
                ) => void
              )({ ...{}, value: '6', label: 'banner正序' })
              const __VLS_55 = __VLS_pickFunctionalComponentCtx(
                __VLS_52,
                __VLS_54
              )!
              let __VLS_56!: __VLS_NormalizeEmits<typeof __VLS_55.emit>
            }
            {
              const __VLS_57 = (
                {} as 'ElOption' extends keyof typeof __VLS_ctx
                  ? { ElOption: typeof __VLS_ctx.ElOption }
                  : 'elOption' extends keyof typeof __VLS_ctx
                  ? { ElOption: typeof __VLS_ctx.elOption }
                  : 'el-option' extends keyof typeof __VLS_ctx
                  ? { ElOption: (typeof __VLS_ctx)['el-option'] }
                  : typeof __VLS_resolvedLocalAndGlobalComponents
              ).ElOption
              const __VLS_58 = __VLS_asFunctionalComponent(
                __VLS_57,
                new __VLS_57({ ...{}, value: '5', label: 'banner倒序' })
              )
              ;(({}) as { ElOption: typeof __VLS_57 }).ElOption
              const __VLS_59 = __VLS_58(
                { ...{}, value: '5', label: 'banner倒序' },
                ...__VLS_functionalComponentArgsRest(__VLS_58)
              )
              ;(
                ({}) as (
                  props: __VLS_FunctionalComponentProps<
                    typeof __VLS_57,
                    typeof __VLS_59
                  > &
                    Record<string, unknown>
                ) => void
              )({ ...{}, value: '5', label: 'banner倒序' })
              const __VLS_60 = __VLS_pickFunctionalComponentCtx(
                __VLS_57,
                __VLS_59
              )!
              let __VLS_61!: __VLS_NormalizeEmits<typeof __VLS_60.emit>
            }
            __VLS_30.slots!.default
          }
          __VLS_25.slots!.default
        }
        {
          const __VLS_62 = (
            {} as 'ElFormItem' extends keyof typeof __VLS_ctx
              ? { ElFormItem: typeof __VLS_ctx.ElFormItem }
              : 'elFormItem' extends keyof typeof __VLS_ctx
              ? { ElFormItem: typeof __VLS_ctx.elFormItem }
              : 'el-form-item' extends keyof typeof __VLS_ctx
              ? { ElFormItem: (typeof __VLS_ctx)['el-form-item'] }
              : typeof __VLS_resolvedLocalAndGlobalComponents
          ).ElFormItem
          const __VLS_63 = __VLS_asFunctionalComponent(
            __VLS_62,
            new __VLS_62({ ...{} })
          )
          ;(({}) as { ElFormItem: typeof __VLS_62 }).ElFormItem
          ;(({}) as { ElFormItem: typeof __VLS_62 }).ElFormItem
          const __VLS_64 = __VLS_63(
            { ...{} },
            ...__VLS_functionalComponentArgsRest(__VLS_63)
          )
          ;(
            ({}) as (
              props: __VLS_FunctionalComponentProps<
                typeof __VLS_62,
                typeof __VLS_64
              > &
                Record<string, unknown>
            ) => void
          )({ ...{} })
          const __VLS_65 = __VLS_pickFunctionalComponentCtx(__VLS_62, __VLS_64)!
          let __VLS_66!: __VLS_NormalizeEmits<typeof __VLS_65.emit>
          {
            const __VLS_67 = (
              {} as 'ElButton' extends keyof typeof __VLS_ctx
                ? { ElButton: typeof __VLS_ctx.ElButton }
                : 'elButton' extends keyof typeof __VLS_ctx
                ? { ElButton: typeof __VLS_ctx.elButton }
                : 'el-button' extends keyof typeof __VLS_ctx
                ? { ElButton: (typeof __VLS_ctx)['el-button'] }
                : typeof __VLS_resolvedLocalAndGlobalComponents
            ).ElButton
            const __VLS_68 = __VLS_asFunctionalComponent(
              __VLS_67,
              new __VLS_67({
                ...{ onClick: {} as any },
                style: {},
                type: 'primary'
              })
            )
            ;(({}) as { ElButton: typeof __VLS_67 }).ElButton
            ;(({}) as { ElButton: typeof __VLS_67 }).ElButton
            const __VLS_69 = __VLS_68(
              { ...{ onClick: {} as any }, style: {}, type: 'primary' },
              ...__VLS_functionalComponentArgsRest(__VLS_68)
            )
            ;(
              ({}) as (
                props: __VLS_FunctionalComponentProps<
                  typeof __VLS_67,
                  typeof __VLS_69
                > &
                  Record<string, unknown>
              ) => void
            )({ ...{ onClick: {} as any }, style: {}, type: 'primary' })
            const __VLS_70 = __VLS_pickFunctionalComponentCtx(
              __VLS_67,
              __VLS_69
            )!
            let __VLS_71!: __VLS_NormalizeEmits<typeof __VLS_70.emit>
            let __VLS_72 = {
              click: __VLS_pickEvent(
                __VLS_71['click'],
                (
                  {} as __VLS_FunctionalComponentProps<
                    typeof __VLS_68,
                    typeof __VLS_69
                  >
                ).onClick
              )
            }
            __VLS_72 = { click: __VLS_ctx.query }
            __VLS_ctx.$t('button.query')
            __VLS_70.slots!.default
          }
          {
            const __VLS_73 = (
              {} as 'ElButton' extends keyof typeof __VLS_ctx
                ? { ElButton: typeof __VLS_ctx.ElButton }
                : 'elButton' extends keyof typeof __VLS_ctx
                ? { ElButton: typeof __VLS_ctx.elButton }
                : 'el-button' extends keyof typeof __VLS_ctx
                ? { ElButton: (typeof __VLS_ctx)['el-button'] }
                : typeof __VLS_resolvedLocalAndGlobalComponents
            ).ElButton
            const __VLS_74 = __VLS_asFunctionalComponent(
              __VLS_73,
              new __VLS_73({ ...{ onClick: {} as any } })
            )
            ;(({}) as { ElButton: typeof __VLS_73 }).ElButton
            ;(({}) as { ElButton: typeof __VLS_73 }).ElButton
            const __VLS_75 = __VLS_74(
              { ...{ onClick: {} as any } },
              ...__VLS_functionalComponentArgsRest(__VLS_74)
            )
            ;(
              ({}) as (
                props: __VLS_FunctionalComponentProps<
                  typeof __VLS_73,
                  typeof __VLS_75
                > &
                  Record<string, unknown>
              ) => void
            )({ ...{ onClick: {} as any } })
            const __VLS_76 = __VLS_pickFunctionalComponentCtx(
              __VLS_73,
              __VLS_75
            )!
            let __VLS_77!: __VLS_NormalizeEmits<typeof __VLS_76.emit>
            let __VLS_78 = {
              click: __VLS_pickEvent(
                __VLS_77['click'],
                (
                  {} as __VLS_FunctionalComponentProps<
                    typeof __VLS_74,
                    typeof __VLS_75
                  >
                ).onClick
              )
            }
            __VLS_78 = { click: __VLS_ctx.onClear }
            __VLS_ctx.$t('button.clear')
            __VLS_76.slots!.default
          }
          __VLS_65.slots!.default
        }
        __VLS_8.slots!.default
      }
      __VLS_3.slots!.default
    }
    {
      const __VLS_79 = (
        {} as 'Session' extends keyof typeof __VLS_ctx
          ? { session: typeof __VLS_ctx.Session }
          : 'session' extends keyof typeof __VLS_ctx
          ? { session: typeof __VLS_ctx.session }
          : typeof __VLS_resolvedLocalAndGlobalComponents
      ).session
      const __VLS_80 = __VLS_asFunctionalComponent(
        __VLS_79,
        new __VLS_79({ ...{} })
      )
      ;(({}) as { session: typeof __VLS_79 }).session
      ;(({}) as { session: typeof __VLS_79 }).session
      const __VLS_81 = __VLS_80(
        { ...{} },
        ...__VLS_functionalComponentArgsRest(__VLS_80)
      )
      ;(
        ({}) as (
          props: __VLS_FunctionalComponentProps<
            typeof __VLS_79,
            typeof __VLS_81
          > &
            Record<string, unknown>
        ) => void
      )({ ...{} })
      const __VLS_82 = __VLS_pickFunctionalComponentCtx(__VLS_79, __VLS_81)!
      let __VLS_83!: __VLS_NormalizeEmits<typeof __VLS_82.emit>
      {
        const __VLS_84 = (
          {} as 'HModel' extends keyof typeof __VLS_ctx
            ? { HModel: typeof __VLS_ctx.HModel }
            : typeof __VLS_resolvedLocalAndGlobalComponents
        ).HModel
        const __VLS_85 = __VLS_asFunctionalComponent(
          __VLS_84,
          new __VLS_84({ ...{} })
        )
        ;(({}) as { HModel: typeof __VLS_84 }).HModel
        ;(({}) as { HModel: typeof __VLS_84 }).HModel
        const __VLS_86 = __VLS_85(
          { ...{} },
          ...__VLS_functionalComponentArgsRest(__VLS_85)
        )
        ;(
          ({}) as (
            props: __VLS_FunctionalComponentProps<
              typeof __VLS_84,
              typeof __VLS_86
            > &
              Record<string, unknown>
          ) => void
        )({ ...{} })
        const __VLS_87 = __VLS_pickFunctionalComponentCtx(__VLS_84, __VLS_86)!
        let __VLS_88!: __VLS_NormalizeEmits<typeof __VLS_87.emit>
        {
          const __VLS_89 = __VLS_intrinsicElements['template']
          const __VLS_90 = __VLS_elementAsFunctionalComponent(__VLS_89)
          const __VLS_91 = __VLS_90(
            { ...{} },
            ...__VLS_functionalComponentArgsRest(__VLS_90)
          )
          ;(
            ({}) as (
              props: __VLS_FunctionalComponentProps<
                typeof __VLS_89,
                typeof __VLS_91
              > &
                Record<string, unknown>
            ) => void
          )({ ...{} })
          {
            __VLS_87.slots!.head
            {
              const __VLS_92 = __VLS_intrinsicElements['span']
              const __VLS_93 = __VLS_elementAsFunctionalComponent(__VLS_92)
              const __VLS_94 = __VLS_93(
                { ...{}, style: {} },
                ...__VLS_functionalComponentArgsRest(__VLS_93)
              )
              ;(
                ({}) as (
                  props: __VLS_FunctionalComponentProps<
                    typeof __VLS_92,
                    typeof __VLS_94
                  > &
                    Record<string, unknown>
                ) => void
              )({ ...{}, style: {} })
              const __VLS_95 = __VLS_pickFunctionalComponentCtx(
                __VLS_92,
                __VLS_94
              )!
              let __VLS_96!: __VLS_NormalizeEmits<typeof __VLS_95.emit>
              __VLS_ctx.$t('game')
              __VLS_95.slots!.default
            }
            // @ts-ignore
            ;[
              queryForm,
              queryForm,
              queryForm,
              queryForm,
              queryForm,
              queryForm,
              query,
              queryForm,
              queryForm,
              queryForm,
              query,
              $t,
              onClear,
              $t,
              $t
            ]
          }
        }
        {
          const __VLS_97 = __VLS_intrinsicElements['template']
          const __VLS_98 = __VLS_elementAsFunctionalComponent(__VLS_97)
          const __VLS_99 = __VLS_98(
            { ...{} },
            ...__VLS_functionalComponentArgsRest(__VLS_98)
          )
          ;(
            ({}) as (
              props: __VLS_FunctionalComponentProps<
                typeof __VLS_97,
                typeof __VLS_99
              > &
                Record<string, unknown>
            ) => void
          )({ ...{} })
          {
            __VLS_87.slots!.body
            {
              const __VLS_100 = (
                {} as 'ElTable' extends keyof typeof __VLS_ctx
                  ? { ElTable: typeof __VLS_ctx.ElTable }
                  : 'elTable' extends keyof typeof __VLS_ctx
                  ? { ElTable: typeof __VLS_ctx.elTable }
                  : 'el-table' extends keyof typeof __VLS_ctx
                  ? { ElTable: (typeof __VLS_ctx)['el-table'] }
                  : typeof __VLS_resolvedLocalAndGlobalComponents
              ).ElTable
              const __VLS_101 = __VLS_asFunctionalComponent(
                __VLS_100,
                new __VLS_100({
                  ...{},
                  data: __VLS_ctx.tableData,
                  style: {},
                  border: true
                })
              )
              ;(({}) as { ElTable: typeof __VLS_100 }).ElTable
              ;(({}) as { ElTable: typeof __VLS_100 }).ElTable
              const __VLS_102 = __VLS_101(
                { ...{}, data: __VLS_ctx.tableData, style: {}, border: true },
                ...__VLS_functionalComponentArgsRest(__VLS_101)
              )
              ;(
                ({}) as (
                  props: __VLS_FunctionalComponentProps<
                    typeof __VLS_100,
                    typeof __VLS_102
                  > &
                    Record<string, unknown>
                ) => void
              )({ ...{}, data: __VLS_ctx.tableData, style: {}, border: true })
              const __VLS_103 = __VLS_pickFunctionalComponentCtx(
                __VLS_100,
                __VLS_102
              )!
              let __VLS_104!: __VLS_NormalizeEmits<typeof __VLS_103.emit>
              __VLS_directiveFunction(__VLS_ctx.vLoading)(__VLS_ctx.loading)
              {
                const __VLS_105 = (
                  {} as 'ElTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.ElTableColumn }
                    : 'elTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.elTableColumn }
                    : 'el-table-column' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: (typeof __VLS_ctx)['el-table-column'] }
                    : typeof __VLS_resolvedLocalAndGlobalComponents
                ).ElTableColumn
                const __VLS_106 = __VLS_asFunctionalComponent(
                  __VLS_105,
                  new __VLS_105({ ...{}, label: 'ID' })
                )
                ;(({}) as { ElTableColumn: typeof __VLS_105 }).ElTableColumn
                ;(({}) as { ElTableColumn: typeof __VLS_105 }).ElTableColumn
                const __VLS_107 = __VLS_106(
                  { ...{}, label: 'ID' },
                  ...__VLS_functionalComponentArgsRest(__VLS_106)
                )
                ;(
                  ({}) as (
                    props: __VLS_FunctionalComponentProps<
                      typeof __VLS_105,
                      typeof __VLS_107
                    > &
                      Record<string, unknown>
                  ) => void
                )({ ...{}, label: 'ID' })
                const __VLS_108 = __VLS_pickFunctionalComponentCtx(
                  __VLS_105,
                  __VLS_107
                )!
                let __VLS_109!: __VLS_NormalizeEmits<typeof __VLS_108.emit>
                {
                  const __VLS_110 = __VLS_intrinsicElements['template']
                  const __VLS_111 =
                    __VLS_elementAsFunctionalComponent(__VLS_110)
                  const __VLS_112 = __VLS_111(
                    { ...{} },
                    ...__VLS_functionalComponentArgsRest(__VLS_111)
                  )
                  ;(
                    ({}) as (
                      props: __VLS_FunctionalComponentProps<
                        typeof __VLS_110,
                        typeof __VLS_112
                      > &
                        Record<string, unknown>
                    ) => void
                  )({ ...{} })
                  {
                    const [{ row }] = __VLS_getSlotParams(
                      __VLS_108.slots!.default
                    )
                    row.game_id
                    // @ts-ignore
                    ;[tableData, tableData, tableData, loading]
                  }
                }
              }
              {
                const __VLS_113 = (
                  {} as 'ElTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.ElTableColumn }
                    : 'elTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.elTableColumn }
                    : 'el-table-column' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: (typeof __VLS_ctx)['el-table-column'] }
                    : typeof __VLS_resolvedLocalAndGlobalComponents
                ).ElTableColumn
                const __VLS_114 = __VLS_asFunctionalComponent(
                  __VLS_113,
                  new __VLS_113({ ...{}, label: '游戏名称', minWidth: '100' })
                )
                ;(({}) as { ElTableColumn: typeof __VLS_113 }).ElTableColumn
                ;(({}) as { ElTableColumn: typeof __VLS_113 }).ElTableColumn
                const __VLS_115 = __VLS_114(
                  { ...{}, label: '游戏名称', minWidth: '100' },
                  ...__VLS_functionalComponentArgsRest(__VLS_114)
                )
                ;(
                  ({}) as (
                    props: __VLS_FunctionalComponentProps<
                      typeof __VLS_113,
                      typeof __VLS_115
                    > &
                      Record<string, unknown>
                  ) => void
                )({ ...{}, label: '游戏名称', minWidth: '100' })
                const __VLS_116 = __VLS_pickFunctionalComponentCtx(
                  __VLS_113,
                  __VLS_115
                )!
                let __VLS_117!: __VLS_NormalizeEmits<typeof __VLS_116.emit>
                {
                  const __VLS_118 = __VLS_intrinsicElements['template']
                  const __VLS_119 =
                    __VLS_elementAsFunctionalComponent(__VLS_118)
                  const __VLS_120 = __VLS_119(
                    { ...{} },
                    ...__VLS_functionalComponentArgsRest(__VLS_119)
                  )
                  ;(
                    ({}) as (
                      props: __VLS_FunctionalComponentProps<
                        typeof __VLS_118,
                        typeof __VLS_120
                      > &
                        Record<string, unknown>
                    ) => void
                  )({ ...{} })
                  {
                    const [{ row }] = __VLS_getSlotParams(
                      __VLS_116.slots!.default
                    )
                    row.title
                  }
                }
              }
              {
                const __VLS_121 = (
                  {} as 'ElTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.ElTableColumn }
                    : 'elTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.elTableColumn }
                    : 'el-table-column' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: (typeof __VLS_ctx)['el-table-column'] }
                    : typeof __VLS_resolvedLocalAndGlobalComponents
                ).ElTableColumn
                const __VLS_122 = __VLS_asFunctionalComponent(
                  __VLS_121,
                  new __VLS_121({ ...{}, label: '游戏语言' })
                )
                ;(({}) as { ElTableColumn: typeof __VLS_121 }).ElTableColumn
                ;(({}) as { ElTableColumn: typeof __VLS_121 }).ElTableColumn
                const __VLS_123 = __VLS_122(
                  { ...{}, label: '游戏语言' },
                  ...__VLS_functionalComponentArgsRest(__VLS_122)
                )
                ;(
                  ({}) as (
                    props: __VLS_FunctionalComponentProps<
                      typeof __VLS_121,
                      typeof __VLS_123
                    > &
                      Record<string, unknown>
                  ) => void
                )({ ...{}, label: '游戏语言' })
                const __VLS_124 = __VLS_pickFunctionalComponentCtx(
                  __VLS_121,
                  __VLS_123
                )!
                let __VLS_125!: __VLS_NormalizeEmits<typeof __VLS_124.emit>
                {
                  const __VLS_126 = __VLS_intrinsicElements['template']
                  const __VLS_127 =
                    __VLS_elementAsFunctionalComponent(__VLS_126)
                  const __VLS_128 = __VLS_127(
                    { ...{} },
                    ...__VLS_functionalComponentArgsRest(__VLS_127)
                  )
                  ;(
                    ({}) as (
                      props: __VLS_FunctionalComponentProps<
                        typeof __VLS_126,
                        typeof __VLS_128
                      > &
                        Record<string, unknown>
                    ) => void
                  )({ ...{} })
                  {
                    const [{ row }] = __VLS_getSlotParams(
                      __VLS_124.slots!.default
                    )
                    __VLS_ctx.getLanguageTitle(row.game_lang_id)
                    // @ts-ignore
                    ;[getLanguageTitle]
                  }
                }
              }
              {
                const __VLS_129 = (
                  {} as 'ElTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.ElTableColumn }
                    : 'elTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.elTableColumn }
                    : 'el-table-column' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: (typeof __VLS_ctx)['el-table-column'] }
                    : typeof __VLS_resolvedLocalAndGlobalComponents
                ).ElTableColumn
                const __VLS_130 = __VLS_asFunctionalComponent(
                  __VLS_129,
                  new __VLS_129({ ...{}, label: '游戏分类' })
                )
                ;(({}) as { ElTableColumn: typeof __VLS_129 }).ElTableColumn
                ;(({}) as { ElTableColumn: typeof __VLS_129 }).ElTableColumn
                const __VLS_131 = __VLS_130(
                  { ...{}, label: '游戏分类' },
                  ...__VLS_functionalComponentArgsRest(__VLS_130)
                )
                ;(
                  ({}) as (
                    props: __VLS_FunctionalComponentProps<
                      typeof __VLS_129,
                      typeof __VLS_131
                    > &
                      Record<string, unknown>
                  ) => void
                )({ ...{}, label: '游戏分类' })
                const __VLS_132 = __VLS_pickFunctionalComponentCtx(
                  __VLS_129,
                  __VLS_131
                )!
                let __VLS_133!: __VLS_NormalizeEmits<typeof __VLS_132.emit>
                {
                  const __VLS_134 = __VLS_intrinsicElements['template']
                  const __VLS_135 =
                    __VLS_elementAsFunctionalComponent(__VLS_134)
                  const __VLS_136 = __VLS_135(
                    { ...{} },
                    ...__VLS_functionalComponentArgsRest(__VLS_135)
                  )
                  ;(
                    ({}) as (
                      props: __VLS_FunctionalComponentProps<
                        typeof __VLS_134,
                        typeof __VLS_136
                      > &
                        Record<string, unknown>
                    ) => void
                  )({ ...{} })
                  {
                    const [{ row }] = __VLS_getSlotParams(
                      __VLS_132.slots!.default
                    )
                    __VLS_ctx.getCategoriesTitle(row.game_cate_id)
                    // @ts-ignore
                    ;[getCategoriesTitle]
                  }
                }
              }
              {
                const __VLS_137 = (
                  {} as 'ElTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.ElTableColumn }
                    : 'elTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.elTableColumn }
                    : 'el-table-column' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: (typeof __VLS_ctx)['el-table-column'] }
                    : typeof __VLS_resolvedLocalAndGlobalComponents
                ).ElTableColumn
                const __VLS_138 = __VLS_asFunctionalComponent(
                  __VLS_137,
                  new __VLS_137({ ...{}, label: '游戏平台' })
                )
                ;(({}) as { ElTableColumn: typeof __VLS_137 }).ElTableColumn
                ;(({}) as { ElTableColumn: typeof __VLS_137 }).ElTableColumn
                const __VLS_139 = __VLS_138(
                  { ...{}, label: '游戏平台' },
                  ...__VLS_functionalComponentArgsRest(__VLS_138)
                )
                ;(
                  ({}) as (
                    props: __VLS_FunctionalComponentProps<
                      typeof __VLS_137,
                      typeof __VLS_139
                    > &
                      Record<string, unknown>
                  ) => void
                )({ ...{}, label: '游戏平台' })
                const __VLS_140 = __VLS_pickFunctionalComponentCtx(
                  __VLS_137,
                  __VLS_139
                )!
                let __VLS_141!: __VLS_NormalizeEmits<typeof __VLS_140.emit>
                {
                  const __VLS_142 = __VLS_intrinsicElements['template']
                  const __VLS_143 =
                    __VLS_elementAsFunctionalComponent(__VLS_142)
                  const __VLS_144 = __VLS_143(
                    { ...{} },
                    ...__VLS_functionalComponentArgsRest(__VLS_143)
                  )
                  ;(
                    ({}) as (
                      props: __VLS_FunctionalComponentProps<
                        typeof __VLS_142,
                        typeof __VLS_144
                      > &
                        Record<string, unknown>
                    ) => void
                  )({ ...{} })
                  {
                    const [{ row }] = __VLS_getSlotParams(
                      __VLS_140.slots!.default
                    )
                    __VLS_ctx.getPlatformsTitle(row.game_pingtai_id)
                    // @ts-ignore
                    ;[getPlatformsTitle]
                  }
                }
              }
              {
                const __VLS_145 = (
                  {} as 'ElTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.ElTableColumn }
                    : 'elTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.elTableColumn }
                    : 'el-table-column' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: (typeof __VLS_ctx)['el-table-column'] }
                    : typeof __VLS_resolvedLocalAndGlobalComponents
                ).ElTableColumn
                const __VLS_146 = __VLS_asFunctionalComponent(
                  __VLS_145,
                  new __VLS_145({ ...{}, label: '系统要求' })
                )
                ;(({}) as { ElTableColumn: typeof __VLS_145 }).ElTableColumn
                ;(({}) as { ElTableColumn: typeof __VLS_145 }).ElTableColumn
                const __VLS_147 = __VLS_146(
                  { ...{}, label: '系统要求' },
                  ...__VLS_functionalComponentArgsRest(__VLS_146)
                )
                ;(
                  ({}) as (
                    props: __VLS_FunctionalComponentProps<
                      typeof __VLS_145,
                      typeof __VLS_147
                    > &
                      Record<string, unknown>
                  ) => void
                )({ ...{}, label: '系统要求' })
                const __VLS_148 = __VLS_pickFunctionalComponentCtx(
                  __VLS_145,
                  __VLS_147
                )!
                let __VLS_149!: __VLS_NormalizeEmits<typeof __VLS_148.emit>
                {
                  const __VLS_150 = __VLS_intrinsicElements['template']
                  const __VLS_151 =
                    __VLS_elementAsFunctionalComponent(__VLS_150)
                  const __VLS_152 = __VLS_151(
                    { ...{} },
                    ...__VLS_functionalComponentArgsRest(__VLS_151)
                  )
                  ;(
                    ({}) as (
                      props: __VLS_FunctionalComponentProps<
                        typeof __VLS_150,
                        typeof __VLS_152
                      > &
                        Record<string, unknown>
                    ) => void
                  )({ ...{} })
                  {
                    const [{ row }] = __VLS_getSlotParams(
                      __VLS_148.slots!.default
                    )
                    row.xitong_yaoqiu
                  }
                }
              }
              {
                const __VLS_153 = (
                  {} as 'ElTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.ElTableColumn }
                    : 'elTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.elTableColumn }
                    : 'el-table-column' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: (typeof __VLS_ctx)['el-table-column'] }
                    : typeof __VLS_resolvedLocalAndGlobalComponents
                ).ElTableColumn
                const __VLS_154 = __VLS_asFunctionalComponent(
                  __VLS_153,
                  new __VLS_153({ ...{}, label: '最低开播余额' })
                )
                ;(({}) as { ElTableColumn: typeof __VLS_153 }).ElTableColumn
                ;(({}) as { ElTableColumn: typeof __VLS_153 }).ElTableColumn
                const __VLS_155 = __VLS_154(
                  { ...{}, label: '最低开播余额' },
                  ...__VLS_functionalComponentArgsRest(__VLS_154)
                )
                ;(
                  ({}) as (
                    props: __VLS_FunctionalComponentProps<
                      typeof __VLS_153,
                      typeof __VLS_155
                    > &
                      Record<string, unknown>
                  ) => void
                )({ ...{}, label: '最低开播余额' })
                const __VLS_156 = __VLS_pickFunctionalComponentCtx(
                  __VLS_153,
                  __VLS_155
                )!
                let __VLS_157!: __VLS_NormalizeEmits<typeof __VLS_156.emit>
                {
                  const __VLS_158 = __VLS_intrinsicElements['template']
                  const __VLS_159 =
                    __VLS_elementAsFunctionalComponent(__VLS_158)
                  const __VLS_160 = __VLS_159(
                    { ...{} },
                    ...__VLS_functionalComponentArgsRest(__VLS_159)
                  )
                  ;(
                    ({}) as (
                      props: __VLS_FunctionalComponentProps<
                        typeof __VLS_158,
                        typeof __VLS_160
                      > &
                        Record<string, unknown>
                    ) => void
                  )({ ...{} })
                  {
                    const [{ row }] = __VLS_getSlotParams(
                      __VLS_156.slots!.default
                    )
                    row.min_price
                  }
                }
              }
              {
                const __VLS_161 = (
                  {} as 'ElTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.ElTableColumn }
                    : 'elTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.elTableColumn }
                    : 'el-table-column' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: (typeof __VLS_ctx)['el-table-column'] }
                    : typeof __VLS_resolvedLocalAndGlobalComponents
                ).ElTableColumn
                const __VLS_162 = __VLS_asFunctionalComponent(
                  __VLS_161,
                  new __VLS_161({ ...{}, label: '固定价格' })
                )
                ;(({}) as { ElTableColumn: typeof __VLS_161 }).ElTableColumn
                ;(({}) as { ElTableColumn: typeof __VLS_161 }).ElTableColumn
                const __VLS_163 = __VLS_162(
                  { ...{}, label: '固定价格' },
                  ...__VLS_functionalComponentArgsRest(__VLS_162)
                )
                ;(
                  ({}) as (
                    props: __VLS_FunctionalComponentProps<
                      typeof __VLS_161,
                      typeof __VLS_163
                    > &
                      Record<string, unknown>
                  ) => void
                )({ ...{}, label: '固定价格' })
                const __VLS_164 = __VLS_pickFunctionalComponentCtx(
                  __VLS_161,
                  __VLS_163
                )!
                let __VLS_165!: __VLS_NormalizeEmits<typeof __VLS_164.emit>
                {
                  const __VLS_166 = __VLS_intrinsicElements['template']
                  const __VLS_167 =
                    __VLS_elementAsFunctionalComponent(__VLS_166)
                  const __VLS_168 = __VLS_167(
                    { ...{} },
                    ...__VLS_functionalComponentArgsRest(__VLS_167)
                  )
                  ;(
                    ({}) as (
                      props: __VLS_FunctionalComponentProps<
                        typeof __VLS_166,
                        typeof __VLS_168
                      > &
                        Record<string, unknown>
                    ) => void
                  )({ ...{} })
                  {
                    const [{ row }] = __VLS_getSlotParams(
                      __VLS_164.slots!.default
                    )
                    row.price
                  }
                }
              }
              {
                const __VLS_169 = (
                  {} as 'ElTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.ElTableColumn }
                    : 'elTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.elTableColumn }
                    : 'el-table-column' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: (typeof __VLS_ctx)['el-table-column'] }
                    : typeof __VLS_resolvedLocalAndGlobalComponents
                ).ElTableColumn
                const __VLS_170 = __VLS_asFunctionalComponent(
                  __VLS_169,
                  new __VLS_169({ ...{}, label: '促销价格' })
                )
                ;(({}) as { ElTableColumn: typeof __VLS_169 }).ElTableColumn
                ;(({}) as { ElTableColumn: typeof __VLS_169 }).ElTableColumn
                const __VLS_171 = __VLS_170(
                  { ...{}, label: '促销价格' },
                  ...__VLS_functionalComponentArgsRest(__VLS_170)
                )
                ;(
                  ({}) as (
                    props: __VLS_FunctionalComponentProps<
                      typeof __VLS_169,
                      typeof __VLS_171
                    > &
                      Record<string, unknown>
                  ) => void
                )({ ...{}, label: '促销价格' })
                const __VLS_172 = __VLS_pickFunctionalComponentCtx(
                  __VLS_169,
                  __VLS_171
                )!
                let __VLS_173!: __VLS_NormalizeEmits<typeof __VLS_172.emit>
                {
                  const __VLS_174 = __VLS_intrinsicElements['template']
                  const __VLS_175 =
                    __VLS_elementAsFunctionalComponent(__VLS_174)
                  const __VLS_176 = __VLS_175(
                    { ...{} },
                    ...__VLS_functionalComponentArgsRest(__VLS_175)
                  )
                  ;(
                    ({}) as (
                      props: __VLS_FunctionalComponentProps<
                        typeof __VLS_174,
                        typeof __VLS_176
                      > &
                        Record<string, unknown>
                    ) => void
                  )({ ...{} })
                  {
                    const [{ row }] = __VLS_getSlotParams(
                      __VLS_172.slots!.default
                    )
                    row.cuxiao_price
                  }
                }
              }
              {
                const __VLS_177 = (
                  {} as 'ElTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.ElTableColumn }
                    : 'elTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.elTableColumn }
                    : 'el-table-column' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: (typeof __VLS_ctx)['el-table-column'] }
                    : typeof __VLS_resolvedLocalAndGlobalComponents
                ).ElTableColumn
                const __VLS_178 = __VLS_asFunctionalComponent(
                  __VLS_177,
                  new __VLS_177({ ...{}, label: '分成比例' })
                )
                ;(({}) as { ElTableColumn: typeof __VLS_177 }).ElTableColumn
                ;(({}) as { ElTableColumn: typeof __VLS_177 }).ElTableColumn
                const __VLS_179 = __VLS_178(
                  { ...{}, label: '分成比例' },
                  ...__VLS_functionalComponentArgsRest(__VLS_178)
                )
                ;(
                  ({}) as (
                    props: __VLS_FunctionalComponentProps<
                      typeof __VLS_177,
                      typeof __VLS_179
                    > &
                      Record<string, unknown>
                  ) => void
                )({ ...{}, label: '分成比例' })
                const __VLS_180 = __VLS_pickFunctionalComponentCtx(
                  __VLS_177,
                  __VLS_179
                )!
                let __VLS_181!: __VLS_NormalizeEmits<typeof __VLS_180.emit>
                {
                  const __VLS_182 = __VLS_intrinsicElements['template']
                  const __VLS_183 =
                    __VLS_elementAsFunctionalComponent(__VLS_182)
                  const __VLS_184 = __VLS_183(
                    { ...{} },
                    ...__VLS_functionalComponentArgsRest(__VLS_183)
                  )
                  ;(
                    ({}) as (
                      props: __VLS_FunctionalComponentProps<
                        typeof __VLS_182,
                        typeof __VLS_184
                      > &
                        Record<string, unknown>
                    ) => void
                  )({ ...{} })
                  {
                    const [{ row }] = __VLS_getSlotParams(
                      __VLS_180.slots!.default
                    )
                    row.divide
                  }
                }
              }
              {
                const __VLS_185 = (
                  {} as 'ElTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.ElTableColumn }
                    : 'elTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.elTableColumn }
                    : 'el-table-column' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: (typeof __VLS_ctx)['el-table-column'] }
                    : typeof __VLS_resolvedLocalAndGlobalComponents
                ).ElTableColumn
                const __VLS_186 = __VLS_asFunctionalComponent(
                  __VLS_185,
                  new __VLS_185({ ...{}, label: '客服信息' })
                )
                ;(({}) as { ElTableColumn: typeof __VLS_185 }).ElTableColumn
                ;(({}) as { ElTableColumn: typeof __VLS_185 }).ElTableColumn
                const __VLS_187 = __VLS_186(
                  { ...{}, label: '客服信息' },
                  ...__VLS_functionalComponentArgsRest(__VLS_186)
                )
                ;(
                  ({}) as (
                    props: __VLS_FunctionalComponentProps<
                      typeof __VLS_185,
                      typeof __VLS_187
                    > &
                      Record<string, unknown>
                  ) => void
                )({ ...{}, label: '客服信息' })
                const __VLS_188 = __VLS_pickFunctionalComponentCtx(
                  __VLS_185,
                  __VLS_187
                )!
                let __VLS_189!: __VLS_NormalizeEmits<typeof __VLS_188.emit>
                {
                  const __VLS_190 = __VLS_intrinsicElements['template']
                  const __VLS_191 =
                    __VLS_elementAsFunctionalComponent(__VLS_190)
                  const __VLS_192 = __VLS_191(
                    { ...{} },
                    ...__VLS_functionalComponentArgsRest(__VLS_191)
                  )
                  ;(
                    ({}) as (
                      props: __VLS_FunctionalComponentProps<
                        typeof __VLS_190,
                        typeof __VLS_192
                      > &
                        Record<string, unknown>
                    ) => void
                  )({ ...{} })
                  {
                    const [{ row }] = __VLS_getSlotParams(
                      __VLS_188.slots!.default
                    )
                    row.kefu
                  }
                }
              }
              {
                const __VLS_193 = (
                  {} as 'ElTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.ElTableColumn }
                    : 'elTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.elTableColumn }
                    : 'el-table-column' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: (typeof __VLS_ctx)['el-table-column'] }
                    : typeof __VLS_resolvedLocalAndGlobalComponents
                ).ElTableColumn
                const __VLS_194 = __VLS_asFunctionalComponent(
                  __VLS_193,
                  new __VLS_193({ ...{}, label: '使用激活码' })
                )
                ;(({}) as { ElTableColumn: typeof __VLS_193 }).ElTableColumn
                ;(({}) as { ElTableColumn: typeof __VLS_193 }).ElTableColumn
                const __VLS_195 = __VLS_194(
                  { ...{}, label: '使用激活码' },
                  ...__VLS_functionalComponentArgsRest(__VLS_194)
                )
                ;(
                  ({}) as (
                    props: __VLS_FunctionalComponentProps<
                      typeof __VLS_193,
                      typeof __VLS_195
                    > &
                      Record<string, unknown>
                  ) => void
                )({ ...{}, label: '使用激活码' })
                const __VLS_196 = __VLS_pickFunctionalComponentCtx(
                  __VLS_193,
                  __VLS_195
                )!
                let __VLS_197!: __VLS_NormalizeEmits<typeof __VLS_196.emit>
                {
                  const __VLS_198 = __VLS_intrinsicElements['template']
                  const __VLS_199 =
                    __VLS_elementAsFunctionalComponent(__VLS_198)
                  const __VLS_200 = __VLS_199(
                    { ...{} },
                    ...__VLS_functionalComponentArgsRest(__VLS_199)
                  )
                  ;(
                    ({}) as (
                      props: __VLS_FunctionalComponentProps<
                        typeof __VLS_198,
                        typeof __VLS_200
                      > &
                        Record<string, unknown>
                    ) => void
                  )({ ...{} })
                  {
                    const [{ row }] = __VLS_getSlotParams(
                      __VLS_196.slots!.default
                    )
                    row.is_user_jhm == 1 ? '否' : '是'
                  }
                }
              }
              {
                const __VLS_201 = (
                  {} as 'ElTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.ElTableColumn }
                    : 'elTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.elTableColumn }
                    : 'el-table-column' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: (typeof __VLS_ctx)['el-table-column'] }
                    : typeof __VLS_resolvedLocalAndGlobalComponents
                ).ElTableColumn
                const __VLS_202 = __VLS_asFunctionalComponent(
                  __VLS_201,
                  new __VLS_201({ ...{}, label: '是否线上' })
                )
                ;(({}) as { ElTableColumn: typeof __VLS_201 }).ElTableColumn
                ;(({}) as { ElTableColumn: typeof __VLS_201 }).ElTableColumn
                const __VLS_203 = __VLS_202(
                  { ...{}, label: '是否线上' },
                  ...__VLS_functionalComponentArgsRest(__VLS_202)
                )
                ;(
                  ({}) as (
                    props: __VLS_FunctionalComponentProps<
                      typeof __VLS_201,
                      typeof __VLS_203
                    > &
                      Record<string, unknown>
                  ) => void
                )({ ...{}, label: '是否线上' })
                const __VLS_204 = __VLS_pickFunctionalComponentCtx(
                  __VLS_201,
                  __VLS_203
                )!
                let __VLS_205!: __VLS_NormalizeEmits<typeof __VLS_204.emit>
                {
                  const __VLS_206 = __VLS_intrinsicElements['template']
                  const __VLS_207 =
                    __VLS_elementAsFunctionalComponent(__VLS_206)
                  const __VLS_208 = __VLS_207(
                    { ...{} },
                    ...__VLS_functionalComponentArgsRest(__VLS_207)
                  )
                  ;(
                    ({}) as (
                      props: __VLS_FunctionalComponentProps<
                        typeof __VLS_206,
                        typeof __VLS_208
                      > &
                        Record<string, unknown>
                    ) => void
                  )({ ...{} })
                  {
                    const [{ row }] = __VLS_getSlotParams(
                      __VLS_204.slots!.default
                    )
                    row.is_xianxia == 1 ? '是' : '否'
                  }
                }
              }
              {
                const __VLS_209 = (
                  {} as 'ElTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.ElTableColumn }
                    : 'elTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.elTableColumn }
                    : 'el-table-column' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: (typeof __VLS_ctx)['el-table-column'] }
                    : typeof __VLS_resolvedLocalAndGlobalComponents
                ).ElTableColumn
                const __VLS_210 = __VLS_asFunctionalComponent(
                  __VLS_209,
                  new __VLS_209({ ...{}, label: '是否冻结' })
                )
                ;(({}) as { ElTableColumn: typeof __VLS_209 }).ElTableColumn
                ;(({}) as { ElTableColumn: typeof __VLS_209 }).ElTableColumn
                const __VLS_211 = __VLS_210(
                  { ...{}, label: '是否冻结' },
                  ...__VLS_functionalComponentArgsRest(__VLS_210)
                )
                ;(
                  ({}) as (
                    props: __VLS_FunctionalComponentProps<
                      typeof __VLS_209,
                      typeof __VLS_211
                    > &
                      Record<string, unknown>
                  ) => void
                )({ ...{}, label: '是否冻结' })
                const __VLS_212 = __VLS_pickFunctionalComponentCtx(
                  __VLS_209,
                  __VLS_211
                )!
                let __VLS_213!: __VLS_NormalizeEmits<typeof __VLS_212.emit>
                {
                  const __VLS_214 = __VLS_intrinsicElements['template']
                  const __VLS_215 =
                    __VLS_elementAsFunctionalComponent(__VLS_214)
                  const __VLS_216 = __VLS_215(
                    { ...{} },
                    ...__VLS_functionalComponentArgsRest(__VLS_215)
                  )
                  ;(
                    ({}) as (
                      props: __VLS_FunctionalComponentProps<
                        typeof __VLS_214,
                        typeof __VLS_216
                      > &
                        Record<string, unknown>
                    ) => void
                  )({ ...{} })
                  {
                    const [{ row }] = __VLS_getSlotParams(
                      __VLS_212.slots!.default
                    )
                    row.is_xianxia == 1 ? '否' : '是'
                  }
                }
              }
              {
                const __VLS_217 = (
                  {} as 'ElTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.ElTableColumn }
                    : 'elTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.elTableColumn }
                    : 'el-table-column' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: (typeof __VLS_ctx)['el-table-column'] }
                    : typeof __VLS_resolvedLocalAndGlobalComponents
                ).ElTableColumn
                const __VLS_218 = __VLS_asFunctionalComponent(
                  __VLS_217,
                  new __VLS_217({ ...{}, label: '公告' })
                )
                ;(({}) as { ElTableColumn: typeof __VLS_217 }).ElTableColumn
                ;(({}) as { ElTableColumn: typeof __VLS_217 }).ElTableColumn
                const __VLS_219 = __VLS_218(
                  { ...{}, label: '公告' },
                  ...__VLS_functionalComponentArgsRest(__VLS_218)
                )
                ;(
                  ({}) as (
                    props: __VLS_FunctionalComponentProps<
                      typeof __VLS_217,
                      typeof __VLS_219
                    > &
                      Record<string, unknown>
                  ) => void
                )({ ...{}, label: '公告' })
                const __VLS_220 = __VLS_pickFunctionalComponentCtx(
                  __VLS_217,
                  __VLS_219
                )!
                let __VLS_221!: __VLS_NormalizeEmits<typeof __VLS_220.emit>
                {
                  const __VLS_222 = __VLS_intrinsicElements['template']
                  const __VLS_223 =
                    __VLS_elementAsFunctionalComponent(__VLS_222)
                  const __VLS_224 = __VLS_223(
                    { ...{} },
                    ...__VLS_functionalComponentArgsRest(__VLS_223)
                  )
                  ;(
                    ({}) as (
                      props: __VLS_FunctionalComponentProps<
                        typeof __VLS_222,
                        typeof __VLS_224
                      > &
                        Record<string, unknown>
                    ) => void
                  )({ ...{} })
                  {
                    const [{ row }] = __VLS_getSlotParams(
                      __VLS_220.slots!.default
                    )
                    row.gonggao
                  }
                }
              }
              {
                const __VLS_225 = (
                  {} as 'ElTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.ElTableColumn }
                    : 'elTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.elTableColumn }
                    : 'el-table-column' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: (typeof __VLS_ctx)['el-table-column'] }
                    : typeof __VLS_resolvedLocalAndGlobalComponents
                ).ElTableColumn
                const __VLS_226 = __VLS_asFunctionalComponent(
                  __VLS_225,
                  new __VLS_225({ ...{}, label: '套餐' })
                )
                ;(({}) as { ElTableColumn: typeof __VLS_225 }).ElTableColumn
                ;(({}) as { ElTableColumn: typeof __VLS_225 }).ElTableColumn
                const __VLS_227 = __VLS_226(
                  { ...{}, label: '套餐' },
                  ...__VLS_functionalComponentArgsRest(__VLS_226)
                )
                ;(
                  ({}) as (
                    props: __VLS_FunctionalComponentProps<
                      typeof __VLS_225,
                      typeof __VLS_227
                    > &
                      Record<string, unknown>
                  ) => void
                )({ ...{}, label: '套餐' })
                const __VLS_228 = __VLS_pickFunctionalComponentCtx(
                  __VLS_225,
                  __VLS_227
                )!
                let __VLS_229!: __VLS_NormalizeEmits<typeof __VLS_228.emit>
                {
                  const __VLS_230 = __VLS_intrinsicElements['template']
                  const __VLS_231 =
                    __VLS_elementAsFunctionalComponent(__VLS_230)
                  const __VLS_232 = __VLS_231(
                    { ...{} },
                    ...__VLS_functionalComponentArgsRest(__VLS_231)
                  )
                  ;(
                    ({}) as (
                      props: __VLS_FunctionalComponentProps<
                        typeof __VLS_230,
                        typeof __VLS_232
                      > &
                        Record<string, unknown>
                    ) => void
                  )({ ...{} })
                  {
                    const [{ row }] = __VLS_getSlotParams(
                      __VLS_228.slots!.default
                    )
                    for (const [item, index] of __VLS_getVForSourceType(
                      row.taocan!
                    )) {
                      {
                        const __VLS_233 = __VLS_intrinsicElements['div']
                        const __VLS_234 =
                          __VLS_elementAsFunctionalComponent(__VLS_233)
                        const __VLS_235 = __VLS_234(
                          { ...{}, key: index },
                          ...__VLS_functionalComponentArgsRest(__VLS_234)
                        )
                        ;(
                          ({}) as (
                            props: __VLS_FunctionalComponentProps<
                              typeof __VLS_233,
                              typeof __VLS_235
                            > &
                              Record<string, unknown>
                          ) => void
                        )({ ...{}, key: index })
                        const __VLS_236 = __VLS_pickFunctionalComponentCtx(
                          __VLS_233,
                          __VLS_235
                        )!
                        let __VLS_237!: __VLS_NormalizeEmits<
                          typeof __VLS_236.emit
                        >
                        {
                          const __VLS_238 = __VLS_intrinsicElements['div']
                          const __VLS_239 =
                            __VLS_elementAsFunctionalComponent(__VLS_238)
                          const __VLS_240 = __VLS_239(
                            { ...{} },
                            ...__VLS_functionalComponentArgsRest(__VLS_239)
                          )
                          ;(
                            ({}) as (
                              props: __VLS_FunctionalComponentProps<
                                typeof __VLS_238,
                                typeof __VLS_240
                              > &
                                Record<string, unknown>
                            ) => void
                          )({ ...{} })
                          const __VLS_241 = __VLS_pickFunctionalComponentCtx(
                            __VLS_238,
                            __VLS_240
                          )!
                          let __VLS_242!: __VLS_NormalizeEmits<
                            typeof __VLS_241.emit
                          >
                          index + 1
                          __VLS_241.slots!.default
                        }
                        {
                          const __VLS_243 = __VLS_intrinsicElements['div']
                          const __VLS_244 =
                            __VLS_elementAsFunctionalComponent(__VLS_243)
                          const __VLS_245 = __VLS_244(
                            { ...{} },
                            ...__VLS_functionalComponentArgsRest(__VLS_244)
                          )
                          ;(
                            ({}) as (
                              props: __VLS_FunctionalComponentProps<
                                typeof __VLS_243,
                                typeof __VLS_245
                              > &
                                Record<string, unknown>
                            ) => void
                          )({ ...{} })
                          const __VLS_246 = __VLS_pickFunctionalComponentCtx(
                            __VLS_243,
                            __VLS_245
                          )!
                          let __VLS_247!: __VLS_NormalizeEmits<
                            typeof __VLS_246.emit
                          >
                          {
                            const __VLS_248 = __VLS_intrinsicElements['span']
                            const __VLS_249 =
                              __VLS_elementAsFunctionalComponent(__VLS_248)
                            const __VLS_250 = __VLS_249(
                              { ...{} },
                              ...__VLS_functionalComponentArgsRest(__VLS_249)
                            )
                            ;(
                              ({}) as (
                                props: __VLS_FunctionalComponentProps<
                                  typeof __VLS_248,
                                  typeof __VLS_250
                                > &
                                  Record<string, unknown>
                              ) => void
                            )({ ...{} })
                            const __VLS_251 = __VLS_pickFunctionalComponentCtx(
                              __VLS_248,
                              __VLS_250
                            )!
                            let __VLS_252!: __VLS_NormalizeEmits<
                              typeof __VLS_251.emit
                            >
                            __VLS_251.slots!.default
                          }
                          {
                            const __VLS_253 = __VLS_intrinsicElements['span']
                            const __VLS_254 =
                              __VLS_elementAsFunctionalComponent(__VLS_253)
                            const __VLS_255 = __VLS_254(
                              { ...{} },
                              ...__VLS_functionalComponentArgsRest(__VLS_254)
                            )
                            ;(
                              ({}) as (
                                props: __VLS_FunctionalComponentProps<
                                  typeof __VLS_253,
                                  typeof __VLS_255
                                > &
                                  Record<string, unknown>
                              ) => void
                            )({ ...{} })
                            const __VLS_256 = __VLS_pickFunctionalComponentCtx(
                              __VLS_253,
                              __VLS_255
                            )!
                            let __VLS_257!: __VLS_NormalizeEmits<
                              typeof __VLS_256.emit
                            >
                            item.tdays
                            __VLS_256.slots!.default
                          }
                          __VLS_246.slots!.default
                        }
                        {
                          const __VLS_258 = __VLS_intrinsicElements['div']
                          const __VLS_259 =
                            __VLS_elementAsFunctionalComponent(__VLS_258)
                          const __VLS_260 = __VLS_259(
                            { ...{} },
                            ...__VLS_functionalComponentArgsRest(__VLS_259)
                          )
                          ;(
                            ({}) as (
                              props: __VLS_FunctionalComponentProps<
                                typeof __VLS_258,
                                typeof __VLS_260
                              > &
                                Record<string, unknown>
                            ) => void
                          )({ ...{} })
                          const __VLS_261 = __VLS_pickFunctionalComponentCtx(
                            __VLS_258,
                            __VLS_260
                          )!
                          let __VLS_262!: __VLS_NormalizeEmits<
                            typeof __VLS_261.emit
                          >
                          {
                            const __VLS_263 = __VLS_intrinsicElements['span']
                            const __VLS_264 =
                              __VLS_elementAsFunctionalComponent(__VLS_263)
                            const __VLS_265 = __VLS_264(
                              { ...{} },
                              ...__VLS_functionalComponentArgsRest(__VLS_264)
                            )
                            ;(
                              ({}) as (
                                props: __VLS_FunctionalComponentProps<
                                  typeof __VLS_263,
                                  typeof __VLS_265
                                > &
                                  Record<string, unknown>
                              ) => void
                            )({ ...{} })
                            const __VLS_266 = __VLS_pickFunctionalComponentCtx(
                              __VLS_263,
                              __VLS_265
                            )!
                            let __VLS_267!: __VLS_NormalizeEmits<
                              typeof __VLS_266.emit
                            >
                            __VLS_266.slots!.default
                          }
                          {
                            const __VLS_268 = __VLS_intrinsicElements['span']
                            const __VLS_269 =
                              __VLS_elementAsFunctionalComponent(__VLS_268)
                            const __VLS_270 = __VLS_269(
                              { ...{} },
                              ...__VLS_functionalComponentArgsRest(__VLS_269)
                            )
                            ;(
                              ({}) as (
                                props: __VLS_FunctionalComponentProps<
                                  typeof __VLS_268,
                                  typeof __VLS_270
                                > &
                                  Record<string, unknown>
                              ) => void
                            )({ ...{} })
                            const __VLS_271 = __VLS_pickFunctionalComponentCtx(
                              __VLS_268,
                              __VLS_270
                            )!
                            let __VLS_272!: __VLS_NormalizeEmits<
                              typeof __VLS_271.emit
                            >
                            item.tprice
                            __VLS_271.slots!.default
                          }
                          __VLS_261.slots!.default
                        }
                        __VLS_236.slots!.default
                      }
                    }
                  }
                }
              }
              {
                const __VLS_273 = (
                  {} as 'ElTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.ElTableColumn }
                    : 'elTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.elTableColumn }
                    : 'el-table-column' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: (typeof __VLS_ctx)['el-table-column'] }
                    : typeof __VLS_resolvedLocalAndGlobalComponents
                ).ElTableColumn
                const __VLS_274 = __VLS_asFunctionalComponent(
                  __VLS_273,
                  new __VLS_273({ ...{}, label: __VLS_ctx.$t('table.ctime') })
                )
                ;(({}) as { ElTableColumn: typeof __VLS_273 }).ElTableColumn
                ;(({}) as { ElTableColumn: typeof __VLS_273 }).ElTableColumn
                const __VLS_275 = __VLS_274(
                  { ...{}, label: __VLS_ctx.$t('table.ctime') },
                  ...__VLS_functionalComponentArgsRest(__VLS_274)
                )
                ;(
                  ({}) as (
                    props: __VLS_FunctionalComponentProps<
                      typeof __VLS_273,
                      typeof __VLS_275
                    > &
                      Record<string, unknown>
                  ) => void
                )({ ...{}, label: __VLS_ctx.$t('table.ctime') })
                const __VLS_276 = __VLS_pickFunctionalComponentCtx(
                  __VLS_273,
                  __VLS_275
                )!
                let __VLS_277!: __VLS_NormalizeEmits<typeof __VLS_276.emit>
                {
                  const __VLS_278 = __VLS_intrinsicElements['template']
                  const __VLS_279 =
                    __VLS_elementAsFunctionalComponent(__VLS_278)
                  const __VLS_280 = __VLS_279(
                    { ...{} },
                    ...__VLS_functionalComponentArgsRest(__VLS_279)
                  )
                  ;(
                    ({}) as (
                      props: __VLS_FunctionalComponentProps<
                        typeof __VLS_278,
                        typeof __VLS_280
                      > &
                        Record<string, unknown>
                    ) => void
                  )({ ...{} })
                  {
                    const [{ row }] = __VLS_getSlotParams(
                      __VLS_276.slots!.default
                    )
                    __VLS_ctx.formatTime(row.ctime)
                    // @ts-ignore
                    ;[$t, $t, $t, formatTime]
                  }
                }
              }
              {
                const __VLS_281 = (
                  {} as 'ElTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.ElTableColumn }
                    : 'elTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.elTableColumn }
                    : 'el-table-column' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: (typeof __VLS_ctx)['el-table-column'] }
                    : typeof __VLS_resolvedLocalAndGlobalComponents
                ).ElTableColumn
                const __VLS_282 = __VLS_asFunctionalComponent(
                  __VLS_281,
                  new __VLS_281({ ...{}, label: __VLS_ctx.$t('table.utime') })
                )
                ;(({}) as { ElTableColumn: typeof __VLS_281 }).ElTableColumn
                ;(({}) as { ElTableColumn: typeof __VLS_281 }).ElTableColumn
                const __VLS_283 = __VLS_282(
                  { ...{}, label: __VLS_ctx.$t('table.utime') },
                  ...__VLS_functionalComponentArgsRest(__VLS_282)
                )
                ;(
                  ({}) as (
                    props: __VLS_FunctionalComponentProps<
                      typeof __VLS_281,
                      typeof __VLS_283
                    > &
                      Record<string, unknown>
                  ) => void
                )({ ...{}, label: __VLS_ctx.$t('table.utime') })
                const __VLS_284 = __VLS_pickFunctionalComponentCtx(
                  __VLS_281,
                  __VLS_283
                )!
                let __VLS_285!: __VLS_NormalizeEmits<typeof __VLS_284.emit>
                {
                  const __VLS_286 = __VLS_intrinsicElements['template']
                  const __VLS_287 =
                    __VLS_elementAsFunctionalComponent(__VLS_286)
                  const __VLS_288 = __VLS_287(
                    { ...{} },
                    ...__VLS_functionalComponentArgsRest(__VLS_287)
                  )
                  ;(
                    ({}) as (
                      props: __VLS_FunctionalComponentProps<
                        typeof __VLS_286,
                        typeof __VLS_288
                      > &
                        Record<string, unknown>
                    ) => void
                  )({ ...{} })
                  {
                    const [{ row }] = __VLS_getSlotParams(
                      __VLS_284.slots!.default
                    )
                    __VLS_ctx.formatTime(row.uptime)
                    // @ts-ignore
                    ;[$t, $t, $t, formatTime]
                  }
                }
              }
              {
                const __VLS_289 = (
                  {} as 'ElTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.ElTableColumn }
                    : 'elTableColumn' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: typeof __VLS_ctx.elTableColumn }
                    : 'el-table-column' extends keyof typeof __VLS_ctx
                    ? { ElTableColumn: (typeof __VLS_ctx)['el-table-column'] }
                    : typeof __VLS_resolvedLocalAndGlobalComponents
                ).ElTableColumn
                const __VLS_290 = __VLS_asFunctionalComponent(
                  __VLS_289,
                  new __VLS_289({
                    ...{},
                    fixed: 'right',
                    label: __VLS_ctx.$t('table.operate'),
                    minWidth: '185'
                  })
                )
                ;(({}) as { ElTableColumn: typeof __VLS_289 }).ElTableColumn
                ;(({}) as { ElTableColumn: typeof __VLS_289 }).ElTableColumn
                const __VLS_291 = __VLS_290(
                  {
                    ...{},
                    fixed: 'right',
                    label: __VLS_ctx.$t('table.operate'),
                    minWidth: '185'
                  },
                  ...__VLS_functionalComponentArgsRest(__VLS_290)
                )
                ;(
                  ({}) as (
                    props: __VLS_FunctionalComponentProps<
                      typeof __VLS_289,
                      typeof __VLS_291
                    > &
                      Record<string, unknown>
                  ) => void
                )({
                  ...{},
                  fixed: 'right',
                  label: __VLS_ctx.$t('table.operate'),
                  minWidth: '185'
                })
                const __VLS_292 = __VLS_pickFunctionalComponentCtx(
                  __VLS_289,
                  __VLS_291
                )!
                let __VLS_293!: __VLS_NormalizeEmits<typeof __VLS_292.emit>
                {
                  const __VLS_294 = __VLS_intrinsicElements['template']
                  const __VLS_295 =
                    __VLS_elementAsFunctionalComponent(__VLS_294)
                  const __VLS_296 = __VLS_295(
                    { ...{} },
                    ...__VLS_functionalComponentArgsRest(__VLS_295)
                  )
                  ;(
                    ({}) as (
                      props: __VLS_FunctionalComponentProps<
                        typeof __VLS_294,
                        typeof __VLS_296
                      > &
                        Record<string, unknown>
                    ) => void
                  )({ ...{} })
                  {
                    const [{ row }] = __VLS_getSlotParams(
                      __VLS_292.slots!.default
                    )
                    {
                      const __VLS_297 = (
                        {} as 'ElButton' extends keyof typeof __VLS_ctx
                          ? { ElButton: typeof __VLS_ctx.ElButton }
                          : 'elButton' extends keyof typeof __VLS_ctx
                          ? { ElButton: typeof __VLS_ctx.elButton }
                          : 'el-button' extends keyof typeof __VLS_ctx
                          ? { ElButton: (typeof __VLS_ctx)['el-button'] }
                          : typeof __VLS_resolvedLocalAndGlobalComponents
                      ).ElButton
                      const __VLS_298 = __VLS_asFunctionalComponent(
                        __VLS_297,
                        new __VLS_297({
                          ...{ onClick: {} as any },
                          type: 'primary'
                        })
                      )
                      ;(({}) as { ElButton: typeof __VLS_297 }).ElButton
                      ;(({}) as { ElButton: typeof __VLS_297 }).ElButton
                      const __VLS_299 = __VLS_298(
                        { ...{ onClick: {} as any }, type: 'primary' },
                        ...__VLS_functionalComponentArgsRest(__VLS_298)
                      )
                      ;(
                        ({}) as (
                          props: __VLS_FunctionalComponentProps<
                            typeof __VLS_297,
                            typeof __VLS_299
                          > &
                            Record<string, unknown>
                        ) => void
                      )({ ...{ onClick: {} as any }, type: 'primary' })
                      const __VLS_300 = __VLS_pickFunctionalComponentCtx(
                        __VLS_297,
                        __VLS_299
                      )!
                      let __VLS_301!: __VLS_NormalizeEmits<
                        typeof __VLS_300.emit
                      >
                      let __VLS_302 = {
                        click: __VLS_pickEvent(
                          __VLS_301['click'],
                          (
                            {} as __VLS_FunctionalComponentProps<
                              typeof __VLS_298,
                              typeof __VLS_299
                            >
                          ).onClick
                        )
                      }
                      __VLS_302 = {
                        click: ($event) => {
                          __VLS_ctx.onBuyGame(row)
                          // @ts-ignore
                          ;[$t, $t, $t, onBuyGame]
                        }
                      }
                      __VLS_300.slots!.default
                    }
                    {
                      const __VLS_303 = (
                        {} as 'ElButton' extends keyof typeof __VLS_ctx
                          ? { ElButton: typeof __VLS_ctx.ElButton }
                          : 'elButton' extends keyof typeof __VLS_ctx
                          ? { ElButton: typeof __VLS_ctx.elButton }
                          : 'el-button' extends keyof typeof __VLS_ctx
                          ? { ElButton: (typeof __VLS_ctx)['el-button'] }
                          : typeof __VLS_resolvedLocalAndGlobalComponents
                      ).ElButton
                      const __VLS_304 = __VLS_asFunctionalComponent(
                        __VLS_303,
                        new __VLS_303({ ...{ onClick: {} as any } })
                      )
                      ;(({}) as { ElButton: typeof __VLS_303 }).ElButton
                      ;(({}) as { ElButton: typeof __VLS_303 }).ElButton
                      const __VLS_305 = __VLS_304(
                        { ...{ onClick: {} as any } },
                        ...__VLS_functionalComponentArgsRest(__VLS_304)
                      )
                      ;(
                        ({}) as (
                          props: __VLS_FunctionalComponentProps<
                            typeof __VLS_303,
                            typeof __VLS_305
                          > &
                            Record<string, unknown>
                        ) => void
                      )({ ...{ onClick: {} as any } })
                      const __VLS_306 = __VLS_pickFunctionalComponentCtx(
                        __VLS_303,
                        __VLS_305
                      )!
                      let __VLS_307!: __VLS_NormalizeEmits<
                        typeof __VLS_306.emit
                      >
                      let __VLS_308 = {
                        click: __VLS_pickEvent(
                          __VLS_307['click'],
                          (
                            {} as __VLS_FunctionalComponentProps<
                              typeof __VLS_304,
                              typeof __VLS_305
                            >
                          ).onClick
                        )
                      }
                      __VLS_308 = {
                        click: ($event) => {
                          __VLS_ctx.goFeedback(row)
                          // @ts-ignore
                          ;[goFeedback]
                        }
                      }
                      __VLS_306.slots!.default
                    }
                  }
                }
              }
              __VLS_103.slots!.default
            }
          }
        }
        {
          const __VLS_309 = __VLS_intrinsicElements['template']
          const __VLS_310 = __VLS_elementAsFunctionalComponent(__VLS_309)
          const __VLS_311 = __VLS_310(
            { ...{} },
            ...__VLS_functionalComponentArgsRest(__VLS_310)
          )
          ;(
            ({}) as (
              props: __VLS_FunctionalComponentProps<
                typeof __VLS_309,
                typeof __VLS_311
              > &
                Record<string, unknown>
            ) => void
          )({ ...{} })
          {
            __VLS_87.slots!.foot
            {
              const __VLS_312 = __VLS_intrinsicElements['div']
              const __VLS_313 = __VLS_elementAsFunctionalComponent(__VLS_312)
              const __VLS_314 = __VLS_313(
                { ...{}, class: 'pagination' },
                ...__VLS_functionalComponentArgsRest(__VLS_313)
              )
              ;(
                ({}) as (
                  props: __VLS_FunctionalComponentProps<
                    typeof __VLS_312,
                    typeof __VLS_314
                  > &
                    Record<string, unknown>
                ) => void
              )({ ...{}, class: 'pagination' })
              const __VLS_315 = __VLS_pickFunctionalComponentCtx(
                __VLS_312,
                __VLS_314
              )!
              let __VLS_316!: __VLS_NormalizeEmits<typeof __VLS_315.emit>
              {
                const __VLS_317 = (
                  {} as 'ElPagination' extends keyof typeof __VLS_ctx
                    ? { ElPagination: typeof __VLS_ctx.ElPagination }
                    : 'elPagination' extends keyof typeof __VLS_ctx
                    ? { ElPagination: typeof __VLS_ctx.elPagination }
                    : 'el-pagination' extends keyof typeof __VLS_ctx
                    ? { ElPagination: (typeof __VLS_ctx)['el-pagination'] }
                    : typeof __VLS_resolvedLocalAndGlobalComponents
                ).ElPagination
                const __VLS_318 = __VLS_asFunctionalComponent(
                  __VLS_317,
                  new __VLS_317({
                    ...{ onSizeChange: {} as any, onCurrentChange: {} as any },
                    background: true,
                    layout: 'total,prev, pager, next, sizes',
                    currentPage: __VLS_ctx.currentPage,
                    pageSize: __VLS_ctx.pageSize,
                    pageSizes: [10, 20, 30],
                    total: __VLS_ctx.totalItems
                  })
                )
                ;(({}) as { ElPagination: typeof __VLS_317 }).ElPagination
                ;(({}) as { ElPagination: typeof __VLS_317 }).ElPagination
                const __VLS_319 = __VLS_318(
                  {
                    ...{ onSizeChange: {} as any, onCurrentChange: {} as any },
                    background: true,
                    layout: 'total,prev, pager, next, sizes',
                    currentPage: __VLS_ctx.currentPage,
                    pageSize: __VLS_ctx.pageSize,
                    pageSizes: [10, 20, 30],
                    total: __VLS_ctx.totalItems
                  },
                  ...__VLS_functionalComponentArgsRest(__VLS_318)
                )
                ;(
                  ({}) as (
                    props: __VLS_FunctionalComponentProps<
                      typeof __VLS_317,
                      typeof __VLS_319
                    > &
                      Record<string, unknown>
                  ) => void
                )({
                  ...{ onSizeChange: {} as any, onCurrentChange: {} as any },
                  background: true,
                  layout: 'total,prev, pager, next, sizes',
                  currentPage: __VLS_ctx.currentPage,
                  pageSize: __VLS_ctx.pageSize,
                  pageSizes: [10, 20, 30],
                  total: __VLS_ctx.totalItems
                })
                const __VLS_320 = __VLS_pickFunctionalComponentCtx(
                  __VLS_317,
                  __VLS_319
                )!
                let __VLS_321!: __VLS_NormalizeEmits<typeof __VLS_320.emit>
                let __VLS_322 = {
                  'size-change': __VLS_pickEvent(
                    __VLS_321['size-change'],
                    (
                      {} as __VLS_FunctionalComponentProps<
                        typeof __VLS_318,
                        typeof __VLS_319
                      >
                    ).onSizeChange
                  )
                }
                __VLS_322 = { 'size-change': __VLS_ctx.handleSizeChange }
                let __VLS_323 = {
                  'current-change': __VLS_pickEvent(
                    __VLS_321['current-change'],
                    (
                      {} as __VLS_FunctionalComponentProps<
                        typeof __VLS_318,
                        typeof __VLS_319
                      >
                    ).onCurrentChange
                  )
                }
                __VLS_323 = { 'current-change': __VLS_ctx.handleCurrentChange }
              }
              __VLS_315.slots!.default
            }
            // @ts-ignore
            ;[
              currentPage,
              pageSize,
              totalItems,
              currentPage,
              pageSize,
              totalItems,
              currentPage,
              pageSize,
              totalItems,
              handleSizeChange,
              handleCurrentChange
            ]
          }
        }
      }
      __VLS_82.slots!.default
    }
    {
      const __VLS_324 = (
        {} as 'ElDialog' extends keyof typeof __VLS_ctx
          ? { ElDialog: typeof __VLS_ctx.ElDialog }
          : 'elDialog' extends keyof typeof __VLS_ctx
          ? { ElDialog: typeof __VLS_ctx.elDialog }
          : 'el-dialog' extends keyof typeof __VLS_ctx
          ? { ElDialog: (typeof __VLS_ctx)['el-dialog'] }
          : typeof __VLS_resolvedLocalAndGlobalComponents
      ).ElDialog
      const __VLS_325 = __VLS_asFunctionalComponent(
        __VLS_324,
        new __VLS_324({
          ...{},
          modelValue: __VLS_ctx.dialogVisible,
          title: '购买',
          width: '30%'
        })
      )
      ;(({}) as { ElDialog: typeof __VLS_324 }).ElDialog
      ;(({}) as { ElDialog: typeof __VLS_324 }).ElDialog
      const __VLS_326 = __VLS_325(
        {
          ...{},
          modelValue: __VLS_ctx.dialogVisible,
          title: '购买',
          width: '30%'
        },
        ...__VLS_functionalComponentArgsRest(__VLS_325)
      )
      ;(
        ({}) as (
          props: __VLS_FunctionalComponentProps<
            typeof __VLS_324,
            typeof __VLS_326
          > &
            Record<string, unknown>
        ) => void
      )({
        ...{},
        modelValue: __VLS_ctx.dialogVisible,
        title: '购买',
        width: '30%'
      })
      const __VLS_327 = __VLS_pickFunctionalComponentCtx(__VLS_324, __VLS_326)!
      let __VLS_328!: __VLS_NormalizeEmits<typeof __VLS_327.emit>
      {
        const __VLS_329 = __VLS_intrinsicElements['div']
        const __VLS_330 = __VLS_elementAsFunctionalComponent(__VLS_329)
        const __VLS_331 = __VLS_330(
          { ...{} },
          ...__VLS_functionalComponentArgsRest(__VLS_330)
        )
        ;(
          ({}) as (
            props: __VLS_FunctionalComponentProps<
              typeof __VLS_329,
              typeof __VLS_331
            > &
              Record<string, unknown>
          ) => void
        )({ ...{} })
        const __VLS_332 = __VLS_pickFunctionalComponentCtx(
          __VLS_329,
          __VLS_331
        )!
        let __VLS_333!: __VLS_NormalizeEmits<typeof __VLS_332.emit>
        {
          const __VLS_334 = (
            {} as 'ElForm' extends keyof typeof __VLS_ctx
              ? { ElForm: typeof __VLS_ctx.ElForm }
              : 'elForm' extends keyof typeof __VLS_ctx
              ? { ElForm: typeof __VLS_ctx.elForm }
              : 'el-form' extends keyof typeof __VLS_ctx
              ? { ElForm: (typeof __VLS_ctx)['el-form'] }
              : typeof __VLS_resolvedLocalAndGlobalComponents
          ).ElForm
          const __VLS_335 = __VLS_asFunctionalComponent(
            __VLS_334,
            new __VLS_334({
              ...{},
              ref: 'ruleFormRef',
              model: __VLS_ctx.form,
              labelWidth: '100px'
            })
          )
          ;(({}) as { ElForm: typeof __VLS_334 }).ElForm
          ;(({}) as { ElForm: typeof __VLS_334 }).ElForm
          const __VLS_336 = __VLS_335(
            {
              ...{},
              ref: 'ruleFormRef',
              model: __VLS_ctx.form,
              labelWidth: '100px'
            },
            ...__VLS_functionalComponentArgsRest(__VLS_335)
          )
          ;(
            ({}) as (
              props: __VLS_FunctionalComponentProps<
                typeof __VLS_334,
                typeof __VLS_336
              > &
                Record<string, unknown>
            ) => void
          )({
            ...{},
            ref: 'ruleFormRef',
            model: __VLS_ctx.form,
            labelWidth: '100px'
          })
          const __VLS_337 = __VLS_pickFunctionalComponentCtx(
            __VLS_334,
            __VLS_336
          )!
          let __VLS_338!: __VLS_NormalizeEmits<typeof __VLS_337.emit>
          // @ts-ignore
          __VLS_ctx.ruleFormRef
          {
            const __VLS_339 = (
              {} as 'ElFormItem' extends keyof typeof __VLS_ctx
                ? { ElFormItem: typeof __VLS_ctx.ElFormItem }
                : 'elFormItem' extends keyof typeof __VLS_ctx
                ? { ElFormItem: typeof __VLS_ctx.elFormItem }
                : 'el-form-item' extends keyof typeof __VLS_ctx
                ? { ElFormItem: (typeof __VLS_ctx)['el-form-item'] }
                : typeof __VLS_resolvedLocalAndGlobalComponents
            ).ElFormItem
            const __VLS_340 = __VLS_asFunctionalComponent(
              __VLS_339,
              new __VLS_339({ ...{}, label: '套餐' })
            )
            ;(({}) as { ElFormItem: typeof __VLS_339 }).ElFormItem
            ;(({}) as { ElFormItem: typeof __VLS_339 }).ElFormItem
            const __VLS_341 = __VLS_340(
              { ...{}, label: '套餐' },
              ...__VLS_functionalComponentArgsRest(__VLS_340)
            )
            ;(
              ({}) as (
                props: __VLS_FunctionalComponentProps<
                  typeof __VLS_339,
                  typeof __VLS_341
                > &
                  Record<string, unknown>
              ) => void
            )({ ...{}, label: '套餐' })
            const __VLS_342 = __VLS_pickFunctionalComponentCtx(
              __VLS_339,
              __VLS_341
            )!
            let __VLS_343!: __VLS_NormalizeEmits<typeof __VLS_342.emit>
            {
              const __VLS_344 = (
                {} as 'ElSelect' extends keyof typeof __VLS_ctx
                  ? { ElSelect: typeof __VLS_ctx.ElSelect }
                  : 'elSelect' extends keyof typeof __VLS_ctx
                  ? { ElSelect: typeof __VLS_ctx.elSelect }
                  : 'el-select' extends keyof typeof __VLS_ctx
                  ? { ElSelect: (typeof __VLS_ctx)['el-select'] }
                  : typeof __VLS_resolvedLocalAndGlobalComponents
              ).ElSelect
              const __VLS_345 = __VLS_asFunctionalComponent(
                __VLS_344,
                new __VLS_344({
                  ...{ onChange: {} as any },
                  modelValue: __VLS_ctx.thePackage,
                  placeholder: '请选择套餐'
                })
              )
              ;(({}) as { ElSelect: typeof __VLS_344 }).ElSelect
              ;(({}) as { ElSelect: typeof __VLS_344 }).ElSelect
              const __VLS_346 = __VLS_345(
                {
                  ...{ onChange: {} as any },
                  modelValue: __VLS_ctx.thePackage,
                  placeholder: '请选择套餐'
                },
                ...__VLS_functionalComponentArgsRest(__VLS_345)
              )
              ;(
                ({}) as (
                  props: __VLS_FunctionalComponentProps<
                    typeof __VLS_344,
                    typeof __VLS_346
                  > &
                    Record<string, unknown>
                ) => void
              )({
                ...{ onChange: {} as any },
                modelValue: __VLS_ctx.thePackage,
                placeholder: '请选择套餐'
              })
              const __VLS_347 = __VLS_pickFunctionalComponentCtx(
                __VLS_344,
                __VLS_346
              )!
              let __VLS_348!: __VLS_NormalizeEmits<typeof __VLS_347.emit>
              let __VLS_349 = {
                change: __VLS_pickEvent(
                  __VLS_348['change'],
                  (
                    {} as __VLS_FunctionalComponentProps<
                      typeof __VLS_345,
                      typeof __VLS_346
                    >
                  ).onChange
                )
              }
              __VLS_349 = { change: __VLS_ctx.selectPackage }
              {
                const __VLS_350 = (
                  {} as 'ElOption' extends keyof typeof __VLS_ctx
                    ? { ElOption: typeof __VLS_ctx.ElOption }
                    : 'elOption' extends keyof typeof __VLS_ctx
                    ? { ElOption: typeof __VLS_ctx.elOption }
                    : 'el-option' extends keyof typeof __VLS_ctx
                    ? { ElOption: (typeof __VLS_ctx)['el-option'] }
                    : typeof __VLS_resolvedLocalAndGlobalComponents
                ).ElOption
                const __VLS_351 = __VLS_asFunctionalComponent(
                  __VLS_350,
                  new __VLS_350({ ...{}, label: '自定义', value: 0 })
                )
                ;(({}) as { ElOption: typeof __VLS_350 }).ElOption
                ;(({}) as { ElOption: typeof __VLS_350 }).ElOption
                const __VLS_352 = __VLS_351(
                  { ...{}, label: '自定义', value: 0 },
                  ...__VLS_functionalComponentArgsRest(__VLS_351)
                )
                ;(
                  ({}) as (
                    props: __VLS_FunctionalComponentProps<
                      typeof __VLS_350,
                      typeof __VLS_352
                    > &
                      Record<string, unknown>
                  ) => void
                )({ ...{}, label: '自定义', value: 0 })
                const __VLS_353 = __VLS_pickFunctionalComponentCtx(
                  __VLS_350,
                  __VLS_352
                )!
                let __VLS_354!: __VLS_NormalizeEmits<typeof __VLS_353.emit>
              }
              for (const [item, index] of __VLS_getVForSourceType(
                __VLS_ctx.packages!
              )) {
                {
                  const __VLS_355 = (
                    {} as 'ElOption' extends keyof typeof __VLS_ctx
                      ? { ElOption: typeof __VLS_ctx.ElOption }
                      : 'elOption' extends keyof typeof __VLS_ctx
                      ? { ElOption: typeof __VLS_ctx.elOption }
                      : 'el-option' extends keyof typeof __VLS_ctx
                      ? { ElOption: (typeof __VLS_ctx)['el-option'] }
                      : typeof __VLS_resolvedLocalAndGlobalComponents
                  ).ElOption
                  const __VLS_356 = __VLS_asFunctionalComponent(
                    __VLS_355,
                    new __VLS_355({
                      ...{},
                      key: item.id,
                      label: `套餐${index + 1}(${item.tdays}天，${
                        item.tprice
                      }云豆)`,
                      value: item.id
                    })
                  )
                  ;(({}) as { ElOption: typeof __VLS_355 }).ElOption
                  ;(({}) as { ElOption: typeof __VLS_355 }).ElOption
                  const __VLS_357 = __VLS_356(
                    {
                      ...{},
                      key: item.id,
                      label: `套餐${index + 1}(${item.tdays}天，${
                        item.tprice
                      }云豆)`,
                      value: item.id
                    },
                    ...__VLS_functionalComponentArgsRest(__VLS_356)
                  )
                  ;(
                    ({}) as (
                      props: __VLS_FunctionalComponentProps<
                        typeof __VLS_355,
                        typeof __VLS_357
                      > &
                        Record<string, unknown>
                    ) => void
                  )({
                    ...{},
                    key: item.id,
                    label: `套餐${index + 1}(${item.tdays}天，${
                      item.tprice
                    }云豆)`,
                    value: item.id
                  })
                  const __VLS_358 = __VLS_pickFunctionalComponentCtx(
                    __VLS_355,
                    __VLS_357
                  )!
                  let __VLS_359!: __VLS_NormalizeEmits<typeof __VLS_358.emit>
                }
                // @ts-ignore
                ;[
                  dialogVisible,
                  dialogVisible,
                  dialogVisible,
                  form,
                  form,
                  form,
                  ruleFormRef,
                  thePackage,
                  thePackage,
                  thePackage,
                  selectPackage,
                  packages
                ]
              }
              __VLS_347.slots!.default
            }
            __VLS_342.slots!.default
          }
          {
            const __VLS_360 = (
              {} as 'ElFormItem' extends keyof typeof __VLS_ctx
                ? { ElFormItem: typeof __VLS_ctx.ElFormItem }
                : 'elFormItem' extends keyof typeof __VLS_ctx
                ? { ElFormItem: typeof __VLS_ctx.elFormItem }
                : 'el-form-item' extends keyof typeof __VLS_ctx
                ? { ElFormItem: (typeof __VLS_ctx)['el-form-item'] }
                : typeof __VLS_resolvedLocalAndGlobalComponents
            ).ElFormItem
            const __VLS_361 = __VLS_asFunctionalComponent(
              __VLS_360,
              new __VLS_360({
                ...{},
                label: '天数',
                prop: 'tdays',
                rules: [
                  {
                    required: true,
                    message: '请填写天数',
                    trigger: 'blur'
                  }
                ]
              })
            )
            ;(({}) as { ElFormItem: typeof __VLS_360 }).ElFormItem
            ;(({}) as { ElFormItem: typeof __VLS_360 }).ElFormItem
            const __VLS_362 = __VLS_361(
              {
                ...{},
                label: '天数',
                prop: 'tdays',
                rules: [
                  {
                    required: true,
                    message: '请填写天数',
                    trigger: 'blur'
                  }
                ]
              },
              ...__VLS_functionalComponentArgsRest(__VLS_361)
            )
            ;(
              ({}) as (
                props: __VLS_FunctionalComponentProps<
                  typeof __VLS_360,
                  typeof __VLS_362
                > &
                  Record<string, unknown>
              ) => void
            )({
              ...{},
              label: '天数',
              prop: 'tdays',
              rules: [
                {
                  required: true,
                  message: '请填写天数',
                  trigger: 'blur'
                }
              ]
            })
            const __VLS_363 = __VLS_pickFunctionalComponentCtx(
              __VLS_360,
              __VLS_362
            )!
            let __VLS_364!: __VLS_NormalizeEmits<typeof __VLS_363.emit>
            {
              const __VLS_365 = (
                {} as 'ElInput' extends keyof typeof __VLS_ctx
                  ? { ElInput: typeof __VLS_ctx.ElInput }
                  : 'elInput' extends keyof typeof __VLS_ctx
                  ? { ElInput: typeof __VLS_ctx.elInput }
                  : 'el-input' extends keyof typeof __VLS_ctx
                  ? { ElInput: (typeof __VLS_ctx)['el-input'] }
                  : typeof __VLS_resolvedLocalAndGlobalComponents
              ).ElInput
              const __VLS_366 = __VLS_asFunctionalComponent(
                __VLS_365,
                new __VLS_365({
                  ...{},
                  modelValue: __VLS_ctx.form.tdays,
                  type: 'number',
                  disabled: __VLS_ctx.thePackage !== 0,
                  placeholder: '请输入天数'
                })
              )
              ;(({}) as { ElInput: typeof __VLS_365 }).ElInput
              ;(({}) as { ElInput: typeof __VLS_365 }).ElInput
              const __VLS_367 = __VLS_366(
                {
                  ...{},
                  modelValue: __VLS_ctx.form.tdays,
                  type: 'number',
                  disabled: __VLS_ctx.thePackage !== 0,
                  placeholder: '请输入天数'
                },
                ...__VLS_functionalComponentArgsRest(__VLS_366)
              )
              ;(
                ({}) as (
                  props: __VLS_FunctionalComponentProps<
                    typeof __VLS_365,
                    typeof __VLS_367
                  > &
                    Record<string, unknown>
                ) => void
              )({
                ...{},
                modelValue: __VLS_ctx.form.tdays,
                type: 'number',
                disabled: __VLS_ctx.thePackage !== 0,
                placeholder: '请输入天数'
              })
              const __VLS_368 = __VLS_pickFunctionalComponentCtx(
                __VLS_365,
                __VLS_367
              )!
              let __VLS_369!: __VLS_NormalizeEmits<typeof __VLS_368.emit>
            }
            __VLS_363.slots!.default
          }
          {
            const __VLS_370 = (
              {} as 'ElFormItem' extends keyof typeof __VLS_ctx
                ? { ElFormItem: typeof __VLS_ctx.ElFormItem }
                : 'elFormItem' extends keyof typeof __VLS_ctx
                ? { ElFormItem: typeof __VLS_ctx.elFormItem }
                : 'el-form-item' extends keyof typeof __VLS_ctx
                ? { ElFormItem: (typeof __VLS_ctx)['el-form-item'] }
                : typeof __VLS_resolvedLocalAndGlobalComponents
            ).ElFormItem
            const __VLS_371 = __VLS_asFunctionalComponent(
              __VLS_370,
              new __VLS_370({
                ...{},
                label: '价格',
                prop: 'tprice',
                rules: [
                  {
                    required: true,
                    message: '请填写价格',
                    trigger: 'blur'
                  }
                ]
              })
            )
            ;(({}) as { ElFormItem: typeof __VLS_370 }).ElFormItem
            ;(({}) as { ElFormItem: typeof __VLS_370 }).ElFormItem
            const __VLS_372 = __VLS_371(
              {
                ...{},
                label: '价格',
                prop: 'tprice',
                rules: [
                  {
                    required: true,
                    message: '请填写价格',
                    trigger: 'blur'
                  }
                ]
              },
              ...__VLS_functionalComponentArgsRest(__VLS_371)
            )
            ;(
              ({}) as (
                props: __VLS_FunctionalComponentProps<
                  typeof __VLS_370,
                  typeof __VLS_372
                > &
                  Record<string, unknown>
              ) => void
            )({
              ...{},
              label: '价格',
              prop: 'tprice',
              rules: [
                {
                  required: true,
                  message: '请填写价格',
                  trigger: 'blur'
                }
              ]
            })
            const __VLS_373 = __VLS_pickFunctionalComponentCtx(
              __VLS_370,
              __VLS_372
            )!
            let __VLS_374!: __VLS_NormalizeEmits<typeof __VLS_373.emit>
            {
              const __VLS_375 = (
                {} as 'ElInput' extends keyof typeof __VLS_ctx
                  ? { ElInput: typeof __VLS_ctx.ElInput }
                  : 'elInput' extends keyof typeof __VLS_ctx
                  ? { ElInput: typeof __VLS_ctx.elInput }
                  : 'el-input' extends keyof typeof __VLS_ctx
                  ? { ElInput: (typeof __VLS_ctx)['el-input'] }
                  : typeof __VLS_resolvedLocalAndGlobalComponents
              ).ElInput
              const __VLS_376 = __VLS_asFunctionalComponent(
                __VLS_375,
                new __VLS_375({
                  ...{},
                  modelValue: __VLS_ctx.form.tprice,
                  type: 'number',
                  disabled: __VLS_ctx.thePackage !== 0,
                  placeholder: '请输入价格'
                })
              )
              ;(({}) as { ElInput: typeof __VLS_375 }).ElInput
              ;(({}) as { ElInput: typeof __VLS_375 }).ElInput
              const __VLS_377 = __VLS_376(
                {
                  ...{},
                  modelValue: __VLS_ctx.form.tprice,
                  type: 'number',
                  disabled: __VLS_ctx.thePackage !== 0,
                  placeholder: '请输入价格'
                },
                ...__VLS_functionalComponentArgsRest(__VLS_376)
              )
              ;(
                ({}) as (
                  props: __VLS_FunctionalComponentProps<
                    typeof __VLS_375,
                    typeof __VLS_377
                  > &
                    Record<string, unknown>
                ) => void
              )({
                ...{},
                modelValue: __VLS_ctx.form.tprice,
                type: 'number',
                disabled: __VLS_ctx.thePackage !== 0,
                placeholder: '请输入价格'
              })
              const __VLS_378 = __VLS_pickFunctionalComponentCtx(
                __VLS_375,
                __VLS_377
              )!
              let __VLS_379!: __VLS_NormalizeEmits<typeof __VLS_378.emit>
            }
            __VLS_373.slots!.default
          }
          {
            const __VLS_380 = (
              {} as 'ElFormItem' extends keyof typeof __VLS_ctx
                ? { ElFormItem: typeof __VLS_ctx.ElFormItem }
                : 'elFormItem' extends keyof typeof __VLS_ctx
                ? { ElFormItem: typeof __VLS_ctx.elFormItem }
                : 'el-form-item' extends keyof typeof __VLS_ctx
                ? { ElFormItem: (typeof __VLS_ctx)['el-form-item'] }
                : typeof __VLS_resolvedLocalAndGlobalComponents
            ).ElFormItem
            const __VLS_381 = __VLS_asFunctionalComponent(
              __VLS_380,
              new __VLS_380({ ...{}, label: '折扣券或免费激活码' })
            )
            ;(({}) as { ElFormItem: typeof __VLS_380 }).ElFormItem
            ;(({}) as { ElFormItem: typeof __VLS_380 }).ElFormItem
            const __VLS_382 = __VLS_381(
              { ...{}, label: '折扣券或免费激活码' },
              ...__VLS_functionalComponentArgsRest(__VLS_381)
            )
            ;(
              ({}) as (
                props: __VLS_FunctionalComponentProps<
                  typeof __VLS_380,
                  typeof __VLS_382
                > &
                  Record<string, unknown>
              ) => void
            )({ ...{}, label: '折扣券或免费激活码' })
            const __VLS_383 = __VLS_pickFunctionalComponentCtx(
              __VLS_380,
              __VLS_382
            )!
            let __VLS_384!: __VLS_NormalizeEmits<typeof __VLS_383.emit>
            {
              const __VLS_385 = (
                {} as 'ElInput' extends keyof typeof __VLS_ctx
                  ? { ElInput: typeof __VLS_ctx.ElInput }
                  : 'elInput' extends keyof typeof __VLS_ctx
                  ? { ElInput: typeof __VLS_ctx.elInput }
                  : 'el-input' extends keyof typeof __VLS_ctx
                  ? { ElInput: (typeof __VLS_ctx)['el-input'] }
                  : typeof __VLS_resolvedLocalAndGlobalComponents
              ).ElInput
              const __VLS_386 = __VLS_asFunctionalComponent(
                __VLS_385,
                new __VLS_385({
                  ...{},
                  modelValue: __VLS_ctx.form.code,
                  placeholder: '请输入折扣券或免费激活码'
                })
              )
              ;(({}) as { ElInput: typeof __VLS_385 }).ElInput
              ;(({}) as { ElInput: typeof __VLS_385 }).ElInput
              const __VLS_387 = __VLS_386(
                {
                  ...{},
                  modelValue: __VLS_ctx.form.code,
                  placeholder: '请输入折扣券或免费激活码'
                },
                ...__VLS_functionalComponentArgsRest(__VLS_386)
              )
              ;(
                ({}) as (
                  props: __VLS_FunctionalComponentProps<
                    typeof __VLS_385,
                    typeof __VLS_387
                  > &
                    Record<string, unknown>
                ) => void
              )({
                ...{},
                modelValue: __VLS_ctx.form.code,
                placeholder: '请输入折扣券或免费激活码'
              })
              const __VLS_388 = __VLS_pickFunctionalComponentCtx(
                __VLS_385,
                __VLS_387
              )!
              let __VLS_389!: __VLS_NormalizeEmits<typeof __VLS_388.emit>
            }
            __VLS_383.slots!.default
          }
          __VLS_337.slots!.default
        }
        __VLS_332.slots!.default
      }
      {
        const __VLS_390 = __VLS_intrinsicElements['template']
        const __VLS_391 = __VLS_elementAsFunctionalComponent(__VLS_390)
        const __VLS_392 = __VLS_391(
          { ...{} },
          ...__VLS_functionalComponentArgsRest(__VLS_391)
        )
        ;(
          ({}) as (
            props: __VLS_FunctionalComponentProps<
              typeof __VLS_390,
              typeof __VLS_392
            > &
              Record<string, unknown>
          ) => void
        )({ ...{} })
        {
          __VLS_327.slots!.footer
          {
            const __VLS_393 = __VLS_intrinsicElements['span']
            const __VLS_394 = __VLS_elementAsFunctionalComponent(__VLS_393)
            const __VLS_395 = __VLS_394(
              { ...{}, class: 'dialog-footer' },
              ...__VLS_functionalComponentArgsRest(__VLS_394)
            )
            ;(
              ({}) as (
                props: __VLS_FunctionalComponentProps<
                  typeof __VLS_393,
                  typeof __VLS_395
                > &
                  Record<string, unknown>
              ) => void
            )({ ...{}, class: 'dialog-footer' })
            const __VLS_396 = __VLS_pickFunctionalComponentCtx(
              __VLS_393,
              __VLS_395
            )!
            let __VLS_397!: __VLS_NormalizeEmits<typeof __VLS_396.emit>
            {
              const __VLS_398 = (
                {} as 'ElButton' extends keyof typeof __VLS_ctx
                  ? { ElButton: typeof __VLS_ctx.ElButton }
                  : 'elButton' extends keyof typeof __VLS_ctx
                  ? { ElButton: typeof __VLS_ctx.elButton }
                  : 'el-button' extends keyof typeof __VLS_ctx
                  ? { ElButton: (typeof __VLS_ctx)['el-button'] }
                  : typeof __VLS_resolvedLocalAndGlobalComponents
              ).ElButton
              const __VLS_399 = __VLS_asFunctionalComponent(
                __VLS_398,
                new __VLS_398({ ...{ onClick: {} as any } })
              )
              ;(({}) as { ElButton: typeof __VLS_398 }).ElButton
              ;(({}) as { ElButton: typeof __VLS_398 }).ElButton
              const __VLS_400 = __VLS_399(
                { ...{ onClick: {} as any } },
                ...__VLS_functionalComponentArgsRest(__VLS_399)
              )
              ;(
                ({}) as (
                  props: __VLS_FunctionalComponentProps<
                    typeof __VLS_398,
                    typeof __VLS_400
                  > &
                    Record<string, unknown>
                ) => void
              )({ ...{ onClick: {} as any } })
              const __VLS_401 = __VLS_pickFunctionalComponentCtx(
                __VLS_398,
                __VLS_400
              )!
              let __VLS_402!: __VLS_NormalizeEmits<typeof __VLS_401.emit>
              let __VLS_403 = {
                click: __VLS_pickEvent(
                  __VLS_402['click'],
                  (
                    {} as __VLS_FunctionalComponentProps<
                      typeof __VLS_399,
                      typeof __VLS_400
                    >
                  ).onClick
                )
              }
              __VLS_403 = {
                click: ($event) => {
                  __VLS_ctx.dialogVisible = false
                  // @ts-ignore
                  ;[
                    form,
                    thePackage,
                    form,
                    thePackage,
                    form,
                    thePackage,
                    form,
                    thePackage,
                    form,
                    thePackage,
                    form,
                    thePackage,
                    form,
                    form,
                    form,
                    dialogVisible
                  ]
                }
              }
              __VLS_ctx.$t('button.cancel')
              __VLS_401.slots!.default
            }
            {
              const __VLS_404 = (
                {} as 'ElButton' extends keyof typeof __VLS_ctx
                  ? { ElButton: typeof __VLS_ctx.ElButton }
                  : 'elButton' extends keyof typeof __VLS_ctx
                  ? { ElButton: typeof __VLS_ctx.elButton }
                  : 'el-button' extends keyof typeof __VLS_ctx
                  ? { ElButton: (typeof __VLS_ctx)['el-button'] }
                  : typeof __VLS_resolvedLocalAndGlobalComponents
              ).ElButton
              const __VLS_405 = __VLS_asFunctionalComponent(
                __VLS_404,
                new __VLS_404({ ...{ onClick: {} as any }, type: 'primary' })
              )
              ;(({}) as { ElButton: typeof __VLS_404 }).ElButton
              ;(({}) as { ElButton: typeof __VLS_404 }).ElButton
              const __VLS_406 = __VLS_405(
                { ...{ onClick: {} as any }, type: 'primary' },
                ...__VLS_functionalComponentArgsRest(__VLS_405)
              )
              ;(
                ({}) as (
                  props: __VLS_FunctionalComponentProps<
                    typeof __VLS_404,
                    typeof __VLS_406
                  > &
                    Record<string, unknown>
                ) => void
              )({ ...{ onClick: {} as any }, type: 'primary' })
              const __VLS_407 = __VLS_pickFunctionalComponentCtx(
                __VLS_404,
                __VLS_406
              )!
              let __VLS_408!: __VLS_NormalizeEmits<typeof __VLS_407.emit>
              let __VLS_409 = {
                click: __VLS_pickEvent(
                  __VLS_408['click'],
                  (
                    {} as __VLS_FunctionalComponentProps<
                      typeof __VLS_405,
                      typeof __VLS_406
                    >
                  ).onClick
                )
              }
              __VLS_409 = { click: __VLS_ctx.confirmOrder }
              __VLS_ctx.$t('button.confirmOrder')
              __VLS_407.slots!.default
            }
            __VLS_396.slots!.default
          }
          // @ts-ignore
          ;[$t, confirmOrder, $t]
        }
      }
    }
    {
      const __VLS_410 = (
        {} as 'ElDialog' extends keyof typeof __VLS_ctx
          ? { ElDialog: typeof __VLS_ctx.ElDialog }
          : 'elDialog' extends keyof typeof __VLS_ctx
          ? { ElDialog: typeof __VLS_ctx.elDialog }
          : 'el-dialog' extends keyof typeof __VLS_ctx
          ? { ElDialog: (typeof __VLS_ctx)['el-dialog'] }
          : typeof __VLS_resolvedLocalAndGlobalComponents
      ).ElDialog
      const __VLS_411 = __VLS_asFunctionalComponent(
        __VLS_410,
        new __VLS_410({
          ...{},
          modelValue: __VLS_ctx.secondVisible,
          title: __VLS_ctx.$t('button.confirmOrder'),
          width: '30%'
        })
      )
      ;(({}) as { ElDialog: typeof __VLS_410 }).ElDialog
      ;(({}) as { ElDialog: typeof __VLS_410 }).ElDialog
      const __VLS_412 = __VLS_411(
        {
          ...{},
          modelValue: __VLS_ctx.secondVisible,
          title: __VLS_ctx.$t('button.confirmOrder'),
          width: '30%'
        },
        ...__VLS_functionalComponentArgsRest(__VLS_411)
      )
      ;(
        ({}) as (
          props: __VLS_FunctionalComponentProps<
            typeof __VLS_410,
            typeof __VLS_412
          > &
            Record<string, unknown>
        ) => void
      )({
        ...{},
        modelValue: __VLS_ctx.secondVisible,
        title: __VLS_ctx.$t('button.confirmOrder'),
        width: '30%'
      })
      const __VLS_413 = __VLS_pickFunctionalComponentCtx(__VLS_410, __VLS_412)!
      let __VLS_414!: __VLS_NormalizeEmits<typeof __VLS_413.emit>
      {
        const __VLS_415 = __VLS_intrinsicElements['div']
        const __VLS_416 = __VLS_elementAsFunctionalComponent(__VLS_415)
        const __VLS_417 = __VLS_416(
          { ...{} },
          ...__VLS_functionalComponentArgsRest(__VLS_416)
        )
        ;(
          ({}) as (
            props: __VLS_FunctionalComponentProps<
              typeof __VLS_415,
              typeof __VLS_417
            > &
              Record<string, unknown>
          ) => void
        )({ ...{} })
        const __VLS_418 = __VLS_pickFunctionalComponentCtx(
          __VLS_415,
          __VLS_417
        )!
        let __VLS_419!: __VLS_NormalizeEmits<typeof __VLS_418.emit>
        {
          const __VLS_420 = __VLS_intrinsicElements['span']
          const __VLS_421 = __VLS_elementAsFunctionalComponent(__VLS_420)
          const __VLS_422 = __VLS_421(
            { ...{} },
            ...__VLS_functionalComponentArgsRest(__VLS_421)
          )
          ;(
            ({}) as (
              props: __VLS_FunctionalComponentProps<
                typeof __VLS_420,
                typeof __VLS_422
              > &
                Record<string, unknown>
            ) => void
          )({ ...{} })
          const __VLS_423 = __VLS_pickFunctionalComponentCtx(
            __VLS_420,
            __VLS_422
          )!
          let __VLS_424!: __VLS_NormalizeEmits<typeof __VLS_423.emit>
          __VLS_423.slots!.default
        }
        {
          const __VLS_425 = __VLS_intrinsicElements['span']
          const __VLS_426 = __VLS_elementAsFunctionalComponent(__VLS_425)
          const __VLS_427 = __VLS_426(
            { ...{} },
            ...__VLS_functionalComponentArgsRest(__VLS_426)
          )
          ;(
            ({}) as (
              props: __VLS_FunctionalComponentProps<
                typeof __VLS_425,
                typeof __VLS_427
              > &
                Record<string, unknown>
            ) => void
          )({ ...{} })
          const __VLS_428 = __VLS_pickFunctionalComponentCtx(
            __VLS_425,
            __VLS_427
          )!
          let __VLS_429!: __VLS_NormalizeEmits<typeof __VLS_428.emit>
          __VLS_ctx.jisuanData?.days
          __VLS_428.slots!.default
        }
        __VLS_418.slots!.default
      }
      {
        const __VLS_430 = __VLS_intrinsicElements['div']
        const __VLS_431 = __VLS_elementAsFunctionalComponent(__VLS_430)
        const __VLS_432 = __VLS_431(
          { ...{} },
          ...__VLS_functionalComponentArgsRest(__VLS_431)
        )
        ;(
          ({}) as (
            props: __VLS_FunctionalComponentProps<
              typeof __VLS_430,
              typeof __VLS_432
            > &
              Record<string, unknown>
          ) => void
        )({ ...{} })
        const __VLS_433 = __VLS_pickFunctionalComponentCtx(
          __VLS_430,
          __VLS_432
        )!
        let __VLS_434!: __VLS_NormalizeEmits<typeof __VLS_433.emit>
        {
          const __VLS_435 = __VLS_intrinsicElements['span']
          const __VLS_436 = __VLS_elementAsFunctionalComponent(__VLS_435)
          const __VLS_437 = __VLS_436(
            { ...{} },
            ...__VLS_functionalComponentArgsRest(__VLS_436)
          )
          ;(
            ({}) as (
              props: __VLS_FunctionalComponentProps<
                typeof __VLS_435,
                typeof __VLS_437
              > &
                Record<string, unknown>
            ) => void
          )({ ...{} })
          const __VLS_438 = __VLS_pickFunctionalComponentCtx(
            __VLS_435,
            __VLS_437
          )!
          let __VLS_439!: __VLS_NormalizeEmits<typeof __VLS_438.emit>
          __VLS_438.slots!.default
        }
        {
          const __VLS_440 = __VLS_intrinsicElements['span']
          const __VLS_441 = __VLS_elementAsFunctionalComponent(__VLS_440)
          const __VLS_442 = __VLS_441(
            { ...{} },
            ...__VLS_functionalComponentArgsRest(__VLS_441)
          )
          ;(
            ({}) as (
              props: __VLS_FunctionalComponentProps<
                typeof __VLS_440,
                typeof __VLS_442
              > &
                Record<string, unknown>
            ) => void
          )({ ...{} })
          const __VLS_443 = __VLS_pickFunctionalComponentCtx(
            __VLS_440,
            __VLS_442
          )!
          let __VLS_444!: __VLS_NormalizeEmits<typeof __VLS_443.emit>
          __VLS_ctx.jisuanData?.price
          __VLS_443.slots!.default
        }
        __VLS_433.slots!.default
      }
      {
        const __VLS_445 = __VLS_intrinsicElements['template']
        const __VLS_446 = __VLS_elementAsFunctionalComponent(__VLS_445)
        const __VLS_447 = __VLS_446(
          { ...{} },
          ...__VLS_functionalComponentArgsRest(__VLS_446)
        )
        ;(
          ({}) as (
            props: __VLS_FunctionalComponentProps<
              typeof __VLS_445,
              typeof __VLS_447
            > &
              Record<string, unknown>
          ) => void
        )({ ...{} })
        {
          __VLS_413.slots!.footer
          {
            const __VLS_448 = __VLS_intrinsicElements['span']
            const __VLS_449 = __VLS_elementAsFunctionalComponent(__VLS_448)
            const __VLS_450 = __VLS_449(
              { ...{}, class: 'dialog-footer' },
              ...__VLS_functionalComponentArgsRest(__VLS_449)
            )
            ;(
              ({}) as (
                props: __VLS_FunctionalComponentProps<
                  typeof __VLS_448,
                  typeof __VLS_450
                > &
                  Record<string, unknown>
              ) => void
            )({ ...{}, class: 'dialog-footer' })
            const __VLS_451 = __VLS_pickFunctionalComponentCtx(
              __VLS_448,
              __VLS_450
            )!
            let __VLS_452!: __VLS_NormalizeEmits<typeof __VLS_451.emit>
            {
              const __VLS_453 = (
                {} as 'ElButton' extends keyof typeof __VLS_ctx
                  ? { ElButton: typeof __VLS_ctx.ElButton }
                  : 'elButton' extends keyof typeof __VLS_ctx
                  ? { ElButton: typeof __VLS_ctx.elButton }
                  : 'el-button' extends keyof typeof __VLS_ctx
                  ? { ElButton: (typeof __VLS_ctx)['el-button'] }
                  : typeof __VLS_resolvedLocalAndGlobalComponents
              ).ElButton
              const __VLS_454 = __VLS_asFunctionalComponent(
                __VLS_453,
                new __VLS_453({ ...{ onClick: {} as any } })
              )
              ;(({}) as { ElButton: typeof __VLS_453 }).ElButton
              ;(({}) as { ElButton: typeof __VLS_453 }).ElButton
              const __VLS_455 = __VLS_454(
                { ...{ onClick: {} as any } },
                ...__VLS_functionalComponentArgsRest(__VLS_454)
              )
              ;(
                ({}) as (
                  props: __VLS_FunctionalComponentProps<
                    typeof __VLS_453,
                    typeof __VLS_455
                  > &
                    Record<string, unknown>
                ) => void
              )({ ...{ onClick: {} as any } })
              const __VLS_456 = __VLS_pickFunctionalComponentCtx(
                __VLS_453,
                __VLS_455
              )!
              let __VLS_457!: __VLS_NormalizeEmits<typeof __VLS_456.emit>
              let __VLS_458 = {
                click: __VLS_pickEvent(
                  __VLS_457['click'],
                  (
                    {} as __VLS_FunctionalComponentProps<
                      typeof __VLS_454,
                      typeof __VLS_455
                    >
                  ).onClick
                )
              }
              __VLS_458 = {
                click: ($event) => {
                  __VLS_ctx.secondVisible = false
                  // @ts-ignore
                  ;[
                    secondVisible,
                    $t,
                    secondVisible,
                    $t,
                    secondVisible,
                    $t,
                    jisuanData,
                    jisuanData,
                    secondVisible
                  ]
                }
              }
              __VLS_ctx.$t('button.cancel')
              __VLS_456.slots!.default
            }
            {
              const __VLS_459 = (
                {} as 'ElButton' extends keyof typeof __VLS_ctx
                  ? { ElButton: typeof __VLS_ctx.ElButton }
                  : 'elButton' extends keyof typeof __VLS_ctx
                  ? { ElButton: typeof __VLS_ctx.elButton }
                  : 'el-button' extends keyof typeof __VLS_ctx
                  ? { ElButton: (typeof __VLS_ctx)['el-button'] }
                  : typeof __VLS_resolvedLocalAndGlobalComponents
              ).ElButton
              const __VLS_460 = __VLS_asFunctionalComponent(
                __VLS_459,
                new __VLS_459({ ...{ onClick: {} as any }, type: 'primary' })
              )
              ;(({}) as { ElButton: typeof __VLS_459 }).ElButton
              ;(({}) as { ElButton: typeof __VLS_459 }).ElButton
              const __VLS_461 = __VLS_460(
                { ...{ onClick: {} as any }, type: 'primary' },
                ...__VLS_functionalComponentArgsRest(__VLS_460)
              )
              ;(
                ({}) as (
                  props: __VLS_FunctionalComponentProps<
                    typeof __VLS_459,
                    typeof __VLS_461
                  > &
                    Record<string, unknown>
                ) => void
              )({ ...{ onClick: {} as any }, type: 'primary' })
              const __VLS_462 = __VLS_pickFunctionalComponentCtx(
                __VLS_459,
                __VLS_461
              )!
              let __VLS_463!: __VLS_NormalizeEmits<typeof __VLS_462.emit>
              let __VLS_464 = {
                click: __VLS_pickEvent(
                  __VLS_463['click'],
                  (
                    {} as __VLS_FunctionalComponentProps<
                      typeof __VLS_460,
                      typeof __VLS_461
                    >
                  ).onClick
                )
              }
              __VLS_464 = { click: __VLS_ctx.confirm }
              __VLS_462.slots!.default
            }
            __VLS_451.slots!.default
          }
          // @ts-ignore
          ;[$t, confirm]
        }
      }
    }
    if (
      typeof __VLS_styleScopedClasses === 'object' &&
      !Array.isArray(__VLS_styleScopedClasses)
    ) {
      __VLS_styleScopedClasses['pagination']
      __VLS_styleScopedClasses['dialog-footer']
      __VLS_styleScopedClasses['dialog-footer']
    }
    var __VLS_slots!: {}
    return __VLS_slots
  }
  const __VLS_internalComponent = (await import('vue')).defineComponent({
    setup() {
      return {
        HModel: HModel as typeof HModel,
        getLanguageTitle: getLanguageTitle as typeof getLanguageTitle,
        getCategoriesTitle: getCategoriesTitle as typeof getCategoriesTitle,
        getPlatformsTitle: getPlatformsTitle as typeof getPlatformsTitle,
        queryForm: queryForm as typeof queryForm,
        tableData: tableData as typeof tableData,
        dialogVisible: dialogVisible as typeof dialogVisible,
        secondVisible: secondVisible as typeof secondVisible,
        ruleFormRef: ruleFormRef as typeof ruleFormRef,
        thePackage: thePackage as typeof thePackage,
        packages: packages as typeof packages,
        selectPackage: selectPackage as typeof selectPackage,
        confirmOrder: confirmOrder as typeof confirmOrder,
        loading: loading as typeof loading,
        currentPage: currentPage as typeof currentPage,
        pageSize: pageSize as typeof pageSize,
        totalItems: totalItems as typeof totalItems,
        handleSizeChange: handleSizeChange as typeof handleSizeChange,
        handleCurrentChange: handleCurrentChange as typeof handleCurrentChange,
        form: form as typeof form,
        onBuyGame: onBuyGame as typeof onBuyGame,
        confirm: confirm as typeof confirm,
        goFeedback: goFeedback as typeof goFeedback,
        jisuanData: jisuanData as typeof jisuanData,
        query: query as typeof query,
        onClear: onClear as typeof onClear,
        formatTime: formatTime as typeof formatTime
      }
    },

    name: 'Game'
  })
  return (await import('vue')).defineComponent({
    setup() {
      return {}
    },

    name: 'Game'
  })
})()
