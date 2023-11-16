<template>
	<view>
		<u-list>
			<u-list-item v-for="(group, index) in store.groupInfos" :key="index">
				<u-cell @click="enterChatDetail(group.group_id)" :title="group.group_name" >
					<template #icon>
						<u-avatar shape="square" size="35" :src="group.group_avatar" customStyle="margin: -3px 5px -3px 0"></u-avatar>
					</template>
				</u-cell>
			</u-list-item>
			<view class="up-safe-area-inset--bottom" :style="{marginBottom: tabbarHeight + 'px'}">
				<view class="list__footer">共{{store.groupInfos.length}}个群聊</view>
			</view>
		</u-list>
	</view>
</template>

<script setup>
	import {
		userStore
	} from "@/store/userStore"
import { onMounted } from "vue";
	const store = userStore()
	const enterChatDetail = (groupId) => {
		const idx = store.groupInfos.findIndex(e => e.group_id === groupId)
		  if(!store.msgs[groupId]) {
		    store.msgs[groupId] = {
		      type:2,
		      nickname: store.groupInfos[idx].group_name,
		      avatar: store.groupInfos[idx].group_avatar,
		      lastUsername: '',
		      lastMsg: '',
		      username: groupId,
		      msgList: [],
		    }
		  }
		store.operateUsername = groupId
		uni.navigateTo({
			url: '/pages/home/subpages/chat-detail/chat-detail',
		});
	}
	onMounted(() => {
		uni.setNavigationBarTitle({
			title: '群聊'
		})
	})
</script>

<style lang="scss" scoped>
.list {

		&__footer {
			color: $u-tips-color;
			font-size: 14px;
			text-align: center;
			padding: 15px 0;
		}
	}
</style>