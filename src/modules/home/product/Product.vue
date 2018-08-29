<template>

	<div class="product-container" ref="container">
		<product-details v-if="productInfo" :productInfo="productInfo" :priceInfo="priceInfo" :noPriceInfo="noPriceInfo" :stockInfo="stockInfo" :noStockInfo="noStockInfo" :lang="lang" :country="country" :storeId="storeId" @changed-model="changedModel"></product-details>
		<product-description v-if="productInfo && userReviewInfo" :productInfo="productInfo" :userReviewInfo="userReviewInfo" :modelCode="modelCode" :lang="lang" :defaultLang="defaultLang" :country="country" :storeId="storeId" @change-product-info="changeProductInfo"></product-description>
		<element-loading :active="showLoader" :color="'#0082c3'" :is-full-screen="true"></element-loading>
	</div>
</template>
<script src="./product.js"></script>
<style src="./product.css"></style>