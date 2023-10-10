import styles from './MenuItem.module.scss';

type MenuItemProps = {
  dishTitle: string;
  dishDescription: string;
  allergens?: string;
  recommendations?: string;
  price: string;
};

export function MenuItem({ dishTitle, dishDescription, allergens, recommendations, price }: MenuItemProps) {
  return (
    <div className={styles.menu_item}>
      <div className={styles.item_name}>
        {dishTitle}
        <div className={styles.item_price}> {price} </div>
      </div>
      <div className={styles.item_description}> {dishDescription} </div>
      <br></br>
      {allergens ? <div className={styles.item_allergens}> {allergens} </div> : <div></div>}
      <br></br>
      {recommendations ? <div className={styles.item_recommendations}> {recommendations} </div> : <div></div>}
    </div>
  );
}
