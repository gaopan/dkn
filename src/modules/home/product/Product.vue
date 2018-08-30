<template>

	<div class="product-container" ref="container">
		<product-details v-if="AllLangDataBase[lang].productInfo" :productInfo="AllLangDataBase[lang].productInfo" :priceInfo="AllLangDataBase[lang].priceInfo" :noPriceInfo="AllLangDataBase[lang].noPriceInfo" :stockInfo="AllLangDataBase[lang].stockInfo" :noStockInfo="AllLangDataBase[lang].noStockInfo" :lang="lang" :country="country" :storeId="storeId" @changed-model="changedModel" @change-item = "changeItem"></product-details>
		
		<product-description 
			v-if="AllLangDataBase[lang].productInfo && AllLangDataBase[lang].userReviewInfo" 
			:productInfo="AllLangDataBase[lang].productInfo" 
			:userReviewInfo="AllLangDataBase[lang].userReviewInfo" 
			:modelCode="AllLangDataBase[lang].modelCode" 
			:itemCode="AllLangDataBase[lang].itemCode" 
			:lang="lang" 
			:defaultLang="defaultLang" 
			:country="country" 
			:storeId="storeId" 
			@change-product-info="changeProductInfo"
			>
				
		</product-description>
		<element-loading :active="showLoader" :color="'#0082c3'" :is-full-screen="true"></element-loading>
	</div>
</template>
<script src="./product.js"></script>
<style src="./product.css"></style>