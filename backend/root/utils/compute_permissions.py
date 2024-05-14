from __future__ import annotations


class Permissions:
    def __init__(self, dictionary: dict) -> None:
        self.dict = dictionary


class Graph:
    def __init__(self, vertices: list) -> None:
        self.V = vertices

    def printAdjMatrix(self, reach: list) -> None:
        print('Following matrix transitive closure of the given graph ')
        for i in range(self, reach):
            for j in range(self.V):
                if i == j:
                    print('%7d\t' % (1), end=' ')
                else:
                    print('%7d\t' % (reach[i][j]), end=' ')
            print()

    def compute_permissions(self, graph: Graph, permissions: Permissions) -> Permissions:
        reach = [i[:] for i in graph]
        index_array = permissions.get_index_array()

        for k in range(self.V):
            for i in range(self.V):
                for j in range(self.V):
                    reach[i][j] = reach[i][j] or (reach[i][k] and reach[k][j])
                    if reach[i][j] == 1:
                        permissions.set(
                            index_array[j],
                            permissions.get(j) + permissions[index_array[i]],
                        )

        self.printAdjMatrix(reach)
        print('')

        permissions.clean()
        print(permissions)

        return permissions
