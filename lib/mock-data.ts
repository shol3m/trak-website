export type MockProduct = {
  id: string
  name: string
  brand: 'VAZ' | 'GAZ' | 'UAZ' | 'KAMAZ'
  category: string
  price: number
  stock: number
  images: string[]
  description: string
  article: string
}

export type MockReview = {
  id: string
  name: string
  text: string
  rating: number
  createdAt: string
}

export const mockProducts: MockProduct[] = [
  {
    id: '1',
    name: 'Масло моторное Лукойл 10W-40 4л',
    brand: 'VAZ',
    category: 'Масла и жидкости',
    price: 1890,
    stock: 45,
    images: ['/images/products/oil-1.jpg'],
    description: 'Полусинтетическое моторное масло для легковых автомобилей',
    article: 'OIL-10W40-4L',
  },
  {
    id: '2',
    name: 'Аккумулятор Varta 60Ah',
    brand: 'VAZ',
    category: 'Аккумуляторы',
    price: 6500,
    stock: 12,
    images: ['/images/products/battery-1.jpg'],
    description: 'Стартерный аккумулятор 60Ач, обратная полярность',
    article: 'BAT-VARTA-60',
  },
  {
    id: '3',
    name: 'Фильтр масляный ВАЗ 2101-2107',
    brand: 'VAZ',
    category: 'Фильтры',
    price: 180,
    stock: 200,
    images: ['/images/products/filter-1.jpg'],
    description: 'Фильтр масляный для классических моделей ВАЗ',
    article: 'FIL-OIL-VAZ-01',
  },
  {
    id: '4',
    name: 'Тормозные колодки ВАЗ 2110 передние',
    brand: 'VAZ',
    category: 'Тормозная система',
    price: 650,
    stock: 30,
    images: ['/images/products/brakes-1.jpg'],
    description: 'Комплект передних тормозных колодок',
    article: 'BRK-PAD-2110-F',
  },
  {
    id: '5',
    name: 'Двигатель ЗМЗ-402 ГАЗель',
    brand: 'GAZ',
    category: 'Двигатели',
    price: 85000,
    stock: 3,
    images: ['/images/products/engine-1.jpg'],
    description: 'Контрактный двигатель ЗМЗ-402 для ГАЗель, после капремонта',
    article: 'ENG-ZMZ-402',
  },
  {
    id: '6',
    name: 'Сцепление ГАЗель Next комплект',
    brand: 'GAZ',
    category: 'Трансмиссия',
    price: 4200,
    stock: 8,
    images: ['/images/products/clutch-1.jpg'],
    description: 'Комплект сцепления (диск+корзина+выжимной) для ГАЗель Next',
    article: 'CLT-GAZ-NEXT',
  },
  {
    id: '7',
    name: 'Амортизатор передний ГАЗель',
    brand: 'GAZ',
    category: 'Подвеска',
    price: 2100,
    stock: 16,
    images: ['/images/products/shock-1.jpg'],
    description: 'Амортизатор передний масляный для ГАЗель 3302',
    article: 'SHK-GAZ-3302-F',
  },
  {
    id: '8',
    name: 'Свечи зажигания УАЗ комплект 4шт',
    brand: 'UAZ',
    category: 'Система зажигания',
    price: 480,
    stock: 55,
    images: ['/images/products/spark-1.jpg'],
    description: 'Комплект свечей зажигания для УАЗ (двигатель УМЗ-417)',
    article: 'SPK-UAZ-417-4',
  },
  {
    id: '9',
    name: 'Карданный вал УАЗ Патриот задний',
    brand: 'UAZ',
    category: 'Трансмиссия',
    price: 8900,
    stock: 5,
    images: ['/images/products/driveshaft-1.jpg'],
    description: 'Карданный вал заднего моста для УАЗ Патриот',
    article: 'DRV-UAZ-PAT-R',
  },
  {
    id: '10',
    name: 'Рулевые тяги УАЗ 452 комплект',
    brand: 'UAZ',
    category: 'Рулевое управление',
    price: 3200,
    stock: 9,
    images: ['/images/products/steering-1.jpg'],
    description: 'Комплект рулевых тяг для УАЗ 452 (Буханка)',
    article: 'STR-UAZ-452',
  },
  {
    id: '11',
    name: 'Турбокомпрессор КАМАЗ 740',
    brand: 'KAMAZ',
    category: 'Двигатели',
    price: 32000,
    stock: 2,
    images: ['/images/products/turbo-1.jpg'],
    description: 'Турбокомпрессор для двигателя КАМАЗ-740 (после ремонта)',
    article: 'TRB-KAM-740',
  },
  {
    id: '12',
    name: 'Тормозные колодки КАМАЗ задние',
    brand: 'KAMAZ',
    category: 'Тормозная система',
    price: 1800,
    stock: 24,
    images: ['/images/products/brakes-2.jpg'],
    description: 'Колодки тормозные задние для КАМАЗ 5320',
    article: 'BRK-PAD-KAM-R',
  },
]

