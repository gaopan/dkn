<template>
  <div class="carousel-pagination" id = "carouselPagination">
    <span class="carousel-dot-button carousel-dot-buttonUp icon-up_" :class="{'page-up-disabled':currentPage === 1|| pagniationCount == 0}"
      role="button"
      id = "iconUp"       
      v-on:click="goToPage('prev')">
 
    </span>
<!--     <span class="carousel-dot-button carousel-dot-buttonUp" :class="{'page-disabled':currentPage === 1|| pagniationCount == 0}">
      <i
        role="button"
        class="icon-up" 
        id = "iconUp"       
        v-on:click="goToPage('prev')"
      ></i>  
    </span>
     -->    <span class="carousel-page-item current-page-item" :class = "{'no-image':currentPage==0}">{{currentPage}}</span>
    <span class="carousel-page-item" :class = "{'no-image':currentPage==0}">/</span>
    <span class="carousel-page-item carousel-page-count" :class = "{'no-image':currentPage==0}">{{pagniationCount}}</span>
    <span class="carousel-dot-button carousel-dot-buttonDown icon-down_" :class="{'page-down-disabled': pagniationCount === currentPage || pagniationCount == 0}" role="button" id = "iconDown" v-on:click="goToPage('next')">
      <i

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
        if(this.carousel.slideCount==0)return 0;
        return this.carousel.currentPage;
      }
    },
    methods: {
      goToPage(type) {
        if(this.pagniationCount == 0)return;
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
.carousel-page-item.no-image{
  color:#e6e6e6;
}
.carousel-pagination {
    width: 130px;
    /* height: 540px; */
    height: 380px;
    padding-top: 158px;    
    text-align: center;
    vertical-align: middle;
    display: inline-block;
}

.carousel-page-item {
    display: block;
    color: #5f5f5f;
    display: block;
    text-align: center;
    font-weight:bold;
}

.carousel-dot-button {
  display: inline-block;
  cursor: pointer;
/*   width: 32px;
line-height: 38px;
height: 32px; */
  width: 38px;
  height: 38px;
  text-align: center;
  border-radius: 50%;
  font-size: 22px;
  /* border: 2px solid #5f5f5f; */
}


/* .page-disabled{
  background-color: #efefef;
  color:#c8c8c8;
  border: 2px solid #efefef;
  cursor: not-allowed;
} */
.carousel-dot-buttonUp,
.carousel-dot-buttonDown{
    padding-top:18px;
    padding-bottom: 11px;
}

.carousel-page-item {
    font-size: 20px;
    line-height: 23px;
}  
.icon-up_{
  background: url(../../assets/svg/ico_list_bglight_arrow_up_n.svg) no-repeat  0 12px;
}
.icon-down_{
  background: url(../../assets/svg/ico_list_bglight_arrow_down_n.svg) no-repeat  0px 15px;
}
.page-up-disabled{
  background: url(../../assets/svg/ico_list_bglight_arrow_up_d.svg) no-repeat 1px 15px;

}
.page-down-disabled{
  background: url(../../assets/svg/ico_list_bglight_arrow_down_d.svg) no-repeat  1px 15px;

}

</style>
