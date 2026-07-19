document.addEventListener("DOMContentLoaded", () => {
  // --- MENU DRAWER LOGIC ---
  const menuBtn = document.getElementById("menu-btn");
  const closeMenuBtn = document.getElementById("close-menu-btn");
  const drawerMenu = document.getElementById("drawer-menu");
  const drawerContent = document.getElementById("drawer-content");
  const drawerLinks = document.querySelectorAll(".drawer-link");

  const openDrawer = () => {
    drawerMenu.classList.remove("hidden");
    // setTimeout needed for transitions to work after removing hidden
    setTimeout(() => {
      drawerMenu.classList.remove("opacity-0");
      drawerContent.classList.remove("translate-x-full");
    }, 10);
  };

  const closeDrawer = () => {
    drawerMenu.classList.add("opacity-0");
    drawerContent.classList.add("translate-x-full");
    // wait for transition to end before hiding
    setTimeout(() => {
      drawerMenu.classList.add("hidden");
    }, 300);
  };

  menuBtn?.addEventListener("click", openDrawer);
  closeMenuBtn?.addEventListener("click", closeDrawer);
  drawerMenu?.addEventListener("click", (e) => {
    if (e.target === drawerMenu) closeDrawer();
  });
  drawerLinks.forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });

  // --- SWIPER LOGIC ---
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

  // 1.9 CARREGAR PRODUTOS TÉCNICO-TECNOLÓGICOS
  const gridProdutos = document.getElementById("grid-produtos");
  if (gridProdutos) {
    fetch("/api/produtos")
      .then((response) => {
        if (!response.ok) throw new Error("Erro na resposta do servidor");
        return response.json();
      })
      .then((produtos) => {
        if (produtos.length === 0) {
          gridProdutos.innerHTML = `<p class="text-gray-500 text-center col-span-full">Nenhum produto foi adicionado à pasta ainda.</p>`;
          return;
        }

        gridProdutos.innerHTML = produtos
          .map(
            (produto, idx) => `
          <div class="swiper-slide flex flex-col items-center max-w-sm group">
            
            <!-- Capa fallback em CSS (Fica oculta inicialmente se a imagem existir) -->
            <div id="fallback-cover-prod-${idx}" class="${produto.capa ? "hidden " : ""}relative w-56 h-80 shadow-2xl rounded-r-lg overflow-hidden transform transition-all duration-300 group-hover:-translate-y-2 group-hover:rotate-1 bg-[#2b2d7c] flex flex-col justify-between p-6 border-l-[12px] border-black/20 text-white">
              <div class="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none"></div>
              <div>
                <p class="text-xs tracking-widest uppercase opacity-75">${produto.volume}</p>
                <h3 class="font-bold text-lg mt-2 leading-snug">${produto.titulo}</h3>
              </div>
              <div class="flex justify-between items-end">
                <span class="text-xs font-semibold opacity-60">SI Inspira</span>
                <i class="fa-solid ${produto.icone} text-2xl opacity-40"></i>
              </div>
            </div>

            <!-- Capa com Imagem (Se a imagem quebrar, o onerror oculta essa div e mostra o fallback) -->
            ${
              produto.capa
                ? `
            <div id="img-cover-prod-${idx}" class="relative w-56 h-80 shadow-2xl rounded-lg overflow-hidden transform transition-all duration-300 group-hover:-translate-y-2 group-hover:rotate-1">
              <img src="${produto.capa}" alt="Capa de ${produto.titulo}" loading="lazy" class="w-full h-full object-cover" onerror="document.getElementById('img-cover-prod-${idx}').classList.add('hidden'); document.getElementById('fallback-cover-prod-${idx}').classList.remove('hidden');" />
            </div>
            `
                : ""
            }
            <h4 class="mt-6 font-bold text-lg text-gray-900 text-center px-2 line-clamp-2 h-14">${produto.titulo}</h4>
            <p class="text-sm text-gray-500 mb-4">${produto.edicao}</p>
            <a href="${produto.linkDownload}" target="_blank" class="inline-flex items-center gap-2 bg-[#2b2d7c] text-white px-5 py-2 rounded-full font-medium shadow-md hover:bg-[#1d1f59] transition-colors text-sm">
              <i class="fa-solid fa-eye"></i> Visualizar
            </a>
          </div>
        `,
          )
          .join("");

        new Swiper(
          ".swiper-produtos",
          swiperConfig(
            ".swiper-pagination-produtos",
            ".swiper-button-next-produtos",
            ".swiper-button-prev-produtos",
          ),
        );
      })
      .catch((error) => {
        console.error("Erro nos produtos:", error);
        gridProdutos.innerHTML = `<p class="text-red-500 text-center col-span-full">Não foi possível carregar os produtos.</p>`;
      });
  }

  // 1.10 CARREGAR JOGOS DIDÁTICOS
  const gridJogos = document.getElementById("grid-jogos");
  if (gridJogos) {
    fetch("/api/jogos")
      .then((response) => {
        if (!response.ok) throw new Error("Erro na resposta do servidor");
        return response.json();
      })
      .then((jogos) => {
        if (jogos.length === 0) {
          gridJogos.innerHTML = `<p class="text-gray-500 text-center col-span-full">Nenhum jogo foi encontrado no repositório.</p>`;
          return;
        }

        gridJogos.innerHTML = jogos
          .map(
            (jogo, idx) => `
          <div class="swiper-slide flex flex-col items-center max-w-sm group">
            
            <!-- Capa estilo Jogo -->
            <div class="relative w-56 h-80 shadow-2xl rounded-r-lg overflow-hidden transform transition-all duration-300 group-hover:-translate-y-2 group-hover:rotate-1 bg-[#2b2d7c] flex flex-col justify-between p-6 border-l-[12px] border-emerald-500 text-white">
              <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/30 pointer-events-none"></div>
              <div>
                <p class="text-xs tracking-widest uppercase opacity-75">Jogo Didático</p>
                <h3 class="font-bold text-lg mt-2 leading-snug">${jogo.titulo}</h3>
              </div>
              <div class="flex justify-between items-end">
                <span class="text-xs font-semibold opacity-60">Drive</span>
                <i class="fa-solid fa-gamepad text-3xl text-emerald-500"></i>
              </div>
            </div>

            <h4 class="mt-6 font-bold text-lg text-gray-900 text-center px-2 line-clamp-2 h-14">${jogo.titulo}</h4>
            <p class="text-sm text-gray-500 mb-4">${jogo.edicao}</p>
            <a href="${jogo.linkDownload}" target="_blank" class="inline-flex items-center gap-2 bg-[#2b2d7c] text-white px-5 py-2 rounded-full font-medium shadow-md hover:bg-[#1d1f59] transition-colors text-sm">
              <i class="fa-solid fa-play"></i> Acessar Jogo
            </a>
          </div>
        `,
          )
          .join("");

        new Swiper(
          ".swiper-jogos",
          swiperConfig(
            ".swiper-pagination-jogos",
            ".swiper-button-next-jogos",
            ".swiper-button-prev-jogos",
          ),
        );
      })
      .catch((error) => {
        console.error("Erro nos jogos:", error);
        gridJogos.innerHTML = `<p class="text-red-500 text-center col-span-full">Não foi possível carregar os jogos didáticos.</p>`;
      });
  }

  // 1.11 CARREGAR PTTS
  const gridPastas = document.getElementById("grid-pastas");
  if (gridPastas) {
    fetch("/api/pastas")
      .then((response) => {
        if (!response.ok) throw new Error("Erro na resposta do servidor");
        return response.json();
      })
      .then((pastas) => {
        if (pastas.length === 0) {
          gridPastas.innerHTML = `<p class="text-gray-500 text-center col-span-full">Nenhum PTTS foi encontrado no repositório.</p>`;
          return;
        }

        gridPastas.innerHTML = pastas
          .map(
            (pasta, idx) => `
          <div class="swiper-slide flex flex-col items-center max-w-sm group">
            
            <!-- Capa estilo PTTS -->
            <div class="relative w-56 h-80 shadow-2xl rounded-r-lg overflow-hidden transform transition-all duration-300 group-hover:-translate-y-2 group-hover:rotate-1 bg-[#1d1f59] flex flex-col justify-between p-6 border-l-[12px] border-[#fbbf24] text-white">
              <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/30 pointer-events-none"></div>
              <div>
                <p class="text-xs tracking-widest uppercase opacity-75">Produto Técnico</p>
                <h3 class="font-bold text-lg mt-2 leading-snug">${pasta.titulo}</h3>
              </div>
              <div class="flex justify-between items-end">
                <span class="text-xs font-semibold opacity-60">PTTS</span>
                <i class="fa-solid fa-folder-open text-3xl text-[#fbbf24]"></i>
              </div>
            </div>

            <h4 class="mt-6 font-bold text-lg text-gray-900 text-center px-2 line-clamp-2 h-14">${pasta.titulo}</h4>
            <p class="text-sm text-gray-500 mb-4">${pasta.edicao}</p>
            <a href="${pasta.linkDownload}" target="_blank" class="inline-flex items-center gap-2 bg-[#2b2d7c] text-white px-5 py-2 rounded-full font-medium shadow-md hover:bg-[#1d1f59] transition-colors text-sm">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> Acessar Pasta
            </a>
          </div>
        `,
          )
          .join("");

        new Swiper(
          ".swiper-pastas",
          swiperConfig(
            ".swiper-pagination-pastas",
            ".swiper-button-next-pastas",
            ".swiper-button-prev-pastas",
          ),
        );
      })
      .catch((error) => {
        console.error("Erro nas pastas:", error);
        gridPastas.innerHTML = `<p class="text-red-500 text-center col-span-full">Não foi possível carregar as pastas adicionais.</p>`;
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