export type MockCategory = {
  id: string
  name: string
  slug: string
  icon: string
  count: number
}

export type MockService = {
  id: string
  name: string
  description: string
  duration: string
  price: string
  icon: string
  group: 'ТО и масла' | 'Диагностика' | 'Ходовая' | 'Двигатель' | 'Электрика'
}

export type FeaturedProduct = {
  id: string
  name: string
  article: string
  price: number
  stock: number
  imageUrl?: string
}

export const mockCategories: MockCategory[] = [
  { id: '1', name: 'Для двигателя', slug: 'dvigateli', icon: '⚙️', count: 1240 },
  { id: '2', name: 'Фильтры и расходники', slug: 'filtry', icon: '🔧', count: 890 },
  { id: '3', name: 'Для тормозной системы', slug: 'tormoznaya-sistema', icon: '🛑', count: 650 },
  { id: '4', name: 'Для подвески', slug: 'podveska', icon: '🚗', count: 980 },
  { id: '5', name: 'Масла и жидкости', slug: 'masla-i-zhidkosti', icon: '🛢️', count: 420 },
  { id: '6', name: 'Для трансмиссии', slug: 'transmissiya', icon: '⚡', count: 570 },
]

export const mockServices: MockService[] = [
  {
    id: '1',
    name: 'Замена масла и фильтров',
    description: 'Полная замена моторного масла и всех фильтров',
    duration: '30 мин',
    price: 'от 500 ₽',
    icon: '🛢️',
    group: 'ТО и масла',
  },
  {
    id: '2',
    name: 'ТО-1',
    description: 'Регламентное техобслуживание по пробегу 15 000 км',
    duration: '1-2 часа',
    price: 'от 1 500 ₽',
    icon: '📋',
    group: 'ТО и масла',
  },
  {
    id: '3',
    name: 'ТО-2',
    description: 'Расширенное ТО по пробегу 30 000 км',
    duration: '2-3 часа',
    price: 'от 2 500 ₽',
    icon: '📋',
    group: 'ТО и масла',
  },
  {
    id: '4',
    name: 'Промывка системы охлаждения',
    description: 'Полная промывка и замена охлаждающей жидкости',
    duration: '45 мин',
    price: 'от 800 ₽',
    icon: '💧',
    group: 'ТО и масла',
  },
  {
    id: '5',
    name: 'Компьютерная диагностика',
    description: 'Диагностика всех электронных систем автомобиля',
    duration: '45 мин',
    price: 'от 800 ₽',
    icon: '💻',
    group: 'Диагностика',
  },
  {
    id: '6',
    name: 'Диагностика ходовой',
    description: 'Осмотр и дефектовка элементов подвески и рулевого управления',
    duration: '30 мин',
    price: 'от 500 ₽',
    icon: '🔍',
    group: 'Диагностика',
  },
  {
    id: '7',
    name: 'Диагностика электрики',
    description: 'Поиск неисправностей в электросистеме, проверка цепей',
    duration: '1 час',
    price: 'от 1 200 ₽',
    icon: '⚡',
    group: 'Диагностика',
  },
  {
    id: '8',
    name: '3D развал-схождение',
    description: 'Компьютерная регулировка углов установки колёс',
    duration: '1 час',
    price: 'от 2 000 ₽',
    icon: '🎯',
    group: 'Ходовая',
  },
  {
    id: '9',
    name: 'Замена амортизаторов',
    description: 'Замена передних или задних амортизаторов с регулировкой',
    duration: '1-2 часа',
    price: 'от 1 000 ₽',
    icon: '🔧',
    group: 'Ходовая',
  },
  {
    id: '10',
    name: 'Замена тормозных колодок',
    description: 'Замена колодок передней и/или задней оси с проверкой дисков',
    duration: '45 мин',
    price: 'от 600 ₽',
    icon: '🛑',
    group: 'Ходовая',
  },
  {
    id: '11',
    name: 'Замена ступичных подшипников',
    description: 'Замена подшипников ступицы переднего или заднего колеса',
    duration: '1.5 часа',
    price: 'от 1 500 ₽',
    icon: '⚙️',
    group: 'Ходовая',
  },
  {
    id: '12',
    name: 'Ремонт двигателя',
    description: 'Диагностика и ремонт неисправностей двигателя любой сложности',
    duration: 'по договорённости',
    price: 'от 5 000 ₽',
    icon: '🔩',
    group: 'Двигатель',
  },
  {
    id: '13',
    name: 'Замена ГРМ',
    description: 'Замена ремня/цепи газораспределительного механизма с роликами',
    duration: '2-3 часа',
    price: 'от 2 000 ₽',
    icon: '⚙️',
    group: 'Двигатель',
  },
  {
    id: '14',
    name: 'Замена сцепления',
    description: 'Замена комплекта сцепления (диск, корзина, выжимной подшипник)',
    duration: '3-4 часа',
    price: 'от 3 000 ₽',
    icon: '🔧',
    group: 'Двигатель',
  },
  {
    id: '15',
    name: 'Ремонт КПП',
    description: 'Диагностика и ремонт коробки переключения передач',
    duration: 'по договорённости',
    price: 'от 4 000 ₽',
    icon: '⚙️',
    group: 'Двигатель',
  },
  {
    id: '16',
    name: 'Ремонт генератора',
    description: 'Диагностика и ремонт генератора',
    duration: '1-3 часа',
    price: 'от 1 500 ₽',
    icon: '⚡',
    group: 'Электрика',
  },
  {
    id: '17',
    name: 'Ремонт стартера',
    description: 'Диагностика и ремонт стартера',
    duration: '1-2 часа',
    price: 'от 1 200 ₽',
    icon: '🔑',
    group: 'Электрика',
  },
]

