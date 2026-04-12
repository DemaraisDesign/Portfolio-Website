import React, { useState, useEffect } from "react";
import {
  Plus,
  X,
  ArrowDown,
  Spline,
  HelpCircle,
  ArrowRight,
  Share2,
  ClipboardCopy,
  Type,
  Settings,
  Link,
} from "lucide-react";

/*
 * NODE DEFINITIONS
 */
const TYPES = {
  GOAL: "GOAL",
  ACTION: "ACTION",
  DECISION: "DECISION",
  FAIL: "FAIL",
  SUCCESS: "SUCCESS",
  JUMP: "JUMP",
};

const initialTree = [
  {
    id: "node-start-1",
    type: TYPES.GOAL,
    label: "Objective",
  },
];

// Helper to generate a random ID
const genId = () => `node-${Math.random().toString(36).substr(2, 9)}`;

/*
 * THE BUILDER UI
 */
const InteractiveUserFlowBuilder = ({ color = "#00CAE3" }) => {
  // Current live flow tree
  const [tree, setTree] = useState(initialTree);
  const [isHoveringAdd, setIsHoveringAdd] = useState(null); // Tracks which block the user is hovering "After" to show the "+" menu
  const [activeDropdown, setActiveDropdown] = useState(null); // Tracks which node's settings menu is currently open
  const [exportedJSON, setExportedJSON] = useState(null);

  // Deep copy helper for the tree state
  const cloneTree = (nodes) => JSON.parse(JSON.stringify(nodes));

  /*
   * TREE MANIPULATION METHODS
   */
  // Recursively flattens the tree to get a list of all nodes for the Jump dropdown
  const getAllNodes = (nodes) => {
    let allNodes = [];
    nodes.forEach((node) => {
      // Don't let a Jump node point to another Jump node
      if (node.type !== TYPES.JUMP) {
        allNodes.push({ id: node.id, label: node.label });
      }
      if (node.type === TYPES.DECISION) {
        if (node.yesBranch)
          allNodes = allNodes.concat(getAllNodes(node.yesBranch));
        if (node.noBranch)
          allNodes = allNodes.concat(getAllNodes(node.noBranch));
      }
    });
    return allNodes;
  };

  // Recursively finds an array containing the target node ID, and inserts a new node right after it.
  const insertNodeAfter = (nodes, targetId, newNode) => {
    let newNodes = [];
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      newNodes.push(node);

      // If we found the target node, push the new node directly after it in the array
      if (node.id === targetId) {
        newNodes.push(newNode);
      }

      // If this node is a decision block, recursively check its Yes/No branches
      if (node.type === TYPES.DECISION) {
        if (node.yesBranch) {
          node.yesBranch = insertNodeAfter(node.yesBranch, targetId, newNode);
        }
        if (node.noBranch) {
          node.noBranch = insertNodeAfter(node.noBranch, targetId, newNode);
        }
      }
    }
    return newNodes;
  };

  // Recursively finds an array containing the target node ID, and deletes it.
  // WARNING: Deleting a node also deletes all of its children branches if it is a Decision node.
  const deleteNode = (nodes, targetId) => {
    let newNodes = [];
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      // Skip the target node we want to delete
      if (node.id === targetId) continue;

      // Otherwise keep it, and check its nested branches
      if (node.type === TYPES.DECISION) {
        if (node.yesBranch) {
          node.yesBranch = deleteNode(node.yesBranch, targetId);
        }
        if (node.noBranch) {
          node.noBranch = deleteNode(node.noBranch, targetId);
        }
      }
      newNodes.push(node);
    }
    return newNodes;
  };

  // Recursively finds a node and updates its label string
  const updateNodeLabel = (nodes, targetId, newLabel) => {
    return nodes.map((node) => {
      if (node.id === targetId) {
        return { ...node, label: newLabel };
      }
      if (node.type === TYPES.DECISION) {
        return {
          ...node,
          yesBranch: node.yesBranch
            ? updateNodeLabel(node.yesBranch, targetId, newLabel)
            : [],
          noBranch: node.noBranch
            ? updateNodeLabel(node.noBranch, targetId, newLabel)
            : [],
        };
      }
      return node;
    });
  };

  /*
   * ACTION HANDLERS
   */
  const handleAddNode = (targetId, type) => {
    const newNode = {
      id: genId(),
      type: type,
      label:
        type === TYPES.DECISION
          ? "Decision?"
          : type === TYPES.TERMINAL
            ? "End Goal"
            : "New Step",
    };

    // If it's a Decision node, it needs empty branches spawned immediately
    if (type === TYPES.DECISION) {
      newNode.yesBranch = [];
      newNode.noBranch = [];
    }

    setTree((prev) => insertNodeAfter(cloneTree(prev), targetId, newNode));
    setIsHoveringAdd(null);
  };

  const handleDelete = (targetId) => {
    setTree((prev) => deleteNode(cloneTree(prev), targetId));
  };

  const handleLabelChange = (targetId, e) => {
    setTree((prev) =>
      updateNodeLabel(cloneTree(prev), targetId, e.target.value),
    );
  };

  // Recursively finds a node and updates its type string
  const updateNodeType = (nodes, targetId, newType) => {
    return nodes.map((node) => {
      if (node.id === targetId) {
        const updatedNode = { ...node, type: newType };
        // If converting to a decision, ensure branches exist
        if (newType === TYPES.DECISION) {
          updatedNode.yesBranch = updatedNode.yesBranch || [];
          updatedNode.noBranch = updatedNode.noBranch || [];
        }
        return updatedNode;
      }
      if (node.type === TYPES.DECISION) {
        return {
          ...node,
          yesBranch: node.yesBranch
            ? updateNodeType(node.yesBranch, targetId, newType)
            : [],
          noBranch: node.noBranch
            ? updateNodeType(node.noBranch, targetId, newType)
            : [],
        };
      }
      return node;
    });
  };

  const handleChangeNodeType = (targetId, newType) => {
    setTree((prev) => updateNodeType(cloneTree(prev), targetId, newType));
  };

  // Recursively finds a node and updates its targetNodeId (specifically for JUMP nodes)
  const updateNodeTarget = (nodes, targetId, newTargetId) => {
    return nodes.map((node) => {
      if (node.id === targetId) {
        return { ...node, targetNodeId: newTargetId };
      }
      if (node.type === TYPES.DECISION) {
        return {
          ...node,
          yesBranch: node.yesBranch
            ? updateNodeTarget(node.yesBranch, targetId, newTargetId)
            : [],
          noBranch: node.noBranch
            ? updateNodeTarget(node.noBranch, targetId, newTargetId)
            : [],
        };
      }
      return node;
    });
  };

  const handleTargetChange = (targetId, e) => {
    setTree((prev) =>
      updateNodeTarget(cloneTree(prev), targetId, e.target.value),
    );
  };

  const handleExport = () => {
    // Strip out the random IDs to clean up the JSON for the CMS
    const stripIds = (nodes) => {
      return nodes.map((n) => {
        const clean = { type: n.type, label: n.label };
        if (n.type === TYPES.DECISION) {
          clean.yesBranch = stripIds(n.yesBranch || []);
          clean.noBranch = stripIds(n.noBranch || []);
        }
        return clean;
      });
    };
    const cleanedTree = stripIds(cloneTree(tree));
    setExportedJSON(JSON.stringify(cleanedTree, null, 2));
  };

  /*
   * RECURSIVE NODE RENDERER
   */
  const renderNodeSequence = (nodes, parentId = "root") => {
    return (
      <div className="flex flex-col items-center">
        {nodes.map((node, index) => {
          const isLastInSequence = index === nodes.length - 1;

          return (
            <div
              key={node.id}
              className="flex flex-col items-center relative group"
            >
              {/* The Node Itself */}
              <div className="relative z-10 w-full flex justify-center group/node">
                {/* Node Options Dropdown Trigger */}
                {node.id !== "node-start-1" && (
                  <div className="absolute -left-8 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover/node:opacity-100 transition-opacity">
                    <button
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === node.id ? null : node.id,
                        )
                      }
                      className="w-6 h-6 bg-white border border-gray-200 rounded-full flex justify-center items-center shadow-sm text-gray-400 font-light hover:text-gray-700 hover:bg-gray-50"
                    >
                      <Settings size={12} />
                    </button>

                    {/* Dropdown Menu */}
                    {activeDropdown === node.id && (
                      <div
                        className="absolute left-8 top-0 bg-white border rounded-lg shadow-xl p-1 flex flex-col gap-1 w-32 items-start"
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        <span className="text-[10px] uppercase font-bold text-gray-400 font-light px-2 py-1 w-full border-b mb-1">
                          Change Type
                        </span>
                        <button
                          onClick={() => {
                            handleChangeNodeType(node.id, TYPES.GOAL);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-2 py-1.5 hover:bg-slate-50 flex items-center gap-2 rounded text-xs text-gray-700"
                        >
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: "#1b262f" }}
                          ></div>{" "}
                          Goal
                        </button>
                        <button
                          onClick={() => {
                            handleChangeNodeType(node.id, TYPES.ACTION);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-2 py-1.5 hover:bg-slate-50 flex items-center gap-2 rounded text-xs text-gray-700"
                        >
                          <div
                            className="w-3 h-1.5 rounded-full"
                            style={{ backgroundColor: "#56C6FF" }}
                          ></div>{" "}
                          Action
                        </button>
                        <button
                          onClick={() => {
                            handleChangeNodeType(node.id, TYPES.DECISION);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-2 py-1.5 hover:bg-slate-50 flex items-center gap-2 rounded text-xs text-gray-700"
                        >
                          <div
                            className="w-2 h-2 rotate-45 rounded-[1px]"
                            style={{ backgroundColor: "#FFDE21" }}
                          ></div>{" "}
                          Decision
                        </button>
                        <button
                          onClick={() => {
                            handleChangeNodeType(node.id, TYPES.FAIL);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-2 py-1.5 hover:bg-slate-50 flex items-center gap-2 rounded text-xs text-gray-700"
                        >
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: "#FF7474" }}
                          ></div>{" "}
                          Fail
                        </button>
                        <button
                          onClick={() => {
                            handleChangeNodeType(node.id, TYPES.SUCCESS);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-2 py-1.5 hover:bg-slate-50 flex items-center gap-2 rounded text-xs text-gray-700"
                        >
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: "#61F5B9" }}
                          ></div>{" "}
                          Success
                        </button>
                        <div className="w-full h-px bg-gray-100 my-0.5"></div>
                        <button
                          onClick={() => {
                            handleChangeNodeType(node.id, TYPES.JUMP);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-2 py-1.5 hover:bg-slate-50 flex items-center gap-2 rounded text-xs text-gray-700"
                        >
                          <Link size={10} className="text-[#1b262f]" />
                          Jump
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {node.type === TYPES.ACTION && (
                  <div className="w-40 md:w-56 h-12 bg-[#56C6FF] flex items-center justify-center px-4 rounded-theme-sm shadow-md border-2 border-transparent transition-colors hover:border-[#1b262f] cursor-text">
                    <input
                      type="text"
                      value={node.label}
                      onChange={(e) => handleLabelChange(node.id, e)}
                      className="w-full text-center text-xs md:text-sm font-bold uppercase tracking-widest text-brand-ink bg-transparent outline-none placeholder:text-brand-ink/50"
                      placeholder="ACTION STEP"
                    />
                    <button
                      onClick={() => handleDelete(node.id)}
                      className="absolute -right-3 -top-3 w-6 h-6 bg-red-100 rounded-full text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-sm border border-red-200"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {node.type === TYPES.DECISION && (
                  <div className="relative w-[141px] h-[141px] md:w-[155px] md:h-[155px] flex items-center justify-center my-4 group cursor-text">
                    {/* Diamond Background Shape (Rotated) */}
                    <div
                      className="absolute inset-0 m-auto w-full h-full rotate-45 rounded-xl shadow-md border-2 border-transparent transition-colors group-hover:border-[#1b262f]"
                      style={{ backgroundColor: "#FFDE21" }}
                    />

                    {/* Text Content */}
                    <div className="relative z-10 w-full px-2">
                      <textarea
                        value={node.label}
                        onChange={(e) => handleLabelChange(node.id, e)}
                        className="w-full text-center text-sm md:text-base font-bold leading-snug md:leading-tight text-brand-ink bg-transparent outline-none resize-none placeholder:text-brand-ink/50 align-middle"
                        rows={3}
                        placeholder="Decision?"
                        style={{ marginTop: "0.25rem" }}
                      />
                    </div>
                    <button
                      onClick={() => handleDelete(node.id)}
                      className="absolute -right-8 -top-8 w-6 h-6 bg-red-100 rounded-full text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-sm border border-red-200"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {node.type === TYPES.GOAL && (
                  <div
                    className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center p-4 rounded-full shadow-lg border-2 border-transparent hover:border-[#56C6FF] transition-colors cursor-text"
                    style={{ backgroundColor: "#1b262f" }}
                  >
                    <textarea
                      value={node.label}
                      onChange={(e) => handleLabelChange(node.id, e)}
                      className="w-full text-center text-sm font-medium text-[#56C6FF] bg-transparent outline-none resize-none placeholder:text-[#56C6FF]/50"
                      rows={4}
                      placeholder="Goal"
                      style={{ marginTop: "0.5rem" }}
                    />
                    <button
                      onClick={() => handleDelete(node.id)}
                      className="absolute right-0 top-0 w-6 h-6 bg-red-100 rounded-full text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-sm border border-red-200"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {node.type === TYPES.FAIL && (
                  <div
                    className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center p-2 rounded-full shadow-lg border-2 border-transparent hover:border-[#1b262f] transition-colors cursor-text"
                    style={{ backgroundColor: "#FF7474" }}
                  >
                    <textarea
                      value={node.label}
                      onChange={(e) => handleLabelChange(node.id, e)}
                      className="w-full text-center text-xs md:text-sm font-bold uppercase tracking-widest text-brand-ink bg-transparent outline-none resize-none placeholder:text-brand-ink/50"
                      rows={2}
                      placeholder="FAIL"
                      style={{ marginTop: "0.25rem" }}
                    />
                    <button
                      onClick={() => handleDelete(node.id)}
                      className="absolute -right-2 -top-2 w-6 h-6 bg-red-100 rounded-full text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-sm border border-red-200"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {node.type === TYPES.SUCCESS && (
                  <div
                    className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center p-4 rounded-full shadow-lg border-2 border-transparent hover:border-[#1b262f] transition-colors cursor-text"
                    style={{ backgroundColor: "#61F5B9" }}
                  >
                    <textarea
                      value={node.label}
                      onChange={(e) => handleLabelChange(node.id, e)}
                      className="w-full text-center text-[16px] md:text-lg font-bold tracking-widest uppercase text-brand-ink bg-transparent outline-none resize-none placeholder:text-brand-ink/50"
                      rows={3}
                      placeholder="SUCCESS!"
                      style={{ marginTop: "0.5rem" }}
                    />
                    <button
                      onClick={() => handleDelete(node.id)}
                      className="absolute right-0 top-0 w-6 h-6 bg-red-100 rounded-full text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-sm border border-red-200"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {node.type === TYPES.JUMP && (
                  <div className="w-48 h-12 bg-white flex items-center justify-center px-4 rounded-md shadow-md border-2 border-[#1b262f] cursor-pointer">
                    <div className="w-full flex items-center gap-2">
                      <span className="text-xs font-bold text-brand-ink-muted whitespace-nowrap">
                        GO TO:
                      </span>
                      <select
                        value={node.targetNodeId || ""}
                        onChange={(e) => handleTargetChange(node.id, e)}
                        className="w-full text-xs font-semibold text-[#1b262f] bg-transparent outline-none truncate cursor-pointer"
                      >
                        <option value="" disabled>
                          Select a Step...
                        </option>
                        {getAllNodes(tree).map((n) => (
                          <option key={n.id} value={n.id}>
                            {n.label || "Unnamed Step"}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => handleDelete(node.id)}
                      className="absolute -right-3 -top-3 w-6 h-6 bg-red-100 rounded-full text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-sm border border-red-200"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Standard Add Button (Between nodes, or pushing down from the last node) */}
              <div
                className="h-16 flex items-center justify-center relative w-full"
                onMouseEnter={() => setIsHoveringAdd(node.id)}
                onMouseLeave={() => setIsHoveringAdd(null)}
              >
                {/* Standard Connecting Line (only draw if not the exact bottom of the entire flow context) */}
                {(node.type !== TYPES.TERMINAL || !isLastInSequence) && (
                  <div
                    className="absolute top-0 bottom-0 w-[2.5px] -z-10"
                    style={{ backgroundColor: "#1b262f" }}
                  ></div>
                )}

                {/* Hover Add Menu (5 Options) */}
                {isHoveringAdd === node.id && (
                  <div className="bg-white border rounded-full shadow-lg flex items-center p-1 gap-1 z-20">
                    <button
                      onClick={() => handleAddNode(node.id, TYPES.GOAL)}
                      className="w-8 h-8 hover:bg-slate-100 rounded-full flex justify-center items-center group/tooltip relative"
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: "#1b262f" }}
                      ></div>
                      <span className="absolute -top-8 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        Add Goal
                      </span>
                    </button>

                    <button
                      onClick={() => handleAddNode(node.id, TYPES.ACTION)}
                      className="w-8 h-8 hover:bg-slate-100 rounded-full flex justify-center items-center group/tooltip relative"
                    >
                      <div
                        className="w-6 h-3 rounded-full"
                        style={{ backgroundColor: "#56C6FF" }}
                      ></div>
                      <span className="absolute -top-8 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        Add Action
                      </span>
                    </button>

                    <button
                      onClick={() => handleAddNode(node.id, TYPES.DECISION)}
                      className="w-8 h-8 hover:bg-slate-100 rounded-full flex justify-center items-center group/tooltip relative"
                    >
                      <div
                        className="w-3.5 h-3.5 rotate-45 rounded-sm"
                        style={{ backgroundColor: "#FFDE21" }}
                      ></div>
                      <span className="absolute -top-8 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        Add Decision
                      </span>
                    </button>

                    <div className="w-px h-4 bg-gray-200 mx-1"></div>

                    <button
                      onClick={() => handleAddNode(node.id, TYPES.FAIL)}
                      className="w-8 h-8 hover:bg-slate-100 rounded-full flex justify-center items-center group/tooltip relative"
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: "#FF7474" }}
                      ></div>
                      <span className="absolute -top-8 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        Add Fail
                      </span>
                    </button>

                    <button
                      onClick={() => handleAddNode(node.id, TYPES.SUCCESS)}
                      className="w-8 h-8 hover:bg-slate-100 rounded-full flex justify-center items-center group/tooltip relative"
                    >
                      <div
                        className="w-5 h-5 rounded-full"
                        style={{ backgroundColor: "#61F5B9" }}
                      ></div>
                      <span className="absolute -top-8 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        Add Success
                      </span>
                    </button>

                    <div className="w-px h-4 bg-gray-200 mx-1"></div>

                    <button
                      onClick={() => handleAddNode(node.id, TYPES.JUMP)}
                      className="w-8 h-8 hover:bg-slate-100 rounded-full flex justify-center items-center group/tooltip relative"
                    >
                      <Link size={16} className="text-[#1b262f]" />
                      <span className="absolute -top-8 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        Connect to Existing
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* Branched Children (If Decision Node) */}
              {node.type === TYPES.DECISION && (
                <div className="flex w-full items-start pb-8">
                  {/* Yes Branch (Left, Main Trunk Continues) */}
                  <div className="flex-1 flex flex-col items-center relative pl-8 border-r border-[#1b262f]-transparent">
                    {/* Y Box Marker */}
                    <div
                      className="absolute -mt-[22px] z-10 w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-sm md:text-base font-bold shadow-md"
                      style={{ backgroundColor: "#00B782", color: "#16161D" }}
                    >
                      Y
                    </div>
                    {/* CSS Bracket Line extending straight down */}
                    <div
                      className="absolute top-0 bottom-0 w-[2.5px] -z-10"
                      style={{ backgroundColor: "#1b262f" }}
                    ></div>
                    {/* Bracket Line connecting Y Node back up into bottom of Diamond */}
                    <div
                      className="absolute right-0 top-0 w-1/2 h-8 border-t-[2.5px] border-l-[2.5px] rounded-tl-xl -mt-8 -z-10"
                      style={{ borderColor: "#1b262f" }}
                    ></div>

                    <div className="pt-12 w-full flex flex-col items-center">
                      {node.yesBranch && node.yesBranch.length > 0 ? (
                        renderNodeSequence(node.yesBranch, node.id)
                      ) : (
                        <button
                          onClick={() => handleAddNode(node.id, TYPES.ACTION)}
                          className="px-4 py-2 border-2 border-dashed border-[#1b262f]/30 rounded-lg text-sm font-medium text-[#1b262f]/50 hover:border-[#1b262f] hover:text-[#1b262f] transition-colors bg-white"
                        >
                          + Build Yes Path
                        </button>
                      )}
                    </div>
                  </div>

                  {/* No Branch (Right Side) */}
                  <div className="flex-1 flex flex-col items-center relative pr-8">
                    {/* N Box Marker */}
                    <div
                      className="absolute -mt-[22px] z-10 w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-sm md:text-base font-bold shadow-md"
                      style={{ backgroundColor: "#FF7474", color: "#16161D" }}
                    >
                      N
                    </div>
                    {/* CSS Bracket Line connecting from left trunk and branching down */}
                    <div
                      className="absolute left-0 top-0 w-1/2 h-8 border-t-[2.5px] border-r-[2.5px] rounded-tr-xl -mt-8 -z-10"
                      style={{ borderColor: "#1b262f" }}
                    ></div>
                    <div
                      className="absolute top-0 bottom-0 w-[2.5px] -z-10"
                      style={{ backgroundColor: "#1b262f" }}
                    ></div>

                    <div className="pt-12 w-full flex flex-col items-center">
                      {node.noBranch && node.noBranch.length > 0 ? (
                        renderNodeSequence(node.noBranch, node.id)
                      ) : (
                        <button
                          onClick={() => {
                            const newNode = {
                              id: genId(),
                              type: TYPES.ACTION,
                              label: "Failure Node",
                            };
                            const updatedTree = cloneTree(tree);

                            // Find this decision node exactly and push to its noBranch
                            const pushToNo = (nodes) => {
                              for (let n of nodes) {
                                if (n.id === node.id) n.noBranch.push(newNode);
                                if (n.type === TYPES.DECISION) {
                                  pushToNo(n.yesBranch);
                                  pushToNo(n.noBranch);
                                }
                              }
                            };
                            pushToNo(updatedTree);
                            setTree(updatedTree);
                          }}
                          className="mt-8 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-400 font-light hover:border-blue-400 hover:text-blue-500 transition-colors"
                        >
                          + Build No Path
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex w-[calc(100%+3rem)] md:w-[calc(100%+6rem)] lg:w-[calc(100%+12rem)] -mx-6 md:-mx-12 lg:-mx-24 mb-16 relative font-sans">
      <div className="w-full bg-[#f8fafc] border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Header Strip */}
        <div className="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-30 shadow-sm relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600">
              <Spline size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                Interactive Flow Builder
              </h2>
              <p className="text-xs font-medium text-brand-ink-muted">
                Construct the modular To-Be path
              </p>
            </div>
          </div>

          <button
            onClick={handleExport}
            className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-lg text-sm font-semibold shadow-md transition-colors flex items-center gap-2"
          >
            <ClipboardCopy size={16} />
            Save & Export Flow
          </button>
        </div>

        {/* Main Canvas Area */}
        <div
          className="w-full overflow-x-auto min-h-[600px] p-12 flex justify-center bg-gray-50/50"
          style={{
            backgroundImage:
              "radial-gradient(circle, #E5E7EB 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          {/* The Recursive Tree */}
          <div className="min-w-fit flex flex-col items-center">
            {renderNodeSequence(tree)}
          </div>
        </div>

        {/* Export JSON Overlay Modal */}
        {exportedJSON && (
          <div className="absolute inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-8">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Success! Flow Generated.
                  </h3>
                  <p className="text-sm text-brand-ink-muted">
                    Copy this JSON and paste it into `caseStudyContent.js`
                  </p>
                </div>
                <button
                  onClick={() => setExportedJSON(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-brand-ink-muted transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 bg-gray-50">
                <pre className="w-full h-96 overflow-y-auto text-xs font-mono text-gray-800 bg-white border border-gray-200 rounded-xl p-4 shadow-inner">
                  {exportedJSON}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveUserFlowBuilder;
