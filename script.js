document.documentElement.classList.add("js");

const translations = {
    tr: {
        document_title: "Yusuf Sait Sakoğlu | Bilgisayar Mühendisliği",
        meta_description: "Yusuf Sait Sakoğlu — bilgisayar mühendisliği, yapay zekâ, bilgisayarlı görü ve otonom sistemler portfolyosu.",
        skip: "İçeriğe geç",
        menu: "Menüyü aç",
        nav_about: "Hakkımda",
        nav_experience: "Deneyim",
        nav_projects: "Çalışmalar",
        nav_contact: "İletişim",
        hero_eyebrow: "Bilgisayar Mühendisliği · Abdullah Gül Üniversitesi",
        hero_status: "Yeni projelere ve iş birliklerine açık",
        hero_scroll: "Keşfet",
        hero_lead: "Yapay zekâ, bilgisayarlı görü ve otonom sistemler odağında çalışan bir bilgisayar mühendisliği öğrencisiyim. Araştırma projelerinde ve ürün geliştirme süreçlerinde sade, güvenilir çözümler üretmeye odaklanıyorum.",
        hero_work: "Seçili çalışmalar",
        hero_cv: "CV'yi görüntüle",
        portrait_role: "Bilgisayar mühendisliği öğrencisi",
        portrait_location: "Kayseri, Türkiye",
        about_label: "Kısaca",
        about_title: "Hakkımda",
        about_statement: "Çalışmalarımın merkezinde gerçek dünya problemlerini yazılım, algılama ve otonomiyle çözmek var. Akademik araştırma ile uygulamalı geliştirmeyi birlikte yürütüyor; öğrendiklerimi çalışan sistemlere dönüştürmeye çalışıyorum.",
        focus_1_title: "Otonom sistemler",
        focus_1_desc: "ROS 2, PX4 ve Gazebo ile algılama, takip ve uçuş senaryoları.",
        focus_2_title: "Bilgisayarlı görü ve yapay zekâ",
        focus_2_desc: "Gerçek zamanlı nesne tespiti, takip ve veri füzyonu.",
        focus_3_title: "Yazılım geliştirme",
        focus_3_desc: "Web, mobil ve servis katmanlarında uçtan uca ürün geliştirme.",
        metric_projects: "Seçili proje",
        metric_languages: "Dil desteği",
        experience_label: "Yolculuk",
        experience_title: "Deneyim ve eğitim",
        internship: "Staj",
        research: "Araştırma",
        team: "Takım",
        kepsas_date: "29 Haziran — 10 Ağustos",
        kepsas_role: "Stajyer",
        kepsas_desc: "Staj programı boyunca kurumun çalışma süreçlerini ve enerji sektörünün işleyişini yerinde gözlemleyerek mesleki deneyim kazandım.",
        tubitak_date: "Nisan 2025 — Nisan 2026",
        tubitak_role: "Araştırmacı · TÜBİTAK 2209-A",
        tubitak_company: "TÜBİTAK Lisans Araştırma Destek Programı",
        tubitak_desc: "GNSS ve gerçek zamanlı görüntü verisini birleştirerek sabit kanatlı İHA'ların tespit ve takibine yönelik bir sistem geliştirdim.",
        bap_date: "Ocak 2025 — Devam ediyor",
        bap_role: "Araştırmacı · BAP Projesi",
        agu: "Abdullah Gül Üniversitesi",
        bap_desc: "Yapay zekâ ve IoT destekli sabit kanatlı İHA'larla iş birlikli görevler; LoRa/GSM tabanlı haberleşme ve otonom görev akışları üzerine çalışıyorum.",
        bb_date: "Haziran 2025 — Ağustos 2025",
        bb_role: "Yazılım Stajyeri",
        bb_desc: "Bilgisayarlı görü projeleri ile C# ve ASP.NET Core MVC geliştirme süreçlerinde görev aldım.",
        tulpar_date: "Ocak 2024 — Temmuz 2025",
        tulpar_role: "Yazılım Takım Lideri · Tulpar UAV",
        tulpar_company: "AGU TEKNOFEST Savaşan İHA Takımı",
        tulpar_desc: "Nesne tespiti ve takibi, PX4–Gazebo simülasyonu ve ROS 2 tabanlı uçuş testlerinin geliştirilmesini koordine ettim.",
        education_label: "Eğitim",
        education_degree: "Bilgisayar Mühendisliği, Lisans",
        education_date: "2021 — Devam ediyor",
        projects_label: "Seçki",
        projects_title: "Çalışmalar",
        filter_all: "Tümü",
        filter_energy: "Enerji",
        filter_autonomy: "Otonomi",
        filter_ai: "Yapay zekâ",
        filter_software: "Yazılım",
        projects_visible: "proje gösteriliyor",
        project_research: "Araştırma projesi",
        project_personal: "Kişisel proje",
        project_product: "Ürün projesi",
        project_ml: "Makine öğrenmesi",
        project_prototype: "Ürün prototipi",
        project_experiment: "Deneysel çalışma",
        project_1_title: "Sabit Kanatlı İHA Takip Sistemi",
        project_1_desc: "GNSS ve görüntü işleme verilerini birleştirerek gerçek zamanlı tespit, takip ve konum tahmini yapan TÜBİTAK 2209-A projesi.",
        project_2_title: "Otonom İHA Keşif Sistemi",
        project_2_desc: "İki İHA'nın iş birlikli görev yürüttüğü; görüntü işleme, uçuş kontrolü ve düşük gecikmeli iletişimi bir araya getiren BAP çalışması.",
        project_3_title: "RT-DETR ile Nesne Tespiti ve Re-ID",
        project_3_desc: "Video analitiği için RT-DETR tabanlı gerçek zamanlı nesne tespiti ve yeniden kimliklendirme deneyi.",
        project_4_title: "Akıllı CV Sistemi",
        project_4_desc: "CV analizi, iş eşleştirme ve PDF işleme adımlarını tek akışta birleştiren yapay zekâ destekli web uygulaması.",
        project_5_title: "K2 EnerjiPro",
        project_5_desc: "Elektrik perakende satış tekliflerini, ödeme planlarını, finansmanı ve gerçekleşen sonuçları modüler hesaplama motorlarıyla bir araya getiren enerji uygulaması.",
        project_6_title: "EPİAŞ PTF Tahmin MVP",
        project_6_desc: "Piyasa Takas Fiyatı verisini işleyip XGBoost ve GPR ile 24 saatlik tahmin ve belirsizlik üreten, izleme katmanına sahip uçtan uca MVP.",
        project_7_title: "3D CHLOthes · Sanal Deneme",
        project_7_desc: "Kıyafet görsellerini işleyip 3D modele dönüştüren ve avatar üzerinde yapay zekâ destekli sanal deneme akışı sunan asenkron uygulama.",
        project_8_title: "PyTorch ile MSFT Fiyat Tahmini",
        project_8_desc: "Aynı kronolojik veri ayrımı üzerinde naive baseline, LSTM ve GRU modellerini karşılaştıran tekrarlanabilir zaman serisi deneyi.",
        view_github: "GitHub'da görüntüle",
        all_projects: "GitHub'daki tüm projeleri görüntüle",
        projects_hint: "Her proje, araştırma ile çalışan yazılım arasındaki mesafeyi kısaltan bir deney.",
        toolbox_label: "Araç kutusu",
        recognition_label: "Seçili notlar",
        recognition_title: "Programlar ve katkılar",
        recognition_1_title: "TÜBİTAK 2209-A Fon Desteği",
        recognition_1_desc: "Sabit kanatlı İHA takibi araştırma projesi.",
        recognition_2_title: "TEKNOFEST · Hepsiburada AI Hackathon",
        recognition_2_desc: "NLP ve veri ön işleme ile adres çözümleme çalışması.",
        recognition_3_title: "AI Stars · Gönüllü Eğitmen",
        recognition_3_desc: "Ortaokul ve lise öğrencilerine yapay zekâ okuryazarlığı ve Python atölyeleri.",
        contact_label: "İletişim",
        contact_title: "Birlikte çalışmak için konuşalım.",
        contact_desc: "Yeni projeler, araştırma iş birlikleri veya başlangıç seviyesi fırsatlar için benimle iletişime geçebilirsiniz.",
        back_top: "Yukarı dön",
        theme_light: "Açık temayı aç",
        theme_dark: "Koyu temayı aç"
    },
    en: {
        document_title: "Yusuf Sait Sakoğlu | Computer Engineering",
        meta_description: "Yusuf Sait Sakoğlu — computer engineering, artificial intelligence, computer vision, and autonomous systems portfolio.",
        skip: "Skip to content",
        menu: "Open menu",
        nav_about: "About",
        nav_experience: "Experience",
        nav_projects: "Work",
        nav_contact: "Contact",
        hero_eyebrow: "Computer Engineering · Abdullah Gül University",
        hero_status: "Open to new projects and collaborations",
        hero_scroll: "Explore",
        hero_lead: "I am a computer engineering student focused on artificial intelligence, computer vision, and autonomous systems. In research and product development, I aim to build clear and reliable solutions.",
        hero_work: "Selected work",
        hero_cv: "View résumé",
        portrait_role: "Computer engineering student",
        portrait_location: "Kayseri, Türkiye",
        about_label: "In brief",
        about_title: "About me",
        about_statement: "My work centers on solving real-world problems through software, perception, and autonomy. I combine academic research with hands-on development and turn what I learn into working systems.",
        focus_1_title: "Autonomous systems",
        focus_1_desc: "Perception, tracking, and flight scenarios with ROS 2, PX4, and Gazebo.",
        focus_2_title: "Computer vision and AI",
        focus_2_desc: "Real-time object detection, tracking, and sensor-data fusion.",
        focus_3_title: "Software development",
        focus_3_desc: "End-to-end products across web, mobile, and service layers.",
        metric_projects: "Selected projects",
        metric_languages: "Languages supported",
        experience_label: "Journey",
        experience_title: "Experience and education",
        internship: "Internship",
        research: "Research",
        team: "Team",
        kepsas_date: "29 June — 10 August",
        kepsas_role: "Intern",
        kepsas_desc: "During the internship, I gained professional experience by observing the company's workflows and the operation of the energy sector firsthand.",
        tubitak_date: "April 2025 — April 2026",
        tubitak_role: "Researcher · TÜBİTAK 2209-A",
        tubitak_company: "TÜBİTAK Undergraduate Research Support Program",
        tubitak_desc: "I developed a system for detecting and tracking fixed-wing UAVs by fusing GNSS with real-time image data.",
        bap_date: "January 2025 — Present",
        bap_role: "Researcher · BAP Project",
        agu: "Abdullah Gül University",
        bap_desc: "I work on collaborative missions with AI- and IoT-enabled fixed-wing UAVs, including LoRa/GSM communication and autonomous mission flows.",
        bb_date: "June 2025 — August 2025",
        bb_role: "Software Intern",
        bb_desc: "I contributed to computer vision projects and C# / ASP.NET Core MVC development workflows.",
        tulpar_date: "January 2024 — July 2025",
        tulpar_role: "Software Team Lead · Tulpar UAV",
        tulpar_company: "AGU TEKNOFEST Fighter UAV Team",
        tulpar_desc: "I coordinated object detection and tracking, PX4–Gazebo simulation, and ROS 2-based flight tests.",
        education_label: "Education",
        education_degree: "BSc in Computer Engineering",
        education_date: "2021 — Present",
        projects_label: "Selection",
        projects_title: "Work",
        filter_all: "All",
        filter_energy: "Energy",
        filter_autonomy: "Autonomy",
        filter_ai: "Artificial intelligence",
        filter_software: "Software",
        projects_visible: "projects visible",
        project_research: "Research project",
        project_personal: "Personal project",
        project_product: "Product project",
        project_ml: "Machine learning",
        project_prototype: "Product prototype",
        project_experiment: "Experimental study",
        project_1_title: "Fixed-Wing UAV Tracking System",
        project_1_desc: "A TÜBİTAK 2209-A project that fuses GNSS and image data for real-time detection, tracking, and position estimation.",
        project_2_title: "Autonomous UAV Reconnaissance",
        project_2_desc: "A BAP study combining computer vision, flight control, and low-latency communication for collaborative two-UAV missions.",
        project_3_title: "RT-DETR Object Detection and Re-ID",
        project_3_desc: "An experiment in real-time RT-DETR-based object detection and re-identification for video analytics.",
        project_4_title: "Smart Résumé System",
        project_4_desc: "An AI-assisted web application combining résumé analysis, job matching, and PDF processing in one flow.",
        project_5_title: "K2 EnergyPro",
        project_5_desc: "An energy application that brings electricity retail offers, payment plans, financing, and actual results together through modular calculation engines.",
        project_6_title: "EPİAŞ MCP Forecasting MVP",
        project_6_desc: "An end-to-end MVP that processes Market Clearing Price data and produces a monitored 24-hour forecast with XGBoost and GPR uncertainty.",
        project_7_title: "3D CHLOthes · Virtual Try-On",
        project_7_desc: "An asynchronous application that processes garment images, creates 3D models, and provides an AI-assisted virtual try-on flow for avatars.",
        project_8_title: "MSFT Price Forecasting with PyTorch",
        project_8_desc: "A reproducible time-series experiment comparing a naive baseline, LSTM, and GRU under the same chronological data split.",
        view_github: "View on GitHub",
        all_projects: "View all projects on GitHub",
        projects_hint: "Each project is an experiment in shortening the distance between research and working software.",
        toolbox_label: "Toolbox",
        recognition_label: "Selected notes",
        recognition_title: "Programs and contributions",
        recognition_1_title: "TÜBİTAK 2209-A Research Grant",
        recognition_1_desc: "Fixed-wing UAV tracking research project.",
        recognition_2_title: "TEKNOFEST · Hepsiburada AI Hackathon",
        recognition_2_desc: "Address resolution using NLP and data preprocessing.",
        recognition_3_title: "AI Stars · Volunteer Instructor",
        recognition_3_desc: "AI literacy and Python workshops for middle and high school students.",
        contact_label: "Contact",
        contact_title: "Let's talk about working together.",
        contact_desc: "Feel free to reach out about new projects, research collaborations, or entry-level opportunities.",
        back_top: "Back to top",
        theme_light: "Switch to light theme",
        theme_dark: "Switch to dark theme"
    },
    de: {
        document_title: "Yusuf Sait Sakoğlu | Technische Informatik",
        meta_description: "Portfolio von Yusuf Sait Sakoğlu — Informatik, künstliche Intelligenz, Computer Vision und autonome Systeme.",
        skip: "Zum Inhalt springen",
        menu: "Menü öffnen",
        nav_about: "Über mich",
        nav_experience: "Erfahrung",
        nav_projects: "Arbeiten",
        nav_contact: "Kontakt",
        hero_eyebrow: "Computer Engineering · Abdullah Gül Universität",
        hero_status: "Offen für neue Projekte und Kooperationen",
        hero_scroll: "Entdecken",
        hero_lead: "Ich studiere Computer Engineering mit Schwerpunkt auf künstlicher Intelligenz, Computer Vision und autonomen Systemen. In Forschung und Produktentwicklung konzentriere ich mich auf klare und zuverlässige Lösungen.",
        hero_work: "Ausgewählte Arbeiten",
        hero_cv: "Lebenslauf ansehen",
        portrait_role: "Student im Bereich Computer Engineering",
        portrait_location: "Kayseri, Türkiye",
        about_label: "Kurz gesagt",
        about_title: "Über mich",
        about_statement: "Meine Arbeit konzentriert sich darauf, reale Probleme mit Software, Wahrnehmung und Autonomie zu lösen. Ich verbinde akademische Forschung mit praktischer Entwicklung und überführe Gelerntes in funktionierende Systeme.",
        focus_1_title: "Autonome Systeme",
        focus_1_desc: "Wahrnehmung, Tracking und Flugszenarien mit ROS 2, PX4 und Gazebo.",
        focus_2_title: "Computer Vision und KI",
        focus_2_desc: "Echtzeit-Objekterkennung, Tracking und Datenfusion.",
        focus_3_title: "Softwareentwicklung",
        focus_3_desc: "Durchgängige Produkte für Web, Mobile und Service-Schichten.",
        metric_projects: "Ausgewählte Projekte",
        metric_languages: "Unterstützte Sprachen",
        experience_label: "Werdegang",
        experience_title: "Erfahrung und Ausbildung",
        internship: "Praktikum",
        research: "Forschung",
        team: "Team",
        kepsas_date: "29. Juni — 10. August",
        kepsas_role: "Praktikant",
        kepsas_desc: "Während des Praktikums sammelte ich Berufserfahrung, indem ich die Unternehmensabläufe und die Arbeitsweise des Energiesektors vor Ort kennenlernte.",
        tubitak_date: "April 2025 — April 2026",
        tubitak_role: "Forscher · TÜBİTAK 2209-A",
        tubitak_company: "TÜBİTAK Forschungsförderprogramm für Studierende",
        tubitak_desc: "Ich entwickelte ein System zur Erkennung und Verfolgung von Starrflügel-UAVs durch die Fusion von GNSS- und Echtzeit-Bilddaten.",
        bap_date: "Januar 2025 — Heute",
        bap_role: "Forscher · BAP-Projekt",
        agu: "Abdullah Gül Universität",
        bap_desc: "Ich arbeite an kooperativen Missionen mit KI- und IoT-fähigen Starrflügel-UAVs, LoRa/GSM-Kommunikation und autonomen Missionsabläufen.",
        bb_date: "Juni 2025 — August 2025",
        bb_role: "Software-Praktikant",
        bb_desc: "Ich wirkte an Computer-Vision-Projekten sowie an C#- und ASP.NET-Core-MVC-Entwicklungsprozessen mit.",
        tulpar_date: "Januar 2024 — Juli 2025",
        tulpar_role: "Software-Teamleiter · Tulpar UAV",
        tulpar_company: "AGU TEKNOFEST Kampfdrohnen-Team",
        tulpar_desc: "Ich koordinierte Objekterkennung und -verfolgung, PX4–Gazebo-Simulationen und ROS-2-basierte Flugtests.",
        education_label: "Ausbildung",
        education_degree: "Bachelor in Computer Engineering",
        education_date: "2021 — Heute",
        projects_label: "Auswahl",
        projects_title: "Arbeiten",
        filter_all: "Alle",
        filter_energy: "Energie",
        filter_autonomy: "Autonomie",
        filter_ai: "Künstliche Intelligenz",
        filter_software: "Software",
        projects_visible: "Projekte sichtbar",
        project_research: "Forschungsprojekt",
        project_personal: "Persönliches Projekt",
        project_product: "Produktprojekt",
        project_ml: "Maschinelles Lernen",
        project_prototype: "Produktprototyp",
        project_experiment: "Experimentelle Studie",
        project_1_title: "Tracking-System für Starrflügel-UAVs",
        project_1_desc: "Ein TÜBİTAK-2209-A-Projekt, das GNSS- und Bilddaten für Echtzeit-Erkennung, Tracking und Positionsschätzung kombiniert.",
        project_2_title: "Autonome UAV-Aufklärung",
        project_2_desc: "Eine BAP-Studie, die Computer Vision, Flugsteuerung und latenzarme Kommunikation für kooperative Zwei-UAV-Missionen verbindet.",
        project_3_title: "RT-DETR-Objekterkennung und Re-ID",
        project_3_desc: "Ein Experiment zur RT-DETR-basierten Echtzeit-Objekterkennung und Re-Identifikation für Videoanalysen.",
        project_4_title: "Intelligentes Lebenslauf-System",
        project_4_desc: "Eine KI-gestützte Webanwendung, die Lebenslaufanalyse, Job-Matching und PDF-Verarbeitung in einem Ablauf verbindet.",
        project_5_title: "K2 EnergiePro",
        project_5_desc: "Eine Energieanwendung, die Stromvertriebsangebote, Zahlungspläne, Finanzierung und Ist-Ergebnisse in modularen Berechnungsmodulen zusammenführt.",
        project_6_title: "EPİAŞ-MCP-Prognose-MVP",
        project_6_desc: "Ein End-to-End-MVP, das Markträumungspreise verarbeitet und mit XGBoost sowie GPR-Unsicherheit eine überwachte 24-Stunden-Prognose erstellt.",
        project_7_title: "3D CHLOthes · Virtuelle Anprobe",
        project_7_desc: "Eine asynchrone Anwendung, die Kleidungsbilder verarbeitet, 3D-Modelle erstellt und einen KI-gestützten virtuellen Anprobeprozess für Avatare bietet.",
        project_8_title: "MSFT-Kursprognose mit PyTorch",
        project_8_desc: "Ein reproduzierbares Zeitreihenexperiment, das eine naive Baseline, LSTM und GRU mit derselben chronologischen Datenaufteilung vergleicht.",
        view_github: "Auf GitHub ansehen",
        all_projects: "Alle Projekte auf GitHub ansehen",
        projects_hint: "Jedes Projekt ist ein Versuch, den Weg von der Forschung zur funktionierenden Software zu verkürzen.",
        toolbox_label: "Werkzeuge",
        recognition_label: "Ausgewählte Hinweise",
        recognition_title: "Programme und Beiträge",
        recognition_1_title: "TÜBİTAK 2209-A Forschungsförderung",
        recognition_1_desc: "Forschungsprojekt zum Tracking von Starrflügel-UAVs.",
        recognition_2_title: "TEKNOFEST · Hepsiburada AI Hackathon",
        recognition_2_desc: "Adressauflösung mit NLP und Datenvorverarbeitung.",
        recognition_3_title: "AI Stars · Ehrenamtlicher Trainer",
        recognition_3_desc: "KI-Grundlagen und Python-Workshops für Schülerinnen und Schüler.",
        contact_label: "Kontakt",
        contact_title: "Lassen Sie uns über Zusammenarbeit sprechen.",
        contact_desc: "Kontaktieren Sie mich gerne zu neuen Projekten, Forschungskooperationen oder Einstiegsmöglichkeiten.",
        back_top: "Nach oben",
        theme_light: "Zum hellen Design wechseln",
        theme_dark: "Zum dunklen Design wechseln"
    }
};

