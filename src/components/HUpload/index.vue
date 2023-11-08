<template>
  <div>
    <!-- 图片上传组件 -->
    <el-upload
      ref="uploadRef"
      class="avatar-uploader"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :action="upAction"
      :data="upData"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <!-- 如果有图片URL，则显示已上传的图片 -->
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      <!-- 否则，显示上传图标 -->
    </el-upload>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue' // 导入Vue 3的ref函数，用于创建响应式变量
import { ElMessage } from 'element-plus' // 导入Element Plus的消息提示组件
import { Plus } from '@element-plus/icons-vue'
const upAction = ref()
const upData = ref()

const ossConfig = {
  endpoint: 'your_oss_endpoint', // 配置OSS的Endpoint
  bucket: 'your_oss_bucket', // 配置OSS的Bucket名称
  accessKeyId: 'your_access_key_id', // 配置OSS的Access Key ID
  accessKeySecret: 'your_access_key_secret' // 配置OSS的Access Key Secret
}

const imageUrl = ref('') // 创建一个响应式变量，用于保存图片URL

const handleAvatarSuccess = (response: any, file: any) => {
  // 上传成功后的回调函数
  imageUrl.value = response.url // 将上传成功后的图片URL保存到imageUrl变量
  console.log(file)
}

const beforeAvatarUpload = (file: any) => {
  // 上传前的回调函数
  if (file.type !== 'image/jpeg') {
    // 检查文件类型，必须是JPG格式
    ElMessage.error('Avatar picture must be JPG format!') // 显示错误消息
    return false // 阻止上传
  } else if (file.size / 1024 / 1024 > 2) {
    // 检查文件大小，不得超过2MB
    ElMessage.error('Avatar picture size can not exceed 2MB!') // 显示错误消息
    return false // 阻止上传
  }
  const formData = new FormData() // 创建FormData对象，用于上传参数
  formData.append('key', generateObjectKey(file.name)) // 设置OSS对象键
  formData.append('policy', generatePolicy()) // 生成并设置OSS的policy
  formData.append('signature', generateSignature(formData.get('policy'))) // 生成并设置OSS的signature

  const action = `https://${ossConfig.bucket}.${ossConfig.endpoint}` // 设置OSS的上传地址

  upAction.value = action // 设置el-upload组件的上传地址
  upData.value = formData // 设置el-upload组件的上传数据

  return true // 允许上传
}

const generateObjectKey = (fileName: any) => {
  // 生成OSS对象键的函数
  return `${Date.now()}-${fileName}` // 使用时间戳和文件名生成对象键
}

const generatePolicy = () => {
  // Generate your OSS policy
  // 生成OSS的policy，根据你的OSS配置生成
  const policy = 'your_generated_policy_here'
  return policy
}

const generateSignature = (policy: any) => {
  // Generate your OSS signature
  // 生成OSS的signature，根据你的OSS配置生成
  // 生成并返回OSS的signature，确保返回字符串
  console.log(policy)
  const signature = 'your_generated_signature_here'
  return signature
}
</script>

<style lang="less" scoped>
.avatar-uploader .avatar {
  width: 78px;
  height: 78px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  width: 78px;
  height: 78px;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
