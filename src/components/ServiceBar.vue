<template>
  <div class="service">
    <div class="container">
      <ul>
        <li><span class="icon-setting"><img :src="imageUrl + 'icon-setting.png'" alt="设置图标"></span>预约维修服务</li>
        <li><span class="icon-7day"><img :src="imageUrl + 'icon-7day.png'" alt="7天无理由退货图标"></span>7天无理由退货</li>
        <li><span class="icon-15day"><img :src="imageUrl + 'icon-15day.png'" alt="15天免费换货图标"></span>15天免费换货</li>
        <li><span class="icon-post"><img :src="imageUrl + 'icon-post.png'" alt="满150元包邮图标"></span>满150元包邮</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'service-bar',
  data() {
    return {
      imageUrl: this.$imageUrl,
    };
  },
}
</script>

<style scoped>
.service {
  padding: 30px 0 30px 50px;
  margin: 80px 0 0 0 ;
  color: #666666;
  font-size: 16px;
}

.service li {
  display: inline-block;
  width: 20.9%;
  text-align: center;
  border-right: 1px solid #E5E5E5;
}

.service li span {
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
}

.service li img {
  width: 20px;
  height: 20px;
  vertical-align: middle;
}
</style>
