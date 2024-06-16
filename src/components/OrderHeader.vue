<template>
  <div class="order-header">
    <div class="container clearfix">
      <div class="header-logo">
        <a href="/"></a>
      </div>
      <div class="title">
        <h2>{{ title }}<slot name="tip"></slot></h2>
      </div>
      <div class="username">
        <a href="/front/userCenter">{{ username }}</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'order-header',
  props: {
    title: String
  },
  data() {
    return {
      imageUrl: this.$imageUrl,
      username: sessionStorage.getItem('frontLoginUsername') || ''
    };
  }
};
</script>

<style scoped>
.order-header {
  padding: 60px 0;
  border-bottom: 2px solid #FF6600;
}

.order-header .container {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
}

.order-header .header-logo {
  float: left;
  position: relative;
}

.order-header .title,
.order-header .username {
  display: inline-block;
  height: 55px;
  line-height: 55px;
}

.order-header .title {
  float: left;
  margin-left: 60px;
}

.order-header .title h2 {
  font-size: 28px;
  color: #333333;
  margin-top: -20px;
  margin-left: 20px;
}

.order-header .title span {
  font-size: 14px;
  margin-left: 17px;
  color: #999999;
  font-weight: 200;
}

.order-header .username {
  float: right;
}

.order-header .username a {
  color: #666666;
  font-size: 20px;
  text-decoration: none;
}
.order-header .username a:hover {
  color:  #FF6600; /* 更改颜色为悬停时的颜色 */
}
/* 使用动态路径设置背景图片 */
order-header .header-logo a:before,
.order-header .header-logo a:after {
  content: ' ';
  display: inline-block;
  width: 55px;
  height: 55px;
  background-size: 55px;
  position: absolute;
  transition: left 0.5s ease-in-out; /* 过渡效果 */
  margin-top: -15px;
}
/* mi-logo.png 和 mi-home.png 的初始状态重叠 */
.order-header .header-logo a:before {
  background-image: url('../../public/imgs/mi-logo.png');
}

.order-header .header-logo a:after {
  background-image: url('../../public/imgs/mi-home.png');
}
</style>
