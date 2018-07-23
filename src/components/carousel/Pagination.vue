<template>
  <div class="carousel-pagination">
    <span class="carousel-dot-button carousel-dot-buttonUp" :class="{'page-disabled':currentPage === 0}">
      <i
        role="button"
        class="icon-up"
        
        v-on:click="goToPage('prev')"
      ></i>  
    </span>
    <span class="carousel-page-item current-page-item">{{currentPage+1}}</span>
    <span class="carousel-page-item">/</span>
    <span class="carousel-page-item carousel-page-count">{{pagniationCount}}</span>
    <span class="carousel-dot-button carousel-dot-buttonDown" :class="{'page-disabled': pagniationCount-1 === currentPage}">
      <i
        role="button"
        class="icon-down"
        v-on:click="goToPage('next')"
      ></i> 
    </span>      
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
    display: block;
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
    width: .64rem;
    line-height: .72rem;
    height: .64rem;
    text-align: center;
    border-radius: 50%;
    font-size: .44rem;
    border: 2px solid #5f5f5f;
}


.page-disabled{
  background-color: #efefef;
  color:#c8c8c8;
  border: 2px solid #efefef;
  cursor: not-allowed;
}
.carousel-dot-buttonUp{
  margin-bottom: 0.48rem;
}

.carousel-dot-buttonDown{
  margin-top: 0.48rem;
}
</style>
