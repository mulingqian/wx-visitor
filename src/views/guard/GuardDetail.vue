<template>
  <div>
    <lst v-if="info" :item="info" :contentType="9" :showStatusType="4"></lst>
    <qq-detail v-if="info" :item="info"></qq-detail>
  </div>
</template>
<script>
  import { Popup, Button } from 'vant';
import lst from '@/components/qLst/QqLst.vue'
import QqDetail from '../../components/qdetail/QqDetail.vue'
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'guardDetail',

    components: {
      lst,
      QqDetail,
      [Popup.name]: Popup,
      [Button.name]: Button
    },

    props: {},

    data() {
      return {
        showGetSchool: false,
        info: null,
      }
    },

    created() {
      this.getVisitDetail(); // 得到详情数据
    },

    mounted() {},

    destroyed() {},

    methods: {
      ...mapActions([
        'updateLoadingStatus'
      ]),
      // 得到详情数据
      async getVisitDetail () {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'apiVisitor.GetReplaceVisitManageApplyData',
          applyId: this.$route.query.id
        });
        this.updateLoadingStatus(false);
        console.log("detail ", d);
        if (d.status && d.status === "error") {
          this.QD.alert({title: '温馨提示', message: '获取数据失败'});
          return
        }
        this.info = d.data;
      }
    }
  };
</script>
<style lang="less" scoped>
  .btn-content{
    position: fixed;
    bottom: 0;
    padding: 6px 0;
    border-top: 1px solid #e8e8e8;
    width: 100%;
    margin: auto;
    z-index: 1;
    background: #fff;
    text-align: center;
    .van-button{
      height: 32px;
      width: 166px;
    }
  }
</style>
