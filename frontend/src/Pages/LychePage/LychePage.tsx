import { useEffect, useState } from 'react';
import { getMenus, getVenues } from '~/api';
import { MenuDto, VenueDto } from '~/dto';

/**
 * Page to render all components for easy overview and debug purposes.
 * Useful when styling global themes.
 */
export function LychePage() {
  const [lycheVenue, setLycheVenue] = useState<VenueDto>();
  const [lycheMenu, setLycheMenu] = useState<MenuDto>();

  // Stuff to do on first render.
  useEffect(() => {
    getVenues()
      .then((data) => {
        const lyche = data.find((venue) => venue.name?.toLowerCase() === 'lyche');
        setLycheVenue(lyche);
      })
      .catch(console.error);
    getMenus()
      .then((data) => {
        const menu = data.find((menu) => menu.name_no?.toLowerCase() === 'lyche');
        setLycheMenu(menu);
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <h1>Lyche</h1>

      <div>
        {lycheMenu?.menu_items?.map((item, i) => {
          return (
            <div key={i}>
              <div>{item.name_no}</div>
              <div>{item.description_no}</div>
              <div>{item.order}</div>
              <div>
                {item.price}/{item.price_member}
              </div>
            </div>
          );
        })}
      </div>

      <div>
        Monday: {lycheVenue?.opening_monday} - {lycheVenue?.closing_monday}
      </div>
      <div>
        Tuesday: {lycheVenue?.opening_tuesday} - {lycheVenue?.closing_tuesday}
      </div>
      <div>
        Wednesday: {lycheVenue?.opening_wednesday} - {lycheVenue?.closing_wednesday}
      </div>
      <div>
        Thursday: {lycheVenue?.opening_thursday} - {lycheVenue?.closing_thursday}
      </div>
      <div>
        Friday: {lycheVenue?.opening_friday} - {lycheVenue?.closing_friday}
      </div>
      <div>
        Saturday: {lycheVenue?.opening_saturday} - {lycheVenue?.closing_saturday}
      </div>
      <div>
        Sunday: {lycheVenue?.opening_sunday} - {lycheVenue?.closing_sunday}
      </div>
    </>
  );
}
