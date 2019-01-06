---
title: 스키마 확인
layout: ../_core/DocsLayout
category: 배우기
permalink: /learn/introspection/
next: /learn/best-practices/
---

GraphQL 스키마가 어떤 쿼리를 지원하는지에 대한 정보를 요청하는 것은 유용합니다. GraphQL은  `introspection`(이하 `스키마 확인`) 시스템을 사용하여 이를 가능하게 합니다!


Star Wars 예제에서, [starWarsIntrospection-test.js](https://github.com/graphql/graphql-js/blob/master/src/__tests__/starWarsIntrospection-test.js) 파일에는 `스키마 확인` 시스템을 보여주는 몇가지 쿼리가 포함되어 있으며, `스키마 확인` 시스템을 실행할 수 있는 테스트 파일입니다.

타입 시스템을 사용하기 때문에 우리는 유효한 타입이 무엇인지 알고있지만, 그렇지 않은 경우에는 Query의 루트 타입에서 항상 사용할 수 있는 `__schema` 필드를 쿼리하여 GraphQL에 요청할 수 있습니다. 사용 가능한 타입을 요청해봅시다.

```graphql
# { "graphiql": true }
{
  __schema {
    types {
      name
    }
  }
}
```

타입이 정말 많네요! 이게 다 뭘까요? 그룹화해봅시다.

 - **Query, Character, Human, Episode, Droid** - 타입 시스템에서 정의한 것들 입니다.
 - **String, Boolean** - 이것은 타입 시스템이 제공하는 내장 스칼라입니다.
 - **\_\_Schema, \_\_Type, \_\_TypeKind, \_\_Field, \_\_InputValue, \_\_EnumValue, \_\_Directive** - 모두 앞에는 두 개의 밑줄이 붙어있는데, 이것은 `스키마 확인` 시스템의 일부임을 나타냅니다.

이제 어떤 쿼리를 사용할 수 있는지 알아봅시다. 우리는 타입 시스템을 설계할 때 모든 타입의 쿼리가 시작될 타입을 지정했습니다. 이를 `스키마 확인` 시스템에 요청해 봅시다!

```graphql
# { "graphiql": true }
{
  __schema {
    queryType {
      name
    }
  }
}
```

이는 타입 시스템 섹션에서 배운 것과 일치합니다. `Query` 타입이 시작할 곳입니다! 여기서 이름은 단지 관습인 것을 유의하세요. `Query` 타입에 다른 이름을 쓸 수도 있고, 쿼리의 시작 타입으로 지정했다면, 똑같이 반환되었을 것입니다. 하지만, `Query` 라는 이름은 일반적인 관습입니다.

특정 타입을 검사하는 것이 유용한 경우가 많습니다. `Droid` 타입을 살펴 보겠습니다.

```graphql
# { "graphiql": true }
{
  __type(name: "Droid") {
    name
  }
}
```

`Droid` 에 대해 더 많이 알고 싶다면 어떻게해야 할까요? 예를 들어, 인터페이스인지 객체인지 알고싶다면?

```graphql
# { "graphiql": true }
{
  __type(name: "Droid") {
    name
    kind
  }
}
```

`kind` 는 `__TypeKind` 열거형을 반환했는데, 그 값은 `OBJECT` 입니다. 대신 `Character` 에 대해 요청하면 인터페이스라는 것을 알 수 있습니다.

```graphql
# { "graphiql": true }
{
  __type(name: "Character") {
    name
    kind
  }
}
```

어떤 객체가 어떤 필드를 사용할 수 있는지 아는 것이 유용하기 때문에, `Droid` 를 `스카미 확인` 시스템에 요청해 봅시다.

```graphql
# { "graphiql": true }
{
  __type(name: "Droid") {
    name
    fields {
      name
      type {
        name
        kind
      }
    }
  }
}
```

이값들이 `Droid` 에서 정의한 필드들입니다!

`id` 는 약간 이상해 보입니다. 타입에 대한 이름이 없습니다. 종류가 `NON_NULL` 인 `wrapper` 타입이기 때문입니다. 필드의 타입에서 `ofType` 를 쿼리하면, 이 `ID` 가 `non-null` 임을 알려주는 `ID` 타입을 반환할 것입니다.

비슷하게, `friends` 와 `appearIn` 둘 다 `LIST` `wrapper` 타입이기 때문에 이름이 없습니다. 이 타입에 대해 `ofType` 을 쿼리 할 수 있습니다. 그러면 이 `list` 가 어떤 `list` 인지 알 수 있습니다.

```graphql
# { "graphiql": true }
{
  __type(name: "Droid") {
    name
    fields {
      name
      type {
        name
        kind
        ofType {
          name
          kind
        }
      }
    }
  }
}
```

이제 마지막으로 툴을 만들때에 특히 유용한 `스키마 확인` 시스템의 기능을 봅시다. 시스템에 문서를 요청해 봅시다!

```graphql
# { "graphiql": true }
{
  __type(name: "Droid") {
    name
    description
  }
}
```

이렇게 `스키마 확인` 기능을 사용하여 타입 시스템에 대한 문서에 접근 할 수 있고 문서탐색기나 풍부한 IDE 환경을 만들 수도 있습니다.

이것은 그저 `스키마 확인` 시스템의 극히 일부입니다. 열거형 값, 타입이 구현하는 인터페이스 등을 쿼리 할 수도 ​​있습니다. 심지어 `스키마 확인` 시스템 자체에도 이 시스템을 사용 할 수 있습니다. 이 명세에 대한 자세한 내용은 `introspection` 섹션을 참조하세요. GraphQL.js에 [Introspection](https://github.com/graphql/graphql-js/blob/master/src/type/introspection.js) 파일에는 이 사양을 준수하는 GraphQL 쿼리 `스키마 확인` 시스템을 구현하는 코드가 있습니다.
