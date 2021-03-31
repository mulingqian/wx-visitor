<template>
  <div class="interviewee-record">
    <visit-record-lst
      :data="lst"
      @goDetail="goDetail">
    </visit-record-lst>
  </div>
</template>
<script>
  import visitRecordLst from '@/components/VisitRecordLst.vue'
  export default {
    name: 'intervieweeRecord',

    mixins: [],

    components: {
      visitRecordLst
    },

    props: {},

    data() {
        return {
            lst: [
              {
                id: 2,
                sfName: '来访人',
                num: 5,
                visitDate: '2020-08-25 09:00',
                leaveDate: '2020-08-25 19:00',
                createTime: '08-25 19:00',
                selfApply: true,
                status: 1 // 审批状态 1=>已同意 2=>待审批 3=>已撤销 4=>已驳回
              },
              {
                title: '他人提交的来访申请',
                Interviewees: '受访人',
                num: 5,
                dtrXM: '代提人姓名',
                bm: '教务处',
                leaveDate: '2020-08-25 09:00',
                createTime: '2020-08-25 19:00',
                visitDate: '08-25 19:00',
                selfApply: false,
                status: 2 // 审批状态 1=>已同意 2=>待审批 3=>已撤销 4=>已驳回
              },
              {
                title: '您提交的来访申请',
                Interviewees: '受访人',
                num: 5,
                leaveDate: '2020-08-25 09:00',
                createTime: '2020-08-25 19:00',
                visitDate: '08-25 19:00',
                selfApply: true,
                status: 3 // 审批状态 1=>已同意 2=>待审批 3=>已撤销 4=>已驳回
              },
              {
                title: '他人提交的来访申请',
                Interviewees: '受访人',
                num: 5,
                dtrXM: '待提人姓名',
                bm: '教务处',
                leaveDate: '2020-08-25 09:00',
                createTime: '2020-08-25 19:00',
                visitDate: '08-25 19:00',
                selfApply: false,
                status: 4 // 审批状态 1=>已同意 2=>待审批 3=>已撤销 4=>已驳回
              }
            ]
        }
    },

    created() {},

    mounted() {},

    destroyed() {},

    methods: {
      goDetail (item){
        this.$router.push({path: './interviewDetail', query: {val: item}})
      }},
  };
</script>
<style lang="less" scoped>
  .intervieweeRecord{

  }
</style>
