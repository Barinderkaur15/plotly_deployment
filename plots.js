function init() {
  var selector = d3.select("#selDataset")
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
})}

init();
/* Creating Variables for dashbord for functions */
function optionChanged(newSample) {
  buildMetadata(newSample);
  Barchart(newSample);
  Gaugechart(newSample);
  bubblechart(newSample);
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(key + ': ' + value); 
    })


  });
}

function Barchart(sample) {
  d3.json("samples.json").then((data) => {var resultArray = data.samples.filter(sampleObj => {
      return sampleObj.id == sample
    });
    
    var result = resultArray[0];
    var top_ten_otu_id = result.otu_ids.slice(0, 10).map(numericIds => {
      return 'OTU ' + numericIds;
    }).reverse();
    /*Reversing the results for order*/
    var top_ten_sample_value= result.sample_values.slice(0, 10).reverse();
    var top_otu_labels = result.otu_labels.slice(0, 10).reverse();
    
    var bar_parameter = [
      {
        x: top_ten_sample_value,  
        y: top_ten_otu_id,
        text: top_otu_labels,
        name: "Top 10",
        type: 'bar',
        orientation: 'h'
      }
      ];

      var data = [bar_parameter];

      var bar_layout = {
        title: "Top 10 Bacterial Species (OTUs)",
        width: 600
      
   
      };
      
      Plotly.newPlot('bar',bar_parameter, bar_layout)
    
    });
  }
  
  function Gaugechart(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata
      .filter(sampleObj => {
        return sampleObj.id == sample
      });
      console.log(resultArray);

      var result = resultArray[0];
      console.log(result);
      var wash_frequency = result.wfreq;
      console.log(wash_frequency);

      
      var gauge_chart_parameter= [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: wash_frequency,
          title: {text: "Belly Button Washing Frequency <br> (Scrubs per Week)"} ,
          type: "indicator",
          mode: "gauge+number",
          gauge:{
            axis:{visible:true,range:[null,9],tickwidth : 1}, 
            bar : {color:"grey"},
            bgcolor:"white",
            borderwidth:2,
            bordercolor:"gray",
            /*hoverinfo:'label',
            type: 'pie',
            hole: 0.4,
            rotation: 90,
            text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
            direction: 'clockwise',
            textinfo: 'text',
            textposition: 'inside',
            marker: { 
              labels: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
              hoverinfo: 'labels'},*/
            steps:[
              { range: [0, 1], color: 'rgba(255, 255, 224, 0.5)',text:'check' },
              { range: [1, 2], color: 'rgba(255, 228, 181, 0.8)' },
              { range: [2, 3], color: 'rgba(238,232,170, 0.8)' },
              { range: [3, 4], color: 'rgba(240,230,140, 0.5)'},
              { range: [4, 5], color: 'rgba(249, 168, 37, 0.5)'},
              { range: [5, 6], color: 'rgba(171, 235, 198, 0.2)'},
              { range: [6, 7], color: 'rgba(154, 205, 50, 0.5)'},
              { range: [7, 8], color: 'rgba(46,139,87, 0.5)' },
              { range: [8, 9], color: 'rgba(14,127,0, 0.5)'} ],
            
        } }
      ]
      var gauge_layout = {
        width: 800, 
        height: 600, 
        margin: { t: 10, b: 10 }
      };
      
      Plotly.newPlot('gauge', gauge_chart_parameter, gauge_layout)
    
    });
  
  }

    function bubblechart(sample) {
      d3.json("samples.json").then((data) => {
        var resultArray = data
        .samples
        .filter(sampleObj => {
          return sampleObj.id == sample
        });
        
        var result = resultArray[0];
        var otu_id = result.otu_ids
        
        var sample_value = result.sample_values
        var label = result.otu_labels
        
        var bubble_trace = {
          x: result.otu_ids,
          y: sample_value,
          text: label,
          mode: 'markers',
          marker: {
            size: sample_value ,
            color:sample_value,
            opacity:sample_value
          }
        };
    
          var data = [bubble_trace];
    
          var bubble_layout = {
            title: "Belly Button biodiversity Samples",
            showlegend: false,
            height: 500,
            width: 1500
          };
          
          Plotly.newPlot('bubble', data, bubble_layout,[{x:[0,500,1000,1500,2000,2500,3000,3500]}])
        
        });
      }
