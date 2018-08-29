import ProductConfig from '../product.config.js'
import ProductApi from "@/api/modules/product/productInfo.js"

import { Carousel, Slide } from "@/components/carousel"
import CustomSelect from "@/components/custom-select"

export default {
  name: 'product-details',
  props: {
    productInfo: {
      type: Object,
      required: true
    },
    priceInfo: {
      type: Object
    },
    stockInfo: {
      type: Object
    },
    noPriceInfo: {
      type: Boolean
    },
    noStockInfo: {
      type: Boolean
    },
    lang: {
      type: String
    },
    country: {
      type: String
    },
    storeId: {
      type: Number
    }
  },
  components: { Carousel, Slide, CustomSelect },
  data() {
    return {
      labels: ProductConfig.pageInfoLabel,
      productInfoDataDatBase: {},
      productInfoDataDatBase: {},
      defaultCode: {
        other: {
          default_item_code: null,
          default_model_code: null
        }
      },
      noQRCode: true,
      QRCodeSrc: null,
      priceUnit: null,
      originalDicountPriceItemcode: {
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
      sizeSelected: {
        label: null,
        stock: null,
        value: null
      },
      size_image_colorName: {
        colorName: null,
        videosAndImages: [],
        sizeOptions: []
      },
      bEmptyPrice: true,
      bShowShadow: false,
      bShowQRCode: false,
      colorOptions: [],
      noImage: false,
      navigateToPhoto: 1,
      imageUrl: [],
      fieldELeQueried:{},
      monitorMousemove : {
        carouselClicked: false,
        carouselTime: 0,
        scrollNavMousewheel: false,
        scrollTarget: null,
        scrollNavTime: 0,
      },
      itemName:null,  
    };
  },
  watch: {
    stockInfo: {
      handler(val) {
        if (val) {
          this.onStockInfoReady();
        }
      }
    },
    priceInfo: {
      handler(val) {
        if (val) {
          this.onPriceInfoReady();
        }
      }
    },
    //emit itemCode to product-descrition.js
    "originalDicountPriceItemcode.itemCode":{
      handler(newV,oldV){
        this.$emit("change-item",newV)
      }
    }
  },
  created() {
    if (this.productInfo.dsm) this.productInfoDataDatBase = this.productInfo.dsm;
    if (this.productInfo.models) this.productModelsDatBase = this.productInfo.models;
    
    this.itemName = this.productInfoDataDatBase.WebLabel;
    this.defaultCode[this.lang] = findDefaultCode(this.productInfo.default_model_code, this.productInfo.default_item_code, this.productModelsDatBase);
    this.originalDicountPriceItemcode.itemCode = this.defaultCode[this.lang].default_item_code;

    this.$emit('changed-model', this.defaultCode[this.lang].default_model_code);

    this.getQRCode(this.defaultCode[this.lang].default_model_code, this.lang);

    dataGenerator.call(this, this.lang, this.productModelsDatBase, this.productInfoDataDatBase);

    if (this.stockInfo) {
      this.onStockInfoReady();
    }

    if (this.priceInfo) {
      this.onPriceInfoReady();
    }

    function makeProductInfoDataByColor(data, defaultModelCode, lang) {
      let productAllInfoByColor = [],
        colorOptions = [];

      data.forEach((d, modelsIndex) => {
        let videos = [],
          images = [],
          sizeOptions = [],
          productColorChecked = d.ModelCode === defaultModelCode ? true : false;

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

        let colorName = "";
        if (d.BusinessColors && d.BusinessColors[0]) {
          colorName = d.BusinessColors[0].label;
        }

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
    }

    function dataGenerator(lang, productModelsDatBase, productInfoData) {
      if (productModelsDatBase.length) {
        let model = makeProductInfoDataByColor(productModelsDatBase, this.defaultCode[lang].default_model_code, lang);

        this.productAllInfoByColor = model.productAllInfoByColor;
        this.colorOptions = model.colorOptions;

        if (this.productAllInfoByColor.length) {
          this.productAllInfoByColor.every((info, infoIndex) => {
            if (info.modelCode == this.defaultCode[lang].default_model_code) {
              this.size_image_colorName = info;
              return false;
            }
            return true;
          })
          this.imageUrl = this.size_image_colorName.videosAndImages;
          this.noImage = this.imageUrl.length ? false : true;
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
    }

    function findDefaultCode(model_code, item_code, modelsDatBase) {
      let default_item_code, default_model_code;
      if (modelsDatBase.length) {
        modelsDatBase.every((model, modelIndex) => {
          if (model.ModelCode == model_code) {
            default_model_code = model.ModelCode;
            model.items.every(item => {
              if (item.ItemCode == item_code) {
                default_item_code = item_code;
                return false;
              }
              return true;
            })
            return false
          }
          return true;
        })
        if (typeof default_model_code == "undefined") {
          modelsDatBase.every((model, modelIndex) => {
            if (model.ModelCode) {
              default_model_code = model.ModelCode;
              return false;
            }
            return true;
          })
        }
        if (typeof default_item_code == "undefined") {
          modelsDatBase.every((model, modelIndex) => {
            if (model.ModelCode == default_model_code) {
              model.items.every(item => {
                if (item.ItemCode) {
                  default_item_code = item.ItemCode;
                  return false;
                }
                return true;
              })
              return false;
            }
            return true;
          })
        }
      }
      return { default_item_code, default_model_code }
    }
  },
  mounted(){
    this.$nextTick(()=>{
      let doc = document;

      let leaveEvent = this.isTouch ? "touchend" : "mouseleave", 
          downEvent = this.isTouch ? "touchstart" : "mousedown";

      window.addEventListener("resize", this.monitorUserAction)

      this.fieldELeQueried.carouselPagination = doc.querySelector("#carouselPagination");
      this.fieldELeQueried.CarouselWrapper = doc.querySelector("#CarouselWrapper");

      if (this.fieldELeQueried.carouselPagination) this.fieldELeQueried.carouselPagination.addEventListener("click", this.paginationMonitorClick);
     
      if (this.fieldELeQueried.CarouselWrapper) {
        this.fieldELeQueried.CarouselWrapper.addEventListener(leaveEvent, this.carouselMonitorMouseout);
        this.fieldELeQueried.CarouselWrapper.addEventListener(downEvent, this.carouselMonitorMousedown);
      }


    })
  },
  beforeDestroy(){
    if (this.fieldELeQueried.carouselPagination) this.fieldELeQueried.carouselPagination.removeEventListener("click", this.paginationMonitorClick);

    let leaveEvent = this.isTouch ? "touchend" : "mouseleave", 
        downEvent = this.isTouch ? "touchstart" : "mousedown";

    if (this.fieldELeQueried.CarouselWrapper) {
      this.fieldELeQueried.CarouselWrapper.removeEventListener(leaveEvent, this.carouselMonitorMouseout);
      this.fieldELeQueried.CarouselWrapper.removeEventListener(downEvent, this.carouselMonitorMousedown);
    }

  },
  computed: {
    showOriginalPrice() {
      if (this.bEmptyPrice) return false;
      return (this.originalDicountPriceItemcode.price.off == 100 && this.originalDicountPriceItemcode.itemCode);
    },
    showDiscountPrice() {
      if (this.bEmptyPrice) return false;
      return (this.originalDicountPriceItemcode.price.off !== 100 && this.originalDicountPriceItemcode.itemCode);
    },
    showRangePrice() {
      if (this.bEmptyPrice) return false;
      let default_model_code = !!this.defaultCode.other.default_model_code ? this.defaultCode.other.default_model_code : this.defaultCode[this.lang].default_model_code;
      //user selected another color duration data was loading.

      if (this.defaultModelChanged && !this.defaultCode.other.default_item_code) {
        return true;
      } else {
        return !this.originalDicountPriceItemcode.itemCode && default_model_code;
      }
    }
  },
  methods: {
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
    getQRCode(modelCode, lang) {
      let countru_QR = lang == "MY" ? "my" : "tw"
      ProductApi.getQrcode(modelCode, countru_QR).then(res => {
        this.QRCodeSrc = res.data;
        this.noQRCode = res.data ? false : true;
      }, err => {
        this.noQRCode = true;
      })
    },
    pageChange(args) {
      this.navigateToPhoto = args;
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
    selectProductColor(color, colorIndex) {
      if (color.checked || color.imgUrl == '') return;

      this.$emit('changed-model', color.modelCode);

      this.defaultModelChanged = true;

      this.colorOptions.forEach(d => { d.checked = false; })
      color.checked = true;

      this.defaultCode.other.default_item_code = null;
      this.originalDicountPriceItemcode.itemCode = null;

      this.defaultCode.other.default_model_code = color.modelCode;

      //user select color item while data was loading
      this.bEmptyPrice = false;

      this.priceRange = this.getRangePrice(this.priceInfo, color.modelCode);

      this.QRCodeSrc = null;

      this.sizeSelected = { label: null, value: null, stock: null }

      this.navigateToPhoto = 1;

      this.productAllInfoByColor.every((d, modelsIndex) => {
        if (d.modelCode == color.modelCode) {

          this.size_image_colorName = Object.assign({}, d);
          this.imageUrl = this.size_image_colorName.videosAndImages;
          this.noImage = this.imageUrl.length ? false : true;

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
    getRangePrice(priceInfo, modelCode) {
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
      if (Object.keys(priceInfo).length) {
        let priceRangeData = priceInfo.models[modelCode];

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
    selectProductSize(args) {
      if (args.value == this.sizeSelected.value) return;
      this.defaultModelChanged = true;
      // this.defaultIndex.other.defaultSizeIndex = args.index;

      this.sizeSelected = Object.assign({}, { value: args.value, label: args.label, stock: args.stock });

      this.defaultCode.other.default_item_code = args.itemCode;
      this.originalDicountPriceItemcode.itemCode = args.itemCode;

      //prevent before price returned
      if (Object.keys(this.priceInfo).length) {
        let price = this.priceInfo.items[args.itemCode];

        if (!price) {
          this.bEmptyPrice = true;
        } else {
          this.bEmptyPrice = false;
          this.originalDicountPriceItemcode.price = this.calculateDiscount(price);
        }
      }
    },
    showSizeMenu(args) {
      this.bShowShadow = args;
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
    onPriceInfoReady() {
      this.priceUnit = this.priceInfo.currency == "TWD" ? "NT$" : "$";
      let priceItems = Object.keys(this.priceInfo);
      if (priceItems.length == 0) this.$router.push("/error");

      if (this.defaultModelChanged) {
        //change modeCode only
        if (this.defaultCode.other.default_model_code && !this.defaultCode.other.default_item_code) {
          this.priceRange = this.getRangePrice(this.priceInfo, this.defaultCode.other.default_model_code);
        }
        //change itemcode
        if (this.defaultCode.other.default_item_code) getOriginalDicountPrice.call(this, this.lang);
      } else {
        getOriginalDicountPrice.call(this, this.lang);
      }

      function getOriginalDicountPrice(lang) {

        let otherItem_code = this.defaultCode.other.default_item_code;

        let defaultItemCode = !!otherItem_code ? otherItem_code : this.defaultCode[lang].default_item_code;

        let price = this.priceInfo.items[defaultItemCode];

        if (!price) {
          this.bEmptyPrice = true;
        } else {
          this.bEmptyPrice = false;
          this.originalDicountPriceItemcode.price = this.calculateDiscount(price);
        }

      }
    },
    onStockInfoReady() {
      this.sizeSelected = this.getSizeLabel(
        this.productModelsDatBase,
        this.stockInfo,
        this.defaultCode[this.lang].default_model_code,
        this.defaultCode[this.lang].default_item_code
      );

      this.productAllInfoByColor.forEach(info => {
        info.sizeOptions.forEach(size => {
          let stock = this.stockInfo[size.itemCode];
          size.stock = typeof stock == "number" ? stock : 0;
        })
      })
    },
    monitorClickColorQRSelect(field) {
      let data = {
        item_code: this.originalDicountPriceItemcode.itemCode,
        item_name: this.itemName,
        area: "ConversionZone",
        field: field,
        event: 1,
        store_id: this.$props.storeId,
        stay_time: 0
      }

      ProductApi.postTracking(data);
    },
    paginationMonitorClick(event) {
      event = event || window.event;

      let doc = document;
      if (event.target == doc.querySelector("#iconDown") || event.target == doc.querySelector("#iconUp")) {
        let data = {
          item_code: this.originalDicountPriceItemcode.itemCode,
          item_name: this.itemName,
          area: "ConversionZone",
          field: "Moreviews",
          event: 1,
          store_id: this.$props.storeId,
          stay_time: 0
        }

        ProductApi.postTracking(data);
      }
    },
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
          item_code: this.originalDicountPriceItemcode.itemCode,
          item_name: this.itemName,
          area: "ConversionZone",
          field: "MainPicBlock",
          event: 2,
          store_id: this.$props.storeId,
          stay_time: stayTime
        }

        // console.log("carousel mouse out", data)
        ProductApi.postTracking(data)

        this.monitorMousemove.carouselTime = Date.now();

      }
    },
  
          
  }
}
