<template>
  <div>
    <visit-detail-common
      :info="data"
      @edit="edit"
    >
      <!--TODO 根据状态值 已驳回显示按钮-->
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
    </visit-detail-common>
  </div>
</template>
<script>
  import visitDetailCommon from '@/components/VisitDetailCommon.vue'
  import { Dialog  } from 'vant'
  export default {
    name: 'visitDetail',
    components: {
      visitDetailCommon,
      [Dialog .name]: Dialog
    },
    props: {},
    data() {
      return {
        data: {
          info: {
            lfName:'来访人姓名',
            lfSJHM:'来访者手机',
            zjlx:'证件类型',
            zjhm:'证件号码',
            hasCar:'1',
            lfCompany:'来访者单位',
            lfZw:'来访者职务',
            visitDate:'2020-02-25 07:45',
            leaveDate:'2020-02-25 07:45',
            reason:'来访事由',
            sfName:'受访人',
            sfDepart:'受访人部门',
            sfSJHM:'受访人手机',
            createTime:'2020-02-25 07:45',
            remark:'备注',
            details:'随访人姓名',
            atts:'附件',
            status:1,
            visitStatus:3,
            actVisitTime:'2020-02-25 07:45',
            actLeaveTime:'2020-02-25 07:45',
            selfApply:true
          },
          details:[{"name":"随访人姓名"}],
          atts:[{"FileName":"附件名称","FilePath":"附件路径"}]
        }
      }
    },
    created() {
      // TODO 根据id获取详细数据
    },

    mounted() {},

    destroyed() {},

    methods: {
      // 修改
      edit(){
        this.QD.currPageDataToOther = this.data;
        this.$router.push('./visitApply')
      },
      //撤销
      revoke(){
        Dialog.confirm({
          title: '温馨提示',
          message: '确定撤销申请吗？',
        })
        .then(() => {
          this.data.info.status = 8;
        })
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
