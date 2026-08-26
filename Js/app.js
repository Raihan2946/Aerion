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
// DATABASE REFERENCES
// =====================================================

const sensorRef =
    ref(database, "sensor");

const historyRef =
    ref(database, "history");


// =====================================================
// HELPER
// =====================================================

function getNumber(value) {

    const number =
        Number(value);

    if (
        Number.isNaN(number)
    ) {
        return 0;
    }

    return number;
}


// =====================================================
// EFISIENSI CO2
// =====================================================

function hitungEfisiensi(
    co2In,
    co2Out
) {

    if (
        !co2In ||
        co2In <= 0
    ) {
        return 0;
    }

    const efficiency =
        (
            (co2Out - co2In)
            /
            co2Out
        ) * 100;

    return efficiency;
}


// =====================================================
// RATA-RATA
// =====================================================

function hitungRataRata(
    values
) {

    if (
        !values ||
        values.length === 0
    ) {
        return 0;
    }

    const validValues =
        values.filter(
            value =>
                Number.isFinite(value)
        );

    if (
        validValues.length === 0
    ) {
        return 0;
    }

    const total =
        validValues.reduce(
            (sum, value) =>
                sum + value,
            0
        );

    return (
        total /
        validValues.length
    );
}


// =====================================================
// PROGRESS BAR
// =====================================================

