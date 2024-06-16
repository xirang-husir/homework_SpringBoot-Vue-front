<template>
  <div class="footer">
    <div class="footer-logo">
      <img :src="imageUrl + 'logo.png'" alt="">
      <p>尤洪商城</p>
    </div>
    <div class="footer-link">
      <a href="" target="_blank">关于我们</a><span>|</span>
      <a href="" target="_blank">联系我们</a><span>|</span>
      <a href="" target="_blank">联系客服</a><span>|</span>
      <a href="" target="_blank">合作招商</a><span>|</span>
      <a href="" target="_blank">商家帮助</a><span>|</span>
      <a href="" target="_blank">营销中心</a><span>|</span>
      <a href="" target="_blank">手机尤洪</a><span>|</span>
      <a href="" target="_blank">友情链接</a><span>|</span>
      <a href="" target="_blank">销售联盟</a><span>|</span>
      <a href="" target="_blank">尤洪社区</a><span>|</span>
      <a href="" target="_blank">风险监测</a><span>|</span>
      <a href="" target="_blank">质量公告</a><span>|</span>
      <a href="" target="_blank">隐私政策</a><span>|</span>
      <a href="" target="_blank">尤洪公益</a><span>|</span>
      <a href="" target="_blank">帮助中心</a>
    </div>
    <div class="copyright">Copyright ©2024 <span class="domain">尤洪商城</span> All Rights Reserved.</div>
  </div>
</template>

<script>
export default {
  name: 'nav-footer',
  data() {
    return {
      imageUrl: this.$imageUrl,
    }
  }
}
</script>

<style scoped>
.footer {
  height: 260px;
  border-top: 4px solid #FF6600;
  background-color: #333333;
  color: #999999;
  font-size: 14px;
  text-align: center;
}

.footer-logo {
  margin-top: 46px;
  margin-bottom: 31px;
}

.footer-logo img {
  width: 280px;
  height: 80px;
}

.footer-link {
  margin-bottom: 13px;
}

.footer-link a {
  color: #999999;
  display: inline-block;
  text-decoration: none;
}

.footer-link a:hover {
  color: #FF6600;
  cursor: pointer !important;
}
.footer-link span {
  margin: 0 10px;
}

.copyright {
}

.copyright .domain {
  color: #FF6600;
}
</style>
