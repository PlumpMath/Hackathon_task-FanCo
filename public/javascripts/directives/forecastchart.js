app.directive("forecastChart", [ 'forecast', function(forecast) {

  var link = function($scope, $el, $attrs){

    $scope.forecastData = [];

		forecast.getForecast().then(function(response){
      $scope.forecastData = response.data.list;

      // Removing the first day to get rid of weather bug
        if ($scope.forecastData[$scope.forecastData.length-1].dt < $scope.forecastData[1].dt) {
          $scope.forecastData.pop();
        }


  		// parse the date!
      // var parseDate = d3.time.format("%Y-%m-%d").parse;
  		for ( i=0; i<$scope.forecastData.length; i++) {
        $scope.forecastData[i].dt = new Date(($scope.forecastData[i].dt*1000));
        $scope.forecastData[i].temp.day = Math.round(($scope.forecastData[i].temp.day-273.15)*100)/100;
  		}


      // Declare height and width variables(pixels)
      var height = 300;
      var width = 800;
      // total = 0;
      // Work out extremes
      var maxTemp = d3.max($scope.forecastData,function(d,i){
        return d.temp.day;
      });
      // console.log("Max Temp for a day is: " + maxTemp);

      var minTemp  = d3.min($scope.forecastData,function(d,i){
        return d.temp.day;
      });
      // console.log("Min Temp for a day is: " + minTemp);

      // find max value day
      for ( i=0; i<$scope.forecastData.length; i++) {
        if ($scope.forecastData[i].temp.day === maxTemp){
          // console.log("highest temp on " + $scope.forecastData[i].dt);
        }

        if($scope.forecastData[i].temp.day === minTemp){
          // console.log("lowest temp on " + $scope.forecastData[i].dt);
        }
      }

      var minDate = d3.min($scope.forecastData,function(d){ return d.dt; });
      var maxDate = d3.max($scope.forecastData, function(d){ return d.dt; });
      // console.log("minDate is " + minDate);
      // console.log("maxDate is " + maxDate);

			// Declare Scales (don't forget to invert Y range)
      var y = d3.scale.linear()
        .domain([minTemp,maxTemp])
        .range([height,0]);
      var x = d3.time.scale()
        .domain([minDate,maxDate])
        .range([0,width]);

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(16);


      var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");


			var svg = d3.select($el[0]).append("svg")
      	.attr("width", "100%")
    		.attr("height", 400)
    		.attr("style", "background: #f4f4f4");

		  // Declare margin object (adds buffer)
      var margin = {left:50,right:50,top:40,bottom:0};

      // Add all elements into group
      var chartGroup = svg.append("g")
        .attr("transform", "translate("+margin.left+","+margin.top+")");

		  var line = d3.svg.line()
        .x(function(d){ return x(d.dt); })
        .y(function(d){ return y(d.temp.day); })
        .interpolate("linear");


      // Finally add line; Append the path to group; run line generator on data
      var path = chartGroup.append("path")
      .attr("d",line($scope.forecastData))
      .attr("class", "forecast")
      .style("stroke", "steelblue")
      .style("fill", "none")
      .style("stroke-width", "1.5px");

      var totalLength = path.node().getTotalLength();

      path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
        .duration(1000)
        .ease("linear")
        .attr("stroke-dashoffset", 0);

      // Add axes (shift x-axis down)
      chartGroup.append("g").attr("class", "x axis")
      .attr("transform", "translate(0, "+height+")").call(xAxis)
      .selectAll("text")
          .attr("dx", "-0.9em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-45)")
          .style("text-anchor", "end");

      chartGroup.append("g").attr("class", "y axis").call(yAxis);

      // for the tooltip dates
      var formatTime = d3.time.format("%e %b");

      // Define the div for the tooltip
      var div = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);

      // circles
      chartGroup.selectAll("circle")
        .data($scope.forecastData)
        .enter().append("circle")
          .attr("class",function(d,i){ return "grp"+i; })
          .attr("cx",function(d,i){ return x(d.dt); })
          .attr("cy",function(d,i){ return y(d.temp.day); })
          .attr("r","2.5")
          .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(formatTime(d.dt) + "<br/>"  + d.temp.day+" °C")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
          .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
      });

      // Text label for the Y axis
      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("x", margin.top - (height / 2))
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("(°C)");
		});
	};

	return {
		restrict: "EA",
		template: '<div class="temperature"></div>',
		replace: true,
		link: link
	};

}]);