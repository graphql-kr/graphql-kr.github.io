---
title: 스키마 & 타입
layout: ../_core/DocsLayout
category: 배우기
permalink: /learn/schema/
next: /learn/validation/
sublinks: 타입 시스템,타입 언어,객체 타입과 필드,인자,쿼리 타입 & 뮤테이션 타입,스칼라 타입,열거형 타입,리스트와 Non-Null,인터페이스,유니온 타입,입력 타입
---

이 글에서는 GraphQL 타입 시스템과 데이터를 표현하는 방법을 배우게됩니다. GraphQL은 어떠한 백엔드 프레임워크나 프로그래밍 언어든 함께 사용할 수 있기 때문에 세부적인 구현에서 벗어나 개념에 대해서만 이야기하도록 하겠습니다.

### 타입 시스템

전에 GraphQL 쿼리를 본 적이 있다면 GraphQL 쿼리 언어는 기본적으로 객체의 필드를 선택하는 것을 알 수 있습니다. 다음 쿼리 예제를 봅시다.

```graphql
# { "graphiql": true }
{
  hero {
    name
    appearsIn
  }
}
```

1. `root` 객체로 시작합니다.
2. `hero` 필드를 선택합니다.
3. `hero` 에 의해 반환된 객체에 대해 `name` 과 `appearIn` 필드를 선택합니다.

GraphQL 쿼리의 형태가 결과와 거의 일치하기 때문에 서버에 대해 모르는 상태에서 쿼리가 반환할 결과를 예측할 수 있습니다. 하지만 서버에 요청할 수 있는 데이터에 대한 정확한 표현을 갖는 것이 좋습니다. 어떤 필드를 선택할 수 있는지, 어떤 종류의 객체를 반환할 수 있는지, 하위 객체에서 사용할 수 있는 필드는 무엇인지, 이것이 바로 스키마가 필요한 이유입니다.

모든 GraphQL 서비스는 해당 서비스에서 쿼리 가능한 데이터들을 완벽하게 설명하는 타입들을 정의하고, 쿼리가 들어오면 해당 스키마에 대해 유효성이 검사된 후 실행됩니다.

### 타입 언어

GraphQL 서비스는 어떤 언어로든 작성할 수 있습니다. GraphQL 스키마에 대해 이야기하기 전에 JavaScript와 같은 특정 언어 문법에 의존 할 수 없기 때문에 간단한 언어를 정의할 것입니다. 여기서는 `GraphQL 스키마 언어(GraphQL schema language)` 를 사용할 것입니다. 이것은 쿼리 언어와 비슷하며, GraphQL 스키마를 언어에 의존적이지 않은 방식으로 표현할 수 있게 해줍니다.

### 객체 타입과 필드

GraphQL 스키마의 가장 기본적인 구성 요소는 객체 타입입니다. 객체 타입은 서비스에서 가져올 수 있는 객체의 종류와 그 객체의 필드를 나타냅니다. GraphQL 스키마 언어에서는 다음과 같이 표현할 수 있습니다.

```graphql
type Character {
  name: String!
  appearsIn: [Episode]!
}
```

위 언어는 꽤 읽을만하지만, 이해가 쉽도록 이 언어를 살펴 보겠습니다.

- `Character` 는 *GraphQL 객체 타입* 입니다. 즉, 필드가 있는 타입입니다. 스키마의 대부분의 타입은 객체 타입입니다.
- `name` 과 `appearIn` 은 `Character` 타입의 *필드* 입니다. 즉 `name` 과 `appearIn` 은 GraphQL 쿼리의 `Character` 타입 어디서든 사용할 수 있는 필드입니다.
- `String` 은 내장된 *스칼라* 타입 중 하나입니다. 이는 스칼라 객체로 해석되는 타입이며 쿼리에서 하위 선택을 할 수 없습니다. 스칼라 타입은 나중에 자세히 다룰 것입니다.
- `String!` 은 필드가 *non-nullable* 임을 의미합니다. 즉, 이 필드를 쿼리할 때 GraphQL 서비스가 항상 값을 반환한다는 것을 의미합니다. 타입 언어에서는 이것을 느낌표로 나타냅니다.
- `[Episode]!` 는 `Episode` 객체의 *배열(array)* 을 나타냅니다. 또한 *non-nullable* 이기 때문에 `appearIn` 필드를 쿼리할 때 항상(0개 이상의 아이템을 가진) 배열을 기대할 수 있습니다.

이제 GraphQL 객체 타입이 무엇인지 배웠으며, 기본적인 GraphQL 타입 언어를 읽을 수 있을 것입니다.

### 인자

GraphQL 객체 타입의 모든 필드는 0개 이상의 인수를 가질 수 있습니다(예: 아래 `length` 필드).

```graphql
type Starship {
  id: ID!
  name: String!
  length(unit: LengthUnit = METER): Float
}
```

모든 인수에는 이름이 있습니다. 함수가 순서있는 인자를 가져오는 JavaScript나 Python과 같은 언어와 달리 GraphQL의 모든 인자는 특별한 이름으로 전달됩니다. 이 경우, `length` 필드는 하나의 인자 `unit` 을 가집니다.

