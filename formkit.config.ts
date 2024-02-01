import type { DefaultConfigOptions } from "@formkit/vue";

const config: DefaultConfigOptions = {
  theme: "genesis",
  messages: {
    en: {
      validation: {
        username_is_unique({ args, name, node }) {
          return `${node.value} is already taken`;
        },
      },
    },
    fr: {
      validation: {
        username_is_unique({ args, name, node }) {
          return `${node.value} est déjà pris`;
        },
      },
    },
  },
  rules: {
    username_is_unique(node) {
      const usernames = ["jpschroeder", "luanguyen", "danielkelly_io"];
      return !usernames.includes(node.value as string);
    },
  },
};

export default config;
