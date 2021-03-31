
import axios from 'axios'
import router from '../router'
import global_ from '../components/Global.vue'
global_.userinfo = global_.getLocalUserinfo(); // store.state.vux.userinfo
// 判断是否从微信认证返回,若是，清空用户缓存，重新检查授权信息
let redirByWXOauth = global_.getQueryString("redir_by_wxoauth");
console.log("main.js redir_by_wxoauth", redirByWXOauth);
if (redirByWXOauth === "1"){
  localStorage[`${global_.GLOBAL_KEY}_userinfo`] = null;
  localStorage[`${global_.PRODUCT_KEY}_userinfo`] = null;
  window.location.replace( window.location.href.replace('redir_by_wxoauth=1', ''))
}
if (typeof global_.userinfo === 'string') {
  global_.userinfo = null;
  localStorage[`${global_.PRODUCT_KEY}_userinfo`] = null;
  console.log("main.js set null userinfo")
}
if (global_.AcrossCredentials) {
  axios.defaults.withCredentials = true  // 跨域Ajax带Cookie
}
// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      console.log(JSON.stringify(error));
      switch (error.response.status) {
        case 499:
          localStorage[`${global_.PRODUCT_KEY}_userinfo`] = null
          global_.setCookie(global_.tokenCookieName, "")
          axios.defaults.headers.post['apitoken'] = null
          global_.userinfo = null
          if (error.response.statusText && error.response.statusText.length > 0) {
            window.location = error.response.statusText;
          }
          break;
        case 401:
          // 返回 401 清除token信息并跳转到登录页面
          router.replace('/')
      }
    }
    return Promise.reject(error.response.data)   // 返回接口返回的错误信息
  });
 axios.defaults.headers.post['isajax'] = "1";

if (global_.userinfo !== null && global_.userinfo.token !== null) {
  global_.setCookie(global_.tokenCookieName, global_.userinfo.token)
  axios.defaults.headers.post['apitoken'] = global_.userinfo.token
  // 记录appId
  global_.appId = global_.userinfo.appId
}
console.log("versionNum");
if (location.search !== '') {
  // 产品版本号
  let versionNum = global_.getQueryString("?v");
  console.log("versionNum", versionNum);
  if (versionNum) {
    global_.productVersionNum = versionNum; // 得到路径地址中的版本号 productVersionNum 赋值。。。。。
  }
} else {
  // router.push({name: 'error', params: {message: '请求参数错误！'}})
}

// simple history management
const history = window.sessionStorage;
history.clear();
let historyCount = history.getItem('count') * 1 || 0;
history.setItem('/', 0);

