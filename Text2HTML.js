Element.prototype.insertHTML = function (position, text) {
  let elements = [];
  let thisPlacement = this;
  function analyzeElement(placement, modtext) {
    let i = 0;
    while (modtext.charCodeAt(i) == 32 || modtext.charCodeAt(i) == 10) i++;
    if (i == modtext.length) return;
    if (modtext.charAt(i) == "<") {
      if (modtext.substring(i, i + 4) == "<!--") {
        let commentMessage = "";
        for (i += 4; modtext.substring(i, i + 3) != "-->"; i++)
          commentMessage += modtext.charAt(i);
        let comment = document.createComment(commentMessage);
        if (placement == thisPlacement) elements.unshift(comment);
        else placement.appendChild(comment);
        analyzeElement(placement, modtext.substring(i + 3, modtext.length));
        return;
      }
      let selfclosing = 0;
      let tagName = "";
      for (
        i++;
        !(
          modtext.charAt(i) == ">" ||
          modtext.charAt(i) == " " ||
          modtext.substring(i, i + 2) == "/>"
        );
        i++
      )
        tagName += modtext.charAt(i);
      let element = document.createElement(tagName);
      try {
        if (placement == thisPlacement) elements.unshift(element);
        else placement.appendChild(element);
      } catch {
        throw `Error in creating element "${tagName}"`;
      }
      selfclosing += !element.outerHTML.includes("</");
      while (modtext.charAt(i) != ">") {
        while (modtext.charAt(i) == " ") i++;
        if (modtext.substring(i, i + 2) == "/>") {
          selfclosing++;
          break;
        } else if (modtext.charAt(i) == ">") {
          break;
        }
        let attributeName = "";
        for (; !(modtext.charAt(i) == "=" || modtext.charAt(i) == ">"); i++)
          attributeName += modtext.charAt(i);
        i += modtext.charAt(i) != ">";
        let quoteType =
          modtext.charAt(i) == "'" || modtext.charAt(i) == '"'
            ? modtext.charAt(i)
            : false;
        i += quoteType == "'" || quoteType == '"';
        let attributeValue = "";
        for (
          ;
          quoteType == "'" || quoteType == '"'
            ? modtext.charAt(i) != quoteType
            : !(modtext.charAt(i) == " " || modtext.charAt(i) == ">");
          i++
        )
          attributeValue += modtext.charAt(i);
        try {
          element.setAttribute(attributeName, attributeValue);
        } catch (e) {
          throw `Error: Failed to set the attribute "${attributeName}" to "${attributeValue}" on "${tagName}" element`;
        }
        i += quoteType == "'" || quoteType == '"';
      }
      let j = i + selfclosing;
      if (!selfclosing) {
        j = i;
        let duplicates = 0;
        for (; j < modtext.length; j++) {
          if (modtext.substring(j, j + `<${tagName}`.length) == `<${tagName}`)
            duplicates++;
          if (
            modtext.substring(j, j + `</${tagName}>`.length) == `</${tagName}>`
          ) {
            duplicates--;
            if (duplicates == -1) break;
          }
        }
        analyzeElement(element, modtext.substring(i + 1, j));
        analyzeElement(
          element.parentElement || thisPlacement,
          modtext.substring(j + `</${tagName}>`.length, modtext.length)
        );
      } else
        analyzeElement(
          element.parentElement,
          modtext.substring(j, modtext.length)
        );
    } else {
      let innerText = "";
      if (modtext.substring(i, modtext.length).match(/<.*>/g))
        innerText = modtext.substring(
          i,
          modtext.indexOf(
            modtext.substring(i, modtext.length).match(/<.*>/g)[0]
          )
        );
      else innerText = modtext.substring(i, modtext.length);
      if (placement.childNodes.length) {
        let textnode = document.createTextNode(innerText);
        if (placement == thisPlacement) elements.unshift(textnode);
        else placement.appendChild(textnode);
      } else placement.textContent = innerText;
      if (modtext.substring(i, modtext.length).match(/<.*>/g))
        analyzeElement(
          placement,
          modtext.substring(
            modtext.indexOf(
              modtext.substring(i, modtext.length).match(/<.*>/g)[0]
            ),
            modtext.length
          )
        );
    }
  }
  analyzeElement(this, text);
  elements.forEach((element, i) => {
    if (position == "beforeend")
      this.appendChild(elements[Math.abs(i - elements.length + 1)]);
    else if (position == "afterend") {
      if (this.nextSibling)
        this.parentElement.insertBefore(element, this.nextSibling);
      else this.parentElement.appendChild(element);
    } else if (position == "beforebegin")
      this.parentElement.insertBefore(
        elements[Math.abs(i - elements.length + 1)],
        this
      );
    else if (position == "afterbegin")
      this.insertBefore(element, this.firstChild);
  });
  return elements[1] ? elements : elements[0];
};