인자는 필수거나 옵셔널일 수 있습니다. 인자가 옵셔널인 경우 *기본값* 을 정의할 수 있습니다. `unit` 인자가 전달되지 않으면 기본적으로 `METER` 로 설정됩니다.

### 쿼리 타입 & 뮤테이션 타입

스키마 대부분의 타입은 일반 객체 타입이지만 스키마 내에는 특수한 두 가지 타입이 있습니다.

```graphql
schema {
  query: Query
  mutation: Mutation
}
```

모든 GraphQL 서비스는 `query` 타입을 가지며 `mutation` 타입은 가질 수도 있고 가지지 않을 수도 있습니다. 이러한 타입은 일반 객체 타입과 동일하지만 모든 GraphQL 쿼리의 *진입점(entry point)* 을 정의하므로 특별합니다. 따라서 다음과 같은 쿼리를 볼 수 있습니다.

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

즉, GraphQL 서비스는 `hero` 및 `droid` 필드가 있는 `Query` 타입이 있어야합니다.

```graphql
type Query {
  hero(episode: Episode): Character
  droid(id: ID!): Droid
}
```

뮤테이션도 비슷한 방식으로 작동합니다. 즉, `Mutation` 타입의 필드를 정의하면 쿼리에서 호출할 수 있는 루트 뮤테이션 필드로 사용할 수 있습니다.

스키마에 대한 `진입점` 이라는 특수한 점 이외의 쿼리 타입과 뮤테이션 타입은 다른 GraphQL 객체 타입과 동일하며 해당 필드는 정확히 동일한 방식으로 작동한다는 점을 기억하세요.

### 스칼라 타입

GraphQL 객체 타입은 이름과 필드를 가지지만, 어떤 시점에서 이 필드는 구체적인 데이터로 해석되어야합니다. 이것이 스칼라 타입이 필요한 이유입니다. 즉, 쿼리의 끝을 나타냅니다.

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

해당 필드에 하위 필드가 없기 때문에 이를 알 수 있습니다. 이 필드는 쿼리의 끝부분입니다.

GraphQL 에서는 스칼라 타입들이 기본 제공됩니다.

- `Int`: 부호가 있는 32비트 정수.
- `Float`: 부호가 있는 부동소수점 값.
- `String`: UTF-8 문자열.
- `Boolean`: `true` 또는 `false`.
- `ID`: ID 스칼라 타입은 객체를 다시 요청하거나 캐시의 키로써 자주 사용되는 고유 식별자를 나타냅니다. ID 타입은 String 과 같은 방법으로 직렬화되지만, `ID` 로 정의하는 것은 사람이 읽을 수 있도록 하는 의도가 아니라는 것을 의미합니다.

대부분의 GraphQL 구현에는 커스텀 스칼라 타입을 지정하는 방법이 있습니다. 예를 들면, `Date` 타입을 정의할 수 있습니다.

```graphql
scalar Date
```

해당 타입을 직렬화, 역 직렬화, 유효성 검사하는 방법을 구현할 수 있습니다. 예를 들어, `Date` 타입을 항상 정수형 타임스탬프로 직렬화해야 한다는 것을 지정할 수 있습니다. 그리고 클라이언트는 모든 날짜 필드에 대해 해당 타입을 기대할 수 있을 것입니다.

### 열거형 타입

*Enums* 라고도 하는 열거형 타입은 특정 값들로 제한되는 특별한 종류의 스칼라입니다. 이를 통해 다음과 같은 작업을 할 수 있습니다.

1. 타입의 인자가 허용된 값 중 하나임을 검증합니다.
2. 필드가 항상 값의 열거형 집합 중 하나가 될 것임을 타입 시스템을 통해 의사소통합니다.

GraphQL 스키마 언어에서 열거형 타입 정의가 어떻게 생겼는지 봅시다.

```graphql
enum Episode {
  NEWHOPE
  EMPIRE
  JEDI
}
```

즉, 스키마에서 `Episode` 타입을 사용할 때마다 정확히 `NEWHOPE`, `EMPIRE`, `JEDI` 중 하나일 것입니다.

다양한 언어로 작성된 GraphQL 서비스 구현은 열거형 타입을 처리 할 수 있는 언어별 고유한 방법을 갖습니다. `enum` 을 지원하는 언어에서는 구현시 이를 활용할 수 있습니다. 열거형 타입이 없는 JavaScript와 같은 언어에서 이러한 값은 내부적으로 정수 집합에 매핑될 수 있습니다. 하지만 이러한 세부 정보는 클라이언트에 노출되지 않으며, 열거형 값의 문자열로만 작동합니다.

### 리스트와 Non-Null

객체 타입, 스칼라 타입, 열거형 타입은 GraphQL 에서 정의할 수 있는 유일한 타입입니다. 하지만 스키마의 다른 부분이나 쿼리 변수 선언에서 타입을 사용하면 해당 값의 유효성 검사를 할 수 있는 *타입 수정자(type modifiers)* 를 적용할 수 있습니다. 예제를 살펴봅시다.

```graphql
type Character {
  name: String!
  appearsIn: [Episode]!
}
```

