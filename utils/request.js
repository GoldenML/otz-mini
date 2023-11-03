import operate from '../common/operate.js'

export const post = (url, data, headers = {}, other = {}) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: operate.api + url,
			data,
			header: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
				Cookie: wx.getStorageSync('cookie'),
				...headers
			},
			...other,
			method: 'POST',
			success: ({ data, statusCode, header }) => {
				uni.hideLoading();
				if (statusCode === 403) {
					return
				}
				if (data.code && data.code !== 0) {
					// uni.showToast({
					// 	title: "" + data.msg,
					// 	icon: 'none'
					// });
					// return
				}
				if (header['Set-Cookie']) {
					wx.setStorageSync('cookie', header['Set-Cookie'])
				}
				resolve(data)
			},
			fail: (error) => {
				uni.hideLoading();
				uni.showToast({
					title: "请求失败",
					icon: 'none'
				});
				resolve(error.data);
			}
		})
	});
	
}