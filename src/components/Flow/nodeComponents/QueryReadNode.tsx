import React from 'react'
import { Handle, Position } from 'reactflow';
import { Card, Dropdown } from 'antd';

import { createCardTitle, createDebug, createSelect, createTextArea, nodeStyle, getI18n } from './Base'

import i18n from "i18next";


const createUrl = (title1: string, title2: string, placeholder2: string, json: any, onChange: any) => {
  const { query, content } = json;
  // console.log("selection", content);
  const key = 'query'
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
      createSelect(title1, content || "bindCurrentPage", [
        { value: 'bindCurrentPageHTML', label: i18n.t('bindWebHTML') },
        { value: 'bindCurrentPage', label: i18n.t('bindWebContent') },
        { value: 'bindCurrentPageImages', label: i18n.t('bindWebImages') },
        { value: 'bindCurrentPageURL', label: i18n.t('bindWebURL') },
        { value: 'bindCurrentPageTitle', label: i18n.t('bindWebTitle') },

      ], (e: any) => {

        if (e.key == title1) {
          // console.log(e)
          const data = {
            ...json,
            content: e.data,
            action: 'read'
          }

          onChange({
            key: "query",
            data
          })
        }

      })
    }

    {
      content === 'bindCurrentPageHTML' || content === 'bindCurrentPage' || content === 'bindCurrentPageImages' ?
        createTextArea(title2, query, placeholder2, "", (e: any) => {
          const data = {
            ...json,
            query: e.data,
            action: 'read'
          }

          onChange({
            key: "query",
            data
          })
        }) : null
    }
    {
      content === 'bindCurrentPageHTML' || content === 'bindCurrentPage' || content === 'bindCurrentPageImages' ?
        <p style={{ marginTop: 5, color: "red", fontSize: 12 }}>{i18n.t('queryReadPlaceholderTips')}</p> : null
    }

  </div>
}



function QueryReadNode({ id, data, selected }: any) {
  // i18nInit();
  const { debugMenu, contextMenus } = getI18n();
  const [statusInputForDebug, setStatusInputForDebug] = React.useState('');
  const [debugInput, setDebugInput] = React.useState((data.merged ? JSON.stringify(data.merged, null, 2) : ""));
  const [shouldRefresh, setShouldRefresh] = React.useState(true)

  const [queryObj, setQueryObj] = React.useState(data.queryObj)
  const updateData = (e: any) => {
    // console.log(e)
    if (e.key === 'query') {
      setQueryObj(e.data);
      data.onChange({ id, data: { queryObj: e.data } })
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
      createUrl(i18n.t('content'), i18n.t('selectQuery'), i18n.t('queryReadPlaceholder'), queryObj, updateData)
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
    //       if (debugInput != "" && debugInput && debugInput.replace(/\s/ig, "") != "[]" && statusInputForDebug != 'error') {
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
    //       } else if (debugInput == "" || debugInput && debugInput.replace(/\s/ig, "") == "[]") {
    //         data.merged = null;
    //         data.debugInput = "";
    //         if (data.role) data.role.merged = null;
    //         console.log('debugFun no merged', data)
    //         data.debug && data.debug(data)
    //         setShouldRefresh(true);
    //       } else if (debugInput === undefined) {
    //         data.debug && data.debug(data);
    //         setShouldRefresh(true);
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
      title={createCardTitle(i18n.t('queryReadNodeTitle'), id, data)}
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

export default QueryReadNode;