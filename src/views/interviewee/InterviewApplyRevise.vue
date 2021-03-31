<template>
  <div>
    <apply
      :info="info"
      :isReadonly="true"
      :selfApply="false"
      :submitSuccess='submitSuccess'
      @goDetial="goDetail"
      @goHome="goHome"
      @saveApplyData="saveApplyData">
      <div class="success-title inBankTitle" slot="interviewee-apply">
        <p>你修改的来访申请提交成功</p>
        <!--<p>审批通过后请及时把二维码分享给来访人</p>-->
      </div>
    </apply>
  </div>
</template>
<script>
  import apply from '@/components/qForm/Apply.vue'
  import { mapActions } from 'vuex'
  export default {
    name: 'interviewApply',
    components: {
      apply
    },
    props: {},
    data() {
      return {
        submitSuccess: false,
        appId: '', // 带填报id
        info: null
      }
    },
    created(){
      if (this.QD.currPageDataToOther){
        this.info = this.QD.currPageDataToOther;
        this.QD.currPageDataToOther = null
      }
    },
    methods: {
      ...mapActions([
        'updateLoadingStatus'
      ]),
      // 保存申请
      saveApplyData(formData){
        this.saveReplaceVisitApplyData(formData); //保存申请
      },
      // 查看详情
      goDetail(){
        this.$router.go(-1)
      },
      //返回首页
      goHome(){
        this.$router.go(-2)
      },
      // 保存申请
      async saveReplaceVisitApplyData (formData) {
        formData.append('apiName', 'apiVisitor.SaveReplaceVisitApplyData')
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostFileObject', formData,{'Content-Type':'multipart/form-data'});
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
</style>
