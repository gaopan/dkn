<template>
  <div class="product-container" ref="WholePage">
    <!-- <span>RFID: {{rfid}}</span> -->
    <section class="product-photo-container" ref="ConversionZone">
      <div class="product-info">
        <span class="product-code">{{pageInfoLabel.itemCode[lang]}}: {{original_dicount_price_itemcode.itemCode}}</span>
        <div class="product-price-container">
          <p class="product-name" v-if="!!productInfoDataDatBase.WebLabel">{{productInfoDataDatBase.WebLabel}}</p>
          <div class="no-product-name" v-else>
            <div class="info-top"></div>
            <div class="info-bottom"></div>
          </div>
          <div class="product-price-mark">
            <div class="product-with-discount" v-if="showDiscountPrice">
              <span class="product-price-discount">
								<span>{{priceUnit}}</span>
              <span class="product-price-integer">{{original_dicount_price_itemcode.price.discount.int}}</span>
              <span class="product-price-decimal" v-if="priceUnit=='$'">{{original_dicount_price_itemcode.price.discount.decimal}}</span>
              </span>
              <span class="price-original-off">
								<span class="product-price-original">
									{{priceUnit}} {{original_dicount_price_itemcode.price.original.int}}
									<span v-if = "priceUnit=='$'">{{original_dicount_price_itemcode.price.original.decimal}}</span>
              </span>
              <span class="price-discount-off">{{original_dicount_price_itemcode.price.off}}%off</span>
              </span>
            </div>
            <div class="product-without-discount" v-if="showRangePrice">
              <span class="product-price-noDiscount">
								<span class="range-symbol">{{priceUnit}}</span>
              <span class="range-price-integer">{{priceRange.min.int}}</span>
              <span class="range-price-decimal" v-if="priceUnit=='$'">{{priceRange.min.decimal}}</span>
              <span>-</span>
              <span class="range-symbol"><span>{{priceUnit}}</span></span>
              <span class="range-price-integer">{{priceRange.max.int}}</span>
              <span class="range-price-decimal" v-if="priceUnit=='$'">{{priceRange.max.decimal}}</span>
              </span>
            </div>
            <div class="product-without-discount" v-if="showOriginalPrice">
              <span class="product-price-noDiscount">
								<span>{{priceUnit}}</span>
              <span class="product-price-integer">{{original_dicount_price_itemcode.price.original.int}}</span>
              <span class="product-price-decimal" v-if="priceUnit=='$'">{{original_dicount_price_itemcode.price.original.decimal}}</span>
              </span>
            </div>
            <div class="empty-price-label" v-if="bEmptyPrice"></div>
            <!-- <p style="color: red">{{bEmptyPrice}}</p> -->
          </div>
        </div>
        <div class="empty-price">
          <p v-if="noPrice">{{pageInfoLabel.emptyPriceLabel[lang]}}</p>
        </div>
      </div>
      <!-- select different colors of product  -->
      <div class="product-color-option">
        <span class="product-color-selected">
					{{pageInfoLabel.colorOption[lang]}}: <span>{{size_image_colorName.colorName}}</span>
        </span>
        <ul class="product-color-list clearfix" ref="ColorOption">
          <li class="product-color-item" :class="{'selected':color.checked,'noBorder':color.imgUrl==''}" v-for="(color,colorIndex) in colorOptions" @click="selectProductColor(color,colorIndex)">
            <div class="no-icon-image" v-if="color.imgUrl==''"></div>
            <div class="icon-image" v-else-if="color.imgUrl=='NONE'">
              <span>{{color.colorName}}</span>
              <i :class="{'icon-check':color.checked,'icon-unSelected':!color.checked}" />
            </div>
            <div class="icon-image" v-else>
              <img :src="color.imgUrl" :alt="color.colorName" />
              <i :class="{'icon-check':color.checked,'icon-unSelected':!color.checked}" />
            </div>
          </li>
        </ul>
      </div>
      <!-- carousel for display the photos-->
      <div class="product-photo-carousel" ref="MainPicBlock">
        <carousel :per-page="1" :imageUrl="imageUrl" :noImage="noImage" :lang="lang" :navigateTo="navigateToPhoto" @pageChange="pageChange">
          <slide v-for="(img,imgIndex) in imageUrl">
            <img :src="img.url" width="100%" height="100%" v-if="img.type == 'img'" style="cursor: pointer;" />
            <iframe :src="img.url" width="100%" height="100%" v-if="img.type == 'vedio'"></iframe>
          </slide>
        </carousel>
      </div>
      <div class="product-size-option">
        <span class="size-label">
					<span class="size-mark">{{pageInfoLabel.size[lang]}}</span>
        <!-- <span class="size-access">{{pageInfoLabel.stock[lang]}}{{productStock <= 0 ? pageInfoLabel.outOfStock[lang]:pageInfoLabel.inStock[lang]}}</span> -->
        </span>
        <div class="product-size-wrapper">
          <div class="product-size-select" ref="SizeOption" @click="monitorClick_Color_QR_Select('SizeOption')">
            <div class="no-size-option" v-if="size_image_colorName.sizeOptions.length == 0"></div>
            <custom-select v-else-if="size_image_colorName.sizeOptions.length" :label="sizeSelected.label" :subLabel="sizeSelected.stock" :lang="lang" :options="size_image_colorName.sizeOptions" @selectOption="selectProductSize" @menuShow="showSizeMenu">
            </custom-select>
          </div>
          <div class="no-QR-code" v-if="noQRCode"></div>
          <div v-else class="product-dimensional-code" id="QRCodeWrapper" :class="{'zIndex1': bShowQRCode}" ref="QRcode" @click="monitorClick_Color_QR_Select('QRcode')">
            <i :class='{
									"icon-QR_code":!bShowQRCode,
									"icon-close":bShowQRCode,
								}' id="QRCodeIcon" @click="toggleQRCode">
						</i>
            <div class="product-QR-code" v-show="bShowQRCode">
              <p>{{pageInfoLabel.QRTip[lang]}}</p>
              <div class="QR-code-img">
                <img :src="QRCodeSrc" width="100%" height="100%" />
              </div>
            </div>
            <span class="code-tip" :class="{'code-tip-en':lang == 'EN'||lang == 'MY','code-tip-zh':lang == 'ZH'}" v-show="!bShowQRCode">
							{{pageInfoLabel.QRCode[lang]}}
						</span>
          </div>
        </div>
      </div>
      <div class="product-shadow" id="ProductShadow" v-show="bShowShadow||bShowQRCode"></div>
    </section>
    <div class="no-product-description" v-if="noProductDescription">
      <div class="empty-page-lang" v-if="defaultLang == 'ZH'">
        <span class="page-lang-en no-select" :class="{borderBottom2:lang =='ZH','disable-ZH-btn':disableZHbtn}" @click="chooseLang('ZH')">中</span>
        <span class="page-lang-zh no-select" :class="{borderBottom2:lang =='EN'}" @click="chooseLang('EN')">EN</span>
      </div>
      <div class="empty-description-icon"></div>
      <div class="empty-description">
        <p>{{pageInfoLabel.tip1[lang]}}</p>
        <p>{{pageInfoLabel.tip2[lang]}}</p>
        <p>{{pageInfoLabel.tip3[lang]}}</p>
      </div>
    </div>
    <section class="product-description" v-else ref="ContentZone">
      <div class="product-title" v-show="bDescriptionDataLoaded">
        <p class="product-info-title">{{containerTitle}}</p>
        <div class="page-lang" v-if="defaultLang == 'ZH'">
          <span class="page-lang-en no-select" :class="{borderBottom2:lang =='ZH','disable-ZH-btn':disableZHbtn}" @click="chooseLang('ZH')">中</span>
          <span class="page-lang-zh no-select" :class="{borderBottom2:lang =='EN'}" @click="chooseLang('EN')">EN</span>
        </div>
      </div>
      <scroll-nav @activeIndexChanged="activeNavIndexChanged" :list="navTabList_" :index="activeNavIndex">
        <scroll-nav-panel :lang="lang" :label="item.label" :idCus="item.id" v-for="(item, index) in navTabList_" :key="index">
          <!-- DESIGNED FOR -->
          <div class="panel-cell-wrapper " :class="{'panel-designed-for':item.id === 'DesignFor'}" :style="{ visibility:activeNavIndex == index ? 'visible':'hidden' }" v-if="item.id === 'DesignFor'" ref="DesignForBlock">
            <p>{{productInfoDataDatBase.DesignedFor}}</p>
            <p>{{productInfoDataDatBase.Catchline}}</p>
          </div>
          <!-- PRODUCT BENEFITS -->
          <div class="panel-cell-wrapper product-benefits" :style="{visibility:activeNavIndex == index ? 'visible':'hidden'}" v-else-if="item.id === 'ProductBenefit'" ref="ProdBenefitBlock">
            <div class="product-benefits-item" :class="{'marginBottom0': benefitIndex == productInfoDataDatBase.Benefits.length-1}" v-for="(benefit,benefitIndex) in productInfoDataDatBase.Benefits">
              <p class="benefits-points">{{benefit.label}}</p>
              <p class="benefits-points-content">{{benefit.text}}</p>
            </div>
          </div>
          <!-- USER REVIEWS -->
          <div class="panel-cell-wrapper product-scorce" :style="{visibility:activeNavIndex == index ? 'visible':'hidden'}" v-else-if="item.id === 'UserReviews'" ref="UserReviewsBlock">
            <div class="product-scorce-wrapper">
              <rate :rate="productScore"></rate>
              <span class="user-review-count" v-if="lang=='EN'||lang=='MY'">
            				{{productReviews.length}} {{productReviews&&productReviews.length>1?'reviews':'review'}}
            			</span>
              <span class="user-review-count" v-else-if="lang=='ZH'">
	            			{{productReviews.length}} 評價
	            		</span>
            </div>
            <div class="user-review-content" v-show="productReviews.length" v-for="(review,reviewIndex) in productReviews">
              <div class="review-created-on">
                <p>
                  <span class="review-created-date">{{review.published_at}}</span>
                  <span class="review-created-name">{{review.firstname}}</span>
                </p>
                <p><span v-if="lang == 'EN'||lang == 'MY'">On </span>{{productInfoDataDatBase.WebLabel}} {{size_image_colorName.colorName}}</p>
              </div>
              <div class="review-content">
                <p class="">{{review.title}}</p>
                <p class="">{{review.body}}</p>
              </div>
            </div>
          </div>
          <!-- PRODUCT CONCEPT & TECHNOLOGY -->
          <div class="panel-cell-wrapper product-tech" :style="{visibility:activeNavIndex == index ? 'visible':'hidden'}" v-else-if="item.id === 'ProdConceptTech'" ref="ConceptTechBlock">
            <div class="product-conpcept-wrapper" v-show="!!productInfoDataDatBase.MaintenanceAdv">
              <p class="product-conpcept-title">{{pageInfoLabel.maintenanceAdv[lang]}}</p>
              <p class="product-conpcept-content">{{productInfoDataDatBase.MaintenanceAdv}}</p>
            </div>
            <div class="product-conpcept-wrapper" v-show="!!productInfoDataDatBase.StorageAdv">
              <p class="product-conpcept-title">{{pageInfoLabel.storageAdv[lang]}}</p>
              <p class="product-conpcept-content">{{productInfoDataDatBase.StorageAdv}}</p>
            </div>
            <div class="product-conpcept-wrapper" v-show="!!productInfoDataDatBase.UsageRestriction">
              <p class="product-conpcept-title">{{pageInfoLabel.uesRes[lang]}}</p>
              <p class="product-conpcept-content">{{productInfoDataDatBase.UsageRestriction}}</p>
            </div>
          </div>
          <!-- TECHNICAL INFORMATION -->
          <div class="panel-cell-wrapper tech-information" :style="{visibility:activeNavIndex == index ? 'visible':'hidden'}" v-else-if="item.id === 'TechInfo'" ref="TechInfoBlock">
            <div class="information-wrapper" v-for="(Functionality,FunctionalityIndex) in productInfoDataDatBase.Functionalities">
              <p class="information-queation">{{Functionality.label}}</p>
              <p class="information-answer">{{Functionality.text}}</p>
            </div>
          </div>
        </scroll-nav-panel>
      </scroll-nav>
    </section>
    <div class="empty-zhProduct-popup">
      <popup v-if="showModal" @close="showModal = false">
        <div class="empty-description-wrapper" slot="body">
          <p class="empty-description-title">抱歉，中文产品简介还没有准备好。</p>
          <p class="empty-description-subtitle">您过两天来就能看到啦。</p>
        </div>
      </popup>
    </div>
    <element-loading :active="showLoader" :color="'#0082c3'" :is-full-screen="true"></element-loading>
  </div>
</template>
<script src="./product.js"></script>
<style src="./product.css"></style>
