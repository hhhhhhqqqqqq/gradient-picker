<template>
  <div>
    <!-- 操作按钮 -->
    <div class="operation">
      <ms-radio-group v-model="gradientType" size="mini">
        <ms-radio-button label="linear">线性</ms-radio-button>
        <ms-radio-button label="radial">径向</ms-radio-button>
      </ms-radio-group>
      <ms-switch v-model="reverse" active-text="反向" @change="reverseOp"></ms-switch>
    </div>
    <!-- 调色板 -->
    <div>
      <div ref="picker_con" class="gradientPicker_container">
        <div class="gradientPicker_panel">
          <canvas class="gradientPicker_canvas" @click="clickChangeColor" height="84" width="720"></canvas>
          <div class="panel_background"></div>
        </div>
        <div
          ref="slider_panel"
          class="gradientPicker_start_sliders"
          @click="addColorStop('#000', $event)"
          title="单击添加触点"
        >
          <div class="cp-default gradientPicker_slider_info" style="display: none;"></div>

          <div
            v-for="(item, index) in colorStopList"
            :key="index"
            class="gradientPicker_slider"
            :style="{left:calPosition(item.offset), borderColor: item.color, boxShadow:item === currentStop ? `0 0 2px ${item.color}`:'none'}"
            @mousedown.stop="currentEditorAndMove(item,$event)"
            @dblclick="showColorSelect"
            @click.stop
          >
            <div
              style="position:absolute;width:100%;height:100%;z-index:2;"
              :style="{background:item.color}"
            ></div>
            <div
              class="panel_background"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 颜色设置与预览  -->
    <div class="setting_container">
      <div class="color_setting">
        <div class="ms-row clearfix">
          <div class="ms-col-6">
            <span style="line-height:28px;">颜色：</span>
          </div>
          <div class="ms-col-18">
            <ColorPicker v-model="pickerColor" :predefine="colors" show-alpha @change="colorChange"></ColorPicker>
            <input type="text" class="gradientPicker-color-selector" style="display: none;" />
          </div>
        </div>
        <div class="ms-row clearfix">
          <div class="ms-col-6">
            <span style="line-height:38px;">位置：</span>
          </div>
          <div class="ms-col-18">
            <ms-slider
              v-model="currentStop.offset"
              @change="changeOffset"
              :step="0.01"
              :min="0"
              :max="1"
              show-input
              input-size="mini"
            ></ms-slider>
          </div>
        </div>
        <div class="ms-row clearfix" v-if="gradientType === 'radial'">
          <div class="ms-col-6">
            <span style="line-height:38px;">X轴：</span>
          </div>
          <div class="ms-col-18">
            <ms-slider v-model="cx" :min="0" :max="1" :step="0.01" show-input input-size="mini"></ms-slider>
          </div>
        </div>
        <div class="ms-row clearfix" v-if="gradientType === 'radial'">
          <div class="ms-col-6">
            <span style="line-height:38px;">Y轴：</span>
          </div>
          <div class="ms-col-18">
            <ms-slider v-model="cy" :min="0" :max="1" :step="0.01" show-input input-size="mini"></ms-slider>
          </div>
        </div>
        <div class="ms-row clearfix" v-if="gradientType === 'linear'">
          <div class="ms-col-6">
            <span style="line-height:38px;">角度：</span>
          </div>
          <div class="ms-col-18">
            <ms-slider v-model="angle" :min="0" :max="360" show-input input-size="mini"></ms-slider>
          </div>
        </div>
      </div>
      <div class="color_preview" ref="pp">
        <div class="gradientPicker_preview" :style="{'background': preview_color}"></div>
        <div class="preview_default_background"></div>
      </div>
    </div>
    <!-- 默认渐变色 -->
    <div class="default-color">
      <div
        v-for="(item,index) in defaultColorList"
        :key="index"
        @click="setdefaultColor(item)"
        class="color-item"
      >
        <div class="predefine__color" :style="{background:getColorByBrowser(item)}"></div>
        <div class="default-background"></div>
      </div>

      <div class="divider--vertical"></div>

      <div
        v-for="(item, index) in selectedColorList"
        :key="index"
        @click="setdefaultColor(item)"
        style="position:relative;height:16px;width:16px;display:inline-block;border-radius:3px;background:red;margin-right:2px;cursor:pointer;"
      >
        <div
          style="position:absolute;width:100%;height:100%;z-index:2;"
          :style="{background:getColorByBrowser(item)}"
        ></div>
        <div class="default-background"></div>
      </div>
    </div>
  </div>
