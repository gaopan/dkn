import BScroll from 'better-scroll'
import Rate from "@/components/rate/Rate.vue"
import ProductConfig from '../../product.config.js'

export default {
  name: 'product-scroller',
  props: {
    productInfoDSM: {
      type: Object,
      required: true
    },
    productReviews: {
      type: Array,
      required: true
    },
    lang: {
      type: String
    },
    productScore: {
      type: Number
    },
    navList: {
      type: Array
    }
  },
  components: { Rate },
  data() {
    return {
      activeIndex: 0,
      labels: ProductConfig.pageInfoLabel,
      bDesignFor: true,
      bProductBenefit: true,
      bUserReviews: true,
      bProdConceptTech: true,
      bTechInfo: true
    }
  },
  watch: {
    productReviews: {
      handler() {
        this.$nextTick(() => {
          this.scroll.refresh();
          this.initBlocks();
          this.scroll.scrollTo(0, -this.blocks[this.activeIndex].y, 0, 'bounce');
        });
      }
    },
    productInfoDSM: {
      handler() {
        this.$nextTick(() => {
          this.scroll.refresh();
          this.initBlocks();
          this.scroll.scrollTo(0, -this.blocks[this.activeIndex].y, 0, 'bounce');
        });
      }
    }
  },
  mounted() {
    let marginBottom = 20,
      paddingBottom = 100;
    let wrapperHeight = this.$refs.wrapper.clientHeight;

    this.initBlocks();

    this.scroll = new BScroll(this.$refs.wrapper, {
      scrollY: true,
      click: true,
      probeType: 2,
      momentum: false,
      bounce: {
        top: true,
        bottom: true,
        left: false,
        right: false,
        bounceTime: 800
      }
    });

    this.scroll.on("scroll", (pos) => {
      calCurrentBlock.call(this, -pos.y);
    });

    this.scroll.on("scrollEnd", (pos) => {
      if (this.sticking) {
        this.sticking = false;
        return;
      }
      calBlockToStick.call(this, -pos.y, this.scroll.directionY);
    });

    function calCurrentBlock(y) {
      let theIndex = -1;
      this.blocks.every((block, index) => {
        if (block.y - marginBottom < y && y < block.y - marginBottom + block.height) {
          theIndex = index;
          return false;
        }
        return true;
      });
      if (theIndex > -1 && theIndex != this.activeIndex) {
        this.activeIndex = theIndex;
        this.$emit("tab-index-update", theIndex)
      }
    }

    function calBlockToStick(y, directionY) {
      let theIndex = -1,
        stickingBottom = false;
      this.blocks.every((block, index) => {
        if (directionY == -1 && index > 0 && this.blocks[index - 1].y - marginBottom < y && block.y - y > wrapperHeight / 5) {
          theIndex = index - 1;
          this.sticking = true;
          return false;
        }
        if (directionY == -1 && index > 0 && this.blocks[index - 1].y - marginBottom < y && block.y - y > 0 && block.y - y < wrapperHeight / 5) {
          theIndex = index;
          this.sticking = true;
          return false;
        }
        if (directionY == 1 && block.height == wrapperHeight) {
          if (y - block.y > paddingBottom && y < block.y - marginBottom + block.height && index < this.blocks.length - 1) {
            theIndex = index + 1;
            this.sticking = true;
            return false;
          }
          if (y - block.y < paddingBottom && y - block.y > 0) {
            theIndex = index;
            this.sticking = true;
            return false;
          }
        }
        if (directionY == 1 && block.height > wrapperHeight) {
          if (y - block.y > block.height - wrapperHeight + paddingBottom && y < block.y - marginBottom + block.height && index < this.blocks.length - 1) {
            theIndex = index + 1;
            this.sticking = true;
            return false;
          }
          if (y - block.y > block.height - wrapperHeight && y - block.y < block.height - wrapperHeight + paddingBottom) {
            this.sticking = true;
            stickingBottom = true;
            theIndex = index;
          }
        }
        return true;
      });
      if (theIndex > -1 && theIndex != this.activeIndex) {
        this.activeIndex = theIndex;
        this.$emit("tab-index-update", theIndex)
      }
      if (this.sticking) {
        if (stickingBottom) {
          this.scroll.scrollTo(0, -(this.blocks[theIndex].y + this.blocks[theIndex].height - wrapperHeight), 500, 'bounce');
        } else {
          this.scroll.scrollTo(0, -this.blocks[theIndex].y, 500, 'bounce');
        }
      }
    }
  },
  created() {
    let contentId = [];
    this.navList.forEach(d => {
      contentId.push(d.id);
    })

    this.bDesignFor = includes(contentId, "DesignFor") ? true : false;
    this.bProductBenefit = includes(contentId, "ProductBenefit") ? true : false;
    this.bUserReviews = includes(contentId, "UserReviews") ? true : false;
    this.bProdConceptTech = includes(contentId, "ProdConceptTech") ? true : false;
    this.bTechInfo = includes(contentId, "TechInfo") ? true : false;

    function includes(list, item) {
      let res = false;
      for (let i = 0; i < list.length; i++) {
        let theItem = list[i];
        if (theItem == item) {
          res = true;
          break;
        }
      }
      return res;
    }

  },
  methods: {
    toIndex(i) {
      this.activeIndex = i;
      this.$emit("tab-index-update", i)
      this.scroll.scrollTo(0, -this.blocks[i].y, 500, 'bounce');
    },
    initBlocks() {
      let designForElem = this.$refs.DesignForBlock,
        prodBenefitElem = this.$refs.ProdBenefitBlock,
        userReviewsElem = this.$refs.UserReviewsBlock,
        conceptTechElem = this.$refs.ConceptTechBlock,
        techInfoElem = this.$refs.TechInfoBlock;
      let marginBottom = 20,
        paddingBottom = 100;

      this.displayAdaptor = [{
        element: designForElem,
        show: this.bDesignFor,
        id: "DesignFor"
      }, {
        element: prodBenefitElem,
        show: this.bProductBenefit,
        id: "ProductBenefit"
      }, {
        element: userReviewsElem,
        show: this.bUserReviews,
        id: "UserReviews"
      }, {
        element: conceptTechElem,
        show: this.bProdConceptTech,
        id: "ProdConceptTech"
      }, {
        element: techInfoElem,
        show: this.bTechInfo,
        id: "TechInfo"
      }]

      let displayedElement = filter(this.displayAdaptor, function(item){
      	return item.show;
      });

      this.blocks = [];
      displayedElement.forEach((d, i) => {
        if (i === 0) {
          this.blocks.push({
            y: 0,
            elem: d.element,
            height: d.element.clientHeight,
            id: d.id
          })
        } else {
          let y = 0;
          displayedElement.forEach((d_, i_) => {
            if (i_ < i) {
              y += d_.element.clientHeight;
            }
          })
          y += marginBottom * i /* + paddingBottom*i*/ ;

          this.blocks.push({
            y: y,
            elem: d.element,
            height: d.element.clientHeight,
            id: d.id
          })

        }
      })

      function filter(list, fnCheck){
      	let res = [];
      	for(let i = 0; i< list.length; i++) {
      		let item = list[i];
      		if(fnCheck(item)) {
      			res.push(item);
      		}
      	}
      	return res;
      }
    }
  }

}
