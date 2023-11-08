<template>
  <div style="width: 500px">
    <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="140px">
      <el-form-item :label="$t('form.transfer')" prop="toid">
        <el-input
          v-model="form.toid"
          :placeholder="$t('placeholder.transfer')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('form.yundou')" prop="tprice">
        <el-input
          v-model="form.tprice"
          :placeholder="$t('placeholder.price')"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">{{
          $t('button.confirm')
        }}</el-button>
        <el-button @click="cancel">{{ $t('button.cancel') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, FormInstance } from 'element-plus'
import { transferAccounts } from '../../api/wallet'
import { reactive, ref } from 'vue'
const ruleFormRef = ref<FormInstance>()
const rules = reactive({
  toid: [{ required: true, message: '请填写转账ID', blur }],
  tprice: [{ required: true, message: '请填写云豆数量', blur }]
})
const form = ref<any>({
  toid: '',
  tprice: ''
})
function submit() {
  ruleFormRef.value?.validate(async (valid) => {
    if (valid) {
      const res: any = await transferAccounts({
        toid: form.value.toid,
        tprice: form.value.tprice
      })
      if (res.code === 200) {
        return ElMessage.success(res.data)
      }
      ElMessage.error(res.data)
    } else {
      // 表单验证未通过
    }
  })
}
function cancel() {
  ruleFormRef.value?.resetFields()
}
</script>

<style lang="less" scoped></style>
