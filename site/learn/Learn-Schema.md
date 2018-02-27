---
title: 스키마 & 타입
layout: ../_core/DocsLayout
category: Learn
permalink: /learn/schema/
next: /learn/validation/
sublinks: Type System,Type Language,Object Types and Fields,Arguments,The Query and Mutation Types,Scalar Types,Enumeration Types,Lists and Non-Null,Interfaces,Union Types,Input Types
---

이 페이지에서는 GraphQL 타입 시스템에 대해 알아야 할 사항과 쿼리 할 수 있는 데이터를 표현하는 방법을 배우게됩니다. GraphQL은 모든 백엔드 프레임워크 또는 프로그래밍 언어와 함께 사용할 수 있기 때문에 구현과 관련된 세부 정보에서 벗어나 개념에 대해서만 이야기 할 것입니다.

### Type system

이전에 GraphQL 쿼리를 본 적이 있다면 GraphQL 쿼리 언어가 기본적으로 객체의 필드를 선택하는 것임을 알 수 있습니다. 다음 쿼리 예제를 보세요.

If you've seen a GraphQL query before, you know that the GraphQL query language is basically about selecting fields on objects. So, for example, in the following query:

```graphql
# { "graphiql": true }
{
  hero {
    name
    appearsIn
  }
}
```

1. 특별한 `root` 객체로 시작합니다.
2. `hero` 필드를 선택합니다.
3. `hero` 에 의해 반환 된 객체에 대해 `name` 과 `appearIn` 필드를 선택합니다

GraphQL 쿼리의 형태가 결과와 거의 일치하기 때문에 서버에 대해 모르는 상태에서 쿼리가 반환 할 내용을 예측할 수 있습니다. 하지만 서버에 요청할 수 있는 데이터에 대한 정확한 표현을 갖는 것이 유용합니다. 어떤 필드를 선택할 수 있는지, 어떤 종류의 객체를 반환 할 수 있는지, 해당 하위 객체에서 사용할 수 있는 필드는 무엇인지, 이것이 바로 스키마가 필요한 이유입니다.

모든 GraphQL 서비스는 해당 서비스에서 쿼리 가능한 데이터 집합을 완벽히 설명하는 타입들을 정의합니다. 그런 다음 쿼리가 들어 오면 해당 스키마에 대해 유효성이 검사되고 실행됩니다.

### Type language

GraphQL 서비스는 어떤 언어로든 작성할 수 있습니다. GraphQL 스키마에 대해 말하기 전에 JavaScript와 같은 특정 프로그래밍 언어 구문에 의존 할 수 없기 때문에 간단한 언어를 정의 할 것입니다. 여기서는 `GraphQL 스키마 언어` 를 사용할 것입니다 - 이것은 쿼리 언어와 비슷하며 GraphQL 스키마를 언어에 구애받지 않는 방식으로 표현 할 수 있게 해줍니다.

### Object types and fields

GraphQL 스키마의 가장 기본적인 구성 요소는 객체 타입입니다. 객체 타입은 서비스에서 가져올 수 있는 객체의 종류와 그 객체의 필드를 나타냅니다. GraphQL 스키마 언어에서는 다음과 같이 표현 할 수 있습니다.

```graphql
type Character {
  name: String!
  appearsIn: [Episode]!
}
```

이 언어는 꽤 읽을 만하지만, 서로 이해할 수 있도록 이 언어를 살펴 보겠습니다.

- `Character` 는 *GraphQL 객체 타입*입니다. 즉, 일부 필드가 있는 유형입니다. 스키마의 대부분의 타입은 객체 타입입니다.
- `name` 과 `appearIn` 은 `Character` 타입의 *필드*입니다. 즉 `name` 과 `appearIn` 은 `Character` 타입으로 작동하는 GraphQL 쿼리의 어느 부분에도 나타날 수 있는 유일한 필드입니다.
- `String` 은 내장 된 *스칼라* 타입 중 하나입니다. 이것은 단일 스칼라 객체로 해석되는 타입이며 쿼리에서 하위 선택을 가질 수 없습니다. 스칼라 타입은 나중에 자세히 다룰 것입니다.
- `String!` 은 필드가 *non-nullable*임을 의미합니다. 즉, 이 필드를 쿼리 할 때 GraphQL 서비스가 항상 값을 제공한다는 것을 의미합니다. 타입 언어에서는 이것을 느낌표로 나타냅니다.
- `[Episode]!` 는 `Episode` 객체의 *array* 를 나타냅니다. 또한 *non-nullable* 이기 때문에 `appearIn` 필드를 쿼리할 때 항상(0개 이상의 아이템을 가진) 배열을 기대할 수 있습니다.

