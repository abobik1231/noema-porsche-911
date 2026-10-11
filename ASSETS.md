# Источники моделей и фотографий

## Porsche 911 Targa 4S
- Файл: `public/models/porsche-911.glb`, извлечён из предоставленного пользователем `porsche-911.zip`.
- Автор: DisneyCars (https://sketchfab.com/supercarmodels).
- Название: 2021 Porsche 911 Targa 4S.
- Источник из metadata GLB: https://sketchfab.com/3d-models/2021-porsche-911-targa-4s-616ebc4356c74a3b8554c396eb3bd34c
- Лицензия из metadata: CC BY 4.0, https://creativecommons.org/licenses/by/4.0/
- Файл сохранён без изменения; интерфейс меняет базовый цвет материала PAINT_COLOR_4 во время просмотра.

## F6 Boxer Engine
- Файл: `public/models/f6-boxer-engine.glb`, копия предоставленного пользователем GLB.
- Автор: Scuderia Morello (https://sketchfab.com/scudmorello).
- Источник: https://sketchfab.com/3d-models/f6-boxer-engine-5700259eeb494b8f8a0b8f63486c59cc
- Лицензия из metadata: CC BY 4.0, https://creativecommons.org/licenses/by/4.0/
- Геометрия, материалы, надписи MORELLO и эмблема сохранены без изменений. Контрольная сумма копии совпадает с оригиналом.
- Это концептуальная работа для Spada F6, не штатный двигатель показанного Porsche. Указано рядом с моделью.

## Фотографии
Все активные фотографии: © Porsche AG, Porsche Newsroom, 911 Targa 4S Heritage Design Edition (2020).
Страница: https://newsroom.porsche.com/en/2020/products/porsche-exclusive-manufaktur-911-targa-heritage-design-edition-992-eighth-generation-21067.html
- `911-interior.jpg`: b-009_Interior_1.jpg, jcr:ccea0df3-c3ad-4866-9a99-2f5bc2c11021.
- `911-instruments.jpg`: b-011_Interior_Detail_1_Drehzahlmesser.jpg, jcr:db5f88ec-af23-4750-8364-8c2cbd1776da.
- `911-seat.jpg`: b-017_Interior_Detail_Sitz_Wappen.jpg, jcr:4d794471-b9fa-4eca-92ac-dd534bd3c61e.
- `911-wheel.jpg`: b-018_Detail_Felge.jpg, jcr:53702e6c-b0dc-4eaf-b719-cbf17ea8fa50.
Фотографии сохранены локально; Next.js создаёт оптимизированные размеры. Используются в независимом локальном дизайн-проекте; открытая лицензия не заявляется.

Факты о поколении 911 Targa: https://newsroom.porsche.com/en_US/products/porsche-911-targa-eighth-generation-20907.html

## Библиотеки
Model Viewer: Apache 2.0. Manrope Variable: SIL Open Font License.
Старые материалы Tesla, Nissan и Taycan больше не используются интерфейсом.

## Студийное освещение
`public/lighting/studio-small-09-1k.hdr`: Studio Small 09, Sergej Majboroda / Poly Haven, CC0.
https://polyhaven.com/a/studio_small_09
Загружается локально и применяется к автомобилю, двигателю и колесу. Тональное отображение ACES, экспозиция настроена отдельно для каждой модели.

## Колесо
`public/models/porsche-wheel.glb`: предоставленный пользователем `C:/Users/kiov7/Desktop/temp/Untitled.glb`.
Источник, указанный пользователем: https://sketchfab.com/3d-models/porsche-wheel-76b1e1e6466843cebf1810168a19659c
Сохранены геометрия, текстуры и материалы. Заменён только трансформ презентации сцены Blender: колесо выровнено, лицевая сторона направлена вдоль +Z. Обзор ограничен азимутом -65°…65° и высотой 65°…95°, задняя часть недоступна.
