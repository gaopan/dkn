<template>
	<div class="init">
		<form>
		<div class="title">Store ID:</div>
		<div class="input-wrapper">
			<input name="storeId" v-model="storeId" placeholder="" />
		</div>
		<div class="btn-wrapper">
			<button type="button" @click="inited">GO</button>
		</div>
	</form>
	</div>
</template>
<script src="./init.js"></script>
<style src="./init.scss" lang="scss"></style>