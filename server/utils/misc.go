package utils

import (
	"math/rand"
	"time"
)

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func boolToInt(value bool) int {
	if value {
		return 1
	}
	return 0
}

func ChunksOf[T any](array []T, chunkSize int) [][]T {
	rlen := len(array)
	chunksLength := rlen/chunkSize + boolToInt(rlen%chunkSize > 0)
	chunks := make([][]T, chunksLength)
	index := 0
	for start := 0; start < rlen; start += chunkSize {
		end := min(start+chunkSize, rlen)
		chunk := array[start:end]
		chunks[index] = chunk
		index++
	}
	return chunks
}

func KeysOf[K comparable, V any](dict map[K]V) []K {
	keys := make([]K, len(dict))
	index := 0
	for key := range dict {
		keys[index] = key
		index++
	}
	return keys
}

func SetInfiniteLoop(duration time.Duration, function func()) {
	ticker := time.NewTicker(duration)
	go func() {
		for range ticker.C {
			function()
		}
	}()
}

var src = rand.NewSource(time.Now().UnixNano())
var rnd = rand.New(src)

func RandomArrange[T any](a, b T) (T, T) {
	if rnd.Intn(2) != 0 {
		return a, b
	}
	return b, a
}
