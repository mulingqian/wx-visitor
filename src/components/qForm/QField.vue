<template>
  <!-- 文本框 -->
  <div class="field">
    <van-field
      v-model= "val"
      clearable
      :disabled="isReadonly"
      :placeholder="placeholder"
      :maxlength="maxlength !== null ? maxlength : null"
      :type="fieldtype"
      :class="`qfield ${fieldStyle}`"
    />
    <span v-if="delIcon" class="icon-visitor del-icon" @click="delCarOrSFRInfo(val)">&#xe61a;</span>
  </div>

</template>
<script>
  import { Field } from 'vant'
  export default {
    name: 'qField',
    components: {
      [Field.name]: Field
    },
    props: {
      value: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: ''
      },
      fieldtype: {
        type: String,
        default: 'text'
      },
      fieldStyle: { // 样式类名
        type: String,
        default: ''
      },
      maxlength: {
        type: Number,
        default: null
      },
      valIdx: {
        type: Number,
        default: null
      },
      delIcon: {
        type: Boolean,
        default: false
      },
      isReadonly: {
        type:Boolean,
        default: false
      }
    },
    data() {
      return {
        val: this.value
      }
    },
    watch: {
      val (val) {
        this.$emit('get-value', val, this.valIdx);   // 调用input触发v-model更新
      },
    },
    created() {
    },

    mounted() {
    },

    destroyed() {},

    methods: {
      // 删除
      delCarOrSFRInfo () {
        console.log(this.val, this.valIdx)
        this.$emit('del', this.valIdx)
      }
    }
  }
</script>
<style>
  .qfield .van-field__control{
    padding: 4px 0;
  }
</style>
<style scoped lang="less">
  .field{
    display: flex;
  }
  .del-icon{
    position:relative;
    top:26px;
    margin-left:20px;
  }
  .qfield{
    margin-top: 20px;
    border: 1px solid #dbdbdb;
    padding: 0 8px;
    font-size: 16px;
  }
</style>
