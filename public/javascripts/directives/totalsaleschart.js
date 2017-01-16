app.directive("linearChart", [ 'sales', function(sales) {

  var link = function($scope, $el, $attrs){

    $scope.salesData = [];
    $scope.weatherData = [];

		sales.getSales().then(function(response){
      $scope.salesData = response.data;

      sales.getRawHistory().then(function(response){
      $scope.weatherData = response.data;
      weatherData = $scope.weatherData.splice(0,358);
      console.log(response);
      console.log(weatherData);
      

     

  		//Nest + Rollup for Total Sales
      var totalData = d3.nest()
			.key(function(d){ return (d.WeekOf); }).sortKeys(d3.ascending)
			.rollup(function(d){
				return d3.sum(d, function(g){
				  return g.SalesUnits;
				});
			}).entries($scope.salesData);


  		// parse the dates!
      var parseDate = d3.time.format("%Y-%m-%d").parse;
  		
      for ( i=0; i<totalData.length; i++) {
        totalData[i].key = parseDate(totalData[i].key);
  		}

       weatherData.forEach(function(d){
        d.date = parseDate(d.date);
        d.maxtempC = +d.maxtempC;
      })
        console.log(weatherData);
      

      // for ( i=0; i<$scope.weatherData.length; i++) {
      //   $scope.weatherData[i].date = parseDate($scope.weatherData[i].date);
  		// }

      // console.log($scope.weatherData);

       


      // Declare height and width variables(pixels)
      var height = 300;
      var width = 800;
      // total = 0;
      // Work out extremes
      var maxSales = d3.max(totalData,function(d,i){
        return d.values;
      });

      var maxHigh = d3.max(weatherData, function(d,i){
        return d.maxtempC;
      });

      var minHigh = d3.min(weatherData, function(d,i){
        return d.maxtempC;
      });

      console.log(maxHigh);
      console.log(minHigh);

      // find max temp day
      // for ( i=0; i<weatherData.length; i++) {
      //   if (weatherData[i].maxtempC === maxHigh){
      //     console.log(weatherData[i]);
      //   }
      // }

      var minDate = d3.min(totalData,function(d){ return d.key; });
      var maxDate = d3.max(totalData, function(d){ return d.key; });
     
      var minDate2 = d3.min($scope.weatherData,function(d){ return d.date; });
      var maxDate2 = d3.max($scope.weatherData, function(d){ return d.date; });
      console.log(minDate);
      console.log(minDate2);
      // console.log("Max Sales for a day is: " + maxSales);

      // find max value day
      for ( i=0; i<totalData.length; i++) {
        if (totalData[i].values === maxSales){
          // console.log("most shit sold on " + totalData[i].key);
        }
      }

      var minDate = d3.min(totalData,function(d){ return d.key; });
      var maxDate = d3.max(totalData, function(d){ return d.key; });
      // console.log("minDate is " + minDate);
      // console.log("maxDate is " + maxDate);


			// Declare Scales + axes (don't forget to invert Y range)
      var y = d3.scale.linear()
        .domain([0,maxSales])
        .range([height,0]);

      var y2 = d3.scale.linear()
        .domain([-15, maxHigh])
        .range([height,0])

      var x = d3.time.scale()
        .domain([minDate,maxDate])
        .range([0,width]);

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

      var yAxis = d3.svg.axis()
        .scale(y)
        .ticks(5)
        .orient("left");

      var yAxis2 = d3.svg.axis()
        .scale(y2)
        .ticks(12)
        .orient("right");


			var svg = d3.select($el[0]).append("svg")
      	.attr("width", "100%")
    		.attr("height", height + 100)
    		.attr("style", "background: #f4f4f4");

		  // Declare margin object (adds buffer)
      var margin = {left:80,right:50,top:40,bottom:0};

      // Add all elements into group
      var chartGroup = svg.append("g")
        .attr("transform", "translate("+margin.left+","+margin.top+")");

		  var line = d3.svg.line()
        .x(function(d){ return x(d.key); })
        .y(function(d){ return y(d.values); })
        .interpolate("cardinal");
		 
      var line2 = d3.svg.line()
        .x(function(d){ return x(d.date); })
        .y(function(d){ return y2(d.maxtempC); })
        .interpolate("cardinal");

      // Finally add line; Append the path to group; run line generator on data
      chartGroup.append("path").attr("d",line(totalData));
      chartGroup.append("path").attr("d",line2(weatherData));

      // Add axes to group (shift x-axis down)
      chartGroup.append("g").attr("class", "x axis")
      .attr("transform", "translate(0, "+height+")").call(xAxis);
      chartGroup.append("g").attr("class", "y axis").call(yAxis);
      
      // temp axis
      chartGroup.append("g").attr("class", "y2 axis")
      .attr("transform", "translate("+width+",0)").call(yAxis2);

      // circles
      chartGroup.selectAll("circle")
        .data(totalData)
        .enter().append("circle")
          .attr("class",function(d,i){ return "grp"+i; })
          .attr("cx",function(d,i){ return x(d.key); })
          .attr("cy",function(d,i){ return y(d.values); })
          .attr("r","2");
      
      // chartGroup.selectAll("circle")
      //   .data(weatherData)
      //   .enter().append("circle")
      //     .attr("class",function(d,i){ return "temp"+i; })
      //     .attr("cx",function(d,i){ return x(d.date); })
      //     .attr("cy",function(d,i){ return y(d.maxtempC); })
      //     .attr("r","2");
      });
		});
	};

	return {
		restrict: "EA",
		template: '<div class="fuck"</div>',
		replace: true,
		link: link
	};

}]);