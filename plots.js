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
  })}
  
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
        // 4. Create a variable that filters the samples for the object with the desired sample number.
        var samplesArray = samples.filter(sampleObj => sampleObj.id == sample);
        //  5. Create a variable that holds the first sample in the array.
        var firstSample = samplesArray[0]
    
        // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
        var otu_ids = firstSample.otu_ids;
        var otu_labels = firstSample.otu_labels;
        var sample_values = firstSample.sample_values;
    
        // 7. Create the yticks for the bar chart.
        // Hint: Get the the top 10 otu_ids and map them in descending order  
        //  so the otu_ids with the most bacteria are last. 
    
        var yticks = otu_ids.slice(0,10).map(otu_ids => `OTU ${otu_ids}`).reverse();
    
        // 8. Create the trace for the bar chart. 
        var barData = [{
            x: sample_values.slice(0, 10).reverse(),
            y: yticks,
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        }];
        // 9. Create the layout for the bar chart. 
        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b:100
            }
        };

      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barData, barLayout);
    });
  }