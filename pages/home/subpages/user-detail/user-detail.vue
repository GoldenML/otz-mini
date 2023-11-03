<template>
	<view class='user-detail'>
		<view style="display: flex;padding: 10px 0">
			<image class="header-avatar" :src="store.lookUserInfo.avatar"></image>
			<view>
				<view>昵称：{{store.lookUserInfo.nickname}}</view>
				<view>用户名：{{store.lookUserInfo.username}}</view>
				<view>地区：{{area}}</view>
			</view>
		</view>
		<u-divider></u-divider>
		<!-- <view style="text-align: center; color: #2385f1; height: 35px;line-height: 35px;">
			发消息
		</view> -->
		<u-button v-if="existFriend" @click="toSend" type="success" size="normal">发消息</u-button>
		<u-button v-else @click="toAdd" type="success" size="normal">添加到通讯录</u-button>
		<u-divider></u-divider>
	</view>
</template>

<script setup>
	import {
		userStore
	} from '@/store/userStore';
	import {
		codeToText
	} from 'element-china-area-data'
	import {
		computed,
		onMounted,
		ref
	} from "vue";
	const store = userStore()
	const area = computed(() => {
		return codeToText[store.lookUserInfo.province] && codeToText[store.lookUserInfo.city] && codeToText[store
				.lookUserInfo.district] ?
			`${codeToText[store.lookUserInfo.province]}/${codeToText[store.lookUserInfo.city]}/${codeToText[store.lookUserInfo.district]}` :
			''
	})
	const toSend = () => {
		const idx = store.friendInfos.findIndex(e => e.username === store.lookUserInfo.username)
		if (!store.msgs[store.lookUserInfo.username]) {
			store.msgs[store.lookUserInfo.username] = {
				type: 1,
				nickname: store.friendInfos[idx].nickname,
				avatar: store.friendInfos[idx].avatar,
				lastUsername: '',
				lastMsg: '',
				username: store.lookUserInfo.username,
				msgList: [],
			}
		}
		store.operateUsername = store.lookUserInfo.username
		uni.navigateTo({
			url: '/pages/home/subpages/chat-detail/chat-detail',
		});
	}
	const toAdd = () => {
		uni.navigateTo({
			url: '/pages/home/subpages/request-add/request-add',
		});
	}
	const existFriend = ref(false)
	onMounted(() => {
		if (store.friendInfos.findIndex(e => e.username === store.lookUserInfo.username) > -1) {
			existFriend.value = true
		}
	})
</script>

<style lang="scss" scoped>
	.user-detail {
		padding: 10px;
	}

	.header-avatar {
		width: 80px;
		height: 80px;
		margin-right: 20px;
	}
</style>