export type CatalogProduct = {
  id: string
  name: string
  article: string
  brand: string
  category: string
  categorySlug: string
  price: number
  stock: number
  images: string[]
  description: string
  externalId: string | null
}

export const PAGE_SIZE = 50

export const STATIC_CATEGORIES = [
  { id: '1', slug: 'dvigateli',          name: 'Для двигателя' },
  { id: '2', slug: 'filtry',             name: 'Фильтры и расходники' },
  { id: '3', slug: 'tormoznaya-sistema', name: 'Тормозная система' },
  { id: '4', slug: 'podveska',           name: 'Подвеска' },
  { id: '5', slug: 'masla-i-zhidkosti',  name: 'Масла и жидкости' },
  { id: '6', slug: 'transmissiya',       name: 'Трансмиссия' },
  { id: '7', slug: 'prochee',            name: 'Прочее' },
]

// Product.brandName — одно плоское поле в БД без разделения на "марка авто"
// и "бренд запчасти" (совместимость по авто не реализована, ProductCompatibility
// пустая). Полная ручная разметка топ-461 значений (100+ товаров каждое) —
// docs/brand-classification.tsv, 2026-08-03. Там же остаётся неразобранная
// "серая зона" (заводы-агрегатчики, региональные дистрибьюторы и т.п.) —
// такие значения фильтром/поиском доступны (?brand=X работает для любого
// brandName), просто не выводятся в списках ниже, пока не размечены.
//
// ВАЖНО при новой синхронизации из 1С: новые/неразмеченные значения brandName
// автоматически НЕ попадают ни в ALL_VEHICLE_MAKES, ни в ALL_PART_BRANDS —
// они просто не покажутся в этих списках (карточка товара по умолчанию
// подписывает такой бренд как "Бренд", см. VEHICLE_MAKE_BRANDS ниже — это
// безопасный дефолт, ничего не ломается). Раз в несколько синков стоит
// перезапустить аудит-запрос из docs/brand-classification.tsv (group by
// "brandName" having count(*) >= 100) и доразметить то, что не попало в
// текущий список.
export const ALL_VEHICLE_MAKES = [
  { label: 'КАМАЗ', dbBrand: 'KAMAZ' },
  { label: 'ВАЗ', dbBrand: 'LADA' },
  { label: 'ГАЗ', dbBrand: 'ГАЗ' },
  { label: 'УАЗ', dbBrand: 'UAZ' },
  { label: 'HYUNDAI/KIA/MOBIS', dbBrand: 'HYUNDAI/KIA/MOBIS' },
  { label: 'GENERAL MOTORS', dbBrand: 'GENERAL MOTORS' },
  { label: 'VAG', dbBrand: 'VAG' },
  { label: 'TOYOTA', dbBrand: 'TOYOTA' },
  { label: 'MTZ', dbBrand: 'MTZ' },
  { label: 'Ford', dbBrand: 'Ford' },
  { label: 'МАЗ', dbBrand: 'МАЗ' },
  { label: 'NISSAN', dbBrand: 'NISSAN' },
  { label: 'MERCEDES-BENZ', dbBrand: 'MERCEDES-BENZ' },
  { label: 'MITSUBISHI', dbBrand: 'MITSUBISHI' },
  { label: 'CHERY', dbBrand: 'CHERY' },
  { label: 'МТЗ', dbBrand: 'МТЗ' },
  { label: 'Renault', dbBrand: 'Renault' },
  { label: 'ПАЗ', dbBrand: 'ПАЗ' },
  { label: 'ЗИЛ', dbBrand: 'ЗИЛ' },
  { label: 'УРАЛАЗ', dbBrand: 'УРАЛАЗ' },
  { label: 'CITROEN/PEUGEOT', dbBrand: 'CITROEN/PEUGEOT' },
  { label: 'HONDA', dbBrand: 'HONDA' },
  { label: 'Foton', dbBrand: 'Foton' },
  { label: 'LIFAN', dbBrand: 'LIFAN' },
  { label: 'GREAT WALL', dbBrand: 'GREAT WALL' },
  { label: 'BMW', dbBrand: 'BMW' },
  { label: 'ММЗ', dbBrand: 'ММЗ' },
  { label: 'ЧТЗ', dbBrand: 'ЧТЗ' },
  { label: 'SSANG YONG', dbBrand: 'SSANG YONG' },
  { label: 'Suzuki', dbBrand: 'Suzuki' },
  { label: 'MAZDA', dbBrand: 'MAZDA' },
  { label: 'GEELY', dbBrand: 'GEELY' },
  { label: 'DAEWOO', dbBrand: 'DAEWOO' },
  { label: 'SUBARU', dbBrand: 'SUBARU' },
  { label: 'VOLVO', dbBrand: 'VOLVO' },
  { label: 'Урал', dbBrand: 'Урал' },
  { label: 'ЛиАЗ', dbBrand: 'ЛиАЗ' },
  { label: 'Русская механика', dbBrand: 'Русская механика' },
  { label: 'Daimler AG', dbBrand: 'Daimler AG' },
  { label: 'ALFA/FIAT/LANCIA', dbBrand: 'ALFA/FIAT/LANCIA' },
  { label: 'LAND ROVER', dbBrand: 'LAND ROVER' },
  { label: 'Нефаз', dbBrand: 'Нефаз' },
  { label: 'JAC', dbBrand: 'JAC' },
  { label: 'ХТЗ', dbBrand: 'ХТЗ' },
  { label: 'IVECO', dbBrand: 'IVECO' },
  { label: 'STELS', dbBrand: 'STELS' },
  { label: 'CHRYSLER', dbBrand: 'CHRYSLER' },
  { label: 'YAMAHA', dbBrand: 'YAMAHA' },
  { label: 'Амкодор', dbBrand: 'Амкодор' },
  { label: 'Shaanxi/Shacman', dbBrand: 'Shaanxi/Shacman' },
  { label: 'JCB', dbBrand: 'JCB' },
  { label: 'ВгТЗ', dbBrand: 'ВгТЗ' },
  { label: 'ISUZU', dbBrand: 'ISUZU' },
  { label: 'Valtra', dbBrand: 'Valtra' },
]

