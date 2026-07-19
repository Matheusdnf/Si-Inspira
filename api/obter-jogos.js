import { google } from "googleapis";

export default async function handler(req, res) {
  const credentialsJson = process.env.GOOGLE_CREDENTIALS_JSON;
  const folderId = "1EXqNMZJOmA9-7vY_UYrcqw6tyZrCJacp";

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
      // Apenas pastas (mimeType = 'application/vnd.google-apps.folder')
      q: `'${folderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: "files(id, name, webViewLink)",
      spaces: "drive",
      orderBy: "name",
    });

    const files = response.data.files || [];

    const jogos = files.map((file, index) => {
      const tituloLimpo = file.name;

      return {
        id: file.id,
        titulo: tituloLimpo,
        edicao: "Jogo Didático",
        linkDownload: file.webViewLink,
        icone: "fa-gamepad",
        capa: null,
      };
    });

    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=86400");
    return res.status(200).json(jogos);
  } catch (error) {
    console.error("Erro interno na API do Google Drive (Jogos):", error);
    return res
      .status(500)
      .json({ error: "Falha ao processar requisição do Google Drive." });
  }
}
