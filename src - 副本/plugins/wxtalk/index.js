/**
 * Created by qian on 2020/8/13.
 *
 */
import Vue from 'vue'
import axios from 'axios'
const wx = Vue.wechat
const plugin = {
  $global: null,
  install (Vue, options) {
    this.$global = options.global
    // 重写Global中相关方法
    Object.assign(this.$global, this.wxApi)
  },
  // 钉钉扩展的公共方法
  wxApi: {
    async checkAccess () {
      console.log(`api called: wxAccess: ${this.APIHOST}${this.API.checkAccess}`)
      var response = await axios.post(`${this.APIHOST}${this.API.checkAccess}`, {
        rawUrl: encodeURIComponent(window.location.href)
      }).catch((error) => {
        console.log(error)
      })
      console.log(response)
      return await response.data
    },
    checkAuth2(to) {
      // 检查微信登录情况
      // 如果不需要Auth页面
      let byglobal = this.checkGlobalUserInfo(this.userinfo);  // 全局用户信息是否发生变更
      console.log('....mainjs checkAuth2');
      if (to.meta && to.meta.anonymous) {
        // 没有userinfo，或者Global用户信息不一致，则检查微信wxAccess
        if (byglobal || !this.userinfo || this.userinfo.wxlogin === false) {
          this.wxAccess(byglobal)
        }
      } else {
        // 需要Auth
        if (byglobal || !this.userinfo || this.userinfo.syslogin === false) {
          this.sysAccess(byglobal)
        }
      }
    },

    // 判断wxAccess
    async wxAccess (byglobal) {
      console.log(`wxAccess: curernt userinfo ${this.userinfo}`);
      if (!byglobal && this.userinfo && this.userinfo.wxlogin === true) {
        return
      }
      axios.defaults.headers.post['byglobal'] = (byglobal ? "1" : ""); // byglobal=="1"表示系统后台需要重新清理用户信息Session
      console.log("wxAccess byglobal header:", axios.defaults.headers.post['byglobal']);
      let e = await this.checkAccess();
      axios.defaults.headers.post['byglobal'] = "";
      console.log(e);
      if (!e || e.appId === null) {
        this.ROOT.$router.replace({name: 'error', params: {message: '找不到指定的应用！'}});
        return
      }
      if (e.wxlogin === false) {
        if (e.redir) {
          console.log('check wx login ,jump to ' + e.redir)
          window.location.href = e.redir
        } else {
          this.ROOT.$router.push({name: 'error', params: {message: '必须在微信中打开该应用！'}});
        }
      } else {
        console.log('wxAccess valid!');
        this.ROOT.$store.commit({type: 'updateUserInfo', userinfo: e})
      }
    },

    // 判断绑定用户Access
    async sysAccess (byglobal) {
      console.log(`sysAccess: curernt userinfo ${this.userinfo}`)
      if (!byglobal && this.userinfo && this.userinfo.syslogin === true) {
        return
      }
      console.log("byglobal:", byglobal);
      axios.defaults.headers.post['byglobal'] = (byglobal ? "1" : ""); // byglobal=="1"表示系统后台需要重新清理用户信息Session
      console.log("byglobal header:", axios.defaults.headers.post['byglobal']);
      let e = await this.checkAccess();
      axios.defaults.headers.post['byglobal'] = "";
      console.log(e)
      if (!e || e.appId === null) {
        this.ROOT.$router.push({name: 'error', params: {message: '找不到指定的应用！'}})
        return
      }
      if (e.wxlogin === false) {
        if (e.redir) {
          console.log('check sys login ,jump to ' + e.redir)
          window.location.replace(e.redir)
        } else {
          this.ROOT.$router.push({name: 'error', params: {message: '必须在微信中打开该应用！'}})
        }
      } else if (e.syslogin === false) {
        if (e.redir) {
          console.log("check syslogin ,jump to " + e.redir)
          window.location.replace(e.redir)
        } else {
          this.ROOT.$router.push({name: 'error', params: {message: '必须在微信中打开该应用！'}})
        }
      } else {
        console.log('Access valid!')
        // localStorage['userinfo'] = JSON.stringify(e)
        this.ROOT.$store.commit({type: 'updateUserInfo', userinfo: e})
        // valid = true
      }
    },
    // 微信jsApi调用签名
    async onWXReady (callback) {
      if (this.wxReady) {
        callback.call(wx, wx)
        return
      }
      var that = this
      var response = await axios.post(`${this.APIHOST}${this.API.wxSign}`, { url: location.href.split('#')[0] }).catch((error) => {
        console.log(error)
        console.log('API.wxSign error: 微信验证遇到点问题！请重新进入该应用')
        that.alert('微信验证遇到点问题！请重新进入该应用')
      })
      console.log(response)
      var e = await response.data
      try {
        var op = {
          debug: false,
          appId: that.appId,
          timestamp: e.timestamp,
          nonceStr: e.nonceStr,
          signature: e.signature,
          jsApiList: that.jsAPIs
        }
        wx.config(op)
        console.log(op)
        var wxSignFailed = false
        wx.ready(function () {
          that.wxReady = true
          callback.call(wx, wx, wxSignFailed)
        })
        wx.error(function (e) {
          console.log('wx.error微信验证遇到点问题！请重新进入该应用')
          console.log(e)
          wxSignFailed = true
          that.alert('微信验证遇到点问题！请重新进入该应用')
        })
      } catch (n) {
        console.log('success catched error: 微信验证遇到点问题！请重新进入该应用')
        that.alert('微信验证遇到点问题！请重新进入该应用')
      }
    },
    // 关闭窗口
    closeWindow () {
      this.onWXReady(function () {
        if (wx !== undefined && wx !== null) {
          wx.closeWindow()
        } else {
          window.close()
        }
      })
    },
    scanQRCode (callback) {
      this.onWXReady(function () {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
            if (callback) {
              callback(result)
            }
          }
        })
      })
    }
  }
}

export default plugin
export const install = plugin.install