function updateProgress(
    elementId,
    value,
    maxValue
) {

    const element =
        document.getElementById(
            elementId
        );

    if (!element) {
        return;
    }

    let percentage =
        (
            value /
            maxValue
        ) * 100;

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
// AQI
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
// CHART DATA
// =====================================================

const chartCanvas =
    document.getElementById(
        "co2Chart"
    );

const chartContext =
    chartCanvas.getContext("2d");


const co2Labels =
    [];

const co2InValues =
    [];

const co2OutValues =
    [];


const MAX_DATA =
    30;


// =====================================================
// CHART
// =====================================================

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
                            "CO₂ IN",

                        data:
                            co2InValues,

                        borderWidth:
                            2,

                        tension:
                            0.4,

                        pointRadius:
                            3,

                        fill:
                            false,

                        borderColor:
                            "#39e58c",

                        pointBackgroundColor:
                            "#39e58c"
                    },


                    {
                        label:
                            "CO₂ OUT",

                        data:
                            co2OutValues,

                        borderWidth:
                            2,

                        tension:
                            0.4,

                        pointRadius:
                            3,

                        fill:
                            false,

                        borderColor:
                            "#43d9d0",

                        pointBackgroundColor:
                            "#43d9d0"
                    }

                ]

            },


            options: {

                responsive:
                    true,

                maintainAspectRatio:
                    false,

                interaction: {

                    mode:
                        "index",

                    intersect:
                        false
                },


                plugins: {

                    legend: {

                        display:
                            true,

                        labels: {

                            color:
                                "#91aaa0"
                        }
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

                        beginAtZero:
                            false,

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
// UPDATE CHART
// =====================================================

function updateChart(
    co2In,
    co2Out,
    timestamp
) {

    let label =
        timestamp;


    if (!label) {

        const now =
            new Date();

        label =
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
    }


    co2Labels.push(
        label
    );

    co2InValues.push(
        co2In
    );

    co2OutValues.push(
        co2Out
    );


    if (
        co2Labels.length >
        MAX_DATA
    ) {

        co2Labels.shift();

        co2InValues.shift();

        co2OutValues.shift();
    }


    co2Chart.update();
}


// =====================================================
// CONNECTION ONLINE
// =====================================================

function setOnline() {

    const connection =
        document.getElementById(
            "connection"
        );

    if (!connection) {
        return;
    }


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
// UPDATE REALTIME SENSOR
// =====================================================

onValue(

    sensorRef,

    (snapshot) => {

        const data =
            snapshot.val();


        console.log(
            "Realtime Firebase:",
            data
        );


        if (!data) {

            console.warn(
                "Data sensor tidak ditemukan."
            );

            return;
        }


        // =================================================
        // CO2 IN
        // =================================================

        const co2In =
            getNumber(
                data.co2_in
            );


        const co2InElement =
            document.getElementById(
                "co2In"
            );


        if (co2InElement) {

            co2InElement.textContent =
                co2In;
        }


        updateProgress(
            "co2InProgress",
            co2In,
            2000
        );


        // =================================================
        // CO2 OUT
        // =================================================

        const co2Out =
            getNumber(
                data.co2_out
            );


        const co2OutElement =
            document.getElementById(
                "co2Out"
            );


        if (co2OutElement) {

            co2OutElement.textContent =
                co2Out;
        }


        updateProgress(
            "co2OutProgress",
            co2Out,
            2000
        );


        // =================================================
        // EFISIENSI
        // =================================================

        const efficiency =
            hitungEfisiensi(
                co2In,
                co2Out
            );


        const efficiencyElement =
            document.getElementById(
                "co2Efficiency"
            );


        if (efficiencyElement) {

            efficiencyElement.textContent =
                efficiency.toFixed(2);
        }


        updateProgress(
            "co2EfficiencyProgress",
            Math.max(
                0,
                efficiency
            ),
            100
        );


        // =================================================
        // CHART CURRENT
        // =================================================

        const chartCurrent =
            document.getElementById(
                "chartCurrent"
            );


        if (chartCurrent) {

            chartCurrent.textContent =
                "OUT " +
                co2In +
                " | IN " +
                co2Out +
                " ppm";
        }


        // =================================================
        // TEMPERATURE
        // =================================================

        const temperature =
            getNumber(
                data.temperature
            );


        const temperatureElement =
            document.getElementById(
                "temperature"
            );


        if (temperatureElement) {

            temperatureElement.textContent =
                temperature.toFixed(1);
        }


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


        const humidityElement =
            document.getElementById(
                "humidity"
            );


        if (humidityElement) {

            humidityElement.textContent =
                humidity.toFixed(1);
        }


        updateProgress(
            "humidityProgress",
            humidity,
            100
        );


        // =================================================
        // TVOC IN
        // =================================================

        const tvoc =
            getNumber(
                data.tvoc_in
            );


        const tvocElement =
            document.getElementById(
                "tvoc"
            );


        if (tvocElement) {

            tvocElement.textContent =
                tvoc;
        }


        updateProgress(
            "tvocProgress",
            tvoc,
            1000
        );


        // =================================================
        // AQI IN
        // =================================================

        const aqi =
            getNumber(
                data.aqi_in
            );


        const aqiElement =
            document.getElementById(
                "aqi"
            );


        if (aqiElement) {

            aqiElement.textContent =
                aqi;
        }


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


        const ldrElement =
            document.getElementById(
                "ldr"
            );


        if (ldrElement) {

            ldrElement.textContent =
                ldr;
        }


        /*
         * ESP32 ADC 12-bit
         * range = 0 - 4095
         */

        updateProgress(
            "ldrProgress",
            ldr,
            4095
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

            if (lampuElement) {

                lampuElement.textContent =
                    "ON";

                lampuElement.style.color =
                    "#39e58c";
            }


            if (lampIndicator) {

                lampIndicator.style.background =
                    "#39e58c";

                lampIndicator.style.boxShadow =
                    "0 0 12px #39e58c";
            }

        }
        else {

            if (lampuElement) {

                lampuElement.textContent =
                    "OFF";

                lampuElement.style.color =
                    "#91aaa0";
            }


            if (lampIndicator) {

                lampIndicator.style.background =
                    "#68776f";

                lampIndicator.style.boxShadow =
                    "none";
            }

        }


        // =================================================
        // LAST UPDATE
        // =================================================

        const timestamp =
            data.timestamp;


        const lastUpdate =
            document.getElementById(
                "lastUpdate"
            );


        if (lastUpdate) {

            if (timestamp) {

                lastUpdate.textContent =
                    timestamp;

            }
            else {

                lastUpdate.textContent =
                    new Date()
                        .toLocaleTimeString(
                            "id-ID"
                        );
            }

        }


        // =================================================
        // CONNECTION
        // =================================================

        setOnline();

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


        if (!connection) {
            return;
        }


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
// HISTORY FIREBASE
// =====================================================

onValue(

    historyRef,

    (snapshot) => {

        const rawData =
            snapshot.val();


        if (!rawData) {

            console.log(
                "Belum ada data history."
            );

            return;
        }


        // =================================================
        // UBAH OBJECT MENJADI ARRAY
        // =================================================

        const history =
            Object.entries(
                rawData
            )
            .map(
                ([key, value]) => ({
                    key,
                    ...value
                })
            );


        // =================================================
        // SORT BERDASARKAN EPOCH
        // =================================================

        history.sort(
            (a, b) =>
                getNumber(a.epoch) -
                getNumber(b.epoch)
        );


        if (
            history.length === 0
        ) {
            return;
        }


        // =================================================
        // DATA TERAKHIR
        // =================================================

        const latest =
            history
                .slice(-MAX_DATA);


        // =================================================
        // RESET CHART
        // =================================================

        co2Labels.length =
            0;

        co2InValues.length =
            0;

        co2OutValues.length =
            0;


        latest.forEach(
            item => {

                const co2In =
                    getNumber(
                        item.co2_in
                    );

                const co2Out =
                    getNumber(
                        item.co2_out
                    );


                let label =
                    item.timestamp;


                if (
                    !label &&
                    item.epoch
                ) {

                    label =
                        new Date(
                            item.epoch * 1000
                        )
                        .toLocaleTimeString(
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
                }


                co2Labels.push(
                    label || "--"
                );

                co2InValues.push(
                    co2In
                );

                co2OutValues.push(
                    co2Out
                );

            }
        );


        co2Chart.update();


        // =================================================
        // DATA TERBARU UNTUK ANALISIS
        // =================================================

        const latestData =
            history[
                history.length - 1
            ];


        // =================================================
        // HOURLY AVERAGE
        // =================================================

        const now =
            Date.now();


        const oneHour =
            60 * 60 * 1000;


        const hourlyData =
            history.filter(
                item => {

                    const epoch =
                        getNumber(
                            item.epoch
                        );


                    if (!epoch) {
                        return false;
                    }


                    const itemTime =
                        epoch * 1000;


                    return (
                        now -
                        itemTime
                        <=
                        oneHour
                    );

                }
            );


        const hourlyCo2In =
            hitungRataRata(
                hourlyData.map(
                    item =>
                        getNumber(
                            item.co2_in
                        )
                )
            );


        const hourlyCo2Out =
            hitungRataRata(
                hourlyData.map(
                    item =>
                        getNumber(
                            item.co2_out
                        )
                )
            );


        const hourlyEfficiency =
            hitungEfisiensi(
                hourlyCo2In,
                hourlyCo2Out
            );


        // =================================================
        // DAILY AVERAGE
        // =================================================

        const today =
            new Date();


        const todayDate =
            today.toLocaleDateString(
                "id-ID"
            );


        const dailyData =
            history.filter(
                item => {

                    if (
                        !item.epoch
                    ) {
                        return false;
                    }


                    const itemDate =
                        new Date(
                            getNumber(
                                item.epoch
                            ) * 1000
                        );


                    return (
                        itemDate
                            .toLocaleDateString(
                                "id-ID"
                            )
                        ===
                        todayDate
                    );

                }
            );


        const dailyCo2In =
            hitungRataRata(
                dailyData.map(
                    item =>
                        getNumber(
                            item.co2_in
                        )
                )
            );


        const dailyCo2Out =
            hitungRataRata(
                dailyData.map(
                    item =>
                        getNumber(
                            item.co2_out
                        )
                )
            );


        const dailyEfficiency =
            hitungEfisiensi(
                dailyCo2In,
                dailyCo2Out
            );


        // =================================================
        // TAMPILKAN HOURLY
        // =================================================

        const hourlyInElement =
            document.getElementById(
                "hourlyCo2In"
            );


        const hourlyOutElement =
            document.getElementById(
                "hourlyCo2Out"
            );


        const hourlyEfficiencyElement =
            document.getElementById(
                "hourlyEfficiency"
            );


        if (hourlyInElement) {

            hourlyInElement.textContent =
                hourlyCo2In.toFixed(1)
                + " ppm";
        }


        if (hourlyOutElement) {

            hourlyOutElement.textContent =
                hourlyCo2Out.toFixed(1)
                + " ppm";
        }


        if (hourlyEfficiencyElement) {

            hourlyEfficiencyElement.textContent =
                hourlyEfficiency.toFixed(2)
                + " %";
        }


        // =================================================
        // TAMPILKAN DAILY
        // =================================================

        const dailyInElement =
            document.getElementById(
                "dailyCo2In"
            );


        const dailyOutElement =
            document.getElementById(
                "dailyCo2Out"
            );


        const dailyEfficiencyElement =
            document.getElementById(
                "dailyEfficiency"
            );


        if (dailyInElement) {

            dailyInElement.textContent =
                dailyCo2In.toFixed(1)
                + " ppm";
        }


        if (dailyOutElement) {

            dailyOutElement.textContent =
                dailyCo2Out.toFixed(1)
                + " ppm";
        }


        if (dailyEfficiencyElement) {

            dailyEfficiencyElement.textContent =
                dailyEfficiency.toFixed(2)
                + " %";
        }


        console.log(
            "History:",
            history.length,
            "data"
        );

        console.log(
            "Hourly:",
            hourlyData.length,
            "data"
        );

        console.log(
            "Daily:",
            dailyData.length,
            "data"
        );

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


if (
    menuToggle &&
    navMenu
) {

    menuToggle.addEventListener(
        "click",
        () => {

            navMenu.classList.toggle(
                "show"
            );

        }
    );

}


// =====================================================
// CLOSE MOBILE MENU
// =====================================================

document
    .querySelectorAll(
        ".nav-link"
    )
    .forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    if (navMenu) {

                        navMenu.classList.remove(
                            "show"
                        );

                    }

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
                    )
                    ===
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
