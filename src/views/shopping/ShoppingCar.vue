<template>
  <div>
    <my-header/>
    <my-query-box/>
    <div style="margin-top: 10px;margin-left: 10px">
      <el-checkbox v-model="allSelected" @change="handleAllSelectChange">全选</el-checkbox>
    </div>
    <el-table :data="cartItems">
      <!-- 商品列 -->
      <el-table-column label="商品图片" width="200" align="center">
        <template v-slot="scope">
          <img :src="imageUrl + scope.row.productImageName" alt="" style="height: 80px"/>
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="商品名称" width="300" align="center"></el-table-column>
      <el-table-column prop="productPrice" label="单价" width="200"></el-table-column>
      <!-- 数量操作列 -->
      <el-table-column label="数量" width="300" align="center">
        <template v-slot="scope">
          <el-input-number v-model="scope.row.productAmount" :min="1" @change="updateAmount(scope.row.shoppingCarId,scope.row.productAmount)"></el-input-number>
        </template>
      </el-table-column>
      <!-- 小计列 -->
      <el-table-column label="小计" align="center">
        <template slot-scope="scope">{{ (scope.row.productPrice * scope.row.productAmount).toFixed(2) }}</template>
      </el-table-column>
      <!-- 选择列 -->
      <el-table-column label="选择" align="center">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.selected" @change="handleItemSelectChange"></el-checkbox>
        </template>
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
<!--          删除单个-->
          <el-button type="danger" @click="deleteShopping(scope.row.shoppingCarId)" icon="el-icon-delete" size="small"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 结算总价 -->
    <div>
      <el-button @click="backBtn" style="margin-left: 5px;margin-top: 2px">返回</el-button>
      <el-button @click="deleteSelectedItems" type="warning" style="margin-left: 5px;margin-top: 2px">删除选中</el-button>
      <el-button @click="clearCart" type="danger" style="margin-left: 5px;margin-top: 2px">清空购物车</el-button>
      <el-button @click="showAddressDialog" type="success" style="margin-left: 5px;margin-top: 2px">填写收货信息</el-button>
      <span style="float: right;margin-right: 30px">商品总价：<b style="font-size:22px; color:#ff4e00;">￥{{ totalPrice }}</b></span>
    </div>
    <div style="clear:both;"></div>
    <div style="float: right;margin-right: 15px">
        <img :src="imageUrl + 'buy1.gif'" alt="" @click="goShoppingIndex"><a @click="goShoppingIndex"></a>&nbsp; &nbsp;
        <img :src="imageUrl + 'buy2.gif'" alt="" @click="goSettlementPage"><a @click="goSettlementPage"></a>
    </div>
    <!-- 收货信息对话框 -->
    <el-dialog :visible.sync="addressDialogVisible" title="收货信息">
      <el-form ref="addressForm" :model="addressForm" label-width="80px">
        <el-form-item label="收货人">
          <el-input v-model="addressForm.username" placeholder="请输入收货人姓名"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="addressForm.userPhone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="addressForm.userAddress" type="textarea" placeholder="请输入收货地址"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="addressDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="saveAddress">保存</el-button>
    </span>
    </el-dialog>
    <service-bar class="bar"></service-bar>
    <nav-footer></nav-footer>
  </div>
</template>

<script>
import MyHeader from '@/components/MyHeader.vue';
import MyQueryBox from '@/components/MyQueryBox.vue';
import ServiceBar from "../../components/ServiceBar.vue";
import NavFooter from "../../components/NavFooter.vue";

