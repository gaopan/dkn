<template>
	<div class="product-container" ref = "productContainer">
		<!-- <span>RFID: {{rfid}}</span> -->
		<section class="product-photo-container">

			<div class="product-info">
				<span class="product-code">Item code: {{productInfoByCurrentSize.itemCode}}</span>
				<div class="product-price-container">
					<p class="product-name">{{productInfoData.WebLabel}}</p>
					<div class="product-price-mark">
						<div class="product-with-discount" v-if = "productInfoByCurrentSize.price.off !== 100">
							<span class="product-price-discount">
								<span>$</span>
								<span class="product-price-integer">{{productInfoByCurrentSize.price.discount.int}}</span>
								<span class="product-price-decimal">{{productInfoByCurrentSize.price.discount.decimal}}</span>
							</span>
							<span class="product-price-original">$ {{productInfoByCurrentSize.price.original.int}}{{productInfoByCurrentSize.price.original.decimal}}</span>
							<span class="price-discount-off">{{productInfoByCurrentSize.price.off}}%off</span>
						</div>
						<div class="product-without-discount" v-else>
							<span class="product-price-noDiscount">
								<span>$</span>
								<span class="product-price-integer">{{productInfoByCurrentSize.price.original.int}}</span>
								<span class="product-price-decimal">{{productInfoByCurrentSize.price.original.decimal}}</span>
							</span>
						</div>
					</div>
				</div>
			</div>
			<!-- select different colors of product  -->
			<div class="product-color-option">
				<span class="product-color-selected">
					Color option: <span>{{productInfoByCurrentColor.colorName}}</span>
				</span>
				<ul class="product-color-list">
					<li class="product-color-item" :class="{'selected':color.checked}" v-for = "(color,colorIndex) in productColors" @click = "selectProductColor(color,colorIndex)">
						<img :src="color.imgUrl"/>
						<i :class="{'icon-check':color.checked,'icon-unSelected':!color.checked}"/>
					</li>
				</ul>
			</div>
			<!-- carousel for display the photos-->
			<div class="product-photo-carousel">
				<carousel :per-page="1" :imageUrl = "imageUrl" :navigateTo = "navigateToPhoto" @pageChange = "pageChange">
			    <slide @slideClick="handleSlideClick" v-for = "(img,imgIndex) in imageUrl">
			      <img :src="img.url" width= "100%" height="100%" v-if = "img.type == 'img'"/>
			      <iframe :src="img.url" width= "100%" height="100%" v-if = "img.type == 'vedio'"></iframe>
			    </slide>
		  	</carousel>
			</div>

			<div class="product-size-option">
				<span class="size-label">
					<span class="size-mark">Size</span>
					<span class="size-access">Stock: {{productStock <=0 ? "unavailable":"available"}}</span>
				</span>
				<div class="product-size-wrapper">
					<div class="product-size-select">
						<custom-select 
							:label = "sizeSelected.label"
							:options = "productInfoByCurrentColor.sizeOptions" 
							@selectOption = "selectProductSize" 
							@menuShow = "showSizeMenu"
							> 
						</custom-select>
					</div>
					<div class="product-dimensional-code" :class = "{'zIndex1': bShowQRCode,'no-item-code':QRCodeSrc == null}">
						<i :class = '{
									"icon-QR_code":!bShowQRCode,
									"icon-close":bShowQRCode,
									"cursor-not-allowed":QRCodeSrc == null
								}' 
								@click = "toggleQRCode">
						</i>
						<div class="product-QR-code" v-show = "bShowQRCode">
							<p>Scan this QR code with your phone, get product information on decathlon.com!</p>
							<div class="QR-code-img" ref = "qrcodeContainer">
								<img :src="QRCodeSrc" width="100%" height ="100%"/>
							</div>

						</div>
						<span class="code-tip" v-show = "!bShowQRCode">Want to buy online?Click me!</span> 
					</div>
				</div>
			</div>

			<div class="product-shadow" v-show = "bShowShadow||bShowQRCode"></div>
		</section>

		<section class="product-description">
			<div class="product-title">
				<p class="product-info-title">{{containerTitle}}</p>
				<div class="page-lang">
					<span class="page-lang-en" :class = "{borderBottom2:lang =='ZH'}" @click = "chooseLang('ZH')">中</span>
					<span class="page-lang-zh" :class = "{borderBottom2:lang =='EN'}"  @click = "chooseLang('EN')">EN</span>
				</div>
			</div>
	    <scroll-nav @activeIndexChanged = "activeNavIndexChanged">
	        <scroll-nav-panel :label="item.label" v-for="(item, index) in list" :key="index">
            <!-- DESIGNED FOR -->
            <div 
          		class="panel-cell-wrapper" 
          		:class="{'panel-designed-for':item.label === 'DESIGNED FOR'}" 
          		:style = "{ visibility:activeNavIndex == index ? 'visible':'hidden' }"
          		v-if = "item.label === 'DESIGNED FOR'">

	            <p>{{productInfoData.DesignedFor}}</p> 
	            <p>{{productInfoData.Catchline}}</p> 

            </div>
						<!-- PRODUCT BENEFITS -->
            <div class="panel-cell-wrapper" 
            		:style = "{visibility:activeNavIndex == index ? 'visible':'hidden'}" 
            		v-else-if = "item.label === 'PRODUCT BENEFITS'">
		            <div class = "product-benefits-item" :class = "{'marginBottom0': benefitIndex == productInfoData.Benefits.length-1}"  v-for= "(benefit,benefitIndex) in productInfoData.Benefits">
		            	<p class = "benefits-points">{{benefit.label}}</p> 
		            	<p class = "benefits-points-content">{{benefit.text}}</p> 
		            </div>
	          </div>
						<!-- USER REVIEWS -->
            <div class="panel-cell-wrapper" :style = "{visibility:activeNavIndex == index ? 'visible':'hidden'}"v-else-if = "item.label === 'USER REVIEWS'">
            		<div class="product-scorce-wrapper">
            			<rate :rate = "productScore"></rate> 
            			<span class="user-review-count">{{productReviews.length}} {{productReviews.length>1?'reviews':'review'}}</span>
            		</div>
		            <div class = "user-review-content" v-for= "(review,reviewIndex) in productReviews">
		            	<div class = "review-created-on">
		            		<p>
		            			<span class = "review-created-date">{{review.published_at}}</span>
		            			<span class = "review-created-name">{{review.firstname}}</span>
		            		</p>
		            		<!-- <p>On Easybreath surface snorkelling mask LIGHT BLUE</p> -->
		            	</div> 

		            	<div class="review-content">
			            	<p class = "">{{review.title}}</p> 
			            	<p class = "">{{review.body}}</p> 
		            	</div>
		            </div>
	          </div>		
						<!-- PRODUCT CONCEPT & TECHNOLOGY -->
            <div class="panel-cell-wrapper" 
            		 :style = "{visibility:activeNavIndex == index ? 'visible':'hidden'}" 
            		 v-else-if = "item.label === 'TPRODUCT CONCEPT & TECHNOLOGY'">
		            <div class = "information-wrapper">
		            	<p class = "information-queation">MAINTENANCE ADVICE</p> 
		            	<p class = "information-answer">{{productInfoData.MaintenanceAdv}}</p> 
		            </div>
		            <div class = "information-wrapper">
		            	<p class = "information-queation">STORAGE ADVICE</p> 
		            	<p class = "information-answer">{{productInfoData.StorageAdv}}</p> 
		            </div>
		            <div class = "information-wrapper">
		            	<p class = "information-queation">USE RESTRICTIONS</p> 
		            	<p class = "information-answer">{{productInfoData.UsageRestriction}}</p> 
		            </div>
	          </div>
						<!-- TECHNICAL INFORMATION -->
            <div class="panel-cell-wrapper" 
            		 :style = "{visibility:activeNavIndex == index ? 'visible':'hidden'}" 
            		 v-else-if = "item.label === 'TECHNICAL INFORMATION'">
		            <div class = "information-wrapper" v-for= "(Functionality,FunctionalityIndex) in productInfoData.Functionalities">
		            	<p class = "information-queation">{{Functionality.label}}</p> 
		            	<p class = "information-answer">{{Functionality.text}}</p> 
		            </div>
	          </div>

	        </scroll-nav-panel>
	    </scroll-nav>	
	  </section>	
	</div>
</template>

<script src="./product.js"></script>
<style src="./product.css"></style>