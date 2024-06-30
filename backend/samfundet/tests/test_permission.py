from __future__ import annotations

import pytest

from root.utils.permission_algorithm import Graph, PermissionDictionary


def test_graph_compute_permissions():
    # Setup graph and permissions data.
    graph_data = [
        [1, 0, 1, 0, 0],
        [0, 1, 1, 0, 1],
        [0, 0, 1, 1, 0],
        [0, 0, 0, 1, 0],
        [0, 0, 0, 0, 1],
    ]
    permissions_data = {
        'Ansatt': 'B',
        'Hest': 'A',
        'Mellomleder': 'C',
        'Sjef': 'D',
        'Baltazar': 'E',
    }

    # Create instances of Graph and Permissions
    p = PermissionDictionary(permissions_data)
    g = Graph(5, graph_data)

    # Compute permissions
    updated_permissions = g.compute_permissions(p)

    # Define expected results
    expected_permissions = {'Ansatt': 'B', 'Hest': 'A', 'Mellomleder': 'ABC', 'Sjef': 'ABCD', 'Baltazar': 'AE'}

    # Assertions to check the correctness of the permissions computation
    for key, value in expected_permissions.items():
        assert ''.join(sorted(updated_permissions.dict[key])) == value, f'Mismatch in permissions for {key}'

    expected_graph = [[1, 0, 1, 1, 0], [0, 1, 1, 1, 1], [0, 0, 1, 1, 0], [0, 0, 0, 1, 0], [0, 0, 0, 0, 1]]
    assert g.graph == expected_graph, 'Graph transitive closure incorrect'


if __name__ == '__main__':
    pytest.main()
