<template>
  <!-- 下拉类型选择 -->
  <div class="uploader">
    <van-uploader style="width:100%;margin:16px 0" :disabled="isReadonly" accept="image/*,.doc,.docx,.xlsx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" v-model="uploaderFile.fileList" multiple >
    </van-uploader>
    <div
      class="addHandel addUploader"
      v-if="!isReadonly"
      @click="uploaderFile.showUploaderPopup = true">添加附件
    </div>
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
  <!--  :max-date="dMaxDate" -->
</template>
<script>
  import { Uploader, Popup, Button } from 'vant'
  export default {
    name: 'qUploader',
    components: {
      [Uploader.name]: Uploader,
      [Popup.name]: Popup,
      [Button.name]: Button
    },
    props: {
      uploaderFile: {
        type: Object,
        default: ''
      },
      isReadonly: {
        type: Boolean,
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
    watch: {
      uploaderFile: {
        handler(newName, oldName) {
          this.$emit('get-value', newName);   // 调用input触发v-model更新
        },
        immediate: true,
        deep: true,
      }
    },
    created() {
    },

    mounted() {
    },

    destroyed() {},

    methods: {
      // 上传成功
      afterRead(file) {
        this.uploaderFile.showUploaderPopup = false
        this.uploaderFile.fileList.push(file)
      }
    }
  }
</script>
<style scoped lang="less">
  .addHandel{
    color: #666;
    line-height: 30px;
    border-radius: 5px;
    background: #dbdbdb;
    text-align: center;
    margin-top:-16px;
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
</style>
<style lang="less">
.uploader{
  .van-uploader{
    .van-uploader__input-wrapper{
      width:100%;
    }
  }
}

</style>
