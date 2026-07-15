import { google } from "googleapis";

export default async function handler(req, res) {
  const credentialsJson = process.env.GOOGLE_CREDENTIALS_JSON;
  const folderId = "1bTGAevB8WSJNgRuG07krvzU1J_HaNzUK";

  if (!credentialsJson) {
    return res
      .status(500)
      .json({ error: "Variáveis de ambiente ausentes no painel do servidor." });
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

    const response = await drive.files.list({
      q: `'${folderId}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed = false`,
      fields: "files(id, name, webViewLink, thumbnailLink)",
      spaces: "drive",
    });

    const files = response.data.files || [];

    const videos = files.map((file, index) => {
      const matchVolume = file.name.match(/^(\d+)/);
      const volumeString = matchVolume
        ? `Parte ${matchVolume[1]}`
        : `Vídeo ${index + 1}`;

      const tituloLimpo = file.name.replace(/\.[^/.]+$/, "");

      const icone = "fa-video";

      return {
        volume: volumeString,
        titulo: tituloLimpo,
        edicao: "Repositório Drive",
        linkDownload: file.webViewLink,
        icone: icone,
        capa: `/api/capa?id=${file.id}`,
      };
    });

    // Cache agressivo: Retorna a lista instantaneamente da memória da Vercel (s-maxage=1800 -> 30 min)
    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=86400");
    return res.status(200).json(videos);
  } catch (error) {
    console.error("Erro interno na API do Google Drive (Vídeos):", error);
    return res
      .status(500)
      .json({ error: "Falha ao processar requisição do Google Drive." });
  }
}
