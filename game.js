/* ------------------------------------------------------------------
   Arcade — "Beni oynayarak tanı"
   script.js'ten sonra yüklenir; translations, currentLanguage,
   applyLanguage ve safeStorage'ı oradan kullanır.
   ------------------------------------------------------------------ */
(() => {
    "use strict";

    if (typeof translations === "undefined") return;

    /* ============================================================
       Metinler
       ============================================================ */

    const UI = {
        tr: {
            nav_play: "Oyun",
            hero_play: "Oyunu başlat",
            play_label: "Oyun alanı",
            play_title: "Beni oynayarak tanı",
            play_intro: "CV okumak yerine oynayarak tanış: üç oyun, altı istasyon, tek bir portfolyo. Her oyun bana dair bir şey anlatıyor.",
            g_tab1_name: "Tulpar Uçuşu", g_tab1_sub: "Platform · ~90 sn",
            g_tab2_name: "Tespit", g_tab2_sub: "Refleks · 30 sn",
            g_tab3_name: "Quiz", g_tab3_sub: "8 soru",
            g_start: "Başlat", g_resume: "Devam et", g_restart: "Baştan başla", g_replay: "Tekrar oyna",
            g_paused: "Duraklatıldı", g_paused_desc: "Hazır olduğunda devam et.",
            g_pause: "Duraklat", g_expand: "Büyüt", g_collapse: "Küçült", g_sound: "Ses",
            g_hud_score: "Skor", g_hud_shield: "Kalkan", g_hud_tools: "Araç", g_hud_station: "İstasyon", g_hud_time: "Süre", g_hud_combo: "Seri",
            g_flight_kicker: "OYUN 01 · UÇUŞ",
            g_flight_title: "Tulpar Uçuşu",
            g_flight_desc: "Sabit kanatlı İHA'mı altı istasyondan geçir. Engellerden kaç, araçları topla. Her istasyon beni biraz daha tanıtır.",
            g_ctrl_desktop_flight: "↑ ↓ ya da W S · fareyi oynat · P: duraklat",
            g_ctrl_touch_flight: "Parmağını yukarı-aşağı sürükle",
            g_station: "İSTASYON", g_continue: "Devam et", g_see_result: "Sonucu gör", g_see_section: "Bölüme git",
            g_crash_title: "Sinyal kesildi", g_crash_desc: "Kalkanların bitti. Son istasyondan devam ediyorsun.", g_retry: "Yeniden dene",
            g_finish_title: "Yolculuk tamam", g_finish_desc: "Altı istasyonu da geçtin. Profil dosyam eksiksiz.",
            g_stat_score: "Skor", g_stat_best: "En iyi", g_stat_tools: "Araçlar", g_stat_bonus: "Kalkan bonusu",
            g_next_detect: "Tespit oyununa geç", g_next_quiz: "Quiz'e geç", g_contact: "İletişime geç",
            g_detect_kicker: "OYUN 02 · REFLEKS",
            g_detect_title: "Tespit",
            g_detect_desc: "Kameradaki sabit kanatlı İHA'lara dokun. Kuşlara ve balonlara dokunma: yanlış alarm puan kaybettirir.",
            g_legend_uav: "İHA · dokun", g_legend_bird: "Kuş · dokunma", g_legend_balloon: "Balon · dokunma",
            g_ctrl_desktop_detect: "Fareyle hedeflere tıkla", g_ctrl_touch_detect: "Hedeflere dokun",
            g_detect_end_title: "Süre doldu",
            g_precision: "Kesinlik", g_recall: "Duyarlılık", g_f1: "F1", g_tp: "Doğru tespit", g_fp: "Yanlış alarm", g_fn: "Kaçan",
            g_detect_hint: "Rozet için F1 ≥ %80 ve en az 12 doğru tespit gerekiyor.",
            g_detect_win: "Rozeti kaptın: gözcü gözlerin keskin.",
            g_quiz_kicker: "OYUN 03 · BİLGİ",
            g_quiz_title: "Beni ne kadar tanıyorsun?",
            g_quiz_desc: "Bu sayfada öğrendiklerini sekiz soruyla test et.",
            g_ctrl_desktop_quiz: "Cevabı tıkla ya da 1 · 2 · 3 tuşlarına bas", g_ctrl_touch_quiz: "Cevaba dokun",
            g_question: "SORU", g_correct: "Doğru!", g_wrong: "Olmadı.", g_next: "Sonraki", g_quiz_result: "Sonucu gör",
            g_quiz_end_kicker: "SONUÇ",
            g_quiz_t0: "Yeni tanışıyoruz", g_quiz_t1: "İyi bir gözlemcisin", g_quiz_t2: "Beni iyi tanıyorsun",
            g_quiz_t0_d: "Sorun değil: uçuşu oyna ve profil dosyamı aç, sonra tekrar dene.",
            g_quiz_t1_d: "Çoğunu yakaladın. Bir tur daha, tam skoru yakalayabilirsin.",
            g_quiz_t2_d: "Rozeti kaptın. Artık gerçekten tanışmış sayılırız.",
            g_stat_correct: "Doğru", g_stat_wrong: "Yanlış",
            g_dossier: "Profil dosyası", g_dossier_hint: "Tulpar Uçuşu'nda istasyonlara ulaştıkça açılır.", g_locked: "Kilitli",
            g_badges: "Rozetler",
            g_badge_pilot: "Pilot", g_badge_pilot_d: "Tulpar Uçuşu'nu tamamla.",
            g_badge_scout: "Gözcü", g_badge_scout_d: "Tespit'te F1 ≥ %80 yap.",
            g_badge_expert: "Yakın dost", g_badge_expert_d: "Quiz'de en az 7 doğru yap.",
            g_progress: "Tanışma ilerlemesi",
            g_progress_start: "Bir oyun seç, ilk istasyona doğru yola çık.",
            g_progress_mid: "İyi gidiyorsun. Kalan oyunlarla dosyayı tamamla.",
            g_progress_done: "Artık birbirimizi tanıyoruz. Birlikte bir şey yapmak istersen yaz.",
            g_reset: "İlerlemeyi sıfırla", g_confirm_reset: "Tüm oyun ilerlemen silinecek. Emin misin?"
        },
        en: {
            nav_play: "Play",
            hero_play: "Start the game",
            play_label: "Arcade",
            play_title: "Get to know me by playing",
            play_intro: "Skip the résumé and play instead: three games, six stations, one portfolio. Every game tells you something about me.",
            g_tab1_name: "Tulpar Flight", g_tab1_sub: "Platformer · ~90 s",
            g_tab2_name: "Detect", g_tab2_sub: "Reflex · 30 s",
            g_tab3_name: "Quiz", g_tab3_sub: "8 questions",
            g_start: "Start", g_resume: "Resume", g_restart: "Start over", g_replay: "Play again",
            g_paused: "Paused", g_paused_desc: "Resume whenever you're ready.",
            g_pause: "Pause", g_expand: "Expand", g_collapse: "Collapse", g_sound: "Sound",
            g_hud_score: "Score", g_hud_shield: "Shield", g_hud_tools: "Tools", g_hud_station: "Station", g_hud_time: "Time", g_hud_combo: "Streak",
            g_flight_kicker: "GAME 01 · FLIGHT",
            g_flight_title: "Tulpar Flight",
            g_flight_desc: "Guide my fixed-wing UAV through six stations. Dodge the hazards and collect tools. Each station tells you a bit more about me.",
            g_ctrl_desktop_flight: "↑ ↓ or W S · move the mouse · P: pause",
            g_ctrl_touch_flight: "Drag your finger up and down",
            g_station: "STATION", g_continue: "Continue", g_see_result: "See result", g_see_section: "Go to section",
            g_crash_title: "Signal lost", g_crash_desc: "Your shields are gone. You'll resume from the last station.", g_retry: "Try again",
            g_finish_title: "Journey complete", g_finish_desc: "You passed all six stations. My profile file is complete.",
            g_stat_score: "Score", g_stat_best: "Best", g_stat_tools: "Tools", g_stat_bonus: "Shield bonus",
            g_next_detect: "Play Detect next", g_next_quiz: "Go to the quiz", g_contact: "Get in touch",
            g_detect_kicker: "GAME 02 · REFLEX",
            g_detect_title: "Detect",
            g_detect_desc: "Tap the fixed-wing UAVs in the camera feed. Leave the birds and balloons alone: false alarms cost points.",
            g_legend_uav: "UAV · tap", g_legend_bird: "Bird · skip", g_legend_balloon: "Balloon · skip",
            g_ctrl_desktop_detect: "Click the targets", g_ctrl_touch_detect: "Tap the targets",
            g_detect_end_title: "Time's up",
            g_precision: "Precision", g_recall: "Recall", g_f1: "F1", g_tp: "True hits", g_fp: "False alarms", g_fn: "Missed",
            g_detect_hint: "The badge needs F1 ≥ 80% and at least 12 true hits.",
            g_detect_win: "Badge earned: sharp eyes, scout.",
            g_quiz_kicker: "GAME 03 · KNOWLEDGE",
            g_quiz_title: "How well do you know me?",
            g_quiz_desc: "Test what you picked up on this page with eight questions.",
            g_ctrl_desktop_quiz: "Click an answer or press 1 · 2 · 3", g_ctrl_touch_quiz: "Tap an answer",
            g_question: "QUESTION", g_correct: "Correct!", g_wrong: "Not quite.", g_next: "Next", g_quiz_result: "See result",
            g_quiz_end_kicker: "RESULT",
            g_quiz_t0: "We're just meeting", g_quiz_t1: "A keen observer", g_quiz_t2: "You know me well",
            g_quiz_t0_d: "No problem: play the flight, unlock my profile file, then try again.",
            g_quiz_t1_d: "You caught most of it. One more round and you could get a perfect score.",
            g_quiz_t2_d: "Badge earned. We can call this properly introduced.",
            g_stat_correct: "Correct", g_stat_wrong: "Wrong",
            g_dossier: "Profile file", g_dossier_hint: "Unlocks as you reach stations in Tulpar Flight.", g_locked: "Locked",
            g_badges: "Badges",
            g_badge_pilot: "Pilot", g_badge_pilot_d: "Complete Tulpar Flight.",
            g_badge_scout: "Scout", g_badge_scout_d: "Reach F1 ≥ 80% in Detect.",
            g_badge_expert: "Close friend", g_badge_expert_d: "Score 7 or more in the quiz.",
            g_progress: "Getting-to-know-me progress",
            g_progress_start: "Pick a game and head for the first station.",
            g_progress_mid: "Going well. Finish the file with the remaining games.",
            g_progress_done: "Now we know each other. If you'd like to build something together, write to me.",
            g_reset: "Reset progress", g_confirm_reset: "All your game progress will be erased. Are you sure?"
        },
        de: {
            nav_play: "Spielen",
            hero_play: "Spiel starten",
            play_label: "Spielbereich",
            play_title: "Lerne mich spielend kennen",
            play_intro: "Statt Lebenslauf lesen: drei Spiele, sechs Stationen, ein Portfolio. Jedes Spiel erzählt dir etwas über mich.",
            g_tab1_name: "Tulpar-Flug", g_tab1_sub: "Plattformer · ~90 s",
            g_tab2_name: "Erkennen", g_tab2_sub: "Reflex · 30 s",
            g_tab3_name: "Quiz", g_tab3_sub: "8 Fragen",
            g_start: "Starten", g_resume: "Fortsetzen", g_restart: "Neu beginnen", g_replay: "Nochmal spielen",
            g_paused: "Pausiert", g_paused_desc: "Setze fort, sobald du bereit bist.",
            g_pause: "Pause", g_expand: "Vergrößern", g_collapse: "Verkleinern", g_sound: "Ton",
            g_hud_score: "Punkte", g_hud_shield: "Schild", g_hud_tools: "Tools", g_hud_station: "Station", g_hud_time: "Zeit", g_hud_combo: "Serie",
            g_flight_kicker: "SPIEL 01 · FLUG",
            g_flight_title: "Tulpar-Flug",
            g_flight_desc: "Steuere meine Starrflügel-Drohne durch sechs Stationen. Weiche Hindernissen aus und sammle Tools. Jede Station verrät dir mehr über mich.",
            g_ctrl_desktop_flight: "↑ ↓ oder W S · Maus bewegen · P: Pause",
            g_ctrl_touch_flight: "Finger nach oben und unten ziehen",
            g_station: "STATION", g_continue: "Weiter", g_see_result: "Ergebnis ansehen", g_see_section: "Zum Abschnitt",
            g_crash_title: "Signal verloren", g_crash_desc: "Deine Schilde sind aufgebraucht. Du startest an der letzten Station neu.", g_retry: "Nochmal versuchen",
            g_finish_title: "Reise abgeschlossen", g_finish_desc: "Du hast alle sechs Stationen geschafft. Meine Profilakte ist vollständig.",
            g_stat_score: "Punkte", g_stat_best: "Bestwert", g_stat_tools: "Tools", g_stat_bonus: "Schild-Bonus",
            g_next_detect: "Weiter zu Erkennen", g_next_quiz: "Weiter zum Quiz", g_contact: "Kontakt aufnehmen",
            g_detect_kicker: "SPIEL 02 · REFLEX",
            g_detect_title: "Erkennen",
            g_detect_desc: "Tippe im Kamerabild auf die Starrflügel-Drohnen. Lass Vögel und Ballons in Ruhe: Fehlalarme kosten Punkte.",
            g_legend_uav: "Drohne · tippen", g_legend_bird: "Vogel · nicht", g_legend_balloon: "Ballon · nicht",
            g_ctrl_desktop_detect: "Ziele mit der Maus anklicken", g_ctrl_touch_detect: "Ziele antippen",
            g_detect_end_title: "Zeit abgelaufen",
            g_precision: "Präzision", g_recall: "Recall", g_f1: "F1", g_tp: "Treffer", g_fp: "Fehlalarme", g_fn: "Verpasst",
            g_detect_hint: "Für das Abzeichen brauchst du F1 ≥ 80 % und mindestens 12 Treffer.",
            g_detect_win: "Abzeichen verdient: scharfe Augen, Späher.",
            g_quiz_kicker: "SPIEL 03 · WISSEN",
            g_quiz_title: "Wie gut kennst du mich?",
            g_quiz_desc: "Teste mit acht Fragen, was du auf dieser Seite gelernt hast.",
            g_ctrl_desktop_quiz: "Antwort anklicken oder 1 · 2 · 3 drücken", g_ctrl_touch_quiz: "Antwort antippen",
            g_question: "FRAGE", g_correct: "Richtig!", g_wrong: "Leider nicht.", g_next: "Weiter", g_quiz_result: "Ergebnis ansehen",
            g_quiz_end_kicker: "ERGEBNIS",
            g_quiz_t0: "Wir lernen uns gerade kennen", g_quiz_t1: "Ein aufmerksamer Beobachter", g_quiz_t2: "Du kennst mich gut",
            g_quiz_t0_d: "Kein Problem: Spiel den Flug, schalte meine Profilakte frei und versuche es erneut.",
            g_quiz_t1_d: "Das meiste hast du erwischt. Noch eine Runde, dann klappt die volle Punktzahl.",
            g_quiz_t2_d: "Abzeichen verdient. Jetzt sind wir wirklich miteinander bekannt.",
            g_stat_correct: "Richtig", g_stat_wrong: "Falsch",
            g_dossier: "Profilakte", g_dossier_hint: "Wird beim Erreichen der Stationen im Tulpar-Flug freigeschaltet.", g_locked: "Gesperrt",
            g_badges: "Abzeichen",
            g_badge_pilot: "Pilot", g_badge_pilot_d: "Schließe den Tulpar-Flug ab.",
            g_badge_scout: "Späher", g_badge_scout_d: "Erreiche F1 ≥ 80 % bei Erkennen.",
            g_badge_expert: "Enger Vertrauter", g_badge_expert_d: "Erreiche im Quiz mindestens 7 Punkte.",
            g_progress: "Kennenlern-Fortschritt",
            g_progress_start: "Wähle ein Spiel und mach dich auf zur ersten Station.",
            g_progress_mid: "Läuft gut. Vervollständige die Akte mit den übrigen Spielen.",
            g_progress_done: "Jetzt kennen wir uns. Wenn du etwas gemeinsam umsetzen möchtest, schreib mir.",
            g_reset: "Fortschritt zurücksetzen", g_confirm_reset: "Dein gesamter Spielfortschritt wird gelöscht. Sicher?"
        }
    };

    // Bölümler: id → #bölüm. Quiz'de ilk şık her zaman doğrudur (çalışırken karıştırılır).
    const CONTENT = {
        tr: {
            stations: [
                { code: "KAYSERİ", title: "Yolculuk burada başlıyor", section: "about",
                  text: "Profilimdeki konum Kayseri. Buradan bilgisayar mühendisliğine, yapay zekâya ve otonom sistemlere uzanan bir yol çiziyorum." },
                { code: "AGÜ · 2021", title: "Bilgisayar Mühendisliği", section: "experience",
                  text: "2021'de Abdullah Gül Üniversitesi'nde Bilgisayar Mühendisliği lisansına başladım. Eğitimim devam ediyor." },
                { code: "TULPAR UAV", title: "Yazılım takım lideri", section: "experience",
                  text: "AGU TEKNOFEST Savaşan İHA Takımı'nda nesne tespiti ve takibi, PX4–Gazebo simülasyonu ve ROS 2 tabanlı uçuş testlerini koordine ettim." },
                { code: "ARAŞTIRMA", title: "Gökyüzünü veriyle okumak", section: "experience",
                  text: "TÜBİTAK 2209-A kapsamında GNSS ve gerçek zamanlı görüntüyü birleştirerek sabit kanatlı İHA'ları takip eden bir sistem geliştirdim. BAP projesinde iş birlikli İHA görevleri üzerine çalışıyorum." },
                { code: "ÜRÜN & SAHA", title: "Araştırmadan ürüne", section: "projects",
                  text: "K2 EnerjiPro, EPİAŞ PTF Tahmin MVP, Akıllı CV ve 3D CHLOthes gibi çalışan yazılımlar geliştirdim. Stajlarımı B&B Bilişim'de yazılım, KEPSAŞ'ta enerji sektörü alanında yaptım." },
                { code: "TOPLULUK", title: "Öğrenmek ve paylaşmak", section: "recognition",
                  text: "AI Stars'ta gönüllü eğitmen: ortaokul ve lise öğrencilerine yapay zekâ okuryazarlığı ve Python atölyeleri. TEKNOFEST Hepsiburada AI Hackathon'da adres çözümleme üzerine çalıştım." }
            ],
            quiz: [
                { q: "Bilgisayar Mühendisliği'ni hangi üniversitede okuyorum?", a: ["Abdullah Gül Üniversitesi", "Orta Doğu Teknik Üniversitesi", "İstanbul Teknik Üniversitesi"], why: "2021'den beri Abdullah Gül Üniversitesi'ndeyim." },
                { q: "TEKNOFEST takımı Tulpar UAV'daki rolüm neydi?", a: ["Yazılım takım lideri", "Takım pilotu", "Mekanik tasarım sorumlusu"], why: "Nesne tespiti, takip, simülasyon ve uçuş testlerini koordine ettim." },
                { q: "TÜBİTAK 2209-A projemde hangi iki veri birleşiyor?", a: ["GNSS ve görüntü", "Radar ve sonar", "LiDAR ve termal kamera"], why: "GNSS ile gerçek zamanlı görüntü verisini birleştirerek İHA'ları tespit ve takip ediyorum." },
                { q: "EPİAŞ PTF Tahmin MVP kaç saatlik tahmin üretiyor?", a: ["24 saat", "6 saat", "7 gün"], why: "XGBoost ve GPR ile 24 saatlik tahmin ve belirsizlik üretiyor." },
                { q: "RT-DETR projemde nesne tespitinin yanında ne var?", a: ["Yeniden kimliklendirme (Re-ID)", "Ses tanıma", "Metin özetleme"], why: "Video analitiği için nesne tespiti ve Re-ID deneyi." },
                { q: "AI Stars'ta ne yapıyorum?", a: ["Gönüllü eğitmenlik", "Hakemlik", "Sunucu yönetimi"], why: "Ortaokul ve lise öğrencilerine yapay zekâ okuryazarlığı ve Python atölyeleri." },
                { q: "B&B Bilişim stajımda hangi teknolojilerle çalıştım?", a: ["C# ve ASP.NET Core MVC", "Java ve Spring", "PHP ve Laravel"], why: "Bilgisayarlı görü projeleri ve C# / ASP.NET Core MVC geliştirme süreçlerinde görev aldım." },
                { q: "İHA uçuş testlerinde hangi araç setini kullandım?", a: ["ROS 2, PX4 ve Gazebo", "Unity ve Unreal", "MATLAB ve Simulink"], why: "ROS 2, PX4 ve Gazebo ile algılama, takip ve uçuş senaryoları geliştiriyorum." }
            ]
        },
        en: {
            stations: [
                { code: "KAYSERİ", title: "The journey starts here", section: "about",
                  text: "My profile location is Kayseri. From here I'm drawing a path toward computer engineering, AI, and autonomous systems." },
                { code: "AGU · 2021", title: "Computer Engineering", section: "experience",
                  text: "In 2021 I started my BSc in Computer Engineering at Abdullah Gül University. My studies are ongoing." },
                { code: "TULPAR UAV", title: "Software team lead", section: "experience",
                  text: "On the AGU TEKNOFEST Fighter UAV Team I coordinated object detection and tracking, PX4–Gazebo simulation, and ROS 2-based flight tests." },
                { code: "RESEARCH", title: "Reading the sky with data", section: "experience",
                  text: "In my TÜBİTAK 2209-A project I built a system that tracks fixed-wing UAVs by fusing GNSS with real-time imagery. In my BAP project I work on collaborative UAV missions." },
                { code: "PRODUCT & FIELD", title: "From research to product", section: "projects",
                  text: "I've built working software such as K2 EnergyPro, the EPİAŞ MCP Forecasting MVP, Smart Résumé, and 3D CHLOthes. My internships were in software at B&B Bilişim and in the energy sector at KEPSAŞ." },
                { code: "COMMUNITY", title: "Learning and sharing", section: "recognition",
                  text: "AI Stars volunteer instructor: AI literacy and Python workshops for middle and high school students. I also worked on address resolution at the TEKNOFEST Hepsiburada AI Hackathon." }
            ],
            quiz: [
                { q: "Which university am I studying Computer Engineering at?", a: ["Abdullah Gül University", "Middle East Technical University", "Istanbul Technical University"], why: "I've been at Abdullah Gül University since 2021." },
                { q: "What was my role in the TEKNOFEST team Tulpar UAV?", a: ["Software team lead", "Team pilot", "Mechanical design lead"], why: "I coordinated detection, tracking, simulation, and flight tests." },
                { q: "Which two data sources does my TÜBİTAK 2209-A project fuse?", a: ["GNSS and imagery", "Radar and sonar", "LiDAR and thermal camera"], why: "I combine GNSS with real-time image data to detect and track UAVs." },
                { q: "How many hours ahead does the EPİAŞ MCP Forecasting MVP predict?", a: ["24 hours", "6 hours", "7 days"], why: "It produces a 24-hour forecast with uncertainty using XGBoost and GPR." },
                { q: "What comes with object detection in my RT-DETR project?", a: ["Re-identification (Re-ID)", "Speech recognition", "Text summarization"], why: "An experiment in object detection and Re-ID for video analytics." },
                { q: "What do I do at AI Stars?", a: ["Volunteer instructor", "Referee", "Server administration"], why: "AI literacy and Python workshops for middle and high school students." },
                { q: "Which technologies did I use during my B&B Bilişim internship?", a: ["C# and ASP.NET Core MVC", "Java and Spring", "PHP and Laravel"], why: "I worked on computer vision projects and C# / ASP.NET Core MVC development." },
                { q: "Which toolset did I use for UAV flight tests?", a: ["ROS 2, PX4 and Gazebo", "Unity and Unreal", "MATLAB and Simulink"], why: "I build perception, tracking, and flight scenarios with ROS 2, PX4, and Gazebo." }
            ]
        },
        de: {
            stations: [
                { code: "KAYSERİ", title: "Hier beginnt die Reise", section: "about",
                  text: "In meinem Profil steht Kayseri. Von hier zeichne ich einen Weg in Richtung Informatik, KI und autonome Systeme." },
                { code: "AGU · 2021", title: "Computer Engineering", section: "experience",
                  text: "2021 habe ich mein Bachelorstudium Computer Engineering an der Abdullah Gül Universität begonnen. Mein Studium läuft noch." },
                { code: "TULPAR UAV", title: "Software-Teamleiter", section: "experience",
                  text: "Im AGU TEKNOFEST Kampfdrohnen-Team habe ich Objekterkennung und -verfolgung, PX4–Gazebo-Simulationen und ROS-2-basierte Flugtests koordiniert." },
                { code: "FORSCHUNG", title: "Den Himmel mit Daten lesen", section: "experience",
                  text: "Im TÜBİTAK-2209-A-Projekt habe ich ein System zur Verfolgung von Starrflügel-UAVs entwickelt, das GNSS und Echtzeitbilder fusioniert. Im BAP-Projekt arbeite ich an kooperativen UAV-Missionen." },
                { code: "PRODUKT & PRAXIS", title: "Von der Forschung zum Produkt", section: "projects",
                  text: "Ich habe funktionierende Software wie K2 EnergiePro, das EPİAŞ-MCP-Prognose-MVP, das Lebenslauf-System und 3D CHLOthes gebaut. Praktika absolvierte ich im Softwarebereich bei B&B Bilişim und im Energiesektor bei KEPSAŞ." },
                { code: "COMMUNITY", title: "Lernen und teilen", section: "recognition",
                  text: "Ehrenamtlicher Trainer bei AI Stars: KI-Grundlagen und Python-Workshops für Schülerinnen und Schüler. Beim TEKNOFEST Hepsiburada AI Hackathon habe ich an Adressauflösung gearbeitet." }
            ],
            quiz: [
                { q: "An welcher Universität studiere ich Computer Engineering?", a: ["Abdullah Gül Universität", "Technische Universität des Nahen Ostens (METU)", "Technische Universität Istanbul"], why: "Seit 2021 bin ich an der Abdullah Gül Universität." },
                { q: "Welche Rolle hatte ich im TEKNOFEST-Team Tulpar UAV?", a: ["Software-Teamleiter", "Team-Pilot", "Leiter Mechanikdesign"], why: "Ich habe Erkennung, Tracking, Simulation und Flugtests koordiniert." },
                { q: "Welche zwei Datenquellen fusioniert mein TÜBİTAK-2209-A-Projekt?", a: ["GNSS und Bilddaten", "Radar und Sonar", "LiDAR und Wärmebildkamera"], why: "Ich kombiniere GNSS mit Echtzeit-Bilddaten, um UAVs zu erkennen und zu verfolgen." },
                { q: "Wie viele Stunden im Voraus prognostiziert das EPİAŞ-MCP-Prognose-MVP?", a: ["24 Stunden", "6 Stunden", "7 Tage"], why: "Es liefert mit XGBoost und GPR eine 24-Stunden-Prognose samt Unsicherheit." },
                { q: "Was gehört in meinem RT-DETR-Projekt zur Objekterkennung dazu?", a: ["Re-Identifikation (Re-ID)", "Spracherkennung", "Textzusammenfassung"], why: "Ein Experiment zu Objekterkennung und Re-ID für Videoanalysen." },
                { q: "Was mache ich bei AI Stars?", a: ["Ehrenamtlicher Trainer", "Schiedsrichter", "Serveradministration"], why: "KI-Grundlagen und Python-Workshops für Schülerinnen und Schüler." },
                { q: "Mit welchen Technologien habe ich im Praktikum bei B&B Bilişim gearbeitet?", a: ["C# und ASP.NET Core MVC", "Java und Spring", "PHP und Laravel"], why: "Ich war an Computer-Vision-Projekten und an C#- / ASP.NET-Core-MVC-Entwicklung beteiligt." },
                { q: "Welches Toolset habe ich für UAV-Flugtests genutzt?", a: ["ROS 2, PX4 und Gazebo", "Unity und Unreal", "MATLAB und Simulink"], why: "Ich entwickle Wahrnehmungs-, Tracking- und Flugszenarien mit ROS 2, PX4 und Gazebo." }
            ]
        }
    };

    Object.keys(UI).forEach((language) => Object.assign(translations[language], UI[language]));

    /* ============================================================
       Yardımcılar
       ============================================================ */

    const root = document.documentElement;
    const $ = (selector, scope = document) => scope.querySelector(selector);
    const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
    const t = (key) => translations[currentLanguage][key] ?? key;
    const content = () => CONTENT[currentLanguage];
    const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
    const rand = (a, b) => a + Math.random() * (b - a);
    const wrap = (v, m) => ((v % m) + m) % m;
    const pad = (n) => String(n).padStart(2, "0");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const smallScreen = () => window.matchMedia("(max-width: 820px), (max-height: 520px) and (pointer: coarse)").matches;

    function shuffle(list) {
        const copy = [...list];
        for (let i = copy.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    function track(name, params = {}) {
        if (typeof window.gtag === "function") window.gtag("event", name, { event_category: "Arcade", ...params });
    }

    function roundRectPath(ctx, x, y, w, h, r) {
        r = Math.min(r, w / 2, h / 2);
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }

    function circleRect(cx, cy, r, rx, ry, rw, rh) {
        const nx = clamp(cx, rx, rx + rw);
        const ny = clamp(cy, ry, ry + rh);
        return (cx - nx) ** 2 + (cy - ny) ** 2 <= r * r;
    }

    const palette = {};

    function readPalette() {
        const styles = getComputedStyle(root);
        ["bg", "bg-soft", "text", "muted", "green", "violet", "orange", "cyan", "yellow", "pink", "red", "blue"]
            .forEach((name) => { palette[name] = styles.getPropertyValue(`--${name}`).trim(); });
    }

    const rgbaCache = new Map();
    function rgba(hex, alpha) {
        let rgb = rgbaCache.get(hex);
        if (!rgb) {
            const n = parseInt(hex.slice(1), 16);
            rgb = `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
            rgbaCache.set(hex, rgb);
        }
        return `rgba(${rgb},${alpha})`;
    }

    readPalette();
    new MutationObserver(() => {
        readPalette();
        arcade.games.detect?.drawLegend();
    }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    /* ============================================================
       Kayıt (localStorage)
       ============================================================ */

    const STORAGE_KEY = "ys-arcade";

    function defaults() {
        return {
            dossier: [0, 0, 0, 0, 0, 0],
            best: { flight: 0, detect: 0, quiz: 0 },
            badges: { pilot: 0, scout: 0, expert: 0 },
            sound: 0
        };
    }

    function loadSave() {
        const base = defaults();
        try {
            const raw = JSON.parse(safeStorage.get(STORAGE_KEY) || "null");
            if (raw && typeof raw === "object") {
                if (Array.isArray(raw.dossier)) base.dossier = base.dossier.map((_, i) => (raw.dossier[i] ? 1 : 0));
                Object.keys(base.best).forEach((k) => { base.best[k] = Number(raw.best?.[k]) || 0; });
                Object.keys(base.badges).forEach((k) => { base.badges[k] = raw.badges?.[k] ? 1 : 0; });
                base.sound = raw.sound ? 1 : 0;
            }
        } catch { /* Bozuk kayıt: sıfırdan başla. */ }
        return base;
    }

    let save = loadSave();
    const persist = () => safeStorage.set(STORAGE_KEY, JSON.stringify(save));

    /* ============================================================
       Ses (küçük WebAudio bipleri, varsayılan kapalı)
       ============================================================ */

    let audio = null;

    function beep(freq, duration = 0.09, type = "sine", volume = 0.05, slide = 0) {
        if (!save.sound) return;
        try {
            audio ||= new (window.AudioContext || window.webkitAudioContext)();
            if (audio.state === "suspended") audio.resume();
            const now = audio.currentTime;
            const osc = audio.createOscillator();
            const gain = audio.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, now);
            if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), now + duration);
            gain.gain.setValueAtTime(volume, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
            osc.connect(gain).connect(audio.destination);
            osc.start(now);
            osc.stop(now + duration + 0.02);
        } catch { /* Ses desteklenmiyor. */ }
    }

    const sfx = {
        pick: () => beep(740, 0.1, "triangle", 0.05, 500),
        hit: () => beep(170, 0.26, "sawtooth", 0.06, -100),
        station: () => { beep(523, 0.14, "sine", 0.06); setTimeout(() => beep(784, 0.24, "sine", 0.06), 120); },
        win: () => { beep(523, 0.14, "triangle", 0.06); setTimeout(() => beep(659, 0.14, "triangle", 0.06), 120); setTimeout(() => beep(988, 0.3, "triangle", 0.06), 240); },
        good: () => beep(660, 0.1, "sine", 0.05, 380),
        bad: () => beep(200, 0.2, "square", 0.04, -60)
    };

    /* ============================================================
       Çizim yardımcıları
       ============================================================ */

    const TOP = 26;
    const WORLD_H = 360;

    function drawPlane(ctx, fill, accent) {
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.moveTo(3, 0);
        ctx.lineTo(-8, -18);
        ctx.lineTo(-13, -18);
        ctx.lineTo(-6, 0);
        ctx.lineTo(-13, 18);
        ctx.lineTo(-8, 18);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(19, 0);
        ctx.quadraticCurveTo(6, -5.2, -14, -2.3);
        ctx.lineTo(-14, 2.3);
        ctx.quadraticCurveTo(6, 5.2, 19, 0);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-11, 0);
        ctx.lineTo(-17, -8);
        ctx.lineTo(-19, -8);
        ctx.lineTo(-16, 0);
        ctx.lineTo(-19, 8);
        ctx.lineTo(-17, 8);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(7, 0, 2.2, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawBird(ctx, flap, color) {
        const wing = -7 + flap * 7;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.6;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(-13, wing + 3);
        ctx.quadraticCurveTo(-6, wing - 4, 0, 1);
        ctx.quadraticCurveTo(6, wing - 4, 13, wing + 3);
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(0, 1.5, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawBalloon(ctx, time, color) {
        ctx.fillStyle = rgba(color, 0.85);
        ctx.beginPath();
        ctx.ellipse(0, -2, 11, 13, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,.35)";
        ctx.beginPath();
        ctx.ellipse(-4, -7, 3, 5, -0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = rgba(color, 0.9);
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, 11);
        ctx.quadraticCurveTo(Math.sin(time * 3) * 4, 16, 0, 22);
        ctx.stroke();
    }

    /* ============================================================
       Ortak ekran davranışı (tuval, HUD, katmanlar, döngü)
       ============================================================ */

    const ICONS = {
        pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>',
        sound: '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="i-on" d="M4 9v6h4l5 4V5L8 9H4zM17 8.5a5 5 0 0 1 0 7M19.5 6a8.5 8.5 0 0 1 0 12"/><path class="i-off" d="M4 9v6h4l5 4V5L8 9H4zM17 9l5 6M22 9l-5 6"/></svg>',
        expand: '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="i-expand" d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/><path class="i-collapse" d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>'
    };

    let expandedScreen = null;

    class CanvasGame {
        constructor(panel) {
            this.panel = panel;
            this.screen = $("[data-screen]", panel);
            this.canvas = $("canvas", this.screen);
            this.ctx = this.canvas.getContext("2d");
            this.live = $("[data-live]", panel);
            this.state = "ready";
            this.visible = false;
            this.inView = true;
            this.W = 640;
            this.H = WORLD_H;
            this.minRatio = 1;
            this.scale = 1;
            this.raf = 0;
            this.last = 0;
            this.time = 0;
            this.frame = this.frame.bind(this);

            this.buildButtons();
            $$("[data-action]", panel).forEach((button) => {
                button.addEventListener("click", () => this.onAction(button.dataset.action));
            });

            new ResizeObserver(() => this.layout()).observe(this.screen);
            new IntersectionObserver(([entry]) => { this.inView = entry.isIntersecting; this.sync(); }, { threshold: 0.12 }).observe(this.screen);
            document.addEventListener("visibilitychange", () => this.sync());
        }

        buildButtons() {
            const holder = $("[data-hud-buttons]", this.screen);
            holder.innerHTML = `
                <button class="icon-btn" type="button" data-action="pause">${ICONS.pause}</button>
                <button class="icon-btn" type="button" data-action="sound" aria-pressed="false">${ICONS.sound}</button>
                <button class="icon-btn" type="button" data-action="expand" aria-pressed="false">${ICONS.expand}</button>`;
            this.relabelButtons();
        }

        relabelButtons() {
            const set = (action, label) => {
                const button = $(`.hud-buttons [data-action="${action}"]`, this.screen);
                if (!button) return;
                button.setAttribute("aria-label", label);
                button.title = label;
            };
            set("pause", t("g_pause"));
            set("sound", t("g_sound"));
            set("expand", this.expanded ? t("g_collapse") : t("g_expand"));
            this.syncButtons();
        }

        syncButtons() {
            const sound = $('.hud-buttons [data-action="sound"]', this.screen);
            const expand = $('.hud-buttons [data-action="expand"]', this.screen);
            const pause = $('.hud-buttons [data-action="pause"]', this.screen);
            if (sound) sound.setAttribute("aria-pressed", String(Boolean(save.sound)));
            if (expand) expand.setAttribute("aria-pressed", String(Boolean(this.expanded)));
            if (pause) pause.disabled = this.state !== "play";
        }

        get expanded() {
            return this.screen.classList.contains("is-expanded");
        }

        setExpanded(on) {
            if (on === this.expanded) return;
            if (on && expandedScreen && expandedScreen !== this) expandedScreen.setExpanded(false);
            // Sabitlenen ekran akıştan çıkınca sayfa kaymasın diye yer tutucu bırak.
            this.panel.style.minHeight = on ? `${this.screen.offsetHeight}px` : "";
            this.screen.classList.toggle("is-expanded", on);
            document.body.classList.toggle("game-open", on);
            expandedScreen = on ? this : null;
            this.relabelButtons();
            requestAnimationFrame(() => this.layout());
        }

        layout() {
            const cw = this.screen.clientWidth;
            const ch = this.screen.clientHeight;
            if (!cw || !ch || !this.canvas) return;
            const ratio = cw / ch;
            let w = cw;
            let h = ch;
            if (ratio > 2.2) w = ch * 2.2;
            else if (ratio < this.minRatio) h = Math.min(ch, cw / this.minRatio);
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            this.canvas.style.width = `${w}px`;
            this.canvas.style.height = `${h}px`;
            this.canvas.width = Math.round(w * dpr);
            this.canvas.height = Math.round(h * dpr);
            this.scale = h / this.H;
            this.W = w / this.scale;
            this.ctx.setTransform(dpr * this.scale, 0, 0, dpr * this.scale, 0, 0);
            this.onResize?.();
            if (!this.raf) this.draw();
        }

        toWorld(event) {
            const rect = this.canvas.getBoundingClientRect();
            return { x: (event.clientX - rect.left) / this.scale, y: (event.clientY - rect.top) / this.scale };
        }

        /* Katmanlar */
        overlay(name) {
            $$("[data-overlay]", this.screen).forEach((el) => { el.hidden = el.dataset.overlay !== name; });
            this.screen.classList.toggle("is-playing", this.state === "play");
            this.syncButtons();
        }

        announce(message) {
            if (this.live) this.live.textContent = message;
        }

        /* Döngü */
        get running() {
            return this.visible && this.inView && !document.hidden;
        }

        sync() {
            if (this.running) {
                if (!this.raf) {
                    this.last = performance.now();
                    this.raf = requestAnimationFrame(this.frame);
                }
            } else {
                cancelAnimationFrame(this.raf);
                this.raf = 0;
                if (this.state === "play") this.pause();
            }
        }

        frame(now) {
            this.raf = requestAnimationFrame(this.frame);
            const dt = Math.min((now - this.last) / 1000, 0.05);
            this.last = now;
            this.time += dt;
            this.tick(dt);
            this.draw();
        }

        enter() {
            this.visible = true;
            requestAnimationFrame(() => { this.layout(); this.sync(); });
        }

        leave() {
            if (this.state === "play") this.pause();
            this.setExpanded(false);
            this.visible = false;
            this.sync();
        }

        pause() {
            if (this.state !== "play") return;
            this.state = "pause";
            this.overlay("pause");
            $('[data-overlay="pause"] [data-action="resume"]', this.screen)?.focus({ preventScroll: true });
        }

        resume() {
            if (this.state !== "pause") return;
            this.state = "play";
            this.overlay(null);
        }

        begin() {
            if (smallScreen()) this.setExpanded(true);
        }

        resetToStart() {
            this.setExpanded(false);
            this.state = "ready";
            this.reset(0, true);
            this.overlay("start");
        }

        onAction(action) {
            switch (action) {
                case "start":
                case "replay":
                case "restart":
                case "retry":
                    this.start(action);
                    break;
                case "pause": this.pause(); break;
                case "resume": this.resume(); break;
                case "sound":
                    save.sound = save.sound ? 0 : 1;
                    persist();
                    if (save.sound) sfx.good();
                    arcade.syncSound();
                    break;
                case "expand": this.setExpanded(!this.expanded); break;
                case "next": arcade.select(this.nextGame); break;
                default: this.onGameAction?.(action);
            }
        }

        relang() {
            this.relabelButtons();
        }
    }

    /* ============================================================
       01 · Tulpar Uçuşu
       ============================================================ */

    const TOOLS = ["Python", "ROS 2", "PX4", "OpenCV", "PyTorch", "React", "FastAPI", "Docker", "C#", "TypeScript", "Gazebo", "Git"];
    const ACCENTS = ["green", "cyan", "violet", "orange", "yellow", "pink"];
    const STAGES = 6;
    const STAGE_LEN = 2300;
    const FLOOR = WORLD_H - 16;
    const BOTTOM = WORLD_H - 34;

    class Flight extends CanvasGame {
        constructor(panel) {
            super(panel);
            this.nextGame = "detect";
            this.hudEls = {
                score: $('[data-hud="score"]', panel),
                lives: $$('[data-hud="lives"] i', panel),
                tools: $('[data-hud="tools"]', panel),
                station: $('[data-hud="station"]', panel),
                bar: $('[data-hud="bar"]', panel)
            };
            this.player = { x: 120, y: WORLD_H / 2, vy: 0, target: WORLD_H / 2 };
            this.kb = { up: false, down: false };
            this.pointer = { active: false, y0: 0, p0: 0 };
            this.particles = [];
            this.stars = Array.from({ length: 56 }, () => ({ x: Math.random(), y: Math.random() * 0.85, z: 0.25 + Math.random() * 0.75, s: Math.random() * 1.3 + 0.4 }));
            this.clouds = Array.from({ length: 6 }, () => ({ x: Math.random(), y: rand(40, 250), s: rand(0.7, 1.5) }));
            this.checkpoint = { score: 0, tools: [] };
            this.reset(0, true);
            this.bindInput();
            this.overlay("start");
        }

        reset(stage, full) {
            if (full) this.checkpoint = { score: 0, tools: [] };
            this.stage = stage;
            this.dist = stage * STAGE_LEN;
            this.lives = 3;
            this.score = this.checkpoint.score;
            this.tools = new Set(this.checkpoint.tools);
            this.speed = this.baseSpeed(stage);
            this.obstacles = [];
            this.pickups = [];
            this.gate = null;
            this.nextObstacle = 260;
            this.nextPickup = 150;
            this.invuln = 0;
            this.shake = 0;
            this.trail = 0;
            this.player.y = WORLD_H / 2;
            this.player.target = WORLD_H / 2;
            this.player.vy = 0;
            this.syncHud(true);
        }

        baseSpeed(stage) {
            return 165 + stage * 14;
        }

        start() {
            this.reset(0, true);
            this.state = "play";
            this.overlay(null);
            this.begin();
            this.announce("");
            track("game_start", { game: "flight" });
            sfx.pick();
        }

        retry() {
            this.reset(this.stage, false);
            this.state = "play";
            this.invuln = 1.4;
            this.overlay(null);
        }

        onAction(action) {
            if (action === "retry") {
                this.retry();
                return;
            }
            super.onAction(action);
        }

        onGameAction(action) {
            if (action === "continue") this.continueFromStation();
            if (action === "goto") this.gotoSection();
        }

        /* Girdi */
        bindInput() {
            const el = this.screen;
            const interactive = (event) => event.target.closest("button, a, .overlay");

            el.addEventListener("pointerdown", (event) => {
                if (this.state !== "play" || interactive(event) || event.pointerType === "mouse") return;
                this.pointer = { active: true, id: event.pointerId, y0: event.clientY, p0: this.player.y };
                el.setPointerCapture?.(event.pointerId);
            });

            el.addEventListener("pointermove", (event) => {
                if (this.state !== "play") return;
                if (event.pointerType === "mouse") {
                    this.player.target = this.toWorld(event).y;
                } else if (this.pointer.active && event.pointerId === this.pointer.id) {
                    this.player.target = this.pointer.p0 + ((event.clientY - this.pointer.y0) / this.scale) * 1.2;
                }
            });

            const release = (event) => {
                if (this.pointer.active && event.pointerId === this.pointer.id) this.pointer.active = false;
            };
            el.addEventListener("pointerup", release);
            el.addEventListener("pointercancel", release);

            document.addEventListener("keydown", (event) => {
                if (!this.visible || !this.inView && !this.expanded) return;
                if (event.ctrlKey || event.metaKey || event.altKey) return;
                const key = event.key.toLowerCase();
                const typing = event.target.closest?.("input, textarea, select");
                if (typing) return;

                if (["arrowup", "w"].includes(key)) { this.kb.up = true; if (this.state === "play") event.preventDefault(); }
                if (["arrowdown", "s"].includes(key)) { this.kb.down = true; if (this.state === "play") event.preventDefault(); }
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
                const key = event.key.toLowerCase();
                if (["arrowup", "w"].includes(key)) this.kb.up = false;
                if (["arrowdown", "s"].includes(key)) this.kb.down = false;
            });

            window.addEventListener("blur", () => { this.kb.up = false; this.kb.down = false; });
        }

        /* Oyun mantığı */
        tick(dt) {
            this.updateParticles(dt);
            this.player.x = this.W * 0.2;

            if (this.state !== "play") {
                // Başlangıç ve bitiş ekranlarında dünya yavaşça akar; diğer duraklarda donar.
                if (this.state === "ready" || this.state === "end") {
                    this.dist += 55 * dt;
                    this.player.y += (WORLD_H / 2 + Math.sin(this.time * 1.6) * 26 - this.player.y) * Math.min(1, dt * 3);
                    this.player.vy = Math.cos(this.time * 1.6) * 30;
                    this.emitTrail(dt);
                }
                return;
            }

            const p = this.player;
            const ds = this.speed * dt;
            this.dist += ds;
            this.score += ds * 0.1;
            this.invuln = Math.max(0, this.invuln - dt);
            this.shake = Math.max(0, this.shake - dt * 3);

            if (this.kb.up || this.kb.down) {
                p.target += ((this.kb.down ? 1 : 0) - (this.kb.up ? 1 : 0)) * 340 * dt;
            }
            p.target = clamp(p.target, TOP, BOTTOM);
            p.vy = clamp((p.target - p.y) * 11, -440, 440);
            p.y = clamp(p.y + p.vy * dt, TOP, BOTTOM);
            this.emitTrail(dt);

            const stageEnd = (this.stage + 1) * STAGE_LEN;
            const travel = this.W + 40 - p.x;
            const calm = this.dist > stageEnd - travel - 260;

            this.nextObstacle -= ds;
            if (this.nextObstacle <= 0 && !calm) {
                this.spawnObstacle();
                this.nextObstacle = rand(190, 270) - this.stage * 9;
            }
            this.nextPickup -= ds;
            if (this.nextPickup <= 0 && !calm) {
                this.spawnPickup();
                this.nextPickup = rand(250, 380);
            }
            if (!this.gate && this.dist >= stageEnd - travel) this.gate = { x: this.W + 40 };

            this.obstacles.forEach((o) => {
                o.x -= ds;
                if (o.kind === "bird") o.y += Math.sin(this.time * 3 + o.phase) * 34 * dt;
            });
            this.obstacles = this.obstacles.filter((o) => o.x > -90);

            this.pickups.forEach((pick) => {
                pick.x -= ds;
                const dx = p.x - pick.x;
                const dy = p.y - pick.y;
                if (dx * dx + dy * dy < 70 * 70 && dx < 40) {
                    pick.x += dx * dt * 4;
                    pick.y += dy * dt * 4;
                }
            });
            this.pickups = this.pickups.filter((pick) => pick.x > -60);

            this.collide();

            if (this.gate) {
                this.gate.x -= ds;
                if (this.gate.x <= p.x) this.reachStation();
            }
            this.syncHud();
        }

        emitTrail(dt) {
            this.trail -= dt;
            if (this.trail > 0 || reduce) return;
            this.trail = 0.03;
            this.particles.push({ x: this.player.x - 17, y: this.player.y, vx: -70, vy: rand(-8, 8), life: 0.45, max: 0.45, size: 2.3, color: this.accent() });
        }

        accent() {
            return palette[ACCENTS[Math.min(this.stage, STAGES - 1)]];
        }

        spawnObstacle() {
            const stage = this.stage;
            const x = this.W + 40;
            const kinds = ["bird"];
            if (stage >= 1) kinds.push("storm");
            if (stage >= 2) kinds.push("pylon");
            const kind = kinds[Math.floor(Math.random() * kinds.length)];

            if (kind === "pylon") {
                const top = Math.random() < 0.5;
                this.obstacles.push({ kind, x, w: 26, h: rand(110, 175), top, phase: rand(0, 6) });
            } else if (kind === "storm") {
                this.obstacles.push({ kind, x, y: rand(60, WORLD_H - 80), r: 22, phase: rand(0, 6) });
            } else {
                this.obstacles.push({ kind, x, y: rand(50, WORLD_H - 70), r: 9, phase: rand(0, 6) });
                if (stage >= 3 && Math.random() < 0.45) {
                    this.obstacles.push({ kind, x: x + 70, y: clamp(this.obstacles.at(-1).y + rand(-120, 120), 50, WORLD_H - 70), r: 9, phase: rand(0, 6) });
                }
            }
        }

        spawnPickup() {
            const x = this.W + 40 + 90;
            let y = rand(50, WORLD_H - 60);
            this.obstacles.forEach((o) => {
                if (o.kind === "pylon" || Math.abs(o.x - x) > 90) return;
                if (Math.abs(o.y - y) < o.r + 34) y = o.y > WORLD_H / 2 ? o.y - 100 : o.y + 100;
            });
            y = clamp(y, 50, WORLD_H - 60);

            if (this.lives < 3 && Math.random() < 0.22) {
                this.pickups.push({ kind: "shield", x, y, phase: rand(0, 6) });
                return;
            }
            const missing = TOOLS.map((_, i) => i).filter((i) => !this.tools.has(i));
            const pool = missing.length && Math.random() < 0.85 ? missing : TOOLS.map((_, i) => i);
            this.pickups.push({ kind: "tool", tool: pool[Math.floor(Math.random() * pool.length)], x, y, phase: rand(0, 6) });
        }

        collide() {
            const p = this.player;
            const r = 8;

            this.pickups = this.pickups.filter((pick) => {
                let hit;
                if (pick.kind === "tool") {
                    const w = (this.chipWidth(TOOLS[pick.tool]) / 2) + r;
                    hit = Math.abs(pick.x - p.x) < w && Math.abs(pick.y - p.y) < 10 + r;
                } else {
                    hit = (pick.x - p.x) ** 2 + (pick.y - p.y) ** 2 < 22 * 22;
                }
                if (!hit) return true;
                if (pick.kind === "tool") {
                    this.tools.add(pick.tool);
                    this.score += 50;
                    this.burst(pick.x, pick.y, this.accent(), 10);
                    this.announce(TOOLS[pick.tool]);
                } else {
                    this.lives = Math.min(3, this.lives + 1);
                    this.burst(pick.x, pick.y, palette.green, 14);
                }
                sfx.pick();
                this.syncHud();
                return false;
            });

            if (this.invuln > 0) return;
            const crashed = this.obstacles.some((o) => {
                if (o.kind === "pylon") {
                    const x = o.x - o.w / 2;
                    const y = o.top ? 0 : FLOOR - o.h;
                    return circleRect(p.x, p.y, r - 1, x, y, o.w, o.h);
                }
                return (o.x - p.x) ** 2 + (o.y - p.y) ** 2 < (o.r + r - 2) ** 2;
            });
            if (crashed) this.hurt();
        }

        hurt() {
            this.lives -= 1;
            this.invuln = 1.5;
            this.shake = reduce ? 0 : 1;
            this.burst(this.player.x, this.player.y, palette.red, 18);
            sfx.hit();
            this.syncHud();
            if (this.lives <= 0) {
                this.state = "crash";
                this.overlay("crash");
                this.announce(t("g_crash_title"));
                $('[data-overlay="crash"] [data-action="retry"]', this.screen)?.focus({ preventScroll: true });
            }
        }

        burst(x, y, color, count) {
            if (reduce) return;
            for (let i = 0; i < count; i += 1) {
                const a = Math.random() * Math.PI * 2;
                const s = rand(40, 150);
                this.particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: rand(0.3, 0.7), max: 0.7, size: rand(1.6, 3.4), color });
            }
        }

        updateParticles(dt) {
            this.particles.forEach((q) => {
                q.life -= dt;
                q.x += q.vx * dt;
                q.y += q.vy * dt;
                q.vx *= 0.985;
                q.vy *= 0.985;
            });
            this.particles = this.particles.filter((q) => q.life > 0);
        }

        /* İstasyonlar */
        reachStation() {
            const index = this.stage;
            this.state = "station";
            this.score += 300;
            this.gate = null;
            this.pickups = [];
            this.kb.up = false;
            this.kb.down = false;
            this.pointer.active = false;
            if (!save.dossier[index]) {
                save.dossier[index] = 1;
                persist();
            }
            this.burst(this.player.x + 30, this.player.y, this.accent(), 24);
            sfx.station();
            track("flight_station", { station: index + 1 });
            this.renderStation();
            this.overlay("station");
            this.announce(`${t("g_station")} ${index + 1}/${STAGES}: ${content().stations[index].title}`);
            arcade.render();
            $('[data-overlay="station"] [data-action="continue"]', this.screen)?.focus({ preventScroll: true });
            this.syncHud(true);
        }

        renderStation() {
            const index = this.stage;
            const data = content().stations[index];
            const box = $('[data-overlay="station"]', this.screen);
            $("[data-station-kicker]", box).textContent = `${t("g_station")} ${pad(index + 1)} / ${pad(STAGES)} · ${data.code}`;
            $("[data-station-title]", box).textContent = data.title;
            $("[data-station-text]", box).textContent = data.text;
            $("[data-continue-label]", box).textContent = index === STAGES - 1 ? t("g_see_result") : t("g_continue");
        }

        continueFromStation() {
            if (this.state !== "station") return;
            if (this.stage === STAGES - 1) {
                this.finish();
                return;
            }
            this.stage += 1;
            this.checkpoint = { score: this.score, tools: [...this.tools] };
            this.speed = this.baseSpeed(this.stage);
            this.obstacles = [];
            this.nextObstacle = 200;
            this.nextPickup = 120;
            this.invuln = 1.2;
            this.state = "play";
            this.overlay(null);
            this.syncHud(true);
        }

        gotoSection() {
            const section = document.getElementById(content().stations[this.stage].section);
            this.setExpanded(false);
            section?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        }

        finish() {
            const bonus = this.lives * 200;
            this.score += bonus;
            const total = Math.floor(this.score);
            const record = total > save.best.flight;
            if (record) save.best.flight = total;
            save.badges.pilot = 1;
            persist();
            this.state = "end";
            this.endItems = [
                ["g_stat_score", total, true],
                ["g_stat_best", save.best.flight, record],
                ["g_stat_tools", `${this.tools.size}/${TOOLS.length}`, this.tools.size === TOOLS.length],
                ["g_stat_bonus", `+${bonus}`, bonus > 0]
            ];
            this.renderEnd();
            this.overlay("end");
            this.burst(this.W / 2, WORLD_H / 2, palette.yellow, 40);
            this.burst(this.W / 2, WORLD_H / 2, palette.green, 40);
            sfx.win();
            track("game_complete", { game: "flight", score: total });
            this.announce(t("g_finish_title"));
            arcade.render();
            $('[data-overlay="end"] [data-action="next"]', this.screen)?.focus({ preventScroll: true });
            this.syncHud(true);
        }

        renderEnd() {
            renderStats($("[data-end-stats]", this.screen), this.endItems);
        }

        relang() {
            super.relang();
            if (this.state === "station") this.renderStation();
            if (this.state === "end") this.renderEnd();
            this.syncHud(true);
        }

        /* HUD */
        syncHud(force) {
            const h = this.hudEls;
            const score = Math.floor(this.score);
            if (force || score !== this._score) { h.score.textContent = score; this._score = score; }
            if (force || this.lives !== this._lives) {
                h.lives.forEach((pip, i) => pip.classList.toggle("on", i < this.lives));
                this._lives = this.lives;
            }
            const tools = `${this.tools.size}/${TOOLS.length}`;
            if (force || tools !== this._tools) { h.tools.textContent = tools; this._tools = tools; }
            const station = `${Math.min(this.stage + 1, STAGES)}/${STAGES}`;
            if (force || station !== this._station) { h.station.textContent = station; this._station = station; }
            const progress = clamp(this.dist / (STAGES * STAGE_LEN), 0, 1);
            const bar = this.state === "end" ? 100 : this.state === "ready" ? 0 : Math.round(progress * 1000) / 10;
            if (force || bar !== this._bar) { h.bar.style.width = `${bar}%`; this._bar = bar; }
        }

        /* Çizim */
        chipWidth(label) {
            this.ctx.font = '700 11px "Space Grotesk", system-ui, sans-serif';
            return this.ctx.measureText(label).width + 20;
        }

        draw() {
            const ctx = this.ctx;
            const { W, dist } = this;
            const H = WORLD_H;
            const accent = this.accent();
            const text = palette.text;

            ctx.save();
            if (this.shake > 0) ctx.translate(rand(-1, 1) * this.shake * 5, rand(-1, 1) * this.shake * 5);

            ctx.fillStyle = palette.bg;
            ctx.fillRect(-10, -10, W + 20, H + 20);
            const sky = ctx.createLinearGradient(0, 0, 0, H);
            sky.addColorStop(0, rgba(accent, 0));
            sky.addColorStop(1, rgba(accent, 0.2));
            ctx.fillStyle = sky;
            ctx.fillRect(-10, -10, W + 20, H + 20);

            // Yıldızlar
            this.stars.forEach((s) => {
                const x = wrap(s.x * W - dist * 0.05 * s.z, W);
                ctx.globalAlpha = 0.25 + 0.5 * Math.abs(Math.sin(this.time * 1.3 * s.z + s.x * 40));
                ctx.fillStyle = text;
                ctx.fillRect(x, s.y * H, s.s, s.s);
            });
            ctx.globalAlpha = 1;

            // Bulutlar
            this.clouds.forEach((c) => {
                const x = wrap(c.x * (W + 200) - dist * 0.18 * c.s, W + 200) - 100;
                ctx.fillStyle = rgba(text, 0.05);
                ctx.beginPath();
                ctx.ellipse(x, c.y, 48 * c.s, 11 * c.s, 0, 0, Math.PI * 2);
                ctx.ellipse(x + 24 * c.s, c.y - 7 * c.s, 30 * c.s, 10 * c.s, 0, 0, Math.PI * 2);
                ctx.fill();
            });

            // Dağ katmanları
            this.drawRidge(ctx, W, H - 38, 70, 0.007, 0.32, rgba(accent, 0.1));
            this.drawRidge(ctx, W, H - 22, 44, 0.012, 0.6, rgba(accent, 0.17));

            // Zemin
            ctx.strokeStyle = rgba(accent, 0.55);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, FLOOR);
            ctx.lineTo(W, FLOOR);
            ctx.stroke();
            ctx.strokeStyle = rgba(accent, 0.3);
            for (let x = -wrap(dist, 48); x < W; x += 48) {
                ctx.beginPath();
                ctx.moveTo(x, FLOOR);
                ctx.lineTo(x - 10, H);
                ctx.stroke();
            }

            // Hız çizgileri
            if (!reduce && this.state === "play") {
                ctx.strokeStyle = rgba(text, 0.12);
                for (let i = 0; i < 7; i += 1) {
                    const x = wrap(i * 173 - dist * 1.8, W + 60) - 30;
                    const y = (i * 71 + 23) % (FLOOR - 20);
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + 26, y);
                    ctx.stroke();
                }
            }

            // Kapı
            if (this.gate) this.drawGate(ctx, accent);

            this.obstacles.forEach((o) => this.drawObstacle(ctx, o));
            this.pickups.forEach((pick) => this.drawPickup(ctx, pick, accent));

            // Parçacıklar
            this.particles.forEach((q) => {
                ctx.globalAlpha = clamp(q.life / q.max, 0, 1);
                ctx.fillStyle = q.color;
                ctx.beginPath();
                ctx.arc(q.x, q.y, q.size, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1;

            // İHA
            const p = this.player;
            if (this.state !== "crash") {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(clamp(p.vy / 900, -0.35, 0.35));
                if (this.invuln > 0 && Math.floor(this.time * 14) % 2 === 0) ctx.globalAlpha = 0.35;
                ctx.shadowColor = accent;
                ctx.shadowBlur = 14;
                drawPlane(ctx, text, accent);
                ctx.restore();
            }

            ctx.restore();
        }

        drawRidge(ctx, W, base, amp, freq, speed, color) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(-2, WORLD_H + 2);
            for (let x = -2; x <= W + 12; x += 12) {
                const u = x + this.dist * speed;
                const y = base - amp * (0.5 + 0.5 * Math.sin(u * freq) * Math.sin(u * freq * 0.41 + 1.3));
                ctx.lineTo(x, y);
            }
            ctx.lineTo(W + 12, WORLD_H + 2);
            ctx.closePath();
            ctx.fill();
        }

        drawGate(ctx, accent) {
            const { x } = this.gate;
            const pulse = Math.sin(this.time * 5) * 3;
            ctx.save();
            ctx.setLineDash([6, 8]);
            ctx.strokeStyle = rgba(accent, 0.55);
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, WORLD_H);
            ctx.stroke();
            ctx.setLineDash([]);
            for (let i = 0; i < 3; i += 1) {
                ctx.strokeStyle = rgba(accent, 0.6 - i * 0.17);
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.ellipse(x, WORLD_H / 2, 9 + i * 6 + pulse, 138 - i * 20, 0, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.fillStyle = accent;
            ctx.font = '700 12px monospace';
            ctx.textAlign = "center";
            ctx.fillText(`ST ${pad(this.stage + 1)}`, x, 22);
            ctx.restore();
        }

        drawObstacle(ctx, o) {
            ctx.save();
            if (o.kind === "bird") {
                ctx.translate(o.x, o.y);
                drawBird(ctx, Math.sin(this.time * 14 + o.phase), palette.orange);
            } else if (o.kind === "storm") {
                ctx.translate(o.x, o.y);
                ctx.fillStyle = rgba(palette.violet, 0.34);
                ctx.strokeStyle = rgba(palette.violet, 0.85);
                ctx.lineWidth = 1.5;
                [[-11, 5, 15], [9, 1, 17], [0, -8, 14], [19, 7, 11]].forEach(([cx, cy, r]) => {
                    ctx.beginPath();
                    ctx.arc(cx, cy, r, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                });
                if (Math.sin(this.time * 9 + o.phase) > 0.78) {
                    ctx.strokeStyle = palette.yellow;
                    ctx.lineWidth = 2.2;
                    ctx.beginPath();
                    ctx.moveTo(2, -6);
                    ctx.lineTo(-4, 6);
                    ctx.lineTo(3, 6);
                    ctx.lineTo(-2, 18);
                    ctx.stroke();
                }
            } else {
                const x = o.x - o.w / 2;
                const y = o.top ? 0 : FLOOR - o.h;
                ctx.fillStyle = rgba(palette.red, 0.28);
                ctx.strokeStyle = palette.red;
                ctx.lineWidth = 1.6;
                ctx.beginPath();
                roundRectPath(ctx, x, y, o.w, o.h, 5);
                ctx.fill();
                ctx.stroke();
                const tipY = o.top ? y + o.h + 6 : y - 6;
                const on = Math.sin(this.time * 6 + o.phase) > 0;
                ctx.fillStyle = on ? palette.red : rgba(palette.red, 0.3);
                ctx.beginPath();
                ctx.arc(o.x, tipY, 3.5, 0, Math.PI * 2);
                ctx.fill();
                for (let i = 1; i <= 2; i += 1) {
                    ctx.strokeStyle = rgba(palette.red, 0.5 - i * 0.16 + (on ? 0.12 : 0));
                    ctx.beginPath();
                    ctx.arc(o.x, tipY, 8 + i * 7, o.top ? 0.35 * Math.PI : 1.15 * Math.PI, o.top ? 0.65 * Math.PI : 1.85 * Math.PI);
                    ctx.stroke();
                }
            }
            ctx.restore();
        }

        drawPickup(ctx, pick, accent) {
            const bob = Math.sin(this.time * 3 + pick.phase) * 3;
            ctx.save();
            ctx.translate(pick.x, pick.y + bob);
            if (pick.kind === "tool") {
                const label = TOOLS[pick.tool];
                const w = this.chipWidth(label);
                ctx.shadowColor = accent;
                ctx.shadowBlur = 12;
                ctx.fillStyle = rgba(accent, 0.24);
                ctx.strokeStyle = accent;
                ctx.lineWidth = 1.3;
                ctx.beginPath();
                roundRectPath(ctx, -w / 2, -10, w, 20, 10);
                ctx.fill();
                ctx.stroke();
                ctx.shadowBlur = 0;
                ctx.fillStyle = palette.text;
                ctx.font = '700 11px "Space Grotesk", system-ui, sans-serif';
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(label, 0, 1);
            } else {
                ctx.shadowColor = palette.green;
                ctx.shadowBlur = 14;
                ctx.fillStyle = rgba(palette.green, 0.25);
                ctx.strokeStyle = palette.green;
                ctx.lineWidth = 1.6;
                ctx.beginPath();
                ctx.arc(0, 0, 12, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.shadowBlur = 0;
                ctx.beginPath();
                ctx.moveTo(-5, 0); ctx.lineTo(5, 0);
                ctx.moveTo(0, -5); ctx.lineTo(0, 5);
                ctx.stroke();
            }
            ctx.restore();
        }
    }

    /* ============================================================
       02 · Tespit
       ============================================================ */

    const DETECT_TIME = 30;

    class Detect extends CanvasGame {
        constructor(panel) {
            super(panel);
            this.nextGame = "quiz";
            this.minRatio = 0.75;
            this.hudEls = {
                time: $('[data-hud="time"]', panel),
                score: $('[data-hud="score"]', panel),
                combo: $('[data-hud="combo"]', panel),
                bar: $('[data-hud="bar"]', panel)
            };
            this.marks = [];
            this.reset();
            this.screen.addEventListener("pointerdown", (event) => {
                if (this.state !== "play" || event.target.closest("button, a, .overlay")) return;
                this.tap(this.toWorld(event), event.pointerType);
            });
            document.addEventListener("keydown", (event) => {
                if (!this.visible || event.target.closest?.("input, textarea, select")) return;
                const key = event.key.toLowerCase();
                if (key === "p" && !event.repeat && (this.inView || this.expanded)) { this.state === "play" ? this.pause() : this.resume(); }
                if (key === "escape" && this.expanded) {
                    if (this.state === "play") this.pause(); else this.setExpanded(false);
                }
            });
            this.overlay("start");
            this.drawLegend();
        }

        reset() {
            this.objects = [];
            this.marks = [];
            this.elapsed = 0;
            this.spawnTimer = 0.3;
            this.firstUav = true;
            this.score = 0;
            this.combo = 0;
            this.tp = 0;
            this.fp = 0;
            this.fn = 0;
            this.flash = 0;
            this.syncHud(true);
        }

        start() {
            this.reset();
            this.state = "play";
            this.overlay(null);
            this.begin();
            this.announce("");
            track("game_start", { game: "detect" });
            sfx.pick();
        }

        spawn() {
            const fromLeft = Math.random() < 0.5;
            const pace = 1 + (this.elapsed / DETECT_TIME) * 0.7;
            let kind = Math.random();
            kind = this.firstUav ? "uav" : kind < 0.5 ? "uav" : kind < 0.78 ? "bird" : "balloon";
            this.firstUav = false;
            const base = kind === "balloon" ? 38 : kind === "bird" ? 85 : 80;
            this.objects.push({
                kind,
                x: fromLeft ? -30 : this.W + 30,
                y: rand(58, WORLD_H - 40),
                vx: (fromLeft ? 1 : -1) * (base + rand(0, 55)) * pace * clamp(this.W / 560, 0.55, 1),
                amp: rand(6, 26),
                freq: rand(1, 2.4),
                phase: rand(0, 6),
                y0: 0,
                r: kind === "uav" ? 17 : kind === "bird" ? 13 : 14,
                done: false
            });
            const last = this.objects.at(-1);
            last.y0 = last.y;
        }

        tick(dt) {
            this.marks.forEach((m) => { m.life -= dt; });
            this.marks = this.marks.filter((m) => m.life > 0);
            this.flash = Math.max(0, this.flash - dt * 3);

            if (this.state !== "play") {
                if (this.state === "ready" || this.state === "end") {
                    this.spawnTimer -= dt;
                    if (this.spawnTimer <= 0 && this.objects.length < 5) {
                        this.spawn();
                        this.spawnTimer = 1.1;
                    }
                    this.objects.forEach((o) => {
                        o.x += o.vx * dt * 0.6;
                        o.y = o.y0 + Math.sin(this.time * o.freq + o.phase) * o.amp;
                    });
                    this.objects = this.objects.filter((o) => o.x > -60 && o.x < this.W + 60);
                }
                return;
            }

            this.elapsed += dt;
            if (this.elapsed >= DETECT_TIME) {
                this.finish();
                return;
            }

            this.spawnTimer -= dt;
            if (this.spawnTimer <= 0 && this.objects.length < 9) {
                this.spawn();
                this.spawnTimer = 0.9 - (this.elapsed / DETECT_TIME) * 0.4 + rand(-0.1, 0.15);
            }

            this.objects.forEach((o) => {
                o.x += o.vx * dt;
                o.y = o.y0 + Math.sin(this.time * o.freq + o.phase) * o.amp;
            });

            this.objects = this.objects.filter((o) => {
                const gone = o.x < -50 || o.x > this.W + 50;
                if (gone && o.kind === "uav" && !o.done) {
                    this.fn += 1;
                    this.combo = 0;
                }
                return !gone;
            });
            this.syncHud();
        }

        tap(point, pointerType) {
            const tolerance = (pointerType === "mouse" ? 8 : 20) / this.scale;
            let best = null;
            let bestDistance = Infinity;
            this.objects.forEach((o) => {
                if (o.done) return;
                const d = Math.hypot(o.x - point.x, o.y - point.y);
                if (d <= o.r + tolerance && d < bestDistance) { best = o; bestDistance = d; }
            });
            if (!best) return;
            best.done = true;
            const box = best.r + 8;
            if (best.kind === "uav") {
                this.tp += 1;
                this.combo += 1;
                this.score += 10 + Math.min(this.combo, 5) * 2;
                this.marks.push({ x: best.x, y: best.y, w: box * 2.2, h: box * 1.7, life: 0.7, ok: true, label: `uav ${(0.86 + Math.random() * 0.13).toFixed(2)}` });
                sfx.good();
            } else {
                this.fp += 1;
                this.combo = 0;
                this.score = Math.max(0, this.score - 5);
                this.flash = 1;
                this.marks.push({ x: best.x, y: best.y, w: box * 2, h: box * 2, life: 0.7, ok: false, label: `${best.kind} ✕` });
                sfx.bad();
            }
            this.objects = this.objects.filter((o) => o !== best);
            this.syncHud();
        }

        finish() {
            this.state = "end";
            const tp = this.tp;
            const precision = tp + this.fp ? tp / (tp + this.fp) : 0;
            const recall = tp + this.fn ? tp / (tp + this.fn) : 0;
            const f1 = precision + recall ? (2 * precision * recall) / (precision + recall) : 0;
            const win = f1 >= 0.8 && tp >= 12;
            const total = Math.round(this.score);
            const record = total > save.best.detect;
            if (record) save.best.detect = total;
            if (win) save.badges.scout = 1;
            persist();
            const pct = (v) => `${Math.round(v * 100)}%`;
            this.endItems = [
                ["g_stat_score", total, record],
                ["g_tp", tp, tp >= 12],
                ["g_fp", this.fp, false],
                ["g_fn", this.fn, false],
                ["g_precision", pct(precision), precision >= 0.8],
                ["g_recall", pct(recall), recall >= 0.8],
                ["g_f1", pct(f1), win]
            ];
            this.win = win;
            this.renderEnd();
            this.overlay("end");
            if (win) sfx.win(); else sfx.station();
            track("game_complete", { game: "detect", score: total, f1: Math.round(f1 * 100) });
            this.announce(t("g_detect_end_title"));
            arcade.render();
            $('[data-overlay="end"] [data-action="replay"]', this.screen)?.focus({ preventScroll: true });
        }

        renderEnd() {
            renderStats($("[data-end-stats]", this.screen), this.endItems);
            $("[data-end-text]", this.screen).textContent = this.win ? t("g_detect_win") : t("g_detect_hint");
        }

        syncHud(force) {
            const h = this.hudEls;
            const time = String(Math.max(0, Math.ceil(DETECT_TIME - this.elapsed)));
            if (force || time !== this._time) { h.time.textContent = time; this._time = time; }
            const score = String(Math.round(this.score));
            if (force || score !== this._score) { h.score.textContent = score; this._score = score; }
            const combo = `x${this.combo}`;
            if (force || combo !== this._combo) { h.combo.textContent = combo; this._combo = combo; }
            const bar = Math.round((this.elapsed / DETECT_TIME) * 1000) / 10;
            if (force || bar !== this._bar) { h.bar.style.width = `${bar}%`; this._bar = bar; }
        }

        relang() {
            super.relang();
            if (this.state === "end") this.renderEnd();
        }

        drawLegend() {
            $$("[data-legend]", this.panel).forEach((canvas) => {
                const ctx = canvas.getContext("2d");
                const ratio = Math.min(window.devicePixelRatio || 1, 2);
                canvas.width = 44 * ratio;
                canvas.height = 44 * ratio;
                ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
                ctx.translate(22, 22);
                const kind = canvas.dataset.legend;
                if (kind === "uav") { ctx.scale(0.85, 0.85); drawPlane(ctx, palette.text, palette.green); }
                if (kind === "bird") drawBird(ctx, 0.4, palette.orange);
                if (kind === "balloon") { ctx.translate(0, -3); drawBalloon(ctx, 0, palette.pink); }
            });
        }

        draw() {
            const ctx = this.ctx;
            const { W } = this;
            const H = WORLD_H;
            const green = palette.green;

            ctx.fillStyle = palette.bg;
            ctx.fillRect(0, 0, W, H);

            // Izgara
            ctx.strokeStyle = rgba(green, 0.07);
            ctx.lineWidth = 1;
            for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
            for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

            // Tarama çizgisi
            const scan = wrap(this.time * 70, H + 80) - 40;
            const g = ctx.createLinearGradient(0, scan - 30, 0, scan);
            g.addColorStop(0, rgba(green, 0));
            g.addColorStop(1, rgba(green, 0.14));
            ctx.fillStyle = g;
            ctx.fillRect(0, scan - 30, W, 30);

            // Hedefler
            this.objects.forEach((o) => {
                ctx.save();
                ctx.translate(o.x, o.y);
                if (o.kind === "uav") {
                    if (o.vx < 0) ctx.scale(-1, 1);
                    ctx.rotate(Math.cos(this.time * o.freq + o.phase) * 0.12);
                    ctx.shadowColor = palette.cyan;
                    ctx.shadowBlur = 8;
                    drawPlane(ctx, palette.text, palette.cyan);
                } else if (o.kind === "bird") {
                    if (o.vx < 0) ctx.scale(-1, 1);
                    drawBird(ctx, Math.sin(this.time * 13 + o.phase), palette.orange);
                } else {
                    drawBalloon(ctx, this.time + o.phase, palette.pink);
                }
                ctx.restore();
            });

            // Sınırlayıcı kutular
            this.marks.forEach((m) => {
                const color = m.ok ? green : palette.red;
                const a = clamp(m.life / 0.7, 0, 1);
                const x = m.x - m.w / 2;
                const y = m.y - m.h / 2;
                const c = 7;
                ctx.globalAlpha = a;
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x, y + c); ctx.lineTo(x, y); ctx.lineTo(x + c, y);
                ctx.moveTo(x + m.w - c, y); ctx.lineTo(x + m.w, y); ctx.lineTo(x + m.w, y + c);
                ctx.moveTo(x + m.w, y + m.h - c); ctx.lineTo(x + m.w, y + m.h); ctx.lineTo(x + m.w - c, y + m.h);
                ctx.moveTo(x + c, y + m.h); ctx.lineTo(x, y + m.h); ctx.lineTo(x, y + m.h - c);
                ctx.stroke();
                ctx.fillStyle = rgba(color, 0.12);
                ctx.fillRect(x, y, m.w, m.h);
                ctx.font = '700 10px monospace';
                const lw = ctx.measureText(m.label).width + 8;
                ctx.fillStyle = color;
                ctx.fillRect(x, y - 14, lw, 14);
                ctx.fillStyle = palette.bg;
                ctx.textBaseline = "middle";
                ctx.fillText(m.label, x + 4, y - 6.5);
                ctx.globalAlpha = 1;
            });

            // Köşe işaretleri ve kamera künyesi
            ctx.strokeStyle = rgba(palette.text, 0.35);
            ctx.lineWidth = 1.5;
            const inset = 10;
            const arm = 16;
            [[inset, H - inset, 1, -1], [W - inset, H - inset, -1, -1]].forEach(([cx, cy, sx, sy]) => {
                ctx.beginPath();
                ctx.moveTo(cx, cy + arm * sy); ctx.lineTo(cx, cy); ctx.lineTo(cx + arm * sx, cy);
                ctx.stroke();
            });
            ctx.fillStyle = rgba(palette.text, 0.45);
            ctx.font = '10px monospace';
            ctx.textBaseline = "alphabetic";
            ctx.textAlign = "left";
            ctx.fillText("CAM-01 · RT-DETR · 30 FPS", 20, H - 18);
            if (Math.floor(this.time * 1.6) % 2 === 0) {
                ctx.fillStyle = palette.red;
                ctx.beginPath();
                ctx.arc(W - 62, H - 21, 3.2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.fillStyle = rgba(palette.text, 0.45);
            ctx.textAlign = "right";
            ctx.fillText("REC", W - 20, H - 18);
            ctx.textAlign = "left";

            if (this.flash > 0) {
                ctx.fillStyle = rgba(palette.red, this.flash * 0.22);
                ctx.fillRect(0, 0, W, H);
            }
        }
    }

    /* ============================================================
       03 · Quiz
       ============================================================ */

    class Quiz {
        constructor(panel) {
            this.panel = panel;
            this.screen = $(".game-screen", panel);
            this.startCard = $("[data-quiz-start]", panel);
            this.askCard = $("[data-quiz-ask]", panel);
            this.endCard = $("[data-quiz-end]", panel);
            this.nextGame = "flight";
            this.visible = false;
            this.state = "ready";
            this.nextButton = $("[data-quiz-next]", panel);

            $$("[data-action]", panel).forEach((button) => {
                button.addEventListener("click", () => {
                    const action = button.dataset.action;
                    if (action === "start" || action === "replay") this.start();
                    if (action === "next") this.advance();
                });
            });

            document.addEventListener("keydown", (event) => {
                if (!this.visible || this.state !== "ask" || event.ctrlKey || event.metaKey || event.altKey) return;
                if (["1", "2", "3"].includes(event.key) && this.answered === null) this.answer(Number(event.key) - 1);
                if ((event.key === "Enter" || event.key === " ") && this.answered !== null && event.target === document.body) {
                    event.preventDefault();
                    this.advance();
                }
            });
        }

        enter() { this.visible = true; }
        leave() { this.visible = false; }

        resetToStart() {
            this.state = "ready";
            this.askCard.hidden = true;
            this.endCard.hidden = true;
            this.startCard.hidden = false;
        }
        relang() { if (this.state === "ask") this.renderQuestion(); if (this.state === "end") this.renderEnd(); }

        start() {
            const total = content().quiz.length;
            this.order = shuffle([...Array(total).keys()]);
            this.optionOrders = this.order.map(() => shuffle([0, 1, 2]));
            this.index = 0;
            this.results = [];
            this.answered = null;
            this.state = "ask";
            this.startCard.hidden = true;
            this.endCard.hidden = true;
            this.askCard.hidden = false;
            track("game_start", { game: "quiz" });
            sfx.pick();
            this.renderQuestion();
        }

        renderQuestion() {
            const question = content().quiz[this.order[this.index]];
            const optionOrder = this.optionOrders[this.index];
            const total = this.order.length;
            $("[data-quiz-count]", this.panel).textContent = `${t("g_question")} ${pad(this.index + 1)} / ${pad(total)}`;
            $("[data-quiz-score]", this.panel).textContent = `${this.results.filter(Boolean).length} ${t("g_stat_correct").toLowerCase()}`;
            $("[data-quiz-question]", this.panel).textContent = question.q;
            $("[data-quiz-dots]", this.panel).innerHTML = this.order
                .map((_, i) => `<i class="${i < this.results.length ? (this.results[i] ? "ok" : "no") : i === this.index ? "now" : ""}"></i>`)
                .join("");

            const holder = $("[data-quiz-options]", this.panel);
            holder.innerHTML = "";
            optionOrder.forEach((original, position) => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "quiz-option";
                button.innerHTML = `<kbd>${position + 1}</kbd><span></span>`;
                button.lastChild.textContent = question.a[original];
                button.addEventListener("click", () => this.answer(position));
                holder.append(button);
            });

            const feedback = $("[data-quiz-feedback]", this.panel);
            feedback.className = "quiz-feedback";
            feedback.textContent = "";
            this.nextButton.hidden = true;

            if (this.answered !== null) this.paintAnswer();
        }

        answer(position) {
            if (this.answered !== null) return;
            this.answered = position;
            const right = this.optionOrders[this.index][position] === 0;
            this.results.push(right);
            right ? sfx.good() : sfx.bad();
            this.paintAnswer();
            this.nextButton.focus({ preventScroll: true });
        }

        paintAnswer() {
            const question = content().quiz[this.order[this.index]];
            const optionOrder = this.optionOrders[this.index];
            const right = optionOrder[this.answered] === 0;
            $$(".quiz-option", this.panel).forEach((button, position) => {
                button.disabled = true;
                const isRight = optionOrder[position] === 0;
                button.classList.toggle("is-right", isRight);
                button.classList.toggle("is-wrong", position === this.answered && !isRight);
                button.classList.toggle("is-dim", !isRight && position !== this.answered);
            });
            const feedback = $("[data-quiz-feedback]", this.panel);
            feedback.className = `quiz-feedback ${right ? "is-right" : "is-wrong"}`;
            feedback.innerHTML = `<strong></strong><span></span>`;
            feedback.firstChild.textContent = right ? t("g_correct") : t("g_wrong");
            feedback.lastChild.textContent = question.why;
            $("[data-quiz-score]", this.panel).textContent = `${this.results.filter(Boolean).length} ${t("g_stat_correct").toLowerCase()}`;
            $("[data-quiz-dots]", this.panel).innerHTML = this.order
                .map((_, i) => `<i class="${i < this.results.length ? (this.results[i] ? "ok" : "no") : i === this.index ? "now" : ""}"></i>`)
                .join("");
            const last = this.index === this.order.length - 1;
            $("[data-quiz-next-label]", this.panel).textContent = last ? t("g_quiz_result") : t("g_next");
            this.nextButton.hidden = false;
        }

        advance() {
            if (this.answered === null) return;
            if (this.index === this.order.length - 1) {
                this.finish();
                return;
            }
            this.index += 1;
            this.answered = null;
            this.renderQuestion();
        }

        finish() {
            this.state = "end";
            const correct = this.results.filter(Boolean).length;
            this.correct = correct;
            const record = correct > save.best.quiz;
            if (record) save.best.quiz = correct;
            const win = correct >= 7;
            if (win) save.badges.expert = 1;
            persist();
            this.askCard.hidden = true;
            this.endCard.hidden = false;
            this.renderEnd();
            if (win) sfx.win(); else sfx.station();
            track("game_complete", { game: "quiz", score: correct });
            arcade.render();
        }

        renderEnd() {
            const total = this.order.length;
            const tier = this.correct >= 7 ? 2 : this.correct >= 4 ? 1 : 0;
            $("[data-quiz-end-kicker]", this.panel).textContent = t("g_quiz_end_kicker");
            $("[data-quiz-end-title]", this.panel).textContent = t(`g_quiz_t${tier}`);
            $("[data-quiz-end-text]", this.panel).textContent = t(`g_quiz_t${tier}_d`);
            renderStats($("[data-end-stats]", this.panel), [
                ["g_stat_score", `${this.correct}/${total}`, this.correct >= 7],
                ["g_stat_best", `${save.best.quiz}/${total}`, this.correct >= save.best.quiz],
                ["g_stat_correct", this.correct, false],
                ["g_stat_wrong", total - this.correct, false]
            ]);
        }
    }

    function renderStats(list, items) {
        list.innerHTML = "";
        items.forEach(([key, value, good]) => {
            const row = document.createElement("div");
            if (good) row.className = "is-good";
            const dt = document.createElement("dt");
            const dd = document.createElement("dd");
            dt.textContent = t(key);
            dd.textContent = value;
            row.append(dt, dd);
            list.append(row);
        });
    }

    /* ============================================================
       Oyun alanı (sekmeler, ilerleme, profil dosyası, rozetler)
       ============================================================ */

    const arcade = {
        games: {},
        current: "flight",

        init() {
            this.games.flight = new Flight($("#panel-flight"));
            this.games.detect = new Detect($("#panel-detect"));
            this.games.quiz = new Quiz($("#panel-quiz"));

            const tabs = $$(".arcade-tab");
            tabs.forEach((tab, index) => {
                tab.addEventListener("click", () => this.select(tab.dataset.game));
                tab.addEventListener("keydown", (event) => {
                    const move = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
                    if (!move) return;
                    event.preventDefault();
                    const next = tabs[(index + move + tabs.length) % tabs.length];
                    next.focus();
                    this.select(next.dataset.game);
                });
            });

            $("[data-reset]").addEventListener("click", () => {
                if (!window.confirm(t("g_confirm_reset"))) return;
                const sound = save.sound;
                save = defaults();
                save.sound = sound;
                persist();
                this.render();
                Object.values(this.games).forEach((game) => game.resetToStart());
            });

            document.addEventListener("languagechange", () => this.relang());
            this.select("flight", true);
            this.syncSound();
            this.render();
            this.relang();
        },

        select(name, silent) {
            if (!this.games[name]) return;
            if (name !== this.current || silent) {
                this.games[this.current]?.leave();
            }
            this.current = name;
            $$(".arcade-tab").forEach((tab) => {
                const active = tab.dataset.game === name;
                tab.setAttribute("aria-selected", String(active));
                tab.tabIndex = active ? 0 : -1;
            });
            $$("[data-panel]").forEach((panel) => { panel.hidden = panel.dataset.panel !== name; });
            this.games[name].enter();
            if (!silent) {
                const tabs = $(".arcade-tabs");
                const rect = tabs.getBoundingClientRect();
                if (rect.top < 80 || rect.top > window.innerHeight * 0.6) {
                    tabs.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
                }
            }
        },

        syncSound() {
            Object.values(this.games).forEach((game) => game.syncButtons?.());
        },

        relang() {
            Object.values(this.games).forEach((game) => game.relang?.());
            this.render();
        },

        render() {
            const stations = content().stations;
            const unlocked = save.dossier.filter(Boolean).length;

            $("[data-dossier]").innerHTML = stations.map((station, i) => {
                const no = `<span class="slot-no">${pad(i + 1)}</span>`;
                if (!save.dossier[i]) {
                    return `<li class="dossier-slot"><div class="slot-row">${no}<span class="slot-code">${t("g_locked")}</span><span class="slot-title">· · ·</span></div></li>`;
                }
                return `<li class="dossier-slot is-open"><details><summary class="slot-row">${no}<span class="slot-code">${station.code}</span><span class="slot-title">${station.title}</span></summary><p>${station.text}</p></details></li>`;
            }).join("");
            $("[data-dossier-count]").textContent = `${unlocked}/${STAGES}`;

            const defs = [
                ["pilot", "◈", "g_badge_pilot", "g_badge_pilot_d"],
                ["scout", "◎", "g_badge_scout", "g_badge_scout_d"],
                ["expert", "★", "g_badge_expert", "g_badge_expert_d"]
            ];
            const earned = defs.filter(([id]) => save.badges[id]).length;
            $("[data-badges]").innerHTML = defs.map(([id, icon, name, desc]) =>
                `<li class="badge${save.badges[id] ? " is-earned" : ""}"><span class="badge-icon" aria-hidden="true">${icon}</span><div><b>${t(name)}</b><small>${t(desc)}</small></div></li>`
            ).join("");
            $("[data-badge-count]").textContent = `${earned}/${defs.length}`;

            const done = unlocked + earned;
            const total = STAGES + defs.length;
            const percent = Math.round((done / total) * 100);
            $("[data-progress-ring]").style.setProperty("--p", `${percent}%`);
            $("[data-progress-value]").textContent = `${percent}%`;
            const copy = $("[data-progress-copy]");
            const complete = done === total;
            $("[data-progress-card]").classList.toggle("is-complete", complete);
            copy.textContent = complete ? t("g_progress_done") : done ? t("g_progress_mid") : t("g_progress_start");
            if (complete) {
                const link = document.createElement("a");
                link.href = "#contact";
                link.textContent = `${t("g_contact")} →`;
                copy.append(document.createElement("br"), link);
            }

            const done1 = Boolean(save.badges.pilot);
            const done2 = Boolean(save.badges.scout);
            const done3 = Boolean(save.badges.expert);
            $('.arcade-tab[data-game="flight"]').classList.toggle("is-done", done1);
            $('.arcade-tab[data-game="detect"]').classList.toggle("is-done", done2);
            $('.arcade-tab[data-game="quiz"]').classList.toggle("is-done", done3);
        }
    };

    arcade.init();
    applyLanguage(currentLanguage);
})();