이제 GraphQL 객체 타입이 무엇인지 배웠으며 GraphQL 타입 언어의 기본적인 것을 읽을 수 있습니다.

### Arguments

GraphQL 객체 타입의 모든 필드는 0개 이상의 인수를 가질 수 있습니다(예: 아래 `length` 필드).

```graphql
type Starship {
  id: ID!
  name: String!
  length(unit: LengthUnit = METER): Float
}
```

모든 인수에는 이름이 있습니다. 함수가 정렬된 인수 목록을 가져오는 JavaScript 및 Python과 같은 언어와 달리 GraphQL의 모든 인수는 특별한 이름으로 전달됩니다. 이 경우, `length` 필드는 하나의 정의 된 인수 `unit` 을 가집니다.

인수는 필수 또는 선택적일 수 있습니다. 인수가 선택적인 경우 *기본값* 을 정의 할 수 있습니다. -  `unit` 인수가 전달되지 않으면 기본적으로 `METER` 로 설정됩니다.

### The Query and Mutation types

스키마의 대부분의 타입은 일반 객체 유형일 뿐이지만 스키마 내에서는 특수한 두 가지 타입이 있습니다.

```graphql
schema {
  query: Query
  mutation: Mutation
}
```

모든 GraphQL 서비스는 `query` 타입을 가지며 `mutation` 타입은 가질 수도 있고 가지지 않을 수도 있습니다. 이러한 타입은 일반 객체 타입과 동일하지만 모든 GraphQL 쿼리의 *진입점* 을 정의하므로 특별합니다. 따라서 다음과 같은 쿼리를 볼 수 있습니다.

```graphql
# { "graphiql": true }
query {
  hero {
    name
  }
  droid(id: "2000") {
    name
  }
}
```

즉, GraphQL 서비스는 `hero` 및 `droid` 필드가 있는 `Query` 타입이 필요합니다.

```graphql
type Query {
  hero(episode: Episode): Character
  droid(id: ID!): Droid
}
```

뮤테이션은 비슷한 방식으로 작동합니다. 즉, `Mutation` 타입의 필드를 정의하면 쿼리에서 호출 할 수있는 루트 뮤테이션 필드로 사용할 수 있습니다.

스키마에 대한 `진입점` 이라는 특수한 상태 이외의 다른 쿼리 타입과 뮤테이션 타입은 다른 GraphQL 객체 타입과 동일하며 해당 필드는 정확히 동일한 방식으로 작동한다는 점을 기억해야합니다.

### Scalar types

GraphQL 객체 타입은 이름과 필드를 가지고 있지만, 어느 시점에서 이 필드는 일부 구체적인 데이터로 해석되어야합니다. 이것이 스칼라 타입이 필요한 이유입니다. 즉, 쿼리의 끝을 나타냅니다.

다음 쿼리에서 `name` 과 `appearIn` 은 스칼라 타입으로 해석될 것입니다.


```graphql
# { "graphiql": true }
{
  hero {
    name
    appearsIn
  }
}
```

필드에 하위 필드가 없기 때문에 이 사실을 알 수 있습니다. 이 필드는 쿼리의 끝부분입니다.

GraphQL에는 기본 스칼라 타입들이 기본 제공됩니다.

- `Int`: 부호가 있는 32비트 정수.
- `Float`: 부호가 있는 부동소수점 값.
- `String`: UTF-8 문자열.
- `Boolean`: `true` 또는 `false`.
- `ID`: ID 스칼라 타입은 객체를 다시 요청하거나 캐시의 키로써 자주 사용되는 고유 식별자를 나타냅니다. ID 타입은 String 과 같은 방법으로 직렬화됩니다. 하지만 `ID` 로 정의하는 것은 사람이 읽을 수 있도록 하는 의도가 아니라는 것을 의미합니다.

대부분의 GraphQL 서비스 구현에는 맞춤 스칼라 타입을 지정하는 방법이 있습니다. 예를 들면 `Date` 타입을 정의 할 수 있습니다.

```graphql
scalar Date
```

