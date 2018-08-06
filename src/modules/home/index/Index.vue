<template>
	<div class="product-index" :class = "{'transition-page-en':bRedirection&&lang == 'EN','transition-page-zh':bRedirection&&lang == 'ZH',}">
		<div class="p-wrapper-en"  v-if = 'lang == "EN"'>
			<p class="p-level1 p-level1-en padding-top1">Don’t know </p>
			<p class="p-level1 p-level1-en p-level1-row2">how to choose?</p>
			<p class="p-level2 p-level2-en">Scan the product down here</p>
			<p class="p-level2 p-level2-en">and get your decision done</p>
			<i class="icon-arrow-down transition-icon" @click = "redirection" :class = "{'transition-icon-down':bMoveIcon,'transition-icon-up':!bMoveIcon}"></i>
		</div>
		<div class="p-wrapper-zh  padding-top2" v-if = 'lang == "ZH"'>
			<p class="p-level1 p-level1-zh">想了解更多商品資訊 ?</p>
			<p class="p-level2 p-level2-zh">
				掃描商品 , 立即查詢
				<i class="icon-arrow-right transition-icon" @click = "redirection" :class = "{'transition-icon-right':bMoveIcon,'transition-icon-left':!bMoveIcon}"></i>
			</p>
		</div>
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
				lang:null
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

			let langInLocal = localStorage.getItem("lang");
			if(!!langInLocal){
				this.lang = langInLocal
			}else{
				this.lang = "EN"
			}
		},
		beforeDestroy(){
			clearInterval(this.intervalTimer);
		}
	}
</script>
<style lang="scss" src="./index.scss"></style>