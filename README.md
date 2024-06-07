# Azure-BabylonGenAICopilot-Sample

Welcome to the Azure Babylon GenAI Copilot Sample repository on GitHub. This code base written with the help of [ChatGPT](https://chat.openai.com/) and [GitHub Copilot](https://github.com/features/copilot) serves as a reference implementation for building innovative immersive 3D visualizations and experiences powered by Generative AI copilots. The solution is built using [BabylonJS](https://babylonjs.com/) web-based 3D engine, 3D visualizations from Unreal which were worked on taking full advantage of [USD](https://www.nvidia.com/en-us/omniverse/usd/) and its interoperabitity in 3D modeling space and beyond, and Generative AI copilots powered by the latest and greatest GPT-4 family of models in [Azure AI Studio](https://ai.azure.com/).    

## Motivation

Make everything as simple as possible, but not simpler.

## Value Proposition

The value proposition of combining immersive 3D visualizations for designing, building, operating and simulating, with the power of Generative AI copilots for interpreting, analyzing, collaborating and optimizing, in the domain, industry and context of your choice is already clear and sound. It's even better when these capabilities stand on the common data foundation provided by USD ecosystem. 

This repo is specifically focusing on building a visual and interactive experience for exploration of 3D structural designs by interpreting and analyzing design specifications and documentation, to further enable build, operate and simulate phases of engineering and construction processes down the line. 

![Value Proposition](/docs/images/value_prop-dark.png)

Please note that while USD allows to additionally account for lighting for the scene, animations and different camera setups, this repo is focusing on the core functionality for the defined use case supported by geometry and materials for 3D structural designs. 

## Getting Started

Please watch How-It-Is-Built video [here](https://www.youtube.com/watch?v=27x6G4VCHcI) and read more about it [here](https://alexanikiev.medium.com/)

<a href="http://www.youtube.com/watch?feature=player_embedded&v=27x6G4VCHcI" target="_blank"><img src="http://img.youtube.com/vi/27x6G4VCHcI/0.jpg" alt="Azure EmbodiedAI Sample Setup and Demo" width="560" height="315" border="10" /></a>

You are welcome to clone this repository and play with it locally. 

To deploy Azure Cloud services supporting the project you can use Azure Cloud portal (we'll add deployment automation scripts soon). The required minimum list of components includes the following:

- Azure Machine Learning workspace with Prompt Flow
- Azure OpenAI Service with GPT-4 model(s)
- Azure AI Search (as Vector Index for Prompt Flow)
- Azure Storage account (for RAG documents behind Azure AI Search)
- Azure API Management (which will be used to expose Prompt Flow APIs)

To enable speech recognition and synthesis you will also need to deploy Azure Speech Service.

To build (from source code) and run the UI project you will need to have [Node.js](https://nodejs.org/en/download) installed on your machine and then execute the following commands in the Terminal: 

```bash
npm install
```
    
```bash
npm start
```

Alternatively you may consider packaing the UI project and deploying it as Azure Static Web App.

## Solution Architecture

The overall Technical Solution Archicture for this template would take into account a broader set of components which will be required for the full-fledged implementation of the solution according to the [Engineering Fundamentals](https://microsoft.github.io/code-with-engineering-playbook/).

![Solution Architecture](/docs/images/tech_arch-dark.png)

## Bigger Picture

This template is just a part of the bigger picture which uncovers much broader set of use cases and scenarios where Generative AI copilots can be used to enhance immersive 3D visualizations and experiences.

![Logical Architecture](/docs/images/logical_arch-dark.png)

In fact, this template can certainly become a great jump start for building your own solution for your industry.

## Prompt Flow and RAG (Retrieved Augmented Generation) Pattern

One of the foundational components of this solution is [Azure Machine Learning Prompt Flow](https://learn.microsoft.com/en-us/azure/machine-learning/prompt-flow/overview-what-is-prompt-flow) which orchestrates how we interact with Generative AI copilots. You've probably also come across orchestration patterns implemented with Microsoft [Semantic Kernel](https://github.com/microsoft/semantic-kernel) and [LangChain](https://github.com/langchain-ai/langchain).

![PromptFlow Templates](/docs/images/promptflow-templates.png)

There're 2 main flows implemented in this solution:

1. Chat Flow
2. RAG Flow (Standard Flow: Q&A on Your Data)

![PromptFlow Flows](/docs/images/promptflow-flows.png)

### Chat Flow

Chat flow is a simple flow focusing on exploration of 3D structural designs based on their USD-A representation. USD-A is an ASCII variant of USD which is human-readable and can be easily interpreted by Generative AI copilots.

![PromptFlow Flow1](/docs/images/promptflow-flow1.png)

### RAG Flow

RAG flow is a more advanced flow focusing on interpretation and analysis of design specifications and documentation. The flow is based on the RAG pattern which is a combination of retrieval and generation steps. The retrieval step is based on Azure AI Search which is used to find relevant documents based on the user query. The generation step is based on Generative AI copilots which are used to generate answers to the user questions based on the retrieved documents.

![PromptFlow Flow2](/docs/images/promptflow-flow2.png)

The knowledge base for the RAG flow is built on top of Azure AI Search which is used to index and search through the design specifications and documentation in different formats (Markdown, PDF, etc). Specifically we leveraged Prompt Flow Vector Index which is built based on `text-embedding-ada-002` vector embeddings of the documents.

![PromptFlow Vector Index](/docs/images/promptflow-vectorindex.png)