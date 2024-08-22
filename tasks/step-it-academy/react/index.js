let container = document.getElementById("tasks");

const institution = "step-it-academy";
const lessonName = "react";
const lessonNameNormalized = "React -";
const descriptions = [
    'Custom React Website',
    'Task using React Props',
    'Products Shop in React',
    'React Product Editor',
    'No Task',
    'React Cars Task (RH Car Dealership)',
    'BestOil Gas Filling Station',
    'No Task',
    'No Task',
    'React Quizzes Task',
    'React: useContext and Axios integration',
    'React Quizzes Task using Class Components',
    'Exam Project - KhanLibrary',
    'No Task',
    'Exam Project - KhanLibrary',
    'No Task'
]

const taskCount = descriptions.length;

var tasks = getTasks(taskCount, lessonNameNormalized, lessonName, institution, descriptions);

addItemsToContainer(container, tasks);

