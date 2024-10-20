import SpeedometerComponent, {
    Arc,
    Background,
    Needle,
    DangerPath,
    Progress,
    Marks,
    Indicator,
} from 'react-speedometer'

export default function Speedometer({ value }: { value: number }) {
    return (
        <SpeedometerComponent
            value={value}
            max={400}
            angle={270}
            fontFamily='Squada One'
        >
            <Background angle={270} />
            <Arc />
            <Needle />
            <Progress />
            <Marks step={25} />
            <DangerPath angle={120} />
            <Indicator />
        </SpeedometerComponent>
    )
}
