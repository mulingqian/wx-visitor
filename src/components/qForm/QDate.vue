<template>
  <!-- 日期范围 -->
  <div>
    <div @click="doDatetimePanel" class="date-range clearfloat">
      <span class="date-value date-time">选择时间</span>
      <span class="date-value end-date">{{dDefaultDate}}</span>
    </div>
    <van-popup v-model="showDatetimePopup" round position="bottom">
      <van-datetime-picker
        v-model="panelDefaultDate"
        type="datetime"
        title="选择完整时间"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>
<script>
  import { DatetimePicker, Popup  } from 'vant'
  export default {
    name: 'qDateRange',
    components: {
      [Popup.name]: Popup,
      [DatetimePicker.name]: DatetimePicker
    },
    props: {
      defaultDate: { // 默认选中的日期
        type: String,
        default: ""
      }
    },
    data() {
      return {
        dDefaultDate: null, // 显示的时间
        panelDefaultDate: null, // 面板选中的值
        showDatetimePopup: false // 日期组件
      }
    },
    created() {
      this.setDate();
    },

    mounted() {
    },

    destroyed() {},

    methods: {
      // 日期的设置
      setDate () {
        let date = this.QD.getCurrDatetime();
        this.dDefaultDate = date.substr(0, date.length-3)
        if (this.defaultDate) {
          this.dDefaultDate = this.defaultDate // this.defaultDate
        } else {
          this.dDefaultDate = date.substr(0, date.length-3)
        }
        this.panelDefaultDate = this.dDefaultDate;
      },
      // 显示日期面板
      doDatetimePanel () {
        this.showDatetimePopup = true;
        this.panelDefaultDate =  this.parserDate(this.dDefaultDate)
      },
      // 修改页面时将yyyy-mm-dd hh:mm 转为标准时间格式用于默认选中值
      parserDate(date) {
        var t = Date.parse(date)
        // 处理IOS下日期转换问题
        if (isNaN(t)) {
          t = new Date(date.replace(/-/g, '/'));
        }
        return new Date(t)
      },
      // 格式化时间
      formatData(s){
        return s < 10 ? '0' + s : s
      },
      // 选择日期
      onConfirm(value) {
        this.showDatetimePopup = false;
        const resDate = value.getFullYear() + '-' + this.formatData((value.getMonth() + 1)) + '-' + this.formatData(value.getDate())
        const resTime = this.formatData(value.getHours()) + ':' + this.formatData(value.getMinutes())
        this.dDefaultDate = resDate +' '+ resTime
        this.panelDefaultDate =  this.parserDate(this.dDefaultDate)
        this.$emit('get-value', this.dDefaultDate);
      }
    }
  }
</script>
<style scoped>
  .date-range{
    position: relative;
    width: 100%;
    min-height: 32px;
    padding: 8px;
    color: #333;
    font-size: 14px;
    border: 1px solid #dbdbdb;
  }
  .date-value{
    display: inline-block;
    width: 45%;
    font-size: 16px;
  }
  .date-time{
    float: left;
    text-align: left;
  }
  .end-date{
    float: right;
    text-align: right;
  }
</style>
