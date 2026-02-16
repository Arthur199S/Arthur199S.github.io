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

// Image Modal Logic
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("img01");
const captionText = document.getElementById("caption");
const span = document.getElementsByClassName("close")[0];

// Get all images that should be zoomable
const zoomableImages = document.querySelectorAll(".home__avatar, .about__photo, .card__cover");

zoomableImages.forEach(img => {
  img.addEventListener("click", function () {
    modal.style.display = "block";
    modalImg.src = this.src;
    captionText.innerHTML = this.alt;
  });
});

// Close modal when clicking the X
span.onclick = function () { // Modified to add proper event binding
  modal.style.display = "none";
}

// Close modal when clicking outside the image
modal.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
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
    degreeName: "Engenharia da Computação",
    degreeDate: "Fev 2023 - Atualmente",
    experienceText: "Sem Experiências profissionais até o momento",
    acadProjectTitle: "Desenvolvimento de Aplicativos com a Linguagem Kotlin",
    acadProjectDate: "Ago 2025 - Nov 2025",
    acadProjectDesc: "Aplicativo de Lista de Tarefas (To-Do List) com armazenamento local (SharedPreferences).",
    course1Title: "Bootcamp Cloud AWS",
    course1Desc: "DIO | 2024 – 67 horas",
    course2Title: "Formação Lógica de Programação",
    course2Desc: "DIO | 2024 – 39 horas",
    course3Title: "Introdução a Ciência de Dados",
    course3Desc: "Instituto Mauá de Tecnologia | 2023 – 40 horas",
    course4Title: "Construção de Gráficos e Análise de Dados em Excel",
    course4Desc: "Instituto Mauá de Tecnologia | 2023 – 40 horas",
    course5Title: "Inglês",
    course5Desc: "Cultura Inglesa | 2022 – 2025",
    languageProficiency: "Inglês: Avançado | Português Brasileiro: Nativo",
    interestPC: "Montagem e manutenção de computadores",
    interestML: "Aprendizado de máquina",
    interestCloud: "Estudo de cloud computing (AWS, Azure)",
    interestPerf: "Testes de desempenho em sistemas",
    interestSudoku: "Sudoku",
    interestCards: "Jogos de cartas estratégicos",
    interestEnigmas: "Jogos de enigmas"
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
    degreeName: "Computer Engineering",
    degreeDate: "Feb 2023 - Present",
    experienceText: "No professional experience yet",
    acadProjectTitle: "App Development with Kotlin",
    acadProjectDate: "Aug 2025 - Nov 2025",
    acadProjectDesc: "To-Do List Application with local storage (SharedPreferences).",
    course1Title: "AWS Cloud Bootcamp",
    course1Desc: "DIO | 2024 – 67 hours",
    course2Title: "Programming Logic Formation",
    course2Desc: "DIO | 2024 – 39 hours",
    course3Title: "Introduction to Data Science",
    course3Desc: "Instituto Mauá de Tecnologia | 2023 – 40 hours",
    course4Title: "Graph Construction and Data Analysis in Excel",
    course4Desc: "Instituto Mauá de Tecnologia | 2023 – 40 hours",
    course5Title: "English",
    course5Desc: "Cultura Inglesa | 2022 – 2025",
    languageProficiency: "English: Advanced | Portuguese: Native",
    interestPC: "Computer Assembly and Maintenance",
    interestML: "Machine Learning",
    interestCloud: "Cloud Computing Study (AWS, Azure)",
    interestPerf: "System Performance Testing",
    interestSudoku: "Sudoku",
    interestCards: "Strategic Card Games",
    interestEnigmas: "Puzzle Games"
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
    degreeName: "Ingeniería Informática",
    degreeDate: "Feb 2023 - Actualidad",
    experienceText: "Sin experiencia profesional por el momento",
    acadProjectTitle: "Desarrollo de Aplicaciones con Kotlin",
    acadProjectDate: "Ago 2025 - Nov 2025",
    acadProjectDesc: "Aplicación de Lista de Tareas (To-Do List) con almacenamiento local (SharedPreferences).",
    course1Title: "Bootcamp Cloud AWS",
    course1Desc: "DIO | 2024 – 67 horas",
    course2Title: "Formación Lógica de Programación",
    course2Desc: "DIO | 2024 – 39 horas",
    course3Title: "Introducción a Ciencia de Datos",
    course3Desc: "Instituto Mauá de Tecnologia | 2023 – 40 horas",
    course4Title: "Construcción de Gráficos y Análisis de Datos en Excel",
    course4Desc: "Instituto Mauá de Tecnologia | 2023 – 40 horas",
    course5Title: "Inglés",
    course5Desc: "Cultura Inglesa | 2022 – 2025",
    languageProficiency: "Inglés: Avanzado | Portugués: Nativo",
    interestPC: "Montaje y Mantenimiento de Computadoras",
    interestML: "Aprendizaje Automático",
    interestCloud: "Estudio de Cloud Computing (AWS, Azure)",
    interestPerf: "Pruebas de Rendimiento de Sistemas",
    interestSudoku: "Sudoku",
    interestCards: "Juegos de Cartas Estratégicos",
    interestEnigmas: "Juegos de Enigmas"
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
    degreeName: "Ingénierie Informatique",
    degreeDate: "Fév 2023 - Présent",
    experienceText: "Aucune expérience professionnelle pour le moment",
    acadProjectTitle: "Développement d'App avec Kotlin",
    acadProjectDate: "Août 2025 - Nov 2025",
    acadProjectDesc: "Application To-Do List avec stockage local (SharedPreferences).",
    course1Title: "Bootcamp Cloud AWS",
    course1Desc: "DIO | 2024 – 67 heures",
    course2Title: "Formation Logique de Programmation",
    course2Desc: "DIO | 2024 – 39 heures",
    course3Title: "Introduction à la Science des Données",
    course3Desc: "Instituto Mauá de Tecnologia | 2023 – 40 heures",
    course4Title: "Construction de Graphiques et Analyse de Données sur Excel",
    course4Desc: "Instituto Mauá de Tecnologia | 2023 – 40 heures",
    course5Title: "Anglais",
    course5Desc: "Cultura Inglesa | 2022 – 2025",
    languageProficiency: "Anglais : Avancé | Portugais : Natif",
    interestPC: "Assemblage et Maintenance d'Ordinateurs",
    interestML: "Apprentissage Automatique",
    interestCloud: "Étude du Cloud Computing (AWS, Azure)",
    interestPerf: "Tests de Performance Système",
    interestSudoku: "Sudoku",
    interestCards: "Jeux de Cartes Stratégiques",
    interestEnigmas: "Jeux d'Énigmes"
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
    degreeName: "计算机工程",
    degreeDate: "2023年2月 - 至今",
    experienceText: "目前没有专业经验",
    acadProjectTitle: "使用Kotlin开发应用程序",
    acadProjectDate: "2025年8月 - 2025年11月",
    acadProjectDesc: "带有本地存储(SharedPreferences)的待办事项列表应用程序。",
    course1Title: "AWS Cloud Bootcamp",
    course1Desc: "DIO | 2024 – 67 小时",
    course2Title: "编程逻辑培训",
    course2Desc: "DIO | 2024 – 39 小时",
    course3Title: "数据科学导论",
    course3Desc: "Instituto Mauá de Tecnologia | 2023 – 40 小时",
    course4Title: "Excel中的图表构建和数据分析",
    course4Desc: "Instituto Mauá de Tecnologia | 2023 – 40 小时",
    course5Title: "英语",
    course5Desc: "Cultura Inglesa | 2022 – 2025",
    languageProficiency: "英语：高级 | 葡萄牙语：母语",
    interestPC: "电脑组装与维护",
    interestML: "机器学习",
    interestCloud: "云计算学习 (AWS, Azure)",
    interestPerf: "系统性能测试",
    interestSudoku: "数独",
    interestCards: "战略纸牌游戏",
    interestEnigmas: "谜题游戏"
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
    degreeName: "कंप्यूटर इंजीनियरिंग",
    degreeDate: "फरवरी 2023 - वर्तमान",
    experienceText: "अभी तक कोई पेशेवर अनुभव नहीं",
    acadProjectTitle: "कोटलिन के साथ ऐप विकास",
    acadProjectDate: "अगस्त 2025 - नवंबर 2025",
    acadProjectDesc: "स्थानीय भंडारण (SharedPreferences) के साथ टू-डू लिस्ट एप्लिकेशन।",
    course1Title: "AWS क्लाउड बूटकैंप",
    course1Desc: "DIO | 2024 – 67 घंटे",
    course2Title: "प्रोग्रामिंग लॉजिक फॉर्मेशन",
    course2Desc: "DIO | 2024 – 39 घंटे",
    course3Title: "डेटा साइंस का परिचय",
    course3Desc: "Instituto Mauá de Tecnologia | 2023 – 40 घंटे",
    course4Title: "एक्सेल में ग्राफ निर्माण और डेटा विश्लेषण",
    course4Desc: "Instituto Mauá de Tecnologia | 2023 – 40 घंटे",
    course5Title: "अंग्रेज़ी",
    course5Desc: "Cultura Inglesa | 2022 – 2025",
    languageProficiency: "अंग्रेजी: उन्नत | पुर्तगाली: मूल निवासी",
    interestPC: "कंप्यूटर असेंबली और रखरखाव",
    interestML: "मशीन लर्निंग",
    interestCloud: "क्लाउड कंप्यूटिंग अध्ययन (AWS, Azure)",
    interestPerf: "सिस्टम प्रदर्शन परीक्षण",
    interestSudoku: "सुडोकू",
    interestCards: "रणनीतिक कार्ड गेम",
    interestEnigmas: "पहेली खेल"
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
    degreeName: "هندسة الكمبيوتر",
    degreeDate: "فبراير 2023 - الآن",
    experienceText: "لا توجد خبرة مهنية حتى الآن",
    acadProjectTitle: "تطوير التطبيقات باستخدام Kotlin",
    acadProjectDate: "أغسطس 2025 - نوفمبر 2025",
    acadProjectDesc: "تطبيق قائمة المهام (To-Do List) مع التخزين المحلي (SharedPreferences).",
    course1Title: "معسكر AWS السحابي",
    course1Desc: "DIO | 2024 – 67 ساعة",
    course2Title: "تشكيل منطق البرمجة",
    course2Desc: "DIO | 2024 – 39 ساعة",
    course3Title: "مقدمة في علم البيانات",
    course3Desc: "Instituto Mauá de Tecnologia | 2023 – 40 ساعة",
    course4Title: "بناء الرسوم البيانية وتحليل البيانات في Excel",
    course4Desc: "Instituto Mauá de Tecnologia | 2023 – 40 ساعة",
    course5Title: "الإنجليزية",
    course5Desc: "Cultura Inglesa | 2022 – 2025",
    languageProficiency: "الإنكليزية: متقدم | البرتغالية: أصلي",
    interestPC: "تجميع وصيانة الكمبيوتر",
    interestML: "التعلم الآلي",
    interestCloud: "دراسة الحوسبة السحابية (AWS, Azure)",
    interestPerf: "اختبار أداء النظام",
    interestSudoku: "سودوكو",
    interestCards: "ألعاب الورق الاستراتيجية",
    interestEnigmas: "ألعاب الألغاز"

  }
};