const root = document.documentElement;
const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const languageButtons = document.querySelectorAll("[data-language]");
const themeButton = document.querySelector(".theme-toggle");
const metaDescription = document.querySelector('meta[name="description"]');
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const safeStorage = {
    get(key) {
        try { return localStorage.getItem(key); } catch { return null; }
    },
    set(key, value) {
        try { localStorage.setItem(key, value); } catch { /* Storage may be unavailable. */ }
    }
};

let currentLanguage = safeStorage.get("portfolio-language") || "tr";
if (!translations[currentLanguage]) currentLanguage = "tr";
root.dataset.theme = safeStorage.get("portfolio-theme") || "dark";

function visibleProjectCount() {
    return [...document.querySelectorAll("[data-project]")]
        .filter((card) => !card.classList.contains("is-filtered")).length;
}

function updateFilterStatus() {
    const count = visibleProjectCount();
    const countElement = document.querySelector("[data-project-count]");
    const liveElement = document.getElementById("filter-status");
    if (countElement) countElement.textContent = String(count).padStart(2, "0");
    if (liveElement) liveElement.textContent = `${count} ${translations[currentLanguage].projects_visible}`;
}

function updateThemeLabel() {
    const isDark = root.dataset.theme === "dark";
    const key = isDark ? "theme_light" : "theme_dark";
    themeButton.setAttribute("aria-label", translations[currentLanguage][key]);
}

