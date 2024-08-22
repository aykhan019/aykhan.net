let container = document.getElementById("tasks");

const institution = "step-it-academy";
let lessonName = "asp-net";
let lessonNameNormalized = "ASP.NET -";
const descriptions = [
    'Yummy Restaruant Template',
    'Custom Users Manager',
    'Khanstore Website Template',
    'Products Management System With Database',
    'No Task Assigned',

    'Products Management System With Database',
    'Products Management System With Database',
    'No Task Assigned',
    'Products Management System With Database',
    'No Task Assigned',

    'Task using WEB API',
    'Task using WEB API',
    'No Task Assigned',
    'Task using WEB API',
    'No Task Assigned',

    'No Task Assigned',
    'Task using WEB API',
    'No Task Assigned',
    'No Task Assigned',
    'No Task Assigned',

    'ASP.NET - Exam Project - Zust',
    'ASP.NET - Exam Project - Zust',
    'ASP.NET - Exam Project - Zust',
    'No Task Assigned',
    'ASP.NET - Exam Project - Zust',

    'ASP.NET - Exam Project - Zust',
    'ASP.NET - Exam Project - Zust',
    'ASP.NET - Exam Project - Zust',
    'ASP.NET - Exam Project - Zust',
    'ASP.NET - Exam Project - Zust'
]

const taskCount = descriptions.length;

var tasks = getTasks(taskCount, lessonNameNormalized, lessonName, institution, descriptions);

addItemsToContainer(container, tasks);

