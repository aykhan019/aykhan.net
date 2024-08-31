var container = document.getElementById("introduction-to-computer-vision-and-image-processing-modules");

const introductionToComputerVision = new PageLinkItem(
    1,
    "Introduction to Computer Vision",
    "Introduction to Computer Vision module details.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/introduction-to-computer-vision-and-image-processing.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/introduction-to-computer-vision-and-image-processing/module-1"
);

const imageProcessingWithOpenCVAndPillow = new PageLinkItem(
    2,
    "Image Processing with OpenCV and Pillow",
    "Module on image processing with OpenCV and Pillow.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/introduction-to-computer-vision-and-image-processing.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/introduction-to-computer-vision-and-image-processing/module-2"
);

const machineLearningImageClassification = new PageLinkItem(
    3,
    "Machine Learning Image Classification",
    "Module covering machine learning image classification.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/introduction-to-computer-vision-and-image-processing.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/introduction-to-computer-vision-and-image-processing/module-3"
);

const neuralNetworksAndDeepLearningForImageClassification = new PageLinkItem(
    4,
    "Neural Networks and Deep Learning for Image Classification",
    "Module on neural networks and deep learning for image classification.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/introduction-to-computer-vision-and-image-processing.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/introduction-to-computer-vision-and-image-processing/module-4"
);

const objectDetection = new PageLinkItem(
    5,
    "Object Detection",
    "Module covering object detection techniques.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/introduction-to-computer-vision-and-image-processing.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/introduction-to-computer-vision-and-image-processing/module-5"
);

const trafficSignClassification = new PageLinkItem(
    6,
    "Traffic Sign Classification",
    "Module on traffic sign classification.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/introduction-to-computer-vision-and-image-processing/traffic-sign-classification.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/introduction-to-computer-vision-and-image-processing/module-6"
);

const modules = [
    introductionToComputerVision,
    imageProcessingWithOpenCVAndPillow,
    machineLearningImageClassification,
    neuralNetworksAndDeepLearningForImageClassification,
    objectDetection,
    trafficSignClassification
];

addItemsToContainer(container, modules);
