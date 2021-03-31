<template>
  <div class="fwrapper user-bind">
    <div class="head-content">
      <div class="img-box">
        <img src="../assets/images/home.jpg"/>
      </div>
      <div class="img-word">
        <p class="school-name">{{QD.schoolName}}</p>
        <p class="visit-num">
          <span class="key">您的来访次数</span>
          <span class="num">0</span>
        </p>
      </div>
      <div class="btn-container">
        <div class="btn-content clearfloat">
          <div class="btn-box record-btn-box">
            <a class="btn record-btn" @click="goVisitLst">
              <span class="icon-visitor">&#xeaf9;</span>
              <span class="text">来访记录</span>
            </a>
          </div>
          <div class="btn-box apply-btn-box">
            <a class="btn apply-btn" @click="goVisitApply">
              <span class="icon-visitor">&#xe618;</span>
              <span class="text">来访申请</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <!-- 探访时间还未结束的列表 start -->
    <div>
      <lst v-for="(item, rIdx) in applyLst" :key="rIdx" :item="item"></lst>
    </div>
    <!-- 探访时间还未结束的列表 end -->
  </div>
</template>
<script>
  import lst from '@/components/lst/Lst.vue'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'userBind',
  components: {
    lst
  },
  data () {
    return {
      applyLst: [
        {
          id: 1,
          sfName: '朱慧',
          sfDepart: '教务处',
          createTime: '2020-08-25 09:00',
          visitDate: '2020-09-05 09:00',
          leaveDate: '2020-09-10 19:00',
          selfApply: true,
          visitStatus: 1, // 已进校； 未进校 = 0,已进校 = 1,已离校 = 2, 过期未到访 = 4
          status: 2, // 0-未提交，1-待审批，2-已同意,4-已驳回，8-已撤销
          actVisitTime: '2020-08-26 10:00',
          actLeaveTime: ''
        },
        {
          id: 2,
          sfName: '朱慧',
          sfDepart: '教务处',
          createTime: '2020-08-26 09:00',
          visitDate: '2020-10-01 09:00',
          leaveDate: '2020-10-08 19:00',
          selfApply: true,
          visitStatus: 0, // 未进校
          status: 2 // 0-未提交，1-待审批，2-已同意,4-已驳回，8-已撤销
        },
        {
          id: 3,
          sfName: '朱慧',
          sfDepart: '教务处',
          createTime: '2020-08-27 09:00',
          visitDate: '2020-08-29 09:00',
          leaveDate: '2020-08-29 19:00',
          selfApply: true,
          visitStatus: 0, // 未进校
          status: 0
        },
        {
          id: 4,
          sfName: '朱慧',
          sfDepart: '教务处',
          createTime: '2020-07-28 09:00',
          visitDate: '2020-08-25 09:00',
          leaveDate: '2020-08-25 19:00',
          selfApply: true,
          visitStatus: 0, // 未进校
          status: 1
        },
        {
          id: 5,
          sfName: '朱慧',
          sfDepart: '教务处',
          createTime: '2020-06-25 09:00',
          visitDate: '2020-06-25 09:00',
          leaveDate: '2020-06-25 19:00',
          selfApply: false,
          visitStatus: 0, // 未进校
          status: 4,
          rejectReason: '驳回原由: 今天下午学校开会，请把来访时间改为明天下午。'
        },
        {
          id: 6,
          sfName: '朱慧',
          sfDepart: '教务处',
          createTime: '2020-05-25 09:00',
          visitDate: '2020-05-25 09:00',
          leaveDate: '2020-05-25 19:00',
          selfApply: false,
          visitStatus: 0, // 未进校
          status: 8
        },
        {
          id: 7,
          sfName: '朱慧',
          sfDepart: '教务处',
          createTime: '2020-05-20 09:00',
          visitDate: '2020-05-20 09:00',
          leaveDate: '2020-05-20 19:00',
          selfApply: false,
          visitStatus: 2, // 已离校
          status: 2,
          actVisitTime: '2020-05-20 10:00',
          actLeaveTime: '2020-05-20 19:00'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      gLoading: state => state.gLoading
    })
  },
  created () {
  },
  methods: {
    ...mapActions([
      'updateLoadingStatus'
    ]),
    // 来访记录
    goVisitLst () {
      this.$router.push({path: './VisitLst'})
    },
    // 申请
    goVisitApply () {
      this.$router.push({path: './visitApply'})
    }
  }
}
</script>
<style scoped lang="less">
  .head-content{
    position: relative;
  }
  .img-box{
    position: relative;
  }
  .img-box > img{
    display: block;
    position: relative;
    width: 100%;
    z-index: 1;
  }
  .img-word{
    position: absolute;
    top: 25px;
    z-index: 2;
    line-height: 20px;
    .school-name{
      padding: 5px 15px;
      font-size: 18px;
      color: #ffffff;
    }
    .visit-num{
      padding: 5px 15px;
      font-size: 14px;
      color: #ffffff;
    }
    .key{
      opacity: 0.6;
    }
    .num{
      padding: 0 10px;
      font-size: 16px;
      color: #ffffff;
    }
  }
  .btn-container{
    position: relative;
    margin-top: -40px;
    padding: 0 15px;
    z-index: 2;
  }
  .btn-content{
    position: relative;
    padding: 20px 20px;
    box-shadow: 0 5px 10px 0 rgba(151, 151, 151, 0.2);
    border-radius: 10px;
    background-color: #ffffff;
    .btn-box{
      position: relative;
      float: left;
      width: 50%;
      box-sizing: border-box;
      text-align: center;
    }
    .btn{
      display: inline-block;
      position: relative;
      width: 90%;
      padding: 10px 0;
      border-radius: 40px;
      font-size: 16px;
      color: #ffffff;
      box-sizing: border-box;
      text-align: center;
    }
    .record-btn{
      background-color: @color1;
    }
    .apply-btn{
      background-color: @theme-color;
    }
    .text{
      vertical-align: middle;
    }
    .icon-visitor{
      padding: 0 4px 0 0;
      color: #ffffff;
      font-size: 20px;
      vertical-align: middle;
    }
  }
  @media screen and (max-width: 320px) {
    .img-word{
      top: 12px;
    }
  }
</style>
