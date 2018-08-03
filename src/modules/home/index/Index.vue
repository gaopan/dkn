<template>
	<div class="product-index" :class = "{'transition-page':bRedirection}">
		<!-- <div class="p-wrapper"> -->
			<p class="p-level1 padding-top10">Don’t know </p>
			<p class="p-level1 p-level1-row2">how to choose?</p>
			<p class="p-level2">Scan the product down here</p>
			<p class="p-level2">and get your decision done</p>
			<i class="icon-arrow-down" @click = "redirection" :class = "{'transition-icon':bMoveIcon,'transition-icon-up':!bMoveIcon}"></i>
		<!-- </div> -->
	</div>
</template>
<script>
	export default{
		name:"product-index",
		data(){
			return {
				bRedirection: false,
				bMoveIcon:false,
				intervalTimer:null,
			}
		},
		methods:{
			redirection(){

				this.bRedirection = true;
				let timer = setTimeout(()=>{
					clearTimeout(timer);
					this.$router.push("/product/default")
				},510)
			}
		},
		created(){
			this.intervalTimer = setInterval(()=>{
				this.bMoveIcon = !this.bMoveIcon;
			},1000);
		},
		beforeDestory(){
			clearInterval(this.intervalTimer);
		}
	}
</script>
<style lang="scss" src="./index.scss"></style>