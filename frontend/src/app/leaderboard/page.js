import getLeadeboard from "@/firebase/functions/getLeaderBoard"
import { Leaderboard } from "flywheel-leaderboard"

export default async function leaderboard() {
  const { result, error } = await getLeadeboard()
  return(
    <>
      <Leaderboard
        className='max-w-4xl'
        theme='orange'
        scrollMetric='wins'
        id='timediff'
        cell1='username'
        cell2='wins'
        cell3='loses'
        cell4='winrate'
        items={result}>
      </Leaderboard>
    </>
  )
}
