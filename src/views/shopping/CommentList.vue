<template>
  <div>
    <!-- 顶部导航栏 -->
    <my-header/>
    <!-- 搜索框 -->
    <my-query-box/>
    <div>
      <el-button @click="backBtn" style="margin-left: 5px;margin-top: 2px">返回</el-button>
    </div>
    <!-- 评论信息 -->
    <div class="comments-container">
      <el-card v-for="(comment, index) in comments" :key="index" class="comment-item">
        <div class="comment-header">
          <span class="username">{{ comment.commentUsername }}</span>
          <span class="date">{{ comment.createTime }}</span>
          <el-rate v-model="comment.ratingScore" disabled show-score/>
        </div>
        <p class="comment-content">{{ comment.commentMsg }}</p>
        <div class="reply-area" v-if="comment.replyList && comment.replyList.length > 0">
          <h4>回复：</h4>
          <div v-for="(reply, rIndex) in comment.replyList" :key="rIndex" class="reply-item">
            <span class="reply-username">{{ reply.replyUsername }}</span>
            <span class="reply-date">{{ reply.createTime }}</span>
            <p class="reply-content">{{ reply.replyMsg }}</p>
          </div>
        </div>
      </el-card>
    </div>
    <center>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageData.page"
        :page-size="pageData.size"
        layout="total, prev, pager, next"
        :total="totalComments">
      </el-pagination>
    </center>
  </div>
</template>

<script>
import MyHeader from '@/components/MyHeader.vue';
import MyQueryBox from '@/components/MyQueryBox.vue';

export default {
  components: {
    'my-header': MyHeader,
    'my-query-box': MyQueryBox,
  },
  data() {
    return {
      totalComments: 0,
      productId:0,
      comments: [],
      pageData: {
        page: 1,
        size: 5,
      },
    }
  },
  methods: {
    loadComments() {
      let _this=this;
      _this.$axios({
        url:'front/comment/commentList',
        method:'get',
        params: {
          page: _this.pageData.page,
          size: _this.pageData.size,
          param: _this.productId,  // 确保这里传递了 productId
        }
      }).then(res =>{
        _this.comments = res.data.data.records;
        _this.totalComments = res.data.data.total;
        console.log("评论数据",res);
      }).catch(error =>{
        _this.$message.error('load comments error');
      })
    },
    backBtn() {
      this.$router.back();
    },
    handleSizeChange(val) {
      this.pageData.size = val;
      this.loadComments();
    },
    handleCurrentChange(val) {
      this.pageData.page = val;
      this.loadComments();
    },
  },
  created() {
    this.productId = this.$route.query.productId;
    this.loadComments();
  },
}
</script>

<style scoped>
.comments-container {
  margin-top: 20px;
}

.comment-item {
  margin-bottom: 20px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.username,
.reply-username {
  font-weight: bold;
}

.date,
.reply-date {
  color: #999;
}

.reply-area {
  margin-top: 10px;
}

.reply-item {
  margin-bottom: 5px;
}
</style>
