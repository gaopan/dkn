<template>
  <div class="product-description-wrapper">
    <div class="no-product-description" v-if="noProductDescription">
      <div class="empty-page-lang" v-if="defaultLang == 'ZH'">
        <span class="page-lang-en no-select" :class="{borderBottom2:lang =='ZH','disable-ZH-btn':disableZHbtn}" @click="chooseLang('ZH')">中</span>
        <span class="page-lang-zh no-select" :class="{borderBottom2:lang =='EN'}" @click="chooseLang('EN')">EN</span>
      </div>
      <div class="empty-description-icon"></div>
      <div class="empty-description">
        <p>{{labels.tip1[lang]}}</p>
        <p>{{labels.tip2[lang]}}</p>
        <p>{{labels.tip3[lang]}}</p>
      </div>
    </div>
    <section class="product-description" v-else ref="ContentZone">
      <div class="product-title" v-show="bDescriptionDataLoaded">
        <p class="product-info-title">{{containerTitle}}</p>
        <div class="page-lang" v-if="defaultLang == 'ZH'">
          <span class = "lang-button-wrapper" @click="chooseLang('ZH')">
            <span class="page-lang-en no-select" :class="{borderBottom2:lang =='ZH','disable-ZH-btn':disableZHbtn}">中</span>

          </span>
          <span class = "lang-button-wrapper" @click="chooseLang('EN')">
            <span class="page-lang-zh no-select" :class="{borderBottom2:lang =='EN'}">EN</span>
          </span>
        </div>
      </div>
<!-- 
      <scroll-nav @activeIndexChanged="activeNavIndexChanged" :list="navTabList_" :index="activeNavIndex">
        <scroll-nav-panel :lang="lang" :label="item.label" :idCus="item.id" v-for="(item, index) in navTabList_" :key="index">
          <div class="panel-cell-wrapper " :class="{'panel-designed-for':item.id === 'DesignFor'}" :style="{ visibility:activeNavIndex == index ? 'visible':'hidden' }" v-if="item.id === 'DesignFor'" ref="DesignForBlock">
            <p>{{productInfoDataDatBase.DesignedFor}}</p>
            <p>{{productInfoDataDatBase.Catchline}}</p>
          </div>
          <div class="panel-cell-wrapper product-benefits" :style="{visibility:activeNavIndex == index ? 'visible':'hidden'}" v-else-if="item.id === 'ProductBenefit'" ref="ProdBenefitBlock">
            <div class="product-benefits-item" :class="{'marginBottom0': benefitIndex == productInfoDataDatBase.Benefits.length-1}" v-for="(benefit,benefitIndex) in productInfoDataDatBase.Benefits">
              <p class="benefits-points">{{benefit.label}}</p>
              <p class="benefits-points-content">{{benefit.text}}</p>
            </div>
          </div>
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
          <div class="panel-cell-wrapper product-tech" :style="{visibility:activeNavIndex == index ? 'visible':'hidden'}" v-else-if="item.id === 'ProdConceptTech'" ref="ConceptTechBlock">
            <div class="product-conpcept-wrapper" v-show="!!productInfoDataDatBase.MaintenanceAdv">
              <p class="product-conpcept-title">{{labels.maintenanceAdv[lang]}}</p>
              <p class="product-conpcept-content">{{productInfoDataDatBase.MaintenanceAdv}}</p>
            </div>
            <div class="product-conpcept-wrapper" v-show="!!productInfoDataDatBase.StorageAdv">
              <p class="product-conpcept-title">{{labels.storageAdv[lang]}}</p>
              <p class="product-conpcept-content">{{productInfoDataDatBase.StorageAdv}}</p>
            </div>
            <div class="product-conpcept-wrapper" v-show="!!productInfoDataDatBase.UsageRestriction">
              <p class="product-conpcept-title">{{labels.uesRes[lang]}}</p>
              <p class="product-conpcept-content">{{productInfoDataDatBase.UsageRestriction}}</p>
            </div>
          </div>
          <div class="panel-cell-wrapper tech-information" :style="{visibility:activeNavIndex == index ? 'visible':'hidden'}" v-else-if="item.id === 'TechInfo'" ref="TechInfoBlock">
            <div class="information-wrapper" v-for="(Functionality,FunctionalityIndex) in productInfoDataDatBase.Functionalities">
              <p class="information-queation">{{Functionality.label}}</p>
              <p class="information-answer">{{Functionality.text}}</p>
            </div>
          </div>
        </scroll-nav-panel>
      </scroll-nav>
