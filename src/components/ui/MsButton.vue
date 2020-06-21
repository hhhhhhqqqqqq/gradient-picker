<template>
  <button
    class="ms-button"
    @click="handleClick"
    :class="[
      type ? 'ms-button--' + type : '',
      size ? 'ms-button--' + size : '',
      {
        'is-plain': plain,
      }
    ]"
  >
    <span v-if="$slots.default">
      <slot></slot>
    </span>
  </button>
</template>

<script>
export default {
  name: "MsButton",
  props: {
    type: {
      type: String,
      default: "default"
    },
    size: String,
    loading: Boolean,
    disabled: Boolean,
    plain: Boolean
  },
  methods: {
    handleClick(evt) {
      this.$emit("click", evt);
    }
  }
};
</script>

<style scoped>
.ms-button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}
.ms-button--primary {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}
.ms-button--mini,
.ms-button--small {
  font-size: 12px;
  border-radius: 3px;
}
.ms-button + .ms-button {
  margin-left: 10px;
}
.ms-button--mini,
.ms-button--mini.is-round {
  padding: 7px 15px;
}
.ms-button--text {
  border-color: transparent;
  color: #409eff;
  background: transparent;
  padding-left: 0;
  padding-right: 0;
}
.ms-button.is-plain:focus,
.ms-button.is-plain:hover {
  background: #fff;
  border-color: #409eff;
  color: #409eff;
}

.ms-button--primary:focus,
.ms-button--primary:hover {
  background: #66b1ff;
  border-color: #66b1ff;
  color: #fff;
}
</style>