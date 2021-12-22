import * as React from "react"

interface BulletProps {
    size: number;
}

const Bullet = (props: React.PropsWithChildren<BulletProps>) => {
    return <span style={{marginRight: '10px'}}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 32" width={props.size * 2} height={props.size}>
            <g fill="#333333">
                <circle cx="16" cy="16" r="16"/>
            </g>
        </svg>
    </span>;
}

export default Bullet;