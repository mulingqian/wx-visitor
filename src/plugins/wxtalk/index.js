/**
 * Created by qian on 2020/8/13.
 *
 */
import axios from 'axios'
const wx = require('./jweixin-1.6.0.js') // 有将 jweixin-1.6.0.js 原 this 改为 window
const plugin = {
  $global: null,
  install (Vue, options) {
    this.$global = options.global
    // 重写Global中相关方法
    Object.assign(this.$global, this.wxApi)
  },
  // 微信扩展的公共方法
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
        that.alert({title: '温馨提示', message: '微信验证遇到点问题！请重新进入该应用'})
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
        console.log(op)
        wx.config(op)
        var wxSignFailed = false
        wx.ready(function () {
          that.wxReady = true
          callback.call(wx, wx, wxSignFailed)
        })
        wx.error(function (e) {
          console.log('wx.error微信验证遇到点问题！请重新进入该应用')
          console.log(e)
          wxSignFailed = true
          that.alert({title: '温馨提示', message: '微信验证遇到点问题！请重新进入该应用'})
        })
      } catch (n) {
        console.log(n)
        console.log('success catched error: 微信验证遇到点问题！请重新进入该应用')
        that.alert({title: '温馨提示', message: '微信验证遇到点问题！请重新进入该应用'})
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
    // 微信扫码
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
    },
    // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
    doShareFriend (url, sfName) {
      /*this.onWXReady(function () {
        wx.onMenuShareAppMessage({
          debug: true,
          title: '分享标题', // 分享标题
          desc: '分享描述', // 分享描述
          link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: 'http://dev.qidisoft.cn/WXVisitor/dist/static/imgs/logo.png', // 分享图标
          // type: '', // 分享类型,music、video或link，不填默认为link
          // dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
            console.log("... onMenuShareAppMessage share success 0")
            // 用户点击了分享后执行的回调函数
          }
        })
      });*/
      /*分享到朋友圈: "menuItem:share:timeline"
      *分享到QQ: "menuItem:share:qq"
      * 分享到Weibo: "menuItem:share:weiboApp"
      * 收藏: "menuItem:favorite"
      * 分享到FB: "menuItem:share:facebook"
      * 分享到 QQ 空间 "menuItem:share:QZone"
      * 在QQ浏览器中打开: "menuItem:openWithQQBrowser"
      * 在Safari中打开: "menuItem:openWithSafari"
      * 邮件: "menuItem:share:email"
      * 一些特殊公众号: "menuItem:share:brand"
      * 复制链接: "menuItem:copyUrl"
      * */
      let imgUrl = url.substring(0, url.lastIndexOf("dist")) + 'dist/static/imgs/share.jpg'; // 完整路径 http://dev.qidisoft.cn/WXVisitor/dist/static/imgs/share.jpg
      console.log("... QD share doShareFriend imgUrl", imgUrl);
      let that = this;
      this.onWXReady(function () {
        // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        wx.hideMenuItems({
          menuList: ["menuItem:share:timeline", "menuItem:share:qq", "menuItem:share:weiboApp",
            "menuItem:favorite", "menuItem:share:facebook", "menuItem:share:QZone",
            "menuItem:openWithQQBrowser", "menuItem:openWithSafari", "menuItem:share:email", "menuItem:share:brand", "menuItem:copyUrl"]
        });
        wx.updateAppMessageShareData({
          debug: true,
          title: that.schoolName, // 分享标题
          desc: sfName + '分享二维码', // 分享描述
          link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: imgUrl,
          success: function () {
            // 设置成功
            console.log("... updateAppMessageShareData share success 1");
            that.alert({title: '温馨提示', message: '请点击右上角发送给朋友!'})
          }
        })
      })
    },
}
}

export default plugin
export const install = plugin.install
