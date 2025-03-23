import BtcChart from "@/components/misc/btcChart";
import HeightCounter from "@/components/misc/heightCounter";
import Link from "next/link";
export default function Home() {

    return (

        <div className="flex flex-col items-center p-10 pt-[5rem] gap-10">
            <div className="flex flex-col items-center gap-2 font-medium">
                <span className="text-3xl text-orange-dark">Die Welt von Bitcoin und Blockchain</span>
                <span className="text-lg">Eine Einführung in Kryptowährungen mit der Implementation einer Blockchain-Visualisierung</span>
            </div>

            <div className="flex gap-5 w-[40rem] h-[15rem]">
                <BtcChart />
                <HeightCounter />
            </div>
            <div className="">
                <Link className="border py-2 px-5 rounded-lg" href={"/blockchain"}>Visualisierung</Link>
            </div>
        </div>
    )
}