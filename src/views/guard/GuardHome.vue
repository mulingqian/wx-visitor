<template>
  <div class="fwrapper">
    <div v-if="showUserBindPg" class="guard-userbind">
      <userbind @bind-success="bindSuccess"></userbind>
    </div>
    <!-- 成功登录后，用户（门卫）看到的内容 start -->
    <div v-if="!showUserBindPg" class="guard-home">
      <div class="head-content" ref="headContent">
        <div class="img-box">
          <img src="../../assets/images/guard_home.jpg"/>
        </div>
        <div class="img-word">
          <p>
            <a class="btn btn-date" @click="doSelectDate">
              <svg class="icon-date" aria-hidden="true">
                <use xlink:href="#iconriqi"></use>
              </svg>
              <span class="date-text">{{selectDate}}</span>
              <span class="icon-visitor icon-arrow">&#xe601;</span>
            </a>
          </p>
          <div class="stats-num">
            <div class="num-box">
              <span class="num">{{statsObj.yfNum}}</span>
              <span class="text">应访人数</span>
            </div>
            <div class="num-box">
              <span class="num">{{statsObj.dfNum}}</span>
              <span class="text">到访人数</span>
            </div>
            <div class="num-box btn-status1" @click="changeVisitStatus1()">
              <span class="num">{{statsObj.wlxNum}}</span>
              <span class="text">未离校</span>
            </div>
            <div class="num-box">
              <span class="num">{{statsObj.ylxNum}}</span>
              <span class="text">已离校</span>
            </div>
          </div>
        </div>
        <div class="btn-container">
          <div class="btn-content clearfloat">
            <div class="btn-box record-btn-box">
              <a class="btn record-btn" @click="goVisitLst">
                <span class="icon-visitor">&#xeaf9;</span>
                <span class="text">来访查询</span>
              </a>
            </div>
            <div class="btn-box apply-btn-box">
              <a class="btn apply-btn" @click="doScan">
                <span class="icon-visitor">&#xe64b;</span>
                <span class="text">扫一扫</span>
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
      <!-- 今日全部列表 start -->
      <div class="lst-content">
        <van-dropdown-menu class="dropdown-menu" z-index="20">
          <van-dropdown-item :disabled="true" class="dropdown-head">
            <span slot="title" class="head-text">今日来访名单</span>
          </van-dropdown-item>
          <van-dropdown-item v-model="selectVisitStatus" :options="visitStatusLst" @change="changeVisitStatus"></van-dropdown-item>
        </van-dropdown-menu>
        <div class="lst-box">
          <ex-scroller v-if="scrollHeight > 0" v-model="list" :onGetList="getVisitedList"
                       :height="'-' + scrollHeight"
                       :finishedText="list.length <=0 ? '': '没有更多了'" ref="scroller">
            <lst v-for="(item, rIdx) in list" :key="rIdx" :showStatusType="4" :contentType="4" :item="item" @click="goDetailPg(item.id)"></lst>
            <van-empty v-if="loaded && list.length <=0" description="无来访数据" />
          </ex-scroller>

        </div>
      </div>
      <!-- 今日全部列表 end -->
      <!-- 选择日期 start -->
      <date-single :showCalendarPanel="showCalendarPanel" :defaultDate="defaultDate" @get-value="getSelectDate" @close="closeDateSingle"></date-single>
      <!-- 选择日期 end -->
    </div>
    <!-- 成功登录后，用户（门卫）看到的内容 end -->

    <!--  弹出未离校的列表数据 start -->
    <van-popup round v-model="showVisitStatus1Panel" class="status1-popup" ref="popupScroll">
      <ex-scroller v-model="list1" :onGetList="getVisitedList1"
                   :height="'-' + scrollHeightPopup"
                   :finishedText="list1.length <=0 ? '': '没有更多了'" ref="scroller1">
        <lst v-for="(item, rIdx) in list1" :key="rIdx" :showStatusType="4" :contentType="4" :item="item" @click="goDetailPg(item.id)"></lst>
        <van-empty v-if="loaded1 && list1.length <=0" description="无来访数据" />
      </ex-scroller>
    </van-popup>
    <!--  弹出未离校的列表数据 end -->

    <!-- 退出、用户信息 start -->
    <logout v-show="showUserInfoPanel" ref="logout" @do-unbind="doUnbind"></logout>
    <!-- 退出、用户信息 end -->
  </div>
