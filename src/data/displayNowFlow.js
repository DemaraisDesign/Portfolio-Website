export const displayNowToBeFlow = [
  {
    id: "n1",
    type: "GOAL",
    label: "I want to create an original test display.",
  },
  {
    id: "n2",
    type: "ACTION",
    label: 'Click "Try it free", "sign up" or "purchase"',
  },
  { id: "n3", type: "ACTION", label: "Sign up" },
  {
    id: "n4",
    type: "DECISION",
    label: "Watch general tutorial?",
    yesBranch: [{ id: "n5", type: "ACTION", label: "view tutorial" }],
    noBranch: [{ id: "n6", type: "ACTION", label: 'click "exit"' }],
  },
  { id: "n7", type: "ACTION", label: 'Click "+"' },
  {
    id: "n8",
    type: "DECISION",
    label: "Watch playlist tutorial?",
    yesBranch: [{ id: "n9", type: "ACTION", label: "Watch tutorial" }],
    noBranch: [{ id: "n10", type: "ACTION", label: 'click "exit"' }],
  },
  { id: "n11", type: "ACTION", label: 'Click "+"' },
  { id: "n12", type: "ACTION", label: "Choose Media" },
  {
    id: "n13",
    type: "DECISION",
    label: "Save content?",
    yesBranch: [{ id: "n14", type: "ACTION", label: "click save" }],
    noBranch: [
      { id: "n15", type: "ACTION", label: "change media" },
      {
        id: "n16",
        type: "JUMP",
        label: "Go to: Choose Media",
        targetNodeId: "n12",
      },
    ],
  },
  { id: "n17", type: "ACTION", label: 'Click "Preview"' },
  { id: "n18", type: "SUCCESS", label: "Success!" },
];
