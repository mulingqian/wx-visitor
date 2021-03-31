<template>
  <div class="p-entry">
    <div class="loading" id="loading">
      <div class="loading-logo-wrap">
        <div class="loading-logo">
          <img :src="'./static/imgs/logo.png?v=' + QD.productVersionNum" />
          <div class="welcome">{{QD.schoolName}}<br /> - {{QD.productName}} - </div>
          <div class="loading-line-box">
            <div class="loading-line"></div>
          </div>
        </div>
      </div>
      <!-- 重新加载 btn start -->
      <div class="refresh-box">
        <span class="entry-icon refresh-icon" @click="clearLocalStorage">&#xe679;</span>
      </div>
      <!-- 重新加载 btn end -->
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'entry',
  components: {
  },
  data () {
    return {
      tip: '正在加载',
      byglobal: false
    }
  },
  computed: {
    ...mapState({
      userinfo: state => state.userinfo // 用户信息
    })
  },
  watch: {
    userinfo (userinfo) {
      // console.log(`entry waching userinfo changed:${userinfo}`);
      this.checkAccess()
    }
  },
  created () {
    console.log('entry created')
    this.checkAccess()
  },
  methods: {
    ...mapActions([
      'updateLoadingStatus',
      'updateUserInfo'
    ]),
    clearLocalStorage () {
      localStorage.clear();
      window.location.reload();
    },
    checkAccess () {
        let byglobal = this.QD.checkGlobalUserInfo(this.userinfo); // 全局用户信息是否发生变更
        this.byglobal = byglobal;
       if (!byglobal && !this.userinfo){
         this.$router.replace('userbind');
         } else if (!byglobal && this.userinfo && this.userinfo.syslogin === true) {
           // 判断缓存数据是否合法：
           if (!this.userinfo.stuObj) {
           // 清空缓存，跳到绑定页面
           console.log(`Entry 清空缓存，跳到绑定页面`);
           this.userinfo.syslogin = false;
           this.updateUserInfo(this.userinfo);
           this.$router.replace('userbind');
           return;
         }
         if (this.qrcodescankey) {
           console.log(`Entry 微信绑定`);
           this.$router.replace('/qrCodeLogin');
         } else {
           console.log(`Entry 跳转到主页`);
           this.$router.replace('home');
          }
         }
         else if (!byglobal && this.userinfo && this.userinfo.wxlogin === true && this.userinfo.syslogin === false) {
           console.log(`Entry 跳转到绑定页面`);
           // 跳转到绑定页面
           this.$router.replace('userbind');
         } else {
          console.log(`Entry 不跳转，watching...`)
       }
      // this.$router.replace('/userbind')
    }
  }
}
</script>
<style scoped>
  @font-face {
    font-family: 'iconEntry';  /* project id 2001791 */
    src: url('//at.alicdn.com/t/font_2001791_obzdxk5k8d.eot');
    src: url('//at.alicdn.com/t/font_2001791_obzdxk5k8d.eot?#iefix') format('embedded-opentype'),
    url('//at.alicdn.com/t/font_2001791_obzdxk5k8d.woff2') format('woff2'),
    url('//at.alicdn.com/t/font_2001791_obzdxk5k8d.woff') format('woff'),
    url('//at.alicdn.com/t/font_2001791_obzdxk5k8d.ttf') format('truetype'),
    url('//at.alicdn.com/t/font_2001791_obzdxk5k8d.svg#iconEntry') format('svg');
  }
  .p-entry{
    background-color: #fdb933;
    position: absolute;
    top:0;
    left:0;
    height: 100%;
    width: 100%;
  }
  .loading{
    width:100%;
    height:100%;
    background-color: #fdb933;
    position: fixed;
    z-index:99;
  }
  .loading-logo-wrap{
    position: absolute;
    width: 100%;
    top: 20%;
    transform: translate3d(-50%,-50%,0);
    -webkit-transform: translate3d(-50%,-50%,0);
    left: 50%;
  }
  .loading-logo{
    display: block;
    position: absolute;
    width: 100%;
    top: 14%;
    left: 50%;
    -webkit-transform:translateX(-50%);
    transform:translateX(-50%);
    color: #fff;
    text-align: center;
  }
  .loading-logo .welcome{
    padding: 10px 10px;
    line-height:1.6em;
  }
  .loading-logo img{
    width: 60%;
    max-width: 200px;
  }
  .loading-line-box{
    position: relative;
    left: 25%;
    width: 50%;
  }
  .loading-line{
    height:1px;
    width: 100%;
    margin-top: 10px;
    background-color: rgba(255,255,255,.7);
    animation:lineAnimate 2s infinite;
    -webkit-animation:lineAnimate 2s infinite;
    -webkit-transform-origin: 0 0;
  }
  @keyframes lineAnimate{
    from {transform: scaleX(0)}
    to {transform: scaleX(1)}
  }
  @-webkit-keyframes lineAnimate{
    from {-webkit-transform: scaleX(0)}
    to {-webkit-transform: scaleX(1)}
  }
  .refresh-box{
    position: absolute;
    bottom: 40px;
    width: 100%;
    text-align: center;
  }
  .refresh-icon{
    display: inline-block;
    width: 36px;
    padding: 0;
    font-size: 32px;
    color: #ffffff;
    vertical-align: middle;
  }
</style>
