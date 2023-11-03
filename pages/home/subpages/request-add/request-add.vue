<template>
	<view>
		<view>发送添加朋友申请</view>
		<u-textarea></u-textarea>
	</view>
</template>

<script setup>
	import {
		onMounted
	} from "vue";
	onMounted(() => {
		uni.setNavigationBarTitle({
			title: '申请添加朋友'
		})
	})
</script>

<style lang="scss">

</style>