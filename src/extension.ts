'use strict';
import * as vscode from 'vscode';
import * as path from 'path';
import { AppModel } from "./appModel";

export function activate(context: vscode.ExtensionContext) {
    const appModel = new AppModel();

    context.subscriptions.push(vscode.commands.registerCommand('extension.createFile', (file: vscode.Uri) => {
        appModel.createFileOrFolder('file', file ? path.dirname(file.fsPath) : '/');
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.createFolder', (file: vscode.Uri) => {
        appModel.createFileOrFolder('folder', file ? path.dirname(file.fsPath) : '/');
    }));
}

export function deactivate() {

}