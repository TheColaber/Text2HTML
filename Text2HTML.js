Element.prototype.insertHTML = function (text) {
  function analyzeElement(placement, modtext) {
    let i = 0;
    while (modtext.charCodeAt(i) == 32 || modtext.charCodeAt(i) == 10) i++;
    if (i == modtext.length) return;
    if (modtext.charAt(i) == "<") {
      if (modtext.substring(i, i+4) == "<!--") {
        i += 4;
        let commentMessage = "";
        while (modtext.substring(i, i+3) != "-->") {
          commentMessage += modtext.charAt(i);
          i++;
        }
        var comment = document.createComment(commentMessage);
        placement.appendChild(comment);
        analyzeElement(placement, modtext.substring(i + 3, modtext.length));
        return;
      }
      let selfclosing = 0;
      let tagName = "";
      i++;
      for (; !(modtext.charAt(i) == ">" || modtext.charAt(i) == " " || modtext.substring(i, i+2) == "/>"); i++) tagName += modtext.charAt(i);
      try { var element = placement.appendChild(document.createElement(tagName)) }
      catch { throw `Error in creating element "${tagName}"` }
      selfclosing+= !element.outerHTML.includes("</");
      while (modtext.charAt(i) != ">") {
        while (modtext.charAt(i) == " ") i++;
        if (modtext.substring(i, i+2) == "/>") {
          selfclosing++;
          break;
        }
        let attributeName = "";
        for (; modtext.charAt(i) != "="; i++) attributeName += modtext.charAt(i);
        i++;
        let quoteType = modtext.charAt(i) == "'" || modtext.charAt(i) == '"' ? modtext.charAt(i) : false;
        i+= quoteType == "'" || quoteType == '"';
        let attributeValue = "";
        for (; quoteType == "'" || quoteType == '"' ? modtext.charAt(i) != quoteType : !(modtext.charAt(i) == " " || modtext.charAt(i) == ">"); i++) attributeValue += modtext.charAt(i);
        try { element.setAttribute(attributeName, attributeValue) }
        catch (e) { throw `Error: Failed to set the attribute "${attributeName}" to "${attributeValue}" on "${tagName}" element` }
        i+= quoteType == "'" || quoteType == '"';
      }
      let j = i + selfclosing;
      if (!selfclosing) {
        j = i
        let duplicates = 0;
        for (; j < modtext.length; j++) {
          if (modtext.substring(j, j + `<${tagName}`.length) == `<${tagName}`) duplicates++;
          if (modtext.substring(j, j + `</${tagName}>`.length) == `</${tagName}>`) {
            duplicates--;
            if (duplicates == -1) break;
          }
        }
        analyzeElement(element, modtext.substring(i+1, j));
        analyzeElement(element.parentElement, modtext.substring(j + `</${tagName}>`.length, modtext.length));
      } else analyzeElement(element.parentElement, modtext.substring(j, modtext.length));
    }
    else {
      let j = i;
      let innerText = "";
      for (; !(modtext.charCodeAt(j) == 10 || j == modtext.length); j++) {
        if (modtext.charAt(j) == "<" && modtext.substring(j, modtext.length).match(/<.*>/g).length) break;
        innerText += modtext.charAt(j);
      }
      if (placement.childNodes.length) {
        let textnode = document.createTextNode(innerText);
        placement.append(textnode);
      } else placement.innerText = innerText;
      analyzeElement(placement, modtext.substring(j, modtext.length));
    }
  }
  analyzeElement(this, text);
  return this;
}
