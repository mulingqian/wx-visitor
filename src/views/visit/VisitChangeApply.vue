<template>
  <div>
    <apply :info="info"
           :selfApply="true"
           :wechatId='wechatId'
           :submitSuccess='submitSuccess'
           @goDetial="goDetail"
           @goHome="goHome"
           @saveApplyData="saveApplyData">
      <div class="success-title" slot="visit-apply">
        来访申请提交成功
      </div>
    </apply>
  </div>
</template>
<script>
  import apply from '@/components/qForm/Apply.vue'
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'visitApply',
    components: {
      apply
    },
    props: {},
    data() {
      return {
        submitSuccess: false,
        appId: '', // 申请id
        info: null,
        wechatId: '' // 来访者id
      }
    },
    computed: {
      ...mapState({
        gLoading: state => state.gLoading,
        userinfo: state => state.userinfo // 用户信息
      })
    },
    created(){
      if (this.QD.currPageDataToOther){
        this.info = this.QD.currPageDataToOther;
        this.QD.currPageDataToOther = null
      } else {
        this.$router.go(-1)
      }
      this.wechatId = this.userinfo.openid
    },
    methods: {
      ...mapActions([
        'updateLoadingStatus'
      ]),
      // 保存申请
      saveApplyData(formData){
        this.saveVisitApplyData(formData); //保存申请
      },
      // 查看详情
      goDetail() {
        this.$router.go(-1)
      },
      // 返回首页
      goHome() {
        this.$router.go(-2)
      },
      // 保存申请
      async saveVisitApplyData (formData) {
        this.updateLoadingStatus(true);
        formData.append('apiName', 'apiVisitor.SaveVisitApplyData')
        let d = await this.QD.getData('/ComWXApi/PostFileObject', formData,{'Content-Type':'multipart/form-data'});
        this.updateLoadingStatus(false);
        if (d.status && d.status === "error") {
          console.log('保存失败', d);
          this.QD.alert({title: '温馨提示', message: d.msg})
          return;
        }
        this.appId= d.data.appId
        this.submitSuccess = true;
      }
    }
  }
</script>
<style lang="less" scoped>
  .success-title{
    color: #999;
    font-size:14px;
    text-align: center;
    position: relative;
    top: -20px;
    margin-bottom: 40px;
  }
</style>
