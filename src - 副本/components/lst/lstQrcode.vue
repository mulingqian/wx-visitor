<template>
  <div :id="'qrcode' + item.id" class="qrcode-img"></div>
</template>
<script>
  import QRCode from 'qrcodejs2'  // 引入qrcode
  export default {
    name: 'lstCode',
    components: {
    },
    props: {
      item: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
      }
    },
    created() {
    },

    mounted() {
      this.createdQrcode(); // 生成二维码
    },

    destroyed() {},

    methods: {
      // 判断二维码的颜色, 还未到探访时间-黄色、已到探访时间-绿色、撤回（时间已过等）-红色
      judgeCodeColor () {
        let curTime = this.QD.getCurrDatetime();
        let comp_start = this.QD.compareDateAndTime(curTime, this.item.visitDate);
        console.log("...comp_start", comp_start);
        if (comp_start === 'small') {
          this.codeColor = 'no-allow'; // 未到探访时间-黄色
        } else {
          let comp_end = this.QD.compareDateAndTime(curTime, this.item.leaveDate);
          console.log("...comp_end", comp_end);
          if (comp_end === 'big') {
            this.codeColor = 'refuse-allow';
          } else {
            this.codeColor = 'allow'; // 已到探访时间
          }
        }
      },
      // 生成二维码
      createdQrcode() {
        this.judgeCodeColor();  // 判断二维码的颜色
        let colorDark = '#ffffff';
        if (this.codeColor === 'big') {
          colorDark = '#fe5a59';
        } else if (this.codeColor === 'allow') {
          colorDark = '#6bc93f';
        } else {
          colorDark = '#fbc02d';
        }
        this.$nextTick(()=>{
          let obj = {value: 'nihao!'};
          let qrcode = new QRCode('qrcode' + this.item.id, {
            width: 100,
            height: 100, // 高度
            text: JSON.stringify(obj), // 二维码内容
            render: 'canvas',   // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
            colorDark: colorDark // 二维码的颜色
            // background: '#f0f',
            // foreground: '#ff0'
          });
        });
      }
    }
  }
</script>
<style scoped>
</style>
