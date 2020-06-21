<template>
  <div class="ms-input">
    <input
      :tabindex="tabindex"
      class="ms-input__inner"
      v-bind="$attrs"
      type="text"
      :readonly="readonly"
      :autocomplete="autocomplete"
      ref="input"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: [String, Number],
    readonly: Boolean,
    type: {
      type: String,
      default: "text"
    },
    autocomplete: {
      type: String,
      default: "off"
    },
    tabindex: String
  },
  data() {
    return {
      key: "value"
    };
  },
  mounted() {
    this.setNativeInputValue();
  },
  watch: {
    value(val) {
      if (this.validateEvent) {
        this.dispatch("ElFormItem", "el.form.change", [val]);
      }
    },
    // native input value is set explicitly
    // do not use v-model / :value in template
    // see: https://github.com/ElemeFE/element/issues/14521
    nativeInputValue() {
      this.setNativeInputValue();
		},
		
	},
	computed: {
		nativeInputValue() {
        return this.value === null || this.value === undefined ? '' : String(this.value);
      }
	},
  methods: {
    getInput() {
      return this.$refs.input;
    },
    setNativeInputValue() {
      const input = this.getInput();
      if (!input) return;
      if (input.value === this.nativeInputValue) return;
      input.value = this.nativeInputValue;
    },
    handleInput(event) {
      this.$emit("input", event.target.value);
    },
    handleChange(event) {
      this.$emit("change", event.target.value);
    },
    handleBlur(event) {
      this.focused = false;
      this.$emit("blur", event);
    },
    handleFocus(event) {
      this.focused = true;
      this.$emit("focus", event);
    }
  }
};
</script>

<style scoped>
.ms-input {
  position: relative;
  font-size: 14px;
  display: inline-block;
  width: 100%;
}
.ms-input__inner {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 28px;
  line-height: 28px;
  outline: none;
  padding: 0 8px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
}
.ms-input__inner:focus {
  outline: none;
  border-color: #409eff;
}
</style>