"use client"

import { use, useEffect, useState } from "react"
import axios from "axios"

export default function HeightCounter() {

    const [blockHeight, setBlockHeight] = useState(0)
    const [displayedBlockHeight, setDisplayedBlockHeight] = useState(false)
    const url = "https://blockchain.info/q/getblockcount"

    const animateBlockHeight = (blockHeight) => {
        let i = 0;

        const updateHeight = () => {
            if (i < blockHeight) {
                setDisplayedBlockHeight(i)
                i += 11232

                setTimeout(updateHeight, 10)
            } else {
                setDisplayedBlockHeight(blockHeight)
            }
        };

        updateHeight();
    };


    useEffect(() => {


        const getData = async () => {
            try {
                const res = await axios.get(url);
                setBlockHeight(res.data)
                console.log(typeof res.data);

            } catch (error) {
                console.log("error", error);

            }
        }

        getData()
    }, [])


    useEffect(() => {
        animateBlockHeight(blockHeight)
    }, [blockHeight])


    return (

        <div className="border border-light-bg rounded-lg w-[25rem] h-[15rem] flex flex-col items-center">
            <span className="font-semibold border-b w-full flex items-center justify-center p-5">Blockchain height</span>
            <div className="flex flex-col items-center justify-center w-full h-[9rem]">
                <span className="font-medium text-2xl">{displayedBlockHeight}</span>
            </div>
        </div>
    )
}