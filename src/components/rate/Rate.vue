<template>
	<div class="rate">
		<span class="rate-wrapper">
			<i class="icon-star" :class = "{'high-light': i<= rate,'dark': i> rate}" v-for = "i in 5"></i>
		</span>
		<span class="rate-score">{{rate}}/5</span>
	</div>
</template>
<script type="text/javascript">
	export default{
		name:"rate",
		props:{
			rate:{
				type:Number,
				default:0
			}
		},
		data(){
			return{

			}
		},
		created(){
		},

	}
</script>
<style type="text/css">
	.high-light{
		color:#ffb339;
	}
	.dark{
		color:#c8c8c8;
	}
	.rate-score{
		color:#393939;
		font-weight: bold;
	}

	@media only screen and (min-width:1600px){
		.rate-wrapper{
			font-size: 32px;
			margin-right:20px;
		}
		.rate-score{
			font-size: 32px;
		}		
	}
	@media only screen /* and (min-width:1080px) */ and (max-width:1600px){
		.rate-wrapper{
	    font-size: 25px;
	    margin-right: 16px;		
		}

		.rate-score{
	    font-size: 25px;		
		}		

	}
	/* @media only screen and (min-width:480px) and (max-width:1080px){
	  
	} */
</style>