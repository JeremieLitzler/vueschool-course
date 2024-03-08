<template>
  <section v-if="showPagination" class="app-pagination">
    <ul>
      <li
        v-show="showPrevRangeButton"
        @click="previousRange"
        class="app-pagination-link app-pagination-ctrls"
      >
        <span> ⏮️ </span>
      </li>
      <li
        v-show="currentPage > 1"
        @click="goPrevPage"
        class="app-pagination-link app-pagination-ctrls"
      >
        <span> ◀️ </span>
      </li>
      <li v-for="page in pagination" :key="page" class="app-pagination-link">
        <a
          @click.prevent="loadPage(page)"
          class="btn-small"
          :class="[
            { 'btn-brown': page === currentPage },
            { 'btn-green': page !== currentPage },
          ]"
          >{{ page }}</a
        >
        <!-- <router-link
          :to="{ name: RouteName.ThreadShow, query: { page: page } }"
          class="btn-small"
          :class="[
            { 'btn-brown': page === currentPage },
            { 'btn-green': page !== currentPage },
          ]"
        >
          {{ page }}
        </router-link> -->
      </li>
      <li
        v-show="currentPage < pageCount"
        @click="goNextPage"
        class="app-pagination-link app-pagination-ctrls"
      >
        <span> ▶️ </span>
      </li>

      <li
        v-show="showNextRangeButton"
        @click="nextRange"
        class="app-pagination-link app-pagination-ctrls"
      >
        <span> ⏭️ </span>
      </li>
    </ul>
  </section>
</template>

<script>
import { useRouteName } from "@/helpers/routeNameEnum";
/* eslint-disable */
const { RouteName } = useRouteName();
/* eslint-enable */

export default {
  props: {
    pageCount: {
      type: Number,
      default: 0,
    },
    pagesAround: {
      type: Number,
      default: 1,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    previousPage: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      RouteName,
      from: 0,
      to: this.pagesAround * 2 + 1,
      navigateRanges: false,
    };
  },
  computed: {
    showPagination() {
      return this.pageCount > 1;
    },
    showPrevRangeButton() {
      return this.hasRange && (this.inBetween || this.ending);
    },
    showNextRangeButton() {
      return this.hasRange && (this.inBetween || this.starting);
    },
    hasRange() {
      return this.pageCount / (this.pagesAround * 2 + 1) > 1;
    },
    starting() {
      return this.to <= this.pagesAround * 2 + 1;
    },
    inBetween() {
      return this.from > this.pagesAround * 2 && this.to < this.pageCount;
    },
    ending() {
      return this.to >= this.pageCount;
    },
    pagination() {
      const result = this.pages.slice(this.from, this.to);
      // console.log(
      //   `app-pagination > pagination
      //     > state=${
      //       this.starting ? "starting" : this.ending ? "ending" : "inBetween"
      //     }
      //     > from=${this.from} - to=${this.to} - current=${this.currentPage}
      //     > result=${result}`
      // );
      return result;
    },
    pages() {
      const pageArray = Array.apply(null, Array(this.pageCount)).map(
        (index, value) => value + 1
      );
      return pageArray;
    },
    nextPage() {
      const possibleNextPage = this.currentPage + 1;
      console.log("app-pagination > nextPage", possibleNextPage);
      return possibleNextPage;
    },
    prevPage() {
      const possiblePreviousPage = this.currentPage - 1;
      console.log("app-pagination > nextPage", possiblePreviousPage);
      return possiblePreviousPage;
    },
  },
  methods: {
    loadPage(page) {
      this.$router.push({
        name: RouteName.ThreadShow,
        query: { page: page },
      });
    },
    goNextPage() {
      this.loadPage(this.nextPage);
    },

    goPrevPage() {
      this.loadPage(this.prevPage);
    },
    nextRange() {
      if (this.starting || this.inBetween) {
        this.from = this.to;
        this.to = this.from + (this.pagesAround * 2 + 1);
        this.navigateRanges = true;
      }
    },
    previousRange() {
      if (this.ending || this.inBetween) {
        this.to = this.from;
        this.from =
          this.from - (this.pagesAround * 2 + 2) < 0
            ? 0
            : this.from - (this.pagesAround * 2 + 1);
        this.navigateRanges = true;
      }
    },
    rangeFromCurrentPage() {
      //we want the range from which to see the from and to data properties
      //we know the range size = [pagesAround * 2 + 1]
      const rangeSize = this.pagesAround * 2 + 1;
      //we know the index of the page
      const currentPageIndex = this.currentPage - 1;
      let from = 0;
      let to = rangeSize;
      for (let index = 0; index < this.pages.length; index++) {
        // console.log("app-pagination > rangeFromCurrentPage > index", index);
        // console.log("app-pagination > rangeFromCurrentPage > from", from);
        // console.log("app-pagination > rangeFromCurrentPage > to", to);
        if (to >= this.pages.length) {
          return { from, to };
        }
        if (index >= rangeSize) {
          from = to;
          to = from + rangeSize;
        }
        if (index == currentPageIndex) {
          return { from, to };
        }
      }
      return { from, to };
    },
  },
  created() {
    console.log("app-pagination > created > previousPage", this.previousPage);
    console.log("app-pagination > created > currentPage", this.currentPage);

    const pageChanged = this.previousPage !== this.currentPage;
    const { from, to } = this.rangeFromCurrentPage();
    console.log("app-pagination > created > from (currentPage)", from);
    console.log("app-pagination > created > to (currentPage)", to);
    if (!this.navigateRanges && pageChanged) {
      this.from = from;
      this.to = to;
    }
  },
  updated() {
    console.log("app-pagination > updated > previousPage", this.previousPage);
    console.log("app-pagination > updated > currentPage", this.currentPage);
    const pageChanged = this.previousPage !== this.currentPage;
    if (!this.navigateRanges && pageChanged) {
      const { from, to } = this.rangeFromCurrentPage();
      console.log("app-pagination > updated > from (currentPage)", from);
      console.log("app-pagination > updated > to (currentPage)", to);
      this.from = from;
      this.to = to;
    } else {
      // console.log(
      //   "app-pagination > updated > else",
      //   `navigateRanges=${this.navigateRanges} / pageChanged=${pageChanged}`
      // );
    }
  },
};
</script>
<style scoped>
.app-pagination ul {
  width: 19em;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
}

.app-pagination-link {
  margin: 1px;
}

.app-pagination-ctrls {
  padding: 0 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-items: center;
  border: 2px solid #57ad8d;
  border-radius: 0.375em;
}
</style>