</template>

<script>
import ColorPicker from "./ui/color-picker/src/main";

import MsRadioButton from "./ui/MsRadioButton";
import MsRadioGroup from "./ui/MsRadioGroup";
import MsSwitch from "./ui/MsSwitch";
import MsSlider from "./ui/MsSlider";
import { webBrowserType, DefaultColor, $extend } from "../utils/utils";
import draggable from "../utils/draggable";
export default {
  components: {
    ColorPicker,
    MsRadioButton,
    MsRadioGroup,
    MsSwitch,
    // ElSlider,
    MsSlider
  },
  props: {
    // sliderWidth:{  // 滑块的长度
    //   type: Number,
    //   default: 300
    // }
  },
  data() {
    return {
      defaultColorList: DefaultColor,
      selectedColorList: [],
      gradientType: "linear",
      reverse: true,
      angle: 90,
      cx: 0.5,
      cy: 0.5,
      cr: 0.5,
      moveStopClick: false,
      sliderValue: 0,
      sliderWidth: 310,
      rand_RGB: [],
      rand_pos: [],

      colorStopList: [],
      currentStop: {},
      pickerColor: "",
      colors: [
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
      preview_color: ""
    };
  },
  watch: {
    gradientType: function() {
      this.apply_style();
    },
    angle: function() {
      this.apply_style();
    },
    cx: function() {
      this.apply_style();
    },
    cy: function() {
      this.apply_style();
    }
    // pickerColor(newV) {
    //   this.currentStop.color = newV;
    //   this.apply_style();
    // }
  },
  mounted() {
    var width = this.$refs.picker_con.offsetWidth;
    if (width) {
      this.sliderWidth = width;
    }
  },
  methods: {
    registEvent() {
      var _this = this;
      document.addEventListener("keydown", function(e) {
        var dom = document.querySelector(".gradientPicker_start_sliders");
        if (!dom) {
          return false;
        }
        if (
          (e.keyCode === 46 || e.keyCode === 8) &&
          _this.currentStop != null
        ) {
          _this.deleteStop();
          e.preventDefault();
          e.stopPropagation();
        }
      });
    },
    colorChange(color) {
      this.currentStop.color = color;
      this.apply_style();
    },
    setdefaultColor(item) {
      this.colorStopList = $extend(true, [], item.colorStops);
      this.gradientType = "linear";
      this.currentStop = this.colorStopList[0];
      this.pickerColor = this.currentStop.color;
      this.apply_style();
      this.angle = 315;
    },
    // 反向
    reverseOp: function() {
      if (this.colorStopList == null || this.colorStopList.length == 0) {
        return;
      }
      for (var i = 0; i < this.colorStopList.length; i++) {
        var item = this.colorStopList[i];
        item.offset = Math.round((1 - item.offset) * 1000) / 1000;
      }
      this.apply_style();
    },
    getColorByBrowser(item) {
      var bg = item.background;
      var type = webBrowserType();
      var color = bg[0];
      if (type == "MSIE") {
        color = bg[2];
      } else if (type == "Firefox") {
        color = bg[1];
      } else if (type == "Opera") {
        color = bg[3];
      } else if (type == "Chrome" || type == "Safari") {
        color = bg[0];
      } else {
        color = bg[4];
      }
      return color;
    },
    addColorStop(color, e) {
      if (this.moveStopClick) {
        return;
      }

      var item = {
        color: this.get_random_rgb(),
        offset: this.get_random_position()
      };
      if (!(color instanceof Object)) {
        var panelPosition = this.$el
          .querySelector(".gradientPicker_panel")
          .getBoundingClientRect();
        e = this.fixE(e);
        item.offset =
          Math.round(
            ((e.clientX - parseInt(panelPosition.left)) * 1000) /
              (this.sliderWidth - 12)
          ) / 1000;
      }
      this.colorStopList.push(item);
      this.currentStop = item;
      this.pickerColor = item.color;
      this.apply_style();
    },
    confirm: function() {
      var gradien = this.get_style_value();
      var linearGradient = "",
        radialGradient = "";
    var option = {};
      if (this.colorStopList.length == 0) {
        option = null
        // this.$emit("input", null);
        // this.$emit("change", null);
      } else {
        if (gradien instanceof Array) {
          linearGradient = [
            "-webkit-linear-gradient(" + gradien[0] + ")",
            "-moz-linear-gradient(" + gradien[0] + ")",
            "-ms-linear-gradient(" + gradien[0] + ")",
            "-o-linear-gradient(" + gradien[0] + ")",
            "linear-gradient(" + gradien[3] + ")"
          ];

          radialGradient = [
            "-webkit-radial-gradient(" + gradien[1] + ")",
            "-moz-radial-gradient(" + gradien[1] + ")",
            "-ms-radial-gradient(" + gradien[1] + ")",
            "-o-radial-gradient(" + gradien[1] + ")",
            "radial-gradient(" + gradien[1] + ")"
          ];
          var option = {};
          option.colorStops = $extend(true, [], this.colorStopList);
          if (this.gradientType == "radial") {
            option.type = "radial";
            option.cx = this.cx;
            option.cy = this.cy;
            option.r = 0.5;
            option.background = radialGradient;
          } else {
            option.type = "linear";
            option.angle = this.angle;
            option.background = linearGradient;
          }
          // this.$emit("input", option);
          // this.$emit("change", option);
          console.log("option", option);
        } else {
          // this.$emit("input", gradien);
          // this.$emit("change", gradien);
          console.log("gradien", gradien);
          option = gradien
        }
      }
      return option
    },
    get_style_value: function() {
      var len = this.colorStopList.length;
      var ret = null;
      if (len === 1) {
        ret = this.colorStopList[0].color;
      } else {
        var style_str = "",
          suffix = "";
        for (var i = 0; i < len; i++) {
          if (this.colorStopList[i].offset == "") {
            style_str += suffix + this.colorStopList[i].color;
          } else {
            if (this.colorStopList[i].offset > 1) {
              this.colorStopList[i].offset = 1;
            }
            style_str += suffix + (this.colorStopList[i].color + " " +  this.colorStopList[i].offset * 100 + "%");
          }
          suffix = " , "; //add , from next iteration
        }

        ret = [];

        ret[0] = this.angle + "deg , " + style_str; //add
        //position, type size, [color stoppers],radial
        ret[1] = this.cx * 100 + "% " +  this.cy * 100 + "% , closest-side " + " , " + style_str;
        ret[2] = "0deg , " + style_str; //add

        ret[3] = 90 - this.angle + "deg , " + style_str; //add
      }

      return ret;
    },
    apply_style() {
      if (this.gdkDisabled) {
        return;
      }
      var linearGradient = "",
        radialGradient = "";

      var panelCanvas = this.$el
        .querySelector(".gradientPicker_canvas")
        .getContext("2d");

      if (this.colorStopList == null || this.colorStopList.length == 0) {
        this.currentStop = {};
        panelCanvas.clearRect(0, 0, 720, 84);
        this.preview_color = "transparent";
        return;
      }

      this.colorStopList.sort(function(A, B) {
        if (A.offset > B.offset) return 1;
        else return -1;
      });

      var gradien = this.get_style_value();

      if (gradien instanceof Array) {
        linearGradient = [
          "-webkit-linear-gradient(" + gradien[0] + ")",
          "-moz-linear-gradient(" + gradien[0] + ")",
          "-ms-linear-gradient(" + gradien[0] + ")",
          "-o-linear-gradient(" + gradien[0] + ")",
          "linear-gradient(" + gradien[3] + ")"
        ];

        radialGradient = [
          "-webkit-radial-gradient(" + gradien[1] + ")",
          "-moz-radial-gradient(" + gradien[1] + ")",
          "-ms-radial-gradient(" + gradien[1] + ")",
          "-o-radial-gradient(" + gradien[1] + ")",
          "radial-gradient(" + gradien[1] + ")"
        ];

        var grad = panelCanvas.createLinearGradient(0, 0, 720, 0);

        for (var i = 0; i < this.colorStopList.length; i++) {
          var item = this.colorStopList[i];
          grad.addColorStop(item.offset, item.color);
        }
        panelCanvas.clearRect(0, 0, 720, 84);
        panelCanvas.fillStyle = grad;
        panelCanvas.fillRect(0, 0, 720, 84);

        var len = linearGradient.length;
        while (len > 0) {
          len--;
          if (this.gradientType == "radial") {
            this.preview_color = radialGradient[len];
          } else {
            this.preview_color = linearGradient[len];
          }
        }
      } else {
        //只有一个触点，为纯色
        panelCanvas.clearRect(0, 0, 720, 84);
        panelCanvas.fillStyle = gradien;
        panelCanvas.fillRect(0, 0, 720, 84);
        this.preview_color = gradien;
      }
    },
    clickChangeColor: function(e) {
      if (this.currentStop == null) {
        return;
      }
      var panelOffset = this.$el.querySelector(".gradientPicker_panel")
        .offsetLeft;
      var x = Math.round((e.x - parseInt(panelOffset.left)) * 2);
      var y = Math.round((e.y - parseInt(panelOffset.top)) * 2);

      var panelCanvas = e.currentTarget;

      var color = this.getPixelColor(panelCanvas, x, y).rgba;

      if (color != "rgba(0,0,0,0)") {
        this.pickerColor = color;
      }
    },
    getPixelColor: function(canvas, x, y) {
      var thisContext = canvas.getContext("2d");
      var imageData = thisContext.getImageData(x, y, 1, 1);
      // 获取该点像素数据
      var pixel = imageData.data;
      var r = pixel[0];
      var g = pixel[1];
      var b = pixel[2];
      var a = pixel[3] / 255;
      a = Math.round(a * 100) / 100;
      var rHex = r.toString(16);
      r < 16 && (rHex = "0" + rHex);
      var gHex = g.toString(16);
      g < 16 && (gHex = "0" + gHex);
      var bHex = b.toString(16);
      b < 16 && (bHex = "0" + bHex);
      var rgbaColor = "rgba(" + r + "," + g + "," + b + "," + a + ")";
      var rgbColor = "rgb(" + r + "," + g + "," + b + ")";
      var hexColor = "#" + rHex + gHex + bHex;
      return {
        rgba: rgbaColor,
        rgb: rgbColor,
        hex: hexColor,
        r: r,
        g: g,
        b: b,
        a: a
      };
    },
    fixE: function(e) {
      if (typeof e == "undefined") e = window.event;
      if (typeof e.layerX == "undefined") e.layerX = e.offsetX;
      if (typeof e.layerY == "undefined") e.layerY = e.offsetY;
      return e;
    },

    showColorSelect: function() {
      // $(this.$el)
      //   .find(".gradientPicker-color-selector")
      //   .spectrum("show");
    },
    currentEditorAndMove: function(item, e) {
      
      this.registEvent();
      console.log("object");
      this.currentStop = item;
      this.pickerColor = item.color;

      var obj = e.currentTarget;
      this.currentTarget = obj;

      var { slider_panel } = this.$refs;

      // 定义可拖动的最大值
      var maxX = slider_panel.offsetWidth + 10 || 320,
        minX = 0;

      e = this.fixE(e);

      // 当前滑块相对于拖动条的位置
      var x = parseInt(obj.offsetLeft);

      // 鼠标拖动开始时的位置
      var lastMouseX = e.clientX;
      var lastMouseY = e.clientY;

      var removeMouseY = e.clientY;

      // 计算出可拖动的范围
      var minMouseX, maxMouseX;

      if (minX != null) minMouseX = e.clientX - x + minX;
      if (maxX != null) maxMouseX = minMouseX + maxX - minX;

      // 保存开始拖动时的鼠标位置，和最小，最大的拖动距离
      this.dragStartPosition = {
        lastMouseX,
        lastMouseY,
        minMouseX,
        maxMouseX,
        removeMouseY
      };
      const dragConfig = {
        drag: event => {
          this.handleDrag(event);
        },
        end: event => {
          this.handleEnd(event);
        },
        immediate: true
      };
      // 鼠标按下时绑定拖动事件，鼠标松开后解绑事件
      draggable(obj, dragConfig);
    },
    handleDrag(e) {
      // 禁止添加新的触点
      this.moveStopClick = true;

      var { lastMouseX, minMouseX, maxMouseX } = this.dragStartPosition;

      var ex = e.clientX;

      ex = Math.max(ex, minMouseX);
      ex = Math.min(ex, maxMouseX);

      this.currentStop.offset += (ex - lastMouseX) / this.sliderWidth;

      this.dragStartPosition.lastMouseX = ex;
      this.apply_style();
    },
    handleEnd(e) {
      var { removeMouseY } = this.dragStartPosition;

      this.currentStop.offset =
        Math.round(this.currentStop.offset * 1000) / 1000;

      setTimeout(() => {
        this.moveStopClick = false;
      }, 200);

      if (e.clientY - removeMouseY >= 20) {
        this.deleteStop();
      }

      this.currentTarget = null;
    },
    deleteStop() {
      var cslen = this.colorStopList.length;
      var current = this.currentStop;
      if (cslen == 0) {
        return;
      }

      for (var i = 0; i < this.colorStopList.length; i++) {
        var item = this.colorStopList[i];
        if (current == item) {
          this.colorStopList.splice(i, 1);
          break;
        }
      }

      if (cslen > this.colorStopList.length) {
        this.currentStop = this.colorStopList[0];
        this.pickerColor =
          (this.currentStop && this.currentStop.color) || "#000000";
        this.apply_style();
      }
    },
    // 生成随机色
    get_random_rgb() {
      var R, G, B, color;

      do {
        R = parseInt(Math.random() * 255);
        G = parseInt(Math.random() * 255);
        B = parseInt(Math.random() * 255);

        color = "rgb(" + R + ", " + G + ", " + B + ")";
      } while (this.rand_RGB.indexOf(color) > -1);

      this.rand_RGB.push(color);
      return color;
    },
    // 生成随机位置
    get_random_position() {
      var pos;

      do {
        pos = parseInt(Math.random() * 100) / 100;
      } while (this.rand_pos.indexOf(pos) > -1);

      this.rand_pos.push(pos);
      return pos;
    },
    calPosition: function(offset) {
      return offset * (this.sliderWidth - 12) + "px";
    },
    changeOffset: function() {
      this.apply_style();
    }
  }
};
</script>

<style scoped>
.color-item {
  position: relative;
  height: 20px;
  width: 20px;
  display: inline-block;
  border-radius: 4px;
  background: red;
  margin: 0 0 0 8px;
  cursor: pointer;
}
.color-item:first-child {
  margin-left: 0;
}
.divider--vertical {
  height: 16px;
  width: 1px;
  display: inline-block;
  background: #e4e7ed;
  margin-right: 2px;
}
.default-background {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);
}
.gradientPicker_container {
  position: relative;
  background: white;
  border: 5px solid #fff;
  border-radius: 2px;
  -webkit-border-radius: 2px;
  -moz-border-radius: 2px;
  -o-border-radius: 2px;
}
.gradientPicker_panel {
  margin: 0 5px;
  /* width: calc(100% -12px); */
  height: 42px;
  /* border: 1px solid #ccc; */
  position: relative;
  box-sizing: content-box;
}
.gradientPicker_canvas {
  width: 100%;
  height: 42px;
  cursor: crosshair;
  position: absolute;
  left: 0px;
  top: 0px;
  z-index: 2;
}
.default-color {
  padding: 6px;
}
.predefine__color {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  border-radius: 4px;
}
.operation {
  padding: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.panel_background {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);
}
.gradientPicker_start_sliders {
  width: 100%;
  /* background: #eee; */
  height: 17px;
  /* border: 1px solid #eee; */
  cursor: pointer;
}
.gradientPicker_slider {
  position: absolute;
  cursor: default;
  transition: border 0.3s, box-shadow 0.3s;
  left: 0px;
  top: 47px;
  width: 10px;
  height: 10px;
  background: red;
  /* border: 1px solid #d0d0d0; */
  display: inline-block;
}
.gradientPicker_slider:after {
  position: absolute;
  top: -10px;
  left: 0;
  display: block;
  content: "";
  width: 0;
  height: 0;
  border: 5px solid #666;
  border-color: inherit;
  border-top-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
  z-index: 100;
}
.color_preview {
  position: relative;
  margin-left: 10px;
  height: 70px;
  width: 70px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
}
.preview_default_background {
  position: absolute;
  height: 60px;
  width: 60px;
  top: 5px;
  left: 5px;
  border-radius: 4px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);
}
.gradientPicker_preview {
  position: absolute;
  height: 60px;
  width: 60px;
  top: 5px;
  left: 5px;
  border-radius: 4px;
  z-index: 2;
}
.color_setting {
  width: 235px;
}
.setting_container {
  display: flex;
  justify-content: flex-start;
  text-align: left;
}
.ms-row {
  display: flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  padding-left: 6px;
}
.ms-col-6 {
  width: 25%;
  /* float: left; */
}
.ms-col-18 {
  width: 75%;
  /* float: left; */
}
.clearfix:after {
  content: "020";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.clearfix {
  /* 触发 hasLayout */
  zoom: 1;
}
</style>