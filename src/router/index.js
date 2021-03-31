import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Entry',
    component: () => import('../views/Entry.vue'),
    meta: { showHead: false, showBar: false, anonymous: true }
  },
  {
    path: '/visitCondition',
    name: 'VisitCondition',
    component: () => import('../views/visit/VisitCondition.vue'),
    meta: { showHead: false, showBar: false, anonymous: true }
  },
  {
    path: '/userbind',
    name: 'UserBind',
    component: () => import('../views/UserBind.vue'),
    meta: { showHead: false, showBar: false, anonymous: true, visitor: true } // visitor 访客 EndClientType = WX 打开系统需要在微信中
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { showHead: false, showBar: false }
  },
  {
    path: '/visitSearch',
    name: 'VisitSearch',
    component: () => import('../views/visit/VisitSearch.vue'),
    meta: { showHead: true, showBar: false, title: '来访查询', anonymous: true, visitor: true }
  },
  {
    path: '/visitSearchResult',
    name: 'VisitSearchResult',
    component: () => import('../views/visit/VisitSearchResult.vue'),
    meta: { showHead: true, showBar: false, title: '查询结果', anonymous: true, visitor: true }
  },
  {
    path: '/visitApply',
    name: 'VisitApply',
    component: () => import('../views/visit/VisitApply.vue'),
    meta: { showHead: true, showBar: false, title: '来访申请', anonymous: true, visitor: true }
  },
  {
    path: '/visitChangeApply',
    name: 'VisitChangeApply',
    component: () => import('../views/visit/VisitChangeApply.vue'),
    meta: { showHead: true, showBar: false, title: '来访申请', anonymous: true, visitor: true }
  },
  {
    path: '/visitDetail',
    name: 'VisitDetail',
    component: () => import('../views/visit/VisitDetail.vue'),
    meta: { showHead: true, showBar: false, title: '来访申请', anonymous: true, visitor: true }
  },
  {
    path: '/interviewDetail',
    name: 'InterviewDetail',
    component: () => import('../views/interviewee/InterviewDetail.vue'),
    meta: { showHead: true, showBar: false, title: '来访申请' }
  },
  {
    path: '/interviewApply',
    name: 'InterviewApply',
    component: () => import('../views/interviewee/InterviewApply.vue'),
    meta: { showHead: true, showBar: false, title: '来访申请' }
  },
  {
    path: '/interChangeApply',
    name: 'InterviewApply',
    component: () => import('../views/interviewee/InterChangeApply.vue'),
    meta: { showHead: true, showBar: false, title: '来访申请' }
  },
  {
    path: '/interviewApplyRevise',
    name: 'interviewApplyRevise',
    component: () => import('../views/interviewee/InterviewApplyRevise.vue'),
    meta: { showHead: true, showBar: false, title: '来访申请修改' }
  },
  {
    path: '/interviewSearch',
    name: 'InterviewSearch',
    component: () => import('../views/interviewee/InterviewSearch.vue'),
    meta: { showHead: true, showBar: false, title: '来访查询' }
  },
  {
    path: '/inSearchResult',
    name: 'InSearchResult',
    component: () => import('../views/interviewee/InSearchResult.vue'),
    meta: { showHead: true, showBar: false, title: '查询结果' }
  },
  {
    path: '/guardHome',
    name: 'GuardHome',
    component: () => import('../views/guard/GuardHome.vue'),
    meta: { showHead: false, showBar: false, anonymous: true }
  },
  {
    path: '/guardSearch',
    name: 'GuardSearch',
    component: () => import('../views/guard/GuardSearch.vue'),
    meta: { showHead: true, showBar: false, title: '来访查询' }
  },
  {
    path: '/guardSearchResult',
    name: 'GuardSearchResult',
    component: () => import('../views/guard/GuardSearchResult.vue'),
    meta: { showHead: true, showBar: false, title: '查询结果' }
  },
  {
    path: '/guardDetail',
    name: 'GuardDetail',
    component: () => import('../views/guard/GuardDetail.vue'),
    meta: { showHead: true, showBar: false, title: '来访申请' }
  },
  {
    path: '/guardScanResult',
    name: 'GuardScanResult',
    component: () => import('../views/guard/GuardScanResult.vue'),
    meta: { showHead: true, showBar: false, title: '扫码结果' }
  },
  {
    path: '/guardScanResultStu',
    name: 'GuardScanResultStu',
    component: () => import('../views/guard/GuardScanResultStu.vue'),
    meta: { showHead: true, showBar: false, title: '扫码结果' }
  },
  {
    path: '/guardInformationConfirm',
    name: 'GuardInformationConfirm',
    component: () => import('../views/guard/GuardInformationConfirm.vue'),
    meta: { showHead: true, showBar: false, title: '信息确认' }
  },
  {
    path: '/guardChangePwd',
    name: 'GuardChangePwd',
    component: () => import('../views/guard/GuardChangePwd.vue'),
    meta: { showHead: true, showBar: false, title: '修改密码' }
  },
  {
    path: '/enlargeCode',
    name: 'EnlargeCode',
    component: () => import('../views/EnlargeCode.vue'),
    meta: { showHead: false, showBar: false, anonymous: true }
  }
]

const router = new VueRouter({
  routes
})

export default router
