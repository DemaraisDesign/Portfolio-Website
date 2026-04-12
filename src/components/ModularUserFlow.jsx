import React, { useState, useEffect, useRef } from "react";
import { Network, RotateCcw } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useGesture } from "@use-gesture/react";

const TYPES = {
  GOAL: "GOAL",
  ACTION: "ACTION",
  DECISION: "DECISION",
  FAIL: "FAIL",
  SUCCESS: "SUCCESS",
  JUMP: "JUMP",
};

export default function ModularUserFlow({ flowData, color = "#00CAE3" }) {
  // --- STATE MANAGEMENT ---
  const [activeStepId, setActiveStepId] = useState(flowData[0]?.id || null);
  const [revealedNodes, setRevealedNodes] = useState(
    new Set([flowData[0]?.id]),
  );
  const [branchSelections, setBranchSelections] = useState({}); // Track Y/N choices for decisions

  // Camera state
  const [isManual, setIsManual] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [dynamicCamera, setDynamicCamera] = useState({ x: 0, y: 0 });

  // DOM References for coordinate sampling
  const containerRef = useRef(null);
  const nodeRefs = useRef({}); // Maps nodeId -> DOM element

  // Calculate generic flow stats for the header
  const getFlowStats = (nodes) => {
    let actions = 0;
    let decisions = 0;
    let fails = 0;
    const countNodes = (branch) => {
      branch.forEach((node) => {
        if (node.type === TYPES.ACTION) actions++;
        if (node.type === TYPES.DECISION) decisions++;
        if (node.type === TYPES.FAIL) fails++;
        if (node.yesBranch) countNodes(node.yesBranch);
        if (node.noBranch) countNodes(node.noBranch);
      });
    };
    countNodes(nodes);
    return { actions, decisions, fails };
  };
  const stats = getFlowStats(flowData);

  // --- CAMERA ENGINE ---
  // Neutralize native zooming
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleWheel = (e) => {
      if (e.ctrlKey) e.preventDefault();
    };
    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 1) e.preventDefault();
    };
    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  // Update dynamic camera target based on active node DOM position
  useEffect(() => {
    if (!activeStepId) return;

    // We need a slight delay to allow Framer Motion to actually mount the newly revealed node
    // before we try to sample its physical coordinates.
    const measureAndPan = setTimeout(() => {
      const activeEl = nodeRefs.current[activeStepId];
      if (activeEl && containerRef.current) {
        // Get coordinates relative to the 3000x3000 canvas center
        // The canvas is translated -50% -50% in the DOM, so offsetTop is from the top of the 3000px box.
        // We want the node to appear 300px from the top of our 600px viewport container.
        // Canvas center is 1500px.
        const targetY =
          1500 - activeEl.offsetTop - 300 + activeEl.offsetHeight / 2;
        const targetX = 1500 - activeEl.offsetLeft - activeEl.offsetWidth / 2;

        setDynamicCamera({ x: targetX, y: targetY });
      }
    }, 50);

    return () => clearTimeout(measureAndPan);
  }, [activeStepId, revealedNodes]);

  const currentY = isManual ? panOffset.y : dynamicCamera.y;
  const currentX = isManual ? panOffset.x : dynamicCamera.x;

  const bindGestures = useGesture(
    {
      onDrag: ({ offset: [dx, dy] }) => {
        setIsManual(true);
        setPanOffset({ x: dx, y: dy });
      },
      onPinch: ({ offset: [d], first }) => {
        if (first && !isManual) {
          setPanOffset({ x: currentX, y: currentY });
        }
        setIsManual(true);
        setZoom(Math.max(0.02, Math.min(2, d)));
      },
    },
    {
      drag: { from: () => [currentX, currentY] },
      pinch: {
        from: () => [zoom, 0],
        scaleBounds: { min: 0.02, max: 2 },
        rubberband: false,
      },
    },
  );

  // --- INTERACTION ENGINE ---
  const handleReset = () => {
    // Completely wipe all progress
    setRevealedNodes(new Set([flowData[0]?.id]));
    setBranchSelections({});
    setActiveStepId(flowData[0]?.id);
    setIsManual(false);
    setZoom(1);
  };

  const advanceToNode = (
    targetNodeId,
    decisionSourceId = null,
    branchChoice = null,
  ) => {
    setIsManual(false);
    setZoom(1);

    if (decisionSourceId && branchChoice) {
      setBranchSelections((prev) => ({
        ...prev,
        [decisionSourceId]: branchChoice,
      }));
    }

    setRevealedNodes((prev) => {
      const next = new Set(prev);
      next.add(targetNodeId);
      return next;
    });

    // Set active to the clicked node first to center on it, then advance context
    setActiveStepId(targetNodeId);
  };

  /*
   * RECURSIVE RENDERER
   */
  const renderNodeSequence = (nodes, isBranch = false) => {
    return (
      <div className="flex flex-col items-center">
        {nodes.map((node, index) => {
          const isVisible = revealedNodes.has(node.id);
          const isActive = activeStepId === node.id;
          const isDecision = node.type === TYPES.DECISION;
          const isLastInSequence = index === nodes.length - 1;
          const nextNodeInSequence = !isLastInSequence
            ? nodes[index + 1]
            : null;

          // If this node hasn't been revealed yet, hide the entire downstream sequence
          if (!isVisible) return null;

          // Node visual styling logic
          const nodeOpacity = isActive ? 1 : 0.5;
          const scaleAnim = isActive ? [1, 1.05, 1] : 1;
          const durationAnim = isActive ? 3 : 0.5;
          const repeatAnim = isActive ? Infinity : 0;

          return (
            <div key={node.id} className="flex flex-col items-center relative">
              {/* Connector from previous node (if not the first node in the trunk) */}
              {(index > 0 || isBranch) && (
                <motion.div
                  className="w-[40px] h-[60px] flex flex-col items-center z-10"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.svg
                    width="40"
                    height="60"
                    viewBox="0 0 40 60"
                    fill="none"
                    className="stroke-brand-ink overflow-visible"
                  >
                    <motion.line
                      x1="20"
                      y1="0"
                      x2="20"
                      y2="60"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.7, ease: "easeInOut" }}
                    />
                  </motion.svg>
                </motion.div>
              )}

              {/* PHYSICAL NODE REGISTRATION */}
              <div
                ref={(el) => (nodeRefs.current[node.id] = el)}
                className="relative z-20 flex justify-center items-center"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <motion.div
                    animate={{ scale: scaleAnim, opacity: nodeOpacity }}
                    transition={{
                      scale: {
                        duration: durationAnim,
                        repeat: repeatAnim,
                        ease: "easeInOut",
                      },
                      opacity: { duration: 0.5 },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Clicking an action node advances to the sequence's next node
                      if (
                        nextNodeInSequence &&
                        node.type !== TYPES.DECISION &&
                        node.type !== TYPES.JUMP
                      ) {
                        advanceToNode(nextNodeInSequence.id);
                      } else if (
                        node.type === TYPES.JUMP &&
                        node.targetNodeId
                      ) {
                        // Jump nodes advance to the target node
                        advanceToNode(node.targetNodeId);
                      } else {
                        // Reselecting this node directly
                        setActiveStepId(node.id);
                        setIsManual(false);
                        setZoom(1);
                      }
                    }}
                    onPointerDownCapture={(e) => e.stopPropagation()}
                    className="cursor-pointer"
                  >
                    {/* VISUAL COMPONENTS */}
                    {node.type === TYPES.GOAL && (
                      <div
                        className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center p-6 rounded-full shadow-lg border-2 border-[#1b262f]/10"
                        style={{ backgroundColor: "#1b262f" }}
                      >
                        <p className="text-center text-sm md:text-base font-medium text-[#56C6FF]">
                          {node.label}
                        </p>
                      </div>
                    )}

                    {node.type === TYPES.ACTION && (
                      <div className="w-40 md:w-56 h-12 bg-[#56C6FF] flex items-center justify-center px-4 rounded-theme-sm shadow-md border-2 border-[#1b262f]/10">
                        <p className="w-full text-center text-xs md:text-sm font-bold uppercase tracking-widest text-brand-ink">
                          {node.label}
                        </p>
                      </div>
                    )}

                    {node.type === TYPES.FAIL && (
                      <div
                        className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center p-2 rounded-full shadow-lg border-2 border-[#1b262f]/10"
                        style={{ backgroundColor: "#FF7474" }}
                      >
                        <p className="text-center text-xs md:text-sm font-bold uppercase tracking-widest text-brand-ink">
                          {node.label}
                        </p>
                      </div>
                    )}

                    {node.type === TYPES.SUCCESS && (
                      <div
                        className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center p-4 rounded-full shadow-lg border-2 border-[#1b262f]/10"
                        style={{ backgroundColor: "#61F5B9" }}
                      >
                        <p className="text-center text-[16px] md:text-lg font-bold tracking-widest uppercase text-brand-ink">
                          {node.label}
                        </p>
                      </div>
                    )}

                    {node.type === TYPES.JUMP && (
                      <div className="w-48 h-12 bg-white flex items-center justify-center px-4 rounded-md shadow-md border-2 border-[#1b262f]/10">
                        <div className="w-full flex items-center gap-2 overflow-hidden">
                          <span className="text-xs font-bold text-gray-400 font-light whitespace-nowrap">
                            GO TO:
                          </span>
                          <p className="w-full text-xs font-semibold text-[#1b262f] truncate text-left">
                            {node.label}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* DECISION DIAMOND ROOT (Y/N Branching inside) */}
                    {node.type === TYPES.DECISION && (
                      <div className="relative w-[141px] h-[141px] md:w-[155px] md:h-[155px] flex items-center justify-center">
                        <div
                          className="absolute inset-0 m-auto w-full h-full rotate-45 rounded-xl shadow-md border-2 border-[#1b262f]/10"
                          style={{ backgroundColor: "#FFDE21" }}
                        />
                        <div className="relative z-10 w-full px-4 text-center">
                          <p className="text-sm md:text-base font-bold leading-snug md:leading-tight text-brand-ink">
                            {node.label}
                          </p>
                        </div>

                        {/* Y BUTTON (Left) */}
                        {node.yesBranch && node.yesBranch.length > 0 && (
                          <motion.div
                            className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 z-50 -ml-2 pointer-events-auto"
                            animate={{
                              scale:
                                branchSelections[node.id] === "Y"
                                  ? 1
                                  : [1, 1.15, 1],
                              opacity:
                                branchSelections[node.id] === "Y" ? 0.5 : 1,
                            }}
                            transition={{
                              scale: {
                                duration:
                                  branchSelections[node.id] === "Y" ? 0.5 : 3,
                                repeat:
                                  branchSelections[node.id] === "Y"
                                    ? 0
                                    : Infinity,
                                ease: "easeInOut",
                              },
                              opacity: { duration: 0.5 },
                            }}
                            onPointerDownCapture={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              advanceToNode(node.yesBranch[0].id, node.id, "Y");
                            }}
                          >
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 15,
                                delay: 0.7,
                              }}
                              className="relative w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-sm md:text-base font-bold shadow-md hover:shadow-lg"
                              style={{
                                backgroundColor: "#00B782",
                                color: "#16161D",
                              }}
                            >
                              Y
                            </motion.div>
                          </motion.div>
                        )}

                        {/* N BUTTON (Right) */}
                        {node.noBranch && node.noBranch.length > 0 && (
                          <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 z-50 -mr-2 flex flex-row items-center pointer-events-auto">
                            <motion.div
                              animate={{
                                scale:
                                  branchSelections[node.id] === "N"
                                    ? 1
                                    : [1, 1.15, 1],
                                opacity:
                                  branchSelections[node.id] === "N" ? 0.5 : 1,
                              }}
                              transition={{
                                scale: {
                                  duration:
                                    branchSelections[node.id] === "N" ? 0.5 : 3,
                                  repeat:
                                    branchSelections[node.id] === "N"
                                      ? 0
                                      : Infinity,
                                  ease: "easeInOut",
                                },
                                opacity: { duration: 0.5 },
                              }}
                              onPointerDownCapture={(e) => e.stopPropagation()}
                              onClick={(e) => {
                                e.stopPropagation();
                                advanceToNode(
                                  node.noBranch[0].id,
                                  node.id,
                                  "N",
                                );
                              }}
                            >
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 200,
                                  damping: 15,
                                  delay: 0.9,
                                }}
                                className="relative w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-sm md:text-base font-bold shadow-md hover:shadow-lg"
                                style={{
                                  backgroundColor: "#FF7474",
                                  color: "#16161D",
                                }}
                              >
                                N
                              </motion.div>
                            </motion.div>

                            {/* N-Branch Horizontal Connector Drawer */}
                            {branchSelections[node.id] === "N" && (
                              <div className="absolute left-full top-1/2 -translate-y-1/2 flex items-center pl-2 pointer-events-none">
                                <motion.div
                                  className="h-[2.5px] w-12 md:w-20 z-10 rounded-full"
                                  style={{
                                    backgroundColor: "#0D1216",
                                    transformOrigin: "left center",
                                  }}
                                  initial={{ scaleX: 0, opacity: 0 }}
                                  animate={{ scaleX: 1, opacity: 1 }}
                                  transition={{
                                    duration: 0.5,
                                    ease: "easeOut",
                                  }}
                                />
                                <div className="ml-2 relative">
                                  {/* Render N Branch nested */}
                                  {renderNodeSequence(node.noBranch, true)}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              </div>

              {/* RENDER Y-BRANCH (Directly below Decision node) */}
              {isDecision &&
                branchSelections[node.id] === "Y" &&
                node.yesBranch && (
                  <div className="w-full flex justify-center mt-2 relative z-10">
                    {renderNodeSequence(node.yesBranch, true)}
                  </div>
                )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className="w-full font-sans"
      style={{ fontFamily: '"Outfit", "Inter", sans-serif' }}
    >
      <div className="relative w-full overflow-hidden bg-[#F5F7F8] border border-gray-200 rounded-2xl shadow-lg">
        {/* Dot Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #0D1216 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* HEADER BLOCK */}
        <div
          className="relative z-20 flex flex-col px-6 md:px-8 pt-6 pb-8"
          style={{ backgroundColor: "#1b262f" }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div
                className="flex items-center justify-center shrink-0 w-12 h-12 rounded-full shadow-sm border border-transparent text-[#141F28]"
                style={{ backgroundColor: color }}
              >
                <Network size={22} className="[&_rect]:fill-current" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  To-Be Flow
                </h1>
                <p className="text-sm font-medium text-white/70 mt-0.5">
                  Display Now
                </p>
              </div>
            </div>

            {/* Stats Block */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm md:justify-end">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#56C6FF]" />
                <span className="font-medium text-white/90">
                  {stats.actions} action steps
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FFDE21]" />
                <span className="font-medium text-white/90">
                  {stats.decisions} complex decisions
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF7474]" />
                <span className="font-medium text-white/90">
                  {stats.fails} failure point
                </span>
              </div>
            </div>

            {/* RESET BUTTON */}
            <div className="absolute top-6 right-6 md:relative md:top-auto md:right-auto z-30 pointer-events-auto">
              <button
                onClick={handleReset}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition-colors shadow-md group relative"
                title="Reset Flow"
              >
                <RotateCcw
                  size={18}
                  className="text-[#56C6FF] group-hover:scale-110 transition-transform"
                />
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase text-white/90"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              >
                Start
              </span>
              <span className="hidden sm:inline text-white/40 ">→</span>
              <span className="text-sm font-medium text-white/80">
                Goal: Create Display
              </span>
            </div>
          </div>
        </div>

        {/* CANVAS WRAPPER */}
        <div
          ref={containerRef}
          {...bindGestures()}
          className="relative w-full h-[600px] overflow-hidden touch-none"
          style={{ cursor: isManual ? "grabbing" : "grab" }}
        >
          {/* CAMERA PLATE */}
          <motion.div
            animate={{ x: currentX, y: currentY, scale: zoom }}
            transition={{
              type: "spring",
              stiffness: 90,
              damping: 13.5,
              mass: 1,
            }}
            className="absolute inset-0 origin-center"
          >
            {/* 3000px Grid Bounds */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[3000px] h-[3000px] pointer-events-none">
              <div className="w-full h-full flex justify-center py-[200px] relative pointer-events-auto">
                {renderNodeSequence(flowData)}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
