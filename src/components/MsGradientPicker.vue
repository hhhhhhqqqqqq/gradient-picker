<template>
  <div
    class="gradientPickerC"
    v-clickoutside="hide"
    :id="id"
    :style="{height: cHeight ? cHeight : iconSize, width: cWidth ? cWidth : iconSize}"
  >
    <div class="gradientPicker-mask" v-show="disabled"></div>
    <div class="gradientPicker" @click.stop="showPanel">
      <!-- <div
        style="position:absolute;z-index:2;top: 50%;left: 50%;margin-left: -8px;margin-top: -9px;color: #fff;"
      >
        <i class="iconfont icon-jiantou"></i>
      </div>-->
      <div ref="trigger" class="gradientPicker_trigger"></div>
      <div class="blank-background"></div>
    </div>
    <!---->
    <transition name="fade">
      <div
        class="pickColorPanel"
        :style="{'left':popperLeft + 'px','top':popperTop + 'px'}"
        v-show="isShowPanel"
      >
        <div class="ms-tabs__nav">
          <div
            class="ms-tabs__nav-item"
            :class="{'isActive':currentTab === 'singer'}"
            @click="changeTab('singer')"
          >单色</div>
          <div
            class="ms-tabs__nav-item"
            :class="{'isActive':currentTab === 'gradient'}"
            @click="changeTab('gradient')"
          >渐变色</div>
        </div>
        <div class="ms-tabs__contents">
          <div v-show="currentTab === 'singer'">
            <MsColorPicker
              ref="singer"
              v-model="pickColor"
              :show-alpha="showAlpha"
              :predefine="predefine"
              @change="change"
            ></MsColorPicker>
          </div>
          <div v-show="currentTab === 'gradient'">
            <MsGradientPickerPanel
              ref="gradient"
              @mouseover="hideTooltip"
              :style="{top:showPanelTop +'px', left:showPanelLeft +'px'}"
            ></MsGradientPickerPanel>
          </div>
        </div>
        <div class="confirm-btn">
          <ms-button plain size="mini" @click="clear">清空</ms-button>
          <ms-button type="primary" size="mini" @click="confirm">确定</ms-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { getPopperPosition } from "../utils/utils";
import Clickoutside from "../utils/clickoutside";
import MsGradientPickerPanel from "./MsGradientPickerPanel";
import MsColorPicker from "./MsColorPicker";
import MsButton from "./ui/MsButton";
export default {
  components: {
    MsGradientPickerPanel,
    MsColorPicker,
    MsButton
  },
  props: {
    value: "",
    colorFormat: ""
  },
  data() {
    return {
      id: "222",
      cHeight: "40px",
      iconSize: "",
      cWidth: "100px",
      disabled: false,
      isShowPanel: false,
      showPanelTop: 100,
      showPanelLeft: 100,
      pickColor: "#000",
      showAlpha: true,
      currentTab: "singer",
      predefine: [
        "#ccc",
        "#f0f",
        "#d0e0e3",
        "#b4a7d6",
        "#6fa8dc",
        "#f1c232",
        "#674ea7",
        "#0b5394",
        "#7f6000",
        "#4c1130"
      ],
      popperTop: 0,
      popperLeft: 0
    };
  },
  directives: { Clickoutside },
  mounted() {},
  methods: {
    showPanel() {
      if (this.isShowPanel) {
        return (this.isShowPanel = false);
      }
      this.isShowPanel = true;
      this.$nextTick(() => {
        var el = document.querySelector(".gradientPickerC");
        var k = getPopperPosition(el, { width: 333, height: 360 });
        this.popperTop = k.top;
        this.popperLeft = k.left;
      });
    },
    hideTooltip() {},
    hide() {
      this.isShowPanel = false;
    },
    changeTab(tab) {
      this.currentTab = tab;
    },
    change(value) {
      console.log("value", value);
    },
    confirm: function() {
      let color;
      if (this.currentTab === "gradient") {
        color = this.$refs.gradient.confirm();
      } else {
        color = this.$refs.singer.confirm();
      }
      if (color instanceof Object) {
        let back = color.background;
        let background = back.map(item => {
          return { background: item };
        });
        this.$refs.trigger.style.background = background;
      } else {
        this.$refs.trigger.style.background = color;
      }
      console.log(color);
    },
    clear() {}
  }
};
</script>

<style scoped>
.gradientPickerC {
  display: inline-block;
  position: relative;
  line-height: normal;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  outline: none;
  font-size: 14px;
}

.gradientPicker-mask {
  background-color: rgba(255, 255, 255, 0.7);
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  cursor: not-allowed;
  z-index: 100;
}
.gradientPicker_trigger {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.blank-background {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);
}
.gradientPicker {
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: 3px;
  right: 3px;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  cursor: pointer;
}
.pickColorPanel {
  position: fixed;
  z-index: 1002;
  left: 100px;
  width: 320px;
  height: auto;
  background: #fff;
  border: 1px solid #dadada;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 6px;
}

.gradientPickerC .el-slider__runway.show-input {
  margin-right: 110px;
}

.gradientPickerC .el-tabs {
  position: relative !important;
}

.gradientPickerC .el-tabs.el-tabs__header {
  user-select: none;
}
.gradientPickerC .el-tabs .el-tabs__header .el-tabs__nav {
  border: 1px solid #e4e7ed;
  border-bottom: none;
}
.gradientPickerC .el-tabs .el-tabs__header .el-tabs__content {
  position: relative !important;
  top: 0 !important;
}
.gradientPickerC .el-slider__input {
  width: 100px;
}
.ms-tabs__nav {
  display: flex;
  justify-content: stretch;
  height: 40px;
  line-height: 40px;
  margin-bottom: 10px;
  border: 1px solid #e4e7ed;
  border-left: none;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  box-sizing: border-box;
}
.ms-tabs__nav-item {
  text-align: center;
  font-size: 14px;
  width: 100%;
  cursor: pointer;
  border-bottom: 1px solid #e4e7ed;
  border-left: 1px solid #e4e7ed;
  transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.ms-tabs__nav-item.isActive {
  color: #409eff;
  border-bottom-color: #fff;
}
.confirm-btn {
  height: 30px;
  /* position: absolute; */
  bottom: 6px;
  right: 6px;
  text-align: right;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>