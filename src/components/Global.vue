<script>
import Vue from 'vue'
import axios from 'axios'
const CFG = {
  EndClientType: window.Global_CONFIG.EndClientType ? window.Global_CONFIG.EndClientType : "WX", // 客户端类型 值为 WX/APP/DING
  URLBASE: window.Global_CONFIG.URLBASE,
  APIHOST: window.Global_CONFIG.APIHOST,
  OAHOST: window.Global_CONFIG.OAHOST,
  URLSCHEMA: window.Global_CONFIG.URLBASE.substr(0, 5) === 'https' ? 'https://' : 'http://', // 判断 config.js 中的 URLBASE 地址是 http 还是 https
  IS_GLOBAL_USER: window.Global_CONFIG.IS_GLOBAL_USER !== undefined && window.Global_CONFIG.IS_GLOBAL_USER ? window.Global_CONFIG.IS_GLOBAL_USER : true, // 是否检查全局用户

  PRODUCT_KEY: 'WXSchoolApp_p' + window.Global_CONFIG.schoolName, // 产品标识，可用于区别不同产品的缓存key WXSchoolApp_p_none WXSchoolApp_p
  GLOBAL_KEY: 'QD_GLOBAL' + window.Global_CONFIG.schoolName, // QD_GLOBAL_none
  DEVELOPING: true, // 开发中，页面不经过微信认证
  currPageDataToOther: null, // 保存当前页面的数据到兄弟页面
  AcrossCredentials: false, // 是否添加跨站请求凭证
  schoolName: window.Global_CONFIG.schoolName,
  productName: window.Global_CONFIG.productName !== undefined && window.Global_CONFIG.productName !== null ? window.Global_CONFIG.productName : '来访人员及车辆管理',
  productVersionNum: window.Global_CONFIG.productVersionNum !== undefined && window.Global_CONFIG.productVersionNum ? window.Global_CONFIG.productVersionNum : '', // 产品的版本号，值为路径中的v值
  tokenCookieName: 'wx_openauthname',
  jsAPIs: ['getLocation', 'openLocation', 'closeWindow', 'scanQRCode', 'updateAppMessageShareData', 'hideMenuItems'],
  compressSize: window.Global_CONFIG.compressSize !== undefined && window.Global_CONFIG.compressSize !== null ? window.Global_CONFIG.compressSize : 300, // 图片压缩后的大小 kb
  StuPlat: window.Global_CONFIG.StuPlat !== undefined && window.Global_CONFIG.StuPlat !== null ? window.Global_CONFIG.StuPlat: '', // // 学生服务平台地址
  verifyTel: /^1[3456789]\d{9}$/, // 手机的正确格式
  API: {
    checkAccess: '/School/ClientUtil/CheckAccess',
    userbind: '/School/ClientUserBind/DoApiUserBind',
    unbind: '/School/ClientUserBind/UnBind',
    wxSign: '/WXSign/GetSign'
  }
}
const qdglobal = {
  // 常用配置
  EndClientType: CFG.EndClientType,
  URLBASE: CFG.URLBASE,
  APIHOST: CFG.APIHOST,
  OAHOST: CFG.OAHOST,
  URLSCHEMA: CFG.URLSCHEMA,
  PRODUCT_KEY: CFG.PRODUCT_KEY,
  GLOBAL_KEY: CFG.GLOBAL_KEY,
  DEVELOPING: CFG.DEVELOPING,
  IS_GLOBAL_USER: CFG.IS_GLOBAL_USER,
  schoolName: CFG.schoolName,
  productName: CFG.productName,
  productVersionNum: CFG.productVersionNum,
  tokenCookieName: `${CFG.PRODUCT_KEY}${CFG.tokenCookieName}`,
  AcrossCredentials: CFG.AcrossCredentials,
  jsAPIs: CFG.jsAPIs,
  API: CFG.API,
  userinfo: null, // main store 中使用
  ROOT: null,
  wxReady: false,
  appId: '', // 通过userinfo设置
  compressSize: CFG.compressSize, // 图片压缩后的大小 kb
  StuPlat: CFG.StuPlat,
  verifyTel: CFG.verifyTel,
  homePageData: null, // 首页中保存的数据
  guardHomePageData: null, // 门卫首页的数据
  currPageData: null, // 保存当前页面的数据
  currPgToOtherPg: null, // 当前页面数据传值到其他页面
  parentPageData: null, // 父级页面的数据-当前页面为详情页面或修改页面,父级-list
  allCity: {11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外"},
  // 通用方法
  getLocalUserinfo () {
    if (localStorage[`${CFG.PRODUCT_KEY}_userinfo`] && localStorage[`${CFG.PRODUCT_KEY}_userinfo`] !== 'null') {
      return JSON.parse(localStorage[`${CFG.PRODUCT_KEY}_userinfo`])
    }
    return null
  },
  setLocalUserinfo (info) {
    localStorage[`${CFG.PRODUCT_KEY}_userinfo`] = JSON.stringify(info)
  },
  // 通用方法获取Global UserInfo
  getGLOBALUserinfo () {
    console.log("getGLOBALUserinfo")
    if (localStorage[`${CFG.GLOBAL_KEY}_userinfo`] && localStorage[`${CFG.GLOBAL_KEY}_userinfo`] !== 'null') {
      console.log(localStorage[`${CFG.GLOBAL_KEY}_userinfo`])
      return JSON.parse(localStorage[`${CFG.GLOBAL_KEY}_userinfo`])
    }
    return null
  },
  setGLOBALUserinfo (info) {
    localStorage[`${CFG.GLOBAL_KEY}_userinfo`] = JSON.stringify(info);
  },
  // 用户变更时，将变更时间写入缓存中
  setProductUserUpdateTime () {
    var curTime = this.getCurrDatetime();
    localStorage[`${CFG.PRODUCT_KEY}_update_wxschoolapp`] = curTime
    localStorage[`${CFG.PRODUCT_KEY}_update_wxpublic`] = curTime
  },
  // 通用方法比较相同产品下系统用户 与 当前系统用户的用户变更时间是否相等
  getProductUserUpdateTime () {
    let schoolappUpdate = '' // 微校园系统用户变更时间
    let publicUpdate = '' // 移动端公用的系统用户变更时间
    if (localStorage[`${CFG.PRODUCT_KEY}_update_wxschoolapp`]) {
      schoolappUpdate = localStorage[`${CFG.PRODUCT_KEY}_update_wxschoolapp`]
    }
    if (localStorage[`${CFG.PRODUCT_KEY}_update_wxpublic`]) {
      publicUpdate = localStorage[`${CFG.PRODUCT_KEY}_update_wxpublic`]
    }
    console.log('public update', publicUpdate)
    console.log('school app update', schoolappUpdate)
    if (!schoolappUpdate && !publicUpdate) {
      this.setProductUserUpdateTime() // 用户变更时，将变更时间写入缓存中
      return true // 移动系统有变更用户.
    } else {
      if (schoolappUpdate === publicUpdate) {
        return false // 用户变更时间相同
      } else {
        if (publicUpdate) {
          localStorage[`${CFG.PRODUCT_KEY}_update_wxschoolapp`] = publicUpdate
        }
        return true // 移动系统有变更用户.
      }
    }
  },
  // 读cookie
  getCookie: function (cname) {
    if (document.cookie.length > 0) {
      let cstart = document.cookie.indexOf(cname + '=')
      if (cstart !== -1) {
        cstart = cstart + cname.length + 1
        let cend = document.cookie.indexOf(';', cstart)
        if (cend === -1) {
          cend = document.cookie.length
        }
        return unescape(document.cookie.substring(cstart, cend))
      }
    }
    return ''
  },
  // 写cookie
  setCookie: function (cname, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = cname + '=' + value +
      ((expiredays) ? '' : ';expires=' + exdate.toGMTString())
  },
  // 获取url参数
  getQueryString (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var r = window.location.search.substr(1).match(reg)
    if (r) return (r[2])
    return null
  },
  // 检查全局用户信息
  checkGlobalUserInfo (userinfo) {
    var byglobal = false // 是否通过全局用户信息获取登录状态
    if (this.IS_GLOBAL_USER === true) {
      var globalUpdateChanged = false // 通过缓存对比时间，判断是否变更用户
      // 先判断GLobal UserInfo
      var ginfo = this.getGLOBALUserinfo()
      if (ginfo) {
        // globalUpdateChanged = this.getProductUserUpdateTime() // 通用方法比较相同产品下系统用户 与 当前系统用户的用户变更时间是否相等
        var userinfoChanged = !userinfo || ginfo.syslogin !== userinfo.syslogin || ginfo.usertype !== userinfo.usertype || ginfo.userid !== userinfo.userid || ginfo.openid !== userinfo.openid
        // 当Global 记录与本地用户信息不一致，重新到后台获取新的用户
        if (userinfoChanged || globalUpdateChanged) {
          console.log('checkAuth2，Global用户信息有变更.')
          byglobal = true
          // 存在Global用户信息时，记录ajax请求token
          if (!userinfo && ginfo.token) {
            this.setCookie(this.tokenCookieName, ginfo.token)
            axios.defaults.headers.post['apitoken'] = ginfo.token
            this.appId = ginfo.appId
          }
        }
      } else if (userinfo !== null) { // 不存在全局用户，但存在子系统用户，表示之前已经在别的系统解绑过
        byglobal = true
      }
    }
    console.log('byglobal is', byglobal)
    return byglobal
  },
  // 跳转页面
  go (url, router) {
    if (/^javas/.test(url) || !url) return
    const useRouter = typeof url === 'object' || (router && typeof url === 'string' && !/http/.test(url))
    if (useRouter) {
      if (typeof url === 'object' && url.path && url.path.indexOf('http') >= 0) {
        window.location.href = url.path
      } else if (typeof url === 'object' && url.replace === true) {
        router.replace(url)
      } else {
        url === 'BACK' ? router.go(-1) : router.push(url)
      }
    } else {
      window.location.href = url
    }
    // go(url, router)
  },

  // 获取页面url
  /* getUrl (url, router) {
    getUrl(url, router)
  }, */
  // 获取API数据通用方法
  async getData (url, ps, headers) {
    if (ps === undefined) ps = {}
    console.log(`api called: ${CFG.APIHOST}${url}, ps:${JSON.stringify(ps)}`)
    var response = await axios.post(`${CFG.APIHOST}${url}`, ps, headers).catch((error) => {
      console.log(error)
    })
    // console.log(response)
    return await response.data
  },
  // 获取阿里Chart图表插件G2, 调用外部js资源
  /* async getG2 () {
    if (window.G2) {
      console.log("window.G2 exists");
      return await window.G2
    } else {
      let $script = require("scriptjs");
      return new Promise((resolve, reject) => {
        // https://a.alipayobjects.com/g/datavis/g2/2.3.3/g2.js
        // https://a.alipayobjects.com/g/datavis/g2-mobile-all/2.1.14/index.js
        const g2url = 'https://gw.alipayobjects.com/as/g/datavis/g2/2.3.13/index.js'; // https://a.alipayobjects.com/g/datavis/g2-mobile-all/2.1.14/index.js
        $script(g2url, function () {
          console.log("$script callback");
          if (window.GM) {
            console.log("$script resolved");
            resolve(window.GM)
          } else {
            reject("failed")
          }
        })
      })
    }
  }, */
  // 获取API数据通用方法
  getHashCode (input, isInt) {
    if (!input || input.length === 0) return null
    var I64BIT_TABLE =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('')
    let hash = 5381
    let i = input.length - 1

    if (typeof input === 'string') {
      for (; i > -1; i--) {
        hash += (hash << 5) + input.charCodeAt(i)
      }
    } else {
      for (; i > -1; i--) {
        hash += (hash << 5) + input[i]
      }
    }
    var value = hash & 0x7FFFFFFF
    var retValue = ''
    if (isInt) {
      do {
        retValue += value & 0x3F
        value >>= 6
      }
      while (value)
    } else {
      do {
        retValue += I64BIT_TABLE[value & 0x3F]
        value >>= 6
      }
      while (value)
    }
    return retValue
  },
  // 判断手机版本是否是android，true是代表android
  getAppEdition () {
    var u = navigator.userAgent
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 // g
    if (isAndroid) {
      return true
    } else {
      return false
    }
  },
  extend (destination, source) {
    for (var property in source) {
      destination[property] = source[property]
    }
    return destination
  },
  // Dialog
  alert (obj, onHide) {
    if (!onHide) onHide = () => {}
    this.ROOT.$emit('alert', obj, onHide)
  },
  confirm (obj, onConfirm, onHide) {
    if (!onConfirm) onConfirm = () => {}
    if (!onHide) onHide = () => {}
    this.ROOT.$emit('confirm', obj, onConfirm, onHide)
  },
  setTitle (t) {
    this.ROOT.$emit('setTitle', t)
  },
  // 比较日期加时间的大小 yyyy-MM-DD HH:mm '2018-11-26 14: 01'
  compareDateAndTime (startTime, endTime) {
    let startDate = startTime.replace(/-/g, '/');
    let endDate = endTime.replace(/-/g, '/');
    let begin = new Date(startDate);
    let end = new Date(endDate);
    return begin - end
  },
  // 得到当前日期
  getCurrDate () {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    let seperator1 = "-";
    return year + seperator1 + month + seperator1 + strDate
  },
  getCurrDatetime () {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    let seperator1 = "-";
    let seperator2 = ":";
    let Hours = date.getHours();
    let Minutes = date.getMinutes();
    let Seconds = date.getSeconds();

    if (Hours >= 0 && Hours <= 9) {
      Hours = "0" + Hours;
    }
    if (Minutes >= 0 && Minutes <= 9) {
      Minutes = "0" + Minutes;
    }
    if (Seconds >= 0 && Seconds <= 9) {
      Seconds = "0" + Seconds;
    }
    // 当前时间加日期
    return year + seperator1 + month + seperator1 + strDate+ " " + Hours + seperator2 + Minutes + seperator2 + Seconds
  },
  // 将字符串中的小写字母转换成大写字母
  upperCase (str) {
    let arr = str.split("");
    let newStr = "";
    // 通过数组的forEach方法来遍历数组
    arr.forEach(function (value) {
      if (value >= 'a' && value <= 'z')
        newStr += value.toUpperCase();
      else
        newStr += value;
    });
    return newStr;
  },
  // 判断身份证是否合法
  isCardID(sId){
    let iSum=0;
    if (!/^\d{17}(\d|x)$/i.test(sId)) return false; // 你输入的身份证长度或格式错误
    sId = sId.replace(/x$/i, "a");
    if (this.allCity[parseInt(sId.substr(0, 2))] ===null) return false; // 你的身份证地区非法
    let sBirthday = sId.substr(6, 4)+"-"+Number(sId.substr(10, 2))+"-"+Number(sId.substr(12, 2));
    let d=new Date(sBirthday.replace(/-/g, "/"));
    if (sBirthday !== (d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate())) return false; // 身份证上的出生日期非法
    for (let i = 17; i>=0; i --) iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11);
    if (iSum%11 !== 1) return false; // 你输入的身份证号非法
    //aCity[parseInt(sId.substr(0,2))]+","+sBirthday+","+(sId.substr(16,1)%2?"男":"女");//此次还可以判断出输入的身份证号的人性别
    return true;
  }
};
// 添加微信方法
import WXTalkPlugin from '../plugins/wxtalk/index.js'
if (CFG.EndClientType !== "DING"){
  Vue.use(WXTalkPlugin, {global: qdglobal})
}
export default qdglobal;
</script>
