<template>
  <div class="interview-search">
    <div class="q-item">
      <q-title :title="'来访日期范围'" class="item-title" :required="true"></q-title>
      <q-date-range :startdate="startDate" :enddate="endDate" :defaultDate="defaultDate" class="item-content" @get-value="getVisitDate"></q-date-range>
    </div>
    <div class="q-item">
      <q-title :title="'来访者姓名'" class="item-title"></q-title>
      <q-field :value="lfName" :placeholder="'来访者姓名'" @get-value="getLfName"></q-field>
    </div>
    <div class="q-item">
      <q-title :title="'来访者手机'" class="item-title"></q-title>
      <q-field :value="lfSJHM" :placeholder="'来访者手机'" :fieldtype="'number'" :maxlength="11" @get-value="getPhone"></q-field>
    </div>
    <div class="q-item">
      <q-title :title="'来访者单位'" class="item-title"></q-title>
      <q-field :value="lfCompany" :placeholder="'来访者单位'" @get-value="getLfCompany"></q-field>
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
    name: 'interviewSearch',
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
        lfSJHM: '', // 来访手机号码
        lfName: '', // 来访者姓名
        lfCompany: '' // 来访单位
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
      // 得到来访者姓名
      getLfName (val) {
        this.lfName = val
      },
      // 得到证件号码
      getZjhm (val) {
        this.zjhm = val;
      },
      // 得到手机号码
      getPhone (val) {
        this.lfSJHM = val;
      },
      // 来访单位
      getLfCompany (val) {
        this.lfCompany = val;
      },
      // 验证必填项
      validateForm () {
        if (!this.startDate || !this.endDate) {
          this.QD.alert({title: '温馨提示', message: '请选择来访日期范围'});
          return false
        }
        if (this.lfSJHM) {
          if (!this.QD.verifyTel.test(this.lfSJHM)) {
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
          this.$router.push({path: '/inSearchResult'})
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
        this.QD.currPageData = {
          startDate: this.startDate,
          endDate: this.endDate,
          lfName: this.lfName,
          lfSJHM: this.lfSJHM,
          lfCompany: this.lfCompany,
          defaultDate: this.defaultDate
        }
      },
      // 得到保存当前页面数据
      getCurrPgData () {
        if (this.QD.currPageData) {
          let qd  = this.QD.currPageData;
          this.startDate = qd.startDate;
          this.endDate = qd.endDate;
          this.lfName = qd.lfName;
          this.lfSJHM = qd.lfSJHM;
          this.lfCompany = qd.lfCompany;
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
