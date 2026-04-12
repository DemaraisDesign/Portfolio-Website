const fs = require('fs');
let content = fs.readFileSync('src/components/InteractiveUserFlow.jsx', 'utf8');

// 1. Add showAll state
content = content.replace(
    'const [revealed, setRevealed] = useState(new Set());',
    'const [revealed, setRevealed] = useState(new Set());\n    const [showAll, setShowAll] = useState(false);'
);

// 2. Add 'Eye' to imports
content = content.replace(
    "import { Network, RotateCcw } from 'lucide-react';",
    "import { Network, RotateCcw, Eye } from 'lucide-react';"
);

// 3. Add handleShowAll function
const handleShowAllCode = `
    const handleShowAll = () => {
        setShowAll(true);
        setRevealed(new Set([
            'path_Y', 'path_N',
            'path2_Y', 'path2_N',
            'path3_Y', 'path3_N',
            'path4_Y', 'path4_N',
            'path5_Y', 'path5_N',
            'path6_Y', 'path6_N',
            'path7_Y', 'path7_N',
            'path8_Y', 'path8_N',
            'path8_Y_step19', 'path8_Y_step20', 'path8_Y_step21', 'path8_Y_step22'
        ]));
        setStep(22);
        setActiveStep(-1);
        setZoom(0.3); // Zoom out to see the map
        setPanOffset({ x: 0, y: -2500 });
        setIsManual(true);
    };
`;

content = content.replace(
    '// Manual Pan/Zoom overrides',
    handleShowAllCode + '\n    // Manual Pan/Zoom overrides'
);

// 4. Update Restart Button to reset showAll
content = content.replace(
    'setRevealed(new Set());\n                            setActiveStep(0);',
    'setRevealed(new Set());\n                            setActiveStep(0);\n                            setShowAll(false);'
);

// 5. Add the Show All button next to Restart (or opposite)
const showAllBtn = `
                    {/* Show All Button */}
                    <button
                        onClick={handleShowAll}
                        className="absolute top-6 left-6 p-2 text-gray-400 hover:text-brand-dark transition-colors z-30 rounded-full hover:bg-gray-100 flex items-center gap-2"
                        title="Show Full Map"
                    >
                        <Eye size={20} />
                        <span className="text-sm font-bold uppercase tracking-widest hidden md:block">Show All</span>
                    </button>
`;

content = content.replace(
    '{/* Restart Button */}',
    showAllBtn + '\n                    {/* Restart Button */}'
);

// 6. Global opacity overrides
// For Action Nodes: opacity: activeStep === X ? 1 : 0.5
content = content.replace(/opacity:\s*activeStep\s*===?\s*([0-9]+)\s*\?\s*1\s*:\s*0\.5/g, 'opacity: (showAll || activeStep === $1) ? 1 : 0.5');

// For Action Nodes scale: scale: activeStep === X ? [1, 1.05, 1] : 0.95
content = content.replace(/scale:\s*activeStep\s*===?\s*([0-9]+)\s*\?\s*\[1,\s*1\.05,\s*1\]\s*:\s*0\.95/g, 'scale: showAll ? 1 : (activeStep === $1 ? [1, 1.05, 1] : 0.95)');

// For Diamond containers: opacity: step > X ? 0.5 : 1
// -> opacity: showAll ? 1 : ...
content = content.replace(/opacity:\s*step\s*>\s*([0-9]+)\s*\?\s*0\.5\s*:\s*1/g, 'opacity: showAll ? 1 : (step > $1 ? 0.5 : 1)');

// For Diamond buttons (path === Y/N or revealed.has):
// opacity: path === 'Y' || revealed.has('path_Y') ? 0.5 : 1
content = content.replace(/opacity:\s*(path[0-9]*\s*===\s*['"][YN]['"]\s*\|\|\s*revealed\.has\(['"]path[0-9]*_[YN]['"]\))\s*\?\s*0\.5\s*:\s*1/g, 'opacity: showAll ? 1 : ($1 ? 0.5 : 1)');

// For Button scale:
// scale: path === 'Y' || revealed.has('path_Y') ? 1 : [1, 1.15, 1]
content = content.replace(/scale:\s*(path[0-9]*\s*===\s*['"][YN]['"]\s*\|\|\s*revealed\.has\(['"]path[0-9]*_[YN]['"]\))\s*\?\s*1\s*:\s*\[1,\s*1\.15,\s*1\]/g, 'scale: showAll ? 1 : ($1 ? 1 : [1, 1.15, 1])');

// Step 12 special case
content = content.replace(/opacity:\s*\(\s*activeStep\s*>=\s*8\s*&&\s*activeStep\s*<=\s*12\s*\)\s*\?\s*1\s*:\s*0\.5/g, 'opacity: (showAll || (activeStep >= 8 && activeStep <= 12)) ? 1 : 0.5');
content = content.replace(/scale:\s*\(\s*activeStep\s*>=\s*8\s*&&\s*activeStep\s*<=\s*12\s*\)\s*\?\s*\[1,\s*1\.05,\s*1\]\s*:\s*0\.95/g, 'scale: showAll ? 1 : ((activeStep >= 8 && activeStep <= 12) ? [1, 1.05, 1] : 0.95)');

fs.writeFileSync('src/components/InteractiveUserFlow.jsx', content);
console.log('Regex update applied successfully.');
