<template>
  <div class="product-description-wrapper">
    <div class="no-product-description" v-if="noProductDescription">
      <div class="empty-page-lang" v-if="defaultLang == 'ZH'">
        <span class="lang-button-wrapper" @click="chooseLang('ZH')">
          <span class="page-lang-en no-select" :class="{borderBottom2:lang =='ZH','disable-ZH-btn':disableZHbtn}">中</span>
        </span>
        <span class="lang-button-wrapper" @click="chooseLang('EN')">        
          <span class="page-lang-zh no-select" :class="{borderBottom2:lang =='EN'}">EN</span>
        </span>
      </div>
      <div class="empty-description-icon"></div>
      <div class="empty-description">
        <p>{{labels.tip1[lang]}}</p>
        <p>{{labels.tip2[lang]}}</p>
        <p>{{labels.tip3[lang]}}</p>
      </div>
    </div>
    <section class="product-description" v-else ref="ContentZone">
      <div class="product-title">
        <p class="product-info-title">{{containerTitle}}</p>
        <div class="page-lang" v-if="defaultLang == 'ZH'">
          <span class="lang-button-wrapper" @click="chooseLang('ZH')">
            <span class="page-lang-en no-select" :class="{borderBottom2:lang =='ZH','disable-ZH-btn':disableZHbtn}">中</span>
          </span>
          <span class="lang-button-wrapper" @click="chooseLang('EN')">
            <span class="page-lang-zh no-select" :class="{borderBottom2:lang =='EN'}">EN</span>
          </span>
        </div>
      </div>

      <product-scroller v-if="productInfoDataDatBase" :productInfoDSM="productInfoDataDatBase" :productReviews="productReviews" :lang="lang" :navList="navTabList_" :productScore="productScore" @tab-index-update = "tabIndexUpdate"></product-scroller>

    </section>
    
    <div class="empty-zhProduct-popup">
      <popup v-if="showModal" @close="showModal = false">
        <div class="empty-description-wrapper" slot="body">
          <p class="empty-description-title">抱歉，中文产品简介还没有准备好。</p>
          <p class="empty-description-subtitle">您过两天来就能看到啦。</p>
        </div>
      </popup>
    </div>
  </div>
</template>
<script src="./product-description.js"></script>
