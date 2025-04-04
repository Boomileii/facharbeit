"use client"

import { useEffect, useState } from "react"
import Block from "./block"
import { FaPlus, FaMinus } from "react-icons/fa6";

export default function Blockchain() {
    
    const [difficulty, setDifficulty] = useState(2)
    const [loading, setLoading] = useState(true)
    const [blocks, setBlocks] = useState([])
    const [isBlockMinung, setIsBlockMining] = useState(false)

    async function generateGenesisBlock() {

        console.log("generating genesis");

        const block = {
            prevHash: "00000000000000000000000000000000",
            transactions: [],
            hash: await calculateBlockHash(0, "00000000000000000000000000000000000", [], 0),
            valid: true,
            nonce: 5,
        }
        setBlocks([block])

    }
    async function createBlock() {

        let block = {
            prevHash: blocks[blocks.length - 1].hash,
            hash: "",
            transactions: [],
            valid: false,
            nonce: 0,
        }
        console.log("created block", blocks.length, block.prevHash, block.transactions, block.nonce);

        block.hash = await calculateBlockHash(blocks.length, block.prevHash, block.transactions, block.nonce)
        setBlocks([...blocks, block])
    }

    async function mineBlock(blockIndex, setIsMining, miningAbortRef) {
        if (isBlockMinung) {
            setIsMining(false)
            return
        }


        setIsBlockMining(true)

        console.log("Mining block", blockIndex);

        let nonce = 0
        while (!miningAbortRef.current) {



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
                setIsBlockMining(false)
                return
            }

            nonce++
        }

        console.log("aborting mining");

        setIsBlockMining(false)
        setIsMining(false)
    }


    async function validateBlocks() {

        console.log(blocks);
        console.log("validating");

        for (let i = 1; i < blocks.length; i++) {
            console.log("validate", "Validating block", i);

            const block = blocks[i];
            const previousBlock = blocks[i - 1];

            const hash = await calculateBlockHash(i, block.prevHash, block.transactions, block.nonce);
            const isValidProofOfWork = hash.startsWith("0".repeat(difficulty));
            const isPreviousHashValid = block.prevHash === previousBlock.hash;
            const isSameHash = block.hash === hash

            console.log("isValidProofOfWork", i, isValidProofOfWork);
            console.log("isPreviousHashValid", i, isPreviousHashValid);
            console.log("isSameHash", i, isSameHash);

            // all good
            if (isValidProofOfWork && isPreviousHashValid && isSameHash && previousBlock.valid && block.valid === false) {
                updateBlock(i, false, true, false, false)
                return
            } else {


                if ((!isPreviousHashValid || !isSameHash)) {
                    console.log("prevh val", previousBlock.hash);
                    updateBlock(i, hash, null, false, previousBlock.hash)
                    return


                }

                if ((!isValidProofOfWork) && block.valid === true) {
                    updateBlock(i, false, false, false, false)
                    return
                }

            }
        }

    }


    function updateBlock(blockIndex, hash, valid = null, nonce = false, prevHash = false) {
        console.log("Updating block", blockIndex, hash, valid, nonce);

        let updatedBlocks = blocks.map((block, index) => {
            if (index === blockIndex) {
                let updatedBlock = hash ? { ...block, hash } : { ...block }
                if (nonce) updatedBlock.nonce = nonce;
                if (valid !== null) updatedBlock.valid = valid;
                if (prevHash) updatedBlock.prevHash = prevHash
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

        if (blockIndex === 0) return
        setBlocks(blocks.filter((block, index) => index !== blockIndex));
    }


    async function calculateBlockHash(index, prevHash, transactions, nonce) {
        const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify({ index, prevHash, transactions, nonce })));
        const hashArray = new Uint8Array(hashBuffer);
        const hexHash = Array.from(hashArray).map(byte => byte.toString(16).padStart(2, "0")).join("");

        return hexHash;
    }

    function saveBlockchain() {
        localStorage.setItem("blockchain", JSON.stringify(blocks))
        localStorage.setItem("difficulty", difficulty)
    }
    function loadBlockchain() {
        const blockchainString = localStorage.getItem("blockchain")
        const blockchainData = JSON.parse(blockchainString)
        const difficulty = localStorage.getItem("difficulty")


        if (difficulty) {
            setDifficulty(parseInt(difficulty))
        }

        if (!blockchainData) {
            throw new Error("No available LocalStorage data")
        }
        setBlocks(blockchainData)
    }

    useEffect(() => {

        validateBlocks()
        if (blocks.length !== 0) {
            saveBlockchain()
        }
    }, [blocks])

    useEffect(() => {
        console.log("yes");

        try {
            loadBlockchain()
        } catch (error) {
            console.log(error);
            generateGenesisBlock()
        }

        setLoading(false)
    }, [])

    useEffect(() => {
        validateBlocks()
        if (blocks.length !== 0) {
            saveBlockchain()
        }
    }, [difficulty])

    if (loading) return <div>Loading...</div>

    return (
        <div className="flex flex-col items-center justify-center gap-8">
            <div className="flex gap-5 items-center justify-center flex-wrap">
                <div className="flex items-center gap-5 border rounded-lg w-[12rem] h-[2.5rem] justify-center">
                   
                    <div className="text-sm">Difficulty {difficulty}</div>
               
                    <div className="flex gap-3 h-full justify-center items-center">
                        <FaMinus onClick={() => {

                            if (difficulty <= 2) return
                            setDifficulty((prev) => prev - 1)
                        }} />
                        <FaPlus onClick={() => {
                            if (difficulty >= 5) return
                            setDifficulty((prev) => prev + 1)
                        }} />
                    </div>
                </div>

                <div className="border px-8 py-2 rounded-lg" onClick={() => {

                    setBlocks([])
                    generateGenesisBlock()
                }}>Reset</div>
            </div>

            <div className="flex gap-5 items-center justify-center flex-wrap max-w-[70rem]">
                {
                    blocks.map((block, index) => <Block
                        key={index}
                        blockData={block}
                        blockIndex={index}
                        mineBlock={mineBlock}
                        addTransaction={addTransaction}
                        removeTransaction={removeTransaction}
                        removeBlock={remvoveBlock}
                        lastBlockIndex={blocks.length - 1}
                        createBlock={createBlock}
                         />
                    )

                }
                
            </div>
        </div>
    )
}
