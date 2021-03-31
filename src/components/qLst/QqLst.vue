<template>
  <van-cell v-if="item" :border="true" @click="clickCell(item)">
    <div slot="icon">
      <svg class="icon-head" aria-hidden="true">
        <use xlink:href="#icontouxiang1" v-if="item.selfApply"></use>
        <use xlink:href="#icontouxiang" v-else></use>
      </svg>
    </div>
    <div slot="title" class="info-content">
      <div class="left-box">
        <div class="title-box">
          <template v-if="contentType === 4">
            <p class="title">来访者: {{item.lfName}}</p>
          </template>
          <template v-else-if="contentType === 8">
            <p class="title">来访者: {{item.lfName}}</p>
            <span class="sx-people-number">共 {{(item.lfNum*1) +1}} 人</span>
          </template>
          <template v-else-if="contentType === 5">
            <p class="title">
              <template v-if="!item.selfApply">{{item.dtName}}</template>
              <template v-else>{{item.lfName}}</template>
              提交的来访申请
            </p>
          </template>
          <template v-else-if="contentType === 6">
            <p class="title">你代填报的来访申请</p>
          </template>
          <template v-else-if="contentType === 7 || contentType === 2">
            <p class="title" v-if="!item.selfApply">你代填报的来访申请</p>
            <p class="title" v-if="item.selfApply">
              <span>{{item.lfName}}提交的来访申请</span>
            </p>
          </template>
          <template v-else>
            <p class="title" v-if="item.selfApply">您提交的来访申请</p>
            <p class="title" v-if="!item.selfApply">
              <span>{{item.sfName}}提交的来访申请</span>
              <span class="selfApply">代提</span>
            </p>
          </template>
        </div>
      </div>
      <!-- 状态值 0-未提交，1-待审批，2-已同意,4-已驳回，8-已撤销 start -->
      <div class="right-box" v-if="showStatusType !== 8 && showStatusType !== 9">
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
      <!-- showStatusType = 9 受访者首页 已审批列表中 当前用户的审批状态 start -->
      <div class="right-box" v-if="showStatusType === 9">
        <p class="create-time">{{item.approvalTime}}</p>
        <p class="status-word">
          <span v-if="item.userState === 0" class="status wait-status">未审批</span> <!--  userState":"(0-未审批,1-退回,3-通过)"}-->
          <span v-if="item.userState === 1" class="status refuse-status">已驳回</span>
          <span v-if="item.userState === 3" class="status pass-status">通过</span>
        </p>
      </div>
      <!-- showStatusType = 9 受访者首页 已审批列表中 当前用户的审批状态 end -->

      <!-- 0-未提交，1-待审批，2-已同意,4-已驳回，8-已撤销 -->
      <svg v-if="showStatusType === 2" class="status-icon" aria-hidden="true">
        <use xlink:href="#iconweitijiao" v-if="item.status === 0"></use>
        <use xlink:href="#icondaishenpi" v-if="item.status === 1"></use>
        <use xlink:href="#iconyitongyi" v-if="item.status === 2"></use>
        <use xlink:href="#iconyibohui" v-if="item.status === 4"></use>
        <use xlink:href="#iconyichexiao" v-if="item.status === 8"></use>
      </svg>

      <div v-if="showStatusType === 4" class="right-box right-box4"><!--  visitStatus 未进校 = 0,已进校 = 1,已离校 = 2,过期未到访 = 4， 未到访校时间 8-->
        <svg class="status-icon4" aria-hidden="true">
          <use xlink:href="#icontubiao-11" v-if="item.visitStatus === 0"></use>
          <use xlink:href="#iconyijinxiao" v-if="item.visitStatus === 1"></use>
          <use xlink:href="#icontubiao-10" v-if="item.visitStatus === 2"></use>
          <use xlink:href="#icontubiao-16" v-if="item.visitStatus === 4"></use>
          <use xlink:href="#iconweidaofangxiaoshijian" v-if="item.visitStatus === 8"></use>
        </svg>
      </div>

    </div>

    <div slot="label" class="label-box">

      <!-- 第一种 有区别的内容 访客 首页列表 start -->
      <div v-if="contentType === 1">
        <p class="lf-name text">受访者: {{item.sfName}} | {{item.sfDepart}}</p>
        <p v-if="item.status === 4 && item.rejectReason" class="refuse-reason">{{item.rejectReason}}</p>
        <div v-if="item.visitStatus === 1"> <!-- 已进校 -->
          <p class="text">进校时间: {{item.actVisitTime}}</p>
        </div>
        <div v-if="item.visitStatus === 2"> <!-- 已离校 -->
          <p class="text">进校时间: {{item.actVisitTime}}</p>
          <p class="text">离校时间: {{item.actLeaveTime}}</p>
        </div>
        <div v-if="item.status === 2 && item.visitStatus !== 4" class="qrcode-content">
          <lst-qrcode :item="item"></lst-qrcode>
          <p class="text desc">点击二维码可放大</p>
          <p class="text">二维码有效期: {{item.visitDate}} — {{item.leaveDate}}</p>
        </div>
      </div>
      <!-- 第一种 有区别的内容 访客 首页列表 end -->

      <!-- 第 2 种 有区别的内容 访客 查询结果列表 start -->
      <div v-else-if="contentType === 2">
        <p class="lf-name text">受访者: {{item.sfName}} | {{item.sfDepart}}</p>
        <p class="text">来访时间: {{item.visitDate}}</p>
        <p class="text">离开时间: {{item.leaveDate}}</p>
      </div>
      <!-- 第 2 种 有区别的内容 访客 查询结果列表 end -->

      <!-- 第 3 种 有区别的内容 访客 详细 start -->
      <div v-else-if="contentType === 3">
        <template v-if="item.status === 2 && item.visitStatus === 1">
          <p class="text">进校时间: {{item.actVisitTime}}</p>
          <p><span class="status-bg">已进校</span></p>
          <div class="qrcode-content">
            <lst-qrcode :item="item"></lst-qrcode>
            <p class="text desc">点击二维码可放大</p>
            <p class="text">二维码有效期: {{item.visitDate}} — {{item.leaveDate}}</p>
          </div>
        </template>
        <template v-if="item.status === 2 && (item.visitStatus === 0 || item.visitStatus === 8)">
          <p><span class="status-bg">已同意</span></p>
          <div class="qrcode-content">
            <lst-qrcode :item="item"></lst-qrcode>
            <p class="text desc">点击二维码可放大</p>
            <p class="text">二维码有效期: {{item.visitDate}} — {{item.leaveDate}}</p>
          </div>
        </template>
        <template v-if="item.status === 2 && item.visitStatus === 2">
          <p><span class="status-bg">已同意</span></p>
          <p class="text">进校时间: {{item.actVisitTime}}</p>
          <p class="text">离校时间: {{item.actLeaveTime}}</p>
          <div class="qrcode-content">
            <lst-qrcode :item="item"></lst-qrcode>
            <p class="text desc">点击二维码可放大</p>
            <p class="text">二维码有效期: {{item.visitDate}} — {{item.leaveDate}}</p>
          </div>
        </template>
        <template v-if="item.status === 2 && item.visitStatus === 4">
          <p><span class="status-bg">过期未到访</span></p>
        </template>
        <template v-if="item.status === 4">
          <p><span class="status-bg">已驳回</span></p>
          <p v-if="item.status === 4 && item.rejectReason" class="refuse-reason">{{item.rejectReason}}</p>
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
      <!-- 第 4 种 有区别的内容 门卫 ; 门卫扫码 访客结果 首页 start -->
      <div v-else-if="contentType === 4">
        <div class="accompany-people">
          <span v-for="sfrItem in item.details" v-if="sfrItem">{{sfrItem.name}}</span>
        </div>
        <p class="lf-name text">受访者：{{item.sfName}} | {{item.sfDepart}}</p>
        <p class="text" v-if="item.visitStatus === 1 || item.visitStatus === 2">进校时间: {{item.actVisitTime}}</p>
        <p class="text" v-if="item.visitStatus === 2">离校时间: {{item.actLeaveTime}}</p>
      </div>
      <!-- 第 4 种 有区别的内容 门卫；门卫扫码 访客结果 首页 end -->

      <!-- 第 4 种 有区别的内容 门卫 详情 start -->
      <div v-else-if="contentType === 9">
        <p class="lf-name text">受访者：{{item.sfName}} | {{item.sfDepart}}</p>
        <p class="text" v-if="item.visitStatus === 1 || item.visitStatus === 2">进校时间: {{item.actVisitTime}}</p>
        <p class="text" v-if="item.visitStatus === 2">离校时间: {{item.actLeaveTime}}</p>
      </div>
      <!-- 第 4 种 有区别的内容 门卫 详情 end -->

      <!-- 第 5 种 有区别的内容 受访者首页待审批 已审l批 代填报6 列表 start  -->
      <div v-else-if="contentType === 5">
        <p class="lf-name text">来访者: {{item.lfName}}</p>
        <p class="text">来访日期: {{item.visitDate}}</p>
        <p class="text">离开时间: {{item.leaveDate}}</p>
      </div>
      <!-- 第 5 种 有区别的内容 受访者首页待审批 已审批 列表 end  -->
      <!-- 第 6 种 有区别的内容 受访者首页 代填报6 列表 start  -->
      <div v-else-if="contentType === 6">
        <p class="lf-name text">来访者: {{item.lfName}} | 共{{(item.lfNum*1) + 1}}人</p>
        <p class="text">来访日期: {{item.visitDate}}</p>
        <p class="text">离开时间: {{item.leaveDate}}</p>
      </div>
      <!-- 第 6 种 有区别的内容 受访者首页 代填报6 列表 end  -->

      <!-- 第 7 种 有区别的内容 受访者 详情 列表 start  -->
      <div v-else-if="contentType === 7">
        <template v-if="item.status === 2 && item.visitStatus === 1">
          <p class="text">进校时间: {{item.actVisitTime}}</p>
          <p><span class="status-bg">已进校</span></p>
          <div class="qrcode-content qrcode-content-lf">
            <lst-qrcode :item="item"></lst-qrcode>
            <p class="text desc">点击二维码可放大</p>
            <p class="text">二维码有效期: {{item.visitDate}} — {{item.leaveDate}}</p>
            <van-button class="btn share-btn" type="primary" size="normal" @click="doShareCode(item.id, item.sfName)">分享二维码</van-button>
          </div>
        </template>
        <template v-if="item.status === 2 && (item.visitStatus === 0 || item.visitStatus === 8)">
          <p><span class="status-bg">已同意</span></p>
          <div class="qrcode-content qrcode-content-lf">
            <lst-qrcode :item="item"></lst-qrcode>
            <p class="text desc">点击二维码可放大</p>
            <p class="text">二维码有效期: {{item.visitDate}} — {{item.leaveDate}}</p>
            <van-button class="btn share-btn" type="primary" size="normal" @click="doShareCode(item.id, item.sfName)">分享二维码</van-button>
          </div>
        </template>
        <template v-if="item.status === 2 && item.visitStatus === 2">
          <p><span class="status-bg">已同意</span></p>
          <p class="text">进校时间: {{item.actVisitTime}}</p>
          <p class="text">离校时间: {{item.actLeaveTime}}</p>
          <div class="qrcode-content qrcode-content-lf">
            <lst-qrcode :item="item"></lst-qrcode>
            <p class="text desc">点击二维码可放大</p>
            <p class="text">二维码有效期: {{item.visitDate}} — {{item.leaveDate}}</p>
            <van-button class="btn share-btn" type="primary" size="normal" @click="doShareCode(item.id, item.sfName)">分享二维码</van-button>
          </div>
        </template>
        <template v-if="item.status === 2 && item.visitStatus === 4">
          <p><span class="status-bg">过期未到访</span></p>
        </template>
        <template v-if="item.status === 4">
          <p><span class="status-bg">已驳回</span></p>
          <p v-if="item.status === 4 && item.rejectReason" class="refuse-reason">{{item.rejectReason}}</p>
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
      <!-- 第 7 种 有区别的内容 受访者 详情 列表 end  -->

      <!-- 第 8 种 有区别的内容 受访者 查询结果列表 start -->
      <div v-else-if="contentType === 8">
        <p class="text">来访日期: {{item.visitDate}}</p>
        <p class="text">离开时间: {{item.leaveDate}}</p>
        <p class="lf-name text">被访者: {{item.sfName}}</p>
      </div>
      <!-- 第 8 种 有区别的内容 受访者 查询结果列表 end -->

    </div>
  </van-cell>
