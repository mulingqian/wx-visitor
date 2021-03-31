<template>
  <div class="guardInformationConfirm" v-if="this.info">

    <!--上部分信息 start-->
    <div class="header">

      <!--头部icon start-->
      <div class="lf-icon">
        <p class="lf-top"></p>
        <p class="icon-box">
          <svg class="icon-head" aria-hidden="true">
            <use xlink:href="#icontouxiang1"></use>
          </svg>
        </p>
      </div>
      <!--头部icon end-->

      <!--来访者 信息 start-->
      <div class="lf-info">
        <div class="lf-name">
          <span>来访者</span>
          <p class="lfName">
            <span v-for="item in info.lfName">{{item}}</span>
          </p>
          <span class="switch-icon">
            <van-switch
              v-model="info.enterSchool"
              size="24px"
              active-color="#6bc93f"
              inactive-color="#cccccc"/>
            <span v-if="info.enterSchool" class="lf-stauts">进校</span>
            <span v-else>离校</span>
          </span>
        </div>
        <!--步骤条 start-->
        <div class="step-box">
          <p class="step">
            <span></span>
            <span></span>
          </p>
          <div class="lfAndLeaveDate clearfloat">
            <p class="lf-date">
              <span>来访日期</span>
              <span class="date">{{info.visitDate}}</span></p>
            <p class="leave-date">
              <span>离开日期</span>
              <span class="date">{{info.leaveDate}}</span></p>
          </div>
        </div>
        <!--步骤条 end-->
        <!--证件、单位、受访人 start-->
        <p class="company">
          <span class="icon-visitor company-icon">&#xe674;</span>
          <span>证件号码：</span>
          <span>{{info.zjhm}}</span>
        </p>
        <p class="company">
          <span class="icon-visitor company-icon">&#xe674;</span>
          <span>来访者单位：</span>
          <span>{{info.lfCompany}}</span>
        </p>
        <p class="company">
          <span class="icon-visitor company-icon">&#xe674;</span>
          <span>受访人：</span>
          <span>{{info.sfName}} | {{info.sfDepart}}</span>
        </p>
        <!--证件、单位、受访人 end-->
      </div>
      <!--来访者 信息 end-->
    </div>
    <!--上部分信息 end-->

    <!--随访人 start-->
    <div class="sfr-box">
      <!--左滑可删除随访人 start-->
      <p class="allCheck">
        <span class="icon-visitor msg-icon">&#xe657;</span>
        <span class="tip">左滑可删除随访人</span>
        <van-radio-group v-model="enterORleaveSchoolStatus" direction="horizontal" class="checkEnterSchoolStatus">
          <van-radio name="1" class="allEnterSchool" checked-color="#6bc93f">全部进校</van-radio>
          <van-radio name="2" class="allLeaveSchool" checked-color="#6bc93f">全部离校</van-radio>
        </van-radio-group>
      </p>
      <!--左滑可删除随访人 end-->

      <!--请选择随访人到校状态 start-->
      <div class="choose-sfr-status clearfloat">
        <p style="float:left">请选择随访人到校状态</p>
        <p class="choose-status">
          <span>未到校</span><span>进校</span><span>离校</span>
        </p>
      </div>
      <!--请选择随访人到校状态 end-->

      <div class="sfrBox">
        <van-swipe-cell class="sfr-item" v-for="(sfrItem, sfrIdx) in info.details" v-if="info.details.length>0">
          <van-cell :border="false" class="cell">
            <div slot="icon" style="width:100%;display: flex">
              <svg class="icon-head sfr-icon" aria-hidden="true" @touchstart.prevent="delSFR(sfrItem, sfrIdx)"  @touchend.prevent="cleartime(sfrIdx)">
                <use xlink:href="#icontouxiang1"></use>
              </svg>
              <span class="sfr-title">随访人{{sfrIdx+1}}</span>
              <span class="sfr-name">
                <input type="text" v-model="sfrItem.name" placeholder="请输入随访人姓名" class="sfr-input" style="border:transparent;color:#333;width:100%;">
          </span>
            </div>
            <div slot="title" class="sfr-status">
              <div class="line-box">
                <span class="line-inline"></span>
              </div>
              <span class="no-enter-status" :class="sfrItem.visitStatus === 0? 'check-no-enter-school': ''" @click="checkSfrStatus(sfrItem, sfrIdx, 0)"></span>
              <span :class="sfrItem.visitStatus === 1? 'check-enter-school':''" @click="checkSfrStatus(sfrItem, sfrIdx, 1)"></span>
              <span class="leave-stauts" :class="sfrItem.visitStatus === 2? 'check-leave-school': ''" @click="checkSfrStatus(sfrItem, sfrIdx, 2)"></span>
            </div>
          </van-cell>
          <template #right>
            <van-button class="delete-button" square type="danger" color="#FE5A59" text="删除" @click="delSFR(sfrItem, sfrIdx)" />
          </template>
        </van-swipe-cell>


      </div>
    </div>
    <!--随访人 end-->
    <!--添加随访人 start-->
     <div class="addSFR-box">
       <p @click="addSFR">添加随访人</p>
     </div>
    <!--添加随访人 end-->
    <div class="confirm">
      <span @click="confirmBtn">确认</span>
    </div>
  </div>
