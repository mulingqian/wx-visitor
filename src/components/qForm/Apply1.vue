<template>
<div class="visitApply" v-if="!submitSuccess">
  <van-form @submit="onSubmit">
    <van-cell-group class="detail-info" :border="false">
    <div v-for="(item, idx) in lst" class="lst" :key="idx">
      <p v-if="item.show && item.key !== 'cph'">
        <span
          v-if="item.show &&  item.required"
          class="required"
          >*</span>
        {{item.title}}
      </p>
        <!--文本框 start-->
        <van-field
          v-model=item.val
          clearable
          :disabled="isReadonly"
          :placeholder="item.title"
          class="field"
          :class="isReadonly? 'readonly' : ''"
          v-if="item.type== 'string' && item.show && item.key !== 'cph'"
        />
        <van-field
          type="number"
          clearable
          v-model=item.val
          :disabled="isReadonly"
          :placeholder="item.title"
          class="field"
          :class="isReadonly? 'readonly' : ''"
          maxlength="11"
          v-if="item.type== 'number' && item.show"
        />
        <van-field
          v-model=item.val
          :disabled="isReadonly"
          :placeholder="item.title"
          rows="1"
          autosize
          clearable
          type="textarea"
          class="field"
          :class="isReadonly? 'readonly' : ''"
          v-if="item.type== 'textarea'"
        />
        <!--文本框 end-->
        <!--选择器 start-->
        <van-field
          v-model=item.val
          clearable
          :disabled="isReadonly"
          :placeholder="item.title"
          class="field"
          :class="isReadonly? 'readonly' : ''"
          v-if="item.type== 'picker' && isReadonly"
        />
        <van-field
          clickable
          class="field file-picker"
          :class="isReadonly? 'readonly' : ''"
          :is-link="true"
          :disabled="isReadonly"
          :arrow-direction="item.isLink? 'up': 'down'"
          :value="item.val"
          :placeholder="'选择'+item.title"
          @click="openPopup(item,idx)"
          v-if="item.type=== 'picker' && !isReadonly"
        />
        <!--选择器 end-->
        <!--单选框 start-->
        <van-radio-group
          v-model="item.val"
          class="field field-radio"
          v-if="item.type=== 'radio'">
          <van-radio name="1" class="radio" :disabled="isReadonly" v-if="!isReadonly"
                     @click="getRadio(1)">是</van-radio>
          <van-radio name="2" class="radio" :disabled="isReadonly" v-if="!isReadonly"
                     @click="getRadio(2)">否</van-radio>
          <van-radio name="1" class="radio" :disabled="isReadonly" v-if="isReadonly">是</van-radio>
          <van-radio name="2" class="radio" :disabled="isReadonly" v-if="isReadonly">否</van-radio>
        </van-radio-group>
        <!--单选框 end-->
        <!--日期类型 start-->
        <van-cell
          class="dateCell"
          title="选择日期"
          :value="item.val"
          @click="openDatePopup(item,idx)"
          v-if="item.type=== 'date' && item.show"
        />
        <!--日期类型 end-->
        <!--车牌号 start-->
      <div class="lst" v-if="item.type== 'string' && item.show && item.key === 'cph'">
        <div v-for="(items, idx) in item.lst" class="lst" :key="idx">
          <p>
            <span
            v-if="item.show &&  item.required"
            class="required"
          >*</span> 车牌号{{idx+1}}
          </p>
          <van-field
            clearable
            v-model=items.cph
            :disabled="isReadonly"
            placeholder="车牌号填写格式为一车一行记录"
            class="field"
            :class="isReadonly? 'readonly' : ''"
            style="width:90%;"
          />
          <span class="icon-visitor del-icon" v-if="!isReadonly" @click="delCPH(item, idx)">&#xe61a;</span>
        </div>
        <div class="addHandel" v-if="!isReadonly" @click="addCPH(item)" >添加车辆</div>
      </div>
      <!--车牌号 end-->
    </div>

    <!--随访人 start-->
    <div class="lst">
      <div v-for="(item, idx) in sfLst" class="lst" :key="idx">
        <p>随访人姓名{{idx+1}}</p>
        <van-field
          clearable
          v-model=item.Name
          :disabled="isReadonly"
          placeholder="随访人员填写格式为一人一行记录"
          class="field"
          :class="isReadonly? 'readonly' : ''"
          style="width:90%;"
        />
        <span class="icon-visitor del-icon" v-if="!isReadonly" @click="delSFR(idx)">&#xe61a;</span>
      </div>
      <div class="addHandel" v-if="!isReadonly" @click="addSFR">添加随访人</div>
    </div>
    <!--随访人 end-->

    <!--附件 start-->
    <div class="lst">
      <p>附件</p>
      <van-uploader style="width:100%;margin:16px 0" :disabled="isReadonly" accept="image/*,.doc,.docx,.xlsx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" v-model="uploaderFile.fileList" multiple >
      </van-uploader>
      <div
        class="addHandel addUploader"
        v-if="!isReadonly"
        @click="uploaderFile.showUploaderPopup = true">添加附件
      </div>
    </div>
    <!--附件 end-->
  </van-cell-group>
    <van-button round hairline type="submit" class="sumbitBtn">提交申请</van-button>
  </van-form>
  <!--证件类型下拉框组件 start"picker.showPicker = false"-->
  <van-popup v-model="picker.showPicker" round position="bottom">
    <van-picker
      show-toolbar
      :columns="picker.columns"
      :close-on-click-overlay=false
      :default-index= "picker.defaultIndex"
      @cancel="closePickerPopup"
      @confirm="onConfirm"
      @click-overlay="closePickerPopup"
    />
  </van-popup>
  <!--证件类型下拉框组件 end-->

  <!--时间选择组件-->
  <van-popup v-model="date.showDate" round position="bottom">
  <van-datetime-picker
    v-model="date.date"
    type="datetime"
    title="选择完整时间"
    @confirm="onDateConfirm"
  />
  </van-popup>
  <!--上传类型 start-->
  <van-popup round v-model="uploaderFile.showUploaderPopup" class="uploader-popup">
    <div>
      <van-uploader
        class="uploader"
        accept="image/*,.doc,.docx,.xlsx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        :after-read="afterRead">
        <span class="icon-visitor uploader-icon">&#xe8f5;</span>
        <span>上传附件</span>
      </van-uploader>
      <van-uploader class="uploader" capture="camera" :after-read="afterRead">
        <span class="icon-visitor uploader-icon">&#xe650;</span>
        <span>拍照上传</span>
      </van-uploader>
      <div class="cancel-button">
        <van-button plain  round  hairline type="info" @click="uploaderFile.showUploaderPopup = false">取消</van-button>
      </div>
    </div>
  </van-popup>
  <!--上传类型 end-->
