<template>
  <div>
    <pickerDropdown
      ref="dropdown"
      class="ms-color-picker__panel"
      style="position:relative;border:0;box-shadow:none"
      v-model="showPicker"
      :color="color"
      :show-alpha="showAlpha"
      :showControl="false"
      :predefine="predefine"
    ></pickerDropdown>
  </div>
</template>

<script>
import Color from "./ui/color-picker/src/color";
import pickerDropdown from "./ui/color-picker/src/components/picker-dropdown";
export default {
  props: {
    value: String,
    showAlpha: Boolean,
    colorFormat: String,
    disabled: Boolean,
    size: String,
    popperClass: String,
    predefine: Array
  },
  components: {
    pickerDropdown
  },
  data() {
    const color = new Color({
      enableAlpha: this.showAlpha,
      format: this.colorFormat
    });
    return {
      color,
      showPicker: true,
      showPanelColor: false
    };
  },
  watch: {
    color: {
      handler(newVal) {
        this.$emit("change", newVal.value);
      },
      deep: true
    }
  },
  methods: {
    confirm(){
      return this.color.value
    }
    // confirmValue() {
    //   this.$emit("input", this.color.value);
    //   this.$emit("change", this.color.value);
    //   this.showPicker = false;
    // },
    // clearValue() {
    //   this.$emit("input", null);
    //   this.$emit("change", null);
    //   this.showPanelColor = false;
    //   this.showPicker = false;
    //   this.resetColor();
    // }
  }
};
</script>

<style lang="scss" scoped>
</style>