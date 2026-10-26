import { Category } from './Category';
import { Documents } from './Documents';
import { Events } from './Events';
import { Images } from './Images';

export function SubscriptionsCategory() {
  return (
    <Category header={<h2>Subscriptions</h2>}>
      <Documents />
      <Events />
      <Images />
    </Category>
  );
}
