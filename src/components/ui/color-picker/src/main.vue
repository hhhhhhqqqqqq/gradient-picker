<template>
  <div
    :class="[
      'ms-color-picker',
      colorDisabled ? 'is-disabled' : '',
      colorSize ? `ms-color-picker--${ colorSize }` : ''
    ]"
    v-clickoutside="hide"
  >
    <!-- @click="showPanel" -->
    <div class="ms-color-picker__mask" v-if="colorDisabled"></div>
    <div class="ms-color-picker__trigger" @click="handleTrigger">
      <span class="ms-color-picker__color" :class="{ 'is-alpha': showAlpha }">
        <span
          class="ms-color-picker__color-inner"
          :style="{
            backgroundColor: displayedColor
          }"
        ></span>
        <span class="ms-color-picker__empty ms-icon-close" v-if="!value && !showPanelColor"></span>
      </span>
      <span class="ms-color-picker__icon ms-icon-arrow-down" v-show="value || showPanelColor"></span>
    </div>
    <picker-dropdown
      ref="dropdown"
      class="ms-color-picker__panel"
      v-if="showPicker"
      @pick="confirmValue"
      @clear="clearValue"
      :style="{'left':popperLeft + 'px','top':popperTop + 'px'}"
      :color="color"
      :show-alpha="showAlpha"
      :predefine="predefine"
    ></picker-dropdown>
  </div>
</template>

<script>
import Color from "./color";
import PickerDropdown from "./components/picker-dropdown.vue";
import Clickoutside from "../../../../utils/clickoutside";
import { getPopperPosition } from "../../../../utils/utils";
export default {
  name: "ColorPicker",

  props: {
    value: String,
    showAlpha: Boolean,
    colorFormat: String,
    disabled: Boolean,
    size: String,
    popperClass: String,
    predefine: Array
  },
  directives: { Clickoutside },

  computed: {
    displayedColor() {
      if (!this.value && !this.showPanelColor) {
        return "transparent";
      }

      return this.displayedRgb(this.color, this.showAlpha);
    },

    colorSize() {
      return this.size;
    },

    colorDisabled() {
      return this.disabled;
    }
  },

  watch: {
    value(val) {
      if (!val) {
        this.showPanelColor = false;
      } else if (val && val !== this.color.value) {
        this.color.fromString(val);
      }
    },
    color: {
      deep: true,
      handler() {
        this.showPanelColor = true;
      }
    },
    displayedColor(val) {
      if (!this.showPicker) return;
      const currentValueColor = new Color({
        enableAlpha: this.showAlpha,
        format: this.colorFormat
      });
      currentValueColor.fromString(this.value);

      const currentValueColorRgb = this.displayedRgb(
        currentValueColor,
        this.showAlpha
      );
      if (val !== currentValueColorRgb) {
        this.$emit("active-change", val);
      }
    }
  },

  methods: {
    show() {},

    handleTrigger() {
      debugger;
      if (this.colorDisabled) return;
      this.showPicker = !this.showPicker;
      if (this.showPicker) {
        this.$nextTick(() => {
          var el = document.querySelector(".ms-color-picker");
          var k = getPopperPosition(el, { width: 314, height: 282 });
          this.popperTop = k.top;
          this.popperLeft = k.left;
        });
      }
    },
    confirmValue() {
      this.$emit("input", this.color.value);
      this.$emit("change", this.color.value);
      this.showPicker = false;
    },
    clearValue() {
      this.$emit("input", null);
      this.$emit("change", null);
      this.showPanelColor = false;
      this.showPicker = false;
      this.resetColor();
    },
    hide() {
      this.showPicker = false;
      this.resetColor();
    },
    resetColor() {
      this.$nextTick(_ => {
        if (this.value) {
          this.color.fromString(this.value);
        } else {
          this.showPanelColor = false;
        }
      });
    },
    displayedRgb(color, showAlpha) {
      if (!(color instanceof Color)) {
        throw Error("color should be instance of Color Class");
      }

      const { r, g, b } = color.toRgb();
      return showAlpha
        ? `rgba(${r}, ${g}, ${b}, ${color.get("alpha") / 100})`
        : `rgb(${r}, ${g}, ${b})`;
    }
  },

  mounted() {
    const value = this.value;
    if (value) {
      this.color.fromString(value);
    }
  },

  data() {
    const color = new Color({
      enableAlpha: this.showAlpha,
      format: this.colorFormat
    });
    return {
      color,
      showPicker: false,
      showPanelColor: false,
      popperLeft: 0,
      popperTop: 0
    };
  },

  components: {
    PickerDropdown
  }
};
</script>
<style>
.ms-color-picker {
  display: inline-block;
  position: relative;
  line-height: normal;
  height: 40px;
}
.ms-color-picker__trigger {
  display: inline-block;
  box-sizing: border-box;
  height: 40px;
  width: 40px;
  padding: 4px;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  font-size: 0;
  position: relative;
  cursor: pointer;
}
.ms-color-picker__color.is-alpha {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);
}
.ms-color-picker__color {
  position: relative;
  display: block;
  box-sizing: border-box;
  /* border: 1px solid #999; */
  border-radius: 2px;
  width: 100%;
  height: 100%;
  text-align: center;
}
.ms-color-picker__color-inner {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
</style>
