import * as React from 'react';
import './App.css';
import {useAppSelector} from "./app/hooks";
import Node from "./Node";

const App = () => {
    const state = useAppSelector(state => state.treeReducer.root);

    return <div style={{width: '800px', margin: '10px auto'}}>
        <Node nodeId={state.id} level={0}/>
    </div>
}

export default App;


