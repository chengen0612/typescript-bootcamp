const rootElement = document.createElement("div");

rootElement.id = "root";
rootElement.style.fontSize = "3rem";
document.body.appendChild(rootElement);

function replaceText(text: string, elementId: string) {
  return function (_: Function) {
    const target = document.getElementById(elementId)!;
    target.textContent = text;
  };
}

@replaceText("Hello", "root")
class C {}
