<template>
	<div class="product-container">
		<span>RFID: {{rfid}}</span>
		<div class="product-picture">
			<carousel :per-page="1" :imageUrl = "imageUrl">
		    <slide @slideClick="handleSlideClick" v-for = "(url,urlIndex) in imageUrl">
		      <img :src="url" width= "100%" height="100%">
		    </slide>
	  	</carousel>
		</div>
	</div>
</template>

<script src="./product.js"></script>
<style type="text/css">
	.product-picture{
		height: 224px;
	}
</style>