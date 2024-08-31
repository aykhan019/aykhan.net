var container = document.getElementById("building-deep-learning-models-with-tensorflow-modules");

const introduction = new PageLinkItem(
    1,
    "Introduction",
    "Introduction to deep learning models with TensorFlow.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/building-deep-learning-models-with-tensorflow.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/building-deep-learning-models-with-tensorflow/module-1"
);

const supervisedLearningModels = new PageLinkItem(
    2,
    "Supervised Learning Models",
    "Module on supervised learning models.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/building-deep-learning-models-with-tensorflow.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/building-deep-learning-models-with-tensorflow/module-2"
);

const supervisedLearningModelsCont = new PageLinkItem(
    3,
    "Supervised Learning Models (Cont'd)",
    "Continuation of supervised learning models.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/building-deep-learning-models-with-tensorflow.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/building-deep-learning-models-with-tensorflow/module-3"
);

const unsupervisedDeepLearningModels = new PageLinkItem(
    4,
    "Unsupervised Deep Learning Models",
    "Module on unsupervised deep learning models.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/building-deep-learning-models-with-tensorflow.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/building-deep-learning-models-with-tensorflow/module-4"
);

const unsupervisedDeepLearningModelsContAndScaling = new PageLinkItem(
    5,
    "Unsupervised Deep Learning Models (Cont'd) and Scaling",
    "Continuation of unsupervised deep learning models and scaling.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/building-deep-learning-models-with-tensorflow.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/building-deep-learning-models-with-tensorflow/module-5"
);

const modules = [
    introduction,
    supervisedLearningModels,
    supervisedLearningModelsCont,
    unsupervisedDeepLearningModels,
    unsupervisedDeepLearningModelsContAndScaling
];

addItemsToContainer(container, modules);
