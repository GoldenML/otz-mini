<template>
	<view class='settings'>
		<view style="display: flex;padding: 10px 0">
			<image class="header-avatar" :src="store.userInfo.avatar"></image>
			<view style="font-size: 14px;">
				<view>昵称：{{store.userInfo.nickname}}</view>
				<view>用户名：{{store.userInfo.username}}</view>
				<view>地区：{{area}}</view>
			</view>
		</view>
		<u-divider></u-divider>
		<view>
			<u-button v-if="false" @click="enterInfoUpdate" type="primary" size="normal">资料修改</u-button>
		</view>
	</view>
</template>

<script setup>
	import {
		userStore
	} from '@/store/userStore';
	import {
		codeToText
	} from 'element-china-area-data'
import { computed } from "vue";
	const store = userStore()
	const area = computed(() => {
		return codeToText[store.userInfo.province] && codeToText[store.userInfo.city] && codeToText[store
				.userInfo.district] ?
			`${codeToText[store.userInfo.province]}/${codeToText[store.userInfo.city]}/${codeToText[store.userInfo.district]}` :
			''
	})
	const enterInfoUpdate = () => {
		uni.navigateTo({
			url: '/pages/home/subpages/info-update/info-update'
		})
	}
</script>

<style lang="scss" scoped>
	.settings {
		padding: 10px;
		font-size: 14px;
	}
	
	.header-avatar {
		width: 80px;
		height: 80px;
		margin-right: 20px;
	}
</style>