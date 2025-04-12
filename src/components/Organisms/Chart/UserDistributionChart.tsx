import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/Atoms/Card";
import BarChart from "@molecules/Charts/BarChart";



const UserDistributionChart: React.FC<ICOMPONENTS.DataChartProps> = ({
    data,
    title = "Phân phối người dùng",
    description = "Phân tích các loại người dùng trên nền tảng",
    className,
}) => {
    const formatTooltipValue = (value: number) => {
        return `${value}%`
    }

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <BarChart
                    data={data}
                    height={300}
                    bars={[{ dataKey: "value", fill: "#8884d8", name: "Percentage" }]}
                    tooltipFormatter={formatTooltipValue}
                />
            </CardContent>
        </Card>
    )
}

export default UserDistributionChart