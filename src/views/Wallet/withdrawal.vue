<template>
  <div>
    <el-form ref="ruleFormRef" :model="form" :rules="rules" inline>
      <el-form-item :label="$t('form.withdrawal')" prop="tx_dou">
        <el-input
          controls-position="right"
          v-model="form.tx_dou"
          :placeholder="$t('placeholder.withdrawal')"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="submit" type="primary">{{
          $t('button.confirm')
        }}</el-button>
        <el-button @click="cancel">{{ $t('button.cancel') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Withdrawal'
}
</script>
<script lang="ts" setup>
import { ElMessage, FormInstance } from 'element-plus'
import { withdrawalApply } from '../../api/wallet'
import { reactive, ref } from 'vue'
const ruleFormRef = ref<FormInstance>()
const form = ref<any>({ tx_dou: undefined })

// 添加自定义校验规则 >=500
const validateMinValue = (_rule: any, value: any, callback: any) => {
  if (value >= 500) {
    callback() // 校验通过
  } else {
    callback(new Error('提取金额必须至少500云豆')) // 校验不通过
  }
}
const rules = reactive({
  tx_dou: [
    { required: true, message: '请填写提现云豆', blur },
    { validator: validateMinValue, blur }
  ] // 使用自定义校验规则
})
// 确定
function submit() {
  ruleFormRef.value?.validate(async (valid) => {
    if (valid) {
      // 表单验证通过
      const res: any = await withdrawalApply({
        tx_dou: form.value.tx_dou
      })
      if (res.code === 200) {
        return ElMessage.success('提现成功')
      }
      ElMessage.error(res.msg)
    } else {
      // 表单验证未通过
    }
  })
}
// 取消
function cancel() {
  ruleFormRef.value?.resetFields()
}
</script>

<style lang="less" scoped></style>
