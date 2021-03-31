<template>
  <div class="fwrapper home">
    <div v-if="showUserBindPg" class="guard-userbind">
      <userbind @bind-success="bindSuccess"></userbind>
    </div>

    <!-- 成功登录后，用户（教师）看到的内容 start -->
    <div v-if="!showUserBindPg">
      <div class="head-content" ref="headContent">
        <div class="img-box">
          <img src="../assets/images/home.jpg"/>
        </div>
        <div class="img-word">
          <p class="school-name">{{QD.schoolName}}</p>
          <p class="visit-num">
          <span class="num-box">
            <span class="key">待审批</span>
            <span class="num">{{waitAuditNum}}</span>
            <span>{{userinfo.name}} 您好！欢迎登录</span>
          </span>
          </p>
        </div>
        <div class="btn-container">
          <div class="btn-content clearfloat">
            <div class="btn-box record-btn-box">
              <a class="btn record-btn" @click="goSearchLst">
                <span class="icon-visitor">&#xeaf9;</span>
                <span class="text">来访查询</span>
              </a>
            </div>
            <div class="btn-box apply-btn-box">
              <a class="btn apply-btn" @click="goVisitApply">
                <span class="icon-visitor">&#xe618;</span>
                <span class="text">代填报</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <!-- 退出 start -->
      <a class="userinfo-btn" @click="showUserInfoEvent">
        <span class="icon-visitor more-icon">&#xe611;</span>
      </a>
      <!-- 退出 end -->
      <!-- 消息提醒 start -->
      <div class="remind-content" v-if="remindLst.length > 0">
        <div class="remind-box">
          <van-swipe class="remind-swipe" :autoplay="30000" indicator-color="white" @change="onChangeRemind">
            <van-swipe-item v-for="(item, rIdx) in remindLst" :key="rIdx">
              <!-- 分享二维码 start -->
              <div v-if="item.visitStatus === 0" class="share-code">
                <div class="icon-box">
                  <svg class="icon-mark" aria-hidden="true">
                    <use xlink:href="#icontubiao-05"></use>
                  </svg>
                </div>
                <div class="info-box">
                  <p class="title" v-if="!item.selfApply">你提交的来访申请审批通过</p>
                  <p class="title" v-if="item.selfApply">
                    <span>{{item.applyName}}提交的来访申请</span>
                  </p>
                  <p class="text">来访人：{{item.lfName}} | 共{{item.lfNum}}人</p>
                  <p class="hint-text">
                    <span class="icon-visitor icon-hint">&#xe612;</span>
                    <span class="word">请及时把二维码分享给来访人</span>
                  </p>
                  <van-button class="btn share-btn" type="primary" size="normal" @click="doShareCode(item.id, item.sfName)">分享二维码</van-button>
                </div>
              </div>
              <!-- 分享二维码 end -->
              <!-- 提醒来访人已到校 start -->
              <div v-if="item.visitStatus === 1" class="arrive-school">
                <div class="icon-box">
                  <svg class="icon-mark" aria-hidden="true">
                    <use xlink:href="#icontouxiang1" v-if="item.selfApply"></use>
                    <use xlink:href="#icontouxiang" v-else></use>
                  </svg>
                </div>
                <div class="info-box">
                  <p class="title">来访人已到校</p>
                  <p class="text">来访人: {{item.lfName}} | 共{{item.lfNum}}人</p>
                  <p class="text">到校时间: {{item.actVisitTime}}</p>
                </div>
              </div>
              <!-- 提醒来访人已到校 end -->
            </van-swipe-item>
            <template #indicator>
              <div class="custom-indicator">
                {{ remindCurrent }}/{{remindLst.length}}
              </div>
            </template>
          </van-swipe>
        </div>
      </div>
      <!-- 消息提醒 start -->

      <!-- 列表内容 start -->
      <div class="tab-content">
        <van-tabs v-model="tabType" :animated="true">
          <van-tab title="待审批">
            <ex-scroller v-model="auditLst1" :onGetList="getWaitAuditLst" :height="'-88'" :finishedText="auditLst1.length <=0 ? '': '没有更多了'">
              <lst v-for="(item, rIdx) in auditLst1" :key="rIdx" :item="item"
                   :contentType="5" :showStatusType="0" @click="goAuditDetailPg(item.appId, item.resultId)"></lst>
              <van-empty v-if="loaded1 && auditLst1.length <=0 " description="无待审批数据" />
            </ex-scroller>
          </van-tab>

          <van-tab title="已审批">

            <ex-scroller v-model="auditLst2" :onGetList="getFinishAuditLst" :height="'-88'" :finishedText="auditLst2.length <=0 ? '': '没有更多了'">
              <lst v-for="(item, rIdx) in auditLst2" :key="rIdx" :item="item" :contentType="5"
                   :showStatusType="9" @click="goAuditDetailPg2(item.appId, item.resultId)"></lst>
              <van-empty v-if="loaded2 && auditLst2.length <=0 " description="近3天无已审批的数据" />
            </ex-scroller>

          </van-tab>


          <van-tab title="代填报">

            <ex-scroller v-model="auditLst3" :onGetList="getApplyLst" :height="'-88'" :finishedText="auditLst3.length <=0 ? '': '没有更多了'">
              <lst v-for="(item, rIdx) in auditLst3" :key="rIdx" :item="item" :contentType="6" @click="goApplyDetailPg(item.id)"></lst>
              <van-empty v-if="loaded3 && auditLst3.length <=0" description="近3天无代填报的数据" />
            </ex-scroller>

          </van-tab>

        </van-tabs>
      </div>
      <!-- 列表内容 end -->
    </div>
    <!-- 成功登录后，用户（教师）看到的内容 end -->

    <!-- 退出、用户信息 start -->
    <logout v-show="showUserInfoPanel" ref="logout" @do-unbind="doUnbind"></logout>
    <!-- 退出、用户信息 end -->
  </div>
