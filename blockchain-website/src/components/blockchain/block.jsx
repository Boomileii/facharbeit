"use client"

import { useEffect, useState, useRef } from "react"
import TransactionTable from "./transactionsTable"
import { LuPickaxe } from "react-icons/lu";
import { ImCross } from "react-icons/im";
import { FaPlus } from "react-icons/fa6";
import { motion } from "framer-motion";
import BlockItemCopy from "./blockItem";
export default function Block({ blockIndex, blockData, mineBlock, addTransaction, removeTransaction, removeBlock, lastBlockIndex, createBlock }) {

    const [isMining, setIsMining] = useState(false)
    const miningAbortRef = useRef(false)
    useEffect(() => {

    }, [])

    return (
        <div className={`flex relative flex-col border ${blockData.valid ? "border-green" : "border-red"} h-[25.5rem] rounded-3xl w-[22rem]`}>
            <div className={` relative flex items-center border-b ${blockData.valid ? "border-green" : "border-red"} p-3`}>
                <div className="flex-1 text-center">Block {blockIndex}</div>
                {
                    blockIndex !== 0 && blockIndex === lastBlockIndex &&
                    <ImCross className="absolute right-9 text-red" onClick={() => removeBlock(blockIndex)} />
                }
            </div>

            <div className={`flex flex-col items-center w-full ${blockIndex !== 0 ? "justify-between": "gap-10"} h-full pb-4`}>
                <TransactionTable blockIndex={blockIndex} addTransaction={addTransaction} removeTransaction={removeTransaction} transactions={blockData.transactions} />
                <div className="flex flex-col self-center px-5">
                    <BlockItemCopy title={"Nonce"} value={blockData.nonce} />
                    <BlockItemCopy title={"Prev Hash"} value={blockData.prevHash} />
                    <BlockItemCopy title={"Hash"} value={blockData.hash} />
                </div>

                {
                    blockIndex !== 0 &&
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
                        <div className="text-sm flex justify-center items-center gap-2 text-red">
                                Cancel
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
                            </div>
                            :
                            <div className="text-sm flex justify-center items-center gap-2">
                                <span>Mine</span>
                                <LuPickaxe />
                            </div>
                    }
                </button>
                            }
            </div>

            {
                blockIndex === lastBlockIndex &&
                <button className="absolute -right-[4.5rem] top-1/2 border-2 text-orange-dark border-white rounded-full h-[2.5rem] w-[2.5rem] flex items-center justify-center" onClick={() => createBlock()}><FaPlus size={25} /></button>
            }
        </div>
    )
}