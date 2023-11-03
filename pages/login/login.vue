<template>
	<view class="login">
		<view class="login-title">
			<img alt="" src="@/assets/logo/logo.png" style="width: 150px; height: 150px;" />
		</view>
		<up-form :model="form">
			<up-form-item borderBottom>
				<up-input placeholder="请输入邮箱" v-model="form.email" border="none"></up-input>
			</up-form-item>
			<up-form-item borderBottom>
				<up-input v-model="form.code" placeholder="请输入验证码" border="none">
					<template #suffix>
						<u-toast ref="uToastRef"></u-toast>
						<up-code ref="uCodeRef" :seconds="counter" @end="end" @change="codeChange"></up-code>
						<up-button :disabled="counter > 0" @tap="sendCode" type="success" size="small">{{tip}}</up-button>
					</template>
				</up-input>
			</up-form-item>
		</up-form>
		<view class="btn-login">
			<up-button @tap="login" type="primary">登录</up-button>
		</view>
	</view>
</template>

<script setup>
	import {
		nextTick,
		onMounted,
		reactive,
		ref
	} from "vue"
	import {
		post
	} from "@/utils/request"
	import ApiPath from "@/common/ApiPath"
	const form = reactive({
		email: '',
		code: ''
	})
	const uCodeRef = ref(null)
	const counter = ref(0)
	const tip = ref('')
	onMounted(() => {
		post(ApiPath.USER_LOGIN_STATUS, {}).then(res => {
			if (res.user_info) {
				uni.reLaunch({
					url: '/pages/home/home'
				})
			}
		})
	})
	const sendCode = () => {
		uni.showLoading({
			title: '正在获取验证码',
			mask: true
		})
		post(ApiPath.SEND_VERIFY_CODE, {
			email: form.email
		}).then(res => {
			uni.hideLoading()
			if (res.code === 0) {
				uni.$u.toast('验证码已发送');
				counter.value = 60
				nextTick(() => {
					uCodeRef.value.start();
				})
			}
		})
	}
	const codeChange = (text) => {
		tip.value = text
	}
	const end = () => {
		counter.value = 0
	}
	const login = () => {
		uni.showLoading({
			title: '正在登录',
			mask: true
		})
		post(ApiPath.USER_LOGIN, {
			login_type: 2,
			email: form.email,
			verify_code: form.code
		}).then(res => {
			uni.hideLoading()
			if (res.code === 0) {
				uni.reLaunch({
					url: '/pages/home/home'
				})
			}
		})
	}
</script>

<style lang="scss" scoped>
	.login {
		position: absolute;
		left: 50%;
		top: 40%;
		transform: translate(-50%, -50%);
		width: 80%;

		&-title {
			font-size: 30px;
			text-align: center;
			margin-bottom: 30px;
		}
	}

	.btn-login {
		margin-top: 50px;
	}
</style>