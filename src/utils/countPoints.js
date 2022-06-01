function countPoints(roster) {
  return (
    (roster.utility.position === 'G'
      ? (roster.utility.stats.wins * 2) + (roster.utility.stats.shutouts * 2) + roster.utility.stats.otl
      : roster.utility.stats.goals + roster.utility.stats.assists + roster.utility.stats.overTimeGoals)
    + roster.left[0].stats.goals + roster.left[0].stats.assists + roster.left[0].stats.overTimeGoals
    + roster.left[1].stats.goals + roster.left[1].stats.assists + roster.left[1].stats.overTimeGoals
    + roster.left[2].stats.goals + roster.left[2].stats.assists + roster.left[2].stats.overTimeGoals
    + roster.center[0].stats.goals + roster.center[0].stats.assists + roster.center[0].stats.overTimeGoals
    + roster.center[1].stats.goals + roster.center[1].stats.assists + roster.center[1].stats.overTimeGoals
    + roster.center[2].stats.goals + roster.center[2].stats.assists + roster.center[2].stats.overTimeGoals
    + roster.right[0].stats.goals + roster.right[0].stats.assists + roster.right[0].stats.overTimeGoals
    + roster.right[1].stats.goals + roster.right[1].stats.assists + roster.right[1].stats.overTimeGoals
    + roster.right[2].stats.goals + roster.right[2].stats.assists + roster.right[2].stats.overTimeGoals
    + roster.defense[0].stats.goals + roster.defense[0].stats.assists + roster.defense[0].stats.overTimeGoals
    + roster.defense[1].stats.goals + roster.defense[1].stats.assists + roster.defense[1].stats.overTimeGoals
    + roster.defense[2].stats.goals + roster.defense[2].stats.assists + roster.defense[2].stats.overTimeGoals
    + roster.defense[3].stats.goals + roster.defense[3].stats.assists + roster.defense[3].stats.overTimeGoals
    + (roster.goalie[0].stats.wins * 2) + (roster.goalie[0].stats.shutouts * 2) + roster.goalie[0].stats.otl
    + (roster.goalie[1].stats.wins * 2) + (roster.goalie[1].stats.shutouts * 2) + roster.goalie[1].stats.otl
  )
}

export default countPoints;