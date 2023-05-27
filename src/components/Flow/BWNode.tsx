import { Handle, NodeProps, Position } from 'reactflow';
import { Input, Card, Select, Radio, Slider, Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
const { TextArea } = Input;
const { Option } = Select;

export type NodeData = {
  text: string,
  api: any,
  queryObj: any,
  temperature: number,
  model: string,
  input: string,
  output: string,
  type: string,
  opts: any
};

const nodeStyle = {
  border: '1px solid transparent',
  padding: '2px 5px'
};

const items: any = [
  {
    key: '1',
    type: 'group',
    label: 'Group title',
    children: [
      {
        key: '1-1',
        label: '1st menu item',
      },
      {
        key: '1-2',
        label: '2nd menu item',
      },
    ],
  },
  {
    key: '2',
    label: 'sub menu',
    children: [
      {
        key: '2-1',
        label: '3rd menu item',
      },
      {
        key: '2-2',
        label: '4th menu item',
      },
    ],
  },
  {
    key: '3',
    label: 'disabled sub menu',
    disabled: true,
    children: [
      {
        key: '3-1',
        label: '5d menu item',
      },
      {
        key: '3-2',
        label: '6th menu item',
      },
    ],
  },
];



const createType = () => <Dropdown menu={{ items }}>
  <a onClick={(e) => e.preventDefault()}>
    <Space>
      Cascading menu
      <DownOutlined rev={undefined} />
    </Space>
  </a>
</Dropdown>

const createText = (title: string, text: string) => <>
  <p>{title}</p>
  <TextArea
    defaultValue={text}
    rows={4}
    placeholder="maxLength is 6"
    maxLength={6}
  /></>;


/**
 * API / queryObj
 * @param title 
 * @param protocol 
 * @param url 
 * @param text init / query
 * @returns 
 */
const createUrl = (title: string, protocol: string, url: string, text: string) => <>
  <p>{title}</p>
  <Input addonBefore={
    <Select defaultValue={protocol} onChange={(e: string) => {

      var protocol = e;

    }}>
      <Option value="http://">http://</Option>
      <Option value="https://">https://</Option>
    </Select>
  }
    placeholder={`请填写url`}
    defaultValue={url}
    onChange={(e: any) => {
    }}
  />
  <TextArea
    defaultValue={text}
    rows={4}
    placeholder="maxLength is 6"
    maxLength={6}
  /></>

const createModel = (title: string, model: string, temperature: number, opts: any) => <>
  <p>{title}</p>
  <Radio.Group
    onChange={(e) => e.target.value}
    defaultValue={model}
  >
    {Array.from(opts,
      (p: any, i: number) => {
        return <Radio.Button
          key={i}
          value={p.value}
        >{p.label}</Radio.Button>
      })}
  </Radio.Group> <Slider
    style={{ width: '120px' }}
    range={false}
    max={1}
    min={0}
    step={0.05}
    defaultValue={temperature}
    onChange={(e) => e}
  />
</>

const createInputAndOutput = (title: string, opts: any) => <>
  <p>{title}</p>
  <Radio.Group
    style={{
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'baseline'
    }}
    options={opts}
    onChange={(e: any) => e} />
</>

function BWNode({ id, data }: NodeProps<NodeData>) {
  return (
    <div style={nodeStyle}>

      <Card title="Default size card" extra={createType()} style={{ width: 300 }}>


        {createText('Prompt', data.text)}

        {createUrl('API', data.api.protocol, data.api.url, data.api.init)}

        {createUrl('query', data.queryObj.protocol, data.queryObj.url, data.queryObj.query)}

        {createModel('模型', data.model, data.temperature, data.opts.models.filter((m: any) => m.value == 'model')[0].options)}

        {createInputAndOutput('Input', data.opts.inputs)}

        {createInputAndOutput('Output', data.opts.outputs)}

      </Card>

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />

    </div>
  );
}

export default BWNode;