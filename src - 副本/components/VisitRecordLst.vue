<template>
  <div class="visitRecordLst">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell title="" v-for="(item,idx) in lst" :key="idx" class="record" @click="goDetail(item)">
        <div slot="icon" class="left-user-icon">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icontouxiang1" v-if="item.selfApply"></use>
            <use xlink:href="#icontouxiang" v-else></use>
          </svg>
        </div>
        <div slot="title" class="info">
          <p class="title" v-if="item.selfApply">
            <span v-if="item.selfApply">您提交的来访申请</span>
          </p>
          <p class="title" v-if="!item.selfApply">
            <span>{{item.sfName}}提交的来访申请</span>
            <span class="selfApply">代提</span>
          </p>
          <p class="visit" v-if="type">受访人：{{item.sfName}} | {{item.sfDepart}}</p>
          <p class="visit" v-else>来访人：{{item.Interviewees}} | 共{{item.num}}人</p>
          <p class="visit" v-if="!type && !item.selfApply">代提人：{{item.dtrXM}} | {{item.bm}}</p>
          <p class="visit">来访时间：{{item.visitDate}}</p>
          <p class="visit">离开时间：{{item.leaveDate}}</p>
        </div>
        <div class="applyStatus">
          <p class="creat-time">{{item.createTime}}</p>
          <svg class="icon" aria-hidden="true" v-if="type">
            <use xlink:href="#iconyitongyi" v-if="item.status === 2"></use>
            <use xlink:href="#icondaishenpi" v-if="item.status === 1"></use>
            <use xlink:href="#iconyichexiao" v-if="item.status === 8"></use>
            <use xlink:href="#iconyibohui" v-if="item.status === 4"></use>
          </svg>
          <p v-else>
            <span v-if="item.status === 1" class="pass-status">已同意</span>
            <span v-if="item.status === 2" class="wait-status">待审批</span>
            <span v-if="item.status === 3" class="back-status">已撤销</span>
            <span v-if="item.status === 4" class="refuse-status">已驳回</span>
          </p>
        </div>
      </van-cell>
    </van-list>
  </div>
</template>
<script>
  import { Cell, List } from 'vant';
  export default {
    name: 'visitRecordLst',

    mixins: [],

    components: {
      [Cell.name]: Cell,
      [List.name]: List
    },

    props: {
      data: Array,
      type: Number, // 1=》访客
      isDetail: Boolean // true =>详细
    },

    data() {
      return {
        loading: false,
        finished: false,
        lst: []
      }
    },

    created() {
        this.lst = this.data;
    },

    mounted() {},

    destroyed() {},

    methods: {
      //
      goDetail(item){
        this.$emit('goDetail', item)
      },
      onLoad() {
        // 异步更新数据
        // setTimeout 仅做示例，真实场景中一般为 ajax 请求
        // 加载状态结束
        this.loading = false;
        console.log('@@@@@@@@@@@@')
      }
    },
  };
</script>
<style lang="less" scoped>
.visitRecordLst{
  .record{
    padding:20px 16px 0;
  }
  // 列表左侧icon
  .left-user-icon{
    .icon{
      width:40px;
      height:40px;
    }
  }
  // 中间信息内容
  .info{
    color:#999;
    margin-left:12px;
    .title{
      color:#000;
      font-weight: bold;
      .selfApply{
        display:inline-block;
        width:32px;
        height:16px;
        line-height: 16px;
        font-size:12px;
        color:#ff7537;
        margin-left:6px;
        background:#ffe0b2;
        text-align: center;
        vertical-align: middle;
        border-radius: 0 8px 0 8px;
      }
    }
    .visit{
      font-size:12px;
      margin-top:4px;
    }
  }
  // 右侧申请时间以及状态
  .applyStatus{
    .creat-time{
      color:#999;
      font-size: 10px;
    }
    .icon{
      width:92px;
      height:92px;
    }
    .pass-status{
      color:@color1;
    }
    .wait-status{
      color:@theme-color;
    }
    .back-status{
      color:@color1;
    }
    .refuse-status{
      color:@color2;
    }
  }
}
</style>
<style lang="less">
  .visitRecordLst{
    .van-cell__title{
      flex:2;
    }
  }
</style>
