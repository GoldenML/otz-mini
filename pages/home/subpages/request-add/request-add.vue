<template>
	<view>
		<view style="padding:  10px">
			<view style="font-size: 14px;margin-bottom: 10px;">发送添加朋友申请</view>
			<u-textarea v-model="greeting" placeholder="请输入"></u-textarea>
			<view class="fixed-btn">
				<u-button @click="addFriend" type="primary" size="normal">添加</u-button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onMounted, ref
	} from "vue";
	import ApiPath from "@/common/ApiPath";
	import {
		post
	} from "@/utils/request";
import { userStore } from "@/store/userStore";
	const store =userStore()
	const greeting = ref(0)
	onMounted(() => {
		uni.setNavigationBarTitle({
			title: '申请添加朋友'
		})
	})
	const addFriend = () => {
		post(ApiPath.USER_ADD_FRIEND, {
			friend_username: store.lookUserInfo.username,
			greeting: greeting.value
		}).then(res => {
			if (res.code === 0) {
				proxy.$message({
					type: 'success',
					message: '发送成功'
				})
				proxy.$emit('close')
			} else {
				proxy.$message({
					type: 'error',
					message: res.msg
				})
			}
		})
	}
</script>

<style lang="scss" scoped>
	.fixed-btn {
		position: absolute;
		left: 10px;
		right: 10px;
		bottom: 0;
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>