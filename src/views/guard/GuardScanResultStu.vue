<template>
  <div class="guard-scan-result-stu" v-if="info">
    <svg class="icon-svg" aria-hidden="true">
      <use xlink:href="#icontubiao-05" v-if="info.allow === true"></use>
      <use xlink:href="#icontubiao-06" v-else></use>
    </svg>
    <div class="tip-info">
      <!-- 允许通行时间 start ... type: 允许通行时：通用规则=0; 请假=1; 特殊学生=2; 走读生=3; 留宿生=4 -->
      <div v-if="info.allow">
        <p class="desc">允许通行</p>

        <div class="time-box regular-time">
          <p class="time-title-block">
            <span class="icon-visitor clock-icon">&#xe634;</span>
            <span class="time-title">出入时段</span>
          </p>
          <span class="time-text">{{info.starttime}}</span>
          <span class="icon-visitor line-icon">&#xe603;</span>
          <span class="time-text">{{info.endtime}}</span>
        </div>
      </div>
      <!-- 允许通行时间 end -->
      <div v-else-if="!info.allow">
        <p class="desc">不允许通行</p>
      </div>
    </div>
   <!-- 学生信息 start -->
    <van-cell class="user-content" :border="false">
      <div slot="icon">
        <div class="head-img" :style="`background-image:url(${QD.StuPlat + info.stuPhoto})`"></div>
      </div>
      <div slot="title" class="info-content">
        <p class="user-text clearfloat">
          <span class="lf">姓名: </span>
          <span class="rg" :style="`padding-left: ${16*2 + 12}px`">{{info.stuname}}</span>
        </p>
        <p class="user-text clearfloat">
          <span class="lf">班级: </span>
          <span class="rg" :style="`padding-left: ${16*2 + 12}px`">{{info.classname}}</span>
        </p>
        <p class="user-text clearfloat">
          <span class="lf">班主任: </span>
          <span class="rg" :style="`padding-left: ${16*3 + 12}px`">{{info.bzrxm}}</span>
        </p>
      </div>
    </van-cell>
    <!-- 学生信息 end -->
    <!-- 可以出入校的原因 start -->
    <!--需要显示原因：如：请假（请假的时间范围）、
    特殊学生（有个 备注 需要显示）、
    走读生（如：改生是走读生）、
    留宿学生（通行时间范围）-->
    <!-- type: 允许通行时：通用规则=0; 请假=1; 特殊学生=2; 走读生=3; 留宿生=4 -->
    <div class="reason-box" v-if="info.allow && info.type !== '0'">
      <div class="reason-cell clearfloat">
        <div class="lf">
          <svg class="icon-circle" aria-hidden="true">
            <use xlink:href="#iconyuanquan1"></use>
          </svg>
          <span class="reason-title">允许出入原因:</span>
        </div>
        <div class="rg" :style="`padding-left: ${14*6 + 26}px`">
          <span v-if="info.type === '1'">请假</span>
          <span v-if="info.type === '2'">特殊学生</span>
          <span v-if="info.type === '3'">走读生</span>
          <span v-if="info.type === '4'">留宿生</span>
        </div>
      </div>

      <div v-if="info.type === '1'" class="reason-cell clearfloat">
        <div class="lf">
          <svg class="icon-circle" aria-hidden="true">
            <use xlink:href="#iconyuanquan1"></use>
          </svg>
          <span class="reason-title">请假时间:</span>
        </div>
        <div class="rg" :style="`padding-left: ${14*4 + 26}px`">
          <span class="time-text vertical-middle">{{info.starttime}}</span>
          <span class="icon-visitor line-icon vertical-middle">&#xe603;</span>
          <span class="time-text vertical-middle">{{info.endtime}}</span>
        </div>
      </div>

      <div v-if="info.type === '2'" class="reason-cell clearfloat">
        <div class="lf">
          <svg class="icon-circle" aria-hidden="true">
            <use xlink:href="#iconyuanquan1"></use>
          </svg>
          <span class="reason-title">备注: </span>
        </div>
        <div class="rg" :style="`padding-left: ${14*2 + 26}px`">
         <span class="rg-text">{{info.remark}}</span>
        </div>
      </div>

    </div>
    <!-- 可以出校的原因 end -->
  </div>
