const toggleTheme = document.getElementById("toggleTheme");
const rootHtml = document.documentElement
const accordionHeaders = document.querySelectorAll(".accordion__header");
const menuLinks = document.querySelectorAll(".menu__link");

function changeTheme() {
  const currentTheme = rootHtml.getAttribute("data-theme");

  if (currentTheme === "dark") {
    rootHtml.setAttribute("data-theme", "light");
    document.body.style.background = "linear-gradient(90deg, #e0e0e0, #ffffff)"; // Light theme background
    if (particlesArray) {
      particlesArray.forEach(p => p.color = '#000000'); // Black particles for light theme
    }
  } else {
    rootHtml.setAttribute("data-theme", "dark");
    document.body.style.background = "linear-gradient(90deg, #5de0e6, #004aad)"; // Dark theme background
    if (particlesArray) {
      particlesArray.forEach(p => p.color = '#ffffff'); // White particles for dark theme
    }
  }

  toggleTheme.classList.toggle("bi-sun");
  toggleTheme.classList.toggle("bi-moon-stars");
}

toggleTheme.addEventListener("click", changeTheme);

accordionHeaders.forEach(header => {
  header.addEventListener("click", () => {
    const accordionItem = header.parentElement;
    const accordionActive = accordionItem.classList.contains("active");

    accordionActive ? accordionItem.classList.remove("active") : accordionItem.classList.add("active");
  })
})

menuLinks.forEach(item => {
  item.addEventListener("click", () => {
    menuLinks.forEach(i => i.classList.remove("active"));
    item.classList.add("active");
  })
})

document.addEventListener("mousemove", (e) => {
  const x = e.clientX;
  const y = e.clientY;
  rootHtml.style.setProperty("--mouse-x", `${x}px`);
  rootHtml.style.setProperty("--mouse-y", `${y}px`);
});

// Particles System
const canvas = document.getElementById("particles-canvas");
const ctx = canvas.getContext("2d");
let particlesArray;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = {
  x: null,
  y: null,
  radius: (canvas.height / 80) * (canvas.width / 80)
}

window.addEventListener('mousemove', (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

window.addEventListener('touchmove', (event) => {
  mouse.x = event.touches[0].clientX;
  mouse.y = event.touches[0].clientY;
});

window.addEventListener('touchstart', (event) => {
  mouse.x = event.touches[0].clientX;
  mouse.y = event.touches[0].clientY;
});

window.addEventListener('touchend', () => {
  mouse.x = undefined;
  mouse.y = undefined;
});

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  mouse.radius = (canvas.height / 80) * (canvas.width / 80);
  init();
});

window.addEventListener('mouseout', () => {
  mouse.x = undefined;
  mouse.y = undefined;
});

class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }

    // Check collision detection - mouse position / particle position
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouse.radius + this.size) {
      if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
        this.x += 10;
      }
      if (mouse.x > this.x && this.x > this.size * 10) {
        this.x -= 10;
      }
      if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
        this.y += 10;
      }
      if (mouse.y > this.y && this.y > this.size * 10) {
        this.y -= 10;
      }
    }

    this.x += this.directionX;
    this.y += this.directionY;
    this.draw();
  }
}

function init() {
  particlesArray = [];
  let numberOfParticles = (canvas.height * canvas.width) / 9000;
  for (let i = 0; i < numberOfParticles; i++) {
    let size = (Math.random() * 5) + 1;
    let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
    let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
    let directionX = (Math.random() * 5) - 2.5;
    let directionY = (Math.random() * 5) - 2.5;
    let color = '#ffffff'; // White particles to contrast with the blue/cyan gradient

    particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
  }
}

function connect() {
  let opacityValue = 1;
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
        ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
      if (distance < (canvas.width / 7) * (canvas.height / 7)) {
        opacityValue = 1 - (distance / 20000);
        // Use the color of the particle for the line
        let rgb = particlesArray[a].color === '#ffffff' ? '255, 255, 255' : '0, 0, 0';
        ctx.strokeStyle = 'rgba(' + rgb + ',' + opacityValue + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
  connect();
}

init();
animate();

// Image & PDF Modal Logic
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("img01");
const modalPdf = document.getElementById("pdf01");
const captionText = document.getElementById("caption");
const span = document.getElementsByClassName("close")[0];

// Get all images that should be zoomable
const zoomableImages = document.querySelectorAll(".brand__logo, .home__avatar, .about__photo, .card__cover, .card__screenshot, .certificate__img");

zoomableImages.forEach(img => {
  img.addEventListener("click", function () {
    modal.style.display = "block";
    modalImg.style.display = "block";
    modalPdf.style.display = "none";
    modalImg.src = this.src;
    captionText.innerHTML = this.alt;
  });
});

// PDF certificate click handler
const pdfCertificates = document.querySelectorAll("[data-pdf]");
pdfCertificates.forEach(el => {
  el.addEventListener("click", function () {
    modal.style.display = "block";
    modalImg.style.display = "none";
    modalPdf.style.display = "block";
    modalPdf.src = this.getAttribute("data-pdf");
    captionText.innerHTML = this.getAttribute("data-title") || "";
  });
});

// Close modal when clicking the X
span.onclick = function () {
  modal.style.display = "none";
  modalPdf.src = "";
}

// Close modal when clicking outside the content
modal.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
    modalPdf.src = "";
  }
}

// Language Translation
const languageSelect = document.getElementById("languageSelect");

