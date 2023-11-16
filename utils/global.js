import {
	userStore
} from "@/store/userStore";
import ApiPath from '@/common/ApiPath.js'
import {
	post
} from '@/utils/request.js'
import _ from 'lodash'
import moment from 'moment'

const store = userStore()
export const getFriendInfos = async () => {
	const res = await post(ApiPath.USER_GET_FRIEND, {})
	if (res.code === 0) {
		store.friendInfos = res.friends
	}
}
export const getAddHistory = async () => {
	const res = await post(ApiPath.USER_ADD_HISTORY, {})
	if (res.code === 0) {
		store.addHistory = res.add_friend_histories
	}
}
export const formatDate = (value, type) => {
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
export const getUserMsg = (first) => {
	const userInfo = store.userInfo
	const friendInfos = store.friendInfos
	post(ApiPath.USER_GET_MSGS, {
		sequence: store.sequence
	}).then(res => {
		if (res.code === 0) {
			if (res.msgs?.length > 0) {
				// 首次加载消息
				if (first) {
					const newMessage = res.msgs.map(msg => {
						if (msg.from_type === 1 && msg.to_type === 1) {
							if (userInfo.username === msg.from_username) {
								return msg.to_username
							}
							return msg.from_username
						}
						return msg.to_username
					})
					newMessage.forEach(v => {
						store.badges[v] = 0
					})
				} else {
					res.msgs.forEach(msg => {
						// 如果是用户消息
						if (msg.from_type === 1 && msg.to_type === 1) {
							// 如果是朋友给我发送的消息
							if (userInfo.username === msg.to_username) {
								if (store.operateUsername !== msg.from_username) {
									// 如果store.badges中存在msg.to_usernam
									if (store.badges[msg.to_username] || store.badges[msg.to_username] === 0) {
										store.badges[msg.from_username] = store.badges[msg.from_username] + 1
									} else {
										store.badges[msg.from_username] = 1
									}
								}
							}
						} else {
							// 如果是群聊消息，且非我发送的
							if (userInfo.username !== msg.from_username) {
								if (store.operateUsername !== msg.to_username) {
									// 如果store.badges中存在msg.to_usernam
									if (store.badges[msg.to_username] || store.badges[msg.to_username] === 0) {
										store.badges[msg.to_username] = store.badges[msg.to_username] + 1
									} else {
										store.badges[msg.to_username] = 1
									}
								}
							}
						}
					})
				}

				store.sequence = Number(res.msgs[res.msgs.length - 1].sequence)
				const msgs = _.cloneDeep(store.msgs) || {}
				res.msgs.forEach(msg => {
					const {
						from_type,
						to_type,
						from_username,
						to_username,
						msg_type,
						text_msg,
						client_sequence,
						sequence,
						group_id,
						timestamp
					} = msg
					// 时间统一格式化
					if (new Date(Number(timestamp)).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
						msg.formatTime = moment(new Date(Number(timestamp))).format('HH:mm')
					} else {
						msg.formatTime = moment(new Date(Number(timestamp))).format('YYYY-MM-DD HH:mm')
					}
					/**
					 * 针对不同消息处理
					 * from_type 1:用户，2：群，3， 服务号， 4: 群系统消息
					 * msg_type 1: 文本， 2：图片， 3：文件， 4：表情， 5：红包
					 */
					let lastMsg = ''
					switch (msg_type) {
						case 1:
							lastMsg = text_msg.text;
							break
						case 2:
							lastMsg = '[图片]';
							break
						case 3:
							lastMsg = '[文件]';
							break
						case 4:
							lastMsg = '[表情]';
							break
						case 5:
							lastMsg = '[红包]';
							break
					}
					if (from_type === 1 && to_type === 1) {
						// 如果from_username等于当前用户username,则friendUsername为to_username，否则为from_username
						const friendUsername = userInfo.username === from_username ? to_username : from_username
						// 获取朋友信息
						const friend = friendInfos.find(user => user.username === friendUsername)
						if (friend) {
							// 如果消息列表已有朋友消息，则追加，否则添加
							if (msgs[friendUsername]) {
								// 更改最后一次消息时间
								msgs[friendUsername].lastTime = timestamp
								// 更改最后一次消息内容
								msgs[friendUsername].lastMsg = lastMsg
								// 查找用户发送的消息，并将等待状态改为false,注：wait === true 代表消息正在发送中,false表示发送成功
								const clientMsg = msgs[friendUsername].msgList.find(v => String(v.client_sequence) === String(
									client_sequence))
								if (client_sequence && clientMsg) {
									clientMsg.formatTime = msg.formatTime
									clientMsg.wait = false
									return
								}
								// 在历史消息中查找与当前消息一致的sequence,防止重复添加
								const historyMsg = msgs[friendUsername].msgList.find(v => String(v.sequence) === String(
									sequence))
								if (!historyMsg) {
									msgs[friendUsername].msgList.push(msg)
								}
							} else {
								msgs[friendUsername] = {
									type: 1,
									nickname: friend.nickname,
									avatar: friend.avatar,
									lastMsg: lastMsg,
									username: friendUsername,
									msgList: [msg],
									lastTime: timestamp
								}
							}
						}
					} else if ((from_type === 1 || from_type === 4) && to_type === 2) {
						// 群消息，和上面类似
						const group = store.groupInfos.find(v => v.group_id === to_username)
						if (group) {

							if (msgs[to_username]) {
								msgs[to_username].lastTime = timestamp
								msgs[to_username].lastUsername = from_username
								msgs[to_username].lastMsg = lastMsg
								const clientMsg = msgs[to_username].msgList.find(v => String(v.client_sequence) === String(
									client_sequence))
								if (client_sequence && clientMsg) {
									clientMsg.formatTime = msg.formatTime
									clientMsg.wait = false
									return
								}
								const historyMsg = msgs[to_username].msgList.find(v => String(v.sequence) === String(
									sequence))
								if (!historyMsg) {
									if (from_type === 4) {
										msg.isSystemMsg = true
									}
									msgs[to_username].msgList.push(msg)
								}
							} else {
								if (from_type === 4) {
									msg.isSystemMsg = true
								}

								msgs[to_username] = {
									type: 2,
									nickname: group.group_name,
									avatar: group.group_avatar,
									lastUsername: from_username,
									lastMsg: lastMsg,
									username: to_username,
									lastTime: timestamp,
									msgList: [msg]
								}
							}
						}
					}
				})
				const arr = []
				Object.keys(msgs).forEach((e, i) => {
					arr[i] = {
						[e]: msgs[e]
					}
				})
				const newArr = arr.sort((v1, v2) => {
					return Number(v2[Object.keys(v2)[0]].lastTime) - Number(v1[Object.keys(v1)[0]].lastTime)
				})
				const newObj = {}
				newArr.forEach(e => {
					newObj[Object.keys(e)[0]] = e[Object.keys(e)[0]]
				})
				Object.keys(newObj).forEach(v => {
					if (newObj[v].type === 2) {
						newObj[v].msgList.filter(e => e.from_type !== 4).forEach(e => {
							if (!store.groupMember[e.to_username]?.[e.from_username] && !store.cacheUser[e
									.from_username] && e.from_username) {
								post(ApiPath.USER_GET_INFO, {
									username: e.from_username
								}).then(res => {
									if (res.code === 0) {
										store.cacheUser[res.user_info.username] = res.user_info
									}
								})
							}
						})
					}
				})
				console.log(newArr)
				store.msgs = newObj
				if (res.msgs.length > 100) {
					getUserMsg()
				}
			}
		}
	})
}