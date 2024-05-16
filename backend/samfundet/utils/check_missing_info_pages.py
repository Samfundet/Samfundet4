from django.utils.text import slugify


def check_missing_pages(model, field_name='name'):
    """
    Helper function to check for missing info pages in a model.
    """
    missing_list = []
    for obj in model.objects.all():
        slug = slugify(getattr(obj, field_name))
        if not obj.info_page or obj.info_page.slug_field != slug:
            missing_list.append(slug)
    return missing_list


misc_list = [
    'aapningstider',
    'aldersgrenser',
    'annen-info',
    'ansatt-stab',
    'arrangementsbilder',
    'biblioteket'  # Is listed as venue in samf3, but not offical
    'billetter',
    'booking',
    'brukerveiledning',
    'diverse-informasjon',
    'fb-faq',
    'filmklubben',
    'gjenger',
    # --- TODO intern gangs --
    'gjengsekretariatet',
    'gjengsjefkollegiet',
    'gjengutvalget',
    'samfundets-byggekomite',
    'sikringskomiteen'
    # ---
    'historie',
    '_index',
    'intern-faq',
    'kontaktinfo',
    'kostymeutleie',
    'leie-eksternt',
    'leie-ksg',
    'leie-lokaler',
    'live',
    'markdown',
    'mazemap',
    'medlemskap',
    '_menu',
    'miljotiltak',
    'mistillit-info',
    'nybygg',
    'nybygg-arkiv',
    'nybygg-gammel',
    'organisasjon',
    'orvar',
    'oversiktskart',
    'personvern',
    'presse',
    'propheten',
    'quiz',
    'teknisk-informasjon',
    'tilrettelegging',
    'utleie',
    'valg',
]
