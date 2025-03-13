"use client"

import { useEffect } from "react"
import TransactionTable from "./transactionsTable"
import { LuPickaxe } from "react-icons/lu";
export default function Block({ blockIndex, blockData, mineBlock, addTransaction, removeTransaction }) {

    useEffect(() => {
        addTransaction(blockIndex, "test from", "test to", "100")
    }, [])

    return (
        <div className={`flex flex-col border ${blockData.valid ? "border-green" : "border-red"} h-full rounded-3xl w-[20rem]`}>
            <div className={`flex items-center justify-center border-b ${blockData.valid ? "border-green" : "border-red"} p-3`}>
                <span>Block {blockIndex}</span>
            </div>
            <div className="flex flex-col items-center w-full justify-between h-full pb-4">
                <TransactionTable transactions={blockData.transactions} />
                <div className="flex flex-col self-start px-2">
                    <span className="w-[15rem] truncate">Prev Hash: {blockData.prevHash}</span>
                    <span className="w-[15rem] truncate">Hash: {blockData.hash}</span>
                </div>
                <button className="flex gap-2 items-center justify-center border w-28 h-9 rounded-lg">
                    <span>Mine</span>
                    <LuPickaxe />
                </button>
            </div>
        </div>
    )
}