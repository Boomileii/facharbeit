"use client"

import { useEffect, useState, useRef } from "react"
import TransactionTable from "./transactionsTable"
import { LuPickaxe } from "react-icons/lu";
import { ImCross } from "react-icons/im";
import { motion } from "framer-motion";
import BlockItemCopy from "./blockItem";
export default function Block({ blockIndex, blockData, mineBlock, addTransaction, removeTransaction, removeBlock, lastBlockIndex, setIsMiningCanceled }) {

    const [isMining, setIsMining] = useState(false)
    const miningAbortRef = useRef(false)
    useEffect(() => {

    }, [])

    return (
        <div className={`flex flex-col border ${blockData.valid ? "border-green" : "border-red"} h-[25.5rem] rounded-3xl w-[22rem]`}>
            <div className={` relative flex items-center border-b ${blockData.valid ? "border-green" : "border-red"} p-3`}>
                <div className="flex-1 text-center">Block {blockIndex}</div>
                {
                    blockIndex !== 0 && blockIndex === lastBlockIndex &&
                    <ImCross className="absolute right-9 text-red" onClick={() => removeBlock(blockIndex)} />
                }
            </div>

            <div className="flex flex-col items-center w-full justify-between h-full pb-4">
                <TransactionTable blockIndex={blockIndex} addTransaction={addTransaction} removeTransaction={removeTransaction} transactions={blockData.transactions} />
                <div className="flex flex-col self-center px-5">
                    <BlockItemCopy title={"Nonce"} value={blockData.nonce} />
                    <BlockItemCopy title={"Prev Hash"} value={blockData.prevHash} />
                    <BlockItemCopy title={"Hash"} value={blockData.hash} />
                </div>
                <button className="flex gap-2 items-center justify-center border w-28 h-9 rounded-lg" onClick={() => {

                    miningAbortRef.current = false
                    if (!isMining && !blockData.valid) {

                        setIsMining(true)
                        mineBlock(blockIndex, setIsMining, miningAbortRef)
                        return
                    }


                    if (isMining) {
                        console.log("canceling");
                        miningAbortRef.current = true
                    }


                }}>
                    {
                        isMining ?
                            <>
                                <motion.div
                                    animate={{
                                        rotate: [-30, 0, -30],
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 0.5,
                                        ease: "easeInOut",
                                    }}
                                >
                                    <LuPickaxe />
                                </motion.div>
                            </>
                            :
                            <>
                                <span>Mine</span>
                                <LuPickaxe />
                            </>
                    }
                </button>
            </div>
        </div>
    )
}