<template>
 <!-- @after-leave="doDestroy" -->
  <transition name="ms-zoom-in-top">
    <div class="ms-color-dropdown">
      <div class="ms-color-dropdown__main-wrapper">
        <hue-slider ref="hue" :color="color" vertical style="float: right;"></hue-slider>
        <sv-panel ref="sl" :color="color"></sv-panel>
      </div>
      <alpha-slider v-if="showAlpha" ref="alpha" :color="color"></alpha-slider>
      <predefine v-if="predefine" :color="color" :colors="predefine"></predefine>
      <div class="ms-color-dropdown__btns">
        <span class="ms-color-dropdown__value">
          <ms-input
            v-model="customInput"
            @keyup.native.enter="handleConfirm"
            @blur="handleConfirm"
            size="mini"
          ></ms-input>
        </span>
        <ms-button
          v-if="showControl"
          size="mini"
          type="text"
          class="el-color-dropdown__link-btn"
          @click.stop="clear"
        >清空</ms-button>
        <ms-button
         v-if="showControl" plain size="mini" class="ms-color-dropdown__btn" @click.stop="confirmValue">确定</ms-button>
      </div>
    </div>
  </transition>
</template>

<script>
import SvPanel from "./sv-panel";
import HueSlider from "./hue-slider";
import AlphaSlider from "./alpha-slider";
import Predefine from "./predefine";
import MsInput from '../../../MsInput';
import MsButton from '../../../MsButton';

export default {
  name: "ms-color-picker-dropdown",

  components: {
    SvPanel,
    HueSlider,
    AlphaSlider,
    MsInput,
    MsButton,
    Predefine
  },

  props: {
    color: {
      required: true
    },
    showAlpha: Boolean,
    predefine: Array,
    showControl: {
      type:Boolean,
      default: true
    },
  },

  data() {
    return {
      customInput: "",
      showPopper:true
    };
  },

  computed: {
    currentColor() {
      const parent = this.$parent;
      return !parent.value && !parent.showPanelColor ? "" : parent.color.value;
    },
  },

  methods: {
    clear(){
       this.$emit('clear')
    },
    confirmValue() {
      this.$emit("pick");
      // this.showPopper = false;
    },

    handleConfirm() {
      this.color.fromString(this.customInput);
    }
  },

  mounted() {
    // this.$parent.popperElm = this.popperElm = this.$el;
    // this.referenceElm = this.$parent.$el;
  },

  watch: {
    showPopper(val) {
      if (val === true) {
        this.$nextTick(() => {
          const { sl, hue, alpha } = this.$refs;
          sl && sl.update();
          hue && hue.update();
          alpha && alpha.update();
        });
      }
    },

    currentColor(val) {
      this.customInput = val;
    }
  }
};
</script>
<style>
.ms-color-picker__panel {
  position: fixed;
  z-index: 1003;
  padding: 6px;
  box-sizing: content-box;
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.ms-color-dropdown {
  width: 300px;
}
.ms-color-dropdown__main-wrapper {
  margin-bottom: 6px;
}
.ms-color-dropdown__main-wrapper:after {
  content: "";
  display: table;
  clear: both;
}

.ms-color-hue-slider.is-vertical {
  width: 12px;
  height: 180px;
  padding: 2px 0;
}
.ms-color-hue-slider {
  position: relative;
  box-sizing: border-box;
  width: 280px;
  height: 12px;
  background-color: red;
  padding: 0 2px;
}
.ms-color-hue-slider.is-vertical .ms-color-hue-slider__bar {
  background: linear-gradient(
    180deg,
    red 0,
    #ff0 17%,
    #0f0 33%,
    #0ff 50%,
    #00f 67%,
    #f0f 83%,
    red
  );
}
.ms-color-hue-slider__bar {
  position: relative;
  background: linear-gradient(
    90deg,
    red 0,
    #ff0 17%,
    #0f0 33%,
    #0ff 50%,
    #00f 67%,
    #f0f 83%,
    red
  );
  height: 100%;
}
.ms-color-hue-slider.is-vertical .ms-color-hue-slider__thumb {
  left: 0;
  top: 0;
  width: 100%;
  height: 4px;
}
.ms-color-hue-slider__thumb {
  position: absolute;
  cursor: pointer;
  box-sizing: border-box;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  border-radius: 1px;
  background: #fff;
  border: 1px solid #f0f0f0;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
  z-index: 1;
}

.ms-color-svpanel {
  position: relative;
  width: 280px;
  height: 180px;
}
.ms-color-svpanel__white {
  background: linear-gradient(90deg, #fff, hsla(0, 0%, 100%, 0));
}
.ms-color-svpanel__black,
.ms-color-svpanel__white {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.ms-color-svpanel__black {
  background: linear-gradient(0deg, #000, transparent);
}
.ms-color-svpanel__black,
.ms-color-svpanel__white {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.ms-color-svpanel__cursor {
  position: absolute;
}
.ms-color-svpanel__cursor > div {
  cursor: head;
  width: 4px;
  height: 4px;
  box-shadow: 0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0, 0, 0, 0.3),
    0 0 1px 2px rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  transform: translate(-2px, -2px);
}

.ms-color-alpha-slider {
  position: relative;
  box-sizing: border-box;
  width: 280px;
  height: 12px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);
}
.ms-color-alpha-slider__bar {
  position: relative;
  background: linear-gradient(90deg, hsla(0, 0%, 100%, 0) 0, #fff);
  height: 100%;
}
.ms-color-alpha-slider__thumb {
  position: absolute;
  cursor: pointer;
  box-sizing: border-box;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  border-radius: 1px;
  background: #fff;
  border: 1px solid #f0f0f0;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
  z-index: 1;
}

.ms-color-dropdown__btns {
  margin-top: 6px;
  text-align: right;
}
.ms-color-dropdown__value {
  float: left;
  line-height: 26px;
  font-size: 12px;
  color: #000;
  width: 160px;
}
.ms-zoom-in-top-enter-active,
.ms-zoom-in-top-leave-active {
  opacity: 1;
  transform: scaleY(1);
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1),
    opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: center top;
}
.ms-zoom-in-top-enter,
.ms-zoom-in-top-leave-active {
  opacity: 0;
  transform: scaleY(0);
}
</style>