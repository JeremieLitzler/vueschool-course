import axios from "axios";

//This extends the vue api
declare module "vue" {
  interface ComponentCustomProperties {
    $http: typeof axios;
  }
}
