import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';


export class AppModel {

    createFileOrFolder(taskType: 'file' | 'folder', reletivePath: string = '/') {
        const projectRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
        const basepath = path.join(projectRoot, reletivePath);

        vscode.window.showInputBox({
            value:  reletivePath,
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
            fs.writeFileSync(filename, '', 'UTF-8');
        }
    }

    logError(error) {
        console.log("==============Error===============");
        console.log(error);
        console.log("===================================");
    }

}