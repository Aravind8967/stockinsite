document.addEventListener('DOMContentLoaded', function () {
    // Fetch data from the Flask backend
    fetch('/data')
        .then(response => response.json())
        .then(data => {
            // Render Area Chart
            Highcharts.chart('areaChart', {
                title: { text: 'Area Chart' },
                series: [{
                    type: 'area',
                    name: 'Area Data',
                    data: data.area_data.map(item => [new Date(item.time).getTime(), item.value]),
                }]
            });

            // Render Candlestick Chart
            Highcharts.chart('candlestickChart', {
                title: { text: 'Candlestick Chart' },
                series: [{
                    type: 'candlestick',
                    name: 'Candlestick Data',
                    data: data.candlestick_data.map(item => [
                        new Date(item.time).getTime(),
                        item.open,
                        item.high,
                        item.low,
                        item.close,
                    ]),
                }]
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});