</template>
<script>
  import { Calendar, Collapse, CollapseItem, Empty, Popup, Button, DropdownMenu, DropdownItem } from 'vant'
  import lst from '../../components/qLst/QqLst.vue'
  import userbind from '../../components/common/Userbind.vue'
  import dateSingle from '../../components/qForm/QDateSingle.vue'
  import exScroller from '../../components/common/ExScroller.vue'
  import logout from '../../components/common/Logout.vue'
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'guardHome',
    components: {
      lst,
      userbind,
      dateSingle,
      exScroller,
      logout,
      [Calendar.name]: Calendar,
      [Collapse.name]: Collapse,
      [CollapseItem.name]: CollapseItem,
      [Empty.name]: Empty,
      [Popup.name]: Popup,
      [Button.name]: Button,
      [DropdownMenu.name]: DropdownMenu,
      [DropdownItem.name]: DropdownItem
    },
    props: {
    },
    data() {
      return {
        loaded: false,
        loaded1: false, // 未离校的列表加载
        scrollHeight: 0, // 分页需要去掉的高度
        scrollHeightPopup: 0, // 未离校 弹出框中分页 要去掉的高度
        showUserInfoPanel: false, // 用户信息 默认不显示
        showUserBindPg: true, // 显示用户登录界面
        showCalendarPanel: false, // 日期面板 默认不出现
        showVisitStatus1Panel: false, // 显示未离校的列表面板
        activeName: '1',
        selectDate: '', // 选择的日期
        isChangeSelectDate: false, // 用户改变选择日期
        defaultDate: null, // 默认选中的日期
        statsObj: {yfNum: 0, dfNum: 0, wlxNum: 0, ylxNum: 0}, // 来访统计数据
        list: [], // 根据日期查询到的来访记录
        list1: [], // 未离校的列表
        selectVisitStatus: -1, // 选中的状态值
        visitStatusLst: [
          { text: "全部", value: -1},
          {text: "未到访校时间", value: 8},
          {text: "待进校", value: 0},
          {text: "已进校", value: 1},
          {text: "已离校", value: 2},
          {text: "已过期", value: 4}
          ]
      }
    },
    computed: {
      ...mapState({
        userinfo: state => state.userinfo // 用户信息
      })
    },
    watch: {
      // 用户页面的显示
      showUserBindPg () {
        if (!this.showUserBindPg) { // 显示门卫的首页
          console.log("... watch show home")
          this.countScrollHeight(); // 计算分页需要去掉的高度
        }
      }
    },
    created() {
      this.checkAccess();
    },

    mounted() {
    },

    destroyed() {},

    methods: {
      ...mapActions([
        'updateLoadingStatus',
        'updateUserInfo'
      ]),
      // 计算分页需要去掉的高度
      countScrollHeight () {
        // js里有个渲染线程类似于java里边的主线程，主线程按顺序执行代码，
        // 执行完才会有空去看看任务栈里边有没有任务需要执行，有的话就拿来到主线程里边执行
        // setTimeout里边这部分代码会在主线程执行完才会执行
        setTimeout(() => {
          this.scrollHeight = this.$refs.headContent.offsetHeight + 48 + 10 + 12;
          let clientHei = document.body.clientHeight;
          this.scrollHeightPopup = clientHei - clientHei * 0.8 + 82;
        }, 500);
      },
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
          this.showUserBindPg = false; // 显示门卫首页
        } else {
          this.showUserBindPg = true;
        }
        // 有用户的缓存，直接显示门卫的首页
        if (!this.showUserBindPg) {
          this.getCurrPgData(); // 页面初始化得到当前日期
        }
      },
      // 显示 用户信息
      showUserInfoEvent () {
        this.showUserInfoPanel = true;
        this.$refs.logout.showUserInfoPanel = true
      },
      // 确定退出
      doUnbind () {
        this.showUserBindPg = true;
        this.showUserInfoPanel = false;
        this.userinfo.syslogin = false;
        this.clearCurrPgData(); // 清空保存当前页面数据
      },
      // 点击 统计‘未离校
      changeVisitStatus1 () {
        this.showVisitStatus1Panel = true;
        if (this.isChangeSelectDate && this.$refs.scroller1) { // 用户日期有变化和不是第一次点开未离校的框，重新加载数据
          this.isChangeSelectDate = false;
          this.$refs.scroller1.initData(); // 初始化加载列表
        }
      },
      // 进校状态值变化
      changeVisitStatus (value) {
        this.$refs.scroller.initData(); // 初始化加载列表
      },
      // 清空保存当前页面数据,并筛选条件初始化
      clearCurrPgData () {
        this.QD.guardHomePageData = null;
        this.defaultDate = null;
        this.selectVisitStatus = -1;
      },
      // 保存当前页面数据
      saveCurrPgData () {
        this.QD.guardHomePageData = {selectDate: this.selectDate, defaultDate: this.defaultDate, selectVisitStatus: this.selectVisitStatus}
      },
      // 得到当前页面的数据
      getCurrPgData () {
        if (this.QD.guardHomePageData) {
          let qd = this.QD.guardHomePageData;
          this.selectDate = qd.selectDate;
          this.defaultDate = qd.defaultDate;
          this.selectVisitStatus = qd.selectVisitStatus;
          this.QD.guardHomePageData = null;
        } else {
          this.getCurrDate(); // 页面初始化得到当前日期
        }
        this.getStatisticsData(); // 统计 统计应访、到访、未离校、已离校
      },
      // 绑定成功
      bindSuccess () {
        this.showUserBindPg = false;
        this.getCurrDate(); // 页面初始化得到当前日期
        this.getStatisticsData(); // 统计 统计应访、到访、未离校、已离校
      },
      // 门卫扫一扫
      doScan() {
        let that = this;
        this.QD.scanQRCode(function (result) {
          console.log('result', result);
          let info = JSON.parse(result);
          if (info.keyType === 0) {
            that.$router.push({path: "/guardInformationConfirm", query: {id: info.value}})
          } else if(info.keyType === 1){
            that.$router.push({path: "/guardScanResultStu", query: {xh: info.key}})
          }
        });
      },
      // 来访查询
      goVisitLst() {
        this.saveCurrPgData(); // 保存当前页面数据
        this.$router.push({path: "/guardSearch"})
      },
      // 到详情页
      goDetailPg (id) {
        this.saveCurrPgData(); // 保存当前页面数据
        this.$router.push({path: "/guardDetail", query: {id: id}})
      },
      // 页面初始化得到当前日期
      getCurrDate () {
        this.selectDate = this.QD.getCurrDate();
      },
      // 做选择日期
      doSelectDate () {
        this.showCalendarPanel = true;
      },
      // 得到选中的日期
      getSelectDate (date) {
        this.showCalendarPanel = false;
        this.selectDate = date.selectDate;
        this.defaultDate = date.defaultDate;
        this.isChangeSelectDate = true;
        this.getStatisticsData(); // 统计 统计应访、到访、未离校、已离校
        this.$refs.scroller.initData(); // 初始化加载列表
      },
      // 关闭日期
      closeDateSingle () {
        this.showCalendarPanel = false;
      },
      // 统计 统计应访、到访、未离校、已离校
      async getStatisticsData () {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'apiVisitor.GetVisitedStatisticsData',
          visitDate: this.selectDate
        });
        this.updateLoadingStatus(false);
        console.log("stats", d);
        if (d.status && d.status === "error" ) {
          console.log('获取来访统计数据失败', d);
          this.QD.alert({title: '温馨提示', message: '获取来访统计数据失败'});
          return;
        }
        this.statsObj = d.data;
      },
      // 今日来访名单 visitStatus 待进校 = 0,已进校 = 1,已离校 = 2,已过期 = 4， 未到访校时间 8
      async getVisitedList (index, size) {
        this.loaded = false;
        let jsonData = {startIndex: index, pageSize: size, visitDate: this.selectDate, visitStatus: this.selectVisitStatus};
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'apiVisitor.VisitedListData',
          jsonData: JSON.stringify(jsonData)
        });
        this.loaded = true;
        console.log("visited list", d);
        if (d.status && d.status === "error") {
          return [];
        }
        return d.data;
      },
      // 未离校的列表数据 - 弹出框
      async getVisitedList1 (index, size) {
        this.loaded1 = false;
        let jsonData = {startIndex: index, pageSize: size, visitDate: this.selectDate};
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'apiVisitor.NoLeavingSchoolData',
          jsonData: JSON.stringify(jsonData)
        });
        this.loaded1 = true;
        console.log("noLeavingSchoolData list", d);
        if (d.status && d.status === "error") {
          return [];
        }
        return d.data;
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
    .btn-date{
      padding: 5px 15px;
    }
    .date-text{
      display: inline-block;
      width: 104px;
      color: #ffffff;
      font-size: 16px;
      vertical-align: middle;
      text-align: center;
    }
    .icon-date{
      width: 18px;
      height: 18px;
      color: #ffffff;
      vertical-align: middle;
    }
    .icon-arrow{
      font-size: 16px;
      color: #ffffff;
      vertical-align: middle;
    }
    .stats-num{
      display: flex;
      margin: 10px 0 0 0;
      .num-box{
        flex: 1;
      }
      .btn-status1{
        box-shadow: 0 5px 10px 0 rgba(10, 79, 108, 0.2);
      }
      .num{
        display: inline-block;
        width: 100%;
        font-size: 16px;
        color: #ffffff;
        text-align: center;
      }
      .text{
        display: inline-block;
        width: 100%;
        font-size: 12px;
        color: #ffffff;
        opacity: 0.6;
        text-align: center;
      }
    }
  }
  .btn-container{
    position: relative;
    margin-top: -40px;
    padding: 0 15px;
    z-index: 2;
  }
  .btn-container .btn-content{
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
  .user-info-box{
    padding: 15px 0;
    .guard-info{
      margin-top: 120px;
      font-size: 18px;
      color: #333333;
      .name{
        font-size: 14px;
        color: @theme-color;
        text-align: center;
      }
    }
    .group{
      margin-top: 20px;
      border-top: 1px solid #f5f5f5;
    }
    .cell{
      padding: 15px 10px;
      border-bottom: 1px solid #f5f5f5;
    }
    .cell-text{
      vertical-align: middle;
      color: #333333;
    }
    .pwd-icon{
      padding-right: 10px;
      font-size: 18px;
      color: #333333;
      vertical-align: middle;
    }
    .quit-btn{
      position: relative;
      width: 100%;
      margin-top: 70px;
      text-align: center;
    }
    .btn-quit{
      width: 80%;
    }
  }
  @media screen and (max-width: 320px) {
    .img-word{
      top: 12px;
    }
    .userinfo-btn{
      top: 0;
    }
  }
  /* 列表 start */
  .lst-content{
    padding-top: 10px;
    .head-text{
      font-size: 16px;
      color: #000000;
      font-weight: 600;
    }
    .lst-box{
      margin-top: 12px;
    }
  }
  /* 列表 end */
  /* 退出 panel start */
  .quit-popup{
    width: 80%;
    padding: 40px 20px;
    .desc{
      padding: 10px 10px 40px 10px;
      font-size: 16px;
      color: #000;
      font-weight: bold;
      text-align: center;
    }
    .btn-box{
      position: relative;
      width: 50%;
      float: left;
    }
    .btn{
      display: inline-block;
      position: relative;
      width: 90%;
      padding: 10px 0;
      border-radius: 40px;
      font-size: 16px;
      box-sizing: border-box;
      text-align: center;
    }
    .btn-cancel{
      color: @theme-color;
    }
    .btn-sure{
      color: #ffffff;
      background-color: @theme-color;
    }
  }
  /* 退出 panel end */
  /* 弹出 未离校名单 start */
  .status1-popup{
    width: 98%;
    height: 80%;
    padding: 40px 0;
  }
  /* 弹出 未离校名单 end */
</style>
<style>
  /* 列表 今日来访名单 右箭头去掉*/
  .guard-home .van-dropdown-menu__item:first-child .van-dropdown-menu__title::after{
    border: 0;
  }
</style>