</div>
<div class="visitApply" v-else>
  <svg class="icon" aria-hidden="true">
    <use xlink:href="#icontijiaochenggong1"></use>
  </svg>
  <slot name="visit-apply"></slot>
  <slot name="interviewee-apply"></slot>
  <div class="button-box">
    <van-button plain hairline round type="info" class="button" @click="goDetail">查看详情</van-button>
    <van-button round hairline type="info" class="button" @click="goHome">返回首页</van-button>
  </div>
</div>
</template>
<script>
  import { CellGroup, Field, Picker, Radio, RadioGroup, Popup, Calendar, Cell, Uploader, Button, Dialog, Notify, Form, DatetimePicker  } from 'vant'
  import { mapState, mapActions } from 'vuex'
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
      [Button.name]: Button,
      [Form.name]: Form,
      [DatetimePicker.name]: DatetimePicker
  },
    props: {
      info: Object,
      selfApply: Boolean,
      submitSuccess: Boolean,
      wechatId: String,
      isReadonly: {
        type:Boolean,
        default: false
      }
    },
    data() {
      return {
        nowDate: '',
        minDate: '',
        maxDate: '',
        id: null, // 申请id值
        picker:{
          showPicker:false,
          idx:-1,
          defaultIndex: 0, // 默认选中值
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
              val: '',
              show: true,
              required: true,
              num: 1
            },{
            key: 'lfSJHM',
            title:'来访者手机',
            type: 'number',
            val: '',
            show: true,
            required: true,
            num: 2
            },{
            key: 'zjlx',
            title:'证件类型',
            type: 'picker',
            val: '',
            zjLst: null,
            isLink: false,
            data:[],
            show: true,
            required: true,
            num: 3
            },{
            key: 'zjhm',
            title:'证件号码',
            type: 'string',
            val: '',
            show: true,
            required: true,
            num: 4
            },{
            key: 'hasCar',
            title:'是否有车辆',
            type: 'radio',
            val: '1',
            show: true,
            num: 5
            },{
            key: 'clsl',
            title:'车辆数量',
            type: 'number',
            val: '',
            show: true,
            required: true,
            num: 6
            },{
            key: 'cph',
            title:'来访车牌号填写',
            type: 'string',
            val: '',
            lst: [{cph: ''}],
            show: true,
            required: true,
            num: 7
            }, {
            key: 'lfCompany',
            title:'来访者单位',
            type: 'string',
            val: '',
            show: true,
            required: true,
            num: 8
            },{
            key: 'lfZw',
            title:'来访者职务',
            type: 'string',
            val: '',
            show: true,
            required: true,
            num: 9
            },{
            key: 'visitDate',
            title:'来访时间',
            type: 'date',
            val: '',
            show: true,
            required: true,
            num: 10
            },{
            key: 'leaveDate',
            title:'离开时间',
            type: 'date',
            val: '',
            show: true,
            required: true,
            num: 11
            },{
            key: 'reason',
            title:'来访事由',
            type: 'string',
            val: '',
            show: true,
            required: true,
            num: 12
            },{
            key: 'lfxq',
            title:'来访校区',
            type: 'picker',
            isLink: false,
            data:['福强校区', '侨城校区'],
            val: '福强校区',
            show: true,
            num: 13
            },{
            key: 'sfName',
            title:'受访人',
            type: 'string',
            val: '',
            show: true,
            required: true,
            num: 14
            },{
            key: 'sfDepart',
            title:'受访人部门',
            type: 'picker',
            val: '',
            isLink: false,
            departLst: null,
            data:[],
            show: true,
            num: 15
            },{
            key: 'sfSJHM',
            title:'受访人手机',
            type: 'number',
            val: '',
            show: true,
            required: false,
            num: 16
            },{
            key: 'createTime',
            title:'登记时间',
            type: 'date',
            val: '',
            show: false,
            num: 17
            },{
            key: 'remark',
            title:'备注',
            type: 'textarea',
            val: '',
            show: true,
            num: 18
            },{
            key: 'lfNum',
            title:'随访人数',
            type: 'number',
            val: '',
            show: true,
            num: 19
            }
            ],
        sfLst: [
          {Name: ''}
        ], // 随性人员
        uploaderFile:{
          oldLstLength: 0, // 老的数据
          fileList: [],
          showUploaderPopup: false
        },//文件上传
      }
    },
    computed: {
      ...mapState({
        gLoading: state => state.gLoading,
        userinfo: state => state.userinfo // 用户信息
      })
    },
    created(){
      //修改表单初始化
      if (this.info){
        for (let key in this.info){ // info有值表示修改表单
          // 处理附件渲染数据
          if( key === 'atts'){
            for (var i=0; i<this.info[key].length; i++){
              this.uploaderFile.fileList.push(
                {
                  url: this.info[key][i].filePath,
                  name:this.info[key][i].fileName,
                  id: this.info[key][i].id
                }
              )
            }
            this.uploaderFile.oldLstLength = this.uploaderFile.fileList.length
            // 处理随行人员数据
          } else if (key === 'details') {
            this.sfLst = []
            let sfrLst = this.info[key]
            for (var i = 0; i < sfrLst.length; i++) {
              this.sfLst.push({Name: sfrLst[i].name})
            }
            // 处理id
          } else if (key === 'id') {
            this.id = this.info[key]
            // 根据是否有车辆判断车牌号、车牌数量是否显示
          } else {
            this.lst.forEach(item => {
              if (key === item.key) {
                if (key === 'hasCar') { //是否有车辆
                  item.val = '2'
                  this.lst[5].show = false;
                  this.lst[6].show = false;
                  if (this.info[key]) {
                    item.val = '1'
                    this.lst[5].show = true;
                    this.lst[6].show = true;
                  }
                } else {
                  item.val = this.info[key].trim()
                }

              } else if (key === 'areaName' && item.key === 'lfxq'){
                item.val = this.info[key].trim()
                console.log(item, '校区')
                // 车辆数量
              } else if (key === 'carNumber' && item.key === 'clsl') {
                let clLst = this.info[key]
                item.val = clLst.length
                // 车牌号
              } else if (key === 'carNumber' && item.key === 'cph') {
                let clLst = this.info[key]
                if (clLst.length > 0) {
                  item.lst = []
                  for (var i = 0; i < clLst.length; i++) {
                    item.lst.push({cph: clLst[i]})
                  }
                }
              }
            })
          }
        }
      } else { // 提交申请初始化
        this.id = 0
        let date = this.QD.getCurrDatetime();
        this.nowDate = date.substr(0, date.length-3)
        this.minDate=new Date(2020, 0, 1)
        this.maxDate=new Date(2020, 0, 1)
        this.lst[9].val = this.nowDate
        this.lst[10].val = this.nowDate
      }
      this.getList(); //获取部门列表
      this.getZJList(); //获取证件类型
    },
    methods: {
      ...mapActions([
        'updateLoadingStatus'
      ]),
      // 修改页面时将yyyy-mm-dd hh:mm 转为标准时间格式用于默认选中值
      parserDate(date) {
        var t = Date.parse(date)
        // 处理IOS下日期转换问题
        if (isNaN(t)) {
          t = new Date(date.replace(/-/g, '/'));
        }
        return new Date(t)
      },
      // 格式化时间
      formatData(s){
        return s < 10 ? '0' + s : s
      },
      // 选择证件类型、受访人部门
      onConfirm(value) {
        this.picker.showPicker = false;
        this.lst[this.picker.idx].isLink = false
        this.lst[this.picker.idx].val = value;
      },
      closePickerPopup (){
        this.picker.showPicker = false
        this.lst[this.picker.idx].isLink = false
      },
      //打开证件下拉框
      openPopup(item, idx){
        item.isLink = true
        item.data.forEach((items,idx)=> {
            if (items === item.val){
              this.picker.defaultIndex = idx
            }
        })
        this.picker.columns = item.data;
        this.picker.idx = idx;
        this.picker.showPicker = true;
      },
      // 是否显示车辆以及车牌号填写框
      getRadio(val){
        if (val === 1){
          this.lst[5].show=true;
          this.lst[6].show=true;
        } else {
          this.lst[5].show=false;
          this.lst[6].show=false;
        }
      },
      // 删除车牌号
      delCPH (item, idx) {
        console.log(item, idx)
        item.lst.splice(idx, 1)
      },
      // 添加车牌号
      addCPH(item){
        item.lst.push({cph: ''})
      },
      // 选择日期
      onDateConfirm (value){
        const resDate = value.getFullYear() + '-' + this.formatData((value.getMonth() + 1)) + '-' + this.formatData(value.getDate())
        const resTime = this.formatData(value.getHours()) + ':' + this.formatData(value.getMinutes())
        this.lst[this.date.idx].val = resDate +' '+ resTime
        this.date.showDate = false;
      },
      openDatePopup(item, idx){
        this.date.date = this.parserDate(item.val)
        this.date.idx = idx;
        this.date.showDate = true;
      },
      // 删除随访人
      delSFR(idx){
        console.log(idx)
        this.sfLst.splice(idx, 1)
      },
      // 添加随访人
      addSFR(){
        let obj={Name: ''}
        this.sfLst.push(obj)
      },
      // 上传成功
      afterRead(file) {
        this.uploaderFile.showUploaderPopup = false
        this.uploaderFile.fileList.push(file)
      },
      // 提交
      onSubmit(){
        // 判断是否有车辆
        let HasCar=false;
        if (this.lst[4].val === '1'){
          HasCar = true;
          this.lst[5].required = true
          this.lst[6].required = true
          let isEmptyCph=false;
          for (var i=0; i<this.lst[6].lst.length; i++){
            if (this.lst[6].lst[i].cph !== ''){
              isEmptyCph = true
            }
            break;
          }
          if (!isEmptyCph){
            this.QD.alert({ title: "温馨提示", message: '来访车牌号填写不能为空'})
            return
          }
        } else {
          this.lst[5].required = false
          this.lst[6].required = false
        }

        // 判断数据是否为空
        let isEmpty=false;
        this.lst.forEach(item => {
          if (item.val === '' && item.show && item.required && item.key !== 'cph'){
            this.QD.alert({ title: "温馨提示", message: item.title + '不能为空'})
            isEmpty = true
          }
        })
        if (isEmpty){
          return
        }

        // 当证件类型为身份证时校验身份证号码有效性
        if (this.lst[2].val === '居民身份证'){
          var isCard = this.QD.isCardID(this.lst[3].val)
          if (!isCard){
            this.QD.alert({title: "温馨提示",message: '输入的证件号码无效'})
            return
          }
        }

        // 判断手机号是否有效
        if (!this.QD.verifyTel.test(this.lst[1].val)) {
          this.QD.alert({title: "温馨提示",message: '请正确填写来访者手机'});
          return
        }
        if (this.lst[15].val !== '' && !this.QD.verifyTel.test(this.lst[15].val)) {
          this.QD.alert({title: "温馨提示",message: '请正确填写受访人手机'})
          return
        }
        // 获取受访者部门id
        let sfDepart;
        if (this.lst[14].val){
          this.lst[14].departLst.forEach(item => {
            if (this.lst[14].val === item.ksmc){
              sfDepart = item
              return
            }
          })
        }
        //判断随访人姓名是否为空，若为空或者空着字符串删除
        this.sfLst.forEach((item, idx)=>{
          if (item.Name.trim() === ''){
            this.sfLst.splice(idx, 1)
          }
        })

        // 整理车牌号数据
        let carNumber='';
        this.lst[6].lst.forEach(item =>{
          if (item.cph !== ''){
            carNumber+= item.cph+ ","
          }
        })

        // 比较开始日期与结束日期
        let comData = this.QD.compareDateAndTime(this.lst[9].val, this.lst[10].val)
        if (comData >=0 ){
          this.QD.alert({title: '温馨提示', message: '请正确选择离开时间'})
          return
        }
        var formData = new FormData();

        // 判断是否和旧的附件一致，若不一致只上传新的附件
        let uploadobj = this.uploaderFile
        let newUploadLst = [] // 新增的附件信息
        let Attaches = [] // 保留的旧的附件信息
        uploadobj.fileList.forEach((item,idx) => {
          if(item.id){
            Attaches.push({FileId: item.id})
          } else {
            newUploadLst.push(item)
          }
        })
        uploadobj.fileList = newUploadLst;
        uploadobj.fileList.map((item)=>{
          formData.append('files', item.file ,item.file.name);
        })
        let obj={
          "WeChatId": this.wechatId, // 若为空 空字符串  om4flvlPAiD5yR9cT-nC2-3PyQTk
          "ID": this.id,
          "LFName": this.lst[0].val,
          "LFSJHM": this.lst[1].val,
          "ZJLX": this.lst[2].val,
          "ZJHM": this.lst[3].val,
          "HasCar": HasCar, // 是佛有车辆
          'CarNumber': carNumber.substr(0, carNumber.length-1),
          "LFCompany": this.lst[7].val,
          "LFZW": this.lst[8].val,
          "VisitDate": this.lst[9].val,
          "LeaveDate": this.lst[10].val,
          "Reason": this.lst[11].val,
          "AreaName": this.lst[12].val,
          "SFName": this.lst[13].val,
          "SFDepart": sfDepart.ksmc,
          'SFDepartId': sfDepart.ksid,
          "SFSJHM": this.lst[15].val,
          "SelfApply": this.selfApply,
          "Remark": this.lst[17].val,
          "LFNum": this.lst[18].val*1,
          "Attaches": Attaches,
          "Details": this.sfLst // 随访人员
        }
        formData.append('jsonData', JSON.stringify(obj))
        this.$emit('saveApplyData', formData)
      },
      // 查看详情
      goDetail(){
        this.$emit('goDetial')
      },
      //返回首页
      goHome(){
        this.$emit('goHome')
      },
      // 获取部门列表
      async getList () {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComWXApi/PostObject', {
          apiName: 'apiVisitor.GetList'
        });
        if (d.status && d.status === "error") {
          console.log('获取部门列表失败', d);
          return;
        }
        this.updateLoadingStatus(false);
        this.lst[14].departLst = d.data;
        d.data.forEach(item => {
          this.lst[14].data.push(item.ksmc)
        })
        if (this.lst[14].val === ''){
          this.lst[14].val = this.lst[14].data[0]
        }
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
      }
    }
  }
