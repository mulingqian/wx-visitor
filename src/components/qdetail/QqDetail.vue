<template>
  <div class="qq-detail">
    <qq-detail :title="'来访者'" :value="item.lfName"></qq-detail>
    <qq-detail :title="'来访者手机'" :value="item.lfSJHM"></qq-detail>
    <qq-detail :title="'证件类型'" :value="item.zjlx"></qq-detail>
    <qq-detail :title="'证件号码'" :value="item.zjhm"></qq-detail>
    <qq-detail :title="'是否有车辆'" :value="item.hasCar ? '是' : '否'"></qq-detail>

    <qq-detail :title="'车牌号'" :value="carNumber"></qq-detail>

    <qq-detail :title="'来访者单位'" :value="item.lfCompany"></qq-detail>
    <qq-detail :title="'来访者职务'" :value="item.lfZw"></qq-detail>
    <qq-detail :title="'来访日期'" :value="item.visitDate"></qq-detail>
    <qq-detail :title="'离开日期'" :value="item.leaveDate"></qq-detail>
    <qq-detail :title="'来访事由'" :value="item.reason"></qq-detail>
    <qq-detail :title="'受访者'" :value="item.sfName"></qq-detail>
    <qq-detail :title="'受访者部门'" :value="item.sfDepart"></qq-detail>

    <qq-detail :title="'受访者手机'" :value="item.sfSJHM"></qq-detail>
    <qq-detail :title="'校区'" :value="item.areaName"></qq-detail>

    <qq-detail :title="'登记时间'" :value="item.createTime"></qq-detail>
    <qq-detail :title="'备注'" :value="item.remark"></qq-detail>
    <qq-detail :title="'随访人数'" :value="item.details.length"></qq-detail>
    <qq-detail :title="'随访人姓名'" :value="followLfNames"></qq-detail>
    <qq-atts @seeAtts="seeAtts"></qq-atts>

    <!--查看附件 start-->
    <van-popup v-model="showAtts" round class="attsPopup">
      <p>附件信息</p>
      <div v-if="item.atts.length > 0" class="fileBox">
        <div v-for="(attsItem, idx) in item.atts" :key="idx">
          <img :src="attsItem.filePath" v-if="attsItem.showImg">
          <a v-else :href="attsItem.filePath">
            <span class="icon-visitor">&#xe602;</span>{{attsItem.fileName}}
          </a>
        </div>
        <!--</div>-->
      </div>
      <van-empty v-else description="无附件信息" />
    </van-popup>
    <!--查看附件 end-->
  </div>
</template>
<script>
  import QqDetail from './QqLst.vue'
  import QqAtts from './QqAtts.vue'
  import { Popup, Empty } from 'vant';
  export default {
    name: 'qqDetailDetail',
    components: {
      QqDetail,
      QqAtts,
      [Popup.name]: Popup,
      [Empty.name]: Empty
    },
    props: {
      item: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        showAtts: false, // 显示附件
        followLfNames: '', // 随访人姓名
        carNumber: '', // 车牌号
        atts: '' // 附件
      }
    },
    created() {
      this.getFollowLfNames(); // 随访人姓名
      if (this.item.atts.length > 0){
        this.item.atts.forEach(items => {
          if (items.filePath.substr(items.filePath.length-4).indexOf('jpg') !== -1 || items.filePath.substr(items.filePath.length-4).indexOf('png') !== -1){
            this.$set(items, 'showImg', true)
          } else {
            this.$set(items, 'showImg', false)
          }
        })
      }
    },

    mounted() {},

    destroyed() {},

    methods: {
      // 随访人姓名
      getFollowLfNames () {
        if (this.item) {
          /* 随访人 */
          for (let i=0; i<this.item.details.length; i++) {
            if (i !== 0 && i !== this.item.details.length -1) {
              this.followLfNames += ','
            }
            this.followLfNames += this.item.details[i].name
          }
          /* 车牌号 */
          for (let k=0; k<this.item.carNumber.length; k++) {
            if (k !== 0 && k !== this.item.carNumber.length -1) {
              this.carNumber += ','
            }
            this.carNumber += this.item.carNumber[k]
          }
        }
      },
      // 查看附件
      seeAtts(){
        this.showAtts = true;
        console.log(this.item)
      }
    }
  }
</script>
<style scoped lang="less">
  .attsPopup{
    width:74%;
  }
  .attsBox{
    display: inline-block;
  }
  .fileBox{
    padding:10px 0 20px;
    a{
      display: block;
      padding: 12px 8px;
      margin-bottom: 8px;
      background: #f2f2f2;
      font-size: 12px;
      color: #333;
      >span{
        margin-right:12px;
        vertical-align: middle;
      }
    }
  }
  .attsPopup>p {
    margin:20px auto;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
  }
  .attsPopup img{
    width:100px;
    margin:10px;
    border:1px solid @theme-color;
  }
</style>
