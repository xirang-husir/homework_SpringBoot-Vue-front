<template>
  <div class="payment-success">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>支付成功</span>
      </div>
      <div class="text item">
        恭喜您完成支付！该页面将在<span>{{ countdown }}</span> 秒后将自动关闭并返回首页。
      </div>
      <el-button type="primary" @click="manualReturn">返回首页</el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      frontLoginUsername:null,
      countdown: 10
    };
  },
  created() {
    this.frontLoginUsername = sessionStorage.getItem('frontLoginUsername');
    this.clearCart();
    this.clearSessionStorage();
    this.startCountdown();
  },
  methods: {
    clearSessionStorage() {
      sessionStorage.removeItem('userAddressInfo');
    },
    startCountdown() {
      this.interval = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(this.interval);
          this.returnHome();
        }
      }, 1000);
    },
    returnHome() {
      this.$router.push({ path: '/' });
    },
    manualReturn() {
      clearInterval(this.interval);
      this.returnHome();
    },
    // 清空购物车
    clearCart() {
      let _this = this;
      // 调用清空购物车接口
      _this.$axios({
        url: '/front/shoppingCar/clearShopping',
        method: 'post',
        params:{
          shoppingCarUsername : _this.frontLoginUsername,
        }
      }).then(res => {
        if (res.data.status === 200) {
          _this.$message.success('恭喜完成支付，购物车已清空');
          _this.loadShoppingCar(); // 刷新购物车
        } else {
          // console.log(res);
          _this.$message.error('清空购物车失败');
        }
      }).catch(error => {
        // _this.$message.error('clear cart error');
      });
    },
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },

};
</script>

<style scoped>
.payment-success {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f4;
}

.box-card {
  width: 400px;
  text-align: center;
}

.item {
  margin-bottom: 20px;
}
</style>
