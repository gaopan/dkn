<template>
	<div class="product-index" :class = "{'transition-page':bRedirection}">
		<div class="p-wrapper">
			<p class="p-level1">Don’t know </p>
			<p class="p-level1 row2">how to choose?</p>
			<p class="p-level2">Scan the product down here and get your decision done</p>
			<i class="icon-arrow-down" @click = "redirection" :class = "{'transition-icon':bMoveIcon,'transition-icon-up':!bMoveIcon}"></i>
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
			}
		},
		methods:{
			redirection(){

				this.bRedirection = true;
				let timer = setTimeout(()=>{
					clearTimeout(timer);
					this.$router.push("/product")
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
<style type="text/css">
.transition-page{
	transform:translate(0, -21.6rem);
	transition: 0.5s ease-out transform;
}
	.product-index{
    color: #fff;
    width: 38.4rem;
    /* height: 21.6rem; */
    background-color: #0082c3;
    width: 100%;
    height: 100%;		
	}
	.p-wrapper{
		width:27.52rem;
		/* height:18.76rem; */
		margin: 0 auto; 
		padding-top: 5.12rem;
		text-align: center;
	}
	.p-level1{
		height:3.56rem;
		text-shadow: 0.2rem 0.2rem 0 rgba(0, 72, 122, 0.4);
		font-size: 3.6rem;
		font-weight: bold;
		font-style: italic;
		font-stretch: condensed;
		line-height: 0.94;
	}

	.p-level2 {
	  height: 5.2rem;
	  font-size: 2rem;
	  font-weight: normal;
	  font-style: italic;
	  font-stretch: condensed;
	  line-height: 1.1;
	}

	.product-index .icon-arrow-down{
		text-shadow: 0.14rem 0.1rem 0 rgba(0, 72, 122, 0.4);
		display: inline-block;
		font-size: 1.92rem;
		font-weight: bold;
		cursor: pointer;		
	}
	.transition-icon{
		transform: translate(0,0.4rem);
    transition: 0.8s ease transform;		
	}
	.transition-icon-up{
		transform: translate(0,0);
    transition: 0.8s ease transform;		
	}
</style>