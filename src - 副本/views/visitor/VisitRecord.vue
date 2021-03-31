<template>
  <div class="visit-record">
    <visit-record-lst
      :data="lst"
      :type=1
      @goDetail="goDetail"
    ></visit-record-lst>
  </div>
</template>
<script>
  import visitRecordLst from '@/components/VisitRecordLst.vue'
  export default {
    name: 'visitRecord',

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
            title: '您提交的来访申请',
            sfName: '受访人',
            sfSJHM: '受访人手机号码',
            sfDepart: '教务处',
            createTime: '2020-08-25 09:00',
            leaveDate: '2020-08-25 19:00',
            visitDate: '08-25 19:00',
            selfApply: true,
            rejectReason: '驳回原因',
            visitStatus: 1, // 进校状态
            status: 1 // 审批状态 0-未提交，1-待审批，2-已同意,4-已驳回，8-已撤销
          },
          {
            id: 2,
            title: '您提交的来访申请',
            sfName: '受访人',
            sfSJHM: '受访人手机号码',
            sfDepart: '教务处',
            createTime: '2020-08-25 09:00',
            leaveDate: '2020-08-25 19:00',
            visitDate: '08-25 19:00',
            selfApply: false,
            rejectReason: '驳回原因',
            visitStatus: 1, // 进校状态
            status: 2 // 审批状态 0-未提交，1-待审批，2-已同意,4-已驳回，8-已撤销
          },
          {
            id: 2,
            title: '您提交的来访申请',
            sfName: '受访人',
            sfSJHM: '受访人手机号码',
            sfDepart: '教务处',
            createTime: '2020-08-25 09:00',
            leaveDate: '2020-08-25 19:00',
            visitDate: '08-25 19:00',
            selfApply: true,
            rejectReason: '驳回原因',
            visitStatus: 6, // 进校状态
            status: 4 // 审批状态 0-未提交，1-待审批，2-已同意,4-已驳回，8-已撤销
          },
          {
            id: 2,
            title: '您提交的来访申请',
            sfName: '受访人',
            sfSJHM: '受访人手机号码',
            sfDepart: '教务处',
            createTime: '2020-08-25 09:00',
            leaveDate: '2020-08-25 19:00',
            visitDate: '08-25 19:00',
            selfApply: false,
            rejectReason: '驳回原因',
            visitStatus: 1, // 进校状态
            status: 8 // 审批状态 0-未提交，1-待审批，2-已同意,4-已驳回，8-已撤销
          }
        ]
      }
    },

    created() {
      console.log('################')
      //this.getVisitApplyHistoryData();
    },

    mounted() {},

    destroyed() {},

    methods: {
      goDetail (item){
        this.$router.push({path: './visitDetail', query: {val: item}})
      },
      //获取来访记录
      async getVisitApplyHistoryData () {
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'apiVisit.GetVisitApplyHistoryData'
        });
        if (d.status && d.status === "error") {
          console.log(d.msg);
          this.QD.alert("", `${d.msg}`)
          return;
        }
        console.log('获取来访记录', d);
      }
    },
  };
</script>
<style lang="less" scoped>
  .visit-record{
    color: @theme-color;
  }
</style>
