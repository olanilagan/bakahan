// Site-wide settings that are public anyway (they appear in the page HTML).

/**
 * Google AdSense publisher ID, e.g. 'ca-pub-1234567890123456'.
 * Leave empty until AdSense approves the site: ad slots then render nothing,
 * and /ads.txt says no ads are sold yet. After approval, paste the ID here,
 * add the ad unit IDs below, and redeploy.
 */
export const ADSENSE_CLIENT: string = '';

/** AdSense ad unit IDs ("data-ad-slot"), created in the AdSense dashboard. */
export const ADSENSE_SLOTS: { article: string; list: string } = {
  article: '', // below each guide
  list: '', // in the guide list and marketplace
};

export const CONTACT_EMAIL = 'inquiries@bakahan.com';
export const INVEST_EMAIL = 'invest@bakahan.com';
