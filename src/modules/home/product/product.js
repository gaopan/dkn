/**

**/
import { Carousel, Slide } from "@/components/carousel"
import { ScrollNav, ScrollNavPanel } from "@/components/scrollNav"
import CustomSelect from "@/components/custom-select"
import popup from "@/components/popup/Popup.vue"
import Rate from "@/components/rate/Rate.vue"
import StoreService from '@/services/store-services.js'

import ProductApi from "@/api/modules/product/productInfo.js"
import ProductConfig from './product.config.js'

import TimeUtil from "@/utils/datetime-utils.js"
import TypeChecker from "@/utils/type-checker.js"

export default {
  name: 'product',
  data() {
    return {
      rfid: null,
      priceUnit: null,
      showModal: false,
      area: {
        to: null,
        from: null,
      },
      areaOfField: null,
      fieldRef: {},

      monitorCount: 0,
      monitorTime: null,

      monitorMousemove: {
        carouselClicked: false,
        carouselTime: 0,
        scrollNavMousewheel: false,
        scrollTarget: null,
        scrollNavTime: 0,
      },

      lang: null,
      navigateToPhoto: 1,
      imageUrl: [],
      navTabList: ProductConfig.navTabList,
      navTabList_: [],
      pageInfoLabel: ProductConfig.pageInfoLabel,
      containerTitle: null,
      activeNavIndex: 0,

      colorOptions: [],
      defaultModelChanged: false,

      productAllInfoByColor: [],
      size_image_colorName: {
        colorName: null,
        videosAndImages: [],
        sizeOptions: []
      },
      original_dicount_price_itemcode: {
        // stock: 0,
        itemCode: "",
        price: {
          original: {
            int: "0",
            decimal: ".00"
          },
          discount: {
            int: "0",
            decimal: ".00"
          },
          off: 100
        }
      },
      priceRange: {
        max: {
          int: "0",
          decimal: ".00"
        },
        min: {
          int: "0",
          decimal: ".00"
        },
      },
      productStock: 0,
      sizeSelected: { //value for display the label of sected size
        label: null,
        stock: null,
        value: null
      },
      bShowShadow: false,
      bShowQRCode: false,

      productInfoDataDatBase: {},
      productModelsDatBase: {},
      reviewsDataBase: {},
      priceDataBase: {},
      stockDataBase: {},
      QRCodeSrc: null,
      productReviews: [],
      productScore: 0,
      defaultIndex: {
        ZH: {
          defaultColorIndex: null,
          defaultSizeIndex: null,
        },
        other: {
          defaultColorIndex: null,
          defaultSizeIndex: null
        }
      },
      defaultCode: {
        ZH: {
          default_item_code: null,
          default_model_code: null
        },
        EN: {
          default_item_code: null,
          default_model_code: null
        },
        other: {
          default_item_code: null,
          default_model_code: null
        }
      },

      fieldELeQueried: {},
      bEmptyPrice: true,
      //no qr code is available
      noQRCode: true,
      //no image is available
      noImage: false,
      //user review is null
      noUserView: false,
      noStock: false,
      //price api error
      //no item in price object
      noPrice: false,
      bEmptyProductInfo: false,
      //show decription title when decription loaded
      bDescriptionDataLoaded: false,
      disableZHbtn: false

    }
  },
  created() {
    this.rfid = this.$router.currentRoute.params.rfid;

    this.defaultLang = StoreService.getLang();

    if (this.defaultLang == 'EN') {
      this.lang = "MY";
    } else {
      let langInLocal = localStorage.getItem("lang");
      this.lang = !!langInLocal ? langInLocal : this.defaultLang;
    }

    this.initPageData(this.lang)

    this.intervalTimer = setInterval(this.checkTime, 1000)

  },

  mounted() {
    this.$nextTick(() => {
      let doc = document;
      this.fieldELeQueried.DesignFor = doc.querySelector("#DesignFor");
      this.fieldELeQueried.ProductBenefit = doc.querySelector("#ProductBenefit");
      this.fieldELeQueried.UserReviews = doc.querySelector("#UserReviews");
      this.fieldELeQueried.ProdConceptTech = doc.querySelector("#ProdConceptTech");
      this.fieldELeQueried.TechInfo = doc.querySelector("#TechInfo");

      this.fieldELeQueried.carouselPagination = doc.querySelector("#carouselPagination");
      this.fieldELeQueried.scrollnavTab = doc.querySelector("#scrollnavTab");

      this.fieldELeQueried.CarouselWrapper = doc.querySelector("#CarouselWrapper");
      this.fieldELeQueried.ScrollnavContent = doc.querySelector("#ScrollnavContent");

      window.addEventListener("resize", this.monitorUserAction)

      this.$refs.WholePage.addEventListener("mousemove", this.monitorUserAction)
      this.$refs.WholePage.addEventListener("click", this.monitorUserAction)
      this.$refs.WholePage.addEventListener("mousewheel", this.monitorUserAction)

      if (this.fieldELeQueried.carouselPagination) this.fieldELeQueried.carouselPagination.addEventListener("click", this.paginationMonitorClick);
      if (this.fieldELeQueried.scrollnavTab) this.fieldELeQueried.scrollnavTab.addEventListener("click", this.navMonitorClick);

      if (this.fieldELeQueried.CarouselWrapper) {
        this.fieldELeQueried.CarouselWrapper.addEventListener("mouseleave", this.carouselMonitorMouseout);
        this.fieldELeQueried.CarouselWrapper.addEventListener("mousedown", this.carouselMonitorMousedown);
      }

      if (this.fieldELeQueried.ScrollnavContent) {
        this.fieldELeQueried.ScrollnavContent.addEventListener("mousewheel", this.scrollMonitorMousewheel);
        this.fieldELeQueried.ScrollnavContent.addEventListener("mouseleave", this.scrollMonitorMouseleave);
      }

      if (this.defaultLang != 'EN') {
        localStorage.set(lang, this.defaultLang);
      }
    })
  },
  beforeDestroy() {

    window.removeEventListener("resize", this.monitorUserAction)

    this.$refs.WholePage.removeEventListener("mousemove", this.monitorUserAction)
    this.$refs.WholePage.removeEventListener("click", this.monitorUserAction)
    this.$refs.WholePage.removeEventListener("mousewheel", this.monitorUserAction)

    if (this.fieldELeQueried.carouselPagination) this.fieldELeQueried.carouselPagination.removeEventListener("click", this.paginationMonitorClick);
    if (this.fieldELeQueried.scrollnavTab) this.fieldELeQueried.scrollnavTab.removeEventListener("click", this.navMonitorClick);

    if (this.fieldELeQueried.CarouselWrapper) {
      this.fieldELeQueried.CarouselWrapper.removeEventListener("mouseleave", this.carouselMonitorMouseout);
      this.fieldELeQueried.CarouselWrapper.removeEventListener("mousedown", this.carouselMonitorMousedown);
    }

    if (this.fieldELeQueried.ScrollnavContent) {
      this.fieldELeQueried.ScrollnavContent.removeEventListener("mousewheel", this.scrollMonitorMousewheel);
      this.fieldELeQueried.ScrollnavContent.removeEventListener("mouseleave", this.scrollMonitorMouseleave);
    }

    clearInterval(this.intervalTimer);
  },
  methods: {
    carouselMonitorMousedown() {
      if (!this.monitorMousemove.carouselClicked) {
        this.monitorMousemove.carouselClicked = true;
        this.monitorMousemove.carouselTime = Date.now();
      }
    },
    carouselMonitorMouseout() {
      if (this.monitorMousemove.carouselClicked) {
        this.monitorMousemove.carouselClicked = false;
        let stayTime = +((Date.now() - this.monitorMousemove.carouselTime) / 1000).toFixed(2);

        let data = {
          item_code: this.defaultCode.other.default_item_code,
          item_code: this.original_dicount_price_itemcode.itemCode,
          item_name: this.itemName,
          area: "ConversionZone",
          field: "MainPicBlock",
          event: 2,
          stay_time: stayTime
        }

        // console.log("carousel mouse out", data)
        ProductApi.postTracking(data).then(res => {
          // console.log(res.data);
        })
        this.monitorMousemove.carouselTime = Date.now();

      }

    },
    navMonitorClick(event) {
      event = event || window.event;
      let target = event.target,
        field,
        fieldEle = this.fieldELeQueried;
      if (target == fieldEle.DesignFor) field = "DesignFor";
      if (target == fieldEle.ProductBenefit) field = "ProductBenefit";
      if (target == fieldEle.UserReviews) field = "UserReviews";
      if (target == fieldEle.ProdConceptTech) field = "ProdConceptTech";
      if (target == fieldEle.TechInfo) field = "TechInfo";

      let data = {
        item_code: this.defaultCode.other.default_item_code,
        item_code: this.original_dicount_price_itemcode.itemCode,
        item_name: this.itemName,
        area: "ContentZone",
        field: field,
        event: 1,
        stay_time: 0
      }
      this.areaOfField = field;

      ProductApi.postTracking(data).then(res => {
        // console.log(res.data);
      })
    },
    paginationMonitorClick(event) {
      event = event || window.event;

      let doc = document;
      if (event.target == doc.querySelector("#iconDown") || event.target == doc.querySelector("#iconUp")) {
        let data = {
          item_code: this.original_dicount_price_itemcode.itemCode,
          item_code: this.defaultCode.other.default_item_code,
          item_name: this.itemName,
          area: "ConversionZone",
          field: "Moreviews",
          event: 1,
          stay_time: 0
        }

        ProductApi.postTracking(data).then(res => {
          // console.log(res.data);
        })
      }
    },

    monitorClick_Color_QR_Select(field) {
      let data = {
        item_code: this.defaultCode.other.default_item_code,
        item_code: this.original_dicount_price_itemcode.itemCode,
        item_name: this.itemName,
        area: "ConversionZone",
        field: field,
        event: 1,
        stay_time: 0
      }
      this.areaOfField = field;

      ProductApi.postTracking(data).then(res => {
        // console.log(res.data);
      })
    },
    scrollMonitorMousewheel(event) {
      event = event || event.target;
      if (!this.monitorMousemove.scrollNavMousewheel) {
        this.monitorMousemove.scrollNavTime = Date.now();
      }

      this.monitorMousemove.scrollNavMousewheel = true;
      let target = null,
        eventTarget = event.target;

      if (this.$refs.DesignForBlock) {
        if (TypeChecker.isArray(this.$refs.DesignForBlock)) {
          if (this.$refs.DesignForBlock[0] && this.$refs.DesignForBlock[0].contains(eventTarget)) target = "DesignForBlock";
        } else {
          if (this.$refs.DesignForBlock.contains(eventTarget)) target = "DesignForBlock";

        }
      }
      if (this.$refs.ProdBenefitBlock) {
        if (TypeChecker.isArray(this.$refs.ProdBenefitBlock)) {
          if (this.$refs.ProdBenefitBlock[0] && this.$refs.ProdBenefitBlock[0].contains(eventTarget)) target = "ProdBenefitBlock";
        } else {
          if (this.$refs.ProdBenefitBlock.contains(eventTarget)) target = "ProdBenefitBlock";

        }
      }
      if (this.$refs.UserReviewsBlock) {
        if (TypeChecker.isArray(this.$refs.UserReviewsBlock)) {
          if (this.$refs.UserReviewsBlock[0] && this.$refs.UserReviewsBlock[0].contains(eventTarget)) target = "UserReviewsBlock";
        } else {
          if (this.$refs.UserReviewsBlock.contains(eventTarget)) target = "UserReviewsBlock";

        }
      }
      if (this.$refs.TechInfoBlock) {
        if (TypeChecker.isArray(this.$refs.TechInfoBlock)) {
          if (this.$refs.TechInfoBlock[0] && this.$refs.TechInfoBlock[0].contains(eventTarget)) target = "TechInfoBlock";
        } else {
          if (this.$refs.TechInfoBlock.contains(eventTarget)) target = "TechInfoBlock";

        }
      }
      if (this.$refs.ConceptTechBlock) {
        if (TypeChecker.isArray(this.$refs.ConceptTechBlock)) {
          if (this.$refs.ConceptTechBlock[0] && this.$refs.ConceptTechBlock[0].contains(eventTarget)) target = "ConceptTechBlock";
        } else {
          if (this.$refs.ConceptTechBlock.contains(eventTarget)) target = "ConceptTechBlock";

        }
      }

      if (this.monitorMousemove.scrollTarget && this.monitorMousemove.scrollTarget != target) {
        let stayTime = +((Date.now() - this.monitorMousemove.scrollNavTime) / 1000).toFixed(2);
        let data = {
          // item_code: this.defaultCode.other.default_item_code,
          item_code: this.original_dicount_price_itemcode.itemCode,
          item_name: this.itemName,
          area: "ContentZone",
          field: this.monitorMousemove.scrollTarget,
          event: 2,
          stay_time: stayTime
        }
        ProductApi.postTracking(data).then(res => {
          // console.log(res.data);
        })

        this.monitorMousemove.scrollNavTime = Date.now();
      }

      this.monitorMousemove.scrollTarget = target;

    },
    scrollMonitorMouseleave(event) {
      if (this.monitorMousemove.scrollNavMousewheel) {

        let stayTime = +((Date.now() - this.monitorMousemove.scrollNavTime) / 1000).toFixed(2);
        let data = {
          // item_code: this.defaultCode.other.default_item_code,
          item_code: this.original_dicount_price_itemcode.itemCode,
          item_name: this.itemName,
          area: "ContentZone",
          field: this.monitorMousemove.scrollTarget,
          event: 2,
          stay_time: stayTime
        }
        // console.log(data)
        ProductApi.postTracking(data).then(res => {
          // console.log(res.data);
        })
        this.monitorMousemove.scrollNavTime = 0;
        this.monitorMousemove.scrollTarget = null;
        this.monitorMousemove.scrollNavMousewheel = false;
      }
    },
    monitorUserAction(event) {
      event = event || window.event;
      this.monitorCount = 0;
    },
    checkTime() {
      if (this.monitorCount === 3 * 60 - 1) {
        clearInterval(this.intervalTimer);
        this.$router.push("/index")
      } else {
        this.monitorCount += 1;
      }
    },

    selectProductColor(color, colorIndex) {
      if (color.checked || color.imgUrl == '') return;

      this.defaultModelChanged = true;

      this.colorOptions.forEach(d => { d.checked = false; })
      color.checked = true;

      this.defaultCode.other.default_item_code = null;
      this.original_dicount_price_itemcode.itemCode = null;

      this.defaultCode.other.default_model_code = color.modelCode;
      // this.defaultCode[this.lang].default_item_code = 

      //user select color item while data was loading
      this.bEmptyPrice = false;

      this.priceRange = this.getRangePrice(this.priceDataBase, color.modelCode);

      if (Object.keys(this.reviewsDataBase).length) {
        let reviewData = this.reviewsDataBase[color.modelCode];
        var obj = this.makeUserReviewData(reviewData);
        this.productReviews = obj.productReviews;
        this.productScore = obj.productScore;

      }

      this.QRCodeSrc = null;

      this.sizeSelected = { label: null, value: null, stock: null }

      this.navigateToPhoto = 1;

      this.productAllInfoByColor.every((d, modelsIndex) => {
        if (d.modelCode == color.modelCode) {

          this.size_image_colorName = Object.assign({}, d);
          this.imageUrl = this.size_image_colorName.videosAndImages;
          this.noImage = this.imageUrl.length ? false : true;

          this.defaultIndex.other.defaultColorIndex = modelsIndex;

          return false;
        }
        return true;
      })

      let countru_QR = this.lang == "MY" ? "my" : "tw"
      ProductApi.getQrcode(color.modelCode, countru_QR).then(res => {
        this.QRCodeSrc = res.data;
        this.noQRCode = res.data ? false : true;
      }, err => {
        this.noQRCode = true;
      })

    },

    pageChange(args) {
      this.navigateToPhoto = args;
    },

    selectProductSize(args) {
      if (args.value == this.sizeSelected.value) return;
      this.defaultModelChanged = true;
      this.defaultIndex.other.defaultSizeIndex = args.index;

      this.sizeSelected = Object.assign({}, { value: args.value, label: args.label, stock: args.stock });

      this.defaultCode.other.default_item_code = args.itemCode;
      this.original_dicount_price_itemcode.itemCode = args.itemCode;

      //prevent before price returned
      if (Object.keys(this.priceDataBase).length) {
        let price = this.priceDataBase.items[args.itemCode];

        if (!price) {
          this.bEmptyPrice = true;
        } else {
          this.bEmptyPrice = false;
          this.original_dicount_price_itemcode.price = this.calculateDiscount(price);
        }

        console.log(this.original_dicount_price_itemcode.price)
      }
    },

    toggleQRCode() {
      if (this.QRCodeSrc == null) return;
      this.bShowQRCode = !this.bShowQRCode;
      let ProductShadow = document.querySelector("#ProductShadow");
      if (this.bShowQRCode) {
        ProductShadow.addEventListener("click", this.fnBlur, false)
      } else {
        ProductShadow.removeEventListener("click", this.fnBlur, false)
      }
    },
    fnBlur(event) {
      let QRCodeWrapper = document.querySelector("#QRCodeWrapper");

      if (QRCodeWrapper && !QRCodeWrapper.contains(event.target)) {
        this.bShowQRCode = false;
      }
    },

    chooseLang(lang) {
      if (this.lang == lang || this.disableZHbtn) return;

      if (lang == "ZH" && this.defaultLang == "ZH") {
        ProductApi.getProductInfo(this.rfid, "ZH", "tw").then(res => {
          localStorage.setItem("lang", lang);
          window.location.reload()
        }, err => {
          this.showModal = true;
          this.disableZHbtn = true;
        })
        return;
      } else {
        localStorage.setItem("lang", lang);
        window.location.reload()
      }


    },

    activeNavIndexChanged(args) {
      this.activeNavIndex = args;
      this.containerTitle = this.navTabList_[args].label[this.lang];
    },

    showSizeMenu(args) {
      this.bShowShadow = args;
    },

    initPageData(lang) {
      //request  product in  tw_en , tw_zh and my
      let country = this.defaultLang == "ZH" ? "tw" : "my";

      var productInfoPromise = ProductApi.getProductInfo(this.rfid, lang, country).then(res => {
        if (res.data && res.data.dsm) this.productInfoDataDatBase = res.data.dsm;
        if (res.data && res.data.models) this.productModelsDatBase = res.data.models;

        this.defaultCode[lang].default_item_code = res.data.default_item_code;
        this.defaultCode[lang].default_model_code = res.data.default_model_code;

        var defaultIndex = getDefaultCodeIndex(this.productModelsDatBase, res.data.default_model_code, res.data.default_item_code)
        this.defaultIndex[lang] = Object.assign({}, defaultIndex);

        //bDescriptionDataLoaded——show description title
        this.bDescriptionDataLoaded = true;

        //default size, no defalut stock now
        this.sizeSelected = this.getSizeLabel(
          this.productModelsDatBase,
          this.stockDataBase,
          this.defaultCode[lang].default_model_code,
          this.defaultCode[lang].default_item_code
        )

        //show or hide the tab  
        this.checkNavPanelDisplay(this.productInfoDataDatBase)

        //get product description list
        this.navTabList_ = [];
        this.navTabList.forEach(d => {
          if (d.show) this.navTabList_.push({
            label: d.label,
            id: d.id
          })
        })

        this.activeNavIndex = 0;
        this.containerTitle = this.navTabList_[0].label[this.lang];

        //make color options and size options
        this.dataGenerator(lang, this.productModelsDatBase, this.productInfoDataDatBase);

        this.getQRCode(this.defaultCode[lang].default_model_code, lang)

      }, err => {

        this.bEmptyProductInfo = true;
        this.$router.push('/error');

      })

      var userReviewPromise = ProductApi.getUserReview(this.rfid, lang, country).then(res => {
        this.reviewsDataBase = res.data;
      }, err => {
        this.noUserView = true;
      })

      var stockPromise = ProductApi.getStock(this.rfid, undefined, lang, country).then(res => {
        this.stockDataBase = res.data;
      }, err => {
        this.noStock = true;
      })

      var pricePromise = ProductApi.getPrice(this.rfid, undefined, lang, country).then(res => {
        this.priceUnit = res.data.currency == "TWD" ? "NT$" : "$"
        this.priceDataBase = res.data;
      }, err => {
        this.noPrice = true;
      })

      Promise.all([productInfoPromise, pricePromise]).then(() => {
        if (this.bEmptyProductInfo || this.noPrice) return;

        let priceItems = Object.keys(this.priceDataBase);
        if ((this.navTabList_.length == 1) && (priceItems.length == 0)) this.$router.push("/error");

        if (this.defaultModelChanged) {
          //change modeCode only
          if (this.defaultCode.other.default_model_code && !this.defaultCode.other.default_item_code) {
            this.priceRange = this.getRangePrice(this.priceDataBase, this.defaultCode.other.default_model_code);
          }
          //change itemcode
          if (this.defaultCode.other.default_item_code) this.get_original_dicount_price(lang);
        } else {
          this.get_original_dicount_price(lang);
        }
        console.log(this.original_dicount_price_itemcode)
      })

      Promise.all([productInfoPromise, userReviewPromise]).then(() => {
        if (this.noUserView || this.bEmptyProductInfo) return;
        //reveiws of default product        
        let default_model_code = this.defaultCode.other.default_model_code ? this.defaultCode[lang].default_model_code : this.defaultCode.other.default_model_code;

        let reviewData = this.reviewsDataBase[default_model_code];

        //review_UI and product sorce
        var obj = this.makeUserReviewData(reviewData);
        this.productReviews = obj.productReviews;
        this.productScore = obj.productScore;
      })

      Promise.all([productInfoPromise, stockPromise]).then(() => {
        if (this.bEmptyProductInfo || this.noStock) return;
        this.addStockToInfo(this.stockDataBase);

        //update stock in label
        this.sizeSelected = getSizeSelected(this, lang);

      })


      function getDefaultCodeIndex(model, model_code, item_code) {
        //get default model_code and itemCode
        let defaultColorIndex = null,
          defaultSizeIndex = null;
        if (model.length) {
          model.forEach((d, i) => {
            if (d.ModelCode == model_code) {
              defaultColorIndex = i;
              d.items.every((d_, i_) => {
                if (d_.ItemCode == item_code) {
                  defaultSizeIndex = i_;
                  return false;
                }
                return true;
              })
            }
          })
        }
        return { defaultColorIndex, defaultSizeIndex }
      }

      function getSizeSelected(vm, lang) {
        let sizeSelected = null;
        //user select other color before stock returned
        let otherModelCode = vm.defaultCode.other.default_model_code,
          otherItemCode = vm.defaultCode.other.default_item_code;

        let default_model_code = vm.defaultCode[lang].default_model_code,
          default_item_code = vm.defaultCode[lang].default_item_code;

        if (vm.defaultModelChanged) {
          sizeSelected = { value: null, label: null, stock: null }
          //change modelcode or itemcode
          if (otherItemCode) {
            sizeSelected = vm.getSizeLabel(vm.productModelsDatBase, vm.stockDataBase, otherModelCode || default_model_code, otherItemCode)
          }
        } else {
          sizeSelected = vm.getSizeLabel(vm.productModelsDatBase, vm.stockDataBase, default_model_code, default_item_code)
        }
        return sizeSelected;
      }


    },
    addStockToInfo(stockDataBase) {
      this.productAllInfoByColor.forEach(info => {
        info.sizeOptions.forEach(size => {
          size.stock = stockDataBase[size.itemCode];
        })
      })
    },
    get_original_dicount_price(lang) {

      let otherItem_code = this.defaultCode.other.default_item_code;

      //otherItem_code: user choose another size item
      //default_item_code: default item code

      let defaultItemCode = !!otherItem_code ? otherItem_code : this.defaultCode[lang].default_item_code;

      let price = this.priceDataBase.items[defaultItemCode];

      if (!price) {
        this.bEmptyPrice = true;
      } else {
        this.bEmptyPrice = false;
        this.original_dicount_price_itemcode.itemCode = defaultItemCode;
        this.original_dicount_price_itemcode.price = this.calculateDiscount(price);
      }

    },
    getRangePrice(priceDataBase, modelCode) {
      let priceRange = {
        max: {
          int: "0",
          decimal: ".00"
        },
        min: {
          int: "0",
          decimal: ".00"
        }
      };
      if (Object.keys(priceDataBase).length) {
        let priceRangeData = priceDataBase.models[modelCode];

        if (!priceRangeData) {
          this.bEmptyPrice = true;
        } else {
          this.bEmptyPrice = false;

          if (priceRangeData.min && priceRangeData.max) {
            priceRange.min = this.divideFloat(priceRangeData.min);
            priceRange.max = this.divideFloat(priceRangeData.max);
          } else {
            priceRange.max = priceRange.min = this.divideFloat(priceRangeData.price);
          }
        }
      }
      return priceRange;
    },

    dataGenerator(lang, productModelsDatBase, productInfoData) {
      if (productModelsDatBase.length) {
        let model = this.makeProductInfoDataByColor(productModelsDatBase, this.defaultIndex[lang], lang);

        this.productAllInfoByColor = model.productAllInfoByColor;
        this.colorOptions = model.colorOptions;

        if (this.productAllInfoByColor.length) {

          this.size_image_colorName = this.productAllInfoByColor[this.defaultIndex[lang].defaultColorIndex];

          this.imageUrl = this.size_image_colorName.videosAndImages
          this.noImage = this.imageUrl.length ? false : true;

          this.defaultIndex.other = Object.assign({}, this.defaultIndex[lang]);
        }

      }
      //no model item
      if (this.colorOptions.length == 0) {
        let obj = {
          checked: false,
          colorName: "",
          imgUrl: "",
          index: 1,
          modelCode: ""
        }
        for (var i = 0; i < 3; i++) {
          this.colorOptions.push(obj);
        }
      }
    },

    get_size_review_description_options(lang) {

    },

    getSizeLabel(productModelsDatBase, stockDataBase, default_model_code, defaultItemCode) {
      let sizeSelected = {};

      if (Object.keys(stockDataBase).length > 0) {
        sizeSelected.stock = stockDataBase[defaultItemCode];
      } else {
        sizeSelected.stock = null;
      }

      productModelsDatBase.forEach(model => {
        if (model.ModelCode == default_model_code) {
          model.items.forEach(item => {
            if (item.ItemCode == defaultItemCode) {
              sizeSelected.value = item.SizeValueId;
              sizeSelected.label = item.SizeValueId;
            }
          })
        }
      })
      return sizeSelected;
    },

    getProductDescription(productInfoData) {



    },
    getQRCode(modelCode, lang) {
      let countru_QR = lang == "MY" ? "my" : "tw"
      ProductApi.getQrcode(modelCode, countru_QR).then(res => {
        this.QRCodeSrc = res.data;
        this.noQRCode = res.data ? false : true;
      }, err => {
        this.noQRCode = true;
      })
    },

    makeProductInfoDataByColor(data, defaultIndex, lang) {
      let productAllInfoByColor = [],
        colorOptions = [];

      data.forEach((d, modelsIndex) => {
        let videos = [],
          images = [],
          sizeOptions = [],
          productColorChecked = modelsIndex === defaultIndex.defaultColorIndex ? true : false;

        if (d.Videos && d.Videos.length) {
          d.Videos.forEach(d => {
            videos.push({ type: "vedio", url: d.link });
          })
        }

        if (d.Images && d.Images.length) {
          d.Images.forEach(d => {
            images.push({ type: "img", url: d.link });
          })
        }

        if (d.items && d.items.length) {
          d.items.forEach((d, itemIndex) => {
            sizeOptions.push({
              stock: null,
              index: itemIndex,
              itemCode: d.ItemCode,
              label: d.SizeValueId,
              value: d.SizeValueId
            })
          })
        }

        let colorName = d.BusinessColors[0].label;
        productAllInfoByColor.push({
          colorName: colorName,
          modelCode: d.ModelCode,
          videosAndImages: [...videos, ...images],
          sizeOptions: sizeOptions
        })

        colorOptions.push({
          index: modelsIndex,
          modelCode: d.ModelCode,
          colorName: colorName,
          imgUrl: (images[0] && images[0].url) || "NONE",
          alt: colorName,
          checked: productColorChecked,
        })
      });

      return {
        productAllInfoByColor,
        colorOptions
      }
    },
    makeUserReviewData(resData) {
      let score = 0,
        productScore = 0;

      if (resData && !!resData.length) {
        resData.forEach(d => {
          d.published_at = TimeUtil.getFullDate(new Date(d.published_at), 'yyyy-MM-dd')
          score += ~~d.note
        })

        productScore = +((score / resData.length).toFixed(2));

        return {
          productReviews: resData,
          productScore: productScore
        }
      } else {
        return {
          productReviews: [],
          productScore: 0
        }
      }
    },
    calculateDiscount(pricesObj) {
      let original = {
          int: "0",
          decimal: ".00"
        },
        discount = {
          int: "0",
          decimal: ".00",
        },
        off = 100;
      if (!!pricesObj) {
        let sale_price = pricesObj.sale_price + "";
        let strikeout_price = pricesObj.strikeout_price + "";
        // let strikeout_price = parseInt(Math.random()*800)+"";

        if (strikeout_price == "") {
          original = this.divideFloat(sale_price);
        } else {
          if (!!sale_price) {
            discount = this.divideFloat(sale_price)
          }

          if (!!strikeout_price) {

            original = this.divideFloat(strikeout_price);
            off = +(((+sale_price) * 100 / (+strikeout_price)).toFixed(0))
          }
        }
        return { original, discount, off }
      }
    },
    divideFloat(float) {
      let floatIndex = float.indexOf("."),
        dividedFloat = {};
      if (floatIndex >= 0) {
        dividedFloat.int = float.substr(0, floatIndex)
        dividedFloat.decimal = float.substr(floatIndex, float.length);
      } else {
        dividedFloat.int = float;
        dividedFloat.decimal = ".00";
      }
      return dividedFloat;
    },
    showNavTab(bShow, id) {
      this.navTabList.every(d => {
        if (d.id == id) {
          d.show = bShow;
          return false;
        }
        return true;
      })
    },
    checkNavPanelDisplay(productInfoData /*,reviewsDataBase*/ ) {
      let bTechInfo = !!(productInfoData.Functionalities && productInfoData.Functionalities.length),

        bProductConcept = !!productInfoData.MaintenanceAdv ||
        !!productInfoData.StorageAdv ||
        !!productInfoData.UsageRestriction,

        bBenefits = !!(productInfoData.Benefits && productInfoData.Benefits.length),

        bDesignedFor = !!productInfoData.DesignedFor || !!productInfoData.Catchline;
      // bUserView = !!(reviewsDataBase&&reviewsDataBase.length); 

      this.showNavTab(bDesignedFor, "DesignFor")
      this.showNavTab(bBenefits, "ProductBenefit")
      this.showNavTab(bProductConcept, "ProdConceptTech")
      this.showNavTab(bTechInfo, "TechInfo")
    }

  },
  components: {
    Carousel,
    Slide,
    ScrollNav,
    ScrollNavPanel,
    CustomSelect,
    Rate,
    popup
  },
  computed: {
    itemName() {
      return this.productInfoDataDatBase.WebLabel;
    },
    showOriginalPrice() {
      if (this.bEmptyPrice) return false;
      return (this.original_dicount_price_itemcode.price.off == 100 && this.original_dicount_price_itemcode.itemCode);
    },
    showDiscountPrice() {
      if (this.bEmptyPrice) return false;
      return (this.original_dicount_price_itemcode.price.off !== 100 && this.original_dicount_price_itemcode.itemCode);
    },
    showRangePrice() {
      if (this.bEmptyPrice) return false;
      let default_model_code = !!this.defaultCode.other.default_model_code ? this.defaultCode.other.default_model_code : this.defaultCode[this.lang].default_model_code;
      //user selected another color duration data was loading.

      if (this.defaultModelChanged && !this.defaultCode.other.default_item_code) {
        return true;
      } else {
        return !this.original_dicount_price_itemcode.itemCode && default_model_code;
      }
    },
    noProductDescription() {
      return this.navTabList_.length == 1;
    }
  },
  // watch:{
  //   bEmptyPrice(newV,oldV){
  //     console.log(newV)
  //   }
  // }

}
