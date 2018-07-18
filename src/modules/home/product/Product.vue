<template>
	<div class="product-container">
		<!-- <span>RFID: {{rfid}}</span> -->
		<div class="product-picture">
			<carousel :per-page="1" :imageUrl = "imageUrl">
		    <slide @slideClick="handleSlideClick" v-for = "(url,urlIndex) in imageUrl">
		      <img :src="url" width= "100%" height="100%">
		    </slide>
	  	</carousel>
		</div>

		<div class="product-description">
	    <scroll-nav>
	        <scroll-nav-panel :label="item.label" v-for="(item, key) in list" :key="key">
						<template>
		          <p class="product-info-title">{{item.label}}</p>
	            <div class="panel-cell-wrapper" v-if = "item.label === 'PRODUCT BENEFITS'">
		            <div class = "panel-cell-1" v-for= "i in 4">
		            	<div class = "panel-cell-photo">
		            		
		            	</div>
		            	<div class="panel-cell-info-wrapper">
			            	<p class = "panel-cell-title">CAPACITY1</p> 
			            	<p class = "panel-cell-info">
			            		High living room 5 m2 with groundsheet covering, bedroom 210 * 240 cm
			            	</p> 		            		
		            	</div>
		            </div>
	            </div>

	            <div class="panel-cell-wrapper" v-else>
		            <div class = "panel-cell-2" v-for= "i in 4">
		            	<p class = "panel-cell-title">CAPACITY2</p> 
		            	<p class = "panel-cell-info">
		            		High living room 5 m2 with groundsheet covering, bedroom 210 * 240 cm
		            	</p> 
		            </div>
		          </div>
						</template>
	        </scroll-nav-panel>
	    </scroll-nav>	
	  </div>	
	</div>
</template>

<script src="./product.js"></script>
<style type="text/css">
	.product-container {
    display: flex;
	}
.product-picture {
  width: 10rem;
  height: 10rem;
}

.product-description {
    overflow-y: auto;
    position: relative;
    margin: 0 24px;
    flex: 1;
}	


.panel-cell-1{
	display: flex;
}
.panel-cell-1,
.panel-cell-2{
	padding-left: 0.6rem;
	padding-bottom: .24rem;
}
.panel-cell-photo{
	width:1rem;
	height:1rem;
	background: gray
}
.panel-cell-wrapper {
    margin-bottom: .4rem;
}
.panel-cell-info-wrapper{
	flex: 1;
	margin-top: .12rem;
	margin-left: .12rem;
}
.product-info-title {
  padding-bottom: 0.36rem;	
}

.panel-cell-title,
.product-info-title {
    font-size: 0.36rem;
    font-weight: bold;
}

.panel-cell-title,
.panel-cell-info{
	/* display: inline-block; */
}
</style>