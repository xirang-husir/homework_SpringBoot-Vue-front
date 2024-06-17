<template>
  <div class="user-center">
    <!-- 顶部导航 -->
<!--    <my-header :image="userInfo.userImage"></my-header>-->
    <my-header  ref="header" :image="userInfo.userImage" :username="userInfo.username"></my-header>
    <!-- 主体内容 -->
    <el-row>
      <!-- 左侧菜单栏 -->
      <el-col :span="4">
        <el-menu default-active="1-1" class="el-menu-vertical-demo" @select="handleSelect">
          <el-submenu index="1">
            <template v-slot:title><i class="el-icon-user"></i> 个人信息</template>
            <el-menu-item index="1-1">用户信息</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template v-slot:title><i class="el-icon-location-outline"></i> 地址管理</template>
            <el-menu-item index="2-1">收货地址</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template v-slot:title><i class="el-icon-lock"></i> 密码管理</template>
            <el-menu-item index="3-1">修改密码</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>

      <!-- 右侧内容展示区域 -->
      <el-col :span="20">
        <div v-if="currentView === 'user-info'">
          <el-card>
            <!--             上传头像 -->
            <el-upload
              class="avatar-uploader"
              action="http://localhost:9001/front/user/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="avatar" :src="imageUrl + userInfo.userImage" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-form :model="userInfo" label-width="80px" style="margin-top: 20px">
              <el-form-item label="用户名">
                <el-input v-model="userInfo.username" style="width: 500px"></el-input>
              </el-form-item>
              <el-form-item label="年龄">
                <el-input v-model="userInfo.userAge" type="number" style="width: 500px"></el-input>
              </el-form-item>
              <el-form-item label="性别">
                <el-select v-model="userInfo.userGender">
                  <el-option label="男" value="male"></el-option>
                  <el-option label="女" value="female"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="userInfo.userEmail" type="email" style="width: 500px"></el-input>
              </el-form-item>
              <el-form-item label="电话">
                <el-input v-model="userInfo.userPhone" type="tel" style="width: 500px"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updateUserInfo">保存</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>

        <!-- 用户地址展示 -->
        <div v-if="currentView === 'user-address'">
          <el-card>
            <el-button type="primary" @click="editAddress(null)">新增地址</el-button>
            <el-table :data="addresses">
              <el-table-column prop="username" label="收货人"></el-table-column>
              <el-table-column prop="userPhone" label="电话"></el-table-column>
              <el-table-column prop="userAddress" label="地址"></el-table-column>
              <el-table-column prop="detailAddress" label="详细地址"></el-table-column>
              <el-table-column>
                <template v-slot:default="scope">
                  <div class="button-group">
                    <el-button @click="editAddress(scope.row)">编辑</el-button>
                    <el-button type="danger" @click="deleteAddress(scope.row)">删除</el-button>
                    <el-button @click="copyAddressToClipboard(scope.row)" style="width: 50%">复制</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-card>

          <!-- 用户地址编辑 -->
          <el-dialog :visible.sync="addressDialogVisible" title="编辑地址">
            <el-form :model="addressForm" label-width="100px">
              <el-form-item label="收货人">
                <el-input v-model="addressForm.username"></el-input>
              </el-form-item>
              <el-form-item label="电话">
                <el-input v-model="addressForm.userPhone"></el-input>
              </el-form-item>
              <el-form-item label="地址">
                <v-distpicker @change="handleAddressChange"></v-distpicker>
              </el-form-item>
              <el-form-item label="详细地址">
                <el-input v-model="addressForm.detailAddress"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveAddress">保存</el-button>
                <el-button @click="resetAddressForm">重置</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>

        <!-- 用户修改密码 -->
        <div v-if="currentView === 'change-password'" style="margin: 100px auto">
          <el-form :model="passwordForm" label-width="100px">
            <el-form-item label="旧密码">
              <el-input v-model="passwordForm.oldPassword" type="password" style="width: 500px"></el-input>
            </el-form-item>
            <el-form-item label="新密码">
              <el-input v-model="passwordForm.newPassword" type="password" style="width: 500px"></el-input>
            </el-form-item>
            <el-form-item label="确认密码">
              <el-input v-model="passwordForm.confirmPassword" type="password" style="width: 500px"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="changePassword">保存</el-button>
            </el-form-item>
          </el-form>
        </div>

      </el-col>
    </el-row>
  </div>
