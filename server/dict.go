package server

import "sync"

type Dict[K comparable, V any] struct {
	sync.RWMutex
	m map[K]V
}

func NewDict[K comparable, V any]() *Dict[K, V] {
	return &Dict[K, V]{
		m: make(map[K]V),
	}
}

func (dict *Dict[K, V]) Get(key K) V {
	dict.RLock()
	defer dict.RUnlock()
	return dict.m[key]
}

func (dict *Dict[K, V]) Set(key K, val V) {
	dict.Lock()
	dict.m[key] = val
	dict.Unlock()
}

func (dict *Dict[K, V]) Delete(key K) {
	dict.Lock()
	delete(dict.m, key)
	dict.Unlock()
}
