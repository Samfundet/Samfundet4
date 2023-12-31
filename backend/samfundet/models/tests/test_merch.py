from samfundet.models.general import Merch, MerchVariation


def test_merch_stock(fixture_merch: Merch, fixture_merchvariation: MerchVariation):
    # Test for single
    assert fixture_merch.in_stock() == fixture_merchvariation.stock

    # test for an additional
    dup_merch_variation = fixture_merchvariation
    dup_merch_variation.pk = None
    dup_merch_variation.save()
    assert fixture_merch.in_stock() == (fixture_merchvariation.stock + dup_merch_variation.stock)
