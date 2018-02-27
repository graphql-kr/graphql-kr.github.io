---
title: 페이지네이션
layout: ../_core/DocsLayout
category: Best Practices
permalink: /learn/pagination/
next: /learn/caching/
---

> 다른 페이지네이션 모델은 다른 클라이언트 기능을 가능하게합니다.

GraphQL의 일반적인 사용 사례는 객체들 간의 관계를 탐색하는 것입니다. GraphQL에서 이러한 관계를 노출 할 수있는 다양한 방법이 있으며, 클라이언트 개발자에게 다양한 기능을 제공합니다.

## Plurals

객체 간의 연결을 노출하는 가장 간단한 방법은 복수형 타입을 반환하는 필드를 사용하는 것입니다. 예를 들어, R2-D2의 친구 목록을 얻고 싶다면 그냥 전부 요청할 수 있습니다.

```graphql
# { "graphiql": true }
{
  hero {
    name
    friends {
      name
    }
  }
}
```

## Slicing

그러나 클라이언트가 추가적인 행동을 원할지도 모릅니다. 클라이언트는 가져올 친구 중 몇 명을 지정할 수 있기를 원할 수 있습니다. 어쩌면 가장 처음 두 명만 원할 수도 있습니다. 그래서 다음과 같은 것을 할수도 있습니다.

```graphql
{
  hero {
    name
    friends(first:2) {
      name
    }
  }
}
```

그러나 처음 두 개를 가져온 경우 목록을 통해 페이지 매기기를 원할 수 있습니다. 클라이언트가 처음 두 친구를 가져오면 두번째 요청으로 다음 두 친구를 요청할 수도 있습니다. 어떻게 이것을 가능하게 할 수 있을까요?

## Pagination and Edges

페이지네이션을 할 수있는 방법에는 여러 가지가 있습니다.

- `friends(first:2 offset:2)` 로 리스트에서 다음 두 개를 요청할 수 있습니다.
- `friends(first:2 after:$friendId)` 로 우리가 가져온 마지막 친구를 이용하여 다음 두 개를 요청할 수 있습니다.
- `friends(first:2 after:$ friendCursor)` 로 마지막 항목으로부터 커서를 가져와 페이지네이션에 사용합니다.

일반적으로 **커서 기반 페이지네이션** 이 설계된 것 중 가장 강력하다는 것을 알 수 있습니다. 특히 커서가 불투명한 경우 커서 기반의 페이지네이션(커서를 오프셋 또는 ID로 지정한)을 사용하여 오프셋 또는 ID 기반 페이지네이션을 구현할 수 있으며 커서를 사용하면 향후 페이지네이션 모델이 변경될 경우 추가적인 유연함이 
제공됩니다. 커서가 불투명하고 형식을 사용하지 말아야한다는 것을 상기시켜주기 위해 base64 인코딩하는 것이 좋습니다.

In general, we've found that **cursor-based pagination** is the most powerful of those designed. Especially if the cursors are opaque, either offset or ID-based pagination can be implemented using cursor-based pagination (by making the cursor the offset or the ID), and using cursors gives additional flexibility if the pagination model changes in the future. As a reminder that the cursors are opaque and that their format should not be relied upon, we suggest base64 encoding them.

그것은 문제가 됩니다. 객체에서 어떻게 커서를 가져 올까요? 커서가 `User` 타입에 존재하는 것은 원치 않습니다. 그것은 연결을 위한 속성이지 객체의 속성은 아니기 때문입니다. 그래서 간접 지정의 새로운 레이어을 도입하고자 할 수 있습니다. `friends` 필드는 리스트의 맨 끝(`edge`)을 주어야하고, 엣지는 커서와 밑에 있는 노드를 가지고 있습니다

```graphql
{
  hero {
    name
    friends(first:2) {
      edges {
        node {
          name
        }
        cursor
      }
    }
  }
}
```

엣지는 객체 중 하나가 아닌 엣지에 특정한 정보가 있는 경우 유용합니다. 예를 들어, API에서  `friendship time` 을 가져오고 싶다면 엣지에 위치시키는 것이 자연스럽습니다.

## End-of-list, counts, and Connections

이제 커서를 사용하여 연결을 페이지네이션 할 수 있지만, 연결이 언제 끝났는지 어떻게 알 수 있을까요? 빈 리스트를 받을 때까지 계속 쿼리해야하지만 추가 요청 없이 연결이 끝났음을 알고자 싶을 것입니다. 마찬가지로 연결 자체에 대한 추가 정보를 알고 싶다면 어떻게해야할까요? 예를 들면, R2-D2는 친구가 총 몇명인지 알고싶을때?

이 두 가지 문제를 해결하기 위해 `friends` 필드는 `connection` 객체를 반환 할 수 있습니다. `connection` 객체에는 엣지에 대한 필드뿐만 아니라 다른 정보(예: 총 갯수 및 다음 페이지의 존재 여부에 대한 정보)도 있습니다. 그래서 최종 쿼리는 다음과 같을 것입니다.

```graphql
{
  hero {
    name
    friends(first:2) {
      totalCount
      edges {
        node {
          name
        }
        cursor
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
}
```

이 `PageInfo` 객체에 `endCursor` 와 `startCursor` 를 포함 할 수도 있습니다. 이 방법으로, 엣지에 있는 추가적인 정보가 필요없다면, `pageInfo` 에서 페이지네이션에 필요한 커서를 얻었으므로 엣지를 쿼리할 필요가 없습니다. 이로 인해 연결에 대한 유용성이 향상될 수 있습니다. 단순히 `edges` 리스트를 노출하는 대신 간접적인 레이어을 피하기 위해 노드의 전용 리스트를 노출 할 수 있습니다.

## Complete Connection Model

분명히, 이것은 단지 복수 타입을 갖는 독창적인 디자인보다 더 복잡합니다. 그러나 이 디자인을 채택함으로써 클라이언트를 위한 다양한 기능을 사용할 수 있게 됩니다.

- 리스트를 페이지네이션하는 기능.
- `totalCount` 또는 `pageInfo` 와 같은 연결 자체에 대한 정보를 요청하는 기능.
- `cursor`또는 `friendshipTime`과 같은 엣지 자체에 대한 정보를 요청하는 기능.
- 사용자가 불투명한 커서를 사용하기 때문에 백엔드가 페이지네이션을 수행하는 방식을 변경하는 기능.

이를 실제로보기 위해 예제 스키마에는 `friendsConnection` 이라는 필드가 추가되어있어 이러한 개념을 모두 보여줍니다. 예제 쿼리에서 확인할 수 있습니다. `friendsConnection` 에 `after` 매개 변수를 제거하여 페이지네이션이 어떻게 영향을 받는지 확인하세요. 또한, `connection` 에 있는 `friends` 필드를 `edges` 필드를 바꾸어 보세요. 그러면 클라이언트에 적합한 간접적인 추가 엣지 레이어가 없는 친구 리스트에 직접 접근 할 수 있습니다.

```graphql
# { "graphiql": true }
{
  hero {
    name
    friendsConnection(first:2 after:"Y3Vyc29yMQ==") {
      totalCount
      edges {
        node {
          name
        }
        cursor
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
}
```

