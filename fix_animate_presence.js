const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            results.push(file);
        }
    });
    return results;
}

const allFiles = walk(srcDir);

allFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if the file USES AnimatePresence but doesn't import it
    if (content.includes('<AnimatePresence') && !content.includes('AnimatePresence')) {
        console.log('Needs AnimatePresence: (Wait, this condition is impossible if the tag is there!)');
    }
    
    // Better check: Uses <AnimatePresence but the import { ..., AnimatePresence } from 'framer-motion' is missing
    const hasAnimatePresenceTag = content.includes('<AnimatePresence');
    const hasAnimatePresenceImport = /import\s+.*\{[^}]*AnimatePresence[^}]*\}\s+from\s+['"]framer-motion['"]/.test(content);
    
    if (hasAnimatePresenceTag && !hasAnimatePresenceImport) {
        console.log(`Fixing missed AnimatePresence import in: ${file}`);
        
        // Find existing framer-motion import
        if (content.includes('from "framer-motion"') || content.includes("from 'framer-motion'")) {
            content = content.replace(/(import\s+\{)([^}]+)(\}\s+from\s+['"]framer-motion['"])/, (match, p1, p2, p3) => {
                if (!p2.includes('AnimatePresence')) {
                     return `${p1} AnimatePresence, ${p2.trim()} ${p3}`;
                }
                return match;
            });
            fs.writeFileSync(file, content);
        } else {
             // Add fresh import
             content = `import { AnimatePresence } from "framer-motion";\n` + content;
             fs.writeFileSync(file, content);
        }
    }
});
