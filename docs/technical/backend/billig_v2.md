# Billig Integration v2

In the words of a great visionary:
```
OMFG we are switching away from billig
Use what you've learnt from billig and find some experienced
pangs to help you out. Good luck!
```

As an experienced pang, I will try my best to conquer the task of defining the new Billig and what that entails for Samf4


## Usage
The new way we handle payment for events is through [Stripe](https://stripe.com/). They handle card data and payment; all we need to do is interact with their API.

The current implementation uses a form to send a POST request with the necessary values. Stripe handles the payment and reroutes back to samfundet.no where the ticket is shown.

The POST request is sent to three different URLs depending on the environment:
```
production: https://billettsalg.samfundet.no/pay
staging: https://billettsalg-staging.samfundet.no/pay
development*: http://localhost:4567/pay

*local is not set up for samf4
``` 

The request contains:
- Ticket group and amount (for example: member/not member)
- Ticket type (member-card/email)
- membercard or email

The current implemenation is found [here](https://github.com/Samfundet/Samfundet/blob/master/app/views/events/buy.html.haml)


Additionally, samfundet.no also handles showing the ticket after a successful purchase. Stripe reroutes to https://www.samfundet.no/arrangement/purchase_callback/:tickets where it gets the different ticket IDs and retrieves them from the database. The frontend allows the PDF to be downloaded.
