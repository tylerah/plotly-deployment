// create fuction to populate drop-down menu
function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });

      // use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
  });

}
  
// call the function created above
init();

// create function optionChanged
function optionChanged(newSample) {
//  console.log(newSample);
    buildMetadata(newSample);
    buildCharts(newSample);
}

// create function buildMetadata
function buildMetadata(sample) {
    // call the json data
    d3.json("samples.json").then((data) => {
        // set the dictionary "metadata" equal to the variable metadata
        var metadata = data.metadata;
        // create resultArray to store the filtered sample from the metadata
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        // use d3 to select the panel with id of '#sample-metadata'
        var PANEL = d3.select("#sample-metadata");

        // use '.html' to clear any existing metadata
        PANEL.html("");
        // use forEach to display all of the key, value pairs for the selected sample
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
};

// create the buildCharts function.
function buildCharts(sample) {
    // use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
        // create a variable that holds the samples array. 
        var samples = data.samples;
        // create a variable that filters the samples for the object with the desired sample number.
        var samplesArray = samples.filter(sampleObj => sampleObj.id == sample);
        var metaArray = data.metadata.filter(sampleObj => sampleObj.id == sample);

        //  create a variable that holds the first sample in the array.
        var firstSample = samplesArray[0];
        var firstMeta = metaArray[0];
    
        // create variables that hold the otu_ids, otu_labels, and sample_values.
        var otu_ids = firstSample.otu_ids;
        var otu_labels = firstSample.otu_labels;
        var sample_values = firstSample.sample_values;
    
        var wfreq = firstMeta.wfreq;

        // create the yticks for the bar chart.  
        var yticks = otu_ids.slice(0,10).map(otu_ids => `OTU ${otu_ids}`).reverse();
    
        // create the trace for the bar chart. 
        var barData = [{
            x: sample_values.slice(0, 10).reverse(),
            y: yticks,
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",
            marker: {
                color: "rgb(179, 87, 41)",
                line: {
                    color: "rgb(94, 46, 22)",
                    width: 1.5
                }
            }
        }];
        // create the layout for the bar chart. 
        var barLayout = {
            title: "<b>Top 10 Bacteria Cultures Found</b>",
            xaxis: {title: "Total Cultures"},
            margin: {
                l: 75,
                r: 35,
                t: 50,
                b:35
            }
        };

        // use Plotly to plot the data with the layout. 
        Plotly.newPlot("bar", barData, barLayout);

        // create the trace for the bubble chart.
        var bubbleData = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
                }
            }
        ];

        // create the layout for the bubble chart.
        var bubbleLayout = {
            title: "<b>Bacteria Cultures Per Sample</b>",
            xaxis: {title: "OTU ID"},
            hovermode: "closest",
            showlegend: false            
        };

        // use Plotly to plot the data with the layout.
        Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

        // create gauge trace
        var gaugeData = [{
            domain: {x: [0,1], y: [0,1]},
            value: wfreq,
            title: {text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week"},
            type: "indicator",
            mode: "gauge+number",
            gauge: {
              axis: {range: [null,10]},
              bar: {color: "black"},
              steps: [
                {range: [0, 2], color: "red"},
                {range: [2, 4], color: "orange"},
                {range: [4, 6], color: "yellow"},
                {range: [6, 8], color: "lightgreen"},
                {range: [8, 10], color: "green"}]
              }
            }
          ];
          
        // create the layout for the gauge chart.
        var gaugeLayout = {
            width: 450,
            height: 400,
            margin: {t: 0, b: 0}
        };
    
        // use Plotly to plot the gauge data and layout.
        Plotly.newPlot("gauge", gaugeData, gaugeLayout);

    });

};