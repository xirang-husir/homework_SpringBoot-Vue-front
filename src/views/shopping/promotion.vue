<template>
  <div class="promotion">
    <h2>促销活动</h2>

    <!-- 折扣活动 -->
    <section>
      <h3>折扣活动</h3>
      <el-row :gutter="20">
        <el-col :span="6" v-for="item in discountItems" :key="item.id">
          <el-card>
            <img :src="item.img" class="promotion-image" />
            <div class="promotion-info">
              <h4>{{ item.name }}</h4>
              <p>原价: ￥{{ item.originalPrice }}</p>
              <p>现价: ￥{{ item.discountPrice }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <!-- 限时抢购 -->
    <section>
      <h3>限时抢购</h3>
      <el-row :gutter="20">
        <el-col :span="6" v-for="item in flashSaleItems" :key="item.id">
          <el-card>
            <img :src="item.img" class="promotion-image" />
            <div class="promotion-info">
              <h4>{{ item.name }}</h4>
              <p>限时价: ￥{{ item.salePrice }}</p>
              <el-countdown :time="item.remainingTime">
                <template #default="{ hours, minutes, seconds }">
                  <span>{{ hours }}:{{ minutes }}:{{ seconds }}</span>
                </template>
              </el-countdown>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <!-- 优惠券 -->
    <section>
      <h3>优惠券</h3>
      <el-row :gutter="20">
        <el-col :span="6" v-for="coupon in coupons" :key="coupon.id">
          <el-card>
            <div class="coupon-info">
              <h4>{{ coupon.name }}</h4>
              <p>{{ coupon.description }}</p>
              <el-button type="primary" @click="claimCoupon(coupon.id)">领取</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <!-- 更多活动内容... -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      discountItems: [],
      flashSaleItems: [],
      coupons: []
    };
  },
  created() {
    this.fetchPromotions();
  },
  methods: {
    fetchPromotions() {
      // Fetch promotion data from the backend
      this.$axios.get('/api/promotions').then(response => {
        this.discountItems = response.data.discountItems;
        this.flashSaleItems = response.data.flashSaleItems;
        this.coupons = response.data.coupons;
      }).catch(error => {
        console.error('Error fetching promotions:', error);
      });
    },
    claimCoupon(couponId) {
      // Handle coupon claim
      this.$axios.post(`/api/coupons/claim/${couponId}`).then(response => {
        this.$message.success('领取成功!');
      }).catch(error => {
        this.$message.error('领取失败!');
      });
    }
  }
};
</script>

<style scoped>
.promotion {
  padding: 20px;
}
.promotion-image {
  width: 100%;
}
.promotion-info {
  text-align: center;
}
.coupon-info {
  text-align: center;
}
</style>
