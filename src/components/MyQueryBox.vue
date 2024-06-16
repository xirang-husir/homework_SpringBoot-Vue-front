<template>
  <!-- 搜索框 -->
  <div>
    <el-row style="margin-top: 5px;">
      <el-col :span="6">
        <img :src="imageUrl + 'logo.png'" alt="" style="height: 100px;width: 100%">
      </el-col>
      <el-col :span="12" align="center">
        <el-form :inline="true" :model="product" class="demo-form-inline" style="margin-top: 40px">
          <el-form-item>
            <el-input v-model="product.queryProductName" placeholder="请输入查询商品名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="goProductList">搜索</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6">
        <el-button @click="goShoppingCar">
          <img :src="imageUrl + 'car.png'" alt=""> 购物车
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'MyQueryBox',
  data() {
    return {
      imageUrl: this.$imageUrl,
      frontLoginUsername: null,
      product: {
        queryProductName: null,
      },
    }
  },
  methods: {
    // 去购物车，判断是否登录
    goShoppingCar() {
      let _this = this;
      let currentUsername = sessionStorage.getItem('frontLoginUsername');
      if(currentUsername !==null && currentUsername.length>0){
        this.$router.push('/front/shoppingCar');
      }else{
        _this.$message.error('请先登录');
        setTimeout(() => {
          this.$router.push('/');
        },500);
      }
    },
    goProductList() {
      // 获取当前访问的路由地址 /front/ProductList
      let path = this.$route.path;
      // 判断当前访问的路由地址是否是ProductList 如果是的话就需要刷新，否则进行跳转
      // 如果没有输入内容就不发生改变
      if (this.product.queryProductName !== null && this.product.queryProductName.length !== 0) {
        sessionStorage.setItem('queryProductName', this.product.queryProductName);
        // 存储当前搜索的商品名字,用户页面切换之后展示在搜索栏
        if (path === '/front/productList') {
          this.$router.go(0); // 刷新
        } else {
          // 切换到ProductList的页面
          this.$router.push('/front/productList').catch(error => {
            if (error.name === 'NavigationDuplicated') {
              // 忽略重复导航错误
            }
          });
        }
      } else {
        this.$message.error("请输入搜索的内容")
      }
    },
  },
  created() {
    // 每一次加载页面都去取出sessionStorage 中的数据
    this.product.queryProductName = sessionStorage.getItem('queryProductName');
    // 监听路由变化事件,如果不再当前路由就清空搜索框内容
    this.$router.afterEach((to, from) => {
      // 检查是否从 productList 路由离开，如果是则清除搜索框内容
      if (from.path === '/front/productList' && to.path !== from.path) {
        this.product.queryProductName = null;
        sessionStorage.removeItem('queryProductName');
      }
    });
  },
  // 监听queryProductName的变化，如果为空，则清除sessionStorage中的数据
  watch: {
    'product.queryProductName': function (newVal) {
      if (!newVal) {
        sessionStorage.removeItem('queryProductName');
      }
    }
  },
}
</script>

<style scoped>
</style>
