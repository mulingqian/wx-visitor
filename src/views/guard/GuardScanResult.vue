<template>
  <div class="scanningResults" v-if="info">
    <!-- 代进校 = 0,已进校 = 1,已离校 = 2,过期未到访 = 4， 未到访校时间 8-->
    <svg class="icon" aria-hidden="true">
      <use xlink:href="#icontubiao-05" v-if="info.visitStatus == 1 || info.visitStatus == 2"></use>
      <use xlink:href="#icontubiao-07" v-else-if="info.visitStatus == 8"></use>
      <use xlink:href="#icontubiao-06" v-else></use>
    </svg>
    <div class="tip-info">
      <p v-if="info.visitStatus == 0 || info.visitStatus == 1" class="desc">扫码成功，允许进校</p>
      <p v-else-if="info.visitStatus == 2" class="desc">扫码成功，允许离校</p>
      <p v-else-if="info.visitStatus == 4" class="desc">过期未到访，信息无效</p>
      <p v-else-if="info.visitStatus == 8" class="desc">
        <span style="margin-bottom: 12px;">未到来访时间，不能进校</span>
        <span> 二维码有效期：{{info.visitDate}}—{{info.leaveDate}}</span>
      </p>
    </div>
    <lst :showStatusType="4" :contentType="4" :showVisitStatus="false" :item="info" class="cell"></lst>
    <div class="button-box">
      <van-button plain hairline round  type="info" class="button" @click="goDetailPg">查看来访申请</van-button>
      <van-button round hairline type="info" class="button" @click="goHome">返回首页</van-button>
    </div>
  </div>
</template>
<script>
  import lst from '@/components/qLst/QqLst.vue'
  import { Button } from 'vant'
  import { mapActions } from 'vuex'
  export default {
    name: 'scanningResults',
    components: {
      lst,
      [Button.name]: Button
    },
    props: {},
    data() {
      return {
        info: null
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
      // 查看详情
      goDetailPg() {
        this.$router.replace({path: '/guardDetail', query: {id: this.$route.query.id}})
      },
      // 返回首页
      goHome() {
        this.$router.go(-1)
      },
      // 得到扫码结果
      async getVisitQRCodeData () {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'apiVisitor.GetVisitQRCodeData',
          jsonData: JSON.stringify({key: this.$route.query.id, keyType: 0})
        });
        this.updateLoadingStatus(false);
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
  .scanningResults{
    .icon{
      width:100%;
      margin:30px auto 20px;
    }
    .tip-info{
      font-size:14px;
      color:#999;
      .desc{
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
    }
    /*信息*/
    .cell{
      border-style: solid;
      border-width: 1px 0;
      border-color: #e8e8e8;
      padding: 22px 16px 20px;
      margin-top: 40px;
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
