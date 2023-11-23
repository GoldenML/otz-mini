<template>
	<view class="chat-detail">
		<scroll-view @click="showMore = false" @scrolltoupper="scrollTop" :scroll-into-view="toView" scroll-y="true"
			:style="{height: height + 'px'}">
			<view v-if='startIndex !== 0' style="text-align: center;">
				<up-loadmore :status="status" />
			</view>
			<view id="scroll-top"></view>
			<view>
				<view v-if="currentMsg.type === 1">
					<view v-for="msg in currentMsgList" :key="msg.sequence" :id="'child-' + msg.sequence">
						<view class="message-time">{{msg.formatTime}}</view>
						<view v-if="msg.from_username === store.operateUsername">
							<view class="chat-left">
								<u-avatar :src="currentMsg.avatar" size="32" customStyle="float: left"></u-avatar>
								<view v-if="msg.msg_type === 2" class="chat-left__img">
									<image @click="clickImg(msg.image_msg.image_url)" mode="widthFix" style="width: 150px"
										:src="msg.image_msg.image_url" alt=""></image>
								</view>
								<view v-else-if="msg.msg_type === 3">
									<!-- <video :src></video> -->
								</view>
								<view v-else-if="msg.msg_type === 5" class="chat-left__red-packet">
									<view style="margin-top: 15px;text-align: left;">
										<view style="float: left">
											<u-icon name='red-packet-fill' :size="40" color="rgb(216, 61, 31)"></u-icon>
										</view>
										<view style="display: inline-block;line-height: 40px;margin-left: 10px;">
											{{msg.red_packet.mark}}
										</view>
									</view>
								</view>
								<view v-else class="chat-left__box">
									{{ msg.text_msg?.text }}
								</view>
							</view>
						</view>
						<view v-else>
							<view class="chat-right">
								<uni-icons style="margin-right: 5px;" v-if="msg.wait" type="spinner-cycle" size="20"></uni-icons>
								<view v-if="msg.msg_type === 2" class="chat-right__img">
									<image @click="clickImg(msg.image_msg.image_url)" mode="widthFix" style="width: 150px;"
										:src="msg.image_msg.image_url" alt=""></image>
								</view>
								<view v-else-if="msg.msg_type === 3">
									<!-- <video :src></video> -->
								</view>
								<view v-else-if="msg.msg_type === 5" class="chat-right__red-packet">
									<view style="margin-top: 15px;">
										<view style="float: left">
											<u-icon name='red-packet-fill' :size="40" color="rgb(216, 61, 31)"></u-icon>
										</view>
										<view style="display: inline-block;line-height: 40px;margin-left: 10px;">
											{{msg.red_packet.mark}}
										</view>
									</view>
								</view>
								<view v-else class="chat-right__box">
									{{ msg.text_msg?.text }}
								</view>
								<u-avatar :src="store.userInfo.avatar" size="32" customStyle="float: right"></u-avatar>
							</view>
						</view>
					</view>
				</view>
				<view v-if="currentMsg.type === 2">
					<view v-for="msg in currentMsgList" :key="msg.sequence" :id="'child-' + msg.sequence">
						<view class="message-time">{{msg.formatTime}}</view>
						<view class="system-message" v-if="msg.isSystemMsg">
							{{ msg.text_msg?.text }}
						</view>
						<view v-else-if="msg.from_username !== store.userInfo.username">
							<view class="chat-left">
								<u-avatar :src="getGroupMember(msg.from_username).avatar" size="32"
									customStyle="float: left"></u-avatar>
								<view class="group-message-left">
									{{getGroupMember(msg.from_username).nickname}}
								</view>
								<view v-if="msg.msg_type === 2" class="chat-left__img">
									<image @click="clickImg(msg.image_msg.image_url)" mode="widthFix" style="width: 150px"
										:src="msg.image_msg.image_url" alt=""></image>
								</view>
								<view v-else-if="msg.msg_type === 3">
									<!-- <video :src></video> -->
								</view>
								<view v-else-if="msg.msg_type === 5" class="chat-left__red-packet">
									<view style="margin-top: 15px;text-align: left;">
										<view style="float: left">
											<u-icon name='red-packet-fill' :size="40" color="rgb(216, 61, 31)"></u-icon>
										</view>
										<view style="display: inline-block;line-height: 40px;margin-left: 10px;">
											{{msg.red_packet.mark}}
										</view>
									</view>
								</view>
								<view v-else class="chat-left__box">
									{{ msg.text_msg?.text }}
								</view>
							</view>
						</view>
						<view v-else>
							<view class="chat-right">
								<uni-icons style="margin-right: 5px;" v-if="msg.wait" type="spinner-cycle" size="20"></uni-icons>
								<view v-if="msg.msg_type === 2" class="chat-right__img">
									<image @click="clickImg(msg.image_msg.image_url)" mode="widthFix" style="width: 150px"
										:src="msg.image_msg.image_url" alt=""></image>
								</view>
								<view v-else-if="msg.msg_type === 3">
									<!-- <video :src></video> -->
								</view>
								<view v-else-if="msg.msg_type === 5" class="chat-right__red-packet">
									<view style="margin-top: 15px">
										<view style="float: left">
											<u-icon name='red-packet-fill' :size="40" color="rgb(216, 61, 31)"></u-icon>
										</view>
										<view style="display: inline-block;line-height: 40px;margin-left: 10px;">
											{{msg.red_packet.mark}}
										</view>
									</view>
								</view>
								<view v-else class="chat-right__box">
									{{ msg.text_msg?.text }}
								</view>

								<u-avatar :src="store.userInfo.avatar" size="32" customStyle="float: right"></u-avatar>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view id="scroll-bottom"></view>
		</scroll-view>
		<view class="bottom-content">
			<!-- <up-upload :fileList="fileList" @afterRead="afterRead" name="6" multiple :width="30" :height="30">
				<u-icon name="plus-circle" color="#2979ff" size="28"></u-icon>

			</up-upload> -->
			<view class="input-btn">
				<u-icon @click="selectFile" name="plus-circle" color="#2979ff" size="28"></u-icon>
				<view class="content-wrap">
					<u-textarea v-model="message" height="40" :showConfirmBar="false" placeholder="请输入内容"
						@focus="showMore = false" @confirm="sendMessage" @linechange="linechange"
						@keyboardheightchange="keyboardheightchange" :disableDefaultPadding="true" autoHeight
						confirm-type="send"></u-textarea>
					<!-- <u-parse content="夏思乡行啊实习生阿夏按顺序阿西阿西啊夏思乡啊夏思乡啊西安西安市西安西安西安市"></u-parse> -->
					<!-- 潇洒啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊显示阿行啊按顺序啊 -->
				</view>
				<view class="btn-wrap">
					<u-button :disabled="!message" @click="sendMessage" class="btn" type="success" size="small">发送</u-button>
				</view>
			</view>
			<template v-if="showMore">
				<u-divider></u-divider>
				<view class="more">
					<view @click="moreClick(item)" v-for="(item,index) in moreList" :key="index" class="more-item">
						<view>
							<u-icon size="30" :name="item.icon"></u-icon>
						</view>
						<view>
							{{item.name}}
						</view>
					</view>
				</view>
			</template>
		</view>
		<u-modal class="red-packet-modal" :show="true" ref="uModal" :asyncClose="true" :showConfirmButton="false">
			xsx
		</u-modal>
	</view>
