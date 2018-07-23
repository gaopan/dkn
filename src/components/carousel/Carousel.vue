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
    
    <pagination v-if="paginationEnabled && slideCount > 0"
      @paginationclick="goToPage($event, 'pagination')"/>

  </section>
</template>
<script>
import autoplay from "./mixins/autoplay";
import debounce from "./utils/debounce";
import Pagination from "./Pagination.vue";
import Slide from "./Slide.vue";


export default {
  name: "carousel",
  beforeUpdate() {
    this.computeCarouselHeight();
  },
  components: {
    Pagination,
    Slide
  },
  data() {
    return {
      browserWidth: null,
      carouselHeight: 0,
      currentPage: 0,
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
  mixins: [autoplay],
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
    //Slide transition easing,Any valid CSS transition easing accepted
    easing: {
      type: String,
      default: "ease"
    },
    //Minimum distance for the swipe to trigger a slide advance
    minSwipeDistance: {
      type: Number,
      default: 8
    },

    //Flag to toggle mouse dragging
    mouseDrag: {
      type: Boolean,
      default: true
    },

    paginationEnabled: {
      type: Boolean,
      default: true
    },

    paginationPadding: {
      type: Number,
      default: 10
    },
    /**
     * Resistance coefficient to dragging on the edge of the carousel
     * This dictates the effect of the pull as you move towards the boundaries
     */
    resistanceCoef: {
      type: Number,
      default: 20
    },
    //Slide transition speed ,Number of milliseconds accepted
    speed: {
      type: Number,
      default: 500
    },
    //Flag to make the carousel loop around when it reaches the end
    loop: {
      type: Boolean,
      default: false
    },
    //Listen for an external navigation request using this prop.
    navigateTo: {
      type: Number,
      default: 0
    },
    //Space padding option adds left and right padding style (in pixels) onto carousel-inner.
    spacePadding: {
      type: Number,
      default: 0
    }
  },

  watch: {
    navigateTo: {
      immediate: true,
      handler(val) {
        if (val !== this.currentPage) {
          this.$nextTick(() => {
            this.goToPage(val);
          });
        }
      }
    },
    currentPage(val) {
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
    },
    transitionStyle() {
      return `${this.speed / 1000}s ${this.easing} transform`;
    },
    padding() {
      const padding = this.spacePadding;
      return padding > 0 ? padding : false;
    }
  },
  methods: {

    getNextPage() {
      if (this.currentPage < this.slideCount - 1)return this.currentPage + 1;      
      return this.loop ? 0 : this.currentPage;
    },
    /**
     * @return {Number} The index of the previous page
     * */
    getPreviousPage() {
      if (this.currentPage > 0) return this.currentPage - 1;
      return this.loop ? this.slideCount - 1 : this.currentPage;
    },
    /**
     * Increase/decrease the current page value
     * @param  {String} direction (Optional) The direction to advance
     */
    advancePage(direction) {
      if (direction && direction === "backward") {
        this.goToPage(this.getPreviousPage(), "navigation");
      } else if (!direction || (direction && direction !== "backward")) {
        this.goToPage(this.getNextPage(), "navigation");
      }
    },
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
      this.carouselHeight = this.carouselHeight;
      return this.carouselHeight;
    },
    //Filter slot contents to slide instances and return length
    getSlideCount() {
      if(this.$slots && this.$slots.default){
        this.slideCount = this.$slots.default.filter(slot => slot.tag && slot.tag.indexOf("slide") > -1 ).length;
      }else{
        this.slideCount = 0;
      }
    },

    goToPage(page) {
      if (page >= 0 && page <= this.slideCount) {

        this.offset =  Math.min(this.carouselHeight * page, this.maxOffset)
        // restart autoplay if specified
        if (this.autoplay && !this.autoplayHoverPause) {
          this.restartAutoplay();
        }

        // update the current page
        this.currentPage = page;
      }
    },

    onStart(e) {
      let moveEvent = this.isTouch ? "touchmove" : "mousemove", 
          upEvent = this.isTouch ? "touchend" : "mouseup";
      document.addEventListener(moveEvent,this.onDrag,true);
      document.addEventListener(upEvent,this.onEnd,true);

      this.startTime = e.timeStamp;
      this.dragging = true;

      if(this.isTouch){
        this.dragStartX = e.touches[0].clientX;
        this.dragStartY = e.touches[0].clientY;        
      }else{
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;
      }  
    },

    onDrag(e) {
      let eventPosY,eventPosX;

      if(this.isTouch){
        eventPosX = e.touches[0].clientX;
        eventPosY = e.touches[0].clientY;        
      }else{
        eventPosX = e.clientX;
        eventPosY = e.clientY;
      }   

      let newOffsetX = this.dragStartX - eventPosX,
          newOffsetY = this.dragStartY - eventPosY;

      // if it is a touch device, check if we are below the min swipe threshold
      // (if user scroll the page on the component)
      if (this.isTouch && Math.abs(newOffsetY) < Math.abs(newOffsetX)) {
        return;
      }

      e.stopImmediatePropagation();

      this.dragOffset = newOffsetY;
      const nextOffset = this.offset + newOffsetY;

      if (nextOffset < 0) {
        this.dragOffset = -Math.sqrt(-this.resistanceCoef * this.dragOffset);
      } else if (nextOffset > this.maxOffset) {
        this.dragOffset = Math.sqrt(this.resistanceCoef * this.dragOffset);
      }
    },

    onEnd(e) {

      const eventPosY = this.isTouch ? e.changedTouches[0].clientY : e.clientY,
            deltaY = this.dragStartY - eventPosY;

      this.dragMomentum = deltaY / (e.timeStamp - this.startTime);

      // take care of the minSwipt eDistance prop, if not 0 and delta is bigger than delta
      if (this.minSwipeDistance !== 0 && Math.abs(deltaY) >= this.minSwipeDistance) {
        this.dragOffset = this.dragOffset + Math.sign(deltaY) * (this.carouselHeight / 2);
      }

      this.offset += this.dragOffset;
      this.dragOffset = 0;
      this.dragging = false;

      this.render();

      // clear events listeners
      let moveEvent = this.isTouch ? "touchmove" : "mousemove", 
          upEvent = this.isTouch ? "touchend" : "mouseup";
      document.removeEventListener(upEvent,this.onEnd,true);
      document.removeEventListener(moveEvent,this.onDrag,true);
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
      this.currentPage = Math.round(this.offset / this.carouselHeight);

    },

    computeCarouselHeight() {
      this.getSlideCount();
      this.getBrowserWidth();
      this.getCarouselHeight();
    },

  },
  mounted() {
    
    window.addEventListener("resize",debounce(this.onResize, this.refreshRate));
    // setup the start event only if touch device or mousedrag activated
    if (this.isTouch || this.mouseDrag) {
      let event  = this.isTouch ? "touchstart" : "mousedown";
      this.$refs["carousel-wrapper"].addEventListener(event,this.onStart);
    }

    // this.attachMutationObserver();
    this.computeCarouselHeight();

  },
  beforeDestroy() {
    let event = this.isTouch ? "touchstart" : "mousedown";
    this.detachMutationObserver();
    window.removeEventListener("resize", this.getBrowserWidth);
    this.$refs["carousel-wrapper"].removeEventListener(event,this.onStart);
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
