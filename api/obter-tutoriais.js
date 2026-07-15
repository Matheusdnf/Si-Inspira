import { google } from "googleapis";

export default async function handler(req, res) {
  const credentialsJson = process.env.GOOGLE_CREDENTIALS_JSON;
  const folderId = "1x3OAOYIG_1PUjPXKfiQCVdXS2rtlaymy";

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

    const tutoriais = files.map((file, index) => {
      const matchVolume = file.name.match(/^(\d+)/);
      const volumeString = matchVolume
        ? `Volume ${matchVolume[1]}`
        : `Material ${index + 1}`;

      const tituloLimpo = file.name.replace(/\.[^/.]+$/, "");

      let icone = "fa-book-open";
      const nameLower = file.name.toLowerCase();

      if (nameLower.includes("terminal") || nameLower.includes("linux")) {
        icone = "fa-terminal";
      } else if (
        nameLower.includes("code") ||
        nameLower.includes("dev") ||
        nameLower.includes("web") ||
        nameLower.includes("stack")
      ) {
        icone = "fa-code";
      } else if (nameLower.includes("rede")) {
        icone = "fa-network-wired";
      } else {
        icone = "fa-file-pdf"; // Icone padrão mais adequado para cartilhas/tutoriais
      }

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
    // Se passar de 30 min, entrega o antigo rápido e atualiza por trás dos panos (stale-while-revalidate=86400)
    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=86400");
    return res.status(200).json(tutoriais);
  } catch (error) {
    console.error("Erro interno na API do Google Drive (Tutoriais):", error);
    return res
      .status(500)
      .json({ error: "Falha ao processar requisição do Google Drive." });
  }
}
