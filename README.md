# Icon rendering performance comparison


|branch|methods|build time|dist file size|
|---|---|---|---|
|`icon-component-test_`|Declare each icon as a component|725ms|552kb|
|`icon-path-import-component`|Load svg file in icon folder as component|9.51s|15.8mb|
|`svg-icon-file-test_`|Load svg icon file|889ms|555kb|
