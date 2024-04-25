import { t } from 'i18next';
import { LycheFrame } from '~/Components/LycheFrame';
import { MenuItem } from '~/Components/MenuItem';
import { SultenPage } from '~/Components/SultenPage';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { lowerCapitalize } from '~/utils';

export function LycheMenuPage() {
  useTitle(lowerCapitalize(`${t(KEY.common_sulten)} ${t(KEY.common_menu)}`));
  return (
    <SultenPage>
      <LycheFrame>
        <MenuItem
          dishTitle="LYCHEBRØD"
          dishDescription="Serveres med en skål aioli på siden."
          allergens="Allergener: Gluten (hvete), sulfitt og egg (aioli)"
          price="19,- / 29,-"
        />

        <MenuItem
          dishTitle="LYCHESNITTER"
          dishDescription="Lychebrød med rødbethummus, ruccula, mango og pistou. "
          allergens="Allergener: Gluten (hvete), melk (pistou), sesam (hummus). Kan inneholde spor av peanøtter: hummus"
          price="40,- / 49,-"
        />

        <MenuItem
          dishTitle="LYCHEBURGER"
          dishDescription="Okse og n’duja kjøtt, servert med løkkompott, bacon,
          tomater, aioli, cheddar, salat og potet på siden.
            Burgeren kan serveres med glutenfritt brød, og kan serveres uten ost og pistou (melkeallergi)"
          allergens="Allergener: Egg, sennep, sulfitt. Det er svinekjøtt i selve burgerkaken. "
          recommendations="Baren anbefaler: Hacienda lopez De Haro (rød)"
          price="129,- / 154,-"
        />

        <MenuItem
          dishTitle="SOPPAI"
          dishDescription="Kremet soppai med feta, toppes med ruccula. Vegetar."
          allergens="Allergener: Melk og gluten"
          recommendations="Baren anbefaler: jue de vie"
          price="99,- / 119,-"
        />
      </LycheFrame>
    </SultenPage>
  );
}
