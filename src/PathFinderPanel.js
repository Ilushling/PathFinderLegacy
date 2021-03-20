class PathFinderPanel {
    constructor(pathFinder) {
        this.pathFinder = pathFinder;
        this.canvas = this.pathFinder.controller.canvas;
        this.ctx = this.pathFinder.controller.ctx;
        this.mouse = this.pathFinder.controller.mouse;
        this.width = 290;
        this.height = 70;
        this.x = this.canvas.width - this.width - 10;
        this.y = 10;

        this.searchButton = { x: this.x + 10, y: this.y + 10, width: 115, height: 50 };
        this.clearButton = { x: this.x + 140, y: this.y + 10, width: 115, height: 50 };
    }

    draw() {
        // Background
        this.ctx.beginPath();
        this.ctx.rect(this.x, this.y, this.width, this.height);
        this.ctx.fillStyle = 'rgb(255, 255, 255)';
        this.ctx.fill();
        
        // Start button background
        this.ctx.beginPath();
        this.ctx.rect(this.searchButton.x, this.searchButton.y, this.searchButton.width, this.searchButton.height);
        var { isHoverByMouse, isHoverBySmoothMouse } = this.pathFinder.controller.isPointInPath();
        if (isHoverByMouse || isHoverBySmoothMouse) {
            if (isHoverByMouse) {
                if (!this.searchButton.hover) {
                    this.searchButton.hover = true;
                }
            } else {
                if (this.searchButton.hover) {
                    this.searchButton.hover = false;
                }
            }

            this.searchButton.mouseDown = this.mouse.down == true;
        } else {
            if (this.searchButton.hover) {
                this.searchButton.hover = false;
            }

            if (this.searchButton.mouseDown) {
                this.searchButton.mouseDown = false;
            }
        }

        if (this.searchButton.hover) {
            if (this.searchButton.mouseDown) {
                if (!this.searchButton.clicked) {
                    if (this.searchButton.active) {
                        this.searchButton.active = false;
                        this.pathFinder.stopSearch();
                    } else {
                        this.searchButton.active = true;
                        this.pathFinder.startSearch();
                    }
                    this.searchButton.clicked = true;
                }

                this.ctx.fillStyle = 'rgb(15, 120, 225)';
            } else {
                this.searchButton.clicked = false;

                this.ctx.fillStyle = 'rgb(40, 160, 235)';
            }
        } else {
            if (this.searchButton.active) {
                this.ctx.fillStyle = 'rgb(30, 150, 255)';
            } else {
                this.ctx.fillStyle = 'rgb(100, 200, 255)';
            }
        }

        this.ctx.fill();
        // Search button Text
        this.ctx.beginPath();
        this.ctx.font = '30px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(this.searchButton.active ? 'Stop' : 'Search', this.searchButton.x + 10, this.searchButton.y + this.searchButton.height - 15);

        
        // Clear button background
        this.ctx.beginPath();
        this.ctx.rect(this.clearButton.x, this.clearButton.y, this.clearButton.width, this.clearButton.height);
        var { isHoverByMouse, isHoverBySmoothMouse } = this.pathFinder.controller.isPointInPath();
        if (isHoverByMouse || isHoverBySmoothMouse) {
            if (isHoverByMouse) {
                if (!this.clearButton.hover) {
                    this.clearButton.hover = true;
                }
            } else {
                if (this.clearButton.hover) {
                    this.clearButton.hover = false;
                }
            }

            this.clearButton.mouseDown = this.mouse.down == true;
        } else {
            if (this.clearButton.hover) {
                this.clearButton.hover = false;
            }

            if (this.clearButton.mouseDown) {
                this.clearButton.mouseDown = false;
            }
        }

        if (this.clearButton.hover) {
            if (this.clearButton.mouseDown) {
                if (!this.clearButton.clicked) {
                    this.pathFinder.clearSearch();
                    this.clearButton.clicked = true;
                }

                this.ctx.fillStyle = 'rgb(15, 120, 225)';
            } else {
                this.clearButton.clicked = false;

                this.ctx.fillStyle = 'rgb(40, 160, 235)';
            }
        } else {
            this.ctx.fillStyle = 'rgb(100, 200, 255)';
        }

        this.ctx.fill();
        // Clear button Text
        this.ctx.beginPath();
        this.ctx.font = '30px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText('Clear', this.clearButton.x + 10, this.clearButton.y + this.clearButton.height - 15);
    }

    mouseUp() {
        //this.draw();
    }

    mouseDown() {
        //this.draw();
    }

    mouseMove() {
        //this.draw();
    }

    onResizeCanvas() {
        //this.draw();
    }
}