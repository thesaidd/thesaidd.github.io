/* ------------------------------------------------------------------
   3D sahneler (Three.js r128, vendor/three.min.js)
   - Hero: portre çevresinde dönen tel kafes yapılar ve yörüngedeki İHA
   - 3D Laboratuvar: parçalanabilen İHA, noktalı dünya, sinir ağı
   WebGL yoksa ya da yüklenemezse sayfa 3D'siz çalışmaya devam eder.
   ------------------------------------------------------------------ */
(() => {
    "use strict";

    const root = document.documentElement;
    const $ = (selector, scope = document) => scope.querySelector(selector);
    const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

    function webglAvailable() {
        try {
            const probe = document.createElement("canvas");
            return Boolean(probe.getContext("webgl2") || probe.getContext("webgl"));
        } catch {
            return false;
        }
    }

    if (typeof THREE === "undefined" || !webglAvailable() || typeof translations === "undefined") {
        root.classList.add("no-webgl");
        return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const V3 = THREE.Vector3;
    const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
    const lerp = (a, b, t) => a + (b - a) * t;
    const ease = (t) => t * t * (3 - 2 * t);
    const rand = (a, b) => a + Math.random() * (b - a);

    /* ============================================================
       Metinler
       ============================================================ */

    const UI = {
        tr: {
            lab_label: "Etkileşimli modeller", lab_title: "3D Laboratuvar",
            lab_intro: "Sürükleyerek döndür. İHA'yı parçalarına ayır, dünyada Kayseri'yi bul, sinir ağını eğit.",
            lab_hint: "Sürükle: döndür", lab_hint_touch: "Yatay sürükle: döndür",
            lab_tab_uav: "Tulpar İHA", lab_tab_globe: "Dünya", lab_tab_net: "Sinir ağı",
            lab_tool_wire: "Tel kafes", lab_tool_explode: "Parçala", lab_tool_spin: "Oto-dönüş",
            lab_tool_arcs: "Bağlantılar", lab_tool_train: "Eğit",
            lab_loss: "hata", lab_part_cam: "Kamera",
            lab_fallback: "Bu cihazda 3D (WebGL) kullanılamıyor."
        },
        en: {
            lab_label: "Interactive models", lab_title: "3D Lab",
            lab_intro: "Drag to rotate. Take the UAV apart, find Kayseri on the globe, train the neural network.",
            lab_hint: "Drag to rotate", lab_hint_touch: "Drag sideways to rotate",
            lab_tab_uav: "Tulpar UAV", lab_tab_globe: "Globe", lab_tab_net: "Neural net",
            lab_tool_wire: "Wireframe", lab_tool_explode: "Explode", lab_tool_spin: "Auto-spin",
            lab_tool_arcs: "Links", lab_tool_train: "Train",
            lab_loss: "loss", lab_part_cam: "Camera",
            lab_fallback: "3D (WebGL) isn't available on this device."
        },
        de: {
            lab_label: "Interaktive Modelle", lab_title: "3D-Labor",
            lab_intro: "Zum Drehen ziehen. Zerlege die Drohne, finde Kayseri auf dem Globus, trainiere das neuronale Netz.",
            lab_hint: "Ziehen zum Drehen", lab_hint_touch: "Seitlich ziehen zum Drehen",
            lab_tab_uav: "Tulpar-UAV", lab_tab_globe: "Globus", lab_tab_net: "Neuronales Netz",
            lab_tool_wire: "Drahtgitter", lab_tool_explode: "Zerlegen", lab_tool_spin: "Auto-Drehung",
            lab_tool_arcs: "Verbindungen", lab_tool_train: "Trainieren",
            lab_loss: "Loss", lab_part_cam: "Kamera",
            lab_fallback: "3D (WebGL) ist auf diesem Gerät nicht verfügbar."
        }
    };
    Object.keys(UI).forEach((language) => Object.assign(translations[language], UI[language]));

    const MODELS = {
        tr: {
            uav: {
                kicker: "MODEL 01 · TULPAR UAV", title: "Tulpar İHA",
                desc: "Sabit kanatlı bir İHA'nın sadeleştirilmiş modeli. Parçala düğmesiyle algılama ve haberleşme donanımını tek tek incele.",
                specs: ["Algılama: GNSS + gerçek zamanlı görüntü", "Uçuş: PX4 · ROS 2 · Gazebo simülasyonu", "Haberleşme: LoRa / GSM"]
            },
            globe: {
                kicker: "MODEL 02 · GLOBE", title: "Kayseri'den dünyaya",
                desc: "Noktalarla çizilmiş bir dünya. Bu site Türkçe, İngilizce ve Almanca yayında; yaylar Kayseri'yi bu dillerin konuşulduğu merkezlere bağlıyor.",
                specs: ["TR · Kayseri · 38.72° K, 35.48° D", "EN · Londra", "DE · Berlin"]
            },
            net: {
                kicker: "MODEL 03 · NEURAL NET", title: "Sinir ağı",
                desc: "Girdiden çıktıya akan sinyalleri izle. Eğit düğmesi öğrenmeyi hızlandırır ve hata değerini düşürür.",
                specs: ["Görü: RT-DETR ile nesne tespiti", "Zaman serisi: LSTM · GRU", "Tablo verisi: XGBoost · GPR"]
            }
        },
        en: {
            uav: {
                kicker: "MODEL 01 · TULPAR UAV", title: "Tulpar UAV",
                desc: "A simplified model of a fixed-wing UAV. Use Explode to inspect the sensing and communication hardware part by part.",
                specs: ["Sensing: GNSS + real-time imagery", "Flight: PX4 · ROS 2 · Gazebo simulation", "Link: LoRa / GSM"]
            },
            globe: {
                kicker: "MODEL 02 · GLOBE", title: "From Kayseri to the world",
                desc: "A globe drawn in dots. This site is published in Turkish, English and German; arcs link Kayseri to hubs of those languages.",
                specs: ["TR · Kayseri · 38.72° N, 35.48° E", "EN · London", "DE · Berlin"]
            },
            net: {
                kicker: "MODEL 03 · NEURAL NET", title: "Neural network",
                desc: "Watch signals flow from input to output. Train speeds up learning and drives the loss down.",
                specs: ["Vision: object detection with RT-DETR", "Time series: LSTM · GRU", "Tabular data: XGBoost · GPR"]
            }
        },
        de: {
            uav: {
                kicker: "MODELL 01 · TULPAR UAV", title: "Tulpar-UAV",
                desc: "Ein vereinfachtes Modell eines Starrflügel-UAV. Mit „Zerlegen“ siehst du Sensorik und Kommunikation Teil für Teil.",
                specs: ["Wahrnehmung: GNSS + Echtzeit-Bilddaten", "Flug: PX4 · ROS 2 · Gazebo-Simulation", "Verbindung: LoRa / GSM"]
            },
            globe: {
                kicker: "MODELL 02 · GLOBUS", title: "Von Kayseri in die Welt",
                desc: "Ein Globus aus Punkten. Diese Seite gibt es auf Türkisch, Englisch und Deutsch; Bögen verbinden Kayseri mit Orten dieser Sprachen.",
                specs: ["TR · Kayseri · 38,72° N, 35,48° O", "EN · London", "DE · Berlin"]
            },
            net: {
                kicker: "MODELL 03 · NEURONALES NETZ", title: "Neuronales Netz",
                desc: "Beobachte, wie Signale vom Eingang zum Ausgang fließen. „Trainieren“ beschleunigt das Lernen und senkt den Loss.",
                specs: ["Vision: Objekterkennung mit RT-DETR", "Zeitreihen: LSTM · GRU", "Tabellendaten: XGBoost · GPR"]
            }
        }
    };

    const t = (key) => translations[currentLanguage]?.[key] ?? key;

    /* ============================================================
       Palet (CSS değişkenlerinden, tema ile güncellenir)
       ============================================================ */

    const palette = {};
    const themeListeners = [];

    function readPalette() {
        const styles = getComputedStyle(root);
        ["bg", "bg-soft", "text", "muted", "green", "violet", "orange", "cyan", "yellow", "pink", "red", "blue"].forEach((name) => {
            const value = styles.getPropertyValue(`--${name}`).trim();
            (palette[name] ||= new THREE.Color()).set(value);
        });
        palette.isLight = root.dataset.theme === "light";
        themeListeners.forEach((fn) => fn());
    }

    readPalette();
    new MutationObserver(() => {
        readPalette();
        labStage?.invalidate();
        heroStage?.invalidate();
    }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    let dotTexture = null;
    function dot() {
        if (dotTexture) return dotTexture;
        const size = 64;
        const c = document.createElement("canvas");
        c.width = size;
        c.height = size;
        const g = c.getContext("2d");
        const gradient = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        gradient.addColorStop(0, "rgba(255,255,255,1)");
        gradient.addColorStop(0.45, "rgba(255,255,255,0.95)");
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = gradient;
        g.fillRect(0, 0, size, size);
        dotTexture = new THREE.CanvasTexture(c);
        return dotTexture;
    }

    /* ============================================================
       Ortak sahne (render döngüsü, boyut, görünürlük)
       ============================================================ */

    class Stage {
        constructor(canvas, { fov = 40, dprCap = 1.75 } = {}) {
            this.canvas = canvas;
            this.host = canvas.parentElement;
            this.dprCap = dprCap;
            this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
            this.renderer.setClearColor(0x000000, 0);
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100);
            this.time = 0;
            this.raf = 0;
            this.last = 0;
            this.dirtyUntil = 0;
            this.visible = true;
            this.lost = false;
            this.width = 1;
            this.height = 1;
            this.loop = this.loop.bind(this);

            new ResizeObserver(() => this.resize()).observe(this.host);
            new IntersectionObserver(([entry]) => { this.visible = entry.isIntersecting; this.kick(); }, { threshold: 0.02 }).observe(this.host);
            document.addEventListener("visibilitychange", () => this.kick());
            new MutationObserver(() => this.kick()).observe(document.body, { attributes: true, attributeFilter: ["class"] });
            canvas.addEventListener("webglcontextlost", (event) => { event.preventDefault(); this.lost = true; });
            canvas.addEventListener("webglcontextrestored", () => { this.lost = false; this.kick(); });
            this.resize();
        }

        resize() {
            const w = this.host.clientWidth;
            const h = this.host.clientHeight;
            if (!w || !h) return;
            this.width = w;
            this.height = h;
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.dprCap));
            this.renderer.setSize(w, h, false);
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
            this.onResize?.();
            this.invalidate();
        }

        get active() {
            return this.visible && !document.hidden && !this.lost && !document.body.classList.contains("game-open");
        }

        invalidate(ms = 1800) {
            this.dirtyUntil = performance.now() + ms;
            this.kick();
        }

        kick() {
            if (this.raf || !this.active) return;
            this.last = performance.now();
            this.raf = requestAnimationFrame(this.loop);
        }

        loop(now) {
            this.raf = 0;
            if (!this.active) return;
            const dt = Math.min((now - this.last) / 1000, 0.05);
            this.last = now;
            this.time += dt;
            this.update?.(dt, this.time);
            this.renderer.render(this.scene, this.camera);
            if (!reduce || now < this.dirtyUntil) this.raf = requestAnimationFrame(this.loop);
        }
    }

    /* ============================================================
       Modeller
       ============================================================ */

    function outline(mesh, material) {
        const edges = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, 28), material);
        edges.userData.isEdge = true;
        mesh.add(edges);
        return edges;
    }

    function buildUav() {
        const group = new THREE.Group();
        const mats = {
            body: new THREE.MeshStandardMaterial({ color: 0xe8edf2, metalness: 0.25, roughness: 0.5 }),
            accent: new THREE.MeshStandardMaterial({ color: palette.green, metalness: 0.2, roughness: 0.45, side: THREE.DoubleSide }),
            wing: new THREE.MeshStandardMaterial({ color: 0xdfe6ee, metalness: 0.15, roughness: 0.55, side: THREE.DoubleSide }),
            dark: new THREE.MeshStandardMaterial({ color: 0x161b26, metalness: 0.4, roughness: 0.35 }),
            lens: new THREE.MeshStandardMaterial({ color: palette.cyan, emissive: palette.cyan, emissiveIntensity: 0.9, roughness: 0.2 }),
            line: new THREE.LineBasicMaterial({ color: palette.green, transparent: true, opacity: 0.55 })
        };
        const parts = {};
        const solids = [];

        const register = (name, object, explode, label) => {
            object.userData.home = object.position.clone();
            object.userData.explode = new V3(...explode);
            object.userData.label = label;
            group.add(object);
            parts[name] = object;
            object.traverse((child) => { if (child.isMesh) solids.push(child); });
            return object;
        };
        const mesh = (geometry, material, edge = true) => {
            const m = new THREE.Mesh(geometry, material);
            if (edge) outline(m, mats.line);
            return m;
        };

        // Gövde
        const fuselageGeo = new THREE.CylinderGeometry(0.3, 0.24, 3, 28);
        fuselageGeo.rotateZ(-Math.PI / 2);
        register("fuselage", mesh(fuselageGeo, mats.body), [0, 0, 0]);

        const noseGeo = new THREE.SphereGeometry(0.3, 28, 18);
        noseGeo.scale(1.6, 1, 1);
        const nose = mesh(noseGeo, mats.accent);
        nose.position.x = 1.5;
        register("nose", nose, [1.3, 0, 0]);

        const boomGeo = new THREE.CylinderGeometry(0.09, 0.09, 1.9, 14);
        boomGeo.rotateZ(-Math.PI / 2);
        const boom = mesh(boomGeo, mats.dark, false);
        boom.position.x = -2.4;
        register("boom", boom, [-1, 0, 0]);

        // Kanatlar
        const wingShape = new THREE.Shape();
        wingShape.moveTo(0.6, 0);
        wingShape.lineTo(-0.1, 2.7);
        wingShape.lineTo(-0.75, 2.7);
        wingShape.lineTo(-0.95, 0);
        wingShape.closePath();
        const makeWing = (sign) => {
            const geo = new THREE.ExtrudeGeometry(wingShape, { depth: 0.07, bevelEnabled: false });
            geo.rotateX(-Math.PI / 2);
            const wing = mesh(geo, mats.wing);
            wing.position.set(0.15, -0.04, 0);
            wing.scale.z = sign;
            wing.rotation.x = sign * 0.05;
            const winglet = mesh(new THREE.BoxGeometry(0.5, 0.38, 0.04), mats.accent);
            winglet.position.set(-0.42, 0.2, -2.7);
            wing.add(winglet);
            return wing;
        };
        register("wingR", makeWing(1), [0, 0, -1.5]);
        register("wingL", makeWing(-1), [0, 0, 1.5]);

        // V kuyruk
        const tail = new THREE.Group();
        [-1, 1].forEach((side) => {
            const fin = mesh(new THREE.BoxGeometry(0.6, 0.04, 0.95), mats.accent);
            fin.position.set(0, 0.28, side * 0.38);
            fin.rotation.x = side * -0.62;
            tail.add(fin);
        });
        tail.position.x = -3.2;
        register("tail", tail, [-1.5, 0.5, 0]);

        // İtici pervane
        const prop = new THREE.Group();
        const hubGeo = new THREE.CylinderGeometry(0.07, 0.1, 0.24, 12);
        hubGeo.rotateZ(Math.PI / 2);
        prop.add(mesh(hubGeo, mats.dark, false));
        [0, Math.PI / 2].forEach((angle) => {
            const blade = mesh(new THREE.BoxGeometry(0.03, 1.35, 0.13), mats.dark, false);
            blade.rotation.x = angle;
            prop.add(blade);
        });
        prop.position.x = -3.48;
        register("prop", prop, [-2.4, 0, 0]);

        // Algılama ve haberleşme
        const gimbal = mesh(new THREE.SphereGeometry(0.17, 20, 14), mats.dark, false);
        gimbal.position.set(0.9, -0.34, 0);
        const lensMesh = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 10), mats.lens);
        lensMesh.position.set(0.1, -0.08, 0);
        gimbal.add(lensMesh);
        register("camera", gimbal, [0.4, -1.5, 0], "lab_part_cam");

        const gnss = mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.06, 20), mats.accent);
        gnss.position.set(0.25, 0.32, 0);
        register("gnss", gnss, [0, 1.6, 0], "GNSS");

        const antenna = mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.9, 8), mats.dark, false);
        antenna.position.set(-0.75, 0.6, 0);
        antenna.rotation.z = 0.28;
        const antennaTip = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), mats.accent);
        antennaTip.position.y = 0.46;
        antenna.add(antennaTip);
        register("antenna", antenna, [-0.7, 1.6, 0], "LoRa · GSM");

        const controller = mesh(new THREE.BoxGeometry(0.55, 0.12, 0.36), mats.accent);
        controller.position.set(-0.1, 0, 0);
        register("controller", controller, [0, 0.95, 0], "PX4");

        const themeColors = () => {
            mats.accent.color.copy(palette.green);
            mats.lens.color.copy(palette.cyan);
            mats.lens.emissive.copy(palette.cyan);
            mats.line.color.copy(palette.green);
            mats.body.color.set(palette.isLight ? 0x4a5468 : 0xe8edf2);
            mats.wing.color.set(palette.isLight ? 0x5a657a : 0xdfe6ee);
        };
        themeListeners.push(themeColors);
        themeColors();

        return {
            group,
            parts,
            mats,
            setWire(on) {
                solids.forEach((m) => { m.material.wireframe = on; });
                group.traverse((child) => { if (child.userData.isEdge) child.visible = !on; });
            },
            setExplode(amount) {
                Object.values(parts).forEach((part) => {
                    part.position.copy(part.userData.home).addScaledVector(part.userData.explode, amount);
                });
            },
            animate(dt, time) {
                parts.prop.rotation.x += dt * 34;
                parts.camera.rotation.y = Math.sin(time * 0.8) * 0.5;
            }
        };
    }

    /* ---------- Dünya ---------- */

    const LAND = [
        [[-168, 66], [-156, 71], [-140, 70], [-124, 70], [-108, 72], [-95, 73], [-82, 69], [-79, 62], [-92, 57], [-95, 50], [-84, 47], [-80, 43], [-70, 45], [-64, 48], [-56, 50], [-60, 45], [-70, 41], [-75, 36], [-81, 31], [-80, 26], [-82, 28], [-88, 30], [-94, 29], [-97, 26], [-97, 21], [-94, 18], [-90, 21], [-87, 21], [-88, 16], [-84, 15], [-83, 10], [-79, 9], [-83, 8], [-86, 12], [-92, 15], [-97, 16], [-105, 20], [-110, 24], [-112, 29], [-115, 32], [-118, 34], [-121, 37], [-124, 41], [-124, 47], [-130, 52], [-138, 58], [-148, 60], [-155, 58], [-163, 56], [-166, 60]],
        [[-55, 60], [-43, 60], [-22, 68], [-20, 78], [-30, 83], [-60, 82], [-70, 77], [-58, 70]],
        [[-80, 9], [-72, 12], [-62, 11], [-52, 5], [-50, 0], [-44, -2], [-35, -6], [-37, -13], [-40, -22], [-48, -26], [-53, -34], [-58, -38], [-65, -42], [-66, -55], [-72, -53], [-75, -46], [-73, -37], [-71, -30], [-70, -18], [-76, -14], [-81, -5], [-80, 0], [-77, 4]],
        [[-9, 37], [-9, 43], [-2, 43.5], [-1, 46], [-4, 48], [2, 51], [8, 54], [9, 57], [11, 55], [14, 54], [21, 55], [24, 59], [30, 60], [23, 65], [25, 66], [18, 69], [28, 71], [40, 67], [45, 68], [60, 69], [70, 73], [80, 73], [100, 77], [112, 74], [130, 71], [142, 72], [160, 70], [170, 69], [180, 66], [178, 63], [165, 60], [160, 55], [156, 51], [142, 53], [140, 47], [132, 43], [129, 35], [126, 35], [122, 40], [121, 37], [119, 35], [122, 30], [120, 25], [114, 22], [109, 21], [106, 18], [108, 11], [104, 9], [100, 13], [100, 6], [103, 1], [98, 8], [98, 16], [94, 17], [91, 22], [87, 21], [80, 15], [78, 8], [73, 17], [72, 21], [67, 24], [62, 25], [57, 26], [56, 27], [52, 28], [48, 30], [50, 26], [52, 24], [56, 24], [58, 22], [53, 16], [44, 13], [43, 16], [38, 21], [35, 28], [33, 31], [35, 36], [30, 36], [27, 37], [26, 40], [29, 41], [28, 42], [24, 38], [22, 36], [19, 41], [16, 38], [12, 42], [8, 44], [3, 43], [-2, 37]],
        [[-17, 21], [-13, 28], [-9, 32], [-6, 36], [10, 37], [11, 33], [20, 31], [32, 31], [34, 28], [38, 20], [43, 12], [51, 12], [48, 5], [41, -3], [40, -15], [35, -24], [32, -29], [27, -34], [20, -35], [17, -30], [12, -17], [13, -6], [9, 4], [5, 6], [-4, 5], [-8, 4], [-13, 8], [-17, 14]],
        [[114, -22], [122, -18], [130, -12], [137, -12], [142, -11], [146, -19], [153, -26], [151, -34], [146, -39], [140, -38], [135, -34], [130, -32], [123, -34], [115, -34]],
        [[-5, 50], [1, 51], [2, 53], [-2, 56], [-3, 59], [-6, 58], [-5, 54], [-3, 53]],
        [[-10, 52], [-6, 52], [-6, 55], [-10, 54]],
        [[-24, 64], [-14, 64], [-14, 66], [-22, 66]],
        [[130, 31], [135, 34], [140, 36], [142, 40], [141, 45], [144, 43], [138, 38], [132, 34]],
        [[95, 5], [105, -6], [115, -8], [120, -9], [110, -3], [100, 2]],
        [[109, 1], [117, 7], [119, 1], [116, -4], [110, -3]],
        [[131, -1], [141, -3], [150, -10], [142, -9], [135, -4]],
        [[44, -25], [47, -25], [50, -15], [49, -12], [44, -17]]
    ];

    function inside(lon, lat, polygon) {
        let hit = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
            const [xi, yi] = polygon[i];
            const [xj, yj] = polygon[j];
            if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) hit = !hit;
        }
        return hit;
    }

    function latLon(lat, lon, radius) {
        const phi = ((90 - lat) * Math.PI) / 180;
        const theta = (lon * Math.PI) / 180;
        return new V3(radius * Math.sin(phi) * Math.sin(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.cos(theta));
    }

    function buildGlobe() {
        const R = 2.4;
        const group = new THREE.Group();

        // Karalar: Fibonacci küresi üzerindeki noktalar
        const land = [];
        const ocean = [];
        const count = 11000;
        for (let i = 0; i < count; i += 1) {
            const y = 1 - (i / (count - 1)) * 2;
            const radius = Math.sqrt(1 - y * y);
            const theta = Math.PI * (3 - Math.sqrt(5)) * i;
            const x = Math.cos(theta) * radius;
            const z = Math.sin(theta) * radius;
            const lat = (Math.asin(y) * 180) / Math.PI;
            const lon = (Math.atan2(x, z) * 180) / Math.PI;
            const isLand = LAND.some((polygon) => inside(lon, lat, polygon));
            (isLand ? land : ocean).push(x * R, y * R, z * R);
        }
        const landGeo = new THREE.BufferGeometry();
        landGeo.setAttribute("position", new THREE.Float32BufferAttribute(land, 3));
        const landMat = new THREE.PointsMaterial({ color: palette.green, size: 0.075, map: dot(), alphaTest: 0.2, sizeAttenuation: true, transparent: true, opacity: 0.95, depthWrite: false });
        const landPoints = new THREE.Points(landGeo, landMat);
        landPoints.renderOrder = 2;
        group.add(landPoints);

        const oceanGeo = new THREE.BufferGeometry();
        const oceanPositions = [];
        for (let i = 0; i < ocean.length; i += 3 * 4) oceanPositions.push(ocean[i], ocean[i + 1], ocean[i + 2]);
        oceanGeo.setAttribute("position", new THREE.Float32BufferAttribute(oceanPositions, 3));
        const oceanMat = new THREE.PointsMaterial({ color: palette.violet, size: 0.04, map: dot(), alphaTest: 0.2, transparent: true, opacity: 0.4, depthWrite: false });
        const oceanPoints = new THREE.Points(oceanGeo, oceanMat);
        oceanPoints.renderOrder = 1;
        group.add(oceanPoints);

        // Gövde ve ızgara
        const coreMat = new THREE.MeshBasicMaterial({ color: palette["bg-soft"], transparent: true, opacity: 0.88 });
        const coreMesh = new THREE.Mesh(new THREE.SphereGeometry(R * 0.985, 48, 32), coreMat);
        coreMesh.renderOrder = -1;
        group.add(coreMesh);

        const graticule = [];
        const ringPoints = (fn) => {
            for (let a = 0; a < 64; a += 1) {
                const p0 = fn((a / 64) * Math.PI * 2);
                const p1 = fn(((a + 1) / 64) * Math.PI * 2);
                graticule.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z);
            }
        };
        for (let lat = -60; lat <= 60; lat += 30) {
            ringPoints((a) => latLon(lat, (a * 180) / Math.PI, R * 1.002));
        }
        for (let lon = 0; lon < 180; lon += 30) {
            ringPoints((a) => {
                return latLon((a * 180) / Math.PI, lon, R * 1.002);
            });
        }
        const lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(graticule, 3));
        const lineMat = new THREE.LineBasicMaterial({ color: palette.cyan, transparent: true, opacity: 0.16 });
        const graticuleLines = new THREE.LineSegments(lineGeo, lineMat);
        graticuleLines.renderOrder = 3;
        group.add(graticuleLines);

        // Atmosfer
        const atmoMat = new THREE.ShaderMaterial({
            uniforms: { glow: { value: palette.cyan.clone() } },
            vertexShader: "varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
            fragmentShader: "uniform vec3 glow; varying vec3 vN; void main(){ float i = pow(0.72 - dot(vN, vec3(0.0,0.0,1.0)), 3.0); gl_FragColor = vec4(glow, 1.0) * clamp(i, 0.0, 1.0); }",
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false
        });
        const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(R * 1.16, 48, 32), atmoMat);
        group.add(atmosphere);

        // Yer işaretleri ve yaylar
        const cities = {
            kayseri: { lat: 38.72, lon: 35.48, color: "yellow", label: "KAYSERİ · TR", size: 0.085, side: "right" },
            london: { lat: 51.5, lon: -0.12, color: "pink", label: "LONDON · EN", size: 0.06, side: "left" },
            berlin: { lat: 52.52, lon: 13.4, color: "violet", label: "BERLIN · DE", size: 0.06, side: "right" }
        };
        const markers = [];
        const arcs = new THREE.Group();
        const pulses = [];
        Object.entries(cities).forEach(([key, city]) => {
            const position = latLon(city.lat, city.lon, R * 1.01);
            const dot = new THREE.Mesh(new THREE.SphereGeometry(city.size, 16, 12), new THREE.MeshBasicMaterial({ color: palette[city.color] }));
            dot.position.copy(position);
            group.add(dot);
            const ring = new THREE.Mesh(new THREE.RingGeometry(0.1, 0.125, 40), new THREE.MeshBasicMaterial({ color: palette[city.color], transparent: true, opacity: 0.8, side: THREE.DoubleSide }));
            ring.position.copy(position);
            ring.lookAt(position.clone().multiplyScalar(2));
            group.add(ring);
            markers.push({ key, city, dot, ring, position });
        });
        group.add(arcs);

        const kay = markers.find((m) => m.key === "kayseri");
        ["london", "berlin"].forEach((key) => {
            const target = markers.find((m) => m.key === key);
            const mid = kay.position.clone().add(target.position).multiplyScalar(0.5);
            mid.setLength(R * 1.55);
            const curve = new THREE.QuadraticBezierCurve3(kay.position.clone(), mid, target.position.clone());
            const arcGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(60));
            const arcMat = new THREE.LineBasicMaterial({ color: palette[target.city.color], transparent: true, opacity: 0.75 });
            arcs.add(new THREE.Line(arcGeo, arcMat));
            const pulseMat = new THREE.MeshBasicMaterial({ color: palette.text });
            const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), pulseMat);
            arcs.add(pulse);
            pulses.push({ pulse, curve, offset: Math.random(), speed: rand(0.14, 0.22), arcMat, pulseMat, key });
        });

        const themeColors = () => {
            landMat.color.copy(palette.green);
            oceanMat.color.copy(palette.violet);
            coreMat.color.copy(palette["bg-soft"]);
            lineMat.color.copy(palette.cyan);
            atmoMat.uniforms.glow.value.copy(palette.cyan);
            atmoMat.uniforms.glow.value.multiplyScalar(palette.isLight ? 0.55 : 1);
            markers.forEach((m) => { m.dot.material.color.copy(palette[m.city.color]); m.ring.material.color.copy(palette[m.city.color]); });
            pulses.forEach((p) => { p.pulseMat.color.copy(palette.text); p.arcMat.color.copy(palette[p.key === "london" ? "pink" : "violet"]); });
        };
        themeListeners.push(themeColors);
        themeColors();

        return {
            group,
            markers,
            setArcs(on) { arcs.visible = on; },
            animate(dt, time) {
                markers.forEach((m, i) => {
                    const phase = (time * 0.9 + i * 0.4) % 1;
                    m.ring.scale.setScalar(1 + phase * 2.2);
                    m.ring.material.opacity = 0.8 * (1 - phase);
                });
                pulses.forEach((p) => {
                    const u = (time * p.speed + p.offset) % 1;
                    p.pulse.position.copy(p.curve.getPoint(u));
                });
            }
        };
    }

    /* ---------- Sinir ağı ---------- */

    function buildNet() {
        const group = new THREE.Group();
        const layers = [4, 6, 6, 3];
        const gapX = 2.7;
        const nodes = [];
        const layerNodes = layers.map((size, layerIndex) => {
            const column = [];
            for (let i = 0; i < size; i += 1) {
                let y;
                let z;
                if (layerIndex === 0) {
                    y = (i - (size - 1) / 2) * 1.0;
                    z = 0;
                } else {
                    const radius = size === 3 ? 0.95 : 1.3;
                    const angle = (i / size) * Math.PI * 2 + (layerIndex === 2 ? Math.PI / size : 0) + Math.PI / 2;
                    y = Math.sin(angle) * radius;
                    z = Math.cos(angle) * radius;
                }
                const position = new V3((layerIndex - (layers.length - 1) / 2) * gapX, y, z);
                const material = new THREE.MeshStandardMaterial({ color: palette.cyan, emissive: palette.cyan, emissiveIntensity: 0.22, roughness: 0.55, metalness: 0 });
                const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.14, 20, 14), material);
                mesh.position.copy(position);
                group.add(mesh);
                const node = { mesh, material, position, activation: 0, layer: layerIndex };
                nodes.push(node);
                column.push(node);
            }
            return column;
        });

        const edges = [];
        const positions = [];
        for (let l = 0; l < layerNodes.length - 1; l += 1) {
            layerNodes[l].forEach((a) => layerNodes[l + 1].forEach((b) => {
                edges.push({ a, b });
                positions.push(a.position.x, a.position.y, a.position.z, b.position.x, b.position.y, b.position.z);
            }));
        }
        const lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        const lineMat = new THREE.LineBasicMaterial({ color: palette.violet, transparent: true, opacity: 0.3 });
        group.add(new THREE.LineSegments(lineGeo, lineMat));

        // Sinyaller
        const pulseCount = 90;
        const pulses = Array.from({ length: pulseCount }, () => ({ edge: edges[Math.floor(Math.random() * edges.length)], t: Math.random() }));
        const pulsePositions = new Float32Array(pulseCount * 3);
        const pulseGeo = new THREE.BufferGeometry();
        pulseGeo.setAttribute("position", new THREE.BufferAttribute(pulsePositions, 3));
        const pulseMat = new THREE.PointsMaterial({ color: palette.green, size: 0.3, map: dot(), alphaTest: 0.05, transparent: true, opacity: 0.95, depthWrite: false });
        const pulseCloud = new THREE.Points(pulseGeo, pulseMat);
        group.add(pulseCloud);

        const state = { training: false, loss: 0.92 };
        const outgoing = (node) => edges.filter((e) => e.a === node);

        const themeColors = () => {
            nodes.forEach((n) => { n.material.color.copy(palette.cyan); n.material.emissive.copy(palette.cyan); });
            lineMat.color.copy(palette.violet);
            pulseMat.color.copy(palette.green);
        };
        themeListeners.push(themeColors);
        themeColors();

        return {
            group,
            state,
            setTraining(on) { state.training = on; },
            animate(dt) {
                const speed = state.training ? 1.9 : 0.8;
                pulses.forEach((p, i) => {
                    p.t += dt * speed * (0.7 + (i % 5) * 0.12);
                    if (p.t >= 1) {
                        p.edge.b.activation = 1;
                        const next = outgoing(p.edge.b);
                        p.edge = next.length ? next[Math.floor(Math.random() * next.length)] : edges[Math.floor(Math.random() * edges.length)];
                        p.t = 0;
                    }
                    const { a, b } = p.edge;
                    pulsePositions[i * 3] = lerp(a.position.x, b.position.x, p.t);
                    pulsePositions[i * 3 + 1] = lerp(a.position.y, b.position.y, p.t);
                    pulsePositions[i * 3 + 2] = lerp(a.position.z, b.position.z, p.t);
                });
                pulseGeo.attributes.position.needsUpdate = true;
                nodes.forEach((n) => {
                    n.activation = Math.max(0, n.activation - dt * 2.2);
                    n.material.emissiveIntensity = 0.22 + n.activation * 1.1;
                    n.mesh.scale.setScalar(1 + n.activation * 0.5);
                });
                state.loss = state.training ? Math.max(0.018, state.loss - dt * 0.2 * state.loss) : Math.min(0.92, state.loss + dt * 0.05);
            }
        };
    }

    /* ============================================================
       Hero sahnesi
       ============================================================ */

    let heroStage = null;

    function initHero() {
        const canvas = $(".hero-3d");
        if (!canvas) return;
        const stage = new Stage(canvas, { fov: 38, dprCap: 1.5 });
        heroStage = stage;
        stage.camera.position.set(0, 0, 16);
        stage.scene.add(new THREE.HemisphereLight(0xffffff, 0x1b2438, 1.0));
        const key = new THREE.DirectionalLight(0xffffff, 0.9);
        key.position.set(4, 6, 8);
        stage.scene.add(key);

        const group = new THREE.Group();
        stage.scene.add(group);

        const make = (geometry, color, opacity) => new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity }));
        const core = make(new THREE.IcosahedronGeometry(1.6, 1), palette.green, 0.3);
        const inner = make(new THREE.OctahedronGeometry(0.85, 0), palette.violet, 0.55);
        const ringA = new THREE.Mesh(new THREE.TorusGeometry(3.4, 0.012, 8, 220), new THREE.MeshBasicMaterial({ color: palette.cyan, transparent: true, opacity: 0.55 }));
        ringA.rotation.set(1.25, 0.2, 0);
        const ringB = new THREE.Mesh(new THREE.TorusGeometry(2.7, 0.01, 8, 200), new THREE.MeshBasicMaterial({ color: palette.violet, transparent: true, opacity: 0.45 }));
        ringB.rotation.set(0.5, 0.2, 0.9);
        const shell = make(new THREE.IcosahedronGeometry(4.3, 2), palette.cyan, 0.08);
        group.add(core, inner, ringA, ringB, shell);

        // Yıldız bulutu
        const starPositions = [];
        for (let i = 0; i < 360; i += 1) {
            const v = new V3(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize().multiplyScalar(rand(4.6, 9));
            starPositions.push(v.x, v.y, v.z);
        }
        const starGeo = new THREE.BufferGeometry();
        starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));
        const starMat = new THREE.PointsMaterial({ color: palette.text, size: 0.09, map: dot(), alphaTest: 0.1, transparent: true, opacity: 0.55, depthWrite: false });
        const stars = new THREE.Points(starGeo, starMat);
        group.add(stars);

        // Yörüngedeki İHA
        const kit = buildUav();
        const uav = kit.group;
        uav.scale.setScalar(0.3);
        group.add(uav);

        const trailLength = 70;
        const trailPositions = new Float32Array(trailLength * 3);
        const trailColors = new Float32Array(trailLength * 3);
        const trailGeo = new THREE.BufferGeometry();
        trailGeo.setAttribute("position", new THREE.BufferAttribute(trailPositions, 3));
        trailGeo.setAttribute("color", new THREE.BufferAttribute(trailColors, 3));
        const trail = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({ vertexColors: true }));
        trail.frustumCulled = false;
        group.add(trail);
        const trailPoints = Array.from({ length: trailLength }, () => new V3());

        const paintTrail = () => {
            for (let i = 0; i < trailLength; i += 1) {
                const f = 1 - i / (trailLength - 1);
                const c = new THREE.Color().copy(palette.bg).lerp(palette.green, f * f);
                trailColors.set([c.r, c.g, c.b], i * 3);
            }
            trailGeo.attributes.color.needsUpdate = true;
            core.material.color.copy(palette.green);
            inner.material.color.copy(palette.violet);
            ringA.material.color.copy(palette.cyan);
            ringB.material.color.copy(palette.violet);
            shell.material.color.copy(palette.cyan);
            starMat.color.copy(palette.text);
        };
        themeListeners.push(paintTrail);
        paintTrail();

        const pointer = { x: 0, y: 0 };
        window.addEventListener("pointermove", (event) => {
            pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
        }, { passive: true });

        const anchor = $(".portrait-stage");
        const orbit = { radius: 3.4, tilt: 0.38 };
        const pos = new V3();
        const next = new V3();
        const up = new V3(0, 1, 0);
        const quat = new THREE.Quaternion();
        const fwd = new V3(1, 0, 0);

        const orbitAt = (angle, out) => out.set(Math.cos(angle) * orbit.radius * 1.05, Math.sin(angle * 2) * 0.55 + Math.sin(angle) * orbit.radius * orbit.tilt, Math.sin(angle) * orbit.radius * 0.9);

        // Portrenin ekrandaki konumuna ve genişliğine göre yerleştir
        stage.onResize = () => {
            if (!anchor) return;
            const hostRect = stage.host.getBoundingClientRect();
            const rect = anchor.getBoundingClientRect();
            const cx = rect.left + rect.width / 2 - hostRect.left;
            const cy = rect.top + rect.height / 2 - hostRect.top;
            const ndc = new V3((cx / stage.width) * 2 - 1, -(cy / stage.height) * 2 + 1, 0.5).unproject(stage.camera);
            const dir = ndc.sub(stage.camera.position).normalize();
            const dist = -stage.camera.position.z / dir.z;
            group.position.copy(stage.camera.position).addScaledVector(dir, dist);
            const unitsPerPx = (2 * Math.tan((stage.camera.fov * Math.PI) / 360) * stage.camera.position.z) / stage.height;
            const width = Math.max(rect.width, 260);
            group.scale.setScalar((width * 0.68 * unitsPerPx) / orbit.radius / 1.05);
        };
        stage.onResize();
        window.addEventListener("load", () => stage.onResize());
        $(".hero")?.classList.add("has-3d");

        stage.update = (dt, time) => {
            const speed = reduce ? 0 : 1;
            core.rotation.x += dt * 0.25 * speed;
            core.rotation.y += dt * 0.35 * speed;
            inner.rotation.x -= dt * 0.5 * speed;
            inner.rotation.z += dt * 0.4 * speed;
            ringA.rotation.z += dt * 0.12 * speed;
            ringB.rotation.y -= dt * 0.18 * speed;
            shell.rotation.y += dt * 0.04 * speed;
            stars.rotation.y -= dt * 0.02 * speed;

            const angle = time * 0.42 * speed + 1;
            orbitAt(angle, pos);
            orbitAt(angle + 0.05, next);
            uav.position.copy(pos);
            const d = next.clone().sub(pos).normalize();
            quat.setFromUnitVectors(fwd, d);
            uav.quaternion.copy(quat);
            uav.rotateX(Math.sin(angle * 2) * 0.35);
            kit.animate(dt, time);

            for (let i = trailLength - 1; i > 0; i -= 1) trailPoints[i].copy(trailPoints[i - 1]);
            trailPoints[0].copy(pos);
            trailPoints.forEach((p, i) => trailPositions.set([p.x, p.y, p.z], i * 3));
            trailGeo.attributes.position.needsUpdate = true;

            stage.camera.position.x += (pointer.x * 0.8 - stage.camera.position.x) * 0.04;
            stage.camera.position.y += (-pointer.y * 0.5 - stage.camera.position.y) * 0.04;
            stage.camera.lookAt(0, 0, 0);
        };
    }

    /* ============================================================
       3D Laboratuvar
       ============================================================ */

    let labStage = null;

    function initLab() {
        const canvas = $(".lab-canvas");
        const viewer = $("[data-lab]");
        if (!canvas || !viewer) return;

        const stage = new Stage(canvas, { fov: 34, dprCap: 1.75 });
        labStage = stage;
        stage.scene.add(new THREE.HemisphereLight(0xffffff, 0x28324a, 0.72));
        const key = new THREE.DirectionalLight(0xffffff, 0.8);
        key.position.set(5, 7, 6);
        stage.scene.add(key);
        const rim = new THREE.PointLight(palette.cyan, 1.2, 30);
        rim.position.set(-6, -2, -4);
        stage.scene.add(rim);
        themeListeners.push(() => rim.color.copy(palette.cyan));

        const holder = new THREE.Group();
        stage.scene.add(holder);

        const uav = buildUav();
        const globe = buildGlobe();
        const net = buildNet();
        const models = {
            uav: { kit: uav, object: uav.group, distance: 10.5, yaw: 0.55, pitch: 0.22, scale: 1 },
            globe: { kit: globe, object: globe.group, distance: 8.4, yaw: -0.61, pitch: 0.32, scale: 1 },
            net: { kit: net, object: net.group, distance: 11.5, yaw: 0.5, pitch: 0.16, scale: 1 }
        };
        Object.values(models).forEach((m) => { m.object.visible = false; m.object.scale.setScalar(0.001); holder.add(m.object); });

        const labelsHost = $(".lab-labels", viewer);
        const toolsHost = $("[data-lab-tools]", viewer);
        const modeButtons = $$("[data-lab-mode]");

        const state = {
            mode: "uav",
            wire: false,
            explode: 0,
            explodeTarget: 0,
            spin: true,
            arcs: true,
            training: false,
            appear: 0,
            yaw: models.uav.yaw,
            pitch: models.uav.pitch,
            spinVelocity: 0,
            drag: null,
            distance: models.uav.distance
        };

        /* Etiketler (DOM) */
        const chips = [];
        const makeChip = (anchor, text, kind, side = "right") => {
            const el = document.createElement("span");
            el.className = `lab-chip lab-chip-${kind}`;
            el.dataset.side = side;
            el.textContent = "";
            labelsHost.append(el);
            chips.push({ el, anchor, text, kind });
        };
        Object.entries(uav.parts).forEach(([name, part]) => {
            if (part.userData.label) makeChip(part, part.userData.label, "uav");
        });
        globe.markers.forEach((m) => makeChip(m.dot, m.city.label, "globe", m.city.side));
        const lossChip = document.createElement("span");
        lossChip.className = "lab-chip lab-chip-net lab-loss";
        labelsHost.append(lossChip);

        const renderChips = () => {
            chips.forEach((chip) => {
                chip.el.textContent = chip.text.startsWith("lab_") ? t(chip.text) : chip.text;
            });
        };

        /* Araçlar */
        const toolDefs = {
            uav: [["wire", "lab_tool_wire"], ["explode", "lab_tool_explode"], ["spin", "lab_tool_spin"]],
            globe: [["arcs", "lab_tool_arcs"], ["spin", "lab_tool_spin"]],
            net: [["train", "lab_tool_train"], ["spin", "lab_tool_spin"]]
        };

        const applyTool = (name) => {
            if (name === "wire") { state.wire = !state.wire; uav.setWire(state.wire); }
            if (name === "explode") { state.explodeTarget = state.explodeTarget ? 0 : 1; }
            if (name === "spin") state.spin = !state.spin;
            if (name === "arcs") { state.arcs = !state.arcs; globe.setArcs(state.arcs); }
            if (name === "train") { state.training = !state.training; net.setTraining(state.training); }
            renderTools();
            stage.invalidate();
        };

        const isOn = (name) => ({ wire: state.wire, explode: state.explodeTarget === 1, spin: state.spin, arcs: state.arcs, train: state.training })[name];

        function renderTools() {
            toolsHost.innerHTML = "";
            toolDefs[state.mode].forEach(([name, key]) => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "lab-tool";
                button.dataset.tool = name;
                button.setAttribute("aria-pressed", String(Boolean(isOn(name))));
                button.textContent = t(key);
                button.addEventListener("click", () => applyTool(name));
                toolsHost.append(button);
            });
        }

        function renderInfo() {
            const info = MODELS[currentLanguage][state.mode];
            $("[data-lab-kicker]").textContent = info.kicker;
            $("[data-lab-title]").textContent = info.title;
            $("[data-lab-desc]").textContent = info.desc;
            const list = $("[data-lab-specs]");
            list.innerHTML = "";
            info.specs.forEach((spec) => {
                const li = document.createElement("li");
                li.textContent = spec;
                list.append(li);
            });
            modeButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.labMode === state.mode)));
            lossChip.dataset.label = t("lab_loss");
        }

        function setMode(mode) {
            if (!models[mode] || mode === state.mode && models[mode].object.visible) return;
            Object.entries(models).forEach(([name, m]) => { m.object.visible = name === mode; });
            state.mode = mode;
            state.appear = 0;
            state.yaw = models[mode].yaw;
            state.pitch = models[mode].pitch;
            state.spinVelocity = 0;
            viewer.dataset.mode = mode;
            renderTools();
            renderInfo();
            stage.invalidate();
        }

        modeButtons.forEach((button) => button.addEventListener("click", () => setMode(button.dataset.labMode)));
        document.addEventListener("languagechange", () => { renderChips(); renderTools(); renderInfo(); });

        /* Sürükleyerek döndürme */
        canvas.addEventListener("pointerdown", (event) => {
            state.drag = { id: event.pointerId, x: event.clientX, y: event.clientY, touch: event.pointerType !== "mouse" };
            canvas.setPointerCapture?.(event.pointerId);
            viewer.classList.add("is-dragging");
            stage.invalidate(2500);
        });
        canvas.addEventListener("pointermove", (event) => {
            if (!state.drag || event.pointerId !== state.drag.id) return;
            const dx = event.clientX - state.drag.x;
            const dy = event.clientY - state.drag.y;
            state.drag.x = event.clientX;
            state.drag.y = event.clientY;
            state.yaw += dx * 0.0095;
            state.spinVelocity = dx * 0.0095 * 60;
            if (!state.drag.touch) state.pitch = clamp(state.pitch + dy * 0.006, -0.9, 0.9);
            stage.invalidate(2500);
        });
        const release = (event) => {
            if (state.drag && event.pointerId === state.drag.id) state.drag = null;
            viewer.classList.remove("is-dragging");
        };
        canvas.addEventListener("pointerup", release);
        canvas.addEventListener("pointercancel", release);

        /* Etiket konumları */
        const screen = new V3();
        const worldPosition = new V3();
        const placeChips = () => {
            chips.forEach((chip) => {
                const show = chip.kind === state.mode && state.appear > 0.6 && (chip.kind !== "uav" || state.explode > 0.35);
                if (!show) { chip.el.style.opacity = "0"; return; }
                chip.anchor.getWorldPosition(worldPosition);
                screen.copy(worldPosition).project(stage.camera);
                const x = (screen.x * 0.5 + 0.5) * stage.width;
                const y = (-screen.y * 0.5 + 0.5) * stage.height;
                let visible = screen.z < 1;
                if (chip.kind === "globe") visible = visible && worldPosition.clone().normalize().dot(new V3(0, 0, 1)) > 0.15;
                chip.el.style.opacity = visible ? "1" : "0";
                chip.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)${chip.el.dataset.side === "left" ? " translateX(-100%)" : ""}`;
            });
            lossChip.style.opacity = state.mode === "net" && state.appear > 0.6 ? "1" : "0";
            if (state.mode === "net") lossChip.textContent = `${t("lab_loss")} ${net.state.loss.toFixed(3)}`;
        };

        stage.onResize = () => {
            const aspect = stage.width / stage.height;
            state.fit = aspect < 1.25 ? clamp(1.1 / aspect, 1, 1.32) : 1;
        };
        stage.onResize();

        stage.update = (dt, time) => {
            const model = models[state.mode];
            state.appear = Math.min(1, state.appear + dt * 2.2);
            const s = ease(state.appear);
            model.object.scale.setScalar(Math.max(0.001, s * model.scale));

            if (!state.drag) {
                if (Math.abs(state.spinVelocity) > 0.01) {
                    state.yaw += state.spinVelocity * dt;
                    state.spinVelocity *= Math.pow(0.04, dt);
                } else if (state.spin && !reduce) {
                    state.yaw += dt * 0.32;
                }
            }

            holder.rotation.y = state.yaw;
            holder.rotation.x = state.pitch;
            state.explode += (state.explodeTarget - state.explode) * Math.min(1, dt * 4);
            if (state.mode === "uav") {
                uav.setExplode(ease(state.explode));
                uav.animate(reduce ? 0 : dt, time);
                model.object.position.y = Math.sin(time * 1.2) * 0.08 * (reduce ? 0 : 1);
            }
            globe.animate(dt, time);
            if (state.mode === "net") net.animate(dt, time);

            state.distance += (model.distance * (state.fit || 1) - state.distance) * Math.min(1, dt * 4);
            stage.camera.position.set(0, 0.6, state.distance);
            stage.camera.lookAt(0, 0, 0);
            placeChips();
        };

        // Sekmelerde varsayılan durum
        models.uav.object.visible = true;
        viewer.dataset.mode = "uav";
        renderChips();
        renderTools();
        renderInfo();
        $(".lab-hint")?.setAttribute("data-touch", window.matchMedia("(pointer: coarse)").matches ? "1" : "0");
    }

    // Açık dünya oyunu aynı İHA modelini kullanır.
    window.siteThree = { buildUav };

    function init() {
        try { initHero(); } catch (error) { root.classList.add("no-webgl"); console.warn("hero 3D", error); }
        try { initLab(); } catch (error) { root.classList.add("no-webgl"); console.warn("lab 3D", error); }
        applyLanguage(currentLanguage);
    }

    init();
})();
