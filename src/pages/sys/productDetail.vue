<template>
  <div class="product_details">
    <el-button typt="text" size="samll" @click="backHandler">返回</el-button>
    <p><strong>产品名称：</strong>{{ product.name }}</p>
    <p><strong>产品单价：</strong>{{ product.price }}</p>
    <p><strong>产品介绍：</strong>{{ product.details }}</p>
    <p><strong>产品主图：</strong>
      <img :src="product.photo" alt="">
    </p>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapState('product', ['product'])
  },
  created() {
    const id = this.$route.query.id.id
    this.findProductById(id)
  },
  methods: {
    ...mapActions('product', ['findProductById']),
    backHandler() {
      this.$router.go(-1)
    }
  }
}
</script>
