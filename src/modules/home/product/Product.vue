<template>
	<div class="product-container">
		<span>RFID: {{rfid}}</span>
		<div class="product-picture">
			<carousel :per-page="1"  :mouse-drag="false">
		    <slide @slideClick="handleSlideClick" v-for = "(url,urlIndex) in imageUrl">
		      <img :src="url" width= "360" height="220">
		    </slide>
	  	</carousel>
		</div>
	</div>
</template>

<script src="./product.js"></script>