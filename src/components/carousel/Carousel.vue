<template>
  <section class="carousel">
    <div class="carousel-wrapper" id = "CarouselWrapper" ref="carouselWrapper">
      <div class="no-carousel-image" v-if = "noImage">
        No images found
      </div>
      <div 
        ref="carousel-inner" 
        class="carousel-inner" 
        role="listbox"
        :style="{
          'transform': `translate(0,${currentOffset}px)`,
          'transition': dragging ? 'none' : transitionStyle,         
          'visibility': carouselHeight ? 'visible' : 'hidden',
        }">
        <slot></slot>
      </div> 
    </div>


    <pagination @paginationclick="goToPage" :activetPage = "navigateTo"/>
    <!-- <pagination @paginationclick="goToPage" :activetPage = "navigateTo"/> -->

  </section>
</template>
<script>
import debounce from "@/utils/debounce";
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
      refreshRate: 100,
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
    noImage:Boolean,
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
    },
    imageUrl(newV,oldV){
      this.slideCount = newV.length;
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
      return this.carouselHeight;
    },

    goToPage(page) {
      if (page >= 1 && page <= this.slideCount) {
        this.offset =  Math.min(this.carouselHeight * (page-1), this.maxOffset)
        this.currentPage = page;
      }
    },
    onStart(e) {
      let moveEvent = this.isTouch ? "touchmove" : "mousemove", 
          upEvent = this.isTouch ? "touchend" : "mouseup";
      this.$refs["carouselWrapper"].addEventListener(moveEvent,this.onDrag,true);
      this.$refs["carouselWrapper"].addEventListener(upEvent,this.onEnd,true);

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
      if (this.isTouch && Math.abs(newOffsetY) < Math.abs(newOffsetX))return;

      //prevent to move up the first and move down the last piture
      let imageUrlLen = this.$props.imageUrl.length;
      if(imageUrlLen > 0){
        if((this.currentPage == imageUrlLen && newOffsetY > 0) || (this.currentPage == 1&& newOffsetY < 0)){
          let upEvent = this.isTouch ? "touchend" : "mouseup",
              moveEvent = this.isTouch ? "touchmove" : "mousemove";
          this.$refs["carouselWrapper"].removeEventListener(moveEvent,this.onDrag,true);
          this.$refs["carouselWrapper"].removeEventListener(upEvent,this.onEnd,true);
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
      }else{
        return;
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
      this.$refs["carouselWrapper"].removeEventListener(upEvent,this.onEnd,true);
      this.$refs["carouselWrapper"].removeEventListener(moveEvent,this.onDrag,true);
    },    
    onResize() {
      this.computeCarouselHeight();

      this.dragging = true; // force a dragging to disable animation
      this.render();
      // clear dragging after refresh rate
      setTimeout( () => { this.dragging = false }, this.refreshRate );
    },
    render() {
      // & snap the new offset on a slide or page if scrollPerPage
      const height = this.carouselHeight;
      this.offset = height * Math.round(this.offset / height);

      // clamp the offset between 0 -> maxOffset
      this.offset = Math.max(0, Math.min(this.offset, this.maxOffset));

      // update the current page
      this.currentPage = Math.round(this.offset / this.carouselHeight) +1;
    },

    computeCarouselHeight() {
      this.getBrowserWidth();
      this.getCarouselHeight();
    },

  },
  mounted() {
    window.addEventListener("resize",debounce(this.onResize, this.refreshRate,200));

    this.$nextTick(() => {
      this.computeCarouselHeight();
    });
    // setup the start event only if touch device or mousedrag activated
    let event  = this.isTouch ? "touchstart" : "mousedown";
    this.$refs["carouselWrapper"].addEventListener(event,this.onStart);

    this.transitionStyle =  `0.4s ease transform`;
    if(typeof this.$props.navigateTo == "number"){
      this.offset =  Math.min(this.carouselHeight * (this.$props.navigateTo-1), this.maxOffset)
    }

  },

  beforeDestroy() {
    window.removeEventListener("resize", this.getBrowserWidth);
    let event = this.isTouch ? "touchstart" : "mousedown";
    this.$refs["carouselWrapper"].removeEventListener(event,this.onStart);    
  }
};
</script>
<style>
.product-photo-carousel .carousel{
    
}

.carousel-wrapper {
    overflow: hidden;
    height: 540px;
    width: 540px;
    display: inline-block;
    vertical-align: top;
    margin-right: -3px;  
    background-color: #f5f5f5; 
}


.carousel-inner {
  height: 100%;
}


.no-carousel-image{
  font-size: 20px;
  font-weight: bold;
  color: #c8c8c8;
  line-height: 540px;
  text-align: center;
}
</style>
