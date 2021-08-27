var dataUrl = "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.json";
//https://opendata.ecdc.europa.eu/covid19/testing/json/";
//"https://opendata.ecdc.europa.eu/covid19/hospitalicuadmissionrates/json";
//"https://raw.githubusercontent.com/Institut-Zdravotnych-Analyz/covid19-data/main/DailyStats/OpenData_Slovakia_Covid_DailyStats.csv";


var parseDateY = d3.timeParse("%Y");
var parseDateM = d3.timeParse("%m");
var parseDateMD = d3.timeParse("%m/%d");
var formatDateY = d3.timeFormat("%Y");
var formatDateM = d3.timeFormat("%m");
var parseTime = d3.timeParse("%M:%S");
var formatTime = d3.timeFormat("%M:%S");
var monthFullName = d3.timeFormat("%B");
var fulldate = d3.timeParse("%Y-%m-%d");
var today = new Date();
var todaym30 = new Date();
 var padding = 100;
//{crossOrigin: "anonymous"},
    var width = window.innerWidth - padding;
    var height = window.innerHeight / 5 * 3;
d3.json(dataUrl,
  function (data) {

  
    todaym30.setDate(today.getDate() - 31) ;
    console.log(todaym30);
    console.log( todaym30 < today);


    data = data.SVK.data; 
    var datan = data.filter (d =>   
             
      (fulldate(d.date) > todaym30 ) 

     

   );  



    datan.map( d =>{
    d.date = fulldate(d.date); 
    d.new_cases = d.new_cases === undefined ? 0 : d.new_cases; 
  });
    graph(datan, 1);
    //data.map( d =>{
    //  d.date = fulldate(d.date); 
     // d.new_cases = d.new_cases === undefined ? 0 : d.new_cases; 
   // });
    //graph(data, 2);
});


 

function graph(datan, x){
  const svg = d3.select("body")
  .append("svg").attr("width", width)
  .attr("height", height)
  .style("border", "1px dotted black");
    var scaley = d3.scaleLinear()
      .domain([0, d3.max(datan, (d) => d.new_cases)])
      .range([height - padding, padding]);
    var axisy = d3.axisLeft(scaley).tickSizeOuter(0).tickFormat(d3.format(" "));
 


    svg

      .append("g")
      .attr("transform", "translate(" + padding + "," + 0 + ")")
      .attr("id", "y-axis")
      .attr("class", "tick")
      .call(axisy);



    //x

    var scalex = d3.scaleTime()
      .domain(d3.extent(datan, (d) => d.date))
      .range([padding, width - padding]);


    var axisx = d3.axisBottom(scalex);
    if (d3.max(datan, (d) => d.date).getMonth() - d3.min(datan, (d) => d.date).getMonth() > 3)
    {
    axisx.tickFormat(d3.timeFormat("%B %Y")).tickSizeOuter(0);
    } 
    else
    {
      axisx.tickFormat(d3.timeFormat("%d %m %Y")).tickSizeOuter(0);
    }

    svg

      .append("g")
      .attr("id", "x-axis")
      .attr("class", "tick")
      .attr("transform", "translate(" + (0) + "," + (height - padding) + ")")
      .call(axisx).selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-35)");



    //tooltip declarations
    var div = d3.select("body").append("div"+x)
      .attr("class", "tooltip")
      .attr("id", "tooltip")
      .style("opacity", 0);
    //lines
    //console.log(scalex.invert(200));
 


    const tooltipCircle = svg
      .append("circle")
      .attr("class", "tooltip-circle")
      .attr("r", 5)
      .attr("stroke", "#af9358")
      .attr("fill", "white")
      .attr("stroke-width", 3)
      .style("opacity", 0);
    console.log(datan);
    svg.append("path")
      .datum(datan)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2.5).attr("stroke-linejoin", "round").attr("stroke-linecap", "round")
      .attr("d", d3.line()
        .x(d => scalex(d.date))
        .y(d => scaley(d.new_cases))
      );
      svg.selectAll("circle")
      .data(datan)
      .enter().append("circle")
     
      .attr("class", "tooltip-circle")
      .attr("r", 1)
      .attr("stroke", "#af9358")
      .attr("fill", "black")
      .attr("stroke-width", 1)
      .style("opacity", 1)
      .attr("cx", d => scalex(d.date))
      .attr("data-date", d=> d.date)
      .attr("cy", (d, i) => scaley(d.new_cases))
      .on("mouseover",   function (d) {       
      div.attr("data-date", d.date);
      div.attr("data-new_cases", d.new_cases);
      div.html((
      d.date.getDate()+"."+(d.date.getMonth() + 1)+"."+d.date.getFullYear())+"<br/>" + d.new_cases+
      dni14(d, datan))//toFixed(2)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 68) + "px");
      tooltipCircle.transition().style("opacity", 1).attr('transform', 'translate('+ (d3.event.pageX-8) +','+ (d3.event.pageY-8) +')');
         div.transition()
        .duration(200)
        .style("opacity", 0.7);})
      
      .on("mouseout", function (d) {
        div.transition()
          .duration(500)
          .style("opacity", 0.4);
   
      });


    svg.append('text')
      .attr("class", "leftlegend")
      .attr("id", "leftlegend")
      .attr("transform", "translate(25," + (height / 2) + ") rotate(270)")

      .text("počty");


    //titles

    svg.append('text')
      .attr("id", "title")
      .attr("transform", "translate(" + (width / 2) + "," + padding / 2 + ")")
      .text("Počet nových prípadov PCR");
    svg.append('text')
      .attr("id", "description")
      .attr("transform", "translate(" + (width / 2) + "," + (padding / 2 + 22) + ")");
    //.text("1753 - 2015: base temperature " + middleT + "℃");

  


  }
function dni14(d,data)
{
var skrdat = d3.timeFormat("%d.%m.%Y");
var todaym14 = new Date();
todaym14.setDate(d.date.getDate() - 14);
todaym14 = skrdat(todaym14);

var index = data.findIndex( d => skrdat (d.date) == todaym14);
console.log(index);
  return "<br/>" + todaym14 + "<br/>"+ data[index].new_cases;
}


//%Y - for year boundaries, such as 2011.
//%B - for month boundaries, such as February.
//%b %d - for week boundaries, such as Feb 06.
//%a %d - for day boundaries, such as Mon 07.
//%I %p - for hour boundaries, such as 01 AM.
//%I:%M - for minute boundaries, such as 01:23.
//:%S - for second boundaries, such as :45.
//.%L - milliseconds for all other times, such as .012.