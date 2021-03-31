<template>
  <div :id="'qrcode' + item.id + 'To' + diffTime" class="qrcode-img" @click.stop="showBigCode ? enlargeCode(item.id) : null"></div>
</template>
<script>
  import QRCode from 'qrcodejs2'  // 引入qrcode
  export default {
    name: 'qqlstCode',
    components: {
    },
    props: {
      item: {
        type: Object,
        default: null
      },
      showBigCode: { // 显示大的二维码
        type: Boolean,
        default: true
      },
      defaultCodeWidth: { // 默认二维码的宽度
        type: Number,
        default: 100
      },
      defaultCodeHeight: { // 默认二维码的高度
        type: Number,
        default: 100
      }
    },
    data() {
      return {
        codeColor: '', // 判断二维码的颜色
        diffTime: '' // 不同时间
      }
    },
    created() {
      this.diffTime = new Date().getTime()
    },

    mounted() {
      this.createdQrcode(); // 生成二维码
    },

    destroyed() {},

    methods: {
      // 判断二维码的颜色, 还未到探访时间-黄色、已到探访时间-绿色、撤回（时间已过等）-红色
      /*judgeCodeColor () {
        let curTime = this.QD.getCurrDatetime();
        let comp_start = this.QD.compareDateAndTime(curTime, this.item.visitDate);
        if (comp_start === 'small') {
          this.codeColor = 'no-allow'; // 未到探访时间-黄色
        } else {
          let comp_end = this.QD.compareDateAndTime(curTime, this.item.leaveDate);
          if (comp_end === 'big') {
            this.codeColor = 'refuse';
          } else {
            this.codeColor = 'allow'; // 已到探访时间
          }
        }
      },*/
      // 生成二维码
      createdQrcode() {
        let colorDark = '#ffffff';
        // this.judgeCodeColor();  // 判断二维码的颜色
        /*if (this.codeColor === 'refuse') {
          colorDark = '#fe5a59';
        } else if (this.codeColor === 'allow') {
          colorDark = '#6bc93f';
        } else {
          colorDark = '#fbc02d';
        }*/
        // visitStatus 待进校 = 0,已进校 = 1,已离校 = 2,过期 = 4， 未到访校时间 = 8
        if (this.item.visitStatus !== 4 && this.item.visitStatus !== 8) {
          colorDark = '#6bc93f';
        } else if (this.item.visitStatus === 8) {
          colorDark = '#fbc02d';
        } else {
          colorDark = '#fe5a59';
        }

        this.$nextTick(()=>{
          let obj = {value: this.item.id, keyType: 0}; // keyType: 0-访客系统，1- 微校园
          let qrcode = new QRCode('qrcode' + this.item.id + 'To' + this.diffTime, {
            width: this.defaultCodeWidth,
            height: this.defaultCodeHeight, // 高度
            text: JSON.stringify(obj), // 二维码内容
            render: 'canvas',   // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
            colorDark: colorDark // 二维码的颜色
            // background: '#f0f',
            // foreground: '#ff0'
          });
        });
      },
      // 点击二维码
      enlargeCode(id){
        this.$router.push({path: '/enlargeCode', query: {id: id}})
      }
    }
  }
</script>
<style scoped>
</style>
