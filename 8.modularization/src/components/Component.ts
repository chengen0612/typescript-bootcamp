export abstract class Component<T extends HTMLElement, V extends HTMLElement> {
  readonly instance: T;
  protected parentNode: V;

  constructor(templateId: string, parentId: string) {
    const template = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    const clone = template.content.firstElementChild!.cloneNode(true) as T;
    const parentNode = document.getElementById(parentId)! as V;

    this.instance = clone;
    this.parentNode = parentNode;
  }

  protected render() {
    this.parentNode.appendChild(this.instance);
  }
}
