// =====================================================
// FIREBASE IMPORT
// =====================================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";


import {
    getDatabase,
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";



// =====================================================
// FIREBASE CONFIGURATION
// =====================================================
//
// GANTI SEMUA DATA DI BAWAH DENGAN DATA FIREBASE-MU
//

const firebaseConfig = {

    apiKey:
        "AIzaSyC5xNQdWwZjy8772_BTI3uv3kFzpdv2ds4",

    authDomain:
        "aerion-6053d.firebaseapp.com",

    databaseURL:
        "https://aerion-6053d-default-rtdb.asia-southeast1.firebasedatabase.app",

    projectId:
        "aerion-6053d",

    storageBucket:
        "aerion-6053d.firebasestorage.app",

    messagingSenderId:
        "106199424315",

    appId:
        "1:106199424315:web:fde086e94584329a576b1e"

};



// =====================================================
// INITIALIZE FIREBASE
// =====================================================

const app =
    initializeApp(firebaseConfig);


const database =
    getDatabase(app);



// =====================================================
// DATABASE REFERENCE
// =====================================================

const sensorRef =
    ref(database, "sensor");



// =====================================================
// CHART CONFIGURATION
// =====================================================

const chartCanvas =
    document.getElementById("co2Chart");


const chartContext =
    chartCanvas.getContext("2d");


const co2Labels =
    [];


const co2Values =
    [];


const MAX_DATA =
    20;



const co2Chart =
    new Chart(
        chartContext,
        {

            type: "line",

            data: {

                labels:
                    co2Labels,

                datasets: [

                    {

                        label:
                            "CO₂",

                        data:
                            co2Values,

                        borderWidth:
                            2,

                        tension:
                            0.4,

                        pointRadius:
                            3,

                        fill:
                            true,

                        backgroundColor:
                            "rgba(57, 229, 140, 0.08)",

                        borderColor:
                            "#39e58c",

                        pointBackgroundColor:
                            "#39e58c"

                    }

                ]

            },


            options: {

                responsive:
                    true,

                maintainAspectRatio:
                    false,

                plugins: {

                    legend: {

                        display:
                            false

                    }

                },


                scales: {

                    x: {

                        ticks: {

                            color:
                                "#71877d",

                            maxTicksLimit:
                                8

                        },

                        grid: {

                            color:
                                "rgba(255,255,255,0.04)"

                        }

                    },


                    y: {

                        ticks: {

                            color:
                                "#71877d"

                        },

                        grid: {

                            color:
                                "rgba(255,255,255,0.04)"

                        }

                    }

                }

            }

        }
    );



// =====================================================
// HELPER
// =====================================================

function getNumber(value) {

    const number =
        Number(value);


    if (Number.isNaN(number)) {

        return 0;

    }


    return number;

}



// =====================================================
// UPDATE PROGRESS BAR
// =====================================================

function updateProgress(
    elementId,
    value,
    maxValue
) {

    const element =
        document.getElementById(elementId);


    if (!element) {

        return;

    }


    let percentage =
        (value / maxValue) * 100;


    percentage =
        Math.max(
            0,
            Math.min(
                100,
                percentage
            )
        );


    element.style.width =
        percentage + "%";

}



// =====================================================
// UPDATE AQI STATUS
// =====================================================

function updateAQI(aqi) {

    const element =
        document.getElementById(
            "aqiStatus"
        );


    if (!element) {

        return;

    }


    if (aqi <= 1) {

        element.textContent =
            "Good";

    }

    else if (aqi <= 2) {

        element.textContent =
            "Moderate";

    }

    else if (aqi <= 3) {

        element.textContent =
            "Unhealthy";

    }

    else {

        element.textContent =
            "Poor";

    }

}



// =====================================================
// UPDATE CHART
// =====================================================

function updateChart(co2) {

    const now =
        new Date();


    const time =
        now.toLocaleTimeString(
            "id-ID",
            {
                hour:
                    "2-digit",

                minute:
                    "2-digit",

                second:
                    "2-digit"
            }
        );


    co2Labels.push(time);

    co2Values.push(co2);


    if (
        co2Labels.length >
        MAX_DATA
    ) {

        co2Labels.shift();

        co2Values.shift();

    }


    co2Chart.update();

}



// =====================================================
// UPDATE CONNECTION
// =====================================================

function setOnline() {

    const connection =
        document.getElementById(
            "connection"
        );


    connection.classList.add(
        "online"
    );


    connection.querySelector(
        "strong"
    ).textContent =
        "ONLINE";


    connection.querySelector(
        "small"
    ).textContent =
        "Firebase Connected";

}



// =====================================================
// FIREBASE REALTIME LISTENER
// =====================================================

onValue(

    sensorRef,

    (snapshot) => {


        const data =
            snapshot.val();


        console.log(
            "Firebase data:",
            data
        );


        if (!data) {

            console.warn(
                "Data sensor tidak ditemukan."
            );

            return;

        }



        // =================================================
        // CO2
        // =================================================

        const co2 =
            getNumber(
                data.co2
            );


        document.getElementById(
            "co2"
        ).textContent =
            co2;


        document.getElementById(
            "chartCurrent"
        ).textContent =
            co2 + " ppm";


        updateProgress(
            "co2Progress",
            co2,
            2000
        );



        // =================================================
        // TEMPERATURE
        // =================================================

        const temperature =
            getNumber(
                data.temperature
            );


        document.getElementById(
            "temperature"
        ).textContent =
            temperature.toFixed(1);


        updateProgress(
            "temperatureProgress",
            temperature,
            50
        );



        // =================================================
        // HUMIDITY
        // =================================================

        const humidity =
            getNumber(
                data.humidity
            );


        document.getElementById(
            "humidity"
        ).textContent =
            humidity.toFixed(1);


        updateProgress(
            "humidityProgress",
            humidity,
            100
        );



        // =================================================
        // TVOC
        // =================================================

        const tvoc =
            getNumber(
                data.tvoc
            );


        document.getElementById(
            "tvoc"
        ).textContent =
            tvoc;


        updateProgress(
            "tvocProgress",
            tvoc,
            1000
        );



        // =================================================
        // AQI
        // =================================================

        const aqi =
            getNumber(
                data.aqi
            );


        document.getElementById(
            "aqi"
        ).textContent =
            aqi;


        updateAQI(
            aqi
        );



        // =================================================
        // LDR
        // =================================================

        const ldr =
            getNumber(
                data.ldr
            );


        document.getElementById(
            "ldr"
        ).textContent =
            ldr;


        updateProgress(
            "ldrProgress",
            ldr,
            1023
        );



        // =================================================
        // LAMPU
        // =================================================

        const lampu =
            data.lampu;


        const lampuElement =
            document.getElementById(
                "lampu"
            );


        const lampIndicator =
            document.getElementById(
                "lampIndicator"
            );


        if (
            lampu === true ||
            lampu === "true" ||
            lampu === 1
        ) {

            lampuElement.textContent =
                "ON";


            lampuElement.style.color =
                "#39e58c";


            lampIndicator.style.background =
                "#39e58c";


            lampIndicator.style.boxShadow =
                "0 0 12px #39e58c";

        }

        else {

            lampuElement.textContent =
                "OFF";


            lampuElement.style.color =
                "#91aaa0";


            lampIndicator.style.background =
                "#68776f";


            lampIndicator.style.boxShadow =
                "none";

        }



        // =================================================
        // LAST UPDATE
        // =================================================

        const now =
            new Date();


        document.getElementById(
            "lastUpdate"
        ).textContent =
            now.toLocaleTimeString(
                "id-ID"
            );



        // =================================================
        // CONNECTION
        // =================================================

        setOnline();



        // =================================================
        // CHART
        // =================================================

        updateChart(
            co2
        );

    },


    (error) => {

        console.error(
            "Firebase Error:",
            error
        );


        const connection =
            document.getElementById(
                "connection"
            );


        connection.querySelector(
            "strong"
        ).textContent =
            "ERROR";


        connection.querySelector(
            "small"
        ).textContent =
            "Firebase tidak dapat diakses";

    }

);



// =====================================================
// MOBILE NAVBAR
// =====================================================

const menuToggle =
    document.getElementById(
        "menuToggle"
    );


const navMenu =
    document.getElementById(
        "navMenu"
    );


menuToggle.addEventListener(
    "click",
    () => {

        navMenu.classList.toggle(
            "show"
        );

    }
);



// =====================================================
// CLOSE MENU WHEN LINK CLICKED
// =====================================================

document
    .querySelectorAll(".nav-link")
    .forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    navMenu.classList.remove(
                        "show"
                    );

                }
            );

        }
    );



// =====================================================
// ACTIVE NAVIGATION
// =====================================================

const sections =
    document.querySelectorAll(
        "section[id]"
    );


const navLinks =
    document.querySelectorAll(
        ".nav-link"
    );


window.addEventListener(
    "scroll",
    () => {

        let current =
            "";


        sections.forEach(
            section => {

                const sectionTop =
                    section.offsetTop -
                    120;


                if (
                    window.scrollY >=
                    sectionTop
                ) {

                    current =
                        section.getAttribute(
                            "id"
                        );

                }

            }
        );


        navLinks.forEach(
            link => {

                link.classList.remove(
                    "active"
                );


                if (
                    link.getAttribute(
                        "href"
                    ) ===
                    "#" + current
                ) {

                    link.classList.add(
                        "active"
                    );

                }

            }
        );

    }
);
