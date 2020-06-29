---
title: 인증
layout: ../_core/DocsLayout
category: 모범 사례
permalink: /learn/authorization/
next: /learn/pagination/
---

> 인증 로직을 비즈니스 로직 레이어에 위임하세요

인증은 주어진 사용자/세션/컨텍스트가 작업을 수행하거나 데이터를 볼 수 있는 권한이 있는지 여부를 나타내는 비즈니스 로직입니다. 예를 들어,

* "저자만 자신의 초안을 볼 수 있음"

이런 종류의 행동을 강제하는 것은 [비즈니스 로직 레이어](/learn/thinking-in-graphs/#비즈니스-로직-레이어)에서 일어나야합니다. GraphQL 레이어에 다음과 같이 인증 로직을 배치해야합니다.

```javascript
var postType = new GraphQLObjectType({
  name: ‘Post’,
  fields: {
    body: {
      type: GraphQLString,
      resolve: (post, args, context, { rootValue }) => {
        // return the post body only if the user is the post's author
        if (context.user && (context.user.id === post.authorId)) {
          return post.body;
        }
        return null;
      }
    }
  }
});
```

게시물의 `authorId` 필드가 현재 사용자의 `id` 와 같은지 확인하여 "저자가 게시물을 소유" 했는지 확인했습니다. 이렇게하면 문제가 무엇일까요? 이 코드를 서비스의 각 엔드포인트에 복사해야합니다. 모든 인증 로직이 완벽하게 일치하지 않는 경우, 사용자는 사용하는 API에 따라 다른 데이터를 보게될 수도 있습니다. [단일 소스(single source of truth)](/learn/thinking-in-graphs/#비즈니스-로직-레이어) 인증을 통해 이를 피할 수 있습니다.

GraphQL이나 프로토타이핑을 배울 때는 *resolver* 내부에 인증 로직을 정의하는 것이 좋습니다. 하지만, 프로덕션 코드의 경우에는 비즈니스 로직 레이어에 인증 로직을 위임하세요. 아래는 그 예입니다.

```javascript
// 인증 로직은 postRepository 내부에 있습니다.
var postRepository = require('postRepository');

var postType = new GraphQLObjectType({
  name: ‘Post’,
  fields: {
    body: {
      type: GraphQLString,
      resolve: (post, args, context, { rootValue }) => {
        return postRepository.getBody(context.user, post);
      }
    }
  }
});
```

위 예제에서, 비즈니스 로직 레이어는 호출자가 `user` 객체를 제공해야 한다는 것을 알 수 있습니다. GraphQL.js를 사용하는 경우, `user` 객체는 `context` 인수 또는 *resolver* 의 네 번째 인수인 `rootValue` 에 전달되어져야 합니다.

확실한 토큰이나 API key 대신 완전한 `user` 객체를 비즈니스 로직 레이어에 전달하는 것이 좋습니다. 이렇게하면 요청 처리 파이프라인의 여러 단계에서 [인증](/graphql-js/authentication-and-express-middleware/) 문제를 처리할 수 ​​있습니다.
