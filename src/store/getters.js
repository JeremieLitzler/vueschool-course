export default {
  isAppIsReady: (state) => state.appIsReady,
  isUiElementReady: (state) => (uiElement) => {
    if (state.asyncUiParts[uiElement] === undefined) {
      //console.log("getters > isUiElementReady (undefined)");
      return true;
    }
    //console.log("getters > isUiElementReady", state.asyncUiParts[uiElement]);
    return state.asyncUiParts[uiElement];
  },
  //users

  //categories

  //forums

  //posts

  //threads
};
