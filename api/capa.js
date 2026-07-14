import { google } from "googleapis";

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "ID missing" });

  const credentialsJson = process.env.GOOGLE_CREDENTIALS_JSON;
  if (!credentialsJson) {
    return res.status(500).json({ error: "No credentials" });
  }

  try {
    const credentials = JSON.parse(credentialsJson);
    const formattedPrivateKey = credentials.private_key.replace(/\\n/g, "\n");
    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      formattedPrivateKey,
      ["https://www.googleapis.com/auth/drive.readonly"],
    );

    const drive = google.drive({ version: "v3", auth });

    const response = await drive.files.get({
      fileId: id,
      fields: "thumbnailLink",
    });

    const thumbUrl = response.data.thumbnailLink;
    if (!thumbUrl) {
      return res.redirect(
        `https://drive.google.com/thumbnail?id=${id}&sz=w800`,
      );
    }

    const highResUrl = thumbUrl.replace(/=s\d+$/, "=s800");
    let imgRes = await fetch(highResUrl);

    if (!imgRes.ok) {
      imgRes = await fetch(thumbUrl);
    }

    if (!imgRes.ok) {
      return res.redirect(
        `https://drive.google.com/thumbnail?id=${id}&sz=w800`,
      );
    }

    const arrayBuffer = await imgRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader(
      "Content-Type",
      imgRes.headers.get("content-type") || "image/jpeg",
    );

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate=43200",
    );

    return res.send(buffer);
  } catch (error) {
    console.error("Erro ao gerar capa:", error);
    return res.redirect(`https://drive.google.com/thumbnail?id=${id}&sz=w800`);
  }
}
