import { useFavicon, /*defaultDocument,*/ useIntervalFn } from "@vueuse/core";
import { watch, ref, isRef } from "vue";
//import type { ConfigurableDocument } from "@vueuse/core";
import type { MaybeRef } from "@vueuse/shared";

interface UseAlertFavicon /*extends ConfigurableDocument*/ {
  speed?: number;
  emoji?: string;
}

export default function useAlertFavicon(
  src: MaybeRef<string | null | undefined> = null,
  options: UseAlertFavicon = {}
) {
  const { speed = 1000, emoji = "🚨" /*document = defaultDocument*/ } = options;

  const favicon = useFavicon(src);
  const theSrc = isRef(src) ? src : ref(src);

  const { pause, resume } = useIntervalFn(() => {
    favicon.value =
      favicon.value === theSrc.value
        ? `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${emoji}</text></svg>`
        : theSrc.value;
  }, speed);

  pause();

  const cancel = () => {
    pause();
    favicon.value = theSrc.value;
  };

  watch(theSrc, () => {
    favicon.value = theSrc.value;
  });
  return {
    alert: resume,
    cancel,
    favicon: theSrc,
  };
}
