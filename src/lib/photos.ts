// Photos used on the site, with the credit each license requires.
// Files live in public/images/photos/<key>-800.webp and <key>-1600.webp.
// All were colour-graded to the site palette (see docs/decisions.md), so they
// are marked "modified"; CC BY-SA derivatives stay under the same license.
import type { Lang } from '../i18n/utils';

export interface Photo {
  alt: Record<Lang, string>;
  author: string;
  license: string;
  licenseUrl?: string;
  source: string;
  place: string;
}

export const PHOTOS = {
  'hero-brahman-lipa': {
    alt: { en: 'A white Brahman cow standing by a road near Lipa, Batangas, with green hills behind', fil: 'Isang puting Brahman na nakatayo sa tabi ng daan malapit sa Lipa, Batangas, may berdeng bundok sa likod' },
    author: 'Fiszi37',
    license: 'CC0 1.0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Brahman_cattle_near_Lipa,_Batangas,_Philippines_(2025).jpg',
    place: 'Lipa, Batangas',
  },
  'farm-borongan': {
    alt: { en: 'A cow grazing on a small cattle farm among coconut trees', fil: 'Isang bakang nanginginain sa maliit na bakahan sa gitna ng mga niyog' },
    author: 'TheNuggeteer',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:A_cattle_farm_in_Borongan_City,_Eastern_Samar.jpg',
    place: 'Borongan City, Eastern Samar',
  },
  'cow-catanduanes': {
    alt: { en: 'A white cow resting on a grassy hill overlooking the sea', fil: 'Isang puting baka na nakahiga sa madamong burol na tanaw ang dagat' },
    author: 'Kris Fulgencio',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:A_cow_gazes_upon_the_scenery_at_Hiyop_Point,_Catanduanes.jpg',
    place: 'Hiyop Point, Catanduanes',
  },
  'brahman-taal': {
    alt: { en: 'Close-up of a Brahman-type cow with long drooping ears and a nose rope', fil: 'Malapitang kuha ng Brahman na baka na may mahahabang nakalaylay na tainga at lubid sa ilong' },
    author: 'André Oortgijs',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Cow_with_rope..Taal_Volcano,_Philippines_-_panoramio.jpg',
    place: 'Taal, Batangas',
  },
  'cow-bohol-tethered': {
    alt: { en: 'A white cow tethered to a coconut tree in tall grass', fil: 'Isang puting baka na nakatali sa puno ng niyog sa gitna ng mataas na damo' },
    author: 'Øyvind Holmstad',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:White_cow_baka_at_Bohol_2017.jpg',
    place: 'Bohol',
  },
  'farmers-rice-straw': {
    alt: { en: 'Two farmers spreading rice straw in a wet paddy field', fil: 'Dalawang magsasaka na nagkakalat ng dayami sa basang palayan' },
    author: 'IRRI Images',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Rice_farmers_at_work_in_the_Philippines.jpg',
    place: 'Laguna',
  },
  'brahman-drinking': {
    alt: { en: 'A grey Brahman bull drinking from a water trough', fil: 'Isang kulay-abong Brahman na toro na umiinom sa painuman' },
    author: 'Jim Bendon',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Brahman_bull_1_(15103719455).jpg',
    place: 'Western Australia',
  },
  'brahman-bulls-paddock': {
    alt: { en: 'A stockman standing among a group of Brahman bulls in a paddock', fil: 'Isang tagapag-alaga na nakatayo sa gitna ng grupo ng Brahman na toro sa pastulan' },
    author: 'Cgoodwin',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Brahman_bulls.jpg',
    place: 'Northern Territory, Australia',
  },
  'kabakahan-arch': {
    alt: { en: 'The Kabakahan Festival arch over a street in Padre Garcia, Batangas', fil: 'Ang arko ng Kabakahan Festival sa isang kalye sa Padre Garcia, Batangas' },
    author: 'Ralff Nestor Nacor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Kabakahan_Festival_2024_Arch,_Padre_Garcia,_Batangas,_Aug_2025.jpg',
    place: 'Padre Garcia, Batangas',
  },
  'farmer-bohol': {
    alt: { en: 'A farmer standing on a dike between green rice fields', fil: 'Isang magsasaka na nakatayo sa pilapil sa gitna ng berdeng palayan' },
    author: 'Øyvind Holmstad',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:A_farmer_woman_in_the_middle_of_her_rice_fields_in_Bohol_-_Philippines.jpg',
    place: 'Bohol',
  },
  'native-cow': {
    alt: { en: 'A reddish-brown Philippine native cow lying on grass', fil: 'Isang mapulang-kayumangging katutubong baka na nakahiga sa damo' },
    author: 'pinay06',
    license: 'CC BY 2.5',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.5/',
    source: 'https://commons.wikimedia.org/wiki/File:Baka_(Filipino_breed_of_cow)_resting_(2004).jpg',
    place: 'Philippines',
  },
  'brahman-grey-bull': {
    alt: { en: 'A grey Brahman bull with a large hump, standing in a pen', fil: 'Isang kulay-abong Brahman na toro na may malaking umbok, nakatayo sa kural' },
    author: 'CSIRO',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
    source: 'https://commons.wikimedia.org/wiki/File:CSIRO_ScienceImage_2643_A_Brahman_Bull.jpg',
    place: 'Australia',
  },
  'maize-silage': {
    alt: { en: 'A handful of chopped corn silage', fil: 'Isang dakot ng tinadtad na corn silage' },
    author: 'Tractorboy60',
    license: 'Public domain',
    source: 'https://commons.wikimedia.org/wiki/File:Maize_silage.JPG',
    place: 'United Kingdom',
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof PHOTOS;

/** Cover photo for each guide (by slug). */
export const GUIDE_COVERS: Record<string, PhotoKey> = {
  'getting-started': 'farm-borongan',
  breeds: 'brahman-taal',
  fattening: 'cow-bohol-tethered',
  feeding: 'farmers-rice-straw',
  health: 'brahman-drinking',
  business: 'brahman-bulls-paddock',
  markets: 'kabakahan-arch',
  support: 'farmer-bohol',
  paiwi: 'native-cow',
  housing: 'brahman-grey-bull',
  weighing: 'hero-brahman-lipa',
  silage: 'maize-silage',
  'heat-stress': 'cow-catanduanes',
};

export function photoSrc(key: PhotoKey, width: 800 | 1600 = 800): string {
  return `/images/photos/${key}-${width}.webp`;
}
