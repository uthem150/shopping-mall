### ⚙️ 개발 환경

- Server : nodeJS
- Client : React
- Database : MongoDB

---

### 📌 to start...

- /server/config 경로 안에 dev.js 파일 생성

- mongoDB 정보를 dev.js 파일에 넣음

```
module.exports = {
  mongoURI:
    "mongodb+srv://...",
};

- 루트 디렉터리에서 "npm install"을 입력(server 종속성 다운로드)
- client 디렉토리 내부에 "npm install" 입력(front-end 종속성 다운로드)
```