</template>

<script>
// 导入地址选择器插件
import VDistpicker from 'v-distpicker'

export default {
  name: 'UserCenter',
  components: {
    VDistpicker,
    MyHeader: () => import('@/components/MyHeader.vue')
  },
  data() {
    return {
      imageUrl: this.$imageUrl,
      currentView: 'user-info', // 默认展示用户信息
      userInfo: {
        username: '',
        userAge: '',
        userGender: '',
        userEmail: '',
        userPhone: '',
        userImage: ''
      },
      addresses: [],
      addressDialogVisible: false,
      addressForm: {
        username: '',
        userPhone: '',
        userAddress: '',
        detailAddress: '',
      },
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      avatar: '',
    }
  },
  methods: {
    handleSelect(key) {
      switch (key) {
        case '1-1':
          this.currentView = 'user-info';
          break;
        case '2-1':
          this.currentView = 'user-address';
          break;
        case '3-1':
          this.currentView = 'change-password';
          break;
      }
    },
    // 上传成功后
    handleAvatarSuccess(response, file) {
      // 更新用户信息中的头像链接
      this.userInfo.userImage = file.response.data;
      // 创建一个Object URL用于在页面上显示上传的头像图片
      this.avatar = URL.createObjectURL(file.raw);

    },
    // 上传之前的校验
    beforeAvatarUpload(file) {
      const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 10;

      if (!isJPGOrPNG) {
        this.$message.error('上传头像图片只能是 JPG格式!或者PNG格式');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 10MB!');
      }
      return isJPGOrPNG ;
    },
    // 更新用户名的显示
    updateUserInfo() {
      let _this = this;
      _this.$axios({
        url: '/front/user/updateUserInfo',
        method: 'post',
        data: _this.userInfo
      }).then(res => {
        if (res.data.status === 200) {
          _this.$message.success(res.data.msg);
          sessionStorage.setItem('frontLoginUsername', _this.userInfo.username);
          // 触发Header组件的用户名更新
          _this.$refs.header.frontLoginUsername = _this.userInfo.username;
        } else {
          _this.$message.error(res.data.msg);
        }
      }).catch(error => {
        _this.$message.error('update userInfo error');
      });
    },
    // 点击编辑地址
    editAddress(address) {
      // 使用扩展运算符...对address进行浅拷贝至this.addressForm，以避免直接修改原始数据。
      //如果传入的address存在，则将address复制给addressForm
      if (address) {
        this.addressForm = { ...address };
      }
      // 用resetAddressForm函数重置addressForm
      else {
        this.resetAddressForm();
      }
      this.addressDialogVisible = true;
    },
    // 删除地址
    deleteAddress(address) {
      this.$confirm('确认删除这个地址吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除接口
        this.$axios.post('/front/userAddress/delete', { addressId: address.addressId }).then(response => {
          this.$message.success('删除成功');
          // 刷新地址列表
          this.fetchAddresses();
        }).catch(error => {
          this.$message.error('删除失败');
        })
      }).catch(() => {
        // 用户取消删除
      });
    },
    // 保存地址（这里包含了编辑的保存和新增的保存）
    saveAddress() {
      this.addressForm.username2 = sessionStorage.getItem('frontLoginUsername');
      this.$axios.post('/front/userAddress/save', this.addressForm).then(response => {
        this.$message.success('保存成功');
        this.addressDialogVisible = false;
        this.fetchAddresses(); // 刷新地址列表
      }).catch(error => {
        this.$message.error('保存失败');
      });
    },
    // 重置编辑地址表单
    resetAddressForm() {
      this.addressForm = {
        username: '',
        userPhone: '',
        userAddress: '',
        detailAddress: '',
      };
    },
    // 打开地址选择器
    handleAddressChange(value) {
      console.log("地址选择结果", value);
      let arr = new Array();
      let area = value.area.code == '' ? '' : value.area.value;
      let city = value.city.code == '' ? '' : value.city.value;
      let province = value.province.code == '' ? '' : value.province.value;
      arr.push(province);
      arr.push(city);
      arr.push(area);
      console.log("地址选择结果", arr);
      this.addressForm.userAddress = arr.join(' ');
      console.log("地址选择结果", this.addressForm.userAddress);
    },
    // 执行一键复制地址操作
    async copyAddressToClipboard(address) {
      const textToCopy = `收货人：${address.username}，电话：${address.userPhone}，地址：${address.userAddress} ${address.detailAddress}`;
      try {
        await navigator.clipboard.writeText(textToCopy);
        this.$message.success('地址信息已复制到剪贴板！');
      } catch (error) {
        console.error('复制到剪贴板失败：', error);
        this.$message.error('复制地址信息到剪贴板失败！');
      }
    },
    // 修改密码
    changePassword() {
      let _this = this;
      if (!this.passwordForm.oldPassword || !this.passwordForm.newPassword || !this.passwordForm.confirmPassword) {
        this.$message.error('请填写完整信息');
        return;
      }
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        this.$message.error('新密码和确认密码不一致');
        return;
      }
      if (this.passwordForm.newPassword === this.passwordForm.oldPassword) {
        this.$message.error('新密码不能与原密码相同');
        return;
      }
      // 从 sessionStorage 中获取已登录的用户名
      let username = sessionStorage.getItem('frontLoginUsername');
      _this.$axios({
        url: '/front/user/changePassword',
        method: 'post',
        params: {
          username: username,
          oldPassword: this.passwordForm.oldPassword,
          newPassword: this.passwordForm.newPassword
        } // 将用户名作为参数传递给后端
      }).then(response => {
        if (response.data.status === 200) {
          this.$message.success('密码修改成功，请重新登录');
          this.passwordDialogVisible = false;
          this.resetPasswordForm();
          setTimeout(() => {
            this.logout();
          }, 1000);
        }else{
          this.$message.error('密码修改失败,原密码输入错误');
        }
      }).catch(error => {
        this.$message.error('密码修改失败');
      });
    },
    resetPasswordForm() {
      this.passwordForm = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    },
    // 获取当前登录用户的信息
    fetchUserInfo() {
      let _this = this;
      // 从 sessionStorage 中获取已登录的用户名
      let username = sessionStorage.getItem('frontLoginUsername');
      // 发送请求以获取用户信息
      _this.$axios({
        url: '/front/user/userCenter/userInfo',
        method: 'get',
        params: { username: username } // 将用户名作为参数传递给后端
      }).then(res => {
        console.log(res);
        _this.userInfo = res.data.data;
        console.log("用户信息", _this.userInfo)
        // 设置头像
        this.avatar = _this.userInfo.userImage;
      }).catch(error => {
        _this.$message.error('get userInfo error');
      })
    },
    logout() {
      // 发送请求访问服务器，参数是当前的用户名
      let _this = this;
      _this.$axios({
        url: 'front/user/logout',
        method: 'get',
        params: {
          username: sessionStorage.getItem('frontLoginUsername'),
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
          }, 1000)
        } else {
          _this.$message.error(res.data.msg);
        }
      }).catch(error => {
        console.log(error);
        _this.$message.error('logout error');
      })
      this.$router.push('/');
    },
    // 获取地址信息
    fetchAddresses() {
      let _this = this;
      _this.$axios({
        url: '/front/userAddress/addressList',
        method: 'get',
        params: {username: sessionStorage.getItem('frontLoginUsername')}
      }).then(res => {
        console.log("地址数据", res);
        _this.addresses = res.data.data;
      }).catch(error => {
        console.log(error);
        _this.$message.error('get address error');
      })
    }
  },
  created() {
    this.fetchUserInfo();
    this.fetchAddresses();
  }
}
</script>

<style scoped>
.button-group {
  display: flex;
  justify-content: flex-end;
}

.button-group > * {
  margin-left: 5px;
}


.el-menu-vertical-demo {
  height: 100%;
}

.avatar-uploader {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 178px;
  height: 178px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.3s ease;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader .el-icon-plus {
  font-size: 35px;
  color: #8c939d;
  text-align: center;
}

.avatar {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
