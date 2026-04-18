export async function onRequest({ request }) {
  const url = new URL(request.url);

  // 获取参数（默认 genesis）
  const book = url.searchParams.get("book") || "genesis";

  try {
    // 从你自己仓库读取
    const apiUrl = `${url.origin}/sentences/${book}.json`;

    const res = await fetch(apiUrl);
    const data = await res.json();

    // 随机一句
    const random = data[Math.floor(Math.random() * data.length)];

    return new Response(JSON.stringify({
      book: book,
      data: random
    }), {
      headers: {
        "content-type": "application/json"
      }
    });

  } catch (e) {
    return new Response(JSON.stringify({
      error: "读取失败",
      detail: e.toString()
    }), {
      headers: {
        "content-type": "application/json"
      }
    });
  }
}
