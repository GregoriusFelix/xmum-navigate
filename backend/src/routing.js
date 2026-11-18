const EARTH_RADIUS_M = 6371000
const WALK_SPEED_MS = 1

// Distance in metres between two [lat, lng] points.
export function haversine([lat1, lng1], [lat2, lng2]) {
  const rad = d => d * Math.PI / 180
  const a = Math.sin(rad(lat2 - lat1) / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lng2 - lng1) / 2) ** 2
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a))
}

// Ray casting over a ring of [lat, lng] points.
export function insidePolygon([lat, lng], ring) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [lat1, lng1] = ring[i]
    const [lat2, lng2] = ring[j]
    if ((lng1 > lng) !== (lng2 > lng) && lat < (lat2 - lat1) * (lng - lng1) / (lng2 - lng1) + lat1) inside = !inside
  }
  return inside
}

class MinHeap {
  items = []
  get size() { return this.items.length }
  push(priority, value) {
    const items = this.items
    let i = items.push([priority, value]) - 1
    while (i > 0) {
      const parent = (i - 1) >> 1
      if (items[parent][0] <= items[i][0]) break
      [items[parent], items[i]] = [items[i], items[parent]]
      i = parent
    }
  }
  pop() {
    const items = this.items
    const top = items[0]
    const last = items.pop()
    if (items.length) {
      items[0] = last
      for (let i = 0; ;) {
        const left = 2 * i + 1
        const right = left + 1
        let smallest = i
        if (left < items.length && items[left][0] < items[smallest][0]) smallest = left
        if (right < items.length && items[right][0] < items[smallest][0]) smallest = right
        if (smallest === i) break
        [items[smallest], items[i]] = [items[i], items[smallest]]
        i = smallest
      }
    }
    return top[1]
  }
}

// Best-first search over graph: Map(nodeId -> [{ to, cost, length, line }]).
// Returns the edges walked in order, or null when the goal cannot be reached.
function search(graph, start, goal, heuristic) {
  const best = new Map([[start, 0]])
  const cameFrom = new Map()
  const done = new Set()
  const open = new MinHeap()
  open.push(heuristic(start), start)
  while (open.size) {
    const node = open.pop()
    if (node === goal) {
      const edges = []
      for (let at = goal; at !== start; at = cameFrom.get(at).from) edges.unshift(cameFrom.get(at).edge)
      return { edges, cost: best.get(goal), visited: done.size + 1 }
    }
    if (done.has(node)) continue
    done.add(node)
    for (const edge of graph.get(node) || []) {
      const cost = best.get(node) + edge.cost
      if (cost < (best.get(edge.to) ?? Infinity)) {
        best.set(edge.to, cost)
        cameFrom.set(edge.to, { from: node, edge })
        open.push(cost + heuristic(edge.to), edge.to)
      }
    }
  }
  return null
}

export const dijkstra = (graph, start, goal) => search(graph, start, goal, () => 0)

// Straight-line distance never exceeds an edge cost, because cost is at least the real length.
export const astar = (graph, start, goal, coords) => search(graph, start, goal, id => haversine(coords.get(id), coords.get(goal)))

const ALGORITHMS = { astar, dijkstra }

export function nodeCoords(data) {
  return new Map(data.nodes.features.map(f => [f.properties.node_id, [f.geometry.coordinates[1], f.geometry.coordinates[0]]]))
}

export function nearestNode(coords, point) {
  let nearest
  let distance = Infinity
  for (const [id, at] of coords) {
    const d = haversine(point, at)
    if (d < distance) { distance = d; nearest = id }
  }
  return nearest
}

// Scenic cost = length + penalty for the unscenic share of a segment. It never drops below the real length.
function scenicCost(path, coords, data) {
  const { scenicPenalty, scenicRadiusM } = data.settings
  const ends = [coords.get(path.source_node), coords.get(path.target_node)]
  const middle = [(ends[0][0] + ends[1][0]) / 2, (ends[0][1] + ends[1][1]) / 2]
  let score = 0
  for (const spot of data.spots) {
    if ([...ends, middle].some(at => haversine(at, [spot.lat, spot.lng]) <= scenicRadiusM)) score = Math.max(score, spot.score)
  }
  return path.length_m * (1 + scenicPenalty * (1 - score / 5))
}

export function buildGraph(data, coords, scenic = false) {
  const graph = new Map()
  for (const feature of data.paths.features) {
    const path = feature.properties
    if (path.is_closed) continue
    const cost = scenic ? scenicCost(path, coords, data) : path.length_m
    const line = feature.geometry.coordinates.map(([lng, lat]) => [lat, lng])
    const add = (from, to, forward) => {
      if (!graph.has(from)) graph.set(from, [])
      graph.get(from).push({ to, cost, length: path.length_m, line: forward ? line : [...line].reverse() })
    }
    add(path.source_node, path.target_node, true)
    add(path.target_node, path.source_node, false)
  }
  return graph
}

// mode: shortest | scenic | combined (start -> scenic spot -> destination).
// Returns null when no open route exists.
export function findRoute(data, { start, goalNode, mode = 'shortest', spotId, algorithm = data.settings.algorithm }) {
  const coords = nodeCoords(data)
  const lengthGraph = buildGraph(data, coords)
  const startNode = nearestNode(coords, start)
  const run = (graph, from, to, name = algorithm) => from === to ? { edges: [], cost: 0, visited: 1 } : ALGORITHMS[name](graph, from, to, coords)

  const began = performance.now()
  let legs
  if (mode === 'combined') {
    const spot = data.spots.find(s => s.id === spotId)
    if (!spot) return null
    const via = nearestNode(coords, [spot.lat, spot.lng])
    legs = [run(lengthGraph, startNode, via), run(lengthGraph, via, goalNode)]
  } else {
    legs = [run(mode === 'scenic' ? buildGraph(data, coords, true) : lengthGraph, startNode, goalNode)]
  }
  const ms = performance.now() - began
  if (legs.includes(null)) return null

  const edges = legs.flatMap(leg => leg.edges)
  // The walk from the user's position onto the nearest path junction counts too, so the line starts at the user.
  const lead = Math.round(haversine(start, coords.get(startNode)))
  const distance = lead + edges.reduce((sum, edge) => sum + edge.length, 0)
  const shortest = mode === 'shortest' ? distance : lead + run(lengthGraph, startNode, goalNode).edges.reduce((sum, edge) => sum + edge.length, 0)
  const points = [start, coords.get(startNode), ...edges.flatMap(edge => edge.line.slice(1))]
  return {
    points,
    distance,
    minutes: Math.max(1, Math.round(distance / WALK_SPEED_MS / 60)),
    extra: distance - shortest,
    algorithm,
    ms,
    visited: legs.reduce((sum, leg) => sum + leg.visited, 0),
  }
}
