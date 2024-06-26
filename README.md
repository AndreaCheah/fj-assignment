# fj-assignment

I took reference from ChatGPT and Google for this assignment.

## Take Home Assignment

### Question 5: Edge cases
1. Nested template literals  
The AST method supports nested structures. Each node is examined regardless of its nesting level, which ensures that template literals within other template literals are visited.  
2. Comments within template literals  
Nodes are parsed based on their syntax and not just their text content, so that the parser can identify the boundaries of template literals and comments correctly.
3. Empty template literals  
An empty template literal is another node in the AST, and the AST treats all template literals the same way regardless of the content within the template literals.
4. Multiple template literals in a line  
The AST represents each template literal as a distinct node, so each of the multiple template literals on a single line is processed separately. Each literal is individually formatted and replaced back into its original position within the AST, preserving the code layout.
5. No template literals  
The AST method finds no nodes for processing. The output would be the original input without modification.

### Question 6: Time and space complexities  
Assuming n is the length of the code.  
- Time complexity is O(n).  
Parsing the code into an AST which takes O(n) time + Traversing the AST which takes O(n) time + Generating the code from AST which takes O(n) time  
= Total time O(n)
- Space complexity is O(n).  
Storing the AST takes O(n) space in terms of the number of nodes relative to the size of the input code.

## Additional Questions

### Question 1

1. This error occurs when the `document` object does not exist. It is part of the Document Object Model (DOM), which is specific to browsers. The JavaScript code is running in a non-browser environment like Node.js where there is no DOM to interact with.

2. To solve this, we can either

- run the script in a browser context where the DOM API is available. The script should be part of a webpage.
- run the code in Node.js and use a virtual DOM implementation. We can use a library such as `jsdom` to simulate a browser-like environment.

### Question 2

- The catch block is empty and does not contain any code to handle the exception. Although the exception may be caught, nothing is done with it.
- To manage this, we could modify the catch block to include error handling, such as logging the error to the console.

### Question 3

- The error type is the CORS (Cross-Origin Resource Sharing) error, which happens when the frontend application's domain and the GitHub API's domain are different. Our browser detects an attempt to make a request to a different domain and blocks the HTTP request from being successfully completed when the server does not support CORS and does not include appropriate headers in the server's responses.
- To overcome this, we could set up a proxy server that forwards the requests to GitHub API. It can be configured to add CORS headers to responses. An example is to use the middleware package in Node.js.

```
const { createProxyMiddleware } = require('http-proxy-middleware');

app.use('/github', createProxyMiddleware({
  target: 'https://api.github.com',
  changeOrigin: true,
  pathRewrite: {
    '^/github': '',
  },
}));
```

### Question 4

- The iframe may not have loaded completely when the script runs, so `contentWindow` may be referencing incomplete contents within the `window` object. The document within the iframe may not be fully parsed, for example the `<H1>` element may not yet exist in the document tree when we try to access it.
- To handle this, we can use iframe's `load` event to ensure that all contents are fully loaded before accessing them. Modifying the code:

```
var iframe = document.getElementById('myFrame');
iframe.addEventListener('load', function() {
    var iframeDoc = iframe.contentWindow.document;
    var element = iframeDoc.getElementsByTagName('H1')[0];
    if (element) {
        var styles = window.getComputedStyle(element);
        console.log(styles.cssText);  // Now safely accessing the styles
    }
});
```

### Question 5

- It could be that during the bundling process, caching is applied to optimise the process. The image retrieved is the old image in the cache.
- Modify the image URL in our project by appending a version number or timestamp as a query parameter. Web browsers typically cache files based on their URLs. When the URL changes, web browsers make a new request to the server to fetch the file.

### Question 6

- `fs` is defined in any Node.js environment such as when running server-side JavaScript or build tools that operate in a Node.js context.
- The `fs` module is undefined in browser environments because the browser does not have direct access to the file system for security reasons. This can occur when code meant for Node.js execution is bundled in browser code. Some part of the build is relying on Node.js-specific code in a context (like the browser) which does not support it.
- To resolve the case that `fs` is undefined and make it defined, we can use polyfills that mimic the filesystem API e.g. BrowserFS.

### Question 7

- The `forEach` does not wait for the promises to resolve before moving on to the next iteration. When the `console.log(users)` statement is run, the `getUser` operations might not have completed.
- Use `Promise.all` with `map` to tackle this. With `map`, we create an array of promises and then wait for all these promises to resolve before using `Promise.all`. This would ensure that all user data is fetched before logging `users`.
