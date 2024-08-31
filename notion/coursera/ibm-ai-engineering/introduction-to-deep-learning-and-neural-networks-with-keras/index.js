var container = document.getElementById("introduction-to-deep-learning-and-neural-networks-with-keras-modules");

const introductionToNeuralNetworksAndDeepLearning = new PageLinkItem(
    1,
    "Introduction to Neural Networks and Deep Learning",
    "Introduction to Neural Networks and Deep Learning module details.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/introduction-to-deep-learning-and-neural-networks-with-keras.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/introduction-to-deep-learning-and-neural-networks-with-keras/module-1"
);

const artificialNeuralNetworks = new PageLinkItem(
    2,
    "Artificial Neural Networks",
    "Module covering artificial neural networks.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/introduction-to-deep-learning-and-neural-networks-with-keras.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/introduction-to-deep-learning-and-neural-networks-with-keras/module-2"
);

const kerasAndDeepLearningLibraries = new PageLinkItem(
    3,
    "Keras and Deep Learning Libraries",
    "Module on Keras and deep learning libraries.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/introduction-to-deep-learning-and-neural-networks-with-keras.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/introduction-to-deep-learning-and-neural-networks-with-keras/module-3"
);

const deepLearningModels = new PageLinkItem(
    4,
    "Deep Learning Models",
    "Module covering deep learning models.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/introduction-to-deep-learning-and-neural-networks-with-keras.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/introduction-to-deep-learning-and-neural-networks-with-keras/module-4"
);

const objectDetectionAndSummary = new PageLinkItem(
    5,
    "Object Detection and Summary",
    "Module on object detection and summary.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/introduction-to-deep-learning-and-neural-networks-with-keras.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/introduction-to-deep-learning-and-neural-networks-with-keras/module-5"
);

const modules = [
    introductionToNeuralNetworksAndDeepLearning,
    artificialNeuralNetworks,
    kerasAndDeepLearningLibraries,
    deepLearningModels,
    objectDetectionAndSummary
];

addItemsToContainer(container, modules);
