<template>
  <div>
    <el-form ref="ruleFormRef" :model="form" inline :rules="rules">
      <el-form-item :label="$t('form.card')" prop="miyao">
        <el-input
          v-model="form.miyao"
          :placeholder="$t('placeholder.card')"
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
  name: 'Card'
}
</script>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { rechargeCard } from '../../api/wallet'
const ruleFormRef = ref<FormInstance>()
const rules = reactive({
  miyao: [{ required: true, message: '请填写充值卡', blur }]
})
const form = ref<any>({ miyao: '' })
// 确定
function submit() {
  ruleFormRef.value?.validate(async (valid) => {
    if (valid) {
      // 表单验证通过
      const res: any = await rechargeCard({
        miyao: form.value.miyao
      })
      if (res.code === 200) {
        return ElMessage.success('充值成功')
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
