<template>
  <div>
    <el-row>
      <el-col><h2>订单详情</h2> </el-col>
      <el-col :offset="20"><el-button type="text" @click="backHandler">返回</el-button></el-col>
    </el-row>
    <div>栏目名称：{{ category.name }}</div>
    <div>栏目数量：{{ category.num }}</div>
    <div>父级栏目：{{ category.parentId }}</div>
    <div>栏目主图：<img :src="category.icon"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      category: []
    }
  },
  created() {
    this.category = this.$route.query.category
  },
  methods: {
    backHandler() {
      this.$router.go(-1)
    }
  }
}
</script>
