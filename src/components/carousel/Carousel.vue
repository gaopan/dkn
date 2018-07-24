<template>
  <section class="carousel">
    <div class="carousel-wrapper" ref="carousel-wrapper">

      <div ref="carousel-inner" class="carousel-inner" role="listbox"
        :style="{
          'transform': `translate(0,${currentOffset/50}rem)`,
          'transition': dragging ? 'none' : transitionStyle,         
          'visibility': carouselHeight ? 'visible' : 'hidden',
        }">
        <slot></slot>
      </div> 
    </div>
    
    <pagination v-if="slideCount > 0" @paginationclick="goToPage" :activetPage = "navigateTo"/>

  </section>
</template>
<script>
import debounce from "./utils/debounce";
import Pagination from "./Pagination.vue";
import Slide from "./Slide.vue";


export default {
  name: "carousel",
  // beforeUpdate() {
  //   this.computeCarouselHeight();
  // },
  components: {
    Pagination,
    Slide
  },
  data() {
    return {
      transitionStyle:null,
      browserWidth: null,
      carouselHeight: 0,
      currentPage: 1,
      dragging: false,
      dragMomentum: 0,
      dragOffset: 0,
      dragStartY: 0,
      dragStartX: 0,
      isTouch: typeof window !== "undefined" && "ontouchstart" in window,
      offset: 0,
      refreshRate: 16,
      slideCount: 0,
      transitionstart: "transitionstart",
      transitionend: "transitionend"
    };
  },
  // use `provide` to avoid `Slide` being nested with other components
  provide() {
    return {
      carousel: this
    };
  },
  props: {
    imageUrl:{
      type:Array
    },
    //Minimum distance for the swipe to trigger a slide advance
    minSwipeDistance: {
      type: Number,
      default: 8
    },

    //Flag to make the carousel loop around when it reaches the end
    loop: {
      type: Boolean,
      default: false
    },
    //Listen for an external navigation request using this prop.
    navigateTo: {
      type: Number,
      validator(val){
        return val > 0;
      }
    }
  },

  watch: {
    navigateTo: {
      // immediate: true,
      handler(val,oldV) {
        if (val !== this.currentPage) {
          this.$nextTick(() => {
            this.transitionStyle =  `0s ease transform`;
            this.goToPage(val);
            this.transitionStyle =  `0.4s ease transform`;
          });
        }
      }
    },
    currentPage(val,oldV) {
      this.$emit("pageChange", val);
    }
  },

  computed: {
    // The vertical distance the inner wrapper is offset while navigating.
    currentOffset() {
      return (this.offset + this.dragOffset) * -1;
    },

    maxOffset() {
      return this.carouselHeight * (this.slideCount - 1);
    }
  },
  methods: {
    /**
     * A mutation observer is used to detect changes to the containing node
     * in order to keep the magnet container in sync with the height its reference node.
     */
    attachMutationObserver() {
      const MutationObserver =
        window.MutationObserver ||
        window.WebKitMutationObserver ||
        window.MozMutationObserver;

      if (MutationObserver) {

        const config = { attributes: true, data: true };

        this.mutationObserver = new MutationObserver(() => {
          this.$nextTick(() => {
            this.computeCarouselHeight();
          });
        });

        if (this.$parent.$el) {
          let carouselInnerElements = this.$el.getElementsByClassName("carousel-inner");

          for (let i = 0; i < carouselInnerElements.length; i++) {
            this.mutationObserver.observe(carouselInnerElements[i], config);
          }
        }
      }
    },
    /**
     * Stop listening to mutation changes
     */
    detachMutationObserver() {
      if (this.mutationObserver) {
        this.mutationObserver.disconnect();
      }
    },
    //Get the current browser viewport width
    getBrowserWidth() {
      this.browserWidth = window.innerWidth;
      return this.browserWidth;
    },
    //Get the width of the carousel DOM element
    getCarouselHeight() {
      let carouselInnerElements = this.$el.getElementsByClassName("carousel-inner");
      for (let i = 0; i < carouselInnerElements.length; i++) {
        let eleClientHeight = carouselInnerElements[i].clientHeight;
        if (eleClientHeight > 0) {
          this.carouselHeight = eleClientHeight || 0;
        }
      }
      // this.carouselHeight = this.carouselHeight;
      return this.carouselHeight;
    },
    //Filter slot contents to slide instances and return length
    getSlideCount() {
      setTimeout(()=>{
        let slots = this.$slots;
        if(slots && slots.default){
          this.slideCount = slots.default.filter(slot => slot.tag && slot.tag.indexOf("slide") > -1 ).length;
        }else{
          this.slideCount = 0;
        }
      },0)
    },

    goToPage(page) {
      if (page >= 1 && page <= this.slideCount) {
        this.offset =  Math.min(this.carouselHeight * (page-1), this.maxOffset)
        this.currentPage = page;
      }
    },
    onResize() {
      this.computeCarouselHeight();

      this.dragging = true; // force a dragging to disable animation
      this.render();
      // clear dragging after refresh rate
      setTimeout( () => { this.dragging = false }, this.refreshRate );
    },
    render() {
      // add extra slides depending on the momemtum speed
      let min = Math.round(this.dragMomentum);
      this.offset += min * this.carouselHeight;

      // & snap the new offset on a slide or page if scrollPerPage
      const height = this.carouselHeight;
      this.offset = height * Math.round(this.offset / height);

      // clamp the offset between 0 -> maxOffset
      this.offset = Math.max(0, Math.min(this.offset, this.maxOffset));

      // update the current page
      this.currentPage = Math.round(this.offset / this.carouselHeight) +1;
    },

    computeCarouselHeight() {
      this.getSlideCount();
      this.getBrowserWidth();
      this.getCarouselHeight();
    },

  },
  mounted() {
    window.addEventListener("resize",debounce(this.onResize, this.refreshRate));

    // this.attachMutationObserver();
    this.$nextTick(() => {
      this.computeCarouselHeight();
    });

    this.transitionStyle =  `0.4s ease transform`;
    if(typeof this.$props.navigateTo == "number"){
      this.offset =  Math.min(this.carouselHeight * (this.$props.navigateTo-1), this.maxOffset)
    }
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.getBrowserWidth);
  }
};
</script>
<style>
.carousel {
  position: relative;
  height: 100%;
}

.carousel-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;  
}

.micro-carousel-wrapper {
    position: absolute;
    top: .24rem;
    left: .24rem;
}

.carousel-inner {
  height: 100%;
}

.micro-carousel-wrapper .micro-carousel-inner {
    width: .8rem;
    height: .8rem;
    display: inline-block;
}
.micro-carousel-wrapper div + div {
  margin-left: .12rem;
}
</style>
