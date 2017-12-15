(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.SafeInset = factory();
  }
})(typeof self !== "undefined" ? self : this, () => {
  let changeListener = null;
  let currentInsets = null;

  function calculateInsets() {
    let element = document.createElement("div");
    element.style.position = "absolute";
    element.style.top = "-1000px";
    element.style.left = "-1000px";
    document.documentElement.appendChild(element);

    element.style.width = "constant(safe-area-inset-top)";
    element.style.height = "constant(safe-area-inset-right)";
    const top = element.getBoundingClientRect().width;
    const right = element.getBoundingClientRect().height;

    element.style.width = "constant(safe-area-inset-bottom)";
    element.style.height = "constant(safe-area-inset-left)";
    const bottom = element.getBoundingClientRect().width;
    const left = element.getBoundingClientRect().height;

    document.documentElement.removeChild(element);

    return { top, right, bottom, left };
  }

  function getInset(direction) {
    if (!currentInsets) {
      currentInsets = calculateInsets();
    }
    return currentInsets[direction];
  }

  window.addEventListener("orientationchange", () => {
    if (!changeListener) {
      return;
    }

    // We need to wait for the orientation change to propagate, before we can calculate the new values.
    setTimeout(() => {
      const nextInsets = calculateInsets();
      if (
        currentInsets.top != nextInsets.top ||
        currentInsets.right != nextInsets.right ||
        currentInsets.bottom != nextInsets.bottom ||
        currentInsets.left != nextInsets.left
      ) {
        currentInsets = nextInsets;
        changeListener(currentInsets);
      }
    }, 50);
  });

  return {
    get top() {
      return getInset("top");
    },
    get right() {
      return getInset("right");
    },
    get bottom() {
      return getInset("bottom");
    },
    get left() {
      return getInset("left");
    },

    onChange(listener) {
      changeListener = listener;
    }
  };
});
