<template>
  <div class="init">
    <form>
      <div class="title">Login:</div>
      <div class="input-wrapper">
        <input name="name" v-model="name" placeholder="Store ID" type="text" />
      </div>
      <div class="input-wrapper">
        <input name="password" v-model="password" placeholder="Password" type="password" />
      </div>
      <p class="error-message">
        <span v-show= "loginFailed">
          <span class="error-mark">*</span>Login failed. Invalid Store ID or password !
        </span>  
      </p>
      <div class="btn-wrapper">
        <button type="button" @click="login">Login</button>
      </div>
    </form>
  </div>
</template>
<script src="./login.js"></script>
<style lang="scss" src="./login.scss"></style>
