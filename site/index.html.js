var React = require('react');
var Site = require('./_core/Site');
var HeaderLinks = require('./_core/HeaderLinks');
var Prism = require('./_core/Prism');
var Search = require('./_core/Search');

module.exports = ({ page, section }) =>
  <Site className="index" noSearch={true} page={page}>
    <section className="fixedSearch">
      <Search />
    </section>

    <div className="hero">
      <div className="abs">
        <header aria-hidden>
          <section>
            <HeaderLinks section={section} />
          </section>
        </header>

        <section className="intro">
          <div className="named-logo">
            <img src="/img/logo.svg" />
            <h1>GraphQL</h1>
          </div>

          <div className="marketing-col">
            <h3>데이터를 표현하세요</h3>
            <Prism language="graphql">
              {`type Project {
  name: String
  tagline: String
  contributors: [User]
}`}
            </Prism>
          </div>

          <div className="marketing-col">
            <h3>원하는 것을 요청하세요</h3>
            <Prism language="graphql">
              {`{
  project(name: "GraphQL") {
    tagline
  }
}`}
            </Prism>
          </div>

          <div className="marketing-col">
            <h3>예측가능한 결과를 얻으세요</h3>
            <Prism language="json">
              {`{
  "project": {
    "tagline": "A query language for APIs"
  }
}`}
            </Prism>
          </div>
        </section>

        <div className="buttons-unit">
          <a className="button" href="/code/">
            시작하기
          </a>
          <a className="button" href="/learn/">
            자세히보기
          </a>
        </div>

      </div>
    </div>

    <section className="lead">
      <h1>API를 위한 쿼리 언어</h1>
      <p>
        GraphQL은 API를 위한 쿼리 언어이며 이미 존재하는 데이터로 쿼리를 수행하기 위한 런타임
        입니다. GraphQL은 API에 있는 데이터에 대한 완벽하고 이해하기 쉬운 설명을 제공하고
        클라이언트에게 필요한 것을 정확하게 요청할 수 있는 기능을 제공하며 시간이 지남에 따라
        API를 쉽게 진화시키고 강력한 개발자 도구를 지원합니다.</p>
    </section>

    <section className="point1" id="predictable-results">
      <div className="prose">
        <h2>필요한 것을 구체적으로 요청하세요</h2>
        {/*[Illustration: just a simple query and response?]*/}
        <p>
          API에 GraphQL 쿼리를 보내고 필요한 것만 정확히 얻으세요. GraphQL 쿼리는
          항상 예측 가능한 결과를 반환합니다. GraphQL을 사용하는 앱은 서버가 아닌
          데이터를 제어하기 때문에 빠르며 안정적입니다.</p>
      </div>
      <div className="window faux-graphiql" aria-hidden>
        <div className="query">
          <pre className="prism">
            {'{'}
            {'\n  hero {'}
            {'\n    name'}
            {'\n    height\n    mass'.split('').map((c, i) =>
              <span key={i} id={'ch' + i} className="ch">{c === '\n' ? <br/> : c}</span>)}
            <span className="cursor" />
            {'\n  }'}
            {'\n}'}
          </pre>
        </div>
        <div className="response">
          <div id="r1">
            <Prism language="json">
              {`{
  "hero": {
    "name": "Luke Skywalker"
  }
}`}
            </Prism>
          </div>
          <div id="r2">
            <Prism language="json">
              {`{
  "hero": {
    "name": "Luke Skywalker",
    "height": 1.72
  }
}`}
            </Prism>
          </div>
          <div id="r3">
            <Prism language="json">
              {`{
  "hero": {
    "name": "Luke Skywalker",
    "height": 1.72,
    "mass": 77
  }
}`}
            </Prism>
          </div>
        </div>
        <script dangerouslySetInnerHTML={{__html: `(function(){
          var i = 0;
          var forward = true;
          setTimeout(type, 2000);
          showResponse(1);
          function type() {
            if (forward) {
              document.getElementById('ch' + i).style.display = 'inline';
              i++;
              if (i === 20) {
                forward = false;
                showResponse(3);
                setTimeout(type, 1500);
              } else if (i === 11) {
                showResponse(2);
                setTimeout(type, 1500);
              } else {
                setTimeout(type, Math.random() * 180 + 70);
              }
            } else {
              i--;
              document.getElementById('ch' + i).style.display = 'none';
              if (i === 0) {
                forward = true;
                showResponse(1);
                setTimeout(type, 2000);
              } else {
                setTimeout(type, 80);
              }
            }
          }
          function showResponse(num) {
            document.getElementById('r1').style.display = num === 1 ? 'block' : 'none';
            document.getElementById('r2').style.display = num === 2 ? 'block' : 'none';
            document.getElementById('r3').style.display = num === 3 ? 'block' : 'none';
          }
        })()`}} />
      </div>
    </section>

    <div className="grayWash">
      <section className="point2" id="single-request">
        <div className="prose">
          <h2>단일 요청으로 많은<br/>데이터를 얻으세요</h2>
          {/*Illustration: a query 2 or 3 levels deep]*/}
          <p>
            GraphQL 쿼리는 하나의 리소스 속성에 액세스할 뿐만 아니라 이 리소스 간의 참조를
            자연스럽게 이해합니다. 일반적인 REST API는 여러 URL에서 데이터를 받아와야 하지만
            GraphQL API는 한번의 요청으로 앱에 필요한 모든 데이터를 가져옵니다. GraphQL을
            사용하는 앱은 느린 모바일 네트워크 연결에서도 빠르게 수행 할 수 있습니다.</p>
        </div>
        <div className="app-to-server" aria-hidden>
          <img src="/img/phone.svg" width="496" height="440" className="phone" />
          <div className="query">
          <Prism language="graphql">
            {`{
  hero {
    name
    friends {
      name
    }
  }
}`}
          </Prism>
          </div>
          <div className="response">
          <Prism language="json">
            {`{
  "hero": {
    "name": "Luke Skywalker",
    "friends": [
      { "name": "Obi-Wan Kenobi" },
      { "name": "R2-D2" },
      { "name": "Han Solo" },
      { "name": "Leia Organa" }
    ]
  }
}`}
          </Prism>
          </div>
          <img src="/img/server.svg" width="496" height="440" className="server" />
        </div>
      </section>
    </div>

    <section className="point3" id="type-system">
      <div className="prose">
        <h2>타입 시스템으로<br/>가능한것을 살펴보세요</h2>
        {/*Illustration of a type IDL following a query by line]*/}
        {/*Under: a server <-> client (Capabilities, Requirements)]?*/}
        <p>
          GraphQL API는 엔드포인트가 아닌 타입 및 필드로 구성됩니다. 단일 엔드포인트에서
          데이터의 모든 기능에 엑세스 하세요. GraphQL은 타입시스템을 사용하여 앱이 가능한 것을
          요청하고 명확하고 유용한 오류를 제공하는 것을 보장합니다. 앱은 타입을 사용하여 수동 파싱
          코드 작성을 피할 수 있습니다.</p>
      </div>
      <div className="window strong-typed-query" aria-hidden>
      <div className="query">
      <div id="query-highlight" className="highlight" />
      <Prism language="graphql">
            {`{
  hero {
    name
    friends {
      name
      homeWorld {
        name
        climate
      }
      species {
        name
        lifespan
        origin {
          name
        }
      }
    }
  }
}`}
      </Prism>
      </div>
      <div className="type-system">
      <div id="type-highlight" className="highlight" />
      <Prism language="graphql">
            {`type Query {
  hero: Character
}

type Character {
  name: String
  friends: [Character]
  homeWorld: Planet
  species: Species
}

type Planet {
  name: String
  climate: String
}

type Species {
  name: String
  lifespan: Int
  origin: Planet
}`}
      </Prism>
      </div>
      <script dangerouslySetInnerHTML={{__html: `(function(){
        var typeHighlight = document.getElementById('type-highlight');
        var queryHighlight = document.getElementById('query-highlight');
        var line = 0;
        var typeLines  = [2,6,7,6,8,13,14, 9,18,19,20,13];
        var queryLines = [2,3,4,5,6, 7, 8,10,11,12,13,14];
        highlightLine();
        function highlightLine() {
          typeHighlight.style.top = (17 * typeLines[line] - 9) + 'px';
          queryHighlight.style.top = (17 * queryLines[line] - 9) + 'px';
          line = (line + 1) % typeLines.length;
          setTimeout(highlightLine, 800 + Math.random() * 200);
        }
      })()`}} />
      </div>
    </section>

    <div className="darkWash">
    <section className="point4" id="powerful-tools">
      <div className="prose">
        <h2>강력한 개발자 도구를<br />사용해보세요</h2>
        {/*Illustration of GraphiQL validation error and typeahead, animated?]*/}
        <p>
          이제 편집기를 벗어나지 않고도 API에서 요청할 수 있는 데이터를 정확히 파악하고
          쿼리를 보내기 전에 잠재적인 문제를 표시해주며 향상된 코드 인텔리전스를 활용할
          수 있습니다. GraphQL을 사용하면 API의 타입 시스템을 활용하여 <a href="https://github.com/graphql/graphiql" target="_blank">Graph<em>i</em>QL</a>과
          같은 강력한 도구를 쉽게 만들 수 있습니다.</p>
      </div>
      <div className="graphiqlVid" dangerouslySetInnerHTML={{__html: `
        <video autoplay loop playsinline>
          <source src="/img/graphiql.mp4?x" type="video/mp4" />
        </video>
      `}} />
    </section>
    </div>

    <div className="grayWash">
    <section className="point5" id="without-versions">
      <div className="prose">
        <h2>버전 없이 API를<br/> 진화시키세요</h2>
        {/*Illustration showing more legs added to a graph? Or a type evolving over time?]*/}
        <p>
          기존 쿼리에 영향을 주지 않고 GraphQL API에 새로운 필드와 타입을 추가하세요.
          오래된 필드는 더이상 사용되지 않도록 도구에서 숨길 수 있습니다.
          진화하는 단일 버전을 사용함으로써 GraphQL API는 새로운 기능에 대한 지속적인
          엑세스를 제공하고 보다 꺠끗하고 유지보수가 쉬운 서버 코드를 작성하도록 도와줍니다.</p>
      </div>
      <div className="window type-evolution" aria-hidden>
        <div id="typeEvolveView">
          <div className="v1">
            <Prism language="graphql">
              {`type Film {
  title: String
  episode: Int
  releaseDate: String



}`}
            </Prism>
          </div>
          <div className="v2">
            <div className="add" />
            <Prism language="graphql">
              {`type Film {
  title: String
  episode: Int
  releaseDate: String
  openingCrawl: String


}`}
            </Prism>
          </div>
          <div className="v3">
            <div className="add" />
            <Prism language="graphql">
              {`type Film {
  title: String
  episode: Int
  releaseDate: String
  openingCrawl: String
  director: String

}`}
            </Prism>
          </div>
          <div className="v4">
            <div className="add" />
            <div className="add" />
            <div className="add" />
            <div className="add" />
            <div className="add" />
            <div className="add" />
            <div className="remove" />
            <Prism language="graphql">
              {`type Film {
  title: String
  episode: Int
  releaseDate: String
  openingCrawl: String
  director: String
  directedBy: Person
}

type Person {
  name: String
  directed: [Film]
  actedIn: [Film]
}`}
            </Prism>
          </div>
          <div className="v5">
            <div className="add" />
            <Prism language="graphql">
              {`type Film {
  title: String
  episode: Int
  releaseDate: String
  openingCrawl: String
  director: String @deprecated
  directedBy: Person
}

type Person {
  name: String
  directed: [Film]
  actedIn: [Film]
}`}
            </Prism>
          </div>
        </div>
        <script dangerouslySetInnerHTML={{__html: `(function(){
          var i = 0;
          var inView = document.getElementById('typeEvolveView');
          inView.className = 'step' + i;
          setInterval(function () {
            i = (i + 1) % 7;
            inView.className = 'step' + i;
          }, 2200);
        })()`}} />
      </div>
    </section>
    </div>

    <section className="point6" id="bring-your-own-code">
      <div className="prose">
        <h2>기존 데이터와<br/>코드를 사용하세요</h2>
        {/*Illustration of each field becoming a function?]*/}
        <p>
          GraphQL은 특정 스토리지 엔진에 제한받지 않고 전체 애플리케이션에 걸쳐 균일한
          API를 생성합니다. 다양한 언어로 제공되는 GraphQL 엔진으로 기존 데이터 및 코드를
          활용하는 GraphQL API를 작성해보세요. 타입 시스템의 각 필드에 대한 함수를 제공하고
          GraphQL은 이를 최적적, 동시적으로 호출합니다.</p>
      </div>
      <div className="window leverage-code" aria-hidden>
        <div id="leverageCodeView">
          <Prism language="graphql">
            {`type Character {
  name: String
  homeWorld: Planet
  friends: [Character]
}`}
          </Prism>
          <Prism>
            {`// type Character {
class Character {
  // name: String
  getName() {
    return this._name
  }

  // homeWorld: Planet
  getHomeWorld() {
    return fetchHomeworld(this._homeworldID)
  }

  // friends: [Character]
  getFriends() {
    return this._friendIDs.map(fetchCharacter)
  }
}`}
          </Prism>
          <Prism language="python">
            {`# type Character {
class Character:
  # name: String
  def name(self):
    return self._name

  # homeWorld: Planet
  def homeWorld(self):
    return fetchHomeworld(self._homeworldID)

  # friends: [Character]
  def friends(self):
    return map(fetchCharacter, self._friendIDs)
`}
          </Prism>
          <Prism>
            {`// type Character {
public class Character {
  // name: String
  public String Name { get; }

  // homeWorld: Planet
  public async Task<Planet> GetHomeWorldAsync() {
    return await FetchHomeworldAsync(_HomeworldID);
  }

  // friends: [Character]
  public async IEnumerable<Task<Character>> GetFriendsAsync() {
    return _FriendIDs.Select(FetchCharacterAsync);
  }
}`}
          </Prism>
        </div>
        <script dangerouslySetInnerHTML={{__html: `(function(){
          var i = 0;
          var inView = document.getElementById('leverageCodeView');
          var delayBefore = [ 800, 1800, 1200, 3000, 3000, 3000 ];
          function step() {
            inView.className = 'step' + i;
            i = (i + 1) % 6;
            setTimeout(step, delayBefore[i]);
          }
          step();
        })()`}} />
      </div>
    </section>

    <section className="powered-by" id="whos-using">
      <div className="prose">
        <h2>GraphQL을 사용하는 기업</h2>
        <p>
          Facebook의 모바일 앱은 2012년부터 GraphQL에 의해 제공되었습니다.
          GraphQL 명세는 2015년부터 제공되며 현재 다양한 환경에서 사용할 수 있으며
          모든 규모의 팀에서 사용됩니다.</p>
      </div>
      <div className="logos">
        {/* Waiting for permission from some of the below */}
        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
          <img src="/users/logos/facebook.png" title="Facebook" />
        </a>
        {/** /}
        <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
          <img src="/users/logos/twitter.png" title="Twitter" className="round" />
        </a>
        {/**/}
        <a href="https://developer.github.com/v4/" target="_blank" rel="noopener noreferrer">
          <img src="/users/logos/github.png" title="GitHub" className="round" />
        </a>
        <a href="https://www.pinterest.com/" target="_blank" rel="noopener noreferrer">
          <img src="/users/logos/pinterest.png" title="Pinterest" className="round" />
        </a>
        {/** /}
        <a href="https://www.airbnb.com/" target="_blank" rel="noopener noreferrer">
          <img src="/users/logos/airbnb.png" title="Airbnb" className="round" />
        </a>
        {/**/}
        <a href="https://www.intuit.com/" target="_blank" rel="noopener noreferrer">
          <img src="/users/logos/intuit.png" title="Intuit" />
        </a>
        <a href="https://www.coursera.org/" target="_blank" rel="noopener noreferrer">
          <img src="/users/logos/coursera.png" title="Coursera" />
        </a>
        <a href="https://www.shopify.com/" target="_blank" rel="noopener noreferrer">
          <img src="/users/logos/shopify.png" title="Shopify" className="round" />
        </a>
      </div>

      <a className="button" href="/users/">
        GraphQL을 사용하는 기업들
      </a>

    </section>

  </Site>
