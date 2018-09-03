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
<style type="text/css">
  .error-message{
    font-size: 16px;
    margin-bottom: 10px;
    height: 16px;
  }
  .error-mark{
    color: red;
    margin-right: 10px;
    font-weight: bold;
  }
</style>
