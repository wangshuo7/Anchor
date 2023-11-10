### 项目名称

互游云平台 Anchor（主播端）

### 安装依赖

npm install

### 启动项目

npm run dev

### 构建项目

npm run build

### 技术栈

-Vue3
-TS
-pinia
-axios
-less
-moment
-Vue-i18n
-Vue-router
-Element plus

### src文件目录

src/
|-api/
|————(...).ts               (各目录接口文件)
|-assets/                   (项目静态文件夹)
|-components                (全局公共组件)
|————HModel                 (全局公共组件名)
|——————index.vue
|-router/                   (项目路由)
|————index.vue
|-store/                    (pinia)
|————languageStore.ts
|-type/                     (TS类型)
|————login.ts
|-utils/                    (工具)
|————i18n.ts
|-views/                    (用户界面) 
|————Login

## views文件目录
views/
|-Login/                    (总模块目录)
|————index.vue              (页面入口文件)
|————component/
|————————(...).vue          (公共组件)

### 代码风格

## 单文件组件命名 (大驼峰)

components/
|- MyComponent.vue

## 基础组件名称(全部以H为开头)
components/
|-HModel.vue
|-HBreadcrumbs.vue

## v-bind v-on v-slot 应尽量使用语法糖

<input
:value="newTodoText"
:placeholder="newTodoInstructions"
/>
<input
@input="onInput"
@focus="onFocus"
/>

<template #header>
  <h1>Here might be a page title</h1>
</template>
<template #footer>
  <p>Here's some contact info</p>
</template>
