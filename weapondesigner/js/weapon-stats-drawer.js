/**
 * 
 * @param {number} pivot 
 */
function countZeros(pivot){
    let res = 0;
    while(pivot >= 10){
        pivot /= 10;
        res++;
    }
    
    return res;
}
export class WeaponStatsDrawer{

    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     * @param {number} end 
     * @param {number} start 
     */
    constructor(canvas, end, start = 0){
        this._context = canvas.getContext("2d");
        this._endValue = end;
        this._startValue = start;
        this._canvas = canvas;
        this._fontSize = 25;
        this._markerSteps = 5;
        this._clientArea = {
            start: 40,
            end: 20
        };
        this._showAverage = true;
    }

    get _clientWidth(){
        return this.width - this._clientArea.start - this._clientArea.end;
    }

    get _clientHeight(){
        return this.height - this._clientArea.start - this._clientArea.end;
    }

    get width(){
        return this._context.canvas.width;
    }

    get height(){
        return this._context.canvas.height;
    }

    setFontSize(size){
        this._fontSize = size;
        return this;
    }

    setMarkerSteps(steps){
        this._markerSteps = steps;
        return this;
    }

    setPadding(start, end){
        this._clientArea.start = start;
        this._clientArea.end = end;
        return this;
    }

    setPaddingStart(value){
        return this.setPadding(value, this._clientArea.end);
    }

    setPaddingEnd(value){
        return this.setPadding(this._clientArea.start,value);
    }

    setShowAverage(show){
        this._showAverage = show;
    }

    setFocusedArea(end, start = 0){
        this._startValue = start;
        this._endValue = end;
        return true;
    }

    clear(){
        this._context.clearRect(0,0, this.width, this.height);
    }

    /**
     * 
     * @param {Equipment} weapon
     * @param {number} from 
     * @param {number} to 
     */
    _avgAccuracy(weapon, from, to){
        let sum = 0;
        for(let i = from; i <= to; ++i){
            sum += weapon.accuracyAtDistance(i);
        }
        return sum / (to-from);
    }

    _valuesToPoint(xValue, yValue){
        const y = this.height * (yValue / 100);
        const x = this.width * (xValue/this._endValue);
        return {
            x: x,
            y: this.height - y
        };
    }

    _valuesToClientPoint(xValue, yValue){
        const y = (this._clientHeight) * (yValue / 100);
        const x = this._clientWidth * ( xValue/ this._endValue);
        return {
            x: x + this._clientArea.start,
            y: this.height - y - this._clientArea.start
        };
    }

    _relToAbsolutePoint(x,y){
        return {
            x: x + this._clientArea.start,
            y: this.height - y - this._clientArea.start
        };
    }

    draw(...equipment){
        this.clear();
        const CSS_COLOR_NAMES = ["Blue", "DarkGreen", "CadetBlue", "Crimson", "DarkGoldenRod"];
        let cnt = 0;
        equipment.forEach( (e,i) => {
            this._drawAccuracyCurve(e, CSS_COLOR_NAMES[cnt]);
            this._drawName(i + 1,e);
            cnt = (cnt + 1) % CSS_COLOR_NAMES.length;
        });

        this._drawGrid();
    }

    _drawAccuracyCurve(weapon, color = "black"){
        this._context.strokeStyle = color;
        this._context.lineWidth = 4;
        this._context.beginPath();
        this._context.moveTo(this.offset,this.height);
        for(let i = this._startValue; i <= this._endValue; ++i){
            const acc = weapon.accuracyAtDistance(i);
            const point = this._valuesToClientPoint(i,acc);
            
            this._context.lineTo(point.x, point.y);
        }
        this._context.moveTo(this.width ,0);
        this._context.stroke();
        this._context.closePath();

        if(this._showAverage){
            const avg = this._avgAccuracy(weapon, this._startValue, this._endValue);
            const point = this._valuesToClientPoint(0, Math.floor(avg) );
            this._context.beginPath();
            this._context.moveTo( point.x , point.y);
            this._context.lineTo( point.x + this._clientWidth, point.y);
            this._context.closePath();
            this._context.stroke();
        }
        
    }

    _drawGrid(){
        const ctx = this._context;
        ctx.font = this._fontSize + "px Open-Sans";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        for(let y = this._markerSteps; y <= 100; y += this._markerSteps){
            const p = this._valuesToClientPoint(0,y);
            const margin = ( this._fontSize/4 * (1 + countZeros(y))) + this._fontSize;
            ctx.fillText(`${y}`, p.x - margin, p.y + this._fontSize/4 );
            
            ctx.beginPath();
            ctx.moveTo( p.x - 10, p.y);
            ctx.lineTo( p.x + 10, p.y);
            ctx.closePath();
            ctx.stroke();
        }
        
        for(let x = this._startValue + this._markerSteps; x <= this._endValue; x += this._markerSteps){
            const p = this._valuesToClientPoint(x,0);
            const marginY = this._fontSize;
            const marginX = ( this._fontSize/4 * (1 + countZeros(x)));
            ctx.fillText(`${x}`, p.x - marginX , p.y + marginY);
            
            ctx.beginPath();
            ctx.moveTo( p.x, p.y + 10);
            ctx.lineTo( p.x, p.y - 10);
            ctx.closePath();
            ctx.stroke();
        }
        
        const p = this._valuesToClientPoint(0, 100);
        ctx.rect(p.x, p.y, this._clientWidth, this._clientHeight);
        ctx.stroke();
    }

    /**
     * 
     * @param {number} index 
     * @param {Equipment} equipment 
     */
    _drawName(index, equipment, color){
        const p = this._relToAbsolutePoint(15, this._clientHeight - index * this._fontSize);
        const ctx = this._context;
        const markerLength = 10;

        ctx.strokeStyle = color;
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + markerLength, p.y);
        ctx.closePath();
        ctx.stroke();

        ctx.font = this._fontSize + "px Open-Sans";
        ctx.strokeStyle = "black";
        ctx.fillText(equipment.name, p.x +markerLength + 5, p.y + this._fontSize/4);
    }

    get domElement(){
        return this._canvas;
    }
}