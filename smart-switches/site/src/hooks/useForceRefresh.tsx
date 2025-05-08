import React from 'react';

const maxTick = 10;

const useForceRefresh = () => {
    const [ticker, setTicker] = React.useState(0)

    const tick = () => {
        setTicker((ticker + 1) % maxTick)
    }

    return tick
}

export default useForceRefresh;