해당 타입을 직렬화, 역 직렬화 및 유효성 검사를 수행하는 방법을 정의하는 것을 구현할 수 있습니다. 예를 들어, `Date` 타입을 항상 정수형 타임스탬프로 직렬화해야 한다는 것을 지정할 수 있습니다. 그리고 클라이언트는 모든 날짜 필드에 대해 그 타입을 기대해야 합니다.

### Enumeration types

*Enums* 라고도 하는 열거 타입은 허용되는 특정 값들로 제한되는 특별한 종류의 스칼라입니다. 이를 통해 다음을 수행할 수 있습니다.

1. 이 타입의 인수가 허용된 값 중 하나임을 검증합니다.
2. 필드가 항상 값의 유한 집합 중 하나가 될 것임을 타입 시스템을 통해 의사 소통합니다.

GraphQL 스키마 언어에서 열거형 정의가 어떻게 생겼는지 봅시다.

```graphql
enum Episode {
  NEWHOPE
  EMPIRE
  JEDI
}
```

즉, 스키마에서 `Episode` 타입을 사용할 때마다 정확히 `NEWHOPE`, `EMPIRE`, `JEDI` 중 하나 일 것으로 예상할 수 있습니다.

다양한 언어로 작성된 GraphQL 서비스 구현은 열거형을 처리 할 수 있는 언어별 고유한 방법을 갖습니다. enum을 일급으로 지원하는 언어에서는 구현시 이를 활용할 수 있습니다. 열거형 지원이 없는 JavaScript와 같은 언어에서 이러한 값은 내부적으로 정수 집합에 매핑 될 수 있습니다. 그러나 이러한 세부 정보는 클라이언트로 보여지지 않으며 열거형 값의 문자열 이름에 관해서만 작동 할 수 있습니다.

### Lists and Non-Null

객체 타입, 스칼라 및 열거형은 GraphQL에서 정의 할 수 있는 유일한 타입입니다. 하지만 스키마의 다른 부분이나 쿼리 변수 선언에서 타입을 사용하면 해당 값의 유효성 검사에 영향을 주는 추가 *타입 수정자* 를 적용 할 수 있습니다. 예제를 살펴 보겠습니다.

```graphql
type Character {
  name: String!
  appearsIn: [Episode]!
}
```

여기서 `String` 타입을 사용하고 타입 이름 뒤에 느낌표 `!` 를 추가하여 *Non-Null* 로 표시합니다. 즉, 서버는 항상이 필드에 대해 null이 아닌 값을 반환 할 것으로 예상하고, 실제로 GraphQL 실행 오류를 발생시키는 null 값을 얻으면 클라이언트에게 무언가 잘못되었음을 알립니다.

Non-Null 타입 수정자는 필드에 대한 인수를 정의 할 때도 사용할 수 있습니다. 이는 GraphQL 서버가 GraphQL 문자열이나 변수에 상관없이 null 값이 해당 인수로 전달되는 경우 유효성 검사 오류를 반환하게합니다.

```graphql
# { "graphiql": true, "variables": { "id": null } }
query DroidById($id: ID!) {
  droid(id: $id) {
    name
  }
}
```

리스트는 비슷한 방식으로 작동합니다. 타입 수정자를 사용하여 타입을 `List` 로 표시 할 수 있습니다. 이 필드는 해당 타입의 배열을 반환합니다. 스키마 언어에서, 타입을 대괄호 `[]` 로 묶는 것으로 표현됩니다. 유효성 검사 단계에서 해당 값에 대한 배열이 필요한 인수에 대해서도 동일하게 작동합니다.

Non-Null 및 List 수정자를 결합 할 수도 있습니다. 예를 들면 Null이 아닌 문자열 목록을 가질 수 있습니다.

```graphql
myField: [String!]
```

즉, *list* 자체는 null 일 수 있지만 null 멤버는 가질 수 없습니다. 예를 들면, JSON에서

```js
myField: null // valid
myField: [] // valid
myField: ['a', 'b'] // valid
myField: ['a', null, 'b'] // error
```

Null이 아닌 문자열 목록을 정의했다고 가정해 보겠습니다.

```graphql
myField: [String]!
```

목록 자체는 null 일 수 없지만 null 값을 포함 할 수 있습니다.

```js
myField: null // error
myField: [] // valid
myField: ['a', 'b'] // valid
myField: ['a', null, 'b'] // valid
```

필요에 따라 여러개의 Null 및 List 수정자를 임의로 중첩 할 수 있습니다.

### Interfaces

