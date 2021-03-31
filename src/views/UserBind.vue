<template>
  <div class="fwrapper user-bind">
    <div class="head-content" ref="headContent">
      <div class="img-box">
        <img src="../assets/images/home.jpg"/>
      </div>
      <div class="img-word">
        <p class="school-name">{{QD.schoolName}}</p>
        <p class="visit-num">
          <span class="key">您的来访次数</span>
          <span class="num">{{visitTotal}}</span>
        </p>
      </div>
      <div class="btn-container">
        <div class="btn-content clearfloat">
          <div class="btn-box record-btn-box">
            <a class="btn record-btn" @click="goVisitLst">
              <span class="icon-visitor">&#xeaf9;</span>
              <span class="text">来访记录</span>
            </a>
          </div>
          <div class="btn-box apply-btn-box">
            <a class="btn apply-btn" @click="goVisitApply">
              <span class="icon-visitor">&#xe618;</span>
              <span class="text">来访申请</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <!-- 探访时间还未结束的列表 start -->
    <ex-scroller v-if="scrollHeight > 0" v-model="applyLst" :onGetList="visitApplyData" :height="'-' + scrollHeight" :finishedText="applyLst.length <=0 ? '': '没有更多了'">
      <lst v-for="(item, rIdx) in applyLst" :key="rIdx" :item="item" @click="goDetailPg(item.id)"></lst>
      <van-empty v-if="loaded && applyLst.length <= 0" description="无来访申请数据" />
    </ex-scroller>
    <!-- 探访时间还未结束的列表 end -->
  </div>
</template>
<script>
  import { Empty } from 'vant';
  import lst from '@/components/qLst/QqLst.vue'
  import exScroller from '../components/common/ExScroller.vue'
  import { mapState, mapActions } from 'vuex'
export default {
  name: 'userBind',
  components: {
    lst,
    exScroller,
    [Empty.name]: Empty
  },
  data () {
    return {
      loaded: false,
      scrollHeight: 0, // 分页需要去掉的高度
      visitTotal: 0,
      applyLst: []
    }
  },
  computed: {
    ...mapState({
      userinfo: state => state.userinfo // 用户信息
    })
  },
  created () {
    if (this.userinfo && this.userinfo.openid) {
      this.getVisitTotal(); // 得到来访记录总数
    }
  },
  mounted() {
    setTimeout(() => {
      this.scrollHeight = this.$refs.headContent.offsetHeight;
    }, 500);
  },
  methods: {
    ...mapActions([
      'updateLoadingStatus'
    ]),
    // 到详情页面
    goDetailPg (id) {
      this.$router.push({path: '/visitDetail', query: {id: id}})
    },
    // 来访记录
    goVisitLst () {
      this.$router.push({path: '/visitSearch'})
    },
    // 申请
    goVisitApply () {
      this.$router.push({path: '/visitApply'})
    },
    // 得到来访记录总数
    async getVisitTotal () {
      let condition = [{"FieldName": "wechatid","Value": this.userinfo.openid, "NeedQuotes": true}];
      this.updateLoadingStatus(true);
      let d = await this.QD.getData('/ComWXApi/PostObject', {
        apiName: 'apiVisitor.GetVisitApplyTotal',
        jsonData: JSON.stringify(condition)
      });
      this.updateLoadingStatus(false);
      console.log("total", d)
      if (d.status && d.status === "error") {
        console.log('获取来访记录总数失败', d);
        return;
      }
      if (d.status === "success") {
        this.visitTotal = d.data;
      }
    },
    // 来访者首页列表（离校日期还未到的列表数据 this.userinfo.openid
    async visitApplyData (index, size) {
      let applyCondition = {startIndex: index, pageSize: size, condition: [{"FieldName": "wechatid","Value": this.userinfo.openid, "NeedQuotes": true}]};
      let d = await this.QD.getData('/ComWXApi/PostObject', {
        apiName: 'apiVisitor.VisitApplyData',
        jsonData: JSON.stringify(applyCondition)
      });
      this.loaded = true;
      console.log("apply lst", d)
      if (d.status && d.status === "error") {
        console.log('获取来访记录数据失败', d);
        return [];
      }
      return d.data
    }
  }
}
</script>
<style scoped lang="less">
  .head-content{
    position: relative;
  }
  .img-box{
    position: relative;
  }
  .img-box > img{
    display: block;
    position: relative;
    width: 100%;
    z-index: 1;
  }
  .img-word{
    position: absolute;
    top: 25px;
    width: 100%;
    z-index: 2;
    line-height: 20px;
    .school-name{
      padding: 5px 15px;
      font-size: 18px;
      color: #ffffff;
    }
    .visit-num{
      padding: 5px 15px;
      font-size: 14px;
      color: #ffffff;
    }
    .key{
      opacity: 0.6;
    }
    .num{
      padding: 0 10px;
      font-size: 16px;
      color: #ffffff;
    }
  }
  .btn-container{
    position: relative;
    margin-top: -40px;
    padding: 0 15px;
    z-index: 2;
  }
  .btn-content{
    position: relative;
    padding: 20px 20px;
    box-shadow: 0 5px 10px 0 rgba(151, 151, 151, 0.2);
    border-radius: 10px;
    background-color: #ffffff;
    .btn-box{
      position: relative;
      float: left;
      width: 50%;
      box-sizing: border-box;
      text-align: center;
    }
    .btn{
      display: inline-block;
      position: relative;
      width: 90%;
      padding: 10px 0;
      border-radius: 40px;
      font-size: 16px;
      color: #ffffff;
      box-sizing: border-box;
      text-align: center;
    }
    .record-btn{
      background-color: @color1;
    }
    .apply-btn{
      background-color: @theme-color;
    }
    .text{
      vertical-align: middle;
    }
    .icon-visitor{
      padding: 0 4px 0 0;
      color: #ffffff;
      font-size: 20px;
      vertical-align: middle;
    }
  }
  @media screen and (max-width: 320px) {
    .img-word{
      top: 12px;
    }
  }
</style>
