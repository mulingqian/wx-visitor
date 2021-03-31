<template>
  <div class="enlarge fwrapper clearfloat" v-if="info">
    <van-popup round v-model="showPopupPanel" class="code-popup" :close-on-click-overlay="false">
      <div class="code-content">
        <div class="user-info">
          <svg class="icon-head" aria-hidden="true">
            <use xlink:href="#icontouxiang1" v-if="info.selfApply"></use>
            <use xlink:href="#icontouxiang" v-else></use>
          </svg>
          <div>
            <p class="user-name">姓名：{{info.lfName}}</p>
            <p class="department">受访人：{{info.sfName}} | {{info.sfDepart}}</p>
          </div>
        </div>
        <div class="currTimer">{{nowDate}}</div>
        <div class="qrcode-content">
          <lst-qrcode :item="info" class="qrcode" :defaultCodeWidth="175" :defaultCodeHeight="175"></lst-qrcode>
        </div>
        <div class="code-desc">
          <p class="text">二维码有效期</p>
          <p class="text">{{info.visitDate}} — {{info.leaveDate}}</p>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
  import lstQrcode from '@/components/qLst/QqQrcode.vue'
  import lst from '../components/qLst/QqLst.vue'
  import { Popup } from 'vant'
  import { mapActions } from 'vuex'
  export default {
    name: 'enlargeCode',
    components: {
      lst,
      lstQrcode,
      [Popup.name]: Popup
    },
    props: {
    },
    data() {
      return {
        showPopupPanel: true,
        info: null,
        nowDate: this.QD.getCurrDatetime()
      }
    },
    created() {
      this.getVisitDetail();
    },
    mounted() {
      this.currentTime();
    },
    methods: {
      ...mapActions([
        'updateLoadingStatus'
      ]),
      // 实时刷新时间
      currentTime() {
        setInterval(this.getCurrDate, 1000);
      },
      // 获取当前时间并格式化
      getCurrDate() {
        let date = new Date();
        let year = date.getFullYear(); // 年
        let month = this.formatData((date.getMonth() + 1)); // 月
        let day = this.formatData(date.getDate()); // 日
        let hour = this.formatData(date.getHours()); // 时
        let minute = this.formatData(date.getMinutes()); // 分
        let second = this.formatData(date.getSeconds()); // 秒
        this.nowDate = `${year}-${month}-${day}  ${hour}:${minute}:${second}`;
      },
      formatData(s){
        return s < 10 ? '0' + s : s
      },
      // 得到详情
      async getVisitDetail () {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComWXApi/PostObject', {
          apiName: 'apiVisitor.GetVisitManageApplyData',
          applyId: this.$route.query.id
        });
        this.updateLoadingStatus(false);
        if (d.status && d.status === "error") {
          this.QD.alert({title: '温馨提示', message: '获取来访记录失败'});
          console.log(d.msg);
          return
        }
        console.log('detail lst ', d);
        this.info = d.data;
      }
    }
  }
</script>
<style scoped lang="less">
  .code-popup {
    width: 80%;
  }
  .user-info{
    display: flex;
    margin-bottom: 20px;
    padding: 40px 20px 0 20px;
  }
  .icon-head{
    position:relative;
    top: -5px;
    width: 50px;
    height: 50px;
    margin-right:12px;
  }
  .user-name{
    margin-bottom:12px;
    font-size: 18px;
    color:#000;
    font-weight: bold;
  }
  .department{
    color:#999;
    font-size: 16px;
  }

  .currTimer{
    margin-bottom:20px;
    height:18px;
    color: #16a1fe;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }
  .qrcode-content{
    margin: 0;
    text-align: center;
    .qrcode-img{
      display: inline-block;
      width: 175px;
    }
  }

  .code-desc{
    display: block;
    margin-top: 20px;
    padding: 0 0 40px 0;
    font-size: 14px;
    color: #999999;
    text-align: center;
    .text{
      padding: 4px 0;
    }
  }
</style>
