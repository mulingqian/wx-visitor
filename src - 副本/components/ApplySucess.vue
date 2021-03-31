<template>
  <div class="applySuccess" v-else>
    <svg class="icon" aria-hidden="true">
      <use xlink:href="#icontijiaochenggong1"></use>
    </svg>
    <slot name="success-title"></slot>
    <div class="button-box">
      <van-button plain hairline round  type="info" class="button" @click="goDetail">查看详情</van-button>
      <van-button round hairline type="info" class="button" @click="goHome">返回首页</van-button>
    </div>
  </div>
</template>
<script>
  export default {
    name: '',
    components: {},
    props: {},
    data() {},
    created() {},
    methods: {
      // 查看详情
      goDetail(){
        this.$router.replace({path: './VisitDetail'})
      },
      //返回首页
      goHome(){
        this.$router.push({path: './userbind'})
      }
    },
  }
</script>
<style lang="less" scoped>
  .applySuccess{
    /*提交成功*/
    .icon{
      width:100%;
      height:220px;
      margin-top:40px;
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
