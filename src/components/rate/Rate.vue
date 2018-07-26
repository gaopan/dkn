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
	.rate-wrapper{
		font-size: 32px;
		margin-right:20px;
	}
	.high-light{
		color:#ffb339;
	}
	.dark{
		color:#c8c8c8;
	}
	.rate-score{
		color:#393939;
		font-size: 32px;
		font-weight: bold;
	}
</style>