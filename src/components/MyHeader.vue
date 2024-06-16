<template>
  <!-- 顶部导航栏 -->
  <div>
    <el-row>
      <el-col :span="18">
        <div class="grid-content bg-purple">
          <el-menu mode="horizontal" :default-openeds="menuIndex" background-color="#eaeaea" text-color="#333"
                   active-text-color="#409EFF" @select="handleSelectMenu">
            <el-menu-item index="1" @click="goIndex">首页</el-menu-item>
            <el-menu-item index="2">促销活动</el-menu-item>
            <el-menu-item index="3" @click="goShoppingCar">购物车</el-menu-item>
            <el-menu-item index="3" @click="goUserCenter">个人中心</el-menu-item>
          </el-menu>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-menu mode="horizontal" :default-openeds="menuIndex" background-color="#eaeaea" text-color="#333"
                   active-text-color="#409EFF" @select="handleSelectMenu">
            <el-menu-item index="4" style="color: red;font-weight: bolder" @click="goLogin"
                          v-if="frontLoginUsername == null">
              登录/注册
            </el-menu-item>
            <el-menu-item index="4" style="color: red;font-weight: bolder" v-if="frontLoginUsername != null">
              <el-avatar :src="frontLoginUserAvatar" class="user-avatar"></el-avatar>
              欢迎 {{ frontLoginUsername }} 登录
            </el-menu-item>
            <el-menu-item index="4" @click="logout" style="color: red;font-weight: bolder"
                          v-if="frontLoginUsername != null">
              退出登录
            </el-menu-item>
          </el-menu>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
export default {
  name: 'MyHeader',
  props: {
    image: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      imageUrl: this.$imageUrl,
      frontLoginUsername: null,
      frontLoginUserAvatar: null,
      menuIndex: [],
      pageData: {
        page: 1,
        size: 5,
        param: '',
      },
    }
  },
  watch: {
    image(newVal, oldVal) {
      this.frontLoginUserAvatar = this.imageUrl + newVal;
    },
    username(newval,oldval){
      this.frontLoginUsername = newval;
    }
  },
  methods: {
    handleSelectMenu(key, keyPath) {
      this.menuIndex = [];
      this.menuIndex.push(keyPath[0]);
    },
    // 回到首页
    goIndex() {
      //回到首页
      this.$router.push('/');
    },
    // 登录注册
    goLogin() {
      // 跳转到login组件
      this.$router.push('/front/login');
    },
    // 退出登录
    logout() {
      // 发送请求访问服务器，参数是当前的用户名
      let _this = this;
      _this.$axios({
        url: 'front/user/logout',
        method: 'get',
        params: {
          username: _this.frontLoginUsername,
        }
      }).then(res => {
        if (res.data.status === 200) {
          _this.$message.success(res.data.msg + ',1秒后回到首页');
          setTimeout(() => {
            sessionStorage.clear();  //清空数据
            _this.$router.push('/').catch(error => {
              if (error.name === 'NavigationDuplicated') {
                _this.$router.go(0);
              }
            })
          }, 1500)
        } else {
          _this.$message.error(res.data.msg);
        }
      }).catch(error => {
        console.log(error);
        _this.$message.error('logout error');
      })
      this.$router.push('/');
    },
    goShoppingCar() {
      let _this = this;
      let currentUsername = sessionStorage.getItem('frontLoginUsername');
      if(currentUsername !==null && currentUsername.length>0){
        this.$router.push('/front/shoppingCar');
      }else{
        _this.$message.error('请先登录');
        setTimeout(() => {
          this.$router.push('/');
        },500);
      }
    },
    goUserCenter() {
      let _this = this;
      let currentUsername = sessionStorage.getItem('frontLoginUsername');
      if (currentUsername == null) {
        _this.$message.error('请先登录');
        return;
      }
      _this.$router.push('/front/userCenter')
    },
    // 获取当前登录用户的信息 (上传头像)
    fetchUserInfo() {
      let _this = this;
      // 从 sessionStorage 中获取已登录的用户名
      let username = sessionStorage.getItem('frontLoginUsername');
      // 发送请求以获取用户信息
      _this.$axios({
        url: '/front/user/userCenter/userInfo',
        method: 'get',
        params: {username: username} // 将用户名作为参数传递给后端
      }).then(res => {
        console.log(res);
        _this.userInfo = res.data.data;
        if (_this.userInfo.userImage != null) {
          _this.frontLoginUserAvatar = _this.imageUrl + _this.userInfo.userImage;
        }
      }).catch(error => {
        _this.$message.error('get userImg error');
      })
    },
  },
  created() {
    this.frontLoginUsername = sessionStorage.getItem('frontLoginUsername');
    if (this.frontLoginUsername) {
      this.fetchUserInfo();
    }
  },
}
</script>

<style scoped></style>
