import React from 'react'
import Speedometer from '../components/Speedometer'
import { useDataList } from '../contexts/dataList'
import ApexCharts from 'react-apexcharts'
import haversine from 'haversine-distance'

export default function Content() {
    const [isStarted, setIsStarted] = React.useState(false)
    const [isPaused, setIsPaused] = React.useState(false)
    const [watchId, setWatchId] = React.useState<number>()
    const { dataList, setDataList } = useDataList()

    const currentSpeed = React.useMemo(() => {
        return (dataList[dataList.length - 1]?.coords?.speed || 0) * 3.6
    }, [dataList])

    const averageSpeed = React.useMemo(() => {
        return (
            (dataList
                .filter((y) => y.coords.speed)
                .reduce((x, y) => x + (y.coords.speed || 0), 0) /
                dataList.length) *
                3.6 || 0
        )
    }, [dataList])

    const maxSpeed = React.useMemo(() => {
        return dataList.length
            ? Math.max(...dataList.map((e) => e?.coords?.speed || 0)) * 3.6
            : 0
    }, [dataList])

    const time = React.useMemo(() => {
        if (dataList.length >= 2) {
            return (
                (dataList[dataList.length - 1].timestamp -
                    dataList[0].timestamp) /
                1000 /
                3600
            )
        } else {
            return 0
        }
    }, [dataList])

    const totalDistance = React.useMemo(() => {
        let total = 0
        for (let i = 1; i < dataList.length; i++) {
            total +=
                haversine(dataList[i - 1].coords, dataList[i].coords) *
                Math.pow(10, -3)
        }
        return total
    }, [dataList])

    const stopRecording = () => {
        if (watchId) {
            navigator.geolocation.clearWatch(watchId)
            setWatchId(undefined)
        }
        setIsStarted(false)
        setDataList([])
    }

    const pauseRecording = () => {
        if (watchId) {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId)
                setWatchId(undefined)
            }
            setIsPaused(true)
        } else {
            startRecording()
            setIsPaused(false)
        }
    }

    const startRecording = () => {
        setIsStarted(true)

        const success = (pos: GeolocationPosition) => {
            setDataList((x) => [...x, pos])
        }

        const error = (err: GeolocationPositionError) => {
            alert(err.message)
            stopRecording()
        }

        if (typeof navigator !== 'undefined' && navigator.geolocation) {
            const options = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }

            setWatchId(
                navigator.geolocation.watchPosition(success, error, options),
            )
        } else {
            console.log('Geolocation is not supported!')
            alert('Geolocation is not supported!')
            stopRecording()
        }
    }

    return (
        <>
            <div className='custom-container relative pt-16 pb-12'>
                <div className='text-center mb-4 w-full flex flex-row justify-center'>
                    <Speedometer value={Math.round(currentSpeed)} />
                </div>
                <div className='grid gap-3 grid-cols-2 w-full mb-4'>
                    <div className='bg-white dark:bg-gray-900 shadow px-2 py-2 rounded text-center'>
                        <span className='text-gray-600 text-nowrap'>
                            Total Distance
                        </span>
                        <p className='text-xl sm:text-2xl md:text-3xl text-cyan-500'>
                            {totalDistance.toFixed(2)} <small>km</small>
                        </p>
                    </div>
                    <div className='bg-white dark:bg-gray-900 shadow px-2 py-2 rounded text-center'>
                        <span className='text-gray-600 text-nowrap'>
                            Max Speed
                        </span>
                        <p className='text-xl sm:text-2xl md:text-3xl text-cyan-500'>
                            {maxSpeed.toFixed(2)} <small>km/h</small>
                        </p>
                    </div>
                    <div className='bg-white dark:bg-gray-900 shadow px-2 py-2 rounded text-center'>
                        <span className='text-gray-600 text-nowrap'>Time</span>
                        <p className='text-xl sm:text-2xl md:text-3xl text-cyan-500'>
                            {Math.floor(time)} <small>hour(s)</small>
                        </p>
                    </div>
                    <div className='bg-white dark:bg-gray-900 shadow px-2 py-2 rounded text-center'>
                        <span className='text-gray-600 text-nowrap'>
                            Average Speed
                        </span>
                        <p className='text-xl sm:text-2xl md:text-3xl text-cyan-500'>
                            {averageSpeed.toFixed(2)} <small>km/h</small>
                        </p>
                    </div>
                </div>
                <div className='text-center'>
                    {isStarted ? (
                        <>
                            <button
                                type='button'
                                className='bg-transparent ring-2 ring-cyan-500 text-cyan-500 px-6 py-3 me-3 text-lg rounded-lg outline-none'
                                onClick={pauseRecording}
                            >
                                {isPaused ? 'Resume' : 'Pause'}
                            </button>
                            <button
                                type='button'
                                className='bg-transparent ring-2 ring-cyan-500 text-cyan-500 px-6 py-3 text-lg rounded-lg outline-none'
                                onClick={stopRecording}
                            >
                                Stop
                            </button>
                        </>
                    ) : (
                        <button
                            type='button'
                            className='bg-transparent ring-2 ring-cyan-500 text-cyan-500 px-6 py-3 text-lg rounded-lg outline-none'
                            onClick={startRecording}
                        >
                            Start
                        </button>
                    )}
                </div>
            </div>
            <div className='mt-8'>
                <ApexCharts
                    type='area'
                    height={400}
                    width='100%'
                    series={[
                        {
                            name: 'Speed in km/h',
                            data: dataList.map((e) => [
                                e.timestamp,
                                Math.round(e.coords.speed || 0) * 3.6,
                            ]),
                        },
                    ]}
                    options={{
                        theme: {
                            mode: 'dark',
                        },
                        chart: {
                            background: '#000',
                            zoom: {
                                autoScaleYaxis: true,
                            },
                            fontFamily: 'Squada One',
                        },
                        dataLabels: {
                            enabled: false,
                        },
                        xaxis: {
                            type: 'datetime',
                            tickAmount: 6,
                            labels: {
                                format: 'mm:hh:ss MM/DD'
                            }
                        },
                        yaxis: {
                            max:
                                maxSpeed > 200
                                    ? 400
                                    : maxSpeed > 160
                                      ? 200
                                      : maxSpeed > 80
                                        ? 160
                                        : 80,
                            min: 0,
                            tickAmount: 8
                        },
                    }}
                />
            </div>
        </>
    )
}
