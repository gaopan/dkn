<template>
	<div class = "scroller-wrapper" ref="scrollerWrapper">
		<slot></slot> 
	  <ul class="scrollnav-tab-item" ref="nav" id = "scrollnavTab">
	      <li 
	          v-for="(item, i) in list" 
	          :key="i"
	          class="tab-item-li" 
	          :class="0 === i  ? 'scrollnav-current' : ''"
	          :ref="'navitem_' + i"
	          @click="scrollToTargetContent(item)"
	      >
	          <span :id = "item.id" :class = "{'active-tab-item':0 === i}">{{item.label[lang]}}</span>
	      </li>
	  </ul>		
	</div> 
</template>
<script src="./vue-better-scroll.js"></script>
<style src="./vue-better-scroll.css"></style>