export default {
  components: {
    NavFooter,
    ServiceBar,
    'my-header': MyHeader,
    'my-query-box': MyQueryBox,
  },
  data() {
    return {
      imageUrl: this.$imageUrl,
      frontLoginUsername: null,
      userAddressInfo:null,
      cartItems: [],
      allSelected: false, // 全选状态
      // 控制收货信息对话框的显示与隐藏
      addressDialogVisible: false,
      // 表单数据对象，用于收集输入的地址信息
      addressForm: {
        username: '',
        userPhone: '',
        userAddress: ''
      },
      orderId: null
    }
  },
  computed: {
    totalPrice() {
      const sum = this.cartItems
        .filter(item => item.selected)
        .reduce((sum, item) => sum + (item.productPrice * item.productAmount), 0);
      return parseFloat(sum.toFixed(2));
    },
  },
  methods: {
    // 加载购物车数据
    loadShoppingCar() {
      let _this=this;
      _this.$axios({
        url:'front/shoppingCar/findShopping',
        method:'get',
        params:{
          shoppingCarUsername : _this.frontLoginUsername,
        }
      }).then(res =>{
        let myData = res.data.data;
        console.log("myData:",res.data.data)
        myData.forEach(item => {
          item['selected']=false;
        });
        _this.cartItems = myData;
      }).catch(error =>{
        _this.$message.error('load shoppingCar error');
      })
    },
    handleAllSelectChange(val) {
      this.cartItems.forEach(item => (item.selected = val));
    },
    handleItemSelectChange() {
      // 当有任何一项未被选中时，全选按钮不选中
      this.allSelected = this.cartItems.every(item => item.selected);
    },
    goShoppingIndex() {
      this.$message.success("欢迎继续选购,1秒后转到首页")
      setTimeout(()=>{
        this.$router.push('/');
      },1000)

    },
    backBtn() {
      this.$router.back();
    },
    // 更新商品的数量
    updateAmount(shoppingCarId, productAmount) {
      let _this = this;
      _this.$axios({
        url: 'front/shoppingCar/updateShopping',
        method: 'post',
        data: {
          shoppingCarId: shoppingCarId,
          productAmount: productAmount,
        }
      }).then(res => {
        if (res.data.status === 200) {
          _this.loadShoppingCar();
        } else {
          console.log(res);
          _this.$message.error('数量更新失败');
        }
      }).catch(error => {
        _this.$message.error('update shopping error');
      });
    },
    //去支付页面
    goSettlementPage() {
    const selectedItems = this.cartItems.filter(item => item.selected);
    if (selectedItems.length === 0) {
      this.$message.error('请至少选择一件商品');
      return;
    }
    const userAddress = sessionStorage.getItem('userAddressInfo');
    if (userAddress) {

      sessionStorage.setItem('selectedItems', JSON.stringify(selectedItems));
      // console.log("存在session中的selectedItems：",JSON.parse(sessionStorage.getItem('selectedItems')))
      const orderRequest = {
      orderUsername: this.frontLoginUsername,
      orderAddress: userAddress,
      items: selectedItems
    };
    this.$axios({
      url: '/front/settlementPage/createOrder',
      method: 'post',
      data: orderRequest
    }).then(res => {
      console.log("这个是res: ", res); // 使用逗号来分隔字符串和对象
      if (res.data && res.data.status === 200) {
        this.orderId = res.data.data.orderId; // 后端返回的订单ID在 data 对象中
        console.log("这个是orderId: ", this.orderId); // 正确打印 orderId
        this.$message.success("1秒后转到结算页面");
        setTimeout(() => {
          this.$router.push({ name: 'SettlementPage', query: { orderId: this.orderId } });
        }, 1000);
      } else {
        this.$message.error('结算失败');
      }
    }).catch(error => {
      this.$message.error('结算失败');
      console.error(error); // 打印错误信息
    });
  } else {
    this.$message.error('请先填写收货信息');
    // setTimeout(() => {
    //   this.showAddressDialog();
    // }, 1200);
  }
},

    // 删除指定的商品
    deleteShopping(shoppingCarId) {
      let _this = this;
      _this.$confirm('您确认要删除这个商品吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        // 调用删除接口
        _this.$axios({
          url:'/front/shoppingCar/deleteShopping',
          method:'post',
          data:{
            shoppingCarId:shoppingCarId,
          }
        }).then(res=>{
          if (res.data.status === 200) {
            _this.$message.success('删除成功');
            _this.loadShoppingCar();// 刷新一下
          } else {
            console.log(res)
            _this.$message.error('删除失败');
          }
        }).catch(error => {
          _this.$message.error('delete shopping error');
        })
      });
    },
    // 删除已经选中的商品
    deleteSelectedItems() {
      let _this = this;
      const selectedItems = this.cartItems.filter(item => item.selected);
      // console.log("正确的selectedItems数据：",selectedItems)
      if (selectedItems.length === 0) {
        this.$message.error('请选择要删除的商品');
        return;
      }
      _this.$confirm('您确认要删除已选择的商品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用删除已选择商品的接口
        _this.$axios({
          url: '/front/shoppingCar/deleteSelected',
          method: 'post',
          data: selectedItems
        }).then(res => {
          if (res.data.status === 200) {
            _this.$message.success('已选择的商品删除成功');
            _this.loadShoppingCar(); // 刷新购物车
          } else {
            console.log(res);
            _this.$message.error('删除已选择的商品失败');
          }
        }).catch(error => {
          _this.$message.error('删除已选择的商品失败');
        });
      }).catch(() => {
        _this.$message.info('已取消删除');
      });
    },
    // 清空购物车
    clearCart() {
      let _this = this;
      _this.$confirm('您确认要清空购物车吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用清空购物车接口
        _this.$axios({
          url: '/front/shoppingCar/clearShopping',
          method: 'post',
          params:{
            shoppingCarUsername : _this.frontLoginUsername,
          }
        }).then(res => {
          if (res.data.status === 200) {
            _this.$message.success('购物车已清空');
            _this.loadShoppingCar(); // 刷新购物车
          } else {
            console.log(res);
            _this.$message.error('清空购物车失败');
          }
        }).catch(error => {
          _this.$message.error('清空购物车失败');
        });
      }).catch(() => {
        _this.$message.info('已取消清空');
      });
    },
    // 显示收货信息对话框
    showAddressDialog() {
      // 打开对话框前先清空表单数据
      this.addressForm = {
        username: '',
        userPhone: '',
        userAddress: ''
      };
      this.addressDialogVisible = true;
    },

    // 在 saveAddress 方法中调用插入订单的方法
    saveAddress() {
      // 拼接地址信息字符串
      const userAddressInfo = `姓名：${this.addressForm.username}，电话：${this.addressForm.userPhone}，地址：${this.addressForm.userAddress}`;
      // 存储地址信息到sessionStorage中
      sessionStorage.setItem('userAddressInfo',userAddressInfo);
      // 关闭对话框
      this.addressDialogVisible = false;
      // 显示保存成功提示消息
      this.$message.success('收货信息保存成功');
    },

    // 自动解析剪切板中的地址
    handlePaste(event) {
      // 获取剪切板中的内容
      const clipboardData = event.clipboardData || window.clipboardData;
      const pastedData = clipboardData.getData('Text');

      // 正则表达式匹配收货人、电话和地址
      const pattern = /收货人：(.*)，电话：(.*)，地址：(.*)/;
      const match = pastedData.match(pattern);

      if (match) {
        // 防止默认的粘贴操作
        event.preventDefault();

        // 将匹配的内容分配给表单字段
        this.addressForm.username = match[1];
        this.addressForm.userPhone = match[2];
        this.addressForm.userAddress = match[3];
      }
    },

  },
  mounted() {
    // 监听全局的粘贴事件
    window.addEventListener('paste', this.handlePaste);
  },
  beforeDestroy() {
    // 移除全局的粘贴事件监听器
    window.removeEventListener('paste', this.handlePaste);
  },
  created() {
    this.frontLoginUsername = sessionStorage.getItem('frontLoginUsername')
    this.loadShoppingCar();

    // console.log("地址数据：",sessionStorage.getItem('userAddress'))
    // console.log("订单数据：",sessionStorage.getItem('orderData'))
  },

}
</script>

<style scoped>
service-bar{
  margin-top: 50px;
}
</style>
