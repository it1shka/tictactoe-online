package utils

import (
	"sync"
)

type Queue[T comparable] struct {
	sync.Mutex
	awaiting map[T]bool
}

func NewQueue[T comparable]() *Queue[T] {
	return &Queue[T]{
		awaiting: make(map[T]bool),
	}
}

func (queue *Queue[T]) Append(member T) {
	queue.Lock()
	defer queue.Unlock()
	queue.awaiting[member] = true
}

func (queue *Queue[T]) Delete(member T) {
	queue.Lock()
	defer queue.Unlock()
	delete(queue.awaiting, member)
}

func (queue *Queue[T]) MakePairs(
	chunkSize int,
	fn func(a, b T),
) {
	queue.Lock()
	defer queue.Unlock()

	allWaiting := KeysOf(queue.awaiting)
	chunks := ChunksOf(allWaiting, chunkSize)
	withoutMatch := make(chan T)

	var wg sync.WaitGroup
	wg.Add(len(chunks))

	for _, chunk := range chunks {

		go func(members []T) {
			defer wg.Done()
			for _, pair := range ChunksOf(members, 2) {
				if len(pair) < 2 {
					withoutMatch <- pair[0]
				} else {
					a, b := pair[0], pair[1]
					fn(a, b)
				}
			}
		}(chunk)

	}

	go func() {
		defer close(withoutMatch)
		wg.Wait()
	}()

	next := make(map[T]bool)
	for conn := range withoutMatch {
		next[conn] = true
	}
	queue.awaiting = next
}
