import type { Alpine } from "alpinejs";

export default (alpine: Alpine): void => {
  alpine.data("tagFilter", () => ({
    query: "",
    filterClasses: { invisible: false },
    isMatching(): boolean {
      const tag = this.$el.dataset.tag ?? "";
      return tag.includes(this.query.trim().toLowerCase());
    },
  }));
};
