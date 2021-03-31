<template>
  <div class="search">
    <van-cell-group class="detail-info">
      <div v-for="(item, idx) in lst" class="lst" :key="idx">
        <template v-if="item.show">
          <p>{{item.title}}</p>
          <!--文本框-->
          <van-field
            v-model=item.val
            clearable
            :placeholder="item.title"
            class="field"
            v-if="item.type== 'string'"
          />
          <van-field
            type="number"
            clearable
            v-model=item.val
            :placeholder="item.title"
            class="field"
            maxlength="11"
            v-if="item.type== 'number'"
          />
          <div v-if="item.type== 'date'" @click="showCalendarPopup = true" class="lfDate">
            <span>{{item.val.split(',')[0]}}</span>至
            <span>{{item.val.split(',')[1]}}</span>
          </div>
        </template>
      </div>
    </van-cell-group>
    <div class="button-box">
      <!--<van-button plain hairline round  type="info" class="button" @click="goDetail">查看详情</van-button>-->
      <van-button round hairline type="info" class="button" @click="goResult">查询</van-button>
    </div>
    <van-calendar v-model="showCalendarPopup" type="range" @confirm="onConfirm" />
  </div>
</template>
<script>
  import { CellGroup, Field, Button, Calendar, Cell } from 'vant'
  export default {
    name: 'search',
    components: {
      [CellGroup.name]: CellGroup,
      [Field.name]: Field,
      [Button.name]: Button,
      [Calendar.name]: Calendar,
      [Cell.name]: Cell
    },
    props: {
    },
    data() {
      return {
        showCalendarPopup: false, // 日期组件
        lst:[
          {
            key: 'lfDate',
            title: '来访日期范围',
            type: 'date',
            val: '',
            show: true
          },{
            key: 'lfName',
            title:'来访人姓名',
            type: 'string',
            val: '',
            show: true
          },{
            key: 'lfSJHM',
            title:'来访者手机',
            type: 'number',
            val: '',
            show: true
          },{
            key: 'lfCompany',
            title:'来访者单位',
            type: 'string',
            val: '',
            show: true
          },{
            key: 'sfDepart',
            title:'被访部门',
            type: 'string',
            val: '',
            data:['学生处', '学生处1', '学生处2', '学生处3'],
            show: true
          },{
            key: 'zjhm',
            title:'来访者身份证号',
            type: 'string',
            val: '',
            show: true
          }
        ]
      }
    },
    created() {
      // 根据用户判断加载 1 门卫
      if(this.$route.query.userType){
        this.lst[0].show = false
        this.lst[3].show = false
        this.lst[4].show = false
      } else {
        this.lst[5].show = false
      }
    },
    mounted() {
    },
    destroyed() {},
    methods: {
      // 关闭日历组件
      onConfirm(date) {
        var dateArray = JSON.stringify(date)
        var ksDate = this.QD.addDate(dateArray.substring(2, 12))
        var lkDate = this.QD.addDate(dateArray.substring(29, 39))
        console.log(dateArray, ksDate, lkDate)
        this.lst[0].val = ksDate+','+lkDate
        this.showCalendarPopup = false
      },
      // 查询
      goResult(){
        if (this.$route.query.userType){
          this.$router.push({path: "./searchResult", query:{showStatusType:4, contentType:4}})
        } else {
          this.$router.push({path: "./searchResult"})
        }
      }
    }
  }
</script>
<style scoped lang="less">
.search{
  .lst {
    margin: 32px 24px 20px;
    p {
      color: #333;
      font-weight: bold;
    }
    .field {
      padding: 20px 0 0;
    }
    .lfDate{
      display: flex;
      color:#333;
      font-size:14px;
      border: 1px solid #dbdbdb;
      padding: 8px;
      margin-top: 20px;
      span{
        flex:1;
      }
      span:last-child{
        text-align: right;
      }
    }
  }

  .button-box{
    display:flex;
    padding:20px 24px 38px;
    .button{
      flex:1;
    }
  }
}
</style>
<style lang="less">
  .search{
    .field{
      input{
        color:#333;
        font-size:14px;
        border:1px solid #dbdbdb;
        padding:4px 8px;
      }
    }
  }
</style>
