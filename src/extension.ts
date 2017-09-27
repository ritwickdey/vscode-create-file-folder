'use strict';
import * as vscode from 'vscode';
import { AppModel } from "./appModel";

export function activate(context: vscode.ExtensionContext) {
    const appModel = new AppModel();

    context.subscriptions.push(vscode.commands.registerCommand('extension.createFile', path => {
        appModel.createFileOrFolder('file', path || '/');
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.createFolder', path => {
        appModel.createFileOrFolder('folder', path || '/');
    }));
}

export function deactivate() {
    
}