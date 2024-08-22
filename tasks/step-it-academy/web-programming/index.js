let container = document.getElementById("tasks");

const institution = "step-it-academy";
const lessonName = "web-programming";
const lessonNameNormalized = "Web Programming";
const descriptions = [
    'Phones with informative screens',
    'Manage personal informations, tasks, and meetings',
    'HTML5 Learning and Exercise Website',
    'Onepage MultiPurpose Website Template',
    'Menu and contact information for Brunch restaurant',
    'Restaruant template for Food Finda restaruant',
    '7 Registration form templates',
    'E-portfolio created using Bootstrap',
    'Studio website template using Bootstrap',
    'Website template created using SASS'
]
const taskCount = descriptions.length;

var tasks = getTasks(taskCount, lessonNameNormalized, lessonName, institution, descriptions);

addItemsToContainer(container, tasks);

