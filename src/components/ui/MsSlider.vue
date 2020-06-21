<template>
  <div>
    <div role="slider" class="ms-slider">
      <div ref="slider" class="ms-slider__runway" @click="onSliderClick">
        <div class="ms-slider__bar" :style="barStyle"></div>
        <div
          tabindex="0"
          class="ms-slider__button-wrapper"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
          @mousedown="onButtonDown"
          @touchstart="onButtonDown"
          :class="{ 'hover': hovering, 'dragging': dragging }"
          :style="wrapperStyle"
          ref="button"
          @focus="handleMouseEnter"
          @blur="handleMouseLeave"
          @keydown.left="onLeftKeyDown"
          @keydown.right="onRightKeyDown"
          @keydown.down.prevent="onLeftKeyDown"
          @keydown.up.prevent="onRightKeyDown"
          style="left: 43%;"
        >
          <div class="ms-tooltip ms-slider__button"></div>
        </div>
      </div>
      <div class="ms-slider__input">
        <ms-input :min="min" :max="max" readonly type="number" v-model="value" />
      </div>
    </div>
  </div>
</template>

<script>
import MsInput from './MsInput';
export default {
  props: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    },
    value: {
      type: Number,
      default: 0
    }
  },
  components:{
    MsInput
  },
  data() {
    return {
      dragging: false,
      sliderSize: 1,
      isClick: false,
      hovering: false,
      startX: 0,
      currentX: 0,
      startPosition: 0,
      newPosition: null
    };
  },
  watch: {
    value(n) {
      console.log("n :>> ", n);
    }
  },
  computed: {
    barSize() {
      return `${(100 * (this.value - this.min)) / (this.max - this.min)}%`;
    },

    barStart() {
      return "0%";
    },

    barStyle() {
      return {
        width: this.barSize,
        left: this.barStart
      };
    },

    wrapperStyle() {
      return { left: this.currentPosition };
    },

    currentPosition() {
      return `${((this.value - this.min) / (this.max - this.min)) * 100}%`;
    },

    precision() {
      let precisions = [this.min, this.max, this.step].map(item => {
        let decimal = ("" + item).split(".")[1];
        return decimal ? decimal.length : 0;
      });
      return Math.max.apply(null, precisions);
    }
  },
  methods: {
    handleMouseEnter() {
      this.hovering = true;
      // this.displayTooltip();
    },

    handleMouseLeave() {
      this.hovering = false;
      // this.hideTooltip();
    },

    onButtonDown(event) {
      event.preventDefault();
      this.onDragStart(event);
      window.addEventListener("mousemove", this.onDragging);
      window.addEventListener("touchmove", this.onDragging);
      window.addEventListener("mouseup", this.onDragEnd);
      window.addEventListener("touchend", this.onDragEnd);
      window.addEventListener("contextmenu", this.onDragEnd);
    },

    onDragStart(event) {
      this.dragging = true;
      this.isClick = true;
      if (event.type === "touchstart") {
        event.clientY = event.touches[0].clientY;
        event.clientX = event.touches[0].clientX;
      }

      this.startX = event.clientX;

      this.startPosition = parseFloat(this.currentPosition);
      this.newPosition = this.startPosition;
    },

    onDragging(event) {
      if (this.dragging) {
        this.isClick = false;
        this.resetSize();
        let diff = 0;
        if (event.type === "touchmove") {
          event.clientY = event.touches[0].clientY;
          event.clientX = event.touches[0].clientX;
        }

        this.currentX = event.clientX;
        diff = ((this.currentX - this.startX) / this.sliderSize) * 100;

        this.newPosition = this.startPosition + diff;
        this.setPosition(this.newPosition);
        this.emitChange();
      }
    },

    onDragEnd() {
      if (this.dragging) {
        /*
         * 防止在 mouseup 后立即触发 click，导致滑块有几率产生一小段位移
         * 不使用 preventDefault 是因为 mouseup 和 click 没有注册在同一个 DOM 上
         */
        setTimeout(() => {
          this.dragging = false;
          if (!this.isClick) {
            this.setPosition(this.newPosition);
          }
        }, 0);
        window.removeEventListener("mousemove", this.onDragging);
        window.removeEventListener("touchmove", this.onDragging);
        window.removeEventListener("mouseup", this.onDragEnd);
        window.removeEventListener("touchend", this.onDragEnd);
        window.removeEventListener("contextmenu", this.onDragEnd);
      }
    },
    onLeftKeyDown() {
      this.newPosition =
        parseFloat(this.currentPosition) -
        (this.step / (this.max - this.min)) * 100;
      this.setPosition(this.newPosition);
      this.emitChange();
    },
    onRightKeyDown() {
      this.newPosition =
        parseFloat(this.currentPosition) +
        (this.step / (this.max - this.min)) * 100;
      this.setPosition(this.newPosition);
      this.emitChange();
    },
    setPosition(newPosition) {
      if (newPosition === null || isNaN(newPosition)) return;
      if (newPosition < 0) {
        newPosition = 0;
      } else if (newPosition > 100) {
        newPosition = 100;
      }
      const lengthPerStep = 100 / ((this.max - this.min) / this.step);
      const steps = Math.round(newPosition / lengthPerStep);
      let value =
        steps * lengthPerStep * (this.max - this.min) * 0.01 + this.min;
      value = parseFloat(value.toFixed(this.precision));
      this.$emit("input", value);
      // this.$nextTick(() => {
      //   this.displayTooltip();
      //   this.$refs.tooltip && this.$refs.tooltip.updatePopper();
      // });
      if (!this.dragging && this.value !== this.oldValue) {
        this.oldValue = this.value;
      }
    },
    onSliderClick(event) {
      if (this.dragging) return;
      this.resetSize();

      const sliderOffsetLeft = this.$refs.slider.getBoundingClientRect().left;
      this.setPosition(
        ((event.clientX - sliderOffsetLeft) / this.sliderSize) * 100
      );

      this.emitChange();
    },
    emitChange() {
      this.$nextTick(() => {
        this.$emit("change", this.value);
      });
    },
    resetSize() {
      this.sliderSize = this.$refs.slider.clientWidth;
    }
  }
};
</script>

<style scoped>
.ms-slider__runway {
  display: inline-block;
  width: calc(100% - 80px);
  height: 6px;
  margin: 16px 16px 16px 0;
  background-color: #e4e7ed;
  border-radius: 3px;
  position: relative;
  cursor: pointer;
  vertical-align: middle;
}
.ms-slider__bar {
  height: 6px;
  background-color: #409eff;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  position: absolute;
}
.ms-slider__button-wrapper {
  height: 30px;
  width: 30px;
  position: absolute;
  z-index: 1001;
  top: -12px;
  transform: translateX(-50%);
  background-color: transparent;
  text-align: center;
  user-select: none;
  line-height: normal;
}
.ms-slider__button {
  width: 12px;
  height: 12px;
  border: 2px solid #409eff;
  background-color: #fff;
  border-radius: 50%;
  transition: 0.2s;
  user-select: none;
  display: inline-block;
  vertical-align: middle;
}
.ms-slider__button-wrapper:after {
  content: "";
  height: 100%;
  display: inline-block;
  vertical-align: middle;
}
.ms-slider__input {
  display: inline-block;
  width: 50px;
}
.ms-slider__input input {
  width: 100%;
}
</style>