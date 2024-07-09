//process.env.NODE_ENV가 development모드일 때는 development라고 나오고
//deploy한 이후에는 production이라고 나옴
//개발 환경과 배포 환경에서 각각 다른 설정 파일 사용

if (process.env.NODE_ENV === "production") {
  module.exports = require("./prod");
} else {
  module.exports = require("./dev");
}
