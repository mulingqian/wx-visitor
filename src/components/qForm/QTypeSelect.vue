<template>
  <!-- 下拉类型选择 -->
  <div>
    <div @click="doCalendarPanel" class="date-range clearfloat" :class="isReadonly? 'readonly-style': 'select-style'">{{currZJLX}}</div>
    <van-popup v-model="showPicker" round position="bottom">
      <van-picker
        show-toolbar
        :columns="data"
        :close-on-click-overlay=false
        :default-index= "defaultIndex"
        @cancel="closePickerPopup"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>
<script>
  import { Picker, Popup } from 'vant'
  export default {
    name: 'qTypeSelect',
    components: {
      [Picker.name]: Picker,
      [Popup.name]: Popup
    },
    props: {
      defaluteData: {
        type: String,
        default: ''
      },
      defaluteIdx: {
        type: String,
        default: ''
      },
      data: {
        type: Array,
        default: ''
      },
      isReadonly: {
        type:Boolean,
        default: false
      }
    },
    data() {
      return {
        showPicker: false,
        idx: -1,
        currZJLX: '',
        defaultIndex: 0 // 默认选中值
      }
    },
    created() {
      this.currZJLX = this.defaluteData;
      if (this.defaluteIdx){
        this.defaultIndex = this.defaluteIdx
      } else {
        this.defaultIndex = this.defaultIndex
      }
    },

    mounted() {
    },

    destroyed() {},

    methods: {
      // 显示类型选择面板
      doCalendarPanel () {
        if (!this.isReadonly){
          this.showPicker = true;
        }
      },
      // 选择证件类型、受访人部门
      onConfirm(value) {
        this.showPicker = false;
        this.isLink = false
        this.currZJLX = value;
        this.$emit('get-value', value);
      },
      closePickerPopup (){
        this.showPicker = false
      }
    }
  }
</script>
<style scoped>
  .date-range{
    position: relative;
    width: 100%;
    min-height: 32px;
    padding: 8px;
    font-size: 14px;
    border: 1px solid #dbdbdb;
  }
  .select-style{
    color: #333;
  }
  .readonly-style{
    color: #c8c9cc;
  }
</style>
