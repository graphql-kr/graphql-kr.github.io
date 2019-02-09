/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

var React = require('react');
var HeaderLinks = require('./HeaderLinks');
var Search = require('./Search');
var SiteData = require('./SiteData');
var ReactGA = require('react-ga');
ReactGA.initialize('UA-99001722-7');

export default ({ page, category, title, section, className, noSearch, children }) =>
  <html>
    <head>


      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
      <meta name="google-site-verification" content="wt4jHZa0ru-stSJJrlY5sSJzj9MB0ZA6BzkprNilZdM" />
      <title>
        {title ?
          `${title} | ${category || 'GraphQL'}` :
          `GraphQL | ${SiteData.description}`}
      </title>
      <meta name="viewport" content="width=640" />
      <meta property="og:title" content="GraphQL: API를 위한 쿼리 언어" />
      <meta property="og:description" content="GraphQL은 API에 있는 데이터에 대한 완벽하고 이해하기 쉬운 설명을 제공하고 클라이언트에게 필요한 것을 정확하게 요청할 수 있는 기능을 제공하며 시간이 지남에 따라 API를 쉽게 진화시키고 강력한 개발자 도구를 지원합니다." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="http://graphql-kr.github.io" />
      <meta property="og:image" content="/img/og_image.png" />
      <meta property="og:image:type" content="image/png" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@graphql" />
      <meta name="twitter:title" content="GraphQL: API를 위한 쿼리 언어" />
      <meta name="twitter:description" content="GraphQL gives clients the power to ask for exactly what they need and nothing more, making it easier to evolve APIs over time." />
      <meta name="twitter:image" content="/img/twitter_image.png" />
      <link rel="shortcut icon" href="/img/favicon.png" />
      <link rel="home" type="application/rss+xml" href="/blog/rss.xml" title="GraphQL Team Blog" />
      <link rel="stylesheet" href="/style.css" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Rubik:300|Roboto:300" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,400i,600" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/docsearch.js/1/docsearch.min.css" />
    </head>
    <body className={className}>

      <header>
        <section>
          <a className="nav-home" href="/">
            <img className="nav-logo" src="/img/logo.svg" width="30" height="30" />
            GraphQL
          </a>
          <HeaderLinks section={section} />
          {noSearch || <Search />}
        </section>
      </header>

      {children}

      <footer>
        <section className="sitemap">
          <a href="/" className="nav-home" />
          <div>
            <h5><a href="/learn/">배우기</a></h5>
            <a href="/learn/">소개</a>
            <a href="/learn/queries/">쿼리 언어</a>
            <a href="/learn/schema/">타입 시스템</a>
            <a href="/learn/execution/">실행</a>
            <a href="/learn/best-practices/">모범 사례</a>
          </div>
          <div>
            <h5><a href="/code">코드</a></h5>
            <a href="/code/#server-libraries">서버</a>
            <a href="/code/#graphql-clients">클라이언트</a>
            <a href="/code/#tools">도구</a>
          </div>
          <div>
            <h5><a href="/community">커뮤니티</a></h5>
            <a href="/community/upcoming-events/">이벤트</a>
            <a href="http://stackoverflow.com/questions/tagged/graphql" target="_blank" rel="noopener noreferrer">스택 오버플로우</a>
            <a href="https://www.facebook.com/groups/graphql.community/" target="_blank" rel="noopener noreferrer">페이스북 그룹</a>
            <a href="https://twitter.com/GraphQL" target="_blank" rel="noopener noreferrer">트위터</a>
          </div>
          <div>
            <h5>기타</h5>
            <a href="/blog">GraphQL 팀 블로그</a>
            <a href="http://facebook.github.io/graphql/" target="_blank" rel="noopener noreferrer">명세</a>
            <a href="https://github.com/graphql" target="_blank" rel="noopener noreferrer">깃허브</a>
            {page && <a href={'https://github.com/graphql/graphql.github.io/edit/source/site/' + page.relPath} target="_blank" rel="noopener noreferrer">이 페이지 수정 &#x270E;</a>}
          </div>
        </section>
        <a href="https://code.facebook.com/projects/" target="_blank" rel="noopener noreferrer" className="fbOpenSource">
          <img src="/img/oss_logo.png" alt="Facebook Open Source" width="170" height="45" />
        </a>
        <section className="copyright">
          Copyright &copy;
          <span><script>document.write(new Date().getFullYear())</script> </span>
          <noscript>2017 </noscript>
          Facebook Inc. The contents of this page are licensed BSD-3-Clause.
        </section>
      </footer>

      <script type="text/javascript" src="https://cdn.jsdelivr.net/docsearch.js/1/docsearch.min.js"></script>
      <script dangerouslySetInnerHTML={{__html: `
        docsearch({
          apiKey: 'd103541f3e6041148aade2e746ed4d61',
          indexName: 'graphql',
          inputSelector: '#algolia-search-input'
        });
      `}} />
      <script dangerouslySetInnerHTML={{__html: `
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-99001722-7', 'auto');
ga('send', 'pageview');
      `}} />
    </body>
  </html>
