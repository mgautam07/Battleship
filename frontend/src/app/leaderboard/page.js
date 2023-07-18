import getLeadeboard from "@/firebase/functions/getLeaderBoard"

export default async function leaderboard() {
  const { result, error } = await getLeadeboard()
  return(
    <>
      <ul>
        {result ? result.map((res) => (
          <li>
            <div>{res.username}</div>
            <div>{res.wins}</div>
            <div>{res.loses}</div>
            <div>{res.lastonline.seconds}</div>
          </li>
        )) : <div>error</div>}
      </ul>
    </>
  )
}
