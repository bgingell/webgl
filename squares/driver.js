let posAttrLoc;
let colorUniLoc;
let resUniLoc;

function createShader(gl, type, source){
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(success) return shader;

    alert("bad shader");
    gl.deleteShader(shader);
}

function createProgram(gl, vs, fs){
    let program = gl.createProgram();

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(success) return program;

    alert("bad shader link");
    gl.deleteProgram(program);

}

function translateRect(

// pos args: x,y,width,height
function renderRect(gl, pos, color){
    let x = pos[0];
    let x2 = pos[0]+pos[2];
    let y = pos[1];
    let y2 = pos[1]+pos[3];
    renderTri(gl, 
            [x,y, x, y2, x2, y],
            color);
    renderTri(gl,
            [x, y2, x2, y2, x2, y],
            color);

}

function renderTri(gl, pos, color){
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);

    gl.uniform2f(resUniLoc, gl.canvas.width, gl.canvas.height);
        
    gl.uniform4f(colUniLoc, color[0], color[1], color[2], color[3]);

    gl.enableVertexAttribArray(posAttrLoc);
 
    gl.vertexAttribPointer(posAttrLoc, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function main(){
    const canvas = document.querySelector("#glCanvas")
    const gl = canvas.getContext("webgl")
    if(gl === null){ alert("no webgl"); return;}


    let vss = document.querySelector("#vs").text;
    let fss = document.querySelector("#fs").text;

    let vs = createShader(gl, gl.VERTEX_SHADER, vss);
    let fs = createShader(gl, gl.FRAGMENT_SHADER, fss);

    let program = createProgram(gl, vs, fs);
    let posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);

    posAttrLoc = gl.getAttribLocation(program, "a_position");
    resUniLoc = gl.getUniformLocation(program, "u_resolution");
    colUniLoc = gl.getUniformLocation(program, "u_color");


    let color = [
        [1, 0, 0, 1],
        [0, 1, 0, 1],
        [0, 0, 1, 1],
        [0, 1, 1, 1],
        [1, 0, 1, 1],
        [1, 1, 0, 1]
    ];
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let rint = range => Math.floor(Math.random() * range);

    for(let i = 0; i < 250; i++){
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        let pos = [
            rint(gl.canvas.width), rint(gl.canvas.height),
            rint(500), rint(500),
        ];

        let col = color[rint(color.length)];

        gl.useProgram(program);

        renderRect(gl, pos, col);

   }
}
