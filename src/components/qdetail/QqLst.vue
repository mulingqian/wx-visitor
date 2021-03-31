<template>
  <div class="cell clearfloat">
    <span class="key">{{title}}</span>
    <span class="value">{{value}}</span>
  </div>
</template>
<script>
  export default {
    name: 'qqDetailLst',
    components: {
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      value: {
        type: String | Number,
        default: ''
      }
    },
    data() {
      return {
      }
    },
    created() {
    },

    mounted() {},

    destroyed() {},

    methods: {
    }
  }
</script>
<style scoped lang="less">
  .cell{
    position: relative;
    width: 100%;
  }
  .key{
    position: relative;
    float: left;
    display: inline-block;
    width: 112px;
    padding: 8px 10px 8px 4px;
    font-size: 14px;
    color: #999999;
    text-align: right;
    box-sizing: border-box;
  }
  .value{
    position: relative;
    float: left;
    width: 60%;
    padding: 8px 4px 8px 0;
    font-size: 14px;
    color: #333333;
  }
</style>
