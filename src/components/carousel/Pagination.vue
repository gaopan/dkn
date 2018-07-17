<template>
  <div class="carousel-pagination">
    <ul class="carousel-dot-container" role="tablist">
      <li
        class="carousel-dot"
        aria-hidden="false"
        role="presentation"
        :aria-selected="isCurrentDot(index) ? 'true' : 'false'"
        v-bind:class="{ 'carousel-dot--active': isCurrentDot(index) }"
        v-for="(page, index) in pagniationCount"
        :key="`${page}_${index}`"
        v-on:click="goToPage(index)"
      >
        <button
          type="button"
          role="button"
          class="carousel-dot-button"
          :tabindex="index"
          :style="`background: ${isCurrentDot(index) ? 'rgb(5,41,131)' : 'gray'};`"
        ></button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "pagination",
  inject: ["carousel"],
  computed: {
    pagniationCount() {
      return this.carousel.slideCount;
    },
    currentPage(){
      return this.carousel.currentPage;
    }

  },
  methods: {

    goToPage(index) {
      this.$emit("paginationclick", index);
    },
    isCurrentDot(index) {
      return index === this.currentPage;
    }
  }
};
</script>

<style scoped>
.carousel-pagination {
  /* width: 100%; */
  position: absolute;
  bottom: 0;
  right: 0;
}

.carousel-dot-container {
  display: inline-block;
  margin: 0 auto;
  padding: 0;
}

.carousel-dot {
  display: block;
  cursor: pointer;
  width: 10px;
  height: 10px;
}

.carousel-dot-container  li+li{
  margin-top: 4px;
}
.carousel-dot-button {
  appearance: none;
  border: none;
  background-color: transparent;
  padding: 0;
  /* border-radius: 100%; */
  outline: none;
  cursor: pointer;
  width: 8px;
  height: 8px;
}

.carousel-dot-button:focus {
  outline: 1px solid lightblue;
}
</style>
