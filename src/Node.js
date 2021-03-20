class Node1 {
    constructor({ x, y, width, height, type }) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
    }

    isWalkable() {
        return this.type == 1 /* Free */ || this.type == 4 /* End */ || this.type == 5 /* Exploring */;
    }
    
    getWalkCost({ diagonal }) {
        let cost = 1;
        return diagonal ? cost * 1.4 : cost;
    }
}