<template>
  <div class="ex-scroller" :style="styles">
    <div class="scroller-content">
      <van-pull-refresh :class="`pull-refresh ${upLoading ? 'pull-uploading' : ''}`" v-model="downLoading"
                        @refresh="onRefresh"
                        :pulling-text="pullingText"
                        :loosing-text="loosingText"
                        :loading-text="loadingText">
        <van-list v-model="upLoading" :finished="finished" @load="onLoad" :offset="0" :immediate-check="autoLoad">

          <div name="upLoading" slot="loading">{{loadingText}}</div>
          <div name="finished" slot="finished">{{finishedText}}</div>
          <div name="error" slot="error">{{errorText}}</div>

          <!--<div name="default">
            <p class="cell" v-for="(item, idx) in 10" :key="idx">{{item}}</p>
          </div>-->
          <slot name="default"></slot>

        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>
<script>
  import { List, PullRefresh } from 'vant';
  export default {
    name: 'exScroller',
    components: {
      [List.name]: List,
      [PullRefresh.name]: PullRefresh
    },
    props: {
      height: {
        type: String,
        default: '-46' // Scroller 高度 默认-46（减去Header高度）
      },
      pullingText: {
        type: String,
        default: '下拉即可刷新...'
      },
      loosingText: {
        type: String,
        default: '释放即可刷新...'
      },
      loadingText: {
        type: String,
        default: '加载中....'
      },
      finishedText: { // 加载完成后的提示文案
        type: String,
        default: '没有更多了'
      },
      errorText: { // 加载失败后的提示文案
        type: String,
        default: '-'
      },
      autoLoad: { // 是否自动加载数据，默认true
        type: Boolean,
        default: true
      },
      // 数据
      value: {
        type: Array,
        default: function () {
          return []
        }
      },
      pageSize: { // 每页加载数量 默认20
        type: Number,
        default: 20
      },
      onGetList: Function,
      onGetCallback: Function // 获取数据方法回调函数，（lst）
    },
    data() {
      return {
        downLoading: false, // 是否处于加载中状态
        upLoading: false, // 是否处于加载状态，加载过程中不触发load事件
        finished: false, // 是否已加载完成，加载完成后不再触发load事件
        styles: {},
        pageIndex: 1, // 默认第一页
        arrayData: []
      }
    },
    watch: {
      value (val) {
        console.log("exscroller value wathing:");
        this.arrayData = val;
      },
      arrayData (val) {
        console.log("exscroller lst watching:");
        this.$emit('input', val);   // 调用input触发v-model更新
      }
    },
    created () {
    },
    mounted () {
      this.getStyles();
    },
    methods: {
      // 初始化加载列表，加载第一页
      initData () {
        console.log("ExScroller initData");
        this.arrayData = [];
        this.loadOnePageData();  // 加载第一页的数据
      },
      // 加载第一页的数据
      loadOnePageData () {
        this.finished = false;
        this.upLoading = true;
        this.pageIndex = 1; // 设为第1页
        this.onLoad();
      },
      // 下拉刷新
      async onRefresh () {
        console.log("....onRefresh")
        setTimeout(() => {
          this.loadOnePageData();  // 加载第一页的数据
        }, 500);
      },
      // 上拉加载
      async onLoad () {

        console.log("ex onload")
        if (this.downLoading) {
          this.arrayData = [];
          this.downLoading = false;
        }
        let d = await this.getList({ pageIndex: this.pageIndex, pageSize: this.pageSize });
        for (let i = 0; i < d.length; i++) {
          this.arrayData.push(d[i]);
        }
        if (this.onGetCallback){
          this.onGetCallback();
        }
        // 第一页数据，接口出错了或没有得到数据或数据少于 pageSize，不再加载下一页
        if (this.pageIndex === 1 && d.length < this.pageSize) {
          this.upLoading = false;
          this.finished = true; // 加载完毕
        } else {
          // 加载完成时底部提示加载完成，禁止上拉加载。延迟器是为了避免和加载中同时执行
          setTimeout(() => {
            this.upLoading = false;
            if (d.length < this.pageSize) {
              this.finished = true; // 加载完毕
            }
          }, 1000);
        }
        this.pageIndex++; // 设为下一页
        console.log("onLoad ...end")
      },
      async getList (ps) {
        let d = await this.onGetList(ps.pageIndex, ps.pageSize);
        console.log("scroller getList", d);
        if (d.status && d.status === "error") {
          return [];
        }
        return d;
      },
      getStyles () {
        let height = this.height
        if (!this.height && (this.$el && !this.$el.style.height)) {
          height = `${document.documentElement.clientHeight}px`
          this.reset()
        }

        if (this.height && this.height.indexOf('-') === 0) {
          height = `${document.documentElement.clientHeight + parseInt(this.height)}px`
        }
        this.styles = {
          height: `${height}`
        }
      }
    }
  }
</script>
<style>
  /* 加载中的 样式 */
  .ex-scroller .van-list__loading{
    position: absolute;
    bottom: -50px;
    width: 100%;
  }
</style>
<style scoped lang="less">
  .ex-scroller{
    position: relative;
    overflow: hidden;
    touch-action: auto;
    -webkit-user-select: none;
    -webkit-user-drag: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  .scroller-content{
    /*position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;*/
    position: relative;
    height: 100%;
    width: 100%;
    /*padding-bottom: 20px;*/
    touch-action: auto;
    overflow-y: scroll;
    transform-origin: 0 0 0;
    transform: translateX(0px) translateY(0px) translateZ(0px) scale(1, 1);
    transition: none;
  }
  .pull-refresh{
    position: relative;
    min-height: 100%;
  }
  /* 加载中的 样式 */
  .pull-uploading{
    padding-bottom: 50px;
  }
</style>
