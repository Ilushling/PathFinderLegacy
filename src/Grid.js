class Grid {
    constructor(pathFinder) {
        this.pathFinder = pathFinder;
        this.canvas = this.pathFinder.controller.canvas;
        this.ctx = this.pathFinder.controller.ctx;
        this.mouse = this.pathFinder.controller.mouse;
        this.transitionSpeed = 150;
    }

    draw() {
        const timeStart = window.performance ? performance.now() : Date.now();

        if (this.pathFinder.nodes) {
            this.pathFinder.nodes.forEach(node => {
                this.ctx.beginPath();

                if (!node.transition) {
                    node.transition = { x: 0, y: 0 };
                }

                this.ctx.rect(node.x - node.transition.x / 2, node.y - node.transition.y / 2, node.width + node.transition.x, node.height + node.transition.y);

                const { isHoverByMouse, isHoverBySmoothMouse } = this.pathFinder.controller.isPointInPath();

                if (isHoverByMouse || isHoverBySmoothMouse) {
                    if (isHoverByMouse) {
                        if (!node.hover) {
                            node.hover = true;
                        }
                    } else {
                        if (node.hover) {
                            node.hover = false;
                        }
                    }

                    node.mouseDown = this.mouse.down == true;
                } else {
                    if (node.hover) {
                        node.hover = false;
                    }

                    if (node.mouseDown) {
                        node.mouseDown = false;
                    }
                }

                switch (node.type) {
                    case 1: // Free
                        if (node.mouseDown == true) {
                            if (!node.clicked) {
                                node.clicked = true;
                                if (!this.mouse.brush.type) {
                                    this.mouse.brush.type = 2;
                                }
                                node.type = this.mouse.brush.type;
                                node.transitionOn = true;
                            }
                        } else {
                            node.clicked = false;
                        }

                        if (node.hover) {
                            this.ctx.fillStyle = 'rgb(150, 150, 150)';
                        } else {
                            this.ctx.fillStyle = 'rgb(255, 255, 255)';
                        }
                        break;
                    case 2: // Wall
                        if (node.mouseDown == true) {
                            if (!node.clicked) {
                                node.clicked = true;
                                if (!this.mouse.brush.type) {
                                    this.mouse.brush.type = 1;
                                }
                                node.type = this.mouse.brush.type;
                                node.transitionOn = true;
                            }
                        } else {
                            node.clicked = false;
                        }
                        
                        if (node.hover) {
                            this.ctx.fillStyle = 'rgb(120, 120, 120)';
                        } else {
                            this.ctx.fillStyle = 'rgb(70, 70, 70)';
                        }
                        break;
                    case 3: // Start
                        this.ctx.fillStyle = 'rgb(0, 255, 0)';
                        break;
                    case 4: // End
                        this.ctx.fillStyle = 'rgb(255, 0, 0)';
                        break;
                    case 5: // Exploring
                        this.ctx.fillStyle = 'rgb(250, 240, 100)';
                        break;
                    case 6: // Visited
                        this.ctx.fillStyle = 'rgb(160, 230, 255)';
                        break;
                    case 7: // Path
                        this.ctx.fillStyle = 'rgb(40, 180, 250)';
                        break;
                }

                if (node.transitionOn) {
                    this.nodeTransition(node);
                }

                this.ctx.fill();

                if (node.walkCost && node.heuristic) {
                    this.ctx.font = '10px Arial';
                    this.ctx.fillStyle = 'red';
                    this.ctx.fillText((node.walkCost + node.heuristic).toFixed(1), node.x + 3, node.y + 16);
                }

                this.ctx.font = '10px Arial';
                this.ctx.fillStyle = 'green';
                this.ctx.fillText((node.walkCost)?.toFixed(1) || '', node.x + 3, node.y + node.height - 3);

                this.ctx.font = '10px Arial';
                this.ctx.fillStyle = 'blue';
                this.ctx.fillText((node.heuristic)?.toFixed(1) || '', node.x + node.width - 25, node.y + node.height - 3);
            });
        }

        const timeEnd = window.performance ? performance.now() : Date.now();
        const timeSpent = (timeEnd - timeStart);
        const handleMS = timeSpent.toFixed(0);
        this.ctx.font = '30px Arial';
        this.ctx.fillStyle = 'red';
        this.ctx.fillText(`${handleMS} ms`, 0, 30);
    }

    nodeTransition(node) {
        if (!node.transitionStage) {
            node.transitionStage = 'bigger';
        }
        
        if (node.transitionStage == 'bigger') {
            if (node.transition.x < 10) {
                node.transition.x += this.transitionSpeed * this.pathFinder.deltaTime;
                if (node.transition.x > 10) {
                    node.transition.x = 10;
                }
            }
            if (node.transition.y < 10) {
                node.transition.y += this.transitionSpeed * this.pathFinder.deltaTime;
                if (node.transition.y > 10) {
                    node.transition.y = 10;
                }
            }

            if (node.transition.x == 10 && node.transition.y == 10) {
                node.transitionStage = 'smaller';
            }
        } else if (node.transitionStage == 'smaller') {
            if (node.transition.x > 0) {
                node.transition.x -= this.transitionSpeed * this.pathFinder.deltaTime;
                if (node.transition.x < 0) {
                    node.transition.x = 0;
                }
            }
            
            if (node.transition.y > 0) {
                node.transition.y -= this.transitionSpeed * this.pathFinder.deltaTime;
                if (node.transition.y < 0) {
                    node.transition.y = 0;
                }
            }

            if (node.transition.x == 0 && node.transition.y == 0) {
                node.transitionStage = 'bigger';
                node.transitionOn = false;
            }
        }
    }

    getNodeAt(x, y) {
        return this.pathFinder.nodes.filter(node => (x >= node.x && x <= node.x + node.width) && (y >= node.y && y <= node.y + node.height))[0];
    }

    onResizeCanvas() {
        this.draw();
    }
}