</template>
<script>
  import lstQrcode from './QqQrcode.vue'
  import { Cell, Button } from 'vant'
  export default {
    name: 'qqlst',
    components: {
      lstQrcode,
      [Cell.name]: Cell,
      [Button.name]: Button
    },
    props: {
      item: {
        type: Object,
        default: null
      },
      showStatusType: { // 状态值显示类型：0 (不显示任何状态值) , 1 文字（审批），2 icon （审批）, 4 icon(门卫)
        type: Number,
        default: 1
      },
      contentType: { // 区别显示的不同内容，1 访客首页列表 4 门卫首页列表 8 门卫查询结果列表
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        codeColor: '' // 二维码的颜色
      }
    },
    created() {
    },

    mounted() {
    },

    destroyed() {},

    methods: {
      // 点击 cell
      clickCell () {
        this.$emit('click')
      },
      // 点击分享二维码
      doShareCode (id, sfName) {
        let url = window.location.href;
        url = url.substring(0, url.lastIndexOf("/")+1);
        url += "enlargeCode?id="+ id;
        console.log("start ..doShareCode ", url);
        this.QD.doShareFriend(url, sfName);
      }
    }
  }
</script>
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
    word-break: break-all;
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
      padding: 0 5px;
      background: @color1;
      border-radius: 0 16px 0 16px;
    }
  .selfApply{
    display: inline-block;
    margin-left: 8px;
    padding: 2px 6px;
    font-size: 12px;
    color: #ff7537;
    background: #ffe0b2;
    text-align: center;
    vertical-align: middle;
    border-radius: 0 8px 0 8px;
    line-height: normal;
  }
  }
  .right-box{
    position: absolute;
    right: -10px;
    top: 0;
    width: 116px;
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
  .right-box4{
    text-align: right;
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
      display: inline-block;
      width: 100px;
      margin: 0 40px 10px 0;
    }
    .desc{
      padding-right: 40px;
    }
    .text{
      font-size: 10px;
      color: #999999;
    }
  }
  .qrcode-content-lf{
    position: relative;
    text-align: left;
    .share-btn{
      position: absolute;
      right: 10px;
      top: 50px;
      padding: 0 25px 0 25px;
      color: #ffffff;
      border-radius: 30px;
      border: 1px solid @theme-color;
      background-color: @theme-color;
    }
  }
  /* 二维码 end */
  .status-icon{
    position: absolute;
    top: 4px;
    right: -16px;
    width: 75px;
    height: 75px;
    z-index: 10;
  }

  .status-icon4{
    position: relative;
    top: -4px;
    height: 32px;
    width: 100px;
    z-index: 10;
  }
</style>
