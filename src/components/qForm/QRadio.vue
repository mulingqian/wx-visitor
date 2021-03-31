<template>
  <!-- 单选框 -->
  <div>
    <van-radio-group class="field field-radio" v-model="hasCar" v-if="isReadonly" disabled>
      <van-radio name="1" class="radio" @click="getRadio(1)">是</van-radio>
      <van-radio name="2" class="radio" @click="getRadio(2)">否 </van-radio>
    </van-radio-group>

    <van-radio-group class="field field-radio" v-model="hasCar" v-else>
      <van-radio name="1" class="radio" @click="getRadio(1)">是</van-radio>
      <van-radio name="2" class="radio" @click="getRadio(2)">否 </van-radio>
    </van-radio-group>

  </div>
</template>
<script>
  import { RadioGroup, Radio } from 'vant'
  export default {
    name: 'qDateRange',
    components: {
      [RadioGroup.name]: RadioGroup,
      [Radio.name]: Radio
    },
    props: {
      isReadonly: {
        type: Boolean,
        default: false
      },
      isHasCar: {
        type: String,
        default: '1' // 1 有车辆  2 没有车辆
      }
    },
    data() {
      return {
        hasCar: '', // 是否有车辆
      }
    },
    created() {
      this.hasCar = this.isHasCar
    },

    mounted() {
    },

    destroyed() {},

    methods: {
      // 是否有车辆
      getRadio(val){
        this.$emit('get-value', this.hasCar);
      },
    }
  }
</script>
<style scoped lang="less">
.field-radio{
  border: 1px solid #dbdbdb;
  border-bottom: none;
  .radio{
    padding:14px 0;
    border-bottom: 1px solid #dbdbdb;
    padding-left:8px;
  }
}
</style>
