enum Direction {
  left = "left",
  right = "right",
  front = "front",
  back = "back"
};

function strToDirection(dir: string): Direction | null {
  switch (dir) {
    case "left":
      return Direction.left;
    case "right":
      return Direction.right;
    case "front":
      return Direction.front;
    case "back":
      return Direction.back;
    default:
      return null;
  }
}

function cw(direction: Direction) {
  switch (direction) {
    case Direction.left:
      return Direction.front;
    case Direction.front:
      return Direction.right;
    case Direction.right:
      return Direction.back;
    case Direction.back:
      return Direction.left;
  }
}

function ccw(direction: Direction) {
  switch (direction) {
    case Direction.left:
      return Direction.back;
    case Direction.back:
      return Direction.right;
    case Direction.right:
      return Direction.front;
    case Direction.front:
      return Direction.left;
  }
}

function opposite(direction: Direction) {
  switch (direction) {
    case Direction.left:
      return Direction.right;
    case Direction.right:
      return Direction.left;
    case Direction.front:
      return Direction.back;
    case Direction.back:
      return Direction.front;
  }
}

class Node<T> {  
  constructor(value: T) {
    this.value = value;
    this.neighbours = {
      left: null,
      right: null,
      front: null,
      back: null,
    };
  }

  addNeighbour(node: Node<T>, direction: Direction) {
    this.neighbours[direction] = node;
  }

  value: T;
  neighbours: {
    [key in Direction]: Node<T> | null;
  };
}

class Graph<T> {
  constructor() {
    this.nodes = [];
  }

  addNode(value: T) {
    const node = new Node(value);
    this.nodes.push(node);
    return node;
  }

  addEdge(source: Node<T>, destination: Node<T>, direction: Direction) {
    source.addNeighbour(destination, direction);
    destination.addNeighbour(source, opposite(direction));
  }

  forEach(callback: (node: Node<T>) => void) {
    this.nodes.forEach(callback);
  }
  
  nodes: Node<T>[];
}

function shortestPath<T>(
  graph: Graph<T>, 
  start: Node<T>, 
  target: Node<T>
): Node<T>[] | null {
  const visited = new Set<Node<T>>();
  const queue: [Node<T>, Node<T>[]][] = [];

  queue.push([start, [start]]);

  while (queue.length > 0) {
    const [currentNode, currentPath] = queue.shift()!;

    if (currentNode === target) {
      return currentPath;
    }

    visited.add(currentNode);

    for (const neighbour of Object.values(currentNode.neighbours)) {
      if (neighbour && !visited.has(neighbour)) {
        queue.push([neighbour, [...currentPath, neighbour]]);
      }
    }
  }
  return null;
}

export { Direction, Node, Graph, shortestPath, cw, ccw, opposite, strToDirection };