export const VEHICLE_MAKE_BRANDS = new Set(ALL_VEHICLE_MAKES.map((m) => m.dbBrand))

// Компактная витрина для главной (StatsBrandsRow) — топ-4 марки по числу товаров.
export const CAR_BRANDS = ALL_VEHICLE_MAKES.slice(0, 4)

export const ALL_PART_BRANDS = [
  { label: 'TRIALLI', dbBrand: 'TRIALLI' },
  { label: 'FEBEST', dbBrand: 'FEBEST' },
  { label: 'BOSCH', dbBrand: 'BOSCH' },
  { label: 'FENOX', dbBrand: 'FENOX' },
  { label: 'PATRON', dbBrand: 'PATRON' },
  { label: 'AIRLINE', dbBrand: 'AIRLINE' },
  { label: 'MASUMA', dbBrand: 'MASUMA' },
  { label: 'LYNXauto', dbBrand: 'LYNXauto' },
  { label: 'CTR', dbBrand: 'CTR' },
  { label: 'ZOMMER', dbBrand: 'ZOMMER' },
  { label: 'LUZAR', dbBrand: 'LUZAR' },
  { label: 'TRW', dbBrand: 'TRW' },
  { label: 'MANN', dbBrand: 'MANN' },
  { label: 'SANGSIN', dbBrand: 'SANGSIN' },
  { label: 'STARTVOLT', dbBrand: 'STARTVOLT' },
  { label: 'FEBI', dbBrand: 'FEBI' },
  { label: 'Stellox', dbBrand: 'Stellox' },
  { label: 'FILTRON', dbBrand: 'FILTRON' },
  { label: 'KAYABA', dbBrand: 'KAYABA' },
  { label: 'BIG FILTER', dbBrand: 'BIG FILTER' },
  { label: 'LECAR', dbBrand: 'LECAR' },
  { label: 'SAKURA', dbBrand: 'SAKURA' },
  { label: 'DELPHI', dbBrand: 'DELPHI' },
  { label: 'KORTEX', dbBrand: 'KORTEX' },
  { label: 'NGK', dbBrand: 'NGK' },
  { label: 'Kumho', dbBrand: 'Kumho' },
  { label: 'VETTLER', dbBrand: 'VETTLER' },
  { label: 'GATES', dbBrand: 'GATES' },
  { label: 'MANDO', dbBrand: 'MANDO' },
  { label: 'LEMFORDER', dbBrand: 'LEMFORDER' },
  { label: 'PIRELLI', dbBrand: 'PIRELLI' },
  { label: 'Elring', dbBrand: 'Elring' },
  { label: 'DAYCO', dbBrand: 'DAYCO' },
  { label: 'NTN-SNR', dbBrand: 'NTN-SNR' },
  { label: 'SACHS', dbBrand: 'SACHS' },
  { label: 'MEYLE', dbBrand: 'MEYLE' },
  { label: 'ABRO', dbBrand: 'ABRO' },
  { label: 'Fleetguard', dbBrand: 'Fleetguard' },
  { label: 'PARTS-MALL', dbBrand: 'PARTS-MALL' },
  { label: 'JP GROUP', dbBrand: 'JP GROUP' },
  { label: 'NORPLAST', dbBrand: 'NORPLAST' },
  { label: 'VICTOR REINZ', dbBrand: 'VICTOR REINZ' },
  { label: 'JAPANPARTS', dbBrand: 'JAPANPARTS' },
  { label: 'Krauf', dbBrand: 'Krauf' },
  { label: 'NIBK', dbBrand: 'NIBK' },
  { label: 'DENSO', dbBrand: 'DENSO' },
  { label: 'QUATTRO FRENI', dbBrand: 'QUATTRO FRENI' },
  { label: 'JS ASAKASHI', dbBrand: 'JS ASAKASHI' },
  { label: 'NIPPARTS', dbBrand: 'NIPPARTS' },
  { label: 'INA', dbBrand: 'INA' },
  { label: 'TYG', dbBrand: 'TYG' },
  { label: 'ERA', dbBrand: 'ERA' },
  { label: 'CORTECO', dbBrand: 'CORTECO' },
  { label: 'KNECHT', dbBrand: 'KNECHT' },
  { label: 'BREMBO', dbBrand: 'BREMBO' },
  { label: 'DEPO', dbBrand: 'DEPO' },
  { label: 'BLUEPRINT', dbBrand: 'BLUEPRINT' },
  { label: 'MAHLE', dbBrand: 'MAHLE' },
  { label: 'MONROE', dbBrand: 'MONROE' },
  { label: 'SKF', dbBrand: 'SKF' },
  { label: 'Zekkert', dbBrand: 'Zekkert' },
  { label: 'JONNESWAY', dbBrand: 'JONNESWAY' },
  { label: 'SWAG', dbBrand: 'SWAG' },
  { label: 'LESJOFORS', dbBrand: 'LESJOFORS' },
  { label: 'FAG', dbBrand: 'FAG' },
  { label: 'GMB', dbBrand: 'GMB' },
  { label: 'ASAM', dbBrand: 'ASAM' },
  { label: 'FINWHALE', dbBrand: 'FINWHALE' },
  { label: 'NTY', dbBrand: 'NTY' },
  { label: 'SORL', dbBrand: 'SORL' },
  { label: 'POLCAR', dbBrand: 'POLCAR' },
  { label: 'Роснефть', dbBrand: 'Роснефть' },
  { label: 'DONALDSON', dbBrand: 'DONALDSON' },
  { label: 'ZF', dbBrand: 'ZF' },
  { label: 'sampa', dbBrand: 'sampa' },
  { label: 'Valeo', dbBrand: 'Valeo' },
  { label: 'SASIC', dbBrand: 'SASIC' },
  { label: 'FRENKIT', dbBrand: 'FRENKIT' },
  { label: 'OPTIMAL', dbBrand: 'OPTIMAL' },
  { label: 'Cordiant', dbBrand: 'Cordiant' },
  { label: 'DIESEL TECHNIC', dbBrand: 'DIESEL TECHNIC' },
  { label: 'RUVILLE', dbBrand: 'RUVILLE' },
  { label: 'SIDEM', dbBrand: 'SIDEM' },
  { label: 'CONTITECH', dbBrand: 'CONTITECH' },
  { label: 'MAPCO', dbBrand: 'MAPCO' },
  { label: 'ATE', dbBrand: 'ATE' },
  { label: 'ДАЙДО МЕТАЛЛ РУСЬ', dbBrand: 'ДАЙДО МЕТАЛЛ РУСЬ' },
  { label: 'ACDELCO', dbBrand: 'ACDELCO' },
  { label: 'ONNURI', dbBrand: 'ONNURI' },
  { label: 'LUK', dbBrand: 'LUK' },
  { label: 'Tatsumi', dbBrand: 'Tatsumi' },
  { label: 'LAVR', dbBrand: 'LAVR' },
  { label: 'MOOG', dbBrand: 'MOOG' },
  { label: 'OSRAM', dbBrand: 'OSRAM' },
  { label: 'SCT', dbBrand: 'SCT' },
  { label: 'CHAMPION', dbBrand: 'CHAMPION' },
  { label: 'KOYO', dbBrand: 'KOYO' },
  { label: 'HELLA', dbBrand: 'HELLA' },
  { label: 'TEXTAR', dbBrand: 'TEXTAR' },
  { label: 'LIQUI MOLY', dbBrand: 'LIQUI MOLY' },
  { label: 'Remsa', dbBrand: 'Remsa' },
  { label: 'BOSAL', dbBrand: 'BOSAL' },
  { label: 'AUTOFREN', dbBrand: 'AUTOFREN' },
  { label: 'MAGNETI MARELLI', dbBrand: 'MAGNETI MARELLI' },
  { label: 'AJUSA', dbBrand: 'AJUSA' },
  { label: 'GSP', dbBrand: 'GSP' },
  { label: 'DANA', dbBrand: 'DANA' },
  { label: 'Areon', dbBrand: 'Areon' },
  { label: 'NORMA', dbBrand: 'NORMA' },
  { label: 'BILSTEIN', dbBrand: 'BILSTEIN' },
  { label: 'Philips', dbBrand: 'Philips' },
  { label: 'ZIMMERMANN', dbBrand: 'ZIMMERMANN' },
  { label: 'SS20', dbBrand: 'SS20' },
  { label: 'NARVA', dbBrand: 'NARVA' },
  { label: 'METALCAUCHO', dbBrand: 'METALCAUCHO' },
  { label: 'Mannol', dbBrand: 'Mannol' },
  { label: 'MTF', dbBrand: 'MTF' },
  { label: 'Trebl', dbBrand: 'Trebl' },
  { label: 'FRAM', dbBrand: 'FRAM' },
  { label: 'IDEMITSU', dbBrand: 'IDEMITSU' },
  { label: 'LUKOIL', dbBrand: 'LUKOIL' },
  { label: 'Skyway', dbBrand: 'Skyway' },
  { label: 'WABCO', dbBrand: 'WABCO' },
  { label: 'Gazpromneft', dbBrand: 'Gazpromneft' },
  { label: 'OSSCA', dbBrand: 'OSSCA' },
  { label: 'TEKNOROT', dbBrand: 'TEKNOROT' },
  { label: 'BGA', dbBrand: 'BGA' },
  { label: 'KLOKKERHOLM', dbBrand: 'KLOKKERHOLM' },
  { label: 'HanDe Axle', dbBrand: 'HanDe Axle' },
  { label: 'NISSENS', dbBrand: 'NISSENS' },
  { label: 'VERNET', dbBrand: 'VERNET' },
  { label: 'ILJIN', dbBrand: 'ILJIN' },
  { label: 'QUARTZ', dbBrand: 'QUARTZ' },
  { label: 'KLAKSON', dbBrand: 'KLAKSON' },
  { label: 'ASIN', dbBrand: 'ASIN' },
  { label: 'Motul', dbBrand: 'Motul' },
  { label: 'OMBRA', dbBrand: 'OMBRA' },
  { label: 'UFI', dbBrand: 'UFI' },
  { label: 'JTC', dbBrand: 'JTC' },
  { label: 'MEAT & DORIA', dbBrand: 'MEAT & DORIA' },
  { label: 'GRASS', dbBrand: 'GRASS' },
  { label: 'ASTROHIM', dbBrand: 'ASTROHIM' },
  { label: 'AKOM', dbBrand: 'AKOM' },
  { label: 'Rexant', dbBrand: 'Rexant' },
  { label: 'HI-GEAR', dbBrand: 'HI-GEAR' },
  { label: 'RAVENOL', dbBrand: 'RAVENOL' },
  { label: 'Totachi', dbBrand: 'Totachi' },
]

// Компактная витрина для главной (StatsBrandsRow) — топ-8 брендов по числу товаров.
export const PART_BRANDS = ALL_PART_BRANDS.slice(0, 8)

// 1С делит каталог по маркам, а не по типу детали — эти плитки/вкладки
// остаются тематическим быстрым доступом через поиск, а не ссылкой на категорию.
export const SEARCH_TERM: Record<string, string> = {
  dvigateli: 'двигатель',
  filtry: 'фильтр',
  'tormoznaya-sistema': 'тормоз',
  podveska: 'амортизатор',
  'masla-i-zhidkosti': 'масло',
  transmissiya: 'сцепление',
}

