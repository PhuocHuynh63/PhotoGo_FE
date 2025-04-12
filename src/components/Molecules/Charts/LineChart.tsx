import type React from "react"
import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"
import ChartContainer from "@atoms/Chart/ChartContainer"
import ChartTooltip from "@atoms/Chart/ChartTooltip"

const LineChart: React.FC<ICOMPONENTS.LineChartProps> = ({
    data,
    lines,
    height = 300,
    xAxisDataKey = "name",
    showGrid = true,
    showLegend = true,
    tooltipFormatter,
}) => {
    return (
        <ChartContainer>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsLineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
                    <XAxis
                        dataKey={xAxisDataKey}
                        tick={{ fontSize: 12 }}
                        tickLine={{ stroke: "#f0f0f0" }}
                        axisLine={{ stroke: "#f0f0f0" }}
                    />
                    <YAxis tick={{ fontSize: 12 }} tickLine={{ stroke: "#f0f0f0" }} axisLine={{ stroke: "#f0f0f0" }} />
                    <Tooltip content={<ChartTooltip formatter={tooltipFormatter} />} />
                    {showLegend && <Legend />}
                    {lines.map((line, index) => (
                        <Line
                            key={index}
                            type="monotone"
                            dataKey={line.dataKey}
                            stroke={line.stroke}
                            name={line.name || line.dataKey}
                            activeDot={{ r: 8 }}
                            strokeWidth={2}
                        />
                    ))}
                </RechartsLineChart>
            </ResponsiveContainer>
        </ChartContainer>
    )
}

export default LineChart