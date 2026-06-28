import {initSiteFont} from '@site/src/theme/siteFont';
import {initSiteTheme} from '@site/src/theme/siteTheme';

if (typeof window !== 'undefined') {
  initSiteTheme();
  initSiteFont();
}