</template>
<script>
  import { Popup, Button, RadioGroup, Radio, SwipeCell, Cell, Switch, Step, Steps, Card } from 'vant';
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'guardInformationConfirm',

    components: {
      [Popup.name]: Popup,
      [Button.name]: Button,
      [RadioGroup.name]: RadioGroup,
      [Radio.name]: Radio,
      [SwipeCell.name]: SwipeCell,
      [Cell.name]: Cell,
      [Switch.name]: Switch,
      [Step.name]: Step,
      [Steps.name]: Steps,
      [Card.name]: Card
    },

    props: {},

    data() {
      return {
        enterORleaveSchoolStatus: '0', // 是否全进校或者全部离校
        info: {}
      }
    },
    watch: {
      // 全部进校或者全部离校 1=>全部进校  2=>全部离校
      enterORleaveSchoolStatus (val){
        if (val === '1'){
          this.info.details.forEach(item=> {
            item.visitStatus = 1
          })
        }else if (val === '2'){
          this.info.details.forEach(item=> {
            item.visitStatus = 2
          })
        }
      }
    },
    created() {
      this.getVisitQRCodeData(); // 扫码结果
    },

    mounted() {},

    destroyed() {},

    methods: {
      ...mapActions([
        'updateLoadingStatus'
      ]),
      // 选择随访人状态
      checkSfrStatus (item, index, status) {
        item.visitStatus = status
      },
      // 添加随访人
      addSFR(){
        let obj={name: '', visitStatus: 0}
        this.info.details.push(obj)
      },
      // 删除随访人
      delSFR(item, index) {
        let that = this;
        this.QD.confirm({title: '温馨提示', message: '确定要删除随访人吗？'}, function(){
          that.info.details.splice(index, 1)
          that.deleteVisitorData(item.id); // 删除随访人
        })
      },
      // 确认按钮
      confirmBtn (){
       this.setVisitorData(); // 保存或修改随访人及状态
      },
      // 保存或修改随访人及状态
      async setVisitorData () {
        this.updateLoadingStatus(true);
        let details =[]
        for (var i=0; i<this.info.details.length; i++) {
          if (this.info.details[i].name.trim() !== ''){
            let obj = {
              "DetailId":this.info.details[i].id,
              "ParentId":this.$route.query.id,
              "Name":this.info.details[i].name,
              "Confirmed":true,
              "VisitedStatus":this.info.details[i].visitStatus
            }
            details .push(obj)
          }
        }
        // 判断来访者是进校还是来校 1-已进校，2-已离校
        if (this.info.enterSchool) {
          this.info.visitStatus = 1;
        } else {
          this.info.visitStatus = 2;
        }
        let obj={applyId: this.$route.query.id, visitStatus:this.info.visitStatus, details}
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'apiVisitor.SetVisitorData',
          jsonData: JSON.stringify(obj)
        });
        this.updateLoadingStatus(false);
        console.log("code result", d);
        if (d.status && d.status === "error" ) {
          this.QD.alert({title: '温馨提示', message: '确认随访人信息失败'});
          return;
        }
        this.$router.replace({path: "/guardScanResult", query: {id: this.$route.query.id}})
      },
      // 删除随访人
      async deleteVisitorData (id) {
        this.updateLoadingStatus(true);
        let req=[]
        req.push(id)
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'apiVisitor.DeleteVisitorData',
          jsonData: JSON.stringify(req)
        });
        this.updateLoadingStatus(false);
        if (d.status && d.status === "error" ) {
          this.QD.alert({title: '温馨提示', message: '删除随访人信息失败'});
          return;
        }
      },
      // 得到扫码结果
      async getVisitQRCodeData () {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'apiVisitor.GetVisitQRCodeData',
          jsonData: JSON.stringify({key: this.$route.query.id, keyType: 0})
        });
        this.updateLoadingStatus(false);
        if (d.status && d.status === "error" ) {
          this.QD.alert({title: '温馨提示', message: '获取扫码结果失败'});
          return;
        }
        this.info = d.data;
        // 0-未进校，1-已进校，2-已离校，4-过期未到访，8-未到时间
        if (this.info.visitStatus === 1){
          this.$set(this.info, 'enterSchool', true)
        } else if (this.info.visitStatus === 4){
          let that=this;
          this.QD.alert({title: '温馨提示', message: '已过申请的进校时间,不允许进校'}, function(){
            that.$router.go(-1)
          })
        } else if (this.info.visitStatus === 8){
          let that=this;
          this.QD.alert({title: '温馨提示', message: '未到进校时间'},function(){
            that.$router.go(-1)
          })
        } else {
          this.$set(this.info, 'enterSchool', false)
        }
      }
    }
  };
