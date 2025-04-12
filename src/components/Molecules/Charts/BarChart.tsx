import type React from "react"
import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"
import ChartContainer from "@atoms/Chart/ChartContainer"
import ChartTooltip from "@atoms/Chart/ChartTooltip"

const BarChart: React.FC<ICOMPONENTS.BarChartProps> = ({
    data,
    bars,
    height = 300,
    xAxisDataKey = "name",
    showGrid = true,
    showLegend = true,
    layout = "horizontal",
    tooltipFormatter,
}) => {
    return (
        <ChartContainer>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsBarChart
                    data={data}
                    layout={layout}
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
                        type={layout === "vertical" ? "number" : "category"}
                    />
                    <YAxis
                        tick={{ fontSize: 12 }}
                        tickLine={{ stroke: "#f0f0f0" }}
                        axisLine={{ stroke: "#f0f0f0" }}
                        type={layout === "vertical" ? "category" : "number"}
                    />
                    <Tooltip content={<ChartTooltip formatter={tooltipFormatter} />} />
                    {showLegend && <Legend />}
                    {bars.map((bar, index) => (
                        <Bar
                            key={index}
                            dataKey={bar.dataKey}
                            fill={bar.fill}
                            name={bar.name || bar.dataKey}
                            radius={[4, 4, 0, 0]}
                            barSize={layout === "vertical" ? 20 : 30}
                        />
                    ))}
                </RechartsBarChart>
            </ResponsiveContainer>
        </ChartContainer>
    )
}

export default BarChart