`String` 타입을 사용하고 타입 뒤에 느낌표 `!` 를 추가하여 *Non-Null* 로 표시했습니다. 즉, 서버는 항상 이 필드에 대해 null이 아닌 값을 반환할 것을 기대하며, null값이 발생되면 GraphQL 실행 오류가 발생하고, 클라이언트에게 무언가 잘못되었음을 알립니다.

Non-Null 타입 수정자는 필드에 대한 인자를 정의할 때도 사용할 수 있습니다. 이는 GraphQL 서버가 문자열이나 변수 상관없이 null 값이 해당 인자로 전달되는 경우, 유효성 검사 오류를 반환하게 합니다.

```graphql
# { "graphiql": true, "variables": { "id": null } }
query DroidById($id: ID!) {
  droid(id: $id) {
    name
  }
}
```

리스트도 비슷한 방식으로 동작합니다. 타입 수정자를 사용하여 타입을 `List` 로 표시할 수 있습니다. 이 필드는 해당 타입의 배열을 반환합니다. 스키마 언어에서, 타입을 대괄호 `[]` 로 묶는 것으로 표현됩니다. 유효성 검사 단계에서 해당 값에 대한 배열이 필요한 인자에 대해서도 동일하게 작동합니다.

Non-Null 및 List 수정자를 결합할 수도 있습니다. 예를 들면, Null이 아닌 문자열 리스트를 가질 수 있습니다.

```graphql
myField: [String!]
```

즉, *list* 자체는 null 일 수 있지만, null 을 가질 수 없습니다. 예를 들면,

```js
myField: null // valid
myField: [] // valid
myField: ['a', 'b'] // valid
myField: ['a', null, 'b'] // error
```

null 이 아닌 문자열 리스트를 정의했다고 가정해봅시다.

```graphql
myField: [String]!
```

목록 자체는 null 일 수 없지만, null 값을 포함할 수 있습니다.

```js
myField: null // error
myField: [] // valid
myField: ['a', 'b'] // valid
myField: ['a', null, 'b'] // valid
```

필요에 따라 여러개의 Null, List 수정자를 중첩할 수 있습니다.

### 인터페이스

여러 타입 시스템과 마찬가지로 GraphQL도 인터페이스를 지원합니다. *인터페이스* 는 이를 구현하기 위해 타입이 포함해야하는 특정 필드들을 포함하는 추상 타입입니다.

예를 들면, Star Wars 3부작의 모든 캐릭터들을 표현하는 `Character` 인터페이스를 가질 수 있습니다.

```graphql
interface Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
}
```

이것은 `Character` 를 *구현한(implements)* 모든 타입은 이러한 인자와 리턴 타입을 가진 정확한 필드를 가져야한다는 것을 의미합니다.

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

두 타입 모두 `Character` 인터페이스의 모든 필드를 가지고 있습니다. 또한 특정 캐릭터에 추가 필드 `totalCredits`,`starships`, `primaryFunction` 을 가질 수도 있습니다.

인터페이스는 객체나 객체리스트를 반환하려는 경우에 유용하지만, 다양한 다른 타입이 있을 수도 있습니다.

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

`hero` 필드는 `Character` 타입을 반환하는데, `episode` 인자에 따라 `Human`, `Droid` 중 하나일 수 있습니다. 위 쿼리는 `primaryFunction` 을 포함하지 않는 `Character` 인터페이스에 존재하는 필드만 요청할 수 있습니다.

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

이에 대한 자세한 내용은 쿼리 가이드의 [인라인 프래그먼트](/learn/queries/#인라인-프래그먼트) 장을 참조하세요.

### 유니온 타입

유니온 타입은 인터페이스와 매우 유사하지만, 타입 간에 공통 필드를 특정하지 않습니다.

```graphql
union SearchResult = Human | Droid | Starship
```

스키마에서 `SearchResult` 타입을 반환 할 때마다, `Human`, `Droid`, `Starship` 을 얻을 수 있습니다. 유니온 타입의 멤버는 구체적인 객체 타입이어야 합니다. 인터페이스나 유니온 타입에서 다른 유니온 타입을 사용할 수 없습니다.

이 경우, `SearchResult` 유니언 타입을 반환하는 필드를 쿼리하면, 어떤 필드라도 쿼리할 수 있는 조건부 프래그먼트를 사용해야합니다.

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

### 입력 타입

지금까지는 열거형 타입이나 문자열과 같은 스칼라 값을 인자로 필드에 전달하는 방법에 대해서만 설명했습니다. 하지만 복잡한 객체도 쉽게 전달할 수 있습니다. 이는 뮤테이션에서 특히 유용합니다. 뮤테이션은 생성될 전체 객체를 전달하고자 할 수 있습니다. GraphQL 스키마 언어에서 입력 타입은 일반 객체 타입과 정확히 같지만, `type` 대신 `input` 을 사용합니다.

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

입력 객체 타입의 입력란은 입력 객체 타입을 참조할 수 있지만, 입력 및 출력 타입을 스키마에 혼합할 수는 없습니다. 또한 필드에 인자를 가질 수 없습니다.