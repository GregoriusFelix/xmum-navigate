import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { astar, buildGraph, dijkstra, findRoute, insidePolygon, nodeCoords } from '../src/routing.js'
import { recommendVenues } from '../src/venues.js'

const load = () => JSON.parse(readFileSync(new URL('../data/campus.sample.json', import.meta.url), 'utf8'))
const START = [2.8308, 101.7032]

test('A* and Dijkstra agree on cost for every pair of nodes, on both graphs', () => {
  const data = load()
  const coords = nodeCoords(data)
  for (const graph of [buildGraph(data, coords), buildGraph(data, coords, true)]) {
    for (const from of coords.keys()) for (const to of coords.keys()) {
      if (from === to) continue
      const a = astar(graph, from, to, coords)
      const d = dijkstra(graph, from, to)
      assert.ok(a && d, `${from} -> ${to} is reachable`)
      assert.ok(Math.abs(a.cost - d.cost) < 1e-6, `${from} -> ${to}: ${a.cost} vs ${d.cost}`)
    }
  }
})

test('scenic and combined routes are never shorter than the shortest route', () => {
  const data = load()
  for (const place of data.places) {
    const shortest = findRoute(data, { start: START, goalNode: place.node })
    const scenic = findRoute(data, { start: START, goalNode: place.node, mode: 'scenic' })
    const combined = findRoute(data, { start: START, goalNode: place.node, mode: 'combined', spotId: 'k1' })
    assert.equal(shortest.extra, 0)
    assert.ok(scenic.extra >= 0 && combined.extra >= 0)
    assert.equal(scenic.minutes, Math.max(1, Math.round(scenic.distance / 60)))
  }
})

test('a closed path is avoided, and a cut-off destination gives no route', () => {
  const data = load()
  const goal = data.places.find(p => p.id === 'a').node
  const touching = data.paths.features.filter(f => [f.properties.source_node, f.properties.target_node].includes(goal))
  const before = findRoute(data, { start: START, goalNode: goal })
  touching[0].properties.is_closed = true
  const after = findRoute(data, { start: START, goalNode: goal })
  assert.ok(after.distance >= before.distance)
  touching.forEach(f => { f.properties.is_closed = true })
  for (const mode of ['shortest', 'scenic', 'combined']) assert.equal(findRoute(data, { start: START, goalNode: goal, mode, spotId: 'k1' }), null)
})

test('the campus boundary separates on-campus from off-campus points', () => {
  const { boundary } = load()
  assert.equal(insidePolygon(START, boundary), true)
  assert.equal(insidePolygon([3.139, 101.6869], boundary), false)
})

test('venue ranking returns three venues and drops ones that are too small to the bottom', () => {
  const { venues, settings } = load()
  const results = recommendVenues(venues, { participants: 100, eventType: 'Presentation', facilities: ['Projector'], setting: 'indoor' }, settings.weights.literature)
  assert.equal(results.length, 3)
  assert.equal(results[0].venue.name, 'Sample Main Hall')
  assert.ok(results[0].score > results[1].score)
})
