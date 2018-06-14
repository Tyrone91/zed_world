import {MissionMap} from "../../js/mission/mission-map.js"
import { Location } from "../../js/mission/location.js";

describe("Map Test", function(){

    it("Map initialization", function(){
        const map = new MissionMap(10,10);

        expect(map.width).toEqual(10);
        expect(map.height).toEqual(10);
        expect(map._map.length).toEqual(100);
    });

    it("Map fill", function(){
        const raw = [
            {
                x: 0,
                y: 0,
                location: new Location("Test01")
            },
            {
                x: 9,
                y: 9,
                location: new Location("Test02")
            }
        ];
        const map = new MissionMap(10,10, raw);

        expect(map.getPosition(0,0).name).toEqual("Test01");
        expect(map.getPosition(9,9).name).toEqual("Test02");
    });

    it("Map single setter", function(){
        const map = new MissionMap(10,10);
        map.setPosition(1,1, new Location("Test01") );

        expect(map.getPosition(1,1).name).toEqual("Test01");
    });

    it("AccessCheck", function(){
        const map = new MissionMap(10,10);
        expect( () => {
            map.getPosition(10,10);
        }).toThrow();

        expect( () => {
            map.getPosition(-1,-1);
        }).toThrow();

        expect( () => {
            map.getPosition(11,11);
        }).toThrow();

        expect( () => {
            map.setPosition(10,10, new Location());
        }).toThrow();

        expect( () => {
            map.setPosition(20,20, new Location());
        }).toThrow();

        expect( () => {
            map.setPosition(-1,-1, new Location());
        }).toThrow();
    });
});