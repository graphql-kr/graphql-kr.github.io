---
title: HTTP를 통한 서빙
layout: ../_core/DocsLayout
category: Best Practices
permalink: /learn/serving-over-http/
next: /learn/authorization/
---

GraphQL을 사용할 때 편재성 때문에 클라이언트-서버 통신 프로토콜에서 가장 일반적으로 사용되는 것이 HTTP입니다. 다음은 HTTP를 통해 작동하도록 GraphQL 서버를 설정하기 위한 몇 가지 가이드라인입니다.

## Web Request Pipeline
대부분의 최신 웹 프레임 워크는 요청이 미들웨어 스택(필터/플러그인)을 통과하는 파이프라인 모델을 사용합니다. 요청이 파이프라인을 통해 흐를 때 응답으로 검사, 변환, 수정, 종료 할 수 있습니다. GraphQL은 모든 인증 미들웨어의 뒤쪽에 있어야하므로 HTTP 엔드포인트 핸들러에서와 동일한 세션 및 사용자 정보에 액세스 할 수 있습니다.

## URIs, Routes
HTTP는 일반적으로 자원을 핵심 개념으로 사용하는 REST와 관련이 있습니다. 반대로 GraphQL의 개념 모델은 엔티티 그래프입니다. 결과적으로 GraphQL의 엔티티는 URL로 식별되지 않습니다. 대신 GraphQL 서버는 단일 URL/endpoint(보통 `/graphql`)에서 작동하며 주어진 서비스에 대한 모든 GraphQL 요청은 이 엔드포인트에서 수행되어야 합니다.

## HTTP Methods, Headers, and Body
GraphQL HTTP 서버는 HTTP GET, POST 메서드를 처리해야합니다.

### GET request

HTTP GET 요청을 수신하면 GraphQL 쿼리를 `query` 문자열에 지정해야합니다. 예를 들어, 다음 GraphQL 쿼리를 실행하고자 한다면,

```graphql
{
  me {
    name
  }
}
```

이 요청은 다음과 같이 HTTP GET을 통해 전송될 수 있습니다.

```
http://myapi/graphql?query={me{name}}
```

쿼리 변수는 `variables` 라는 추가 쿼리 매개변수에서 JSON 인코딩 문자열로 보낼 수 있습니다. 쿼리에 여러 개의 명명된 연산이 포함되어 있으면 `operationName` 쿼리 매개 변수를 사용하여 어느 것을 실행해야 하는지 제어 할 수 있습니다.

### POST request

표준 GraphQL POST 요청은 `application/json` 콘텐트 타입을 사용해야하며 다음 형식의 JSON 인코딩 바디을 포함해야합니다.

```js
{
  "query": "...",
  "operationName": "...",
  "variables": { "myVariable": "someValue", ... }
}
```

`operationName` 과 `variables` 는 옵션 필드입니다. `operationName` 은 쿼리에 여러 연산이있는 경우에만 필요합니다.

위 내용 외에도 추가로 두 가지 경우를 지원하는 것이 좋습니다.

* `query` 쿼리 문자열 매개변수가 있는 경우 (위 GET 예제와 같이) HTTP GET의 경우와 같은 방식으로 구문 분석되고 처리되어야 합니다.

* `application/graphql` Content-Type header가 있는 경우 HTTP POST 본문 내용을 GraphQL 쿼리 문자열로 처리하세요.

`express-graphql` 에는 이러한 것들이 이미 구현되어 있습니다.

## Response

쿼리와 변수가 전송된 방법에 관계없이 응답은 요청 바디에 JSON 형식으로 반환되어야합니다. 명세에서 언급했듯이 쿼리는 데이터와 오류를 유발할 수 있으며 이러한 오류는 다음과 같은 JSON 객체 형식으로 반환되어야합니다.

```js
{
  "data": { ... },
  "errors": [ ... ]
}
```

오류가 없는 경우 응답에 `"errors"` 필드가 없어야합니다. 데이터가 반환되지 않으면 [GraphQL 명세에 따라서](http://facebook.github.io/graphql/#sec-Data), `"data"` 필드는 실행 중에 에러가 발생했을 때만 포함되어야합니다.

## GraphiQL
GraphiQL은 테스트 및 개발 중에 유용하지만 기본적으로 프로덕션 환경에서 사용하지 않도록 설정해야합니다. `express-graphql` 을 사용하는 경우 NODE_ENV 환경 변수에 따라 토글 할 수 있습니다.

```
app.use('/graphql', graphqlHTTP({
  schema: MySessionAwareGraphQLSchema,
  graphiql: process.env.NODE_ENV === 'development',
}));
```

## Node
NodeJS를 사용하는 경우 다음 중 하나를 사용하는 것이 좋습니다.

- [express-graphql](https://github.com/graphql/express-graphql)

- [graphql-server](https://github.com/apollostack/graphql-server).