function applyLanguage(language) {
    const copy = translations[language];
    currentLanguage = language;
    root.lang = language;
    document.title = copy.document_title;
    metaDescription.setAttribute("content", copy.meta_description);

    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.dataset.i18n;
        if (copy[key]) element.textContent = copy[key];
    });

    languageButtons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.language === language));
    });

    safeStorage.set("portfolio-language", language);
    updateThemeLabel();
    updateFilterStatus();
    document.dispatchEvent(new CustomEvent("languagechange", { detail: { language } }));
}

function closeMenu() {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
}

menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    navigation.classList.toggle("open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
});

navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
});

languageButtons.forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.language));
});

let signalField = null;

themeButton.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    safeStorage.set("portfolio-theme", root.dataset.theme);
    updateThemeLabel();
    signalField?.refreshPalette();
});

document.querySelectorAll(".bento-grid, .project-grid, .recognition-list, .timeline").forEach((group) => {
    [...group.children].forEach((element, index) => {
        if (element.classList.contains("reveal")) {
            element.style.setProperty("--reveal-delay", `${Math.min(index * 70, 350)}ms`);
        }
    });
});

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.11, rootMargin: "0px 0px -45px" });

    document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
} else {
    document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll("[data-section-link]").forEach((link) => {
            link.classList.toggle("active", link.dataset.sectionLink === entry.target.id);
        });
    });
}, { rootMargin: "-38% 0px -52%", threshold: 0 });

