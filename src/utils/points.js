export const calculateSkaterPoints = (goals = 0, assists = 0, otGoals = 0) =>
  goals + assists + otGoals;

export const calculateGoaliePoints = (wins = 0, shutouts = 0, otl = 0) =>
  (wins * 2) + (shutouts * 2) + otl;
