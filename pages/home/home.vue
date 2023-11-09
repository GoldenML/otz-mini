<template>
	<view>
		<view :style="{height: height + 'px'}">
			<chat-list :height="height" v-if="value === 0"></chat-list>
			<staff-list :tabbarHeight="tabbarHeight" v-if="value === 1"></staff-list>
			<settings v-if="value === 2"></settings>
		</view>
		<view class="tabbar">
			<u-tabbar ref="tabbarRef" :value="value" @change="name => value = name" :fixed="true" :placeholder="true"
				:safeAreaInsetBottom="true">
				<u-tabbar-item text="" icon="chat"></u-tabbar-item>
				<u-tabbar-item text="" icon="account"></u-tabbar-item>
				<u-tabbar-item text="" icon="setting"></u-tabbar-item>
			</u-tabbar>
		</view>
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref,
		watch
	} from "vue";
	import ApiPath from "@/common/ApiPath";
	import {
		post
	} from "@/utils/request";
	import {
		userStore
	} from "@/store/userStore";
	import {
		getUserMsg
	} from '@/utils/global.js'
	import ChatList from './components/ChatList.vue'
	import StaffList from './components/StaffList.vue'
	import Settings from './components/Settings.vue'
	const store = userStore()
	const value = ref(0)
	const tabbarRef = ref(null)
	const height = ref(0)
	const tabbarHeight = ref(0)
	watch(() => tabbarRef.value?.placeholderHeight, (value) => {
		tabbarHeight.value = value
		let query = wx.createSelectorQuery();
		const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
		query.select('.tabbar').boundingClientRect(res => {
			const result = uni.getSystemInfoSync()
			height.value = result.windowHeight - value
		}).exec();
	}, {
		deep: true
	})
	onMounted(() => {
		wx.showShareMenu()
		uni.hideHomeButton()
		connectWs()
		Promise.all([
			post(ApiPath.USER_LOGIN_STATUS, {}).then(res => {
				store.userInfo = res.user_info
			}),
			post(ApiPath.USER_GET_FRIEND, {}).then(res => {
				store.friendInfos = res.friends
			}),
			post(ApiPath.USER_ADD_HISTORY, {}).then(res => {
				store.addHistory = res.add_friend_histories
			}),
			post(ApiPath.USER_GET_GROUP_LIST, {}).then(res => {
				store.groupInfos = res.groups
				getAllGroupMember(res.groups)
			})
		]).then(() => {
			getUserMsg(true)
		})


	})
	const getAllGroupMember = (groups) => {
		const groupMember = {}
		Promise.all(groups.map(e => {
			return post(ApiPath.USER_GROUP_GET_MEMBERS, {
				group_id: e.group_id
			}).then(res => {
				groupMember[e.group_id] = {}
				res.members.forEach(v => [
					groupMember[e.group_id][v.username] = v
				])
			})
		})).then(() => {
			store.groupMember = groupMember
		})
	}
	const connectWs = () => {
		let lockReconnect = false
		let tt
		let routes = getCurrentPages();
		let curRoute = routes[routes.length - 1].route
		let timer = null
		let ws
		let wsUrl = 'wss://im.shadowgao.com/otz/im/web_proxy/sync_notify'

		function createWebSocket() {
			try {
				ws = wx.connectSocket({
					url: wsUrl,
					header: {
						cookie: wx.getStorageSync('cookie')
					}
				})
				init()
			} catch (e) {
				console.log(e);
				reconnect(wsUrl)
			}
		}

		function init() {
			wx.onSocketOpen(() => {
				console.log('连接成功');
				//心跳检测重置
				heartCheck.start()
			})
			wx.onSocketMessage(({
				data
			}) => {
				console.log(data);
				if (data === 'otz_pong') {
					heartCheck.start()
					return
				}

				switch (JSON.parse(data).notify_type) {
					case 1:
						if (curRoute === 'pages/console/console' || curRoute === 'pages/console/chat-item/chat-item') {
							store.updateContactBadge(true)
						}
						// getAddHistory()
						break
					case 2:
						if (curRoute === 'pages/console/staff/staff') {
							store.updateChatBadge(true)
						}
						getUserMsg()
						break
					default:
						break
				}
			})
			wx.onSocketClose(() => {
				console.log('ws已关闭')
				reconnect(wsUrl)
			})
			wx.onSocketError(() => {
				console.log('ws发生异常')
				reconnect(wsUrl)
			})
		}

		function reconnect(url) {
			if (lockReconnect) {
				return
			}
			lockReconnect = true
			//没连接上会一直重连，设置延迟避免请求过多
			tt && clearTimeout(tt)
			tt = setTimeout(function() {
				createWebSocket(url)
				lockReconnect = false
			}, 4000)
		}
		let heartCheck = {
			timeout: 10000,
			timeoutObj: null,
			serverTimeoutObj: null,
			start: function() {
				let self = this
				console.log('ws ===>', ws)
				this.timeoutObj && clearTimeout(this.timeoutObj)
				this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj)
				this.timeoutObj = setTimeout(function() {
					//这里发送一个心跳，后端收到后，返回一个心跳消息，
					wx.sendSocketMessage({
						data: 'otz-ping',
					})
					self.serverTimeoutObj = setTimeout(function() {
						wx.closeSocket()
					}, self.timeout)
				}, this.timeout)
			}
		}
		// const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
		// IS_PROD && createWebSocket()
		createWebSocket()
	}
</script>

<style lang="scss" scoped>

</style>