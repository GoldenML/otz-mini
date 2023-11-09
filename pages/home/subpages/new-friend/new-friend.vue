<template>
	<view>
		<u-button @tap="enterAddFriend" size="normal" type="primary">添加新朋友</u-button>
		<u-list>
			<u-list-item v-for="(item, index) in store.addHistory" :key="item.work_id">
				<u-cell  :title="item.peer_user_info.nickname" :label="item.greeting">
					<template #icon>
						<u-avatar shape="square" size="35" :src="item.peer_user_info.avatar"
							customStyle="margin: -3px 5px -3px 0"></u-avatar>
					</template>
					<template #value>
						<view v-if="item.friend_add_status === 2">已添加</view>
						<view v-if="item.from_username === store.userInfo.username && item.friend_add_status === 1">
							已发送
						</view>
						<view v-if="item.to_username === store.userInfo.username && item.friend_add_status === 1">
							<u-button @tap="acceptRequest(item)" type="success" size="small">接受</u-button>
						</view>
					</template>
				</u-cell>
			</u-list-item>
		</u-list>
	</view>
</template>

<script setup>
	import {
		userStore
	} from '@/store/userStore';
	import {
		onMounted
	} from "vue";
	import ApiPath from '@/common/ApiPath';
	import {
		getAddHistory,
		getFriendInfos,
		getUserMsg
	} from '@/utils/global';
	import {
		post
	} from '@/utils/request';
	const store = userStore()
	onMounted(() => {
		uni.setNavigationBarTitle({
			title: '新的朋友'
		})
		getAddHistory()
	})
	const acceptRequest = (v) => {
		post(ApiPath.USER_ADD_HANDLE, {
			work_id: v.work_id,
			add_friend_reply_status: 1
		}).then(res => {
			if (res.code === 0) {
				getFriendInfos()
				getAddHistory()
				getUserMsg()
			}
		})
	}
	const enterAddFriend = () => {
		uni.navigateTo({
			url: '/pages/home/subpages/add-friend/add-friend',
		});
	}
</script>

<style lang="scss" scoped>

</style>