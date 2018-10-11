'use strict';
import { ExtensionContext, Uri, commands } from 'vscode';
import { AppModel } from "./appModel";

export function activate(context: ExtensionContext) {
    const appModel = new AppModel();

    context.subscriptions.push(commands.registerCommand('extension.createFile', (file: Uri) => {
        appModel.createFileOrFolder('file', file ? appModel.findDir(file.fsPath) : '/');
    }));

    context.subscriptions.push(commands.registerCommand('extension.createFolder', (file: Uri) => {
        appModel.createFileOrFolder('folder', file ? appModel.findDir(file.fsPath) : '/');
    }));
}


export function deactivate() {

}
