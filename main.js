let RADIUS = 200;
let ROTATION = Math.PI/3;
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let imageData = [];
let url = './demo-image.jpg';
let img = new Image();
initCanvas();
window.addEventListener('resize', initCanvas);
window.addEventListener('mousemove', throttle(0,drawImageVotex));
const cw = () => canvas.width;
const ch = () => canvas.height;
const distance = (x1, y1, x2, y2) => Math.sqrt((x1-x2)**2 + (y1-y2)**2);
const rotate = (cx, cy, x, y, θ) => {
    const dx = x-cx, dy = y-cy;
    return [cx + dy*Math.sin(θ) + dx*Math.cos(θ), cy + dy*Math.cos(θ) - dx*Math.sin(θ)];
};
const index = (x, y) => ((Math.round(y)*cw()+Math.round(x))*4 + (cw()*ch()*4))%(cw()*ch()*4);
function initCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    img = new Image();
    img.onload = () => {
        ctx.drawImage(img, 0, 0, cw(), ch());
        imageData = Array.from(ctx.getImageData(0, 0, cw(), ch()).data);
    };
    img.src = url;
}
function throttle(x, fn) {
    this.t = 0;
    return (e) => {
        clearTimeout(this.t);
        this.t = setTimeout(() => fn(e));
    }
}
function drawImageVotex(e){
    const {x, y} = e;
    ctx.drawImage(img, 0, 0, cw(), ch());
    const imageD = ctx.getImageData(x-RADIUS, y-RADIUS, RADIUS*2, RADIUS*2);
    const {data} = imageD;
    for (let i=0;i<(RADIUS*2)**2;i++) {
        const x2 = x-RADIUS+i%(RADIUS*2);
        const y2 = y-RADIUS+((i/RADIUS/2)|0);
        const r = distance(x, y, x2, y2);
        if(r <= RADIUS) {
            const idx = i*4;
            const newIdx = index(...rotate(x, y, x2, y2, ROTATION-ROTATION*(r/RADIUS)));
            data[idx] = imageData[newIdx];
            data[idx+1] = imageData[newIdx+1];
            data[idx+2] = imageData[newIdx+2];
            data[idx+3] = imageData[newIdx+3];
        }
    }
    ctx.putImageData(imageD, x-RADIUS, y-RADIUS);
}
function updateRotation(e) {
    ROTATION = e.target.value / 180 * Math.PI;
}
function updateRadius(e) {
    RADIUS = e.target.value;
}
function updateImage(e) {
    const reader = new FileReader();
    reader.onload = () => {
        url = reader.result;
        initCanvas();
    };
    reader.readAsDataURL(e.target.files[0]);
}
