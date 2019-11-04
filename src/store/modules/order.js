// import request from '@/utils/request'
import { get, post, post_array } from '@/http/axios'
export default {
  namespaced: true,
  state: {
    visible: false,
    orders: [], // 分页的订单信息
    allOrders: [], // 全部的订单信息
    queryResult: {},
    formLabelWidth: '80px',
    title: '添加订单信息'
  },
  getters: {
    statusDpd: (state) => {
      return function(status) {
        if (status) {
          return state.allOrders.filter((item) => item.status == status)
        } else {
          return state.allOrders
        }
      }
    }
  },
  mutations: {
    showModal(state) {
      state.visible = true
    },
    closeModal(state) {
      state.visible = false
    },
    // 需要接受一个参数，这个参数就是orders
    refreshOrders(state, orders) {
      state.orders = orders
    },
    // 刷新分页查询结果的数据
    refreQuery(state, query) {
      state.orders = query
    },
    refreshAllOrders(state, data) {
      state.allOrders = data
    },
    setTitle(state, title) {
      state.title = title
    }
  },
  actions: {
    // 顾客确认收单
    async confirmOrder({ dispatch }, orderId) {
      await get('/order/confirmOrder', { orderId })
      dispatch('query')
    },
    // 员工服务完成，订单送达，等待顾客确认
    async serviceCompleteOrder({ dispatch }, orderId) {
      await get('/order/serviceCompleteOrder', { orderId })
      dispatch('findAllOrders')
    },
    // 员工接单
    async takeOrder({ dispatch }, orderId) {
      await get('/order/takeOrder', { orderId })
      dispatch('query')
    },
    // 员工拒绝接单
    async rejectOrder({ dispatch }, orderId) {
      await get('/order/rejectOrder', { orderId })
      dispatch('query')
    },
    // 平台取消派单
    async cancelSendOrder({ commit, dispatch }, orderId) {
      await get('/order/cancelSendOrder', { orderId })
      dispatch('query')
    },
    // 平台手动派单
    async sendOrder({ dispatch }, query) {
      await get('/order/sendOrder', query)
      dispatch('query')
    },
    // 批量删除
    async batchDeleteOrders(context, ids) {
      const response = await post_array('/order/batchDelete', { ids }) // //参数为对象
      context.dispatch('findAllOrders')
      return response
    },
    // async findAllOrders({commit,dispatch,getters,state}){
    async findAllOrders(context) {
      console.log('context->', context)
      // 1. 查询所有顾客信息
      const response = await get('/order/findAll')
      // alert(JSON.stringify(response));
      // 2. 将顾客信息设置到state.orders中
      context.commit('refreshAllOrders', response.data)
    },
    async deleteOrderById({ dispatch }, id) {
      // 1. 删除顾客信息
      const response = await get('/order/deleteById', { id })
      // 2. 刷新
      // dispatch("findAllOrders")
      // 3. 提示成功
      return response
    },
    async saveOrder({ dispatch, commit }, order) {
      // 1. 提交请求
      const response = await post('/order/save', order)
      // 2. 关闭模态
      commit('closeModal')
      // 3. 刷新页面
      //   dispatch("findAllOrders");
      // 4. 提示成功 react
      return response
    },
    // 分页查询
    async query({ commit }) {
      const response = await get('/order/query')
      commit('refreQuery', response.data)
    },
    // 查询订单信息，返回列表数据
    async queryBasic({ commit, dispath }, customerId) {
      const response = await get('/order/queryBasic', { customerId })
      commit('refreshQueryBasic', response.data)
    },
    async findOrderById(context, orderId) {
      const response = await get('/order/getOrderLinesByOrderId', { orderId })

      context.commit('refreshAllOrders', response.data)
    }
  }
}
