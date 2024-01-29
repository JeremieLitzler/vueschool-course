<template>
  <div id="app">
    <UserCard :user="user" />
    <UserCardFunctional :user="userFunctional">
      {{ user.bio }}
    </UserCardFunctional>
  </div>
</template>

<script>
import UserCard from "./components/user-card";
import UserCardFunctional from "./components/user-card-functional";

export default {
  name: "App",

  data() {
    return {
      user: {
        name: "Jane Doe",
        role: "Staff Engineer",
        avatar: "https://randomuser.me/api/portraits/women/26.jpg",
        bio: "Candy canes sweet roll pudding liquorice jelly beans brownie powder pie. Pudding powder marshmallow sugar plum dessert pastry jelly-o pastry marzipan. Jelly topping biscuit jelly beans cookie cheesecake.",
      },
      userFunctional: {
        name: "Jane Doe (functional)",
        role: "Staff Engineer",
        avatar: "https://randomuser.me/api/portraits/women/26.jpg",
        bio: "Candy canes sweet roll pudding liquorice jelly beans brownie powder pie. Pudding powder marshmallow sugar plum dessert pastry jelly-o pastry marzipan. Jelly topping biscuit jelly beans cookie cheesecake.",
      },
    };
  },

  components: {
    UserCard,
    UserCardFunctional,
  },
};
</script>
