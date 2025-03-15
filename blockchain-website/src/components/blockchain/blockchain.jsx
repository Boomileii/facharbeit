"use client"

import { useEffect, useState } from "react"
import Block from "./block"




export default function Blockchain() {
    const difficulty = 4
    const [loading, setLoading] = useState(true)
    const [blocks, setBlocks] = useState([
        {
            prevHash: "00000000000000000000000000000000",
            transactions: [],
            hash: calculateBlockHash(0, "00000000000000000000000000000000000", [], 0),
            valid: true,
            nonce: 0,
        }
    ])

    function createBlock() {

        let block = {
            prevHash: blocks[blocks.length - 1].hash,
            hash: "0000",
            transactions: [],
            valid: false,
            nonce: 0,
        }

        block.hash = calculateBlockHash(blocks.length + 1, block.prevHash, block.transactions, block.nonce)
        setBlocks([...blocks, block])
    }

    async function mineBlock(blockIndex, setIsMining, setCurrentNonce) {
        console.log("Mining block", blockIndex);

        let nonce = 0
        while (true) {
            const block = blocks[blockIndex]
            const prevBlock = blocks[blockIndex - 1]
            if (block.valid) return
            const hash = await calculateBlockHash(blockIndex, block.prevHash, block.transactions, nonce)
            if (hash.startsWith("0".repeat(difficulty))) {
                if (prevBlock.valid) {
                    updateBlock(blockIndex, hash, true, nonce)
                } else {
                    updateBlock(blockIndex, hash, false, nonce)
                }
                setIsMining(false)
                // setCurrentNonce(null)
                return
            }
            // setCurrentNonce(nonce)
            nonce++
        }
    }

    async function validateBlocks() {
        console.log(blocks);

        blocks.forEach(async (block, i) => {
            if (i === 0) return
            console.log(block.nonce);

            console.log("Validating block", i);
            const hash = await calculateBlockHash(i, block.prevHash, block.transactions, block.nonce)
            if (block.hash !== hash) {
                updateBlock(i, hash, false, block.valid)
            }
            if ((!hash.startsWith("0".repeat(difficulty)) || block.prevHash !== blocks[i - 1].hash) && block.valid) {
                console.log("invalid block", i);

                updateBlock(i, false, false, false)
            }
        })
    }

    function updateBlock(blockIndex, hash, valid = null, nonce = false) {
        console.log("Updating block", blockIndex, hash, valid, nonce);

        let updatedBlocks = blocks.map((block, index) => {
            if (index === blockIndex) {
                let updatedBlock = hash ? { ...block, hash } : { ...block }
                if (nonce) updatedBlock.nonce = nonce;
                if (valid !== null) updatedBlock.valid = valid;
                return updatedBlock;
            }
            if (valid === false && index >= blockIndex) {
                return { ...block, valid: false };
            }
            return block;
        });

        if (blockIndex < blocks.length - 1) {
            updatedBlocks[blockIndex + 1] = {
                ...updatedBlocks[blockIndex + 1],
                prevHash: hash
            };
        }

        console.log(updatedBlocks);
        setBlocks(updatedBlocks);
    }

    function addTransaction(blockIndex, from, to, amount) {
        if (blockIndex === 0) return
        let updatedBlocks = blocks.map((block, index) => {

            if (blockIndex === index) {
                return { ...block, transactions: [...block.transactions, { from, to, amount }] }
            }

            return block

        })
        setBlocks(updatedBlocks)
    }

    function removeTransaction(blockIndex, transactionIndex) {
        if (blockIndex === 0) return
        let updatedBlocks = blocks.map((block, index) => {

            if (blockIndex === index) {
                return { ...block, transactions: [...block.transactions.filter((transaction, index) => index !== transactionIndex)] }
            }

            return block

        })
        setBlocks(updatedBlocks)

    }


    function remvoveBlock(blockIndex) {
        setBlocks(blocks.filter((block, index) => index !== blockIndex))
    }


    async function calculateBlockHash(index, prevHash, transactions, nonce) {
        const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify({ index, prevHash, transactions, nonce })));
        const hashArray = new Uint8Array(hashBuffer);
        const hexHash = Array.from(hashArray).map(byte => byte.toString(16).padStart(2, "0")).join("");

        return hexHash;
    }

    useEffect(() => {

        validateBlocks()
    }, [blocks])

    useEffect(() => {
        createBlock()
        setLoading(false)
    }, [])

    if (loading) return <div>Loading...</div>

    return (
        <div className="">
            <div className="flex gap-5 items-center justify-center flex-wrap">
                {
                    blocks.map((block, index) => <Block
                        key={index}
                        blockData={block}
                        blockIndex={index}
                        mineBlock={mineBlock}
                        addTransaction={addTransaction}
                        removeTransaction={removeTransaction} />)
                }
            </div>
            <div className="flex gap-5">
                <button onClick={() => createBlock()}>Add block</button>
                <button onClick={() => addTransaction(1, "fafaf", "fagehs", "129")}>TestButton</button>
            </div>
        </div>
    )
}
