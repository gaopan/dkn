<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-body">
            <slot name="body">
              default body
            </slot>
          </div>

          <div class="modal-footer">
              <button class="modal-default-button" @click="$emit('close')">
                {{buttonTxt}}
              </button>
          </div>
        </div>
      </div>
    </div>
  </transition>	
</template>
<style type="text/css" src = "./popup.css"></style>
<script type="text/javascript" src = "./popup.js"></script>