const translations = {
  pt: {
    welcome: "<b>Bem Vindo</b> ao meu Portfólio!",
    bio1: "Me chamo Arthur Silva Correia, tenho 21 anos e curso o 7º semestre de Engenharia da Computação no Instituto Mauá de Tecnologia.",
    bio2: "Tenho interesse em desenvolvimento de software e análise de dados, com facilidade para aprender novas tecnologias. Fora do ambiente acadêmico, acompanho conteúdos de tecnologia e entretenimento digital.",
    bio3: "Meus pontos fortes são responsabilidade, cumprimento de prazos e aprendizado rápido. Como ponto de desenvolvimento, trabalho a comunicação e a ansiedade por meio de apresentações acadêmicas e atividades em grupo, buscando evolução contínua.",
    viewProjects: "Ver Projetos",
    learning: "Aprendendo cada dia mais",
    projectSectionTitle: "Projetos",
    projectTitle: "Projeto Banco Fictício JavaFX",
    projectDesc: "Projeto para fins didáticos desenvolvido em grupo na disciplina de Linguagens de Programação, uso do Java(+JavaFX) e MySQL",
    viewAll: "Ver Todos os Projetos",
    aboutMe: "Sobre mim",
    aboutBio: "Arthur Silva Correia. Gosto muito de jogos e tecnologia, esse meu gosto despertou um interesse na área da computação. Atualmente estou cursando Engenharia da Computação no Instituto Mauá de Tecnologia, ao mesmo tempo que fazendo cursos Front-End na DIO.",
    connect: "Conecte-se Comigo",
    resume: "Currículo",
    navHome: "Início",
    navProjects: "Projetos",
    navAbout: "Sobre",
    navContact: "Contato",
    formation: "Formação",
    experiences: "Experiências",
    academicProjects: "Projetos Acadêmicos",
    courses: "Cursos",
    techSkills: "Conhecimentos em Tecnologia",
    interests: "Interesses",
    contact: "Contate-me",
    contactDesc: "Estou disponível para serviços e novas conexões. Contate-me via e-mail e conecte-se comigo através das minhas redes sociais.",
    footerText: "© 2025. Todos os direitos reservados. Portfólio desenvolvido por",
    footerAI: "Desenvolvido inicialmente de forma manual. IA utilizada para internacionalização, efeitos especiais e auxílio na formatação.",
    degreeName: "Engenharia da Computação",
    degreeDate: "Fev 2023 - Dez 2027",
    expJobTitle: "Assistente Comercial e Desenvolvimento Web",
    expDate: "Jan/2026 – Atual",
    expCompany: "Going Far Store",
    expDetail1: "Realizei atendimento ao cliente e suporte às vendas via WhatsApp Business e Instagram, contribuindo para conversão e fidelização.",
    expDetail2: "Desenvolvi e atualizei o site institucional na plataforma WIX, utilizando HTML e CSS para melhorias visuais e funcionais.",
    expDetail3: "Implementei melhorias e novos recursos com uso de Excel e Power BI, otimizando organização e análise de dados.",
    expDetail4: "Apoiei projetos tecnológicos internos, incluindo prototipagem de novos produtos e soluções digitais.",
    accessSite: "Acessar o Site",
    acadProjectTitle: "Desenvolvimento de Aplicativos com a Linguagem Kotlin",
    acadProjectDate: "Ago 2025 - Nov 2025",
    acadProjectDesc: "Desenvolvimento em grupo de um aplicativo Android, solicitado pela empresa parceira, Advocacia Céspedes Lourenço, com foco em uma calculadora penal.",
    course1Title: "Randstad - Análise de Dados",
    course1Desc: "DIO | 2025 – 104 horas",
    course2Title: "Fundamentos de Computação em Nuvem – AWS Academy",
    course2Desc: "Instituto Mauá de Tecnologia | 2025 – 40 horas",
    course3Title: "Desenvolvimento de Aplicativos com a Linguagem Kotlin",
    course3Desc: "Instituto Mauá de Tecnologia | 2025 – 40 horas",
    course4Title: "Brincando com a eletrônica na prática",
    course4Desc: "Com tutoria de engenheiro e alunos da engenharia - Instituto Mauá de Tecnologia | 2025 – 40 horas",
    course5Title: "Princípios de Aprendizado de Máquina",
    course5Desc: "Instituto Mauá de Tecnologia | 2025 – 40 horas",
    course6Title: "Ri Happy - Front-end do Zero",
    course6Desc: "DIO | 2025 – 75 horas",
    course7Title: "Power BI Básico",
    course7Desc: "Instituto Mauá de Tecnologia | 2024 – 40 horas",
    course8Title: "Introdução a Automação e Eletrônica Básica",
    course8Desc: "Instituto Mauá de Tecnologia | 2024 – 40 horas",
    course9Title: "Introdução a Ciência de Dados",
    course9Desc: "Instituto Mauá de Tecnologia | 2023 – 40 horas",
    course10Title: "Construção de Gráficos e Análise de Dados em Excel",
    course10Desc: "Instituto Mauá de Tecnologia | 2023 – 40 horas",
    course11Title: "Inglês",
    course11Desc: "Cultura Inglesa | 2022 – Atualmente",
    course12Title: "Introdução ao Hacking e Pentest 2.0",
    course12Desc: "Solyd Offensive Security | 2025",
    viewCertificate: "Ver Certificado",
    currentlyTaking: "Cursando",
    course13Title: "Aerografia",
    course13Desc: "Instituto Mauá de Tecnologia | 2024 – 40 horas",
    course14Title: "Planejamento Financeiro Pessoal",
    course14Desc: "Instituto Mauá de Tecnologia | 2024 – 40 horas",
    course15Title: "Calouros",
    course15Desc: "Instituto Mauá de Tecnologia | 2023 – 40 horas",
    course16Title: "GeoGebra",
    course16Desc: "Instituto Mauá de Tecnologia | 2023 – 40 horas",
    course17Title: "Imersão Dev Agentes de IA",
    course17Desc: "Alura & Google | 2025 – 4 horas",
    languageProficiency: "Inglês: Intermediário/Avançado | Português Brasileiro: Nativo",
    interestPC: "Montagem e manutenção de computadores",
    interestML: "Aprendizado de máquina",
    interestCloud: "Estudo de cloud computing (AWS, Azure)",
    interestPerf: "Testes de desempenho em sistemas",
    interestSudoku: "Sudoku",
    interestCards: "Jogos de cartas estratégicos",
    interestEnigmas: "Jogos de enigmas",
    projectFeature1: "Página de Login;",
    projectFeature2: "Banco do MySQL armazenando informações das contas;",
    projectFeature3: "Operações de saque.",
    project2Title: "Calculadora Penal",
    project2Desc: "Aplicativo Android desenvolvido em grupo para a empresa Advocacia Céspedes Lourenço, com foco em cálculos de progressão de pena de forma rápida e prática.",
    project2Feature1: "Cálculo de pena baseado em regime, tipo de crime e remissão;",
    project2Feature2: "Suporte multilíngue (Português, Inglês, Espanhol);",
    project2Feature3: "Envio dos resultados por WhatsApp ou e-mail.",
    project3Title: "Banco CVetti - Servidor",
    project3Desc: "Projeto em grupo na disciplina de Linguagens de Programação: banco digital com arquitetura cliente-servidor usando WebSocket, desenvolvido e hospedado no GitHub Codespace.",
    project3Feature1: "Comunicação em tempo real via WebSocket;",
    project3Feature2: "Aplicativo cliente com interface JavaFX;",
    project3Feature3: "Servidor hospedado no GitHub Codespace.",
    repository: "Repositório",
    acadDetail1: "Encontros semanais para aprendizado do básico da linguagem Kotlin;",
    acadDetail2: "Visita de representante da empresa para apresentação da ideia e requisitos da aplicação;",
    acadDetail3: "Entregas parciais ao longo das aulas, garantindo evolução contínua no domínio da linguagem;",
    acadDetail4: "Entrega final: apresentação do aplicativo concluído para a empresa parceira.",
    skillBasic: "Básico",
    skillIntermediate: "Intermediário",
    skillAdvanced: "Avançado",
    skillOffice: "Pacote Office",
    skillAITools: "Ferramentas de IA",
    skillDatabase: "Banco de Dados",
    skillTools: "Ferramentas",
    skillData: "Dados",
    skillOthers: "Outros"
  },

  en: {
    welcome: "<b>Welcome</b> to my Portfolio!",
    bio1: "My name is Arthur Silva Correia, I am 21 years old and currently in the 7th semester of Computer Engineering at Instituto Mauá de Tecnologia.",
    bio2: "I have an interest in software development and data analysis, with an aptitude for learning new technologies. Outside of academia, I follow technology content and digital entertainment.",
    bio3: "My strengths are responsibility, meeting deadlines, and fast learning. As an area for development, I am working on communication and anxiety through academic presentations and group activities, seeking continuous improvement.",
    viewProjects: "View Projects",
    learning: "Learning more every day",
    projectSectionTitle: "Projects",
    projectTitle: "JavaFX Fictitious Bank Project",
    projectDesc: "Didactic group project developed in the Programming Languages course, using Java(+JavaFX) and MySQL.",
    viewAll: "View All Projects",
    aboutMe: "About Me",
    aboutBio: "Arthur Silva Correia. I really like games and technology, which sparked my interest in computing. I am currently studying Computer Engineering at Instituto Mauá de Tecnologia, while also taking Front-End courses at DIO.",
    connect: "Connect with Me",
    resume: "Resume",
    navHome: "Home",
    navProjects: "Projects",
    navAbout: "About",
    navContact: "Contact",
    formation: "Education",
    experiences: "Experiences",
    academicProjects: "Academic Projects",
    courses: "Courses",
    techSkills: "Tech Skills",
    interests: "Interests",
    contact: "Contact Me",
    contactDesc: "I am available for services and new connections. Contact me via email and connect with me through my social networks.",
    footerText: "© 2025. All rights reserved. Portfolio developed by",
    footerAI: "Initially developed manually. AI used for internationalization, special effects, and formatting assistance.",
    degreeName: "Computer Engineering",
    degreeDate: "Feb 2023 - Dec 2027",
    expJobTitle: "Commercial Assistant and Web Development",
    expDate: "Jan/2026 – Present",
    expCompany: "Going Far Store",
    expDetail1: "Provided customer service and sales support via WhatsApp Business and Instagram, contributing to conversion and retention.",
    expDetail2: "Developed and updated the institutional website on the WIX platform, using HTML and CSS for visual and functional improvements.",
    expDetail3: "Implemented improvements and new features using Excel and Power BI, optimizing data organization and analysis.",
    expDetail4: "Supported internal technological projects, including prototyping of new products and digital solutions.",
    accessSite: "Access Site",
    acadProjectTitle: "App Development with Kotlin",
    acadProjectDate: "Aug 2025 - Nov 2025",
    acadProjectDesc: "Group development of an Android app, requested by partner company Advocacia Céspedes Lourenço, focused on a criminal sentence calculator.",
    course1Title: "Randstad - Data Analysis",
    course1Desc: "DIO | 2025 – 104 hours",
    course2Title: "Cloud Computing Fundamentals – AWS Academy",
    course2Desc: "Instituto Mauá de Tecnologia | 2025 – 40 hours",
    course3Title: "App Development with Kotlin",
    course3Desc: "Instituto Mauá de Tecnologia | 2025 – 40 hours",
    course4Title: "Hands-on Electronics",
    course4Desc: "With engineer and engineering student tutoring - Instituto Mauá de Tecnologia | 2025 – 40 hours",
    course5Title: "Machine Learning Principles",
    course5Desc: "Instituto Mauá de Tecnologia | 2025 – 40 hours",
    course6Title: "Ri Happy - Front-end from Scratch",
    course6Desc: "DIO | 2025 – 75 hours",
    course7Title: "Power BI Basics",
    course7Desc: "Instituto Mauá de Tecnologia | 2024 – 40 hours",
    course8Title: "Introduction to Automation and Basic Electronics",
    course8Desc: "Instituto Mauá de Tecnologia | 2024 – 40 hours",
    course9Title: "Introduction to Data Science",
    course9Desc: "Instituto Mauá de Tecnologia | 2023 – 40 hours",
    course10Title: "Graph Construction and Data Analysis in Excel",
    course10Desc: "Instituto Mauá de Tecnologia | 2023 – 40 hours",
    course11Title: "English",
    course11Desc: "Cultura Inglesa | 2022 – Present",
    course12Title: "Introduction to Hacking and Pentest 2.0",
    course12Desc: "Solyd Offensive Security | 2025",
    viewCertificate: "View Certificate",
    currentlyTaking: "In Progress",
    course13Title: "Airbrush Art",
    course13Desc: "Instituto Mauá de Tecnologia | 2024 – 40 hours",
    course14Title: "Personal Financial Planning",
    course14Desc: "Instituto Mauá de Tecnologia | 2024 – 40 hours",
    course15Title: "Freshmen",
    course15Desc: "Instituto Mauá de Tecnologia | 2023 – 40 hours",
    course16Title: "GeoGebra",
    course16Desc: "Instituto Mauá de Tecnologia | 2023 – 40 hours",
    course17Title: "AI Agents Dev Immersion",
    course17Desc: "Alura & Google | 2025 – 4 hours",
    languageProficiency: "English: Intermediate/Advanced | Portuguese: Native",
    interestPC: "Computer Assembly and Maintenance",
    interestML: "Machine Learning",
    interestCloud: "Cloud Computing Study (AWS, Azure)",
    interestPerf: "System Performance Testing",
    interestSudoku: "Sudoku",
    interestCards: "Strategic Card Games",
    interestEnigmas: "Puzzle Games",
    projectFeature1: "Login Page;",
    projectFeature2: "MySQL database storing account information;",
    projectFeature3: "Withdrawal operations.",
    project2Title: "Criminal Sentence Calculator",
    project2Desc: "Android app developed as a team for Advocacia Céspedes Lourenço, focused on quick and practical criminal sentence progression calculations.",
    project2Feature1: "Sentence calculation based on regime, crime type, and remission;",
    project2Feature2: "Multilingual support (Portuguese, English, Spanish);",
    project2Feature3: "Send results via WhatsApp or email.",
    project3Title: "CVetti Bank - Server",
    project3Desc: "Group project in the Programming Languages course: digital bank with client-server architecture using WebSocket, developed and hosted on GitHub Codespace.",
    project3Feature1: "Real-time communication via WebSocket;",
    project3Feature2: "Client application with JavaFX interface;",
    project3Feature3: "Server hosted on GitHub Codespace.",
    repository: "Repository",
    acadDetail1: "Weekly meetings for learning the basics of the Kotlin language;",
    acadDetail2: "Visit from company representative to present the idea and application requirements;",
    acadDetail3: "Partial deliveries throughout classes, ensuring continuous progress in mastering the language;",
    acadDetail4: "Final delivery: presentation of the completed app to the partner company.",
    skillBasic: "Basic",
    skillIntermediate: "Intermediate",
    skillAdvanced: "Advanced",
    skillOffice: "Office Suite",
    skillAITools: "AI Tools",
    skillDatabase: "Database",
    skillTools: "Tools",
    skillData: "Data",
    skillOthers: "Others"
  },
  es: {
    welcome: "<b>Bienvenido</b> a mi Portafolio!",
    bio1: "Me llamo Arthur Silva Correia, tengo 21 años y curso el 7º semestre de Ingeniería Informática en el Instituto Mauá de Tecnologia.",
    bio2: "Tengo interés en el desarrollo de software y análisis de datos, con facilidad para aprender nuevas tecnologías. Fuera del ámbito académico, sigo contenidos de tecnología y entretenimiento digital.",
    bio3: "Mis fortalezas son la responsabilidad, el cumplimiento de plazos y el aprendizaje rápido. Como punto de desarrollo, trabajo la comunicación y la ansiedad a través de presentaciones académicas y actividades en grupo, buscando una evolución continua.",
    viewProjects: "Ver Proyectos",
    learning: "Aprendiendo cada día más",
    projectSectionTitle: "Proyectos",
    projectTitle: "Proyecto Banco Ficticio JavaFX",
    projectDesc: "Proyecto didáctico en grupo desarrollado en la asignatura de Lenguajes de Programación, uso de Java(+JavaFX) y MySQL.",
    viewAll: "Ver Todos los Proyectos",
    aboutMe: "Sobre mí",
    aboutBio: "Arthur Silva Correia. Me gustan mucho los juegos y la tecnología, lo que despertó mi interés en la computación. Actualmente estudio Ingeniería Informática en el Instituto Mauá de Tecnologia, al mismo tiempo que hago cursos de Front-End en DIO.",
    connect: "Conéctate Conmigo",
    resume: "Currículum",
    navHome: "Inicio",
    navProjects: "Proyectos",
    navAbout: "Sobre mí",
    navContact: "Contacto",
    formation: "Formación",
    experiences: "Experiencias",
    academicProjects: "Proyectos Académicos",
    courses: "Cursos",
    techSkills: "Habilidades Técnicas",
    interests: "Intereses",
    contact: "Contáctame",
    contactDesc: "Estoy disponible para servicios y nuevas conexiones. Contáctame vía correo electrónico y conéctate conmigo a través de mis redes sociales.",
    footerText: "© 2025. Todos los derechos reservados. Portafolio desarrollado por",
    footerAI: "Desarrollado inicialmente de forma manual. IA utilizada para internacionalización, efectos especiales y asistencia en la formatación.",
    degreeName: "Ingeniería Informática",
    degreeDate: "Feb 2023 - Dic 2027",
    expJobTitle: "Asistente Comercial y Desarrollo Web",
    expDate: "Ene/2026 – Actualidad",
    expCompany: "Going Far Store",
    expDetail1: "Realicé atención al cliente y soporte de ventas a través de WhatsApp Business e Instagram, contribuyendo a la conversión y fidelización.",
    expDetail2: "Desarrollé y actualicé el sitio web institucional en la plataforma WIX, utilizando HTML y CSS para mejoras visuales y funcionales.",
    expDetail3: "Implementé mejoras y nuevas funcionalidades usando Excel y Power BI, optimizando la organización y análisis de datos.",
    expDetail4: "Apoyé proyectos tecnológicos internos, incluyendo el prototipado de nuevos productos y soluciones digitales.",
    accessSite: "Acceder al Sitio",
    acadProjectTitle: "Desarrollo de Aplicaciones con Kotlin",
    acadProjectDate: "Ago 2025 - Nov 2025",
    acadProjectDesc: "Desarrollo en grupo de una aplicación Android, solicitada por la empresa socia Advocacia Céspedes Lourenço, enfocada en una calculadora penal.",
    course1Title: "Randstad - Análisis de Datos",
    course1Desc: "DIO | 2025 – 104 horas",
    course2Title: "Fundamentos de Computación en la Nube – AWS Academy",
    course2Desc: "Instituto Mauá de Tecnologia | 2025 – 40 horas",
    course3Title: "Desarrollo de Aplicaciones con Kotlin",
    course3Desc: "Instituto Mauá de Tecnologia | 2025 – 40 horas",
    course4Title: "Jugando con la electrónica en la práctica",
    course4Desc: "Con tutoría de ingeniero y alumnos de ingeniería - Instituto Mauá de Tecnologia | 2025 – 40 horas",
    course5Title: "Principios de Aprendizaje Automático",
    course5Desc: "Instituto Mauá de Tecnologia | 2025 – 40 horas",
    course6Title: "Ri Happy - Front-end desde Cero",
    course6Desc: "DIO | 2025 – 75 horas",
    course7Title: "Power BI Básico",
    course7Desc: "Instituto Mauá de Tecnologia | 2024 – 40 horas",
    course8Title: "Introducción a Automatización y Electrónica Básica",
    course8Desc: "Instituto Mauá de Tecnologia | 2024 – 40 horas",
    course9Title: "Introducción a Ciencia de Datos",
    course9Desc: "Instituto Mauá de Tecnologia | 2023 – 40 horas",
    course10Title: "Construcción de Gráficos y Análisis de Datos en Excel",
    course10Desc: "Instituto Mauá de Tecnologia | 2023 – 40 horas",
    course11Title: "Inglés",
    course11Desc: "Cultura Inglesa | 2022 – Actualmente",
    course12Title: "Introducción al Hacking y Pentest 2.0",
    course12Desc: "Solyd Offensive Security | 2025",
    viewCertificate: "Ver Certificado",
    currentlyTaking: "En Curso",
    course13Title: "Aerografía",
    course13Desc: "Instituto Mauá de Tecnologia | 2024 – 40 horas",
    course14Title: "Planificación Financiera Personal",
    course14Desc: "Instituto Mauá de Tecnologia | 2024 – 40 horas",
    course15Title: "Novatos",
    course15Desc: "Instituto Mauá de Tecnologia | 2023 – 40 horas",
    course16Title: "GeoGebra",
    course16Desc: "Instituto Mauá de Tecnologia | 2023 – 40 horas",
    course17Title: "Inmersión Dev Agentes de IA",
    course17Desc: "Alura & Google | 2025 – 4 horas",
    languageProficiency: "Inglés: Intermedio/Avanzado | Portugués: Nativo",
    interestPC: "Montaje y Mantenimiento de Computadoras",
    interestML: "Aprendizaje Automático",
    interestCloud: "Estudio de Cloud Computing (AWS, Azure)",
    interestPerf: "Pruebas de Rendimiento de Sistemas",
    interestSudoku: "Sudoku",
    interestCards: "Juegos de Cartas Estratégicos",
    interestEnigmas: "Juegos de Enigmas",
    projectFeature1: "Página de Inicio de Sesión;",
    projectFeature2: "Base de datos MySQL almacenando información de las cuentas;",
    projectFeature3: "Operaciones de retiro.",
    project2Title: "Calculadora Penal",
    project2Desc: "Aplicación Android desarrollada en equipo para Advocacia Céspedes Lourenço, enfocada en cálculos rápidos y prácticos de progresión de pena.",
    project2Feature1: "Cálculo de pena basado en régimen, tipo de delito y remisión;",
    project2Feature2: "Soporte multilingüe (Portugués, Inglés, Español);",
    project2Feature3: "Envío de resultados por WhatsApp o correo electrónico.",
    project3Title: "Banco CVetti - Servidor",
    project3Desc: "Proyecto en grupo en la asignatura de Lenguajes de Programación: banco digital con arquitectura cliente-servidor usando WebSocket, desarrollado y hospedado en GitHub Codespace.",
    project3Feature1: "Comunicación en tiempo real vía WebSocket;",
    project3Feature2: "Aplicación cliente con interfaz JavaFX;",
    project3Feature3: "Servidor hospedado en GitHub Codespace.",
    repository: "Repositorio",
    acadDetail1: "Encuentros semanales para aprendizaje de lo básico del lenguaje Kotlin;",
    acadDetail2: "Visita del representante de la empresa para presentación de la idea y requisitos de la aplicación;",
    acadDetail3: "Entregas parciales a lo largo de las clases, garantizando evolución continua en el dominio del lenguaje;",
    acadDetail4: "Entrega final: presentación de la aplicación terminada a la empresa socia.",
    skillBasic: "Básico",
    skillIntermediate: "Intermedio",
    skillAdvanced: "Avanzado",
    skillOffice: "Paquete Office",
    skillAITools: "Herramientas de IA",
    skillDatabase: "Base de Datos",
    skillTools: "Herramientas",
    skillData: "Datos",
    skillOthers: "Otros"
  },
  fr: {
    welcome: "<b>Bienvenue</b> sur mon Portfolio !",
    bio1: "Je m'appelle Arthur Silva Correia, j'ai 21 ans et je suis en 7ème semestre d'Ingénierie Informatique à l'Instituto Mauá de Tecnologia.",
    bio2: "J'ai un intérêt pour le développement logiciel et l'analyse de données, avec une facilité à apprendre de nouvelles technologies. En dehors du cadre académique, je suis des contenus technologiques et de divertissement numérique.",
    bio3: "Mes points forts sont la responsabilité, le respect des délais et l'apprentissage rapide. En tant que point de développement, je travaille sur la communication et l'anxiété à travers des présentations académiques et des activités de groupe, en cherchant une amélioration continue.",
    viewProjects: "Voir les Projets",
    learning: "Apprendre chaque jour plus",
    projectSectionTitle: "Projets",
    projectTitle: "Projet Banque Fictive JavaFX",
    projectDesc: "Projet didactique de groupe développé dans le cours de Langages de Programmation, utilisant Java(+JavaFX) et MySQL.",
    viewAll: "Voir Tous les Projets",
    aboutMe: "À Propos de Moi",
    aboutBio: "Arthur Silva Correia. J'aime beaucoup les jeux et la technologie, ce qui a éveillé mon intérêt pour l'informatique. J'étudie actuellement l'Ingénierie Informatique à l'Instituto Mauá de Tecnologia, tout en suivant des cours Front-End chez DIO.",
    connect: "Connectez-vous avec Moi",
    resume: "CV",
    navHome: "Accueil",
    navProjects: "Projets",
    navAbout: "À Propos",
    navContact: "Contact",
    formation: "Formation",
    experiences: "Expériences",
    academicProjects: "Projets Académiques",
    courses: "Cours",
    techSkills: "Compétences Techniques",
    interests: "Intérêts",
    contact: "Contactez-moi",
    contactDesc: "Je suis disponible pour des services et de nouvelles connexions. Contactez-moi par e-mail et connectez-vous avec moi via mes réseaux sociaux.",
    footerText: "© 2025. Tous droits réservés. Portfolio développé par",
    footerAI: "Développé initialement manuellement. IA utilisée pour l'internationalisation, les effets spéciaux et l'aide à la mise en forme.",
    degreeName: "Ingénierie Informatique",
    degreeDate: "Fév 2023 - Déc 2027",
    expJobTitle: "Assistant Commercial et Développement Web",
    expDate: "Jan/2026 – Présent",
    expCompany: "Going Far Store",
    expDetail1: "J'ai fourni un service client et un support aux ventes via WhatsApp Business et Instagram, contribuant à la conversion et à la fidélisation.",
    expDetail2: "J'ai développé et mis à jour le site web institutionnel sur la plateforme WIX, en utilisant HTML et CSS pour des améliorations visuelles et fonctionnelles.",
    expDetail3: "J'ai mis en œuvre des améliorations et de nouvelles fonctionnalités à l'aide d'Excel et de Power BI, en optimisant l'organisation et l'analyse des données.",
    expDetail4: "J'ai soutenu des projets technologiques internes, y compris le prototypage de nouveaux produits et de solutions numériques.",
    accessSite: "Accéder au Site",
    acadProjectTitle: "Développement d'App avec Kotlin",
    acadProjectDate: "Août 2025 - Nov 2025",
    acadProjectDesc: "Développement en groupe d'une application Android, demandée par l'entreprise partenaire Advocacia Céspedes Lourenço, axée sur un calculateur de peines pénales.",
    course1Title: "Randstad - Analyse de Données",
    course1Desc: "DIO | 2025 – 104 heures",
    course2Title: "Fondamentaux du Cloud Computing – AWS Academy",
    course2Desc: "Instituto Mauá de Tecnologia | 2025 – 40 heures",
    course3Title: "Développement d'Applications avec Kotlin",
    course3Desc: "Instituto Mauá de Tecnologia | 2025 – 40 heures",
    course4Title: "S'amuser avec l'électronique en pratique",
    course4Desc: "Avec tutorat d'ingénieur et d'étudiants en ingénierie - Instituto Mauá de Tecnologia | 2025 – 40 heures",
    course5Title: "Principes d'Apprentissage Automatique",
    course5Desc: "Instituto Mauá de Tecnologia | 2025 – 40 heures",
    course6Title: "Ri Happy - Front-end à partir de Zéro",
    course6Desc: "DIO | 2025 – 75 heures",
    course7Title: "Power BI Basique",
    course7Desc: "Instituto Mauá de Tecnologia | 2024 – 40 heures",
    course8Title: "Introduction à l'Automatisation et Électronique de Base",
    course8Desc: "Instituto Mauá de Tecnologia | 2024 – 40 heures",
    course9Title: "Introduction à la Science des Données",
    course9Desc: "Instituto Mauá de Tecnologia | 2023 – 40 heures",
    course10Title: "Construction de Graphiques et Analyse de Données sur Excel",
    course10Desc: "Instituto Mauá de Tecnologia | 2023 – 40 heures",
    course11Title: "Anglais",
    course11Desc: "Cultura Inglesa | 2022 – Actuellement",
    course12Title: "Introduction au Hacking et Pentest 2.0",
    course12Desc: "Solyd Offensive Security | 2025",
    viewCertificate: "Voir le Certificat",
    currentlyTaking: "En Cours",
    course13Title: "Aérographie",
    course13Desc: "Instituto Mauá de Tecnologia | 2024 – 40 heures",
    course14Title: "Planification Financière Personnelle",
    course14Desc: "Instituto Mauá de Tecnologia | 2024 – 40 heures",
    course15Title: "Nouveaux Étudiants",
    course15Desc: "Instituto Mauá de Tecnologia | 2023 – 40 heures",
    course16Title: "GeoGebra",
    course16Desc: "Instituto Mauá de Tecnologia | 2023 – 40 heures",
    course17Title: "Immersion Dev Agents d'IA",
    course17Desc: "Alura & Google | 2025 – 4 heures",
    languageProficiency: "Anglais : Intermédiaire/Avancé | Portugais : Natif",
    interestPC: "Assemblage et Maintenance d'Ordinateurs",
    interestML: "Apprentissage Automatique",
    interestCloud: "Étude du Cloud Computing (AWS, Azure)",
    interestPerf: "Tests de Performance Système",
    interestSudoku: "Sudoku",
    interestCards: "Jeux de Cartes Stratégiques",
    interestEnigmas: "Jeux d'Énigmes",
    projectFeature1: "Page de Connexion ;",
    projectFeature2: "Base de données MySQL stockant les informations des comptes ;",
    projectFeature3: "Opérations de retrait.",
    project2Title: "Calculateur Pénal",
    project2Desc: "Application Android développée en équipe pour Advocacia Céspedes Lourenço, axée sur des calculs rapides et pratiques de progression de peine.",
    project2Feature1: "Calcul de peine basé sur le régime, le type de crime et la remise ;",
    project2Feature2: "Support multilingue (Portugais, Anglais, Espagnol) ;",
    project2Feature3: "Envoi des résultats par WhatsApp ou e-mail.",
    project3Title: "Banque CVetti - Serveur",
    project3Desc: "Projet de groupe dans le cours de Langages de Programmation : banque numérique avec architecture client-serveur utilisant WebSocket, développé et hébergé sur GitHub Codespace.",
    project3Feature1: "Communication en temps réel via WebSocket ;",
    project3Feature2: "Application cliente avec interface JavaFX ;",
    project3Feature3: "Serveur hébergé sur GitHub Codespace.",
    repository: "Dépôt",
    acadDetail1: "Rencontres hebdomadaires pour l'apprentissage des bases du langage Kotlin ;",
    acadDetail2: "Visite du représentant de l'entreprise pour présentation de l'idée et des exigences de l'application ;",
    acadDetail3: "Livraisons partielles tout au long des cours, assurant une progression continue dans la maîtrise du langage ;",
    acadDetail4: "Livraison finale : présentation de l'application terminée à l'entreprise partenaire.",
    skillBasic: "Basique",
    skillIntermediate: "Intermédiaire",
    skillAdvanced: "Avancé",
    skillOffice: "Suite Office",
    skillAITools: "Outils d'IA",
    skillDatabase: "Base de Données",
    skillTools: "Outils",
    skillData: "Données",
    skillOthers: "Autres"
  },
  zh: {
    welcome: "<b>欢迎</b>来到我的作品集！",
    bio1: "我叫 Arthur Silva Correia，今年21岁，目前在 Instituto Mauá de Tecnologia 就读计算机工程第七学期。",
    bio2: "我对软件开发和数据分析感兴趣，并且善于学习新技术。在学术环境之外，我也关注科技内容和数字娱乐。",
    bio3: "我的优点是责任心强、按时完成任务和快速学习。作为发展点，我通过学术演讲和小组活动来锻炼沟通能力和克服焦虑，寻求持续进步。",
    viewProjects: "查看项目",
    learning: "每一天都在学习",
    projectSectionTitle: "项目",
    projectTitle: "JavaFX 虚拟银行项目",
    projectDesc: "在编程语言课程中开发的小组教学项目，使用 Java(+JavaFX) 和 MySQL。",
    viewAll: "查看所有项目",
    aboutMe: "关于我",
    aboutBio: "Arthur Silva Correia。我非常喜欢游戏和科技，这激发了我对计算机领域的兴趣。目前我在 Instituto Mauá de Tecnologia 学习计算机工程，同时在 DIO 学习前端课程。",
    connect: "与我联系",
    resume: "简历",
    navHome: "主页",
    navProjects: "项目",
    navAbout: "关于",
    navContact: "联系",
    formation: "教育背景",
    experiences: "经验",
    academicProjects: "学术项目",
    courses: "课程",
    techSkills: "技术技能",
    interests: "兴趣",
    contact: "联系我",
    contactDesc: "我提供服务并欢迎新的联系。通过电子邮件联系我，并通过我的社交网络与我联系。",
    footerText: "© 2025. 版权所有。作品集由",
    footerAI: "最初手动开发。AI用于国际化、特效和格式调整协助。",
    degreeName: "计算机工程",
    degreeDate: "2023年2月 - 2027年12月",
    expJobTitle: "商务助理与网页开发",
    expDate: "2026年1月 – 至今",
    expCompany: "Going Far Store",
    expDetail1: "通过WhatsApp Business和Instagram提供客户服务和销售支持，促进了转化和客户留存。",
    expDetail2: "使用HTML和CSS在WIX平台上开发和更新企业网站，改善了视觉和功能。",
    expDetail3: "使用Excel和Power BI实施改进和新功能，优化数据组织和分析。",
    expDetail4: "支持内部技术项目，包括新产品和数字解决方案的原型设计。",
    accessSite: "访问网站",
    acadProjectTitle: "使用Kotlin开发应用程序",
    acadProjectDate: "2025年8月 - 2025年11月",
    acadProjectDesc: "团队开发Android应用程序，受合作企业Advocacia Céspedes Lourenço委托，专注于刑事计算器。",
    course1Title: "Randstad - 数据分析",
    course1Desc: "DIO | 2025 – 104 小时",
    course2Title: "云计算基础 – AWS Academy",
    course2Desc: "Instituto Mauá de Tecnologia | 2025 – 40 小时",
    course3Title: "使用Kotlin开发应用程序",
    course3Desc: "Instituto Mauá de Tecnologia | 2025 – 40 小时",
    course4Title: "动手实践电子学",
    course4Desc: "由工程师和工程学生指导 - Instituto Mauá de Tecnologia | 2025 – 40 小时",
    course5Title: "机器学习原理",
    course5Desc: "Instituto Mauá de Tecnologia | 2025 – 40 小时",
    course6Title: "Ri Happy - 从零开始前端",
    course6Desc: "DIO | 2025 – 75 小时",
    course7Title: "Power BI 基础",
    course7Desc: "Instituto Mauá de Tecnologia | 2024 – 40 小时",
    course8Title: "自动化和基础电子学导论",
    course8Desc: "Instituto Mauá de Tecnologia | 2024 – 40 小时",
    course9Title: "数据科学导论",
    course9Desc: "Instituto Mauá de Tecnologia | 2023 – 40 小时",
    course10Title: "Excel中的图表构建和数据分析",
    course10Desc: "Instituto Mauá de Tecnologia | 2023 – 40 小时",
    course11Title: "英语",
    course11Desc: "Cultura Inglesa | 2022 – 目前",
    course12Title: "黑客与渗透测试入门 2.0",
    course12Desc: "Solyd Offensive Security | 2025",
    viewCertificate: "查看证书",
    currentlyTaking: "在读",
    course13Title: "喷绘艺术",
    course13Desc: "Instituto Mauá de Tecnologia | 2024 – 40 小时",
    course14Title: "个人财务规划",
    course14Desc: "Instituto Mauá de Tecnologia | 2024 – 40 小时",
    course15Title: "新生课程",
    course15Desc: "Instituto Mauá de Tecnologia | 2023 – 40 小时",
    course16Title: "GeoGebra",
    course16Desc: "Instituto Mauá de Tecnologia | 2023 – 40 小时",
    course17Title: "人工智能代理开发沉浸式课程",
    course17Desc: "Alura & Google | 2025 – 4 小时",
    languageProficiency: "英语：中级/高级 | 葡萄牙语：母语",
    interestPC: "电脑组装与维护",
    interestML: "机器学习",
    interestCloud: "云计算学习 (AWS, Azure)",
    interestPerf: "系统性能测试",
    interestSudoku: "数独",
    interestCards: "战略纸牌游戏",
    interestEnigmas: "谜题游戏",
    projectFeature1: "登录页面；",
    projectFeature2: "MySQL数据库存储账户信息；",
    projectFeature3: "取款操作。",
    project2Title: "刑事计算器",
    project2Desc: "团队为Advocacia Céspedes Lourenço开发的Android应用程序，专注于快速实用的刑事判决进展计算。",
    project2Feature1: "基于制度、犯罪类型和减刑的量刑计算；",
    project2Feature2: "多语言支持（葡萄牙语、英语、西班牙语）；",
    project2Feature3: "通过WhatsApp或电子邮件发送结果。",
    project3Title: "CVetti银行 - 服务器",
    project3Desc: "编程语言课程的小组项目：使用WebSocket的客户端-服务器架构数字银行，在GitHub Codespace上开发和托管。",
    project3Feature1: "通过WebSocket进行实时通信；",
    project3Feature2: "使用JavaFX界面的客户端应用程序；",
    project3Feature3: "服务器托管在GitHub Codespace上。",
    repository: "代码仓库",
    acadDetail1: "每周学习Kotlin语言基础；",
    acadDetail2: "企业代表来访介绍项目理念和应用需求；",
    acadDetail3: "课程中进行阶段性交付，确保语言掌握的持续进步；",
    acadDetail4: "最终交付：向合作企业展示完成的应用程序。",
    skillBasic: "基础",
    skillIntermediate: "中级",
    skillAdvanced: "高级",
    skillOffice: "Office 套件",
    skillAITools: "AI 工具",
    skillDatabase: "数据库",
    skillTools: "工具",
    skillData: "数据",
    skillOthers: "其他"
  },
  hi: {
    welcome: "<b>स्वागत है</b> मेरे पोर्टफोलियो में!",
    bio1: "मेरा नाम आर्थर सिल्वा कोरिया है, मैं 21 वर्ष का हूँ और वर्तमान में Instituto Mauá de Tecnologia में कंप्यूटर इंजीनियरिंग के 7वें सेमेस्टर में हूँ।",
    bio2: "मेरी रुचि सॉफ्टवेयर विकास और डेटा विश्लेषण में है, और नई तकनीकों को सीखने में मुझे आसानी होती है। शैक्षणिक वातावरण के बाहर, मैं तकनीकी सामग्री और डिजिटल मनोरंजन का अनुसरण करता हूँ।",
    bio3: "मेरी ताकत जिम्मेदारी, समय सीमा का पालन और तेजी से सीखना है। विकास के बिंदु के रूप में, मैं निरंतर सुधार की तलाश में अकादमिक प्रस्तुतियों और समूह गतिविधियों के माध्यम से संचार और चिंता पर काम कर रहा हूँ।",
    viewProjects: "परियोजनाएं देखें",
    learning: "हर दिन अधिक सीख रहा हूँ",
    projectSectionTitle: "परियोजनाएं",
    projectTitle: "जावाएफएक्स काल्पनिक बैंक परियोजना",
    projectDesc: "प्रोग्रामिंग भाषाओं के पाठ्यक्रम में विकसित डिडक्टिक समूह परियोजना, जावा(+JavaFX) और MySQL का उपयोग करते हुए।",
    viewAll: "सभी परियोजनाएं देखें",
    aboutMe: "मेरे बारे में",
    aboutBio: "आर्थर सिल्वा कोरिया। मुझे खेल और तकनीक बहुत पसंद है, जिसने कंप्यूटिंग क्षेत्र में मेरी रुचि जगी। वर्तमान में मैं Instituto Mauá de Tecnologia में कंप्यूटर इंजीनियरिंग का अध्ययन कर रहा हूँ, साथ ही DIO में फ्रंट-एंड पाठ्यक्रम भी कर रहा हूँ।",
    connect: "मुझसे जुड़ें",
    resume: "बायोडाटा",
    navHome: "होम",
    navProjects: "परियोजनाएं",
    navAbout: "मेरे बारे में",
    navContact: "संपर्क",
    formation: "शिक्षा",
    experiences: "अनुभव",
    academicProjects: "अकादमिक परियोजनाएं",
    courses: "पाठ्यक्रम",
    techSkills: "तकनीकी कौशल",
    interests: "रुचियां",
    contact: "मुझसे संपर्क करें",
    contactDesc: "मैं सेवाओं और नए कनेक्शन के लिए उपलब्ध हूँ। मुझे ईमेल के माध्यम से संपर्क करें और मेरे सोशल नेटवर्क के माध्यम से मुझसे जुड़ें।",
    footerText: "© 2025. सर्वाधिकार सुरक्षित। आर्थर सिल्वा कोरिया द्वारा विकसित पोर्टफोलियो।",
    footerAI: "शुरू में मैन्युअल रूप से विकसित। AI का उपयोग अंतर्राष्ट्रीयकरण, विशेष प्रभाव और फॉर्मेटिंग सहायता के लिए किया गया।",
    degreeName: "कंप्यूटर इंजीनियरिंग",
    degreeDate: "फरवरी 2023 - दिसंबर 2027",
    expJobTitle: "वाणिज्यिक सहायक ऑपर वेब विकास",
    expDate: "जनवरी/2026 – वर्तमान",
    expCompany: "Going Far Store",
    expDetail1: "WhatsApp Business और Instagram के माध्यम से ग्राहक सेवा और बिक्री सहायता प्रदान की, रूपांतरण और प्रतिधारण में योगदान दिया।",
    expDetail2: "दृश्य और कार्यात्मक सुधारों के लिए HTML और CSS का उपयोग करके WIX प्लेटफॉर्म पर संस्थागत वेबसाइट विकसित और अपडेट की।",
    expDetail3: "Excel और Power BI का उपयोग करके सुधार और नई सुविधाएँ लागू कीं, डेटा संगठन और विश्लेषण को अनुकूलित किया।",
    expDetail4: "नए उत्पादों और डिजिटल समाधानों के प्रोटोटाइपिंग सहित आंतरिक तकनीकी परियोजनाओं का समर्थन किया।",
    accessSite: "साइट पर जाएं",
    acadProjectTitle: "कोटलिन के साथ ऐप विकास",
    acadProjectDate: "अगस्त 2025 - नवंबर 2025",
    acadProjectDesc: "साझेदार कंपनी Advocacia Céspedes Lourenço द्वारा अनुरोधित, आपराधिक कैलकुलेटर पर केंद्रित Android ऐप का सामूहिक विकास।",
    course1Title: "Randstad - डेटा विश्लेषण",
    course1Desc: "DIO | 2025 – 104 घंटे",
    course2Title: "क्लाउड कंप्यूटिंग के मूल सिद्धांत – AWS Academy",
    course2Desc: "Instituto Mauá de Tecnologia | 2025 – 40 घंटे",
    course3Title: "कोटलिन के साथ ऐप विकास",
    course3Desc: "Instituto Mauá de Tecnologia | 2025 – 40 घंटे",
    course4Title: "व्यावहारिक इलेक्ट्रॉनिक्स",
    course4Desc: "इंजीनियर और इंजीनियरिंग छात्रों द्वारा मार्गदर्शन - Instituto Mauá de Tecnologia | 2025 – 40 घंटे",
    course5Title: "मशीन लर्निंग के सिद्धांत",
    course5Desc: "Instituto Mauá de Tecnologia | 2025 – 40 घंटे",
    course6Title: "Ri Happy - शून्य से फ्रंट-एंड",
    course6Desc: "DIO | 2025 – 75 घंटे",
    course7Title: "Power BI मूल भूत",
    course7Desc: "Instituto Mauá de Tecnologia | 2024 – 40 घंटे",
    course8Title: "ऑटोमेशन और मूल इलेक्ट्रॉनिक्स का परिचय",
    course8Desc: "Instituto Mauá de Tecnologia | 2024 – 40 घंटे",
    course9Title: "डेटा साइंस का परिचय",
    course9Desc: "Instituto Mauá de Tecnologia | 2023 – 40 घंटे",
    course10Title: "एक्सेल में ग्राफ निर्माण और डेटा विश्लेषण",
    course10Desc: "Instituto Mauá de Tecnologia | 2023 – 40 घंटे",
    course11Title: "अंग्रेज़ी",
    course11Desc: "Cultura Inglesa | 2022 – वर्तमान",
    course12Title: "हैकिंग और पेंटेस्ट 2.0 का परिचय",
    course12Desc: "Solyd Offensive Security | 2025",
    viewCertificate: "प्रमाणपत्र देखें",
    currentlyTaking: "जारी",
    course13Title: "एयरब्रश कला",
    course13Desc: "Instituto Mauá de Tecnologia | 2024 – 40 घंटे",
    course14Title: "व्यक्तिगत वित्तीय योजना",
    course14Desc: "Instituto Mauá de Tecnologia | 2024 – 40 घंटे",
    course15Title: "नवागंतुक",
    course15Desc: "Instituto Mauá de Tecnologia | 2023 – 40 घंटे",
    course16Title: "GeoGebra",
    course16Desc: "Instituto Mauá de Tecnologia | 2023 – 40 घंटे",
    course17Title: "AI एजेंट्स देव इमर्शन",
    course17Desc: "Alura & Google | 2025 – 4 घंटे",
    languageProficiency: "अंग्रेजी: इंटरमीडिएट/एडवांस्ड | पुर्तगाली: मूल निवासी",
    interestPC: "कंप्यूटर असेंबली और रखरखाव",
    interestML: "मशीन लर्निंग",
    interestCloud: "क्लाउड कंप्यूटिंग अध्ययन (AWS, Azure)",
    interestPerf: "सिस्टम प्रदर्शन परीक्षण",
    interestSudoku: "सुडोकू",
    interestCards: "रणनीतिक कार्ड गेम",
    interestEnigmas: "पहेली खेल",
    projectFeature1: "लॉगिन पेज;",
    projectFeature2: "MySQL डेटाबेस खाता जानकारी संग्रहीत करता है;",
    projectFeature3: "निकासी संचालन।",
    project2Title: "आपराधिक कैलकुलेटर",
    project2Desc: "Advocacia Céspedes Lourenço के लिए टीम द्वारा विकसित Android ऐप, त्वरित और व्यावहारिक आपराधिक सजा प्रगति गणना पर केंद्रित।",
    project2Feature1: "शासन, अपराध प्रकार और छूट के आधार पर सजा गणना;",
    project2Feature2: "बहुभाषी समर्थन (पुर्तगाली, अंग्रेजी, स्पेनिश);",
    project2Feature3: "WhatsApp या ईमेल के माध्यम से परिणाम भेजें।",
    project3Title: "CVetti बैंक - सर्वर",
    project3Desc: "प्रोग्रामिंग भाषाओं के पाठ्यक्रम में समूह परियोजना: WebSocket का उपयोग करके क्लाइंट-सर्वर आर्किटेक्चर के साथ डिजिटल बैंक, GitHub Codespace पर विकसित और होस्ट किया गया।",
    project3Feature1: "WebSocket के माध्यम से रीयल-टाइम संचार;",
    project3Feature2: "JavaFX इंटरफ़ेस वाला क्लाइंट ऐप;",
    project3Feature3: "GitHub Codespace पर होस्ट किया गया सर्वर।",
    repository: "रिपॉजिटरी",
    acadDetail1: "कोटलिन भाषा की बुनियादी बातें सीखने के लिए साप्ताहिक बैठकें;",
    acadDetail2: "कंपनी प्रतिनिधि का विचार और आवेदन आवश्यकताओं की प्रस्तुति के लिए दौरा;",
    acadDetail3: "कक्षाओं के दौरान आंशिक डिलीवरी, भाषा में निरंतर प्रगति सुनिश्चित करते हुए;",
    acadDetail4: "अंतिम डिलीवरी: साझेदार कंपनी को पूर्ण ऐप की प्रस्तुति।",
    skillBasic: "बुनियादी",
    skillIntermediate: "मध्यवर्ती",
    skillAdvanced: "उन्नत",
    skillOffice: "ऑफिस सूट",
    skillAITools: "AI उपकरण",
    skillDatabase: "डेटाबेस",
    skillTools: "उपकरण",
    skillData: "डेटा",
    skillOthers: "अन्य"
  },
  ar: {
    welcome: "<b>أهلاً بك</b> في محفظتي!",
    bio1: "اسمي آرثر سيلفا كوريا، عمري 21 عاماً وأدرس حالياً في الفصل الدراسي السابع لهندسة الكمبيوتر في معهد ماوا للتكنولوجيا.",
    bio2: "لدي اهتمام بتطوير البرمجيات وتحليل البيانات، ولدي القدرة على تعلم تقنيات جديدة بسهولة. خارج النطاق الأكاديمي، أتابع المحتوى التكنولوجي والترفيه الرقمي.",
    bio3: "نقاط قوتي هي المسؤولية، والالتزام بالمواعيد النهائية، والتعلم السريع. كنقطة للتطوير، أعمل على التواصل والقلق من خلال العروض التقديمية الأكاديمية والأنشطة الجماعية، سعياً للتحسين المستمر.",
    viewProjects: "عرض المشاريع",
    learning: "أتعلم المزيد كل يوم",
    projectSectionTitle: "المشاريع",
    projectTitle: "مشروع بنك جافا إف إكس الافتراضي",
    projectDesc: "مشروع تعليمي جماعي تم تطويره في دورة لغات البرمجة، باستخدام Java(+JavaFX) و MySQL.",
    viewAll: "عرض جميع المشاريع",
    aboutMe: "عني",
    aboutBio: "آرثر سيلفا كوريا. أحب الألعاب والتكنولوجيا كثيراً، مما أثار اهتمامي بمجال الحوسبة. أدرس حالياً هندسة الكمبيوتر في معهد ماوا للتكنولوجيا، وأخذ أيضاً دورات في الواجهة الأمامية في DIO.",
    connect: "تواصل معي",
    resume: "السيرة الذاتية",
    navHome: "الرئيسية",
    navProjects: "المشاريع",
    navAbout: "عني",
    navContact: "اتصل بي",
    formation: "التعليم",
    experiences: "الخبرات",
    academicProjects: "المشاريع الأكاديمية",
    courses: "الدورات",
    techSkills: "المهارات التقنية",
    interests: "الاهتمامات",
    contact: "اتصل بي",
    contactDesc: "أنا متاح للخدمات ولإجراء اتصالات جديدة. اتصل بي عبر البريد الإلكتروني وتواصل معي عبر شبكات التواصل الاجتماعي الخاصة بي.",
    footerText: "© 2025. جميع الحقوق محفوظة. تم تطوير المحفظة بواسطة",
    footerAI: "تم التطوير في البداية يدويًا. تم استخدام الذكاء الاصطناعي للتدويل والمؤثرات الخاصة والمساعدة في التنسيق.",
    degreeName: "هندسة الكمبيوتر",
    degreeDate: "فبراير 2023 - ديسمبر 2027",
    expJobTitle: "مساعد تجاري وتطوير الويب",
    expDate: "يناير/2026 – الحاضر",
    expCompany: "Going Far Store",
    expDetail1: "قدمت خدمة العملاء ودعم المبيعات عبر WhatsApp Business و Instagram، مما ساهم في التحويل والاحتفاظ.",
    expDetail2: "طورت وحدثت الموقع المؤسسي على منصة WIX، باستخدام HTML و CSS للتحسينات البصرية والوظيفية.",
    expDetail3: "نفذت تحسينات وميزات جديدة باستخدام Excel و Power BI، مما أدى إلى تحسين تنظيم البيانات وتحليلها.",
    expDetail4: "دعمت المشاريع التكنولوجية الداخلية، بما في ذلك النماذج الأولية للمنتجات والحلول الرقمية الجديدة.",
    accessSite: "الوصول إلى الموقع",
    acadProjectTitle: "تطوير التطبيقات باستخدام Kotlin",
    acadProjectDate: "أغسطس 2025 - نوفمبر 2025",
    acadProjectDesc: "تطوير جماعي لتطبيق أندرويد، بطلب من الشركة الشريكة Advocacia Céspedes Lourenço، يركز على آلة حاسبة للعقوبات الجنائية.",
    course1Title: "Randstad - تحليل البيانات",
    course1Desc: "DIO | 2025 – 104 ساعة",
    course2Title: "أساسيات الحوسبة السحابية – AWS Academy",
    course2Desc: "Instituto Mauá de Tecnologia | 2025 – 40 ساعة",
    course3Title: "تطوير التطبيقات باستخدام Kotlin",
    course3Desc: "Instituto Mauá de Tecnologia | 2025 – 40 ساعة",
    course4Title: "اللعب بالإلكترونيات عملياً",
    course4Desc: "بإشراف مهندس وطلاب هندسة - Instituto Mauá de Tecnologia | 2025 – 40 ساعة",
    course5Title: "مبادئ التعلم الآلي",
    course5Desc: "Instituto Mauá de Tecnologia | 2025 – 40 ساعة",
    course6Title: "Ri Happy - الواجهة الأمامية من الصفر",
    course6Desc: "DIO | 2025 – 75 ساعة",
    course7Title: "Power BI الأساسي",
    course7Desc: "Instituto Mauá de Tecnologia | 2024 – 40 ساعة",
    course8Title: "مقدمة في الأتمتة والإلكترونيات الأساسية",
    course8Desc: "Instituto Mauá de Tecnologia | 2024 – 40 ساعة",
    course9Title: "مقدمة في علم البيانات",
    course9Desc: "Instituto Mauá de Tecnologia | 2023 – 40 ساعة",
    course10Title: "بناء الرسوم البيانية وتحليل البيانات في Excel",
    course10Desc: "Instituto Mauá de Tecnologia | 2023 – 40 ساعة",
    course11Title: "الإنجليزية",
    course11Desc: "Cultura Inglesa | 2022 – حالياً",
    course12Title: "مقدمة في الاختراق واختبار الاختراق 2.0",
    course12Desc: "Solyd Offensive Security | 2025",
    viewCertificate: "عرض الشهادة",
    currentlyTaking: "قيد الدراسة",
    course13Title: "فن الرش",
    course13Desc: "Instituto Mauá de Tecnologia | 2024 – 40 ساعة",
    course14Title: "التخطيط المالي الشخصي",
    course14Desc: "Instituto Mauá de Tecnologia | 2024 – 40 ساعة",
    course15Title: "الطلاب الجدد",
    course15Desc: "Instituto Mauá de Tecnologia | 2023 – 40 ساعة",
    course16Title: "GeoGebra",
    course16Desc: "Instituto Mauá de Tecnologia | 2023 – 40 ساعة",
    course17Title: "الغمر في تطوير وكلاء الذكاء الاصطناعي",
    course17Desc: "Alura & Google | 2025 – 4 ساعة",
    languageProficiency: "الإنكليزية: متوسط/متقدم | البرتغالية: أصلي",
    interestPC: "تجميع وصيانة الكمبيوتر",
    interestML: "التعلم الآلي",
    interestCloud: "دراسة الحوسبة السحابية (AWS, Azure)",
    interestPerf: "اختبار أداء النظام",
    interestSudoku: "سودوكو",
    interestCards: "ألعاب الورق الاستراتيجية",
    interestEnigmas: "ألعاب الألغاز",
    projectFeature1: "صفحة تسجيل الدخول؛",
    projectFeature2: "قاعدة بيانات MySQL تخزن معلومات الحسابات؛",
    projectFeature3: "عمليات السحب.",
    project2Title: "حاسبة الأحكام الجنائية",
    project2Desc: "تطبيق أندرويد تم تطويره كفريق لـ Advocacia Céspedes Lourenço، يركز على حسابات سريعة وعملية لتقدم الأحكام الجنائية.",
    project2Feature1: "حساب العقوبة بناءً على النظام ونوع الجريمة والإعفاء؛",
    project2Feature2: "دعم متعدد اللغات (البرتغالية، الإنجليزية، الإسبانية)؛",
    project2Feature3: "إرسال النتائج عبر واتساب أو البريد الإلكتروني.",
    project3Title: "بنك CVetti - السيرفر",
    project3Desc: "مشروع جماعي في مادة لغات البرمجة: بنك رقمي بهندسة خادم-عميل باستخدام WebSocket، تم تطويره واستضافته على GitHub Codespace.",
    project3Feature1: "اتصال في الوقت الحقيقي عبر WebSocket؛",
    project3Feature2: "تطبيق عميل بواجهة JavaFX؛",
    project3Feature3: "خادم مستضاف على GitHub Codespace.",
    repository: "المستودع",
    acadDetail1: "لقاءات أسبوعية لتعلم أساسيات لغة Kotlin؛",
    acadDetail2: "زيارة ممثل الشركة لعرض الفكرة ومتطلبات التطبيق؛",
    acadDetail3: "تسليمات جزئية خلال الفصول الدراسية، مع ضمان التقدم المستمر في إتقان اللغة؛",
    acadDetail4: "التسليم النهائي: تقديم التطبيق المكتمل للشركة الشريكة.",
    skillBasic: "أساسي",
    skillIntermediate: "متوسط",
    skillAdvanced: "متقدم",
    skillOffice: "حزمة أوفيس",
    skillAITools: "أدوات الذكاء الاصطناعي",
    skillDatabase: "قاعدة البيانات",
    skillTools: "أدوات",
    skillData: "بيانات",
    skillOthers: "أخرى"
  }
};

