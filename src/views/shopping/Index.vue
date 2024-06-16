<template>
  <div class="page-component__scroll">
    <div class="el-scrollbar__wrap">
      <el-backtop target=".page-component__scroll .el-scrollbar__wrap"/><!--  顶部下拉框  -->
      <!-- 顶部导航栏 -->
      <my-header/>
      <!-- 搜索框 -->
      <my-query-box/>
      <!-- 轮播图区域 -->
      <el-row>
        <el-col :span="6">
          <h2>全部商品分类</h2>
          <!-- 菜单 -->
          <el-menu
            mode="horizontal"
            background-color="orange"
            text-color="#333"
            active-text-color="#409EFF"
            @select="handleSelectGoodsType">
            <el-submenu :index="index+''" v-for="(item,index) in goodsTypes" :key="index" style="width: 50%;height: 72px">
              <template slot="title">
                <span>{{item.commodityType}}</span>
              </template>
              <div class="horizontal-submenu">
                <el-menu-item-group>
                  <el-menu-item
                    v-for="(item1,index1) in item.goods" :key="index1" :index="item1.goodsName">
                    {{ item1.goodsName }}
                  </el-menu-item>
                </el-menu-item-group>
              </div>
            </el-submenu>
          </el-menu>
        </el-col>
        <el-col :span="10">
          <div style="margin-top: 12px">
            <el-menu
              mode="horizontal"
              :default-openeds="menuIndexTwo"
              background-color="white"
              text-color="#333"
              active-text-color="#409EFF"
              @select="handleSelectItemType">
              <el-menu-item index="食品">食品</el-menu-item>
              <el-menu-item index="生鲜">生鲜</el-menu-item>
              <el-menu-item index="家居">家居</el-menu-item>
              <el-menu-item index="女装">女装</el-menu-item>
              <el-menu-item index="纸品">纸品</el-menu-item>
              <el-menu-item index="男装">男装</el-menu-item>
              <el-menu-item index="美状">美状</el-menu-item>
              <el-menu-item index="运动">运动</el-menu-item>
              <el-menu-item index="箱包">箱包</el-menu-item>
            </el-menu>
          </div>
          <el-carousel height="360px" width="400px">
            <el-carousel-item v-for="(item,index) in banners" :key="index">
              <img :src="imageUrl + item.bannerName" alt="" style="width: 100%; height: 100%;">
            </el-carousel-item>
          </el-carousel>
        </el-col>
        <el-col :span="8">
          <h2>新闻咨询</h2>
          <el-card class="box-card">
            <div v-for="(item,index) in news" :key="index" class="text item">
              <a style="text-decoration: none;" :href="item.newsUrl">
                <p style="width: 400px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: black;">
                  {{ item.newsName }} {{ item.newsDescription }}
                </p>
              </a>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <!-- 热销商品 -->
      <el-row>
        <el-col :span="23">
          <h2 style="color: orangered" align="center">热销商品</h2>
          <el-row :gutter="10" style="display: flex; flex-wrap: wrap;">
            <el-col :span="1" style="visibility: hidden;">
              <!-- 内容在这里将不显示，但依然占据空间 -->
            </el-col>
            <!-- 首个元素左侧图片 -->
            <el-col :span="1" style="display: flex; align-items: center;">
              <img :src="imageUrl + 'r_left.png'" alt="" @click="pageDown" style="padding-left: 20px">
            </el-col>
            <!-- 卡片内容 -->
            <el-col :span="5" v-for="(hotProduct, index) in hotProducts" :key="index">
              <div @click="findProduct(hotProduct.hotName)">
                <el-card shadow="hover" :key="`card-${index}`"> <!-- 移动key到el-card上 -->
                  <img :src="imageUrl + hotProduct.hotImageName" class="product-image" alt="" style="width: 200px; height: 220px;">
                  <div style="padding: 5px;">
                    <p>{{ hotProduct.hotName }}</p>
                    <p style="width: 400px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ hotProduct.hotDescription }}</p>
                    <p>价格：{{ "￥"+hotProduct.hotPrice }}</p>
                  </div>
                </el-card>
              </div>
            </el-col>
            <!-- 最后一个元素右侧图片 -->
            <el-col :span="1" style="display: flex; align-items: center;">
              <img :src="imageUrl + 'r_right.png'" alt="" @click="pageUp" style="padding-left: 10px">
            </el-col>
          </el-row>
        </el-col>
      </el-row>

      <!-- 新品推荐等其他模块可以根据类似方式添加 -->
      <div></div>

    </div>
  </div>
