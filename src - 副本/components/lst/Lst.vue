<template>
  <van-cell v-if="item" :border="true" @click="clickCell(item)">
    <div slot="icon">
      <svg class="icon-head" aria-hidden="true">
        <use xlink:href="#icontouxiang1" v-if="item.selfApply"></use>
        <use xlink:href="#icontouxiang" v-else></use>
      </svg>
    </div>
    <div slot="title" class="info-content" :style="styleObject">
      <div class="left-box">
        <div class="title-box">
          <template v-if="showStatusType === 4">
            <p class="title">来访者：{{item.lfName}}</p>
            <span v-if="contentType === 8" class="sx-people-number">共{{item.details.length}}人</span>
          </template>
          <template v-if="showStatusType !== 4">
            <p class="title" v-if="item.selfApply">您提交的来访申请</p>
            <p class="title" v-if="!item.selfApply">
              <span>{{item.sfName}}提交的来访申请</span>
              <span class="selfApply">代提</span>
            </p>
          </template>
        </div>
      </div>
      <!-- 状态值 0-未提交，1-待审批，2-已同意,4-已驳回，8-已撤销 start -->
      <div class="right-box">
        <p class="create-time" v-if="showStatusType !== 4">{{item.createTime}}</p>
        <p v-if="showStatusType === 1" class="status-word">
          <span v-if="item.status === 0" class="status no-submit">未提交</span>
          <span v-if="item.status === 1" class="status wait-status">待审批</span>
          <span v-if="item.status === 2" class="status pass-status">已同意</span>
          <span v-if="item.status === 4" class="status refuse-status">已驳回</span>
          <span v-if="item.status === 8" class="status back-status">已撤销</span>
        </p>
      </div>
      <!-- 状态值 end -->

      <!-- 0-未提交，1-待审批，2-已同意,4-已驳回，8-已撤销 -->
      <svg v-if="showStatusType === 2" class="status-icon" aria-hidden="true">
        <use xlink:href="#iconweitijiao" v-if="item.status === 0"></use>
        <use xlink:href="#icondaishenpi" v-if="item.status === 1"></use>
        <use xlink:href="#iconyitongyi" v-if="item.status === 2"></use>
        <use xlink:href="#iconyibohui" v-if="item.status === 4"></use>
        <use xlink:href="#iconyichexiao" v-if="item.status === 8"></use>
      </svg>

      <div v-if="showStatusType === 4" class="right-box"><!--  未进校 = 0,已进校 = 1,已离校 = 2,过期未到访 = 4 -->
        <svg class="status-icon visitStatus-icon" aria-hidden="true">
          <use xlink:href="#icondaishenpi" v-if="item.visitStatus === 0"></use>
          <use xlink:href="#icontubiao-09" v-if="item.visitStatus === 1"></use>
          <use xlink:href="#icontubiao-10" v-if="item.visitStatus === 2"></use>
          <use xlink:href="#icontubiao-11" v-if="item.visitStatus === 4"></use>
        </svg>
      </div>

    </div>

    <div slot="label" class="label-box">

      <!-- 第一种 有区别的内容 访客 首页列表 start -->
      <div v-if="contentType === 1">
        <p class="lf-name text">受访人：{{item.sfName}} | {{item.sfDepart}}</p>
        <p v-if="item.status === 4" class="refuse-reason">{{item.rejectReason}}</p>
        <div v-if="item.visitStatus === 2"> <!-- 已离校 -->
          <p class="text">进校时间：{{item.actVisitTime}}</p>
          <p class="text">离校时间：{{item.actLeaveTime}}</p>
        </div>
        <div v-if="item.status === 2 && (item.visitStatus === 0 || item.visitStatus === 1)" class="qrcode-content">
          <lst-qrcode :item="item"></lst-qrcode>
          <p class="text desc">点击二维码可放大</p>
          <p class="text">二维码有效期: 09-05 06:00 — 09-20 18:00</p>
        </div>
      </div>
      <!-- 第一种 有区别的内容 访客 首页列表 end -->

      <!-- 第 2 种 有区别的内容 访客 所有列表 start -->
      <div v-if="contentType === 2">
        <p class="lf-name text">受访人：{{item.sfName}} | {{item.sfDepart}}</p>
        <p class="text">来访时间：{{item.visitDate}}</p>
        <p class="text">离开时间：{{item.leaveDate}}</p>
      </div>
      <!-- 第 2 种 有区别的内容 访客 所有列表 end -->

      <!-- 第 3 种 有区别的内容 访客 详细 start -->
      <div v-if="contentType === 3">
        <template v-if="item.status === 2 && item.visitStatus === 1">
          <p class="text">进校时间: {{item.actVisitTime}}</p>
          <p><span class="status-bg">已进校</span></p>
          <div class="qrcode-content">
            <lst-qrcode :item="item" class="qrcode-content"></lst-qrcode>
            <p class="text desc">点击二维码可放大</p>
            <p class="text">二维码有效期: 09-05 06:00 — 09-20 18:00</p>
          </div>
        </template>
        <template v-if="item.status === 2 && item.visitStatus === 0">
          <p><span class="status-bg">已同意</span></p>
          <div class="qrcode-content">
            <lst-qrcode :item="item" class="qrcode-content"></lst-qrcode>
            <p class="text desc">点击二维码可放大</p>
            <p class="text">二维码有效期: 09-05 06:00 — 09-20 18:00</p>
          </div>
        </template>
        <template v-if="item.status === 2 && item.visitStatus === 2">
          <p><span class="status-bg">已同意</span></p>
          <p class="text">进校时间: {{item.actVisitTime}}</p>
          <p class="text">离校时间: {{item.actLeaveTime}}</p>
        </template>
        <template v-if="item.status === 2 && item.visitStatus === 4">
          <p><span class="status-bg">过期未到访</span></p>
        </template>
        <template v-if="item.status === 4">
          <p><span class="status-bg">已驳回</span></p>
          <p v-if="item.status === 4" class="refuse-reason">{{item.rejectReason}}</p>
        </template>
        <template v-if="item.status === 1">
          <p><span class="status-bg">待审批</span></p>
        </template>
        <template v-if="item.status === 8">
          <p><span class="status-bg">已撤销</span></p>
        </template>
        <template v-if="item.status === 0">
          <p><span class="status-bg">未提交</span></p>
        </template>
      </div>
      <!-- 第 4 种 有区别的内容 门卫 所有列表 start -->
      <div v-if="contentType === 4">
        <div class="accompany-people">
          <span v-for="item in item.details">{{item.name}}</span>
        </div>
        <p class="lf-name text">受访人：{{item.sfName}} | {{item.sfDepart}}</p>
        <p class="text" v-if="item.visitStatus === 1 || item.visitStatus === 2">进校时间：{{item.actVisitTime}}</p>
        <p class="text" v-if="item.visitStatus === 4">离校时间：{{item.actLeaveTime}}</p>
      </div>
      <!-- 第 4种 有区别的内容 门卫 所有列表 end -->


      <!-- 第 5 种 有区别的内容 查询结果列表 start -->
      <div v-if="contentType === 8">
        <p class="text">来访日期 ：{{item.visitDate}}</p>
        <p class="text">离开时间：{{item.leaveDate}}</p>
        <p class="lf-name text">被访人：{{item.sfName}}</p>
      </div>
      <!-- 第 5 种 有区别的内容 查询结果列表 end -->
    </div>
  </van-cell>
