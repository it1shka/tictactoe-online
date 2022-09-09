package server

import (
	"sync"
	"time"
)

type Queue struct {
	sync.Mutex
	awaiting map[*User]bool
}

func NewQueue() *Queue {
	return &Queue{
		awaiting: make(map[*User]bool),
	}
}

func (queue *Queue) Append(user *User) {
	queue.Lock()
	defer queue.Unlock()
	queue.awaiting[user] = true
}

func (queue *Queue) Delete(user *User) {
	queue.Lock()
	defer queue.Unlock()
	delete(queue.awaiting, user)
}

func (queue *Queue) DoMatchmaking(
	chunkSize int,
	fn func(a, b *User),
) {
	queue.Lock()
	defer queue.Unlock()

	allWaiting := keysOf(queue.awaiting)
	chunks := chunksOf(allWaiting, chunkSize)
	withoutMatch := make(chan *User)

	var wg sync.WaitGroup
	wg.Add(len(chunks))

	for _, chunk := range chunks {

		go func(users []*User) {
			defer wg.Done()
			for _, pair := range chunksOf(users, 2) {
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

	next := make(map[*User]bool)
	for conn := range withoutMatch {
		next[conn] = true
	}
	queue.awaiting = next
}

// matchmaking process

var queue = NewQueue()

func StartMatchmaking() {
	setInfiniteLoop(time.Second, func() {
		queue.DoMatchmaking(100, func(a, b *User) {
			game := NewGame(a.conn, b.conn)
			a.opponent = b.conn
			b.opponent = a.conn
			a.game, b.game = game, game
		})
	})
}
