window.test = test;
window.generateCandlestickData = generateCandlestickData;
window.generate_chart = generate_chart;

function generateCandlestickData() {
    return [
        {
            time: "2019-04-08",
            open: 201.37,
            high: 203.79,
            low: 201.24,
            close: 203.55,
        },
        {
            time: "2019-04-09",
            open: 202.26,
            high: 202.71,
            low: 200.46,
            close: 200.9,
        },
        {
            time: "2019-04-10",
            open: 201.26,
            high: 201.6,
            low: 198.02,
            close: 199.43,
        },
        {
            time: "2019-04-11",
            open: 199.9,
            high: 201.5,
            low: 199.03,
            close: 201.48,
        },
        {
            time: "2019-04-12",
            open: 202.13,
            high: 204.26,
            low: 202.13,
            close: 203.85,
        },
        {
            time: "2019-04-15",
            open: 204.16,
            high: 205.14,
            low: 203.4,
            close: 204.86,
        },
        {
            time: "2019-04-16",
            open: 205.25,
            high: 205.99,
            low: 204.29,
            close: 204.47,
        },
        {
            time: "2019-04-17",
            open: 205.34,
            high: 206.84,
            low: 205.32,
            close: 206.55,
        },
        {
            time: "2019-04-18",
            open: 206.02,
            high: 207.78,
            low: 205.1,
            close: 205.66,
        },
        {
            time: "2019-04-22",
            open: 204.11,
            high: 206.25,
            low: 204.0,
            close: 204.78,
        },
        {
            time: "2019-04-23",
            open: 205.14,
            high: 207.33,
            low: 203.43,
            close: 206.05,
        },
        {
            time: "2019-04-24",
            open: 206.16,
            high: 208.29,
            low: 205.54,
            close: 206.72,
        },
        {
            time: "2019-04-25",
            open: 206.01,
            high: 207.72,
            low: 205.06,
            close: 206.5,
        },
        {
            time: "2019-04-26",
            open: 205.88,
            high: 206.14,
            low: 203.34,
            close: 203.61,
        },
        {
            time: "2019-04-29",
            open: 203.31,
            high: 203.8,
            low: 200.34,
            close: 202.16,
        },
        {
            time: "2019-04-30",
            open: 201.55,
            high: 203.75,
            low: 200.79,
            close: 203.7,
        },
        {
            time: "2019-05-01",
            open: 203.2,
            high: 203.52,
            low: 198.66,
            close: 198.8,
        },
        {
            time: "2019-05-02",
            open: 199.3,
            high: 201.06,
            low: 198.8,
            close: 201.01,
        },
        {
            time: "2019-05-03",
            open: 202.0,
            high: 202.31,
            low: 200.32,
            close: 200.56,
        },
        {
            time: "2019-05-06",
            open: 198.74,
            high: 199.93,
            low: 198.31,
            close: 199.63,
        },
        {
            time: "2019-05-07",
            open: 196.75,
            high: 197.65,
            low: 192.96,
            close: 194.77,
        },
        {
            time: "2019-05-08",
            open: 194.49,
            high: 196.61,
            low: 193.68,
            close: 195.17,
        },
        {
            time: "2019-05-09",
            open: 193.31,
            high: 195.08,
            low: 191.59,
            close: 194.58,
        },
        {
            time: "2019-05-10",
            open: 193.21,
            high: 195.49,
            low: 190.01,
            close: 194.58,
        },
        {
            time: "2019-05-13",
            open: 191.0,
            high: 191.66,
            low: 189.14,
            close: 190.34,
        },
        {
            time: "2019-05-14",
            open: 190.5,
            high: 192.76,
            low: 190.01,
            close: 191.62,
        },
        {
            time: "2019-05-15",
            open: 190.81,
            high: 192.81,
            low: 190.27,
            close: 191.76,
        },
        {
            time: "2019-05-16",
            open: 192.47,
            high: 194.96,
            low: 192.2,
            close: 192.38,
        },
        {
            time: "2019-05-17",
            open: 190.86,
            high: 194.5,
            low: 190.75,
            close: 192.58,
        },
        {
            time: "2019-05-20",
            open: 191.13,
            high: 192.86,
            low: 190.61,
            close: 190.95,
        },
        {
            time: "2019-05-21",
            open: 187.13,
            high: 192.52,
            low: 186.34,
            close: 191.45,
        },
        {
            time: "2019-05-22",
            open: 190.49,
            high: 192.22,
            low: 188.05,
            close: 188.91,
        },
        {
            time: "2019-05-23",
            open: 188.45,
            high: 192.54,
            low: 186.27,
            close: 192.0,
        },
        {
            time: "2019-05-24",
            open: 192.54,
            high: 193.86,
            low: 190.41,
            close: 193.59,
        },
    ];
}

function generate_chart() {
    const chart = LightweightCharts.createChart(
        document.getElementById('container'),
        {
            layout: {
                background: { color: "#222" },
                textColor: "#C3BCDB",
            },
            grid: {
                vertLines: { color: "#444" },
                horzLines: { color: "#444" },
            },
        }
    );
    chart.priceScale().applyOptions({
        borderColor: "#71649C",
    });

    // Setting the border color for the horizontal axis
    chart.timeScale().applyOptions({
        borderColor: "#71649C",
    });

    const currentLocale = window.navigator.languages[0];
    // Create a number format using Intl.NumberFormat
    const myPriceFormatter = Intl.NumberFormat(currentLocale, {
        style: "currency",
        currency: "EUR", // Currency for data points
    }).format;

    chart.applyOptions({
        localization: {
            priceFormatter: myPriceFormatter,
        },
    });

    const candleStickData = generateCandlestickData();

    // Create the Main Series (Candlesticks)
    const mainSeries = chart.addSeries(LightweightCharts.CandlestickSeries);
    // Set the data for the Main Series
    mainSeries.setData(candleStickData);

    // Changing the Candlestick colors
    mainSeries.applyOptions({
        wickUpColor: "rgb(54, 116, 217)",
        upColor: "rgb(54, 116, 217)",
        wickDownColor: "rgb(225, 50, 85)",
        downColor: "rgb(225, 50, 85)",
        borderVisible: false,
    });

    mainSeries.priceScale().applyOptions({
        autoScale: false, // disables auto scaling based on visible content
        scaleMargins: {
            top: 0.1,
            bottom: 0.2,
        },
    });
}


function test() {
    console.log('this is test function created by Aravind')
}