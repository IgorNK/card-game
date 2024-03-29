enum Direction {
  left = "left",
  right = "right",
  front = "front",
  back = "back"
};

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
    this.neighbours = {};
  }

  addNeighbour(node: Node<T>, direction: Direction) {
    this.neighbours[direction] = node;
  }

  value: T;
  neighbours: {
    [key: Direction]: Node<T>,
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
  
  private nodes: Node<T>[];
}

function shortestPath(
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
      if (!visited.has(neighbour)) {
        queue.push([neighbour, [...currentPath, neighbour]]);
      }
    }
  }
  return null;
}

export { Direction, Node, Graph, shortestPath };