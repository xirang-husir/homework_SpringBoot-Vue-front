<template>
  <div>
    <!-- 顶部导航栏 -->
    <my-header />
    <!-- 搜索框 -->
    <my-query-box/>
    <div>
      <el-button @click="backBtn" style="margin-left: 5px;margin-top: 2px">返回</el-button>
    </div>
    <!-- 商品信息 -->
    <el-row style="display: flex; flex-wrap: wrap;">
      <el-col :span="5" style="visibility: hidden;">
        <!-- 内容在这里将不显示，但依然占据空间 -->
      </el-col>
      <el-col :span="7">
        <!-- 商品主图轮播 -->
        <h3>商品例图</h3>
        <el-carousel height="300px" align="center">
          <el-carousel-item v-for="(item,index) in product.images" :key="index">
            <img :src="imageUrl + item.imagesName" alt="" style="height: 300px"/>
          </el-carousel-item>
        </el-carousel>
      </el-col>
      <el-col :span="7" style="margin-left: 10px">
        <!-- 商品基本信息 -->
        <div class="info">
          <h4>{{ productName }}</h4>
          <p>价格：<span class="price">{{ "￥"+product.productPrice }}</span></p>
          <el-rate
            v-model="value"
            show-text>
          </el-rate>
          <a @click="goCommentList" class="comment-link">({{ product.commentCount }}条评论,查询评论)</a>
        </div>
        <!-- 商品规格选择 -->
        <div class="specifications">
          <h4>选择规格</h4>
          <el-form label-position="top" v-if="product.colors!=undefined&&product.colors != null && product.colors.length > 0">
            <!-- 规格选项根据实际情况动态生成 -->
            <el-form-item label="颜色">
              <el-radio-group v-model="selectedColor">
                <el-radio :label="item.colorsName" v-for="(item,index) in product.colors" :key="index">{{ item.colorsName }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
        <!-- 购买数量与操作按钮 -->
        <div class="actions">
          <el-input-number v-model="quantity" :min="1"></el-input-number>
          <br>
          <el-button type="primary" @click="addToCart" style="margin-top: 20px">加入购物车</el-button>
          <el-button type="danger" @click="buyNow">立即购买</el-button>
        </div>
      </el-col>
    </el-row>
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
      frontLoginUsername: null,
      productName: '',
      colors: '',
      product: {},
      selectedColor: '',
      quantity: 1,
      value:null,
    }
  },
  methods: {
    findProductByProductName() {
      let _this = this;
      _this.$axios({
        url: 'front/product/findProductByProductName',
        method: 'get',
        params: {
          productName: _this.productName,
          colorsName: _this.colorsName,
          commentCount: _this.commentCount,
        }
      }).then(res => {
        // 验证商品是否存在，不存在就提示下架，回到首页
        if (res.data.status === 200) {
          console.log(res);
          _this.product = res.data.data;
        } else {
          _this.$message.error("商品已经下架");
          setTimeout(() => {
            this.backBtn();
          }, 1000);
        }
      }).catch(error => {
        console.log(error);
        _this.$message.error(res.data.msg);
      });
    },
    //加入购物车
    addToCart() {
      let _this = this;
      // 获取当前登录的用户名
      let currentUsername = sessionStorage.getItem('frontLoginUsername');
      // 只有登录的用户可以添加到购物车
      if (currentUsername !== null && currentUsername.length > 0) {
        _this.$axios({
          url: 'front/shoppingCar/addToCart',
          method: 'post',
          data: {
            shoppingCarUsername: currentUsername,
            productId: _this.product.productId,
            productName: _this.product.productName,
            productPrice: _this.product.productPrice,
            productAmount: _this.quantity,
            productImageName: _this.product.images[0].imagesName
          }
        }).then(res => {
          console.log("商品的数据",res)
          if (res.data.status === 200) {
            _this.$message.success('商品已添加到购物车');
          } else {
            _this.$message.error("该商品已经在购物车中，页面将在1秒后跳转到购物车页面");
            setTimeout(() => {
              this.$router.push('/front/shoppingCar');
            }, 1000);
          }
        }).catch(error => {
          _this.$message.error('添加到购物车出错');
        });
      }
      else {
        _this.$message.error('请先登录');
        setTimeout(() => {
          this.$router.push('/front/login');
        }, 500);
      }
    },
    buyNow() {
      this.$message.error('功能实现中');
    },
    backBtn() {
      this.$router.back();
    },
    goCommentList() {
      // 跳转到评论列表commentList页面，设置传递的参数productId
      this.$router.push({ path: '/front/commentList', query: { productId: this.product.productId } });
    },

  },
  created() {
    this.productName = this.$route.query.productName;
    this.findProductByProductName();
  }
}
</script>

<style scoped>
/* 在CSS中 */
.comment-link {
  cursor: pointer;
  text-decoration: none; /* 移除默认下划线 */
}

.comment-link:hover {
  text-decoration: underline; /* 鼠标悬停时显示下划线 */
  color: red;
  text-decoration-color: #ff4e00;
}
</style>
