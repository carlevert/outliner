import * as React from "react"
import Node from "./Node";

interface NodeListProps {
    ids: string[];
    level: number;
}

const NodeList = (props: React.PropsWithChildren<NodeListProps>) => {
    return <>{props.ids.map(cId => <Node nodeId={cId} level={props.level}/>)}</>;
}

export default NodeList;