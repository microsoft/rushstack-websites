const path = require('path');
const { FileSystem, JsonFile } = require('@rushstack/node-core-library');

const BUILD_FOLDER = 'build';

process.chdir(`${__dirname}/..`);

FileSystem.deleteFolder(BUILD_FOLDER);

const rushConfig = JsonFile.load(path.join('..', '..', 'rush.json'));

for (let project of rushConfig.projects) {
    if (project.projectFolder.startsWith('websites/')) {
        console.log(`Copying generated build for ${project.packageName}...`);
        FileSystem.copyFiles({
            sourcePath: path.join('..', '..', project.projectFolder, BUILD_FOLDER),
            destinationPath: path.join(BUILD_FOLDER, project.packageName)
        });
    }
}

console.log('Finished.');
