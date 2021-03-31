<template>
  <div class="visit-detail" v-if="info">
    <lst :item="info" :contentType="3" :showQrcode=true :showStatusType="2"></lst>
    <qq-detail :item="info"></qq-detail>
    <!--0-未提交，1-待审批，2-已同意,4-已驳回，8-已撤销-->
    <div class="btn-content" v-if="info.status !== 2 && info.status !== 4">
      <a v-if="info.status === 8" class="btn revise-btn" @click="doEdit">
        <span class="icon-visitor btn-icon" >&#xe648;</span>
        <span>修改</span>
      </a>
      <a v-if="info.status !== 8" class="btn back-btn" @click="doRevoke">
        <span class="icon-visitor btn-icon">&#xe609;</span>
        <span>撤销</span>
      </a>
    </div>
  </div>
</template>
<script>
  import lst from '@/components/qLst/QqLst.vue'
  import QqDetail from '../../components/qdetail/QqDetail.vue'
  import { mapState, mapActions } from 'vuex'

  export default {
    name: 'visitDetail',
    components: {
      lst,
      QqDetail
    },
    props: {},
    data() {
      return {
        info: null
      }
    },
    computed: {
      ...mapState({
        gLoading: state => state.gLoading,
        userinfo: state => state.userinfo // 用户信息
      })
    },
    created() {
      this.getVisitDetail(); // 得到详情
    },

    mounted() {},

    destroyed() {},

    methods: {
      ...mapActions([
        'updateLoadingStatus'
      ]),
      // 得到详情
      async getVisitDetail () {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComWXApi/PostObject', {
          apiName: 'apiVisitor.GetVisitManageApplyData',
          applyId: this.$route.query.id
        });
        this.updateLoadingStatus(false);
        if (d.status && d.status === "error") {
          this.QD.alert({title: '温馨提示', message: '获取来访记录失败'});
          console.log(d.msg);
          return
        }
        console.log('detail lst ', d);
        this.info = d.data;
      },
      // 修改
      doEdit() {
         this.QD.currPageDataToOther = this.info;
        //this.$router.push('./visitApply')
        this.$router.push('./visitChangeApply')
      },
      // 撤销
      doRevoke() {
        let that = this;
        this.QD.confirm({
          title: '温馨提示',
          message: '确定撤销申请吗？',
        }, function () {
          that.revokeBizApplyAudit()
        });
      },
      // 撤销申请
      async revokeBizApplyAudit () {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComWXApi/PostObject', {
          apiName: 'apiVisitor.RevokeBizApplyAudit',
          appId: this.$route.query.id});
        this.updateLoadingStatus(false);
        if (d.status && d.status === "error") {
          console.log('撤销失败', d);
          this.QD.alert({
            title: '温馨提示',
            message: d.msg
          })
          return;
        }
        this.getVisitDetail(); // 得到详情
      }
    }
  };
</script>
<style lang="less" scoped>
  .visit-detail{
    padding-bottom: 60px;
  }
  .btn-content{
    display: flex;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    z-index: 1;
    background: #ffffff;
    border-top: 1px solid #e8e8e8;
    .btn{
      position: relative;
      flex: 1;
      padding: 6px 0;
      font-size: 10px;
      color: #999999;
      text-align: center;
    }
    .btn-icon{
      display: inline-block;
      width: 100%;
      margin-bottom: 6px;
      color: #666;
    }
  }
</style>