</template>
<script>
  import { Cell } from 'vant'
  import { mapActions } from 'vuex'
  export default {
    name: 'guardScanResultStu',
    components: {
      [Cell.name]: Cell
    },
    props: {},
    data() {
      return {
        info: null // 学生扫码结果
      }
    },
    created() {
      this.getVisitQRCodeData();
    },
    mounted() {
    },
    methods: {
      ...mapActions([
        'updateLoadingStatus'
      ]),
      // 得到扫码结果 api/StuManage/CampusCardApi/CampusCardInfo
      async getVisitQRCodeData () {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'apiVisitor.GetVisitQRCodeData',
          jsonData: JSON.stringify({key: this.$route.query.xh, keyType: 1})
        });
        this.updateLoadingStatus(false);
        d = JSON.parse(d);
        console.log("code result", d);
        if (d.status && d.status === "error" ) {
          this.QD.alert({title: '温馨提示', message: '获取扫码结果失败'});
          return;
        }
        this.info = d.data;
      }
    }
  };
</script>
<style lang="less" scoped>
  .icon-svg {
    width: 100%;
    margin: 30px auto 20px;
  }
  .tip-info {
    margin-bottom: 20px;
    color: #999;
    text-align: center;
    .desc {
      font-size: 14px;
    }
    .time-box{
      padding: 10px 0;
      .time-title-block{
        padding: 10px 0;
      }
      .clock-icon{
        padding-right: 4px;
        font-size: 18px;
        vertical-align: middle;
      }
      .time-title{
        font-size: 14px;
        font-weight: bold;
        vertical-align: middle;
      }
      .time-text{
        display: inline-block;
        margin: 0 4px;
        padding: 4px;
        font-size: 16px;
        font-weight: bold;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
      }
      .line-icon{
        font-size: 14px;
      }
    }
    .regular-time{
      .clock-icon{
        color: @color1;
      }
      .time-text{
        color: @color1;
        background-color: rgba(107, 201, 63, 0.1)
      }
      .line-icon{
        color: @color1;
      }
    }
    /* 不是通用规则的时间通行 */
    /*.irregular-time{
      .clock-icon{
        color: @color2;
      }
      .time-text{
        color: @color2;
        background-color: rgba(254, 90, 89, 0.1)
      }
      .line-icon{
        color: @color2;
      }
    }*/
  }
  /* 用户信息 */
  .user-content{
    position: relative;
    padding: 24px 16px;
    border-top: 1px solid #e8e8e8;
    .head-img{
      width: 85px;
      height: 85px;
      margin-right: 14px;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center center;
    }
    .user-text{
      position: relative;
      min-height: 28px;
      padding: 2px 0 2px 0;
      font-size: 16px;
      color: #000000;
      .rg,
      .lf{
        position: relative;
        float: left;
      }
      .lf{
        position: absolute;
      }
      .rg{
        width: 100%;
      }
    }
  }
  /* 出入原因 */
  .reason-box{
    position: relative;
    margin: 0 16px 20px 16px;
    padding: 8px 4px 8px 18px;
    background-color: #fef7e7;
    border-radius: 10px;
    .reason-cell{
      position: relative;
      min-height: 32px;
      padding: 8px 10px;
    }
    .line-icon{
      color: #333333;
      font-size: 14px;
    }
    .rg,
    .lf{
      position: relative;
      float: left;
      font-size: 14px;
      color: #333333;
    }
    .lf{
      position: absolute;
    }
    .rg{
      width: 100%;
    }
    .icon-circle{
      width: 14px;
      height: 14px;
      margin: 0 4px 0 0;
      vertical-align: middle;
    }
    .reason-title{
      vertical-align: middle;
    }
    .vertical-middle{
      vertical-align: middle;
    }
    .rg-text{
      line-height: 16px;
    }
  }
</style>
