import React from 'react'
import { Handle, NodeProps, Position, useUpdateNodeInternals } from 'reactflow';

import { Input, Avatar, Card, Select, Radio, InputNumber, Dropdown, Space, Button, Divider, MenuProps } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';

import { createDebug, nodeStyle, selectNodeInputBase, getI18n } from './Base'

import i18n from "i18next";
// import { i18nInit } from '../i18nConfig';


function Main({ id, data, selected }: any) {

    // i18nInit();
    const { debugMenu, contextMenus } = getI18n();
    const [statusInputForDebug, setStatusInputForDebug] = React.useState('');
    const [debugInput, setDebugInput] = React.useState((data.merged ? JSON.stringify(data.merged, null, 2) : ""));
    const [shouldRefresh, setShouldRefresh] = React.useState(true)


    const updateData = (e: any) => {
        if (e.key == "debug") data.onChange({ id, data: e.data })
        if (e.key == 'draggable') data.onChange({ id, data: { draggable: e.data } });
        if (e.key == 'inputs') data.onChange({
            id, data: {
                inputs: e.data
            }
        });
        if (e.key === "nodeInput") {
            // console.log(inputs, e.index, e.data,nodeOpts.filter((n: any) => n.value == e.data));
            const inps = Array.from(inputs, (i: string, index) => {
                if (index === e.index) i = e.data;
                return i;
            });
            // console.log(JSON.stringify(inps,null,2))
            setInputs(inps)
            data.onChange({
                id,
                data: {
                    inputs: inps
                }
            });
        }
    }

    let nodeOpts: any[] = [];
    if (data.getNodes) nodeOpts = [...data.getNodes(id)];

    const [inputs, setInputs] = React.useState(data.inputs ||[])

    // console.log(inputs)

    const createNode = (role: any) => {

        if (shouldRefresh && data.debugInput != debugInput) {
            setDebugInput(data.debugInput);
        }

        return <Card
            key={id}
            title={
                <>
                    <p style={{ marginBottom: 0 }}>{i18n.t('inputMergeNodeTitle')}</p>
                    <p style={{ textOverflow: 'ellipsis', overflow: 'hidden', padding: '0px', paddingTop: '10px', margin: 0, fontWeight: "normal", marginBottom: 10 }}>
                        ID: {id}
                    </p>
                </>
            }
            bodyStyle={{ paddingTop: 0 }}
            style={{ width: 300 }}
        >
            <div style={{
                width: '200px',
                minHeight: '200px'
            }}
                onMouseOver={() => {
                    updateData({
                        key: 'draggable',
                        data: false
                    })
                }}
                onMouseLeave={() => {
                    updateData({
                        key: 'draggable',
                        data: true
                    })
                }}
            >
                <Button onClick={() => {
                    let inps = inputs;
                    nodeOpts[0] && inps.push(nodeOpts[0].value)
                    setInputs(inps);
                    updateData({
                        key: 'inputs',
                        data: inps
                    })
                }} >+</Button>

                <Button onClick={() => {
                    let inps = inputs;
                    inps.pop()
                    setInputs(inps);
                    updateData({
                        key: 'inputs',
                        data: inps
                    })
                }} >-</Button>

                {
                    inputs.length > 0 ?
                        Array.from(
                            inputs,
                            (inp: any, i) =>
                                <div key={i}>{
                                    selectNodeInputBase(inp, nodeOpts, (e: any) => updateData({ ...e, index: i }))
                                }</div>
                        ) : ''
                }
            </div>
            {
                createDebug(debugMenu, id,
                    debugInput,
                    data.debugOutput,
                    (event: any) => {
                        if (event.key == 'input') {
                            const { data } = event;
                            setDebugInput(data)
                            let json: any;
                            try {
                                json = JSON.parse(data);
                                setStatusInputForDebug('')
                            } catch (error) {
                                setStatusInputForDebug('error')
                            }
                        };
                        if (event.key == 'draggable') updateData(event)
                    },
                    () => {
                        console.log('debugFun debugInput', debugInput)
                        if (debugInput != "" && debugInput.replace(/\s/ig, "") != "[]" && statusInputForDebug != 'error') {
                            let merged;
                            try {
                                merged = JSON.parse(debugInput)
                            } catch (error) {

                            }
                            console.log('debugFun merged', merged)
                            data.merged = merged;
                            data.debugInput = JSON.stringify(merged, null, 2);
                            if (data.role) data.role.merged = merged.filter((f: any) => f.role == 'system');
                            data.debug && data.debug(data);
                        } else if (debugInput == "" || debugInput.replace(/\s/ig, "") == "[]") {
                            data.merged = null;
                            data.debugInput = "";
                            if (data.role) data.role.merged = null;
                            console.log('debugFun no merged', data)
                            data.debug && data.debug(data)
                            setShouldRefresh(true);
                        } else if (debugInput === undefined) {
                            data.debug && data.debug(data)
                        }
                    },
                    () => data.merge && data.merge(data),
                    {
                        statusInput: statusInputForDebug,
                        statusOutput: ""
                    })
            }
        </Card>
    }

    return (
        <Dropdown menu={contextMenus(id, data)}
            trigger={['contextMenu']}
        >
            <div style={selected ? {
                ...nodeStyle,
                backgroundColor: 'cornflowerblue'
            } : nodeStyle}

            >
                {createNode("4")}

                <Handle type="target" position={Position.Left} />
                <Handle type="source" position={Position.Right} />

            </div>
        </Dropdown>
    );
}

export default Main;