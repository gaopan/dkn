<template>
	<div class="product-index" :class = "{'transition-page-zh':bRedirection,}">
		<!-- <div class="p-wrapper-en"  v-if = 'lang == "EN"'>
			<p class="p-level1 p-level1-en padding-top1"></p>
			<p class="p-level1 p-level1-en p-level1-row2">how to choose?</p>
			<p class="p-level2 p-level2-en">Scan the product now!</p>
			<p class="p-level2 p-level2-en">and get your decision done</p>
			<i class="icon-arrow-down transition-icon" @click = "redirection" :class = "{'transition-icon-down':bMoveIcon,'transition-icon-up':!bMoveIcon}"></i>
		</div> -->
		<div class="p-wrapper-zh  padding-top2">
			<p class="p-level1 p-level1-zh">{{indexLabel.levelOne[lang]}}</p>
			<p class="p-level2 p-level2-zh">
				{{indexLabel.levelTwo[lang]}}
				<i class="icon-arrow-right transition-icon" @click = "redirection" :class = "{'transition-icon-right':bMoveIcon,'transition-icon-left':!bMoveIcon}"></i>
			</p>
		</div>
	</div>
</template>
<script src='./index.js'></script>
<style lang="scss" src="./index.scss"></style>