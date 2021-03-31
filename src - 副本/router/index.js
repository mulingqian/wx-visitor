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
    path: '/userbind',
    name: 'UserBind',
    component: () => import('../views/UserBind.vue'),
    meta: { showHead: false, showBar: false, anonymous: true }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { showHead: false, showBar: false }
  },
  {
    path: '/VisitLst',
    name: 'VisitLst',
    component: () => import('../views/visit/VisitLst.vue'),
    meta: { showHead: true, showBar: false, title: '来访记录' }
  },
  // {
  //   path: '/IntervieweeRecord',
  //   name: 'IntervieweeRecord',
  //   component: () => import('../views/interviewee/IntervieweeRecord.vue'),
  //   meta: { showHead: true, showBar: false, title: '受访者首页记录列表' }
  // },
  {
    path: '/VisitDetail',
    name: 'VisitDetail',
    component: () => import('../views/visit/VisitDetail.vue'),
    meta: { showHead: true, showBar: false, title: '来访申请', anonymous: false }
  },
  {
    path: '/InterviewDetail',
    name: 'InterviewDetail',
    component: () => import('../views/interviewee/InterviewDetail.vue'),
    meta: { showHead: true, showBar: false, title: '审批', anonymous: false }
  },
  {
    path: '/VisitApply',
    name: 'VisitApply',
    component: () => import('../components/VisitApply.vue'),
    meta: { showHead: true, showBar: false, title: '来访申请', anonymous: false }
  },
  {
    path: '/ScanningResults',
    name: 'ScanningResults',
    component: () => import('../components/ScanningResults.vue'),
    meta: { showHead: true, showBar: false, title: '扫码结果', anonymous: false }
  },
  {
    path: '/VisitApply',
    name: 'VisitApply',
    component: () => import('../components/VisitApply.vue'),
    meta: { showHead: true, showBar: false, title: '代填报', anonymous: false }
  },
  {
    path: '/Search',
    name: 'Search',
    component: () => import('../components/search/Search.vue'),
    meta: { showHead: true, showBar: false, title: '来访查询', anonymous: false }
  },
  {
    path: '/SearchResult',
    name: 'SearchResult',
    component: () => import('../components/search/SearchResult.vue'),
    meta: { showHead: true, showBar: false, title: '查询结果', anonymous: false }
  }
]

const router = new VueRouter({
  routes
})

export default router
