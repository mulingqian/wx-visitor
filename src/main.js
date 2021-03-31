import Vue from 'vue'
import axios from 'axios'
import global_ from './components/Global.vue'
import App from './App.vue'
import router from './router'
import utils from './utils/main_prepare' // utils 放在 store 之前, utils 有处理userinfo
import store from './store'
import { sync } from 'vuex-router-sync' // 主要是把vue-router 的状态放进vuex的state中
import 'vant/lib/index.less'

sync(store, router)
Vue.config.productionTip = false
Vue.prototype.QD = global_
Vue.prototype.$http = axios // userbind 有用到

// 移动设备上的浏览器默认会在用户点击屏幕大约延迟300毫秒后才
// 会触发点击事件.这是为了检查用户是否在做双击。为了能够立即响应用户的点击事件，才有了FastClick
const FastClick = require('fastclick')
FastClick.attach(document.body)

// 切换到新的页面，页面滚动置顶
function doBodyScrollTop() {
  document.querySelector('#routerViewBox').scrollTop = 0
}
// 对于访客页面信息验证
function doVerifyVisitor (route) {
  if (route.meta.visitor) {
    if (!global_.userinfo || (global_.userinfo && !global_.userinfo.openid)) {
      return false
    }
  }
  return true
}
// 每次页面跳转执行
router.beforeEach(function (to, from, next) {
  let allowAccess = doVerifyVisitor(to);
  if (!allowAccess) {
   router.replace('/visitCondition')
   return;
   }
  console.log('main.js beforeEach called ')
  const history = window.sessionStorage
  let historyCount = 0
  // 钉钉认证用户身份
  if (global_.EndClientType === 'DING') {
    if (to.path === '/') {
      history.clear()
      doNext(to, from, next, history)
    } else if (to.path === '/userbind') {
      next({ path: '/' })
    } else {
      // 检查权限
      global_.checkAuth2(to, global_.userinfo, () => { doNext(to, from, next, history, historyCount) })
    }
  } else {
    // 检查权限
    global_.checkAuth2(to)
    if (to.path === '/userbind') {
      history.clear()
      historyCount = history.getItem('count') * 1 || 0
      history.setItem('/', 0)
    }
    doNext(to, from, next, history, historyCount)
  }
})

const doNext = (to, from, next, history, historyCount) => {
  const toIndex = history.getItem(to.path)
  const fromIndex = history.getItem(from.path)

  if (toIndex) {
    if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
      store.commit('updateDirection', { direction: 'forward' })
    } else {
      store.commit('updateDirection', { direction: 'reverse' })
    }
  } else {
    ++historyCount
    history.setItem('count', historyCount)
    to.path !== '/' && history.setItem(to.path, historyCount)
    store.commit('updateDirection', { direction: 'forward' })
  }

  if (/\/http/.test(to.path)) {
    const url = to.path.split('http')[1]
    window.location.href = `http${url}`
  } else {
    next()
  }
}

/* 在跳转之后判断 */
router.afterEach(function (to) {
  doBodyScrollTop();
  console.log('main.js afterEach')
})

global_.ROOT = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
