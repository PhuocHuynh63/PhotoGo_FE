import { Card, CardContent, CardHeader, CardTitle } from "@components/Atoms/Card";
import { cn } from "@helpers/CN";

export default function SummaryCard({
    title,
    value,
    icon,
    iconClassName,
    description,
    subtitle = "So với tháng trước",
    trend,
    trendValue,
    change,
    changeIcon,
    changeColor = "text-emerald-500",
    layout = "header",
    className,
}: ICOMPONENTS.StatsCardProps) {
    const renderTrend = () => {
        if (trend && trendValue) {
            const trendColor = {
                up: "text-green-600",
                down: "text-red-600",
                neutral: "text-gray-600",
            }

            const trendSymbol = {
                up: "↑",
                down: "↓",
                neutral: "",
            }

            return (
                <p className={cn("mt-2 text-xs font-medium", trendColor[trend])}>
                    {trendSymbol[trend]} {trendValue}
                </p>
            )
        }

        if (change && changeIcon) {
            return (
                <p className="text-xs text-muted-foreground">
                    <span className={cn(changeColor, "flex items-center gap-1")}>
                        {changeIcon}
                        {change}
                    </span>{" "}
                    {subtitle}
                </p>
            )
        }

        return null
    }

    return (
        <Card className={cn("overflow-hidden", className)}>
            {layout === "header" ? (
                <>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{title}</CardTitle>
                        {icon && <div className={cn("shrink-0", iconClassName)}>{icon}</div>}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{value}</div>
                        {renderTrend()}
                    </CardContent>
                </>
            ) : (
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{title}</p>
                            <h3 className="mt-1 text-2xl font-semibold">{value}</h3>
                            {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
                            {renderTrend()}
                        </div>
                        {icon && (
                            <div
                                className={cn(
                                    "flex h-12 w-12 items-center justify-center rounded-full",
                                    iconClassName || "bg-primary/10 text-primary"
                                )}
                            >
                                {icon}
                            </div>
                        )}
                    </div>
                </CardContent>
            )}
        </Card>
    )
}