document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

let scrollTicking = false;

function updateScrollEffects() {
    const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max(window.scrollY / scrollable, 0), 1);
    root.style.setProperty("--scroll-progress", `${progress * 100}%`);
    header.classList.toggle("scrolled", window.scrollY > 18);

    const timeline = document.querySelector("[data-timeline]");
    if (timeline) {
        const rect = timeline.getBoundingClientRect();
        const timelineProgress = Math.min(Math.max((window.innerHeight * 0.7 - rect.top) / rect.height, 0), 1);
        timeline.style.setProperty("--timeline-progress", `${timelineProgress * 100}%`);
    }

    scrollTicking = false;
}

window.addEventListener("scroll", () => {
    if (!scrollTicking) {
        requestAnimationFrame(updateScrollEffects);
        scrollTicking = true;
    }
}, { passive: true });

updateScrollEffects();

document.querySelectorAll("[data-filter]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.classList.contains("active")));
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        document.querySelectorAll("[data-filter]").forEach((item) => {
            const active = item === button;
            item.classList.toggle("active", active);
            item.setAttribute("aria-pressed", String(active));
        });

        document.querySelectorAll("[data-project]").forEach((card) => {
            const categories = card.dataset.category.split(" ");
            card.classList.toggle("is-filtered", filter !== "all" && !categories.includes(filter));
        });

        updateFilterStatus();
    });
});

