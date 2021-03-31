<template>
  <div>
    <div class="search-box" ref="searchInfo">
      <div class="info-box">
        <qq-detail :title="'证件号码'" :value="zjhm"></qq-detail>
        <qq-detail :title="'来访日期范围'" :value="startDate + ' 至 ' + endDate"></qq-detail>
        <qq-detail :title="'手机号码'" :value="phone"></qq-detail>
      </div>
    </div>
    <!--查询结果列表 start-->
    <ex-scroller v-if="searchTagHei > 0" v-model="list" :onGetList="getVisitApplyHistoryData" :height="'-'+ (searchTagHei + 46)" :finishedText="list.length <=0 ? '': '没有更多了'">
      <lst v-for="(item, rIdx) in list" :key="rIdx" :showStatusType="1" :contentType="2" :item="item" @click="goDetailPg(item.id)"></lst>
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
      [Empty.name]: Empty,
      exScroller
    },
    props: {
    },
    data() {
      return {
        loaded: false,
        list: [],
        startDate: '', // 开始日期
        endDate: '', // 结束日期
        zjhm: '', // 证件号码
        phone: '', // 手机号码
        searchTagHei: 0 // 查询信息的高度
      }
    },
    computed: {
      ...mapState({
        gLoading: state => state.gLoading,
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
      // 到详情页面
      goDetailPg (id) {
        this.$router.push({path: '/visitDetail', query: {id: id}})
      },
      // 得到查询条件数据
      getSearchInfo () {
        if (this.QD.currPageData) {
          let qd  = this.QD.currPageData;
          this.startDate = qd.startDate;
          this.endDate = qd.endDate;
          this.zjhm = qd.zjhm;
          this.phone = qd.phone;
        } else {
          this.$router.go(-1);
        }
      },
      // 获取来访记录 this.userinfo.openid
      async getVisitApplyHistoryData (index, size) {
        let con = [];
        if (this.zjhm) {
          con.push({"FieldName":"ZJHM", "Value": this.zjhm, "NeedQuotes":true})
        }
        if (this.phone) {
          con.push({"FieldName":"LFSJHM", "Value": this.phone, "NeedQuotes":true})
        }
        if (this.startDate && this.endDate) {
          con.push({"FieldName":"VisitDate", "Value": this.startDate, "Operator": "LargerEqual", "NeedQuotes":true});
          con.push({"FieldName":"VisitDate", "Value": this.endDate + ' 23:59', "Operator": "LessEqual", "NeedQuotes":true})
        }
        let condition = {
          startIndex: index,
          pageSize: size,
          condition: con
        };
        let d = await this.QD.getData('/ComWXApi/PostObject', {
          apiName: 'apiVisitor.VisitApplyHistoryData',
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
    padding: 10px 0;
  }
  .search-box:after{
    display: block;
    content: '';
    height:10px;
    background:#f5f5f5;
  }
</style>
