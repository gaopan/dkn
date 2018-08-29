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
      labels: ProductConfig.pageInfoLabel
    }
  },
  watch: {
    productReviews: {
      handler() {
        this.$nextTick(() => {
          this.scroll.refresh();
          this.initBlocks();
        });
      }
    },
    productInfoDSM: {
      handler() {
        this.$nextTick(() => {
          this.scroll.refresh();
          this.initBlocks();
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
      click: false,
      probeType: 2,
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
      }
    }

    function calBlockToStick(y, directionY) {
      let theIndex = -1;
      this.blocks.every((block, index) => {
      	if (directionY == -1 && index > 0 && this.blocks[index -1].y - marginBottom < y && block.y - y > wrapperHeight / 5) {
          theIndex = index - 1;
          this.sticking = true;
          return false;
        }
        if (directionY == -1 && index > 0 && this.blocks[index -1].y - marginBottom < y && block.y - y > 0 && block.y - y < wrapperHeight / 5) {
          theIndex = index;
          this.sticking = true;
          return false;
        }
        if (directionY == 1 && y - block.y > wrapperHeight / 3 && y < block.y - marginBottom + block.height) {
          if (index < this.blocks.length - 1) {
            theIndex = index + 1;
            this.sticking = true;
            return false;
          } 
        }
        return true;
      });
      if (theIndex > -1 && theIndex != this.activeIndex) {
        this.activeIndex = theIndex;
      }
      if(this.sticking) {
      	this.scroll.scrollTo(0, -this.blocks[theIndex].y, 500, 'bounce');
      }
    }
  },
  methods: {
    toIndex(i) {
      this.activeIndex = i;
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

      this.blocks = [{
        y: 0,
        elem: designForElem,
        height: designForElem.clientHeight,
      }, {
        y: designForElem.clientHeight + marginBottom,
        elem: prodBenefitElem,
        height: prodBenefitElem.clientHeight
      }, {
        y: designForElem.clientHeight + prodBenefitElem.clientHeight + marginBottom * 2,
        elem: userReviewsElem,
        height: userReviewsElem.clientHeight
      }, {
        y: designForElem.clientHeight + prodBenefitElem.clientHeight + userReviewsElem.clientHeight + marginBottom * 3,
        elem: conceptTechElem,
        height: conceptTechElem.clientHeight
      }, {
        y: designForElem.clientHeight + prodBenefitElem.clientHeight + userReviewsElem.clientHeight + conceptTechElem.clientHeight + marginBottom * 4,
        elem: techInfoElem,
        height: techInfoElem.clientHeight
      }];
    }
  }

}
