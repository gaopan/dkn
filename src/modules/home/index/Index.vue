<template>
	<div class="product-index" :class = "{'transition-page':bRedirection}">
		<!-- <div class="p-wrapper"> -->
			<p class="p-level1 padding-top10">Don’t know </p>
			<p class="p-level1 row2">how to choose?</p>
			<p class="p-level2">Scan the product down here and get your decision done</p>
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
.padding-top10{
  padding-top: 10%;
}
.transition-page{
	transform:translate(0, -1080px);
	transition: 0.5s ease-out transform;
}
.product-index {
    text-align: center;
    color: #fff;
    width: 38.4rem;
    background-color: #0082c3;
    width: 100%;
    /* display: -ms-flexbox; */
    display: flex;
    /* padding-top: 10.41%; */
    flex-direction: column;
    min-height: 100%
}

	.p-level1{
    text-shadow: 10px 10px 0 rgba(0,72,122,.4);
    font-weight: 700;
    line-height: .94;
		font-style: italic;
		font-stretch: condensed;
	}

	.p-level2 {
    font-weight: 400;
    line-height: 1.1;

	  font-style: italic;
	  font-stretch: condensed;
	  padding:1.04% 20%;
	  text-align: center;
	}

	.product-index .icon-arrow-down{
		text-shadow: 7px 5px 0 rgba(0, 72, 122, 0.4);
		display: inline-block;
		font-size: 96px;
		font-weight: bold;
		cursor: pointer;		
	}
	.transition-icon{
		transform: translate(0,10px);
    transition: 0.8s ease transform;		
	}
	.transition-icon-up{
		transform: translate(0,0);
    transition: 0.8s ease transform;		
	}


@media only screen and (min-width:1560px){
	.p-level1{
			font-size: 180px;
	}
	.p-level2 {
		font-size: 100px;
	}
	.product-index .icon-arrow-down{
		font-size: 96px;
	}
}	


@media only screen and (min-width:1080px) and (max-width:1560px){ 
	.p-level1{
			font-size: 100px;
			height: 128px;
	}
	.p-level2 {
		font-size: 60px;
	}
	.product-index .icon-arrow-down{
		font-size: 50px;
	}	
}


@media only screen and (min-width:480px) and (max-width:1080px){ 
	.p-level1{
			font-size: 80px;
	}
	.p-level2 {
		font-size: 40px;
	}
	.product-index .icon-arrow-down{
		font-size: 40px;
	}	
}
</style>