</template>

<script>
  import lst from '../components/qLst/QqLst.vue'
  import exScroller from '../components/common/ExScroller.vue'
  import { Tab, Tabs, Swipe, SwipeItem, Button, Empty, } from 'vant';

  import userbind from '../components/common/Userbind.vue'
  import logout from '../components/common/Logout.vue'
  import { mapState, mapActions } from 'vuex'
export default {
  name: 'home',
  components: {
    lst,
    exScroller,
    userbind,
    logout,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Button.name]: Button,
    [Empty.name]: Empty
  },
  data() {
    return {
      loaded1: false,
      loaded2: false,
      loaded3: false,
      showUserBindPg: true, // 显示用户登录界面
      showUserInfoPanel: false, // 用户信息 默认不显示
      tabType: 0, // 当前激活 tab 类型
      waitAuditNum: 0, // 待审批的数量
      remindCurrent: 1, // 当前提醒的是第几个
      remindLst: [], // 提醒
      auditLst1: [], // 待审批
      auditLst2: [], // 已审批
      auditLst3: [] // 代填报
    }
  },
  computed: {
    ...mapState({
      gLoading: state => state.gLoading,
      userinfo: state => state.userinfo // 用户信息
    })
  },
  created () {
    this.checkAccess();
  },
  mounted () {
  },
  methods: {
    ...mapActions([
      'updateLoadingStatus'
    ]),
    // 验证用户
    checkAccess () {
      if (!this.userinfo){
        this.showUserBindPg = true;
      } else if (this.userinfo && this.userinfo.syslogin === true) {
        // 判断缓存数据是否合法：
        if (!this.userinfo.userid) {
          // 跳到绑定页面
          this.showUserBindPg = true;
          return;
        }
        this.showUserBindPg = false; // 显示首页
      } else {
        this.showUserBindPg = true;
      }
      // 有用户的缓存，直接显示首页
      if (!this.showUserBindPg) {
        this.getSaveCurrPgData(); // 得到保存当前页面的数据
      }
    },
    // 显示 用户信息
    showUserInfoEvent () {
      this.showUserInfoPanel = true;
      this.$refs.logout.showUserInfoPanel = true
    },
    // 点击退出按钮
    doUnbind () {
      this.userinfo.syslogin = false;
      this.showUserBindPg = true;
      this.showUserInfoPanel = false;
    },
    // 到查询列表页面
    goSearchLst () {
      this.$router.push({path: '/interviewSearch'})
    },
    // 申请
    goVisitApply () {
      this.$router.push({path: '/interviewApply'})
    },
    // 到审批详情页面
    goAuditDetailPg (id, rid) {
      this.saveCurrPgData(); // 保存当前页面的数据
      this.$router.push({path: '/interviewDetail', query: {id: id, rid: rid, type: "1"}})
    },
    // 审批完成 后到 详情
    goAuditDetailPg2 (id, rid) {
      this.saveCurrPgData(); // 保存当前页面的数据
      this.$router.push({path: '/interviewDetail', query: {id: id, rid: rid, type: "2"}})
    },
    // 到申请详情页面
    goApplyDetailPg (id) {
      this.saveCurrPgData(); // 保存当前页面的数据
      this.$router.push({path: '/interviewDetail', query: {id: id, type: "3"}})
    },
    // 提醒信息更换
    onChangeRemind (index) {
      this.remindCurrent = index + 1;
    },
    // 绑定成功
    bindSuccess () {
      this.showUserBindPg = false;
    },
    // 首页中受访者消息提醒列表（分享二维码给朋友、提醒受访者来访者已到校
    async getVisitingRecordData () {
      let d = await this.QD.getData('/ComApi/PostObject', {
        apiName: 'apiVisitor.GetVisitingRecordData'
      });
      console.log("remindLst ", d);
      if (d.status && d.status === "error") {
        return
      }
      this.remindLst = d.data;
    },
    // 待审批数据
    async getWaitAuditLst (index, size) {
      let obj = {status: 2, startIndex: index, pageSize: size};
      let d = await this.QD.getData('/ComApi/PostObject', {
        apiName: 'apiVisitor.VisitAuditListData',
        jsonData: JSON.stringify(obj)
      });
      this.loaded1 = true;
      if (d.status && d.status === "error") {
        console.log(d.msg);
        return []
      }
      return d.data.data;
    },
    // 已审批数据
    async getFinishAuditLst (index, size) {
      let obj = {status: 3, startIndex: index, pageSize: size};
      let d = await this.QD.getData('/ComApi/PostObject', {
        apiName: 'apiVisitor.VisitAuditListData',
        jsonData: JSON.stringify(obj)
      });
      this.loaded2 = true;
      if (d.status && d.status === "error") {
        console.log(d.msg);
        return []
      }
      return d.data.data;
    },
    // 代填报的列表数据  getReplaceApplyData
    async getApplyLst (index, size) {
      let d = await this.QD.getData('/ComApi/PostObject', {
        apiName: 'apiVisitor.VisitReplaceApplyData',
        jsonData: JSON.stringify({condition: [], startIndex: index, pageSize: size})
      });
      this.loaded3 = true;
      console.log("replace lst", d)
      if (d.status && d.status === "error") {
        return []
      }
      return d.data;
    },
    // 保存当前页面的数据
    saveCurrPgData () {
      this.QD.homePageData = {tabType: this.tabType}
    },
    // 得到保存当前页面的数据
    getSaveCurrPgData () {
      if (this.QD.homePageData) {
        this.tabType = this.QD.homePageData.tabType;
        this.QD.homePageData = null;
      }
      this.getVisitingRecordData(); // 首页中受访者消息提醒列表（分享二维码给朋友、提醒受访者来访者已到校
    },
    // 分享二维码
    doShareCode (id, sfName) {
      console.log("start ..doShareCode ");
      let url = window.location.href;
      url = url.substring(0, url.lastIndexOf("/")+1);
      url += "enlargeCode?id="+ id;
      this.QD.doShareFriend(url, sfName);
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
    .num-box{
      padding-right: 5px;
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
  /* 消息提醒 start */
  .remind-content{
    position: relative;
    width: 100%;
    margin: 25px 0 25px 0;
    padding: 0 15px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    .remind-box{
      position: relative;
      height: 150px;
      border-radius: 10px;
    }
    .remind-swipe{
    }
    .share-code{
      position: relative;
      background-color: #e6f7fa;
    }
    .icon-box{
      position: absolute;
      top: 12px;
      left: 10px;
      width: 40px;
      height: 40px;
    }
    .icon-mark{
      width: 40px;
      height: 40px;
    }
    .info-box{
      position: relative;
      padding: 10px 10px 10px 60px;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      .title{
        color: #000;
        font-weight: bold;
        font-size: 14px;
        line-height: 24px;
      }
      .text{
        margin: 5px 0;
        padding: 2px 0 4px 0;
        font-size: 12px;
        color: #999999;
      }
      .hint-text{
        position: relative;
        margin: 5px 0;
        .icon-hint{
          padding-right: 6px;
          font-size: 20px;
          color: @color5;
          vertical-align: middle;
        }
        .word{
          font-size: 12px;
          color: @color5;
          vertical-align: middle;
        }
      }
      .share-btn{
        margin-top: 5px;
        padding: 0 40px 0 40px;
        color: #ffffff;
        border-radius: 30px;
        border: 1px solid @theme-color;
        background-color: @theme-color;
      }
    }
    .custom-indicator {
      position: absolute;
      right: 5px;
      bottom: 5px;
      padding: 2px 5px;
      font-size: 12px;
      color: #ffffff;
      background: rgba(0, 0, 0, 0.1);
    }
    /* 提醒到校 start */
    .arrive-school{
      position: relative;
      height: 150px;
      background-image: url('../assets/images/arrive_bg.jpg');
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
    }
    /* 提醒到校 end */
  }
  /* 消息提醒 end */


  /* 首页用户更多icon start */
  .userinfo-btn{
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 10;
    .more-icon{
      display: inline-block;
      padding: 8px 8px 4px 4px;
      color: #ffffff;
      font-size: 16px;
    }
  }
  /* 首页用户更多icon end */
</style>
