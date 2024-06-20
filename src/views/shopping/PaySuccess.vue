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
      countdown: 10,

    };
  },
  created() {
    this.frontLoginUsername = sessionStorage.getItem('frontLoginUsername');

    this.clearSelected();
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
    // 清空已经购买的商品
    clearSelected (){
      let _this = this;
      const selectedItems = JSON.parse(sessionStorage.getItem('selectedItems'));
      // 调用删除已选择商品的接口
      _this.$axios({
        url: '/front/shoppingCar/deleteSelected',
        method: 'delete',
        data: selectedItems
      }).then(res => {
        if (res.data.status === 200) {
          _this.$message.success('您付款的商品已经从购物车中移除');
        }else {
          console.log(res);
          _this.$message.error('删除已选择的商品失败');
        }
      }).catch(error => {
        _this.$message.error('delete error');
      });
    }
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
