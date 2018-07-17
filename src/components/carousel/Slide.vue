<template>
  <div
    class="carousel-slide"
    tabindex="-1"
    :class="{
      'carousel-slide-active': isActive,
      'carousel-slide-center': isCenter
    }"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "slide",
  data() {
    return {
      width: null
    };
  },
  inject: ["carousel"],
  mounted() {
    if (!this.$isServer) {
      this.$el.addEventListener("dragstart", e => e.preventDefault());
    }

    this.$el.addEventListener(
      this.carousel.isTouch ? "touchend" : "mouseup",
      this.onTouchEnd
    );
  },
  computed: {
    activeSlides() {
      const { currentPage, $children, slideCount } = this.carousel;
      const activeSlides = [];
      const children = $children
        .filter(child =>child.$el && child.$el.className.indexOf("carousel-slide") >= 0)
        .map(child => child._uid);

      return activeSlides;
    },
    //describes whether a slide is visible
    isActive() {
      return this.activeSlides.indexOf(this._uid) >= 0;
    },
   
     // `isCenter` describes whether a slide is in the center of all visible slides,
     //if perPage is an even number, we quit
    isCenter() {
      const { perPage } = this.carousel;
      if (perPage % 2 === 0 || !this.isActive) return false;
      return this.activeSlides.indexOf(this._uid) === Math.floor(perPage / 2);
    }
  },
  methods: {
    onTouchEnd(e) {
      let bTouch = this.carousel.isTouch && e.changedTouches && e.changedTouches.length > 0;
      const eventPosX = bTouch? e.changedTouches[0].clientX : e.clientX;

      const deltaX = this.carousel.dragStartX - eventPosX;

      if (this.carousel.minSwipeDistance === 0 ||Math.abs(deltaX) < this.carousel.minSwipeDistance) {
        //user click the slide
        this.$emit("slideClick", Object.assign({}, e.currentTarget.dataset));
      }
    }
  }
};
</script>

<style>
.carousel-slide {
  /*flex-basis: inherit;*/
  /*flex-grow: 0;*/
  /*flex-shrink: 0;*/
  user-select: none;
  /*backface-visibility: hidden;*/
  /*-webkit-touch-callout: none;*/
  outline: none;
  width: 100%;
  height: 100%;
}
</style>
