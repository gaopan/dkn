<template>
	<div class="product-index">
		<div class="p-wrapper">
			<p class="p-level1">Don’t know </p>
			<p class="p-level1 row2">how to choose?</p>
			<p class="p-level2">Scan the product down here and get your decision done</p>
			<i class="icon-arrowdown" @click = "redirectToProductPage"></i>
		</div>
	</div>
</template>
<script>
	export default{
		name:"product-index",
		data(){
			return {

			}
		},
		methods:{
			redirectToProductPage(){
				this.$router.push("/product")
			}
		}
	}
</script>
<style type="text/css">
	.product-index{
		color:#ffffff;
		width:38.4rem;
		height:21.6rem;
		background-color: #0082c3;

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
	  height: 5.48rem;
	  font-size: 2rem;
	  font-weight: normal;
	  font-style: italic;
	  font-stretch: condensed;
	  line-height: 1.1;
	}

	.product-index .icon-arrowdown{
		font-size: 1.92rem;
		font-weight: bold;
		cursor: pointer;
	}
</style>