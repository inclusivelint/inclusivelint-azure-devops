import tl = require('azure-pipelines-task-lib/task');
import { scanFile, InclusiveDiagnostic } from 'inclusivelint';
const { glob } = require('glob');
import * as fs from 'fs';

function prettyPrintResults(filePath: String, diagnostics: InclusiveDiagnostic[]) {
    for (let diagnostic of diagnostics) {
        console.log(createMessage(filePath, diagnostic));
    }
}

function createMessage(filePath: String, diagnostic: InclusiveDiagnostic): String {
    return `[Warning] ${filePath}: Line ${diagnostic.lineNumber} : The term ${diagnostic.term} was found. Consider using ${diagnostic.suggestedTerms}`;
}

async function run() {
    try {
        const inputPath: string | undefined = tl.getInput('path', true);
        var listOfFiles = glob.sync(inputPath + '/**/*');

        for (let uniquePath of listOfFiles) {
            if (fs.lstatSync(uniquePath).isFile()) {
                var diagnostics: InclusiveDiagnostic[] = await scanFile(uniquePath)
                prettyPrintResults(uniquePath, diagnostics);
            }
        }
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();