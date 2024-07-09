const { createProxyMiddleware } = require("http-proxy-middleware");

///api로 시작하는 요청을 받아서 http://localhost:5000/api로 프록시
module.exports = function (app) {
  app.use(
    //api로 시작하는 모든 요청에 대해 미들웨어 적용
    "/api",
    //프록시 미들웨어 생성
    createProxyMiddleware({
      target: "http://localhost:5000/api", //api 경로로 들어오는 요청 http://localhost:5000으로 전달
      changeOrigin: true, //원본 서버에 전달되는 요청의 Host 헤더를 대상 서버의 도메인으로 변경
    })
  );
};
