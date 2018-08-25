<template>
  <transition name="fade">
    <div v-if="isActive" ref="velmld"  class="velmld-overlay" :class="{ 'velmld-full-screen': isFullScreen }">
      <div class="velmld-spinner">
        <!-- <slot name="default">
          <component :is="spinner" :color="spinnerColor"></component>
        </slot> -->
       <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="90px" height="90px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
          <path :fill="spinnerColor" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
            <animateTransform attributeType="xml"
              attributeName="transform"
              type="rotate"
              from="0 25 25"
              to="360 25 25"
              dur="0.6s"
              repeatCount="indefinite"/>
          </path>
        </svg>        
      </div>
    </div>
  </transition>
</template>

<script>

export default {
  name: 'element-loading',
  props: {
    active: Boolean,
    color: String,
    isFullScreen: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isActive: this.active || false,
      spinnerColor: this.color
    }
  },
  /**
   * Append class 'velmld-parent' to parent container.
   */
  mounted () {
    this.$refs.velmld.parentNode.classList.add('velmld-parent')
  },
  watch: {
    /**
     * Binding outside component value and inside component value.
     * Append class 'velmld-parent' to parent container.
     */
    active (value) {
      this.isActive = value
      if (value) {
        this.$refs.velmld.parentNode.classList.add('velmld-parent')
      }
    },
    /**
     * Binding outside component color value and inside component color value.
     */
    color (value) {
      this.spinnerColor = value
    }
  }
}
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .velmld-overlay {
    position: absolute;
    z-index: 999;
    background-color: rgba(255, 255, 255, .9);
    margin: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transition: opacity .3s;
  }
  .velmld-spinner {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
  }
  .velmld-full-screen {
    position: fixed;
  }
  .velmld-parent {
    position: relative !important;
  }
</style>
