import * as React from "react"
import {useAppDispatch, useAppSelector} from "./app/hooks";
import {
    addNode,
    deleteNode,
    indentNode,
    moveCurrentDown,
    moveCurrentUp,
    setCurrent,
    setText
} from "./features/tree/treeSlice";
import Bullet from "./Bullet";
import styles from "./Node.module.css";
import cx from "classnames";
import {useEffect, useRef, useState} from "react";
import NodeList from "./NodeList";

export interface NodeProps {
    nodeId: string;
    level: number;
}


const Node = (props: React.PropsWithChildren<NodeProps>) => {

    const node = useAppSelector(state => state.treeReducer.nodes[props.nodeId]);
    const active = useAppSelector(state => state.treeReducer.current);
    const dispatch = useAppDispatch();
    const inputRef = useRef<HTMLInputElement>(null);

    function handleClick(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        if (active !== node.id)
            dispatch(setCurrent(node.id))
        else
            inputRef.current!.focus()
    }

    const item = cx({
        [styles.item]: true,
        [styles.selected]: active === props.nodeId
    });

    const [value, setValue] = useState<string>(node?.text);

    useEffect(() => {
        if (active === props.nodeId && inputRef.current !== null) {
            setValue(node.text);
            inputRef.current.focus();
        }
    }, [active, props.nodeId]);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setValue(e.currentTarget.value);
    }

    function handleInputBlur(e: React.FocusEvent<HTMLInputElement>) {
        if (value.trim() === '')
            dispatch(deleteNode({nodeId: node.id}));
        else if (value !== node.text)
            dispatch(setText({text: value, nodeId: node.id}));
    }

    function handleOnKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Backspace' && value === '') {
            e.preventDefault();
            dispatch(deleteNode({nodeId: node.id}))
        }
        if (e.key === "Enter") {
            e.preventDefault();
            if (value === '')
                return;
            if (value !== node.text)
                dispatch(setText({text: value, nodeId: node.id}));
            const parent = node.children.length === 0 ? node.parent! : node.id;
            dispatch(addNode({text: '', parent, first: node.id === parent}))
        }
        if (e.key === 'Tab') {
            const n = e.shiftKey ? -1 : 1;
            e.preventDefault();
            if (value !== node.text)
                dispatch(setText({text: value, nodeId: node.id}));
            dispatch(indentNode({nodeId: node.id, n}))
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (value !== node.text)
                dispatch(setText({text: value, nodeId: node.id}));
            dispatch(moveCurrentUp({nodeId: node.id}));
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (value !== node.text)
                dispatch(setText({text: value, nodeId: node.id}));
            dispatch(moveCurrentDown({nodeId: node.id}));
        }
    }

    if (node.id === '0')
        return <NodeList ids={node.children} level={props.level + 1}/>;

    const contentStyle = cx({
        [styles.content]: true,
        [styles.l1]: props.level === 1,
        [styles.l2]: props.level === 2,
        [styles.l3]: props.level === 3
    });

    const bulletSize = props.level > 2 ? 0 : 6;

    if (active === props.nodeId) {
        return <div className={styles.container}
                    onClick={e => handleClick(e)}
        >
            <div className={item}>
                <Bullet size={bulletSize}/>
                <span className={contentStyle}>
                <input className={styles.input}
                       value={value}
                       onChange={e => handleInputChange(e)}
                       onKeyDown={e => handleOnKeyDown(e)}
                       onBlur={e => handleInputBlur(e)}
                       ref={inputRef}/>
                </span>
                <span className={cx(styles.ref, styles.id)}>ID: {node.id}</span>
                <span className={cx(styles.ref, styles.parent)}>P: {node.parent}</span>
            </div>
            <NodeList ids={node.children} level={props.level + 1}/>
        </div>
    } else {
        return <div className={styles.container}
                    onClick={e => handleClick(e)}
        >
            <div className={item}>
                <Bullet size={bulletSize}/>
                <span className={contentStyle}>{node.text === '' ? '[ nothing ]' : node.text}</span>
                <span className={cx(styles.ref, styles.id)}>ID: {node.id}</span>
                <span className={cx(styles.ref, styles.parent)}>P: {node.parent}</span>
            </div>
            <NodeList ids={node.children} level={props.level + 1}/>
        </div>
    }

}

export default Node;