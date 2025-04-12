import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/Atoms/Card";
import LineChart  from "@molecules/Charts/LineChart";


const PlatformOverviewChart: React.FC<ICOMPONENTS.DataChartProps> = ({
    data,
    title = "Tổng quan về nền tảng",
    description = "Tăng trưởng hằng tháng",
    className,
  }) => {
    const formatTooltipValue = (value: number, name: string) => {
      if (name.toLowerCase() === "revenue") {
        return `$${value.toLocaleString()}`
      }
      return value.toLocaleString()
    }
  
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <LineChart
            data={data}
            height={300}
            lines={[
              { dataKey: "users", stroke: "#8884d8", name: "Người dùng" },
              { dataKey: "bookings", stroke: "#82ca9d", name: "Đơn hàng" },
              { dataKey: "revenue", stroke: "#ff7300", name: "Doanh thu" },
            ]}
            tooltipFormatter={formatTooltipValue}
          />
        </CardContent>
      </Card>
    )
  }
  
  export default PlatformOverviewChart