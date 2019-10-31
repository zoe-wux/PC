<template>
  <div class="product">
    <h2>产品管理</h2>
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
      <!-- 右侧按钮 -->
      <el-col :span="8" style="text-align:right">
        <el-button type="primary" icon="el-icon-edit" size="small" @click="toAddHandler">添加</el-button>
        <el-button type="danger" icon="el-icon-delete" size="small" @click="batchHandler">批量删除</el-button>
      </el-col>
      <!-- /右侧按钮 -->
    </div>
    <!-- 展示数据表格 -->
    <el-table :data="products" style="width: 100%;" @selection-change="idsChangeHandler">
      <el-table-column v-model="ids" type="selection" width="55" />
      <el-table-column prop="id" label="编号" />
      <el-table-column prop="name" label="产品名称" />
      <el-table-column prop="price" label="价格" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="categoryId" label="所属产品" />
      <!-- <el-table-column prop="photo" label="图片" /> -->
      <!-- <el-table-column #default="scope" width="100px" height="100%" label="图片" align="center">
        <img :src="scope.row.photo">
      </el-table-column> -->
      <el-table-column label="操作" width="100" align="center">
        <template #default="record">
          <i href="" class="el-icon-delete" @click.prevent="deleteHandler(record.row.id)" /> &nbsp;
          <i href="" class="el-icon-edit-outline" @click.prevent="editHandler(record.row)" /> &nbsp;
          <a href="" @click.prevent="toDetails(record.row)">详情</a>
        </template>
      </el-table-column>
    </el-table>
    <!--更新操作模态框-->
    <el-dialog :title="title" :visible="visible" @close="dialogCloseHandler">
      {{ form }}
      <el-form ref="productForm" :model="form" :rules="rules">
        <el-form-item label="产品名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="价格" :label-width="formLabelWidth" prop="price">
          <el-input v-model="form.price" autocomplete="off" />
        </el-form-item>
        <el-form-item label="所属栏目" :label-width="formLabelWidth" prop="categoryId">
          <el-select v-model="form.categoryId">
            <el-option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="介绍" :label-width="formLabelWidth" prop="description">
          <el-input v-model="form.description" type="textarea" autocomplete="off" show-status />
        </el-form-item>
        <el-form-item label="产品主图" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            action="http://134.175.154.93:6677/file/upload"
            :file-list="fileList"
            list-type="picture"
            :limit="1"
            :on-success="uploadSuccessHandler"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCloseHandler">取 消</el-button>
        <el-button type="primary" @click="submitHandler(form)">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分页 -->
    <!-- <el-pagination
      background
      layout="prev, pager, next"
      :current-page="queryResult.page+1"
      :page-size="queryResult.pageSize"
      :total="queryResult.total"
      @current-change="pageChangeHandler"
    /> -->
    <!--/分页 -->
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { isNumber } from 'util'
export default {
  data() {
    return {
      fileList: [],
      ids: [],
      form: {},
      keyWord: '', // 关键字查询
      search: {
        page: 0,
        pageSize: 8, // 每页显示几条数据
        name: '', // 实现查询的条件之一
        price: '',
        status: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入产品名称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          { min: 1, max: 4, message: '长度在 1 到 4 个字符', trigger: 'blur' }
        ]

      }
    }
  },
  created() {
    // this.findAllproducts();
    // this.query(this.search);
    this.findAllproducts()
    this.findAllCategories()
  },
  computed: {
    ...mapState('product', ['products', 'visible', 'title', 'queryResult', 'formLabelWidth']),
    ...mapState('category', ['categories']),
    ...mapGetters('product', ['countproducts', 'productStatusFilter'])
    // 普通属性

  },
  methods: {
    ...mapActions('product', ['findAllproducts', 'deleteproductById', 'saveOrUpdateproduct', 'batchDeleteproducts', 'query']),
    ...mapMutations('product', ['showModal', 'closeModal', 'setTitle']),
    ...mapMutations('category', ['refreshCategories']),
    // 映射查找该产品的所有地址方法
    ...mapActions('address', ['findAddressByproductId']),
    ...mapActions('category', ['findAllCategories']),
    // 普通方法
    uploadSuccessHandler(response) {
      if (response.status === 200) {
        const id = response.data.id.id
        const photo = 'http://134.175.154.93:8888/group1/' + id
        this.form.photo = photo
        // 克隆
        this.product = Object.assign({}, this.product)
      } else {
        this.message.error('上传异常')
      }
    },
    toDetails(id) {
      // 跳转到产品详情页面
      this.$router.push({
        path: '/sys/productDetail',
        query: { id }
        // params:{id:1}
      })
    },
    idsChangeHandler(val) {
      this.ids = val.map(item => item.id)
    },
    toAddHandler() {
      this.form = {}
      this.setTitle('添加产品信息')
      this.showModal()
    },
    submitHandler() {
      // 1.表单验证
      this.$refs.productForm.validate((valid) => {
        if (valid) {
          // 2.提交表单
          this.saveOrUpdateproduct(this.form)
            .then((response) => {
              this.$message({ type: 'success', message: response.statusText })
              // this.query(this.search)
              this.findAllproducts()
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
          this.deleteproductById(id)
            .then((response) => {
              this.$message({
                type: 'success',
                message: response.statusText
              })
              // this.query(this.search)
              this.findAllproducts()
            })
        })
    },
    editHandler(row) {
      // 将当前行的信息绑定from
      this.form = row
      this.fileList.push({ name: 'old', url: row.photo })
      this.setTitle('修改产品信息')
      this.showModal()
    },
    // 监控模态框关闭
    dialogCloseHandler() {
      this.closeModal()
      this.$refs.productForm.resetFields()
      this.form = {}
    },
    // 批量删除
    batchHandler() {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
      })
        .then(() => {
          this.batchDeleteproducts(this.ids)
            .then((response) => {
              this.$message({
                type: 'success',
                message: response.statusText
              })
              // this.query(this.search)
            })
        })
    },
    // 查询
    searchHandler() {
      if (/^[0-9]*[1-9][0-9]*$/.test(this.keyWord)) {
        console.log('数字')
        this.search.price = this.keyWord
      } else if (/[\u4E00-\u9FA5]+/.test(this.keyWord)) {
        console.log('字符')
        this.search.name = this.keyWord
      } else {
        this.search.name = ''
        this.search.price = ''
      }
      // this.search.name=this.keyWord;

      // this.query(this.search)
      this.findAllproducts()
    }
		 // 翻页
    // pageChangeHandler(currentPage) {
    //   this.search.page = currentPage - 1
    //   this.query(this.search)
    // }
  }
}
</script>
<style scoped>

</style>
