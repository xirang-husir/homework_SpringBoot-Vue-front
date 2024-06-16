<template>
  <div class="order-pay">
    <order-header title="订单支付">
      <template v-slot:tip>
        <span>请谨防钓鱼链接或诈骗电话</span>
      </template>
    </order-header>
    <div class="wrapper">
      <div class="container">
        <div class="order-wrap">
          <div class="item-order">
            <div class="icon-succ" :style="{backgroundImage: `url('${imageUrl}icon-gou.png')`}"></div>
            <div class="order-info">
              <h2>订单提交成功！去付款咯～</h2>
              <p>请尽快完成支付哦！</p>
              <p>收货信息：{{ userAddress }}</p>
            </div>
            <div class="order-total">
              <p>应付总额：<span>{{ orderTotalPrice }}</span>元</p>
              <p>订单详情<em class="icon-down" :class="{'up':showDetail}" @click="showDetail=!showDetail" :style="{backgroundImage: `url('${imageUrl}icon-down.png')`}"></em></p>
            </div>
          </div>
          <div class="item-detail" v-if="showDetail">
            <div class="item">
              <div class="detail-title">订单号：</div>
              <div class="detail-info theme-color">{{ orderNumber }}</div>
            </div>
            <div class="item">
              <div class="detail-title">收货信息：</div>
              <div class="detail-info">{{ userAddress }}</div>
            </div>
<!--            <div class="item good">-->
<!--              <div class="detail-title">商品详情：</div>-->
<!--              <div class="detail-info">-->
<!--                <ul>-->
<!--                  <li v-for="(item, index) in orderDetail" :key="index">-->
<!--                    <img :src="imageUrl + item.productImageName" alt="" />{{ item.productName }}-->
<!--                  </li>-->
<!--                </ul>-->
<!--              </div>-->
<!--            </div>-->
          </div>
        </div>
        <div class="item-pay">
          <h3>选择以下支付方式付款</h3>
          <div class="pay-way">
            <p>支付平台</p>
            <div class="pay pay-ali checked" @click="paySubmit" :style="{backgroundImage: `url('${imageUrl}icon-ali.png')`}"></div>
          </div>
        </div>
      </div>
    </div>
    <service-bar class="bar"></service-bar>
    <nav-footer></nav-footer>
  </div>
</template>

<script>
import ServiceBar from "../../components/ServiceBar.vue";
import NavFooter from "../../components/NavFooter.vue";
import OrderHeader from "../../components/OrderHeader.vue";

export default {
  name: 'settlement-page',
  data() {
    return {
      imageUrl: this.$imageUrl,
      orderId: parseInt(this.$route.query.orderId, 10), // 确保 orderId 是整数
      userAddress: '', // 收货人地址
      orderDetail: [], // 订单详情，包含商品列表
      showDetail: false, // 是否显示订单详情
      showPay: false, // 是否显示支付二维码
      showPayModal: false, // 是否显示二次支付确认弹框
      orderTotalPrice: 0, // 订单总金额
      payImageQr: '',
      orderNumber: '',
    }
  },
  components: {
    NavFooter,
    ServiceBar,
    OrderHeader,
  },
  methods: {
    // 获取订单的详情
    getOrderDetail() {
      if (!this.orderId) {
        this.$message.error('订单ID未定义');
        return;
      }
      this.$axios.get(`/front/settlementPage/orderDetail?order_id=${this.orderId}`).then((res) => {
        const data = res.data.data;
        console.log("订单的详细数据：", data);
        this.orderDetail = data.items; // 订单商品详情
        this.userAddress = data.orderAddress;
        this.orderTotalPrice = data.orderTotalPrice;
        this.orderNumber = data.orderNumber;

      }).catch(error => {
        this.$message.error('订单获取失败');
      });
    },

    // 点击支付
   paySubmit() {
    this.showPay = true;
    this.$axios.post('/pay/form', {
      tradeNo: this.orderNumber,
      totalAmount: this.orderTotalPrice.toFixed(2),  // 确保金额格式正确
      username: sessionStorage.getItem('frontLoginUsername')
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      // 打开新的窗口并加载支付宝沙箱支付页面
      const newWindow = window.open();
      newWindow.document.write(res.data);
    }).catch(() => {
      this.$message.error("加载支付宝沙箱支付页面错误");
    });
  },
  },
  created() {
    this.getOrderDetail();
  },
}
</script>

<style scoped>
.order-pay .wrapper {
  background-color: #F5F5F5;
  padding-top: 30px;
  padding-bottom: 61px;
  padding-left: 135px;
  padding-right: 135px;
}

.order-pay .order-wrap {
  padding: 62px 50px;
  background-color: #fff;
  font-size: 14px;
  margin-bottom: 30px;
}

.order-pay .item-order {
  display: flex;
  align-items: center;
}

.order-pay .icon-succ {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background-color: #80c58a;
  background-repeat: no-repeat;
  background-size: 80%;
  margin-right: 40px;
  background-position: center center;
}

.order-pay .order-info {
  margin-right: 248px;
}

.order-pay .order-info h2 {
  font-size: 24px;
  color: #333333;
  margin-bottom: 20px;
}

.order-pay .order-info p {
  color: #666666;
}

.order-pay .order-info p span {
  color: #FF6700;
}

.order-pay .order-total > p:first-child {
  margin-bottom: 30px;
}

.order-pay .order-total span {
  font-size: 28px;
  color: #FF6700;
}

.order-pay .order-total .icon-down {
  display: inline-block;
  width: 14px;
  height: 10px;
  background-size: contain;
  margin-left: 9px;
  transition: all .5s;
  cursor: pointer;
}

.order-pay .order-total .icon-down.up {
  transform: rotate(180deg);
}

.order-pay .order-detail {
  border-top: 1px solid #D7D7D7;
  padding-top: 47px;
  padding-left: 130px;
  font-size: 14px;
  margin-top: 45px;
}

.order-pay .order-detail .item {
  margin-bottom: 19px;
}

.order-pay .order-detail .detail-title {
  float: left;
  width: 100px;
}

.order-pay .order-detail .detail-info {
  display: inline-block;
}

.order-pay .order-detail .detail-info img {
  width: 30px;
  vertical-align: middle;
}

.order-pay .item-pay {
  padding: 26px 50px 72px;
  background-color: #ffffff;
  color: #333333;
}

.order-pay .item-pay h3 {
  font-size: 20px;
  font-weight: 200;
  color: #333333;
  padding-bottom: 24px;
  border-bottom: 1px solid #D7D7D7;
  margin-bottom: 26px;
}

.order-pay .pay-way {
  font-size: 18px;
}

.order-pay .pay {
  display: inline-block;
  width: 188px;
  height: 64px;
  border: 1px solid #D7D7D7;
  cursor: pointer;
}

.order-pay .pay.checked {
  border: 1px solid #D7D7D7;
}

.order-pay .pay-ali {
  margin-top: 15px;
  background-repeat: no-repeat;
  background-size: 90%;
  background-position: center center;
}
</style>
