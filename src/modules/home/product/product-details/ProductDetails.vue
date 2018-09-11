<template>
  <section class="product-photo-container" ref="ConversionZone">
    <div class="product-info">
      <span class="product-code">{{labels.itemCode[lang]}}: {{originalDicountPriceItemcode.itemCode}}</span>
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
            <span class="product-price-integer">{{originalDicountPriceItemcode.price.discount.int}}</span>
            <span class="product-price-decimal" v-if="priceUnit=='$'">{{originalDicountPriceItemcode.price.discount.decimal}}</span>
            </span>
            <span class="price-original-off">
								<span class="product-price-original">
									{{priceUnit}} {{originalDicountPriceItemcode.price.original.int}}
									<span v-if = "priceUnit=='$'">{{originalDicountPriceItemcode.price.original.decimal}}</span>
            </span>
            <span class="price-discount-off">{{originalDicountPriceItemcode.price.off}}%off</span>
            </span>
          </div>

          <div class="product-without-discount" v-if="showRangePrice">
            <span class="product-price-noDiscount" v-if = "priceRange.min.int===priceRange.max.int && priceRange.min.decimal===priceRange.max.decimal">
                  <span class="range-price-same">{{priceUnit}}</span>
                  <span class="range-price-same">{{priceRange.min.int}}</span>
                  <span class="range-price-same" v-if="priceUnit=='$'">{{priceRange.min.decimal}}</span>              
            </span>

            <span class="product-price-noDiscount" v-else>
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
            <span class="product-price-integer">{{originalDicountPriceItemcode.price.original.int}}</span>
            <span class="product-price-decimal" v-if="priceUnit=='$'">{{originalDicountPriceItemcode.price.original.decimal}}</span>
            </span>
          </div>
          <div class="empty-price-label" v-if="bEmptyPrice||noPriceInfo"></div>
          <!-- <p style="color: red">{{bEmptyPrice}}</p> -->
        </div>
      </div>
      <div class="empty-price">
        <p v-if="noPriceInfo">{{labels.emptyPriceLabel[lang]}}</p>
      </div>
    </div>
    <!-- select different colors of product  -->
    <div class="product-color-option">
      <span class="product-color-selected">
					{{labels.colorOption[lang]}}: <span>{{size_image_colorName.colorName}}</span>
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
          <img :src="img.url" width="100%" height="100%" style="cursor: pointer;" />
          <!-- <img :src="img.url" width="100%" height="100%" v-if="img.type == 'img'" style="cursor: pointer;" /> -->
          <!-- <iframe :src="img.url" width="100%" height="100%" v-if="img.type == 'vedio'"></iframe> -->
        </slide>
      </carousel>
    </div>
    <div class="product-size-option">
      <span class="size-label">
					<span class="size-mark">{{labels.size[lang]}}</span>
      <!-- <span class="size-access">{{labels.stock[lang]}}{{productStock <= 0 ? labels.outOfStock[lang]:labels.inStock[lang]}}</span> -->
      </span>
      <div class="product-size-wrapper">
        <div class="product-size-select" ref="SizeOption" @click="monitorClickColorQRSelect('SizeOption')">
          <div class="no-size-option" v-if="size_image_colorName.sizeOptions.length == 0"></div>
          <custom-select v-else-if="size_image_colorName.sizeOptions.length" :label="sizeSelected.label" :subLabel="sizeSelected.stock" :lang="lang" :options="size_image_colorName.sizeOptions" @selectOption="selectProductSize" @menuShow="showSizeMenu">
          </custom-select>
        </div>
        <div class="no-QR-code" v-if="noQRCode"></div>
        <div v-else class="product-dimensional-code" id="QRCodeWrapper" :class="{'zIndex1': bShowQRCode}" ref="QRcode" @click="monitorClickColorQRSelect('QRcode')">
          <i :class='{
									"icon-QR_code":!bShowQRCode,
									"icon-close":bShowQRCode,
								}' id="QRCodeIcon" @click="toggleQRCode">
						</i>
          <div class="product-QR-code" v-show="bShowQRCode">
            <p>{{labels.QRTip[lang]}}</p>
            <div class="QR-code-img">
              <img :src="QRCodeSrc" width="100%" height="100%" />
            </div>
          </div>
          <span class="code-tip" :class="{'code-tip-en':lang == 'EN'||lang == 'MY','code-tip-zh':lang == 'ZH'}" v-show="!bShowQRCode">
							{{labels.QRCode[lang]}}
						</span>
        </div>
      </div>
    </div>
    <div class="product-shadow" id="ProductShadow" v-show="bShowShadow||bShowQRCode"></div>
  </section>
</template>
<script src="./product-details.js"></script>
