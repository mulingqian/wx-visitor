<template>
  <div class="q-dateSingle">
    <van-calendar v-if="defaultDate" v-model="showPanel" :show-confirm="false" @confirm="getSelectDate" @close="closePanel" :min-date="minDate" :default-date="defaultDate" />

    <van-calendar v-if="!defaultDate" v-model="showPanel" :show-confirm="false" @confirm="getSelectDate" @close="closePanel" :min-date="minDate" />
  </div>
</template>
<script>
  import { Calendar } from 'vant'
  export default {
    name: 'qDateSingle',
    components: {
      [Calendar.name]: Calendar
    },
    props: {
      showCalendarPanel: {
        type: Boolean,
        default: false
      },
      minDate: { // 可选择的最小日期
        type: Date,
        default: function () {
          return new Date(2018, 1, 1)
        }
      },
      defaultDate: { // 默认选中的日期
        type: Date,
        default: function () {
          return null
        }
      }
    },
    data() {
      return {
        showPanel: false
      }
    },
    watch: {
      showCalendarPanel(val) {
        this.showPanel = val
      }
    },
    created() {
      this.judgeShowPanel();
    },

    mounted() {
    },

    destroyed() {},

    methods: {
      // 判断是否显示日期面板
      judgeShowPanel () {
        this.showPanel = this.showCalendarPanel;
      },
      formatDate(date) {
        let month = date.getMonth() + 1;
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        let strDate = date.getDate()
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        return `${date.getFullYear()}-${month}-${strDate}`;
      },
      // 得到选中的日期
      getSelectDate (date) {
        let selectDate = this.formatDate(date);
        this.$emit('get-value', {selectDate: selectDate, defaultDate: date});
      },
      // 关闭弹窗
      closePanel () {
        this.showPanel = false;
        this.$emit('close');
      }
    }
  }
</script>
<style scoped>
</style>
