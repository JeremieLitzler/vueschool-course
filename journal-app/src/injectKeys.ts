import type { InjectionKey } from "vue";
import User from "./types/User";

//create a unique InjectionKey since provide requires that.
// Using a Symbol guaranteed the unicity. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol
export const userInjectionKey = Symbol() as InjectionKey<User>;
