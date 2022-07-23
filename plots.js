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
//  buildCharts(newSample);
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