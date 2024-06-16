import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  'mode':'history', // 去掉路径中的 #
  routes: [
    {
      path: '/', // 访问路径
      name: 'Index',
      component: ()=>import('@/views/shopping/Index')
    },
    {
      path:'/front/login',
      name:'Login',
      component:()=>import('@/views/user/Login')
    },
    {
      path:'/front/register',
      name:'Register',
      component:()=>import('@/views/user/Register')
    },
    {
      path:'/front/userCenter',
      name:'UserCenter',
      component:()=>import('@/views/user/UserCenter')
    },
    {
      path:'/front/productList',
      name:'ProductList',
      component:()=>import('@/views/shopping/ProductList')
    },
    {
      path:'/front/product',
      name:'Product',
      component:()=>import('@/views/shopping/Product')
    },
    {
      // 购物车
      path:'/front/shoppingCar',
      name:'ShoppingCar',
      component:()=>import('@/views/shopping/ShoppingCar')
    },
    {
      // 购物车
      path:'/front/commentList',
      name:'CommentList',
      component:()=>import('@/views/shopping/CommentList')
    },
    {
      // 结算页面
      path:'/front/settlementPage',
      name:'SettlementPage',
      component:()=>import('@/views/shopping/SettlementPage')
    },
    {
      // 支付成功页面
      path:'/front/paySuccess',
      name:'PaySuccess',
      component:()=>import('@/views/shopping/PaySuccess')
    }
  ]
})