</script>
<style lang="less" scoped>
  .guardInformationConfirm{
    /*头部icon start*/
    .lf-icon{
      position:relative;
      height:120px;
    }
    .lf-top{
      height:68px;
      background: @theme-color;
    }
    .icon-box{
      position: absolute;
      top: 50%;
      left: 50%;
      margin: auto;
      width: 72px;
      height: 72px;
      border-radius: 100%;
      background: #fff;
      text-align: center;
      transform: translate(-50%, -50%);
      .icon-head{
        width: 64px;
        height: 64px;
        margin-top:4px;
      }
    }
    /*头部icon end*/

    /*头部来访者信息 start*/
    .lf-info{
      padding-bottom:20px;
      .lf-name{
        position: relative;
        margin-bottom:12px;
        color:#333;
        font-size: 14px;
        text-align: center;
        .lfName{
          display: inline-block;
          margin-left:6px;
          /*position: relative;*/
          margin-right: 22px;
          /*margin-top:4px;*/
          /*padding: 12px;*/
          font-size: 16px;
          color:@color1;
          font-weight: bold;
          span{
            padding:6px 4px;
            margin-right:4px;
            line-height: 36px;
            background: #f0f9eb;
          }
        }
        .switch-icon{
          position: absolute;
          right: 16px;
          margin-top:2px;
          color: @color4;
          font-size: 24px;
          >span{
            position:relative;
            top:-8px;
            margin-left:8px;
            font-size: 12px;
            color:#999;
          }
          .lf-stauts{
            color:@color1;
          }
        }
      }
    }
    /*进度条 start*/
    .step-box{
      margin:22px 36px 0;
      padding-bottom:14px;
      .step{
        background: @color1;
        height:1px;
        span{
          position:relative;
          top:-9px;
          display: inline-block;
          width:8px;
          height:8px;
          border-radius:100%;
          box-shadow: 0 0 0 4px @color1;
          background:#fff;
        }
        span:first-child{
          left:21%;
        }
        span{
          left:79%;
        }
      }
      /*来访日期和离开日期*/
      .lfAndLeaveDate{
        display: flex;
        margin: 14px 0  20px;
        color:#999;
        font-size: 14px;
        >p{
          position:relative;
          width:50%;
        }
        .lf-date{
          float:left;
        }
        .leave-date{
          float:right;
        }
        .date{
          position: absolute;
          margin-left:8px;
          /*width: 100%;*/
          color:@color1;
        }
      }
    }
    /*进度条 end*/


  /*证件、单位、受访人 start*/
    .company{
      margin:0 36px 12px;
      color:#333;
      font-size: 14px;
      .company-icon{
        margin-right:4px;
        color:@color1;
        font-size: 16px;
        vertical-align: middle;
      }
    }
    /*证件、单位、受访人 end*/


    .header:after{
      content: '';
      display: block;
      height:8px;
      background:#f5f5f5;
    }
  /*头部来访者信息 end*/


  /*<!--随访人 start-->*/
    .sfr-box{
      /*全选 start*/
      .allCheck{
        padding:20px 16px;
        color:#cbcbcb;
        border-bottom:1px solid #e8e8e8;
        .msg-icon{
          position: relative;
          top: 4px;
          margin-right:8px;
          font-size: 22px;
          color:#cbcbcb;
        }
        .tip{
          font-size: 12px;
        }
        .checkEnterSchoolStatus{
          display: inline-block;
          float:right;
          .allEnterSchool,
          .allLeaveSchool{
            display: inline-block;
          }
        }
        .all-check-icon{
          float:right;
          color:#333;
          font-size: 14px;
          i{
            margin-left:8px;
            color:#cbcbcb;
            font-size: 24px;
            vertical-align: middle;
            font-style: normal;
          }
          .check-icon{
            color:@color4;
          }
        }
      }
      /*全选 end*/

    /*请选择随访人到校状态 start*/
      .choose-sfr-status{
        margin-top: 20px;
        padding: 0 16px;
        color:#333;
        font-size: 10px;
        .choose-status{
          float:right;
          span{
            margin-left:34px;
          }
        }
      }
      /*请选择随访人到校状态 end*/

      /*随访人 状态 start*/
      .sfrBox{
        margin: 0 13px;
        .sfr-item{
          padding: 20px 0;
          font-size: 14px;
          border-bottom:1px solid #e8e8e8;
          .cell{
            padding:0;
          }
          .sfr-icon{
            width:48px;
            height:48px;
            vertical-align: middle;
          }
          .sfr-title{
            margin: 0 10px 0 8px;
            color:#999;
          }
          .sfr-name{
            color:#333;
            .sfr-input{
              margin-top:10px;
              width:100%;
              color:#333;
              border:transparent;
            }
          }
          .sfr-status{
            position: relative;
            top: 10px;
            width:150px;
            >span{
              display: inline-block;
              margin-right:56px;
              width:6px;
              height:6px;
              border-radius: 100%;
              background:#ccc;
              position: relative;
              left: 2px;
              vertical-align: super;
            }
            .leave-stauts{
              margin-right:0;
            }
            .leave-stauts:after{
              display: none;
            }
            .check-school-status{
              display: inline-block;
              width:16px;
              height:16px;
              border-radius: 100%;
              background:#ccc;
            }
            // 未进校
            .check-no-enter-school,
            .check-enter-school,
            .check-leave-school{
              position: relative;
              top: 4px;
              z-index: 1;
              padding:8px;
              border-radius: 100%;
              background:@color4;
            }
            // 已进校
            .check-enter-school{
              background:@color1;
            }
            // 已离校
            .check-leave-school{
              background:#ccc;
            }
            .van-steps__items{
              margin: 0;
              position: relative;
              top:-8px;
            }
            .line-box{
              position: absolute;
              top: 1px;
              width: 100%;
              padding: 0 8px;
              line-height: initial;
              .line-inline{
                display: inline-block;
                width: 100%;
                border-top: 1px solid #cccccc;
              }
            }

          }
          .check-icon{
            position: relative;
            top: 12px;
            float:right;
            color:@color4;
            font-size: 24px;
          }
          .enterSchool-icon{
            color:#cbcbcb;
          }
        }
      }
      /* 删除 按钮 */
      .delete-button{
        height: 100%;
      }
    }
  /*<!--随访人 end-->*/
    /*添加随访人*/
    .addSFR-box{
      padding: 40px 24px 104px;
      >p{
        padding: 8px 0;
        border-radius: 5px;
        color:#666;
        text-align: center;
        background: #dbdbdb;
      }
    }

    /*确认*/
    .confirm{
      position: fixed;
      bottom:0;
      width:100%;
      padding:6px 0;
      text-align: center;
      border-top:1px solid #e8e8e8;
      background: #fff;
      span{
        display: inline-block;
        color:#fff;
        padding:10px 42px;
        background: @theme-color;
        border-radius: 18px;
      }
    }
  }
  @media screen and (max-width: 320px) {
    .guardInformationConfirm{
      .sfr-box{
        .choose-sfr-status{
          .choose-status span{
            margin-left:24px;
          }
        }
        .allCheck{
          padding:0px 16px 40px;
          margin-top: 14px;
          .checkEnterSchoolStatus{
            display: block;
            width: 100%;
            margin-top: 14px;
          }
        }
        .sfrBox{
          .sfr-item{
            .sfr-status{
              width:126px;
              top: 10px;
              >span{
                left: 8px;
                margin-right:40px;
              }
              .line-box{
                padding: 0 10px;
              }
            }
          }
        }
      }

      .step-box{
        padding-bottom:20px;
      }
    }
  }
</style>
<style lang="less">
.checkEnterSchoolStatus .van-radio__label{
    color:#333;
    font-size: 14px;
  }
 .checkEnterSchoolStatus .van-radio__icon{
  display: inline-block;
   vertical-align: middle;
}
  .guardInformationConfirm {
    .van-steps--horizontal{
      padding:0;
    }
    .sfr-status .van-steps__items{
      margin:0;
      position: relative;
      top:-8px;
    }
  }

@media screen and (max-width: 320px) {
  .checkEnterSchoolStatus .van-radio__label{
    font-size: 10px;
  }
}
</style>
