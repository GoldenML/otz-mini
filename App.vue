<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			wx.showShareMenu()
		},
		onShow: function() {
			console.log('App Show')
			wx.showShareMenu()
		},
		onHide: function() {
			console.log('App Hide')
		},
		onShareAppMessage() {
			
		},
		onShareTimeline(){}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-plus/index.scss";
</style>