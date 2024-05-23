import React, { useState, useEffect, useRef } from 'react';
import { Avatar, Button } from '@fluentui/react-components';
import { TextField, Spinner } from '@fluentui/react';
import { Chat, ChatMessage, ChatMyMessage } from '@fluentui-contrib/react-chat';
import './Chat.css';
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import axios from 'axios';
const speechsdk = require('microsoft-cognitiveservices-speech-sdk')

const App: React.FC = () => {

    async function stt() {
        const speechConfig = speechsdk.SpeechConfig.fromSubscription(process.env.REACT_APP_AZURE_SPEECH_KEY, process.env.REACT_APP_AZURE_SPEECH_REGION);
        speechConfig.speechRecognitionLanguage = 'en-US';
    
        const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
        const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);
    
        return new Promise((resolve, reject) => {
            recognizer.recognizeOnceAsync((result : any) => {
                recognizer.close();
    
                if (result.reason === speechsdk.ResultReason.RecognizedSpeech) {
                    console.log(`RECOGNIZED: Text=${result.text}`);
                    resolve(result.text);
                } else {
                    console.log('ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.');
                    reject(new Error('Speech recognition failed'));
                }
            });
        });
    }       

    async function tts(text: string, isSystem: boolean = false) {
        const speechConfig = speechsdk.SpeechConfig.fromSubscription(process.env.REACT_APP_AZURE_SPEECH_KEY, process.env.REACT_APP_AZURE_SPEECH_REGION);
        const audioConfig = speechsdk.AudioConfig.fromSpeakerOutput();
        speechConfig.speechSynthesisVoiceName = isSystem ? "en-US-GuyNeural" : "en-US-AriaNeural";

        let synthesizer = new speechsdk.SpeechSynthesizer(speechConfig, audioConfig);

        synthesizer.speakTextAsync(
        text,
            function(result: any) {
                if (result.reason === speechsdk.ResultReason.SynthesizingAudioCompleted) {
                    console.log(`synthesis finished for "${text}"`)
                } else if (result.reason === speechsdk.ResultReason.Canceled) {
                    console.log(`synthesis failed. Error detail: ${result.errorDetails}`)
                }
                synthesizer.close();
                synthesizer = null;
            },
            function (err: string) {
                console.log(`Error: ${err}.`);

                synthesizer.close();
                synthesizer = null;
            }
        );
    }

    const [messages, setMessages] = useState([
        { from: 'System', text: 'Hello I am your Copilot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [command, setCommand] = useState('');
    const [isSystemThinking, setIsSystemThinking] = useState(false);
    const [isWireframe, setIsWireframe] = useState(false);
    const [loadedMeshes, setLoadedMeshes] = useState<BABYLON.AbstractMesh[]>([]);
    const [originalMaterials, setOriginalMaterials] = useState<Map<BABYLON.AbstractMesh, BABYLON.Material>>(new Map());
    const lastMessageRef = useRef<HTMLDivElement | null>(null);
    const sceneRef = useRef<BABYLON.Scene | null>(null);

    const handleInputChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        setInputValue(target.value);
    };    

    const handleSubmitMessage = () => {
        if (inputValue.trim() === '') return;
    
        const question = inputValue.trim();
        const userMessage = { from: 'Me', text: inputValue.trim() };
    
        setMessages([...messages, userMessage]);
        tts(inputValue.trim(), false);
        setInputValue('');
        setIsSystemThinking(true);

        //Note: Provided for clarity and illustration only here (the system prompt is embedded in Prompt Flows instead)
        const systemPrompt = `
            # This is a prompt for Azure OpenAI Completion API with GPT-4 model
            # The task is to interpret engineering construction data for a building based on JSON representation of meshes, materials and measurements collected from AutoCAD designs
            # The input is a JSON object that contains information about the building
            # The output is a text summary that describes the building's features, dimensions, and materials
            # The responses are short and concise
            # Use meshes and their names to infer the information about the building floors, walls, and other structures
            # When asked about a specific design element (mesh) a command will be also issued in XML format pointing to the mesh

            # Example
            Input:
            {
            "name": "Building A",
            "meshes": [
                {
                "type": "cube",
                "position": [0, 0, 0],
                "dimensions": [10, 10, 10],
                "material": "concrete"
                },
                {
                "type": "cylinder",
                "position": [5, 5, 10],
                "radius": 2,
                "height": 5,
                "material": "steel"
                }
            ]
            }

            Output:
            Building A is composed of two meshes: a cube and a cylinder. The cube has a side length of 10 meters and is made of concrete. It is located at the origin of the coordinate system. The cylinder has a radius of 2 meters and a height of 5 meters and is made of steel. It is located on top of the cube, with its center aligned with the center of the cube.

            ===

            #Command format pointing to a specific mesh
            <command>mesh_name</command>

            ===

            # Query
            Input:
            {
                "collections": [
                    {
                        "name": "Building_Parrent",
                        "meshes": [
                            "BaseCol_001",
                            "BaseCol_002",
                            "BaseCol_003",
                            "BaseCol_004",
                            "BaseCol_005",
                            "BaseCol_006",
                            "BaseCol_007",
                            "CWall_001",
                            "CWall_002",
                            "CWall_003",
                            "CWall_004",
                            "CWall_005",
                            "CWall_006",
                            "CWall_007",
                            "CWall_008",
                            "CWall_009",
                            "CWall_010",
                            "CWall_Panels_001",
                            "CWall_Panels_2",
                            "CWall_Panels_002",
                            "CWall_Panels_3",
                            "CWall_Panels_003",
                            "CWall_Panels_004",
                            "CWall_Panels_005",
                            "CWall_Panels_006",
                            "CWall_Panels_007",
                            "CWall_Panels_008",
                            "CWall_Panels_009",
                            "CWall_Panels_010",
                            "CWall_Panels_011",
                            "CWall_Panels_012",
                            "CWall_Panels_013",
                            "CWall_Panels_014",
                            "CWall_Panels_015",
                            "CWall_Panels_016",
                            "CWall_Panels_017",
                            "CWall_Panels_018",
                            "CWall_Panels_019",
                            "CWall_Panels_020",
                            "CWall_Panels_021",
                            "CWall_Panels_022",
                            "CWall_Panels_023",
                            "CWall_Panels_024",
                            "CWall_Panels_025",
                            "CWall_Panels_026",
                            "CWall_Panels_027",
                            "CWall_Panels_028",
                            "CWall_Panels_029",
                            "CWall_Panels_030",
                            "CWall_Panels_031",
                            "CWall_Panels_032",
                            "CWall_Panels_033",
                            "CWall_Panels_034",
                            "CWall_Panels_035",
                            "CWall_Panels_036",
                            "CWall_Panels_037",
                            "CWall_Panels_038",
                            "CWall_Panels_039",
                            "CWall_Panels_040",
                            "CWall_Panels_041",
                            "CWall_Panels_042",
                            "CWall_Panels_043",
                            "CWall_Panels_044",
                            "CWall_Panels_045",
                            "CWall_Panels_046",
                            "CWall_Panels_047",
                            "CWall_Panels_048",
                            "CWall_Panels_049",
                            "CWall_Panels_050",
                            "CWall_Panels_051",
                            "CWall_Panels_052",
                            "CWall_Panels_053",
                            "CWall_Panels_054",
                            "CWall_Panels_055",
                            "CWall_Panels_056",
                            "CWall_Panels_057",
                            "CWall_Panels_058",
                            "CWall_Panels_059",
                            "CWall_Panels_060",
                            "CWall_Panels_061",
                            "CWall_Panels_062",
                            "CWall_Panels_063",
                            "CWall_Panels_064",
                            "CWall_Panels_065",
                            "CWall_Panels_066",
                            "CWall_Panels_067",
                            "CWall_Panels_068",
                            "CWall_Panels_069",
                            "Floor_1_1",
                            "Floor_2_1",
                            "Floor_2_2",
                            "Floor_2_3",
                            "Floor_2_4",
                            "Floor_4_1",
                            "Floor_4_2",
                            "Railing_Panel_001",
                            "Railing_Panel_002",
                            "Railing_Panel_003",
                            "Railing_Panel_004",
                            "Railing_Panel_005",
                            "Railing_Panel_006",
                            "Railing_Panel_007",
                            "Railing_Panel_008",
                            "Railing_Panel_009",
                            "Railing_Panel_010",
                            "Railing_Panel_011",
                            "Railing_Panel_012",
                            "Railing_Panel_013",
                            "Railing_Panel_014",
                            "Railing_Panel_015",
                            "Railing_Panel_016",
                            "Railing_Panel_018",
                            "Railing_Panel_019",
                            "Railing_Panel_020",
                            "Railing_Panel_021",
                            "Railing_Panel_022",
                            "Railing_Panel_023",
                            "Railing_Panel_024",
                            "Railing_Panel_025",
                            "Railing_Panel_026",
                            "Railing_Panel_027",
                            "Railing_Panel_028",
                            "Railing_Panel_029",
                            "Railing_Panel_030",
                            "Railing_Panel_031",
                            "Railing_Panel_032",
                            "Railing_Panel_033",
                            "Railing_Panel_034",
                            "Railing_Panel_035",
                            "Railing_Panel_036",
                            "Railing_Panel_037",
                            "Railing_Panel_038",
                            "Railing_Panel_039",
                            "Stair_Panel_001",
                            "Stair_Panel_002",
                            "Stair_Panel_003",
                            "Stair_Panel_004",
                            "Stair_Panel_005",
                            "Stair_Panel_006",
                            "Stair_Panel_007",
                            "Stair_Panel_008",
                            "Stair_Panel_009",
                            "Stair_Panel_010",
                            "TopCol_001",
                            "TopCol_002",
                            "TopCol_003",
                            "TopCol_004",
                            "TopCol_005",
                            "Wall_001",
                            "Wall_002",
                            "Wall_003",
                            "Wall_005",
                            "Wall_006",
                            "Wall_007",
                            "Wall_008",
                            "Wall_009"
                        ]
                    }
                ]
            }
        `;

        const systemMessage = {
            role: 'system',
            content: `${JSON.stringify(systemPrompt, null, 2)}`
        };        

        const formattedMessages = [...messages, userMessage].map(message => ({
            role: message.from === 'System' ? 'assistant' : 'user',
            content: message.text
        }));

        formattedMessages.unshift(systemMessage);

        //Note: Only the question is taken forward to the API
        let data = JSON.stringify({
           "chat_history": [],
           "question": question,
           "max_length": 100,
           "temperature": 0.7
        });
        
        //TODO: Currently removed headers to avoid preflight (CORS-related)
        let promptFlow_config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: process.env.REACT_APP_AZURE_APIMGMT_ENDPOINT,
            //headers: { 
            //    'Content-Type': 'application/json', 
            //    'Ocp-Apim-Subscription-Key': `${process.env.REACT_APP_AZURE_APIMGMT_KEY}`,
            //    'Access-Control-Allow-Origin': '*'
            //},
            data: data
        };
        
        axios.request(promptFlow_config)
        .then(response => {
            let systemResponseText = response.data.answer;
            
            const commandMatch = systemResponseText.match(/<command>(.*?)<\/command>/);
            if (commandMatch && commandMatch[1]) {
                console.log("Command extracted:", commandMatch[1]);
                setCommand(commandMatch[1]);
                setIsWireframe(true);
            }
    
            if (inputValue.toLowerCase().includes('wireframe')) {
                systemResponseText = 'Activating wireframe mode...';
                setIsWireframe(true);
            }
    
            //Strip out XML tags for <command> and </command> from the output
            systemResponseText = systemResponseText.replace(/<\/?command>/g, '');
            const systemResponse = { from: 'System', text: systemResponseText };
            setMessages((prevMessages) => [...prevMessages, systemResponse]);
            tts(systemResponseText, true);
            setIsSystemThinking(false);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            const systemResponse = { from: 'System', text: 'An error occurred. Please try again later.' };
            setMessages((prevMessages) => [...prevMessages, systemResponse]);
            setIsSystemThinking(false);
        });
    };

    const handleAskQuestion = async () => {
        try {
            let text = await stt();
            const target = document.getElementById('inputField') as HTMLInputElement;
            target.value = text as string;
            setInputValue(target.value);
            //handleSubmitMessage();
        } catch (error) {
            console.error(error);
            //TODO: Handle the error accordingly
        }
    };    

    const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmitMessage();
        }
    };

    useEffect(() => {
        const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
        if (!canvas) return;

        const engine = new BABYLON.Engine(canvas, true);
        const scene = new BABYLON.Scene(engine);

        sceneRef.current = scene;
        
        const camera = new BABYLON.ArcRotateCamera("camera", 2.3, Math.PI/2, 36, new BABYLON.Vector3(-50, 0, 0), scene);
        camera.attachControl(canvas, true);
        
        new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0));

        BABYLON.SceneLoader.ImportMesh("", "/models/Building_Simplified.glb", "", scene, (meshes) => {
            const materialsMap = new Map();

            meshes.forEach(mesh => {
                if (mesh.material) {
                    materialsMap.set(mesh, mesh.material.clone(`${mesh.name}_clonedMaterial`));
                }
            });

            setOriginalMaterials(materialsMap);
            setLoadedMeshes(meshes);
        });

        //Add new materials to the scene
        const wireframeMaterial = new BABYLON.StandardMaterial("wireframeMat", scene);
        wireframeMaterial.wireframe = true;
        wireframeMaterial.alpha = 0.05;

        const yellowMaterial = new BABYLON.StandardMaterial("yellowMat", scene);
        yellowMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0); // Yellow

        const blueMaterial = new BABYLON.StandardMaterial("blueMat", scene);
        blueMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1); // Blue

        const greenMaterial = new BABYLON.StandardMaterial("greenMat", scene);
        greenMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0); // Green
        
        engine.runRenderLoop(() => {
            scene.render();
        });

        window.addEventListener("resize", function () {
            engine.resize();
        });

        return () => {
            engine.dispose();
            window.removeEventListener("resize", function () {
                engine.resize();
            });
        };
    }, []);

    useEffect(() => {
        const wireframeMaterial = sceneRef.current!.getMaterialByName("wireframeMat");
        loadedMeshes.forEach((mesh) => {
            console.log(mesh.name);
            
            if (isWireframe) {
                mesh.material = wireframeMaterial;
            } else {
                const originalMaterial = originalMaterials.get(mesh);
                if (originalMaterial !== undefined) {
                    mesh.material = originalMaterial;
                }
            }
    
            if (mesh.material && isWireframe && command !== '' && mesh.name === command) {
                switch (mesh.name) {
                    case "Wall_001":
                        mesh.material = sceneRef.current!.getMaterialByName("yellowMat");
                        break;
                    case "Floor_1_1":
                        mesh.material = sceneRef.current!.getMaterialByName("blueMat");
                        break;
                    case "Wall_009":
                        mesh.material = sceneRef.current!.getMaterialByName("greenMat");
                        break;
                }
            }
        });
    }, [isWireframe, command, loadedMeshes, originalMaterials]);    

    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);    
    
    return (
        <div className="appContainer">
            <div className="canvasContainer">
                <canvas id="myCanvas"></canvas>
                <div className="buttonOverlay">
                    <Button onClick={() => setIsWireframe(false)}>Model</Button>
                    <Button onClick={() => setIsWireframe(true)}>Wireframe</Button>
                </div>
            </div>
            
            <div className="chatContainer">
                <div className="chatMessages">
                    <Chat>
                        {messages.map((message, index) => {
                            const isLastMessage = index === messages.length - 1;
                            if (message.from === 'Me') {
                                return <ChatMyMessage ref={isLastMessage ? lastMessageRef : null} key={index}>{message.text}</ChatMyMessage>;
                            }
                            return (
                                <ChatMessage
                                    ref={isLastMessage ? lastMessageRef : null}
                                    key={index}
                                    avatar={<Avatar name={message.from} badge={{ status: message.from === 'System' ? 'available' : 'offline' }} />}
                                >
                                    {message.text}
                                </ChatMessage>
                            );
                        })}
                    </Chat>
                    {isSystemThinking && <Spinner label="System is processing..." ariaLive="assertive" />}
                </div>
                <div style={{ marginTop: '20px', padding: '10px' }}>
                    <TextField 
                        id="inputField"
                        placeholder="Type your message..."
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyPress={handleInputKeyPress}
                    />
                    <Button onClick={handleSubmitMessage} style={{ marginTop: '10px' }}>Send</Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button onClick={handleAskQuestion} style={{ marginTop: '10px' }}>Talk</Button>
                </div>
            </div>
        </div>
    );            
};

export default App;
