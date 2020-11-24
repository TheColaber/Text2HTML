Element.prototype.insertHTML = function (text) {
  function analyzeElement(placement, modtext) {
    let i = 0;
    while (modtext.charCodeAt(i) == 32 || modtext.charCodeAt(i) == 10) { i++ }
    if (i == modtext.length) return;
    if (modtext.charAt(i) == "<") { // This is an element/comment
      if (modtext.substring(i, i+4) == "<!--") { // Element is comment?
        i += 4
        let commentMessage = ""
        while (modtext.substring(i, i+3) != "-->") { // We will find what was written in the comment
          commentMessage += modtext.charAt(i)
          i++
        }
        var comment = document.createComment(commentMessage);
        placement.appendChild(comment);
        analyzeElement(placement, modtext.substring(i + 3, modtext.length)) // Let's analyze our siblings
        return;
      }
      let selfclosing = 0
      let tagName = "";
      i++
      while (!(modtext.charAt(i) == ">" || modtext.charAt(i) == " " || modtext.substring(i, i+2) == "/>")) { // Find tag name
        tagName += modtext.charAt(i)
        i++
      }
      try {
        let element = placement.appendChild(document.createElement(tagName)) // Create an element to append
      } catch (e) {
        throw `Error in creating element "${tagName}"`
      }
      selfclosing+= !element.outerHTML.includes("</");
      while (modtext.charAt(i) != ">") { // Repeat till end of starting tag
        while (modtext.charAt(i) == " ") { i++ }
        if (modtext.substring(i, i+2) == "/>") {
          selfclosing++
          break;
        }
        let attributeName = ""
        while (modtext.charAt(i) != "=") { // Find attribute name
          attributeName += modtext.charAt(i)
          i++
        }
        i++
        let quoteType = modtext.charAt(i); // Get the type of quote the user was using to start
        i++
        let attributeValue = ""
        while (modtext.charAt(i) != quoteType) { // Get attribute value
          attributeValue += modtext.charAt(i)
          i++
        }
        element.setAttribute(attributeName, attributeValue) // Set these atrributes to the element appended
        i++
      }
      let j = i + selfclosing;
      if (!selfclosing) {
        j = i
        let duplicates = 0;
        while (j < modtext.length) {
          if (modtext.substring(j, j + `<${tagName}`.length) == `<${tagName}`) duplicates++
          if (modtext.substring(j, j + `</${tagName}>`.length) == `</${tagName}>`) { // Found Ends of duplicates? We can reduse the variable
            duplicates--
            if (duplicates == -1) break;
          }
          j++
        }
        analyzeElement(element, modtext.substring(i+1, j)) // Let's analyze our inner
        analyzeElement(element.parentElement, modtext.substring(j + `</${tagName}>`.length, modtext.length)) // Let's analyze our siblings
      } else analyzeElement(element.parentElement, modtext.substring(j, modtext.length)) // Let's analyze our siblings
    }
    else { // This is a text node
      let j = i;
      let innerText = "";
      while (!(modtext.charCodeAt(j) == 10 || j == modtext.length)) {
        if (modtext.charAt(j) == "<" && modtext.substring(j, modtext.length).match(/<.*>/g).length) break;
        innerText += modtext.charAt(j);
        j++;
      }
      if (placement.childNodes.length) { // Does our parent have any nodes already? If so let's create a text node
        let textnode = document.createTextNode(innerText)
        placement.append(textnode)
      } else placement.innerText = innerText;
      analyzeElement(placement, modtext.substring(j, modtext.length))
    }
  }
  analyzeElement(this, text)
  return this;
}
