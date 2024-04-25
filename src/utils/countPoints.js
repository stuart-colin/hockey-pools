function countPoints(roster) {
  return (
    (roster.utility.position === 'G'
      ? (roster.utility.stats.featuredStats.playoffs.subSeason.wins * 2) + (roster.utility.stats.featuredStats.playoffs.subSeason.shutouts * 2) + roster.utility.stats.featuredStats.playoffs.subSeason.otLosses
      : roster.utility.stats.featuredStats.playoffs.subSeason.goals + roster.utility.stats.featuredStats.playoffs.subSeason.assists + roster.utility.stats.featuredStats.playoffs.subSeason.otGoals)
    + roster.left[0].stats.featuredStats.playoffs.subSeason.goals + roster.left[0].stats.featuredStats.playoffs.subSeason.assists + roster.left[0].stats.featuredStats.playoffs.subSeason.otGoals
    + roster.left[1].stats.featuredStats.playoffs.subSeason.goals + roster.left[1].stats.featuredStats.playoffs.subSeason.assists + roster.left[1].stats.featuredStats.playoffs.subSeason.otGoals
    + roster.left[2].stats.featuredStats.playoffs.subSeason.goals + roster.left[2].stats.featuredStats.playoffs.subSeason.assists + roster.left[2].stats.featuredStats.playoffs.subSeason.otGoals
    + roster.center[0].stats.featuredStats.playoffs.subSeason.goals + roster.center[0].stats.featuredStats.playoffs.subSeason.assists + roster.center[0].stats.featuredStats.playoffs.subSeason.otGoals
    + roster.center[1].stats.featuredStats.playoffs.subSeason.goals + roster.center[1].stats.featuredStats.playoffs.subSeason.assists + roster.center[1].stats.featuredStats.playoffs.subSeason.otGoals
    + roster.center[2].stats.featuredStats.playoffs.subSeason.goals + roster.center[2].stats.featuredStats.playoffs.subSeason.assists + roster.center[2].stats.featuredStats.playoffs.subSeason.otGoals
    + roster.right[0].stats.featuredStats.playoffs.subSeason.goals + roster.right[0].stats.featuredStats.playoffs.subSeason.assists + roster.right[0].stats.featuredStats.playoffs.subSeason.otGoals
    + roster.right[1].stats.featuredStats.playoffs.subSeason.goals + roster.right[1].stats.featuredStats.playoffs.subSeason.assists + roster.right[1].stats.featuredStats.playoffs.subSeason.otGoals
    + roster.right[2].stats.featuredStats.playoffs.subSeason.goals + roster.right[2].stats.featuredStats.playoffs.subSeason.assists + roster.right[2].stats.featuredStats.playoffs.subSeason.otGoals
    + roster.defense[0].stats.featuredStats.playoffs.subSeason.goals + roster.defense[0].stats.featuredStats.playoffs.subSeason.assists + roster.defense[0].stats.featuredStats.playoffs.subSeason.otGoals
    + roster.defense[1].stats.featuredStats.playoffs.subSeason.goals + roster.defense[1].stats.featuredStats.playoffs.subSeason.assists + roster.defense[1].stats.featuredStats.playoffs.subSeason.otGoals
    + roster.defense[2].stats.featuredStats.playoffs.subSeason.goals + roster.defense[2].stats.featuredStats.playoffs.subSeason.assists + roster.defense[2].stats.featuredStats.playoffs.subSeason.otGoals
    + roster.defense[3].stats.featuredStats.playoffs.subSeason.goals + roster.defense[3].stats.featuredStats.playoffs.subSeason.assists + roster.defense[3].stats.featuredStats.playoffs.subSeason.otGoals
    + (roster.goalie[0].stats.featuredStats.playoffs.subSeason.wins * 2) + (roster.goalie[0].stats.featuredStats.playoffs.subSeason.shutouts * 2) + roster.goalie[0].stats.featuredStats.playoffs.subSeason.otLosses
    + (roster.goalie[1].stats.featuredStats.playoffs.subSeason.wins * 2) + (roster.goalie[1].stats.featuredStats.playoffs.subSeason.shutouts * 2) + roster.goalie[1].stats.featuredStats.playoffs.subSeason.otLosses
  )
}

export default countPoints;