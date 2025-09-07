import { Card, CardContent } from "../ui/card"

interface statsCardInterface {
    icon: React.ElementType,
    label: string,
    stat: string,
    bgColor: string,
    iconColor: string
}

const StatsCard = ({ icon: Icon, label, stat, bgColor, iconColor }: statsCardInterface) => {

    return (
        <Card className="w-52">
            <CardContent className="flex flex-row items-center gap-3">
                <div className={`p-2 rounded-sm ${bgColor}`}>
                    <Icon className={`${iconColor}`} />
                </div>
                <div className={`flex flex-col justify-center`}>
                    <h3 className="opacity-60 text-sm font-light">{label}</h3>
                    <p className="font-bold">{stat}</p>
                </div>
            </CardContent>
        </Card>
    )
}

export default StatsCard