interface DragEventHandler {
  (event: DragEvent): void;
}

export interface Draggable {
  ondragstart: DragEventHandler;
  ondragend?: DragEventHandler;
}

export interface Droppable {
  ondragover: DragEventHandler;
  ondragleave?: DragEventHandler;
  ondrop: DragEventHandler;
}
