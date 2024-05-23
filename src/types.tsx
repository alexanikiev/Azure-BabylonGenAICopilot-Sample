import * as BABYLON from 'babylonjs';
import * as BABYLON_GUI from 'babylonjs-gui';

export type CameraType = {
    object?: BABYLON.ArcRotateCamera;
    gui?: BABYLON.UniversalCamera;
    viewWidth?: number;
};

export type SceneParamsType = {
    clearColor: BABYLON.Color4;
    bgColor : BABYLON.Color3;
    gutterSize: number;
};

export type ScreenType = {
    width?: number;
    height?: number;
    ratio?: number;
};

export type LightsType = {
    dirLightObject?: BABYLON.DirectionalLight;
}

export type EnvType = {
    skybox?: BABYLON.Mesh;
    skyboxMaterial?: BABYLON.PBRMaterial;
}

export type GUIType = {
    texture?: BABYLON_GUI.AdvancedDynamicTexture;
    buttonContainer?: BABYLON_GUI.Grid;
    buttonGridObject?: BABYLON_GUI.Grid;
    objectVar1Btn?: BABYLON_GUI.Button;
    objectVar1BtnShape?: BABYLON_GUI.Ellipse;
    objectVar2Btn?: BABYLON_GUI.Button;
    objectVar2BtnShape?: BABYLON_GUI.Ellipse;
    objectButtons?: BABYLON_GUI.Ellipse[];
}

export type ActiveButtonType = {
    object?: BABYLON_GUI.Ellipse;
}

export type InfraType = {
    building?: BABYLON.AbstractMesh;
    groundObject?: BABYLON.AbstractMesh;
}

export type MeshesMatsType = {
    groundObject?: BABYLON.NodeMaterial;
}

export type MeshesParametersType = {
    groundColor?: BABYLON.NodeMaterialBlock;
}