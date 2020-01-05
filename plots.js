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
          title: {text: "Belly Button Washing Frequency Scrubs per Week"} ,
          type: "indicator",
          mode: "gauge+number",
          gauge:{axis:{visible:true,range:[0,9]}}
         
        }
      ];
      
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
        var top_ten_otu_id = result.otu_ids.slice(0, 10).map(numericIds => {
          return 'OTU ' + numericIds;
        }).reverse();
        
        var top_ten_sample_value = result.sample_values.slice(0, 10).reverse();
        var top_ten_label = result.otu_labels.slice(0, 10).reverse();
        
        var bubble_trace = {
          x: result.otu_ids,
          y: top_ten_sample_value,
          text: top_ten_label,
          mode: 'markers',
          marker: {
            size: top_ten_sample_value ,
            color:top_ten_sample_value,
            opacity:top_ten_sample_value
          }
        };
    
          var data = [bubble_trace];
    
          var bubble_layout = {
            title: "Top Ten Samples",
            showlegend: false,
            height: 500,
            width: 1500
          };
          
          Plotly.newPlot('bubble', data, bubble_layout,[{x:[0,500,1000,1500,2000,2500,3000,3500]}])
        
        });
      }