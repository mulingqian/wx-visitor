<template>
  <div class="visitDetailCommon">
    <daice
      :data="info.info"
      :type=1
    ></daice>

    <van-cell-group class="detail-info">
      <van-field label='来访人姓名' v-model=data.lfName readonly/>
      <van-field label='来访者手机' v-model=data.lfSJHM readonly/>
      <van-field label='证件类型' v-model=data.zjlx readonly/>
      <van-field label='证件号码' v-model=data.zjhm readonly/>
      <van-field label='是否有车辆' v-model=data.hasCar readonly/>
      <van-field label='来访者单位' v-model=data.lfCompany readonly/>
      <van-field label='来访者职务' v-model=data.lfZw readonly/>
      <van-field label='采访日期' v-model=data.visitDate readonly/>
      <van-field label='离开日期' v-model=data.leaveDate readonly/>
      <van-field label='来访事由' v-model=data.reason readonly/>
      <van-field label='受访人' v-model=data.sfName readonly/>
      <van-field label='受访人部门' v-model=data.sfDepart readonly/>
      <van-field label='受访人手机' v-model=data.sfSJHM readonly/>
      <van-field label='登记时间' v-model=data.createTime readonly/>
      <van-field label='备注' v-model=data.remark readonly/>
      <van-field label='随访人姓名' v-model=data.details readonly/>
      <van-field label='附件' v-model=data.atts readonly/>
    </van-cell-group>
      <slot name="edit-icon"></slot>
      <slot name="approval-icon"></slot>
  </div>
</template>
<script>
  import visitRecordLst from '@/components/VisitRecordLst.vue'
  import daice from '@/components/Daice.vue'
  import { CellGroup, Field } from 'vant'
  export default {
    name: 'visitDetailCommon',
    components: {
      visitRecordLst,
      daice,
      [CellGroup.name]: CellGroup,
      [Field.name]: Field
    },
    props: {
      info: Object
    },
    data() {
      return {
        data: {},
        lst:['来访人姓名','来访者手机','证件类型','证件号码','是否有车辆','来访者单位','来访者职务','来访日期', '离开日期','来访事由','受访人','受访人部门','受访人手机','登记时间','备注','随访人姓名', '附件']
      }
    },

    created() {
      console.log('info', this.info.info)
      this.data = this.info.info
      for (var key in this.info.info) {
        console.log('item', this.info.info[key])
      }
    },

    mounted() {},

    destroyed() {},

    methods: {
    },
  };
</script>
<style lang="less" scoped>
.visitDetailCommon{
  .detail-info{
    margin-bottom:50px;
  }
}
</style>
<style lang="less">
  .visitDetail{
    .detail-info{
      .van-field__label{
        color:#999;
      }
      .van-field__control{}
        color:#333;
      }
  }
</style>
