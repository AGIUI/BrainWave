import { Handle, NodeProps, Position } from 'reactflow';

export type NodeData = {
  label: string;
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
      <input defaultValue={data.label} />

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default BWNode;