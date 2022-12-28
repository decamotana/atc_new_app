export function getSelector(el) {
    var names = [];
    while (el.parentNode) {
        if (el.id) {
            names.unshift("#" + el.id);
            break;
        } else {
            if (el == el.ownerDocument.documentElement)
                names.unshift(el.tagName);
            else {
                for (
                    var c = 1, e = el;
                    e.previousElementSibling;
                    e = e.previousElementSibling, c++
                );
                names.unshift(el.tagName + ":nth-child(" + c + ")");
            }
            el = el.parentNode;
        }
    }
    return names.join(" > ");
}
