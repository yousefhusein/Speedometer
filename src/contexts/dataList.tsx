import React, { createContext, useContext, useState } from 'react'

type PropsType = {
    dataList: GeolocationPosition[]
    setDataList: React.Dispatch<React.SetStateAction<GeolocationPosition[]>>
}

const dataListContext = createContext<Partial<PropsType>>({})

export function Provider({ children }: { children: React.ReactNode }) {
    const [dataList, setDataList] = useState<GeolocationPosition[]>([])

    return (
        <dataListContext.Provider value={{ dataList, setDataList }}>
            {children}
        </dataListContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDataList() {
    const { dataList, setDataList } = useContext(dataListContext)

    return {
        setDataList: setDataList!,
        dataList: dataList!,
    }
}
