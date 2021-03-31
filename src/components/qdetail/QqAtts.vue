<template>
  <div class="cell clearfloat">
    <span class="key">附件</span>
    <span class="value attsColor" @click="seeAtts">查看附件</span>
  </div>
</template>
<script>
  export default {
    name: 'qqDetailLst',
    data() {
      return {
      }
    },
    methods: {
      seeAtts(){
        this.$emit('seeAtts')
      }
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
  .attsColor{
    color:@theme-color;
  }
</style>
