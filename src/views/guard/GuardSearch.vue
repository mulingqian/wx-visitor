<template>
  <div class="interview-search">
    <div class="q-item">
      <q-title :title="'来访者姓名'" class="item-title" :required="true"></q-title>
      <q-field :value="lfName" :placeholder="'来访者姓名'" @get-value="getLfName"></q-field>
    </div>
    <div class="q-item">
      <q-title :title="'来访者手机'" class="item-title"></q-title>
      <q-field :value="lfSJHM" :placeholder="'来访者手机'" :fieldtype="'number'" :maxlength="11" @get-value="getPhone"></q-field>
    </div>
    <div class="q-item">
      <q-title :title="'来访者身份证号'" class="item-title"></q-title>
      <q-field :value="zjhm" :placeholder="'来访者身份证号'" @get-value="getZjhm"></q-field>
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
        lfName: '', // 来访者姓名
        lfSJHM: '', // 来访手机号码
        zjhm: '' // 来访者身份证号
      }
    },
    created() {
      this.getCurrPgData(); // 得到保存当前页面数据
    },

    mounted() {
    },

    destroyed() {},

    methods: {
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
      // 验证必填项
      validateForm () {
        if (!this.lfName) {
          this.QD.alert({title: '温馨提示', message: '请填写来访者姓名'});
          return false
        }
        if (this.lfSJHM) {
          if (!this.QD.verifyTel.test(this.lfSJHM)) {
            this.QD.alert({title: "温馨提示",message: '请正确填写来访者手机'});
            return false
          }
        }
        if (this.zjhm) {
          let isCard = this.QD.isCardID(this.zjhm);
          if (!isCard) {
            this.QD.alert({title: "温馨提示",message: '输入的来访者身份证号无效'});
            return false
          }
        }
        return true
      },
      // 做查询
      doSearch () {
        if (this.validateForm()) {
          this.saveCurrPgData(); // 保存当前页面数据
          this.$router.push({path: '/guardSearchResult'})
        }
      },
      // 保存当前页面数据
      saveCurrPgData () {
        this.QD.currPageData = {
          lfName: this.lfName,
          lfSJHM: this.lfSJHM,
          zjhm: this.zjhm
        }
      },
      // 得到保存当前页面数据
      getCurrPgData () {
        if (this.QD.currPageData) {
          let qd  = this.QD.currPageData;
          this.lfName = qd.lfName;
          this.lfSJHM = qd.lfSJHM;
          this.zjhm = qd.zjhm;
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
