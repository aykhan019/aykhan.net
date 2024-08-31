var container = document.getElementById("deep-neural-networks-with-pytorch-modules");

const tensorAndDatasets = new PageLinkItem(
    1,
    "Tensor and Datasets",
    "Module covering tensors and datasets.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/deep-neural-networks-with-pytorch.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/deep-neural-networks-with-pytorch/module-1"
);

const linearRegression = new PageLinkItem(
    2,
    "Linear Regression",
    "Module on linear regression.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/deep-neural-networks-with-pytorch.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/deep-neural-networks-with-pytorch/module-2"
);

const linearRegressionPyTorchWay = new PageLinkItem(
    3,
    "Linear Regression PyTorch Way",
    "Module on linear regression with PyTorch.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/deep-neural-networks-with-pytorch.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/deep-neural-networks-with-pytorch/module-3"
);

const multipleInputOutputLinearRegression = new PageLinkItem(
    4,
    "Multiple Input Output Linear Regression",
    "Module covering multiple input-output linear regression.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/deep-neural-networks-with-pytorch.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/deep-neural-networks-with-pytorch/module-4"
);

const logisticRegressionForClassification = new PageLinkItem(
    5,
    "Logistic Regression for Classification",
    "Module on logistic regression for classification.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/deep-neural-networks-with-pytorch.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/deep-neural-networks-with-pytorch/module-5"
);

const softmaxRegression = new PageLinkItem(
    6,
    "Softmax Regression",
    "Module covering softmax regression.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/deep-neural-networks-with-pytorch.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/deep-neural-networks-with-pytorch/module-6"
);

const shallowNeuralNetworks = new PageLinkItem(
    7,
    "Shallow Neural Networks",
    "Module on shallow neural networks.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/deep-neural-networks-with-pytorch.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/deep-neural-networks-with-pytorch/module-7"
);

const deepNetworks = new PageLinkItem(
    8,
    "Deep Networks",
    "Module covering deep networks.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/deep-neural-networks-with-pytorch.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/deep-neural-networks-with-pytorch/module-8"
);

const convolutionalNeuralNetwork = new PageLinkItem(
    9,
    "Convolutional Neural Network",
    "Module on convolutional neural networks.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/deep-neural-networks-with-pytorch.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/deep-neural-networks-with-pytorch/module-9"
);

const peerReview = new PageLinkItem(
    10,
    "Peer Review",
    "Module covering peer review.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/deep-neural-networks-with-pytorch.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/deep-neural-networks-with-pytorch/module-10"
);

const modules = [
    tensorAndDatasets,
    linearRegression,
    linearRegressionPyTorchWay,
    multipleInputOutputLinearRegression,
    logisticRegressionForClassification,
    softmaxRegression,
    shallowNeuralNetworks,
    deepNetworks,
    convolutionalNeuralNetwork,
    peerReview
];

addItemsToContainer(container, modules);
