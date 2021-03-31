<template>
<div class="visitApply" v-if="!submitSuccess">
  <van-cell-group class="detail-info">
    <div v-for="(item, idx) in lst" class="lst" :key="idx">
      <p>
        <span
          v-if="idx<2"
          style="color:red;vertical-align: sub;font-size: 20px;">*</span>
        {{item.title}}
      </p>
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
      <van-field
        v-model=item.val
        :placeholder="item.title"
        rows="1"
        autosize
        clearable
        type="textarea"
        class="field"
        v-if="item.type== 'textarea'"
      />
      <!--选择器 @click="showPicker = true"-->
      <van-field
        readonly
        clickable
        class="field"
        :value="item.val"
        :placeholder="'选择'+item.title"
        @click="openPopup(item,idx)"
        v-if="item.type=== 'picker'"
      />
      <!--单选框-->
      <van-radio-group
        v-model="item.val"
        class="field"
        v-if="item.type=== 'radio'">
        <van-radio name="1" class="radio">是</van-radio>
        <van-radio name="2" class="radio">否</van-radio>
      </van-radio-group>
      <!--日期类型 @click="dateShow = true"-->
      <van-cell
        class="dateCell"
        title="选择日期"
        :value="item.val"
        @click="openDatePopup(item,idx)"
        v-if="item.type=== 'date'"
      />
    </div>
    <!--随访人-->
    <div class="lst">
      <div v-for="(item, idx) in sfLst" class="lst" :key="idx">
        <p>随访人姓名{{idx+1}}</p>
        <van-field
          v-model=item.Name
          placeholder="请添加随访人"
          class="field"
        />
      </div>
      <div class="addHandel" @click="addSFR">添加随访人</div>
    </div>
    <!--附件-->
    <div class="lst">
      <p>附件</p>
      <van-uploader style="width:100%;"  v-model="uploaderFile.fileList" multiple >
        <!--&lt;!&ndash;<div class="addHandel addUploader">添加附件</div>&ndash;&gt;-->
      </van-uploader>
      <div class="addHandel addUploader" @click="uploaderFile.showUploaderPopup = true">添加附件</div>
    </div>
  </van-cell-group>
  <div class="sumbit" @click="handelSubmit">提交申请</div>
  <!--证件类型下拉框组件-->
  <van-popup v-model="picker.showPicker" round position="bottom">
    <van-picker
      show-toolbar
      :columns="picker.columns"
      @cancel="picker.showPicker = false"
      @confirm="onConfirm"
    />
  </van-popup>
  <!--时间选择组件-->
  <van-calendar v-model="date.showDate" @confirm="onDateConfirm" />
  <!--上传类型-->
  <van-popup round v-model="uploaderFile.showUploaderPopup" class="uploader-popup">
    <div>
      <van-uploader
        class="uploader"
        accept="image/*,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        :after-read="afterRead">
        <span class="icon-visitor uploader-icon">&#xe8f5;</span>
        <span>上传附件</span>
      </van-uploader>
      <van-uploader class="uploader" capture="camera">
        <span class="icon-visitor uploader-icon">&#xe650;</span>
        <span>拍照上传</span>
      </van-uploader>
      <div class="cancel-button">
        <van-button plain  round  hairline type="info" @click="uploaderFile.showUploaderPopup = false">取消</van-button>
      </div>
    </div>
  </van-popup>
</div>
<div class="visitApply" v-else>
  <svg class="icon" aria-hidden="true">
    <use xlink:href="#icontijiaochenggong1"></use>
  </svg>
  <div v-if="this.type == 2" class="success-title inBankTitle">
    <p>你代填报的来访申请提交成功</p>
    <p>审批通过后请及时把二维码分享给来访人</p>
  </div>
  <p v-else class="success-title">来访申请提交成功</p>
  <div class="button-box">
    <van-button plain hairline round  type="info" class="button" @click="goDetail">查看详情</van-button>
    <van-button round hairline type="info" class="button" @click="goHome">返回首页</van-button>
  </div>