languageSelect.addEventListener("change", (e) => {
  const lang = e.target.value;
  const t = translations[lang];

  // Update Navigation (Desktop)
  const desktopNavLinks = document.querySelectorAll(".menu--principal .menu__text");
  if (desktopNavLinks.length >= 4) {
    desktopNavLinks[0].textContent = t.navHome;
    desktopNavLinks[1].textContent = t.navProjects;
    desktopNavLinks[2].textContent = t.navAbout;
    desktopNavLinks[3].textContent = t.navContact;
  }

  // Update Navigation (Mobile)
  const mobileNavLinks = document.querySelectorAll(".menu--mobile .menu__text");
  if (mobileNavLinks.length >= 4) {
    mobileNavLinks[0].textContent = t.navHome;
    mobileNavLinks[1].textContent = t.navProjects;
    mobileNavLinks[2].textContent = t.navAbout;
    mobileNavLinks[3].textContent = t.navContact;
  }

  // Update content
  document.querySelector(".home__text h1").innerHTML = t.welcome;
  const homeParagraphs = document.querySelectorAll(".home__text p");
  if (homeParagraphs.length >= 3) {
    homeParagraphs[0].textContent = t.bio1;
    homeParagraphs[1].textContent = t.bio2;
    homeParagraphs[2].textContent = t.bio3;
  }

  const viewProjectsBtns = document.querySelectorAll(".home__text .btn span");
  if (viewProjectsBtns.length > 0) viewProjectsBtns[0].textContent = t.viewProjects;

  document.querySelector(".technologies h2").textContent = t.learning;

  const projectSection = document.querySelector("#projetos h2");
  if (projectSection) projectSection.textContent = t.projectSectionTitle;

  const cardTitle = document.querySelector(".card__title");
  if (cardTitle) cardTitle.textContent = t.projectTitle;

  const cardDesc = document.querySelector(".card__description");
  if (cardDesc) cardDesc.textContent = t.projectDesc;

  const viewAllBtn = document.querySelector(".projects__container > a .btn span");
  if (viewAllBtn) viewAllBtn.textContent = t.viewAll;

  // Project card feature list
  const cardItems = document.querySelectorAll(".card__item");
  if (cardItems.length >= 3) {
    cardItems[0].textContent = t.projectFeature1;
    cardItems[1].textContent = t.projectFeature2;
    cardItems[2].textContent = t.projectFeature3;
  }

  // Repository buttons (all cards)
  const repoBtns = document.querySelectorAll(".card__buttons .btn--primary span");
  repoBtns.forEach(btn => btn.textContent = t.repository);

  // Calculadora Penal project card
  const calcTitle = document.querySelector(".card__title--calc");
  if (calcTitle) calcTitle.textContent = t.project2Title;

  const calcDesc = document.querySelector(".card__description--calc");
  if (calcDesc) calcDesc.textContent = t.project2Desc;

  const calcItems = document.querySelectorAll(".card__item--calc1, .card__item--calc2, .card__item--calc3");
  if (calcItems.length >= 3) {
    calcItems[0].textContent = t.project2Feature1;
    calcItems[1].textContent = t.project2Feature2;
    calcItems[2].textContent = t.project2Feature3;
  }

  // Banco CVetti project card
  const bankTitle = document.querySelector(".card__title--bank");
  if (bankTitle) bankTitle.textContent = t.project3Title;

  const bankDesc = document.querySelector(".card__description--bank");
  if (bankDesc) bankDesc.textContent = t.project3Desc;

  const bankItems = document.querySelectorAll(".card__item--bank1, .card__item--bank2, .card__item--bank3");
  if (bankItems.length >= 3) {
    bankItems[0].textContent = t.project3Feature1;
    bankItems[1].textContent = t.project3Feature2;
    bankItems[2].textContent = t.project3Feature3;
  }

  // About Section
  const aboutMeTitle = document.querySelector("#sobre h2");
  if (aboutMeTitle) aboutMeTitle.textContent = t.aboutMe;

  const aboutBio = document.querySelector(".about__description p");
  if (aboutBio) aboutBio.textContent = t.aboutBio;

  const aboutBtns = document.querySelectorAll(".description__buttons .btn span");
  if (aboutBtns.length >= 2) {
    aboutBtns[0].textContent = t.connect;
    aboutBtns[1].textContent = t.resume;
  }

  // Language Proficiency text (below bio)
  const langProfSpan = document.querySelector(".about__description .about__icons span");
  if (langProfSpan) langProfSpan.textContent = t.languageProficiency;

  // Headings in About Columns
  const headings = document.querySelectorAll(".about__card h3");
  // Simple heuristic mapping based on order or content
  headings.forEach(h => {
    const text = h.textContent.toLowerCase();
    if (text.includes("formação") || text.includes("education") || text.includes("formación") || text.includes("formation") || text.includes("教育") || text.includes("शिक्षा") || text.includes("التعليم")) {
      h.textContent = t.formation;
      const card = h.closest(".about__card");
      if (card) {
        const h4 = card.querySelector("h4");
        if (h4) h4.textContent = t.degreeName;
        const span = card.querySelector("span");
        if (span) span.textContent = t.degreeDate;
      }
    }
    else if (text.includes("experiências") || text.includes("experiences") || text.includes("experiencias") || text.includes("expériences") || text.includes("经验") || text.includes("अनुभव") || text.includes("الخبرات")) {
      h.textContent = t.experiences;
      const card = h.closest(".about__card");
      if (card) {
        const h4 = card.querySelector("h4");
        if (h4) h4.textContent = t.expJobTitle;
        const span = card.querySelector("span");
        if (span) span.textContent = t.expDate;
        const p = card.querySelector("p");
        if (p) p.textContent = t.expCompany;
        const listItems = card.querySelectorAll(".about__item");
        if (listItems.length >= 4) {
          listItems[0].textContent = t.expDetail1;
          listItems[1].textContent = t.expDetail2;
          listItems[2].textContent = t.expDetail3;
          listItems[3].textContent = t.expDetail4;
        }
        const overlaySpan = card.querySelector(".preview__overlay span");
        if (overlaySpan) overlaySpan.textContent = t.accessSite;
      }
    }
    else if (text.includes("projetos acadêmicos") || text.includes("academic projects") || text.includes("proyectos académicos") || text.includes("projets académiques") || text.includes("学术项目") || text.includes("अकादमिक परियोजनाएं") || text.includes("المشاريع الأكاديمية")) {
      h.textContent = t.academicProjects;
      const card = h.closest(".about__card");
      if (card) {
        const h4 = card.querySelector("h4");
        if (h4) h4.textContent = t.acadProjectTitle;
        const span = card.querySelector("span");
        if (span) span.textContent = t.acadProjectDate;
        // Update description paragraph
        const descP = card.querySelector("p");
        if (descP) descP.textContent = t.acadProjectDesc;
        // Update detail list items
        const listItems = card.querySelectorAll(".about__item");
        if (listItems.length >= 4) {
          listItems[0].textContent = t.acadDetail1;
          listItems[1].textContent = t.acadDetail2;
          listItems[2].textContent = t.acadDetail3;
          listItems[3].textContent = t.acadDetail4;
        }
      }
    }
    else if (text.includes("cursos") || text.includes("courses") || text.includes("cours") || text.includes("课程") || text.includes("पाठ्यक्रम") || text.includes("الدورات")) {
      h.textContent = t.courses;
      // Courses are in accordion items - update all 17
      const accordionItems = document.querySelectorAll(".accordion__item");
      const courseKeys = [
        'course11',
        'course17', 'course1', 'course2', 'course3', 'course4', 'course5', 'course6', 'course12',
        'course7', 'course8', 'course13', 'course14',
        'course9', 'course10', 'course15', 'course16'
      ];
      // Update year labels
      const yearLabels = document.querySelectorAll(".accordion__year");
      if (yearLabels[0] && t.currentlyTaking) yearLabels[0].textContent = t.currentlyTaking;
      courseKeys.forEach((key, i) => {
        if (accordionItems[i]) {
          const headerSpan = accordionItems[i].querySelector(".accordion__header span");
          if (headerSpan) headerSpan.textContent = t[key + 'Title'];
          const bodyP = accordionItems[i].querySelector(".accordion__body p");
          if (bodyP) bodyP.textContent = t[key + 'Desc'];
          const certLink = accordionItems[i].querySelector(".certificate__link span");
          if (certLink && t.viewCertificate) certLink.textContent = t.viewCertificate;
        }
      });
    }
    else if (text.includes("conhecimentos") || text.includes("skills") || text.includes("tech") || text.includes("conocimientos") || text.includes("compétences") || text.includes("技术") || text.includes("तकनीकी") || text.includes("المهارات")) {
      h.textContent = t.techSkills;
      // Update skill tags - translate level words and special names
      const skillTags = document.querySelectorAll(".skill__tag");
      skillTags.forEach(tag => {
        let txt = tag.textContent;
        // Replace level words
        txt = txt.replace(/Básico|Basic|Basique|基础|बुनियादी|أساسي/g, t.skillBasic);
        txt = txt.replace(/Intermediário|Intermediate|Intermedio|Intermédiaire|中级|मध्यवर्ती|متوسط/g, t.skillIntermediate);
        txt = txt.replace(/Avançado|Advanced|Avanzado|Avancé|高级|उन्नत|متقدم/g, t.skillAdvanced);
        // Replace special tool names
        txt = txt.replace(/Pacote Office|Office Suite|Paquete Office|Suite Office|Office 套件|ऑफिस सूट|حزمة أوفيس/g, t.skillOffice);
        txt = txt.replace(/Ferramentas de IA|AI Tools|Herramientas de IA|Outils d'IA|AI 工具|AI उपकरण|أدوات الذكاء الاصطناعي/g, t.skillAITools);

        // Replace Categories at the start of tags
        txt = txt.replace(/^(Banco de Dados|Database|Base de Datos|Base de Données|数据库|डेटाबेस|قاعدة البيانات):/, t.skillDatabase + ":");
        txt = txt.replace(/^(Ferramentas|Tools|Herramientas|Outils|工具|उपकरण|أدوات):/, t.skillTools + ":");
        txt = txt.replace(/^(Dados|Data|Datos|Données|数据|डेटा|بيانات):/, t.skillData + ":");
        txt = txt.replace(/^(Outros|Others|Otros|Autres|其他|अन्य|أخرى):/, t.skillOthers + ":");

        if (t.skillAITools && !t.skillAITools.toLowerCase().includes("ia")) {
          txt = txt.replace(/\bIA \(/g, "AI (");
        } else {
          txt = txt.replace(/\bAI \(/g, "IA (");
        }

        tag.textContent = txt;
      });
    }
    else if (text.includes("interesses") || text.includes("interests") || text.includes("intereses") || text.includes("intérêts") || text.includes("兴趣") || text.includes("रुचियां") || text.includes("الاهتمامات")) {
      h.textContent = t.interests;
      // Update interest items
      const listItems = h.nextElementSibling.querySelectorAll("li");
      if (listItems.length >= 7) {
        // Assuming order is preserved
        // We need to keep the icon <i> and just change the text node
        const updateText = (li, newText) => {
          const icon = li.querySelector("i");
          li.innerHTML = ""; // Clear
          if (icon) li.appendChild(icon); // Re-add icon
          li.appendChild(document.createTextNode(" " + newText));
        };
        updateText(listItems[0], t.interestPC);
        updateText(listItems[1], t.interestML);
        updateText(listItems[2], t.interestCloud);
        updateText(listItems[3], t.interestPerf);
        updateText(listItems[4], t.interestSudoku);
        updateText(listItems[5], t.interestCards);
        updateText(listItems[6], t.interestEnigmas);
      }
    }
  });

  const contactTitle = document.querySelector("#contato h2");
  if (contactTitle) contactTitle.textContent = t.contact;

  const contactDesc = document.querySelector("#contato p");
  if (contactDesc) contactDesc.textContent = t.contactDesc;

  // Footer
  const footerP = document.querySelector("footer p");
  if (footerP) {
    const link = footerP.querySelector("a");
    // Preserve the link
    footerP.childNodes[0].textContent = t.footerText + " ";
  }

  // Footer AI note
  const footerAI = document.querySelector(".footer__ai");
  if (footerAI) footerAI.textContent = t.footerAI;
});