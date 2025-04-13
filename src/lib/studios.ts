import { StaticImageData } from 'next/image'
import stu1 from '../../public/Studio 1/1.jpg'
import stu2 from '../../public/Studio 2/1.jpg'
import stu3 from '../../public/Studio 3/1.jpg'
import stu4 from '../../public/Studio 3/1.jpg'

export interface Studio {
    id: string
    name: string
    dbId: string
    videoUrl: string
    imagesUrl: string[]
    equipment: string[]
    description: string[]
    image: StaticImageData
  }
  
  export const studios: Studio[] = [
      {
        id: "1",
        dbId:"a9xgk7yq34mnp0z2vwsdl5btc",
        name: "Studio 1",
        videoUrl: "/Studio1.mp4",
        imagesUrl: [
          "/Studio 1/1.jpg",
          "/Studio 1/2.jpg",
          "/Studio 1/3.jpg",
          "/Studio 1/4.jpg",
          "/Studio 1/5.jpg",
          "/Studio 1/6.jpg",
          "/Studio 1/7.jpg",
          "/Studio 1/8.jpg",
          "/Studio 1/9.jpg",
        ],
        equipment: [
          "Flea ELA 251 M",
          "Neve 1073 SPX",
          "Tubetech CL1b",
          "Warm Audio WA76",
          "Focal Twin6",
          "Apollo X8",
          "Native Instruments S88 MK3",
          "Fender Squier Bullet Stratocaster"
        ],
        description: [
          "Lo studio di punta del complesso Cashmere.",
          "Grazie alla cabina di registrazione vetrata, alla strumentazione analogica di alta qualità e al microfono valvolare esclusivo, offre una qualità sonora pari a quella dei grandi studi americani.",
          "Perfetto per produzioni di alto livello che richiedono precisione e raffinatezza."
        ],
        image:
          stu1
        
      },
      {
        id: "2",
        dbId:"fj2m48xyn0vrkzqwtlcsd96bp",
        name: "Studio 2",
        videoUrl: "/Studio2.mp4",
        imagesUrl: [
          "/Studio 2/1.jpg",
          "/Studio 2/2.jpg",
          "/Studio 2/3.jpg",
          "/Studio 2/4.jpg",
          "/Studio 2/5.jpg",
        ],
        equipment: [
          "Flea ELA 251 M",
          "Neve 1073 SPX",
          "Tubetech CL1b",
          "Warm Audio WA76",
          "Focal Twin6",
          "Apollo X8",
          "Native Instruments S88 MK3",
          "Fender Squier Bullet Stratocaster"
        ],
        description: [
          "Studio che unisce la rapidità dei workflow moderni con la qualità della strumentazione analogica.Garantisce registrazioni di massima qualità. Ideale per artisti e produttori che cercano efficienza senza compromessi sulla qualità sonora."
        ],
        image:
          stu2
        
      },
      {
        id: "3",
        dbId:"z7wqktx3y0m24vn9slcbdg5rp",
        name: "Studio 3",
        videoUrl: "/Studio3.mp4",
        imagesUrl: [
          "/Studio 3/1.jpg",
          "/Studio 3/2.jpg",
          "/Studio 3/3.jpg",
          "/Studio 3/4.jpg",
          "/Studio 3/5.jpg",
          "/Studio 3/6.jpg",
          "/Studio 3/7.jpg",
        ],
        equipment: [
          "Flea ELA 251 M",
          "Neve 1073 SPX",
          "Tubetech CL1b",
          "Warm Audio WA76",
          "Focal Twin6",
          "Apollo X8",
          "Native Instruments S88 MK3",
          "Fender Squier Bullet Stratocaster"
        ],
        description: [
          "Studio ideale per sessioni di beatmaking, scrittura e momenti creativi. L’ambiente intimo favorisce il massimo del focus, permettendo di catturare l’ispirazione e la creatività in un contesto concentrato. Perfetto per progetti che richiedono un’atmosfera raccolta e produttiva."
        ],
        image:
          stu3
        
      },
      {
        id: "4",
        dbId:"m3v9xtkq2wsn74yl0cbdg5prz",
        name: "Studio 4",
        videoUrl: "/Studio3.mp4",
        imagesUrl: [
          "/Studio 3/1.jpg",
          "/Studio 3/2.jpg",
          "/Studio 3/3.jpg",
          "/Studio 3/4.jpg",
          "/Studio 3/5.jpg",
          "/Studio 3/6.jpg",
          "/Studio 3/7.jpg",
        ],
        equipment: [
          "Flea ELA 251 M",
          "Neve 1073 SPX",
          "Tubetech CL1b",
          "Warm Audio WA76",
          "Focal Twin6",
          "Apollo X8",
          "Native Instruments S88 MK3",
          "Fender Squier Bullet Stratocaster"
        ],
        description: [
          "Studio ideale per sessioni di beatmaking, scrittura e momenti creativi. L’ambiente intimo favorisce il massimo del focus, permettendo di catturare l’ispirazione e la creatività in un contesto concentrato. Perfetto per progetti che richiedono un’atmosfera raccolta e produttiva."],
        image:
          stu4
        
      },
  ]
  