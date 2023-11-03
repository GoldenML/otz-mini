<template>
	<view>
		<u-index-list :indexList="indexList">
			<view class="list">
				<view @click="enterNewFriend" class="list__item">
					<u-avatar shape="square" size="35" icon="man-add-fill" fontSize="26" randomBgColor></u-avatar>
					<text class="list__item__user-name">新的朋友</text>
				</view>
				<u-line></u-line>
				<view @click="enterGrouoList" class="list__item">
					<u-avatar shape="square" size="35" icon="tags-fill" fontSize="26" randomBgColor></u-avatar>
					<text class="list__item__user-name">群聊</text>
				</view>
				<u-line></u-line>
			</view>
			<template :key="index" v-for="(item, index) in itemArr">
				<!-- #ifdef APP-NVUE -->
				<u-index-anchor :text="indexList[index]"></u-index-anchor>
				<!-- #endif -->
				<u-index-item>
					<!-- #ifndef APP-NVUE -->
					<u-index-anchor :text="indexList[index]"></u-index-anchor>
					<!-- #endif -->
					<view class="list" v-for="(item1, index1) in item" :key="index1">
						<view @click="enterDetail(item1)" class="list__item">
							<u-swipe-action>
								<u-swipe-action-item :options="options2">
									<view class="swipe-action u-border-top u-border-bottom">
										<view class="swipe-action__content">
											<text class="swipe-action__content__text">
												<image class="list__item__avatar" :src="item1.avatar"></image>
												<text class="list__item__user-name">{{item1.nickname}}</text>
											</text>
										</view>
									</view>
								</u-swipe-action-item>
							</u-swipe-action>

						</view>
						<u-line></u-line>
					</view>
				</u-index-item>
			</template>
			<view class="up-safe-area-inset--bottom" :style="{marginBottom: tabbarHeight + 'px'}">
				<view class="list__footer">共{{store.friendInfos.length}}位好友</view>
			</view>
		</u-index-list>
	</view>
</template>

<script setup>
	import {
		computed,
		onMounted,
		ref
	} from "vue";
	import {
		userStore
	} from "@/store/userStore";
	const props = defineProps({
		tabbarHeight: Number
	})
	const options2 = ref([{
		text: '收藏',
		style: {
			backgroundColor: '#3c9cff'
		}
	}, {
		text: '删除',
		style: {
			backgroundColor: '#f56c6c'
		}
	}])
	const store = userStore()

	let categorizedFriends = {}
	const itemArr = computed(() => {
		return indexList.value.map(item => {
			const arr = []
			if (categorizedFriends[item]) {
				categorizedFriends[item].forEach(e => {
					arr.push(e)
				})
			}
			return arr
		})
	})

	const indexList = computed(() => {
		categorizedFriends = {}
		store.friendInfos.forEach(friend => {
			const firstLetter = friend.nickname[0].toUpperCase()
			if (!categorizedFriends[firstLetter]) {
				categorizedFriends[firstLetter] = []
			}
			categorizedFriends[firstLetter].push(friend)
		})
		const list = []
		// list.push("↑")
		// list.push("☆")
		list.push(...Object.keys(categorizedFriends).sort((a, b) => a < b ? -1 : 1))
		// list.push('#')
		return list
	})
	onMounted(() => {})
	const enterDetail = (userInfo) => {
		store.lookUserInfo = userInfo
		uni.navigateTo({
			url: '/pages/home/subpages/user-detail/user-detail',
		});
	}
	const enterGrouoList = () => {
		uni.navigateTo({
			url: '/pages/home/subpages/group-list/group-list',
		});
	}
	const enterNewFriend = () => {
		uni.navigateTo({
			url: '/pages/home/subpages/new-friend/new-friend',
		});
	}
</script>

<style lang="scss" scoped>
	.list {

		&__item {
			@include flex;
			padding: 6px 12px;
			align-items: center;

			&__avatar {
				height: 35px;
				width: 35px;
				border-radius: 3px;
			}

			&__user-name {
				font-size: 16px;
				margin-left: 10px;
				color: $u-main-color;
			}
		}

		&__footer {
			color: $u-tips-color;
			font-size: 14px;
			text-align: center;
			padding: 15px 0;
		}
	}
	
	.u-page {
	        padding: 0;
	    }
	
	    .u-demo-block__title {
	        padding: 10px 0 2px 15px;
	    }
	
	    .swipe-action {
	        &__content {
	             padding: 25rpx 0;
	    
	            &__text {
	                 font-size: 15px;
	                 color: $u-main-color;
	                 padding-left: 30rpx;
	             }
	        }
	    }
</style>