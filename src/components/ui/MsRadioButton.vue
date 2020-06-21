<template>
  <label
    class="ms-radio-button"
    :class="[
      size ? 'ms-radio-button--' + size : '',
      { 'is-active': value === label },
      { 'is-disabled': isDisabled },
      { 'is-focus': focus }
    ]"
    role="radio"
    :aria-checked="value === label"
    :aria-disabled="isDisabled"
    :tabindex="tabIndex"
    @keydown.space.stop.prevent="value = isDisabled ? value : label"
  >
    <input
      class="ms-radio-button__orig-radio"
      :value="label"
      type="radio"
      v-model="value"
      :name="name"
      @change="handleChange"
      :disabled="isDisabled"
      tabindex="-1"
      @focus="focus = true"
      @blur="focus = false"
    >
    <span
      class="ms-radio-button__inner"
      :style="value === label ? activeStyle : null"
      @keydown.stop>
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
<script>

  export default {
    name: 'MsRadioButton',
    props: {
      label: {},
      disabled: Boolean,
      name: String
    },
    data() {
      return {
        focus: false
      };
    },
    computed: {
      value: {
        get() {
          return this._radioGroup.value;
        },
        set(value) {
          this._radioGroup.$emit('input', value);
        }
      },
      _radioGroup() {  // 父组件
        let parent = this.$parent;
        while (parent) {
          if (parent.$options.componentName !== 'MsRadioGroup') {
            parent = parent.$parent;
          } else {
            return parent;
          }
        }
        return false;
      },
      activeStyle() {
        return {
          backgroundColor: this._radioGroup.fill || '',
          borderColor: this._radioGroup.fill || '',
          boxShadow: this._radioGroup.fill ? `-1px 0 0 0 ${this._radioGroup.fill}` : '',
          color: this._radioGroup.textColor || ''
        };
      },
      size() {
        return this._radioGroup.radioGroupSize
      },
      isDisabled() {
        return this.disabled || this._radioGroup.disabled 
      },
      tabIndex() {
        return (this.isDisabled || (this._radioGroup && this.value !== this.label)) ? -1 : 0;
      }
    },

    methods: {
      handleChange() {
        this.$nextTick(() => {
          this.$emit('handleChange', this.value);
        });
      }
    }
  };
</script>

<style>
  .ms-radio-group {
    display: inline-block;
    line-height: 1;
    vertical-align: middle;
    font-size: 0;
}

.ms-radio-button, .ms-radio-button__inner {
    position: relative;
    display: inline-block;
    outline: none;
}
.ms-radio-button__orig-radio {
    opacity: 0;
    outline: none;
    position: absolute;
    z-index: -1;
}
.ms-radio-button__inner {
    line-height: 1;
    white-space: nowrap;
    vertical-align: middle;
    background: #fff;
    border: 1px solid #dcdfe6;
    font-weight: 500;
    border-left: 0;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    margin: 0;
    cursor: pointer;
    transition: all .3s cubic-bezier(.645,.045,.355,1);
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 0;
}
.ms-radio-button, .ms-radio-button__inner {
    position: relative;
    display: inline-block;
    outline: none;
}
.ms-radio-button:last-child .ms-radio-button__inner {
    border-radius: 0 4px 4px 0;
}
.ms-radio-button__orig-radio:checked+.ms-radio-button__inner {
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
    box-shadow: -1px 0 0 0 #409eff;
}
.ms-radio-button--small .ms-radio-button__inner {
    padding: 9px 15px;
    font-size: 12px;
    border-radius: 0;
}
.ms-radio-button--mini .ms-radio-button__inner {
    padding: 7px 15px;
    font-size: 12px;
    border-radius: 0;
}
.ms-radio-button:first-child .ms-radio-button__inner {
    border-left: 1px solid #dcdfe6;
    border-radius: 4px 0 0 4px;
    box-shadow: none!important;
}
</style>
