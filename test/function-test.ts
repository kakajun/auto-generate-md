

// import path from 'path';
import {getImportName } from '../src/commands/change-path';

const str = getImportName(`import history from '../WF/history.vue'`)

console.log(str)