</div>
</template>
<script>
  import { CellGroup, Field, Picker, Radio, RadioGroup, Popup, Calendar, Cell, Uploader, Button, Dialog, Notify  } from 'vant'
  export default {
    name: 'visitApply',
    components: {
      [CellGroup.name]: CellGroup,
      [Field.name]: Field,
      [Picker.name]: Picker,
      [Radio.name]: Radio,
      [RadioGroup.name]: RadioGroup,
      [Popup.name]: Popup,
      [Calendar.name]: Calendar,
      [Cell.name]: Cell,
      [Uploader .name]: Uploader,
      [Button  .name]: Button
  },
    props: {},
    data() {
      return {
        type:1,
        nowDate: '',
        submitSuccess: false,
        picker:{
          showPicker:false,
          idx:-1,
          columns: ['户口身份证', '户口本', '学生证', '军官证'],
        },// 下拉选择框
        date: {
          date: '',
          idx:-1,
          showDate: false, //日期
        },
        lst:[
            {
              key: 'lfName',
              title:'来访人姓名',
              type: 'string',
              val: ''
            },{
            key: 'lfSJHM',
            title:'来访者手机',
            type: 'number',
            val: ''
            },{
            key: 'zjlx',
            title:'证件类型',
            type: 'picker',
            val: '户口身份证',
            data:['户口身份证', '户口本', '学生证', '军官证']
            },{
            key: 'zjhm',
            title:'证件号码',
            type: 'string',
            val: ''
            },{
            key: 'hasCar',
            title:'是否有车辆',
            type: 'radio',
            val: '1'
            },{
            key: 'lfCompany',
            title:'来访者单位',
            type: 'string',
            val: ''
            },{
            key: 'lfZw',
            title:'来访者职务',
            type: 'string',
            val: ''
            },{
            key: 'visitDate',
            title:'来访日期',
            type: 'date',
            val: this.nowDate
            },{
            key: 'leaveDate',
            title:'离开日期',
            type: 'date',
            val: this.nowDate
            },{
            key: 'reason',
            title:'来访事由',
            type: 'string',
            val: ''
            },{
            key: 'sfName',
            title:'受访人',
            type: 'string',
            val: ''
            },{
            key: 'sfDepart',
            title:'受访人部门',
            type: 'picker',
            val: '',
            data:['学生处', '学生处1', '学生处2', '学生处3']
            },{
            key: 'sfSJHM',
            title:'受访人手机',
            type: 'number',
            val: ''
            },{
            key: 'createTime',
            title:'登记时间',
            type: 'date',
            val: ''
            },{
            key: 'remark',
            title:'备注',
            type: 'textarea',
            val: ''
            },{
            key: '',
            title:'随访人数',
            type: 'string',
            val: ''
            },
            ],
        sfLst: [
          {Name: ''}
        ], // 随性人员
        uploaderFile:{
          fileList: [],
          showUploaderPopup: false
        },//文件上传
      }
    },
    created(){
      if (this.QD.currPageDataToOther){
        let info = this.QD.currPageDataToOther;
        this.QD.currPageDataToOther = null
        console.log(info, '@@@@@@@@@@')
        for (let key in info.info){
          this.lst.forEach(item=>{
            if (key === item.key){
              item.val = info.info[key]
            }
          })
        }
      }
      this.type = this.$route.query.type
      this.nowDate = this.QD.getCurrDate()
    },
    methods: {
      // 选择证件类型
      onConfirm(value) {
        console.log(value)
        //this.value = value;
        this.picker.showPicker = false;
        this.lst[this.picker.idx].val = value;
      },
      //打开证件下拉框
      openPopup(item, idx){
        console.log(item, idx,'点击的值',)
        this.picker.columns = item.data;
        this.picker.idx = idx;
        this.picker.showPicker = true;
      },
      // 选择日期
      onDateConfirm (value){
        var date = JSON.stringify(value)
        this.lst[this.date.idx].val = date.substring(1,11)
        this.date.showDate = false;
      },
      openDatePopup(item, idx){
        this.date.idx = idx;
        this.date.showDate = true;
      },
      // 添加随访人
      addSFR(){
        let obj={Name: ''}
        this.sfLst.push(obj)
        console.log('添加随访人', this.sfLst)
      },
      // 上传成功
      afterRead(file) {
        console.log(file, '上传成功');
        this.uploaderFile.showUploaderPopup = false
        this.uploaderFile.fileList.push(file)
        console.log('uploaderFile.fileList', this.uploaderFile.fileList)
      },
      // 提交
      handelSubmit(){
        console.log(this.type)
        // 判断是否有车辆
        let HasCar=false;
        if (this.lst[4].val === '1'){
          HasCar = true;
        }
        // 当证件类型为身份证时校验身份证号码有效性
        if (this.lst[2].val === '户口身份证'){
           var isCard = this.QD.isCardID(this.lst[3].val)
          if (!isCard){
            // Dialog({ message: '证件号无效' });
            Notify(
                {
                  type: 'warning',
                  message: '证件号无效',
                  color: '#fff',
                  background: '#CC0033',
                });
            //return
          }
        }
        this.sfLst.forEach((item, idx)=>{
          if (item.Name === ''){
            this.sfLst.splice(1, idx)
          }
        })
        let obj={
          "WeChatId": "string", // 若为空 空字符串
          "LFName": this.lst[0].val,
          "LFSJHM": this.lst[1].val,
          "ZJLX": this.lst[2].val,
          "ZJHM": this.lst[3].val,
          "HasCar": HasCar, // 是佛有车辆
          "LFCompany": this.lst[5].val,
          "LFZW": this.lst[6].val,
          "VisitDate": this.lst[7].val,
          "LeaveDate": this.lst[8].val,
          "Reason": this.lst[9].val,
          "SFName": this.lst[10].val,
          "SFDepart": this.lst[11].val,
          "SFSJHM": this.lst[12].val,
          "SelfApply": true,
          "Remark": this.lst[14].val,
          "Attaches": [ // 附件
            {
              "AttData":"base64",
              "FileName":"FileName"
            }
          ],
          "Details": this.sfLst // 随访人员
        }
        // TODO 调用保存接口
        this.submitSuccess = true;
      },
      // 查看详情
      goDetail(){
        this.$router.push({path: './VisitDetail'})
      },
      //返回首页
      goHome(){
        this.$router.push({path: './userbind'})
      }
      // 上传附件
//      openPopup(){
//        this.showUploaderPopup = true;
//      }
    }
  }