export const featuredProducts: FeaturedProduct[] = [
  { id: '1', name: 'Масло моторное Лукойл 10W-40 4л', article: 'OIL-10W40-4L', price: 1890, stock: 45 },
  { id: '2', name: 'Аккумулятор Varta 60Ah', article: 'BAT-VARTA-60', price: 6500, stock: 12 },
  { id: '3', name: 'Фильтр масляный ВАЗ 2101-2107', article: 'FIL-OIL-VAZ-01', price: 180, stock: 0 },
  { id: '4', name: 'Амортизатор передний ГАЗель', article: 'SHK-GAZ-3302-F', price: 2100, stock: 0 },
]

export const mockModels: Record<MockProduct['brand'], string[]> = {
  GAZ: ['ГАЗель Next', 'ГАЗель Бизнес', 'ГАЗ 3302', 'ГАЗ 2705', 'ГАЗ 3110'],
  VAZ: ['ВАЗ 2101–2107 (Классика)', 'ВАЗ 2108–2115', 'Лада Приора', 'Лада Гранта', 'Лада Нива'],
  UAZ: ['УАЗ Патриот', 'УАЗ 452 (Буханка)', 'УАЗ 469 / Хантер', 'УАЗ 3151'],
  KAMAZ: ['КАМАЗ 5320', 'КАМАЗ 65115', 'КАМАЗ 43118', 'КАМАЗ 6520'],
}

export const mockReviews: MockReview[] = [
  {
    id: '1',
    name: 'Дмитрий Рыков',
    text: 'Заехал за запчастями на свой УАЗ Хантер: засвистел ремень генератора и подгулял натяжной ролик. Нашли сразу оба, показали различия по подшипнику и ресурсу. Взял ещё патрубок охлаждения, раз уж полез под капот. Подбор по VIN чёткий, ни одного лишнего артикула.',
    rating: 5,
    createdAt: '2025-03-12T11:00:00Z',
  },
  {
    id: '2',
    name: 'Алексей Дмитриев',
    text: 'У меня Нива после длительных поездок начала шуметь подвеска, особенно на кочках. Приехал сюда, сделали диагностику, заменили амортизаторы и сайлентблоки. Машина снова едет тихо, работа профессиональная. Никаких нареканий нет.',
    rating: 5,
    createdAt: '2025-02-20T14:30:00Z',
  },
  {
    id: '3',
    name: 'Марина Львовна',
    text: 'Хороший магазин, ассортимент богатый и разнообразный, квалифицированный персонал — всегда подскажут и помогут в подборе автозапчастей. Очень удобно, что у магазина есть свой сервис.',
    rating: 5,
    createdAt: '2025-01-08T10:00:00Z',
  },
  {
    id: '4',
    name: 'Мария Захарова',
    text: 'Хороший магазинчик, всегда всё в наличии, что мне нужно. Сотрудники приветливы.',
    rating: 5,
    createdAt: '2025-03-28T09:15:00Z',
  },
  {
    id: '5',
    name: 'Булат Загитов',
    text: 'Огромное спасибо коллективу автосервиса за качественную работу и внимательное отношение! Приезжал с проблемой в подвеске, быстро диагностировали и устранили неисправность. Цены адекватные, машина работает отлично. Однозначно рекомендую!',
    rating: 5,
    createdAt: '2025-04-10T16:45:00Z',
  },
]
