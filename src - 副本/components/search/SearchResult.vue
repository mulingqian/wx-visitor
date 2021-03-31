<template>
  <div>
    <!--查询结果列表 start-->
    <lst v-for="(item, rIdx) in list" :key="rIdx" :showStatusType=showStatusType :contentType=contentType :item="item"></lst>
    <!--查询结果列表 end-->
  </div>
</template>
<script>
  import lst from '@/components/Qqlst/QqLst.vue'
  export default {
    name: 'searchResult',
    components: {
      lst,
    },
    props: {
    },
    data() {
      return {
        showStatusType: 4,
        contentType: 8,
        list: [
          {
            lfName: '赵丽音',
            selfApply:true,
            visitDate:'2020-02-25 07:45',
            leaveDate:'2020-02-25 17:45',
            actVisitTime:'2020-02-25 09:45',
            actLeaveTime:'2020-02-25 15:45',
            visitStatus:4,//未进校 = 0,已进校 = 1,已离校 = 2,过期未到访 = 4
            sfName:'周震南',
            details:[{"name":"周震南"},{"name":"周震南1"},{"name":"周震南2"}],
            zjhm: '41144444444444444'
          },
          {
            lfName: '赵丽音',
            selfApply:true,
            visitDate:'2020-02-25 07:45',
            leaveDate:'2020-02-25 17:45',
            actVisitTime:'2020-02-25 09:45',
            actLeaveTime:'2020-02-25 15:45',
            visitStatus:1,
            sfName:'焉栩嘉',
            details:[{"name":"周震南"},{"name":"周震南1"},{"name":"周震南2"}],
            zjhm: '41144444444444444'
          }
        ]
      }
    },
    created() {
      console.log(typeof this.$route.query.contentType*1)
      if (this.$route.query.contentType && this.$route.query.showStatusType){
        this.contentType = this.$route.query.contentType * 1
        this.showStatusType = this.$route.query.showStatusType *1
      }
    },

    mounted() {},

    destroyed() {},

    methods: {}
  }
</script>
<style scoped>
</style>
