class PathFinder {
    nodes = [];

    init() {
        this.controller = new PathFinderController(this, document.getElementById('pathFinderCanvas'));
        this.grid = new Grid(this);
        this.pathFinderPanel = new PathFinderPanel(this);

        this.prepareData();

        this.deltaTime = 0;
        this.lastUpdate = Date.now();
        requestAnimationFrame(() => this.onUpdate());
    }

    prepareData() {
        this.boxSize = 51;
        this.margin = 1;
        this.nodes = [];
        this.transitionSpeed = 150;

        for (let x = this.margin; x <= this.controller.canvas.width - this.boxSize + this.margin - this.pathFinderPanel?.width; x += this.boxSize + this.margin) {
            for (let y = this.margin; y <= this.controller.canvas.height - this.boxSize + this.margin; y += this.boxSize + this.margin) {
                this.nodes.push(new Node1({
                    x,
                    y,
                    width: this.boxSize,
                    height: this.boxSize, 
                    type: 1
                }));
            }
        }

        this.startNode = this.nodes[this.getRandomInteger(0, this.nodes.length)];
        this.endNode = this.nodes[this.getRandomInteger(0, this.nodes.length)];

        if (this.startNode) {
            this.startNode.type = 3;
        }
        if (this.endNode) {
            this.endNode.type = 4;
        }
    }

    getRandomInteger(min, max) {
        const rand = min - 0.5 + Math.random() * (max - min);
        return Math.round(rand);
    }

    onUpdate() {
        this.controller.ctx.clearRect(0, 0, this.controller.canvas.width, this.controller.canvas.height);

        const now = Date.now();
        this.deltaTime = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;
    
        this.pathFinderPanel.draw();
        this.grid.draw();

        requestAnimationFrame(() => this.onUpdate());
    }

    mouseUp() {
        this.controller.mouse.brush.type = 0;
        this.pathFinderPanel.mouseUp();
        this.grid.draw();
    }

    mouseDown() {
        this.pathFinderPanel.mouseDown();
        this.grid.draw();
    }

    mouseMove() {
        this.pathFinderPanel.mouseMove();
        this.grid.draw();
    }

    onResizeCanvas() {
        this.pathFinderPanel?.onResizeCanvas();
        this.grid?.draw();
    }

    clearSearch() {
        this.nodes.filter(node => [5 /* Exploring */, 6 /* Visited */, 7 /* Path */].includes(node.type)).forEach(node => {
            node.type = 1; // Free
        });
        this.nodes.forEach(node => {
            node.walkCost = null;
            node.heuristic = null;
        });
        this.searchingNodes = null;
    }

    startSearch() {
        if (!this.searchingNodes) {
            this.searchingNodes = [this.startNode];
        }

        this.searchInterval = setInterval(() => {
            this.searchingNodes.sort((a, b) => {
                let aCost = a.walkCost + a.heuristic;
                let bCost = b.walkCost + b.heuristic;
                return aCost > bCost;
            });
            this.searchTick(this.searchingNodes.shift());
        }, 1);
    }

    stopSearch() {
        if (this.endNode.previousNode) {
            console.log('finded');
        } else {
            console.log('not finded');
        }
        this.pathFinderPanel.searchButton.active = false;

        clearInterval(this.searchInterval);

        previousNodeShowPath(this.endNode);

        function previousNodeShowPath(node) {
            if (node?.previousNode && node.previousNode?.type != 3) {
                node.previousNode.type = 7; // Path
                setTimeout(() => {
                    previousNodeShowPath(node.previousNode);
                    node.previousNode = null;
                }, 1);
            }
        }
    }

    searchTick(searchCurrentNode) {
        if (!searchCurrentNode) {
            return this.stopSearch();
        }

        if (searchCurrentNode.isWalkable()) {
            searchCurrentNode.type = 6; // Visited
        }

        if (searchCurrentNode == this.endNode) {
            this.endNode.previousNode = searchCurrentNode;
            return this.stopSearch();
        }

        const neighbors = this.getNeighbors(searchCurrentNode);
        neighbors.forEach(neighbor => {
            if (neighbor == this.endNode) {
                this.endNode.previousNode = searchCurrentNode;
                this.stopSearch();
            }

            if (this.endNode.previousNode) {
                return;
            }

            if (neighbor.isWalkable()) {
                neighbor.type = 5; // Exploring
                this.searchingNodes.push(neighbor);
            }
        });
    }

    getNeighbors(node) {
        let neighbors = [];
        this.getDirections({ diagonal: true }).forEach(position => {
            let neighbor = this.grid.getNodeAt(node.x + position.x * this.margin + (position.x > 0 ? node.width : 0), node.y + position.y * this.margin + (position.y > 0 ? node.height : 0));
            if (neighbor?.isWalkable()) {
                if (neighbor == this.endNode) {
                    this.endNode.previousNode = node;
                    this.stopSearch();
                }

                if (this.endNode.previousNode) {
                    return;
                }

                let newWalkCost = neighbor.getWalkCost({ diagonal: position.d }) + (node.walkCost || 0);
                let newHeuristic = newWalkCost + this.getDistance(neighbor, this.endNode);

                if (!neighbor.walkCost || !neighbor.heuristic) {
                    neighbor.type = 5; // Exploring
                    neighbor.walkCost = newWalkCost;
                    neighbor.heuristic = newHeuristic;
                    neighbor.previousNode = node;
                    neighbors.push(neighbor);
                }
                if (neighbor.walkCost > newWalkCost && neighbor.heuristic > newHeuristic) {
                    // Finded better path
                    neighbor.walkCost = newWalkCost;
                    neighbor.heuristic = newHeuristic;
                    neighbor.previousNode = node;
                    neighbors.push(neighbor);
                }
            }
        });

        return neighbors;
    }

    getDirections({ diagonal }) {
        if (diagonal) {
            // d - diagonal
            return [
                { x: -1, y: -1, d: true }, { x: 0, y: -1 }, { x: 1, y: -1, d: true },
                { x: -1, y: 0 },                            { x: 1, y: 0 },
                { x: -1, y: 1,  d: true }, { x: 0, y: 1  }, { x: 1, y: 1, d: true  }
            ];
        } else {
            return [
                                  { x: 0, y: -1 },
                { x: -1, y: 0  },                  { x: 1, y: 0  },
                                  { x: 0, y: 1  }
            ];
        }
    }

    getDistance(startPosition, endPosition) {
        // Manhattan distance
        const pixelDistance = Math.sqrt((endPosition.x - startPosition.x) ** 2 + (endPosition.y - startPosition.y) ** 2)
        return pixelDistance / this.boxSize + (this.margin * pixelDistance / this.boxSize);
    }
}