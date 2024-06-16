<template>
  <div style="height: 100vh;overflow: hidden">
    <my-header />
    <div style="background-color: #FFBB00;height: 100%">
      <div><a href=""><img :src="imageUrl + 'logo.png'" alt=""/></a></div>
      <div class="container" style="display: flex; align-items: center;">
        <div style="margin-right: 10%; margin-top: 10%">
          <img :src="imageUrl + 'l_img.png'" width="611" height="425" alt=""/>
        </div>
        <div>
          <h2>商城注册</h2>
          <el-form :model="registerForm" status-icon ref="registerForm" align="center">
            <el-form-item>
              <el-input type="text" v-model="registerForm.username" placeholder="用户名" @blur="checkUsername"></el-input>
<!--              <el-alert v-if="usernameExists" title="用户名已存在，请选择其他用户名" type="error" show-icon></el-alert>-->
            </el-form-item>
            <el-form-item>
              <el-input type="password" v-model="registerForm.password" show-password placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input type="password" v-model="registerForm.confirmPassword" show-password placeholder="确认密码" @blur="checkPassword"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input type="number" v-model="registerForm.userAge" placeholder="年龄"></el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="registerForm.userGender" placeholder="性别">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input type="email" v-model="registerForm.userEmail" placeholder="邮箱"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input type="tel" v-model="registerForm.userPhone" placeholder="电话"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm" :disabled="usernameExists">注册</el-button>
              <el-button @click="backBtn">返回</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MyHeader from '@/components/MyHeader.vue';

export default {
  components: {
    'my-header': MyHeader,
  },
  data() {
    return {
      imageUrl: this.$imageUrl,
      registerForm: {
        username: '',
        password: '',
        confirmPassword: '',
        userAge: null,
        userGender: '',
        userEmail: '',
        userPhone: ''
      },
      // 用户名是否存在的标志
      usernameExists: false,
    };
  },
  methods: {
    // 检查用户名是否存在
    checkUsername() {
      let _this = this;
      const username = _this.registerForm.username;
      if (!username) {
        _this.usernameExists = false;
        return;
      }
      _this.$axios({
        url: '/front/user/checkUsername',
        method: 'get',
        params: { username },
      }).then(res => {
        if (res.data.status === 200) {
          _this.usernameExists = false;
          _this.$message.success(res.data.msg);
        } else {
          _this.usernameExists = true;
          _this.$message.error(res.data.msg);
        }
      }).catch(error => {
        _this.usernameExists = true;
        _this.$message.error("检查用户名错误！");
        // console.log(error);
      });
    },
    // 检查两次密码是否一致
    checkPassword(){
      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        this.$message.error("密码与确认密码不一致");
        return;
      }
    },
    // 注册按钮
    submitForm() {
      let _this = this;
      // 验证是否已经存在用户名
      if (_this.usernameExists) {
        _this.$message.error("用户名已经存在，请选择其他用户名");
        return;
      }
      _this.$axios({
        url: '/front/user/register',
        method: 'post',
        data: JSON.stringify(_this.registerForm),
      }).then(res => {
        if (res.data.status === 200) {
          _this.$message.success(res.data.msg);
          setTimeout(() => {
            _this.$router.push('/front/login');
          }, 500);
        } else {
          _this.$message.error(res.data.msg);
        }
      }).catch(error => {
        _this.$message.error("register error！");
      });
    },
    backBtn() {
      this.$router.push('/front/login');
    }
  },
  created() {}
};
</script>

<style scoped>
#login-container {
  width: 400px;
  margin: 100px auto;
}
</style>
