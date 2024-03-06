<template>
  <!-- use .navbar-open to open nav -->
  <nav class="navbar">
    <span v-if="!useCommonStore().appIsReady" class="navbar-user navbar-loading"
      ><app-spinner background-color="#ffffff"
    /></span>
    <ul v-else>
      <li v-if="signedIn" class="navbar-user">
        <a @click.prevent="toggleMenu" v-click-outside="closeDropdown" href="#">
          <img
            class="avatar-small"
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
        <div id="user-dropdown" :class="{ 'active-drop': menuOpened }">
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
    </ul>

    <ul>
      <li class="navbar-item">
        <router-link :to="{ name: RouteName.TheHome }">Home</router-link>
      </li>

      <!-- <li class="navbar-item">
            <a href="category.html">Category</a>
          </li>
          <li class="navbar-item">
            <a href="forum.html">Forum</a>
          </li>
          <li class="navbar-item">
            <a href="thread.html">Thread</a>
          </li>
          -->
      <!-- Show these option only on mobile-->
      <!-- <li class="navbar-item mobile-only">
            <a href="profile.html">My Profile</a>
          </li>
          <li class="navbar-item mobile-only">
            <a href="#">Logout</a>
          </li> -->
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

const menuOpened = ref(false);
const user = computed(() => useUserStore().getAuthUser());

const signedIn = computed(
  () => user.value.id != '' || useUserStore().authId != ''
);

const toggleMenu = () => (menuOpened.value = !menuOpened.value);
const closeDropdown = () => {
  menuOpened.value = false;
};
const logout = async () => {
  toSignOut();
};
</script>
