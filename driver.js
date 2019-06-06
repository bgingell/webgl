let posAttrLoc;
let colorUniLoc;
let resUniLoc;
let matLoc;

let tran;
let rot;
let scale;

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

let m4 = {
    projection: function(width, height, depth) {
        return [
            2 / width, 0, 0, 0,
            0, -2 / height, 0, 0,
            0, 0, 2 / depth, 0,
            -1, 1, 0, 1
        ];
    },

    multiply: function(a, b){
        var a00 = a[0 * 4 + 0];
        var a01 = a[0 * 4 + 1];
        var a02 = a[0 * 4 + 2];
        var a03 = a[0 * 4 + 3];
        var a10 = a[1 * 4 + 0];
        var a11 = a[1 * 4 + 1];
        var a12 = a[1 * 4 + 2];
        var a13 = a[1 * 4 + 3];
        var a20 = a[2 * 4 + 0];
        var a21 = a[2 * 4 + 1];
        var a22 = a[2 * 4 + 2];
        var a23 = a[2 * 4 + 3];
        var a30 = a[3 * 4 + 0];
        var a31 = a[3 * 4 + 1];
        var a32 = a[3 * 4 + 2];
        var a33 = a[3 * 4 + 3];
        var b00 = b[0 * 4 + 0];
        var b01 = b[0 * 4 + 1];
        var b02 = b[0 * 4 + 2];
        var b03 = b[0 * 4 + 3];
        var b10 = b[1 * 4 + 0];
        var b11 = b[1 * 4 + 1];
        var b12 = b[1 * 4 + 2];
        var b13 = b[1 * 4 + 3];
        var b20 = b[2 * 4 + 0];
        var b21 = b[2 * 4 + 1];
        var b22 = b[2 * 4 + 2];
        var b23 = b[2 * 4 + 3];
        var b30 = b[3 * 4 + 0];
        var b31 = b[3 * 4 + 1];
        var b32 = b[3 * 4 + 2];
        var b33 = b[3 * 4 + 3];
        return [
          b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
          b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
          b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
          b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
          b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
          b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
          b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
          b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
          b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
          b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
          b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
          b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
          b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
          b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
          b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
          b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
        ];
    },

    translation: function(tx, ty, tz){
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            tx,ty,tz,1,
        ];
    },


  xRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1,
    ];
  },

  yRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1,
    ];
  },

  zRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
       c, s, 0, 0,
      -s, c, 0, 0,
       0, 0, 1, 0,
       0, 0, 0, 1,
    ];
  },

  scaling: function(sx, sy, sz) {
    return [
      sx, 0,  0,  0,
      0, sy,  0,  0,
      0,  0, sz,  0,
      0,  0,  0,  1,
    ];
  },

  translate: function(m, tx, ty, tz) {
    return m4.multiply(m, m4.translation(tx, ty, tz));
  },

  xRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.xRotation(angleInRadians));
  },

  yRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.yRotation(angleInRadians));
  },

  zRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.zRotation(angleInRadians));
  },

  scale: function(m, sx, sy, sz) {
    return m4.multiply(m, m4.scaling(sx, sy, sz));
  },
};

function buildCube(x, y, z, height, width, depth){
    let w2 = width/2;
    let h2 = height/2;
    let d2 = depth/2;

    return [
        // front face
        x-w2, y+h2, z-d2,
        x-w2, y-h2, z-d2,
        x+w2, y+h2, z-d2,
        // two tri
        x-w2, y-h2, z-d2,
        x+w2, y+h2, z-d2,
        x+w2, y-h2, z-d2,
        
        // bottom face
        x-w2, y-h2, z-d2,
        x+w2, y-h2, z-d2,
        x-w2, y-h2, z+d2,
        // sec
        x-w2, y-h2, z+d2,
        x+w2, y-h2, z-d2,
        x+w2, y-h2, z+d2,

        //right face
        x+w2, y+h2, z-d2,
        x+w2, y-h2, z-d2,
        x+w2, y+h2, z+d2,
        //sec
        x+w2, y+h2, z+d2,
        x+w2, y-h2, z-d2,
        x+w2, y-h2, z+d2,

        //left face
        x-w2, y+h2,z-d2,
        x-w2, y-h2,z+d2,
        x-w2, y-h2,z-d2,
        // sec
        x-w2, y+h2,z-d2,
        x-w2, y+h2, z+d2,
        x-w2, y-h2,z+d2,

        // top
        x-w2, y+h2,z+d2,
        x-w2,y+h2,z-d2,
        x+w2,y+h2,z-d2,
        //sec
        x-w2,y+h2,z+d2,
        x+w2,y+h2,z-d2,
        x+w2,y+h2,z+d2,

        //back
        x+w2,y+h2,z+d2,
        x+w2,y-h2,z+d2,
        x-w2,y-h2,z+d2,
        //sec
        x+w2,y+h2,z+d2,
        x-w2,y-h2,z+d2,
        x-w2,y+h2,z+d2
    ];




}

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

function updateMat(gl, t, r, s){
    if(t.length === 0) t = tran;
    if(r.length === 0) r = rot;
    if(s.length === 0) s = scale;
    let dtor = deg => deg * Math.PI/180;

    let matrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 1600);
    matrix = m4.translate(matrix, t[0], t[1], t[2]);
    matrix = m4.xRotate(matrix, r[0]);
    matrix = m4.yRotate(matrix, r[1]);
    matrix = m4.zRotate(matrix, r[2]);
    matrix = m4.scale(matrix, s[0], s[1], s[2]);

    return matrix;
}

