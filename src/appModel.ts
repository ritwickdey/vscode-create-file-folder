import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';


export class AppModel {

    createFileOrFolder(taskType: 'file' | 'folder', relativePath?: string) {
        relativePath = relativePath || '/';
        const projectRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
        if (path.resolve(relativePath) === relativePath)
            relativePath = relativePath.substring(projectRoot.length).replace(/\\/g, "/");

        if (!relativePath.endsWith("/")) relativePath += '/';
        const basepath = projectRoot;

        vscode.window.showInputBox({
            value: relativePath || '/',
            prompt: `Create New ${taskType} (/path/subpath/to/${taskType})`,
            ignoreFocusOut: true,
            valueSelection: [-1, -1]
        }).then((fullpath) => {
            if (!fullpath) return;
            try {
                let paths = fullpath.split('>').map(e => e.trim());
                let targetpath = taskType === 'file' ? path.dirname(paths[0]) : paths[0];
                paths[0] = taskType === 'file' ? path.basename(paths[0]) : '/';
                targetpath = path.join(basepath, targetpath);
                paths = paths.map(e => path.join(targetpath, e));

                if (taskType === 'file')
                    this.makefiles(paths);
                else
                    this.makefolders(paths);



                if (taskType === 'file') {
                    let openPath = paths.find(path => fs.lstatSync(path).isFile())
                    if(!openPath) return;
                    vscode.workspace.openTextDocument(openPath)
                        .then((editor) => {
                            if (!editor) return;
                            vscode.window.showTextDocument(editor);
                        });
                }
            } catch (error) {
                this.logError(error);
                vscode.window.showErrorMessage("Somthing went wrong! Please report on GitHub");
            }

        });
    }

    makefiles(filepaths: string[]) {
        filepaths.forEach(filepath => this.makeFileSync(filepath));
    }

    makefolders(files: string[]) {
        files.forEach(file => this.makeDirSync(file));
    }

    makeDirSync(dir: string) {
        if (fs.existsSync(dir)) return;
        if (!fs.existsSync(path.dirname(dir))) {
            this.makeDirSync(path.dirname(dir));
        }
        fs.mkdirSync(dir);
    }

    makeFileSync(filename: string) {
        if (!fs.existsSync(filename)) {
            this.makeDirSync(path.dirname(filename));
            fs.createWriteStream(filename).close();
        }
    }


    findDir(filePath: string) {
        if(!filePath) return null;
        if (fs.statSync(filePath).isFile())
            return path.dirname(filePath);

        return filePath;
    }

    logError(error) {
        console.log("==============Error===============");
        console.log(error);
        console.log("===================================");
    }

}