document.querySelectorAll(".spotlight-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--spotlight-x", `${event.clientX - rect.left}px`);
        card.style.setProperty("--spotlight-y", `${event.clientY - rect.top}px`);
    });
});

if (finePointer && !reduceMotion) {
    document.addEventListener("pointermove", (event) => {
        root.style.setProperty("--pointer-x", `${event.clientX}px`);
        root.style.setProperty("--pointer-y", `${event.clientY}px`);
    }, { passive: true });

    document.querySelectorAll("[data-project]").forEach((card) => {
        card.addEventListener("pointermove", (event) => {
            const rect = card.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            card.style.setProperty("--tilt-x", `${y * -3.5}deg`);
            card.style.setProperty("--tilt-y", `${x * 3.5}deg`);
        });
        card.addEventListener("pointerleave", () => {
            card.style.setProperty("--tilt-x", "0deg");
            card.style.setProperty("--tilt-y", "0deg");
        });
    });

    document.querySelectorAll(".magnetic").forEach((element) => {
        element.addEventListener("pointermove", (event) => {
            const rect = element.getBoundingClientRect();
            const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
            const y = (event.clientY - rect.top - rect.height / 2) * 0.12;
            element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });
        element.addEventListener("pointerleave", () => {
            element.style.transform = "translate3d(0, 0, 0)";
        });
    });

    const parallaxRoot = document.querySelector("[data-parallax-root]");
    const parallaxCard = document.querySelector("[data-parallax-card]");
    if (parallaxRoot && parallaxCard) {
        parallaxRoot.addEventListener("pointermove", (event) => {
            const rect = parallaxRoot.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            parallaxCard.style.transform = `rotateX(${y * -5}deg) rotateY(${x * 6}deg)`;
            parallaxRoot.querySelectorAll("[data-parallax-layer]").forEach((layer) => {
                const depth = Number(layer.dataset.parallaxLayer);
                layer.style.transform = `translate3d(${x * depth * 15}px, ${y * depth * 15}px, ${depth * 5}px)`;
            });
        });
        parallaxRoot.addEventListener("pointerleave", () => {
            parallaxCard.style.transform = "rotateX(0deg) rotateY(0deg)";
            parallaxRoot.querySelectorAll("[data-parallax-layer]").forEach((layer) => {
                layer.style.transform = "translate3d(0, 0, 0)";
            });
        });
    }
}

