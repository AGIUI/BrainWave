import { Handle, NodeProps, Position } from 'reactflow';

export type NodeData = {
  [x: string]: string | number | readonly string[] | undefined;
  
};

const nodeStyle = {
  background: '#f6ad55',
  borderRadius: '2px',
  border: '1px solid transparent',
  padding: '2px 5px',
  fontWeight: 700
}

function BWNode({ id, data }: NodeProps<NodeData>) {
  return (
    <div style={nodeStyle}>

      <p>text</p>
      <input defaultValue={data.text} />

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />

    </div>
  );
}

export default BWNode;