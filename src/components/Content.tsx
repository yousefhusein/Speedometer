import React from "react";
import Speedometer from "./Speedometer";
import haversineDistance from 'haversine-distance'

export default function Content () {
    const [isStarted, setIsStarted] = React.useState(false)
    const [watchId, setWatchId] = React.useState<number>();
    const [speed, setSpeed] = React.useState<number>(0);
    const [totalDistance, setTotalDistance] = React.useState<number>(0);
    const [dataList, setDataList] = React.useState<number[]>([0]);
    const [time, setTime] = React.useState<number>(0);

    const stopRecording = () => {
        if (watchId) {
            navigator.geolocation.clearWatch(watchId);
            setWatchId(undefined);
        }
        setIsStarted(false);
    }

    const startRecording = () => {
        setIsStarted(true)

        const startedTimestamp = Date.now();
        let lastCoords: GeolocationCoordinates;
        let lastTime: number;
        // Success handler
        const success = (pos: GeolocationPosition) => {
            if ((Date.now() - startedTimestamp) >= 1000 * 15) {
                if (lastCoords && lastTime) {
                    const time = Math.abs(Date.now() - lastTime) / 1000 / 3600
                    const distance = haversineDistance(lastCoords, pos.coords) / 1000
                    setTotalDistance(x => x + distance)
                    setDataList(x => [...x, distance / time])
                    setSpeed(distance / time)
                    setTime(x => x + time)
                }
                lastCoords = pos.coords;
                lastTime = Date.now();
            }
        };
    
        // Error handler
        const error = (err: GeolocationPositionError) => {
            alert(err.message);
            stopRecording()
        };
    
        if (typeof navigator !== 'undefined' && navigator.geolocation) {
            const options = {
                enableHighAccuracy: true, // Request high accuracy for better tracking
                timeout: 10000, // Maximum time to wait for a position (in milliseconds)
                maximumAge: 0 // Do not use a cached position, request a fresh one
            };
    
            setWatchId(navigator.geolocation.watchPosition(success, error, options))
        } else {
            console.log('Geolocation is not supported!');
            alert('Geolocation is not supported!');
            stopRecording()
        }
    }

    return (
        <div className="custom-container relative pt-24 pb-12">
            <div className="text-center mb-4 w-full flex flex-row justify-center">
                <Speedometer value={Math.round(speed)} />
            </div>
            <div className="grid space-x-3 grid-cols-3 w-full mb-4">
                <div className="bg-white dark:bg-gray-900 shadow px-2 py-2 rounded text-center">
                    <span className="text-gray-600 text-nowrap">Total Distance</span>
                    <p className="text-xl sm:text-2xl md:text-3xl text-cyan-500">
                        {totalDistance.toFixed(2)} <small>km</small>
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-900 shadow px-2 py-2 rounded text-center">
                    <span className="text-gray-600 text-nowrap">Max Speed</span>
                    <p className="text-xl sm:text-2xl md:text-3xl text-cyan-500">
                        {(Math.max(...dataList) || 0).toFixed(2)} <small>km/h</small>
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
                        {(dataList.reduce((a, b) => a + b, 0) / dataList.length).toFixed(2)} <small>km/h</small>
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