if (!reduceMotion && "IntersectionObserver" in window) {
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const element = entry.target;
            const target = Number(element.dataset.count);
            const started = performance.now();
            const duration = 900;
            const step = (now) => {
                const t = Math.min((now - started) / duration, 1);
                const eased = 1 - Math.pow(1 - t, 3);
                element.textContent = String(Math.round(target * eased)).padStart(2, "0");
                if (t < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            countObserver.unobserve(element);
        });
    }, { threshold: 0.7 });
    document.querySelectorAll("[data-count]").forEach((element) => countObserver.observe(element));
}

class SignalField {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.nodes = [];
        this.pointer = { x: -1000, y: -1000 };
        this.raf = 0;
        this.resize = this.resize.bind(this);
        this.animate = this.animate.bind(this);
        this.refreshPalette();
        this.resize();
        window.addEventListener("resize", this.resize, { passive: true });
        window.addEventListener("pointermove", (event) => {
            const rect = canvas.getBoundingClientRect();
            this.pointer.x = event.clientX - rect.left;
            this.pointer.y = event.clientY - rect.top;
        }, { passive: true });
        window.addEventListener("pointerleave", () => {
            this.pointer.x = -1000;
            this.pointer.y = -1000;
        });
        if (!reduceMotion) this.animate();
        else this.draw();
    }

    refreshPalette() {
        const styles = getComputedStyle(root);
        this.nodeColor = styles.getPropertyValue("--green").trim();
        this.lineColor = styles.getPropertyValue("--violet").trim();
        this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    resize() {
        const rect = this.canvas.getBoundingClientRect();
        const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
        this.width = rect.width;
        this.height = rect.height;
        this.canvas.width = Math.round(rect.width * ratio);
        this.canvas.height = Math.round(rect.height * ratio);
        this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
        const nodeCount = Math.max(18, Math.min(48, Math.floor(rect.width / 30)));
        this.nodes = Array.from({ length: nodeCount }, () => ({
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            vx: (Math.random() - 0.5) * 0.22,
            vy: (Math.random() - 0.5) * 0.22,
            radius: Math.random() * 1.5 + 0.6
        }));
    }

    update() {
        this.nodes.forEach((node) => {
            const dx = this.pointer.x - node.x;
            const dy = this.pointer.y - node.y;
            const distance = Math.hypot(dx, dy);
            if (distance < 180 && distance > 1) {
                node.vx += (dx / distance) * 0.0025;
                node.vy += (dy / distance) * 0.0025;
            }
            node.vx *= 0.995;
            node.vy *= 0.995;
            node.x += node.vx;
            node.y += node.vy;
            if (node.x < 0 || node.x > this.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.height) node.vy *= -1;
        });
    }

    draw() {
        const ctx = this.context;
        ctx.clearRect(0, 0, this.width, this.height);
        for (let i = 0; i < this.nodes.length; i += 1) {
            const a = this.nodes[i];
            for (let j = i + 1; j < this.nodes.length; j += 1) {
                const b = this.nodes[j];
                const distance = Math.hypot(a.x - b.x, a.y - b.y);
                if (distance < 125) {
                    ctx.globalAlpha = (1 - distance / 125) * 0.22;
                    ctx.strokeStyle = this.lineColor;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
            ctx.globalAlpha = 0.7;
            ctx.fillStyle = this.nodeColor;
            ctx.beginPath();
            ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    animate() {
        this.update();
        this.draw();
        this.raf = requestAnimationFrame(this.animate);
    }
}

const canvas = document.querySelector(".signal-canvas");
if (canvas) signalField = new SignalField(canvas);

document.querySelectorAll("[data-analytics]").forEach((element) => {
    element.addEventListener("click", () => {
        if (typeof window.gtag === "function") {
            window.gtag("event", `click_${element.dataset.analytics}`, {
                event_category: "Portfolio",
                event_label: element.getAttribute("href")
            });
        }
    });
});

document.getElementById("current-year").textContent = new Date().getFullYear();
applyLanguage(currentLanguage);
