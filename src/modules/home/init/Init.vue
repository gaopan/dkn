<template>
	<div class="init">
		<form>
		<div class="title">Store ID:</div>
		<div class="input-wrapper">
			<input name="storeId" v-model="storeId" placeholder="" type="number" @keydown = "inputStoreId"/>
		</div>
		<div class="btn-wrapper">
			<button type="button" @click="inited">GO</button>
		</div>
	</form>
	</div>
</template>
<script src="./init.js"></script>
<style src="./init.scss" lang="scss"></style>