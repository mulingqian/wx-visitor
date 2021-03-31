<!-- 门卫 登录 -->
<template>
  <div class="q-guard-userbind">
    <img class="img-bg" src="../../assets/images/guard_userbind.png" />
    <div class="img-info">
      <div><img class="school-logo" :src="'./static/imgs/logo.png?v=' + QD.productVersionNum" /></div>
      <div><p class="product-name">{{QD.productName}}</p></div>
    </div>
    <van-form class="form-box" @submit="doUserBind">
      <van-field :placeholder="'请输入账号'"
                 :clearable="true"
                 v-model="userid"
                 name="userid"
                 :rules="[{ required: true, message: '' }]">
        <div slot="left-icon">
          <svg class="bind-icon" aria-hidden="true">
            <use xlink:href="#iconxuehao"></use>
          </svg>
        </div>
      </van-field>
      <van-field :placeholder="'请输入密码'"
                 :clearable="true"
                 v-model="pwd"
                 name="pwd"
                 :type="'password'"
                 :rules="[{ required: true, message: '' }]">
        <div slot="left-icon">
          <svg class="bind-icon" aria-hidden="true">
            <use xlink:href="#iconmima1"></use>
          </svg>
        </div>
      </van-field>
      <div class="btn-box">
        <van-button round hairline type="info" class="btn" native-type="submit">登 录</van-button>
      </div>
    </van-form>
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
        userid: '',
        pwd: ''
      }
    },
    computed: {
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
      // 做绑定
      async doUserBind (values) {
        let that = this;
        let userdata = {
          apiName: 'apiVisitor.UserBind2', // 添加属性
          Pwd: md5(this.$data.pwd),
          UserId: this.$data.userid
        };
        this.updateLoadingStatus(true);
        this.$http.post(`${this.QD.APIHOST}${this.QD.API.userbind}`, userdata).then((d) => {
          console.log(d);
          that.updateLoadingStatus(false);
          if (d.status && d.status === "error") {
            that.QD.alert({title: '温馨提示', message: d.msg})
          } else {
            that.updateUserInfo(d.data);
            that.$emit('bind-success')
          }
        }).catch((error) => {
          that.updateLoadingStatus(false);
          console.log(error)
          Toast('用户名或密码不正确 !')
        })
      }
    }
  }
</script>
<style scoped lang="less">
  .q-guard-userbind{
    position: relative;
    .img-bg{
      width: 100%;
    }
    .img-info{
      position: absolute;
      top: 20px;
      width: 100%;
      padding: 0 16px;
    }
    .product-name{
      padding: 10px 0;
      color: #ffffff;
      font-size: 18px;
      line-height: 22px;
      letter-spacing: 2px;
    }
    .form-box{
      position: relative;
      margin-top: 50px;
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
