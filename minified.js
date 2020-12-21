Element.prototype.insertHTML = function (t, e) {
  let r = [],
    n = this;
  return (
    (function t(e, h) {
      let i = 0;
      for (; 32 == h.charCodeAt(i) || 10 == h.charCodeAt(i); ) i++;
      if (i != h.length)
        if ("<" == h.charAt(i)) {
          if ("\x3c!--" == h.substring(i, i + 4)) {
            let s = "";
            for (i += 4; "--\x3e" != h.substring(i, i + 3); i++)
              s += h.charAt(i);
            let l = document.createComment(s);
            return (
              e == n ? r.unshift(l) : e.appendChild(l),
              void t(e, h.substring(i + 3, h.length))
            );
          }
          let s = 0,
            l = "";
          for (
            i++;
            ">" != h.charAt(i) &&
            " " != h.charAt(i) &&
            "/>" != h.substring(i, i + 2);
            i++
          )
            l += h.charAt(i);
          let a = document.createElement(l);
          try {
            e == n ? r.unshift(a) : e.appendChild(a);
          } catch {
            throw `Error in creating element "${l}"`;
          }
          for (s += !a.outerHTML.includes("</"); ">" != h.charAt(i); ) {
            for (; " " == h.charAt(i); ) i++;
            if ("/>" == h.substring(i, i + 2)) {
              s++;
              break;
            }
            if (">" == h.charAt(i)) break;
            let t = "";
            for (; "=" != h.charAt(i) && ">" != h.charAt(i); i++)
              t += h.charAt(i);
            i += ">" != h.charAt(i);
            let e = ("'" == h.charAt(i) || '"' == h.charAt(i)) && h.charAt(i);
            i += "'" == e || '"' == e;
            let r = "";
            for (
              ;
              "'" == e || '"' == e
                ? h.charAt(i) != e
                : " " != h.charAt(i) && ">" != h.charAt(i);
              i++
            )
              r += h.charAt(i);
            try {
              a.setAttribute(t, r);
            } catch (e) {
              throw `Error: Failed to set the attribute "${t}" to "${r}" on "${l}" element`;
            }
            i += "'" == e || '"' == e;
          }
          let g = i + s;
          if (s) t(a.parentElement, h.substring(g, h.length));
          else {
            g = i;
            let e = 0;
            for (
              ;
              g < h.length &&
              (h.substring(g, g + `<${l}`.length) == `<${l}` && e++,
              h.substring(g, g + `</${l}>`.length) != `</${l}>` || -1 != --e);
              g++
            );
            t(a, h.substring(i + 1, g)),
              t(
                a.parentElement || n,
                h.substring(g + `</${l}>`.length, h.length)
              );
          }
        } else {
          let s = "";
          if (
            ((s = h.substring(i, h.length).match(/<.*>/g)
              ? h.substring(
                  i,
                  h.indexOf(h.substring(i, h.length).match(/<.*>/g)[0])
                )
              : h.substring(i, h.length)),
            e.childNodes.length)
          ) {
            let t = document.createTextNode(s);
            e == n ? r.unshift(t) : e.appendChild(t);
          } else e.textContent = s;
          h.substring(i, h.length).match(/<.*>/g) &&
            t(
              e,
              h.substring(
                h.indexOf(h.substring(i, h.length).match(/<.*>/g)[0]),
                h.length
              )
            );
        }
    })(this, e),
    r.forEach((e, n) => {
      "beforeend" == t
        ? this.appendChild(r[Math.abs(n - r.length + 1)])
        : "afterend" == t
        ? this.nextSibling
          ? this.parentElement.insertBefore(e, this.nextSibling)
          : this.parentElement.appendChild(e)
        : "beforebegin" == t
        ? this.parentElement.insertBefore(r[Math.abs(n - r.length + 1)], this)
        : "afterbegin" == t && this.insertBefore(e, this.firstChild);
    }),
    r[1] ? r : r[0]
  );
};
