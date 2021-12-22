import {createAction, createReducer, current, nanoid} from "@reduxjs/toolkit";

export interface Node {
    id: string;
    parent?: string;
    children: string[]
    text: string,
    collapsed: boolean
}

export interface TreeState {
    root: Node;
    current: string,
    nodes: {
        [id: string]: Node
    }
}

const firstChild: Node = {
    id: nanoid(),
    text: '',
    children: [],
    collapsed: false,
    parent: '0'
}

const root: Node = {
    id: '0',
    text: 'root',
    parent: undefined,
    children: [firstChild.id],
    collapsed: false
}

const initialState: TreeState = {
    current: firstChild.id,
    root,
    nodes: {
        '0': root,
        [firstChild.id]: firstChild
    },
}

export const addNode = createAction<{ text: string, parent: string, first: boolean }>('addNode');

export const setCurrent = createAction<string>('setCurrent');

export const setText = createAction<{ text: string, nodeId: string }>('setText');

export const indentNode = createAction<{ nodeId: string, n: number }>('indentNode');

export const deleteNode = createAction<{ nodeId: string }>("deleteNode");

export const moveCurrentUp = createAction<{ nodeId: string }>('moveCurrent');

export const moveCurrentDown = createAction<{ nodeId: string }>('moveDown');

export const treeReducer = createReducer(initialState, builder => {
    builder
        .addCase(addNode, (state, action) => {
            const newNode = {
                id: nanoid(),
                text: action.payload.text,
                parent: action.payload.parent,
                children: [],
                collapsed: false
            };

            const parent = action.payload.parent ? action.payload.parent : '0';

            state.nodes[newNode.id] = newNode;
            if (action.payload.first) {
                state.nodes[parent].children.unshift(newNode.id);
            } else {
                state.nodes[parent].children.push(newNode.id);
            }
            state.current = newNode.id;

        })
        .addCase(setCurrent, (state, action) => {
            state.current = action.payload;
        })
        .addCase(setText, (s, a) => {
            s.nodes[a.payload.nodeId].text = a.payload.text
        })
        .addCase(indentNode, (state, action) => {

            let desiredParent!: string;
            let currentParent!: string;

            if (action.payload.n > 0) {
                currentParent = state.nodes[action.payload.nodeId].parent!;
                const c = state.nodes[currentParent].children;

                for (let i = c.length - 1; i >= 0; i--) {
                    if (c[i] === action.payload.nodeId) {
                        if (i - 1 < 0)
                            return;
                        desiredParent = c[i - 1];
                        break;
                    }
                }
            } else {
                currentParent = state.nodes[action.payload.nodeId].parent!;
                if (currentParent === '0')
                    return;
                desiredParent = state.nodes[currentParent].parent!
            }

            state.nodes[action.payload.nodeId].parent = desiredParent;
            state.nodes[desiredParent].children.push(action.payload.nodeId);
            state.nodes[currentParent].children = state.nodes[currentParent].children.filter(t => t !== action.payload.nodeId);


        })
        .addCase(deleteNode, (state, action) => {
            const parent = state.nodes[state.nodes[action.payload.nodeId].parent!];

            // Do nothing on last child of root
            if (parent.id === '0' && parent.children.length === 1)
                return;

            // Select new current
            const i = parent.children.indexOf(action.payload.nodeId);
            if (i > 0)
                state.current = parent.children[i - 1]
            else
                state.current = parent.id;

            // Move children
            const children = state.nodes[action.payload.nodeId].children;
            if (children.length > 0) {

                state.nodes[state.current].children = [...state.nodes[state.current].children, ...children]
            }

            // Delete node
            state.nodes[parent.id].children = parent.children.filter(t => t !== action.payload.nodeId);
            delete state.nodes[action.payload.nodeId];
        })
        .addCase(moveCurrentUp, (state, action) => {
            const parent = state.nodes[state.nodes[action.payload.nodeId].parent!];

            const currIndex = parent.children.indexOf(action.payload.nodeId)
            if (currIndex > 0) {
                state.current = parent.children[currIndex - 1];
            } else if (currIndex === 0) {
                if (state.nodes[parent.id].children.length > 0) {
                    state.current = state.nodes[parent.id].children[state.nodes[parent.id].children.length - 1]
                } else {
                    state.current = parent.id;
                }
            }

        })
        .addCase(moveCurrentDown, (state, action) => {
            const parent = state.nodes[state.nodes[action.payload.nodeId].parent!];

            const currIndex = parent.children.indexOf(action.payload.nodeId)
            if (currIndex + 1 < parent.children.length)
                state.current = parent.children[currIndex + 1];
        });
});