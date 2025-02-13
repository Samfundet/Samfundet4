# Models

## Why doesn't Django register my model?

Our models are split into multiple files, but Django is only aware of the module `models` within an app.
It is therefore required that models are exposed in `samfundet.models.__init__.py`.

<br>
<br>

## Circular imports

We have experienced "circular imports" from time to time in our setup. Here is the proposed mitigation to this problem:
We recommend that all code within `samfundet/models/**` reference other Models directly through relative import to their respective file. All code outside of the module `samfundet.models` should import from `samfundet.models`.

Examples:

```py
# samfundet/test.py

from samfundet.models import User
```

```py
# samfundet/models/event.py

from .billig import BilligEvent
```

<br>
<br>
