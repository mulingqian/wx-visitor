<template>
  <div class="interview-detail">
    <div v-if="info">
      <lst :item="info" :contentType="7" :showStatusType="2"></lst>
      <qq-detail :item="info"></qq-detail>

      <!--0-未提交，1-待审批，2-已同意,4-已驳回，8-已撤销-->
      <div class="btn-content" v-if="$route.query.type === '3' && info.status !== 2 && info.status !== 4">
        <a v-if="info.status === 8" class="btn revise-btn" @click="doEdit">
          <span class="icon-visitor btn-icon" >&#xe648;</span>
          <span>修改</span>
        </a>
        <a v-if="info.status !== 8" class="btn back-btn" @click="doApplyRevoke">
          <span class="icon-visitor btn-icon">&#xe609;</span>
          <span>撤销</span>
        </a>
      </div>

      <div v-if="canVerify" class="btn-content">
        <a class="btn revise-btn" @click="doRevise">
          <span class="icon-visitor btn-icon" >&#xe648;</span>
          <span>修改</span>
        </a>
        <a class="btn refuse-btn" @click="doRefuse">
          <span class="icon-visitor btn-icon refuse-icon" >&#xe61a;</span>
          <span>驳回</span>
        </a>
        <a class="btn back-btn" @click="doPass">
          <span class="icon-visitor btn-icon">&#xe604;</span>
          <span>同意</span>
        </a>
      </div>

      <!-- 审核通过后，审批人是否可以撤回 -->
      <div v-if="revokeObj.canRevoke" class="btn-content">
        <a class="btn back-btn" @click="doRevoke">
          <span class="icon-visitor btn-icon">&#xe609;</span>
          <span>撤销</span>
        </a>
      </div>
      <van-popup round v-model="showRevokePanel" class="popup-content">
        <div class="revoke-box">
          <p class="title">请填写“撤回”说明</p>
          <van-field
            v-model="revokeObj.comments"
            rows="6"
            autosize
            type="textarea"
            placeholder="请输入文字"
            class="refuseReason"
          />
          <div class="button-box">
            <van-button plain hairline round  type="info" class="button" @click="showRevokePanel = false">取消</van-button>
            <van-button round hairline type="info" class="button" @click="revokeApplyAudit">保存</van-button>
          </div>
        </div>
      </van-popup>


      <van-popup v-model="showPopupPanel" round class="popup-content">
        <div v-if="btnAuditType === 2" style="text-align: center">
          <p class="title" v-if="!info.selfApply">你提交的来访申请</p>
          <p class="title" v-if="info.selfApply">
            <span>{{info.lfName}}提交的来访申请</span>
          </p>
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
            v-model="info.rejectReason"
            rows="6"
            autosize
            type="textarea"
            placeholder="请输入文字"
            class="refuseReason"
          />
          <div class="button-box">
            <van-button plain hairline round  type="info" class="button" @click="showPopupPanel = false">取消</van-button>
            <van-button round hairline type="info" class="button" @click="doSave">保存</van-button>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>
