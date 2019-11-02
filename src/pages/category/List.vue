<template>
  <dir>
    <h2>栏目管理</h2>
    <div class="btns">
      <!-- 左侧搜索 -->
      <el-col :span="16">
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="search.name" placeholder="请输入关键字" clearable />
          </el-form-item>
          <el-form-item>
            <el-button size="small">搜索</el-button>
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
    <!--展示数据表格-->
    <el-table :data="categories" style="width: 100%;" size="small" @selection-change="handleSelectionChange">
      <el-table-column v-model="ids" type="selection" width="55" />
      <!-- <el-table-column label="编号" width="80" align="center">
		 	<template v-slot:default="scope">
		  		<input type="checkbox" :value="scope.row.id">
		 	</template>
	      </el-table-column> -->
      <el-table-column prop="name" label="名称" align="center" />
      <el-table-column prop="num" label="数量" align="center" />
      <el-table-column #default="scope" label="图片" align="center">
        <img :src="scope.row.icon">
      </el-table-column>
      <el-table-column prop="parentId" label="父栏目" align="center" />
      <el-table-column label="操作" align="center">
        <template v-slot:default="scope">
          <el-button type="danger" icon="el-icon-delete" circle @click.prevent="deleteHandler(scope.row.id)" />
          <el-button type="primary" icon="el-icon-edit" circle @click.prevent="editHandler(scope.row)" />
          <el-button type="primary" icon="el-icon-warning" circle @click.prevent="toDetail(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <!--更新操作模态框-->
    <el-dialog :title="title" :visible="visible" @close="dialogCloseHandler">
      <el-form ref="categoryForm" :model="form" :rules="rules">
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="数量" :label-width="formLabelWidth" prop="num">
          <el-input v-model="form.num" autocomplete="off" />
        </el-form-item>
        <el-form-item label="图片" :label-width="formLabelWidth">
          <!-- <el-input v-model="form.icon" autocomplete="off" /> -->
          <el-upload

            class="upload-demo"
            action="http://134.175.154.93:6677/file/upload"
            :file-list="fileList"
            :limit="1"
            :on-success="uploadSuccessHandler"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="父栏目" :label-width="formLabelWidth">
          <el-input v-model="form.parentId" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCloseHandler">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateHandler(form)">确 定</el-button>
      </div>
    </el-dialog>

  </dir>
</template>
<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import { post } from '@/http/axios'
export default {
  data() {
    return {
      form: {},
      ids: [],
      search: {
        page: 0,
        pageSize: 5, // 每页显示几条数据
        name: ''// 实现查询的条件之一
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
        ],
        num: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ]
      },
      fileList: []
    }
  },
  computed: {
    ...mapState('category', ['categories', 'title', 'visible', 'formLabelWidth', 'queryResult'])
  },
  methods: {
    ...mapActions('category', ['findAllCategories', 'deleteCategoryById', 'saveOrUpdateCategory', 'batchDeleteCategories', 'query']),
    ...mapMutations('category', ['showModal', 'closeModal', 'refreQuery', 'setTitle']),
    // 普通方法
    // 文件上传
    uploadSuccessHandler(response, file, fileList) {
      console.log('文件的response--', response)
      console.log('file--', file)
      console.log('文件的fileList--', fileList)
      if (response.status === 200) {
        // 获取上传图片的id
        const id = response.data.id
        const groupname = response.data.groupname
        // 图片上传到老师的服务器中
        const icon = 'http://134.175.154.93:8888/' + groupname + '/' + id
        this.form.icon = icon
        // 强制更新vue的双向绑定
        this.form = Object.assign({}, this.form)
      } else {
        this.$message.erro('上传接口异常')
      }
    },
    // 修改
    editHandler(category) {
      this.showModal()
      this.setTitle('修改栏目信息')
      this.form = category
    },
    // 单个删除
    async deleteHandler(id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
      })
        .then(() => {
          this.deleteCategoryById(id)
            .then((response) => {
              this.$message({
                type: 'success',
                message: response.statusText
              })
              this.findAllCategories()
              // this.query(this.search)
            })
        })
    },
    // 选中多条数据
    handleSelectionChange(val) {
      this.ids = val.map(item => item.id)
    },
    // 批量删除
    batchHandler() {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
      })
        .then(() => {
          this.batchDeleteCategories(this.ids)
            .then((response) => {
              this.$message({
                type: 'success',
                message: response.statusText
              })
              this.findAllCategories()
              // this.query(this.search)
            })
        })
    },
    // 添加
    toAddHandler() {
      this.setTitle('添加栏目信息')
      this.showModal()
      this.findAllCategories()
      // this.query(this.search)
    },
    // 提交更新
    saveOrUpdateHandler(form) {
      this.$refs.categoryForm.validate((valid) => {
        if (valid) {
          this.saveOrUpdateCategory(form)
            .then(() => {
              // this.query(this.search)
              this.findAllCategories()
            })
        } else {
          return false
        }
      })
    },
    // 监控模态框关闭
    dialogCloseHandler() {
      this.closeModal()
      this.$refs.categoryForm.resetFields()
      this.form = {}
    },
    // 查看详情
    toDetail(category) {
      this.$router.push({ path: '/category/categoryDetail', query: { category }})
    }
  },
  created() {
    this.findAllCategories()
    // this.query(this.search)
  }
}
</script>
<style scoped>

</style>
