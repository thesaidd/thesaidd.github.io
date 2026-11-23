/* ------------------------------------------------------------------
   Site sesi: tarayıcıda üretilen ambient müzik + oyun efektleri.
   Harici ses dosyası yok; her şey WebAudio ile canlı sentezlenir.
   Ses ancak kullanıcı butona bastığında (ya da daha önce açtıysa ilk
   dokunuşta) başlar; tarayıcılar otomatik sese izin vermez.
   ------------------------------------------------------------------ */
(() => {
    "use strict";

    if (typeof translations === "undefined") return;

    const COPY = {
        tr: { snd_on: "Sesi kapat", snd_off: "Müziği aç" },
        en: { snd_on: "Turn sound off", snd_off: "Turn music on" },
        de: { snd_on: "Ton ausschalten", snd_off: "Musik einschalten" }
    };
    Object.keys(COPY).forEach((language) => Object.assign(translations[language], COPY[language]));

    const KEY = "portfolio-sound";
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    const midi = (n) => 440 * 2 ** ((n - 69) / 12);
    const rand = (a, b) => a + Math.random() * (b - a);
    const pick = (list) => list[Math.floor(Math.random() * list.length)];

    // La minör: Am – Fmaj7 – C – G
    const CHORDS = [
        [57, 60, 64, 69],
        [53, 57, 60, 64],
        [55, 60, 64, 67],
        [55, 59, 62, 67]
    ];
    const PENTATONIC = [69, 72, 74, 76, 79, 81, 84, 88];

    let ctx = null;
    let master;
    let musicBus;
    let fxBus;
    let reverbSend;
    let delaySend;
    let timer = 0;
    let enabled = safeStorage.get(KEY) === "1" && Boolean(AudioCtor);
    let started = false;
    let intensity = 0.25;
    let intensityTarget = 0.25;
    let step = 0;
    let chordIndex = 0;
    let nextStepTime = 0;
    let nextChordTime = 0;
    let pickIndex = 0;
    let lastPick = 0;

    /* ---------------- Grafik ---------------- */

    function buildImpulse(seconds, decay) {
        const rate = ctx.sampleRate;
        const length = Math.floor(rate * seconds);
        const impulse = ctx.createBuffer(2, length, rate);
        for (let channel = 0; channel < 2; channel += 1) {
            const data = impulse.getChannelData(channel);
            for (let i = 0; i < length; i += 1) {
                data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** decay;
            }
        }
        return impulse;
    }

    function build() {
        ctx = new AudioCtor();
        master = ctx.createGain();
        master.gain.value = 0;
        master.connect(ctx.destination);

        musicBus = ctx.createGain();
        musicBus.gain.value = 0.5;
        musicBus.connect(master);

        fxBus = ctx.createGain();
        fxBus.gain.value = 0.9;
        fxBus.connect(master);

        const convolver = ctx.createConvolver();
        convolver.buffer = buildImpulse(3.2, 2.6);
        const wet = ctx.createGain();
        wet.gain.value = 0.55;
        convolver.connect(wet).connect(master);

        reverbSend = ctx.createGain();
        reverbSend.gain.value = 0.7;
        reverbSend.connect(convolver);

        const delay = ctx.createDelay(1);
        delay.delayTime.value = 0.375;
        const feedback = ctx.createGain();
        feedback.gain.value = 0.38;
        const tone = ctx.createBiquadFilter();
        tone.type = "lowpass";
        tone.frequency.value = 1900;
        delaySend = ctx.createGain();
        delaySend.gain.value = 0.5;
        delaySend.connect(delay);
        delay.connect(tone);
        tone.connect(feedback);
        feedback.connect(delay);
        tone.connect(reverbSend);
        tone.connect(musicBus);
    }

    /* ---------------- Sesler ---------------- */

    function tone(freq, when, { type = "sine", attack = 0.01, hold = 0, release = 0.8, volume = 0.1, bus = musicBus, sends = true, detune = 0, glide = 0 } = {}) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, when);
        if (glide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq + glide), when + attack + hold + release);
        osc.detune.value = detune;
        gain.gain.setValueAtTime(0.0001, when);
        gain.gain.linearRampToValueAtTime(volume, when + attack);
        gain.gain.setValueAtTime(volume, when + attack + hold);
        gain.gain.exponentialRampToValueAtTime(0.0001, when + attack + hold + release);
        osc.connect(gain);
        gain.connect(bus);
        if (sends) {
            const toReverb = ctx.createGain();
            toReverb.gain.value = 0.5;
            gain.connect(toReverb).connect(reverbSend);
            if (bus === musicBus) gain.connect(delaySend);
        }
        osc.start(when);
        osc.stop(when + attack + hold + release + 0.05);
    }

    function noiseBurst(when, { duration = 0.2, volume = 0.1, freq = 900, bus = fxBus, type = "lowpass" } = {}) {
        const length = Math.floor(ctx.sampleRate * duration);
        const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = type;
        filter.frequency.value = freq;
        const gain = ctx.createGain();
        gain.gain.value = volume;
        source.connect(filter).connect(gain).connect(bus);
        source.start(when);
    }

    function pad(chord, when, length) {
        const cutoff = 700 + intensity * 1100;
        chord.forEach((note, i) => {
            [-7, 7].forEach((detune) => {
                const osc = ctx.createOscillator();
                const filter = ctx.createBiquadFilter();
                const gain = ctx.createGain();
                osc.type = i % 2 ? "triangle" : "sawtooth";
                osc.frequency.value = midi(note - 12);
                osc.detune.value = detune;
                filter.type = "lowpass";
                filter.frequency.value = cutoff;
                gain.gain.setValueAtTime(0.0001, when);
                gain.gain.linearRampToValueAtTime(0.022, when + 2.4);
                gain.gain.setValueAtTime(0.022, when + length - 1.2);
                gain.gain.linearRampToValueAtTime(0.0001, when + length + 2.2);
                osc.connect(filter).connect(gain);
                gain.connect(musicBus);
                gain.connect(reverbSend);
                osc.start(when);
                osc.stop(when + length + 2.4);
            });
        });
        tone(midi(chord[0] - 24), when, { attack: 0.8, hold: length - 1.5, release: 2.2, volume: 0.1, sends: false });
    }

    function schedule() {
        if (!ctx || ctx.state !== "running") return;
        intensity += (intensityTarget - intensity) * 0.12;
        const bpm = 66 + intensity * 30;
        const eighth = 60 / bpm / 2;
        const horizon = ctx.currentTime + 0.7;

        if (nextChordTime < ctx.currentTime) nextChordTime = ctx.currentTime + 0.05;
        if (nextStepTime < ctx.currentTime) nextStepTime = ctx.currentTime + 0.05;

        while (nextChordTime < horizon) {
            pad(CHORDS[chordIndex % CHORDS.length], nextChordTime, 8);
            chordIndex += 1;
            nextChordTime += 8;
        }

        while (nextStepTime < horizon) {
            const chord = CHORDS[(chordIndex - 1 + CHORDS.length) % CHORDS.length];
            const probability = 0.28 + intensity * 0.55;
            if (Math.random() < probability) {
                const notes = [...chord, ...chord.map((n) => n + 12), chord[0] + 14];
                const note = pick(notes) + (Math.random() < 0.2 ? 12 : 0);
                tone(midi(note), nextStepTime, { type: "triangle", attack: 0.006, release: rand(0.7, 1.5), volume: rand(0.035, 0.06) });
                if (Math.random() < 0.35) tone(midi(note) * 2, nextStepTime, { type: "sine", attack: 0.004, release: 0.5, volume: 0.015 });
            }
            if (intensity > 0.5) {
                if (step % 2 === 1) noiseBurst(nextStepTime, { duration: 0.05, volume: 0.012 * intensity, freq: 6500, bus: musicBus, type: "highpass" });
                if (step % 4 === 0) tone(62, nextStepTime, { attack: 0.002, release: 0.22, volume: 0.07 * intensity, glide: -28, sends: false });
            }
            step += 1;
            nextStepTime += eighth;
        }
    }

    /* ---------------- Efektler ---------------- */

    const effects = {
        pick() {
            const now = performance.now();
            pickIndex = now - lastPick > 1600 ? 0 : Math.min(pickIndex + 1, PENTATONIC.length - 1);
            lastPick = now;
            const t0 = ctx.currentTime;
            tone(midi(PENTATONIC[pickIndex]), t0, { type: "triangle", attack: 0.004, release: 0.5, volume: 0.11, bus: fxBus });
            tone(midi(PENTATONIC[pickIndex]) * 2, t0 + 0.02, { type: "sine", attack: 0.004, release: 0.35, volume: 0.04, bus: fxBus });
        },
        hit() {
            const t0 = ctx.currentTime;
            noiseBurst(t0, { duration: 0.35, volume: 0.22, freq: 700 });
            tone(150, t0, { type: "sawtooth", attack: 0.004, release: 0.35, volume: 0.1, bus: fxBus, glide: -110, sends: false });
        },
        station() {
            const t0 = ctx.currentTime;
            [57, 64, 69, 76].forEach((n, i) => tone(midi(n), t0 + i * 0.09, { type: "triangle", attack: 0.01, release: 1.1, volume: 0.09, bus: fxBus }));
        },
        win() {
            const t0 = ctx.currentTime;
            [69, 72, 76, 81, 84, 88].forEach((n, i) => tone(midi(n), t0 + i * 0.11, { type: "triangle", attack: 0.008, release: 1.4, volume: 0.09, bus: fxBus }));
        },
        good() {
            const t0 = ctx.currentTime;
            tone(midi(76), t0, { type: "triangle", attack: 0.004, release: 0.35, volume: 0.1, bus: fxBus });
            tone(midi(83), t0 + 0.08, { type: "triangle", attack: 0.004, release: 0.5, volume: 0.1, bus: fxBus });
        },
        bad() {
            const t0 = ctx.currentTime;
            tone(120, t0, { type: "square", attack: 0.004, release: 0.28, volume: 0.05, bus: fxBus, glide: -40, sends: false });
        },
        tick() {
            tone(1200, ctx.currentTime, { type: "sine", attack: 0.002, release: 0.05, volume: 0.04, bus: fxBus, sends: false });
        }
    };

    /* ---------------- Yaşam döngüsü ---------------- */

    function begin() {
        if (!AudioCtor) return;
        if (!ctx) build();
        ctx.resume?.();
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setTargetAtTime(1, ctx.currentTime, 0.5);
        if (!started) {
            started = true;
            timer = setInterval(schedule, 120);
        }
    }

    function end() {
        if (!ctx) return;
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setTargetAtTime(0, ctx.currentTime, 0.18);
        setTimeout(() => {
            if (enabled || !ctx) return;
            clearInterval(timer);
            started = false;
            ctx.suspend?.();
        }, 900);
    }

    let armed = false;
    function arm() {
        if (armed) return;
        armed = true;
        const go = () => {
            armed = false;
            ["pointerdown", "keydown", "touchend"].forEach((name) => window.removeEventListener(name, go, true));
            if (enabled) begin();
            sync();
        };
        ["pointerdown", "keydown", "touchend"].forEach((name) => window.addEventListener(name, go, { capture: true, once: false }));
    }

    function set(value) {
        enabled = Boolean(value) && Boolean(AudioCtor);
        safeStorage.set(KEY, enabled ? "1" : "0");
        if (enabled) begin(); else end();
        sync();
        document.dispatchEvent(new CustomEvent("soundchange", { detail: { enabled } }));
    }

    /* ---------------- Yüzen buton ---------------- */

    const button = document.createElement("button");
    button.type = "button";
    button.className = "sound-fab";
    button.innerHTML = '<span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';
    if (AudioCtor) document.body.append(button);

    function sync() {
        const copy = translations[currentLanguage] || translations.tr;
        const label = enabled ? copy.snd_on : copy.snd_off;
        button.setAttribute("aria-pressed", String(enabled));
        button.setAttribute("aria-label", label);
        button.title = label;
        button.classList.toggle("is-on", enabled);
    }

    button.addEventListener("click", () => set(!enabled));
    document.addEventListener("languagechange", sync);

    document.addEventListener("visibilitychange", () => {
        if (!ctx || !enabled) return;
        if (document.hidden) ctx.suspend?.(); else ctx.resume?.();
    });

    window.siteAudio = {
        get enabled() { return enabled; },
        get supported() { return Boolean(AudioCtor); },
        set,
        toggle() { set(!enabled); },
        sfx(name) {
            if (!enabled || !ctx || ctx.state !== "running") return;
            try { effects[name]?.(); } catch { /* Ses hatası oyunu bozmasın. */ }
        },
        mood(level) {
            intensityTarget = Math.min(Math.max(level, 0), 1);
        }
    };

    if (enabled) arm();
    sync();
    applyLanguage(currentLanguage);
})();
