import React from 'react';

/**
 * Image Tuning Tool
 * 
 * Drop this component into any view containing an image you need to perfectly 
 * position within a complex layout. Use the sliders to dial in the exact scale, 
 * translation offsets, and responsive focal crop points (object-position). 
 * 
 * The final styled values will print at the bottom of the panel for you to hardcode 
 * into the component once you're done tuning.
 * 
 * NOTE: Ensure the parent component holds the actual state values passed to these props
 * and applies them to the target image in real-time.
 */
const ImageTuningTool = ({
    devScale, setDevScale,
    devXOffset, setDevXOffset,
    devYOffset, setDevYOffset,
    devFocusX, setDevFocusX,
    devFocusY, setDevFocusY,
    themeColor = "#FACC15" // Default yellow
}) => {
    return (
        <div className="fixed bottom-8 left-8 z-50 bg-black/90 p-4 rounded-lg border border-white/20 text-white font-mono text-xs w-64 shadow-2xl">
            <h4 className="font-bold mb-3 pb-2 border-b border-white/20" style={{ color: themeColor }}>Image Tuning Tool</h4>

            <div className="space-y-4">
                <div>
                    <div className="flex justify-between mb-1">
                        <span>Scale</span>
                        <span>{devScale}</span>
                    </div>
                    <input type="range" min="1" max="2" step="0.05" value={devScale} onChange={e => setDevScale(parseFloat(e.target.value))} className="w-full" />
                </div>

                <div>
                    <div className="flex justify-between mb-1">
                        <span>X Translation (vw)</span>
                        <span>{devXOffset}vw</span>
                    </div>
                    <input type="range" min="-10" max="60" step="1" value={devXOffset} onChange={e => setDevXOffset(parseInt(e.target.value))} className="w-full" />
                </div>

                <div>
                    <div className="flex justify-between mb-1">
                        <span>Crop Focus X (%)</span>
                        <span>{devFocusX}%</span>
                    </div>
                    <input type="range" min="0" max="100" step="1" value={devFocusX} onChange={e => setDevFocusX(parseInt(e.target.value))} className="w-full" />
                </div>

                <div>
                    <div className="flex justify-between mb-1">
                        <span>Y Translation Override (vw)</span>
                        <span>{devYOffset}vw</span>
                    </div>
                    <input type="range" min="-30" max="30" step="1" value={devYOffset} onChange={e => setDevYOffset(parseInt(e.target.value))} className="w-full" />
                </div>

                {devFocusY !== undefined && setDevFocusY !== undefined && (
                    <div>
                        <div className="flex justify-between mb-1">
                            <span>Crop Focus Y (%)</span>
                            <span>{devFocusY}%</span>
                        </div>
                        <input type="range" min="0" max="100" step="1" value={devFocusY} onChange={e => setDevFocusY(parseInt(e.target.value))} className="w-full" />
                    </div>
                )}

                <div className="pt-2 mt-2 border-t border-white/20 break-all select-all font-bold" style={{ color: themeColor }}>
                    <p className="mb-1 leading-tight">style={`{{ x: "${devXOffset}vw", scale: ${devScale} }}`}</p>
                    {devYOffset !== 0 && <p className="mb-1 leading-tight">Y Offset: {devYOffset}vw</p>}
                    <p className="leading-tight">object-[{devFocusX}%_{devFocusY !== undefined ? devFocusY : '35'}%]</p>
                </div>
            </div>
        </div>
    );
};

export default ImageTuningTool;
