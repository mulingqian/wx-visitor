<template>
  <div class="my-app">
    <!-- loading start -->
    <van-overlay :show="gLoading" class="gLoading-overlay">
      <div class="loading-wrapper">
        <div class="loading-block">
          <van-loading type="spinner" color="#ffffff" />
        </div>
      </div>
    </van-overlay>
    <!-- loading end -->
    <div class="view-box">
      <!-- 头部start showHeadLeft -->
      <van-nav-bar
        v-if="showHead"
        class="app-header"
        :title="title"
        :left-arrow="showHeadLeft"
        :right-text="''"
        @click-left="onLeftArrowEvent"
        @click-right="onClickRight"
      />
      <!-- 头部 end -->
      <div :class="`router-view-box ${showHead ? 'app-head' : ''} ${showBar ? 'app-bar' : ''}`" id="routerViewBox" ref="routerViewBox">
        <transition :name="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')">
          <router-view class="router-view" ref="myRouter" :style="`${clientInfo.routerHeight}; ${clientInfo.routerWidth}`"/>
        </transition>
      </div>
      <!-- 底部导航 start -->
     <!-- <van-tabbar v-if="showBar" class="app-tabbar">
        <van-tabbar-item icon="home-o">标签0</van-tabbar-item>
        <van-tabbar-item icon="search">标签1</van-tabbar-item>
        <van-tabbar-item icon="friends-o">标签2</van-tabbar-item>
        <van-tabbar-item icon="setting-o">标签3</van-tabbar-item>
      </van-tabbar>-->
      <!-- 底部导航 end -->
    </div>
  </div>
