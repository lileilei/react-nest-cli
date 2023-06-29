import React from "react"
import { createAlova, useRequest, invalidateCache } from 'alova';
import alovaInstance from "../../util/alova"

const getTodoList = currentPage => {
    return alovaInstance.Get('/api/app');
};


function HlhtMenu() {

    const { onSuccess, send, data, error } = useRequest(
        getTodoList,
        {
            immediate: false
        }
    );
    onSuccess(() => {
        invalidateCache(getTodoList(1));
    });
    const handleClick = () => {
        send();
    };

    return (
        <span><button onClick={() => {
            handleClick()
        }}>hello</button><span>responseDBData: {JSON.stringify(data)}</span></span>
    )
}

export default HlhtMenu