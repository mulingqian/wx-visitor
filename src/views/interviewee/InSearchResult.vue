<template>
  <div>
    <div class="search-box" ref="searchInfo">
      <div class="info-box">
        <qq-detail :title="'来访日期范围'" :value="startDate + ' 至 ' + endDate"></qq-detail>
        <qq-detail :title="'来访者姓名'" :value="lfName"></qq-detail>
        <qq-detail :title="'来访者手机'" :value="lfSJHM"></qq-detail>
        <qq-detail :title="'来访者单位'" :value="lfCompany"></qq-detail>
      </div>
    </div>
    <!--查询结果列表 start -->
    <ex-scroller v-if="searchTagHei > 0" v-model="list" :onGetList="getVisitData" :height="'-'+ (searchTagHei + 46)" :finishedText="list.length <=0 ? '': '没有更多了'">
      <lst v-for="(item, rIdx) in list" :key="rIdx" :item="item" :contentType="8" :showStatusType="8" @click="goDetail(item.id)"></lst>
      <van-empty v-if="loaded && list.length <=0 " description="未查询到来访申请" />
    </ex-scroller>
    <!--查询结果列表 end-->
  </div>
</template>
<script>
  import { Empty } from 'vant';
  import lst from '@/components/qLst/QqLst.vue'
  import QqDetail from '@/components/qdetail/QqLst.vue'
  import exScroller from '../../components/common/ExScroller.vue'
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'searchResult',
    components: {
      lst,
      QqDetail,
      exScroller,
      [Empty.name]: Empty
    },
    props: {
    },
    data() {
      return {
        loaded: false,
        startDate: '', // 开始日期
        endDate: '', // 结束日期
        lfSJHM: '', // 来访手机号码
        lfName: '', // 来访者姓名
        lfCompany: '', // 来访单位
        searchTagHei: 0, // 查询信息的高度
        list: [] // 查询得到的列表数据
      }
    },
    computed: {
      ...mapState({
        userinfo: state => state.userinfo // 用户信息
      })
    },
    created() {
      this.getSearchInfo(); // 得到查询条件数据
    },

    mounted() {
      this.searchTagHei = this.$refs.searchInfo.offsetHeight;
    },

    destroyed() {},

    methods: {
      ...mapActions([
        'updateLoadingStatus'
      ]),
      // 得到查询条件数据
      getSearchInfo () {
        if (this.QD.currPageData) {
          let qd  = this.QD.currPageData;
          this.startDate = qd.startDate;
          this.endDate = qd.endDate;
          this.lfSJHM = qd.lfSJHM;
          this.lfName = qd.lfName;
          this.lfCompany = qd.lfCompany;
        } else {
          this.$router.go(-1);
        }
      },
      goDetail (id) {
        this.$router.push({path: '/interviewDetail', query: {id: id}})
      },
      // 得到拜访记录
      async getVisitData (index, size) {
        let con = [];
        if (this.startDate && this.endDate) {
          con.push({"FieldName":"VisitDate", "Value": this.startDate, "Operator": "LargerEqual", "NeedQuotes":true});
          con.push({"FieldName":"VisitDate", "Value": this.endDate + ' 23:59', "Operator": "LessEqual", "NeedQuotes":true})
        }
        if (this.lfSJHM) { // 来访者手机
          con.push({"FieldName":"LFSJHM", "Value": this.lfSJHM, "NeedQuotes":true})
        }
        if (this.lfName) { // 来访者姓名 -模糊查询
          con.push({"FieldName":"LFName", "Value": this.lfName, "NeedQuotes":true, "Operator": "Like"})
        }
        if (this.lfCompany) { // 来访者单位 -模糊查询
          con.push({"FieldName":"LFCompany", "Value": this.lfCompany, "NeedQuotes":true, "Operator": "Like"})
        }
        let condition = {
          startIndex: index,
          pageSize: size,
          condition: con
        };
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'apiVisitor.IntervieweeVisitingRecordsData',
          jsonData: JSON.stringify(condition)
        });
        this.loaded = true;
        if (d.status && d.status === "error") {
          console.log(d.msg);
          return []
        }
        return d.data
      }
    }
  }
</script>
<style scoped lang="less">
  .info-box{
    padding: 0 10px 12px;
  }
  .search-box:after{
    display: block;
    content: '';
    height:10px;
    background:#f5f5f5;
  }
</style>
