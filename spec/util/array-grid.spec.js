import {ArrayGrid} from '../../js/util/array-grid.js'

describe("array-grid", () => {

    describe("size-test", () => {

        it("initialize", () => {
            const grid = new ArrayGrid(10,10);

            expect(grid.width).toBe(10);
            expect(grid.height).toBe(10);

        });

        it("index-calc", () => {
            const grid = new ArrayGrid(5,7);

            const idx = grid._indexOf(4,3);
            const pos = grid._toPosition(idx);

            expect(pos.x).toBe(4);
            expect(pos.y).toBe(3);
        });
    })

    describe("iterator-test", () => {

        it("3-1-iteration-test", () => {
            const grid = new ArrayGrid(3,1);
            grid.set(0,0, "test0");
            grid.set(1,0, "test1");
            grid.set(2,0, "test2");

            const data = [...grid];
            
            console.log("grid:", ...grid.iterator());
            console.log(data);
            expect(data).toBeDefined();
            expect(data.length).toBe(3);
            expect(data[0].value).toEqual("test0");
            expect(data[1].value).toEqual("test1");
            expect(data[2].value).toEqual("test2");
        });
    });
    
});