<script>
  import lst from '../../components/qLst/QqLst.vue'
  import QqDetail from '../../components/qdetail/QqDetail.vue'
  import { Popup, Field, Button } from 'vant';
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'interviewDetail',

    components: {
      lst,
      QqDetail,
      [Popup.name]: Popup,
      [Field.name]: Field,
      [Button.name]: Button
  },

    props: {},

    data() {
      return {
        showPopupPanel: false, // 面板是否显示
        btnAuditType: 1, // 审批同意 成功的一个 popup 提示 2 ； 审批拒绝的 拒绝理由 1
        info: null,
        canVerify: false, // 是否可以审批
        revokeObj: {canRevoke: false, comments: ''}, // 撤回.canRevoke - 审核通过后，审批人是否可以撤回，默认不可以撤回. comments - 撤销说明
        showRevokePanel: false // 撤回的面板显示，撤回时，需要给用户一个可以输入撤回的原因 input
      }
    },
    computed: {
      ...mapState({
        gLoading: state => state.gLoading
      })
    },
    created() {
      this.getDetail(); // 得到详情
    },

    mounted() {},

    destroyed() {},

    methods: {
      ...mapActions([
        'updateLoadingStatus'
      ]),
      // 得到详情
      async getDetail () {
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
        this.canVerify = false;
        if (this.info.status === 1 && this.$route.query.type === '1') {
          this.getVisitorFlowAuditInfo(); // 审批人对当前流程审批步骤是否需要进行审批
        }
        // 审批通过后，审批人可以撤回
        if (this.info.status === 2 && this.$route.query.type === '2') {
          this.revokeObj.canRevoke = true;
        }
      },
      // 代提交人修改
      doEdit() {
        this.QD.currPageDataToOther = this.info;
        this.$router.push({path: '/interChangeApply'})
      },
      // 代提交人撤销
      doApplyRevoke () {
        let that = this;
        this.QD.confirm({
          title: '温馨提示',
          message: '确定撤销申请吗？',
        }, function () {
          that.revokeBizApplyAudit()
        });
      },
      // 代提交人撤销申请
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
          });
          return;
        }
        this.getDetail(); // 得到详情
      },
      // 审批人修改
      doRevise () {
        this.QD.currPageDataToOther = this.info;
        this.$router.push('./interviewApplyRevise')
      },
      // 拒绝按钮
      doRefuse () {
        this.showPopupPanel = true;
      },
      // 审批同意
      async doPass () {
        let id = this.$route.query.id;
        let json = {appId: id, resultId: this.$route.query.rid, comments: ''};
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'apiVisitor.AcceptApplyAudit',
          jsonData: JSON.stringify(json)
        });
        this.updateLoadingStatus(false);
        console.log("doPass ", d);
        if (d.status && d.status === "error") {
          this.QD.alert({title: '温馨提示', message: d.msg});
          return
        }
        this.btnAuditType = 2;
        this.showPopupPanel = true
        this.getDetail(); // 得到详情
      },
      // 审批完成后，查看详情
      seeDetail() {
        this.showPopupPanel = false
      },
      // 保存
      async doSave(){
        this.showPopupPanel = false;
        let id = this.$route.query.id;
        let json = {appId: id, resultId: this.$route.query.rid, comments: this.info.rejectReason};
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'apiVisitor.RejectApplyAudit',
          jsonData: JSON.stringify(json)
        });
        this.updateLoadingStatus(false);
        console.log("do refuse ", d);
        if (d.status && d.status === "error") {
          this.QD.alert({title: '温馨提示', message: d.msg});
          return
        }
        this.getDetail(); // 得到详情
      },
      // 审批人对当前流程审批步骤是否需要进行审批
      async getVisitorFlowAuditInfo () {
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'apiVisitor.GetVisitorFlowAuditInfo',
          resultId: this.$route.query.rid
        });
        console.log("flow audit ", d);
        if (d.status && d.status === "error") {
          return
        }
        this.canVerify = d.data;
      },
      // 撤销
      doRevoke() {
        this.showRevokePanel = true; // 显示面板
      },
      // 撤销申请
      async revokeApplyAudit () {
        this.showRevokePanel = false;
        let jsonData = {appId: this.$route.query.id, resultId: this.$route.query.rid, comments: this.revokeObj.comments};
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'apiVisitor.RevokeApplyAudit',
          jsonData: JSON.stringify(jsonData)});
        this.updateLoadingStatus(false);
        if (d.status && d.status === "error") {
          console.log('撤销失败', d);
          this.QD.alert({
            title: '温馨提示',
            message: d.msg
          })
          return;
        }
        this.revokeObj.canRevoke = false; // 审批人不可以撤回
        this.getDetail(); // 得到详情
      }
    },
  };
</script>
<style lang="less" scoped>
  .interview-detail {
    padding-bottom: 60px;
    .btn-content {
      display: flex;
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 50px;
      z-index: 1;
      background: #ffffff;
      border-top: 1px solid #e8e8e8;
      .btn {
        position: relative;
        flex: 1;
        padding: 6px 0;
        font-size: 10px;
        color: #999999;
        text-align: center;
      }
      .btn-icon {
        display: inline-block;
        width: 100%;
        margin-bottom: 6px;
        color: #666;
      }
      .refuse-icon{
        font-size: 22px;
      }
    }
  }
  .popup-content{
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
