<template>
  <section v-if="showPagination" class="app-pagination">
    <ul class="app-pagination-ctrls app-pagination-ctrls-left">
      <li
        v-show="showPrevRangeButton"
        @click="previousRange"
        class="app-pagination-link app-pagination-ctrl"
      >
        <span> ⏮️ </span>
      </li>
      <li
        v-show="currentPage > 1"
        class="app-pagination-link app-pagination-ctrl"
      >
        <router-link :to="{ name: parentRouteName, query: { page: prevPage } }">
          ◀️
        </router-link>
      </li>
    </ul>
    <ul class="app-pagination-list">
      <li v-for="page in pagination" :key="page" class="app-pagination-link">
        <router-link
          :to="{ name: parentRouteName, query: { page: page } }"
          class="btn-small"
          :class="[
            { 'btn-blue': page === currentPage },
            { '': page !== currentPage },
          ]"
        >
          {{ page }}
        </router-link>
      </li>
    </ul>
    <ul class="app-pagination-ctrls app-pagination-ctrls-right">
      <li
        v-show="currentPage < pageCount"
        class="app-pagination-link app-pagination-ctrl"
      >
        <router-link :to="{ name: parentRouteName, query: { page: nextPage } }">
          ▶️
        </router-link>
      </li>

      <li
        v-show="showNextRangeButton"
        @click="nextRange"
        class="app-pagination-link app-pagination-ctrl"
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
    parentRouteName: {
      type: String,
      required: true,
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
        name: this.parentRouteName,
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
      let nextRangeMax = rangeSize;
      //we know the index of the page
      const currentPageIndex = this.currentPage - 1;
      let from = 0;
      let to = rangeSize;
      for (let index = 0; index < this.pages.length; index++) {
        // console.log(
        //   `app-pagination > rangeFromCurrentPage > index=${index} / range=${from} / ${to}`
        // );
        if (to >= this.pages.length) {
          // console.log(`app-pagination > rangeFromCurrentPage > first return`);
          return { from, to };
        }
        if (index >= nextRangeMax) {
          // console.log(
          //   `app-pagination > rangeFromCurrentPage > updating from and to`
          // );
          from = to;
          to = from + rangeSize;
          nextRangeMax = to;
          // console.log(`new range=${from} / ${to} from index=${index}`);
        }
        if (index == currentPageIndex) {
          // console.log(`app-pagination > rangeFromCurrentPage > second return`);
          return { from, to };
        }
        // console.log("not found... continue");
      }
      // console.log(`app-pagination > rangeFromCurrentPage > last return`);
      return { from, to };
    },
  },
  created() {
    // console.log("app-pagination > created > previousPage", this.previousPage);
    // console.log("app-pagination > created > currentPage", this.currentPage);
    const { from, to } = this.rangeFromCurrentPage();
    // console.log("app-pagination > created > from (currentPage)", from);
    // console.log("app-pagination > created > to (currentPage)", to);
    this.from = from;
    this.to = to;
  },
};
</script>
<style scoped>
.app-pagination {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
}

.app-pagination-ctrls,
.app-pagination-list {
  display: flex;
  justify-items: center;
  align-items: center;
}

.app-pagination-ctrls {
  margin: 0.5em 0;
}

.app-pagination-link {
  margin: 1px;
}

.app-pagination-ctrl,
.app-pagination-link {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-items: center;
  border: 2px solid #263959;
  border-radius: 0.375em;
}
.app-pagination-ctrl a,
.app-pagination-ctrl span {
  padding: 9.5px 0.75em;
}
@media (min-width: 37.5em) {
  .app-pagination {
    flex-direction: initial;
    justify-content: center;
  }
}
</style>
