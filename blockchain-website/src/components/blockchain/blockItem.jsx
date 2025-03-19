"use client"

import { useState } from "react"
import { IoCopy } from "react-icons/io5";
import { IoCheckmarkSharp } from "react-icons/io5";
export default function BlockItemCopy({ title, value }) {
    const [isCopied, setIsCopied] = useState(false)

    return (
        <div
            onClick={() => {
                setIsCopied(true)
                navigator.clipboard.writeText(value)
                setTimeout(() => {
                    setIsCopied(false)
                }, 1000);
            }}
            className="flex items-center justify-start gap-2">
            {isCopied ? <IoCheckmarkSharp /> : <IoCopy />} <span className="truncate w-[10rem]">{title}: {value}</span>
        </div>
    )
}
