"use client";

import { useRef } from "react";
import { ImCross } from "react-icons/im";
import { VscDiffAdded } from "react-icons/vsc";

export default function TransactionTable({ transactions, addTransaction, removeTransaction, blockIndex }) {
    const fromInputRef = useRef(null);
    const toInputRef = useRef(null);
    const amountInputRef = useRef(null);

    return (
        <div className="w-full p-5 flex flex-col items-center justify-center gap-2">
            <span className="font-medium">Transactions</span>
            <div className="w-full overflow-x-auto">
                <table className="table-auto border-collapse min-w-full border border-light">
                    <thead className="border-b">
                        <tr className="font-light">
                            <th className="px-2 py-1 text-left font-normal">From</th>
                            <th className="px-2 py-1 text-left font-normal">To</th>
                            <th className="px-2 py-1 text-left font-normal">Amount</th>
                            {blockIndex !== 0 && <th className="px-2 py-1 text-left font-normal">Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction, index) => (
                            <tr key={index} className="border-y text-sm">
                                <td className="px-2 py-1">{transaction.from}</td>
                                <td className="px-2 py-1">{transaction.to}</td>
                                <td className="px-2 py-1">{transaction.amount}</td>
                                {blockIndex !== 0 && (
                                    <td className="px-2 py-1 text-red">
                                        <ImCross onClick={() => removeTransaction(blockIndex, index)} />
                                    </td>
                                )}
                            </tr>
                        ))}

                        {blockIndex !== 0 && transactions.length < 3 && (
                            <tr className="text-sm">
                                <td className="px-2 py-2">
                                    <input
                                        ref={fromInputRef}
                                        placeholder="From"
                                        className="w-[3.5rem] border border-light outline-none pl-2 p-1 placeholder:text-orange-light"
                                    />
                                </td>
                                <td className="px-2 py-2">
                                    <input
                                        ref={toInputRef}
                                        placeholder="To"
                                        className="w-[3.5rem] border border-light outline-none pl-2 p-1 placeholder:text-orange-light"
                                    />
                                </td>
                                <td className="px-2 py-2">
                                    <input
                                        ref={amountInputRef}
                                        placeholder="Amount"
                                        type="number"
                                        min={1}
                                        className="w-[5rem] placeholder:text-orange-light border border-light outline-none pl-2 p-1"
                                    />
                                </td>
                                <td className="px-2 py-2">
                                    <VscDiffAdded
                                        size={25}
                                        onClick={() => {

                                            const fromData = fromInputRef.current.value;
                                            const toData = toInputRef.current.value;
                                            const amountData = amountInputRef.current.value;

                                            if (fromData && toData && amountData && transactions.length < 3 && blockIndex !== 0) {
                                                addTransaction(blockIndex, fromData, toData, amountData);
                                                fromInputRef.current.value = "";
                                                toInputRef.current.value = "";
                                                amountInputRef.current.value = "";
                                            }
                                        }}
                                    />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
