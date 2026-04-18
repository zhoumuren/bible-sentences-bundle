import data from '../../sentences/bible.json';

export async function onRequest({ request }) {
  const url = new URL(request.url);

  const encode = url.searchParams.get("encode") || "json";
  const charset = url.searchParams.get("charset") || "utf-8";
  const minLength = parseInt(url.searchParams.get("min_length") || "0");
  const maxLength = parseInt(url.searchParams.get("max_length") || "999");

  try {
    let list = Array.isArray(data) ? data : [];

    if (list.length === 0) {
      return new Response(JSON.stringify({
        error: "数据为空"
      }), {
        headers: { "content-type": "application/json" }
      });
    }

    // 长度过滤
    let filtered = list.filter(item => {
      const len = item.hitokoto?.length || 0;
      return len >= minLength && len <= maxLength;
    });

    if (filtered.length === 0) filtered = list;

    const random = filtered[Math.floor(Math.random() * filtered.length)];

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

    // 文本输出（兼容 hitokoto）
    if (encode === "text") {
      return new Response(
        `${result.hitokoto} —— ${result.from}`,
        {
          headers: {
            "content-type": `text/plain; charset=${charset}`,
            "Access-Control-Allow-Origin": "*"
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
      error: "服务器错误",
      detail: e.toString()
    }), {
      headers: {
        "content-type": "application/json"
      }
    });
  }
}
