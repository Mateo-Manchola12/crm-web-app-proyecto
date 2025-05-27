import { ResponsivePie } from '@nivo/pie'
import { NIVO_COLORS } from '@constants/NIVO_COLORS.ts'

export default function PieChart({
    data,
}: {
    data: { id: string; label: string; value: number }[]
}) {
    return (
        <ResponsivePie
            data={data}
            margin={{ top: 20, right: 100, bottom: 20, left: 100 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            motionConfig={'gentle'}
            colors={NIVO_COLORS}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{
                from: 'color',
                modifiers: [['darker', 0.2]],
            }}
            arcLinkLabel="label"
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
                from: 'color',
                modifiers: [['darker', 2]],
            }}
            tooltip={({ datum }) => (
                <div
                    style={{
                        background: 'white',
                        padding: '5px 10px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                    }}
                >
                    <strong>{datum.label}</strong>: {datum.value}
                </div>
            )}
        />
    )
}
