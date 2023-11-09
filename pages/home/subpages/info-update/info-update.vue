<template>
	<view style="padding: 10px">
		<u-form>
			<u-form-item label="头像">
				<image style="width: 50px;height: 50px;" :src="store.userInfo.avatar"></image>
			</u-form-item>
			<u-form-item label="昵称">
				<u-input v-model="form.nickname" border="none"></u-input>
			</u-form-item>
			<u-form-item label="性别" @click="showSex = true; hideKeyboard()">
				<u-radio-group v-model="form.gender" placement="row" >
					<u-radio :customStyle="{marginBottom: '8px'}" v-for="(item, index) in actions" :key="index" :label="item.name"
						:name="item.value" >
					</u-radio>
				</u-radio-group>

			</u-form-item>
			<u-form-item label="地区" @click="show = true;hideKeyboard()">
				<u-picker :show="show" ref="uPicker" :columns="columns" @confirm="confirm" @change="changeHandler"></u-picker>
			</u-form-item>
		</u-form>
		<view class="fixed-btn">
			<u-button @click="addFriend" type="primary" size="normal">保存</u-button>
		</view>
		<u-action-sheet :show="showSex" :actions="actions" title="请选择性别" description="如果选择保密会报错" @close="showSex = false"
			@select="sexSelect">
		</u-action-sheet>
	</view>
</template>

<script setup>
	import {
		userStore
	} from '@/store/userStore';
	import {
		reactive,
		ref
	} from "vue";
	const store = userStore()
	const form = reactive({
		avatar: store.userInfo.avatar,
		nickname: store.userInfo.nickname,
		gender: store.userInfo.gender

	})
	const showSex = ref(false)
	const show = ref(false);
	const loading = ref(false);
	const picker = ref(null)
	const actions = ref([{
			name: '未知',
			value: 0
		}, {
			name: '男',
			value: 1,
		},
		{
			name: '女',
			value: 2
		},

	])
	const columns = reactive([
		['中国', '美国', '日本'],
		['深圳', '厦门', '上海', '拉萨']
	])
	const columnData = ref([
		['深圳', '厦门', '上海', '拉萨'],
		['得州', '华盛顿', '纽约', '阿拉斯加'],
		['东京']
	])
	const changeHandler = (e) => {
		const {
			columnIndex,
			value,
			values,
			index,
		} = e;

		if (columnIndex === 0) {
			picker.value.setColumnValues(1, columnData[index]);
		}
	}
	const confirm = () => {
		show.value = false;
	}
	const hideKeyboard = () => {
		uni.hideKeyboard()
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