</template>
<script>
import { NavBar, Tabbar, TabbarItem, Overlay, Loading, Dialog, Toast } from 'vant'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'app',
  components: {
    [NavBar.name]: NavBar,
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    [Overlay.name]: Overlay,
    [Loading.name]: Loading,
    [Dialog.Component.name]: Dialog.Component,
    [Toast.name]: Toast
  },
  data () {
    return {
      showHead: false,
      showBar: false,
      headTitle: '', // 设置标题
      clientInfo: { clientHeight: 0, routerHeight: '', routerWidth: 0 }, // 手机屏信息;clientHeight 实时屏幕高度
      phoneAndroid: false, // 手机是否是安卓的
      showHeadLeft: false, // 否 显示标题的返回
      alertObj: { show: false, title: '' }, // 弹出框信息
      setTimeoutGLoading: null // 监听 gLoading 事件
    }
  },
  computed: {
    ...mapState({
      gLoading: state => state.gLoading,
      direction: state => state.direction,
      route: state => state.route,
      path: state => state.route.path,
      onlineStatus: state => state.onlineStatus // 网络是否在线
    }),
    title: {
      get () {
        if (this.headTitle) {
          const ht = this.headTitle
          this.headTitle = ''
          return ht
        }
        return this.route.meta ? this.route.meta.title : ''
      },
      set () {}
    }
  },
  watch: {
    path (path) {
      this.setLayout()
    },
    onlineStatus (onlineStatus) { // 监听网络
      if (!onlineStatus) {
        this.updateLoadingStatus(false)
        Toast({ message: '网络出错, 请稍后再试!', duration: 6000 })
      }
    },
    gLoading () {
      this.dealGlobalLoadChange() // 当全局 gLoading 变化时，处理方法
    }
  },
  created () {
    this.setDocumentTitle(); // document.title 的设置
    this.judgePhoneAndroid(); // 判断手机是否是安卓的
    this.getClientWidth() // 得到手机的宽度
  },
  mounted () {
    /* 检测网络状态 start */
    window.addEventListener('online', this.updateOnlineStatusEvent)
    window.addEventListener('offline', this.updateOnlineStatusEvent)
    /* 检测网络状态 end */
    this.$root.$on('alert', this.alert)
    this.$root.$on('confirm', this.confirm)
    this.$root.$on('setTitle', this.setTitle)
    this.judgeShowHeadLeft(); // 判断是否显示标题的左边返回
    this.addResizeEvent(); // 监听手机屏的变化
  },
  beforeDestroy () {
    /* 关闭检测网络状态 解除事件监听 start */
    window.removeEventListener('online', this.updateOnlineStatusEvent)
    window.removeEventListener('offline', this.updateOnlineStatusEvent)
    /* 关闭检测网络状态 end */
  },
  destroyed () {},
  methods: {
    ...mapActions([
      'updateLoadingStatus',
      'updateOnlineStatus'
    ]),
    // document.title 的设置
    setDocumentTitle () {
      this.$nextTick(function () {
        document.title = `${this.QD.productName}`
      });
    },
    // 监听手机屏的变化
    addResizeEvent () {
      let that = this;
      window.addEventListener("resize", function () {
        that.clientChangeEvent(); // 监听手机屏 高度
        that.getClientWidth() // 得到手机的宽度
        that.dealFocusEvent()
      });
    },
    // 返回按钮
    onLeftArrowEvent () {
      this.$router.go(-1)
    },
    onClickRight () {},
    // 判断手机是否是安卓的
    judgePhoneAndroid () {
      this.phoneAndroid = this.QD.getAppEdition()
    },
    // 判断是否显示标题的左边返回
    judgeShowHeadLeft () {
      this.showHeadLeft = this.phoneAndroid ? this.route.path !== '/userbind' : false
    },
    // 得到手机的宽度
    getClientWidth () {
      let clientWidth = document.body.clientWidth
      this.clientInfo.routerWidth = 'width: ' + clientWidth + 'px'
    },
    setLayout () {
      // console.log('setLayout =', this.route);
      this.showHead = this.route.path !== '/' && !(this.route.meta.showHead === false)
      this.showBar = this.route.path !== '/' && !(this.route.meta.showBar === false)
      this.headTitle = this.getTitle();
      this.clientChangeEvent() // 监听手机屏
    },
    // 监听手机屏
    clientChangeEvent () {
      this.clientInfo.clientHeight = document.body.clientHeight // 初始化页面的高度
      this.setRouterStyle() // 设置 routerHeight 的最小高度样式
    },
    // 设置 routerHeight 的最小高度样式
    setRouterStyle () {
      if (this.showHead && this.showBar) {
        this.clientInfo.routerHeight = 'min-height: ' + (this.clientInfo.clientHeight - 46 - 50) + 'px'
      } else if (this.showHead && !this.showBar) {
        this.clientInfo.routerHeight = 'min-height: ' + (this.clientInfo.clientHeight - 46) + 'px'
      } else if (!this.showHead && this.showBar) {
        this.clientInfo.routerHeight = 'min-height: ' + (this.clientInfo.clientHeight - 50) + 'px'
      } else {
        this.clientInfo.routerHeight = 'min-height: ' + this.clientInfo.clientHeight + 'px'
      }
    },
    // Dialog.alert
    alert (obj, onHide) {
      Dialog.alert(obj).then(() => {
        onHide()
      })
    },
    confirm (obj, onConfirm, onHide) {
      Dialog.confirm(obj)
        .then(() => {
          onConfirm()
        })
        .catch(() => {
          onHide()
        })
    },
    getTitle () {
      if (this.route.meta && this.route.meta.defaultTitle) {
        return `<div><div class="home-title">${this.QD.schoolName}</div></div>`
      }
      return this.route.meta ? this.route.meta.title : ""
    },
    setTitle (t) {
      this.headTitle = t
    },
    // 方法返回判断网络是否在线的 boolean
    updateOnlineStatusEvent (e) {
      const s = e.type === 'online'
      this.onlineStatus = s // 记录现在的网络状态
      this.updateOnlineStatus(s)
    },
    // 当全局 gLoading 变化时，处理方法
    dealGlobalLoadChange () {
      if (this.gLoading === true) { // 开始 转圈
        const that = this
        this.setTimeoutGLoading = window.setTimeout(function () {
          that.updateLoadingStatus(false)
          Toast({ message: '请求超时!', duration: 6000 })
        }, 20000)
      } else {
        if (this.setTimeoutGLoading) {
          clearTimeout(this.setTimeoutGLoading) // 阻止函数的执行- 当已经是false, 不需要再执行函数的内容了
        }
      }
    },
    /* 监听手机实时屏的高度变化- input 聚焦事件 */
    dealFocusEvent() {
      let that = this;
      if(this.phoneAndroid) {
        let bodyTop = this.$refs.routerViewBox.scrollTop; // 滚动高度
        if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") {
          let element = document.activeElement
          let actualTop = element.getBoundingClientRect().top; // 元素上边到视窗上边的距离
          let targetHei = actualTop + element.clientHeight;
          // 固定在底部的按钮高度
          if (targetHei >= document.body.clientHeight) { // - 46 向上滚动 46px 高度
            setTimeout(function () {
              let bodyScrollTop = bodyTop + targetHei - document.body.clientHeight + 46 // 向上挪 46px
              that.$refs.routerViewBox.scrollTop = bodyScrollTop;
            }, 0);
          }
        }
      }
    }
  }
}
</script>
<style lang="less">
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: "Microsoft YaHei", "微软雅黑";
    background-color: #fff;
    line-height:1;
  }
  html, body {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }
  /* 日期 范围选择的 button 按钮的颜色 */
  .van-calendar .van-button--danger{
    background-color: @theme-color;
    border: 1px solid @theme-color;
  }
  /* input 自动填充时，背景颜色的设置 */
  input:-webkit-autofill {
    box-shadow: 0 0 0 1000px #ffffff inset !important;
  }
  .my-app{
    position: relative;
    height: 100%;
    width: 100%;
  }
  .view-box{
    position: relative;
    height: 100%;
  }
  .view-box .app-header{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    background: @theme-color;
    z-index: 100;
  }
  .app-header .van-nav-bar__title,
  .view-box .van-nav-bar  .van-icon{
    color: #ffffff;
  }
  .router-view-box{
    position: relative;
    top: 0;
    bottom: 0;
    height: 100%;
    box-sizing: border-box;
    overflow: auto;
  }
  .router-view-box.app-head{
    padding-top: 46px;
  }
  .router-view-box.app-bar{
    padding-bottom: 50px;
  }
  .router-view{
  }
  .app-tabbar{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 500;
    background-color: #F7F7FA;
    box-sizing: border-box;
  }
  .vux-header-fade-in-right-enter-active {
    animation: fadeinR .5s;
  }
  .vux-header-fade-in-left-enter-active {
    animation: fadeinL .5s;
  }
  @keyframes fadeinR {
    0% {
      opacity: 0;
      transform: translateX(150px);
    }
    100% {
      opacity:1;
      transform:translateX(0);
    }
  }
  @keyframes fadeinL{
    0% {
      opacity: 0;
      transform: translateX(-150px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
  .vux-pop-out-enter-active,
  .vux-pop-out-leave-active,
  .vux-pop-in-enter-active,
  .vux-pop-in-leave-active {
    will-change: transform;
    transition: all 500ms;
    height: 100%;
    top: 46px;
    position: absolute;
    backface-visibility: hidden;
    perspective: 1000;
  }
  .vux-pop-out-enter {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
  .vux-pop-out-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .vux-pop-in-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .vux-pop-in-leave-active {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
  .fwrapper.fwrapper{
    position: relative;
    top:0;
    left:0;
    height: auto;
    width: 100%;
  }
  /* loading start */
  .my-app .gLoading-overlay{
    z-index: 1000;
  }
  .loading-wrapper{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .loading-block{
    width: 120px;
    height: 98px;
    padding: 34px 0;
    background: hsla(0,0%,7%,.7);
    border-radius: 5px;
    text-align: center;
    box-sizing: border-box;
  }
  /* loading end */
  @font-face {
    font-family: 'iconVisitor';  /* project id 2042319 */
    src: url('//at.alicdn.com/t/font_2042319_arz8eh3dsq.eot');
    src: url('//at.alicdn.com/t/font_2042319_arz8eh3dsq.eot?#iefix') format('embedded-opentype'),
    url('//at.alicdn.com/t/font_2042319_arz8eh3dsq.woff2') format('woff2'),
    url('//at.alicdn.com/t/font_2042319_arz8eh3dsq.woff') format('woff'),
    url('//at.alicdn.com/t/font_2042319_arz8eh3dsq.ttf') format('truetype'),
    url('//at.alicdn.com/t/font_2042319_arz8eh3dsq.svg#iconVisitor') format('svg');
  }
  .icon-visitor {
    font-family: 'iconVisitor';
    font-size: 20px;
    color: @theme-color;
  }
  /* 清除浮动 start */
  .clearfloat:after{
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  .clearfloat{
    zoom: 1;
  }
</style>
