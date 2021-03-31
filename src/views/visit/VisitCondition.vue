<template>
  <div class="fwrapper">
    <van-empty image="error" :description="descWord" />
  </div>
</template>
<script>
  import { Empty } from 'vant'
  import { mapActions } from 'vuex'
  export default {
    name: 'visitCondition',
    components: {
      [Empty.name]: Empty
    },
    props: {
    },
    data() {
      return {
        descWord: '' // 错误描述文字
      }
    },
    created() {
      this.getDescWord(); // 错误描述文字
    },

    mounted() {
    },

    destroyed() {},

    methods: {
      ...mapActions([
        'updateUserInfo'
      ]),
      /*doBind () {
        let _this = this;
        let userdata = {
          apiName: 'apiCForm.AccountApiUserBind', // 添加属性
          pwd: '21218cca77804d2ba1922c33e0151105',
          userid: 'admin'
        };
        console.log(userdata);
        this.$http.post(`${this.QD.APIHOST}${this.QD.API.userbind}`, userdata).then((d) => {
          console.log(d);
          _this.updateUserInfo(d.data);
        }).catch((error) => {
          console.log(error);
        })
      },*/
      // 错误描述文字
      getDescWord () {
        if (this.QD.EndClientType === 'DING') {
          this.descWord = '请在钉钉中打开'
        } else {
          this.descWord = '请在微信中打开'
        }
      }
    }
  }
</script>
<style scoped>
</style>
