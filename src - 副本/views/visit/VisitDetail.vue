<template>
  <div>
    <lst :item="info" :contentType="3" :showQrcode=true :showStatusType="2"></lst>
   <!-- <visit-detail-common
      :info="data"
      @edit="edit"
    >
      &lt;!&ndash;&ndash;&gt;
      <div class="bottom-btn" slot="edit-icon">
        <p @click="edit" v-if="data.info.status === 4 || data.info.status === 8">
          <span class="icon-visitor btn-icon" >&#xe648;</span>
          <span>修改</span>
        </p>
        <p @click="revoke" v-if="data.info.status !== 8">
          <span class="icon-visitor btn-icon">&#xe609;</span>
          <span>撤销</span>
        </p>
      </div>
    </visit-detail-common>-->
  </div>
</template>
<script>
  /*import visitDetailCommon from '@/components/VisitDetailCommon.vue'*/
  import lst from '../../components/qLst/QqLst.vue'
  export default {
    name: 'visitDetail',
    components: {
      lst,
      /*visitDetailCommon,*/
    },
    props: {},
    data() {
      return {
        data: {
          info: null,


        }
      }
    },
    created() {
      this.getPrePgData(); // 得到列表中的详细数据
    },

    mounted() {},

    destroyed() {},

    methods: {
      // 得到列表中的详细数据
      getPrePgData () {
        if (this.QD.currPgToOtherPg) {
          this.info = this.QD.currPgToOtherPg.info;
          this.QD.currPgToOtherPg = null;
          console.log('get info', this.info);
          this.info.lfSJHM = '15824658562';
          this.info.zjlx = '省份证号';
          this.info.zjhm = '352545199909153566';
          this.info.hasCar = '1';
          this.info.lfCompany = '来访者单位';
          this.info.lfZw = '来访者职务';
          this.info.reason = '来访事由';
          this.info.sfSJHM = '19856523654';
          this.info.remark = '备备注备注备注备注备注备注备注注';
          this.info.details = [{"name":"随访人姓名"}];
          this.info.atts = [{"FileName":"附件名称","FilePath":"附件路径"}]
        } else {
          this.$router.go(-1)
        }
      },
      // 修改
      edit(){
        this.QD.currPageDataToOther = this.data;
        this.$router.push('./visitApply')
      },
      //撤销
      revoke(){
        let that = this;
        this.QD.confirm({
          title: '温馨提示',
          message: '确定撤销申请吗？',
        }, function () {
          that.data.info.status = 8;
        });
      }
    }
  };
</script>
<style lang="less" scoped>
  .bottom-btn{
    display: flex;
    position: fixed;
    bottom: 0;
    z-index: 1;
    background: #fff;
    width: 100%;
    border-top:1px solid #e8e8e8;
  >p{
     flex:1;
     color:#999;
     font-size: 12px;
     text-align: center;
     padding:6px 0;
  .btn-icon{
    color:#666;
    margin-bottom:6px;
  }
  >span{
     display: block;
   }
  }
  }
</style>
