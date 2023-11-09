<template>
	<view>
		<view class="u-page__tag-item">
			<u-search :show-action="false" placeholder="用户名" v-model="keyword" @change="searchStatus = 0"></u-search>
			<view v-if="keyword && searchStatus === 0" @click="searchUser"
				style="display: flex; margin-top: 10px; align-items: center;margin-left: 10px;height: 35px;line-height: 35px;background-color: aliceblue;">
				<view>
					<u-icon size="30" name='man-add'></u-icon>
				</view>
				<view style="margin-left: 10px;">搜索:{{keyword}}</view>
			</view>
			<view v-if="searchStatus === 2"
				style="text-align: center;display: flex;justify-content: center; align-items: center;">
				<u-empty mode="search" icon="" />
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref
	} from "vue";
	import {
		userStore
	} from "@/store/userStore";
	import {
		post
	} from "../../../../utils/request";
	import ApiPath from "../../../../common/ApiPath";
	const store = userStore()
	const keyword = ref('')
	const existFriend = ref(false)
	const userInfo = ref(null)
	const searchStatus = ref(0)
	const searchUser = () => {
		existFriend.value = false
		post(ApiPath.USER_GET_INFO, {
			username: keyword.value
		}).then(response => {
			if (response.code === 0) {
				store.lookUserInfo = response.user_info
				uni.navigateTo({
					url: '/pages/home/subpages/user-detail/user-detail',
				});
				// if (store.friendInfos.findIndex(e => e.username === userInfo.value.username) > -1) {
				// 	existFriend.value = true
				// }
			} else {
				searchStatus.value = 2
			}
		})
	}
	onMounted(() => {
		uni.setNavigationBarTitle({
			title: '添加朋友'
		})
	})
</script>

<style lang="scss" scoped>
	.u-page__tag-item {
		@include flex(column);
		flex: 1
	}
</style>