<template>
  <!-- 文本框 -->
  <div>
    <van-field
      v-model= val
      clearable
      :placeholder="placeholder"
      :type="fieldtype"
      :class="`qfield ${fieldStyle}`"
      @click="aaa"
    />
    <van-picker
      show-toolbar
      v-model= 'showPicker'
      :columns="columns"
      :close-on-click-overlay=false
      :class="`qfield ${fieldStyle}`"
      @cancel="closePickerPopup"
      :type="fieldtype"
      @confirm="onConfirm"
      @click-overlay="closePickerPopup"
    />
  </div>
</template>
<script>
  import { Picker, Field } from 'vant'
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'qField',
    components: {
      [Picker.name]: Picker,
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
        default: 'picker'
      },
      fieldStyle: { // 样式类名
        type: String,
        default: ''
      }
    },
    data() {
      return {
        val: '',
        showPicker: ''
      }
    },
    watch: {
      val (val) {
        this.$emit('get-value', val);   // 调用input触发v-model更新
      },
    },
    created() {
      this.getZJList();
    },

    mounted() {
    },

    destroyed() {},

    methods: {
      ...mapActions([
        'updateLoadingStatus'
      ]),
      aaa () {
        console.log('####################')
      },
      // 选择证件类型、受访人部门
      onConfirm() {
        this.showPicker = false;
      },
      closePickerPopup (){
        this.showPicker = false
      },
      // 获取证件类型
      async getZJList () {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComWXApi/PostObject', {
          apiName: 'apiVisitor.GetZJList',
          category: 'DM-ZJLX'
        });
        if (d.status && d.status === "error") {
          console.log('获取证件类型失败', d);
          return;
        }
        this.updateLoadingStatus(false);
        this.lst[2].zjLst = d.data;
        d.data.forEach(item => {
          this.lst[2].data.push(item.codename)
        })
        if (this.lst[2].val === ''){
          this.lst[2].val = this.lst[2].data[0]
        }
      },
    }
  }
</script>
<style scoped>
  .qpicker{
    margin-top: 20px;
    border: 1px solid #dbdbdb;
    padding: 4px 8px;
  }
</style>
