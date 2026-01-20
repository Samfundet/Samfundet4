import axios from 'axios';
import { BACKEND_DOMAIN } from '~/constants';
import { ROUTES } from '~/routes';

export async function testBilligPurchase() {
  const url = BACKEND_DOMAIN + ROUTES.backend.samfundet__purchase;
  const testData = {
    event_id: 4518, // Replace with an actual event ID
    ticket_type: 'paper', // Replace with actual ticket type (paper or card)
    price_group_12737: 2, // 2 Member tickets
    price_group_12738: 1, // 1 Non-member ticket
    email: 'test@example.com',
    authenticity_token: 'UXdcCGgTIE8eMYsWAb56yPF4c5AX8wzn5qs7IE5qzgojzmB4q6TpndnEYvAZkWiv',
  };

  const response = await axios.post(url, testData, { withCredentials: true });

  if (response.data?.success) {
    // Create a form to submit to Billig's payment endpoint
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = response.data.payment_url;
    form.target = '_blank'; // Open in new tab

    // Add all form fields from the response
    for (const [key, value] of Object.entries(response.data.form_data)) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    }

    // Add the form to the document, submit it, and remove it
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    return response.data;
  }

  return response.data;
}
