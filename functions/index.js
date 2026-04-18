import data from '../sentences/bible.json';

export async function onRequest({ request }) {
  const url = new URL(request.url);

  const encode = url.searchParams.get("encode") || "json";
  const charset = url.searchParams.get("charset") || "utf-8";

  try {
    const random = data[Math.floor(Math.random() * data.length)];

    const result = {
      id: random.id,
      uuid: random.uuid,
      hitokoto: random.hitokoto,
      from: random.from,
      from_who: random.from_who || "圣经",
      book: random.book,
      chapter: random.chapter,
      verse: random.verse
    };

    // 文本输出
    if (encode === "text") {
      return new Response(
        result.hitokoto + " —— " + result.from,
        {
          headers: {
            "content-type": `text/plain; charset=${charset}`
          }
        }
      );
    }

    // JSON输出
    return new Response(JSON.stringify(result), {
      headers: {
        "content-type": `application/json; charset=${charset}`,
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (e) {
    return new Response(JSON.stringify({
      error: "加载失败",
      detail: e.toString()
    }), {
      headers: {
        "content-type": "application/json"
      }
    });
  }
}
