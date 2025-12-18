// js/tilt.js
(function () {
  "use strict";
  var t = { max: 25, perspective: 1e3, easing: "cubic-bezier(.03,.98,.52,.99)", scale: 1.05, speed: 300, transition: !0, axis: null, reset: !0, glare: !0, "max-glare": .5 };
  function e(e) {
    if (!(this instanceof e)) return new e(e);
    if ((this.element = e.element, this.settings = Object.assign({}, t, e), this.settings.glare)) {
      this.glareElement = document.createElement("div");
      this.glareElement.className = "js-tilt-glare";
      this.glareElement.innerHTML = '<div class="js-tilt-glare-inner"></div>';
      this.element.appendChild(this.glareElement);
    }
    this.elementWrapper = this.element;
    this.element.style.willChange = "transform";
    this.element.style.transition = this.settings.transition ? "transform " + this.settings.speed + "ms " + this.settings.easing : "";
    this.bindEvents();
  }
  e.prototype = {
    bindEvents: function () {
      this.element.addEventListener("mouseenter", this.onMouseEnter.bind(this));
      this.element.addEventListener("mousemove", this.onMouseMove.bind(this));
      this.element.addEventListener("mouseleave", this.onMouseLeave.bind(this));
    },
    onMouseEnter: function (t) {
      this.updateElementPosition();
      this.element.style.transition = "";
      this.tiltWrapperStyle = this.elementWrapper.style;
    },
    updateElementPosition: function () {
      var t = this.element.getBoundingClientRect();
      this.width = this.element.offsetWidth;
      this.height = this.element.offsetHeight;
      this.left = t.left;
      this.top = t.top;
    },
    onMouseMove: function (t) {
      this.update(t.clientX, t.clientY);
    },
    update: function (t, e) {
      var i = (t - this.left) / this.width - .5, s = (e - this.top) / this.height - .5, a = this.settings.max * s * -1, n = this.settings.max * i * -1, r = "";
      this.settings.axis && ("X" === this.settings.axis ? a = 0 : "Y" === this.settings.axis && (n = 0));
      r = "perspective(" + this.settings.perspective + "px) rotateX(" + a + "deg) rotateY(" + n + "deg) scale3d(" + this.settings.scale + "," + this.settings.scale + "," + this.settings.scale + ")";
      if (this.settings.glare) {
        var o = this.settings["max-glare"] * Math.abs(i * 2) * 100;
        this.glareElement.style.transform = "rotate(" + (180 * Math.atan2(s, i) / Math.PI + 90) + "deg) translate(-50%, -50%)";
        this.glareElement.querySelector(".js-tilt-glare-inner").style.opacity = o / 100;
      }
      this.tiltWrapperStyle.transform = r;
    },
    onMouseLeave: function (t) {
      this.element.style.transition = "transform " + this.settings.speed + "ms " + this.settings.easing;
      if (this.settings.glare) {
        this.glareElement.querySelector(".js-tilt-glare-inner").style.opacity = "0";
      }
      this.tiltWrapperStyle.transform = "perspective(" + this.settings.perspective + "px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    }
  };
  if (typeof module !== "undefined" && typeof module.exports !== "undefined") module.exports = e;
  else window.VanillaTilt = e;
})();
VanillaTilt.init(document.querySelectorAll("[data-tilt]"));
