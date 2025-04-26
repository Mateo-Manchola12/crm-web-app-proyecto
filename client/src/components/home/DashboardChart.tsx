import { ResponsiveLine, type Serie } from '@nivo/line'
import { useEffect, useState } from 'react'

const clients = [31, 40, 28, 51, 42, 109, 100]
const leads = [11, 32, 45, 32, 34, 52, 41]

export default () => {
    const [getData, setData] = useState<Serie[]>([
        { id: 'Clientes', data: clients.map((value, index) => ({ x: index, y: 0 })) },
        { id: 'Leads', data: leads.map((value, index) => ({ x: index, y: 0 })) },
    ])
    useEffect(() => {
        let count = 0
        const interval = setInterval(() => {
            setData((prev) => {
                const newData = [...prev]
                clients.forEach((value, index) => {
                    newData[0].data[index].y = (value / 100) * count
                })
                leads.forEach((value, index) => {
                    newData[1].data[index].y = (value / 100) * count
                })

                return newData
            })
            count++
            if (count > 100) {
                clearInterval(interval)
            }
        }, 10)
    }, [])

    return (
        <ResponsiveLine
            data={getData}
            margin={{ top: 10, right: 10, bottom: 25, left: 10 }}
            xScale={{ type: 'point' }}
            yScale={{
                type: 'linear',
                min: 0,
                max: 120,
                stacked: false,
                reverse: false,
            }}
            curve="cardinal"
            lineWidth={5}
            axisBottom={null}
            axisLeft={null}
            enableArea={true}
            areaOpacity={0.2}
            enableGridX={false}
            enablePoints={false}
            enableTouchCrosshair={true}
            useMesh={true}
            legends={[
                {
                    anchor: 'bottom',
                    direction: 'row',
                    justify: false,
                    translateX: 0,
                    translateY: 20,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemBackground: 'rgba(0, 0, 0, .03)',
                                itemOpacity: 1,
                            },
                        },
                    ],
                },
            ]}
            animate={true}
            motionConfig="gentle"
        />
    )
}
