/* 入口 */
import { createApp } from 'vue'
import App from './App.vue'
// import '../lib/style.css'
import SketchRule from "./components/test2/HelloWorld.vue";
import moduleName from '@/api/aa';
const app = createApp(App)
// app.use(SketchRule);
import './mixins.js'
// const MyComponent = app.component('SketchRule')
// console.log(MyComponent, 'MyComponentMyComponent')
app.mount('#app')
