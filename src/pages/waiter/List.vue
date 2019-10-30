<template>
  <div class="waiter">
    <h2>员工管理</h2>
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
    <el-table :data="waiters" @selection-change="idsChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column type="id" label="编号" />
      <el-table-column prop="realname" label="姓名" />
      <el-table-column prop="telephone" label="手机号" />
      <el-table-column prop="idCard" label="身份证号" />
      <el-table-column prop="bankCard" label="银行卡号" />
      <el-table-column prop="registerTime" label="注册时间" />
      <el-table-column prop="status" label="状态" />
      <el-table-column label="操作" width="100px" align="center">
        <template #default="record">
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
      }
    }
  },
  created() {
    // this.findAllwaiters();
    this.query(this.search)
  },
  computed: {
    ...mapState('waiter', ['waiters', 'visible', 'title', 'queryResult', 'formLabelWidth']),
    ...mapGetters('waiter', ['countwaiters', 'waiterstatusFilter'])
    // 普通属性

  },
  methods: {
    ...mapActions('waiter', ['findAllwaiters', 'deletewaiterById', 'saveOrUpdatewaiter', 'batchDeletewaiters', 'query']),
    ...mapMutations('waiter', ['showModal', 'closeModal', 'setTitle']),
    // 映射查找该顾客的所有地址方法
    ...mapActions('address', ['findAddressBywaiterId']),
    // 普通方法
    toDetails(waiter) {
      // 跳转到员工详情页面
      this.$router.push({
        path: '/waiter/waiterDetail',
        query: { id: waiter.id }
        // params:{id:1}
      })
    },
    idsChangeHandler(val) {
      this.ids = val.map(item => item.id)
    },
    toAddHandler() {
      this.form = {}
      this.setTitle('添加顾客信息')
      this.showModal()
    },
    submitHandler() {
      // 1.表单验证
      this.$refs.waiterForm.validate((valid) => {
        if (valid) {
          // 2.提交表单
          this.saveOrUpdatewaiter(this.form)
            .then((response) => {
              this.$message({ type: 'success', message: response.statusText })
              this.query(this.search)
            })
        } else {
          return false
        }
      })
    },
    // 单个删除
    async deleteHandler(id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
      })
        .then(() => {
          this.deletewaiterById(id)
            .then((response) => {
              this.$message({
                type: 'success',
                message: response.statusText
              })
              this.query(this.search)
            })
        })
    },
    editHandler(row) {
      this.form = row
      this.setTitle('修改顾客信息')
      this.showModal()
    },
    // 监控模态框关闭
    // dialogCloseHandler() {
    //   this.closeModal()
    //   this.$refs.waiterForm.resetFields()
    //   this.form = {}
    // },
    // 批量删除
    batchHandler() {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
      })
        .then(() => {
          this.batchDeletewaiters(this.ids)
            .then((response) => {
              this.$message({
                type: 'success',
                message: response.statusText
              })
              this.query(this.search)
            })
        })
    },
    // 查询
    searchHandler() {
      if (/^[0-9]*[1-9][0-9]*$/.test(this.keyWord)) {
        console.log('数字')
        this.search.telephone = this.keyWord
      } else if (/[\u4E00-\u9FA5]+/.test(this.keyWord)) {
        console.log('字符')
        this.search.realname = this.keyWord
      } else {
        this.search.realname = ''
        this.search.telephone = ''
      }
      // this.search.realname=this.keyWord;

      this.query(this.search)
    },
		 // 翻页
    pageChangeHandler(currentPage) {
      this.search.page = currentPage - 1
      this.query(this.search)
    }
  }
}
</script>
<style scoped>

</style>
