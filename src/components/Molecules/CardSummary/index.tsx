import { Card, CardContent, CardHeader, CardTitle } from "@components/Atoms/Card";
import { cn } from "@helpers/CN";

export default function SummaryCard({
    title,
    icon,
    value,
    change,
    changeColor = "text-emerald-500",
    changeIcon,
    subtitle = "so với tháng trước",
}: ICOMPONENTS.StatsCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">
                    <span className={cn(changeColor, "flex items-center")}>
                        {changeIcon}
                        {change}
                    </span>{" "}
                    {subtitle}
                </p>
            </CardContent>
        </Card>
    );
}