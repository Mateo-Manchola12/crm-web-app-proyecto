import { ResponsiveLine, type LineSeries } from '@nivo/line'
import { NIVO_COLORS } from '@constants/NIVO_COLORS.ts'

export default function LineChart({ data }: { data: LineSeries[] }) {
    return (
        <ResponsiveLine
            data={data}
            margin={{ top: 50, right: 30, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{
                type: 'linear',
                min: data[0].data.reduce((min, d) => Math.min(min, d.y as number), Infinity),
                max: data[0].data.reduce((max, d) => Math.max(max, d.y as number), 0) + 1,
                stacked: false,
                reverse: false,
            }}
            enableArea={true}
            curve="cardinal"
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Mes',
                legendPosition: 'middle',
                legendOffset: 32,
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Cantidad',
                legendPosition: 'middle',
                legendOffset: -40,
            }}
            colors={NIVO_COLORS}
            pointSize={15}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={4}
            pointBorderColor={{ from: 'seriesColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            lineWidth={4}
            role="application"
            ariaLabel="Gráfico de líneas"
            enablePointLabel={true}
            pointAriaLabel={(point) =>
                `Punto en x: ${point.data.xFormatted}, y: ${point.data.yFormatted}`
            }
        />
    )
}
