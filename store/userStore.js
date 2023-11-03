import { defineStore } from 'pinia'

export const userStore = defineStore('user', {
  state: () => ({
    friendInfos: [],
    msgs: {},
    userInfo: {},
    operateUsername: '',
    addHistory: [],
    sequence: 0,
    messages: {},
    lookUserInfo: {},
    groupInfos: [],
    groupMember:{},
    chatBadge: false,
    contactBadge: false,
    badges: {},
    cacheUser: {},
		requestAddUser: {}
  }),
  getters: {

  },
  actions: {}
})
