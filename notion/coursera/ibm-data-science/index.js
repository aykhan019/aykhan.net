var container = document.getElementById("ibm-data-science-courses");

const data_science_course = new PageLinkItem(
    1, 
    "Data Analysis with Python", 
    "Notes from the Data Analysis with Python course on Coursera.", 
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/data-analysis-with-python.jpg", 
    "https://aykhan.net/notion/coursera/ibm-data-science/data-analysis-with-python"
);

addItemsToContainer(container, [data_science_course]);
