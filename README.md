# 번역 기여하기

[https://graphql-kr.github.io/](https://graphql-kr.github.io/) 페이지는 github pages를 통해 `master` 브랜치에 배포되며, 개발은 `develop`브랜치에서 합니다.

이 사이트는 React로 작성되었으며 문서 마크다운 파일들은 `site/` 아래에 있습니다.

### 가이드

이 레포지토리를 클론합니다.

```sh
$ git clone https://github.com/graphql-kr/graphql-kr.github.io.git
```

`develop` 브랜치로 체크아웃합니다

```sh
$ git checkout develop
```

의존성들을 설치합니다.

```sh
$ npm i
```

의존성 설치가 완료되면 개발서버를 실행합니다.

```sh
$ npm start
```

이제 [http://localhost:8444/](http://localhost:8444/) 를 열면 이 웹사이트가 로컬에서 실행됩니다.

내용을 변경한 후 이 레포지토리에 Pull Request 합니다.
