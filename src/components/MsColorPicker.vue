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
    value(val) {
      if (!val) {
      } else if (val && val !== this.color.value) {
        this.color.fromString(val);
      }
    },
    color: {
      deep: true,
      handler() {
        this.showPanelColor = true;
      }
    }
  },
  mounted() {
    const value = this.value;
    if (value) {
      this.color.fromString(value);
    }
    console.log('this.color', this.color)
  },
  methods: {
    confirm() {
      return this.color.value;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>