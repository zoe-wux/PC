<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="基本信息" name="base_message">基本信息</el-tab-pane>
    <el-tab-pane label="订单信息" name="order_messager">订单信息</el-tab-pane>
  </el-tabs>
</template>
<script>
export default {
  data() {
    return {
      activeName: 'base_message'
    }
  }
}
</script>
