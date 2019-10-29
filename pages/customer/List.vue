<template>
  <div class="customer">
    <h2>顾客管理</h2>
    <!-- 按钮 -->
    <div class="btns">
      <!-- 左侧搜索 -->
      <el-col :span="16">
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="keyWord" placeholder="请输入关键字" clearable />
          </el-form-item>
          <el-form-item>
            <el-button size="small" @click="searchHandler">搜索</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!-- /左侧搜索 -->

    </div>
    <!-- 展示数据表格 -->
    <el-table :data="customers" @selection-change="idsChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="realname" label="姓名" />
      <el-table-column prop="telephone" label="手机号" />
      <el-table-column prop="password" label="密码" />
      <el-table-column prop="status" label="状态" />
      <el-table-column label="操作" width="100px" align="center">
        <template #default="record">
          <a href="" class="el-icon-edit-outline" @click.prevent="editHandler(record.row)" /> &nbsp;
          <a href="" @click.prevent="toDetails(record.row)">详情</a>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { isNumber } from 'util'
export default {
  data() {
    return {
      ids: [],
      form: {},
      keyWord: '', // 关键字查询
      search: {
        page: 0,
        pageSize: 8, // 每页显示几条数据
        realname: '', // 实现查询的条件之一
        telephone: '',
        status: ''
      },
      rules: {
        realname: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 9, message: '长度在 6 到 9 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.findAllCustomers()
    // this.query(this.search)
  },
  computed: {
    ...mapState('customer', ['customers', 'visible', 'title', 'queryResult', 'formLabelWidth']),
    ...mapGetters('customer', ['countCustomers', 'customerStatusFilter'])
    // 普通属性

  },
  methods: {
    ...mapActions('customer', ['findAllCustomers', 'deleteCustomerById', 'saveOrUpdateCustomer', 'batchDeleteCustomers', 'query']),
    ...mapMutations('customer', ['showModal', 'closeModal', 'setTitle']),
    // 映射查找该顾客的所有地址方法
    ...mapActions('address', ['findAddressByCustomerId']),
    // 普通方法
    toDetails(customer) {
      // 跳转到顾客详情页面
      this.$router.push({
        path: '/customer/customerDetail',
        query: { customer }
      })
    }

  }
}
</script>
<style scoped>

</style>
