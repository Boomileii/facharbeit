"use client"

import { useEffect, useState } from "react"
import TransactionTable from "./transactionsTable"
import { LuPickaxe } from "react-icons/lu";
export default function Block({ blockIndex, blockData, mineBlock, addTransaction, removeTransaction }) {

    const [currentNonce, setCurrentNonce] = useState(null)
    const [isMining, setIsMining] = useState(false)
    useEffect(() => {

    }, [])

    return (
        <div className={`flex flex-col border ${blockData.valid ? "border-green" : "border-red"} h-[27rem] rounded-3xl w-[25rem]`}>
            <div className={`flex items-center justify-center border-b ${blockData.valid ? "border-green" : "border-red"} p-3`}>
                <span>Block {blockIndex}</span>
            </div>
            <div className="flex flex-col items-center w-full justify-between h-full pb-4">
                <TransactionTable blockIndex={blockIndex} addTransaction={addTransaction} removeTransaction={removeTransaction} transactions={blockData.transactions} />
                <div className="flex flex-col self-center px-2">
                    <span>Nonce: {currentNonce ? currentNonce : blockData.nonce}</span>
                    <span className="w-[15rem] truncate">Prev Hash: {blockData.prevHash}</span>
                    <span className="w-[15rem] truncate">Hash: {blockData.hash}</span>
                </div>
                <button className="flex gap-2 items-center justify-center border w-28 h-9 rounded-lg" onClick={() => {
                    if (!isMining && !blockData.valid) {
                        setIsMining(true)
                        mineBlock(blockIndex, setIsMining, setCurrentNonce)
                    }


                }}>
                    {
                        isMining ?
                            <>
                                Mining
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