</template>
<script>
  import QRCode from 'qrcodejs2'  // 引入qrcode
  import lstQrcode from './lstQrcode.vue'
  import { Cell } from 'vant'
  export default {
    name: 'lst',
    components: {
      lstQrcode,
      [Cell.name]: Cell
    },
    props: {
      item: {
        type: Object,
        default: null
      },
      showQrcode: { // 默认不显示二维码
        type: Boolean,
        default: false
      },
      showStatusType: { // 状态值显示类型：1 文字（审批），2 icon （审批）, 4 icon(门卫)
        type: Number,
        default: 1
      },
      contentType: { // 区别显示的不同内容，1 访客首页列表 4 门卫首页列表 8 查询结果列表
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        codeColor: '', // 二维码的颜色
        styleObject: {
          width: 0
        } // class = "info-content" 的样式
      }
    },
    created() {
      this.getClientWidth(); // 得到手机屏的宽度
    },

    mounted() {
    },

    destroyed() {},

    methods: {
      // 得到手机屏的宽度
      getClientWidth () {
        let clientWidth = document.body.clientWidth;
        this.styleObject.width = clientWidth - 32 - 40 + 'px'
      },
      // 点击 cell
      clickCell () {
        this.$emit('click')
      }
    }
  }
</script>
<style>
  .label-box .qrcode-content > .qrcode-img > img{
    display: inline-block !important;
  }
</style>
<style scoped lang="less">
  .icon-head{
    width: 40px;
    height: 40px;
  }
  .info-content{
    position: relative;
    width: 100%;
  }
  .left-box{
    position: relative;
    padding-right: 100px;
  }
  .title-box{
    padding-left: 12px;
  .title{
    color:#000;
    font-weight: bold;
  }
  .sx-people-number{
    position:absolute;
    right:0;top:0;
    color: #fff;
    padding: 0px 5px;
    background: @color1;
    border-radius: 0 16px 0 16px;
  }
  .selfApply{
    display: inline-block;
    margin-left: 8px;
    padding: 0 6px;
    font-size: 12px;
    color: #ff7537;
    background: #ffe0b2;
    text-align: center;
    vertical-align: middle;
    border-radius: 0 8px 0 8px;
  }
  }
  .right-box{
    position: absolute;
    right: 0;
    top: 0;
    width: 100px;
  .create-time{
    font-size: 12px;
    color: #999999;
    text-align: center;
  }
  .status-word{
    text-align: center;
  }
  .no-submit{
    color: #999999;
  }
  .pass-status{
    color: @color1;
  }
  .wait-status{
    color: @theme-color;
  }
  .back-status{
    color: #666666;
  }
  .refuse-status{
    color: @color2;
  }
  }

  .label-box{
    position: relative;
    width: 100%;
    padding-left: 14px;
    .text{
      padding: 2px 0 4px 0;
      color: #999999;
    }
    .lf-name{
      padding-right: 100px;
    }
    .refuse-reason{
      margin-top: 4px;
      padding: 8px;
      font-size: 12px;
      color: #333333;
      background-color: #f2f6f9;
    }
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
/* 有背景的状态 start*/
  .status-bg{
    display: inline-block;
    margin: 6px 0;
    padding: 2px 6px;
    font-size: 14px;
    color: #16a1fe;
    background-color: #e3f2fd;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
  }
  /* 有背景的状态 end */
  /* 二维码 start */
  .qrcode-content{
    margin: 10px 0 0 0;
    text-align: center;
    .qrcode-img{
      margin: 0 0 10px 0;
      padding-right: 40px;
    }
    .desc{
      padding-right: 40px;
    }
    .text{
      font-size: 10px;
      color: #999999;
    }
  }
  /* 二维码 end */
  .status-icon{
    position: absolute;
    top: 4px;
    right: -16px;
    width: 75px;
    height: 75px;
  }
  .visitStatus-icon{
    position:relative;
    top:-4px;
    height: 32px;
  }
</style>
