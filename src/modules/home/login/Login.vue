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
      <div class="btn-wrapper">
        <button type="button" @click="login">Login</button>
      </div>
    </form>
  </div>
</template>
<script src="./login.js"></script>
