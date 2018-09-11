<template>
  <div class="product-scroller" ref="wrapper">
    <div class="product-scroller-content">
      <!-- DesignForBlock -->
      <div class="product-scroller-item designed-for" v-if = "bDesignFor" id = "DesignForCell" ref="DesignForBlock">
        <p>{{productInfoDSM.DesignaedFor}}</p>
        <p>{{productInfoDSM.Catchline}}</p>
      </div>
      
      <!-- ProdBenefitBlock -->
      <div class="product-scroller-item product-benefits" v-if ="bProductBenefit" id = "ProductBenefitCell"  ref="ProdBenefitBlock">
        <div class="product-benefits-item" :class="{'marginBottom0': benefitIndex == productInfoDSM.Benefits.length-1}" v-for="(benefit,benefitIndex) in productInfoDSM.Benefits">
          <p class="benefits-points">{{benefit.label}}</p>
          <p class="benefits-points-content">{{benefit.text}}</p>
        </div>
      </div>

      <!-- UserReviewsBlock -->
      <div class="product-scroller-item product-scorce"  v-if = "bUserReviews" id = "UserReviewsCell" ref="UserReviewsBlock">
        
        <div class="product-scorce-wrapper">
          <rate :rate="productScore"></rate>
          <span class="user-review-count" v-if="lang=='EN'||lang=='MY'">
                  {{productReviews.length}} {{productReviews&&productReviews.length>1?'reviews':'review'}}
                </span>
          <span class="user-review-count" v-else-if="lang=='ZH'">
                  {{productReviews.length}} 評價
                </span>
        </div>

        <div class="user-reviews-scroller">
          <div class="user-reviews-wrapper">
            <div class="user-reviews-items user-review-content" v-for="(review,reviewIndex) in productReviews">
              <div class="review-created-on">
                <p>
                  <span class="review-created-date">{{review.published_at}}</span>
                  <span class="review-created-name">{{review.firstname}}</span>
                </p>
                <p><span v-if="lang == 'EN'||lang == 'MY'">On </span>{{productInfoDSM.WebLabel}}</p>
              </div>
              <div class="review-content">
                <p class="">{{review.title}}</p>
                <p class="">{{review.body}}</p>
              </div>
              <div class="product-answer" v-if = "review.answer">
                <h5 class="title">{{lang == 'EN' ? "Reply" : "回復"}}：</h5>
                <p class="content" v-html = "review.answer?review.answer.body||'' : ''"></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ConceptTechBlock -->
      <div class="product-scroller-item product-tech" v-if = "bProdConceptTech" id = "ProdConceptTechCell" ref="ConceptTechBlock">
        <div class="product-conpcept-wrapper" v-show="!!productInfoDSM.MaintenanceAdv">
          <p class="product-conpcept-title">{{labels.maintenanceAdv[lang]}}</p>
          <p class="product-conpcept-content">{{productInfoDSM.MaintenanceAdv}}</p>
        </div>
        <div class="product-conpcept-wrapper" v-show="!!productInfoDSM.StorageAdv">
          <p class="product-conpcept-title">{{labels.storageAdv[lang]}}</p>
          <p class="product-conpcept-content">{{productInfoDSM.StorageAdv}}</p>
        </div>
        <div class="product-conpcept-wrapper" v-show="!!productInfoDSM.UsageRestriction">
          <p class="product-conpcept-title">{{labels.uesRes[lang]}}</p>
          <p class="product-conpcept-content">{{productInfoDSM.UsageRestriction}}</p>
        </div>
      </div>

      <!-- TechInfoBlock -->
      <div class="product-scroller-item tech-information" v-if = "bTechInfo" id = "TechInfoCell" ref="TechInfoBlock">
        <div class="information-wrapper" v-for="(Functionality,FunctionalityIndex) in productInfoDSM.Functionalities">
          <p class="information-queation">{{Functionality.label}}</p>
          <p class="information-answer">{{Functionality.text}}</p>
        </div>
      </div>
    </div>

    <ul class="product-scroller-nav">
      <li v-for="(item, i) in navList" :key="i" :class="{current: activeIndex===i}" :ref="'navItem_'+i" @click="toIndex(i)">
        <span :id="item.id">
          <em class="list-item-circle" :class="{'active':activeIndex === i}"></em>
          {{item.label[lang]}}
        </span>
      </li>
    </ul>
  </div>
</template>
<script src="./product-scroller.js"></script>
<style src="./product-scroller.scss" lang="scss" scoped></style>