여러 타입 시스템과 마찬가지로 GraphQL도 인터페이스를 지원합니다. *인터페이스* 는 인터페이스를 구현하기 위해 타입이 포함해야하는 특정 필드 집합을 포함하는 추상 타입입니다.

예를 들면, Star Wars 3부작의 모든 문자를 나타내는 `Character` 인터페이스를 가질 수 있습니다.

```graphql
interface Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
}
```

이것은 `Character` 를 *구현한* 모든 타입은 이러한 인자와 리턴 타입을 가진 정확한 필드를 가져야 한다는 것을 의미합니다.

다음은 `Character` 를 구현한 몇 가지 타입 예제입니다.

```graphql
type Human implements Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  starships: [Starship]
  totalCredits: Int
}

type Droid implements Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  primaryFunction: String
}
```

이 두 타입 모두 `Character` 인터페이스의 모든 필드를 가지고 있음을 알 수 있습니다. 또한 특정 타입의 문자에 특정한 추가 필드 `totalCredits`,`starships` 및 `primaryFunction` 을 가질수도 있습니다.

인터페이스는 객체 또는 객체집합을 반환하려는 경우에 유용하지만 여러 다른 타입이 있을 수 있습니다.

예를 들면, 다음 쿼리는 오류를 반환합니다.

```graphql
# { "graphiql": true, "variables": { "ep": "JEDI" } }
query HeroForEpisode($ep: Episode!) {
  hero(episode: $ep) {
    name
    primaryFunction
  }
}
```

`hero` 필드는 `Character` 타입을 반환하는데, `episode` 인수에 따라 `Human` 또는 `Droid` 중 하나 일 수 있습니다. 위 쿼리는 `primary` 함수를 포함하지 않는 `Character` 인터페이스 상에 존재하는 필드만을 요청할 수 있습니다.

특정 객체 타입의 필드를 요청하려면 인라인 프래그먼트을 사용해야합니다.

```graphql
# { "graphiql": true, "variables": { "ep": "JEDI" } }
query HeroForEpisode($ep: Episode!) {
  hero(episode: $ep) {
    name
    ... on Droid {
      primaryFunction
    }
  }
}
```

이에 대한 자세한 내용은 쿼리 가이드의 [인라인 프래그먼트](/learn/queries/#inline-fragments) 장을 참조하세요.

### Union types

유니언 타입은 인터페이스와 매우 유사하지만 타입 간에 공통 필드를 지정하지 않습니다.

```graphql
union SearchResult = Human | Droid | Starship
```

스키마에서 `SearchResult` 타입을 반환 할 때마다, `Human`, `Droid` 또는 `Starship` 을 얻을 수 있습니다. 유니온 타입의 멤버는 구체적인 객체 타입일 필요가 있습니다. 인터페이스 또는 다른 유니온 타입에서 유니온 타입을 작성할 수 없습니다.

이 경우, `SearchResult` 유니언 타입을 반환하는 필드를 쿼리하면, 어떤 필드라도 쿼리 할 수 있는 조건부 프래그먼트를 사용해야합니다.

```graphql
# { "graphiql": true}
{
  search(text: "an") {
    ... on Human {
      name
      height
    }
    ... on Droid {
      name
      primaryFunction
    }
    ... on Starship {
      name
      length
    }
  }
}
```

### Input types

지금까지는 열거형이나 문자열과 같은 스칼라 값을 인수로 필드에 전달하는 방법에 대해서만 설명했습니다. 하지만 복잡한 객체도 쉽게 전달할 수 있습니다. 이것은 뮤테이션에서 특히 유용합니다. 여기서 뮤테이션은 생성될 전체 객체를 전달하고자 할 수 있습니다. GraphQL 스키마 언어에서 입력 타입은 일반 객체 타입과 정확히 같지만 `type` 대신 `input` 을 사용합니다.

```graphql
input ReviewInput {
  stars: Int!
  commentary: String
}
```

다음은 뮤테이션에서 입력 객체 타입을 사용하는 방법입니다.

```graphql
# { "graphiql": true, "variables": { "ep": "JEDI", "review": { "stars": 5, "commentary": "This is a great movie!" } } }
mutation CreateReviewForEpisode($ep: Episode!, $review: ReviewInput!) {
  createReview(episode: $ep, review: $review) {
    stars
    commentary
  }
}
```

입력 객체 타입의 입력란은 입력 객체 타입을 참조 할 수 있지만 입력 및 출력 타입을 스키마에 혼합 할 수는 없습니다. 입력 객체 타입도 필드에 인수를 가질 수 없습니다.