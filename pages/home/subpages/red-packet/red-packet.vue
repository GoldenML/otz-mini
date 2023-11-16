<template>
	<view class="rad-packet">
		<view style="font-size: 12px;margin-bottom: 8px;display: block;">
			<view @click="showType = true" style="color: #2385f1;float:left">{{packetType}}</view>
			<view><u-icon name="arrow-down" size="12" color="#2385f1" top='2'></u-icon></view>
			<u-picker :show="showType" :columns="typeColumns" @cancel="cancel" @confirm="confirm"></u-picker>
		</view>
		<view>
			<u-input v-model="redPacketNum" ref="redPacketNumRef" placeholder="填写红包个数" inputAlign="right" type="number">
				<template #prefix>红包个数</template>
			</u-input>
		</view>
		<view style="margin-top: 10px;">
			<u-input v-model="money" ref="moneyRef" placeholder="¥0.00" border="surround" inputAlign='right' type="number"
				@focus="handleMoneyInput">
				<template #prefix>总金额</template>
			</u-input>
		</view>
		<view style="margin-top: 10px;">
			<u-input placeholder="恭喜发财,大吉大利" border="surround" type="number" clearable>
			</u-input>
		</view>
		<view style="margin-top: 10px;padding: 10px;height: 26px;border: 1px solid #dadbde;background-color: #ffffff;">
			<view style="float: left;">
				红包封面
			</view>
			<view>
				<u-icon name="arrow-right" labelPos="left" size="16"></u-icon>
			</view>
		</view>
		<view style="text-align: center; margin-top: 50px;">
			<view style="font-size: 30px;margin-bottom: 20px;">{{money}}{{money ? money : '¥0.00'}}</view>
			<view style="width: 200px;margin: 0 auto;">
				<u-button @click="sendRedPacket" type="error">塞钱进红包</u-button>
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
		formatDate
	} from "@/utils/global";
	import {
		post
	} from "@/utils/request";
	import ApiPath from "@/common/ApiPath";
	const store = userStore()
	const moneyRef = ref(null)
	const money = ref('')
	const redPacketNumRef = ref(null)
	const redPacketNum = ref()
	onMounted(() => {
		uni.setNavigationBarTitle({
			title: '发红包'
		})
		moneyRef.value.setFormatter(formatter)
		redPacketNumRef.value.setFormatter(formatterNum)
	})
	const packetType = ref('拼手气红包')
	const showType = ref(false)
	const typeColumns = ref([
		['拼手气红包', '普通红包', '专属红包']
	])
	const cancel = () => {
		showType.value = false
	}
	const confirm = (value) => {
		packetType.value = value.value[0]
		showType.value = false
	}
	const handleMoneyInput = (value) => {
		money.value = value.replace(/[^\d.]/g, '');
	}
	const formatterNum = (value) => {
		console.log(value, value.replace(/[^0-9]/ig, ""));
		return value.replace(/[^0-9]/ig, "")
	}
	const formatter = (value) => {
		const real = value.replace(/¥/ig, '').replace(/[^0-9]/ig, "")
		return real ? `¥${real}` : ''
	}
	const sendRedPacket = () => {
		if (redPacketNum.value === 0) {
			uni.showToast({
				title: "红包个数不能为0",
				icon: 'none'
			})
			return
		}
		if (!redPacketNum.value) {
			uni.showToast({
				title: "未填写红包个数",
				icon: 'none'
			})
			return
		}
		const realMoney = money.value.replace(/¥/ig, '')
		if (!realMoney) {
			uni.showToast({
				title: "未填写总金额",
				icon: 'none'
			})
			return
		}
		const client_sequence = `${Math.random().toString(36)}`
		const data = {
			msg_type: 5,
			from_type: 1,
			to_type: store.msgs[store.operateUsername].type,
			to_username: store.operateUsername,
			text_msg: {
				text: ''
			},
			from_username: store.userInfo.username,
			client_sequence,
			formatTime: formatDate(new Date().getTime()),
			red_packet: {
				amount: 10000,
				count: 6,
				red_packet_type: 1,
				username: store.userInfo.username,
				receive_username: '',
				mark: '恭喜发财',
				cover_url: '',
				receive_amount: 0
			}
		}
		post(ApiPath.USER_SEND_MSG, {
			msg: data
		}).then(res => {
			uni.navigateBack()
		})
	}
</script>

<style lang="scss" scoped>
	.rad-packet {
		padding: 10px;

		::v-deep .u-icon {
			width: 20px;
		}
	}
</style>