# Text2HTML - PLEASE REPORT BUGS

## Info

Takes text and inserts it to the page as html. Useful when not wanting to use DOM Parsers, insertAdjentHTML, and innerHTML.

#### Syntax:

```js
Element.insertHTML(String position, String text)
```

This syntax is the same syntax as [insertAdjentHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML)

#### Example:

```js
document.querySelector(".main").insertHTML(
  "beforebegin",
  `
  <div class='nav'>
  <!-- Welcome to Google! -->
    <a href=https://google.com>
      <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" />
    </a>
      Welcome!
      <br>
      Google!
  </div>
  
  <style>
    body{
      margin: 0;
      color: white;
      font-size: 60px;
      letter-spacing: 2px;
      line-height: 60px;
      font-family: system-ui;
    }

    .nav{
      width: 100%;
      height: 300px;
      background-color: #2b2b2b;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    a img{
      height: 150px;
    }
  </style>

  <script>
    let a = document.querySelector("a");
    a.addEventListener("click", function (e) {
      if (!confirm("Are you sure you would like to visit google?")) {
        e.cancelBubble = true;
        e.preventDefault();
      }
    });
  </script>
`
);
```

## Supports

This function supports the following:

- Elements
  - Scripts
  - Styles
  - Self-closing
  - Attributes
    - Single quotes
    - Double quotes
    - No quotes
    - No value attributes
- Comments
- Text Nodes

## Non-Support

This function does not yet supports the following:

null
