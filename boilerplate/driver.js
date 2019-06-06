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

function main(){
    const canvas = document.querySelector("#glCanvas")
    const gl = canvas.getContext("webgl")
    if(gl === null){ alert("no webgl"); return;}


    let vss = document.querySelector("#vs").text;
    let fss = document.querySelector("#fs").text;

    let vs = createShader(gl, gl.VERTEX_SHADER, vss);
    let fs = createShader(gl, gl.FRAGMENT_SHADER, fss);

    let program = createProgram(gl, vs, fs);
    let posAttrLoc = gl.getAttribLocation(program, "a_position");
    let posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);

    let pos = [
        0, 0,
        1, 0,
        1, 1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.enableVertexAttribArray(posAttrLoc);

    gl.vertexAttribPointer(posAttrLoc, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}
