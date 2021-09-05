/**
 * @description: 在useState之后同步获取最新的state
 */

import { useEffect, useState, useCallback } from "react";

const useSyncCallback = (callback) => {
    const [proxyState, setProxyState] = useState({ current: false });

    const fn = useCallback(() => {
        setProxyState({ current: true });
    }, [proxyState]);

    useEffect(() => {
        if (proxyState.current) {
            setProxyState({ current: false });
        }
    }, [proxyState]);

    useEffect(() => {
        proxyState.current && callback();
    });
    return fn;
};

export default useSyncCallback;