-->      
      <vue-better-scroll :lang = "lang" :list = "navTabList_" :data = "productInfoDataDatBase" :partialData = "productReviews" @activeIndexChange = "activeIndexChange">
        <ul class="scroll-content">
          <li v-for="(item, index) in navTabList_" :key="index" :id = "item.id" class="scroll-content-cell">
            <div 
              class="panel-cell-wrapper " 
              :class="{'panel-designed-for':item.id === 'DesignFor'}" 
              v-if = "item.id === 'DesignFor'"
              :style="{visibility:activeNavIndex === index ? 'visible':'hidden'}" 
              ref = "DesignForBlock"
            >
              <p>{{productInfoDataDatBase.DesignaedFor}}</p> 
              <p>{{productInfoDataDatBase.Catchline}}</p> 

            </div>
                      
            <div 
              class="panel-cell-wrapper product-benefits" 
              :style="{visibility:activeNavIndex === index ? 'visible':'hidden'}"
              v-else-if = "item.id === 'ProductBenefit' && activeNavIndex === index"
              ref = "ProdBenefitBlock"
            >
              <div class = "product-benefits-item" :class = "{'marginBottom0': benefitIndex == productInfoDataDatBase.Benefits.length-1}"  v-for= "(benefit,benefitIndex) in productInfoDataDatBase.Benefits">
                <p class = "benefits-points">{{benefit.label}}</p> 
                <p class = "benefits-points-content">{{benefit.text}}</p> 
              </div>
            </div>

            <div class="panel-cell-wrapper product-scorce"
                  v-else-if = "item.id === 'UserReviews' && activeNavIndex === index" 
                  :style="{visibility:activeNavIndex === index ? 'visible':'hidden'}" 
                  ref = "UserReviewsBlock"
            >
              <div class="product-scorce-wrapper">
                <rate :rate = "productScore"></rate> 
                <span class="user-review-count" v-if = "lang=='EN'||lang=='MY'">
                  {{productReviews.length}} {{productReviews&&productReviews.length>1?'reviews':'review'}}
                </span>
                <span class="user-review-count" v-else-if = "lang=='ZH'">
                  {{productReviews.length}} 評價
                </span>
              </div>
              
              <div class="user-reviews-items user-review-content" v-for= "(review,reviewIndex) in [...productReviews,...productReviews]">
                    <div class = "review-created-on">
                      <p>
                        <span class = "review-created-date">{{review.published_at}}</span>
                        <span class = "review-created-name">{{review.firstname}}</span>
                      </p>
                      <p><span v-if = "lang == 'EN'||lang == 'MY'">On </span>{{productInfoDataDatBase.WebLabel}}</p>
                    </div> 

                    <div class="review-content">
                      <p class = "">{{review.title}}</p> 
                      <p class = "">{{review.body}}</p> 
                    </div>
              </div>
            </div>  

            <div class="panel-cell-wrapper product-tech" 
                 :style="{visibility:activeNavIndex === index ? 'visible':'hidden'}"
                 v-else-if = "item.id === 'ProdConceptTech' && activeNavIndex === index"
                 ref = "ConceptTechBlock"
            >
              <div class = "product-conpcept-wrapper" v-show = "!!productInfoDataDatBase.MaintenanceAdv">
                <p class = "product-conpcept-title">{{labels.maintenanceAdv[lang]}}</p> 
                <p class = "product-conpcept-content">{{productInfoDataDatBase.MaintenanceAdv}}</p> 
              </div>
              <div class = "product-conpcept-wrapper"  v-show = "!!productInfoDataDatBase.StorageAdv">
                <p class = "product-conpcept-title">{{labels.storageAdv[lang]}}</p> 
                <p class = "product-conpcept-content">{{productInfoDataDatBase.StorageAdv}}</p> 
              </div>
              <div class = "product-conpcept-wrapper"  v-show = "!!productInfoDataDatBase.UsageRestriction">
                <p class = "product-conpcept-title">{{labels.uesRes[lang]}}</p> 
                <p class = "product-conpcept-content">{{productInfoDataDatBase.UsageRestriction}}</p> 
              </div>
            </div>

            <div class="panel-cell-wrapper tech-information" 
                 :style="{visibility:activeNavIndex === index ? 'visible':'hidden'}"
                 v-else-if = "item.id === 'TechInfo' && activeNavIndex === index"
                 ref = "TechInfoBlock"
            >
              <div class = "information-wrapper" v-for= "(Functionality,FunctionalityIndex) in productInfoDataDatBase.Functionalities">
                <p class = "information-queation">{{Functionality.label}}</p> 
                <p class = "information-answer">{{Functionality.text}}</p> 
              </div>
            </div>
          </li>
        </ul>
      </vue-better-scroll>      
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
