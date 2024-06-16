<template>
  <div style="height: 100vh;overflow: hidden">
    <my-header />
    <div style="background-color: #FFBB00; height: 100%;">
      <div><a href=""><img :src="imageUrl + 'logo.png'" alt=""/></a></div>
      <div class="container" style="display: flex; align-items: center;">
        <div style="margin-right: 10%;margin-top: 10%">
          <img :src="imageUrl + 'l_img.png'" width="611" height="425" alt=""/>
        </div>
        <div>
          <h2>商城登录</h2>
          <el-form :model="loginForm" status-icon ref="loginForm" align="center">
            <el-form-item>
              <el-input type="text" v-model="loginForm.username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input type="password" v-model="loginForm.password" show-password placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm">登录</el-button>
              <el-button @click="registerForm">注册</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/js/jquery-1.4.2.min.js';
import '@/assets/js/menu.js';
import '@/assets/js/select.js';
import '@/assets/js/lrscroll.js';
import '@/assets/js/iban.js';
import '@/assets/js/fban.js';
import '@/assets/js/f_ban.js';
import '@/assets/js/mban.js';
import '@/assets/js/bban.js';
import '@/assets/js/hban.js';
import '@/assets/js/tban.js';
import '@/assets/js/lrscroll_1.js';
import MyHeader from '@/components/MyHeader.vue';

export default {
  components: {
    'my-header': MyHeader,
  },
  data() {
    return {
      imageUrl: this.$imageUrl,
      loginForm: {
        username: 'xiaohong',
        password: '111',
      },
    };
  },
  methods: {
    submitForm() {
      let _this = this;
      // 发生请求，post、put 请求对应 data 传参给服务器，json 格式
      _this.$axios({
        url: 'front/user/login', // 定义请求服务器的路径，比如 http://localhost:9001/front/user/login，这里只需要写 front/user/login
        method: 'post', // 定义请求的方式
        data: JSON.stringify(_this.loginForm), // 定义传给服务器的参数，json 格式，JSON.stringify(_this.loginForm) 把 js 对象转为 json 格式
      }).then(res => { // 请求成功的回调函数，res 就是服务器返回的所有的数据内容
        console.log(res);
        // 通过状态码判断是否登录成功
        if (res.data.status === 200) {
          sessionStorage.setItem('frontLoginUsername',_this.loginForm.username);
          setTimeout(()=>{
            _this.$message.success('登录成功！');
          },500)
          _this.$router.push('/');
        } else {
          _this.$message.error(res.data.msg);
        }
      }).catch(error => { // 请求失败、then 回调函数中报错都会执行这里的内容。error 就是错误信息，但凡看见这里面的内容，代码出问题
        console.log(error);
        _this.$message.error('login error');
      });
    },
    registerForm() {
      // 跳转到注册页面
      this.$router.push('/front/register');
    }
  },
  created() {

  },
};
</script>

<style scoped>
#login-container {
  width: 400px;
  margin: 100px auto;
}
</style>
