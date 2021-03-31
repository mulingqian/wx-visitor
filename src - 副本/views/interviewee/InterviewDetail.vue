<template>
  <div>
    <visit-detail-common
      :info="data"
      @edit="edit"
    >
      <div class="bottom-btn" slot="approval-icon" v-if="data.info.status !==4">
        <p @click="refusePopup = true" class="refuse">
          <span>拒绝</span>
        </p>
        <p class="agree" @click="pass">
          <span>同意</span>
        </p>
      </div>
    </visit-detail-common>
    <van-popup v-model="refusePopup" round class="refusePopup">
      <div v-if="btnInx === 2" style="text-align: center">
        <p class="title" >朱晓晓提交的来访申请</p>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#iconchenggong1"></use>
        </svg>
        <p class="passTip">确认成功</p>
        <div class="button-box">
          <van-button plain hairline round  type="info" class="button" @click="seeDetail">查看详情</van-button>
        </div>
      </div>
      <div v-else>
        <p class="title">请填写“未通过”说明</p>
        <van-field
          v-model="data.info.rejectReason"
          rows="6"
          autosize
          type="textarea"
          placeholder="请输入文字"
          class="refuseReason"
        />
        <div class="button-box">
          <van-button plain hairline round  type="info" class="button" @click="refusePopup = false">取消</van-button>
          <van-button round hairline type="info" class="button" @click="save">保存</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
  import visitDetailCommon from '@/components/VisitDetailCommon.vue'
  import { Popup, Field, Button } from 'vant';
  export default {
    name: 'interviewDetail',

    components: {
      visitDetailCommon,
      [Popup.name]: Popup,
      [Field.name]: Field,
      [Button.name]: Button
  },

    props: {},

    data() {
      return {
        refusePopup: false,
        btnInx: 1,
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
            rejectReason: '驳回原因',
            atts:'附件',
            status:2,
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
//      console.log('item', this.$route.query.val)
//      this.lst.push(this.$route.query.val)
    },

    mounted() {},

    destroyed() {},

    methods: {
      edit(){},
      //保存
      save(){
        this.refusePopup = false
        this.data.info.status = 4
      },
      //同意
      pass(){
        this.btnInx = 2
        this.refusePopup = true
      },
      seeDetail(){
        this.data.info.status = 2
        this.refusePopup = false
      }
    },
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
        border-radius: 18px;
        width: 80%;
        color:#fff;
        border: 1px solid @theme-color;
        height: 36px;
        line-height: 36px;
        margin: auto;
        text-align: center;
      }
    }
    .refuse>span{
      color: @theme-color;
    }
    .agree>span{
      background: @theme-color;
    }
  }
  .refusePopup{
    padding:38px 20px 32px;
    width:80%;
    .title{
      color: #000;
      text-align: center;
      font-weight: bold;
      letter-spacing: 1px;
    }
    .icon{
      margin:10px 0;
    }
    .passTip{
      font-size: 14px;
      text-align: center;
      margin-bottom:40px;
    }
    .refuseReason{
      color:#999;
      font-size:14px;
      border-radius:5px;
      background:#f8f8f8;
      margin: 20px 0 40px;
    }

    .button-box{
      display:flex;
      .button{
        flex:1;
      }
      .button:first-child{
        margin-right:16px;
      }
      .button:last-child{
        margin-left:16px;
      }
    }
  }
</style>
