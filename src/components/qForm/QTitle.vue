<template>
  <div class="title-box clearfloat">
    <span v-if="required" class="required">*</span>
    <span class="title-text">{{title}}</span>
  </div>
</template>
<script>
  export default {
    name: 'qTitle',
    components: {
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      required: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
      }
    },
    created() {
    },

    mounted() {
    },

    destroyed() {},

    methods: {
    }
  }
</script>
<style scoped>
  .title-box{
    position: relative;
    font-size: 16px;
    color: #333;
    font-weight: bold;
    line-height: 20px;
  }
  .required{
    position: absolute;
    top: 2px;
    left: -12px;
    color: #ff0000;
    vertical-align: sub;
    font-size: 20px;
  }
  .title-text{
    position: relative;
    float: left;
  }
</style>
