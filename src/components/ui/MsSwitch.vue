<template>
  <div
    class="ms-switch"
    :class="{ 'is-disabled': switchDisabled, 'is-checked': checked }"
    role="switch"
    :aria-checked="checked"
    :aria-disabled="switchDisabled"
    @click.prevent="switchValue"
  >
    <input
      class="ms-switch__input"
      type="checkbox"
      @change="handleChange"
      ref="input"
      :true-value="activeValue"
      :false-value="inactiveValue"
      :disabled="switchDisabled"
      @keydown.enter="switchValue"
    />
    <span
      :class="['ms-switch__label', 'ms-switch__label--left', !checked ? 'is-active' : '']"
      v-if="inactiveText"
    >
      <span :aria-hidden="checked">{{ inactiveText }}</span>
    </span>
    <span class="ms-switch__core" ref="core" :style="{ 'width': coreWidth + 'px' }"></span>
    <span
      :class="['ms-switch__label', 'ms-switch__label--right', checked ? 'is-active' : '']"
      v-if="activeText"
    >
      <span :aria-hidden="!checked">{{ activeText }}</span>
    </span>
  </div>
</template>
<script>
export default {
  name: "ElSwitch",
  props: {
    value: {
      type: [Boolean, String, Number],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 40
    },
    activeText: String,
    inactiveText: String,
    activeColor: {
      type: String,
      default: ""
    },
    inactiveColor: {
      type: String,
      default: ""
    },
    activeValue: {
      type: [Boolean, String, Number],
      default: true
    },
    inactiveValue: {
      type: [Boolean, String, Number],
      default: false
    }
  },
  data() {
    return {
      coreWidth: this.width
    };
  },
  created() {
    if (!~[this.activeValue, this.inactiveValue].indexOf(this.value)) {
      this.$emit("input", this.inactiveValue);
    }
  },
  computed: {
    checked() {
      return this.value === this.activeValue;
    },
    switchDisabled() {
      return this.disabled;
    }
  },
  watch: {
    checked() {
      this.$refs.input.checked = this.checked;
      if (this.activeColor || this.inactiveColor) {
        this.setBackgroundColor();
      }
      if (this.validateEvent) {
        this.dispatch("ElFormItem", "el.form.change", [this.value]);
      }
    }
  },
  methods: {
    handleChange(event) {
      const val = this.checked ? this.inactiveValue : this.activeValue;
      this.$emit("input", val);
      this.$emit("change", val);
      this.$nextTick(() => {
        // set input's checked property
        // in case parent refuses to change component's value
        this.$refs.input.checked = this.checked;
      });
    },
    setBackgroundColor() {
      let newColor = this.checked ? this.activeColor : this.inactiveColor;
      this.$refs.core.style.borderColor = newColor;
      this.$refs.core.style.backgroundColor = newColor;
    },
    switchValue() {
      !this.switchDisabled && this.handleChange();
    },
    getMigratingConfig() {
      return {
        props: {
          "on-color": "on-color is renamed to active-color.",
          "off-color": "off-color is renamed to inactive-color.",
          "on-text": "on-text is renamed to active-text.",
          "off-text": "off-text is renamed to inactive-text.",
          "on-value": "on-value is renamed to active-value.",
          "off-value": "off-value is renamed to inactive-value.",
          "on-icon-class": "on-icon-class is renamed to active-icon-class.",
          "off-icon-class": "off-icon-class is renamed to inactive-icon-class."
        }
      };
    }
  },
  mounted() {
    /* istanbul ignore if */
    this.coreWidth = this.width || 40;
    if (this.activeColor || this.inactiveColor) {
      this.setBackgroundColor();
    }
    this.$refs.input.checked = this.checked;
  }
};
</script>
<style>
.ms-switch {
  display: inline-flex;
  align-items: center;
  position: relative;
  font-size: 14px;
  line-height: 20px;
  height: 20px;
  vertical-align: middle;
}
.ms-switch__input {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    margin: 0;
}
.ms-switch.is-checked .ms-switch__core {
    border-color: #409eff;
    background-color: #409eff;
}
.ms-switch__core {
    margin: 0;
    display: inline-block;
    position: relative;
    width: 40px;
    height: 20px;
    border: 1px solid #dcdfe6;
    outline: none;
    border-radius: 10px;
    box-sizing: border-box;
    background: #dcdfe6;
    cursor: pointer;
    transition: border-color .3s,background-color .3s;
    vertical-align: middle;
}
.ms-switch__core:after {
    content: "";
    position: absolute;
    top: 1px;
    left: 1px;
    border-radius: 100%;
    transition: all .3s;
    width: 16px;
    height: 16px;
    background-color: #fff;
}
.ms-switch.is-checked .ms-switch__core:after {
    left: 100%;
    margin-left: -17px;
}
</style>
