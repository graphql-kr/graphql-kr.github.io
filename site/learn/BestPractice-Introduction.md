---
title: GraphQL 모범 사례
sidebarTitle: 소개
layout: ../_core/DocsLayout
category: Best Practices
permalink: /learn/best-practices/
next: /learn/thinking-in-graphs/
---

GraphQL 명세는 네트워크, 인증, 페이지네이션 처리와 같은 API가 직면하는 몇 가지 중요한 문제에 대해 의도적으로 다루지 않습니다. GraphQL을 사용할 때 이러한 문제에 대한 해결책이 없다는 것은 아닙니다. 단지 이 문제들은 GraphQL 이 *무엇* 인지에 대한 설명과 직접적인 관련이 없으며 이것이 일반적이기 때문입니다.

이 섹션에 문서는 전적으로 받아 들여서는 안되며 특별한 경우에는 이 접근방법이 올바르지 않을 수 있습니다. 이 문서에서는 GraphQL 서비스의 설계 및 배포와 관련된 Facebook에서 개발된 철학을 소개하고, HTTP를 통한 서빙 및 인증 수행과 같은 일반적인 문제를 해결하기 위한 방법 제안을 합니다.

다음은 GraphQL 서비스의 가장 일반적인 모범 사례와 좋은 방법에 대한 간략한 설명입니다. 이 섹션의 각 문서에서는 여러가지 주제에 대해 더 자세히 설명합니다.

### HTTP

GraphQL은 일반적으로 서비스의 모든 기능을 하나의 엔드포인트 HTTP를 통해 제공됩니다. 이는 각각 하나의 리소스를 여러 URL로 노출하는 REST API와는 대칭적입니다. GraphQL은 이 리소스 URL들과 함께 사용할 수도 있지만 GraphiQL과 같은 도구를 사용하기가 어려울 수 있습니다.

[Serving over HTTP](/learn/serving-over-http/) 에서 더 자세히 알아보세요.


### JSON (with GZIP)

GraphQL 서비스는 일반적으로 JSON으로 응답하지만 GraphQL 명세에는 [필요하지 않습니다](http://facebook.github.io/graphql/#sec-Serialization-Format). JSON은 더 좋은 네트워크 성능을 약속하는 API 레이어를 위해서는 이상한 선택처럼 보일 수 있지만 대부분 텍스트이기 때문에 GZIP로 매우 잘 압축됩니다.

모든 프로덕션 GraphQL 서비스는 GZIP를 활성화하고 클라이언트가 헤더를 보내도록 권장합니다.

```
Accept-Encoding: gzip
```

JSON은 클라이언트 및 API 개발자들에게도 친숙하며 읽고 디버깅하기 쉽습니다. 실제로 GraphQL 문법은 JSON 문법에 부분적으로 영향을 받았습니다.


### Versioning

GraphQL 서비스가 다른 REST API와 마찬가지로 버전이 변경되는 것을 막을 수는 없지만 GraphQL 스키마의 지속적인 발전을 위한 도구를 제공하여 버전 관리를 피하는 것에 대해서 강한 의견을 가지고 있습니다.

왜 대부분의 API는 버전관리를 해야할까요? API 엔드포인트에서 리턴된 데이터에 대한 제한된 제어가있을 때 *모든 변경* 은 심각한 변경으로 간주될 수 있으며 큰 변경사항에는 새 버전이 필요합니다. API에 새로운 기능을 추가하는데 새로운 버전이 필요한 경우 API를 이해하기 쉽고 유지 보수할 수 있는 버전을 자주 출시하고 업데이트된 버전을 사용하는 것이 좋습니다.

반대로 GraphQL은 명시적으로 요청된 데이터만 반환하므로 새로운 타입과 타입 필드를통해 새로운 기능을 추가할 수 있습니다. 이는 항상 변경 사항을 피하고 버전없는 API를 제공하는 일반적인 방법으로 이어집니다.

### Nullability

`null` 을 판단하는 대부분의 타입 시스템은 일반 타입과 해당 타입의 *nullable* 버전을 제공하며, 명시적으로 선언하지 않는 한 디폴트 타입은 `null` 을 포함하지 않습니다. 하지만 GraphQL 타입 시스템에서는 모든 필드가 기본적으로 *nullable* 입니다. 이는 데이터베이스 및 기타 백엔드의 네트워크 서비스에서 많은 일이 발생할 수 있기 때문입니다. 데이터베이스가 다운되거나 비동기 작업이 실패할 수 있으며 예외가 발생할 수 있습니다. 단순한 시스템 실패 이외에도 요청 내의 개별 필드가 서로 다른 인증 규칙을 가질 수 있는 권한이 세분화될 수 있습니다.

기본적으로 모든 필드를 *nullable* 로 설정하면 이러한 이유로 인해 요청이 완전히 실패하지 않고 해당 필드가 `null` 로 반환될 수 있습니다. 그 대신, GraphQL은 [non-null](/learn/schema/#lists-and-non-null) 타입을 제공하여 클라이언트에게 요청하면 필드가 결코 `null` 을 반환하지 않도록 보장할 수 있습니다. 대신에, 만약 오류가 발생하면 이전 상위 필드가 대신 `null` 이 됩니다.

GraphQL 스키마를 설계할 때, 잘못될 수 있는 모든 문제와 실패한 필드에 대해 `null` 이 적절한 값임을 명심하는 것이 중요합니다. 일반적으로 그렇지만 때로는 그렇지 않는 경우도 있습니다. 이러한 경우, null이 아님을 보장하는 non-null 타입을 작성하십시오.

### Pagination

GraphQL 타입 시스템은 일부 필드가 [lists of values](/learn/schema/#lists-and-null이 아닌) 을 반환하지만 API 설계자는 긴 리스트에 대한 페이지네이션을 제공할 수 있습니다. 페이지네이션(pagination)을 위한 다양한 API 디자인이 있으며, 각각 장단점이 있습니다.

일반적으로 긴 리스트을 반환할 수도 있는 필드는 `first` 및 `after` 인수를 사용하여 목록의 특정 영역을 지정할 수 있습니다. 여기서 `after` 는 리스트의 각 값에 대한 고유한 식별자입니다.

기능이 다양한 페이지네이션을 사용하여 궁극적으로 API를 디자인하면 `Connections` 라는 모범 사례 패턴이 생깁니다. [Relay](https://facebook.github.io/relay/) 와 같은 GraphQL의 일부 클라이언트 도구는 `Connections` 패턴을 구현하며 GraphQL API가 이 패턴을 사용할 때 클라이언트 측 페이지네이션을 자동으로 지원합니다.

[Pagination](/learn/pagination/) 문서에서 자세히 읽어보세요.


### Server-side Batching & Caching

GraphQL은 서버에 깔끔한 코드를 작성할 수 있는 방식으로 설계되었습니다. 모든 타입의 모든 필드에는 해당 값을 확인하는데 초점을 맞춘 단일목적 함수가 있습니다. 하지만 이러한 추가적인 고려없이, 간단한 GraphQL 서비스는 매우 반복적으로 데이터를 데이터베이스에서 로드할 수 있습니다.

이것은 일반적으로 백엔드의 데이터에 대한 다중 요청이 단기간에 수집될 때 단일 요청에서 기본 데이터베이스 또는 마이크로 서비스로 발송되는 일괄 처리 기법인 Facebook의 [DataLoader](https://github.com/facebook/dataloader) 와 같은 도구를 이용하여 해결할 수 있습니다.
