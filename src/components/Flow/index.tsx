import React, { useCallback, useRef } from 'react';

import ReactFlow, {
  Controls,
  OnConnectEnd,
  OnConnectStart,
  Panel,
  useStoreApi,
  Node,
  useReactFlow,
  ReactFlowProvider,
  NodeOrigin,
  ConnectionLineType,
  SelectionMode, MiniMap, Background
} from 'reactflow';
import { shallow } from 'zustand/shallow';

import { Button, Input } from 'antd';
const { TextArea } = Input;
import { nanoid } from 'nanoid/non-secure';

import useStore, { RFState } from './store';
import BWNode from './BWNode';
import BWEdge from './BWEdge';


// we need to import the React Flow styles to make it work
import 'reactflow/dist/style.css';


const selector = (state: RFState) => ({
  tag: state.tag,
  nodes: state.nodes,
  edges: state.edges,
  onTagChange: state.onTagChange,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addChildNode: state.addChildNode,
});

const nodeTypes = {
  brainwave: BWNode,
};

const edgeTypes = {
  brainwave: BWEdge,
};

const nodeOrigin: NodeOrigin = [0.5, 0.5];
const connectionLineStyle = { stroke: '#F6AD55', strokeWidth: 3 };
const defaultEdgeOptions = { style: connectionLineStyle, type: 'brainwave' };

function Flow() {
  const reactFlowInstance = useReactFlow();
  // whenever you use multiple values, you should use shallow for making sure that the component only re-renders when one of the values change
  const { tag, nodes, edges, onTagChange, onNodesChange, onEdgesChange, addChildNode } = useStore(selector, shallow);
  const connectingNodeId = useRef<string | null>(null);
  const store = useStoreApi();
  const { project } = useReactFlow();

  const getChildNodePosition = (event: MouseEvent, parentNode?: Node) => {
    const { domNode } = store.getState();

    if (
      !domNode ||
      // we need to check if these properites exist, because when a node is not initialized yet,
      // it doesn't have a positionAbsolute nor a width or height
      !parentNode?.positionAbsolute ||
      !parentNode?.width ||
      !parentNode?.height
    ) {
      return;
    }

    const { top, left } = domNode.getBoundingClientRect();

    // we need to remove the wrapper bounds, in order to get the correct mouse position
    const panePosition = project({
      x: event.clientX - left + 100,
      y: event.clientY - top,
    });

    // we are calculating with positionAbsolute here because child nodes are positioned relative to their parent
    return {
      x: panePosition.x - parentNode.positionAbsolute.x + parentNode.width / 2,
      y: panePosition.y - parentNode.positionAbsolute.y + parentNode.height / 2,
    };
  };

  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd: OnConnectEnd = useCallback(
    (event: any) => {
      const { nodeInternals } = store.getState();
      const targetIsPane = (event.target as Element).classList.contains('react-flow__pane');

      if (targetIsPane && connectingNodeId.current) {
        const parentNode = nodeInternals.get(connectingNodeId.current);
        const childNodePosition = getChildNodePosition(event, parentNode);

        if (parentNode && childNodePosition) {
          addChildNode(parentNode, childNodePosition);
        }
      }
    },
    [getChildNodePosition]
  );

  const panOnDrag = [1, 2];

  const nodeColor: any = (node: { type: any; }) => {
    switch (node.type) {
      case 'input':
        return '#6ede87';
      case 'output':
        return '#6865A5';
      default:
        return '#ff0072';
    }
  };

  const variant: any = 'lines';

  const exportDataToEarth = () => {


    const defaultCombo = {
      tag: '',
      role: '',
      combo: 1,
      interfaces: [],
      isInfinite: false,
      owner: 'user',
      prompt: {},
      version: '0.1.0',
      app: 'brainwave',
      id: '',
      createDate: (new Date()).getTime()
    }


    const workflow: any = {};
    const { edges, nodes } = reactFlowInstance.toObject();
    if (edges.length == 0 && nodes.length == 1) {
      // 只有一个，则导出
      workflow[nodes[0].id] = nodes[0].data
    }
    for (const edge of edges) {
      const { source, target } = edge;
      const sourceNode: any = nodes.filter(node => node.id === source)[0];
      const targetNode: any = nodes.filter(node => node.id === target)[0];
      if (sourceNode && targetNode) {
        workflow[source] = { ...sourceNode.data, nextId: target };
        workflow[target] = targetNode.data;
      }
    }
    const items: any = [];
    // console.log(workflow)
    // 按顺序从到尾
    const getItems = (id: string, callback: any) => {
      if (workflow[id]) {
        console.log(items)
        items.push(workflow[id]);
        let nextId = workflow[id].nextId;
        if (nextId) {
          getItems(nextId, callback)
        } else {
          return callback(items)
        }
      }
    }
    getItems('root', (result: any) => {
      const items = JSON.parse(JSON.stringify(result))
      // 按照combo的格式输出
      const combo: any = { ...defaultCombo, tag, id: nanoid() }
      for (let index = 0; index < items.length; index++) {
        const prompt = items[index];
        delete prompt.onChange;
        delete prompt.opts;
        if (index === 0) {
          combo.prompt = prompt;
        }
        if (index > 0) {
          combo[`prompt${index + 1}`] = prompt;
        }
        combo.combo = index + 1;
      }

      console.log(combo)
      download([combo])
    })
  }

  const download = (data:any) => {
    const link = document.createElement('a');
    link.href = `data:application/json;charset=utf-8,\ufeff${encodeURIComponent(JSON.stringify(data))}`;
    link.download = `${data.tag}_${data.id}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const importMyCombo=()=> {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = ".json"
    document.body.appendChild(input);
    input.addEventListener('change', (e: any) => {
        const files = e.target.files;
        if (files.length == 1) {
            let file = files[0];
            let fileReader = new FileReader();
            fileReader.readAsText(file);
            fileReader.onload = function () {
                // 获取得到的结果
                const data: any = this.result;
                const json = JSON.parse(data);
                console.log(json)
            }
        }
        input.remove();
    }, false)
    input.click();
}

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnectStart={onConnectStart}
      onConnectEnd={onConnectEnd}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      nodeOrigin={nodeOrigin}
      defaultEdgeOptions={defaultEdgeOptions}
      connectionLineStyle={connectionLineStyle}
      connectionLineType={ConnectionLineType.Straight}
      fitView

      panOnScroll
      selectionOnDrag
      panOnDrag={panOnDrag}
      selectionMode={SelectionMode.Partial}

    >
      <Controls position={'bottom-left'} />
      <MiniMap nodeColor={nodeColor} nodeStrokeWidth={3} zoomable pannable inversePan={false} ariaLabel={null} />
      <Background variant={variant} />

      <Panel position="top-left">
        NODES
      </Panel>


      <Panel position="top-right">
        <TextArea placeholder="Autosize height based on content lines"
          autoSize
          value={tag}
          onChange={(e: any) => {
            onTagChange(e.target.value)
          }}
        />
        <Button onClick={() => exportDataToEarth()}>导出
          {/* <Radio.Button value="large"></Radio.Button> */}
          {/* <Radio.Button value="default">Default</Radio.Button>
          <Radio.Button value="small">Small</Radio.Button> */}
        </Button>
      </Panel>
    </ReactFlow>
  );
}

export default () => (
  <ReactFlowProvider>
    <Flow />
  </ReactFlowProvider>
);

