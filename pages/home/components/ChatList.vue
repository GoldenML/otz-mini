<template>
	<u-list :height="height">
		<u-list-item v-for="(item, key) in store.msgs" :key="key">
			<u-cell @click="enterChatDetail(item.username)" :title="item.nickname" :label="item.lastMsg">
				<template #icon>
					<view style="position: relative;">
						<u-avatar shape="square" size="35" :src="item.avatar" customStyle="margin: -3px 5px -3px 0"></u-avatar>
						<up-badge absolute :offset="[-5, 1]" :show="store.badges[item.username]"  isDot ></up-badge>
					</view>
					
				</template>
			</u-cell>
		</u-list-item>
	</u-list>
</template>

<script setup>
	import {ref} from 'vue'
	import { 
		userStore
	} from '@/store/userStore';
	const store = userStore()
	const props = defineProps({
		height: Number
	})
	const enterChatDetail = (username) => {
		store.operateUsername = username
		uni.navigateTo({
			url: '/pages/home/subpages/chat-detail/chat-detail'
		})
	}
</script>

<style lang="scss" scoped>
</style>