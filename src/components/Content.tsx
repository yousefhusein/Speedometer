import React from "react";
import Speedometer from "./Speedometer";

export default function Content () {
    const [isStarted, setIsStarted] = React.useState(false)
    const [watchId, setWatchId] = React.useState<number>();
    const [dataList, setDataList] = React.useState<GeolocationPosition[]>([]);

    const currentSpeed = React.useMemo(() => {
        return (dataList[dataList.length - 1]?.coords?.speed || 0) * 3.6;
    }, [dataList])

    const averageSpeed = React.useMemo(() => {
        return dataList.filter(e => e.coords.speed).reduce((x, y) => x + (y.coords.speed || 0), 0) * 3.6;
    }, [dataList])

    const totalDistance = React.useMemo(() => {
        let total = 0;
    
        for (let i = 1; i < dataList.length; i++) {
            const prevPosition = dataList[i - 1];
            const currentPosition = dataList[i];
    
            if (prevPosition && currentPosition) {
                const timeDiffHours = (currentPosition.timestamp - prevPosition.timestamp) / 1000 / 3600;
                const distance = (currentPosition.coords.speed || 0) * timeDiffHours;
    
                total += distance;
            }
        }
    
        return total;
    }, [dataList]);

    const time = React.useMemo(() => {
        if (dataList.length >= 2) {
            return (dataList[dataList.length - 1].timestamp - dataList[0].timestamp) / 1000 / 3600;
        } else {
            return 0;
        }
    }, [dataList])

    const stopRecording = () => {
        if (watchId) {
            navigator.geolocation.clearWatch(watchId);
            setWatchId(undefined);
        }
        setIsStarted(false)
    }

    const startRecording = () => {
        setIsStarted(true)
        
        const success = (pos: GeolocationPosition) => {
            setDataList(x => [...x, pos])
        };
    
        const error = (err: GeolocationPositionError) => {
            alert(err.message);
            stopRecording()
        };
    
        if (typeof navigator !== 'undefined' && navigator.geolocation) {
            const options = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            };
    
            setWatchId(navigator.geolocation.watchPosition(success, error, options))
        } else {
            console.log('Geolocation is not supported!');
            alert('Geolocation is not supported!');
            stopRecording()
        }
    }

    return (
        <div className="custom-container relative pt-16 pb-12">
            <div className="text-center mb-4 w-full flex flex-row justify-center">
                <Speedometer value={Math.round(currentSpeed)} />
            </div>
            <div className="grid gap-3 grid-cols-2 w-full mb-4">
                <div className="bg-white dark:bg-gray-900 shadow px-2 py-2 rounded text-center">
                    <span className="text-gray-600 text-nowrap">Total Distance</span>
                    <p className="text-xl sm:text-2xl md:text-3xl text-cyan-500">
                        {totalDistance.toFixed(2)} <small>km</small>
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-900 shadow px-2 py-2 rounded text-center">
                    <span className="text-gray-600 text-nowrap">Max Speed</span>
                    <p className="text-xl sm:text-2xl md:text-3xl text-cyan-500">
                        {(Math.max(...dataList.map(e => e.coords.speed || 0)) || 0).toFixed(2)} <small>km/h</small>
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-900 shadow px-2 py-2 rounded text-center">
                    <span className="text-gray-600 text-nowrap">Time</span>
                    <p className="text-xl sm:text-2xl md:text-3xl text-cyan-500">
                        {Math.floor(time)} <small>hour(s)</small>
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-900 shadow px-2 py-2 rounded text-center">
                    <span className="text-gray-600 text-nowrap">Average Speed</span>
                    <p className="text-xl sm:text-2xl md:text-3xl text-cyan-500">
                        {averageSpeed.toFixed(2)} <small>km/h</small>
                    </p>
                </div>
            </div>
            <div className="text-center">
                {
                    isStarted
                        ? (
                            <button
                                type="button"
                                className="bg-red-700 px-5 py-4 text-lg rounded-lg"
                                onClick={stopRecording}
                            >Stop Recording</button>
                        )
                        : (
                            <button
                                type="button"
                                className="bg-indigo-700 px-5 py-4 text-lg rounded-lg"
                                onClick={startRecording}
                            >Start Recording</button>
                        )
                }
            </div>
        </div>
    );
}