<template>
  <!-- 日期范围 -->
  <div v-if="dDefaultDate">
    <div @click="doCalendarPanel" class="date-range clearfloat">
      <span class="date-value start-date">{{startDate}}</span>
      <span class="desc">至</span>
      <span class="date-value end-date">{{endDate}}</span>
    </div>
    <van-calendar
                  v-model="showCalendarPopup"
                  type="range"
                  :allow-same-day="true"
                  @confirm="onConfirm" :default-date="dDefaultDate" :min-date="minDate" />
  </div>
  <!--  :max-date="dMaxDate" -->
</template>
<script>
  import { Calendar } from 'vant'
  export default {
    name: 'qDateRange',
    components: {
      [Calendar.name]: Calendar
    },
    props: {
      startdate: {
        type: String,
        default: ''
      },
      enddate: {
        type: String,
        default: ''
      },
     /* maxDate: { // 可选择的最大日期
        type: Date,
        default: function () {
          return null
        }
      },*/
      minDate: { // 可选择的最小日期
        type: Date,
        default: function () {
          return new Date(2018, 1, 1)
        }
      },
      defaultDate: { // 默认选中的日期
        type: Array,
        default: function () {
          return null // [new Date(2020, 9, 10), new Date(2020, 9, 13)] [new Date(year, month, day), new Date(year, month, day)]
        }
      }
    },
    data() {
      return {
        dMaxDate: null,
        dDefaultDate: null,
        startDate: this.startdate, // 开始日期范围
        endDate: this.enddate, // 结束日期范围
        showCalendarPopup: false // 日期组件
      }
    },
    created() {
      this.setMaxMinDate();
    },

    mounted() {
    },

    destroyed() {},

    methods: {
      // 最大日期和最小日期的设置
      setMaxMinDate () {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();
        /*if (!this.maxDate) {
          this.dMaxDate = new Date(year, month, day)
        } else {
          this.dMaxDate = new Date(2019, 9, 9)// this.maxDate
        }*/
        if (!this.defaultDate) {
          this.dDefaultDate = [new Date(year, month, day), new Date(year, month, day)]
        } else {
          this.dDefaultDate = this.defaultDate // this.defaultDate
        }
      },
      // 显示日期面板
      doCalendarPanel () {
        this.showCalendarPopup = true;
      },
      onConfirm(date) {
        this.showCalendarPopup = false;
        let start = date[0];
        let end = date[1];
        this.startDate = this.setDateForm(start);
        this.endDate = this.setDateForm(end);
        this.$emit('get-value', {start: this.startDate, end: this.endDate});
      },
      // 得到日期 YYYY-MM-DD
      setDateForm (date) {
        let m = date.getMonth() + 1;
        if (m >= 1 && m <= 9) {
          m = "0" + m;
        }
        let d = date.getDate();
        if (d >= 1 && d <= 9) {
          d = "0" + d;
        }
        return `${date.getFullYear()}-${m}-${d}`;
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
  .start-date{
    float: left;
    text-align: left;
  }
  .end-date{
    float: right;
    text-align: right;
  }
  .desc{
    position: absolute;
    left: 45%;
    top: 0;
    padding: 8px 4px;
    color: #333;
    font-size: 14px;
  }
</style>
