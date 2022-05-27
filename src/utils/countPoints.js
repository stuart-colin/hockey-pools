function countPoints(roster) {
  return (
    (roster.utility.position == 'G'
      ? (roster.utility.stats.stats.wins * 2) + (roster.utility.stats.stats.shutouts * 2) + roster.utility.stats.stats.ot
      : roster.utility.stats.stats.goals + roster.utility.stats.stats.assists + roster.utility.stats.stats.overTimeGoals)
    + roster.left[0].stats.stats.goals + roster.left[0].stats.stats.assists + roster.left[0].stats.stats.overTimeGoals
    + roster.left[1].stats.stats.goals + roster.left[1].stats.stats.assists + roster.left[1].stats.stats.overTimeGoals
    + roster.left[2].stats.stats.goals + roster.left[2].stats.stats.assists + roster.left[2].stats.stats.overTimeGoals
    + roster.center[0].stats.stats.goals + roster.center[0].stats.stats.assists + roster.center[0].stats.stats.overTimeGoals
    + roster.center[1].stats.stats.goals + roster.center[1].stats.stats.assists + roster.center[1].stats.stats.overTimeGoals
    + roster.center[2].stats.stats.goals + roster.center[2].stats.stats.assists + roster.center[2].stats.stats.overTimeGoals
    + roster.right[0].stats.stats.goals + roster.right[0].stats.stats.assists + roster.right[0].stats.stats.overTimeGoals
    + roster.right[1].stats.stats.goals + roster.right[1].stats.stats.assists + roster.right[1].stats.stats.overTimeGoals
    + roster.right[2].stats.stats.goals + roster.right[2].stats.stats.assists + roster.right[2].stats.stats.overTimeGoals
    + roster.defense[0].stats.stats.goals + roster.defense[0].stats.stats.assists + roster.defense[0].stats.stats.overTimeGoals
    + roster.defense[1].stats.stats.goals + roster.defense[1].stats.stats.assists + roster.defense[1].stats.stats.overTimeGoals
    + roster.defense[2].stats.stats.goals + roster.defense[2].stats.stats.assists + roster.defense[2].stats.stats.overTimeGoals
    + roster.defense[3].stats.stats.goals + roster.defense[3].stats.stats.assists + roster.defense[3].stats.stats.overTimeGoals
    + (roster.goalie[0].stats.stats.wins * 2) + (roster.goalie[0].stats.stats.shutouts * 2) + roster.goalie[0].stats.stats.ot
    + (roster.goalie[1].stats.stats.wins * 2) + (roster.goalie[1].stats.stats.shutouts * 2) + roster.goalie[1].stats.stats.ot
  )
}

export default countPoints;