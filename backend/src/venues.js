// Each criterion scores 0 to 1; the result is their weighted sum as a percentage.
export function scoreVenue(venue, need, weights) {
  const criteria = {
    capacity: venue.capacity >= need.participants ? need.participants / venue.capacity : 0,
    eventType: venue.eventTypes.includes(need.eventType) ? 1 : 0,
    facilities: need.facilities.length ? need.facilities.filter(f => venue.facilities.includes(f)).length / need.facilities.length : 1,
    setting: need.setting === 'any' || need.setting === venue.setting ? 1 : 0,
  }
  const total = Object.values(weights).reduce((sum, w) => sum + w, 0)
  return Object.keys(criteria).reduce((sum, key) => sum + criteria[key] * weights[key], 0) / total * 100
}

export function recommendVenues(venues, need, weights, count = 3) {
  return venues
    .map(venue => ({ venue, score: Math.round(scoreVenue(venue, need, weights)) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
}
