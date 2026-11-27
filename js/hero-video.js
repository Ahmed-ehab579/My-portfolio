/* Hero portrait clip: starts moving as the last word of the title appears, plays once, then holds its last frame.
   Click or tap the hero to replay. The file is Ahmed's video from 1.75s (after the still opening) to its own last frame.
   portrait.mp4 holds the picture on top and its cut-out mask below (works in Safari, Chrome and
   phones); WebGL puts the two together. The clip's first frame (portrait-poster.jpg, same layout) is drawn at once,
   so the old photo never shows first; it also stays if the video can't play. The still photo is only used for
   reduced motion, no WebGL, or when neither file loads. */
(() => {
  const box = document.querySelector(".hero__photo");
  const img = box.querySelector("img"), star = box.querySelector(".hero__symbol");
  const still = () => document.documentElement.classList.remove("hero-clip");   // show the still photo instead
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return still();
  const cv = Object.assign(document.createElement("canvas"), { width: 766, height: 722 });
  cv.setAttribute("aria-hidden", "true");
  cv.style.cssText = "position:absolute;top:0;left:-0.65%;width:107.76%;height:100%;max-width:none;display:block";
  const gl = cv.getContext("webgl", { premultipliedAlpha: true, preserveDrawingBuffer: true });
  if (!gl) return still();
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, "attribute vec2 p;varying vec2 v;void main(){v=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}"));
  gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, "precision mediump float;varying vec2 v;uniform sampler2D t;void main(){float y=clamp(v.y,.001,.999)*.5;float a=smoothstep(.03,.97,texture2D(t,vec2(v.x,.5+y)).r);gl_FragColor=vec4(min(texture2D(t,vec2(v.x,y)).rgb,vec3(a)),a);}"));
  gl.linkProgram(pr); gl.useProgram(pr);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
  const a = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  for (const [n, x] of [[gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE], [gl.TEXTURE_MIN_FILTER, gl.LINEAR]]) gl.texParameteri(gl.TEXTURE_2D, n, x);

  const video = Object.assign(document.createElement("video"), { muted: true, playsInline: true, preload: "auto" });
  video.setAttribute("muted", ""); video.setAttribute("playsinline", "");
  const paint = (source) => { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, source); gl.drawArrays(gl.TRIANGLES, 0, 3); };
  const draw = () => { if (video.readyState >= 2) paint(video); };
  let dead = false, started = false;
  const fail = () => { dead = true; cv.remove(); video.pause(); still(); };
  box.append(cv);
  cv.addEventListener("webglcontextlost", fail);

  const poster = new Image();                       // first frame, on screen before the video arrives
  poster.onload = () => { if (!dead && !started) paint(poster); };
  poster.onerror = () => { if (!started) video.addEventListener("error", fail, { once: true }); };
  poster.src = "assets/videos/home/portrait-poster.jpg?v=4";

  const loop = () => { draw(); if (!video.paused && !video.ended) requestAnimationFrame(loop); };
  video.addEventListener("playing", () => { started = true; loop(); });
  video.addEventListener("seeked", draw);
  video.addEventListener("ended", draw);
  const play = () => { if (!dead) video.play().catch(() => {}); };   // blocked autoplay: the first frame stays
  video.src = "assets/videos/home/portrait.mp4?v=8";  // streamed, so it starts before the whole file is down
  video.load();
  // H2 timing (js/home.js): the title starts at 0.5s, one word every 0.07s. Play as the last word appears.
  const words = document.querySelectorAll('[data-fx="title"] .split-word').length || 7;
  setTimeout(play, (0.5 + (words - 1) * 0.07) * 1000);
  box.closest(".hero__card").addEventListener("click", () => { if (dead) return; if (video.readyState) video.currentTime = 0; play(); });
})();
