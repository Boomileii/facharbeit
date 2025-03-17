package main

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"runtime"
	"strconv"
	"strings"
	"sync"
	"time"
)

type Transaction struct {
	From   string
	To     string
	Amount string
}

type BlockHeader struct {
	Number       string
	PrevHash     string
	Transactions []Transaction
}

type HashResult struct {
	Hash  string
	Nonce int
}

var hashCounter uint64
var hashMutex sync.Mutex

func main() {
	fmt.Println("Starting...", runtime.NumCPU())
	startTime := time.Now()

	go monitorHashRate()
	calculateHash(&BlockHeader{
		Number:   "1",
		PrevHash: "000000000000000000",
		Transactions: []Transaction{
			{
				From:   "Boomilei",
				To:     "Alice",
				Amount: "100"},
		},
	}, 8)

	fmt.Println("Time taken: ", time.Since(startTime))
}

func monitorHashRate() {

	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	for {
		<-ticker.C
		hashMutex.Lock()
		fmt.Printf("Current Hashrate: %d Hashes/sec\n", hashCounter)
		hashCounter = 0
		hashMutex.Unlock()
	}
}

func calculateHash(blockHeader *BlockHeader, difficulty int) {

	workers := runtime.NumCPU()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	resultChan := make(chan HashResult, workers)
	wg := sync.WaitGroup{}

	var txData string
	for _, tx := range blockHeader.Transactions {
		txData += tx.From + tx.To + tx.Amount
	}

	blockData := blockHeader.Number + blockHeader.PrevHash + txData

	for i := 0; i < workers; i++ {
		wg.Add(1)
		go calcNonce(i+1, blockData, difficulty, resultChan, &wg, ctx)
	}

	result := <-resultChan
	fmt.Println("Hash found: ", result.Hash)
	fmt.Println("Nonce: ", result.Nonce)
	cancel()
	wg.Wait()

}

func calcNonce(startNonce int, blockData string, difficulty int, resultChan chan HashResult, wg *sync.WaitGroup, ctx context.Context) {
	defer wg.Done()
	nonce := startNonce
	workers := runtime.NumCPU()
	for {
		select {
		case <-ctx.Done():

			return
		default:
			hash := sha256.Sum256([]byte(blockData + strconv.Itoa(nonce)))
			hashHex := hex.EncodeToString(hash[:])

			hashMutex.Lock()
			hashCounter++
			hashMutex.Unlock()

			if hashHex[:difficulty] == strings.Repeat("0", difficulty) {
				resultChan <- HashResult{
					Hash:  hashHex,
					Nonce: nonce,
				}
				return
			}
			nonce += workers
		}
	}
}
