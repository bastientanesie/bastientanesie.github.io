import { defineHastPlugin } from "satteri";

export const headingAnchors = defineHastPlugin({
  name: "heading-anchors",
  element: {
    filter: ["h2", "h3", "h4"],
    visit(node, ctx) {
      const id = node.properties.id;
      if (typeof id !== "string") return;
      ctx.appendChild(node, {
        type: "element",
        tagName: "a",
        properties: {
          href: `#${id}`,
          className: ["heading-anchor"],
          ariaLabel: "Link to this section",
        },
        children: [{ type: "text", value: "#" }],
      });
    },
  },
});