function renderTri(gl, pos, color, t=[], r=[], s=[]){
    matrix = updateMat(gl, t, r, s);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);

    gl.uniform2f(resUniLoc, gl.canvas.width, gl.canvas.height);
        
    gl.uniform4f(colUniLoc, color[0], color[1], color[2], color[3]);

    gl.uniformMatrix4fv(matLoc, false, matrix);

    gl.enableVertexAttribArray(posAttrLoc);
 
    gl.vertexAttribPointer(posAttrLoc, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, Math.floor(pos.length/3));
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
    eyeUniLoc = gl.getAttribLocation(program, "u_eye");
    resUniLoc = gl.getUniformLocation(program, "u_resolution");
    colUniLoc = gl.getUniformLocation(program, "u_color");
    matLoc = gl.getUniformLocation(program, "u_matrix");


    let color = [
        [1, 0, 0, 1],
        [0, 1, 0, 1],
        [0, 0, 1, 1],
        [0, 1, 1, 1],
        [1, 0, 1, 1],
        [1, 1, 0, 1]
    ];

    let rint = range => Math.floor(Math.random() * range);
    let dtor = deg => deg * Math.PI/180;

//    for(let i = 0; i < 250; i++){
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    tran = [0,0,0];
    rot = [0,0,0];
    scale = [1,1,1];
    


    let pos = [
          // left column front
            0,   0,  0,
           30,   0,  0,
            0, 150,  0,
            0, 150,  0,
           30,   0,  0,
           30, 150,  0,

          // top rung front
           30,   0,  0,
          100,   0,  0,
           30,  30,  0,
           30,  30,  0,
          100,   0,  0,
          100,  30,  0,

          // middle rung front
           30,  60,  0,
           67,  60,  0,
           30,  90,  0,
           30,  90,  0,
           67,  60,  0,
           67,  90,  0,

          // left column back
            0,   0,  30,
           30,   0,  30,
            0, 150,  30,
            0, 150,  30,
           30,   0,  30,
           30, 150,  30,

          // top rung back
           30,   0,  30,
          100,   0,  30,
           30,  30,  30,
           30,  30,  30,
          100,   0,  30,
          100,  30,  30,

          // middle rung back
           30,  60,  30,
           67,  60,  30,
           30,  90,  30,
           30,  90,  30,
           67,  60,  30,
           67,  90,  30,

          // top
            0,   0,   0,
          100,   0,   0,
          100,   0,  30,
            0,   0,   0,
          100,   0,  30,
            0,   0,  30,

          // top rung right
          100,   0,   0,
          100,  30,   0,
          100,  30,  30,
          100,   0,   0,
          100,  30,  30,
          100,   0,  30,

          // under top rung
          30,   30,   0,
          30,   30,  30,
          100,  30,  30,
          30,   30,   0,
          100,  30,  30,
          100,  30,   0,

          // between top rung and middle
          30,   30,   0,
          30,   30,  30,
          30,   60,  30,
          30,   30,   0,
          30,   60,  30,
          30,   60,   0,

          // top of middle rung
          30,   60,   0,
          30,   60,  30,
          67,   60,  30,
          30,   60,   0,
          67,   60,  30,
          67,   60,   0,

          // right of middle rung
          67,   60,   0,
          67,   60,  30,
          67,   90,  30,
          67,   60,   0,
          67,   90,  30,
          67,   90,   0,

          // bottom of middle rung.
          30,   90,   0,
          30,   90,  30,
          67,   90,  30,
          30,   90,   0,
          67,   90,  30,
          67,   90,   0,

          // right of bottom
          30,   90,   0,
          30,   90,  30,
          30,  150,  30,
          30,   90,   0,
          30,  150,  30,
          30,  150,   0,

          // bottom
          0,   150,   0,
          0,   150,  30,
          30,  150,  30,
          0,   150,   0,
          30,  150,  30,
          30,  150,   0,

          // left side
          0,   0,   0,
          0,   0,  30,
          0, 150,  30,
          0,   0,   0,
          0, 150,  30,
          0, 150,   0
    ];

    let col = color[rint(color.length)];

    gl.useProgram(program);

    let cubes = [];
    let cube_col = [];
    let cube_rots = [];
    let cube_rot_path = []
    for(let i = 0; i < 200; i++){
        cubes.push(buildCube(rint(800), rint(600), rint(200), rint(300), rint(300), rint(300)));
        cube_col.push(color[rint(color.length)]);
        cube_rots.push([rint(360), rint(360), rint(360)])
        cube_rot_path.push([Math.random()/10, Math.random()/10, Math.random()/10]);
    }

    function render(){
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        requestAnimationFrame(render);

        renderTri(gl, pos, col);
        for(let i = 0; i < 200; i++){
            cube_rots[i][0] += cube_rot_path[i][0];
            cube_rots[i][1] += cube_rot_path[i][1];
            cube_rots[i][2] += cube_rot_path[i][2];
            renderTri(gl, cubes[i], cube_col[i], [], cube_rots[i]);
        }
    } render();
}
