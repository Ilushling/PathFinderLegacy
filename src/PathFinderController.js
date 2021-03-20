class PathFinderController {
    constructor(pathFinder, canvasDom) {
        this.pathFinder = pathFinder;
        this.canvas = canvasDom;
        this.ctx = this.canvas.getContext('2d');
        this.mouse = { previous: {}, distance: {}, direction: {}, brush: {} };

        this.canvas.onmouseup = event => this.mouseUp(event);
        this.canvas.onmousedown = event => this.mouseDown(event);
        this.canvas.onmousemove = event => this.mouseMove(event);
        this.canvas.touchstart = event => this.mouseUp(event);
        this.canvas.touchend = event => this.mouseDown(event);
        this.canvas.touchmove = event => this.mouseMove(event);
        window.addEventListener('resize', () => this.onResizeCanvas());

        this.onResizeCanvas();
    }

    mouseUp(event) {
        const mousePosition = this.getMousePosition(event);
        this.mouse.x = mousePosition.x;
        this.mouse.y = mousePosition.y;
        this.mouse.down = false;
        this.pathFinder.mouseUp();
    }

    mouseDown(event) {
        const mousePosition = this.getMousePosition(event);
        this.mouse.x = mousePosition.x;
        this.mouse.y = mousePosition.y;
        this.mouse.down = true;
        this.pathFinder.mouseDown();
    }

    mouseMove(event) {
        const mousePosition = this.getMousePosition(event);
        this.mouse.previous.x = this.mouse.x;
        this.mouse.previous.y = this.mouse.y;
        this.mouse.x = mousePosition.x;
        this.mouse.y = mousePosition.y;
        this.pathFinder.mouseMove();
    }

    getMousePosition(event) {
        const rect = this.canvas.getBoundingClientRect();
        return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }

    onResizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvasResized = true;
        this.pathFinder.onResizeCanvas();
        this.canvasResized = false;
    }

    isPointInPath() {
        const isHoverByMouse = this.ctx.isPointInPath(this.mouse.x, this.mouse.y);
        if (isHoverByMouse) {
            return { isHoverByMouse };
        }

        this.mouse.distance.x = Math.abs(this.mouse.previous.x - this.mouse.x);
        this.mouse.distance.y = Math.abs(this.mouse.previous.y - this.mouse.y);

        let isHoverBySmoothMouse = false,
            //maxMouseLineCollisionSteps = (this.mouse.distance.x + this.mouse.distance.y) / (node.width / 2),
            maxMouseLineCollisionSteps = (this.mouse.distance.x + this.mouse.distance.y) / 20,
            invLen = (1 / Math.sqrt(this.mouse.direction.x ** 2 + this.mouse.direction.y ** 2)); // Normalize vector

        this.mouse.direction = { x: this.mouse.x - this.mouse.previous.x, y: this.mouse.y - this.mouse.previous.y, normalized: { x: this.mouse.direction.x * invLen, y: this.mouse.direction.y * invLen } };

        // Simulating smooth mouse movement
        for (let i = 1; i <= maxMouseLineCollisionSteps; i++) {
            isHoverBySmoothMouse = this.ctx.isPointInPath(
                this.mouse.previous.x + this.mouse.direction.normalized.x * this.mouse.distance.x / maxMouseLineCollisionSteps * i, 
                this.mouse.previous.y + this.mouse.direction.normalized.y * this.mouse.distance.y / maxMouseLineCollisionSteps * i
            );
            if (isHoverBySmoothMouse && i > 1) {
                // Mouse hover detected by simulating smooth mouse movement
                //console.log(isHoverBySmoothMouse);
                break;
            }
        }

        return { isHoverByMouse, isHoverBySmoothMouse };
    }
}