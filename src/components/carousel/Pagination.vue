<template>
  <div class="carousel-pagination">
    <i
          role="button"
          class="carousel-dot-button"
          :style="`background: ${currentPage === 0 ? 'rgb(5,41,131)' : 'gray'};`"
          v-on:click="goToPage('prev')"
    ></i>  
    <span class="carousel-page-item current-page-item">{{currentPage+1}}</span>
    <span class="carousel-page-item">/</span>
    <span class="carousel-page-item carousel-page-count">{{pagniationCount}}</span>
    <i
          role="button"
          class="carousel-dot-button icon-img_list_bglight_star_n"
          :style="`background: ${pagniationCount-1 === currentPage ? 'rgb(5,41,131)' : 'gray'};`"
          v-on:click="goToPage('next')"
    ></i>       
  </div>
</template>

<script>
export default {
  name: "pagination",
  inject: ["carousel"],
  data(){
    return {
      currentPage:0
    }
  },
  computed: {
    pagniationCount() {
      return this.carousel.slideCount;
    }

  },
  methods: {

    goToPage(type) {

      if(type == "prev"){
        if(this.currentPage === 0)return;
        this.currentPage -= 1;
      }else if(type == "next"){
        if(this.currentPage == this.pagniationCount-1)return;
        this.currentPage += 1;
      }

      this.$emit("paginationclick", this.currentPage);
    },

    isCurrentDot(index) {
      return index === this.currentPage;
    }
  }
};
</script>

<style scoped>
.carousel-pagination {
  position: absolute;
  right: -1.4rem;
  top: 4.44rem;
}

.carousel-page-item {
    display: block;
    color: #5f5f5f;
    text-align: center;
    line-height: .46rem;
    font-size: .4rem;
}
.current-page-item,
.carousel-page-count{
}

.carousel-dot-button {
  display: inline-block;
  cursor: pointer;
  width: .72rem;
  height: .72rem;
  border-radius: 100%;
}

</style>
