export async function onRequest() {
  const res = await fetch('https://bibleverses.mentu.faith/sentences/pentateuch.json')
  const data = await res.json()

  const random = data[Math.floor(Math.random() * data.length)]

  return new Response(JSON.stringify(random), {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
