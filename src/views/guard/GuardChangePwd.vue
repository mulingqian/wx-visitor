<!-- 门卫 修改密码 -->
<template>
  <div class="guard-change-password">
    <div class="form-field">
      <!-- 密码复杂性的描述 start -->
      <div class="desc-box">
        <p class="title">密码至少包含以下三种: </p>
        <p class="desc">1. 英文大写字母 (A 到 Z)</p>
        <p class="desc">2. 英文小写字母 (a 到 z)</p>
        <p class="desc">3. 10 个基本数字 (0 到 9)</p>
        <p class="desc">4. 特殊字符 (例如 !、$、#、%、@)</p>
      </div>
      <!-- 密码复杂性的描述 end -->
      <van-form class="form-box" @submit="changePwdEvent">
        <van-field :placeholder="'请输入原密码'"
                   :clearable="true"
                   v-model="pwd"
                   name="pwd"
                   :type="'password'"
                   :rules="[{ required: true, message: '' }]">
          <div slot="left-icon">
            <svg class="bind-icon" aria-hidden="true">
              <use xlink:href="#iconmima"></use>
            </svg>
          </div>
        </van-field>
        <van-field :placeholder="'请输入新密码'"
                   :clearable="true"
                   v-model="newPwd1"
                   name="newPwd1"
                   :type="'password'"
                   :rules="[{ required: true, message: '' }]">
          <div slot="left-icon">
            <svg class="bind-icon" aria-hidden="true">
              <use xlink:href="#iconmima1"></use>
            </svg>
          </div>
        </van-field>
        <van-field :placeholder="'请再次输入新密码'"
                   :clearable="true"
                   v-model="newPwd2"
                   name="newPwd2"
                   :type="'password'"
                   :rules="[{ required: true, message: '' }]">
          <div slot="left-icon">
            <svg class="bind-icon" aria-hidden="true">
              <use xlink:href="#iconmima1"></use>
            </svg>
          </div>
        </van-field>
        <div class="btn-box">
          <van-button round hairline type="info" class="btn" native-type="submit">确认修改密码</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>
<script>
  import { Form, Field, Button, Toast } from 'vant'
  import { mapState, mapActions } from 'vuex'
  import md5 from 'js-md5'
  export default {
    name: 'qQuardUserbind',
    components: {
      [Field.name]: Field,
      [Form.name]: Form,
      [Button.name]: Button,
      [Toast.name]: Toast
    },
    props: {
    },
    data() {
      return {
        specialLetter: false, // 默认新密码中无特殊字母
        pwd: '', // 原密码
        newPwd1: '', // 新密码
        newPwd2: ''
      }
    },
    computed: {
      ...mapState({
        userinfo: state => state.userinfo // 用户信息
      })
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
      // 判断新密码是否满足复杂性要求
      /*
       1. 英文大写字母(A 到 Z)
       2. 英文小写字母(a 到 z)
       3. 10 个基本数字(0 到 9)
       4. 非字母字符(例如 !、$、#、%) [(space)!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~DEL (delete)]
       * */
      doPwdComplexityValidate () {
        let conditionNum = 0; // 满足条件数目
        let upperCase = /[A-Z]/;
        let lowerCase = /[a-z]/;
        let numCase = /[0-9]/;
        let otherCase = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/;
        if (upperCase.test(this.newPwd1)) {
          conditionNum ++;
        }
        if (lowerCase.test(this.newPwd1)) {
          conditionNum ++;
        }
        if (numCase.test(this.newPwd1)) {
          conditionNum ++;
        }
        if (otherCase.test(this.newPwd1)) {
          conditionNum ++;
          this.specialLetter = true; // 新密码中有特殊字母
        }
        if (conditionNum < 3) {
          this.QD.alert({title: '温馨提示', message: '输入的新密码不符合复杂度要求！'});
          return false
        }
        return true
      },
      // 验证
      validateInput () {
        if (this.newPwd1 === this.pwd) {
          this.QD.alert({title: '温馨提示', message: '新密码不能与原密码相同！'});
          return false
        }
        if (this.newPwd1 !== this.newPwd2) {
          this.QD.alert({title: '温馨提示', message: '确认密码与新密码不一致，请重新输入！'});
          return false
        }
        // 验证密码的最小长度
        if (this.newPwd1.length < 6) {
          this.QD.alert({title: '温馨提示', message: '新密码长度不能小于' + 6 + '位'});
          return false
        }
        return true
      },
      // 做绑定
      async changePwdEvent (values) {
        let validateVal = this.validateInput(); // 验证
        if (!validateVal) {
          return;
        }
        // 满足密码的复杂度，可以修改密码
        if (this.doPwdComplexityValidate()) {
          console.log("user pwd", this.pwd, this.newPwd1);
          let oPwd = this.QD.upperCase(md5(this.pwd)); // 将字符串中的小写字母转换成大写字母
          let nPwd = this.QD.upperCase(md5(this.newPwd1));
          let jsonData = {userId: this.userinfo.userid, oPwd: oPwd, nPwd: nPwd};
          this.updateLoadingStatus(true);
          let d = await this.QD.getData('/ComApi/PostObject', {
            apiName: 'apiVisitor.UpdatePwd',
            jsonData: JSON.stringify(jsonData)
          });
          this.updateLoadingStatus(false);
          console.log("stats", d);
          if (d.status && d.status === "error" ) {
            console.log('获取来访统计数据失败', d);
            this.QD.alert({title: '温馨提示', message: d.msg});
            return;
          }
          let that = this;
          this.QD.alert({title: '温馨提示', message: '密码修改成功'}, function () {
            that.$router.go(-1)
          });
        }
      }
    }
  }
</script>
<style scoped lang="less">
  .guard-change-password{
    position: static;
    .form-field{
      position: relative;
    }
    .desc-box{
      position: relative;
      top: 0;
      left: 10%;
      width: 80%;
      padding: 30px 0 20px 10px;
      font-size: 14px;
      color: #666666;
      box-sizing: border-box;
      .title{
        padding: 2px 0;
        color: #333333;
      }
      .desc{
        padding: 2px 0;
        color: #ff0000;
      }
    }
    .form-box{
      position: relative;
      margin-top: 0;
      padding: 0 16px;
      .bind-icon{
        width: 24px;
        height: 24px;
        margin-right: 6px;
      }
    }
    .btn-box{
      position: relative;
      padding: 20px 24px 24px 20px;
      .btn{
        display: block;
        width: 100%;
        font-size: 16px;
        background-color: @theme-color;
      }
    }
  }
</style>