</script>
<style lang="less" scoped>
.visitApply{
  padding:0 24px;
  .detail-info{
    position: relative;
    padding-top: 32px;
  }
  .lst{
    margin: 0 0 36px 0;
    p{
      position: relative;
      /*float: left;*/
      color:#333;
      font-weight:bold;
    }
    .required{
      position: absolute;
      top: 0;
      left: -12px;
      color: #ff0000;
      vertical-align: sub;
      font-size: 20px;
    }
    .field{
      padding: 0 8px;
      margin-top: 20px;
      border: 1px solid #dbdbdb;
    }
    .readonly{
      background: rgba(244,244,244,0.7);
    }
    /* 单选题 start */
    .field-radio{
      padding: 0;
    }
    .radio{
      border-bottom: 1px solid #dbdbdb;
      padding:12px 8px;
    }
    .radio:last-child{
      border: 0;
    }
    /* 单选题 end */
    /*上传 start*/
    .addHandel{
      color: #666;
      line-height: 30px;
      border-radius: 5px;
      background: #dbdbdb;
      text-align: center;
      margin-top:-16px;
    }
    .addUploader{
      /*margin-top:32px;*/
      width:100%;
    }
    // 删除icon
    .del-icon{
      float: right;
      position: relative;
      top: -28px;
    }
  }
  /*上传类型模态框 start*/
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
  /*上传类型模态框 end*/
  .sumbitBtn{
    margin: 25px 0 60px;
    width:100%;
    background: @theme-color;
    border-radius: 15px;
    color: #fff;
    text-align: center;
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
        padding: 4px 0;
        color:#333;
        font-size: 16px;
      }
    }
    .file-picker{
      .van-cell__right-icon{
        position: absolute;
        right: 6px;
        top: 26px;
      }
    }
    .dateCell{
      position:relative;
      top:20px;
      padding: 6px 8px;
      margin-bottom:58px;
      color:#333;
      font-size: 16px;
      border:1px solid #dbdbdb;
      .van-cell__value{
        span{
          color:#333;
        }
      }
    }
    .van-uploader{
      .van-uploader__input-wrapper{
        width:100%;
      }
    }
    .van-button{
      height:40px;
    }
  }
</style>
