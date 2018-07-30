<template>
  <div class="carousel-pagination">
    <span class="carousel-dot-button carousel-dot-buttonUp" :class="{'page-disabled':currentPage === 1}">
      <i
        role="button"
        class="icon-up"
        
        v-on:click="goToPage('prev')"
      ></i>  
    </span>
    <span class="carousel-page-item current-page-item">{{currentPage}}</span>
    <span class="carousel-page-item">/</span>
    <span class="carousel-page-item carousel-page-count">{{pagniationCount}}</span>
    <span class="carousel-dot-button carousel-dot-buttonDown" :class="{'page-disabled': pagniationCount === currentPage}">
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
  props:{
    activetPage:{
      type:Number,
      validator(val){
        return val >= 1;
      }
    }
  },
  data(){
    return {
      // currentPage:1
    }
  },
  created(){
    // if(typeof this.$props.activetPage == "number"){
    //   if(this.$props.activetPage>this.pagniationCount)this.$props.activetPage = this.pagniationCount;
    //   this.currentPage = this.$props.activetPage;
    // }
  },
  computed: {
    pagniationCount() {
      return this.carousel.slideCount;
    },
    currentPage(){
      return this.carousel.currentPage;
    }
  },
  methods: {
    goToPage(type) {
      let currentPage = this.currentPage;
      if(type == "prev"){
        if(this.currentPage === 1)return;
        currentPage -= 1;
      }else if(type == "next"){
        if(this.currentPage == this.pagniationCount)return;
        currentPage += 1;
      }

      this.$emit("paginationclick", currentPage);
    }
  }
};
</script>

<style scoped>
.carousel-pagination {
    flex: 1;
    text-align: center;
}

.carousel-page-item {
    display: block;
    color: #5f5f5f;
    display: block;
    text-align: center;
    font-size: 20px;
    font-weight:bold;
}
.current-page-item,
.carousel-page-count{
}

.carousel-dot-button {
  display: inline-block;
  cursor: pointer;
  width: 32px;
  line-height: 36px;
  height: 32px;
  text-align: center;
  border-radius: 50%;
  font-size: 22px;
  border: 2px solid #5f5f5f;
}


.page-disabled{
  background-color: #efefef;
  color:#c8c8c8;
  border: 2px solid #efefef;
  cursor: not-allowed;
}
.carousel-dot-buttonUp{
  margin-bottom: 24px;
}

.carousel-dot-buttonDown{
  margin-top: 24px;
}
@media only screen and (min-width:1600px){
  .carousel-pagination {
    padding-top: 224px;
    padding-left: 10px;
    padding-right: 10px;    
  }
}
@media only screen /* and (min-width:1080px) */ and (max-width:1600px){
  .carousel-pagination {
    padding-top: 110px;
    padding-left: 8px;
    padding-right: 8px;
  }

}
/* @media only screen and (min-width:480px) and (max-width:1080px){
  
} */
</style>
