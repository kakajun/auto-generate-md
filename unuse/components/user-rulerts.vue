
<script lang="ts">
// import { SketchRule } from 'vue3-sketch-ruler'
// import 'vue3-sketch-ruler/lib/style.css'
// import { SketchRule } from '../../lib/index.es'
// import '/lib/style.css'
import {
  computed,
  defineComponent,
  ref,
  reactive,
  onMounted,
  nextTick,
} from "vue";
import { SketchRule } from "../test/deep/user.vue"; // 这里可以换成打包后的

const rectWidth = 600;
const rectHeight = 320;
export default defineComponent({
  components: { SketchRule },
  setup() {
    const screensRef = ref(null);
    const containerRef = ref(null);
    const state = reactive({
      scale: 2, //658813476562495, //1,
      startX: 0,
      startY: 0,
      lines: {
        h: [433, 588],
        v: [33, 143],
      },
      thick: 20,
      isShowRuler: true, // 显示标尺
      isShowReferLine: true, // 显示参考线
    });
    const shadow = computed(() => {
      return {
        x: 0,
        y: 0,
        width: rectWidth,
        height: rectHeight,
      };
    });
    const canvasStyle = computed(() => {
      return {
        width: rectWidth,
        height: rectHeight,
        transform: `scale(${state.scale})`,
      };
    });
    onMounted(() => {
      // 滚动居中
      screensRef.value.scrollLeft =
        containerRef.value.getBoundingClientRect().width / 2 - 400;
    });

    const handleScroll = () => {
      const screensRect = document
        .querySelector("#screens")
        .getBoundingClientRect();
      const canvasRect = document
        .querySelector("#canvas")
        .getBoundingClientRect();

      // 标尺开始的刻度
      const startX =
        (screensRect.left + state.thick - canvasRect.left) / state.scale;
      const startY =
        (screensRect.top + state.thick - canvasRect.top) / state.scale;
      state.startX = startX;
      state.startY = startY;
    };
    // 控制缩放值
    const handleWheel = (e: {
      ctrlKey: any;
      metaKey: any;
      preventDefault: () => void;
      deltaY: number;
    }) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const nextScale = parseFloat(
          Math.max(0.2, state.scale - e.deltaY / 500).toFixed(2)
        );
        state.scale = nextScale;
      }
      nextTick(() => {
        handleScroll();
      });
    };

    return {
      screensRef,
      containerRef,
      state,
      shadow,
      canvasStyle,
      handleWheel,
      handleScroll,
    };
  },
});
</script>
//2工程
