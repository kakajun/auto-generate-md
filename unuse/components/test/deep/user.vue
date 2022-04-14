//2工程
//2工程
ue2.0写法 */
<template>
  <div class="wrapper">
    <SketchRule
      :thick="thick"
      :scale="scale"
      :width="582"
      :height="482"
      :start-x="startX"
      :start-y="startY"
      :shadow="shadow"
      :hor-line-arr="lines.h"
      :ver-line-arr="lines.v"
      :corner-active="true"
      @handleLine="handleLine"
      @onCornerClick="handleCornerClick"
    >
    </SketchRule>
    <div
      id="screens"
      ref="screensRef"
      @wheel="handleWheel"
      @scroll="handleScroll"
    >
      <div ref="containerRef" class="screen-container">
        <div id="canvas" :style="canvasStyle" />
      </div>
    </div>
  </div>
</template>
<script>
import { businessUserInfo, updataUserInfo, addUserInfo } from '../../../../api/user.js'
export default {
  components: { SketchRule },
}
</script>
<style lang="scss">
body {
  padding: 0;
  margin: 0;
  overflow: hidden;
  font-family: sans-serif;
}

body * {
  box-sizing: border-box;
  user-select: none;
}

.wrapper {
  position: absolute;
  top: 100px;
  left: 100px;
  width: 600px;
  height: 500px;
  background-color: #f5f5f5;
  border: 1px solid #dadadc;
}

#screens {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.screen-container {
  position: absolute;
  width: 5000px;
  height: 3000px;
}

.scale-value {
  position: absolute;
  bottom: 100%;
  left: 0;
}

.button {
  position: absolute;
  bottom: 100%;
  left: 100px;
}

#canvas {
  position: absolute;
  top: 80px;
  left: 50%;
  width: 160px;
  height: 200px;
  margin-left: -80px;
  background: lightblue;
  transform-origin: 50% 0;
}
</style>

//1工程
//1工程
//2工程
//2工程
//2工程
//2工程
//2工程
//2工程
//2工程
//2工程
