<template>
  <div
    class="btn-hamburger"
    @click="toggleMobileMenu"
    v-click-outside="closeMobileMenu"
    v-page-scroll="
      () => {
        //console.log('v-page-scroll called');
        mobileMenuOpened = false;
      }
    "
  >
    <!-- use .btn-humburger-active to open the menu -->
    <div class="top bar"></div>
    <div class="middle bar"></div>
    <div class="bottom bar"></div>
  </div>
  <!-- use .navbar-open to open nav -->
  <nav class="navbar" :class="{ 'navbar-open': mobileMenuOpened }">
    <span v-if="!useCommonStore().appIsReady" class="navbar-user navbar-loading"
      ><app-spinner background-color="#ffffff"
    /></span>
    <ul v-else>
      <li v-if="signedIn" class="navbar-user">
        <a
          @click.prevent="userMenuOpened = !userMenuOpened"
          v-click-outside="closeDropdown"
          href="#"
        >
          <app-avatar-image
            cssClass="avatar-small"
            :src="user?.avatar"
            :alt="`${user?.name} profile picture`"
          />
          <span>
            {{ user?.name }}
            <img
              class="icon-profile"
              src="../assets/img/svg/arrow-profile.svg"
              alt=""
            />
          </span>
        </a>

        <!-- dropdown menu -->
        <!-- add class "active-drop" to show the dropdown -->
        <div id="user-dropdown" :class="{ 'active-drop': userMenuOpened }">
          <div class="triangle-drop"></div>
          <ul class="dropdown-menu">
            <li class="dropdown-menu-item">
              <router-link :to="{ name: 'AccountShow' }"
                >View profile</router-link
              >
            </li>
            <li class="dropdown-menu-item">
              <a @click.prevent="logout">Log out</a>
            </li>
          </ul>
        </div>
      </li>
      <li v-if="!signedIn" class="navbar-item">
        <router-link :to="{ name: RouteName.UserRegister }"
          >Register</router-link
        >
      </li>
      <li v-if="!signedIn" class="navbar-item">
        <router-link :to="{ name: RouteName.UserLogin }">Login</router-link>
      </li>
      <li v-if="signedIn" class="navbar-mobile-item">
        <router-link :to="{ name: 'AccountShow' }">View profile</router-link>
      </li>
      <li v-if="signedIn" class="navbar-mobile-item">
        <a @click.prevent="logout">Log out</a>
      </li>
    </ul>
  </nav>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';

import { RouteName } from '@/enums/RouteName';
import { useUserStore } from '@/stores/UserStore';
import useAppendRouteHelper from '@/helpers/appendRouteHelper';
import { useCommonStore } from '@/stores/CommonStore';

const { toSignOut } = useAppendRouteHelper();

const userMenuOpened = ref(false);
const mobileMenuOpened = ref(false);
const user = computed(() => useUserStore().getAuthUser());

const signedIn = computed(
  () => user.value.id != '' || useUserStore().authId != ''
);
const toggleMobileMenu = () => {
  mobileMenuOpened.value = !mobileMenuOpened.value;
};
const closeDropdown = () => {
  userMenuOpened.value = false;
};
const closeMobileMenu = () => {
  mobileMenuOpened.value = false;
};
const logout = async () => {
  mobileMenuOpened.value = false;
  toSignOut();
};
</script>
