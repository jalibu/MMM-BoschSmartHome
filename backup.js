 generateCharts(rooms) {

    const width = 120;
    const height = 120;
    const chartCallback = (ChartJS) => {
      // Global config example: https://www.chartjs.org/docs/latest/configuration/
      ChartJS.defaults.global.elements.rectangle.borderWidth = 2;
      // Global plugin example: https://www.chartjs.org/docs/latest/developers/plugins.html
      ChartJS.plugins.register({
        // plugin implementation
      });
      // New chart type example: https://www.chartjs.org/docs/latest/developers/charts.html
      ChartJS.controllers.MyType = ChartJS.DatasetController.extend({
        // chart implementation
      });
    };
    const canvasRenderService = new CanvasRenderService(
      width,
      height,
      chartCallback
    );

    const configuration = {
      type: "doughnut",
      data: {
        labels: ["", "Purple", ""],
        datasets: [
          {
            data: [88.5, 1, 10.5],
            backgroundColor: [
              "rgba(0,0,0,0)",
              "rgba(255,255,255,1)",
              "rgba(0,0,0,0)"
            ],
            borderColor: [
              "rgba(0, 0, 0 ,0)",
              "rgba(46, 204, 113, 1)",
              "rgba(0, 0, 0 ,0)"
            ],
            borderWidth: 3
          }
        ]
      },
      options: {
        cutoutPercentage: 95,
        rotation: 1 * Math.PI,
        circumference: 1 * Math.PI,
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      }
    };

    for (let room of rooms) {
      const twinguard = room.devices.find(
        (device) => device.deviceModel === "TWINGUARD"
      );
      if (twinguard) {
        const airQualityService = twinguard.services.find(
          (service) => service.id === "AirQualityLevel"
        );
        if (airQualityService) {
          airQualityService.charts = {
            purity: await canvasRenderService.renderToDataURL(configuration),
            humidity: await canvasRenderService.renderToDataURL(configuration),
            temperature: await canvasRenderService.renderToDataURL(
              configuration
            )
          };
        }
      }
    }
}

