<template>
  <div class="interview-search" v-if="!submitSuccess">
    <van-form @submit="onSubmit">
      <div class="q-item">
        <q-title :title="'来访者姓名'" :required="true" class="item-title"></q-title>
        <q-field :value="lfName" :placeholder="'来访者姓名'" :isReadonly="isReadonly" @get-value="getLfName"></q-field>
      </div>
      <div class="q-item">
        <q-title :title="'来访者手机'" :required="true"  class="item-title"></q-title>
        <q-field :value="lfSJHM" :placeholder="'来访者手机'" :fieldtype="'number'" :maxlength="11" :isReadonly="isReadonly" @get-value="getPhone"></q-field>
      </div>
      <div class="q-item">
        <q-title :title="'证件类型'" :required="true" class="item-title" ></q-title>
        <q-type-select class="item-content" :defaluteData="zjlx.current" :defaluteIdx="zjlx.defaluteIdx" :data="zjlx.data" :isReadonly="isReadonly" :placeholder="'证件类型'" v-if="zjlx.data.length>0" @get-value="getZJLX"></q-type-select>
      </div>
      <div class="q-item">
        <q-title :title="'证件号码'" :required="true" class="item-title"></q-title>
        <q-field :value="zjhm" :placeholder="'证件号码'"  :maxlength="11" :isReadonly="isReadonly" @get-value="getZJHM"></q-field>
      </div>
      <div class="q-item">
        <q-title :title="'是否有车辆'" class="item-title"></q-title>
        <q-radio class="item-content" :isHasCar="carInfo.isHasCar" :isReadonly="isReadonly" @get-value="getIsHasCar"></q-radio>
      </div>
      <div class="q-item" v-if="carInfo.isHasCar === '1'">
        <q-title :title="'车辆数量'" :required="true" class="item-title"></q-title>
        <q-field :value="carInfo.carNumber" :placeholder="'车辆数量'" :fieldtype="'number'" :isReadonly="isReadonly" @get-value="getCarNumber"></q-field>
      </div>
      <div  v-if="carInfo.isHasCar === '1'">
        <div class="q-item" v-for="(carItem, carIdx) in carInfo.carLst">
          <q-title :title="'车牌号' + (carIdx + 1) ":required="true" class="item-title"></q-title>
          <q-field :value="carItem.cph" :valIdx="carIdx" :placeholder="'车牌号填写格式为一车一行格式'" :delIcon="true" :isReadonly="isReadonly" @get-value="getCPH" @del="delCarOrSFRInfo(carIdx, 'car')"></q-field>
        </div>
        <div class="addHandel" v-if="!isReadonly" @click="addCarOrSFRInfo('car')" >添加车辆</div>
      </div>
      <div class="q-item">
        <q-title :title="'来访者单位'" :required="true" class="item-title"></q-title>
        <q-field :value="lfCompany" :placeholder="'来访者单位'" :isReadonly="isReadonly" @get-value="getLfCompany"></q-field>
      </div>
      <div class="q-item">
        <q-title :title="'来访者职务'" :required="true" class="item-title"></q-title>
        <q-field :value="lfzw" :placeholder="'来访者职务'" :isReadonly="isReadonly" @get-value="getLfZW"></q-field>
      </div>
      <div class="q-item">
        <q-title :title="'来访时间'" :required="true" class="item-title"></q-title>
        <q-date :defaultDate="lfTime" :placeholder="'来访时间'" class="item-content" @get-value="getLfTime"></q-date>
      </div>
      <div class="q-item">
        <q-title :title="'离开时间'" :required="true" class="item-title"></q-title>
        <q-date :defaultDate="leaveTime" :placeholder="'离开时间'" class="item-content" @get-value="getLeaveTime"></q-date>
      </div>
      <div class="q-item">
        <q-title :title="'来访事由'" :required="true" class="item-title"></q-title>
        <q-field :value="reason" :placeholder="'来访事由'" :isReadonly="isReadonly" @get-value="getReason"></q-field>
      </div>
      <div class="q-item">
        <q-title :title="'来访校区'" :required="true" class="item-title" ></q-title>
        <q-type-select class="item-content" :defaluteData="campusInfo.currCampusName" :defaluteIdx="campusInfo.defaluteIdx" :data="campusInfo.campusData" :placeholder="'来访校区'" :isReadonly="isReadonly" @get-value="getCampusName"></q-type-select>
      </div>
      <div class="q-item">
        <q-title :title="'受访人'" :required="true" class="item-title" ></q-title>
        <q-field :value="sfrName" :placeholder="'受访人'" :isReadonly="isReadonly" @get-value="getSfrName"></q-field>
      </div>
      <div class="q-item">
        <q-title :title="'受访人部门'" :required="true" class="item-title" ></q-title>
        <q-type-select class="item-content" :defaluteData="departInfo.currDepart" :defaluteIdx="departInfo.defaluteIdx" :data="departInfo.departData" :placeholder="'受访人部门'" :isReadonly="isReadonly" v-if="departInfo.departData.length>0" @get-value="getDepart"></q-type-select>
      </div>
      <div class="q-item">
        <q-title :title="'受访人手机'" class="item-title"></q-title>
        <q-field :value="reason" :placeholder="'受访人手机'" :fieldtype="'number'" :maxlength="11" :isReadonly="isReadonly" @get-value="getSFRTel"></q-field>
      </div>
      <div class="q-item">
        <q-title :title="'备注'" class="item-title"></q-title>
        <q-field :value="remarks" :placeholder="'备注'" :isReadonly="isReadonly" @get-value="getRemarks"></q-field>
      </div>
      <div class="q-item">
        <q-title :title="'随访人数'" class="item-title"></q-title>
        <q-field :value="reason" :placeholder="'随访人数'" :fieldtype="'number'" :isReadonly="isReadonly" @get-value="getSfrPeopleNumber"></q-field>
      </div>
      <div>
        <div class="q-item" v-for="(sfrItem, sfrIdx) in sfPeopleInfo.sfPeopleLst">
          <q-title :title="'随访人姓名' + (sfrIdx + 1) " class="item-title"></q-title>
          <q-field :value="sfrItem.Name" :valIdx="sfrIdx" :placeholder="'随访人姓名填写格式为一人一行格式'" :delIcon="true" @get-value="getSfrPeopleInfo" :isReadonly="isReadonly" @del="delCarOrSFRInfo(sfrIdx)"></q-field>
        </div>
        <div class="addHandel" v-if="!isReadonly" @click="addCarOrSFRInfo" >添加随访人</div>
      </div>
      <div class="q-item lst">
        <q-title :title="'附件'" class="item-title"></q-title>
        <q-uploader :uploaderFile="uploaderFile" :isReadonly="isReadonly" @get-value="getUploader"></q-uploader>
      </div>
      <div class="btn-box">
        <van-button round hairline type="submit" class="btn" >提交申请</van-button>
      </div>
    </van-form>
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

  import qTitle from '../../components/qForm/QTitle.vue'
  import qField from '../../components/qForm/QField.vue'
  import qDateRange from '../../components/qForm/QDateRange.vue'
  import qTypeSelect from '../../components/qForm/QTypeSelect.vue'
  import qRadio from '../../components/qForm/QRadio.vue'
  import qDate from '../../components/qForm/QDate.vue'
  import qUploader from '../../components/qForm/QUploader.vue'
  import { Button, Form } from 'vant'
  import { mapActions } from 'vuex'
  export default {
    name: 'interviewSearch',
    components: {
      qTitle,
      qDateRange,
      qField,
      qTypeSelect,
      qRadio,
      qDate,
      qUploader,
      [Form.name]: Form,
      [Button.name]: Button
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
        id: null, // 申请id值
        defaultDate: null,
        lfSJHM: '', // 来访手机号码
        lfName: '', // 来访者姓名
        zjhm: '', // 证件号码
        lfCompany: '', // 来访单位
        lfzw: '', // 来访者职务
        lfTime: '', // 来访时间
        leaveTime: '', // 离开时间
        reason: '', // 来访事由
        sfrName: '', // 受访人
        sfrTel: '', // 受访人手机
        remarks: '', // 备注
        startDate: '', // 开始日期
        endDate: '', // 结束日期
        // 证件类型
        zjlx: {
            current: null,
            defaluteIdx: null,
            data: [],
            lst: []
        },
        // 车辆
        carInfo: {
          isHasCar: '1', // 是否有车辆,1有车辆，2么有车辆
          carNumber: '', // 车辆数量
          carLst: [{cph: ''}], // 车牌号
        },
        //校区
        campusInfo: {
          currCampusName: '福强校区',
          defaluteIdx: '0',
          campusData: ['福强校区', '侨城校区']
        },
        //部门
        departInfo: {
          currDepart: '',
          currDepartId: '',
          defaluteIdx: '0',
          departLst: [],
          departData: []
        },
        // 随访人信息
        sfPeopleInfo: {
          sfNumber: 1, // 随访人数
          sfPeopleLst: [{Name: ''}]
        },
        //文件上传
        uploaderFile:{
          oldLstLength: 0, // 老的数据
          fileList: [],
          showUploaderPopup: false
        }
      }
    },
    created() {
      this.getZJList(); //获取证件类型
      this.getList(); //获取部门
      // info有值表示修改表单
      if (this.info){
        this.QD.currPageData = this.info;
        this.getCurrPgData();
      } else {
        this.createdFrom(); //初始化
      }
    },

    mounted() {
    },

    destroyed() {},

    methods: {
      ...mapActions([
        'updateLoadingStatus'
      ]),
      // 表单初始化
      createdFrom () {
        let date = this.QD.getCurrDatetime();
        this.lfTime = date.substr(0, date.length-3);
        this.leaveTime = this.lfTime;
        this.id = 0;
        this.getCurrPgData(); // 得到保存当前页面数据
      },
      // 得到来访日期
      getVisitDate (val) {
        this.startDate = val.start;
        this.endDate = val.end;
      },
      // 得到来访者姓名
      getLfName (val) {
        this.lfName = val
      },
      // 得到手机号码
      getPhone (val) {
        this.lfSJHM = val;
      },
      // 得到证件类型
      getZJLX (val) {
        this.zjlx.current = val;
      },
      // 得到证件号码
      getZJHM (val) {
        this.zjhm = val;
      },
      // 是否有车辆
      getIsHasCar (val) {
        this.carInfo.isHasCar = val;
      },
      // 车辆数量
      getCarNumber (val) {
         this.carInfo.carNumber = val;
      },
      // 车牌号
      getCPH (val, idx) {
        this.carInfo.carLst[idx].cph = val
      },
      // 删除车辆或随访人信息
      delCarOrSFRInfo (idx, type) {
          if (type === 'car'){
            this.carInfo.carLst.splice(idx, 1)
          } else {
            this.sfPeopleInfo.sfPeopleLst.splice(idx, 1)
          }
      },
      // 增加车辆/随访人信息
      addCarOrSFRInfo(type){
        if (type === 'car'){
          this.carInfo.carLst.push({cph: ''})
        } else {
          this.sfPeopleInfo.sfPeopleLst.push({Name: ''})
        }
      },
      // 来访单位
      getLfCompany (val) {
        this.lfCompany = val;
      },
      // 来访职务
      getLfZW (val) {
         this.lfzw = val;
      },
      // 来访时间
      getLfTime (val) {
        this.lfTime = val;
      },
      // 离开时间
      getLeaveTime (val) {
        this.leaveTime = val;
      },
      // 来访事由
      getReason (val) {
        this.reason = val;
      },
      // 来访校区
      getCampusName (val) {
        this.campusInfo.currCampusName = val;
      },
      // 受访人
      getSfrName (val) {
        this.sfrName = val;
      },
      // 受访人部门
      getDepart (val) {
        this.departInfo.currDepart = val;
        this.departInfo.departLst.forEach(item => {
          if (val === item.ksmc){
            this.departInfo.currDepartId = item.ksid
            return
          }
        })
      },
      // 受访人手机
      getSFRTel (val) {
        this.sfrTel = val;
      },
      // 备注
      getRemarks (val) {
        this.remarks = val;
      },
      // 随访人数
      getSfrPeopleNumber (val) {
        this.sfPeopleInfo.sfNumber= val;
      },
      //随访人姓名
      getSfrPeopleInfo (val, idx) {
        this.sfPeopleInfo.sfPeopleLst[idx].Name= val;
      },
      // 附件
      getUploader(val) {
        this.uploaderFile = val;
      },
      // 验证必填项
      validateForm () {
        if (!this.lfName) {
          this.QD.alert({title: "温馨提示",message: '请正确填写来访者姓名'});
          return false
        }
        // 判断手机号是否有效
        if (this.lfSJHM) {
          if (!this.QD.verifyTel.test(this.lfSJHM)) {
            this.QD.alert({title: "温馨提示",message: '请正确填写来访手机号码'});
            return false
          }
        } else {
          this.QD.alert({title: "温馨提示",message: '请正确填写来访手机号码'});
          return false
        }

        // 当证件类型为身份证时校验身份证号码有效性
        if (this.zjlx.current === '居民身份证'){
          var isCard = this.QD.isCardID(this.zjhm)
          if (!isCard){
            this.QD.alert({title: "温馨提示",message: '输入的证件号码无效'})
            return false
          }
        }

        // 判断车辆及车牌号
        if (this.carInfo.isHasCar === '1') {
          if (!this.carInfo.carNumber){
            this.QD.alert({title: "温馨提示",message: '请填写车辆数量'});
            return false
          }
          var carLst = []
          this.carInfo.carLst.filter(function (item,index) {
            if(item.cph){
              carLst.push(item)
            }
          })
          this.carInfo.carLst = carLst
          if (this.carInfo.carLst.length === 0){
            this.QD.alert({title: "温馨提示",message: '请填写车牌号'});
            return false
          }
        }

        if (!this.lfCompany) {
          this.QD.alert({title: "温馨提示",message: '请填写来访者单位'});
          return false
        }
        if (!this.lfzw) {
          this.QD.alert({title: "温馨提示",message: '请填写来访者职务'});
          return false
        }

        // 比较开始日期与结束日期
        let comData = this.QD.compareDateAndTime(this.lfTime, this.leaveTime)
        if (comData >=0 ){
          this.QD.alert({title: '温馨提示', message: '请正确选择离开时间'})
          return false
        }

        if (!this.reason) {
          this.QD.alert({title: "温馨提示",message: '请填写来访事由'});
          return false
        }
        if (!this.sfrName) {
          this.QD.alert({title: "温馨提示",message: '请填写受访人姓名'});
          return false
        }
        // 判断受访人手机号是否有效
        if (this.sfrTel) {
          if (!this.QD.verifyTel.test(this.sfrTel)) {
            this.QD.alert({title: "温馨提示",message: '请正确填写受访人手机号码'});
            return false
          }
        }
        return true
      },
      // 做查询
      onSubmit () {
        if (this.validateForm()) {
          this.saveCurrPgData(); // 保存当前页面数据
          //this.$router.push({path: '/inSearchResult'})
        }
      },
      // 查看详情
      goDetail(){
        this.$emit('goDetial')
      },
      //返回首页
      goHome(){
        this.$emit('goHome')
      },
      // 默认选中的日期格式
      dealDefaultDate () {
        if (this.startDate && this.endDate) {
          let sY = this.startDate.substr(0, 4);
          let sM = this.startDate.substr(5, 2);
          let sD = this.startDate.substr(8, 2);
          let eY = this.endDate.substr(0, 4);
          let eM = this.endDate.substr(5, 2);
          let eD = this.endDate.substr(8, 2);
          sM = parseInt(sM);
          sD = parseInt(sD);
          eM = parseInt(eM);
          eD = parseInt(eD);
          this.defaultDate = [new Date(sY, sM-1, sD), new Date(eY, eM-1, eD)]
        }
      },
      // 保存当前页面数据
      saveCurrPgData () {
        var formData = new FormData();
        this.dealDefaultDate();  // 默认选中的日期格式

        // 整理车牌号数据
        let isHasCar = this.carInfo.isHasCar === '1' ? true : false;
        let carNumber='';
        this.carInfo.carLst.forEach(item =>{
          if (item.cph !== ''){
            carNumber+= item.cph+ ","
          }
        })

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

        //判断随访人姓名是否为空，若为空或者空着字符串删除
        this.sfPeopleInfo.sfPeopleLst.forEach((item, idx)=>{
          if (item.Name.trim() === ''){
            this.sfPeopleInfo.sfPeopleLst.splice(idx, 1)
          }
        })

        this.QD.currPageData = {
          WeChatId: this.wechatId,
          ID: this.id,
          LFName: this.lfName,
          LFSJHM: this.lfSJHM,
          ZJLX: this.zjlx.current,
          ZJHM: this.zjhm,
          HasCar: isHasCar,
          CarNumber: carNumber.substr(0, carNumber.length-1),
          LFCompany: this.lfCompany,
          LFZW: this.lfzw,
          VisitDate: this.lfTime,
          LeaveDate: this.leaveTime,
          Reason: this.reason,
          AreaName: this.campusInfo.currCampusName,
          SFName: this.sfrName,
          SFDepart: this.departInfo.currDepart,
          SFDepartId: this.departInfo.currDepartId,
          SFSJHM: this.sfrTel,
          SelfApply: this.selfApply,
          Remark: this.remarks,
          LFNum: this.sfPeopleInfo.sfNumber*1,
          Attaches: Attaches,
          Details: this.sfPeopleInfo.sfPeopleLst, // 随访人员
        }
        formData.append('jsonData', JSON.stringify(this.QD.currPageData))
        //console.log('保存当前页面数据', this.QD.currPageData, this.sfPeopleInfo)
        this.$emit('saveApplyData', formData)
      },
      // 得到保存当前页面数据
      getCurrPgData () {
        if (this.QD.currPageData) {
          let qd  = this.QD.currPageData;
          this.id = qd.id;
          this.startDate = qd.startDate;
          this.endDate = qd.endDate;
          this.lfName = qd.lfName;
          this.lfSJHM = qd.lfSJHM;
          this.zjlx.current = qd.zjlx;
          this.zjhm = qd.zjhm;
          this.lfCompany = qd.lfCompany;
          this.lfzw = qd.lfZw;
          this.lfTime = qd.visitDate;
          this.leaveTime = qd.leaveDate;
          this.reason = qd.reason;
          this.campusInfo.currCampusName = qd.areaName;
          this.sfrName = qd.sfName;
          this.sfrTel = qd.sfSJHM;
          this.remarks = qd.remark;
          this.departInfo.currDepart = qd.sfDepart;
          this.defaultDate = qd.defaultDate;
          // 是否有车辆
          if (qd.hasCar){
            this.carInfo.isHasCar = '1'
            if (qd.carNumber.length > 0){
              this.carInfo.carNumber = qd.carNumber.length.toString();
              this.carInfo.carLst=[]
              for (var i=0; i<qd.carNumber.length; i++){
                this.carInfo.carLst.push({cph: qd.carNumber[i]})
              }
            }
          } else {
            this.carInfo.isHasCar = '2'
          }
          // 处理校区默认选中值
          this.campusInfo.defaluteIdx = this.campusInfo.campusData.indexOf(this.campusInfo.currCampusName).toString()
          // 处理随访人
          if (qd.details.length> 0){
            this.sfPeopleInfo.sfPeopleLst=[];
            this.sfPeopleInfo.sfNumber=qd.details.length.toString();
            for (var i=0; i<qd.details.length; i++){
              this.sfPeopleInfo.sfPeopleLst.push({Name:qd.details[i].name})
            }
          }
          // 处理附件
          let atts = qd.atts
          for (var i=0; i<atts.length; i++){
            this.uploaderFile.fileList.push(
              {
                url: atts[i].filePath,
                name:atts[i].fileName,
                id: atts[i].id
              }
            )
          }
          this.uploaderFile.oldLstLength = this.uploaderFile.fileList.length
          this.QD.currPageData = null
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
        this.zjlx.lst = d.data;
        d.data.forEach((item,idx) => {
          this.zjlx.data.push(item.codename)
          if (this.zjlx.current && this.zjlx.current === item.codename){
            this.zjlx.defaluteIdx = idx+'';
          }
        })
        if (this.zjlx.current === null){
          this.zjlx.current = this.zjlx.data[0]
        }
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
        this.departInfo.departLst = d.data;
        d.data.forEach((item, bmIdx) => {
          this.departInfo.departData.push(item.ksmc)
          if (this.departInfo.currDepart && this.departInfo.currDepart === item.ksmc){
            this.departInfo.defaluteIdx = bmIdx+'';
            this.departInfo.currDepartId = item.ksid;
          }
        })
        if (this.departInfo.currDepart === ''){
          this.departInfo.currDepart = this.departInfo.departData[0]
        }
      }
    }
  }
</script>
<style scoped lang="less">
  .visitApply {
    padding: 0 24px;
  }
  .q-item{
    position: relative;
    padding: 30px 24px 10px 24px;
  }
  .item-content{
    margin-top: 20px;
  }
  .btn-box{
    position: relative;
    padding: 20px 24px 24px 20px;
    .btn{
      display: block;
      width: 100%;
      color:#fff;
      background-color: @theme-color;
    }
  }
  /*添加按钮*/

  .addHandel{
    margin: 10px 24px 10px 24px;
    color: #666;
    line-height: 30px;
    border-radius: 5px;
    background: #dbdbdb;
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
</style>
