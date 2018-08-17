
import {Table} from "../../js/math/table.js"
import {AugmentedTable} from "../../js/math/augmented-table.js"
import {Random} from "../../js/math/random.js"

describe("Tests the functionallity of the math module", function(){
    //console.log(Global.Spec);
    describe("Table", function(){
        it("Tests that two equal tables can be multiplied", function(){
            const width = 5;
            const height = 5;
            const table1 = new Table(width,height).fill(1);
            const table2 = new Table(width,height).fill(1);
    
            const result = table1.multipy(table2);
    
            for(let y = 0; y < height; ++y){
                for(let x = 0; x < width; ++x){
                    expect(result.getCell(x,y) ).toEqual(1);
                }
            }
        });
    
        it("Tests the multiply function of the table", function(){
            const width = 5;
            const height = 5;
            const table1 = new Table(width,height).fill(3);
            const table2 = new Table(width,height).fill(5);
    
            const result = table1.multipy(table2);
    
            for(let y = 0; y < height; ++y){
                for(let x = 0; x < width; ++x){
                    expect(result.getCell(x,y) ).toEqual(15);
                }
            }
        });

        it("Tests multiply does not change the origin tables", function(){
            const width = 5;
            const height = 5;
            const table1 = new Table(width,height).fill(3);
            const table2 = new Table(width,height).fill(5);
    
            const result = table1.multipy(table2);
    
            for(let y = 0; y < height; ++y){
                for(let x = 0; x < width; ++x){
                    expect(table1.getCell(x,y) ).toEqual(3);
                    expect(table2.getCell(x,y) ).toEqual(5);
                }
            }
        });

        it("Tests the add function of the table", function(){
            const width = 5;
            const height = 5;
            const table1 = new Table(width,height).fill(3);
            const table2 = new Table(width,height).fill(5);
    
            const result = table1.add(table2);
    
            for(let y = 0; y < height; ++y){
                for(let x = 0; x < width; ++x){
                    expect(result.getCell(x,y) ).toEqual(8);
                }
            }
        });

        it("Only allow tables with the same width to interact", function(){
            const width = 5;
            const height = 5;
            const table1 = new Table(width+3,height).fill(3);
            const table2 = new Table(width,height).fill(5);
    
            expect( () => {
                table1.multipy(table2);
            }).toThrowError();

        });

        it("Fill the only the 3rd column of the table", function(){
            const width = 5;
            const height = 5;
            const table1 = new Table(width+3,height).fillColumn(2,3);
            for(let y = 0; y < height; ++y){
                for(let x = 0; x < width; ++x){
                    if(x === 2){
                        expect(table1.getCell(x,y) ).toEqual(3);
                    }else{
                        expect(table1.getCell(x,y) ).toEqual(0);
                    }
                }
            }
        });
    });

    describe("table inheritance", function(){
        class A extends Table{
            constructor(){
                super(2,2);

                this.isInheritance = true;
                this.someOtherReference = Object.create({
                    a: "hi"
                });
            }

            createInstance(parent){
                return new A();
            }
        }

        it("no same reference", function(){
            const a = new A();
            a.setCell(0,0, 20);
            const b = new A();
            b.setCell(0,0,5);

            const c = a.add(b);

            expect(c.isInheritance).toBeTruthy(); // check if c got the A variable isInhericance
            expect(a.getCell(0,0)).toEqual(20);
            expect(b.getCell(0,0)).toEqual(5);
            expect(c.getCell(0,0)).toEqual(25);

            c.setCell(0,0,99);

            expect(c.getCell(0,0)).toEqual(99);
            expect(a.getCell(0,0)).toEqual(20); // Look for shared object reference

            expect(a.someOtherReference.a).toEqual("hi");
            expect(c.someOtherReference.a).toEqual("hi");

            a.someOtherReference.a  = "NOT_HI";

            expect(a.someOtherReference.a).toEqual("NOT_HI");
            expect(c.someOtherReference.a).toEqual("hi");
        })
        
    });

    describe("AugmentedTable", function(){

        const columnNames = ["Column1", "Column2", "Column3", "Column4"];
        const rowNames = ["Row1", "Row2", "Row3", "Row4", "Row5", "Row6"];
        /**@type {AugmentedTable} */
        let tableUnderTest;
        beforeEach(function(){
            tableUnderTest = new AugmentedTable(columnNames,rowNames);
        });

        it("Test tables width and height equal to string array", function(){
            expect(tableUnderTest._width).toEqual(columnNames.length);
            expect(tableUnderTest._height).toEqual(rowNames.length);
        });

        it("Tests row access by name", function(){
            tableUnderTest.setCell(1,0,42);
            expect(tableUnderTest.getRow("Row1").name ).toEqual("Row1");
            expect(tableUnderTest.getRow("Row1").accessColumn("Column2") ).toEqual(42);
        });

        it("Test error generation with unknow name", function(){
            expect( () => {
                tableUnderTest.getRow("RowX");
            }).toThrow();
            const row = tableUnderTest.getRow("Row1");
            expect( () => {
                row.accessColumn("ColumnX");
            }).toThrow();
        });

        it("Test write via names", function(){
            tableUnderTest.getRow("Row1").accessColumn("Column1",42);
            expect(tableUnderTest.getCell(0,0) ).toEqual(42);
            expect(tableUnderTest.getRow("Row1").accessColumn("Column1") ).toEqual(42);
        });

        it("Test multiply", function(){
            const other = new AugmentedTable(columnNames, rowNames);
            tableUnderTest.fillRow(0,3);
            other.fillRow(0,5);
            /**@type {AugmentedTable} */
            const res = tableUnderTest.multipy(other);

            expect(res.getRow("Row1").accessColumn("Column1")).toEqual(15);
            expect(res.getRow("Row1").accessColumn("Column2")).toEqual(15);
            expect(res.getRow("Row1").accessColumn("Column3")).toEqual(15);
            expect(res.getRow("Row1").accessColumn("Column4")).toEqual(15);
        });
    });

    describe("Random Number Generator", function(){
        it("initialization", function(){
            const r = new Random(1);

            const res1 = r.nextInt();
            const res2 = r.nextInt();
            const res3 = r.nextInt();
            const res4 = r.nextInt();

            expect(res1).not.toEqual(res2);
            expect(res1).not.toEqual(res3);
            expect(res1).not.toEqual(res4);
        });

        it("equal seeds, equal result ", function(){
            const r1 = new Random(4);
            const r2 = new Random(4);

            expect(r1.nextInt()).toEqual(r2.nextInt());
            expect(r1.nextInt()).toEqual(r2.nextInt());
        });

        it("different seed", function(){
            const r1 = new Random(10);
            const r2 = new Random(4);

            expect(r1.nextInt()).not.toEqual(r2.nextInt());
            expect(r1.nextInt()).not.toEqual(r2.nextInt());
        });

        it("test inbetween", function(){
            const r = new Random(50);

            const res1 = r.inBetween(4,10);
            expect(res1).toBeGreaterThanOrEqual(4);
            expect(res1).toBeLessThanOrEqual(10);

            const res2 = r.inBetween(80, 2000);
            expect(res2).toBeGreaterThanOrEqual(80);
            expect(res2).toBeLessThanOrEqual(2000);

            const res3 = r.inBetween(80, 81);
            expect(res3).toEqual(80);

        });

        it("test next distribution see console.log. This test is allowed to fail. It is here to see if we get an evenly distributed result most of the time", function(){
            const RUNS = 10000;
            const SPLIT = 6;
            const r = new Random(Math.random() * Number.MAX_SAFE_INTEGER);

            let o = RUNS;
            const res = new Array(SPLIT);
            res.fill(0);
            const rem = function(value){
                const put = function(pivot, index){
                    if(value >= pivot/SPLIT && value < (pivot+1)/SPLIT){
                        res[index] = res[index] ? res[index] + 1 : 1;
                    }
                }
                for(let i = 0; i < SPLIT; ++i){
                    put(i,i);
                }
            }
            while(o--){
                rem(r.next());
            }
            const formatted = res.map( (v,i) => ({
                lower: (i * SPLIT),
                upper: (i + 1) * SPLIT,
                value: v
            }))
            .sort( (a,b) => {
                if(a.value === b.value){
                    return 0;
                }

                if(a.value < b.value){
                    return -1;
                }

                return 1;
            })
            .reverse();
            formatted.forEach( e => {
                if(e.lower == 0){
                    e.lower = " 0";
                }
                console.log(`[${e.lower}-${e.upper}] : ${e.value} (${(e.value/RUNS)*100}%)`);
            });
            const max = formatted[0].value;
            const min = formatted[formatted.length-1].value;
            console.log(`Difference(MAX,MIN): ${max-min}(${((min/max)*100).toFixed(2)}%)`);
            //res.forEach( (v,i) => console.log( "[" + (i/SPLIT) + "]: " + v/RUNS) + "%" )
            expect( (min/max) ).toBeGreaterThanOrEqual(0.75);
        });
    });
});