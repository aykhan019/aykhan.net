let container = document.getElementById("tasks");

const institution = "step-it-academy";
const lessonName = "java-script";
const lessonNameNormalized = "Java Script -";
const descriptions = [
    'Simple Calculator using  JS',
    'Memory Game using  JS',
    '2D Football Game using  JS',
    'Java Script Custom Slider',
    'Take Notes in Calendar. Save Notes using Cookies',
    'Game Agar.io. Eat foods to get bigger',
    'Cinema Website Template using API',
    'No Task Assigned',
    'Sign Up, Log In form using jQuery',
    'No Task',
    'Website Header builder using jQuery',
    'No Task',
    'Sign In To See Movies'
]

const taskCount = descriptions.length;

var tasks = getTasks(taskCount, lessonNameNormalized, lessonName, institution, descriptions);

addItemsToContainer(container, tasks);

