<template>
  <div class="visitRecordLst">
    <van-list
      :finished="finished"
      finished-text="没有更多了"
    >
      <van-cell title="" class="record">
        <div slot="icon" class="left-user-icon">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icontouxiang1" v-if="info.selfApply"></use>
            <use xlink:href="#icontouxiang" v-else></use>
          </svg>
        </div>
        <div slot="title" class="info">
          <p class="title">{{info.lfName}}提交的申请
            <span v-if="!info.selfApply">代提</span>
          </p>
          <p class="visit" v-if="info.visitStatus === 2 || info.visitStatus === 3 ">进校时间：{{info.visitDate}}</p>
          <p class="visit" v-if="info.visitStatus === 3">离校时间：{{info.leaveDate}}</p>
          <!--TODO 根据visitStatus状态值判断进校状态 1= 已同意 2、一进校 3、已离校 4、待审批 /5、已撤销 6、已驳回 7、过期未到访-->
          <p v-if="info.visitStatus === 1" class="visitStatusType">已同意</p>
          <p v-if="info.visitStatus === 2" class="visitStatusType">已进校</p>
          <p v-if="info.visitStatus === 3" class="visitStatusType">已离校</p>
          <p v-if="info.visitStatus === 4" class="visitStatusType">待审批</p>
          <p v-if="info.visitStatus === 6" class="visitStatusType">已驳回</p>
          <p v-if="info.visitStatus === 5" class="visitStatusType">已撤销</p>
          <p v-if="info.visitStatus === 7" class="visitStatusType">过期未到访</p>
          <!--二维码-->
          <div v-if="info.status === 2" class="codeBar">
            <div id="qrcode"></div> <!-- 创建一个div，并设置id为qrcode -->
            <p>点击二维码可放大</p>
            <p>二维码有效期：08-24 11:00—18:00</p>
          </div>
          <!--驳回原由-->
          <p class="reason" v-if="info.status === 4">{{info.rejectReason}}</p>
        </div>
        <div class="applyStatus">
          <p class="creat-time">{{info.createTime}}</p>
          <svg class="icon" aria-hidden="true" v-if="type">
            <use xlink:href="#iconyitongyi" v-if="info.status === 2"></use>
            <use xlink:href="#icondaishenpi" v-if="info.status === 1"></use>
            <use xlink:href="#iconyichexiao" v-if="info.status === 8"></use>
            <use xlink:href="#iconyibohui" v-if="info.status === 4"></use>
          </svg>
          <p v-else>
            <span v-if="info.status === 2" class="pass-status">已同意</span>
            <span v-if="info.status === 1" class="wait-status">待审批</span>
            <span v-if="info.status === 8" class="back-status">已撤销</span>
            <span v-if="info.status === 4" class="refuse-status">已驳回</span>
          </p>
          <div class="button-box" v-if="info.status === 2 && info.visitStatus === 1 && !info.selfApply">
            <van-button round hairline type="info" class="button" @click="save">分享二维码</van-button>
          </div>
        </div>
      </van-cell>
    </van-list>
  </div>
</template>
<script>
  import { Cell, List, Button } from 'vant';
  import QRCode from 'qrcodejs2'  // 引入qrcode
  export default {
    name: 'daice',
    components: {
      [Cell.name]: Cell,
      [List.name]: List,
      [Button.name]: Button
    },
    props: {
      data: Object,
      type: Number, // 1=》访客
      isDetail: Boolean // true =>详细
    },
    data() {
      return {
        loading: false,
        finished: false,
        info: []
      }
    },
    created() {
      this.info = this.data;
      if (this.info.status === 2){
        this.qrcode();
      }
    },

    mounted() {},

    destroyed() {},

    methods: {
      // 生成二维码
      qrcode() {
        this.$nextTick(()=>{
          let qrcode = new QRCode('qrcode', {
            width: 132,
            height: 132,
            text: 'https://www.baidu.com', // 二维码地址
            colorDark : "#6bc93f",
            colorLight : "#fff",
          })
        })
      }
    },
  };
</script>
<style lang="less" scoped>
  .visitRecordLst{
    .record{
      padding:20px 16px 0;
    }
    // 列表左侧icon
    .left-user-icon{
      .icon{
        width:40px;
        height:40px;
      }
    }
    // 中间信息内容
    .info{
      color:#999;
      margin-left:12px;
      .title{
        color:#000;
        font-weight: bold;
        span{
          display:inline-block;
          width:32px;
          height:16px;
          line-height: 16px;
          font-size:12px;
          color:#ff7537;
          background:#ffe0b2;
          text-align: center;
          vertical-align: middle;
          border-radius: 0 8px 0 8px;
          margin-left:6px;
        }
      }
      .visit{
        font-size:12px;
        margin-top:4px;
      }
      .visitStatusType{
        width:50px;
        line-height:16px;
        color:@theme-color;
        font-size:12px;
        text-align: center;
        margin-top:6px;
        background:@color3;
        border-radius: 8px;
      }
      /*二维码*/
      .codeBar{
        font-size: 10px;
        text-align: center;
        margin:14px 0 20px;
        #qrcode{
          margin-bottom:12px;
          img{
            margin:auto;
          }
        }
      }
      .reason{
        color:#333;
        background: #f2f6f9;
        border-radius:5px;
        padding:10px;
        margin:10px 0 20px;
      }
    }
    // 右侧申请时间以及状态
    .applyStatus{
      .creat-time{
        font-size: 10px;
        color:#999;
      }
      .icon{
        width:92px;
        height:92px;
      }
      .pass-status{
        color:@color1;
      }
      .wait-status{
        color:@theme-color;
      }
      .back-status{
        color:#666;
      }
      .refuse-status{
        color:@color2;
      }
      .button-box{
        .button{
          height:40px;
        }
      }
    }
  }
</style>
<style lang="less">
  .visitRecordLst{
    .van-cell__title{
      flex:2;
    }
  }
</style>
