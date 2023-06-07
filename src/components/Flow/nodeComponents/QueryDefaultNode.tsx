import React from 'react'
import { Handle, NodeProps, Position } from 'reactflow';
import { Input, Card, Select, Radio, InputNumber, Slider, Dropdown, Divider, Space, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const menuNames = {
  title: '进入网页',
  second: 'URL',
  debug: '调试'
}


export type NodeData = {
  debug: any;
  queryObj: any,
  type: string,
  onChange: any
};


const createUrl = (title: string, json: any, onChange: any) => {
  const { protocol, url, init, query, isApi, isQuery } = json;
  const key = 'query';

  return <div onMouseOver={() => {
    onChange({
      key: 'draggable',
      data: false
    })
  }}
    onMouseLeave={() => {
      onChange({
        key: 'draggable',
        data: true
      })
    }}>
    <p>{title}</p>
    <Input addonBefore={
      <Select defaultValue={protocol} onChange={(e: string) => {
        onChange({
          key,
          data: {
            ...json, protocol: e
          }
        })

      }}>
        <Option value="http://">http://</Option>
        <Option value="https://">https://</Option>
      </Select>
    }
      placeholder={`请填写url`}
      defaultValue={url}
      onChange={(e: any) => {
        // console.log('input url',e)
        onChange({
          key,
          data: {
            ...json,
            url: e.target.value,
            action: 'default'
          }
        })
      }}
    />

  </div>
}


function QueryDefaultNode({ id, data, selected }: NodeProps<NodeData>) {
  const [type, setType] = React.useState(data.type)
  // console.log('QueryDefaultNode', data)

  // queryObj
  data.queryObj.isQuery = type === "query";
  const [queryObj, setQueryObj] = React.useState(data.queryObj)
  const updateQueryObj = (e: any) => {
    // console.log(e)
    if (e.key === 'query') {
      setQueryObj(e.data);
      data.onChange({ id, data: { queryObj: e.data } })
    }
    if (e.key == 'draggable') data.onChange({ id, data: { draggable: e.data } })
  }


  const createNode = () => {
    const node = [createUrl(menuNames.second, queryObj, updateQueryObj)];

    if (data.debug) {
      node.push(<Divider dashed />)
      node.push(<Button onClick={(e) => data.debug ? data.debug(data) : ''} >{menuNames.debug}</Button>)
    }

    return <Card
      key={id}
      title={menuNames.title}
      bodyStyle={{ paddingTop: 0 }}
      style={{ width: 300 }}>
      {...node}
    </Card>
  }

  const nodeStyle = selected ? {
    border: '1px solid transparent',
    padding: '2px 5px',
    borderRadius: '12px',
    backgroundColor: 'cornflowerblue'
  } : {
    border: '1px solid transparent',
    padding: '2px 5px'
  };

  const items: MenuProps['items'] = [
    {
      label: menuNames.debug,
      key: 'debug',
    }
  ];

  return (
    <Dropdown menu={{ items, onClick: () => data.debug ? data.debug() : '' }} trigger={['contextMenu']}>
      <div style={nodeStyle} key={id}>
        {createNode()}
        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} />
      </div>
    </Dropdown>
  );
}

export default QueryDefaultNode;