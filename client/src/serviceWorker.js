// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://bit.ly/CRA-PWA

// 서비스 워커 - 웹 애플리케이션의 오프라인 기능을 지원하고 성능을 향상시키는 도구
//애플리케이션이 오프라인에서도 동작할 수 있는 PWA(Progressive Web App)로 동작하도록 함

//현재 애플리케이션이 로컬 서버에서 실행 중인지 확인하는 변수
//localhost, IPv6의 ::1, IPv4의 127.0.0.1  확인
const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

//서비스 워커 등록하는 함수
export function register(config) {
  //현재 환경이 프로덕션인지 && 브라우저가 서비스 워커를 지원하는지를 확인
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    // The URL constructor is available in all browsers that support SW.
    // process.env.PUBLIC_URL : 애플리케이션의 공용 URL
    // window.location.href : 현재 페이지의 전체 URL
    // process.env.PUBLIC_URL을 기준 URL인 window.location.href에 상대적으로 결합하여 절대 URL생성
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);

    // publicUrl의 원본과 현재 페이지의 원본이 다른지 확인 (동일한 원본 아니면, 서비스 워커 등록하지 않음)
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebook/create-react-app/issues/2374
      return;
    }

    //페이지가 완전히 로드된 후에 서비스 워커 등록
    window.addEventListener("load", () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`; //서비스 워커 파일의 URL 설정

      //로컬 호스트(localhost)에서 실행 중인 경우
      if (isLocalhost) {
        // This is running on localhost. Let's check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, config); //서비스 워커가 유효한지 확인

        // Add some additional logging to localhost, pointing developers to the
        // service worker/PWA documentation.
        // 서비스 워커가 준비되면 추가적인 로그를 출력
        navigator.serviceWorker.ready.then(() => {
          console.log(
            "This web app is being served cache-first by a service " +
              "worker. To learn more, visit https://bit.ly/CRA-PWA"
          );
        });
      } else {
        // Is not localhost. Just register service worker
        // 로컬 호스트가 아닌 경우, 서비스 워커를 바로 등록
        registerValidSW(swUrl, config);
      }
    });
  }
}

//유효한 서비스 워커 등록하는 함수
function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl) //swUrl에 있는 서비스 워커 파일을 등록(등록이 성공하면 registration 객체와 함께 .then 블록이 실행)
    .then((registration) => {
      //새로운 서비스 워커가 발견되었을 때 호출
      registration.onupdatefound = () => {
        const installingWorker = registration.installing; //현재 설치 중인 서비스 워커
        //installingWorker가 null이면 아무 작업도 하지 않고 종료
        if (installingWorker == null) {
          return;
        }
        //서비스 워커의 상태가 변할 때 호출
        installingWorker.onstatechange = () => {
          //서비스 워커가 설치되었을 때 실행
          if (installingWorker.state === "installed") {
            //이전 서비스 워커가 현재 활성화된 상태면
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              // 새 콘텐츠는 모든 탭이 닫힌 후에야 사용됨
              console.log(
                "New content is available and will be used when all " +
                  "tabs for this page are closed. See https://bit.ly/CRA-PWA."
              );

              // Execute callback
              //config 객체에 onUpdate 함수가 정의되어 있으면, 그 함수를 호출
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.

              //navigator.serviceWorker.controller가 존재하지 않으면
              //모든 콘텐츠가 오프라인 사용을 위해 캐시되었음을 의미
              console.log("Content is cached for offline use.");

              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error("Error during service worker registration:", error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  // Check if the service worker can be found. If it can't reload the page.
  // swUrl을 통해 네트워크 요청을 보냄 (서비스 워커 파일을 가져오는 비동기 작업)
  fetch(swUrl)
    .then((response) => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get("content-type"); //응답 헤더에서 콘텐츠 유형 가져옴
      //응답 상태 코드가 404이거나, contentType이 null이 아니고 'javascript'를 포함하지 않는 경우 확인
      //참이면 유효한 서비스 워커 파일이 아님
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf("javascript") === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        //유효하지 않은 서비스 워커가 발견된 경우,
        // navigator.serviceWorker.ready를 사용하여 서비스 워커가 준비되었는지 확인
        navigator.serviceWorker.ready.then((registration) => {
          //unregister 메서드를 호출하여 현재 등록된 서비스 워커를 등록 해제
          registration.unregister().then(() => {
            //페이지를 다시 로드
            window.location.reload();
          });
        });
      } else {
        // 유효한 서비스 워커가 발견된 경우, registerValidSW 함수를 호출하여 서비스 워커를 정상적으로 등록
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        "No internet connection found. App is running in offline mode."
      );
    });
}

// 서비스워커 등록 해제
export function unregister() {
  //navigator 객체에 serviceWorker 속성이 있는지 확인(현재 브라우저가 서비스 워커를 지원하는지 확인)
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}
