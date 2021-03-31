<template>
  <div class="visit-search">
    <div class="q-item">
      <q-title :title="'证件号码'" class="item-title" :required="true"></q-title>
      <q-field :value="zjhm" :placeholder="'证件号码'" @get-value="getZjhm"></q-field>
    </div>
    <div class="q-item">
      <q-title :title="'来访日期范围'" class="item-title" :required="true"></q-title>
      <q-date-range :startdate="startDate" :enddate="endDate" :defaultDate="defaultDate" class="item-content" @get-value="getVisitDate"></q-date-range>
    </div>
    <div class="q-item">
      <q-title :title="'手机号码'" class="item-title"></q-title>
      <q-field :value="phone" :placeholder="'手机号码'" :fieldtype="'number'" :maxlength="11" @get-value="getPhone"></q-field>
    </div>

    <div class="btn-box">
      <van-button round hairline type="info" class="btn" @click="doSearch">查询</van-button>
    </div>
  </div>
</template>
<script>

  import qTitle from '../../components/qForm/QTitle.vue'
  import qDateRange from '../../components/qForm/QDateRange.vue'
  import qField from '../../components/qForm/QField.vue'
  import { Button } from 'vant'
  export default {
    name: 'visitSearch',
    components: {
      qTitle,
      qDateRange,
      qField,
      [Button.name]: Button
    },
    props: {
    },
    data() {
      return {
        defaultDate: null,
        startDate: '', // 开始日期
        endDate: '', // 结束日期
        zjhm: '', // 证件号码
        phone: '' // 手机号码
      }
    },
    created() {
      this.getCurrPgData(); // 得到保存当前页面数据
    },

    mounted() {
    },

    destroyed() {},

    methods: {
      // 得到来访日期
      getVisitDate (val) {
        this.startDate = val.start;
        this.endDate = val.end;
      },
      // 得到证件号码
      getZjhm (val) {
        this.zjhm = val;
      },
      // 得到手机号码
      getPhone (val) {
        this.phone = val;
      },
      // 验证必填项
      validateForm () {
        if (!this.zjhm) {
          this.QD.alert({title: '温馨提示', message: '请输入证件号码'});
          return false
        }
        if (!this.startDate || !this.endDate) {
          this.QD.alert({title: '温馨提示', message: '请选择来访日期范围'});
          return false
        }
//        if (this.zjhm) {
//          let isCard = this.QD.isCardID(this.zjhm);
//          if (!isCard) {
//            this.QD.alert({title: "温馨提示",message: '输入的证件号码无效'});
//            return false
//          }
//        }
        if (this.phone) {
          if (!this.QD.verifyTel.test(this.phone)) {
            this.QD.alert({title: "温馨提示",message: '请正确填写手机电话'});
            return false
          }
        }
        return true
      },
      // 做查询
      doSearch () {
        if (this.validateForm()) {
          this.saveCurrPgData(); // 保存当前页面数据
          this.$router.push({path: '/visitSearchResult'})
        }
      },
      // 默认选中的日期格式
      dealDefaultDate () {
        if (this.startDate && this.endDate) {
          let sY = this.startDate.substr(0, 4);
          let sM = this.startDate.substr(5, 2);
          let sD = this.startDate.substr(8, 2);
          let eY = this.endDate.substr(0, 4);
          let eM = this.endDate.substr(5, 2);
          let eD = this.endDate.substr(8, 2);
          sM = parseInt(sM);
          sD = parseInt(sD);
          eM = parseInt(eM);
          eD = parseInt(eD);
          this.defaultDate = [new Date(sY, sM-1, sD), new Date(eY, eM-1, eD)]
        }
      },
      // 保存当前页面数据
      saveCurrPgData () {
        this.dealDefaultDate();  // 默认选中的日期格式
        this.QD.currPageData = {startDate: this.startDate, endDate: this.endDate, zjhm: this.zjhm, phone: this.phone, defaultDate: this.defaultDate}
      },
      // 得到保存当前页面数据
      getCurrPgData () {
        if (this.QD.currPageData) {
          let qd  = this.QD.currPageData;
          this.startDate = qd.startDate;
          this.endDate = qd.endDate;
          this.zjhm = qd.zjhm;
          this.phone = qd.phone;
          this.defaultDate = qd.defaultDate;
          this.QD.currPageData = null
        }
      }
    }
  }
</script>
<style scoped lang="less">
  .q-item{
    position: relative;
    padding: 30px 24px 10px 24px;
  }
  .item-content{
    margin-top: 20px;
  }
  .btn-box{
    position: relative;
    padding: 20px 24px 24px 20px;
    .btn{
      display: block;
      width: 100%;
      background-color: @theme-color;
    }
  }
</style>
