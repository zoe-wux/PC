<template>
  <div class="order_details">
    <el-button typt="text" size="samll" @click="backHandler">返回</el-button>
    <el-table :data="allOrders">
      <el-table-column label="产品名称">
        <template #default="record">
          <p>{{ productIdFilter(record.row.productId)[0].name }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="number" label="数量" />
      <el-table-column prop="price" label="价格" />
      <el-table-column label="图片" width="250px" align="center">
        <template #default="record">
          <img src="productIdFilter(record.row.productId)[0].photo">
        </template>
      </el-table-column>
      <el-table-column label="栏目属性" width="250px" align="center">
        <template #default="record">
          <p>{{ productIdFilter(record.row.productId)[0].categoryId }}</p>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState('order', ['allOrders']),
    ...mapState('product', ['product']),
    ...mapGetters('product', ['productIdFilter'])

  },
  created() {
    const id = this.$route.query.order_id
    this.findOrderById(id)
    this.findAllproducts()
  },
  methods: {
    ...mapActions('order', ['findOrderById']),
    ...mapActions('product', ['findProductById', 'findAllproducts']),
    backHandler() {
      this.$router.go(-1)
    }
  }
}
</script>
<style scoped>

</style>

