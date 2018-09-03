<template>
	<div class="product-index" :class = "{'transition-page-zh':bRedirection&&lang == 'ZH','transition-page-en':bRedirection&&lang == 'EN'}">
		<div class="p-wrapper-en"  v-if = 'lang == "EN"'>
			<p class="p-level1 p-level1-en padding-top1">{{indexLabel.levelOne[lang]}}</p>
			<p class="p-level2 p-level2-en">{{indexLabel.levelTwo[lang]}}</p>
			<i class="icon-arrow-down transition-icon padding-top-arrowDown" :class = "{'transition-icon-down':bMoveIcon,'transition-icon-up':!bMoveIcon}"></i>
		</div>
		<div class="p-wrapper-zh  padding-top2" v-if = 'lang == "ZH"'>
			<p class="p-level1 p-level1-zh">{{indexLabel.levelOne[lang]}}</p>
			<p class="p-level2 p-level2-zh">
				{{indexLabel.levelTwo[lang]}}
				<i class="icon-arrow-right transition-icon" :class = "{'transition-icon-right':bMoveIcon,'transition-icon-left':!bMoveIcon}"></i>
			</p>
		</div>
	</div>
</template>
<script src='./index.js'></script>
<style lang="scss" src="./index.scss"></style>