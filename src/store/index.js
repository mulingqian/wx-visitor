import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import global_ from '../components/Global.vue'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    userinfo: global_.userinfo, // 受访者-学校老师的用户、 门卫
    direction: 'forward',
    gLoading: false, // 全局 loading
    onlineStatus: true // 网络是否在线
  },
  mutations: {
    // 用户信息
    updateUserInfo (state, payload) {
      console.log("updateUserInfo");
      state.userinfo = payload.userinfo;
      if (payload.userinfo) {
        global_.userinfo = payload.userinfo;
        //添加Global Token
        let gUserinfo = {
          "wxlogin": global_.userinfo.wxlogin,
          "syslogin": global_.userinfo.syslogin,
          "appId": global_.userinfo.appId,
          "wxuid": global_.userinfo.wxuid,
          "openid": global_.userinfo.openid,
          "name": global_.userinfo.name,
          "sex": global_.userinfo.sex,
          "profileimg": global_.userinfo.profileimg,
          "usertype": global_.userinfo.usertype,
          "userid": global_.userinfo.userid,
          "token": global_.userinfo.token
        };
        global_.setGLOBALUserinfo(gUserinfo);
        global_.setLocalUserinfo(payload.userinfo);
        global_.setCookie(global_.tokenCookieName, payload.userinfo.token);
        axios.defaults.headers.post['apitoken'] = payload.userinfo.token;
        global_.appId = global_.userinfo.appId
      } else {
        localStorage[`${global_.GLOBAL_KEY}_userinfo`] = null;
        localStorage[`${global_.PRODUCT_KEY}_userinfo`] = null;
        global_.setCookie(global_.tokenCookieName, "");
        axios.defaults.headers.post['apitoken'] = null;
        global_.userinfo = null
      }
      console.log(`after mutations Userinfo `);
      console.log(payload.userinfo)
    },
    updateDirection (state, payload) {
      state.direction = payload.direction
    },
    updateLoadingStatus (state, payload) {
      state.gLoading = payload.gLoading
    },
    updateOnlineStatus (state, payload) { // 网络是否在线
      state.onlineStatus = payload.onlineStatus
    }
  },
  actions: {
    // 更新用户信息
    updateUserInfo ({commit}, userinfo) {
      commit({type: 'updateUserInfo', userinfo: userinfo})
    },
    updateLoadingStatus ({commit}, gLoading) {
      commit({type: 'updateLoadingStatus', gLoading: gLoading})
    },
    updateOnlineStatus ({commit}, onlineStatus) { // 网络是否在线
      commit({type: 'updateOnlineStatus', onlineStatus: onlineStatus})
    }
  },
  modules: {
  }
})