</template>

<script setup>
	import {
		userStore
	} from '@/store/userStore';
	import {
		computed,
		nextTick,
		onMounted,
		ref,
		watch
	} from "vue";
	import {
		getUserMsg
	} from '@/utils/global.js'
	import moment from 'moment'
	import {
		post
	} from '@/utils/request';
	import ApiPath from '@/common/ApiPath';
	const moreHeight = ref(200)
	const showMore = ref(false)
	const store = userStore()
	const toView = ref('')
	const height = ref(0)
	const startIndex = ref(0)
	const status = ref('loading')
	const moreList = ref([{
		name: '照片',
		icon: 'photo-fill'
	}, {
		name: '视频',
		icon: 'camera-fill'
	}, {
		name: '红包',
		icon: 'red-packet-fill'
	}])
	watch(showMore, () => {
		console.log('==== showMore.value :', showMore.value);
		rebuildHeight()
	})
	const keyboardheight = ref(0)
	watch(keyboardheight, (value) => {
		rebuildHeight()
	})
	const linechange = (event) => {
		rebuildHeight()
	}
	const rebuildHeight = () => {
		nextTick(() => {
			let query = wx.createSelectorQuery();
			query.select('.bottom-content').boundingClientRect(res => {
				const result = uni.getSystemInfoSync()
				console.log('==== res.height :', res, result.windowHeight, res.height, keyboardheight.value);
				height.value = result.windowHeight - res.height - keyboardheight.value
				console.log('==== height :', height);
			}).exec();
			scrollBottom()
		})
	}

	const keyboardheightchange = (event) => {
		console.log('==== keyboardheightchange :', event);
		keyboardheight.value = event.detail.height
	}
	onMounted(() => {
		store.badges[store.operateUsername] = 0
		if (currentMsg.value.msgList.length > 30) {
			startIndex.value = currentMsg.value.msgList.length - 30
		}

		uni.setNavigationBarTitle({
			title: store.msgs[store.operateUsername]?.nickname
		})

		const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
		nextTick(() => {
			rebuildHeight()
		})

		// wx.onKeyboardHeightChange((res1) => {
		// 	query.select('.bottom-content').boundingClientRect(res => {
		// 		const result = uni.getSystemInfoSync()
		// 		height.value = result.windowHeight - res.height - res1.height
		// 		nextTick(() => {
		// 			scrollBottom()
		// 		})
		// 	}).exec();
		// });
	})
	const scrollBottom = () => {
		toView.value = ''
		setTimeout(() => {
			toView.value = 'scroll-bottom'
		}, 100)

	}
	const currentMsg = computed(() => {
		return store.msgs[store.operateUsername]
	})

	const currentMsgList = computed(() => {
		return store.msgs[store.operateUsername].msgList.slice(startIndex.value)
	})
	const endIndex = ref(0)
	const scrollTop = () => {
		if (startIndex.value !== 0) {
			setTimeout(() => {
				const sequence = store.msgs[store.operateUsername].msgList[startIndex.value - 1].sequence
				startIndex.value = startIndex.value - 30 > 0 ? startIndex.value - 30 : 0
				nextTick(() => {
					toView.value = `child-${sequence}`
				})
			}, 1000)

		}
	}
	const moreClick = (item) => {
		if (item.name === '照片') {
			chooseImages();
		} else if (item.name === '视频') {
			chooseVideo()
		} else if (item.name === '红包') {
			uni.navigateTo({
				url: '/pages/home/subpages/red-packet/red-packet'
			})
		}
	}
	const getGroupMember = (username) => {
		if (store.groupMember[store.operateUsername][username]) {
			return store.groupMember[store.operateUsername][username]
		} else {
			return store.cacheUser[username]
		}
	}
	const clickImg = (src) => {
		wx.previewImage({
			urls: [src], //需要预览的图片http链接列表，多张的时候，url直接写在后面就行了
			current: '', // 当前显示图片的http链接，默认是第一个
			success: function(res) {},
			fail: function(res) {},
			complete: function(res) {},
		})
	}

	const formatDate = (value, type) => {
		var date = new Date(Number(value));
		var month = date.getMonth() + 1;
		var hours = date.getHours();
		if (hours < 10)
			hours = "0" + hours;
		var minutes = date.getMinutes();
		if (minutes < 10)
			minutes = "0" + minutes;
		return hours + ":" + minutes
	}
	const message = ref('')
	const sendMessage = () => {
		if (!message.value) {
			return
		}
		const client_sequence = store.userInfo.username + new Date().getTime()
		const data = {
			msg_type: 1,
			from_type: 1,
			to_type: currentMsg.value.type,
			to_username: store.operateUsername,
			text_msg: {
				text: message.value
			},
			from_username: store.userInfo.username,
			wait: true,
			client_sequence,
			formatTime: formatDate(new Date().getTime())
		}
		currentMsg.value.lastUsername = store.userInfo.username
		currentMsg.value.lastMsg = message.value
		currentMsg.value.msgList.push(data)
		message.value = ''
		scrollBottom()
		post(ApiPath.USER_SEND_MSG, {
			msg: data
		}).then(res => {
			getUserMsg()
		})
	}

	const selectFile = () => {
		showMore.value = true
		// uni.showActionSheet({
		// 	title: '选择上传类型',
		// 	itemList: ['图片', '视频'],
		// 	success: res => {
		// 		if (res.tapIndex == 0) {
		// 			chooseImages();
		// 		} else {
		// 			chooseVideo();
		// 		}
		// 	}
		// })
	}
	const fileList = ref([])
	const chooseImages = (event) => {
		wx.chooseImage({
			count: 9, // 默认9 
			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有 
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
			success(result) {
				result.tempFilePaths.forEach((filePath) => {
					const filename = filePath.replace(/^wxfile:\/\//, '')
					wx.getFileSystemManager().readFile({
						filePath: filePath, //要读取的文件的路径 (本地路径)
						encoding: "base64", //指定读取文件的字符编码，如果不传 encoding，则以 ArrayBuffer 格式读取文件的二进制内容
						success(res) {
							//转换完毕，执行上传
							// console.log('==== data :', 'data:image/png;base64,' + res.data);
							post(ApiPath.USER_UPLOAD_FILE, {
								file_name: filename,
								file_data: res.data
							}).then(res1 => {
								if (res1.code === 0) {
									const client_sequence = `${Math.random().toString(36)}`
									currentMsg.value.lastUsername = store.userInfo.username
									currentMsg.value.lastMsg = '[图片]'
									currentMsg.value.msgList.push({
										msg_type: 2,
										from_type: 1,
										to_type: 1,
										to_username: '',
										image_msg: {
											image_url: 'data:image/png;base64,' + res.data
										},
										from_username: store.userInfo.username,
										wait: true,
										client_sequence
									})
									scrollBottom()
									post(ApiPath.USER_SEND_MSG, {
										msg: {
											msg_type: 2,
											from_type: 1,
											to_type: currentMsg.value.type,
											to_username: currentMsg.value.username,
											image_msg: {
												image_url: res1.absolute_file_path
											},
											client_sequence,
											formatTime: moment().format('HH:mm')
										}
									}).then(res2 => {
										if (res2.code === 0) {
											getUserMsg()
										}
									})
								}
							})
						}
					})
				})
			}
		})
	}
	const chooseVideo = () => {
		uni.chooseVideo({
			maxDuration: 60,
			count: 1,
			// camera: this.cameraList[this.cameraIndex].value,
			sourceType: ['album'],
			success: res => {
				console.log('res ', res);
				wx.getFileSystemManager().readFile({
					filePath: res.tempFilePath, //要读取的文件的路径 (本地路径)
					encoding: "base64", //指定读取文件的字符编码，如果不传 encoding，则以 ArrayBuffer 格式读取文件的二进制内容
					success(res1) {
						const filename = res.tempFilePath.replace(/^wxfile:\/\//, '')
						post(ApiPath.USER_UPLOAD_FILE, {
							file_name: filename,
							file_data: res1.data
						}).then(res2 => {
							if (res2.code === 0) {
								const client_sequence = `${Math.random().toString(36)}`
								currentMsg.value.lastUsername = store.userInfo.username
								currentMsg.value.lastMsg = '[视频]'
								currentMsg.value.msgList.push({
									msg_type: 7,
									from_type: 1,
									to_type: 1,
									to_username: '',
									image_msg: {
										image_url: 'data:video/mp4;base64,' + res1.data
									},
									from_username: store.userInfo.username,
									wait: true,
									client_sequence
								})
								scrollBottom()
								post(ApiPath.USER_SEND_MSG, {
									msg: {
										msg_type: 7,
										from_type: 1,
										to_type: currentMsg.value.type,
										to_username: currentMsg.value.username,
										image_msg: {
											image_url: res2.absolute_file_path
										},
										client_sequence,
										formatTime: moment().format('HH:mm')
									}
								}).then(res3 => {
									if (res3.code === 0) {
										getUserMsg()
									}
								})
							}
						})
					}
				})
			}
		});
	}
	const uploadFilePromise = (url) => {
		return new Promise((resolve, reject) => {
			let a = uni.uploadFile({
				url: 'http://192.168.2.21:7001/upload', // 仅为示例，非真实的接口地址
				filePath: url,
				name: 'file',
				formData: {
					user: 'test',
				},
				success: (res) => {
					setTimeout(() => {
						resolve(res.data.data);
					}, 1000);
				},
			});
		});
	};
</script>

<style lang="scss" scoped>
	.message-time {
		text-align: center;
		font-size: 12px;
		color: rgb(168, 166, 166);
		padding-top: 5px;
	}

	.system-message {
		text-align: center;
		font-size: 12px;
		color: rgb(198, 173, 173)
	}

	.group-message-left {
		font-size: 12px;
		margin-left: 38px;
		position: relative;
		top: -8px;
		color: rgb(184, 184, 184)
	}

	.chat-left {
		margin-top: 10px;
		margin-left: 20px;
		padding-bottom: 10px;

		&__img {
			text-align: left;
			display: inline-block;
			line-height: 32px;
			min-height: 32px;
			margin-left: 5px;
			padding: 0 10px;
			border-radius: 5px;
			font-size: 14px;
			white-space: pre-wrap;
		}

		&__red-packet {
			text-align: right;
			display: inline-block;
			line-height: 32px;
			min-height: 32px;
			margin-right: 5px;
			padding: 0 10px;
			border-radius: 5px;
			font-size: 14px;
			white-space: pre-wrap;
			width: 200px;
			height: 70px;
			background-color: rgb(249, 159, 62);
			color: #ffffff;
			font-size: 16px;

			&:hover {
				background-color: rgb(225, 141, 53);
			}
		}

		&__box {
			max-width: 250px;
			text-align: left;
			display: inline-block;
			line-height: 32px;
			min-height: 32px;
			background-color: rgb(149, 236, 105);
			;
			margin-left: 5px;
			padding: 0 10px;
			border-radius: 5px;
			font-size: 14px;
			white-space: pre-wrap;
		}
	}

	.chat-right {
		text-align: right;
		margin-top: 10px;
		margin-right: 20px;
		padding-bottom: 10px;

		&__img {
			text-align: left;
			display: inline-block;
			line-height: 32px;
			min-height: 32px;
			margin-right: 5px;
			padding: 0 10px;
			border-radius: 5px;
			font-size: 14px;
			white-space: pre-wrap;
		}

		&__red-packet {
			text-align: left;
			display: inline-block;
			line-height: 32px;
			min-height: 32px;
			margin-right: 5px;
			padding: 0 10px;
			border-radius: 5px;
			font-size: 14px;
			white-space: pre-wrap;
			width: 200px;
			height: 70px;
			background-color: rgb(249, 159, 62);
			color: #ffffff;
			font-size: 16px;

			&:hover {
				background-color: rgb(225, 141, 53);
			}
		}

		&__box {
			max-width: 250px;
			text-align: left;
			display: inline-block;
			line-height: 32px;
			min-height: 32px;
			margin-right: 5px;
			background-color: rgb(149, 236, 105);
			padding: 0 10px;
			border-radius: 5px;
			font-size: 14px;
			white-space: pre-wrap;
		}
	}

	.left-avatar {
		float: left;
		vertical-align: middle;
		cursor: pointer;
		width: 32px;
		height: 32px;
	}

	.bottom-content {
		width: 100%;
		background-color: #E9EDF4;

		padding-bottom: 20px;
		position: sticky;
		bottom: 0;
		padding-top: 10px;
		overflow: auto;

		.input-btn {
			display: flex;
			align-items: flex-end;

			.content-wrap {
				width: 78%;
				margin-left: 2%;
				// padding-bottom: 10px;
			}

			.btn-wrap {
				width: 18%;
				margin-left: 10px;
				margin-right: 2%;

				::v-deep .u-button {
					font-size: 14px !important;
					height: 36px !important;
				}
			}
		}

		.more {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			margin: 0 10px;
			gap: 20px;

			&-item {
				font-size: 14px;
				border: 1px solid #ffffff;
				background: #ffffff;
				padding: 10px 0;
				width: 20%;
				text-align: center;
			}
		}

		::v-deep .u-icon {
			flex-direction: column !important;
		}

		::v-deep .uicon-plus-circle {
			margin-left: 10px;
			vertical-align: middle;
			font-size: 24px !important;
			height: 36px;
		}
	}


	.chat-detail {
		height: 100vh;
		// padding-bottom: env(safe-area-inset-bottom);
		::v-deep .u-modal__content{
			height: 500px;
			padding: 0 !important;
			background-color: rgb(243, 93, 76);
		}
		::v-deep .u-line{
			display: none !important;
		}
	}
</style>