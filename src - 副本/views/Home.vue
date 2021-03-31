<template>
  <div class="fwrapper home">
    <router-link to="/about">About</router-link>

    <router-link to="/visitRecord"> 访客 来访记录</router-link>

    <router-link to="/intervieweeRecord"> 受访者 审批 来访记录</router-link>

    <van-button type="info" @click="intervieweeRecord">受访者记录</van-button>

    <van-button type="info" @click="inBlank">代填报</van-button>

    <van-button type="info" @click="goResult">门卫扫一扫</van-button>


    <van-button type="info" @click="goSearch">来访查询</van-button>


    <van-button type="default" @click="doUnbind">默认按钮</van-button>
    <van-button type="warning">警告按钮</van-button>
    <van-button type="danger">{{QD.PRODUCT_KEY}}</van-button>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <van-cell-group>
      <van-cell title="单元格" value="内容" />
    </van-cell-group>
    <van-cell title="单元格" value="内容" size="large" />
  </div>
</template>

<script>
import { Button, Cell, CellGroup } from 'vant'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'home',
  components: {
    [Button.name]: Button,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup
  },
  computed: {
    ...mapState({
      gLoading: state => state.gLoading,
      userinfo: state => state.userinfo // 用户信息
    })
  },
  created () {
    this.testAjax();
  },
  methods: {
    ...mapActions([
      'updateLoadingStatus',
      'updateUserInfo'
    ]),
    async testAjax () {
      this.updateLoadingStatus(true)
      const d = await this.QD.getData('/ComApi/PostObject', { apiName: 'GetOfficeDocTypeData' })
      this.updateLoadingStatus(false)
      if (d.status && d.status === 'error') {
        this.QD.alert('获取数据失败')
        return
      }
      console.log('..', d)
    },
    doUnbind () {
      const that = this
      this.QD.confirm({ title: '确定要解除绑定吗？', message: '解除绑定后，将退出当前登录账号，需要重新绑定用户信息才能进入系统！' }, function () {
        that.updateLoadingStatus(true)
        that.$http.post(`${that.QD.APIHOST}${that.QD.API.unbind}`, {}).then((d) => {
          console.log(d)
          that.updateLoadingStatus(false)
          that.userinfo.syslogin = false
          that.updateUserInfo(that.userinfo)
          //  that.QD.setProductUserUpdateTime(); // 用户变更时，将变更时间写入缓存中
          that.QD.go('/', that.$router)
          console.log('that.$router is', that.$router)
        }).catch((error) => {
          console.log(error)
          if (error.response && error.response.status === 499) {
            that.updateLoadingStatus(false)
            that.userinfo.syslogin = false
            that.updateUserInfo(that.userinfo)
            // that.QD.setProductUserUpdateTime(); // 用户变更时，将变更时间写入缓存中
            that.QD.go('/', that.$router)
          }
        })
      })
    },
    // 受访人首页中的列表
    intervieweeRecord(){
      console.log('跳转来访记录')
      this.$router.push({path: "./intervieweeRecord"})
    },
    inBlank(){
      console.log('跳转来访记录')
      this.$router.push({path: "./visitApply", query:{type: 2}})
    },
    //门卫扫一扫
    goResult(){
      this.$router.push({path: "./scanningResults", query:{type: 3}})
    },
    // 来访查询
    goSearch(){
      this.$router.push({path: "./search", query:{userType:1}})
    }
  }
}
</script>
