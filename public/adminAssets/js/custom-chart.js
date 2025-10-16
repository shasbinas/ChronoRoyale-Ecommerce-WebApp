(function ($) {
  "use strict";

  /*Sale statistics Chart*/
  if ($("#myChart").length) {
    var ctx = document.getElementById("myChart").getContext("2d");
    var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: "line",

      // The data for our dataset
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "Sales",
            tension: 0.3,
            fill: true,
            backgroundColor: "rgba(44, 120, 220, 0.2)",
            borderColor: "rgba(44, 120, 220)",
            data: [18, 17, 4, 3, 2, 20, 25, 31, 25, 22, 20, 9],
          },
          {
            label: "Visitors",
            tension: 0.3,
            fill: true,
            backgroundColor: "rgba(4, 209, 130, 0.2)",
            borderColor: "rgb(4, 209, 130)",
            data: [40, 20, 17, 9, 23, 35, 39, 30, 34, 25, 27, 17],
          },
          {
            label: "Products",
            tension: 0.3,
            fill: true,
            backgroundColor: "rgba(380, 200, 230, 0.2)",
            borderColor: "rgb(380, 200, 230)",
            data: [30, 10, 27, 19, 33, 15, 19, 20, 24, 15, 37, 6],
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
            },
          },
        },
      },
    });
  } //End if

  /*order Status Chart*/
  if ($("#myChart2").length) {
    var canvas = document.getElementById("myChart2");

    var donutLabels = JSON.parse(canvas.getAttribute("data-labels"));
    var donutData = JSON.parse(canvas.getAttribute("data-values"));

    // Map each status to a specific color
    const statusColors = {
      Delivered: "#7bcf86", // Green
      Pending: "#ffcd56", // Yellow
      Shipped: "#5897fb", // Blue
      "Out for Delivery": "#d595e5", // Purple
      Cancelled: "#ff6b6b", // Red
      Processing: "#f39c12",
    };

    // Generate color array dynamically according to donutLabels
    const backgroundColors = donutLabels.map(
      (label) => statusColors[label] || "#9b59b6"
    ); // fallback color

    var ctx = canvas.getContext("2d");
    var myChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: donutLabels,
        datasets: [
          {
            data: donutData,
            backgroundColor: backgroundColors,
            hoverOffset: 10,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: "bottom",
            labels: { usePointStyle: true },
          },
        },
      },
    });
  }
})(jQuery);
