---
title: GraphQL 소개
sidebarTitle: 소개
layout: ../_core/DocsLayout
category: 배우기
permalink: /learn/
next: /learn/queries/
---

> 이 문서는 GraphQL의 작동 방식 및 사용법을 다룹니다. GraphQL 서비스를 만드는 방법에 대한 문서를 찾으신다면, GraphQL을 [다양한 언어](/code/)로 구현하는 데 도움이되는 라이브러리를 살펴보세요. 실용적인 튜토리얼을 통한 심도있는 학습을 하시려면 [How to GraphQL](https://www.howtographql.com) 풀스택 튜토리얼 웹 사이트를 살펴보세요.

GraphQL은 API를 위한 쿼리 언어이며 데이터를 위해 정의한 타입 시스템을 사용하여 쿼리를 실행하는 서버 사이드 런타임입니다. GraphQL은 특정 데이터베이스 또는 스토리지 엔진과 연결되어 있지 않으며 대신 기존 코드 및 데이터에 의해 뒷받침됩니다.

GraphQL 서비스는 해당 타입에 타입 및 필드를 정의한 다음, 각 타입의 각 필드에 대한 기능을 제공함으로써 생성됩니다. 예를 들어 로그인 한 사용자가 누구인지(`me`)와 해당 사용자의 이름을 알 수 있는 GraphQL 서비스는 다음과 같습니다.

```graphql
type Query {
  me: User
}

type User {
  id: ID
  name: String
}
```

각 타입과 각 필드에 대한 기능과 함께 작성하면 다음과 같습니다.

```js
function Query_me(request) {
  return request.auth.user;
}

function User_name(user) {
  return user.getName();
}
```

GraphQL 서비스가 실행되면 (일반적으로 웹 서비스의 URL) GraphQL 쿼리를 전송하여 유효성을 검사하고 실행할 수 있습니다. 수신 된 쿼리는 먼저 정의된 타입과 필드만 참조하는지 확인한 다음 정의된 기능을 실행하여 결과를 생성합니다.

아래는 쿼리 예제입니다.

```graphql
{
  me {
    name
  }
}
```

다음과 같은 JSON 결과를 생성 할 수 있습니다.

```json
{
  "me": {
    "name": "Luke Skywalker"
  }
}
```

쿼리 언어, 타입 시스템, GraphQL 서비스의 작동 방식 및 일반적인 문제를 해결하기 위해 GraphQL을 사용하는 좋은 예제들에 대해 자세히 살펴보세요.