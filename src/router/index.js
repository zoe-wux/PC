import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
import customerDetail from '../pages/customer/customerDetail'
import waiterDetail from '../pages/waiter/waiterDetail'
/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 * 基本路由，不会有权限控制
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '斑马服务', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 * 动态路由，不同身份看到的路由信息不一样
 */
export const asyncRoutes = [
  {
    path: '/customer',
    component: Layout,
    redirect: '/customer/list',
    children: [
      {
        path: 'list',
        component: () => import('@/pages/customer/List'),
        name: 'customer',
        meta: { title: '顾客管理', icon: 'user', noCache: true }
      }
    ]
  },
  {
    path: '/customer/list',
    component: Layout,
    redirect: '/customer/customerDetail',
    children: [
      {
        path: '/customer/customerDetail',
        name: 'customerDetail',
        component: customerDetail,
        hidden: true,
        meta: { title: '顾客详情', icon: 'edit', noCache: true }
      }
    ]
  },

  {
    path: '/order',
    component: Layout,
    redirect: '/order/list',
    children: [
      {
        path: 'list',
        component: () => import('@/pages/order/List'),
        name: 'order',
        meta: { title: '订单管理', icon: 'star', noCache: true }
      }
    ]
  },
  {
    path: '/order/list',
    component: Layout,
    redirect: '/order/orderDetail',
    children: [
      {
        path: '/order/orderDetail',
        component: () => import('@/pages/order/orderDetail'),
        name: 'orderDetail',
        hidden: true,
        meta: { title: '订单详情', icon: 'star', noCache: true }
      }
    ]
  },
  {
    path: '/waiter',
    component: Layout,
    redirect: '/waiter/list',
    children: [
      {
        path: 'list',
        component: () => import('@/pages/waiter/List'),
        name: 'category',
        meta: { title: '员工管理', icon: 'tab', noCache: true }
      }
    ]
  },
  {
    path: '/waiter/list',
    component: Layout,
    redirect: '/waiter/waiterDetail',
    children: [
      {
        path: '/waiter/waiterDetail',
        name: 'waiterDetail',
        hidden: true,
        component: waiterDetail,
        meta: { title: '员工详情', icon: 'edit', noCache: true }
      }
    ]
  },
  {
    path: '/review',
    component: Layout,
    meta: { title: '审核大厅', icon: 'form' },
    children: [
      {
        path: 'waterReview',
        component: () => import('@/pages/review/waterReview'),
        name: 'waterReview',
        meta: { title: '员工审核', icon: 'form', noCache: true }
      },
      {
        path: 'withdrawReview',
        component: () => import('@/pages/review/withdrawReview'),
        name: 'withdrawReview',
        meta: { title: '提现审核', icon: 'form', noCache: true }
      }
    ]
  },
  {
    path: '/sys',
    component: Layout,
    meta: { title: '系统配置', icon: 'tab' },
    children: [
      {
        path: 'category',
        component: () => import('@/pages/sys/category'),
        name: 'category',
        meta: { title: '栏目管理', icon: 'tab' }
      },
      {
        path: 'categoryDetail',
        component: () => import('@/pages/sys/categoryDetail'),
        name: 'categoryDetail',
        hidden: true,
        meta: { title: '栏目详情', icon: 'tab' }
      },
      {
        path: 'product',
        component: () => import('@/pages/sys/product'),
        name: 'product',
        meta: { title: '产品管理', icon: 'tab' }
      },
      {
        path: 'productDetail',
        component: () => import('@/pages/sys/productDetail'),
        name: 'productDetail',
        hidden: true,
        meta: { title: '产品详情', icon: 'tab' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
