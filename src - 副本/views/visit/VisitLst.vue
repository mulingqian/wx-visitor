<template>
  <div class="visit-record">
    <lst v-for="(item, rIdx) in applyLst" :key="rIdx" :item="item" :contentType="2" :showStatusType="2" @click="goDetail(item, item.id)"></lst>
  </div>
</template>
<script>
  import lst from '@/components/lst/Lst.vue'
  export default {
    name: 'VisitLst',

    mixins: [],

    components: {
      lst
    },

    props: {},

    data() {
      return {
        applyLst: [
          {
            id: 1,
            sfName: '朱慧',
            sfDepart: '教务处',
            createTime: '2020-08-25 09:00',
            visitDate: '2020-09-05 09:00',
            leaveDate: '2020-09-10 19:00',
            selfApply: true,
            visitStatus: 1, // 已进校； 未进校 = 0,已进校 = 1,已离校 = 2, 过期未到访 = 4
            status: 2, // 0-未提交，1-待审批，2-已同意,4-已驳回，8-已撤销
            actVisitTime: '2020-08-26 10:00',
            actLeaveTime: ''
          },
          {
            id: 2,
            sfName: '朱慧',
            sfDepart: '教务处',
            createTime: '2020-08-26 09:00',
            visitDate: '2020-10-01 09:00',
            leaveDate: '2020-10-08 19:00',
            selfApply: true,
            visitStatus: 0, // 未进校
            status: 2 // 0-未提交，1-待审批，2-已同意,4-已驳回，8-已撤销
          },
          {
            id: 3,
            sfName: '朱慧',
            sfDepart: '教务处',
            createTime: '2020-08-27 09:00',
            visitDate: '2020-08-29 09:00',
            leaveDate: '2020-08-29 19:00',
            selfApply: true,
            visitStatus: 0, // 未进校
            status: 0
          },
          {
            id: 4,
            sfName: '朱慧',
            sfDepart: '教务处',
            createTime: '2020-07-28 09:00',
            visitDate: '2020-08-25 09:00',
            leaveDate: '2020-08-25 19:00',
            selfApply: true,
            visitStatus: 0, // 未进校
            status: 1
          },
          {
            id: 5,
            sfName: '朱慧',
            sfDepart: '教务处',
            createTime: '2020-06-25 09:00',
            visitDate: '2020-06-25 09:00',
            leaveDate: '2020-06-25 19:00',
            selfApply: false,
            visitStatus: 0, // 未进校
            status: 4,
            rejectReason: '驳回原由: 今天下午学校开会，请把来访时间改为明天下午。'
          },
          {
            id: 6,
            sfName: '朱慧',
            sfDepart: '教务处',
            createTime: '2020-05-25 09:00',
            visitDate: '2020-05-25 09:00',
            leaveDate: '2020-05-25 19:00',
            selfApply: false,
            visitStatus: 0, // 未进校
            status: 8
          },
          {
            id: 7,
            sfName: '朱慧',
            sfDepart: '教务处',
            createTime: '2020-05-20 09:00',
            visitDate: '2020-05-20 09:00',
            leaveDate: '2020-05-20 19:00',
            selfApply: false,
            visitStatus: 2, // 已离校
            status: 2,
            actVisitTime: '2020-05-20 10:00',
            actLeaveTime: '2020-05-20 19:00'
          }
        ]
      }
    },

    created() {
    },

    mounted() {},

    destroyed() {},

    methods: {
      goDetail (item, id){
        this.QD.currPgToOtherPg = {info: item};
        this.$router.push({path: './visitDetail', query: {id: id}})
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
