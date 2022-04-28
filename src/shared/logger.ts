/* 打个漂亮日志 */
import { lightBlue, lightGreen, lightRed, lightYellow } from 'kolorist';

const logger = {
  info(text: string) {
    console.log(lightBlue(`✈ - ${text}`));
  },
  success(text: string) {
    console.log(lightGreen(`✔ - ${text}`));
  },
  warn(text: string) {
    console.log(lightYellow(`▶ - ${text}`));
  },
  error(text: string) {
    console.log(lightRed(`✖  - ${text}`));
  }
};

export default logger;
