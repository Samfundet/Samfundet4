[**&larr; Back: Documentation Overview**](../../../README.md#documentation-overview)

# Links

We use o

React Router's <Link> directly.
For a same-origin URL, React Router navigates inside the app instead of loading the page from the server, so Apache never gets to send the request to Samf3.

Now that Samf4's links to Samf3 use the site's own domain, and in production where both apps share <www.samfundet.no>,
every such link breaks this way.

Our own Link component (Components/Link) already does the right thing for target="samf3" (a full page load),
but nothing stops code from bypassing it.

About 6 files import React Router's Link and about 30 raw <a href> exist.

1. Link component:
   - Add a download option.
   - Work out the target from the URL when none is given: the Samf3 domain → samf3, /… → frontend, anything else → external.
2. Move every usage over:
   - The 6 React Router Link imports (NavbarItem ×2, Button, SultenButton, SultenNavbar, IsfitNavbar).
   - The raw <a href>, grouped as: Samf3 pages, Samf4 pages, other sites, email, URLs from data, downloads.
   - The href="#" anchors in Navbar.tsx become <button>.

- target="external" opens a new tab, also for links that open in the same tab today.

- Fix the links rather than adding a 404 fallback that reloads unknown paths from the server. A fallback can't catch paths both apps have (e.g. /lyche), where React Router would show Samf4's page instead of Samf3's.

### CI pipeline

A script in the frontend lint job (also yarn lint:links).
It fails on Link imported from react-router/react-router-dom, or a raw <a in .tsx, outside Components/Link/Link.tsx.

CI should fail on a new direct React Router Link or raw <a>.