languageSelect.addEventListener("change", (e) => {
  const lang = e.target.value;
  const t = translations[lang];

  // Update Navigation
  const navLinks = document.querySelectorAll(".menu__link span");
  if (navLinks.length >= 4) {
    navLinks[0].textContent = t.navHome;
    navLinks[1].textContent = t.navProjects;
    navLinks[2].textContent = t.navAbout;
    navLinks[3].textContent = t.navContact;
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

  // Headings in About Columns
  const headings = document.querySelectorAll(".about__card h3");
  // Simple heuristic mapping based on order or content
  headings.forEach(h => {
    const text = h.textContent.toLowerCase();
    if (text.includes("formação") || text.includes("education") || text.includes("formación") || text.includes("formation") || text.includes("教育") || text.includes("शिक्षा") || text.includes("التعليم")) {
      h.textContent = t.formation;
      // Update Formation Content (sibling div)
      const content = h.nextElementSibling;
      if (content) {
        content.querySelector("h4").textContent = t.degreeName;
        content.querySelector("span").textContent = t.degreeDate;
      }
    }
    else if (text.includes("experiências") || text.includes("sexperiences") || text.includes("expériences") || text.includes("经验") || text.includes("अनुभव") || text.includes("الخبرات")) {
      h.textContent = t.experiences;
      const content = h.nextElementSibling;
      if (content) content.querySelector("p").textContent = t.experienceText;
    }
    else if (text.includes("projetos acadêmicos") || text.includes("academic projects") || text.includes("proyectos académicos") || text.includes("projets académiques") || text.includes("学术项目") || text.includes("अकादमिक परियोजनाएं") || text.includes("المشاريع الأكاديمية")) {
      h.textContent = t.academicProjects;
      const content = h.nextElementSibling;
      if (content) {
        content.querySelector("h4").textContent = t.acadProjectTitle;
        content.querySelector("span").textContent = t.acadProjectDate;
        content.querySelector("li").textContent = t.acadProjectDesc;
      }
    }
    else if (text.includes("cursos") || text.includes("courses") || text.includes("cours") || text.includes("课程") || text.includes("पाठ्यक्रम") || text.includes("الدورات")) {
      h.textContent = t.courses;
      // Courses are in a separate column usually, let's find the accordion items
      const accordionItems = document.querySelectorAll(".accordion__item");
      if (accordionItems.length >= 5) {
        accordionItems[0].querySelector(".accordion__header").textContent = t.course1Title;
        accordionItems[0].querySelector(".accordion__content p").textContent = t.course1Desc;
        accordionItems[1].querySelector(".accordion__header").textContent = t.course2Title;
        accordionItems[1].querySelector(".accordion__content p").textContent = t.course2Desc;
        accordionItems[2].querySelector(".accordion__header").textContent = t.course3Title;
        accordionItems[2].querySelector(".accordion__content p").textContent = t.course3Desc;
        accordionItems[3].querySelector(".accordion__header").textContent = t.course4Title;
        accordionItems[3].querySelector(".accordion__content p").textContent = t.course4Desc;
        // Special handle for English course which has different structure (subtitle)
        accordionItems[4].querySelector(".accordion__header").textContent = t.course5Title;
        accordionItems[4].querySelector(".accordion__content p").textContent = t.course5Desc;
        // Language Proficiency
        const langProf = accordionItems[4].querySelector(".accordion__content p:last-child");
        if (langProf) langProf.textContent = t.languageProficiency;
      }
    }
    else if (text.includes("conhecimentos") || text.includes("skills") || text.includes("tech") || text.includes("conocimientos") || text.includes("compétences") || text.includes("技术") || text.includes("तकनीकी") || text.includes("المهارات")) h.textContent = t.techSkills;
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
});