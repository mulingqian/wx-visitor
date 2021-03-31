<script src="../../../qd-wx-schoolcollect/src/utils/router.js"></script>
<template>
<div class="scanningResults">
  <svg class="icon" aria-hidden="true">
    <use xlink:href="#icontubiao-05" v-if="vilidateQRCodeStatus == 1"></use>
    <use xlink:href="#icontubiao-07" v-else-if="vilidateQRCodeStatus == 0"></use>
    <use xlink:href="#icontubiao-06" v-else></use>
  </svg>
  <div class="tip-info">
    <!--门卫扫码得到的信息 start-->
    <div v-if="type === '3'">
      <p v-if="vilidateQRCodeStatus === 1" class="title">扫码成功，允许进校</p>
      <p v-else-if="visitStatus === 0" class="title">
        <span style="margin-bottom:12px;">未到来访时间，不能进校</span>
        <span> 二维码有效期：08-24 11:00—18:00</span>
      </p>
      <p v-else class="title">无效信息，不能进校</p>
      <p v-if="vilidateQRCodeStatus === 1 && info.visitStatus === 2" class="title">扫码成功，允许离校</p>
      <lst :showStatusType="4" :contentType="4" :showVisitStatus="false" :item="info" class="cell"></lst>
    </div>
    <!--门卫扫码得到的信息 end-->

    <!--门卫扫码后访客得到的信息start-->
    <div v-else>
      <p v-if="vilidateQRCodeStatus === 1" class="title">您已扫码进校</p>
      <p v-else-if="vilidateQRCodeStatus === 0" class="title">未到来访时间（二维码有效期：08-24 11:00—18:00）</p>
      <p v-else-if="vilidateQRCodeStatus === 1 && info.visitStatus === 2" class="title">您已扫码离校</p>
      <p v-else class="title">无效信息</p>
      <p class="timeInfo">
        <span :class="info.status === 1? 'normalColor': info.status === 2? 'notTimeColor': 'invalidColor'">{{time}}s</span>后自动返回首页
      </p>
    </div>
    <!--门卫扫码后访客得到的信息end-->

  </div>
  <div class="button-box">
    <van-button plain hairline round  type="info" class="button" @click="goDetail">查看来访申请</van-button>
    <van-button round hairline type="info" class="button" @click="goHome">返回首页</van-button>
  </div>
</div>
</template>
<script>
  import {Button, Cell } from 'vant'
  import lst from '@/components/lst/Lst.vue'
  export default {
    name: 'scanningResults',
    components: {
      lst,
      [Button.name]: Button,
      [Cell.name]: Cell
    },
    props: {},
    data() {
      return {
        vilidateQRCodeStatus: 1, // 二维码状态 0-未到访校时间，1-可以访校，2-超过访校时间 4-各种错误
        type: 1, //标识 3=>门卫
        time:5,
        info: {
          lfName: '来访人姓名',
          selfApply:true,
          visitDate:'2020-02-25 07:45',
          leaveDate:'2020-02-25 07:45',
          actVisitTime: '2020-02-25 07:45',
          actLeaveTime: '2020-02-25 07:45',
          sfName:'受访人',
          sfDepart:'受访人部门',
          status: 2,// 0-未提交，1-待审批，2-已同意,4-已驳回，8-已撤销
          visitStatus:1, //未进校 = 0,已进校 = 1,已离校 = 2,过期未到访 = 4
          vilidateQRCodeStatus: 1, // 二维码状态 0-未到访校时间，1-可以访校，2-超过访校时间
          details:[{"name":"周震南"},{"name":"周震南1"},{"name":"周震南2"}]
        },
        details:[{"name":"周震南"},{"name":"周震南1"},{"name":"周震南2"}]
      }
    },
    created() {
      this.type = this.$route.query.type
      //TODO 扫码得到id 然后调用接口判断二维码是否有效以及用户数据
    },
    mounted() {
      if(!this.type){
        this.timer = setInterval(this.get, 1000);
      }
    },
    beforeDestroy() {
      clearInterval(this.timer);
    },
    methods: {
      // 查看详情
      goDetail(){
        if(type === '3'){
          this.$router.push({path: './guardDetail'})
        } else {
          this.$router.push({path: './VisitDetail'})
        }
      },
      //返回首页
      goHome(){
        this.$router.push({path: './userbind'})
      },
      get() {
        if (this.time <= 0){
          clearInterval(this.timer)
          this.goHome();
        } else {
          this.time--
        }
      }
    }
  };
</script>
<style lang="less" scoped>
.scanningResults{
.icon{
  width:100%;
  margin:30px auto 20px;
}
  .tip-info{
    font-size:14px;
    color:#999;
    .title{
      text-align: center;
      margin-bottom:12px;
      >span{
        display: block;
        text-align: center;
      }
    }
    .timeInfo{
      text-align: center;
    }
    .normalColor{
      color:@color1;
    }
    .notTimeColor{
      color:#fbc02d;
    }
    .invalidColor{
      color:@color2;
    }
  }
  /*信息*/
  .cell{
    border: 1px solid #e8e8e8;
    border-width: 1px 0;
    padding:22px 16px 20px;
    margin-top:40px;
  }
  .title-box {
    font-size: 14px;
    color: #999;
    text-align: left;
    padding-left: 12px;
    .accompany-people{
      span{
        display: inline-block;
        color:@color1;
        background:#f0f9eb;
        padding:3px 14px;
        border-radius: 8px;
        margin:8px 8px 8px 0;
      }
    }
  }
  /*按钮*/
  .button-box{
    display:flex;
    padding:28px 30px 34px;
    .button{
      flex:1;
    }
    .button:first-child{
      margin-right:16px;
    }
    .button:last-child{
      margin-left:16px;
    }
  }
}
</style>
