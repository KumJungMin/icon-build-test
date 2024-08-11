# Icon rendering performance comparison
> show post (<a href="https://mong-blog.tistory.com/entry/%EC%95%84%EC%9D%B4%EC%BD%98-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8-%EB%A0%8C%EB%8D%94%EB%A7%81-%EB%B0%A9%EC%8B%9D-%EC%A0%95%EB%A7%90-%EC%A2%8B%EC%9D%84%EA%B9%8C-with-%EB%B9%8C%EB%93%9C-%EC%8B%9C%EA%B0%84-FID-TBT-%EB%93%B1-%EB%B9%84%EA%B5%90">link</a>)

|branch|methods|build time|dist file size|
|---|---|---|---|
|`svg-icon-file-test_`|Load svg icon file|725ms|552kb|
|`icon-component-test_`|Declare each icon as a component|9.51s|15.8mb|
|`icon-path-import-component`|Load svg file in icon folder as component|725ms|554kb|
