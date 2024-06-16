<template>
  <div>
    <my-header/>
    <!-- 搜索框 -->
    <my-query-box/>
<!--    商品展示-->
    <el-row>
      <el-col :span="24">
        <el-row :gutter="10" style="display: flex; flex-wrap: wrap;">
          <!-- 卡片内容 -->
          <el-col :span="6" v-for="(item, index) in products" :key="index">
            <div @click="findProduct(item.productName)">
              <el-card shadow="hover" :key="`card-${index}`"> <!-- 移动key到el-card上 -->
                <img :src="imageUrl + item.imagesName" class="product-image" alt="" style="width: 200px; height: 220px;">
                <div style="padding: 5px;">
                  <p>{{ item.productName }}</p>
                  <p>价格：{{ "￥"+item.productPrice }}</p>
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

<!--    分页-->
    <center>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageData.page"
          :page-sizes="[4, 8, 20]"
          :page-size="pageData.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </center>
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
  name: 'MyQueryBox',
  data() {
    return {
      imageUrl:this.$imageUrl,
      products:[],
      pageData:{  // 分页对象
        page:1,  // 当前页
        size:4, // 每页显示的条数
        param:null,  // 模糊查询的参数
      },
      total:0, // 数据总条数，默认 0
    }
  },
  methods: {
    // 向后端请求数据并加载
    loadProducts() {
      let _this = this;
      _this.$axios({
        url: '/front/product/productList',
        method: 'get',
        params: {
          page: _this.pageData.page,
          size: _this.pageData.size,
          param: _this.pageData.param,
        }
      }).then(res => {
        console.log(res)
        _this.products = res.data.data.records;  // 数据内容
        _this.total = res.data.data.total;
      }).catch(errpr=>{
        console.log(error);
        _this.$message.error('load products error')
      })
    },
    handleSizeChange(val) {
      this.pageData.size = val;
      this.loadProducts();
    },
    handleCurrentChange(val) {
      this.pageData.page = val;
      this.loadProducts();
    },
    findProduct(productName){
      // query:路由跳转参数
      this.$router.push({
        path: '/front/product',
        query: { 'productName': productName }
      });
    },
  },
  created() {
    // 取出查询的关键字
    this.pageData.param = sessionStorage.getItem('queryProductName');
    this.loadProducts();
  },
}
</script>

<style scoped>

</style>
