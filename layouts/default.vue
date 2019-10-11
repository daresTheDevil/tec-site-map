<template>
  <div class="h-screen w-screen flex flex-col">
    <main-navbar />
    <div class="flex w-screen h-full">
      <side-nav />
      <div class="flex flex-col bg-gray-300 w-5/6 h-full py-4 px-8">
        <nuxt />
      </div>
    </div>
  </div>
</template>

<script>
import MainNavbar from '@/components/navbars/MainNavbar.vue'
import SideNav from '@/components/navbars/SideNav.vue'

export default {
  components: {
    MainNavbar,
    SideNav
  }
}
</script>
<style></style>
