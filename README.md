# Text2HTML - WIP - PLEASE REPORT BUGS

## Info

Takes text and inserts it to the page as html. Useful when not wanting to use DOM Parsers, insertAdjentHTML, and innerHTML.

#### Syntax:

```js
Element.insertHTML(text String)
```

#### Example:

```js
document.querySelector(".main").insertHTML(`
<div class='nav'>
<!-- Welcome to Google! -->
  <a href=https://google.com>
    <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" />
  </a>
    Welcome!
    <br>
    Google!
</div>
`);
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
