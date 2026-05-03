import type { ElementType } from "react"
import { Card, CardContent } from "../ui/card"

interface statsCardInterface {
    icon: ElementType,
    label: string,
    stat: string,
    bgColor: string,
    iconColor: string
}

const StatsCard = ({ icon: Icon, label, stat, bgColor, iconColor }: statsCardInterface) => {
    return (
        <Card className={`w-52 hover:scale-105 hover:border-gray-500 transition-all duration-200 ${bgColor}`}>
            <CardContent className="flex flex-row items-center gap-3">
                <div className={`p-2 rounded-sm bg-${bgColor}`}>
                    <Icon className={`${iconColor}`} />
                </div>
                <div className='flex flex-col justify-center'>
                    <h3 className="opacity-70 text-sm font-semibold">{label}</h3>
                    <p className="font-bold">{stat}</p>
                </div>
            </CardContent>
        </Card>
    )
}

export default StatsCard