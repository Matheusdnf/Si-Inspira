document.addEventListener("DOMContentLoaded", () => {
  const swiperConfig = (paginationEl, nextEl, prevEl) => ({
    slidesPerView: 1,
    spaceBetween: 24,
    grabCursor: true, // Facilita arrastar com o mouse e touch
    pagination: { el: paginationEl, clickable: true },
    navigation: { nextEl: nextEl, prevEl: prevEl },
    breakpoints: {
      640: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });

  const gridLivros = document.getElementById("grid-livros");
  fetch("/api/livros")
    .then((response) => {
      if (!response.ok) throw new Error("Erro na resposta do servidor");
      return response.json();
    })
    .then((livros) => {
      if (livros.length === 0) {
        gridLivros.innerHTML = `<p class="text-gray-500 text-center col-span-full">Nenhum livro foi adicionado à pasta ainda.</p>`;
        return;
      }

      gridLivros.innerHTML = livros
        .map(
          (livro, idx) => `
        <div class="swiper-slide flex flex-col items-center max-w-sm group">
          
          <!-- Capa fallback em CSS (Fica oculta inicialmente se a imagem existir) -->
          <div id="fallback-cover-${idx}" class="${livro.capa ? "hidden " : ""}relative w-56 h-80 shadow-2xl rounded-r-lg overflow-hidden transform transition-all duration-300 group-hover:-translate-y-2 group-hover:rotate-1 bg-[#2b2d7c] flex flex-col justify-between p-6 border-l-[12px] border-black/20 text-white">
            <div class="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none"></div>
            <div>
              <p class="text-xs tracking-widest uppercase opacity-75">${livro.volume}</p>
              <h3 class="font-bold text-lg mt-2 leading-snug">${livro.titulo}</h3>
            </div>
            <div class="flex justify-between items-end">
              <span class="text-xs font-semibold opacity-60">SI Inspira</span>
              <i class="fa-solid ${livro.icone} text-2xl opacity-40"></i>
            </div>
          </div>

          <!-- Capa com Imagem (Se a imagem quebrar, o onerror oculta essa div e mostra o fallback) -->
          ${
            livro.capa
              ? `
          <div id="img-cover-${idx}" class="relative w-56 h-80 shadow-2xl rounded-lg overflow-hidden transform transition-all duration-300 group-hover:-translate-y-2 group-hover:rotate-1">
            <img src="${livro.capa}" alt="Capa de ${livro.titulo}" loading="lazy" class="w-full h-full object-cover" onerror="document.getElementById('img-cover-${idx}').classList.add('hidden'); document.getElementById('fallback-cover-${idx}').classList.remove('hidden');" />
          </div>
          `
              : ""
          }
          <h4 class="mt-6 font-bold text-lg text-gray-900 text-center px-2 line-clamp-2 h-14">${livro.titulo}</h4>
          <p class="text-sm text-gray-500 mb-4">${livro.edicao}</p>
          <a href="${livro.linkDownload}" target="_blank" class="inline-flex items-center gap-2 bg-[#2b2d7c] text-white px-5 py-2 rounded-full font-medium shadow-md hover:bg-[#1d1f59] transition-colors text-sm">
            <i class="fa-solid fa-eye"></i> Visualizar Obra
          </a>
        </div>
      `,
        )
        .join("");

      new Swiper(
        ".swiper-livros",
        swiperConfig(
          ".swiper-pagination-livros",
          ".swiper-button-next-livros",
          ".swiper-button-prev-livros",
        ),
      );
    })
    .catch((error) => {
      console.error("Erro nos livros:", error);
      gridLivros.innerHTML = `<p class="text-red-500 text-center col-span-full">Não foi possível carregar o acervo digital.</p>`;
    });

  // 1.5 CARREGAR TUTORIAIS E CARTILHAS
  const gridTutoriais = document.getElementById("grid-tutoriais");
  if (gridTutoriais) {
    fetch("/api/tutoriais")
      .then((response) => {
        if (!response.ok) throw new Error("Erro na resposta do servidor");
        return response.json();
      })
      .then((tutoriais) => {
        if (tutoriais.length === 0) {
          gridTutoriais.innerHTML = `<p class="text-gray-500 text-center col-span-full">Nenhum material foi adicionado à pasta ainda.</p>`;
          return;
        }

        gridTutoriais.innerHTML = tutoriais
          .map(
            (tutorial, idx) => `
          <div class="swiper-slide flex flex-col items-center max-w-sm group">
            
            <!-- Capa fallback em CSS (Fica oculta inicialmente se a imagem existir) -->
            <div id="fallback-cover-tut-${idx}" class="${tutorial.capa ? "hidden " : ""}relative w-56 h-80 shadow-2xl rounded-r-lg overflow-hidden transform transition-all duration-300 group-hover:-translate-y-2 group-hover:rotate-1 bg-[#2b2d7c] flex flex-col justify-between p-6 border-l-[12px] border-black/20 text-white">
              <div class="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none"></div>
              <div>
                <p class="text-xs tracking-widest uppercase opacity-75">${tutorial.volume}</p>
                <h3 class="font-bold text-lg mt-2 leading-snug">${tutorial.titulo}</h3>
              </div>
              <div class="flex justify-between items-end">
                <span class="text-xs font-semibold opacity-60">SI Inspira</span>
                <i class="fa-solid ${tutorial.icone} text-2xl opacity-40"></i>
              </div>
            </div>

            <!-- Capa com Imagem (Se a imagem quebrar, o onerror oculta essa div e mostra o fallback) -->
            ${
              tutorial.capa
                ? `
            <div id="img-cover-tut-${idx}" class="relative w-56 h-80 shadow-2xl rounded-lg overflow-hidden transform transition-all duration-300 group-hover:-translate-y-2 group-hover:rotate-1">
              <img src="${tutorial.capa}" alt="Capa de ${tutorial.titulo}" loading="lazy" class="w-full h-full object-cover" onerror="document.getElementById('img-cover-tut-${idx}').classList.add('hidden'); document.getElementById('fallback-cover-tut-${idx}').classList.remove('hidden');" />
            </div>
            `
                : ""
            }
            <h4 class="mt-6 font-bold text-lg text-gray-900 text-center px-2 line-clamp-2 h-14">${tutorial.titulo}</h4>
            <p class="text-sm text-gray-500 mb-4">${tutorial.edicao}</p>
            <a href="${tutorial.linkDownload}" target="_blank" class="inline-flex items-center gap-2 bg-[#2b2d7c] text-white px-5 py-2 rounded-full font-medium shadow-md hover:bg-[#1d1f59] transition-colors text-sm">
              <i class="fa-solid fa-eye"></i> Visualizar
            </a>
          </div>
        `,
          )
          .join("");

        new Swiper(
          ".swiper-tutoriais",
          swiperConfig(
            ".swiper-pagination-tutoriais",
            ".swiper-button-next-tutoriais",
            ".swiper-button-prev-tutoriais",
          ),
        );
      })
      .catch((error) => {
        console.error("Erro nos tutoriais:", error);
        gridTutoriais.innerHTML = `<p class="text-red-500 text-center col-span-full">Não foi possível carregar os materiais digitais.</p>`;
      });
  }

  // 1.8 CARREGAR VÍDEOS
  const gridVideos = document.getElementById("grid-videos");
  if (gridVideos) {
    fetch("/api/videos")
      .then((response) => {
        if (!response.ok) throw new Error("Erro na resposta do servidor");
        return response.json();
      })
      .then((videos) => {
        if (videos.length === 0) {
          gridVideos.innerHTML = `<p class="text-gray-500 text-center col-span-full">Nenhum vídeo foi adicionado à pasta ainda.</p>`;
          return;
        }

        gridVideos.innerHTML = videos
          .map(
            (video, idx) => `
          <div class="swiper-slide flex flex-col items-center max-w-sm group">
            
            <!-- Capa fallback em CSS (Fica oculta inicialmente se a imagem existir) -->
            <div id="fallback-cover-vid-${idx}" class="${video.capa ? "hidden " : ""}relative w-56 h-80 shadow-2xl rounded-r-lg overflow-hidden transform transition-all duration-300 group-hover:-translate-y-2 group-hover:rotate-1 bg-[#2b2d7c] flex flex-col justify-between p-6 border-l-[12px] border-black/20 text-white">
              <div class="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none"></div>
              <div>
                <p class="text-xs tracking-widest uppercase opacity-75">${video.volume}</p>
                <h3 class="font-bold text-lg mt-2 leading-snug">${video.titulo}</h3>
              </div>
              <div class="flex justify-between items-end">
                <span class="text-xs font-semibold opacity-60">SI Inspira</span>
                <i class="fa-solid ${video.icone} text-2xl opacity-40"></i>
              </div>
            </div>

            <!-- Capa com Imagem (Se a imagem quebrar, o onerror oculta essa div e mostra o fallback) -->
            ${
              video.capa
                ? `
            <div id="img-cover-vid-${idx}" class="relative w-56 h-80 shadow-2xl rounded-lg overflow-hidden transform transition-all duration-300 group-hover:-translate-y-2 group-hover:rotate-1">
              <img src="${video.capa}" alt="Capa de ${video.titulo}" loading="lazy" class="w-full h-full object-cover" onerror="document.getElementById('img-cover-vid-${idx}').classList.add('hidden'); document.getElementById('fallback-cover-vid-${idx}').classList.remove('hidden');" />
            </div>
            `
                : ""
            }
            <h4 class="mt-6 font-bold text-lg text-gray-900 text-center px-2 line-clamp-2 h-14">${video.titulo}</h4>
            <p class="text-sm text-gray-500 mb-4">${video.edicao}</p>
            <a href="${video.linkDownload}" target="_blank" class="inline-flex items-center gap-2 bg-[#2b2d7c] text-white px-5 py-2 rounded-full font-medium shadow-md hover:bg-[#1d1f59] transition-colors text-sm">
              <i class="fa-solid fa-play"></i> Assistir
            </a>
          </div>
        `,
          )
          .join("");

        new Swiper(
          ".swiper-videos",
          swiperConfig(
            ".swiper-pagination-videos",
            ".swiper-button-next-videos",
            ".swiper-button-prev-videos",
          ),
        );
      })
      .catch((error) => {
        console.error("Erro nos vídeos:", error);
        gridVideos.innerHTML = `<p class="text-red-500 text-center col-span-full">Não foi possível carregar os vídeos.</p>`;
      });
  }

  // 2. CARREGAR MEMBROS DO PROJETO (JSON LOCAL)
  const gridMembros = document.getElementById("grid-membros");
  fetch("./membros.json")
    .then((response) => {
      if (!response.ok) throw new Error("Erro ao carregar membros.json");
      return response.json();
    })
    .then((membros) => {
      // Ordenar por ordem alfabética (nome)
      membros.sort((a, b) => a.nome.localeCompare(b.nome));

      gridMembros.innerHTML = membros
        .map((membro) => {
          const isImage =
            membro.icone &&
            (membro.icone.includes("/") || membro.icone.includes("."));
          const avatarHtml = isImage
            ? `<img src="${membro.icone}" alt="${membro.nome}" loading="lazy" class="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-sm">`
            : `<div class="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-400 text-3xl"><i class="fa-solid ${membro.icone || "fa-user"}"></i></div>`;

          return `
        <div class="swiper-slide bg-gray-50 rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-auto flex flex-col justify-between">
          <div>
            ${avatarHtml}
            <h3 class="font-bold text-lg text-gray-900">${membro.nome}</h3>
            <p class="text-sm text-[#2b2d7c] font-medium mb-3">${membro.cargo}</p>
            <p class="text-sm text-gray-500">${membro.descricao}</p>
          </div>
        </div>
      `;
        })
        .join("");

      new Swiper(
        ".swiper-membros",
        swiperConfig(
          ".swiper-pagination-membros",
          ".swiper-button-next-membros",
          ".swiper-button-prev-membros",
        ),
      );
    })
    .catch((error) => {
      console.error("Erro nos membros:", error);
      gridMembros.innerHTML = `<p class="text-red-500 text-center col-span-full">Não foi possível carregar os membros.</p>`;
    });
});
