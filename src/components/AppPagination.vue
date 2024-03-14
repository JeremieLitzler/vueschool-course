<template>
  <section v-if="showPagination" class="app-pagination">
    <ul class="app-pagination-ctrls app-pagination-ctrls-left">
      <li
        v-show="showPrevRangeButton"
        @click="previousRange"
        class="app-pagination-link app-pagination-ctrl"
      >
        <span><slot name="prevRange"></slot></span>
      </li>
      <li
        v-show="currentPage > 1"
        class="app-pagination-link app-pagination-ctrl"
      >
        <router-link
          :to="{ name: RouteName.ThreadShow, query: { page: prevPage } }"
        >
          <slot name="prevPage"></slot>
        </router-link>
      </li>
    </ul>
    <ul class="app-pagination-list">
      <li v-for="page in pagination" :key="page" class="app-pagination-link">
        <router-link
          :to="{ name: RouteName.ThreadShow, query: { page: page } }"
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
        <router-link
          :to="{ name: RouteName.ThreadShow, query: { page: nextPage } }"
        >
          <slot name="nextPage"></slot>
        </router-link>
      </li>

      <li
        v-show="showNextRangeButton"
        @click="nextRange"
        class="app-pagination-link app-pagination-ctrl"
      >
        <span>
          <slot name="nextRange"></slot>
        </span>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouteName } from '@/enums/RouteName';

interface AppPaginationProps {
  pageCount: number;
  pagesAround: number;
  currentPage: number;
}

const { pageCount, pagesAround, currentPage } = withDefaults(
  defineProps<AppPaginationProps>(),
  {
    pageCount: 0,
    pagesAround: 1,
  }
);

// const router = useRouter();
const from = ref(0);
const to = ref(pagesAround * 2 + 1);
const navigateRanges = ref(false);

const showPagination = computed(() => {
  return pageCount > 1;
});
const showPrevRangeButton = computed(() => {
  return hasRange.value && (inBetween.value || ending.value);
});
const showNextRangeButton = computed(() => {
  return hasRange.value && (inBetween.value || starting.value);
});
const hasRange = computed(() => {
  return pageCount / (pagesAround * 2 + 1) > 1;
});
const starting = computed(() => {
  return to.value <= pagesAround * 2 + 1;
});
const inBetween = computed(() => {
  return from.value > pagesAround * 2 && to.value < pageCount;
});
const ending = computed(() => {
  return to.value >= pageCount;
});
const pagination = computed(() => {
  const result = pages.value.slice(from.value, to.value);
  //console.log(
  //   `app-pagination > pagination
  //     > state=${
  //       starting ? "starting" : ending ? "ending" : "inBetween"
  //     }
  //     > from=${from} - to=${to} - current=${currentPage}
  //     > result=${result}`
  // );
  return result;
});
const pages = computed(() => {
  const pageArray = Array.apply(null, Array(pageCount)).map(
    (_index, value: number) => value + 1
  );
  return pageArray;
});
const nextPage = computed(() => {
  const possibleNextPage = currentPage + 1;
  //console.log('app-pagination > nextPage', possibleNextPage);
  return possibleNextPage;
});
const prevPage = computed(() => {
  const possiblePreviousPage = currentPage - 1;
  //console.log('app-pagination > prevPage', possiblePreviousPage);
  return possiblePreviousPage;
});

// const loadPage = (page: number) => {
//   router.push({
//     name: RouteName.ThreadShow,
//     query: { page: page },
//   });
// };
// const goNextPage = () => {
//   loadPage(nextPage.value);
// };
// const goPrevPage = () => {
//   loadPage(prevPage.value);
// };
const nextRange = () => {
  if (starting.value || inBetween.value) {
    from.value = to.value;
    to.value = from.value + (pagesAround * 2 + 1);
    navigateRanges.value = true;
  }
};
const previousRange = () => {
  if (ending.value || inBetween.value) {
    to.value = from.value;
    from.value =
      from.value - (pagesAround * 2 + 2) < 0
        ? 0
        : from.value - (pagesAround * 2 + 1);
    navigateRanges.value = true;
  }
};

interface ResultRangeFromCurrentPage {
  newTo: number;
  newFrom: number;
}
const rangeFromCurrentPage = (): ResultRangeFromCurrentPage => {
  //we want the range from which to see the from and to data properties
  //we know the range size = [pagesAround * 2 + 1]
  const rangeSize = pagesAround * 2 + 1;
  let nextRangeMax = rangeSize;
  //we know the index of the page
  const currentPageIndex = currentPage - 1;
  let from = 0;
  let to = rangeSize;
  for (let index = 0; index < pages.value.length; index++) {
    //console.log(
    //   `app-pagination > rangeFromCurrentPage > index=${index} / range=${from} / ${to}`
    // );
    if (to >= pages.value.length) {
      //console.log(`app-pagination > rangeFromCurrentPage > first return`);
      return { newFrom: from, newTo: to };
    }
    if (index >= nextRangeMax) {
      //console.log(
      //   `app-pagination > rangeFromCurrentPage > updating from and to`
      // );
      from = to;
      to = from + rangeSize;
      nextRangeMax = to;
      //console.log(`new range=${from} / ${to} from index=${index}`);
    }
    if (index == currentPageIndex) {
      //console.log(`app-pagination > rangeFromCurrentPage > second return`);
      return { newFrom: from, newTo: to };
    }
    //console.log("not found... continue");
  }
  //console.log(`app-pagination > rangeFromCurrentPage > last return`);
  return { newFrom: from, newTo: to };
};

const { newFrom, newTo } = rangeFromCurrentPage();
//console.log("app-pagination > created > from (currentPage)", from);
//console.log("app-pagination > created > to (currentPage)", to);
from.value = newFrom;
to.value = newTo;
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