</script>
<style lang="less" scoped>
.visitApply{
  padding:0 16px;
  .lst{
    margin:32px 0 12px;
    p{
      color:#333;
      font-weight:bold;
    }
    .field{
      padding:20px 0 0;
    }
    .radio{
      border:1px solid #dbdbdb;
      padding:12px;
    }
    //上传
    .addHandel{
      color: #666;
      line-height: 30px;
      border-radius: 5px;
      background: #dbdbdb;
      text-align: center;
      /*margin-top:-12px;*/
    }
    .addUploader{
      margin-top:32px;
      width:100%;
    }
  }
  .uploader-popup{
    width:80%;
    >div{
      width: 80%;
      margin: auto;
      text-align: center;
      padding: 48px 0 40px;
      .uploader{
        line-height: 50px;
        height: 50px;
        width: 100%;
        margin-bottom: 20px;
        text-align: center;
        background:@color3;
        .uploader-icon{
          margin-right:12px;
        }
      }
      .cancel-button{
        width:80%;
        margin:20px auto;
        .van-button{
          width:100%;
        }
      }
    }
  }
  .sumbit{
    line-height: 30px;
    color: #fff;
    background: @theme-color;
    border-radius: 15px;
    text-align: center;
    margin: 60px 0;
  }
  /*提交成功*/
  .icon{
    width:100%;
    height:220px;
    margin-top:40px;
  }
  .success-title{
    color: #999;
    font-size:14px;
    text-align: center;
    position: relative;
    top: -20px;
    margin-bottom: 40px;
  }
  .inBankTitle{
    margin-bottom: 20px;
    >p:first-child{
      margin-bottom:12px;
    }
  }
  .button-box{
    display:flex;
    .button{
      flex:1;
    }
    .button:first-child{
      margin-right:16px;
    }
    .button:last-child{
      margin-left:16px;
    }
  }
}
</style>
<style lang="less">
  .visitApply{
    .field{
      input,
      textarea{
        border:1px solid #dbdbdb;
        padding:4px 8px;
      }
    }
    .dateCell{
      border:1px solid #dbdbdb;
      padding: 6px 8px;
      margin-top:12px;
    }
    .van-uploader{
      .van-uploader__input-wrapper{
        width:100%;
      }
    }
  }
</style>
