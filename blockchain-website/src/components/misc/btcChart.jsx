"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Tooltip, Line, YAxis } from "recharts";

export default function BtcChart() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const url = "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=10";

    const CustomTooltip = ({ active, payload }) => {
        if (!active || !payload || payload.length === 0) return null;
        const date = payload[0].payload.date
        const price = payload[0].payload.price


        return (
            <div className={`border-orange-dark bg-background p-2 rounded-lg shadow-md flex flex-col border`}>
                <span className="text-sm font-semibold">{date}</span>
                <span className="font-semibold">${Math.round(price)}</span>
            </div>
        );
    };


    useEffect(() => {
        console.log("alive");

        const getData = async () => {
            try {
                const res = await axios.get(url);
                const formattedData = res.data.map((item) => ({
                    date: new Date(item[0]).toISOString().split("T")[0], // Convert timestamp to YYYY-MM-DD
                    price: parseFloat(item[4]) // Closing price
                }));

                setData(formattedData);
                setLoading(false)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        getData();
    }, []);

    return (
        <div className="border border-light-bg rounded-lg w-[25rem] h-[15rem] flex flex-col items-center overflow-hidden">
            <span className="font-semibold border-b w-full flex items-center justify-center p-5">Bitcoin price</span>
            <ResponsiveContainer style={{ height: "100%", width: "100%" }}>

                {
                    !loading &&

                    <LineChart data={data}>
                        <Tooltip content={<CustomTooltip />} cursor={false} />
                        <YAxis
                            hide
                            domain={['dataMin - 2200', 'dataMax']}
                            padding={{ top: 20, bottom: 20 }}
                        />
                        <Line type={"monotone"} dataKey="price" stroke="var(--color-orange-dark)" strokeWidth={2} dot={false} activeDot={{ r: 5, fill: "var(--color-orange-dark)" }} />
                    </LineChart>
                }
            </ResponsiveContainer>
        </div>


    );
}
