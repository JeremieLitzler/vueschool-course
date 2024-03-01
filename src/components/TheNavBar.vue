<template>
  <!-- use .navbar-open to open nav -->
  <nav class="navbar">
    <ul>
      <li v-if="signedIn" class="navbar-user">
        <router-link :to="{ name: 'AccountShow' }">
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
        </router-link>

        <!-- dropdown menu -->
        <!-- add class "active-drop" to show the dropdown -->
        <div id="user-dropdown">
          <div class="triangle-drop"></div>
          <ul class="dropdown-menu">
            <li class="dropdown-menu-item">
              <router-link :to="{ name: 'AccountShow' }"
                >View profile</router-link
              >
            </li>
            <li class="dropdown-menu-item"><a href="#">Log out</a></li>
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
      <li v-if="signedIn" class="navbar-item">
        <a @click.prevent="logout">Log out</a>
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
import { computed } from 'vue';
import { RouteName } from '@/enums/RouteName';
import { useUserStore } from '@/stores/UserStore';
const user = computed(() => useUserStore().getAuthUser());
console.log('TheNavBar > user', user);

const signedIn = computed(
  () => user.value.id != '' || useUserStore().authId != ''
);

const logout = () => {
  useUserStore().logoutUser();
};
</script>
