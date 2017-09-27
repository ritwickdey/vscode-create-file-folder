'use strict';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { AppModel } from "./appModel";

export function activate(context: vscode.ExtensionContext) {
    const appModel = new AppModel();

    context.subscriptions.push(vscode.commands.registerCommand('extension.createFile', (file: vscode.Uri) => {
        appModel.createFileOrFolder('file', file ? findDir(file.fsPath) : '/');
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.createFolder', (file: vscode.Uri) => {
        appModel.createFileOrFolder('folder', file ? findDir(file.fsPath) : '/');
    }));
}

function findDir(filePath: string) {
    if (fs.statSync(filePath).isFile())
        return path.dirname(filePath);

    return filePath;
}

export function deactivate() {

}