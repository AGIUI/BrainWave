import {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  XYPosition,
} from 'reactflow';
import { create } from 'zustand';
import { nanoid } from 'nanoid/non-secure';

import { defaultNode, comboOptions } from 'components/Flow/Workflow'

export type RFState = {
  newCombo: any;
  comboOptions: any;
  tag: string;
  nodes: Node[];
  edges: Edge[];
  onComboOptionsChange: any;
  onTagChange: any;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addChildNode: (parentNode: Node, position: XYPosition) => void;
};


/**
 * 默认的节点
 */
const useStore = create<RFState>((set, get) => ({
  comboOptions,
  tag: 'combo',
  nodes: [
    {
      id: 'root',
      type: 'brainwave',
      data: {
        ...defaultNode,
        onChange: (e: any) => {
          const nodes = [];
          for (const node of get().nodes) {
            if (node.id === e.id) {
              nodes.push({
                ...node, data: {
                  ...node.data, ...e.data
                }
              })
            } else {
              nodes.push(node)
            }
          }
          set({
            nodes
          });
        }
      },
      position: { x: 0, y: 0 },
      deletable:false
    },
  ],
  edges: [],
  onComboOptionsChange: (changes: any) => {
    let comboOptions = get().comboOptions;
    comboOptions = Array.from(comboOptions, (c: any) => {
      c.checked = changes.includes(c.value);
      return c
    })
    console.log(changes, comboOptions)
    set({ comboOptions })
  },
  onTagChange: (tag: string) => {
    set({ tag: tag })
  },
  newCombo: (ns: any, edges: any) => {
    const nodes = [...Array.from(ns, (nd: any) => {
      nd.data = {
        ...defaultNode,
        ...nd.data,
        onChange: (e: any) => {
          const nodes = [];
          for (const node of get().nodes) {
            if (node.id === e.id) {
              nodes.push({
                ...node, data: {
                  ...node.data, ...e.data
                }
              })
            } else {
              nodes.push(node)
            }
          }
          set({
            nodes
          });
        }
      }
      return nd
    })]

    set({ nodes, edges })

  },
  onNodesChange: (changes: any) => {
    // const n=applyNodeChanges(changes, get().nodes)
    // console.log('onNodesChange', changes, get().nodes,n)
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    console.log('onEdgesChange')
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  addChildNode: (parentNode: Node, position: XYPosition) => {
    console.log('addChildNode', parentNode, get().edges)
    const pId = parentNode.id;

    // 已经作为source了
    if (get().edges.filter(e => e.source == pId).length > 0) return

    // 可根据 parentNode 判断下一个节点类型

    const newNode = {
      id: nanoid(),
      type: 'brainwave',
      data: {
        ...defaultNode, onChange: (e: any) => {
          const nodes = [];
          for (const node of get().nodes) {
            if (node.id === e.id) {
              nodes.push({
                ...node, data: {
                  ...node.data, ...e.data
                }
              })
            } else {
              nodes.push(node)
            }
          }
          set({
            nodes
          });
        }
      },
      position,
      parentNode: parentNode.id,
      deletable:true
    };
    // console.log('addChildNode', parentNode)
    const newEdge = {
      id: nanoid(),
      source: parentNode.id,
      target: newNode.id,
    };

    set({
      nodes: [...get().nodes, newNode],
      edges: [...get().edges, newEdge],
    });
  },
}));

export default useStore;
