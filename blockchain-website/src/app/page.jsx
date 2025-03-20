import BtcChart from "@/components/misc/btcChart";
import HeightCounter from "@/components/misc/heightCounter";

export default function Home() {

    return (

        <div className="flex flex-col items-center p-10 pt-[10rem] gap-10">
            <div className="flex flex-col items-center gap-2 font-medium">
                <span className="text-4xl text-orange-dark">Die Welt von Bitcoin und Blockchain</span>
                <span className="text-lg">Eine Einführung in Kryptowährungen mit der Implementation einer Blockchain-Visualisierung</span>
            </div>

            <div className="flex gap-5">
                <BtcChart />
                <HeightCounter />
            </div>
        </div>
    )
}