</template>

<script>
import MyHeader from '@/components/MyHeader.vue';
import MyQueryBox from '@/components/MyQueryBox.vue';
export default {
  components: {
    'my-header': MyHeader,
    'my-query-box': MyQueryBox,
  },
  data() {
    return {
      imageUrl: this.$imageUrl,
      menuIndexTwo: [],
      goodsTypes: [],
      hotPageData: {
        page: 1,
        size: 4,
      },
      hotTotal: 0,
      maxPage: 0,
      banners: [],
      hotProducts: [],
      news: [],
    };
  },
  methods: {
    loadBanner() {
      let _this=this;
      _this.$axios({
        url:'front/banner/bannerList',
        method:'get',
      }).then(res =>{
        _this.banners = res.data.data;//把服务器返回的数据内容 response 的data 赋值给 banners
      }).catch(error =>{
        console.log(error);
        _this.$message.error(res.data.msg);
      })
    },
    loadHot() {
      let _this=this;
      _this.$axios({
        url:'front/hot/hotList',
        method:'get',
        params:{
          page: _this.hotPageData.page,
          size: _this.hotPageData.size,
        }
      }).then(res =>{
        console.log(res);
        _this.hotProducts = res.data.data.records;//数据内容
        _this.hotTotal = res.data.data.total;//总条数
        _this.maxPage = res.data.data.pages;//总页码
      }).catch(error =>{
        _this.$message.error('load hot error');
      })
    },
    loadGoodsType() {
      let _this=this;
      _this.$axios({
        url:'front/goodsType/goodsTypeList',
        method:'get',
      }).then(res =>{
        _this.goodsTypes = res.data.data;//把服务器返回的数据内容 response 的data 赋值给 banners
      }).catch(error =>{
        console.log(error);
        _this.$message.error(res.data.msg);
      })
    },
    loadNews() {
      let _this=this;
      _this.$axios({
        url:'front/news/newsList',
        method:'get',
      }).then(res =>{
        _this.news = res.data.data;//把服务器返回的数据内容 response 的data 赋值给 news
      }).catch(error =>{
        console.log(error);
        _this.$message.error('load news error');
      })
    },
    handleSelectItemType(key, keyPath) {
      this.menuIndexTwo = [];
      let itemType = keyPath[0];
      this.menuIndexTwo.push(itemType);
      this.findItemType(itemType);
    },
    handleSelectGoodsType(key, keyPath) {
      this.findGoodsType(keyPath[1])
    },
    pageDown () {
      let page = this.hotPageData.page;
      if (page === 1)
        return false;
      this.hotPageData.page = page - 1;
      this.loadHot();
    },
    pageUp () {
      let page = this.hotPageData.page;
      let maxPage = this.maxPage;
      if (page < maxPage){
        this.hotPageData.page = page + 1;
        this.loadHot();
      }
    },
    findGoodsType(goodsType) {
      this.$message.error('功能实现中');
    },
    findItemType(itemType) {
      this.$message.error('功能实现中');
    },
    findProduct(productName) {
      // query:路由跳转参数
      this.$router.push({
        path: '/front/product',
        query: { 'productName': productName }
      });
    },
  },
  created() {
    this.loadBanner();
    this.loadNews();
    this.loadHot() ;
    this.loadGoodsType();
  },

};
</script>

<style scoped>
.page-component__scroll{
  height: 100vh;
  overflow: hidden;
}
.el-scrollbar__wrap{
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.el-submenu__title i {
  display: none;
}
.text {
  font-size: 14px;
}

.item {
  padding: 2px 0;
}

.box-card {
  width: 480px;
  height: 360px;
}

</style>
