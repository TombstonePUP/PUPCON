const fs = require('fs');
const { execSync } = require('child_process');

const status = execSync('git status -s').toString();
const unmerged = status.split('\n').filter(line => line.startsWith('UU') || line.startsWith('DU') || line.startsWith('UD')).map(line => line.slice(3).trim());

let output = '';

unmerged.forEach(file => {
    if (!fs.existsSync(file)) return;
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    let inConflict = false;
    let conflictBlock = [];
    
    output += `\n=== CONFLICTS IN ${file} ===\n`;
    
    lines.forEach((line, i) => {
        if (line.startsWith('<<<<<<<')) {
            inConflict = true;
            conflictBlock = [];
            conflictBlock.push(`--- Line ${i + 1} ---`);
        }
        
        if (inConflict) {
            conflictBlock.push(line);
        }
        
        if (line.startsWith('>>>>>>>')) {
            inConflict = false;
            conflictBlock.push(line);
            output += conflictBlock.join('\n') + '\n\n';
        }
    });
});

fs.writeFileSync('conflicts.txt', output);
console.log('Done');
