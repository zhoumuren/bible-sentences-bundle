import data from '../sentences/top500.json';

export async function onRequest({ request }) {
  const url = new URL(request.url);

  // ===== 参数 =====
  const encode = url.searchParams.get("encode") || "json";
  const charset = url.searchParams.get("charset") || "utf-8";
  const minLength = parseInt(url.searchParams.get("min_length") || "0");
  const maxLength = parseInt(url.searchParams.get("max_length") || "999");

  try {
    let list = data;

    // ===== 长度过滤 =====
    let filtered = list.filter(item => {
      const len = item.verse?.length || 0;
      return len >= minLength && len <= maxLength;
    });

    if (filtered.length === 0) filtered = list;

    // ===== 随机 =====
    const random = filtered[Math.floor(Math.random() * filtered.length)];

    // ===== 输出（统一API格式）=====
    const result = {
      id: random.id,
      uuid: random.uuid,
      hitokoto: random.verse,
      from: random.reference,
      from_who: "圣经",
      type: "bible"
    };

    // ===== 文本输出 =====
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

    // ===== JSON输出 =====
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
