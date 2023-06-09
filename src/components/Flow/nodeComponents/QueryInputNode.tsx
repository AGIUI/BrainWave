import React from 'react'
import { Handle, NodeProps, Position } from 'reactflow';
import { Input, Card, Dropdown, Divider } from 'antd';

import { createCardTitle, SelectInput, createDebug, createTextArea, nodeStyle, getI18n } from "./Base"

import i18n from "i18next";


const createUrl = (input: string, json: any, onChange: any) => {

  const { queryObj, userInput, nodeInputId } = json;
  const { query, action } = queryObj;

  let nodeOpts: any[] = [];
  if (json.getNodes) nodeOpts = [...json.getNodes(json.id)]
  let selectNodeValue = input === "nodeInput" ? (nodeInputId || nodeOpts[0].value) : null
  // console.log('createUrl',input, selectNodeValue,nodeOpts)
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

    {
      createTextArea(i18n.t('selectQuery'), query, ".tag", "", (e: any) => {
        const data = {
          ...json,
          queryObj: {
            ...json.queryObj,
            content: '',
            query: e.data,
            action: 'input'
          }
        }
        onChange({
          key: 'data',
          data
        })
      })
    }

    <Divider dashed />
    <p>{i18n.t('queryInputText')}</p>
    <SelectInput 
       nodeInputLabel={i18n.t('nodeInputLabel')}
       userInputLabel={i18n.t('userInputLabel')}
       nodeInputId={selectNodeValue}
       userInput={userInput}
       nodeOpts={nodeOpts}
       onChange={onChange} 
    />
  

  </div>
}



function Main({ id, data, selected }: any) {
  // i18nInit();
  const { debugMenu, contextMenus } = getI18n();
  const [statusInputForDebug, setStatusInputForDebug] = React.useState('');
  const [debugInput, setDebugInput] = React.useState((data.merged ? JSON.stringify(data.merged, null, 2) : ""));
  const [shouldRefresh, setShouldRefresh] = React.useState(true)

  const [queryObj, setQueryObj] = React.useState(data.queryObj);

  const [input, setInput] = React.useState(data.input);

  // 更新数据
  const updateData = (e: any) => {

    if (e.key === 'data') {
      if (e.data.queryObj) setQueryObj(e.data.queryObj);
      data.onChange({ id, data: { ...data, ...e.data } })
    }


    if (e.key === "setInput") {
      setInput(e.data);
      const d: any = {
        ...data,
        input: e.data
      };
      if (e.data == 'userInput' && e.userInput) {
        d.userInput = e.userInput;
      };
      data.onChange({
        id,
        data: d
      })
    }


    if (e.key == 'userInput') {
      const d: any = {
        ...data,
        userInput: e.data
      };
      data.onChange({
        id,
        data: d
      })
    };


    if (e.key === "nodeInput") {
      data.onChange({
        id,
        data: {
          ...data,
          nodeInputId: e.data
        }
      })
    }
    if (e.key == "debug") data.onChange({ id, data: e.data })
    if (e.key == 'draggable') data.onChange({ id, data: { draggable: e.data } })
  }


  const createNode = () => {


    if (data.debugInput != debugInput && shouldRefresh) {
      setDebugInput(data.debugInput);
      setShouldRefresh(false)
    }
    const node = [
      createUrl(
        input,
        data,
        updateData)
    ];


    // node.push(
    //   createDebug(debugMenu, id,
    //     debugInput,
    //     data.debugOutput,
    //     (event: any) => {
    //       if (event.key == 'input') {
    //         const { data } = event;
    //         setDebugInput(data)
    //         let json: any;
    //         try {
    //           json = JSON.parse(data);
    //           setStatusInputForDebug('')
    //         } catch (error) {
    //           setStatusInputForDebug('error')
    //         }
    //       };
    //       if (event.key == 'draggable') updateData(event)
    //     },
    //     () => {
    //       console.log('debugFun debugInput', debugInput)
    //       if (debugInput != "" && debugInput.replace(/\s/ig, "") != "[]" && statusInputForDebug != 'error') {
    //         let merged;
    //         try {
    //           merged = JSON.parse(debugInput)
    //         } catch (error) {

    //         }
    //         console.log('debugFun merged', merged)
    //         data.merged = merged;
    //         data.debugInput = JSON.stringify(merged, null, 2);
    //         if (data.role) data.role.merged = merged.filter((f: any) => f.role == 'system');
    //         data.debug && data.debug(data);
    //       } else if (debugInput == "" || debugInput.replace(/\s/ig, "") == "[]") {
    //         data.merged = null;
    //         data.debugInput = "";
    //         if (data.role) data.role.merged = null;
    //         console.log('debugFun no merged', data)
    //         data.debug && data.debug(data)
    //         setShouldRefresh(true);
    //       } else if (debugInput === undefined) {
    //         data.debug && data.debug(data)
    //       }
    //     },
    //     () => data.merge && data.merge(data),
    //     {
    //       statusInput: statusInputForDebug,
    //       statusOutput: ""
    //     })
    // )

    return <Card
      key={id}
      title={createCardTitle(i18n.t('queryInputNodeTitle'), id, data)

      }
      bodyStyle={{ paddingTop: 0 }}
      style={{ width: 300 }}>
      {...node}
    </Card>
  }


  return (
    <Dropdown menu={contextMenus(id, data)} trigger={['contextMenu']}>
      <div style={selected ? {
        ...nodeStyle,
        backgroundColor: 'cornflowerblue'
      } : nodeStyle} key={id}>
        {createNode()}
        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} />
      </div>
    </Dropdown>
  );
}

export default Main;