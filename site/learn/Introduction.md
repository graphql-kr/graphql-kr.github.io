---
title: GraphQL 소개
sidebarTitle: 소개
layout: ../_core/DocsLayout
category: 배우기
permalink: /learn/
next: /learn/queries/
---

> 이 문서는 GraphQL의 작동 방식과 사용법을 다룹니다. GraphQL 서비스를 만드는 방법에 대한 문서를 찾으신다면, GraphQL을 [다양한 언어](/code/)로 구현하는데 도움이 되는 라이브러리를 확인해보세요. 튜토리얼을 통한 깊이 있는 학습을 하시려면 [How to GraphQL](https://www.howtographql.com) 풀스택 튜토리얼 사이트를 살펴보세요.

GraphQL 은 API를 위한 쿼리 언어이며 타입 시스템을 사용하여 쿼리를 실행하는 서버사이드 런타임입니다. GraphQL은 특정한 데이터베이스나 특정한 스토리지 엔진과 관계되어 있지 않으며 기존 코드와 데이터에 의해 대체됩니다.

GraphQL 서비스는 타입과 필드를 정의하고, 각 타입의 필드에 대한 함수로 구현됩니다. 예를 들어, 로그인한 사용자가 누구인지(`me`)와 해당 사용자의 이름(`name`)을 가져오는 GraphQL 서비스는 다음과 같습니다.

```graphql
type Query {
  me: User
}

type User {
  id: ID
  name: String
}
```

각 타입의 필드에 대한 함수를 작성하면 다음과 같이 작성할 수 있습니다.

```js
function Query_me(request) {
  return request.auth.user;
}

function User_name(user) {
  return user.getName();
}
```

GraphQL 서비스가 실행되면 (일반적으로는 웹 서비스의 URL) GraphQL 쿼리를 전송하여 유효성을 검사하고 실행할 수 있습니다. 수신된 쿼리는 먼저 정의된 타입과 필드만 참조하도록 검사한 다음, 함수를 실행하여 결과를 생성합니다.

아래는 쿼리 예제입니다.

```graphql
{
  me {
    name
  }
}
```

다음과 같은 JSON을 얻게됩니다.

```json
{
  "me": {
    "name": "Luke Skywalker"
  }
}
```

아래에서 쿼리 언어, 타입 시스템, GraphQL 서비스의 작동방식과 일반적인 문제를 해결하기 위해 GraphQL을 사용하는 좋은 예제들에 대해 더 살펴보세요.