<template>
  <div class="fwrapper">
    <!-- 退出登录 start -->
    <van-popup round v-model="showQuitPanel" class="quit-popup">
      <div class="quit-content">
        <p class="desc">确定退出登录吗？</p>
        <div class="btn-content clearfloat">
          <div class="btn-box cancel-button">
            <van-button class="btn btn-cancel" plain  round  hairline type="info" @click="cancelQuit">取消</van-button>
          </div>
          <div class="btn-box sure-button">
            <van-button class="btn btn-sure" plain  round  hairline type="info" @click="doUnbind">确定</van-button>
          </div>
        </div>
      </div>
    </van-popup>
    <!-- 退出登录 end -->

    <!-- 用户信息 start -->
    <van-popup v-model="showUserInfoPanel" position="right" :style="{ width: '80%', height: '100%' }">
      <div class="user-info-box">
        <div class="guard-info">
          <p class="name">{{userinfo.name}}</p>
        </div>
        <div class="group">
          <div class="cell" @click="goChangePwdPg">
            <span class="icon-visitor pwd-icon">&#xe678;</span>
            <span class="cell-text">修改密码</span>
          </div>
        </div>

        <div class="btn-box quit-btn">
          <van-button class="btn btn-quit"  round type="info" @click="doQuitPanelEvent">退出登录</van-button>
        </div>

      </div>
    </van-popup>
    <!-- 用户信息 end -->
  </div>
</template>
<script>
  import {  Popup, Button } from 'vant'
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'logout',
    components: {
      [Popup.name]: Popup,
      [Button.name]: Button
    },
    props: {
    },
    data() {
      return {
        loaded: false,
        showUserInfoPanel: false, // 用户信息 默认不显示
        showQuitPanel: false, // 显示退出系统按钮
        showUserBindPg: true, // 显示用户登录界面
      }
    },
    computed: {
      ...mapState({
        userinfo: state => state.userinfo // 用户信息
      })
    },
    watch: {
    },
    created() {
    },

    mounted() {
    },

    destroyed() {},

    methods: {
      ...mapActions([
        'updateLoadingStatus',
        'updateUserInfo'
      ]),
      // 去修改密码页面
      goChangePwdPg () {
        this.$router.push("/guardChangePwd")
      },
      // 点击退出
      doQuitPanelEvent () {
        this.showQuitPanel = true;
      },
      // 取消退出
      cancelQuit () {
        this.showQuitPanel = false;
        this.showUserInfoPanel = false; // 用户信息面板隐藏
      },
      // 确定退出
      doUnbind () {
        this.showQuitPanel = false;
        this.updateLoadingStatus(true);
        this.$http.post(`${this.QD.APIHOST}${this.QD.API.unbind}`, {}).then((d) => {
          console.log(d);
          this.updateLoadingStatus(false);
          this.userinfo.syslogin = false;
          this.updateUserInfo(this.userinfo);
          this.showUserInfoPanel = false; // 用户信息面板隐藏
//          this.showUserBindPg = true;
          this.$emit('do-unbind', false, true)
        }).catch((error) => {
          console.log(error);
          this.updateLoadingStatus(false);
          if (error.response && error.response.status === 499) {
            this.showUserInfoPanel = false; // 用户信息面板隐藏
//            this.showUserBindPg = true;
//            this.clearCurrPgData(); // 清空保存当前页面数据

            this.$emit('do-unbind', false, true)
          }
        })
      }
    }
  }
</script>
<style scoped lang="less">
  /* 退出 panel start */
  .quit-popup{
    width: 80%;
    padding: 40px 20px;
    .desc{
      padding: 10px 10px 40px 10px;
      font-size: 16px;
      color: #000;
      font-weight: bold;
      text-align: center;
    }
    .btn-box{
      position: relative;
      width: 50%;
      float: left;
    }
    .btn{
      display: inline-block;
      position: relative;
      width: 90%;
      padding: 10px 0;
      border-radius: 40px;
      font-size: 16px;
      box-sizing: border-box;
      text-align: center;
    }
    .btn-cancel{
      color: @theme-color;
    }
    .btn-sure{
      color: #ffffff;
      background-color: @theme-color;
    }
  }

  .user-info-box{
    padding: 15px 0;
    .guard-info{
      margin-top: 120px;
      font-size: 18px;
      color: #333333;
      .name{
        font-size: 14px;
        color: @theme-color;
        text-align: center;
      }
    }
    .group{
      margin-top: 20px;
      border-top: 1px solid #f5f5f5;
    }
    .cell{
      padding: 15px 10px;
      border-bottom: 1px solid #f5f5f5;
    }
    .cell-text{
      vertical-align: middle;
      color: #333333;
    }
    .pwd-icon{
      padding-right: 10px;
      font-size: 18px;
      color: #333333;
      vertical-align: middle;
    }
    .quit-btn{
      position: relative;
      width: 100%;
      margin-top: 70px;
      text-align: center;
    }
    .btn-quit{
      width: 80%;
    }
  }
  /* 退出 panel end */
</style>
