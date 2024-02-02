export const createToolTipPlugin = (options) => {
  return function toolTipPlugin(node) {
    const original = node.props.definition.schema;
    node.props.definition.schema = (extensions = {}) => {
      extensions.help = { if: "false" }; //make sure the help section never rendered as it is what we want to override
      extensions.label = {
        children: [
          "$label",
          {
            $el: "span",
            if: "$help",
            attrs: {
              class: "tooltip",
            },
            children: [
              "?", // this is a text node
              {
                $el: "span",
                attrs: {
                  class: "tooltip-inner",
                },
                children: "$help",
              },
            ],
          },
        ],
      };
      return original(extensions);
    };
  };
};
