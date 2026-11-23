/* ------------------------------------------------------------------
   Tulpar Adası: 3D açık dünya keşif oyunu (Three.js)
   game.js tarafından, WebGL varsa kullanılır; yoksa eski 2D uçuş oyunu
   yedek olarak çalışır. Sınıf, game.js'in CanvasGame tabanını genişletir.
   ------------------------------------------------------------------ */
window.createOpenWorld = function createOpenWorld(kit) {
    "use strict";

    const THREE = window.THREE;
    if (!THREE || !window.siteThree || document.documentElement.classList.contains("no-webgl")) return null;

    const { CanvasGame, $, $$, t, content, pad, clamp, rand, persist, sfx, track, confetti, renderStats, TOOLS, STAGES } = kit;
    const V3 = THREE.Vector3;
    const lerp = (a, b, k) => a + (b - a) * k;
    const ss = (e0, e1, v) => { const k = clamp((v - e0) / (e1 - e0), 0, 1); return k * k * (3 - 2 * k); };
    const wrapAngle = (a) => { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    /* ---------------- Gürültü ---------------- */

    const hash = (x, y) => { const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return h - Math.floor(h); };
    function vnoise(x, y) {
        const xi = Math.floor(x);
        const yi = Math.floor(y);
        const xf = x - xi;
        const yf = y - yi;
        const u = xf * xf * (3 - 2 * xf);
        const v = yf * yf * (3 - 2 * yf);
        return lerp(lerp(hash(xi, yi), hash(xi + 1, yi), u), lerp(hash(xi, yi + 1), hash(xi + 1, yi + 1), u), v);
    }
    function fbm(x, y, octaves = 5) {
        let amp = 0.5;
        let freq = 1;
        let sum = 0;
        let norm = 0;
        for (let i = 0; i < octaves; i += 1) {
            sum += vnoise(x * freq, y * freq) * amp;
            norm += amp;
            amp *= 0.5;
            freq *= 2.03;
        }
        return sum / norm;
    }

    /* ---------------- Dünya ---------------- */

    const WORLD = 2400;
    const ACCENTS = [0x78f0bd, 0x66d9ff, 0x9d8cff, 0xffab73, 0xf7df72, 0xff8fc9];
    const ACCENT_CSS = ["#78f0bd", "#66d9ff", "#9d8cff", "#ffab73", "#f7df72", "#ff8fc9"];
    const LANDMARKS = [
        { x: -330, z: 140, pad: 24 },  // Kayseri
        { x: -60, z: 340, pad: 26 },   // AGÜ
        { x: 270, z: 150, pad: 20 },   // Tulpar UAV
        { x: 430, z: -230, pad: 58 },  // Araştırma
        { x: 60, z: -340, pad: 22 },   // Ürün ve saha (enerji)
        { x: -230, z: -300, pad: 24 }  // Topluluk
    ];
    const ERCIYES = { x: -610, z: -50, r: 240, h: 310 };

    function heightAt(x, z) {
        const d = Math.hypot(x, z);
        const edge = fbm(x * 0.0025 + 11, z * 0.0025 + 7, 3) * 170;
        const mask = ss(990 - edge, 520 - edge, d);
        let h = (fbm(x * 0.0017, z * 0.0017, 5) * 150 + 10) * mask;
        const dm = Math.hypot(x - ERCIYES.x, z - ERCIYES.z);
        const ridge = 0.78 + fbm(x * 0.01, z * 0.01, 3) * 0.45;
        h += ERCIYES.h * ridge * Math.exp(-(dm * dm) / (2 * (ERCIYES.r * 0.42) ** 2));
        h = lerp(-34, h, mask);
        for (const place of LANDMARKS) {
            const w = ss(150, 72, Math.hypot(x - place.x, z - place.z));
            if (w > 0) h = lerp(h, place.pad, w);
        }
        return h;
    }

    /* ---------------- Doku ve yazı ---------------- */

    function canvasTexture(size, draw) {
        const c = document.createElement("canvas");
        c.width = size;
        c.height = size;
        draw(c.getContext("2d"), size);
        const texture = new THREE.CanvasTexture(c);
        return texture;
    }

    const glowTexture = () => canvasTexture(128, (g, s) => {
        const gradient = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
        gradient.addColorStop(0, "rgba(255,255,255,1)");
        gradient.addColorStop(0.25, "rgba(255,255,255,0.55)");
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = gradient;
        g.fillRect(0, 0, s, s);
    });

    const cloudTexture = () => canvasTexture(128, (g, s) => {
        for (let i = 0; i < 9; i += 1) {
            const x = s * (0.25 + Math.random() * 0.5);
            const y = s * (0.4 + Math.random() * 0.2);
            const r = s * (0.14 + Math.random() * 0.16);
            const gradient = g.createRadialGradient(x, y, 0, x, y, r);
            gradient.addColorStop(0, "rgba(255,255,255,0.55)");
            gradient.addColorStop(1, "rgba(255,255,255,0)");
            g.fillStyle = gradient;
            g.fillRect(0, 0, s, s);
        }
    });

    // Gündüz görünen cephe: beyaz yüzey, mavi cam pencereler (gece yanan pencerelerle aynı ızgara).
    const facadeTexture = () => {
        const texture = canvasTexture(128, (g, s) => {
            g.fillStyle = "#ffffff";
            g.fillRect(0, 0, s, s);
            for (let y = 0; y < 8; y += 1) {
                for (let x = 0; x < 8; x += 1) {
                    g.fillStyle = "rgba(52,84,128,0.88)";
                    g.fillRect(x * 16 + 3, y * 16 + 4, 10, 8);
                }
            }
        });
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    };

    const windowTexture = () => {
        const texture = canvasTexture(128, (g, s) => {
            g.fillStyle = "#000";
            g.fillRect(0, 0, s, s);
            for (let y = 0; y < 8; y += 1) {
                for (let x = 0; x < 8; x += 1) {
                    if (Math.random() < 0.55) {
                        g.fillStyle = Math.random() < 0.3 ? "#9fe8ff" : "#ffd98a";
                        g.fillRect(x * 16 + 3, y * 16 + 4, 10, 8);
                    }
                }
            }
        });
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    };

    function labelSprite(text, color) {
        const c = document.createElement("canvas");
        c.width = 256;
        c.height = 72;
        const g = c.getContext("2d");
        g.font = '700 30px "Space Grotesk", system-ui, sans-serif';
        const w = Math.min(244, g.measureText(text).width + 34);
        g.fillStyle = "rgba(6,10,20,0.62)";
        g.beginPath();
        g.roundRect ? g.roundRect((256 - w) / 2, 10, w, 52, 26) : g.rect((256 - w) / 2, 10, w, 52);
        g.fill();
        g.strokeStyle = color;
        g.lineWidth = 3;
        g.stroke();
        g.fillStyle = "#fff";
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillText(text, 128, 37);
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
        sprite.scale.set(15, 4.2, 1);
        return sprite;
    }

    /* ---------------- Gökyüzü renkleri ---------------- */

    const NIGHT_TOP = new THREE.Color(0x040714);
    const NIGHT_HOR = new THREE.Color(0x101a3c);
    const DAY_TOP = new THREE.Color(0x4a9bea);
    const DAY_HOR = new THREE.Color(0xcfe8ff);
    const WARM = new THREE.Color(0xff9b6a);

    class OpenWorld extends CanvasGame {
        constructor(panel) {
            super(panel);
            this.nextGame = "detect";
            this.mood = 0.75;
            this.built = false;
            this.hudEls = {
                score: $('[data-hud="score"]', panel),
                station: $('[data-hud="station"]', panel),
                tools: $('[data-hud="tools"]', panel),
                bar: $('[data-hud="bar"]', panel)
            };
            this.ui = {
                chips: $("[data-world-chips]", panel),
                map: $("[data-world-map]", panel),
                guide: $("[data-world-guide]", panel),
                arrow: $("[data-world-arrow]", panel),
                target: $("[data-world-target]", panel),
                stick: $("[data-world-stick]", panel),
                boost: $("[data-world-boost]", panel)
            };
            this.keys = new Set();
            this.stick = { active: false, id: null, ox: 0, oy: 0, x: 0, y: 0 };
            this.boostHeld = false;
            this.mapTimer = 0;
            this.tod = 0.14;
            this.pos = new V3();
            this.reset();
            this.bindInput();
            this.overlay("start");
        }

        /* ---------- Durum ---------- */

        reset() {
            this.visited = Array(STAGES).fill(false);
            this.collected = new Set();
            this.score = 0;
            // Adanın ortasında, tüm istasyonlara ≥300 birim uzakta başlar.
            this.pos.set(-60, 130, 0);
            this.yaw = Math.PI;
            this.pitch = 0;
            this.roll = 0;
            this.speed = 72;
            this.tod = 0.14;
            this.current = null;
            this.history = [];
            this.orbs?.forEach((orb) => { orb.taken = false; orb.group.visible = true; });
            this.chipEls?.forEach((el) => el.classList.remove("is-visited"));
            this.beacons?.forEach((b, i) => { b.material.color.setHex(ACCENTS[i]); b.material.opacity = 0.24; });
            this.snapCamera = true;
            this.syncHud(true);
        }

        start() {
            this.reset();
            this.state = "play";
            this.overlay(null);
            this.begin();
            this.announce("");
            track("game_start", { game: "world" });
            sfx.pick();
        }

        begin() {
            this.setExpanded(true);
        }

        onGameAction(action) {
            if (action === "continue") this.continueFromStation();
            if (action === "goto") this.gotoSection();
            if (action === "free") {
                this.state = "play";
                this.overlay(null);
            }
        }

        /* ---------- Girdi ---------- */

        bindInput() {
            const el = this.screen;
            const interactive = (event) => event.target.closest("button, a, .overlay");

            el.addEventListener("pointerdown", (event) => {
                if (this.state !== "play" || interactive(event) || this.stick.active) return;
                const rect = el.getBoundingClientRect();
                this.stick = { active: true, id: event.pointerId, ox: event.clientX, oy: event.clientY, x: 0, y: 0 };
                this.ui.stick.hidden = false;
                this.ui.stick.style.left = `${event.clientX - rect.left}px`;
                this.ui.stick.style.top = `${event.clientY - rect.top}px`;
                el.setPointerCapture?.(event.pointerId);
            });
            el.addEventListener("pointermove", (event) => {
                if (!this.stick.active || event.pointerId !== this.stick.id) return;
                const reach = coarse ? 64 : 90;
                this.stick.x = clamp((event.clientX - this.stick.ox) / reach, -1, 1);
                this.stick.y = clamp((this.stick.oy - event.clientY) / reach, -1, 1);
                this.ui.stick.firstElementChild.style.transform = `translate(${this.stick.x * 34}px, ${-this.stick.y * 34}px)`;
            });
            const release = (event) => {
                if (!this.stick.active || event.pointerId !== this.stick.id) return;
                this.stick.active = false;
                this.stick.x = 0;
                this.stick.y = 0;
                this.ui.stick.hidden = true;
            };
            el.addEventListener("pointerup", release);
            el.addEventListener("pointercancel", release);

            const boostOn = (event) => { event.preventDefault(); this.boostHeld = true; this.ui.boost.classList.add("is-held"); };
            const boostOff = () => { this.boostHeld = false; this.ui.boost.classList.remove("is-held"); };
            this.ui.boost.addEventListener("pointerdown", boostOn);
            ["pointerup", "pointercancel", "pointerleave"].forEach((name) => this.ui.boost.addEventListener(name, boostOff));

            const map = { arrowup: "up", w: "up", arrowdown: "down", s: "down", arrowleft: "left", a: "left", arrowright: "right", d: "right", shift: "boost", " ": "boost" };
            document.addEventListener("keydown", (event) => {
                if (!this.visible || (!this.inView && !this.expanded)) return;
                if (event.ctrlKey || event.metaKey || event.altKey) return;
                if (event.target.closest?.("input, textarea, select")) return;
                const key = event.key.toLowerCase();
                const action = map[key];
                if (action) {
                    this.keys.add(action);
                    if (this.state === "play") event.preventDefault();
                }
                if (key === "p" && !event.repeat) { this.state === "play" ? this.pause() : this.resume(); }
                if (key === "escape" && this.expanded) {
                    if (this.state === "play") this.pause(); else this.setExpanded(false);
                }
                if ((key === " " || key === "enter") && this.state === "station" && event.target === document.body) {
                    event.preventDefault();
                    this.continueFromStation();
                }
            });
            document.addEventListener("keyup", (event) => {
                const action = map[event.key.toLowerCase()];
                if (action) this.keys.delete(action);
            });
            window.addEventListener("blur", () => this.keys.clear());
        }

        readInput() {
            const k = this.keys;
            let x = (k.has("right") ? 1 : 0) - (k.has("left") ? 1 : 0);
            let y = (k.has("up") ? 1 : 0) - (k.has("down") ? 1 : 0);
            if (this.stick.active) { x = this.stick.x; y = this.stick.y; }
            return { x, y, boost: k.has("boost") || this.boostHeld };
        }

        /* ---------- Kurulum ---------- */

        sync() {
            if (this.running && !this.built) this.build();
            super.sync();
        }

        build() {
            if (this.built) return;
            this.built = true;
            this.low = coarse || window.innerWidth < 820;
            const q = this.low ? { seg: 150, trees: 1500, rocks: 160, clouds: 22, dpr: 1.25 } : { seg: 210, trees: 3200, rocks: 320, clouds: 36, dpr: 1.6 };
            this.quality = q;

            this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: !this.low, powerPreference: "high-performance" });
            this.maxRatio = Math.min(window.devicePixelRatio || 1, q.dpr);
            this.pixelRatio = this.maxRatio;
            this.renderer.setPixelRatio(this.pixelRatio);
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(62, 1, 1, 7000);
            this.scene.fog = new THREE.Fog(0xcfe8ff, 520, 2900);

            this.hemi = new THREE.HemisphereLight(0xcfe8ff, 0x35553f, 0.85);
            this.sun = new THREE.DirectionalLight(0xfff0d8, 1.05);
            this.scene.add(this.hemi, this.sun);

            this.windowMats = [];
            this.windowTex = windowTexture();
            this.facadeTex = facadeTexture();
            this.buildSky(q);
            this.buildTerrain(q);
            this.buildForest(q);
            this.buildWater();
            this.buildLandmarks();
            this.buildOrbs();
            this.buildPlayer();
            this.buildChips();
            this.buildMinimap();
            this.layout();
            this.applySky();
        }

        buildSky(q) {
            this.skyMat = new THREE.ShaderMaterial({
                uniforms: { top: { value: DAY_TOP.clone() }, hor: { value: DAY_HOR.clone() } },
                vertexShader: "varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
                fragmentShader: "uniform vec3 top; uniform vec3 hor; varying vec3 vDir; void main(){ float h = clamp(vDir.y * 1.7 + 0.1, 0.0, 1.0); gl_FragColor = vec4(mix(hor, top, pow(h, 0.55)), 1.0); }",
                side: THREE.BackSide,
                depthWrite: false,
                fog: false
            });
            this.sky = new THREE.Mesh(new THREE.SphereGeometry(4300, 24, 12), this.skyMat);
            this.sky.frustumCulled = false;
            this.sky.renderOrder = -10;
            this.scene.add(this.sky);

            const glow = glowTexture();
            this.sunSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: 0xfff0c0, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
            this.sunSprite.scale.set(900, 900, 1);
            this.moonSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: 0xbcd0ff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
            this.moonSprite.scale.set(420, 420, 1);
            this.scene.add(this.sunSprite, this.moonSprite);

            const stars = [];
            for (let i = 0; i < 700; i += 1) {
                const v = new V3(rand(-1, 1), rand(0.02, 1), rand(-1, 1)).normalize().multiplyScalar(4100);
                stars.push(v.x, v.y, v.z);
            }
            const starGeo = new THREE.BufferGeometry();
            starGeo.setAttribute("position", new THREE.Float32BufferAttribute(stars, 3));
            this.starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 2.4, sizeAttenuation: false, transparent: true, opacity: 0, depthWrite: false, fog: false });
            this.stars = new THREE.Points(starGeo, this.starMat);
            this.stars.frustumCulled = false;
            this.scene.add(this.stars);

            const cloudTex = cloudTexture();
            this.clouds = [];
            for (let i = 0; i < q.clouds; i += 1) {
                const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloudTex, transparent: true, opacity: rand(0.35, 0.7), depthWrite: false }));
                const size = rand(220, 420);
                sprite.scale.set(size, size * 0.5, 1);
                sprite.position.set(rand(-1500, 1500), rand(250, 430), rand(-1500, 1500));
                this.scene.add(sprite);
                this.clouds.push(sprite);
            }
        }

        buildTerrain(q) {
            const geo = new THREE.PlaneGeometry(WORLD, WORLD, q.seg, q.seg);
            geo.rotateX(-Math.PI / 2);
            const pos = geo.attributes.position;
            const colors = new Float32Array(pos.count * 3);
            const c = new THREE.Color();
            for (let i = 0; i < pos.count; i += 1) {
                const x = pos.getX(i);
                const z = pos.getZ(i);
                const h = heightAt(x, z);
                pos.setY(i, h);
                const slope = Math.abs(heightAt(x + 10, z) - h) + Math.abs(heightAt(x, z + 10) - h);
                const n = fbm(x * 0.02, z * 0.02, 2);
                if (h < -2) c.setRGB(0.08 + h * 0.001, 0.26 + n * 0.1, 0.4);
                else if (h < 3.5) c.setRGB(0.9, 0.84, 0.62);
                else {
                    c.setRGB(lerp(0.28, 0.2, n), lerp(0.6, 0.45, n), lerp(0.34, 0.26, n));
                    if (h > 70) c.lerp(new THREE.Color(0.46, 0.5, 0.3), ss(70, 120, h));
                    if (h > 110 || slope > 15) c.lerp(new THREE.Color(0.5, 0.5, 0.54), Math.max(ss(110, 160, h), ss(13, 26, slope)));
                    if (h > 190) c.lerp(new THREE.Color(0.97, 0.98, 1), ss(190, 235, h + n * 22));
                }
                colors.set([c.r, c.g, c.b], i * 3);
            }
            geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
            geo.computeVertexNormals();
            this.terrain = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true }));
            this.scene.add(this.terrain);
        }

        buildForest(q) {
            const crown = new THREE.ConeGeometry(4.4, 14, 6);
            crown.translate(0, 12, 0);
            const trunk = new THREE.CylinderGeometry(0.7, 0.95, 5, 5);
            trunk.translate(0, 2.5, 0);
            const crownMesh = new THREE.InstancedMesh(crown, new THREE.MeshLambertMaterial({ color: 0xffffff }), q.trees);
            const trunkMesh = new THREE.InstancedMesh(trunk, new THREE.MeshLambertMaterial({ color: 0x6a4b33 }), q.trees);
            const m = new THREE.Matrix4();
            const rot = new THREE.Quaternion();
            const color = new THREE.Color();
            let placed = 0;
            for (let tries = 0; tries < q.trees * 14 && placed < q.trees; tries += 1) {
                const x = rand(-950, 950);
                const z = rand(-950, 950);
                const h = heightAt(x, z);
                if (h < 5 || h > 92) continue;
                if (Math.abs(heightAt(x + 6, z) - h) + Math.abs(heightAt(x, z + 6) - h) > 7) continue;
                if (LANDMARKS.some((p) => Math.hypot(x - p.x, z - p.z) < 118)) continue;
                const s = rand(0.8, 1.7);
                rot.setFromAxisAngle(new V3(0, 1, 0), rand(0, 6.28));
                m.compose(new V3(x, h, z), rot, new V3(s, s * rand(0.9, 1.3), s));
                crownMesh.setMatrixAt(placed, m);
                trunkMesh.setMatrixAt(placed, m);
                color.setHSL(rand(0.27, 0.36), rand(0.4, 0.6), rand(0.2, 0.32));
                crownMesh.setColorAt(placed, color);
                placed += 1;
            }
            crownMesh.count = placed;
            trunkMesh.count = placed;
            this.scene.add(crownMesh, trunkMesh);

            const rocks = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(3, 0), new THREE.MeshPhongMaterial({ color: 0x8a8d94, flatShading: true, shininess: 0 }), q.rocks);
            let r = 0;
            for (let tries = 0; tries < q.rocks * 10 && r < q.rocks; tries += 1) {
                const x = rand(-950, 950);
                const z = rand(-950, 950);
                const h = heightAt(x, z);
                if (h < 1 || LANDMARKS.some((p) => Math.hypot(x - p.x, z - p.z) < 100)) continue;
                const s = rand(0.6, 2.6);
                rot.setFromEuler(new THREE.Euler(rand(0, 3), rand(0, 3), rand(0, 3)));
                m.compose(new V3(x, h + 0.5, z), rot, new V3(s * rand(0.8, 1.5), s * rand(0.6, 1), s * rand(0.8, 1.4)));
                rocks.setMatrixAt(r, m);
                r += 1;
            }
            rocks.count = r;
            this.scene.add(rocks);
        }

        buildWater() {
            const material = new THREE.MeshPhongMaterial({ color: 0x2f86c0, transparent: true, opacity: 0.86, shininess: 90, specular: 0x9fd0ff, flatShading: true });
            this.waterUniforms = { uTime: { value: 0 } };
            material.onBeforeCompile = (shader) => {
                shader.uniforms.uTime = this.waterUniforms.uTime;
                shader.vertexShader = `uniform float uTime;\n${shader.vertexShader}`.replace(
                    "#include <begin_vertex>",
                    "vec3 transformed = vec3(position); transformed.y += sin(position.x * 0.03 + uTime * 1.2) * 1.1 + sin(position.z * 0.045 + uTime * 1.7) * 0.8;"
                );
            };
            const geo = new THREE.PlaneGeometry(7000, 7000, 110, 110);
            geo.rotateX(-Math.PI / 2);
            this.water = new THREE.Mesh(geo, material);
            this.scene.add(this.water);
        }

        /* ---------- Yer işaretleri ---------- */

        buildLandmarks() {
            this.landmarks = [];
            this.beacons = [];
            this.spinners = [];
            const lit = (hex, w = 20, h = 20, d = 20) => {
                const rx = Math.max(1, Math.round(Math.max(w, d) / 11));
                const ry = Math.max(1, Math.round(h / 10));
                const map = this.facadeTex.clone();
                map.repeat.set(rx, ry);
                map.needsUpdate = true;
                const emissiveMap = this.windowTex.clone();
                emissiveMap.repeat.set(rx, ry);
                emissiveMap.needsUpdate = true;
                const mat = new THREE.MeshLambertMaterial({ color: hex, map, emissive: 0xffffff, emissiveMap, emissiveIntensity: 0 });
                this.windowMats.push(mat);
                return mat;
            };
            const solid = (hex) => new THREE.MeshLambertMaterial({ color: hex });
            const block = (w, h, d, material, x, y, z) => {
                const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
                mesh.position.set(x, y + h / 2, z);
                return mesh;
            };

            const builders = [
                // 0 · Kayseri: kasaba ve saat kulesi
                (g) => {
                    for (let i = 0; i < 30; i += 1) {
                        const a = rand(0, 6.28);
                        const d = rand(14, 95);
                        const w = rand(7, 12);
                        const h = rand(6, 12);
                        const house = block(w, h, w, solid(pick([0xf1e4cd, 0xe8d3b0, 0xf6efe4])), Math.cos(a) * d, 0, Math.sin(a) * d);
                        const roof = new THREE.Mesh(new THREE.ConeGeometry(w * 0.82, 5, 4), solid(0xb5533c));
                        roof.rotation.y = Math.PI / 4;
                        roof.position.set(house.position.x, h + 2.5, house.position.z);
                        g.add(house, roof);
                    }
                    const tower = new THREE.Mesh(new THREE.CylinderGeometry(4, 5, 46, 10), solid(0xefe3cf));
                    tower.position.y = 23;
                    const cap = new THREE.Mesh(new THREE.ConeGeometry(6, 14, 10), solid(0xb5533c));
                    cap.position.y = 53;
                    g.add(tower, cap);
                },
                // 1 · AGÜ: kampüs
                (g) => {
                    g.add(block(30, 56, 30, lit(0xdfe6ee, 30, 56, 30), 0, 0, 0));
                    [[-48, -10, 34, 24, 22], [46, 12, 36, 18, 26], [-8, 52, 44, 16, 20], [-12, -52, 40, 20, 18], [62, -38, 26, 30, 22]].forEach(([x, z, w, h, d]) => g.add(block(w, h, d, lit(0xdfe6ee, w, h, d), x, 0, z)));
                    const plaza = new THREE.Mesh(new THREE.CylinderGeometry(26, 26, 0.6, 28), solid(0xcfd6df));
                    plaza.position.set(20, 0.3, 20);
                    g.add(plaza);
                },
                // 2 · Tulpar UAV: hangar ve pist
                (g) => {
                    const shell = new THREE.Mesh(new THREE.CylinderGeometry(20, 20, 54, 18, 1, false, 0, Math.PI), solid(0xc5ced9));
                    shell.rotation.z = Math.PI / 2;
                    shell.position.set(0, 0, -36);
                    g.add(shell);
                    const stripe = canvasTexture(128, (c, s) => {
                        c.fillStyle = "#2b3039";
                        c.fillRect(0, 0, s, s);
                        c.fillStyle = "#f2f4f8";
                        c.fillRect(0, s / 2 - 3, s * 0.6, 6);
                    });
                    stripe.wrapS = THREE.RepeatWrapping;
                    stripe.repeat.set(8, 1);
                    const runway = new THREE.Mesh(new THREE.BoxGeometry(250, 0.5, 20), new THREE.MeshLambertMaterial({ map: stripe }));
                    runway.position.set(0, 0.5, 0);
                    g.add(runway);
                    const kit = window.siteThree.buildUav();
                    kit.group.scale.setScalar(1.7);
                    kit.group.position.set(-70, 3.2, 0);
                    kit.group.rotation.y = Math.PI;
                    g.add(kit.group);
                    this.spinners.push((dt, time) => kit.animate(dt, time));
                    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 16, 6), solid(0xffffff));
                    pole.position.set(60, 8, 22);
                    const sock = new THREE.Mesh(new THREE.ConeGeometry(2, 9, 8), solid(0xff7a3d));
                    sock.rotation.z = -Math.PI / 2;
                    sock.position.set(64, 15, 22);
                    g.add(pole, sock);
                },
                // 3 · Araştırma: radar çanakları, GNSS uyduları
                (g) => {
                    g.add(block(34, 14, 22, lit(0xf0f3f7, 34, 14, 22), -8, 0, 22));
                    const dishes = [];
                    [[-30, -14], [26, -26], [36, 18]].forEach(([x, z], i) => {
                        const mast = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.4, 18, 8), solid(0xdfe4ea));
                        mast.position.set(x, 9, z);
                        const dish = new THREE.Mesh(new THREE.SphereGeometry(11, 20, 10, 0, Math.PI * 2, 0, 1.0), new THREE.MeshLambertMaterial({ color: 0xf5f7fa, side: THREE.DoubleSide }));
                        dish.position.set(x, 20, z);
                        dish.rotation.x = -0.9;
                        g.add(mast, dish);
                        dishes.push({ dish, phase: i * 2 });
                    });
                    const radome = new THREE.Mesh(new THREE.SphereGeometry(13, 20, 14), new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.92 }));
                    radome.position.set(-34, 13, -30);
                    g.add(radome);
                    const sats = [];
                    for (let i = 0; i < 4; i += 1) {
                        const sat = new THREE.Group();
                        sat.add(new THREE.Mesh(new THREE.BoxGeometry(4, 3, 3), solid(0xd8dde6)));
                        [-1, 1].forEach((side) => {
                            const panel = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 7), solid(0x2c4f99));
                            panel.position.x = side * 4;
                            panel.rotation.y = Math.PI / 2;
                            panel.scale.set(1, 1, 1.4);
                            sat.add(panel);
                        });
                        g.add(sat);
                        sats.push({ sat, phase: (i / 4) * Math.PI * 2 });
                    }
                    this.spinners.push((dt, time) => {
                        dishes.forEach(({ dish, phase }) => { dish.rotation.y = time * 0.5 + phase; });
                        sats.forEach(({ sat, phase }) => {
                            const a = time * 0.35 + phase;
                            sat.position.set(Math.cos(a) * 80, 120 + Math.sin(a * 2) * 12, Math.sin(a) * 80);
                            sat.rotation.y = -a;
                        });
                    });
                },
                // 4 · Ürün ve saha: rüzgâr türbinleri, güneş tarlası, veri merkezi
                (g) => {
                    const rotors = [];
                    [[-70, -30], [-40, 50], [10, -70], [40, 60], [75, -20], [-85, 25], [70, 80]].forEach(([x, z], i) => {
                        const tower = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 2, 46, 8), solid(0xf4f6f8));
                        tower.position.set(x, 23, z);
                        const hub = new THREE.Group();
                        hub.position.set(x, 47, z);
                        hub.add(new THREE.Mesh(new THREE.SphereGeometry(2.4, 10, 8), solid(0xe5e9ee)));
                        for (let b = 0; b < 3; b += 1) {
                            const blade = new THREE.Mesh(new THREE.BoxGeometry(1.1, 22, 0.5), solid(0xffffff));
                            const arm = new THREE.Group();
                            blade.position.y = 11;
                            arm.add(blade);
                            arm.rotation.z = (b / 3) * Math.PI * 2;
                            hub.add(arm);
                        }
                        g.add(tower, hub);
                        rotors.push({ hub, speed: 0.9 + (i % 3) * 0.2 });
                    });
                    for (let r = 0; r < 3; r += 1) {
                        for (let c = 0; c < 6; c += 1) {
                            const panel = new THREE.Mesh(new THREE.BoxGeometry(8, 0.5, 5), new THREE.MeshLambertMaterial({ color: 0x1d3f7a }));
                            panel.position.set(-30 + c * 10, 3, 45 + r * 8);
                            panel.rotation.x = -0.45;
                            g.add(panel);
                        }
                    }
                    g.add(block(22, 18, 30, lit(0xe3e8ef, 22, 18, 30), 40, 0, -50), block(18, 12, 26, lit(0xe3e8ef, 18, 12, 26), 66, 0, -48));
                    this.spinners.push((dt) => rotors.forEach(({ hub, speed }) => { hub.rotation.z += dt * speed; }));
                },
                // 5 · Topluluk: okul, amfi, holografik yapay zekâ
                (g) => {
                    g.add(block(46, 16, 24, lit(0xf1e9dd, 46, 16, 24), 0, 0, 30));
                    const roof = new THREE.Mesh(new THREE.BoxGeometry(50, 2, 28), solid(0xb5533c));
                    roof.position.set(0, 17, 30);
                    g.add(roof);
                    for (let i = 0; i < 4; i += 1) {
                        const step = new THREE.Mesh(new THREE.CylinderGeometry(34 - i * 6, 34 - i * 6, 2.2, 28, 1, false, 0, Math.PI), solid(i % 2 ? 0xd9dfe7 : 0xc9d0da));
                        step.position.set(0, 1.1 + i * 2.2, -22);
                        step.rotation.y = Math.PI / 2;
                        g.add(step);
                    }
                    const holo = new THREE.Group();
                    holo.add(new THREE.Mesh(new THREE.IcosahedronGeometry(9, 1), new THREE.MeshBasicMaterial({ color: 0xff8fc9, wireframe: true, transparent: true, opacity: 0.9, fog: false })));
                    holo.add(new THREE.Mesh(new THREE.OctahedronGeometry(4.5, 0), new THREE.MeshBasicMaterial({ color: 0x9d8cff, wireframe: true, fog: false })));
                    holo.position.set(0, 44, -20);
                    g.add(holo);
                    this.spinners.push((dt) => { holo.rotation.y += dt * 0.7; holo.rotation.x += dt * 0.3; });
                }
            ];

            LANDMARKS.forEach((place, i) => {
                const g = new THREE.Group();
                const y = heightAt(place.x, place.z);
                g.position.set(place.x, y, place.z);
                builders[i](g);
                // Uzaktan görünen ışık huzmesi
                const beam = new THREE.Mesh(
                    new THREE.CylinderGeometry(2.6, 2.6, 440, 10, 1, true),
                    new THREE.MeshBasicMaterial({ color: ACCENTS[i], transparent: true, opacity: 0.24, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false })
                );
                beam.position.y = 220;
                g.add(beam);
                const ring = new THREE.Mesh(new THREE.RingGeometry(22, 26, 48), new THREE.MeshBasicMaterial({ color: ACCENTS[i], transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false, fog: false }));
                ring.rotation.x = -Math.PI / 2;
                ring.position.y = 1.2;
                g.add(ring);
                this.scene.add(g);
                this.beacons.push(beam);
                this.landmarks.push({ place, y, group: g, ring });
            });
        }

        buildOrbs() {
            this.orbs = [];
            const glow = glowTexture();
            let seed = 7;
            const next = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
            const spots = [];
            let guard = 0;
            while (spots.length < TOOLS.length && guard < 4000) {
                guard += 1;
                const x = (next() - 0.5) * 1500;
                const z = (next() - 0.5) * 1500;
                if (Math.hypot(x, z) > 780) continue;
                if (spots.some((s) => Math.hypot(s.x - x, s.z - z) < 150)) continue;
                spots.push({ x, z, y: Math.max(heightAt(x, z), 0) + 28 + next() * 50 });
            }
            TOOLS.forEach((name, i) => {
                const spot = spots[i] || { x: i * 60 - 300, z: 0, y: 80 };
                const group = new THREE.Group();
                const color = ACCENTS[i % ACCENTS.length];
                group.add(new THREE.Mesh(new THREE.OctahedronGeometry(3.4, 0), new THREE.MeshBasicMaterial({ color, fog: false })));
                const cage = new THREE.Mesh(new THREE.IcosahedronGeometry(5.6, 0), new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.7 }));
                group.add(cage);
                const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
                halo.scale.set(30, 30, 1);
                group.add(halo);
                const label = labelSprite(name, ACCENT_CSS[i % ACCENTS.length]);
                label.position.y = 11;
                group.add(label);
                group.position.set(spot.x, spot.y, spot.z);
                this.scene.add(group);
                this.orbs.push({ group, cage, label, index: i, taken: false, phase: i * 1.3, x: spot.x, y: spot.y, z: spot.z });
            });
        }

        buildPlayer() {
            this.rig = new THREE.Object3D();
            this.rig.rotation.order = "YXZ";
            this.uav = window.siteThree.buildUav();
            this.uav.group.scale.setScalar(1.5);
            this.uav.group.rotation.y = Math.PI / 2;
            this.rig.add(this.uav.group);
            this.engine = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: 0x66d9ff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
            this.engine.scale.set(7, 7, 1);
            this.engine.position.set(0, 0, 5.4);
            this.rig.add(this.engine);
            this.scene.add(this.rig);

            this.shadow = new THREE.Mesh(new THREE.CircleGeometry(4.6, 20), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }));
            this.shadow.rotation.x = -Math.PI / 2;
            this.scene.add(this.shadow);

            // Kanat ucu izleri
            this.trails = [-1, 1].map((side) => {
                const length = 46;
                const positions = new Float32Array(length * 3);
                const colors = new Float32Array(length * 3);
                const geo = new THREE.BufferGeometry();
                geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
                geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
                const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ vertexColors: true }));
                line.frustumCulled = false;
                this.scene.add(line);
                return { side, length, positions, colors, geo, history: [] };
            });
            this.tip = new V3();
        }

        buildChips() {
            this.chipEls = LANDMARKS.map((_, i) => {
                const el = document.createElement("span");
                el.className = "world-chip";
                el.style.setProperty("--chip", ACCENT_CSS[i]);
                this.ui.chips.append(el);
                return el;
            });
        }

        buildMinimap() {
            const size = this.ui.map.width;
            const base = document.createElement("canvas");
            base.width = size;
            base.height = size;
            const g = base.getContext("2d");
            const image = g.createImageData(size, size);
            for (let py = 0; py < size; py += 1) {
                for (let px = 0; px < size; px += 1) {
                    const x = (px / size - 0.5) * 2200;
                    const z = (py / size - 0.5) * 2200;
                    const h = heightAt(x, z);
                    let rgb;
                    if (h < -8) rgb = [12, 44, 78];
                    else if (h < 0) rgb = [28, 92, 138];
                    else if (h < 3.5) rgb = [214, 200, 150];
                    else if (h < 95) rgb = [lerp(70, 54, h / 95), lerp(150, 110, h / 95), lerp(92, 70, h / 95)];
                    else if (h < 190) rgb = [128, 128, 134];
                    else rgb = [244, 247, 252];
                    const idx = (py * size + px) * 4;
                    image.data[idx] = rgb[0];
                    image.data[idx + 1] = rgb[1];
                    image.data[idx + 2] = rgb[2];
                    image.data[idx + 3] = 255;
                }
            }
            g.putImageData(image, 0, 0);
            this.mapBase = base;
        }

        /* ---------- Boyut ve gökyüzü ---------- */

        layout() {
            const w = this.screen.clientWidth;
            const h = this.screen.clientHeight;
            if (!this.built || !w || !h) return;
            this.canvas.style.width = "100%";
            this.canvas.style.height = "100%";
            this.maxRatio = Math.min(window.devicePixelRatio || 1, this.quality.dpr);
            this.pixelRatio = Math.min(this.pixelRatio || this.maxRatio, this.maxRatio);
            this.renderer.setPixelRatio(this.pixelRatio);
            this.renderer.setSize(w, h, false);
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
            this.W = w;
            this.Hpx = h;
            if (!this.raf) this.draw();
        }

        applySky() {
            const a = this.tod * Math.PI * 2;
            const sunDir = new V3(Math.cos(a), Math.sin(a), 0.32).normalize();
            const day = ss(-0.12, 0.3, sunDir.y);
            const warm = clamp(1 - Math.abs(sunDir.y) / 0.38, 0, 1) * (0.35 + day * 0.65);
            const top = NIGHT_TOP.clone().lerp(DAY_TOP, day);
            const hor = NIGHT_HOR.clone().lerp(DAY_HOR, day).lerp(WARM, warm * 0.65);
            this.skyMat.uniforms.top.value.copy(top);
            this.skyMat.uniforms.hor.value.copy(hor);
            this.scene.fog.color.copy(hor);
            this.hemi.color.copy(top).lerp(new THREE.Color(0xffffff), 0.45);
            this.hemi.intensity = lerp(0.22, 0.9, day);
            this.sun.color.set(0xfff0d8).lerp(WARM, warm * 0.7);
            this.sun.intensity = lerp(0.08, 1.1, day);
            this.sun.position.copy(sunDir).multiplyScalar(900);
            this.sunDir = sunDir;
            this.day = day;
            this.starMat.opacity = clamp(1 - day * 1.4, 0, 1) * 0.95;
            this.windowMats.forEach((m) => { m.emissiveIntensity = (1 - day) * 1.15; });
            this.water.material.color.setHex(0x2f86c0).multiplyScalar(lerp(0.35, 1, day));
        }

        /* ---------- Döngü ---------- */

        tick(dt) {
            if (!this.built) return;
            const auto = this.state === "ready" || this.state === "end";
            const live = this.state === "play" || auto;
            this.waterUniforms.uTime.value = this.time;

            if (live) {
                let input;
                if (auto) {
                    const turn = clamp((150 - this.pos.y) * 0.012, -0.5, 0.5);
                    input = { x: 0.26, y: turn, boost: false };
                } else {
                    input = this.readInput();
                }
                this.fly(dt, input);
                if (!reduce) this.tod = (this.tod + dt / 480) % 1;
            }

            this.uav.animate(dt, this.time);
            this.clouds.forEach((cloud, i) => {
                cloud.position.x += dt * (4 + (i % 4));
                if (cloud.position.x > 1600) cloud.position.x = -1600;
            });
            this.spinners.forEach((fn) => fn(dt, this.time));
            this.orbs.forEach((orb) => {
                if (orb.taken) return;
                orb.cage.rotation.x += dt * 1.1;
                orb.cage.rotation.y += dt * 1.6;
                orb.group.position.y = orb.y + Math.sin(this.time * 1.6 + orb.phase) * 2;
                const d = orb.group.position.distanceTo(this.pos);
                orb.label.material.opacity = clamp(1 - (d - 140) / 160, 0, 1);
            });
            this.landmarks.forEach((lm, i) => {
                lm.ring.rotation.z += dt * 0.4;
                lm.ring.scale.setScalar(1 + Math.sin(this.time * 2 + i) * 0.04);
            });

            if (this.state === "play") this.checkPickups();
            this.updateCamera(dt);
            this.updateTrails(dt);
            this.applySkyThrottled(dt);
            this.adaptQuality(dt);
            this.updateOverlays(dt);
        }

        fly(dt, input) {
            const boost = input.boost;
            this.yaw += -input.x * (0.95 + (boost ? 0.25 : 0)) * dt;
            this.pitch += (input.y * 0.62 - this.pitch) * Math.min(1, dt * 3);
            this.roll += (-input.x * 0.78 - this.roll) * Math.min(1, dt * 4);
            this.speed += ((boost ? 160 : 72) - this.speed) * Math.min(1, dt * 2.2);
            this.boosting = boost;

            const cp = Math.cos(this.pitch);
            this.forward = this.forward || new V3();
            this.forward.set(-Math.sin(this.yaw) * cp, Math.sin(this.pitch), -Math.cos(this.yaw) * cp);
            this.pos.addScaledVector(this.forward, this.speed * dt);

            const ground = Math.max(heightAt(this.pos.x, this.pos.z), 0);
            const minAlt = ground + 7;
            if (this.pos.y < minAlt) {
                this.pos.y = lerp(this.pos.y, minAlt, Math.min(1, dt * 9));
                if (this.pitch < 0) this.pitch = lerp(this.pitch, 0, Math.min(1, dt * 6));
            }
            this.pos.y = Math.min(this.pos.y, 540);

            const r = Math.hypot(this.pos.x, this.pos.z);
            this.edge = r > 1180;
            if (this.edge && this.state === "play") {
                const toCenter = Math.atan2(this.pos.x, this.pos.z);
                this.yaw += clamp(wrapAngle(toCenter - this.yaw), -1, 1) * dt * 1.4;
            }

            this.rig.position.copy(this.pos);
            this.rig.rotation.set(this.pitch, this.yaw, this.roll);
            this.shadow.position.set(this.pos.x, ground + 0.5, this.pos.z);
            const alt = this.pos.y - ground;
            this.shadow.scale.setScalar(1 + alt * 0.004);
            this.shadow.material.opacity = clamp(0.4 - alt * 0.0016, 0, 0.4);
            this.engine.material.opacity = boost ? 1 : 0.55;
            this.engine.scale.setScalar(boost ? 11 + Math.sin(this.time * 60) * 1.2 : 6.5);
        }

        updateCamera(dt) {
            const camDist = 16 + (this.boosting ? 6 : 0);
            const cp = Math.cos(this.pitch * 0.5);
            const dir = new V3(-Math.sin(this.yaw) * cp, Math.sin(this.pitch * 0.5), -Math.cos(this.yaw) * cp);
            const target = this.pos.clone().addScaledVector(dir, -camDist);
            target.y += 5.5;
            target.y = Math.max(target.y, Math.max(heightAt(target.x, target.z), 0) + 3.5);
            const k = this.snapCamera ? 1 : 1 - Math.exp(-dt * 5);
            this.camera.position.lerp(target, k);
            this.snapCamera = false;
            const look = this.pos.clone().addScaledVector(dir, 22);
            this.camera.lookAt(look);
            this.camera.rotateZ(-this.roll * 0.25);
            const fov = 62 + (this.boosting ? 12 : 0);
            this.camera.fov += (fov - this.camera.fov) * Math.min(1, dt * 4);
            this.camera.updateProjectionMatrix();

            this.sky.position.copy(this.camera.position);
            this.sunSprite.position.copy(this.camera.position).addScaledVector(this.sunDir, 3800);
            this.moonSprite.position.copy(this.camera.position).addScaledVector(this.sunDir, -3800);
            this.stars.position.copy(this.camera.position);
        }

        updateTrails() {
            this.rig.updateMatrixWorld(true);
            const fogColor = this.scene.fog.color;
            this.trails.forEach((trail) => {
                this.tip.set(-0.45, 0, trail.side * 2.7);
                this.uav.group.localToWorld(this.tip);
                trail.history.unshift(this.tip.clone());
                if (trail.history.length > trail.length) trail.history.pop();
                const strength = this.boosting ? 1 : 0.35;
                for (let i = 0; i < trail.length; i += 1) {
                    const p = trail.history[Math.min(i, trail.history.length - 1)] || this.tip;
                    trail.positions[i * 3] = p.x;
                    trail.positions[i * 3 + 1] = p.y;
                    trail.positions[i * 3 + 2] = p.z;
                    const f = (1 - i / trail.length) * strength;
                    trail.colors[i * 3] = lerp(fogColor.r, 1, f);
                    trail.colors[i * 3 + 1] = lerp(fogColor.g, 1, f);
                    trail.colors[i * 3 + 2] = lerp(fogColor.b, 1, f);
                }
                trail.geo.attributes.position.needsUpdate = true;
                trail.geo.attributes.color.needsUpdate = true;
            });
        }

        // Kare süresi uzarsa çözünürlüğü düşürür, rahatlayınca yükseltir.
        adaptQuality(dt) {
            this.emaDt = lerp(this.emaDt || 0.016, dt, 0.06);
            this.adaptTimer = (this.adaptTimer || 1.5) - dt;
            if (this.adaptTimer > 0 || this.state !== "play") return;
            this.adaptTimer = 1.5;
            let next = this.pixelRatio;
            if (this.emaDt > 0.034 && next > 0.7) next = Math.max(0.7, next - 0.2);
            else if (this.emaDt < 0.02 && next < this.maxRatio) next = Math.min(this.maxRatio, next + 0.1);
            if (Math.abs(next - this.pixelRatio) < 0.01) return;
            this.pixelRatio = next;
            this.renderer.setPixelRatio(next);
            this.renderer.setSize(this.W, this.Hpx, false);
        }

        applySkyThrottled(dt) {
            this.skyTimer = (this.skyTimer || 0) - dt;
            if (this.skyTimer > 0) return;
            this.skyTimer = 0.25;
            this.applySky();
        }

        /* ---------- Oyun kuralları ---------- */

        checkPickups() {
            this.orbs.forEach((orb) => {
                if (orb.taken) return;
                if (orb.group.position.distanceTo(this.pos) > 15) return;
                orb.taken = true;
                orb.group.visible = false;
                this.collected.add(orb.index);
                this.score += 50;
                this.popup(`${TOOLS[orb.index]} +50`, ACCENT_CSS[orb.index % ACCENT_CSS.length]);
                sfx.pick();
                this.announce(TOOLS[orb.index]);
                this.syncHud();
            });

            this.landmarks.forEach((lm, i) => {
                if (this.visited[i] || this.state !== "play") return;
                const dx = this.pos.x - lm.place.x;
                const dz = this.pos.z - lm.place.z;
                const dy = this.pos.y - (lm.y + 34);
                if (Math.hypot(dx, dy, dz) < 125) this.reachStation(i);
            });
        }

        popup(text, color) {
            const el = document.createElement("div");
            el.className = "world-popup";
            el.textContent = text;
            el.style.color = color;
            this.screen.append(el);
            setTimeout(() => el.remove(), 1300);
        }

        reachStation(index) {
            this.current = index;
            this.visited[index] = true;
            this.state = "station";
            this.score += 300;
            this.stick.active = false;
            this.ui.stick.hidden = true;
            this.keys.clear();
            this.boostHeld = false;
            if (!kit.save.dossier[index]) {
                kit.save.dossier[index] = 1;
                persist();
            }
            const beam = this.beacons[index];
            beam.material.color.setHex(0xffffff);
            beam.material.opacity = 0.1;
            sfx.station();
            track("world_station", { station: index + 1 });
            this.renderStation();
            this.overlay("station");
            this.announce(`${t("g_station")} ${index + 1}/${STAGES}: ${content().stations[index].title}`);
            kit.arcade.render();
            $('[data-overlay="station"] [data-action="continue"]', this.screen)?.focus({ preventScroll: true });
            this.syncHud(true);
        }

        renderStation() {
            const index = this.current ?? 0;
            const data = content().stations[index];
            const box = $('[data-overlay="station"]', this.screen);
            const visitedAll = this.visited.every(Boolean);
            $("[data-station-kicker]", box).textContent = `${t("g_station")} ${pad(index + 1)} / ${pad(STAGES)} · ${data.code}`;
            $("[data-station-title]", box).textContent = data.title;
            $("[data-station-text]", box).textContent = data.text;
            $("[data-continue-label]", box).textContent = visitedAll ? t("g_see_result") : t("g_continue");
        }

        continueFromStation() {
            if (this.state !== "station") return;
            if (this.visited.every(Boolean)) {
                this.finish();
                return;
            }
            this.state = "play";
            this.overlay(null);
            this.syncHud(true);
        }

        gotoSection() {
            const id = content().stations[this.current ?? 0].section;
            this.setExpanded(false);
            document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        }

        finish() {
            const total = Math.floor(this.score);
            const record = total > kit.save.best.flight;
            if (record) kit.save.best.flight = total;
            kit.save.badges.pilot = 1;
            persist();
            this.state = "end";
            this.endItems = [
                ["g_stat_score", total, true],
                ["g_stat_best", kit.save.best.flight, record],
                ["g_world_visited", `${this.visited.filter(Boolean).length}/${STAGES}`, true],
                ["g_stat_tools", `${this.collected.size}/${TOOLS.length}`, this.collected.size === TOOLS.length]
            ];
            this.renderEnd();
            this.overlay("end");
            sfx.win();
            confetti(this.screen);
            track("game_complete", { game: "world", score: total });
            this.announce(t("g_world_finish_title"));
            kit.arcade.render();
            $('[data-overlay="end"] [data-action="free"]', this.screen)?.focus({ preventScroll: true });
            this.syncHud(true);
        }

        renderEnd() {
            renderStats($("[data-end-stats]", this.screen), this.endItems);
        }

        relang() {
            super.relang();
            if (this.state === "station") this.renderStation();
            if (this.state === "end") this.renderEnd();
        }

        /* ---------- Arayüz ---------- */

        syncHud(force) {
            const h = this.hudEls;
            const score = Math.floor(this.score);
            if (force || score !== this._score) { h.score.textContent = score; this._score = score; }
            const visited = this.visited.filter(Boolean).length;
            const station = `${visited}/${STAGES}`;
            if (force || station !== this._station) { h.station.textContent = station; this._station = station; }
            const tools = `${this.collected.size}/${TOOLS.length}`;
            if (force || tools !== this._tools) { h.tools.textContent = tools; this._tools = tools; }
            const bar = Math.round((visited / STAGES) * 1000) / 10;
            if (force || bar !== this._bar) { h.bar.style.width = `${bar}%`; this._bar = bar; }
        }

        updateOverlays(dt) {
            if (!this.built) return;
            const w = this.W || 1;
            const h = this.Hpx || 1;
            const stations = content().stations;
            const v = new V3();
            let nearest = -1;
            let nearestDist = Infinity;

            this.landmarks.forEach((lm, i) => {
                const dist = Math.hypot(this.pos.x - lm.place.x, this.pos.y - lm.y, this.pos.z - lm.place.z);
                if (!this.visited[i] && dist < nearestDist) { nearest = i; nearestDist = dist; }
                const chip = this.chipEls[i];
                v.set(lm.place.x, lm.y + 70, lm.place.z).project(this.camera);
                const visible = v.z < 1 && v.z > 0 && dist < 3000 && this.state !== "ready";
                if (!visible) { chip.style.opacity = "0"; return; }
                chip.style.opacity = this.visited[i] ? "0.6" : "1";
                chip.style.transform = `translate(${((v.x * 0.5 + 0.5) * w).toFixed(1)}px, ${((-v.y * 0.5 + 0.5) * h).toFixed(1)}px) translate(-50%, -100%)`;
                chip.textContent = `${this.visited[i] ? "✓ " : ""}${stations[i].code} · ${Math.round(dist)} m`;
                chip.classList.toggle("is-visited", this.visited[i]);
            });

            const guide = this.ui.guide;
            if (nearest >= 0 && this.state === "play") {
                guide.hidden = false;
                const lm = this.landmarks[nearest];
                const desired = Math.atan2(this.pos.x - lm.place.x, this.pos.z - lm.place.z);
                const rel = wrapAngle(desired - this.yaw);
                this.ui.arrow.style.transform = `rotate(${(-rel * 180) / Math.PI}deg)`;
                this.ui.target.textContent = `${stations[nearest].code} · ${Math.round(nearestDist)} m`;
            } else {
                guide.hidden = true;
            }

            this.mapTimer -= dt;
            if (this.mapTimer <= 0) {
                this.mapTimer = 0.1;
                this.drawMinimap();
            }
        }

        drawMinimap() {
            const canvas = this.ui.map;
            const g = canvas.getContext("2d");
            const size = canvas.width;
            const sx = (x) => (x / 2200 + 0.5) * size;
            g.drawImage(this.mapBase, 0, 0);
            this.orbs.forEach((orb) => {
                if (orb.taken) return;
                g.fillStyle = "#f7df72";
                g.fillRect(sx(orb.x) - 1.5, sx(orb.z) - 1.5, 3, 3);
            });
            this.landmarks.forEach((lm, i) => {
                g.beginPath();
                g.arc(sx(lm.place.x), sx(lm.place.z), 4.2, 0, Math.PI * 2);
                g.fillStyle = this.visited[i] ? "#ffffff" : ACCENT_CSS[i];
                g.fill();
                g.lineWidth = 1.4;
                g.strokeStyle = "rgba(0,0,0,0.65)";
                g.stroke();
            });
            g.save();
            g.translate(sx(this.pos.x), sx(this.pos.z));
            g.rotate(-this.yaw);
            g.fillStyle = "#ffffff";
            g.strokeStyle = "rgba(0,0,0,0.8)";
            g.lineWidth = 1.5;
            g.beginPath();
            g.moveTo(0, -7);
            g.lineTo(5, 6);
            g.lineTo(0, 3);
            g.lineTo(-5, 6);
            g.closePath();
            g.fill();
            g.stroke();
            g.restore();
        }

        draw() {
            if (!this.built) return;
            this.renderer.render(this.scene, this.camera);
        }

        pause() {
            super.pause();
            this.keys.clear();
            this.stick.active = false;
            this.ui.stick.hidden = true;
            this.boostHeld = false;
        }
    }

    function pick(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    return OpenWorld;
};
