export async function onRequest() {
  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>圣经金句</title>
<style>
body {
  margin: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f172a;
  color: #fff;
  font-family: sans-serif;
}
.card {
  text-align: center;
  max-width: 700px;
  padding: 20px;
}
#text {
  font-size: 28px;
  margin-bottom: 20px;
}
#from {
  font-size: 16px;
  color: #94a3b8;
}
</style>
</head>
<body>

<div class="card">
  <div id="text">加载中...</div>
  <div id="from"></div>
</div>

<script>
async function loadVerse() {
  try {
    const res = await fetch('/api/random');
    const data = await res.json();

    document.getElementById('text').innerText = data.hitokoto;
    document.getElementById('from').innerText =
      data.from + " · " + (data.from_who || "圣经");
  } catch (e) {
    document.getElementById('text').innerText = "加载失败";
    document.getElementById('from').innerText = "";
  }
}

// 首次加载
loadVerse();

// ✅ 600秒 = 600000毫秒
setInterval(loadVerse, 600000);
</script>

</body>
</html>
`;

  return new Response(html, {
    headers: {
      "content-type": "text/html;charset=UTF-8"
    }
  });
}
